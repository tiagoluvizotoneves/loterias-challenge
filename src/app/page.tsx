import Hero from "@/components/Hero";
import ResultsExplorer from "@/components/ResultsExplorer";
// legacy mocks removed; ResultsExplorer cuida da UI e dados mock

export default async function Home() {
  return (
    <>
      <Hero />

      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <section id="resultados" className="section space-y-6 py-10 md:py-14">
          <div className="mb-6">
            <h2 className="text-3xl leading-tight font-extrabold tracking-tight md:text-4xl">
              <span className="font-thin text-white">Resultados das</span>
              <span className="mx-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                loterias
              </span>
              <span className="font-thin text-white">em tempo real</span>
            </h2>
            <p className="mt-2 max-w-2xl text-slate-300">
              Últimos sorteios, dezenas destacadas e status de premiação — tudo
              num só lugar.
            </p>
          </div>
          <ResultsExplorer />
        </section>
      </div>
    </>
  );
}
