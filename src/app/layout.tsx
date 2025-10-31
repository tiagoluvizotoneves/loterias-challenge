import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { Home, ReceiptText } from "lucide-react";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiTrpc,
  SiDrizzle,
  SiPostgresql,
  SiReactquery,
  SiZod,
} from "react-icons/si";

import { TRPCReactProvider } from "@/trpc/react";
import { ApostaModalProvider } from "@/components/aposta-modal/Provider";
import {
  ApostarButtonDesktop,
  ApostarButtonMobile,
} from "@/components/ApostarButtons";

export const metadata: Metadata = {
  title: "Loterias | Últimos resultados e apostas",
  description:
    "Confira resultados das loterias e registre sua aposta de forma simples.",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${geist.variable}`}
    >
      <body className="min-h-dvh bg-slate-950 text-slate-50 antialiased">
        <TRPCReactProvider>
          <ApostaModalProvider>
            <div className="flex min-h-dvh flex-col">
              <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
                <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
                  <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold tracking-tight"
                  >
                    <span className="inline-grid size-6 place-items-center rounded-md bg-emerald-600 text-white">
                      ★
                    </span>
                    <span>Loterias</span>
                  </Link>
                  <nav className="hidden items-center gap-6 text-sm md:flex">
                    <Link
                      href="/#resultados"
                      className="text-slate-300 hover:text-white"
                    >
                      Resultados
                    </Link>
                    <Link
                      href="/apostas"
                      className="text-slate-300 hover:text-white"
                    >
                      Minhas apostas
                    </Link>
                    <ApostarButtonDesktop />
                  </nav>
                </div>
              </header>

              <main className="flex-1">{children}</main>

              <footer className="relative mt-10 border-t border-white/10 pb-40 md:pb-0">
                <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                <div className="container mx-auto max-w-6xl px-4 py-8 md:px-6">
                  <div className="grid grid-cols-1 gap-6 text-sm text-slate-300 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-semibold tracking-tight">
                        <span className="inline-grid size-6 place-items-center rounded-md bg-emerald-600 text-white">
                          ★
                        </span>
                        <span>Loterias</span>
                      </div>
                      <p className="text-slate-400">
                        Interface moderna para resultados e apostas.
                      </p>
                    </div>
                    <nav className="space-y-2 md:justify-self-center">
                      <div className="text-xs tracking-wide text-slate-400 uppercase">
                        Navegação
                      </div>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            href="/#resultados"
                            className="hover:text-white"
                          >
                            Resultados
                          </Link>
                        </li>
                        <li>
                          <Link href="/apostas" className="hover:text-white">
                            Minhas apostas
                          </Link>
                        </li>
                      </ul>
                    </nav>
                    <div className="space-y-2 md:justify-self-end">
                      <div className="text-xs tracking-wide text-slate-400 uppercase">
                        Tecnologias
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 ring-1 ring-white/10">
                          <SiNextdotjs size={14} aria-hidden /> Next.js
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 ring-1 ring-white/10">
                          <SiTailwindcss size={14} aria-hidden /> Tailwind
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 ring-1 ring-white/10">
                          <SiTrpc size={14} aria-hidden /> tRPC
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 ring-1 ring-white/10">
                          <SiDrizzle size={14} aria-hidden /> Drizzle
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 ring-1 ring-white/10">
                          <SiPostgresql size={14} aria-hidden /> PostgreSQL
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 ring-1 ring-white/10">
                          <SiReactquery size={14} aria-hidden /> React Query
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 ring-1 ring-white/10">
                          <SiZod size={14} aria-hidden /> Zod
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} Tiago Luvizoto Neves. Todos os
                    direitos reservados.
                  </div>
                </div>
              </footer>

              <div className="fixed inset-x-0 bottom-0 z-40 overflow-visible border-t border-white/10 bg-slate-950/90 px-4 pt-1 pb-3 md:hidden">
                <nav className="mx-auto grid max-w-md grid-cols-3 items-end gap-4">
                  <Link
                    href="/#resultados"
                    className="flex flex-col items-center gap-1 text-xs text-slate-300"
                  >
                    <span className="inline-grid size-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 ring-inset">
                      <Home size={20} className="text-slate-200" aria-hidden />
                    </span>
                    <span className="mt-3">RESULTADOS</span>
                  </Link>
                  <ApostarButtonMobile />
                  <Link
                    href="/apostas"
                    className="flex flex-col items-center gap-1 text-xs text-slate-300"
                  >
                    <span className="inline-grid size-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 ring-inset">
                      <ReceiptText
                        size={20}
                        className="text-slate-200"
                        aria-hidden
                      />
                    </span>
                    <span className="mt-3">MINHAS APOSTAS</span>
                  </Link>
                </nav>
              </div>
            </div>
          </ApostaModalProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

// moved Apostar buttons to client component file
