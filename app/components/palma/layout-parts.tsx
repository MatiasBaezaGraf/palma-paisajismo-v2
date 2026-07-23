import type { ReactNode } from "react";
import Link from "next/link";
import { OutlineLink, PrimaryLink, TextLink } from "./buttons";
import { LogoFull } from "./logo";

export function PageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="mx-auto max-w-[1440px] border-b border-[#e0ddd7] px-5 pb-12 pt-24 md:px-[52px] md:pt-40">
      {backHref && backLabel ? (
        <ReturnLink href={backHref} className="mb-10">
          {backLabel}
        </ReturnLink>
      ) : null}
      <div data-page-header-copy className="animate-[fadeUp_0.95s_0.15s_ease-out_both] motion-reduce:animate-none">
        <p className="mb-[18px] text-[10px] font-normal uppercase tracking-[0.28em] text-[#a9a79c]">
          {eyebrow}
        </p>
        <h1 className="mb-5 text-[clamp(40px,6.5vw,84px)] font-light italic leading-none text-[#3d2e69]">
          {title}
        </h1>
        <p className="max-w-xl text-[15px] font-light leading-[1.85] text-[#777674] text-pretty">
          {description}
        </p>
      </div>
    </header>
  );
}

export function ReturnLink({
  href,
  children,
  className = "",
  tone = "default",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "light";
}) {
  const toneClass =
    tone === "light"
      ? "border-white/35 text-white/70 hover:border-white/70 hover:text-white"
      : "border-[#d6d0c4] text-[#6b7f52] hover:border-[#6b7f52] hover:text-[#131419]";

  return (
    <Link
      href={href}
      data-return-link
      className={`inline-flex items-center gap-2 border-b pb-1 text-[11px] font-normal uppercase tracking-[0.18em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/30 ${toneClass} ${className}`}
    >
      <span aria-hidden="true">←</span>
      <span>{children}</span>
    </Link>
  );
}

export function Cta({
  title,
  description,
  button,
  href,
}: {
  title: string;
  description?: string;
  button: string;
  href: string;
}) {
  return (
    <section className="mx-5 mt-14 flex flex-col items-start gap-6 bg-[#e6e3cc] px-6 py-12 md:mx-[52px] md:mt-[100px] md:flex-row md:items-center md:justify-between md:gap-16 md:px-[60px] md:py-[72px]">
      <div>
        <h3 className="text-[clamp(22px,2.8vw,40px)] font-light italic leading-tight text-[#3d2e69] text-pretty">
          {title}
        </h3>
        {description ? (
          <p className="mt-3 text-sm font-light leading-[1.7] text-[#493f2c]">{description}</p>
        ) : null}
      </div>
      <PrimaryLink href={href} className="w-full shrink-0 md:w-auto">
        {button}
      </PrimaryLink>
    </section>
  );
}

export function BottomBar({
  backToTypes = false,
  names = false,
}: {
  backToTypes?: boolean;
  names?: boolean;
}) {
  return (
    <div className="mt-[60px] border-t border-[#e0ddd7]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-[52px]">
        {backToTypes ? (
          <TextLink href="/que-disenamos" className="text-[#a9a79c]">
            ← Tipos de proyecto
          </TextLink>
        ) : (
          <LogoFull className="h-9 md:h-12" />
        )}
        {names ? (
          <p className="text-xs font-light text-[#a9a79c]">Isabella de Sousa · Heidi Ignatov</p>
        ) : null}
        <OutlineLink href="/contacto">Contacto</OutlineLink>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-14 border-t border-[#e0ddd7] md:mt-[110px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-[52px]">
        <LogoFull className="h-14" />
        <p className="text-[13px] font-light text-[#777674]">Buenos Aires, Argentina</p>
        <PrimaryLink href="/contacto" className="w-full md:w-auto">
          Escribinos
        </PrimaryLink>
      </div>
      <div className="mx-auto max-w-[1440px] border-t border-[#ece9e4] px-5 pb-6 md:px-[52px]">
        <p className="pt-4 text-[11px] font-light text-[#c5c2bb]">
          © 2025 Palma — Isabella de Sousa y Heidi Ignatov. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export function ContactFact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-normal uppercase tracking-[0.22em] text-[#a9a79c]">
        {label}
      </p>
      <p className="text-sm font-light leading-relaxed text-[#493f2c]">{children}</p>
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2.5 block text-[10px] font-normal uppercase tracking-[0.22em] text-[#a9a79c]"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
