"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { OutlineLink, TextLink } from "./buttons";
import { LogoFull } from "./logo";

const links = [
  { href: "/que-disenamos", label: "Qué diseñamos" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/nuestra-mirada", label: "Nuestra mirada" },
];

export function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const update = () => setNavScrolled(window.scrollY > 60);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b border-[#e8e4de] bg-[#f9f7f4]/95 backdrop-blur transition-shadow duration-300 ${
        navScrolled ? "shadow-[0_2px_24px_rgba(0,0,0,0.07)]" : ""
      }`}
    >
      <div className="flex items-center justify-between px-5 py-4 md:px-[52px]">
        <Link
          href="/"
          aria-label="Ir al inicio"
          className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/35"
        >
          <LogoFull className="h-[42px]" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <TextLink key={link.href} href={link.href} className={isActive(link.href) ? "text-[#4a6038]" : ""}>
              {link.label}
            </TextLink>
          ))}
          <OutlineLink href="/contacto" className="min-h-0 px-5 py-2 tracking-[0.14em]">
            Contacto
          </OutlineLink>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          className="inline-flex h-10 w-10 items-center justify-center text-2xl leading-none text-[#131419] transition-transform duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/35 md:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      <div
        data-mobile-menu
        aria-hidden={!menuOpen}
        className={`overflow-hidden border-t transition-[max-height,opacity,transform,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          menuOpen
            ? "max-h-96 translate-y-0 border-[#e0ddd7] opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 border-transparent opacity-0"
        }`}
      >
        <div className="flex flex-col gap-5 bg-[#f9f7f4]/98 px-5 py-6">
          {links.map((link) => (
            <TextLink key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-[13px]">
              {link.label}
            </TextLink>
          ))}
          <TextLink href="/contacto" onClick={() => setMenuOpen(false)} className="text-[13px]">
            Contacto
          </TextLink>
        </div>
      </div>
    </nav>
  );
}
