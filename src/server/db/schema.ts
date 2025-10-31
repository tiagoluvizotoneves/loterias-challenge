// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { pgSchema } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const rybenaSchema = pgSchema("desafio-rybena-front");

// Apostas (Mega-Sena)
export const apostas = rybenaSchema.table("aposta", {
  id: pg
    .uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  // Nome do apostador é opcional; salvaremos como null quando não informado
  nomeApostador: pg.varchar("nome_apostador", { length: 256 }),
  // Seis números escolhidos (validação na aplicação e por constraint na migration)
  numeros: pg.integer("numeros").array().notNull(),
  dataAposta: pg
    .timestamp("data_aposta", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  createdAt: pg
    .timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: pg
    .timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date()),
});
