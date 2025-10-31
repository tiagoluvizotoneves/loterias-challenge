import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { apostas } from "@/server/db/schema";

const numerosSchema = z
  .array(z.number().int().min(1).max(60))
  .length(6, "Selecione exatamente 6 números")
  .refine((arr) => new Set(arr).size === 6, {
    message: "Os números não podem se repetir",
  });

export const apostasRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ query: z.string().optional() }).optional())
    .query(async ({ ctx }) => {
      return ctx.db.query.apostas.findMany({
        orderBy: (tbl, { desc }) => [desc(tbl.createdAt)],
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        nomeApostador: z.string().trim().min(1).optional(),
        numeros: numerosSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(apostas).values({
        nomeApostador: input.nomeApostador ?? null,
        numeros: input.numeros,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        nomeApostador: z.string().trim().min(1).optional(),
        numeros: numerosSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(apostas)
        .set({ nomeApostador: input.nomeApostador ?? null, numeros: input.numeros })
        .where(eq(apostas.id, input.id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(apostas).where(eq(apostas.id, input.id));
    }),
});


