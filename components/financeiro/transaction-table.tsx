"use client";

import type { Transaction } from "@/lib/financeiro-types";

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div
      className="border-2 border-[#7b2d8e]"
      style={{
        boxShadow: "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
      }}
    >
      <div className="grid grid-cols-[100px_1fr_100px_120px] border-b-2 border-[#7b2d8e] bg-[#7b2d8e] text-sm text-[#fff0fc] md:grid-cols-[120px_1fr_130px_150px]">
        <div className="border-r border-[#9b4dae] px-3 py-1.5">Data</div>
        <div className="border-r border-[#9b4dae] px-3 py-1.5">Descricao</div>
        <div className="border-r border-[#9b4dae] px-3 py-1.5">Categoria</div>
        <div className="px-3 py-1.5">Valor</div>
      </div>
      {transactions.length === 0 ? (
        <div className="bg-[#fff0fc] px-3 py-6 text-center text-sm text-[#b898cc]">
          Nenhuma movimentação neste mês
        </div>
      ) : (
        transactions.map((t) => (
          <div
            key={t.id}
            className="grid grid-cols-[100px_1fr_100px_120px] border-b border-[#b898cc] bg-[#fff0fc] text-sm hover:bg-[#e8d0f0] md:grid-cols-[120px_1fr_130px_150px]"
          >
            <div className="border-r border-[#d4b8e8] px-3 py-1.5 text-[#3d1a5c]">
              {t.date}
            </div>
            <div className="border-r border-[#d4b8e8] px-3 py-1.5 text-[#1a0a2e]">
              {t.recorrente && (
                <span className="mr-1 text-info" title="Recorrente">
                  🔄
                </span>
              )}
              {t.desc}
            </div>
            <div className="border-r border-[#d4b8e8] px-3 py-1.5 text-[#3d1a5c]">
              {t.categoria}
            </div>
            <div
              className={`px-3 py-1.5 ${
                t.tipo === "entrada" ? "text-positive" : "text-danger"
              }`}
            >
              {t.valor}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
