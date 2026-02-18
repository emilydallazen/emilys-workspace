"use client";

import { useRef, useEffect, useState } from "react";
import { useSoundContext } from "../sound-provider";

interface RetroDropdownOption {
  value: string;
  label: string;
}

interface RetroDropdownProps {
  label: string;
  value: string;
  placeholder: string;
  options: RetroDropdownOption[];
  onSelect: (value: string) => void;
}

export function RetroDropdown({
  label,
  value,
  placeholder,
  options,
  onSelect,
}: RetroDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { playClick } = useSoundContext();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <div ref={ref} className="relative">
      <label className="mb-1 block text-sm text-[#3d1a5c]">{label}</label>
      <button
        type="button"
        onClick={() => {
          playClick();
          setOpen((v) => !v);
        }}
        className="flex w-full items-center justify-between border-2 border-t-[#3d1a5c] border-l-[#3d1a5c] border-b-[#e8d0f0] border-r-[#e8d0f0] bg-white px-3 py-1.5 text-left text-sm text-[#1a0a2e]"
      >
        <span className={value ? "" : "text-[#b898cc]"}>{selectedLabel}</span>
        <span className="ml-2 text-xs text-[#7b2d8e]">▼</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-0.5 max-h-36 w-full overflow-y-auto border-2 border-[#7b2d8e] bg-white shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                playClick();
                onSelect(opt.value);
                setOpen(false);
              }}
              className={`block w-full px-3 py-1 text-left text-sm hover:bg-[#e8d0f0] ${
                opt.value === value
                  ? "bg-[#7b2d8e] text-white"
                  : "text-[#1a0a2e]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
