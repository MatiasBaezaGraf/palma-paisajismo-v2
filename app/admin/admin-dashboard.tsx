"use client";

import { useMemo, useState, useTransition } from "react";
import type { ReactNode } from "react";
import type { HomeImageRow, PageImageRow, ProductRow, ProjectTypeRow, SiteSectionRow } from "../lib/content";
import { AdminImageCard } from "./admin-image-card";
import { AdminCreateProductForm, AdminProductForm } from "./admin-product-form";
import { AdminProjectTypeText } from "./admin-project-type-text";
import { updateHomeImage, updatePageImage, updateProductsSectionAvailability, updateProjectTypeImage } from "./actions";

type TabId = "home" | "que-disenamos" | "productos" | "nuestra-mirada" | "contacto";

export function AdminDashboard({
  homeImages,
  projectTypes,
  pageImages,
  siteSections,
  products,
}: {
  homeImages: HomeImageRow[];
  projectTypes: ProjectTypeRow[];
  pageImages: PageImageRow[];
  siteSections: SiteSectionRow[];
  products: ProductRow[];
}) {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const productsSection = siteSections.find((section) => section.slug === "productos");
  const nextProductSortOrder = products.reduce((max, product) => Math.max(max, product.sort_order), 0) + 1;

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
        description: "Foto y texto de la subpágina de cada tipo de proyecto.",
        count: projectTypes.length,
      },
      {
        id: "productos" as const,
        eyebrow: "Página",
        title: "Productos",
        description: "Disponibilidad de la sección y catálogo de productos.",
        count: products.length,
      },
      {
        id: "nuestra-mirada" as const,
        eyebrow: "Página",
        title: "Nuestra mirada",
        description: "Imágenes principales de la página Nuestra mirada.",
        count: pageImages.filter((item) => item.page === "nuestra-mirada").length,
      },
      {
        id: "contacto" as const,
        eyebrow: "Página",
        title: "Contacto",
        description: "Fotografía principal usada en la página de contacto.",
        count: pageImages.filter((item) => item.page === "contacto").length,
      },
    ],
    [homeImages.length, pageImages, products.length, projectTypes.length],
  );

  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const nuestraMiradaImages = pageImages.filter((item) => item.page === "nuestra-mirada");
  const contactImages = pageImages.filter((item) => item.page === "contacto");

  return (
    <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-4 py-6 sm:px-6 md:px-[52px] md:py-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
      <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div
          role="tablist"
          aria-label="Secciones del sitio"
          className="-mx-4 flex snap-x gap-2 overflow-x-auto border-b border-[#e0ddd7] px-4 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:overflow-visible lg:border-b-0 lg:px-0 lg:pb-0"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
              className={`min-w-[138px] max-w-[178px] shrink-0 snap-start border px-3 py-3 text-left transition-colors sm:min-w-[168px] sm:max-w-none sm:px-4 lg:min-w-0 lg:max-w-none lg:shrink ${
                activeTab === tab.id
                  ? "border-[#4a6038] bg-[#eef0e6] text-[#131419]"
                  : "border-[#e0ddd7] bg-white/50 text-[#777674] hover:border-[#c4bdb0] hover:text-[#131419]"
              }`}
            >
              <span className="block text-[9px] font-normal uppercase tracking-[0.16em] text-[#a9a79c] sm:tracking-[0.2em]">
                {tab.eyebrow}
              </span>
              <span className="mt-1 flex items-center justify-between gap-2 text-left text-[13px] font-normal leading-tight sm:gap-4 sm:text-sm">
                <span className="min-w-0 break-words">{tab.title}</span>
                <span className="text-[11px] font-light text-[#9a9486]">{tab.count}</span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section className="min-w-0 overflow-hidden">
        <div className="mb-5 grid gap-3 border-b border-[#e0ddd7] pb-5 md:mb-6 md:grid-cols-[1fr_auto] md:items-end">
          <div className="min-w-0">
            <p className="text-[10px] font-normal uppercase tracking-[0.24em] text-[#a9a79c]">{active.eyebrow}</p>
            <h2 className="mt-2 text-[clamp(25px,8vw,42px)] font-light italic leading-none text-[#3d2e69]">
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
          projectTypes.length ? (
            <div className="grid min-w-0 gap-6">
              {projectTypes.map((type) => (
                <div
                  key={type.slug}
                  className="grid min-w-0 gap-4 border border-[#ece9e4] bg-[#fbfaf7] p-3 sm:p-4 lg:grid-cols-2 lg:gap-5"
                >
                  <AdminImageCard
                    item={type}
                    action={updateProjectTypeImage}
                    hiddenName="slug"
                    hiddenValue={type.slug}
                  />
                  <AdminProjectTypeText item={type} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )
        ) : null}

        {activeTab === "productos" ? (
          <div className="grid gap-5">
            <ProductsAvailabilityControl
              key={String(productsSection?.is_enabled ?? true)}
              isEnabled={productsSection?.is_enabled ?? true}
            />
            <AdminCreateProductForm nextSortOrder={nextProductSortOrder} />
            <CardGrid dense>
              {products.length ? (
                products.map((product) => <AdminProductForm key={product.slug} product={product} />)
              ) : (
                <EmptyState />
              )}
            </CardGrid>
          </div>
        ) : null}

        {activeTab === "nuestra-mirada" ? (
          <CardGrid>
            {nuestraMiradaImages.length ? (
              nuestraMiradaImages.map((image) => (
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

function ProductsAvailabilityControl({ isEnabled }: { isEnabled: boolean }) {
  const [checked, setChecked] = useState(isEnabled);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const hasChanges = checked !== isEnabled;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        setError(null);
        await updateProductsSectionAvailability(formData);
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "No se pudo guardar la disponibilidad.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 border border-[#e0ddd7] bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="text-[10px] font-normal uppercase tracking-[0.2em] text-[#a9a79c]">
          Disponibilidad
        </p>
        <h3 className="mt-1 text-[20px] font-light italic leading-tight text-[#131419]">
          Link de Productos en navegación
        </h3>
        <p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-[#777674]">
          Si se desactiva, el link desaparece del menú y /productos muestra el mensaje de sección en preparación.
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-3 sm:items-end">
        <label className="flex items-center gap-3 text-[11px] font-normal uppercase tracking-[0.16em] text-[#493f2c]">
          <input
            name="is_enabled"
            type="checkbox"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
            disabled={isPending}
            className="h-4 w-4 accent-[#4a6038]"
          />
          Disponible
        </label>
        {error ? (
          <p role="alert" className="max-w-52 text-right text-[11px] font-light leading-relaxed text-[#8a3f31]">
            {error}
          </p>
        ) : null}
        {hasChanges ? (
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-11 min-w-0 items-center justify-center bg-[#4a6038] px-4 py-3 text-center text-[11px] font-normal uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#3d5030] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/45 disabled:cursor-wait disabled:bg-[#9a9486]"
          >
            {isPending ? "Guardando..." : "Guardar estado"}
          </button>
        ) : null}
      </div>
    </form>
  );
}

function CardGrid({ children, dense = false }: { children: ReactNode; dense?: boolean }) {
  return (
    <div
      data-admin-card-grid
      className={`grid min-w-0 gap-4 sm:gap-5 ${dense ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2"}`}
    >
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
