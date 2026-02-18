"use client";

import { useState, useEffect, useCallback } from "react";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [phase, setPhase] = useState<"boot" | "login" | "logging-in">("boot");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  // Boot sequence
  useEffect(() => {
    const lines = [
      "EmilyOS v2.6 [Build 2026.02.18]",
      "",
      "Checking memory... 640K OK",
      "Extended memory... 32768K OK",
      "",
      "Loading system drivers...",
      "  ✓ keyboard.sys",
      "  ✓ mouse.sys",
      "  ✓ display.sys",
      "  ✓ sound.sys",
      "",
      "Initializing workspace modules...",
      "  ✓ financeiro.dll",
      "  ✓ tarefas.dll",
      "  ✓ dashboard.dll",
      "",
      "Starting EmilyOS...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setBootLines((prev) => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase("login"), 600);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!username.trim()) return;
      setPhase("logging-in");
      setTimeout(() => {
        onLogin();
      }, 1200);
    },
    [username, onLogin],
  );

  // Boot phase
  if (phase === "boot") {
    return (
      <div className="flex h-screen flex-col bg-[#0a0020] p-6 font-mono">
        <div className="flex-1 overflow-hidden">
          {bootLines.map((line, i) => (
            <div
              key={i}
              className="text-sm leading-relaxed text-[#b898cc]"
              style={{ textShadow: "0 0 4px #7b2d8e" }}
            >
              {line || "\u00A0"}
            </div>
          ))}
          <span
            className="inline-block h-4 w-2 bg-[#e8a4c8]"
            style={{
              opacity: showCursor ? 1 : 0,
              boxShadow: "0 0 6px #e8a4c8",
            }}
          />
        </div>
      </div>
    );
  }

  // Login phase
  return (
    <div
      className="flex h-screen flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, #1a0a2e 0%, #2a1050 30%, #4a1a6b 60%, #1a0a2e 100%)",
      }}
    >
      {/* Login window */}
      <div
        className="w-105 border-2 border-[#4a1a6b] shadow-[4px_4px_0px_#0a0020]"
        style={{
          animation: phase === "logging-in" ? undefined : "fadeInLogin 0.4s ease-out",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-2 px-3 py-1.5"
          style={{
            background: "linear-gradient(90deg, #7b2d8e, #4a6fa5, #7b2d8e)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="6" r="3" fill="#e8d0f0" />
            <path d="M3 14 C3 10 13 10 13 14" fill="#e8d0f0" />
          </svg>
          <span className="text-sm font-bold text-[#fff0fc] drop-shadow-[1px_1px_0px_#2a0a3b]">
            Bem-vindo ao EmilyOS
          </span>
        </div>

        {/* Content */}
        <div className="bg-[#d4b8e8] p-6">
          {/* User avatar */}
          <div className="mb-5 flex flex-col items-center gap-3">
            <div
              className="flex size-20 items-center justify-center border-2 border-[#7b2d8e] bg-[#e8d0f0]"
              style={{
                boxShadow:
                  "inset 2px 2px 0 #fff0fc, inset -2px -2px 0 #b898cc",
              }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="18" r="9" fill="#7b2d8e" />
                <path
                  d="M8 44 C8 32 40 32 40 44"
                  fill="#7b2d8e"
                  stroke="#4a1a6b"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <span className="text-sm text-[#3d1a5c]">
              Insira suas credenciais para continuar
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Username field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#1a0a2e]">Usuário:</label>
              <div
                className="border-2 border-[#7b2d8e] bg-[#fff0fc]"
                style={{
                  boxShadow:
                    "inset 1px 1px 0 #b898cc, inset -1px -1px 0 #fff",
                }}
              >
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent px-2 py-1.5 text-sm text-[#1a0a2e] outline-none"
                  placeholder="emily"
                  autoFocus
                  disabled={phase === "logging-in"}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#1a0a2e]">Senha:</label>
              <div
                className="border-2 border-[#7b2d8e] bg-[#fff0fc]"
                style={{
                  boxShadow:
                    "inset 1px 1px 0 #b898cc, inset -1px -1px 0 #fff",
                }}
              >
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent px-2 py-1.5 text-sm text-[#1a0a2e] outline-none"
                  placeholder="••••••"
                  disabled={phase === "logging-in"}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="submit"
                disabled={phase === "logging-in"}
                className="border-2 border-[#7b2d8e] bg-[#e8a4c8] px-6 py-1.5 text-sm font-bold text-[#1a0a2e] hover:bg-[#ff80b0] disabled:opacity-50"
                style={{
                  boxShadow:
                    "inset 1px 1px 0 #ffc0d8, inset -1px -1px 0 #7b2d8e",
                }}
              >
                {phase === "logging-in" ? "Entrando..." : "OK"}
              </button>
              <button
                type="button"
                disabled={phase === "logging-in"}
                className="border-2 border-[#7b2d8e] bg-[#b898cc] px-4 py-1.5 text-sm text-[#1a0a2e] hover:bg-[#d4b8e8] disabled:opacity-50"
                style={{
                  boxShadow:
                    "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #5a1d7e",
                }}
                onClick={() => {
                  setUsername("");
                  setPassword("");
                }}
              >
                Cancelar
              </button>
            </div>
          </form>

          {/* Logging-in feedback */}
          {phase === "logging-in" && (
            <div className="mt-4 flex items-center gap-2 border border-[#7b2d8e] bg-[#e8d0f0] p-2">
              <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-3 w-2 bg-[#4a6fa5]"
                    style={{
                      animation: `loginProgress 1s steps(1) ${i * 0.2}s infinite`,
                      opacity: 0.3,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-[#3d1a5c]">
                Carregando perfil do usuário...
              </span>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center border-t border-[#7b2d8e] bg-[#b898cc] px-3 py-1">
          <span className="text-xs text-[#3d1a5c]">EmilyOS • Pronto</span>
        </div>
      </div>

      {/* OS branding */}
      <div className="mt-8 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
            <rect x="0" y="0" width="6" height="6" fill="#4a6fa5" />
            <rect x="8" y="0" width="6" height="6" fill="#e8a4c8" />
            <rect x="0" y="8" width="6" height="6" fill="#7b2d8e" />
            <rect x="8" y="8" width="6" height="6" fill="#4a6fa5" />
          </svg>
          <span className="text-lg font-bold text-[#e8d0f0] drop-shadow-[1px_1px_0px_#0a0020]">
            EmilyOS
          </span>
        </div>
        <span className="text-xs text-[#b898cc]/70">
          © 2026 Emily Corporation. Todos os direitos reservados.
        </span>
      </div>
    </div>
  );
}
