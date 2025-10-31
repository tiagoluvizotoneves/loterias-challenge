"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ApostaModal } from "./modal";

type Ctx = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const ModalCtx = createContext<Ctx | null>(null);

export function ApostaModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <ModalCtx.Provider value={value}>
      {children}
      <ApostaModal open={isOpen} onClose={close} />
    </ModalCtx.Provider>
  );
}

export function useApostaModal() {
  const ctx = useContext(ModalCtx);
  if (!ctx) throw new Error("useApostaModal must be used within ApostaModalProvider");
  return ctx;
}


