"use client";

import { useState } from "react";
import { useSoundContext } from "./sound-provider";

interface Tarefa {
  id: number;
  texto: string;
  concluida: boolean;
  prioridade: "alta" | "media" | "baixa";
}

const initialTarefas: Tarefa[] = [
  {
    id: 1,
    texto: "Enviar relatorio mensal para o cliente",
    concluida: false,
    prioridade: "alta",
  },
  {
    id: 2,
    texto: "Revisar contrato de prestacao de servicos",
    concluida: true,
    prioridade: "alta",
  },
  {
    id: 3,
    texto: "Atualizar planilha de despesas",
    concluida: false,
    prioridade: "media",
  },
  {
    id: 4,
    texto: "Agendar reuniao com equipe",
    concluida: false,
    prioridade: "media",
  },
  {
    id: 5,
    texto: "Fazer backup dos arquivos do projeto",
    concluida: true,
    prioridade: "baixa",
  },
  {
    id: 6,
    texto: "Responder e-mails pendentes",
    concluida: false,
    prioridade: "alta",
  },
  {
    id: 7,
    texto: "Organizar pasta de documentos",
    concluida: false,
    prioridade: "baixa",
  },
];

const prioridadeCores: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  alta: {
    bg: "var(--danger-light)",
    text: "var(--danger-dark)",
    border: "var(--danger)",
  },
  media: {
    bg: "var(--warning-light)",
    text: "var(--warning-dark)",
    border: "var(--warning)",
  },
  baixa: {
    bg: "var(--info-light)",
    text: "var(--info-dark)",
    border: "var(--info)",
  },
};

export function TabTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>(initialTarefas);
  const [novaTarefa, setNovaTarefa] = useState("");
  const { playClick, playConfirm, playClose } = useSoundContext();

  const toggleTarefa = (id: number) => {
    playClick();
    setTarefas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t)),
    );
  };

  const addTarefa = () => {
    if (!novaTarefa.trim()) return;
    playConfirm();
    setTarefas((prev) => [
      ...prev,
      {
        id: Date.now(),
        texto: novaTarefa,
        concluida: false,
        prioridade: "media",
      },
    ]);
    setNovaTarefa("");
  };

  const removeTarefa = (id: number) => {
    playClose();
    setTarefas((prev) => prev.filter((t) => t.id !== id));
  };

  const concluidas = tarefas.filter((t) => t.concluida).length;
  const total = tarefas.length;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Add task area */}
      <div className="flex shrink-0 gap-2">
        <input
          type="text"
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTarefa()}
          placeholder="Adicionar nova tarefa..."
          className="flex-1 border-2 border-[#7b2d8e] bg-[#fff0fc] px-3 py-1.5 text-base text-[#1a0a2e] placeholder:text-[#b898cc] focus:outline-none"
          style={{
            boxShadow: "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
          }}
        />
        <button
          onClick={addTarefa}
          className="border-2 border-[#7b2d8e] bg-[#e8a4c8] px-4 py-1.5 text-base text-[#1a0a2e] hover:bg-[#ff80b0] active:bg-[#d4b8e8]"
          style={{
            boxShadow: "inset 1px 1px 0 #ffc0d8, inset -1px -1px 0 #7b2d8e",
          }}
        >
          Adicionar
        </button>
      </div>

      {/* Progress */}
      <div
        className="shrink-0 border-2 border-[#7b2d8e] bg-[#d4b8e8] p-2"
        style={{
          boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e",
        }}
      >
        <div className="mb-1 flex justify-between text-sm text-[#3d1a5c]">
          <span>Progresso</span>
          <span>
            {concluidas}/{total} tarefas concluidas
          </span>
        </div>
        <div
          className="h-5 border-2 border-[#7b2d8e] bg-[#fff0fc]"
          style={{
            boxShadow: "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
          }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${total > 0 ? (concluidas / total) * 100 : 0}%`,
              background:
                "repeating-linear-gradient(90deg, #4a6fa5 0px, #4a6fa5 8px, #7b2d8e 8px, #7b2d8e 16px)",
            }}
          />
        </div>
      </div>

      {/* Task list */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col">
          {tarefas.map((t) => {
            const cor = prioridadeCores[t.prioridade];
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 border-b border-[#d4b8e8] px-2 py-2 hover:bg-[#e8d0f0]"
              >
                <button
                  onClick={() => toggleTarefa(t.id)}
                  className="flex size-5 shrink-0 items-center justify-center border-2 border-[#7b2d8e] bg-[#fff0fc] text-xs"
                  style={{
                    boxShadow:
                      "inset 1px 1px 0 #7b2d8e, inset -1px -1px 0 #e8d0f0",
                  }}
                  aria-label={
                    t.concluida
                      ? "Marcar como pendente"
                      : "Marcar como concluida"
                  }
                >
                  {t.concluida && (
                    <span className="text-[#7b2d8e]">&#10003;</span>
                  )}
                </button>
                <span
                  className={`flex-1 text-base ${
                    t.concluida
                      ? "text-[#b898cc] line-through"
                      : "text-[#1a0a2e]"
                  }`}
                >
                  {t.texto}
                </span>
                <span
                  className="border px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: cor.bg,
                    color: cor.text,
                    borderColor: cor.border,
                  }}
                >
                  {t.prioridade}
                </span>
                <button
                  onClick={() => removeTarefa(t.id)}
                  className="flex size-5 shrink-0 items-center justify-center border border-[#b898cc] bg-[#e8d0f0] text-xs text-danger hover:bg-danger-light"
                  aria-label="Remover tarefa"
                >
                  X
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status bar */}
      <div
        className="shrink-0 flex items-center justify-between border-2 border-[#7b2d8e] bg-[#d4b8e8] px-3 py-1 text-sm text-[#3d1a5c]"
        style={{
          boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e",
        }}
      >
        <span>
          {total - concluidas} pendente(s) | {concluidas} concluida(s)
        </span>
        <span>
          {Math.round(total > 0 ? (concluidas / total) * 100 : 0)}% completo
        </span>
      </div>
    </div>
  );
}
