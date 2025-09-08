"use client";

import React from "react";

export function FilterToggle() {
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const onClick = () => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const detail = { left: r.left, top: r.bottom };
    const evt = new CustomEvent("toggleFilters", { detail });
    window.dispatchEvent(evt);
  };
  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      className="text-xs rounded px-2 py-1 bg-white/5 text-neutral-200 border border-white/10 hover:bg-white/10"
      aria-label="Toggle filters"
    >
      Filters
    </button>
  );
}
