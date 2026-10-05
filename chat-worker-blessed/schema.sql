-- Conversaciones: el id es el SHA-256 del identificador del visitante (nunca se guarda en claro)
CREATE TABLE IF NOT EXISTS sessions (
  id      TEXT PRIMARY KEY,
  short   TEXT NOT NULL,     -- etiqueta antigua (#a3f9), para conversaciones sin número
  num     INTEGER,           -- número consecutivo que ve la banda en Telegram (#12)
  name    TEXT,              -- nombre del visitante, cifrado con AES-GCM
  name_iv TEXT,
  ip_hash TEXT NOT NULL,     -- sólo para limitar abusos; la IP no se guarda
  created INTEGER NOT NULL,
  last    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_ip ON sessions (ip_hash, created);

-- Mensajes cifrados con AES-GCM (body + iv en base64)
CREATE TABLE IF NOT EXISTS messages (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  sid    TEXT NOT NULL,
  sender TEXT NOT NULL,      -- 'me' (visitante) | 'band'
  name   TEXT,
  body   TEXT NOT NULL,
  iv     TEXT NOT NULL,
  ts     INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_messages_sid ON messages (sid, id);
CREATE INDEX IF NOT EXISTS idx_messages_ts ON messages (ts);

-- Qué mensaje de Telegram pertenece a qué conversación (para enrutar las respuestas)
CREATE TABLE IF NOT EXISTS tg_map (
  tg_id INTEGER PRIMARY KEY,
  sid   TEXT NOT NULL,
  ts    INTEGER NOT NULL
);

-- Contador atómico para numerar las conversaciones (#1, #2, ...)
CREATE TABLE IF NOT EXISTS counters (
  name  TEXT PRIMARY KEY,
  value INTEGER NOT NULL
);
INSERT OR IGNORE INTO counters (name, value) VALUES ('visitor', 0);

-- Tienda: votos «Quiero que vuelva» (un voto por producto y navegador)
CREATE TABLE IF NOT EXISTS votes (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  item    TEXT NOT NULL,     -- producto o producto/variante, p. ej. camiseta/logo-rojo
  size    TEXT,              -- talla elegida al votar (opcional)
  voter   TEXT NOT NULL,     -- SHA-256 del identificador anónimo del navegador
  ip_hash TEXT NOT NULL,     -- sólo para limitar abusos; la IP no se guarda
  ts      INTEGER NOT NULL,
  UNIQUE (item, voter)       -- un voto por producto y navegador
);
CREATE INDEX IF NOT EXISTS idx_votes_ip ON votes (ip_hash, ts);
CREATE INDEX IF NOT EXISTS idx_votes_ts ON votes (ts);
