"use client";

import { useCallback, useEffect, useState } from "react";
import { ContactScreen } from "./contact-screen";
import { HomeScreen } from "./home-screen";
import { MethodologyScreen } from "./methodology-screen";
import { Nav } from "./navigation";
import { PortfolioScreen } from "./portfolio-screen";
import { TypeDetailScreen } from "./type-detail-screen";
import { TypesScreen } from "./types-screen";
import type { Page } from "./types";

export default function PalmaSite() {
  const [page, setPage] = useState<Page>("home");
  const [selectedType, setSelectedType] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const update = () => setNavScrolled(window.scrollY > 60);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const navigate = useCallback((target: Page) => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setPage(target);
  }, []);

  const openType = useCallback((index: number) => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setSelectedType(index);
    setPage("tipo");
  }, []);

  return (
    <main className="min-h-screen bg-[#f9f7f4] text-[#131419]">
      <Nav page={page} navigate={navigate} navScrolled={navScrolled} />
      {page === "home" ? <HomeScreen navigate={navigate} openType={openType} /> : null}
      {page === "tipos" ? <TypesScreen navigate={navigate} openType={openType} /> : null}
      {page === "tipo" ? <TypeDetailScreen selectedType={selectedType} navigate={navigate} /> : null}
      {page === "portfolio" ? <PortfolioScreen navigate={navigate} /> : null}
      {page === "metodologia" ? <MethodologyScreen navigate={navigate} /> : null}
      {page === "contacto" ? <ContactScreen /> : null}
    </main>
  );
}
