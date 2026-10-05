-- Tienda: pedidos por correo iniciados en la página (para bases creadas antes)
CREATE TABLE IF NOT EXISTS intents (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  kind    TEXT NOT NULL,     -- 'order' (Pedir por correo) | 'notify' (Avísame por correo)
  item    TEXT NOT NULL,     -- producto o producto/variante, p. ej. camiseta/logo-azul
  size    TEXT,              -- talla elegida (opcional)
  voter   TEXT NOT NULL,     -- SHA-256 del identificador anónimo del navegador
  ip_hash TEXT NOT NULL,     -- sólo para limitar abusos; la IP no se guarda
  ts      INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_intents_ts ON intents (ts);
