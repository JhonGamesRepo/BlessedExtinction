// Telegram simulado para probar el chat en local, sin bot real.
//   node dev/mock-telegram.mjs
// Muestra en consola lo que el bot "envía" al grupo, con el número de cada mensaje.
// Para responder como la banda (como si usaras «Responder» en Telegram), abre:
//   http://127.0.0.1:8788/reply?text=Hola              → al último mensaje de visitante
//   http://127.0.0.1:8788/reply?to=503&text=Hola       → a un mensaje concreto
//   http://127.0.0.1:8788/messages                     → todo lo enviado al grupo (JSON)
// Requiere en .dev.vars: TG_API=http://127.0.0.1:8788, CHAT_ID=-100123 y el mismo WEBHOOK_SECRET.
import http from 'node:http';
import fs from 'node:fs';

const WORKER = 'http://127.0.0.1:8787';
const CHAT_ID = -100123;
const vars = Object.fromEntries(
  fs.readFileSync(new URL('../.dev.vars', import.meta.url), 'utf8')
    .split(/\r?\n/).filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)])
);

let nextId = 500;
let lastVisitorMsg = null;
const group = []; // mensajes que el bot publicó en el "grupo"

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');

  if (url.pathname === '/messages') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify(group, null, 2));
  }

  if (url.pathname === '/reply') {
    const text = url.searchParams.get('text') || '¡Hola! Te respondemos desde Telegram 🤘';
    const to = Number(url.searchParams.get('to')) || lastVisitorMsg;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    if (!to) return res.end('Aún no hay mensajes de visitantes.');
    const r = await fetch(`${WORKER}/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Telegram-Bot-Api-Secret-Token': vars.WEBHOOK_SECRET },
      body: JSON.stringify({ message: {
        message_id: nextId++, chat: { id: CHAT_ID }, from: { id: 1, first_name: 'Banda' }, text,
        reply_to_message: { message_id: to },
      } }),
    });
    return res.end(`Respuesta al mensaje ${to} (webhook ${r.status}): ${text}`);
  }

  let body = '';
  req.on('data', (c) => { body += c; });
  req.on('end', () => {
    const method = url.pathname.split('/').pop();
    const payload = JSON.parse(body || '{}');
    const message_id = nextId++;
    if (method === 'sendMessage') {
      if (!payload.reply_parameters) lastVisitorMsg = message_id;
      group.push({ message_id, text: payload.text, entities: payload.entities });
      console.log(`\n[grupo de Telegram · mensaje ${message_id}] ${payload.text}`);
    } else {
      console.log(`[${method}] ${JSON.stringify(payload.reaction || '')}`);
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, result: method === 'sendMessage' ? { message_id } : true }));
  });
}).listen(8788, '127.0.0.1', () => console.log('Telegram simulado en http://127.0.0.1:8788 — responde con /reply?to=<mensaje>&text=...'));
