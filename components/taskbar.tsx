"use client";

import { useEffect, useRef, useState } from "react";
import { useSoundContext } from "./sound-provider";

interface TaskbarWindow {
  id: string;
  title: string;
  isMinimized: boolean;
  onRestore: () => void;
}

interface TaskbarProps {
  windows?: TaskbarWindow[];
  onLogout?: () => void;
}

export function Taskbar({ windows = [], onLogout }: TaskbarProps) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");
  const [startOpen, setStartOpen] = useState(false);
  const startRef = useRef<HTMLDivElement>(null);
  const { playStartup, playClick } = useSoundContext();

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Fecha menu Iniciar ao clicar fora
  useEffect(() => {
    if (!startOpen) return;
    const handler = (e: MouseEvent) => {
      if (startRef.current && !startRef.current.contains(e.target as Node)) {
        setStartOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [startOpen]);

  return (
    <div
      className="flex h-10 items-center justify-between border-t-2 border-[#e8d0f0] px-2"
      style={{
        background: "linear-gradient(180deg, #9b4dae, #7b2d8e, #5a1d6e)",
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {/* Start button + menu */}
        <div ref={startRef} className="relative shrink-0">
          <button
            onClick={() => {
              playStartup();
              setStartOpen((v) => !v);
            }}
            className="flex items-center gap-1.5 border-2 border-[#e8d0f0] px-3 py-0.5 text-sm font-bold text-[#fff0fc]"
            style={{
              background: startOpen
                ? "linear-gradient(180deg, #c878a8, #a85888)"
                : "linear-gradient(180deg, #e8a4c8, #c878a8)",
              boxShadow: startOpen
                ? "inset -1px -1px 0 #ffc0d8, inset 1px 1px 0 #7b2d8e"
                : "inset 1px 1px 0 #ffc0d8, inset -1px -1px 0 #7b2d8e",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              {/* Pétalas */}
              <ellipse cx="12" cy="5.5" rx="3" ry="4.5" fill="#ffc0d8" />
              <ellipse cx="12" cy="18.5" rx="3" ry="4.5" fill="#ffc0d8" />
              <ellipse cx="5.5" cy="12" rx="4.5" ry="3" fill="#e8a4c8" />
              <ellipse cx="18.5" cy="12" rx="4.5" ry="3" fill="#e8a4c8" />
              <ellipse
                cx="7.3"
                cy="7.3"
                rx="3"
                ry="4.5"
                transform="rotate(-45 7.3 7.3)"
                fill="#ff80b0"
              />
              <ellipse
                cx="16.7"
                cy="16.7"
                rx="3"
                ry="4.5"
                transform="rotate(-45 16.7 16.7)"
                fill="#ff80b0"
              />
              <ellipse
                cx="16.7"
                cy="7.3"
                rx="3"
                ry="4.5"
                transform="rotate(45 16.7 7.3)"
                fill="#d4b8e8"
              />
              <ellipse
                cx="7.3"
                cy="16.7"
                rx="3"
                ry="4.5"
                transform="rotate(45 7.3 16.7)"
                fill="#d4b8e8"
              />
              {/* Centro */}
              <circle cx="12" cy="12" r="3.5" fill="#e8c840" />
              <circle cx="12" cy="12" r="2" fill="#f0d860" />
            </svg>
            Iniciar
          </button>

          {/* Start menu */}
          {startOpen && (
            <div
              className="absolute bottom-full left-0 mb-0.5 w-56 border-2 border-[#4a1a6b] shadow-[3px_-3px_0px_#2a0a3b]"
              style={{ animation: "fadeInLogin 0.15s ease-out" }}
            >
              {/* Menu sidebar */}
              <div className="flex">
                <div
                  className="flex w-7 shrink-0 items-end justify-center pb-2"
                  style={{
                    background: "linear-gradient(180deg, #4a6fa5, #7b2d8e)",
                  }}
                >
                  <span
                    className="text-xs font-bold text-[#fff0fc] drop-shadow-[1px_1px_0px_#0a0020]"
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                    }}
                  >
                    EmilyOS
                  </span>
                </div>

                {/* Menu items */}
                <div className="flex-1 bg-[#d4b8e8]">
                  <button
                    onClick={() => {
                      playClick();
                      setStartOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm text-[#1a0a2e] hover:bg-[#7b2d8e] hover:text-[#fff0fc]"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect
                        x="2"
                        y="2"
                        width="12"
                        height="12"
                        rx="1"
                        fill="#e8d0f0"
                        stroke="#7b2d8e"
                        strokeWidth="1"
                      />
                      <rect x="4" y="5" width="8" height="1" fill="#7b2d8e" />
                      <rect x="4" y="8" width="6" height="1" fill="#b898cc" />
                      <rect x="4" y="11" width="7" height="1" fill="#b898cc" />
                    </svg>
                    Programas
                  </button>

                  <button
                    onClick={() => {
                      playClick();
                      setStartOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm text-[#1a0a2e] hover:bg-[#7b2d8e] hover:text-[#fff0fc]"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle
                        cx="8"
                        cy="8"
                        r="6"
                        fill="#e8d0f0"
                        stroke="#7b2d8e"
                        strokeWidth="1"
                      />
                      <path
                        d="M8 4 L8 8 L11 10"
                        stroke="#7b2d8e"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                    Documentos recentes
                  </button>

                  <button
                    onClick={() => {
                      playClick();
                      setStartOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm text-[#1a0a2e] hover:bg-[#7b2d8e] hover:text-[#fff0fc]"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect
                        x="2"
                        y="3"
                        width="12"
                        height="10"
                        rx="1"
                        fill="#e8d0f0"
                        stroke="#7b2d8e"
                        strokeWidth="1"
                      />
                      <circle cx="8" cy="8" r="3" fill="#4a6fa5" />
                      <path
                        d="M6 8 L7.5 9.5 L10 6.5"
                        stroke="#fff"
                        strokeWidth="1"
                        fill="none"
                      />
                    </svg>
                    Configurações
                  </button>

                  {/* Separator */}
                  <div className="mx-2 my-1 border-t border-[#7b2d8e]" />

                  {/* Logout */}
                  <button
                    onClick={() => {
                      playClick();
                      setStartOpen(false);
                      onLogout?.();
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm text-[#1a0a2e] hover:bg-[#7b2d8e] hover:text-[#fff0fc]"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect
                        x="1"
                        y="2"
                        width="10"
                        height="12"
                        rx="1"
                        fill="#e8d0f0"
                        stroke="#7b2d8e"
                        strokeWidth="1"
                      />
                      <path d="M8 8 L15 8" stroke="#c44" strokeWidth="2" />
                      <path
                        d="M12 5 L15 8 L12 11"
                        stroke="#c44"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                    Fazer Logoff
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active window buttons */}
        {windows.map((win) => (
          <button
            key={win.id}
            onClick={() => {
              playClick();
              win.onRestore();
            }}
            className={`flex min-w-0 max-w-50 items-center gap-1.5 border px-3 py-0.5 text-sm ${
              win.isMinimized
                ? "border-[#5a1d6e] bg-[#5a1d6e]/30 text-[#b898cc]"
                : "border-[#5a1d6e] bg-[#5a1d6e]/50 text-[#e8d0f0]"
            }`}
            style={{
              boxShadow: win.isMinimized
                ? "inset 1px 1px 0 #3a0d4e, inset -1px -1px 0 #9b4dae"
                : "inset -1px -1px 0 #3a0d4e, inset 1px 1px 0 #9b4dae",
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="shrink-0"
            >
              <rect x="1" y="1" width="3" height="3" fill="#e8a4c8" />
              <rect x="6" y="1" width="3" height="3" fill="#e8a4c8" />
              <rect x="1" y="6" width="3" height="3" fill="#e8a4c8" />
              <rect x="6" y="6" width="3" height="3" fill="#e8a4c8" />
            </svg>
            <span className="truncate">{win.title}</span>
          </button>
        ))}
      </div>

      {/* System tray */}
      <div
        className="flex items-center gap-3 border border-[#5a1d6e] px-3 py-0.5"
        style={{
          boxShadow: "inset 1px 1px 0 #3a0d4e, inset -1px -1px 0 #9b4dae",
        }}
      >
        <div className="flex gap-1">
          <div className="size-2.5 rounded-full bg-[#4a6fa5]" />
          <div className="size-2.5 rounded-full bg-[#e8a4c8]" />
        </div>
        <span className="text-sm text-[#e8d0f0]" suppressHydrationWarning>
          {mounted ? time : "\u00A0\u00A0\u00A0\u00A0\u00A0"}
        </span>
      </div>
    </div>
  );
}
