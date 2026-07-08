"use client";

import { useState } from "react";
import { OutlineButton, TextButton } from "./buttons";
import { LogoFull } from "./logo";
import type { NavFn, Page } from "./types";

export function Nav({
  page,
  navigate,
  navScrolled,
}: {
  page: Page;
  navigate: NavFn;
  navScrolled: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [labelIndex, setLabelIndex] = useState(0);
  const label = ["Qué diseñamos", "Áreas de trabajo"][labelIndex];

  const go = (target: Page) => {
    setMenuOpen(false);
    navigate(target);
  };

  const navButtonClass = (target: Page) =>
    page === target ? "text-[#4a6038]" : "text-[#131419]";

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b border-[#e8e4de] bg-[#f9f7f4]/95 backdrop-blur transition-shadow duration-300 ${
        navScrolled ? "shadow-[0_2px_24px_rgba(0,0,0,0.07)]" : ""
      }`}
    >
      <div className="flex items-center justify-between px-5 py-4 md:px-[52px]">
        <button
          type="button"
          onClick={() => go("home")}
          aria-label="Ir al inicio"
          className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/35"
        >
          <LogoFull className="h-[42px]" />
        </button>

        <div className="hidden items-center gap-8 md:flex">
          <div className="relative inline-flex flex-col items-center">
            <TextButton onClick={() => go("tipos")} className={navButtonClass("tipos")}>
              {label}
            </TextButton>
            <button
              type="button"
              onClick={() => setLabelIndex((current) => (current + 1) % 2)}
              title="Cambiar texto del menú"
              className="absolute top-[calc(100%+9px)] inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#d8d3c8] text-[9px] leading-none text-[#6b7f52] transition-colors hover:border-[#4a6038] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/30"
            >
              ↻
            </button>
          </div>
          <TextButton onClick={() => go("portfolio")} className={navButtonClass("portfolio")}>
            Proyectos
          </TextButton>
          <TextButton onClick={() => go("metodologia")} className={navButtonClass("metodologia")}>
            Metodología
          </TextButton>
          <OutlineButton onClick={() => go("contacto")} className="min-h-0 px-5 py-2 tracking-[0.14em]">
            Contacto
          </OutlineButton>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Abrir menú"
          className="inline-flex h-10 w-10 items-center justify-center text-2xl leading-none text-[#131419] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/35 md:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen ? (
        <div className="flex flex-col gap-5 border-t border-[#e0ddd7] bg-[#f9f7f4]/98 px-5 py-6 md:hidden">
          <div className="flex items-center gap-3">
            <TextButton onClick={() => go("tipos")} className="text-[13px]">
              {label}
            </TextButton>
            <button
              type="button"
              onClick={() => setLabelIndex((current) => (current + 1) % 2)}
              title="Cambiar texto del menú"
              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#d8d3c8] text-[10px] text-[#6b7f52]"
            >
              ↻
            </button>
          </div>
          <TextButton onClick={() => go("portfolio")} className="text-[13px]">
            Proyectos
          </TextButton>
          <TextButton onClick={() => go("metodologia")} className="text-[13px]">
            Metodología
          </TextButton>
          <TextButton onClick={() => go("contacto")} className="text-[13px]">
            Contacto
          </TextButton>
        </div>
      ) : null}
    </nav>
  );
}
