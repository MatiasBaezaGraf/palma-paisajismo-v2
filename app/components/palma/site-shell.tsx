import type { ReactNode } from "react";
import { Nav } from "./navigation";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f9f7f4] text-[#131419]">
      <Nav />
      {children}
    </main>
  );
}
