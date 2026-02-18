"use client";

import {
  type ReactNode,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useSoundContext } from "./sound-provider";

interface RetroWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  isClosing?: boolean;
  isMinimized?: boolean;
}

export function RetroWindow({
  title,
  children,
  className = "",
  onClose,
  onMinimize,
  isClosing = false,
  isMinimized = false,
}: RetroWindowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaxPos, setPreMaxPos] = useState({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);
  const [animReady, setAnimReady] = useState(false);
  const [animState, setAnimState] = useState<"opening" | "idle">("idle");
  const { playClick, playClose: playSoundClose } = useSoundContext();

  // Centraliza a janela na primeira renderização, depois dispara animação
  useEffect(() => {
    if (!initialized && windowRef.current) {
      const el = windowRef.current;
      // Mede o tamanho real sem transformação
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const x = Math.max(0, (window.innerWidth - w) / 2);
      const y = Math.max(0, (window.innerHeight - h) / 2 - 20);
      setPosition({ x, y });
      setInitialized(true);
      // Inicia animação no próximo frame (após centralizar)
      requestAnimationFrame(() => {
        setAnimReady(true);
        setAnimState("opening");
      });
    }
  }, [initialized]);

  // Remove classe de animação após completar
  useEffect(() => {
    if (animState === "opening") {
      const timer = setTimeout(() => setAnimState("idle"), 400);
      return () => clearTimeout(timer);
    }
  }, [animState]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Ignora se clicou em um botão da title bar ou se está maximizado
      if ((e.target as HTMLElement).closest("button")) return;
      if (isMaximized) return;

      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      e.preventDefault();
    },
    [position, isMaximized],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleToggleMaximize = () => {
    playClick();
    if (isMaximized) {
      setPosition(preMaxPos);
      setIsMaximized(false);
    } else {
      setPreMaxPos(position);
      setPosition({ x: 0, y: 0 });
      setIsMaximized(true);
    }
  };

  const handleMinimize = () => {
    playClick();
    onMinimize?.();
  };

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col border-2 border-[#4a1a6b] shadow-[3px_3px_0px_#2a0a3b] ${isClosing ? "retro-window-closing" : animState === "opening" ? "retro-window-opening" : ""} ${isMaximized ? "h-[calc(100%-40px)]! w-full! max-w-none!" : className}`}
      style={{
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        willChange: isDragging ? "transform" : undefined,
        visibility: animReady || isClosing ? "visible" : "hidden",
        display: isMinimized ? "none" : undefined,
        transition: isMaximized || initialized ? undefined : undefined,
      }}
    >
      {/* Title bar - draggable */}
      <div
        className="flex items-center justify-between px-2 py-1"
        style={{
          background: "linear-gradient(90deg, #7b2d8e, #4a6fa5, #7b2d8e)",
          cursor: isMaximized ? "default" : isDragging ? "grabbing" : "grab",
          userSelect: "none",
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="flex size-4 items-center justify-center border border-[#e8d0f0]/60 bg-[#5a1d7e] text-[10px] text-[#e8d0f0]">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="1" y="1" width="3" height="3" fill="#e8d0f0" />
              <rect x="6" y="1" width="3" height="3" fill="#e8d0f0" />
              <rect x="1" y="6" width="3" height="3" fill="#e8d0f0" />
              <rect x="6" y="6" width="3" height="3" fill="#e8d0f0" />
            </svg>
          </div>
          <span className="text-sm font-bold text-[#fff0fc] drop-shadow-[1px_1px_0px_#2a0a3b]">
            {title}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            className="flex size-5 items-center justify-center border border-[#e8d0f0]/40 bg-[#b898cc] text-xs text-[#1a0a2e] hover:bg-[#e8a4c8]"
            style={{
              boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #5a1d7e",
            }}
            aria-label="Minimizar"
            onClick={handleMinimize}
          >
            _
          </button>
          <button
            className="flex size-5 items-center justify-center border border-[#e8d0f0]/40 bg-[#b898cc] text-xs text-[#1a0a2e] hover:bg-[#e8a4c8]"
            style={{
              boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #5a1d7e",
            }}
            aria-label={isMaximized ? "Restaurar" : "Maximizar"}
            onClick={handleToggleMaximize}
          >
            {isMaximized ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect
                  x="0"
                  y="2"
                  width="7"
                  height="7"
                  stroke="#1a0a2e"
                  strokeWidth="1"
                  fill="none"
                />
                <rect
                  x="3"
                  y="0"
                  width="7"
                  height="7"
                  stroke="#1a0a2e"
                  strokeWidth="1"
                  fill="#b898cc"
                />
              </svg>
            ) : (
              <span className="inline-block size-2.5 border border-[#1a0a2e]" />
            )}
          </button>
          <button
            className="flex size-5 items-center justify-center border border-[#e8d0f0]/40 bg-[#e8a4c8] text-xs font-bold text-[#1a0a2e] hover:bg-[#ff80b0]"
            style={{
              boxShadow: "inset 1px 1px 0 #ffc0d8, inset -1px -1px 0 #7b2d8e",
            }}
            aria-label="Fechar"
            onClick={() => {
              playSoundClose();
              onClose?.();
            }}
          >
            X
          </button>
        </div>
      </div>
      {/* Menu bar */}
      <div className="flex gap-0 border-b border-[#7b2d8e] bg-[#d4b8e8]">
        <button
          onClick={playClick}
          className="border-r border-[#b898cc] px-3 py-0.5 text-sm text-[#1a0a2e] hover:bg-[#e8a4c8]"
        >
          Arquivo
        </button>
        <button
          onClick={playClick}
          className="border-r border-[#b898cc] px-3 py-0.5 text-sm text-[#1a0a2e] hover:bg-[#e8a4c8]"
        >
          Editar
        </button>
        <button
          onClick={playClick}
          className="border-r border-[#b898cc] px-3 py-0.5 text-sm text-[#1a0a2e] hover:bg-[#e8a4c8]"
        >
          Exibir
        </button>
        <button
          onClick={playClick}
          className="px-3 py-0.5 text-sm text-[#1a0a2e] hover:bg-[#e8a4c8]"
        >
          Ajuda
        </button>
      </div>
      {/* Content */}
      <div className="min-h-0 flex-1 bg-[#e8d0f0]">{children}</div>
    </div>
  );
}
