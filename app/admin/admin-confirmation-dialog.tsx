"use client";

import { useEffect, useId } from "react";

type AdminConfirmationDialogProps = {
  isOpen: boolean;
  isPending?: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function AdminConfirmationDialog({
  isOpen,
  isPending = false,
  title,
  description,
  confirmLabel,
  pendingLabel,
  destructive = false,
  onCancel,
  onConfirm,
}: AdminConfirmationDialogProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) onCancel();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isPending, onCancel]);

  if (!isOpen) return null;

  const confirmClassName = destructive
    ? "bg-[#8a3f31] hover:bg-[#713126] focus-visible:ring-[#8a3f31]/40 disabled:bg-[#b9928b]"
    : "bg-[#4a6038] hover:bg-[#3d5030] focus-visible:ring-[#4a6038]/45 disabled:bg-[#9a9486]";

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) onCancel();
      }}
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-[#131419]/70 px-4 py-6 animate-[fadeIn_0.28s_ease-out_both] motion-reduce:animate-none"
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md border border-[#d8d3c8] bg-[#f9f7f4] p-5 shadow-2xl animate-[fadeUp_0.32s_0.04s_ease-out_both] motion-reduce:animate-none sm:p-6"
      >
        <p className="text-[10px] font-normal uppercase tracking-[0.2em] text-[#a9a79c]">Confirmar accion</p>
        <h2 id={titleId} className="mt-2 text-[24px] font-light italic leading-tight text-[#131419]">
          {title}
        </h2>
        <p className="mt-3 text-sm font-light leading-relaxed text-[#777674]">{description}</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            disabled={isPending}
            onClick={onCancel}
            className="inline-flex min-h-11 min-w-0 items-center justify-center border border-[#d8d3c8] px-4 py-3 text-center text-[11px] font-normal uppercase tracking-[0.14em] text-[#493f2c] transition-colors hover:border-[#131419] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#131419]/20 disabled:cursor-wait disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className={`inline-flex min-h-11 min-w-0 items-center justify-center px-4 py-3 text-center text-[11px] font-normal uppercase tracking-[0.14em] text-white transition-colors focus:outline-none focus-visible:ring-2 disabled:cursor-wait ${confirmClassName}`}
          >
            {isPending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
