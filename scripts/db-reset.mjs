import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL não definida");
    process.exit(1);
  }
  const sql = postgres(url, { max: 1 });
  try {
    // Remove schemas do projeto e do drizzle (se existirem)
    await sql`DROP SCHEMA IF EXISTS "desafio-rybena-front" CASCADE;`;
    await sql`DROP SCHEMA IF EXISTS drizzle CASCADE;`;
  } finally {
    await sql.end({ timeout: 1_000 });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
