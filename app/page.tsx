"use client";

import { useState } from "react";
import { RetroWindow } from "@/components/retro-window";
import { RetroTabs } from "@/components/retro-tabs";
import { TabFinanceiro } from "@/components/tab-financeiro";
import { TabTarefas } from "@/components/tab-tarefas";
import { TabDashboard } from "@/components/tab-dashboard";
import { TabCredito } from "@/components/tab-credito";
import { DesktopIcons } from "@/components/desktop-icons";
import { Taskbar } from "@/components/taskbar";
import { LoginScreen } from "@/components/login-screen";
import { SoundProvider, useSoundContext } from "@/components/sound-provider";

const tabs = [
  { label: "Visão Geral", content: <TabDashboard /> },
  { label: "Movimentações", content: <TabFinanceiro /> },
  { label: "Cartão de Crédito", content: <TabCredito /> },
];

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <SoundProvider>
      <PageContent onLogout={() => setLoggedIn(false)} />
    </SoundProvider>
  );
}

function PageContent({ onLogout }: { onLogout: () => void }) {
  // Financeiro window
  const [windowOpen, setWindowOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Tarefas window
  const [tarefasOpen, setTarefasOpen] = useState(false);
  const [tarefasClosing, setTarefasClosing] = useState(false);
  const [tarefasMinimized, setTarefasMinimized] = useState(false);

  const { playOpen, playClose } = useSoundContext();

  // ── Financeiro window handlers ──
  const handleOpenWindow = () => {
    if (windowOpen) {
      // Se já está aberta mas minimizada, restaura
      setIsMinimized(false);
      return;
    }
    playOpen();
    setIsClosing(false);
    setIsMinimized(false);
    setWindowOpen(true);
  };

  const handleCloseWindow = () => {
    playClose();
    setIsClosing(true);
    setTimeout(() => {
      setWindowOpen(false);
      setIsClosing(false);
      setIsMinimized(false);
    }, 280);
  };

  const handleMinimizeWindow = () => {
    setIsMinimized(true);
  };

  // ── Tarefas window handlers ──
  const handleOpenTarefas = () => {
    if (tarefasOpen) {
      setTarefasMinimized(false);
      return;
    }
    playOpen();
    setTarefasClosing(false);
    setTarefasMinimized(false);
    setTarefasOpen(true);
  };

  const handleCloseTarefas = () => {
    playClose();
    setTarefasClosing(true);
    setTimeout(() => {
      setTarefasOpen(false);
      setTarefasClosing(false);
      setTarefasMinimized(false);
    }, 280);
  };

  const handleMinimizeTarefas = () => {
    setTarefasMinimized(true);
  };

  return (
    <div
      className="flex h-screen flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #7b2d8e 0%, #4a6fa5 40%, #e8a4c8 70%, #7b2d8e 100%)",
      }}
    >
      {/* Desktop area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Desktop icons - hidden on small screens */}
        <div className="hidden md:block">
          <DesktopIcons
            onOpenDocuments={handleOpenWindow}
            onOpenTarefas={handleOpenTarefas}
          />
        </div>

        {/* Financeiro window */}
        {windowOpen && (
          <RetroWindow
            title="Emily's Workspace"
            className="h-[90vh] w-[95vw] max-w-6xl"
            onClose={handleCloseWindow}
            onMinimize={handleMinimizeWindow}
            isClosing={isClosing}
            isMinimized={isMinimized}
          >
            <div className="flex h-full min-h-0 flex-col p-2">
              <RetroTabs tabs={tabs} />
            </div>
          </RetroWindow>
        )}

        {/* Tarefas window */}
        {tarefasOpen && (
          <RetroWindow
            title="Minhas Tarefas"
            className="h-[70vh] w-[90vw] max-w-3xl"
            onClose={handleCloseTarefas}
            onMinimize={handleMinimizeTarefas}
            isClosing={tarefasClosing}
            isMinimized={tarefasMinimized}
          >
            <div className="flex h-full min-h-0 flex-col p-2">
              <TabTarefas />
            </div>
          </RetroWindow>
        )}
      </div>

      {/* Taskbar */}
      <Taskbar
        onLogout={onLogout}
        windows={[
          ...(windowOpen
            ? [
                {
                  id: "financeiro",
                  title: "Emily's Workspace",
                  isMinimized,
                  onRestore: () => setIsMinimized(false),
                },
              ]
            : []),
          ...(tarefasOpen
            ? [
                {
                  id: "tarefas",
                  title: "Minhas Tarefas",
                  isMinimized: tarefasMinimized,
                  onRestore: () => setTarefasMinimized(false),
                },
              ]
            : []),
        ]}
      />
    </div>
  );
}
