"use client";

import React from "react";
import Image from "next/image";
import { MathText } from "./MathText";

export type TimelineItem = {
  level: number; // 0 = full, 1 = compact, >=2 = hidden
  id?: string;
  year: string;
  endYear?: string;
  era?: string;
  title: string;
  blurb: string;
  details?: string;
  image?: { src: string; alt?: string; caption?: string };
  domains?: string[];
  tags?: string[];
  people?: { name: string; link?: string; role?: string }[];
  seeAlso?: string[];
  sources?: { label?: string; url: string }[];
};

export function Timeline({
  items,
  maxLevel = 1,
  domains,
}: {
  items: TimelineItem[];
  maxLevel?: number;
  domains?: string[];
}) {
  let visible = items.filter((it) => (typeof it.level === "number" ? it.level : 0) <= maxLevel);
  if (domains && domains.length > 0) {
    visible = visible.filter(
      (it) => Array.isArray(it.domains) && it.domains.some((d) => domains.includes(d))
    );
  }
  return (
    <section className="relative mx-auto max-w-6xl">
      {/* Central vertical ray */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -ml-px h-full w-px bg-neutral-700/70"
      />

      <ul>
        {visible.map((it, idx) => {
          const prev = visible[idx - 1];
          const prevCompact = idx > 0 && prev?.level === 1;
          return (
            <TimelineRow
              key={idx}
              item={it}
              prevCompact={prevCompact}
              isFirst={idx === 0}
              density={maxLevel}
            />
          );
        })}
      </ul>
    </section>
  );
}

function TimelineRow({
  item,
  prevCompact,
  isFirst,
  density = 1,
}: {
  item: TimelineItem;
  prevCompact?: boolean;
  isFirst?: boolean;
  density?: number; // mirrors maxLevel for spacing/dot size adjustments
}) {
  const [open, setOpen] = React.useState(false);
  const compact = item.level === density && density >= 1;
  const compactGap = density >= 3 ? "mt-2" : density >= 2 ? "mt-3" : "mt-4";
  const fullGap = density >= 3 ? "mt-8" : density >= 2 ? "mt-10" : "mt-12";
  const rowSpacing = isFirst ? "" : compact && prevCompact ? compactGap : fullGap;

  return (
    <li className={`group grid grid-cols-[1fr_2rem_1fr] gap-6 sm:gap-10 items-start ${rowSpacing}`}>
      {/* Year (left) */}
      <div
        className={
          compact
            ? density >= 2
              ? "text-right text-neutral-400/70 tabular-nums select-none leading-4 text-[10px]"
              : "text-right text-neutral-400/80 tabular-nums select-none leading-5 text-xs"
            : "text-right text-neutral-300 tabular-nums select-none leading-6"
        }
      >
        {item.year}
      </div>

      {/* Dot on the ray */}
      <div className="relative flex items-start justify-center">
        <span
          className={
            "z-10 mt-1 block rounded-full bg-white " +
            (compact
              ? density >= 2
                ? "h-1 w-1 ring-2 ring-black/50 opacity-60"
                : "h-1.5 w-1.5 ring-2 ring-black/60 opacity-70"
              : "h-2.5 w-2.5 ring-4 ring-black")
          }
          aria-hidden
        />
      </div>

      {/* Content (right) */}
      <div>
        <div className="flex items-start gap-3">
          <h3 className={compact ? "text-sm font-medium text-neutral-200" : "text-base sm:text-lg font-medium"}>{item.title}</h3>
          {!compact && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="ml-auto text-xs rounded px-2 py-1 bg-white/5 text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-white/10"
              aria-expanded={open}
            >
              {open ? "Hide" : "More"}
            </button>
          )}
        </div>

        {!compact && (item.domains || item.era || item.people) && (
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {item.domains?.map((d, i) => (
              <span
                key={`dom-${i}`}
                className="text-[10px] uppercase tracking-wide rounded-full bg-white/5 px-2 py-0.5 text-neutral-300 border border-white/10"
              >
                {d}
              </span>
            ))}
            {item.era && (
              <span className="ml-1 text-[10px] rounded px-1.5 py-0.5 text-neutral-400 bg-white/0 border border-white/10">
                {item.era}
              </span>
            )}
            {item.people && item.people.length > 0 && (
              <span className="ml-2 text-xs text-neutral-400">
                By: {item.people.map((p, i) => (
                  <span key={`p-${i}`}>
                    {p.link ? (
                      <a href={p.link} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                        {p.name}
                      </a>
                    ) : (
                      p.name
                    )}
                    {i < item.people!.length - 1 ? ", " : ""}
                  </span>
                ))}
              </span>
            )}
          </div>
        )}

        {!compact && (
          <MathText
            text={item.blurb}
            className="text-sm leading-relaxed text-neutral-300 max-w-prose mt-2"
          />
        )}

        {!compact && item.image && (
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

        {!compact && open && item.details && (
          <MathText
            text={item.details}
            className="mt-3 text-sm leading-relaxed text-neutral-300/90 max-w-prose"
          />
        )}
      </div>
    </li>
  );
}
