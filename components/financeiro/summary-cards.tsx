"use client";

import { formatCurrency } from "@/lib/financeiro-types";

interface SummaryCardsProps {
  saldo: number;
  entradas: number;
  saidas: number;
}

export function SummaryCards({ saldo, entradas, saidas }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div
        className="border-2 border-info bg-info-light p-3"
        style={{
          boxShadow:
            "inset 1px 1px 0 var(--info-lighter), inset -1px -1px 0 var(--info)",
        }}
      >
        <div className="text-sm text-info-dark">Saldo Atual</div>
        <div className="text-2xl text-info-dark">
          R$ {formatCurrency(saldo)}
        </div>
      </div>
      <div
        className="border-2 border-positive bg-positive-light p-3"
        style={{
          boxShadow:
            "inset 1px 1px 0 var(--positive-lighter), inset -1px -1px 0 var(--positive)",
        }}
      >
        <div className="text-sm text-positive-dark">Entradas</div>
        <div className="text-2xl text-positive-dark">
          +R$ {formatCurrency(entradas)}
        </div>
      </div>
      <div
        className="border-2 border-danger bg-danger-light p-3"
        style={{
          boxShadow:
            "inset 1px 1px 0 var(--danger-lighter), inset -1px -1px 0 var(--danger)",
        }}
      >
        <div className="text-sm text-danger-dark">Saidas</div>
        <div className="text-2xl text-danger-dark">
          -R$ {formatCurrency(saidas)}
        </div>
      </div>
    </div>
  );
}
