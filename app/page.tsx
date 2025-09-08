"use client";

import React from "react";
import timelineItems from "../content/timeline.json";
import { Timeline } from "../components/Timeline";
import type { TimelineItem } from "../components/Timeline";

export default function Home() {
  const items = timelineItems as TimelineItem[];

  const [selectedDomains, setSelectedDomains] = React.useState<string[]>([]);
  const [maxLevel, setMaxLevel] = React.useState<number>(1);
  const [showFilters, setShowFilters] = React.useState(false);
  const [anchor, setAnchor] = React.useState<{ left: number; top: number } | null>(null);

  React.useEffect(() => {
    const handler = (e: Event) => {
      // CustomEvent with {left, top}
      const ce = e as CustomEvent<{ left: number; top: number }>;
      const detail = ce.detail;
      if (detail) {
        const panelWidth = 320; // px
        const vw = typeof window !== "undefined" ? window.innerWidth : panelWidth + 16;
        const left = Math.max(8, Math.min(detail.left, vw - panelWidth - 8));
        const top = detail.top + 8;
        setAnchor({ left, top });
      }
      setShowFilters((v) => !v);
    };
    window.addEventListener("toggleFilters", handler as EventListener);
    return () => window.removeEventListener("toggleFilters", handler as EventListener);
  }, []);

  const allDomains = React.useMemo(() => {
    const s = new Set<string>();
    items.forEach((it) => it.domains?.forEach((d) => s.add(d)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const maxLevelCap = React.useMemo(() => {
    return Math.max(1, ...items.map((it) => (typeof it.level === "number" ? it.level : 0)));
  }, [items]);

  const toggleDomain = (d: string) => {
    setSelectedDomains((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const clearFilters = () => {
    setSelectedDomains([]);
    setMaxLevel(1);
  };

  return (
    <div className="py-4">
      {showFilters && (
        <div
          className="fixed z-20 w-80 max-w-[90vw] rounded-md border border-white/10 bg-neutral-950/95 backdrop-blur p-4 shadow-lg"
          style={{ left: anchor?.left ?? 16, top: anchor?.top ?? 80 }}
        >
          <div className="flex items-center mb-3">
            <h2 className="text-sm font-medium flex-1">Filters</h2>
            <button
              className="text-xs rounded px-2 py-1 bg-white/5 text-neutral-200 border border-white/10 hover:bg-white/10"
              onClick={() => setShowFilters(false)}
            >
              Close
            </button>
          </div>

          <div className="mb-4">
            <div className="text-xs text-neutral-400 mb-2">Domains</div>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-auto pr-1">
              {allDomains.map((d) => (
                <label key={d} className="flex items-center gap-1 text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    className="accent-white/80"
                    checked={selectedDomains.includes(d)}
                    onChange={() => toggleDomain(d)}
                  />
                  <span className="px-1 py-0.5 rounded bg-white/5 border border-white/10">{d}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-neutral-400 mb-1">Granularity (max level)</div>
            <input
              type="range"
              min={0}
              max={maxLevelCap}
              step={1}
              value={maxLevel}
              onChange={(e) => setMaxLevel(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 text-xs text-neutral-400">Showing levels ≤ {maxLevel}</div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              className="text-xs rounded px-2 py-1 bg-white/5 text-neutral-200 border border-white/10 hover:bg-white/10"
              onClick={clearFilters}
            >
              Reset
            </button>
            <button
              className="text-xs rounded px-2 py-1 bg-white/10 text-white border border-white/10 hover:bg-white/20"
              onClick={() => setShowFilters(false)}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <Timeline items={items} domains={selectedDomains} maxLevel={maxLevel} />
    </div>
  );
}
