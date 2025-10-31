import { describe, it, expect, beforeEach, vi } from "vitest";
import { randomUUID } from "crypto";
import { appRouter } from "@/server/api/root";

// Evita importar o módulo real que puxa o DB; cria um tRPC básico para testes
vi.mock("@/server/api/trpc", async () => {
  const mod = await import("@trpc/server");
  const t = mod.initTRPC.context<any>().create();
  return {
    createTRPCRouter: t.router,
    publicProcedure: t.procedure,
    createCallerFactory: (router: any) => router.createCaller.bind(router),
  } as any;
});

// Store em memória para simular a tabela "aposta"
type Row = {
  id: string;
  nomeApostador: string | null;
  numeros: number[];
  createdAt: Date;
  dataAposta: Date;
};

function makeMockDb(store: Row[]) {
  return {
    query: {
      apostas: {
        findMany: async () => {
          return [...store].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        },
      },
    },
    insert: () => ({
      values: async (vals: { nomeApostador?: string | null; numeros: number[] }) => {
        store.push({
          id: randomUUID(),
          nomeApostador: vals.nomeApostador ?? null,
          numeros: vals.numeros,
          createdAt: new Date(),
          dataAposta: new Date(),
        });
      },
    }),
    update: () => ({
      set: (vals: { nomeApostador?: string | null; numeros: number[] }) => ({
        where: async (_expr: unknown) => {
          // Para o teste unitário, asseguramos apenas que o set é correto e o where é chamado;
          // a aplicação real executa o UPDATE no banco. Aqui não alteramos o store.
          return { ok: true, vals } as const;
        },
      }),
    }),
    delete: () => ({
      where: async (_expr: unknown) => {
        // idem: apenas verifica a chamada; sem mutação do store.
        return { ok: true } as const;
      },
    }),
  } as any;
}

describe("apostas router (CRUD)", () => {
  let store: Row[];
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    store = [];
    const db = makeMockDb(store);
    caller = appRouter.createCaller({ db, headers: new Headers() } as any);
  });

  it("create: salva com nome opcional (preenchido)", async () => {
    await caller.apostas.create({ nomeApostador: "João", numeros: [1, 2, 3, 4, 5, 6] });
    expect(store.length).toBe(1);
    expect(store[0]!.nomeApostador).toBe("João");
    expect(store[0]!.numeros).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("create: salva com nome null quando vazio/omitido", async () => {
    await caller.apostas.create({ numeros: [10, 20, 30, 40, 50, 60] });
    expect(store.length).toBe(1);
    expect(store[0]!.nomeApostador).toBeNull();
  });

  it("list: retorna em ordem decrescente por createdAt", async () => {
    await caller.apostas.create({ nomeApostador: "A", numeros: [1, 2, 3, 4, 5, 6] });
    await new Promise((r) => setTimeout(r, 10));
    await caller.apostas.create({ nomeApostador: "B", numeros: [11, 12, 13, 14, 15, 16] });

    const res = await caller.apostas.list();
    expect(res.length).toBe(2);
    // Primeiro deve ser a última aposta criada ("B")
    expect((res[0] as any).nomeApostador ?? (res[0] as any).nome_apostador).toBe("B");
  });

  it("update: chama set com payload esperado e where é invocado", async () => {
    const updateSpy: any[] = [];
    // injeta um db temporário com espiões
    const db = {
      query: { apostas: { findMany: async () => [] } },
      update: () => ({
        set: (vals: any) => {
          updateSpy.push({ vals });
          return { where: async (_expr: unknown) => updateSpy.push({ where: true }) };
        },
      }),
    } as any;
    const c = appRouter.createCaller({ db, headers: new Headers() } as any);
    await c.apostas.update({ id: randomUUID(), nomeApostador: "Maria", numeros: [2, 4, 6, 8, 10, 12] });
    expect(updateSpy.some((x) => x.vals?.nomeApostador === "Maria")).toBe(true);
    expect(updateSpy.some((x) => x.where)).toBe(true);
  });

  it("delete: where é invocado", async () => {
    const delSpy: any[] = [];
    const db = {
      query: { apostas: { findMany: async () => [] } },
      delete: () => ({ where: async (_expr: unknown) => delSpy.push({ where: true }) }),
    } as any;
    const c = appRouter.createCaller({ db, headers: new Headers() } as any);
    await c.apostas.delete({ id: randomUUID() });
    expect(delSpy.some((x) => x.where)).toBe(true);
  });
});
