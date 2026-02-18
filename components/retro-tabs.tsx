"use client";

import { useState } from "react";
import { useSoundContext } from "./sound-provider";

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface RetroTabsProps {
  tabs: Tab[];
}

export function RetroTabs({ tabs }: RetroTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const { playTab } = useSoundContext();

  const handleTabClick = (index: number) => {
    if (index !== activeTab) {
      playTab();
    }
    setActiveTab(index);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Tab headers */}
      <div className="flex items-end gap-0 pl-2 pt-2">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => handleTabClick(index)}
            className={`relative px-4 py-1.5 text-base transition-none ${
              activeTab === index
                ? "z-10 -mb-px border-2 border-b-0 border-[#7b2d8e] bg-[#fff0fc] text-[#1a0a2e]"
                : "border-2 border-b-0 border-[#b898cc] bg-[#b898cc] text-[#3d1a5c] hover:bg-[#d4b8e8]"
            }`}
            style={
              activeTab === index
                ? {
                    boxShadow:
                      "inset 1px 1px 0 #fff0fc, inset -1px 0 0 #7b2d8e",
                  }
                : {
                    boxShadow:
                      "inset 1px 1px 0 #d4b8e8, inset -1px 0 0 #7b2d8e",
                  }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className="min-h-0 flex-1 overflow-y-auto border-2 border-[#7b2d8e] bg-[#fff0fc] p-4"
        style={{
          boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #b898cc",
        }}
      >
        {tabs[activeTab].content}
      </div>
    </div>
  );
}
