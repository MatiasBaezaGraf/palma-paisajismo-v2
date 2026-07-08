"use client";

import { useFormStatus } from "react-dom";
import { signIn } from "../actions";

export function LoginForm({ next }: { next: string }) {
  return (
    <form action={signIn} className="mt-7 grid gap-5">
      <input type="hidden" name="next" value={next} />
      <label className="grid gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
        Email
        <input
          name="email"
          type="email"
          required
          defaultValue="admin@admin.com"
          className="border border-[#e0ddd7] bg-[#f9f7f4] px-3 py-3 text-sm font-light normal-case tracking-normal text-[#131419] outline-none focus:border-[#4a6038]"
        />
      </label>
      <label className="grid gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
        Contraseña
        <input
          name="password"
          type="password"
          required
          defaultValue="admin123"
          className="border border-[#e0ddd7] bg-[#f9f7f4] px-3 py-3 text-sm font-light normal-case tracking-normal text-[#131419] outline-none focus:border-[#4a6038]"
        />
      </label>
      <LoginButton />
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 items-center justify-center bg-[#4a6038] px-8 py-4 text-[11px] font-normal uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#3d5030] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/45 disabled:cursor-wait disabled:bg-[#9a9486]"
    >
      {pending ? "Ingresando..." : "Entrar"}
    </button>
  );
}
