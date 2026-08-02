import { ProductsScreen } from "../components/palma/products-screen";
import { PrimaryLink } from "../components/palma/buttons";
import { BottomBar, ReturnLink } from "../components/palma/layout-parts";
import { SiteShell } from "../components/palma/site-shell";
import { getProducts, isSiteSectionEnabled } from "../lib/content";

export default async function ProductosPage() {
  const [isEnabled, products] = await Promise.all([
    isSiteSectionEnabled("productos", true),
    getProducts(),
  ]);

  return (
    <SiteShell>
      {isEnabled ? <ProductsScreen products={products} /> : <ProductsUnavailable />}
    </SiteShell>
  );
}

function ProductsUnavailable() {
  return (
    <div>
      <section className="mx-auto flex min-h-[78vh] max-w-[1440px] flex-col justify-center border-b border-[#e0ddd7] px-5 pb-12 pt-24 md:px-[52px] md:pt-36">
        <ReturnLink href="/" className="mb-10">
          Inicio
        </ReturnLink>
        <p className="mb-5 text-[10px] font-normal uppercase tracking-[0.28em] text-[#a9a79c]">Productos</p>
        <h1 className="max-w-3xl text-[clamp(40px,6vw,76px)] font-light italic leading-none text-[#131419] text-pretty">
          Estamos preparando esta sección
        </h1>
        <p className="mt-7 max-w-xl text-[15px] font-light leading-[1.85] text-[#777674] text-pretty">
          El catálogo de productos todavía no está disponible. Podés volver al inicio para seguir recorriendo
          Palma.
        </p>
        <div className="mt-10">
          <PrimaryLink href="/">Volver al inicio</PrimaryLink>
        </div>
      </section>
      <BottomBar names />
    </div>
  );
}
