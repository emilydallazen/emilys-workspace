"use client";

import { useTransactions } from "@/hooks/use-transactions";
import { useTransactionModal } from "@/hooks/use-transaction-modal";
import {
  MonthTabs,
  SummaryCards,
  ActionButtons,
  TransactionTable,
  TransactionModal,
  StatusBar,
} from "./financeiro";

export function TabFinanceiro() {
  const {
    activeMonth,
    setActiveMonth,
    filteredTransactions,
    entradas,
    saidas,
    saldo,
    addTransaction,
  } = useTransactions();

  const modal = useTransactionModal(addTransaction);

  return (
    <div className="flex flex-col gap-4">
      <MonthTabs activeMonth={activeMonth} onMonthChange={setActiveMonth} />

      <SummaryCards saldo={saldo} entradas={entradas} saidas={saidas} />

      <ActionButtons
        onOpenDebito={() => modal.openModal("debito")}
        onOpenCredito={() => modal.openModal("credito")}
      />

      <TransactionTable transactions={filteredTransactions} />

      <StatusBar transactions={filteredTransactions} />

      {modal.modalOpen && (
        <TransactionModal
          modalTipo={modal.modalTipo}
          novoTipo={modal.novoTipo}
          novaData={modal.novaData}
          novaDesc={modal.novaDesc}
          novoValor={modal.novoValor}
          novaCategoria={modal.novaCategoria}
          novaSubcategoria={modal.novaSubcategoria}
          novaParcelas={modal.novaParcelas}
          categorias={modal.categorias}
          subcategoriaOptions={modal.subcategoriaOptions}
          recorrente={modal.recorrente}
          setNovaData={modal.setNovaData}
          setNovaDesc={modal.setNovaDesc}
          setNovoValor={modal.setNovoValor}
          setNovaParcelas={modal.setNovaParcelas}
          setNovaSubcategoria={modal.setNovaSubcategoria}
          setRecorrente={modal.setRecorrente}
          switchTipo={modal.switchTipo}
          selectCategoria={modal.selectCategoria}
          closeModal={modal.closeModal}
          handleSubmit={modal.handleSubmit}
        />
      )}
    </div>
  );
}
