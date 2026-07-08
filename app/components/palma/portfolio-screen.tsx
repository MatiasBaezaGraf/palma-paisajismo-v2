import { images } from "../../palma-data";
import { PrimaryButton } from "./buttons";
import { ImageFrame } from "./image-frame";
import { BottomBar } from "./layout-parts";
import type { NavFn } from "./types";

export function PortfolioScreen({ navigate }: { navigate: NavFn }) {
  return (
    <div>
      <section className="relative flex min-h-[80vh] items-center overflow-hidden md:min-h-[88vh]">
        <ImageFrame image={images.verticalGarden} className="absolute inset-0" sizes="100vw" priority />
        <div className="absolute inset-0 bg-[#131419]/60" />
        <div className="relative mx-auto w-full max-w-[1440px] px-5 md:px-[52px]">
          <p className="mb-5 text-[10px] font-normal uppercase tracking-[0.34em] text-white/50">
            Proyectos · Próximamente
          </p>
          <h1 className="max-w-3xl text-[clamp(36px,5.5vw,76px)] font-light italic leading-none text-white text-pretty">
            Estamos preparando esta sección.
          </h1>
          <p className="mt-7 max-w-xl text-[15px] font-light leading-[1.85] text-white/70">
            Pronto vas a poder recorrer una selección de los proyectos realizados por el estudio. Mientras
            tanto, podés conocer los tipos de proyecto en los que trabajamos o escribirnos directamente.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton onClick={() => navigate("tipos")}>Ver tipos de proyecto</PrimaryButton>
            <button
              type="button"
              onClick={() => navigate("contacto")}
              className="inline-flex min-h-12 items-center justify-center border border-white/70 px-8 py-4 text-[11px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-[#131419]"
            >
              Contacto
            </button>
          </div>
        </div>
      </section>
      <BottomBar navigate={navigate} names />
    </div>
  );
}
