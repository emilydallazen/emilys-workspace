"use client";

import { useState, useMemo } from "react";
import { useSoundContext } from "./sound-provider";

export interface CreditTransaction {
  id: number;
  date: string;
  desc: string;
  valorTotal: string;
  valorParcela: string;
  parcelaAtual: number;
  parcelaTotal: number;
  categoria: string;
  subcategoria: string;
}

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const CURRENT_YEAR = 26;

const initialCreditTransactions: CreditTransaction[] = [
  {
    id: 201,
    date: "05/01/2026",
    desc: "Notebook Dell Inspiron",
    valorTotal: "R$ 4.500,00",
    valorParcela: "R$ 375,00",
    parcelaAtual: 2,
    parcelaTotal: 12,
    categoria: "Material de Trabalho",
    subcategoria: "Equipamento",
  },
  {
    id: 202,
    date: "10/01/2026",
    desc: "Curso UX/UI Design",
    valorTotal: "R$ 1.200,00",
    valorParcela: "R$ 200,00",
    parcelaAtual: 2,
    parcelaTotal: 6,
    categoria: "Assinaturas",
    subcategoria: "Software",
  },
  {
    id: 203,
    date: "15/01/2026",
    desc: "Cadeira Ergonômica",
    valorTotal: "R$ 1.800,00",
    valorParcela: "R$ 600,00",
    parcelaAtual: 2,
    parcelaTotal: 3,
    categoria: "Material de Trabalho",
    subcategoria: "Equipamento",
  },
  {
    id: 204,
    date: "20/02/2026",
    desc: "Adobe Creative Cloud Anual",
    valorTotal: "R$ 1.440,00",
    valorParcela: "R$ 120,00",
    parcelaAtual: 1,
    parcelaTotal: 12,
    categoria: "Assinaturas",
    subcategoria: "Software",
  },
  {
    id: 205,
    date: "12/02/2026",
    desc: "Monitor Ultrawide",
    valorTotal: "R$ 2.400,00",
    valorParcela: "R$ 400,00",
    parcelaAtual: 1,
    parcelaTotal: 6,
    categoria: "Material de Trabalho",
    subcategoria: "Equipamento",
  },
  {
    id: 206,
    date: "03/02/2026",
    desc: "Passagem aérea - Conferência Tech",
    valorTotal: "R$ 950,00",
    valorParcela: "R$ 475,00",
    parcelaAtual: 1,
    parcelaTotal: 2,
    categoria: "Transporte",
    subcategoria: "Uber/99",
  },
];

function parseCurrency(valor: string): number {
  const cleaned = valor.replace(/[^\d,.-]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function TabCredito() {
  const [transactions] = useState<CreditTransaction[]>(
    initialCreditTransactions,
  );
  const [activeMonth, setActiveMonth] = useState(1); // Fev
  const { playTab } = useSoundContext();

  const handleMonthChange = (index: number) => {
    if (index !== activeMonth) {
      playTab();
    }
    setActiveMonth(index);
  };

  // Filtra por mês — mostra compras que têm parcela nesse mês
  // Uma compra aparece no mês se: mês da compra + parcelaAtual abrange o mês ativo
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const parts = t.date.split("/");
      const purchaseMonth = parseInt(parts[1], 10) - 1; // 0-indexed
      const purchaseYear = parseInt(parts[2], 10);
      const activeYear = 2026;

      // Calcula quais meses a compra abrange
      for (let i = 0; i < t.parcelaTotal; i++) {
        let m = purchaseMonth + i;
        let y = purchaseYear;
        if (m >= 12) {
          y += Math.floor(m / 12);
          m = m % 12;
        }
        if (m === activeMonth && y === activeYear) return true;
      }
      return false;
    });
  }, [transactions, activeMonth]);

  // Calcula a parcela atual relativa ao mês exibido
  const getParcelaNoMes = (t: CreditTransaction): number => {
    const parts = t.date.split("/");
    const purchaseMonth = parseInt(parts[1], 10) - 1;
    const diff = activeMonth - purchaseMonth;
    // +1 porque a parcela 1 é no mês da compra
    return Math.max(1, Math.min(diff + 1, t.parcelaTotal));
  };

  // Totais
  const totalFatura = filteredTransactions.reduce(
    (sum, t) => sum + parseCurrency(t.valorParcela),
    0,
  );

  const totalPendente = filteredTransactions.reduce((sum, t) => {
    const parcela = getParcelaNoMes(t);
    const restante = (t.parcelaTotal - parcela) * parseCurrency(t.valorParcela);
    return sum + restante;
  }, 0);

  const comprasAtivas = filteredTransactions.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Abas de meses */}
      <div
        className="flex overflow-x-auto border-2 border-[#7b2d8e]"
        style={{
          boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e",
        }}
      >
        {MONTH_LABELS.map((label, index) => (
          <button
            key={label}
            onClick={() => handleMonthChange(index)}
            className={`flex-1 border-r border-[#7b2d8e] px-1 py-1.5 text-center text-sm transition-none last:border-r-0 ${
              activeMonth === index
                ? "bg-[#fff0fc] text-[#1a0a2e]"
                : "bg-[#b898cc] text-[#3d1a5c] hover:bg-[#d4b8e8]"
            }`}
            style={
              activeMonth === index
                ? {
                    boxShadow:
                      "inset 1px 1px 0 #fff0fc, inset -1px -1px 0 #7b2d8e",
                  }
                : {
                    boxShadow:
                      "inset 1px 1px 0 #d4b8e8, inset -1px -1px 0 #7b2d8e",
                  }
            }
          >
            {label}/{CURRENT_YEAR}
          </button>
        ))}
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div
          className="border-2 border-danger bg-danger-light p-3"
          style={{
            boxShadow:
              "inset 1px 1px 0 var(--danger-lighter), inset -1px -1px 0 var(--danger)",
          }}
        >
          <div className="text-sm text-danger-dark">Fatura do Mês</div>
          <div className="text-2xl text-danger-dark">
            R$ {formatCurrency(totalFatura)}
          </div>
        </div>
        <div
          className="border-2 border-warning bg-warning-light p-3"
          style={{
            boxShadow:
              "inset 1px 1px 0 var(--warning-lighter), inset -1px -1px 0 var(--warning)",
          }}
        >
          <div className="text-sm text-warning-dark">Total Pendente</div>
          <div className="text-2xl text-warning-dark">
            R$ {formatCurrency(totalPendente)}
          </div>
        </div>
        <div
          className="border-2 border-info bg-info-light p-3"
          style={{
            boxShadow:
              "inset 1px 1px 0 var(--info-lighter), inset -1px -1px 0 var(--info)",
          }}
        >
          <div className="text-sm text-info-dark">Compras Ativas</div>
          <div className="text-2xl text-info-dark">{comprasAtivas}</div>
        </div>
      </div>

      {/* Tabela de compras no crédito */}
      <div
        className="border-2 border-[#7b2d8e]"
        style={{
          boxShadow: "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
        }}
      >
        <div className="grid grid-cols-[80px_1fr_90px_80px_80px_70px] border-b-2 border-[#7b2d8e] bg-[#7b2d8e] text-xs text-[#fff0fc] md:grid-cols-[100px_1fr_110px_100px_100px_90px]">
          <div className="border-r border-[#9b4dae] px-2 py-1.5">Data</div>
          <div className="border-r border-[#9b4dae] px-2 py-1.5">Descrição</div>
          <div className="border-r border-[#9b4dae] px-2 py-1.5">Categoria</div>
          <div className="border-r border-[#9b4dae] px-2 py-1.5">Parcelas</div>
          <div className="border-r border-[#9b4dae] px-2 py-1.5">Parcela</div>
          <div className="px-2 py-1.5">Total</div>
        </div>
        {filteredTransactions.length === 0 ? (
          <div className="bg-[#fff0fc] px-3 py-6 text-center text-sm text-[#b898cc]">
            Nenhuma compra no crédito neste mês
          </div>
        ) : (
          filteredTransactions.map((t) => {
            const parcelaNoMes = getParcelaNoMes(t);
            const progresso = (parcelaNoMes / t.parcelaTotal) * 100;
            const quitada = parcelaNoMes >= t.parcelaTotal;

            return (
              <div
                key={t.id}
                className="grid grid-cols-[80px_1fr_90px_80px_80px_70px] border-b border-[#b898cc] bg-[#fff0fc] text-xs hover:bg-[#e8d0f0] md:grid-cols-[100px_1fr_110px_100px_100px_90px]"
              >
                <div className="border-r border-[#d4b8e8] px-2 py-1.5 text-[#3d1a5c]">
                  {t.date}
                </div>
                <div className="border-r border-[#d4b8e8] px-2 py-1.5 text-[#1a0a2e]">
                  <div>{t.desc}</div>
                  <div className="text-[10px] text-[#b898cc]">
                    {t.subcategoria}
                  </div>
                </div>
                <div className="border-r border-[#d4b8e8] px-2 py-1.5 text-[#3d1a5c]">
                  {t.categoria}
                </div>
                <div className="border-r border-[#d4b8e8] px-2 py-1.5">
                  <div className="flex items-center gap-1">
                    <span
                      className={quitada ? "text-positive" : "text-[#3d1a5c]"}
                    >
                      {parcelaNoMes}/{t.parcelaTotal}
                    </span>
                    {quitada && (
                      <span className="text-[10px] text-positive">✓</span>
                    )}
                  </div>
                  {/* Barra de progresso mini */}
                  <div className="mt-0.5 h-1.5 border border-[#7b2d8e] bg-[#e8d0f0]">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${progresso}%`,
                        backgroundColor: quitada
                          ? "var(--positive)"
                          : progresso > 50
                            ? "var(--warning)"
                            : "var(--danger)",
                      }}
                    />
                  </div>
                </div>
                <div className="border-r border-[#d4b8e8] px-2 py-1.5 text-danger">
                  {t.valorParcela}
                </div>
                <div className="px-2 py-1.5 text-[#3d1a5c]">{t.valorTotal}</div>
              </div>
            );
          })
        )}
      </div>

      {/* Resumo por categoria */}
      <div
        className="border-2 border-[#7b2d8e] bg-[#fff0fc] p-3"
        style={{
          boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e",
        }}
      >
        <div className="mb-2 border-b border-[#d4b8e8] pb-1 text-sm text-[#3d1a5c]">
          Fatura por Categoria
        </div>
        <div className="flex flex-col gap-1.5">
          {Object.entries(
            filteredTransactions.reduce<Record<string, number>>((acc, t) => {
              acc[t.categoria] =
                (acc[t.categoria] || 0) + parseCurrency(t.valorParcela);
              return acc;
            }, {}),
          )
            .sort(([, a], [, b]) => b - a)
            .map(([cat, val]) => (
              <div key={cat} className="flex items-center gap-2">
                <span className="w-36 truncate text-xs text-[#3d1a5c]">
                  {cat}
                </span>
                <div className="relative h-4 flex-1 border border-[#7b2d8e] bg-[#e8d0f0]">
                  <div
                    className="h-full"
                    style={{
                      width: `${totalFatura > 0 ? (val / totalFatura) * 100 : 0}%`,
                      background:
                        "repeating-linear-gradient(90deg, #7b2d8e 0px, #7b2d8e 6px, #9b4dae 6px, #9b4dae 12px)",
                    }}
                  />
                </div>
                <span className="w-20 text-right text-xs text-danger">
                  R$ {formatCurrency(val)}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between border-2 border-[#7b2d8e] bg-[#d4b8e8] px-3 py-1 text-sm text-[#3d1a5c]"
        style={{
          boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e",
        }}
      >
        <span>{filteredTransactions.length} compras no crédito</span>
        <span>Fatura: R$ {formatCurrency(totalFatura)}</span>
      </div>
    </div>
  );
}
