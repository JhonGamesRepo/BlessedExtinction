// =========================================================
//  Chat web ⇄ Telegram — Blessed Extinction
//  Cloudflare Worker + D1. Los secretos (token del bot, claves) viven como
//  "secrets" de Cloudflare: nunca en este código ni en la página.
//
//  POST /send      visitante → grupo de Telegram (el 1.er mensaje exige Turnstile)
//  GET  /poll      visitante ← respuestas de la banda
//  POST /vote      tienda: «Quiero que vuelva» → se guarda y avisa al grupo
//  POST /intent    tienda: el fan pulsó «Pedir por correo» o «Avísame» → aviso al grupo
//  POST /telegram  webhook de Telegram (verificado con WEBHOOK_SECRET)
//                  /votos y /pedidos en el grupo muestran los rankings
// =========================================================

const MAX_LEN = 1000;              // caracteres por mensaje
const SESSIONS_PER_IP_HOUR = 5;    // conversaciones nuevas por IP y hora
const MSGS_PER_5_MIN = 8;          // mensajes por conversación cada 5 minutos
const RETENTION_DAYS = 30;         // luego se borran solos (cron diario)
const VOTES_PER_IP_DAY = 20;       // votos de la tienda por IP y día
const VOTE_RETENTION_DAYS = 180;   // los votos cuentan (y se guardan) durante este tiempo
const SLUG = /^[a-z0-9-]{1,32}$/;  // data-product / data-variant de la página
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const INTENTS_PER_IP_HOUR = 10;    // avisos de pedido por IP y hora
const INTENT_REPEAT_MIN = 15;      // el mismo pedido del mismo navegador no se repite antes
const INTENT_RETENTION_DAYS = 30;  // historial de pedidos (para /pedidos)
// Nombre legible que manda la página («Camiseta Blessed Extinction · Logo azul · Talla M»):
// sólo letras, números, espacios, · y guiones, así no puede llevar enlaces
const LABEL = /^[\p{L}\p{N} ·-]{1,100}$/u;
const NAME_LEN = 40;               // caracteres del nombre del visitante
// Un color por conversación para distinguirlas de un vistazo en el grupo
const DOTS = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚪'];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Webhook de Telegram: no lleva CORS, sólo el encabezado secreto
    if (url.pathname === '/telegram' && request.method === 'POST') {
      if (!safeEqual(request.headers.get('X-Telegram-Bot-Api-Secret-Token') || '', env.WEBHOOK_SECRET)) {
        return new Response('forbidden', { status: 403 });
      }
      const update = await request.json().catch(() => null);
      if (update) ctx.waitUntil(onTelegram(update, env).catch((err) => console.error(err)));
      return new Response('ok');
    }

    // API del widget: sólo desde la página de la banda
    const origin = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).includes(origin);
    const cors = allowed ? {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    } : {};
    if (!allowed) return json({ error: 'origin' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    try {
      if (url.pathname === '/send' && request.method === 'POST') return json(await onSend(request, env), 200, cors);
      if (url.pathname === '/poll' && request.method === 'GET') return json(await onPoll(url, env), 200, cors);
      if (url.pathname === '/vote' && request.method === 'POST') return json(await onVote(request, env), 200, cors);
      if (url.pathname === '/intent' && request.method === 'POST') return json(await onIntent(request, env), 200, cors);
      return json({ error: 'not_found' }, 404, cors);
    } catch (err) {
      if (err instanceof ApiError) return json({ error: err.code }, err.status, cors);
      console.error(err);
      return json({ error: 'server' }, 500, cors);
    }
  },

  // Limpieza diaria: nada se guarda más de RETENTION_DAYS
  async scheduled(event, env) {
    const cutoff = Date.now() - RETENTION_DAYS * 86400e3;
    await env.DB.batch([
      env.DB.prepare('DELETE FROM messages WHERE ts < ?').bind(cutoff),
      env.DB.prepare('DELETE FROM tg_map WHERE ts < ?').bind(cutoff),
      env.DB.prepare('DELETE FROM sessions WHERE last < ?').bind(cutoff),
      env.DB.prepare('DELETE FROM votes WHERE ts < ?').bind(Date.now() - VOTE_RETENTION_DAYS * 86400e3),
      env.DB.prepare('DELETE FROM intents WHERE ts < ?').bind(Date.now() - INTENT_RETENTION_DAYS * 86400e3),
    ]);
  },
};

// ----- Visitante → Telegram -----
async function onSend(request, env) {
  const body = await request.json().catch(() => ({}));
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text || text.length > MAX_LEN) throw new ApiError('length', 400);
  const lang = body.lang === 'en' ? 'en' : 'es';
  const now = Date.now();

  let sid = typeof body.sid === 'string' ? body.sid : '';
  let session = sid ? await getSession(env, sid) : null;
  let isNew = false;

  if (!session) {
    // Conversación nueva: demostrar que es una persona (Turnstile) y limitar por IP
    const ip = request.headers.get('CF-Connecting-IP') || '';
    if (!(await verifyTurnstile(env, body.turnstile, ip))) throw new ApiError('captcha', 403);
    const ipHash = await sha256(`${env.WEBHOOK_SECRET}:${ip}`); // la IP no se guarda en claro
    const { n } = await env.DB.prepare('SELECT COUNT(*) AS n FROM sessions WHERE ip_hash = ? AND created > ?')
      .bind(ipHash, now - 3600e3).first();
    if (n >= SESSIONS_PER_IP_HOUR) throw new ApiError('rate', 429);

    // Número consecutivo de conversación (atómico) y nombre cifrado como los mensajes
    const name = cleanName(body.name) || 'Visitante';
    const { value: num } = await env.DB.prepare("UPDATE counters SET value = value + 1 WHERE name = 'visitor' RETURNING value").first();
    const enc = await encrypt(await aesKey(env), name);
    sid = randomToken(24);
    session = { id: await sha256(sid), short: randomToken(3).slice(0, 4), num, name };
    await env.DB.prepare('INSERT INTO sessions (id, short, num, name, name_iv, ip_hash, created, last) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(session.id, session.short, num, enc.body, enc.iv, ipHash, now, now).run();
    isNew = true;
  } else {
    const { n } = await env.DB.prepare("SELECT COUNT(*) AS n FROM messages WHERE sid = ? AND sender = 'me' AND ts > ?")
      .bind(session.id, now - 300e3).first();
    if (n >= MSGS_PER_5_MIN) throw new ApiError('rate', 429);
  }

  // Al grupo de la banda como texto plano (sin parse_mode: nada de lo que escribe el visitante
  // se interpreta como formato). Sólo el encabezado va en negrita, marcado con "entities".
  const header = `${sessionTag(session)}${isNew ? ` · 🆕 nueva conversación · ${lang.toUpperCase()}` : ''}`;
  const sent = await tg(env, 'sendMessage', {
    chat_id: env.CHAT_ID,
    text: `${header}\n${text}`,
    entities: [{ type: 'bold', offset: 0, length: header.length }],
  });
  if (!sent.ok) throw new ApiError('telegram', 502);

  const id = await storeMessage(env, session.id, 'me', null, text, now);
  await env.DB.batch([
    env.DB.prepare('INSERT INTO tg_map (tg_id, sid, ts) VALUES (?, ?, ?)').bind(sent.result.message_id, session.id, now),
    env.DB.prepare('UPDATE sessions SET last = ? WHERE id = ?').bind(now, session.id),
  ]);
  return { sid, id, ts: now };
}

// ----- Visitante ← respuestas -----
async function onPoll(url, env) {
  const sid = url.searchParams.get('sid') || '';
  const after = Math.max(0, Number(url.searchParams.get('after')) || 0);
  const session = sid ? await getSession(env, sid) : null;
  if (!session) throw new ApiError('session', 404);

  const { results } = await env.DB.prepare(
    'SELECT id, sender, name, body, iv, ts FROM messages WHERE sid = ? AND id > ? ORDER BY id LIMIT 50'
  ).bind(session.id, after).all();
  const key = await aesKey(env);
  const messages = await Promise.all(results.map(async (m) => ({
    id: m.id,
    from: m.sender,
    name: m.name,
    text: await decrypt(key, m.body, m.iv),
    ts: m.ts,
  })));
  return { messages };
}

// ----- Tienda: «Quiero que vuelva» -----
// Sin captcha para no frenar al fan: un voto por producto y navegador, y un tope por IP.
// Sólo se aceptan identificadores cortos (minúsculas, números, guiones) y tallas conocidas,
// así nadie puede usar el voto para mandar texto libre al grupo.
async function onVote(request, env) {
  const body = await request.json().catch(() => ({}));
  const product = typeof body.product === 'string' ? body.product : '';
  const variant = typeof body.variant === 'string' ? body.variant : '';
  const size = typeof body.size === 'string' ? body.size : '';
  const voter = typeof body.voter === 'string' ? body.voter : '';
  if (!SLUG.test(product) || (variant && !SLUG.test(variant)) || (size && !SIZES.includes(size))) throw new ApiError('item', 400);
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(voter)) throw new ApiError('voter', 400);
  const lang = body.lang === 'en' ? 'en' : 'es';
  const item = variant ? `${product}/${variant}` : product;
  const now = Date.now();

  const ip = request.headers.get('CF-Connecting-IP') || '';
  const ipHash = await sha256(`${env.WEBHOOK_SECRET}:${ip}`); // la IP no se guarda en claro
  const { n: recent } = await env.DB.prepare('SELECT COUNT(*) AS n FROM votes WHERE ip_hash = ? AND ts > ?')
    .bind(ipHash, now - 86400e3).first();
  if (recent >= VOTES_PER_IP_DAY) throw new ApiError('rate', 429);

  const res = await env.DB.prepare('INSERT OR IGNORE INTO votes (item, size, voter, ip_hash, ts) VALUES (?, ?, ?, ?, ?)')
    .bind(item, size || null, await sha256(voter), ipHash, now).run();
  if (!res.meta.changes) return { ok: true, already: true }; // ya había votado: no se avisa otra vez

  const { total, sameSize } = await env.DB.prepare(
    'SELECT COUNT(*) AS total, SUM(size IS ?) AS sameSize FROM votes WHERE item = ?'
  ).bind(size || null, item).first();
  const header = '🗳️ Quieren que vuelva';
  const lines = [
    `${item}${size ? ` · talla ${size}` : ''}`,
    `Votos: ${total}${size ? ` (${sameSize} en talla ${size})` : ''} · ${lang.toUpperCase()}`,
    '/votos → ranking',
  ];
  // Si Telegram falla el voto queda guardado igual (sale en /votos)
  await tg(env, 'sendMessage', {
    chat_id: env.CHAT_ID,
    text: `${header}\n${lines.join('\n')}`,
    entities: [{ type: 'bold', offset: 0, length: header.length }],
  }).catch((err) => console.error(err));
  return { ok: true };
}

// ----- Tienda: pedido por correo iniciado -----
// La página avisa al pulsar «Pedir por correo» / «Avísame por correo». Es un aviso de
// intención: el correo puede no llegar si el fan no lo envía.
async function onIntent(request, env) {
  const body = await request.json().catch(() => ({}));
  const kind = body.kind === 'notify' ? 'notify' : 'order';
  const product = typeof body.product === 'string' ? body.product : '';
  const variant = typeof body.variant === 'string' ? body.variant : '';
  const size = typeof body.size === 'string' ? body.size : '';
  const voter = typeof body.voter === 'string' ? body.voter : '';
  const label = typeof body.label === 'string' ? body.label.trim() : '';
  if (!SLUG.test(product) || (variant && !SLUG.test(variant)) || (size && !SIZES.includes(size))) throw new ApiError('item', 400);
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(voter)) throw new ApiError('voter', 400);
  const lang = body.lang === 'en' ? 'en' : 'es';
  const item = variant ? `${product}/${variant}` : product;
  const now = Date.now();

  const ip = request.headers.get('CF-Connecting-IP') || '';
  const ipHash = await sha256(`${env.WEBHOOK_SECRET}:${ip}`); // la IP no se guarda en claro
  const voterHash = await sha256(voter);
  const { perIp, repeated } = await env.DB.prepare(
    'SELECT SUM(ip_hash = ? AND ts > ?) AS perIp, SUM(voter = ? AND item = ? AND kind = ? AND IFNULL(size, \'\') = ? AND ts > ?) AS repeated FROM intents WHERE ts > ?'
  ).bind(ipHash, now - 3600e3, voterHash, item, kind, size, now - INTENT_REPEAT_MIN * 60e3, now - 3600e3).first();
  if (repeated) return { ok: true, repeated: true }; // doble clic o volvió a pulsar: no se avisa otra vez
  if (perIp >= INTENTS_PER_IP_HOUR) throw new ApiError('rate', 429);

  await env.DB.prepare('INSERT INTO intents (kind, item, size, voter, ip_hash, ts) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(kind, item, size || null, voterHash, ipHash, now).run();
  const { today } = await env.DB.prepare('SELECT COUNT(*) AS today FROM intents WHERE kind = ? AND ts > ?')
    .bind(kind, startOfDayBogota(now)).first();

  const header = kind === 'notify' ? '🔔 Piden aviso cuando vuelva' : '🛒 Pedido de merch por correo';
  const lines = [
    LABEL.test(label) ? label : item,
    `${item}${size ? ` · talla ${size}` : ''} · ${lang.toUpperCase()}`,
    '',
    kind === 'notify'
      ? 'Abrió su correo para pedir que le avisen. Revisa Gmail y guarda su dirección.'
      : 'Abrió su correo para hacer el pedido. Revisa Gmail en unos minutos: si no llega, no lo envió.',
    `${kind === 'notify' ? 'Avisos' : 'Pedidos'} de hoy: ${today} · /pedidos → ranking`,
  ];
  await tg(env, 'sendMessage', {
    chat_id: env.CHAT_ID,
    text: `${header}\n${lines.join('\n')}`,
    entities: [{ type: 'bold', offset: 0, length: header.length }],
  }).catch((err) => console.error(err));
  return { ok: true };
}

// Medianoche de hoy en Bogotá (UTC-5, sin horario de verano)
function startOfDayBogota(now) {
  const offset = 5 * 3600e3;
  return Math.floor((now - offset) / 86400e3) * 86400e3 + offset;
}

// Ranking de pedidos por correo iniciados en la página
async function intentsReport(env) {
  const { results } = await env.DB.prepare(
    'SELECT kind, item, size, COUNT(*) AS n FROM intents GROUP BY kind, item, size'
  ).all();
  if (!results.length) return `🛒 Aún no hay pedidos por correo (últimos ${INTENT_RETENTION_DAYS} días).`;
  const section = (kind, title) => {
    const items = new Map();
    for (const r of results.filter((x) => x.kind === kind)) {
      const row = items.get(r.item) || { total: 0, sizes: [] };
      row.total += r.n;
      row.sizes.push([r.size || 'sin talla', r.n]);
      items.set(r.item, row);
    }
    if (!items.size) return '';
    const lines = [...items]
      .sort((a, b) => b[1].total - a[1].total)
      .map(([item, { total, sizes }], k) => `${k + 1}. ${item} — ${total} (${sizes.sort((a, b) => b[1] - a[1]).map(([s, n]) => `${s}×${n}`).join(', ')})`);
    return `${title}\n${lines.join('\n')}`;
  };
  const parts = [section('order', '🛒 Pedidos'), section('notify', '🔔 Piden aviso')].filter(Boolean);
  return `Pedidos por correo iniciados (últimos ${INTENT_RETENTION_DAYS} días)\n\n${parts.join('\n\n')}`;
}

// Ranking para el grupo: productos más pedidos y el reparto por talla
async function votesReport(env) {
  const { results } = await env.DB.prepare(
    'SELECT item, size, COUNT(*) AS n FROM votes GROUP BY item, size'
  ).all();
  if (!results.length) return '🗳️ Aún no hay votos de «Quiero que vuelva».';
  const items = new Map();
  for (const { item, size, n } of results) {
    const row = items.get(item) || { total: 0, sizes: [] };
    row.total += n;
    row.sizes.push([size || 'sin talla', n]);
    items.set(item, row);
  }
  const lines = [...items]
    .sort((a, b) => b[1].total - a[1].total)
    .map(([item, { total, sizes }], k) => {
      const detail = sizes.sort((a, b) => b[1] - a[1]).map(([s, n]) => `${s}×${n}`).join(', ');
      return `${k + 1}. ${item} — ${total} (${detail})`;
    });
  return `🗳️ Quieren que vuelva (últimos ${VOTE_RETENTION_DAYS} días)\n\n${lines.join('\n')}`;
}

// ----- Telegram → visitante -----
async function onTelegram(update, env) {
  const msg = update.message;
  if (!msg || msg.from?.is_bot) return;

  // Ayuda para la configuración: /id responde con el chat_id de este grupo
  if (msg.text === '/id' || msg.text?.startsWith('/id@')) {
    await tg(env, 'sendMessage', { chat_id: msg.chat.id, text: `chat_id: ${msg.chat.id}` });
    return;
  }
  if (String(msg.chat.id) !== String(env.CHAT_ID)) return; // sólo el grupo de la banda

  if (msg.text === '/votos' || msg.text?.startsWith('/votos@')) {
    await tg(env, 'sendMessage', { chat_id: msg.chat.id, text: await votesReport(env) });
    return;
  }
  if (msg.text === '/pedidos' || msg.text?.startsWith('/pedidos@')) {
    await tg(env, 'sendMessage', { chat_id: msg.chat.id, text: await intentsReport(env) });
    return;
  }

  const replyTo = msg.reply_to_message?.message_id;
  const row = replyTo ? await env.DB.prepare('SELECT sid FROM tg_map WHERE tg_id = ?').bind(replyTo).first() : null;

  if (!row) {
    // Mensaje suelto en el grupo: recordar cómo se responde
    if (msg.text && !msg.text.startsWith('/')) {
      await tg(env, 'sendMessage', {
        chat_id: msg.chat.id,
        reply_parameters: { message_id: msg.message_id },
        text: 'ℹ️ Para responder a un visitante usa «Responder» sobre su mensaje. Esto no se envió a nadie.',
      });
    }
    return;
  }
  if (!msg.text) {
    await tg(env, 'sendMessage', {
      chat_id: msg.chat.id,
      reply_parameters: { message_id: msg.message_id },
      text: '⚠️ Sólo se envían respuestas de texto.',
    });
    return;
  }

  const now = Date.now();
  const text = msg.text.slice(0, 4000);
  const name = env.SHOW_MEMBER_NAME === 'true' ? (msg.from?.first_name || '').slice(0, 40) : null;
  await storeMessage(env, row.sid, 'band', name, text, now);
  await env.DB.batch([
    // Responder a esta respuesta también llega al mismo visitante
    env.DB.prepare('INSERT OR IGNORE INTO tg_map (tg_id, sid, ts) VALUES (?, ?, ?)').bind(msg.message_id, row.sid, now),
    env.DB.prepare('UPDATE sessions SET last = ? WHERE id = ?').bind(now, row.sid),
  ]);
  // Confirmación discreta en Telegram: la respuesta salió hacia la web
  await tg(env, 'setMessageReaction', {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    reaction: [{ type: 'emoji', emoji: '👍' }],
  }).catch(() => {});
}

// ----- Almacenamiento (texto cifrado con AES-GCM antes de guardarlo) -----
async function getSession(env, sid) {
  if (!/^[A-Za-z0-9_-]{32}$/.test(sid)) return null;
  const row = await env.DB.prepare('SELECT id, short, num, name, name_iv FROM sessions WHERE id = ?').bind(await sha256(sid)).first();
  if (!row) return null;
  const name = row.name ? await decrypt(await aesKey(env), row.name, row.name_iv) : null;
  return { id: row.id, short: row.short, num: row.num, name };
}

// "🟢 #12 · Carlos" (las conversaciones anteriores a los nombres conservan su "#a3f9")
function sessionTag({ num, name, short }) {
  if (!num) return `💬 #${short} · ${name || 'Visitante'}`;
  return `${DOTS[(num - 1) % DOTS.length]} #${num} · ${name || 'Visitante'}`;
}

// Nombre en una línea, sin caracteres de control y con longitud limitada
function cleanName(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/\p{C}/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, NAME_LEN);
}

async function storeMessage(env, sid, sender, name, text, ts) {
  const { body, iv } = await encrypt(await aesKey(env), text);
  const res = await env.DB.prepare('INSERT INTO messages (sid, sender, name, body, iv, ts) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(sid, sender, name, body, iv, ts).run();
  return res.meta.last_row_id;
}

let cachedKey = null;
async function aesKey(env) {
  cachedKey ??= await crypto.subtle.importKey('raw', b64decode(env.ENC_KEY), 'AES-GCM', false, ['encrypt', 'decrypt']);
  return cachedKey;
}

async function encrypt(key, text) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(text));
  return { body: b64encode(new Uint8Array(ct)), iv: b64encode(iv) };
}

async function decrypt(key, body, iv) {
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64decode(iv) }, key, b64decode(body));
  return new TextDecoder().decode(pt);
}

// ----- Utilidades -----
class ApiError extends Error {
  constructor(code, status) { super(code); this.code = code; this.status = status; }
}

async function verifyTurnstile(env, token, ip) {
  if (typeof token !== 'string' || !token) return false;
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));
  return data.success === true;
}

function tg(env, method, payload) {
  // TG_API sólo se define para pruebas locales (Telegram simulado)
  return fetch(`${env.TG_API || 'https://api.telegram.org'}/bot${env.BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((r) => r.json());
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });
}

function randomToken(bytes) {
  return b64encode(crypto.getRandomValues(new Uint8Array(bytes)), true);
}

async function sha256(text) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return b64encode(new Uint8Array(hash), true);
}

function safeEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function b64encode(bytes, urlSafe = false) {
  let s = btoa(String.fromCharCode(...bytes));
  if (urlSafe) s = s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return s;
}

function b64decode(s) {
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}
