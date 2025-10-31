"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

function NumberPill({ n, selected, onClick }: { n: number; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-grid size-10 place-items-center rounded-full text-sm font-semibold ring-1 transition ${
        selected ? "bg-emerald-600 text-white ring-emerald-500/40" : "bg-white/10 text-white ring-white/10 hover:bg-white/15"
      }`}
    >
      {String(n).padStart(2, "0")}
    </button>
  );
}

export default function NovaApostaModalPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [nums, setNums] = useState<number[]>([]);
  const create = api.apostas.create.useMutation({
    onSuccess: () => router.push("/apostas"),
  });

  const numbers = useMemo(() => Array.from({ length: 60 }, (_, i) => i + 1), []);
  const disabled = nums.length >= 6;

  function toggle(n: number) {
    setNums((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n);
      if (prev.length >= 6) return prev; // trava no 6º
      return [...prev, n].sort((a, b) => a - b);
    });
  }

  function submit() {
    if (nums.length !== 6) return;
    const nome_apostador = nome.trim() ? nome.trim() : undefined;
    create.mutate({ nome_apostador, numeros: nums });
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-lg font-semibold">Nova aposta — Mega-Sena</h1>
        <p className="mt-1 text-sm text-slate-300">Selecione exatamente 6 números.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do apostador"
            className="h-10 w-full rounded-md bg-white/10 px-3 text-sm text-white ring-1 ring-white/10 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          />
          <button
            onClick={submit}
            disabled={nums.length !== 6 || create.isPending}
            className="h-10 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white ring-1 ring-emerald-500/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {create.isPending ? "Salvando…" : "Salvar aposta"}
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-slate-100 p-4">
          <div className="grid grid-cols-8 gap-2 md:grid-cols-10">
            {numbers.map((n) => (
              <NumberPill key={n} n={n} selected={nums.includes(n)} onClick={() => toggle(n)} />
            ))}
          </div>
          <div className="mt-3 text-sm text-slate-700">
            Selecionados: {nums.map((n) => String(n).padStart(2, "0")).join(" · ") || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

// (sem segundo export default)


