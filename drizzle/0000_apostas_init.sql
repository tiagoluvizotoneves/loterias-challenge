CREATE EXTENSION IF NOT EXISTS pgcrypto;
--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "desafio-rybena-front";
--> statement-breakpoint
CREATE TABLE "desafio-rybena-front"."aposta" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "nome_apostador" varchar(256),
  "numeros" integer[] NOT NULL,
  "data_aposta" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone,
  -- Exactly 6 numbers per Mega-Sena bet; uniqueness enforced at app layer
  CONSTRAINT "aposta_numeros_six" CHECK (cardinality("numeros") = 6)
);

