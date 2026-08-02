"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "../../lib/content";
import { BottomBar } from "./layout-parts";

export function ProductsScreen({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!selectedProduct) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProduct]);

  return (
    <div>
      <header className="mx-auto max-w-[1440px] border-b border-[#e0ddd7] px-5 pb-12 pt-24 md:px-[52px] md:pb-14 md:pt-40">
        <div data-page-header-copy className="animate-[fadeUp_0.95s_0.15s_ease-out_both] motion-reduce:animate-none">
          <p className="mb-[18px] text-[10px] font-normal uppercase tracking-[0.28em] text-[#a9a79c]">
            Productos
          </p>
          <h1 className="mb-6 max-w-5xl text-[clamp(38px,6vw,82px)] font-light italic leading-none text-[#131419] text-pretty">
            Elementos para el paisaje
          </h1>
          <p className="max-w-xl text-[15px] font-light leading-[1.85] text-[#777674] text-pretty">
            Una selección de piezas y materiales que utilizamos en nuestros proyectos. Este catálogo es solo a
            modo de exhibición - consultanos por disponibilidad y precios actualizados.
          </p>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-x-20 gap-y-12 px-5 py-12 md:grid-cols-2 md:px-[52px] md:py-20 xl:grid-cols-3">
        {products.map((product) => (
          <button
            key={product.slug}
            type="button"
            onClick={() => setSelectedProduct(product)}
            className="group grid min-w-0 gap-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/35"
          >
            <ProductVisual product={product} />
            <span className="grid min-w-0 gap-2">
              <span className="text-[17px] font-light italic leading-tight text-[#131419] transition-colors group-hover:text-[#4a6038]">
                {product.title}
              </span>
              <span className="text-[15px] font-light leading-tight text-[#415733]">{product.price}</span>
              <span className="text-[13px] font-light leading-[1.7] text-[#8a8883]">{product.subtitle}</span>
            </span>
          </button>
        ))}
      </section>

      <BottomBar names />

      {selectedProduct ? (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      ) : null}
    </div>
  );
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-[80] overflow-y-auto bg-[#131419]/70 px-4 py-5 md:px-8 md:py-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="mx-auto grid min-h-[calc(100vh-40px)] w-full max-w-[1240px] bg-[#f9f7f4] md:min-h-[min(86vh,866px)] md:grid-cols-[1fr_1fr]">
        <div className="relative min-h-[320px] md:min-h-0">
          <ProductVisual product={product} large />
        </div>

        <div className="relative flex min-w-0 flex-col px-6 py-14 md:px-[60px] md:py-[66px]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar producto"
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center text-2xl font-light leading-none text-[#131419] transition-colors hover:text-[#4a6038] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/35"
          >
            x
          </button>

          <p className="mb-5 text-[10px] font-normal uppercase tracking-[0.28em] text-[#a9a79c]">Producto</p>
          <h2
            id="product-modal-title"
            className="max-w-[560px] text-[clamp(34px,4vw,44px)] font-light italic leading-[1.12] text-[#131419] text-pretty"
          >
            {product.title}
          </h2>
          <p className="mt-5 text-[20px] font-light leading-tight text-[#415733]">{product.price}</p>
          <p className="mt-8 max-w-xl text-[15px] font-light leading-[1.9] text-[#493f2c] text-pretty">
            {product.description}
          </p>

          <div className="mt-8 border-t border-[#e0ddd7] pt-5">
            <p className="inline-flex border border-[#e0ddd7] px-4 py-3 text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
              Solo a modo de exhibición · consultar disponibilidad
            </p>
          </div>

          <Link
            href={`/contacto?producto=${encodeURIComponent(product.title)}`}
            className="mt-10 inline-flex min-h-12 w-full items-center justify-center bg-[#4a6038] px-6 py-4 text-center text-[11px] font-normal uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#3d5030] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/45 md:mt-auto md:w-fit md:min-w-[310px]"
          >
            Consultar por este producto →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductVisual({ product, large = false }: { product: Product; large?: boolean }) {
  const sizeClass = large ? "h-full min-h-[320px]" : "aspect-[1.22/1]";

  if (product.image) {
    return (
      <span className={`relative block overflow-hidden bg-[#ece9e4] ${sizeClass}`}>
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes={large ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1280px) 28vw, (min-width: 768px) 44vw, 100vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </span>
    );
  }

  return (
    <span
      className={`flex items-center justify-center bg-[#f3f1eb] ${sizeClass}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, #f7f5ef 0 12px, #ece9e2 12px 24px)",
      }}
    >
      <span className="bg-[#f9f7f4] px-4 py-1.5 text-[11px] font-light lowercase tracking-[0.12em] text-[#9a9486]">
        {large ? "imagen de producto - pendiente" : "imagen pendiente"}
      </span>
    </span>
  );
}
