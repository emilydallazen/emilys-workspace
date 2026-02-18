"use client";

import { useState, useMemo } from "react";
import {
  type Transaction,
  initialTransactions,
  parseCurrency,
} from "@/lib/financeiro-types";

export function useTransactions() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [activeMonth, setActiveMonth] = useState(1); // 0=Jan, 1=Fev

  const filteredTransactions = useMemo(() => {
    return transactions.flatMap((t) => {
      const parts = t.date.split("/");
      const month = parseInt(parts[1], 10) - 1; // 0-indexed

      if (t.recorrente) {
        // Recorrente: aparece em todos os meses a partir do mês original
        if (activeMonth >= month) {
          // Gera uma cópia com a data ajustada para o mês ativo
          const day = parts[0];
          const year = parts[2];
          const adjustedMonth = String(activeMonth + 1).padStart(2, "0");
          return [
            {
              ...t,
              id: t.id + activeMonth * 10000, // ID único por mês
              date: `${day}/${adjustedMonth}/${year}`,
            },
          ];
        }
        return [];
      }

      // Normal: só aparece no próprio mês
      return month === activeMonth ? [t] : [];
    });
  }, [transactions, activeMonth]);

  const entradas = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.tipo === "entrada")
        .reduce((sum, t) => sum + parseCurrency(t.valor), 0),
    [filteredTransactions],
  );

  const saidas = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.tipo === "saida")
        .reduce((sum, t) => sum + parseCurrency(t.valor), 0),
    [filteredTransactions],
  );

  const saldo = entradas - saidas;

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  return {
    transactions,
    filteredTransactions,
    activeMonth,
    setActiveMonth,
    entradas,
    saidas,
    saldo,
    addTransaction,
  };
}
