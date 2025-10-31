"use client";

import { Ticket } from "lucide-react";
import { useApostaModal } from "@/components/aposta-modal/Provider";

export function ApostarButtonDesktop() {
  const { open } = useApostaModal();
  return (
    <button
      type="button"
      onClick={open}
      className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white shadow-sm ring-1 ring-emerald-500/20 hover:bg-emerald-500"
    >
      Nova aposta
    </button>
  );
}

export function ApostarButtonMobile() {
  const { open } = useApostaModal();
  return (
    <button
      type="button"
      onClick={open}
      className="relative z-10 flex -translate-y-6 flex-col items-center gap-1 text-xs md:-translate-y-7"
    >
      <span className="inline-grid size-14 place-items-center rounded-full bg-emerald-600 text-white shadow-2xl ring-4 ring-white md:size-16">
        <Ticket size={22} className="text-white" aria-hidden />
      </span>
      <span className="mt-3 font-semibold text-white">APOSTAR</span>
    </button>
  );
}


