import { z, ZodError } from "zod";

const BASE_URL = "https://loteriascaixa-api.herokuapp.com/api" as const;

export const PremiacaoSchema = z.object({
  descricao: z.string(),
  faixa: z.number(),
  ganhadores: z.number(),
  valorPremio: z.number(),
});

export const LocalGanhadorSchema = z.object({
  ganhadores: z.number().optional(),
  municipio: z.string().optional(),
  nomeFatansiaUL: z.string().optional(),
  posicao: z.number().optional(),
  serie: z.string().optional(),
  uf: z.string().optional(),
});

export const ResultadoSchema = z.object({
  loteria: z.string(),
  concurso: z.number(),
  data: z.string(), // dd/mm/yyyy
  dataProximoConcurso: z.string().optional(),
  dezenas: z.array(z.string()),
  dezenasOrdemSorteio: z.array(z.string()).optional(),
  trevos: z.array(z.string()).optional(),
  timeCoracao: z.string().nullable().optional(),
  mesSorte: z.string().nullable().optional(),
  premiacoes: z.array(PremiacaoSchema).optional(),
  estadosPremiados: z.array(z.any()).optional(),
  local: z.string().optional(),
  localGanhadores: z.array(LocalGanhadorSchema).optional(),
  observacao: z.string().optional(),
  acumulou: z.boolean(),
  proximoConcurso: z.number().optional(),
  valorArrecadado: z.number().optional(),
  valorAcumuladoConcurso_0_5: z.number().optional(),
  valorAcumuladoConcursoEspecial: z.number().optional(),
  valorAcumuladoProximoConcurso: z.number().optional(),
  valorEstimadoProximoConcurso: z.number().optional(),
});

export type Resultado = z.infer<typeof ResultadoSchema>;

function parseDateToISO(br: string): string {
  const [d, m, y] = br.split("/").map((s) => Number(s));
  if (!d || !m || !y) return br;
  const iso = new Date(y, m - 1, d).toISOString().slice(0, 10);
  return iso;
}

export function mapResultadoToInternal(r: Resultado) {
  return {
    loteria: r.loteria,
    concurso: r.concurso,
    dataISO: parseDateToISO(r.data),
    dezenas: r.dezenas.map((s) => Number(s)),
    acumulou: r.acumulou,
    ganhadoresFaixa1: r.premiacoes?.find((p) => p.faixa === 1)?.ganhadores,
    localGanhadores: r.localGanhadores?.map((l) => ({
      ganhadores: l.ganhadores,
      municipio: l.municipio,
      uf: l.uf,
    })),
  };
}

async function safeFetch<T>(url: string, schema: z.ZodType<T>): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error("[API] HTTP error", { url, status: res.status });
      throw new Error(`HTTP ${res.status}`);
    }
    const json: unknown = await res.json();
    try {
      const parsed = schema.parse(json);
      return parsed;
    } catch (e) {
      if (e instanceof ZodError) {
        console.error("[API] Zod parse error", { url, issues: e.issues });
      }
      throw e;
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getLatestResultado(loteria: string) {
  const data = await safeFetch(
    `${BASE_URL}/${loteria}/latest`,
    ResultadoSchema,
  );
  return mapResultadoToInternal(data);
}

export async function getAllResultados(loteria: string) {
  const arr = await safeFetch(
    `${BASE_URL}/${loteria}`,
    z.array(ResultadoSchema),
  );
  return arr.map(mapResultadoToInternal);
}

export async function getResultadoByConcurso(
  loteria: string,
  concurso: number,
) {
  const data = await safeFetch(
    `${BASE_URL}/${loteria}/${concurso}`,
    ResultadoSchema,
  );
  return mapResultadoToInternal(data);
}
