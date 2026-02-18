"use client";

import { useSoundContext } from "../sound-provider";

interface ActionButtonsProps {
  onOpenDebito: () => void;
  onOpenCredito: () => void;
}

export function ActionButtons({
  onOpenDebito,
  onOpenCredito,
}: ActionButtonsProps) {
  const { playOpen } = useSoundContext();

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => {
          playOpen();
          onOpenDebito();
        }}
        className="flex items-center justify-center gap-2 border-2 border-[#7b2d8e] bg-[#e8a4c8] px-4 py-2 text-base text-[#1a0a2e] hover:bg-[#ff80b0] active:bg-[#d4b8e8]"
        style={{
          boxShadow: "inset 1px 1px 0 #ffc0d8, inset -1px -1px 0 #7b2d8e",
        }}
      >
        <span className="text-lg font-bold leading-none">+</span>
        Lançar no Débito
      </button>
      <button
        onClick={() => {
          playOpen();
          onOpenCredito();
        }}
        className="flex items-center justify-center gap-2 border-2 border-[#7b2d8e] bg-[#d4b8e8] px-4 py-2 text-base text-[#1a0a2e] hover:bg-[#b898cc] active:bg-[#e8d0f0]"
        style={{
          boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e",
        }}
      >
        <span className="text-lg font-bold leading-none">💳</span>
        Lançar no Crédito
      </button>
    </div>
  );
}
