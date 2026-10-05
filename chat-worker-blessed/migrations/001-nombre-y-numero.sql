-- Nombre del visitante y número consecutivo de conversación (para bases creadas antes)
ALTER TABLE sessions ADD COLUMN num INTEGER;
ALTER TABLE sessions ADD COLUMN name TEXT;
ALTER TABLE sessions ADD COLUMN name_iv TEXT;
CREATE TABLE IF NOT EXISTS counters (
  name  TEXT PRIMARY KEY,
  value INTEGER NOT NULL
);
INSERT OR IGNORE INTO counters (name, value) VALUES ('visitor', 0);
