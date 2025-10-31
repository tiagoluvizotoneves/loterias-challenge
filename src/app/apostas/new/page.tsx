export default function NovaApostaPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Nova aposta — Mega-Sena
        </h1>
        <p className="mt-2 text-slate-300">
          Preencha os dados abaixo para registrar sua aposta. Esta é uma prévia visual, ainda sem integração.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Nome do apostador (opcional)</label>
            <input
              placeholder="Seu nome"
              className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-sm text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Data da aposta</label>
            <input
              type="date"
              className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-sm text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm text-slate-300">Números (6)</label>
          <div className="flex flex-wrap gap-2">
            {[1, 5, 12, 27, 33, 45].map((n) => (
              <span
                key={n}
                className="inline-grid size-10 place-items-center rounded-full bg-slate-800 text-white ring-1 ring-white/10"
              >
                {String(n).padStart(2, "0")}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <a href="/" className="rounded-lg px-4 py-2 text-sm text-slate-300 ring-1 ring-inset ring-white/10">
            Cancelar
          </a>
          <button className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500">
            Salvar aposta
          </button>
        </div>
      </div>
    </div>
  );
}


