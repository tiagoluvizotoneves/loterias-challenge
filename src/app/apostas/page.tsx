"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/trpc/react";
import { CalendarDays, Pencil, Trash2, User, Ticket } from "lucide-react";

type Aposta = {
  id: string;
  nomeApostador: string | null;
  numeros: number[];
  createdAt: Date;
  dataAposta: Date;
};

function Chip({ n }: { n: number }) {
  return (
    <span className="inline-grid size-8 place-items-center rounded-full bg-emerald-600/20 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-500/20">
      {String(n).padStart(2, "0")}
    </span>
  );
}

function getInitials(name: string): string {
  const parts = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2);
  return parts.map((p) => p[0]!.toUpperCase()).join("");
}

function ConfirmDialog({
  open,
  title,
  desc,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  desc?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="w-full max-w-sm rounded-xl bg-slate-900 p-5 text-white ring-1 ring-white/10">
        <h3 id="confirm-title" className="text-base font-semibold">
          {title}
        </h3>
        {desc ? <p className="mt-1 text-sm text-slate-300">{desc}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-md bg-white/10 px-3 py-1.5 text-sm ring-1 ring-white/10 hover:bg-white/15">
            Cancelar
          </button>
          <button onClick={onConfirm} className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold ring-1 ring-rose-500/30 hover:bg-rose-500">
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

function EditApostaModal({
  open,
  aposta,
  onClose,
}: {
  open: boolean;
  aposta: Aposta | null;
  onClose: () => void;
}) {
  const utils = api.useUtils();
  const [nome, setNome] = useState(aposta?.nomeApostador ?? "");
  const [nums, setNums] = useState<number[]>(aposta?.numeros ?? []);

  const update = api.apostas.update.useMutation({
    onSuccess: async () => {
      await utils.apostas.list.invalidate();
      onClose();
    },
  });

  // Sincroniza os campos quando abrir o modal ou quando mudar a aposta editada
  useEffect(() => {
    if (open && aposta) {
      setNome(aposta.nomeApostador ?? "");
      setNums(aposta.numeros ?? []);
    }
  }, [open, aposta]);

  const numbers = useMemo(() => Array.from({ length: 60 }, (_, i) => i + 1), []);
  const maxed = nums.length >= 6;

  function toggle(n: number) {
    setNums((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n);
      if (prev.length >= 6) return prev;
      return [...prev, n].sort((a, b) => a - b);
    });
  }

  function submit() {
    if (!aposta) return;
    if (nums.length !== 6 || update.isPending) return;
    const nomeApostador = nome.trim() ? nome.trim() : undefined;
    update.mutate({ id: aposta.id, nomeApostador, numeros: nums });
  }

  if (!open || !aposta) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 md:items-center" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between">
          <h2 id="edit-modal-title" className="text-lg font-semibold">
            Editar aposta — Mega-Sena
          </h2>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-sm text-slate-300 hover:bg-white/10">
            Fechar
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do apostador (opcional)"
            className="h-10 w-full rounded-md bg-white px-3 text-sm text-slate-900 ring-1 ring-slate-300/60 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          />
          <button
            onClick={submit}
            disabled={nums.length !== 6 || update.isPending}
            className="h-10 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white ring-1 ring-emerald-500/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {update.isPending ? "Salvando…" : "Salvar alterações"}
          </button>
        </div>
        {update.isError ? (
          <p className="mt-2 text-sm text-rose-300">{(update.error as any)?.message ?? "Não foi possível salvar. Tente novamente."}</p>
        ) : null}
        <div className="mt-6 rounded-xl bg-slate-100 p-4">
          <div className="grid grid-cols-8 gap-2 md:grid-cols-10">
            {numbers.map((n) => {
              const selected = nums.includes(n);
              const disabled = maxed && !selected;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => toggle(n)}
                  disabled={disabled}
                  className={`inline-grid size-10 place-items-center rounded-full text-sm font-semibold ring-1 transition ${
                    selected
                      ? "bg-emerald-600 text-white ring-emerald-500/40"
                      : disabled
                        ? "bg-white text-slate-900 ring-slate-300/50 opacity-50 cursor-not-allowed"
                        : "bg-white text-slate-900 ring-slate-300/50 hover:bg-slate-50"
                  }`}
                >
                  {String(n).padStart(2, "0")}
                </button>
              );
            })}
          </div>
          <div className="mt-3 text-sm text-slate-700">
            Selecionados: {nums.map((n) => String(n).padStart(2, "0")).join(" · ") || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MinhasApostasPage() {
  const utils = api.useUtils();
  const { data, isLoading } = api.apostas.list.useQuery();
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Aposta | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [queryNome, setQueryNome] = useState("");
  const [queryData, setQueryData] = useState("");

  const del = api.apostas.delete.useMutation({
    onSuccess: async () => {
      await utils.apostas.list.invalidate();
      setConfirmOpen(false);
      setDeletingId(null);
    },
  });

  function onEdit(a: any) {
    setEditing({
      id: a.id,
      nomeApostador: a.nomeApostador ?? a.nome_apostador ?? null,
      numeros: a.numeros ?? [],
      createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
      dataAposta: a.dataAposta ? new Date(a.dataAposta) : new Date(a.data_aposta ?? Date.now()),
    });
    setEditOpen(true);
  }

  function onDelete(a: any) {
    setDeletingId(a.id);
    setConfirmOpen(true);
  }

  const listRaw = data ?? [];
  const list = useMemo(() => {
    let arr = [...listRaw];
    if (queryNome.trim()) {
      const q = queryNome.trim().toLowerCase();
      arr = arr.filter((x: any) => (x.nomeApostador ?? x.nome_apostador ?? "").toLowerCase().includes(q));
    }
    if (queryData) {
      arr = arr.filter((x: any) => new Date(x.dataAposta ?? x.data_aposta).toISOString().slice(0, 10) === queryData);
    }
    return arr;
  }, [listRaw, queryNome, queryData]);

  const total = listRaw.length;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:px-6">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 p-6 ring-1 ring-white/10">
        <div className="relative z-10">
          <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-xs text-white ring-1 ring-white/20">Minhas apostas</span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">Acompanhe suas combinações favoritas</h1>
          <p className="mt-1 text-sm text-emerald-100">Edite, exclua e filtre suas apostas Mega-Sena com conforto.</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-100/90">
            <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 ring-1 ring-white/15"><Ticket size={14} aria-hidden /> {total} aposta(s)</span>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 size-40 rounded-full bg-white/10 blur-3xl" />
      </section>

      {/* Filtros */}
      <form onSubmit={(e) => e.preventDefault()} className="mt-5 grid gap-3 md:grid-cols-[minmax(220px,1fr)_160px_auto]">
        <div className="relative">
          <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            value={queryNome}
            onChange={(e) => setQueryNome(e.target.value)}
            placeholder="Nome do apostador"
            className="h-10 w-full rounded-md bg-white/5 pl-9 pr-3 text-sm text-white ring-1 ring-white/10 ring-inset placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          />
        </div>
        <div className="relative">
          <CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="date"
            value={queryData}
            onChange={(e) => setQueryData(e.target.value)}
            className="h-10 w-full rounded-md bg-white/5 pl-9 pr-3 text-sm text-white ring-1 ring-white/10 ring-inset focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setQueryNome(""); setQueryData(""); }} className="h-10 w-full rounded-md bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/10 ring-inset hover:bg-white/15">
            Limpar
          </button>
        </div>
      </form>

      {/* Lista */}
      {isLoading ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-white/5 ring-1 ring-white/10" />
          ))}
        </div>
      ) : list.length > 0 ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((a: any) => (
            <article key={a.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-5 shadow-sm ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-emerald-500/5 blur-2xl transition group-hover:blur-3xl" />
              <header className="mb-3 space-y-1">
                <time className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300 ring-1 ring-white/10">
                  <CalendarDays size={14} aria-hidden />
                  {new Date(a.dataAposta ?? a.data_aposta).toLocaleDateString("pt-BR")}
                </time>
                <div className="flex items-center gap-2">
                  <span className="inline-grid size-7 place-items-center rounded-full bg-emerald-600 text-white ring-1 ring-emerald-500/40">
                    {(a.nomeApostador ?? a.nome_apostador)
                      ? <span className="text-[10px] font-bold leading-none">{getInitials((a.nomeApostador ?? a.nome_apostador) as string)}</span>
                      : <User size={12} aria-hidden />}
                  </span>
                  <h3 className="max-w-[75%] truncate text-lg font-semibold">
                    {(a.nomeApostador ?? a.nome_apostador) ?? "—"}
                  </h3>
                </div>
              </header>
              <div className="flex flex-wrap gap-2">
                {(a.numeros ?? []).map((n: number, i: number) => (
                  <Chip key={`${n}-${i}`} n={n} />
                ))}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => onEdit(a)} className="inline-flex items-center gap-1 rounded-md bg-white/10 px-3 py-1.5 text-xs text-slate-300 ring-1 ring-white/10 transition hover:bg-white/15">
                  <Pencil size={14} aria-hidden /> Editar
                </button>
                <button onClick={() => onDelete(a)} className="inline-flex items-center gap-1 rounded-md bg-rose-600/10 px-3 py-1.5 text-xs text-rose-300 ring-1 ring-rose-500/20 transition hover:bg-rose-600/20">
                  <Trash2 size={14} aria-hidden /> Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid min-h-[220px] place-items-center text-slate-400">
          <div className="flex flex-col items-center gap-3">
            <span className="text-5xl" aria-hidden>📝</span>
            <p className="text-center text-sm md:text-base">Nenhuma aposta registrada ainda.</p>
          </div>
        </div>
      )}

      <EditApostaModal open={editOpen} aposta={editing} onClose={() => setEditOpen(false)} />
      <ConfirmDialog
        open={confirmOpen}
        title="Excluir aposta?"
        desc="Esta ação não pode ser desfeita."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => deletingId && del.mutate({ id: deletingId })}
      />
    </div>
  );
}


