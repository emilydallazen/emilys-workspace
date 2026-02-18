"use client";

import type { Transaction } from "@/lib/financeiro-types";

interface StatusBarProps {
  transactions: Transaction[];
}

export function StatusBar({ transactions }: StatusBarProps) {
  return (
    <div
      className="flex items-center justify-between border-2 border-[#7b2d8e] bg-[#d4b8e8] px-3 py-1 text-sm text-[#3d1a5c]"
      style={{
        boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e",
      }}
    >
      <span>{transactions.length} registros encontrados</span>
      <span>Ultima atualizacao: {transactions[0]?.date ?? "—"}</span>
    </div>
  );
}
