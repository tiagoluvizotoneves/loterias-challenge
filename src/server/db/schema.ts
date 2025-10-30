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

export const posts = rybenaSchema.table("post", {
  id: pg.uuid().primaryKey().defaultRandom(),
  name: pg.varchar({ length: 256 }).notNull(),
  createdAt: pg
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: pg.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
});
