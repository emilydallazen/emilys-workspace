"use client";

import { useEffect, useState } from "react";
import { useSoundContext } from "./sound-provider";

interface TaskbarWindow {
  id: string;
  title: string;
  isMinimized: boolean;
  onRestore: () => void;
}

interface TaskbarProps {
  windows?: TaskbarWindow[];
}

export function Taskbar({ windows = [] }: TaskbarProps) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");
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

  return (
    <div
      className="flex h-10 items-center justify-between border-t-2 border-[#e8d0f0] px-2"
      style={{
        background: "linear-gradient(180deg, #9b4dae, #7b2d8e, #5a1d6e)",
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {/* Start button */}
        <button
          onClick={playStartup}
          className="flex shrink-0 items-center gap-1.5 border-2 border-[#e8d0f0] px-3 py-0.5 text-sm font-bold text-[#fff0fc]"
          style={{
            background: "linear-gradient(180deg, #e8a4c8, #c878a8)",
            boxShadow: "inset 1px 1px 0 #ffc0d8, inset -1px -1px 0 #7b2d8e",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="0" y="0" width="6" height="6" fill="#4a6fa5" />
            <rect x="8" y="0" width="6" height="6" fill="#e8a4c8" />
            <rect x="0" y="8" width="6" height="6" fill="#7b2d8e" />
            <rect x="8" y="8" width="6" height="6" fill="#4a6fa5" />
          </svg>
          Iniciar
        </button>

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
