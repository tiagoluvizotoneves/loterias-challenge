import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Loterias | Últimos resultados e apostas",
  description:
    "Confira resultados das loterias e registre sua aposta de forma simples.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geist.variable}`}>
      <body className="min-h-dvh bg-slate-950 text-slate-50 antialiased">
        <TRPCReactProvider>
          <div className="flex min-h-dvh flex-col">
            <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
              <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
                <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">
                  <span className="inline-grid size-6 place-items-center rounded-md bg-emerald-600 text-white">★</span>
                  <span>Loterias</span>
                </a>
                <nav className="hidden items-center gap-6 text-sm md:flex">
                  <a href="/" className="text-slate-300 hover:text-white">Resultados</a>
                  <a href="/apostas/new" className="text-slate-300 hover:text-white">Nova aposta</a>
                </nav>
              </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-white/10 py-6">
              <div className="container mx-auto max-w-6xl px-4 text-center text-sm text-slate-400 md:px-6">
                Feito com Next.js e Tailwind CSS — desafio técnico
              </div>
            </footer>

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/90 px-4 py-2 md:hidden">
              <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
                <a
                  href="/"
                  className="inline-flex items-center justify-center rounded-lg bg-white/5 px-4 py-3 text-sm font-medium text-white ring-1 ring-inset ring-white/10"
                >
                  Resultados
                </a>
                <a
                  href="/apostas/new"
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-600/20"
                >
                  Nova aposta
                </a>
              </div>
            </div>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
