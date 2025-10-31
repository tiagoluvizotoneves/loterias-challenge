"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { api } from "@/trpc/react";

function NumberPill({
  n,
  selected,
  disabled,
  onClick,
}: {
  n: number;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const base =
    "inline-grid size-10 place-items-center rounded-full text-sm font-semibold ring-1 transition";
  const classes = selected
    ? "bg-emerald-600 text-white ring-emerald-500/40"
    : disabled
      ? "bg-white text-slate-900 ring-slate-300/50 opacity-50 cursor-not-allowed"
      : "bg-white text-slate-900 ring-slate-300/50 hover:bg-slate-50";

  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-pressed={selected} className={`${base} ${classes}`}>
      {String(n).padStart(2, "0")}
    </button>
  );
}

export function ApostaModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [nome, setNome] = useState("");
  const [nums, setNums] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const create = api.apostas.create.useMutation({
    onSuccess: () => {
      setShowError(false);
      setErrorMsg("");
      setShowSuccess(true);
    },
    onError: (err) => {
      const msg = (err as unknown as { message?: string })?.message ?? "Falha ao salvar a aposta.";
      setErrorMsg(msg);
      setShowError(true);
    },
  });

  const numbers = useMemo(() => Array.from({ length: 60 }, (_, i) => i + 1), []);
  const maxed = nums.length >= 6;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  function toggle(n: number) {
    setNums((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n);
      if (prev.length >= 6) return prev;
      return [...prev, n].sort((a, b) => a - b);
    });
  }

  function submit() {
    if (nums.length !== 6 || create.isPending) return;
    const nomeApostador = nome.trim() ? nome.trim() : undefined;
    create.mutate({ nomeApostador, numeros: nums });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 md:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="aposta-modal-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl outline-none ring-1 ring-white/10"
      >
        {/* aria-live para leitores de tela */}
        <div className="sr-only" role="status" aria-live="assertive">
          {showSuccess ? "Aposta criada com sucesso." : showError ? `Erro: ${errorMsg}` : ""}
        </div>

        <div className="flex items-center justify-between">
          <h2 id="aposta-modal-title" className="text-lg font-semibold">
            Nova aposta — Mega-Sena
          </h2>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-sm text-slate-300 hover:bg-white/10">
            Fechar
          </button>
        </div>
        <p className="mt-1 text-sm text-slate-300">Selecione exatamente 6 números.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do apostador"
            className="h-10 w-full rounded-md bg-white px-3 text-sm text-slate-900 ring-1 ring-slate-300/60 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
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
            {numbers.map((n) => {
              const selected = nums.includes(n);
              const disabled = maxed && !selected;
              return (
                <NumberPill key={n} n={n} selected={selected} disabled={disabled} onClick={() => toggle(n)} />
              );
            })}
          </div>
          <div className="mt-3 text-sm text-slate-700">
            Selecionados: {nums.map((n) => String(n).padStart(2, "0")).join(" · ") || "—"}
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Para trocar, clique novamente em um número selecionado para desmarcar e então escolha outro.
        </p>

        {/* Dialog de sucesso */}
        {showSuccess ? (
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="aposta-success-title"
            className="absolute inset-0 grid place-items-center bg-black/40"
          >
            <div className="w-full max-w-sm rounded-xl bg-emerald-600 p-5 text-white shadow-xl ring-1 ring-emerald-300/30">
              <div className="grid place-items-center">
                <span className="inline-grid size-16 place-items-center rounded-full bg-white/15 ring-1 ring-white/20">
                  <CheckCircle2 size={40} aria-hidden />
                </span>
              </div>
              <h3 id="aposta-success-title" className="mt-3 text-center text-base font-semibold">
                Aposta criada com sucesso!
              </h3>
              <p className="mt-1 text-center text-sm opacity-90">Clique em OK para ver Minhas Apostas.</p>
              <div className="mt-4 text-right">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccess(false);
                    setNome("");
                    setNums([]);
                    onClose();
                    router.push("/apostas");
                  }}
                  className="rounded-md bg-white/15 px-3 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Dialog de erro */}
        {showError ? (
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="aposta-error-title"
            className="absolute inset-0 grid place-items-center bg-black/40"
          >
            <div className="w-full max-w-sm rounded-xl bg-rose-600 p-5 text-white shadow-xl ring-1 ring-rose-300/30">
              <div className="grid place-items-center">
                <span className="inline-grid size-16 place-items-center rounded-full bg-white/15 ring-1 ring-white/20">
                  <AlertTriangle size={40} aria-hidden />
                </span>
              </div>
              <h3 id="aposta-error-title" className="mt-3 text-center text-base font-semibold">
                Não foi possível salvar
              </h3>
              <p className="mt-1 text-center text-sm opacity-90">{errorMsg || "Tente novamente em instantes."}</p>
              <div className="mt-4 text-right">
                <button
                  type="button"
                  onClick={() => setShowError(false)}
                  className="rounded-md bg-white/15 px-3 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}


