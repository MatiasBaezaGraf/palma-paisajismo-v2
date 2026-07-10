"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { HomeImageRow, PageImageRow, ProjectTypeRow } from "../lib/content";
import { AdminImageCard } from "./admin-image-card";
import { updateHomeImage, updatePageImage, updateProjectTypeImage } from "./actions";

type TabId = "home" | "que-disenamos" | "metodologia" | "contacto";

export function AdminDashboard({
  homeImages,
  projectTypes,
  pageImages,
}: {
  homeImages: HomeImageRow[];
  projectTypes: ProjectTypeRow[];
  pageImages: PageImageRow[];
}) {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const tabs = useMemo(
    () => [
      {
        id: "home" as const,
        eyebrow: "Inicio",
        title: "Home",
        description: "Imágenes principales de la primera pantalla y la sección del estudio.",
        count: homeImages.length,
      },
      {
        id: "que-disenamos" as const,
        eyebrow: "Página",
        title: "Qué diseñamos",
        description: "Fotos de cada tipo de proyecto.",
        count: projectTypes.length,
      },
      {
        id: "metodologia" as const,
        eyebrow: "Página",
        title: "Metodología",
        description: "Imagen principal de la página de metodología.",
        count: pageImages.filter((item) => item.page === "metodologia").length,
      },
      {
        id: "contacto" as const,
        eyebrow: "Página",
        title: "Contacto",
        description: "Fotografía principal usada en la página de contacto.",
        count: pageImages.filter((item) => item.page === "contacto").length,
      },
    ],
    [homeImages.length, pageImages, projectTypes.length],
  );

  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const methodologyImages = pageImages.filter((item) => item.page === "metodologia");
  const contactImages = pageImages.filter((item) => item.page === "contacto");

  return (
    <div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-8 md:px-[52px] md:py-12 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div
          role="tablist"
          aria-label="Secciones del sitio"
          className="flex gap-2 overflow-x-auto border-b border-[#e0ddd7] pb-3 lg:flex-col lg:overflow-visible lg:border-b-0 lg:pb-0"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
              className={`min-w-[168px] border px-4 py-3 text-left transition-colors lg:min-w-0 ${
                activeTab === tab.id
                  ? "border-[#4a6038] bg-[#eef0e6] text-[#131419]"
                  : "border-[#e0ddd7] bg-white/50 text-[#777674] hover:border-[#c4bdb0] hover:text-[#131419]"
              }`}
            >
              <span className="block text-[9px] font-normal uppercase tracking-[0.2em] text-[#a9a79c]">
                {tab.eyebrow}
              </span>
              <span className="mt-1 flex items-center justify-between gap-4 text-sm font-normal">
                {tab.title}
                <span className="text-[11px] font-light text-[#9a9486]">{tab.count}</span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section className="min-w-0">
        <div className="mb-6 grid gap-3 border-b border-[#e0ddd7] pb-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-[10px] font-normal uppercase tracking-[0.24em] text-[#a9a79c]">{active.eyebrow}</p>
            <h2 className="mt-2 text-[clamp(26px,3vw,42px)] font-light italic leading-none text-[#131419]">
              {active.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-[#777674]">
              {active.description}
            </p>
          </div>
        </div>

        {activeTab === "home" ? (
          <CardGrid>
            {homeImages.length ? (
              homeImages.map((image) => (
                <AdminImageCard
                  key={image.slot}
                  item={image}
                  action={updateHomeImage}
                  hiddenName="slot"
                  hiddenValue={image.slot}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </CardGrid>
        ) : null}

        {activeTab === "que-disenamos" ? (
          <CardGrid dense>
            {projectTypes.length ? (
              projectTypes.map((type) => (
                <AdminImageCard
                  key={type.slug}
                  item={type}
                  action={updateProjectTypeImage}
                  hiddenName="slug"
                  hiddenValue={type.slug}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </CardGrid>
        ) : null}

        {activeTab === "metodologia" ? (
          <CardGrid>
            {methodologyImages.length ? (
              methodologyImages.map((image) => (
                <AdminImageCard
                  key={image.id}
                  item={image}
                  action={updatePageImage}
                  hiddenName="imageId"
                  hiddenValue={image.id}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </CardGrid>
        ) : null}

        {activeTab === "contacto" ? (
          <CardGrid>
            {contactImages.length ? (
              contactImages.map((image) => (
                <AdminImageCard
                  key={image.id}
                  item={image}
                  action={updatePageImage}
                  hiddenName="imageId"
                  hiddenValue={image.id}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </CardGrid>
        ) : null}
      </section>
    </div>
  );
}

function CardGrid({ children, dense = false }: { children: ReactNode; dense?: boolean }) {
  return (
    <div data-admin-card-grid className={`grid gap-5 ${dense ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2"}`}>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-[#d8d3c8] p-6 text-sm font-light leading-relaxed text-[#777674]">
      No hay contenido cargado todavía. Ejecutá <code>yarn seed:supabase</code> para subir las imágenes
      iniciales y crear las filas editables.
    </div>
  );
}
