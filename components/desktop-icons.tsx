"use client";

import { useSoundContext } from "./sound-provider";

interface DesktopIconsProps {
  onOpenDocuments?: () => void;
  onOpenTarefas?: () => void;
}

const icons = [
  {
    id: "meu-computador",
    label: "Meu Computador",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect
          x="4"
          y="4"
          width="24"
          height="16"
          rx="1"
          fill="#4a6fa5"
          stroke="#1a0a2e"
          strokeWidth="2"
        />
        <rect x="6" y="6" width="20" height="12" fill="#c8daf0" />
        <rect
          x="12"
          y="20"
          width="8"
          height="3"
          fill="#b898cc"
          stroke="#1a0a2e"
          strokeWidth="1"
        />
        <rect
          x="8"
          y="23"
          width="16"
          height="3"
          rx="1"
          fill="#b898cc"
          stroke="#1a0a2e"
          strokeWidth="1"
        />
      </svg>
    ),
  },
  {
    id: "meu-financeiro",
    label: "Meu financeiro",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M4 8 L4 28 L28 28 L28 10 L16 10 L14 8 Z"
          fill="#e8a4c8"
          stroke="#7b2d8e"
          strokeWidth="2"
        />
        <path d="M4 12 L28 12 L28 28 L4 28 Z" fill="#ffc0d8" />
      </svg>
    ),
  },
  {
    id: "minhas-tarefas",
    label: "Minhas Tarefas",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect
          x="5"
          y="3"
          width="22"
          height="26"
          rx="1"
          fill="#e8d0f0"
          stroke="#7b2d8e"
          strokeWidth="2"
        />
        <rect x="9" y="7" width="14" height="2" fill="#7b2d8e" />
        <rect x="9" y="12" width="14" height="1.5" fill="#b898cc" />
        <rect x="9" y="16" width="14" height="1.5" fill="#b898cc" />
        <rect x="9" y="20" width="14" height="1.5" fill="#b898cc" />
        <rect x="9" y="24" width="10" height="1.5" fill="#b898cc" />
        <path
          d="M6 11 L8 13 L11 9"
          stroke="#4a6fa5"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M6 15 L8 17 L11 13"
          stroke="#4a6fa5"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    ),
  },
  {
    id: "lixeira",
    label: "Lixeira",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect
          x="8"
          y="8"
          width="16"
          height="20"
          rx="1"
          fill="#d4b8e8"
          stroke="#7b2d8e"
          strokeWidth="2"
        />
        <rect
          x="6"
          y="6"
          width="20"
          height="3"
          rx="1"
          fill="#b898cc"
          stroke="#7b2d8e"
          strokeWidth="1"
        />
        <rect
          x="13"
          y="4"
          width="6"
          height="3"
          fill="#b898cc"
          stroke="#7b2d8e"
          strokeWidth="1"
        />
        <line
          x1="12"
          y1="12"
          x2="12"
          y2="24"
          stroke="#7b2d8e"
          strokeWidth="1.5"
        />
        <line
          x1="16"
          y1="12"
          x2="16"
          y2="24"
          stroke="#7b2d8e"
          strokeWidth="1.5"
        />
        <line
          x1="20"
          y1="12"
          x2="20"
          y2="24"
          stroke="#7b2d8e"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
];

export function DesktopIcons({
  onOpenDocuments,
  onOpenTarefas,
}: DesktopIconsProps) {
  const { playClick, playOpen } = useSoundContext();

  const handleClick = (id: string) => {
    if (id === "meu-financeiro" && onOpenDocuments) {
      onOpenDocuments();
    }
    if (id === "minhas-tarefas" && onOpenTarefas) {
      onOpenTarefas();
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {icons.map((item) => (
        <button
          key={item.label}
          onClick={playClick}
          onDoubleClick={() => handleClick(item.id)}
          className="flex w-20 flex-col items-center gap-1 focus:outline-none"
        >
          <div className="flex size-12 items-center justify-center">
            {item.icon}
          </div>
          <span className="rounded-sm px-1 text-center text-xs text-[#fff0fc] drop-shadow-[1px_1px_0px_#1a0a2e] hover:bg-[#4a6fa5]/50">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
