import type { ReactNode } from "react";
import { isSiteSectionEnabled } from "../../lib/content";
import { Nav } from "./navigation";

export async function SiteShell({ children }: { children: ReactNode }) {
  const showProducts = await isSiteSectionEnabled("productos", true);

  return (
    <main className="min-h-screen bg-[#f9f7f4] text-[#131419]">
      <Nav showProducts={showProducts} />
      {children}
    </main>
  );
}
