"use client";

import Image from "next/image";
import { useApostaModal } from "@/components/aposta-modal/Provider";
import styles from "./hero.module.css";

export default function Hero() {
  const { open } = useApostaModal();
  return (
    <section className="mt-0 w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 ring-1 ring-white/10">
      <div className="relative mx-auto grid w-full max-w-7xl gap-8 p-6 md:grid-cols-2 md:p-12">
        {/* Shapes background */}
        <div className="pointer-events-none absolute inset-0 z-0 select-none">
          <Image
            src="/images/hero/ball-bg-icon-1.png"
            alt=""
            width={96}
            height={96}
            aria-hidden="true"
            className={`absolute top-6 left-4 opacity-90 ${styles.float1} md:top-10 md:left-10`}
          />
          <Image
            src="/images/hero/ball-bg-icon-2.png"
            alt=""
            width={72}
            height={72}
            aria-hidden="true"
            className={`absolute top-8 right-10 opacity-90 ${styles.float2} md:right-20`}
          />
          <Image
            src="/images/hero/ball-bg-icon-3.png"
            alt=""
            width={88}
            height={88}
            aria-hidden="true"
            className={`absolute bottom-12 left-1/3 opacity-90 ${styles.float3}`}
          />
          <Image
            src="/images/hero/ball-bg-icon-4.png"
            alt=""
            width={64}
            height={64}
            aria-hidden="true"
            className={`absolute right-1/4 bottom-6 opacity-90 ${styles.float4}`}
          />
        </div>

        {/* Right (desktop): Illustration */}
        <div className="relative z-10 order-2 md:order-2">
          <div className="relative aspect-[4/3] w-full md:aspect-[1/1] md:translate-x-2 md:rotate-1 lg:aspect-[4/3] lg:translate-x-6 lg:rotate-2">
            <div className="relative h-full w-full">
              <Image
                src="/images/hero/hero-illus.png"
                alt="Ilustração temática de loterias"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Left (desktop): Copy */}
        <div className="relative z-10 order-1 flex flex-col justify-center md:order-1">
          <p className="text-sm font-light tracking-wide text-slate-200">
            <span className="text-slate-300">A sua chance</span> de
            <span className="mx-1 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text font-semibold text-transparent">
              mudar de vida
            </span>
            começa <span className="font-bold text-emerald-300">agora!</span>
          </p>
          <h1 className="mt-2 text-3xl leading-tight font-extrabold tracking-tight md:text-5xl">
            <span className="font-thin text-white">Jogue nas</span>
            <span className="mx-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              loterias da Caixa
            </span>
            <span className="font-thin text-white">sem sair de casa.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
            Mega-Sena, Lotofácil, Quina, Lotomania e muito mais
            <span className="ml-1 bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text font-semibold text-transparent">
              prêmios milionários
            </span>
            <span className="ml-1">esperam por você!</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={open}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-lg font-bold text-white shadow-lg ring-1 shadow-emerald-600/20 ring-emerald-500/20 transition outline-none hover:-translate-y-0.5 hover:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              APOSTAR
            </button>
            <a
              href="#resultados"
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3.5 text-lg font-bold text-white shadow-lg ring-1 shadow-rose-600/20 ring-rose-500/20 transition outline-none hover:-translate-y-0.5 hover:bg-rose-500 focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              VER RESULTADOS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
