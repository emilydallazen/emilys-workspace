"use client";

import { RetroDropdown } from "./retro-dropdown";
import { formatCurrency } from "@/lib/financeiro-types";
import { useSoundContext } from "../sound-provider";

interface TransactionModalProps {
  modalTipo: "debito" | "credito";
  novoTipo: "entrada" | "saida";
  novaData: string;
  novaDesc: string;
  novoValor: string;
  novaCategoria: string;
  novaSubcategoria: string;
  novaParcelas: string;
  categorias: string[];
  subcategoriaOptions: string[];
  recorrente: boolean;
  setNovaData: (v: string) => void;
  setNovaDesc: (v: string) => void;
  setNovoValor: (v: string) => void;
  setNovaParcelas: (v: string) => void;
  setNovaSubcategoria: (v: string) => void;
  setRecorrente: (v: boolean) => void;
  switchTipo: (tipo: "entrada" | "saida") => void;
  selectCategoria: (cat: string) => void;
  closeModal: () => void;
  handleSubmit: () => void;
}

export function TransactionModal({
  modalTipo,
  novoTipo,
  novaData,
  novaDesc,
  novoValor,
  novaCategoria,
  novaSubcategoria,
  novaParcelas,
  categorias,
  subcategoriaOptions,
  recorrente,
  setNovaData,
  setNovaDesc,
  setNovoValor,
  setNovaParcelas,
  setNovaSubcategoria,
  setRecorrente,
  switchTipo,
  selectCategoria,
  closeModal,
  handleSubmit,
}: TransactionModalProps) {
  const {
    playClick,
    playClose: playSoundClose,
    playConfirm,
  } = useSoundContext();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex w-full max-w-md flex-col border-2 border-[#4a1a6b] shadow-[3px_3px_0px_#2a0a3b]">
        {/* Modal title bar */}
        <div
          className="flex items-center justify-between px-2 py-1"
          style={{
            background: "linear-gradient(90deg, #7b2d8e, #4a6fa5, #7b2d8e)",
          }}
        >
          <div className="flex items-center gap-2">
            <div className="flex size-4 items-center justify-center border border-[#e8d0f0]/60 bg-[#5a1d7e] text-[10px] text-[#e8d0f0]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="1" y="1" width="3" height="3" fill="#e8d0f0" />
                <rect x="6" y="1" width="3" height="3" fill="#e8d0f0" />
                <rect x="1" y="6" width="3" height="3" fill="#e8d0f0" />
                <rect x="6" y="6" width="3" height="3" fill="#e8d0f0" />
              </svg>
            </div>
            <span className="text-sm font-bold text-[#fff0fc] drop-shadow-[1px_1px_0px_#2a0a3b]">
              {modalTipo === "credito"
                ? "Nova Compra no Crédito"
                : "Nova Movimentação (Débito)"}
            </span>
          </div>
          <button
            onClick={() => {
              playSoundClose();
              closeModal();
            }}
            className="flex size-5 items-center justify-center border border-[#e8d0f0]/40 bg-[#e8a4c8] text-xs font-bold text-[#1a0a2e] hover:bg-[#ff80b0]"
            style={{
              boxShadow: "inset 1px 1px 0 #ffc0d8, inset -1px -1px 0 #7b2d8e",
            }}
            aria-label="Fechar"
          >
            X
          </button>
        </div>

        {/* Modal content */}
        <div className="flex flex-col gap-4 bg-[#e8d0f0] p-4">
          {/* Tipo toggle — somente no débito */}
          {modalTipo === "debito" ? (
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#3d1a5c]">Tipo</label>
              <div className="flex">
                <button
                  onClick={() => {
                    playClick();
                    switchTipo("entrada");
                  }}
                  className={`flex-1 border-2 px-3 py-1.5 text-base transition-none ${
                    novoTipo === "entrada"
                      ? "border-positive bg-positive-light text-positive-dark"
                      : "border-[#7b2d8e] bg-[#fff0fc] text-[#3d1a5c] hover:bg-[#e8d0f0]"
                  }`}
                  style={{
                    boxShadow:
                      novoTipo === "entrada"
                        ? "inset 1px 1px 0 var(--positive), inset -1px -1px 0 var(--positive-lighter)"
                        : "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
                  }}
                >
                  ▲ Entrada
                </button>
                <button
                  onClick={() => {
                    playClick();
                    switchTipo("saida");
                  }}
                  className={`flex-1 border-2 border-l-0 px-3 py-1.5 text-base transition-none ${
                    novoTipo === "saida"
                      ? "border-danger bg-danger-light text-danger-dark"
                      : "border-[#7b2d8e] bg-[#fff0fc] text-[#3d1a5c] hover:bg-[#e8d0f0]"
                  }`}
                  style={{
                    boxShadow:
                      novoTipo === "saida"
                        ? "inset 1px 1px 0 var(--danger), inset -1px -1px 0 var(--danger-lighter)"
                        : "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
                  }}
                >
                  ▼ Saída
                </button>
              </div>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 border-2 border-warning bg-warning-light px-3 py-2 text-sm text-warning-dark"
              style={{
                boxShadow:
                  "inset 1px 1px 0 var(--warning-lighter), inset -1px -1px 0 var(--warning)",
              }}
            >
              💳 Compra no Crédito (será registrada como saída parcelada)
            </div>
          )}

          {/* Categoria */}
          <RetroDropdown
            label="Categoria"
            value={novaCategoria}
            placeholder="Selecione..."
            options={categorias.map((c) => ({ value: c, label: c }))}
            onSelect={selectCategoria}
          />

          {/* Subcategoria */}
          <RetroDropdown
            label="Subcategoria"
            value={novaSubcategoria}
            placeholder="Selecione..."
            options={subcategoriaOptions.map((s) => ({ value: s, label: s }))}
            onSelect={setNovaSubcategoria}
          />

          {/* Data */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#3d1a5c]">Data</label>
            <input
              type="date"
              value={novaData}
              onChange={(e) => setNovaData(e.target.value)}
              className="border-2 border-[#7b2d8e] bg-[#fff0fc] px-3 py-1.5 text-base text-[#1a0a2e] focus:outline-none"
              style={{
                boxShadow: "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
              }}
            />
          </div>

          {/* Descricao */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#3d1a5c]">Descricao</label>
            <input
              type="text"
              value={novaDesc}
              onChange={(e) => setNovaDesc(e.target.value)}
              placeholder="Ex: Pagamento de servico..."
              className="border-2 border-[#7b2d8e] bg-[#fff0fc] px-3 py-1.5 text-base text-[#1a0a2e] placeholder:text-[#b898cc] focus:outline-none"
              style={{
                boxShadow: "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
              }}
            />
          </div>

          {/* Valor */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#3d1a5c]">
              {modalTipo === "credito" ? "Valor Total (R$)" : "Valor (R$)"}
            </label>
            <input
              type="text"
              value={novoValor}
              onChange={(e) => setNovoValor(e.target.value)}
              placeholder="0,00"
              className="border-2 border-[#7b2d8e] bg-[#fff0fc] px-3 py-1.5 text-base text-[#1a0a2e] placeholder:text-[#b898cc] focus:outline-none"
              style={{
                boxShadow: "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
              }}
            />
          </div>

          {/* Parcelas / Recorrente — somente no crédito */}
          {modalTipo === "credito" && (
            <>
              {/* Toggle Recorrente */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#3d1a5c]">
                  Tipo de Cobrança
                </label>
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setRecorrente(false);
                    }}
                    className={`flex-1 border-2 px-3 py-1.5 text-base transition-none ${
                      !recorrente
                        ? "border-[#7b2d8e] bg-[#7b2d8e] text-[#fff0fc]"
                        : "border-[#7b2d8e] bg-[#fff0fc] text-[#3d1a5c] hover:bg-[#e8d0f0]"
                    }`}
                    style={{
                      boxShadow: !recorrente
                        ? "inset 1px 1px 0 #9b4dae, inset -1px -1px 0 #4a1a6b"
                        : "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
                    }}
                  >
                    Parcelado
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setRecorrente(true);
                    }}
                    className={`flex-1 border-2 border-l-0 px-3 py-1.5 text-base transition-none ${
                      recorrente
                        ? "border-info bg-info-light text-info-dark"
                        : "border-[#7b2d8e] bg-[#fff0fc] text-[#3d1a5c] hover:bg-[#e8d0f0]"
                    }`}
                    style={{
                      boxShadow: recorrente
                        ? "inset 1px 1px 0 var(--info), inset -1px -1px 0 var(--info-lighter)"
                        : "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
                    }}
                  >
                    🔄 Recorrente
                  </button>
                </div>
              </div>

              {recorrente ? (
                <div
                  className="flex items-center gap-2 border-2 border-info bg-info-light px-3 py-2 text-sm text-info-dark"
                  style={{
                    boxShadow:
                      "inset 1px 1px 0 var(--info-lighter), inset -1px -1px 0 var(--info)",
                  }}
                >
                  🔄 Esta cobrança aparecerá automaticamente em todos os meses a
                  partir da data selecionada.
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#3d1a5c]">Parcelas</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="48"
                      value={novaParcelas}
                      onChange={(e) => setNovaParcelas(e.target.value)}
                      className="w-20 border-2 border-[#7b2d8e] bg-[#fff0fc] px-3 py-1.5 text-center text-base text-[#1a0a2e] focus:outline-none"
                      style={{
                        boxShadow:
                          "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
                      }}
                    />
                    <span className="text-sm text-[#3d1a5c]">x</span>
                    <span
                      className="border-2 border-[#7b2d8e] bg-[#d4b8e8] px-3 py-1.5 text-base text-[#3d1a5c]"
                      style={{
                        boxShadow:
                          "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e",
                      }}
                    >
                      R${" "}
                      {formatCurrency(
                        (parseFloat(novoValor.replace(",", ".")) || 0) /
                          Math.max(1, parseInt(novaParcelas) || 1),
                      )}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => {
                playSoundClose();
                closeModal();
              }}
              className="border-2 border-[#7b2d8e] bg-[#d4b8e8] px-4 py-1.5 text-base text-[#3d1a5c] hover:bg-[#b898cc]"
              style={{
                boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                playConfirm();
                handleSubmit();
              }}
              className="border-2 border-[#7b2d8e] bg-[#e8a4c8] px-4 py-1.5 text-base text-[#1a0a2e] hover:bg-[#ff80b0] active:bg-[#d4b8e8]"
              style={{
                boxShadow: "inset 1px 1px 0 #ffc0d8, inset -1px -1px 0 #7b2d8e",
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
