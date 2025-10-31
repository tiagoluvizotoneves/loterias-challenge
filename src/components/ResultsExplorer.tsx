"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAllResultados,
  getLatestResultado,
  getResultadoByConcurso,
} from "@/lib/api/loterias";
import { LuFrown } from "react-icons/lu";
type ApiResult = Awaited<ReturnType<typeof getLatestResultado>>;
type ApiResultList = Awaited<ReturnType<typeof getAllResultados>>;

type LotteryId =
  | "maismilionaria"
  | "megasena"
  | "lotofacil"
  | "quina"
  | "lotomania"
  | "timemania"
  | "duplasena"
  | "federal"
  | "diadesorte"
  | "supersete";

type ResultData = {
  loteria: string;
  concurso: number;
  dataISO: string;
  dezenas: number[];
  acumulou: boolean;
  ganhadoresFaixa1?: number;
  localGanhadores?: Array<{
    ganhadores?: number;
    municipio?: string;
    uf?: string;
  }>;
};

const LOTTERY_META: Record<
  LotteryId,
  { name: string; color: string; ring: string; badge: string }
> = {
  maismilionaria: {
    name: "+Milionária",
    color: "bg-emerald-600",
    ring: "ring-emerald-500/30",
    badge: "bg-emerald-600/15 text-emerald-300",
  },
  megasena: {
    name: "Mega-Sena",
    color: "bg-emerald-600",
    ring: "ring-emerald-500/30",
    badge: "bg-emerald-600/15 text-emerald-300",
  },
  lotofacil: {
    name: "Lotofácil",
    color: "bg-pink-600",
    ring: "ring-pink-500/30",
    badge: "bg-pink-600/15 text-pink-300",
  },
  quina: {
    name: "Quina",
    color: "bg-violet-600",
    ring: "ring-violet-500/30",
    badge: "bg-violet-600/15 text-violet-300",
  },
  lotomania: {
    name: "Lotomania",
    color: "bg-amber-600",
    ring: "ring-amber-500/30",
    badge: "bg-amber-600/15 text-amber-300",
  },
  timemania: {
    name: "Timemania",
    color: "bg-lime-600",
    ring: "ring-lime-500/30",
    badge: "bg-lime-600/15 text-lime-300",
  },
  duplasena: {
    name: "Dupla Sena",
    color: "bg-rose-600",
    ring: "ring-rose-500/30",
    badge: "bg-rose-600/15 text-rose-300",
  },
  federal: {
    name: "Federal",
    color: "bg-cyan-600",
    ring: "ring-cyan-500/30",
    badge: "bg-cyan-600/15 text-cyan-300",
  },
  diadesorte: {
    name: "Dia de Sorte",
    color: "bg-yellow-600",
    ring: "ring-yellow-500/30",
    badge: "bg-yellow-600/15 text-yellow-300",
  },
  supersete: {
    name: "Super Sete",
    color: "bg-teal-600",
    ring: "ring-teal-500/30",
    badge: "bg-teal-600/15 text-teal-300",
  },
};

const TABS_ORDER: LotteryId[] = [
  "megasena",
  "lotofacil",
  "quina",
  "lotomania",
  "timemania",
  "duplasena",
  "federal",
  "diadesorte",
  "supersete",
  "maismilionaria",
];

// mocks removidos — dados agora vêm da API pública

function formatDateBR(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(d);
  } catch {
    return iso;
  }
}

function formatDateBRShort(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
}

function NumberBall({
  value,
  active,
  accent,
}: {
  value: number;
  active: boolean;
  accent: string;
}) {
  const base =
    "inline-grid size-10 place-items-center rounded-full text-sm font-semibold";
  const off = "bg-slate-200 text-slate-700";
  const on = `${accent} text-white ring-2 ring-white/80`;
  const label = `Número ${String(value).padStart(2, "0")} ${active ? "sorteado" : "não sorteado"}`;
  return (
    <span
      className={`${base} ${active ? on : off}`}
      aria-label={label}
      role="img"
    >
      {String(value).padStart(2, "0")}
    </span>
  );
}

function CompactBall({
  value,
  ringClass,
}: {
  value: number;
  ringClass: string;
}) {
  const label = `Número ${String(value).padStart(2, "0")} sorteado`;
  return (
    <span
      className={`inline-grid size-8 place-items-center rounded-full bg-white text-xs font-semibold text-slate-900 ring-1 ${ringClass}`}
      aria-label={label}
      role="img"
    >
      {String(value).padStart(2, "0")}
    </span>
  );
}

export default function ResultsExplorer() {
  const [selected, setSelected] = useState<LotteryId>("megasena");

  const tabList = useMemo(() => TABS_ORDER, []);
  const tabRefs = useRef<HTMLButtonElement[]>([]);
  const meta = LOTTERY_META[selected];
  const {
    data: latestData,
    isLoading: isLoadingLatest,
    isError: isErrorLatest,
  } = useQuery<ApiResult | undefined>({
    queryKey: ["loteriaLatest", selected],
    queryFn: () => getLatestResultado(selected),
  });
  const {
    data: allData,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useQuery<ApiResultList | undefined>({
    queryKey: ["loteriaAll", selected],
    queryFn: () => getAllResultados(selected),
  });
  const hasNoResults = (!latestData && (allData?.length ?? 0) === 0) || isErrorLatest || isErrorAll;
  const [current, setCurrent] = useState<ResultData | undefined>(latestData);
  const [searchConcurso, setSearchConcurso] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  // accent color handled via meta.color

  // Define universo visual de números (para cinza claro) com base na loteria
  const universe = useMemo(() => {
    if (selected === "lotofacil")
      return Array.from({ length: 25 }, (_, i) => i + 1);
    if (selected === "quina")
      return Array.from({ length: 80 }, (_, i) => i + 1);
    return Array.from({ length: 60 }, (_, i) => i + 1); // megasena e demais
  }, [selected]);

  const drawn = new Set((current?.dezenas ?? []).map((n) => n));
  const isAcumulado = !!current?.acumulou;

  useEffect(() => {
    setCurrent(latestData);
  }, [latestData, selected]);

  const lastFive = useMemo(() => {
    if (!allData || !current)
      return [] as Array<{
        num: number;
        dateISO: string;
        acumulou: boolean;
        ganhadoresFaixa1?: number;
      }>;
    const sorted = [...allData].sort((a, b) => b.concurso - a.concurso);
    const filtered = sorted.filter((r) => r.concurso < current.concurso);
    return filtered.slice(0, 5).map((r) => ({
      num: r.concurso,
      dateISO: r.dataISO,
      acumulou: r.acumulou,
      ganhadoresFaixa1: r.ganhadoresFaixa1,
    }));
  }, [allData, current]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsSearching(true);
      if (searchConcurso.trim()) {
        const num = Number(searchConcurso);
        if (!Number.isNaN(num) && num > 0) {
          const r = await getResultadoByConcurso(selected, num);
          setCurrent(r);
          return;
        }
      }
      if (searchDate && allData) {
        const match = allData.find((r) => r.dataISO === searchDate);
        if (match) setCurrent(match);
      }
    } finally {
      setIsSearching(false);
    }
  }

  function handleClear() {
    setSearchConcurso("");
    setSearchDate("");
    if (latestData) setCurrent(latestData);
  }

  function onKeyDownTab(
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const last = tabList.length - 1;
    let next = index;
    if (e.key === "ArrowDown" || e.key === "ArrowRight")
      next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
      next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    const normalized =
      ((next % tabList.length) + tabList.length) % tabList.length;
    const nextId = tabList[normalized]!;
    setSelected(nextId);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="grid auto-rows-min grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
      <aside className="md:sticky md:top-20">
        <nav
          className="flex gap-2 overflow-auto md:flex-col"
          role="tablist"
          aria-label="Loterias"
          aria-orientation="vertical"
        >
          {tabList.map((id, index) => {
            const m = LOTTERY_META[id];
            const isActive = id === selected;
            return (
              <button
                key={id}
                ref={(el) => {
                  if (el) tabRefs.current[index] = el;
                }}
                onClick={() => setSelected(id)}
                onKeyDown={(e) => onKeyDownTab(e, index)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${id}`}
                id={`tab-${id}`}
                tabIndex={isActive ? 0 : -1}
                className={`min-w-[150px] rounded-lg px-3 py-2 text-left text-sm font-semibold ring-1 transition focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${
                  isActive
                    ? `${m.color} text-white ${m.ring}`
                    : "bg-white/5 text-slate-200 ring-white/10"
                }`}
              >
                <span
                  className={`mr-2 align-middle text-[10px] ${m.badge} rounded px-1.5 py-0.5`}
                >
                  ●
                </span>
                {m.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Coluna direita: Filtros (topo) + Resultado (abaixo) */}
      <div className="flex flex-col gap-3 md:col-start-2">
        <form
          onSubmit={handleSearch}
          className="grid w-full grid-cols-2 items-center gap-2 md:grid-cols-[160px_160px_auto_auto] md:gap-3"
        >
          <input
            type="number"
            min={1}
            placeholder="Nº do concurso"
            value={searchConcurso}
            onChange={(e) => setSearchConcurso(e.target.value)}
            className="h-10 w-full rounded-md bg-white/5 px-3 text-sm text-white ring-1 ring-white/10 ring-inset placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="h-10 w-full rounded-md bg-white/5 px-3 text-sm text-white ring-1 ring-white/10 ring-inset focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="col-span-1 h-10 w-full rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm ring-1 ring-emerald-500/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSearching ? "Buscando..." : "Buscar"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="col-span-1 h-10 w-full rounded-md bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/10 ring-inset hover:bg-white/15"
          >
            Limpar
          </button>
        </form>

        <section
          className="w-full self-start rounded-2xl border border-white/10 bg-white/5 p-5"
          role="tabpanel"
          id={`panel-${selected}`}
          aria-labelledby={`tab-${selected}`}
        >
          <div className="sr-only" aria-live="polite" role="status">
            {isAcumulado
              ? "Resultado acumulado."
              : current?.ganhadoresFaixa1 && current.ganhadoresFaixa1 > 0
                ? `${current.ganhadoresFaixa1} ganhadores na faixa principal.`
                : "Sem ganhadores na faixa principal."}
          </div>
          {hasNoResults && !(isLoadingLatest || isLoadingAll) ? (
            <div className="grid min-h-[320px] place-items-center py-10 text-slate-400">
              <div className="flex flex-col items-center gap-3">
                <span aria-hidden="true" className="text-5xl md:text-6xl text-slate-300">
                  <LuFrown />
                </span>
                <p className="text-center text-sm md:text-base">
                  Em breve resultados desta loteria.
                </p>
              </div>
            </div>
          ) : isLoadingLatest || isLoadingAll ? (
            <div className="animate-pulse space-y-4">
              <header className="space-y-2">
                <div className="h-5 w-32 rounded bg-white/10" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-4 w-40 rounded bg-white/10" />
                  <div className="h-6 w-40 rounded bg-white/10" />
                </div>
              </header>
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="h-8 w-72 rounded bg-white/10" />
                <div className="mt-3 flex flex-wrap gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span
                      key={i}
                      className="inline-block h-8 w-8 rounded-full bg-white/10"
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                <div className="rounded-xl bg-slate-100 p-4">
                  <div className="grid grid-cols-8 gap-3 md:grid-cols-10 md:gap-2">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <span
                        key={i}
                        className="inline-block h-10 w-10 rounded-full bg-slate-200"
                      />
                    ))}
                  </div>
                </div>
                <aside className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-2 h-3 w-28 rounded bg-white/10" />
                  <ul className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <li key={i} className="h-8 rounded bg-white/10" />
                    ))}
                  </ul>
                </aside>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <header className="space-y-1">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs ${meta.badge}`}
                >
                  {meta.name}
                </span>
                {current && (
                  <div className="flex items-center justify-between pt-4 text-sm md:text-base">
                    <div className="text-slate-200">
                      Concurso {current.concurso}
                    </div>
                    <time
                      dateTime={current.dataISO}
                      className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs text-slate-200 ring-1 ring-white/10 md:text-sm"
                    >
                      <span aria-hidden="true">📅</span>
                      {formatDateBR(current.dataISO)}
                    </time>
                  </div>
                )}
              </header>

              {isAcumulado ? (
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 p-4 text-white shadow-lg">
                  <div className="absolute inset-0 opacity-20 mix-blend-overlay" />
                  <p className="text-sm font-bold tracking-wide uppercase">
                    Acumulou!
                  </p>
                  <p className="text-2xl font-extrabold">
                    Prêmio estimado no próximo concurso
                  </p>
                  <p className="text-sm opacity-90">
                    Aguarde o próximo sorteio.
                  </p>
                  {current?.dezenas?.length ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                      <span className="opacity-90">Sorteadas:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {current.dezenas.map((n, i) => (
                          <CompactBall
                            key={`${n}-${i}`}
                            value={n}
                            ringClass={meta.ring}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (current?.ganhadoresFaixa1 ?? 0) > 0 ? (
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 p-4 text-white shadow-lg ring-1 ring-emerald-300/30">
                  <div className="absolute inset-0 opacity-15 mix-blend-overlay" />
                  <p className="text-sm font-bold tracking-wide uppercase">
                    Saiu o prêmio!
                  </p>
                  <p className="text-2xl font-extrabold">
                    {current?.ganhadoresFaixa1} ganhador(es) na faixa principal
                    🎉
                  </p>
                  <p className="text-sm opacity-90">
                    Confira detalhes abaixo por exemplo
                  </p>
                  {current?.dezenas?.length ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                      <span className="opacity-90">Sorteadas:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {current.dezenas.map((n, i) => (
                          <CompactBall
                            key={`${n}-${i}`}
                            value={n}
                            ringClass={meta.ring}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-xl bg-amber-500/10 p-3 text-amber-300 ring-1 ring-amber-400/20">
                  <span className="text-sm font-semibold">
                    Sem ganhadores na faixa principal
                  </span>
                  {current?.dezenas?.length ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-amber-200">
                      <span>Sorteadas:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {current.dezenas.map((n, i) => (
                          <CompactBall
                            key={`${n}-${i}`}
                            value={n}
                            ringClass={meta.ring}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {current?.localGanhadores &&
              current.localGanhadores.length > 0 ? (
                <section
                  aria-label="Locais ganhadores"
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <h4 className="mb-2 text-sm font-semibold text-slate-200">
                    Locais ganhadores
                  </h4>
                  <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {current.localGanhadores.slice(0, 6).map((l, i) => (
                      <li
                        key={`${l.municipio ?? "m"}-${l.uf ?? "uf"}-${i}`}
                        className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10"
                      >
                        <span className="truncate text-slate-200">
                          {l.municipio ?? "—"}
                          {l.uf ? `/${l.uf}` : ""}
                        </span>
                        <span className="text-xs text-emerald-300">
                          {l.ganhadores ?? 0} ganh.
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <div className="space-y-3">
                {/* Linha "Sorteadas" movida para dentro do card de status */}
                <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                  <div className="rounded-xl bg-slate-100 p-4">
                    <div className="grid grid-cols-8 gap-3 md:grid-cols-10 md:gap-2">
                      {universe.slice(0, 50).map((n) => (
                        <NumberBall
                          key={n}
                          value={n}
                          active={drawn.has(n)}
                          accent={meta.color}
                        />
                      ))}
                    </div>
                  </div>
                  <aside className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <h5 className="mb-2 text-xs font-semibold tracking-wide text-slate-300 uppercase">
                      Últimos concursos
                    </h5>
                    <ul className="space-y-1">
                      {lastFive.map((c) => {
                        const isActive = current?.concurso === c.num;
                        return (
                          <li key={c.num}>
                            <button
                              onClick={() =>
                                setCurrent({
                                  loteria: selected,
                                  concurso: c.num,
                                  dataISO: c.dateISO,
                                  dezenas: current?.dezenas ?? [],
                                  acumulou: c.acumulou,
                                  ganhadoresFaixa1: c.ganhadoresFaixa1,
                                })
                              }
                              aria-current={isActive ? "true" : undefined}
                              className={`group w-full rounded-md px-2 py-2 text-left text-xs ring-1 transition ${
                                isActive
                                  ? "bg-white/15 text-white ring-white/20"
                                  : "text-slate-200 ring-transparent hover:bg-white/10 hover:ring-white/10"
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`inline-flex size-1.5 rounded-full ${meta.color.replace("bg-", "bg-")}`}
                                    aria-hidden="true"
                                  />
                                  <span className="truncate">
                                    Concurso {c.num}
                                  </span>
                                </div>
                                <div className="mt-1 truncate text-[11px]">
                                  <span className="text-slate-400">
                                    {formatDateBRShort(c.dateISO)}
                                  </span>
                                  <span
                                    className={`ml-1 ${c.acumulou ? "text-rose-300" : "text-emerald-300"}`}
                                  >
                                    —{" "}
                                    {c.acumulou ? "Acumulou" : "Há ganhadores"}
                                  </span>
                                </div>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </aside>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
