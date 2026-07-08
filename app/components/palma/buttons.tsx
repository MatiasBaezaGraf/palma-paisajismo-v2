import Link from "next/link";
import type { ReactNode } from "react";

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex min-h-12 items-center justify-center bg-[#4a6038] px-8 py-4 text-[11px] font-normal uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#3d5030] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/45 ${className}`}
    >
      {children}
    </button>
  );
}

export function PrimaryLink({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center bg-[#4a6038] px-8 py-4 text-[11px] font-normal uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#3d5030] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/45 ${className}`}
    >
      {children}
    </Link>
  );
}

export function OutlineButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center border border-[#131419] px-6 py-3 text-[11px] font-normal uppercase tracking-[0.16em] text-[#131419] transition-colors hover:bg-[#131419] hover:text-[#f9f7f4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#131419]/30 ${className}`}
    >
      {children}
    </button>
  );
}

export function OutlineLink({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center border border-[#131419] px-6 py-3 text-[11px] font-normal uppercase tracking-[0.16em] text-[#131419] transition-colors hover:bg-[#131419] hover:text-[#f9f7f4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#131419]/30 ${className}`}
    >
      {children}
    </Link>
  );
}

export function TextButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left text-[11px] font-normal uppercase tracking-[0.14em] text-[#131419] transition-colors hover:text-[#4a6038] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/35 ${className}`}
    >
      {children}
    </button>
  );
}

export function TextLink({
  children,
  href,
  onClick,
  className = "",
}: {
  children: ReactNode;
  href: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-left text-[11px] font-normal uppercase tracking-[0.14em] text-[#131419] transition-colors hover:text-[#4a6038] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/35 ${className}`}
    >
      {children}
    </Link>
  );
}
