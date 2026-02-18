"use client";

import { MONTH_LABELS, CURRENT_YEAR } from "@/lib/financeiro-types";
import { useSoundContext } from "../sound-provider";

interface MonthTabsProps {
  activeMonth: number;
  onMonthChange: (month: number) => void;
}

export function MonthTabs({ activeMonth, onMonthChange }: MonthTabsProps) {
  const { playTab } = useSoundContext();

  const handleClick = (index: number) => {
    if (index !== activeMonth) {
      playTab();
    }
    onMonthChange(index);
  };
  return (
    <div
      className="flex overflow-x-auto border-2 border-[#7b2d8e]"
      style={{
        boxShadow: "inset 1px 1px 0 #e8d0f0, inset -1px -1px 0 #7b2d8e",
      }}
    >
      {MONTH_LABELS.map((label, index) => (
        <button
          key={label}
          onClick={() => handleClick(index)}
          className={`flex-1 border-r border-[#7b2d8e] px-1 py-1.5 text-center text-sm transition-none last:border-r-0 ${
            activeMonth === index
              ? "bg-[#fff0fc] text-[#1a0a2e]"
              : "bg-[#b898cc] text-[#3d1a5c] hover:bg-[#d4b8e8]"
          }`}
          style={
            activeMonth === index
              ? {
                  boxShadow:
                    "inset 1px 1px 0 #fff0fc, inset -1px -1px 0 #7b2d8e",
                }
              : {
                  boxShadow:
                    "inset 1px 1px 0 #d4b8e8, inset -1px -1px 0 #7b2d8e",
                }
          }
        >
          {label}/{CURRENT_YEAR}
        </button>
      ))}
    </div>
  );
}
