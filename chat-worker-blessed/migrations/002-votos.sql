-- Tienda: votos «Quiero que vuelva» (para bases creadas antes de la tienda)
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
