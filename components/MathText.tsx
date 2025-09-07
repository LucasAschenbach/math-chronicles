"use client";

import React from "react";

type Props = {
  text: string;
  className?: string;
};

// Renders text that may contain LaTeX delimiters using MathJax (loaded via CDN in layout)
export function MathText({ text, className }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Set raw text; MathJax will typeset it
    el.innerHTML = text
      // Preserve line breaks in dummy text for readability
      .replace(/\n/g, "<br/>");

    const w = typeof window !== "undefined" ? (window as any) : undefined;
    if (w && w.MathJax && typeof w.MathJax.typesetPromise === "function") {
      w.MathJax.typesetPromise([el]).catch(() => {});
    }
  }, [text]);

  return <div ref={ref} className={className} />;
}

