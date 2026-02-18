"use client";

import { useState, useMemo, useCallback } from "react";
import {
  type Transaction,
  CATEGORIAS_ENTRADA,
  CATEGORIAS_SAIDA,
  SUBCATEGORIAS_ENTRADA,
  SUBCATEGORIAS_SAIDA,
  formatCurrency,
} from "@/lib/financeiro-types";

export function useTransactionModal(addTransaction: (t: Transaction) => void) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState<"debito" | "credito">("debito");
  const [novaData, setNovaData] = useState("");
  const [novaDesc, setNovaDesc] = useState("");
  const [novoValor, setNovoValor] = useState("");
  const [novoTipo, setNovoTipo] = useState<"entrada" | "saida">("entrada");
  const [novaCategoria, setNovaCategoria] = useState(CATEGORIAS_ENTRADA[0]);
  const [novaSubcategoria, setNovaSubcategoria] = useState("");
  const [novaParcelas, setNovaParcelas] = useState("1");
  const [recorrente, setRecorrente] = useState(false);

  const categorias =
    novoTipo === "entrada" ? CATEGORIAS_ENTRADA : CATEGORIAS_SAIDA;

  const subcategoriaOptions = useMemo(() => {
    const map =
      novoTipo === "entrada" ? SUBCATEGORIAS_ENTRADA : SUBCATEGORIAS_SAIDA;
    return map[novaCategoria] || ["Outros"];
  }, [novaCategoria, novoTipo]);

  const resetForm = useCallback(() => {
    setNovaData("");
    setNovaDesc("");
    setNovoValor("");
    setNovoTipo("entrada");
    setNovaCategoria(CATEGORIAS_ENTRADA[0]);
    setNovaSubcategoria("");
    setNovaParcelas("1");
    setRecorrente(false);
  }, []);

  const openModal = useCallback((tipo: "debito" | "credito") => {
    setModalTipo(tipo);
    if (tipo === "credito") {
      setNovoTipo("saida");
      setNovaCategoria(CATEGORIAS_SAIDA[0]);
    } else {
      setNovoTipo("entrada");
      setNovaCategoria(CATEGORIAS_ENTRADA[0]);
    }
    setNovaSubcategoria("");
    setNovaParcelas("1");
    setRecorrente(false);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const switchTipo = useCallback((tipo: "entrada" | "saida") => {
    setNovoTipo(tipo);
    setNovaCategoria(
      tipo === "entrada" ? CATEGORIAS_ENTRADA[0] : CATEGORIAS_SAIDA[0],
    );
    setNovaSubcategoria("");
  }, []);

  const selectCategoria = useCallback((cat: string) => {
    setNovaCategoria(cat);
    setNovaSubcategoria("");
  }, []);

  const handleSubmit = useCallback(() => {
    if (!novaData.trim() || !novaDesc.trim() || !novoValor.trim()) return;

    const valorNum = parseFloat(novoValor.replace(",", "."));
    if (isNaN(valorNum) || valorNum <= 0) return;

    const [year, month, day] = novaData.split("-");
    const dateStr = `${day}/${month}/${year}`;

    if (modalTipo === "credito") {
      if (recorrente) {
        // Recorrente: valor fixo todo mês
        const formatted = formatCurrency(valorNum);
        const valorStr = `-R$ ${formatted}`;
        const descComRecorrente = `[Recorrente] ${novaDesc}`;

        addTransaction({
          id: Date.now(),
          date: dateStr,
          desc: descComRecorrente,
          valor: valorStr,
          tipo: "saida",
          categoria: novaCategoria,
          subcategoria: novaSubcategoria || subcategoriaOptions[0] || "",
          recorrente: true,
        });
      } else {
        const parcelas = Math.max(1, parseInt(novaParcelas) || 1);
        const valorParcela = valorNum / parcelas;
        const formatted = formatCurrency(valorParcela);
        const valorStr = `-R$ ${formatted}`;
        const descComParcela = `[Crédito ${parcelas}x] ${novaDesc}`;

        addTransaction({
          id: Date.now(),
          date: dateStr,
          desc: descComParcela,
          valor: valorStr,
          tipo: "saida",
          categoria: novaCategoria,
          subcategoria: novaSubcategoria || subcategoriaOptions[0] || "",
        });
      }
    } else {
      const formatted = formatCurrency(valorNum);
      const valorStr =
        novoTipo === "entrada" ? `+R$ ${formatted}` : `-R$ ${formatted}`;

      addTransaction({
        id: Date.now(),
        date: dateStr,
        desc: novaDesc,
        valor: valorStr,
        tipo: novoTipo,
        categoria: novaCategoria,
        subcategoria: novaSubcategoria || subcategoriaOptions[0] || "",
      });
    }

    resetForm();
    setModalOpen(false);
  }, [
    novaData,
    novaDesc,
    novoValor,
    novoTipo,
    novaCategoria,
    novaSubcategoria,
    novaParcelas,
    recorrente,
    modalTipo,
    subcategoriaOptions,
    addTransaction,
    resetForm,
  ]);

  return {
    // State
    modalOpen,
    modalTipo,
    novaData,
    novaDesc,
    novoValor,
    novoTipo,
    novaCategoria,
    novaSubcategoria,
    novaParcelas,
    categorias,
    subcategoriaOptions,
    recorrente,
    // Setters
    setNovaData,
    setNovaDesc,
    setNovoValor,
    setNovaParcelas,
    setNovaSubcategoria,
    setRecorrente,
    // Actions
    openModal,
    closeModal,
    switchTipo,
    selectCategoria,
    handleSubmit,
  };
}
