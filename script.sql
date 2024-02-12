CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE tipo_movimentacao AS ENUM ('c', 'd');

CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  limite INTEGER NOT NULL
);

CREATE TABLE transacoes (
  id  UUID PRIMARY KEY,
  id_cliente INTEGER NOT NULL,
  tipo tipo_movimentacao NOT NULL,
  valor INTEGER NOT NULL,
  descricao VARCHAR(10) NOT NULL,
  realizada_em TIMESTAMP NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  INSERT INTO clientes (nome, limite)
  VALUES
    ('o barato sai caro', 1000 * 100),
    ('zan corp ltda', 800 * 100),
    ('les cruders', 10000 * 100),
    ('padaria joia de cocaia', 100000 * 100),
    ('kid mais', 5000 * 100);
END; $$