"use client";

import React from "react";
import Image from "next/image";
import { MathText } from "./MathText";

export type TimelineItem = {
  year: string;
  title: string;
  blurb: string;
  details?: string;
  image?: { src: string; alt?: string; caption?: string };
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <section className="relative mx-auto max-w-6xl">
      {/* Central vertical ray */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -ml-px h-full w-px bg-neutral-700/70"
      />

      <ul className="space-y-12">
        {items.map((it, idx) => (
          <TimelineRow key={idx} item={it} />
        ))}
      </ul>
    </section>
  );
}

function TimelineRow({ item }: { item: TimelineItem }) {
  const [open, setOpen] = React.useState(false);

  return (
    <li className="group grid grid-cols-[1fr_2rem_1fr] gap-6 sm:gap-10 items-start">
      {/* Year (left) */}
      <div className="text-right pr-4 sm:pr-8 text-neutral-300 tabular-nums select-none leading-6">
        {item.year}
      </div>

      {/* Dot on the ray */}
      <div className="relative flex items-start justify-center">
        <span
          className="z-10 mt-1 block h-2.5 w-2.5 rounded-full bg-white ring-4 ring-black"
          aria-hidden
        />
      </div>

      {/* Content (right) */}
      <div>
        <div className="flex items-start gap-3">
          <h3 className="text-base sm:text-lg font-medium">{item.title}</h3>
          <button
            onClick={() => setOpen((v) => !v)}
            className="ml-auto text-xs rounded px-2 py-1 bg-white/5 text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-white/10"
            aria-expanded={open}
          >
            {open ? "Hide" : "More"}
          </button>
        </div>

        <MathText
          text={item.blurb}
          className="text-sm leading-relaxed text-neutral-300 max-w-prose mt-2"
        />

        {item.image && (
          <figure className="mt-4 border border-white/10 rounded-md overflow-hidden w-full max-w-xl">
            <Image
              src={item.image.src}
              alt={item.image.alt ?? "Figure"}
              width={800}
              height={450}
              className="h-auto w-full object-cover bg-neutral-900"
            />
            {item.image.caption && (
              <figcaption className="text-xs text-neutral-400 p-2 border-t border-white/10">
                {item.image.caption}
              </figcaption>
            )}
          </figure>
        )}

        {open && item.details && (
          <MathText
            text={item.details}
            className="mt-3 text-sm leading-relaxed text-neutral-300/90 max-w-prose"
          />
        )}
      </div>
    </li>
  );
}
