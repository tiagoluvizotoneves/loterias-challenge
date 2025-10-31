type LotteryType = "mega-sena" | "quina" | "lotofacil";

type ResultItem = {
  id: string;
  type: LotteryType;
  contest: number;
  date: string; // ISO yyyy-mm-dd
  numbers: number[];
  prizeHint?: string;
};

const mockResults: ResultItem[] = [
  {
    id: "ms-2356",
    type: "mega-sena",
    contest: 2356,
    date: "2025-01-12",
    numbers: [4, 12, 19, 33, 45, 52],
    prizeHint: "Acumulado em R$ 68 mi",
  },
  {
    id: "qn-6123",
    type: "quina",
    contest: 6123,
    date: "2025-01-11",
    numbers: [3, 18, 44, 56, 72],
  },
  {
    id: "lf-3001",
    type: "lotofacil",
    contest: 3001,
    date: "2025-01-10",
    numbers: [1, 3, 5, 7, 8, 9, 10, 12, 14, 16, 17, 19, 20, 23, 24],
  },
];

const typeToStyles: Record<LotteryType, { badge: string; name: string }> = {
  "mega-sena": {
    badge:
      "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30",
    name: "Mega-Sena",
  },
  quina: {
    badge: "bg-violet-600/20 text-violet-300 border border-violet-500/30",
    name: "Quina",
  },
  lotofacil: {
    badge: "bg-pink-600/20 text-pink-300 border border-pink-500/30",
    name: "Lotofácil",
  },
};

function NumberPill({ value }: { value: number }) {
  return (
    <span className="inline-grid size-9 place-items-center rounded-full bg-slate-800 text-slate-100 ring-1 ring-white/10">
      {String(value).padStart(2, "0")}
    </span>
  );
}

function ResultCard({ item }: { item: ResultItem }) {
  const t = typeToStyles[item.type];
  return (
    <article className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <header className="mb-3 flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-xs ${t.badge}`}>
          {t.name}
        </span>
        <time className="text-xs text-slate-400">{item.date}</time>
      </header>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Concurso {item.contest}
        </h3>
        {item.prizeHint ? (
          <span className="text-xs text-emerald-300">{item.prizeHint}</span>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {item.numbers.map((n) => (
          <NumberPill key={n} value={n} />
        ))}
      </div>
    </article>
  );
}

export default async function Home() {
  const heroBg =
    "linear-gradient(to bottom right, rgba(2,6,23,.9), rgba(6,78,59,.35)), url('https://images.unsplash.com/photo-1601132359864-c974e79890ab?q=80&w=1600&auto=format&fit=crop')";

  return (
    <div className="container mx-auto max-w-6xl px-4 md:px-6">
      <section
        className="mt-6 overflow-hidden rounded-2xl ring-1 ring-white/10"
        style={{ backgroundImage: heroBg, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="grid gap-6 p-8 md:grid-cols-2 md:p-12">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Loterias em tempo real
            </h1>
            <p className="mt-3 max-w-xl text-slate-200">
              Confira os últimos resultados, explore detalhes por concurso e registre sua aposta de forma simples.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/apostas/new"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                Registrar nova aposta
              </a>
              <a
                href="#resultados"
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 font-medium text-white ring-1 ring-inset ring-white/15 backdrop-blur hover:bg-white/15"
              >
                Ver resultados
              </a>
            </div>
          </div>
          <div className="hidden items-end justify-end md:flex">
            <div className="flex items-end gap-3">
              {[4, 12, 19, 33, 45, 52].map((n) => (
                <span
                  key={n}
                  className="inline-grid size-12 place-items-center rounded-full bg-emerald-600 text-lg font-semibold text-white shadow-inner shadow-emerald-900/30 ring-1 ring-white/10"
                >
                  {String(n).padStart(2, "0")}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="resultados" className="section space-y-6 py-10 md:py-14">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Últimos resultados
          </h2>
          <div className="hidden items-center gap-2 md:flex">
            <a href="#mega" className="rounded-md bg-white/5 px-3 py-1.5 text-sm ring-1 ring-inset ring-white/10">Mega-Sena</a>
            <a href="#quina" className="rounded-md bg-white/5 px-3 py-1.5 text-sm ring-1 ring-inset ring-white/10">Quina</a>
            <a href="#lotofacil" className="rounded-md bg-white/5 px-3 py-1.5 text-sm ring-1 ring-inset ring-white/10">Lotofácil</a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockResults.map((item) => (
            <ResultCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
