import Link from "next/link";
import type { HomeImages } from "../../lib/content";
import type { ProjectType } from "../../palma-data";
import { PrimaryLink } from "./buttons";
import { ImageFrame } from "./image-frame";
import { SiteFooter } from "./layout-parts";
import { PortfolioPreview } from "./portfolio-preview";
import { Reveal } from "./reveal";

export function HomeScreen({
  homeImages,
  projectTypes,
}: {
  homeImages: HomeImages;
  projectTypes: ProjectType[];
}) {
  return (
    <div>
      <section className="relative h-svh overflow-hidden">
        <ImageFrame
          image={homeImages.hero}
          className="absolute inset-0 animate-[scaleReveal_1.6s_ease-out_both]"
          imgClassName="object-[center_45%]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(170deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.56)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 animate-[fadeUp_0.9s_0.5s_ease-out_both] px-5 py-12 md:px-[52px] md:py-20">
          <p className="mb-5 text-[10px] font-normal uppercase tracking-[0.34em] text-white/50">
            Diseño de Paisajes con Sentido
          </p>
          <h1 className="max-w-[800px] text-[clamp(44px,8vw,110px)] font-light italic leading-[0.93] text-white text-pretty">
            Paisajes
            <br />
            que perduran
          </h1>
          <div className="mt-8 flex max-w-xl items-start gap-5">
            <div className="mt-[11px] h-px w-7 shrink-0 bg-white/30" />
            <p className="text-sm font-light leading-[1.85] text-white/70">
              Diseñamos jardines en todas las escalas: balcones, jardines urbanos y de campo, desarrollos
              residenciales, corporativos e industriales.
            </p>
          </div>
        </div>
        <div className="absolute bottom-[52px] right-[52px] hidden flex-col items-center gap-2.5 md:flex">
          <div className="h-[52px] w-px origin-bottom animate-[pulseLine_2.4s_ease-in-out_infinite] bg-white/30" />
          <span className="[writing-mode:vertical-rl] text-[9px] uppercase tracking-[0.34em] text-white/35">
            Scroll
          </span>
        </div>
      </section>

      <Reveal>
        <section className="mx-auto grid max-w-[1440px] gap-7 px-5 py-14 md:grid-cols-[5fr_7fr] md:gap-20 md:px-[52px] md:pb-[90px] md:pt-[110px]">
          <div>
            <p className="mb-6 text-[10px] font-normal uppercase tracking-[0.28em] text-[#a9a79c]">
              El estudio · Desde 2011
            </p>
            <h2 className="text-[clamp(27px,3.5vw,46px)] font-normal leading-tight tracking-normal text-[#131419] text-pretty">
              Diseñamos entornos que conectan a las personas con la naturaleza
            </h2>
          </div>
          <div className="pt-2">
            <p className="mb-5 text-[15px] font-light leading-[1.92] text-[#493f2c] text-pretty">
              Palma es un estudio de paisajismo fundado en 2011, formado por{" "}
              <strong className="font-normal">Isabella de Sousa</strong> y{" "}
              <strong className="font-normal">Heidi Ignatov</strong>. Trabajamos en todas las escalas,
              desde balcones urbanos hasta desarrollos residenciales, corporativos e industriales de gran
              dimensión.
            </p>
            <p className="mb-9 text-[15px] font-light leading-[1.92] text-[#493f2c] text-pretty">
              Cada proyecto parte de una escucha profunda del lugar, del cliente y de su contexto para dar
              forma a paisajes con identidad propia, pensados para madurar y evolucionar con el tiempo.
            </p>
            <PrimaryLink href="/metodologia">Nuestra metodología →</PrimaryLink>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <ImageFrame
          image={homeImages.studio}
          className="mx-5 h-[55vw] md:mx-[52px] md:h-[68vh]"
          imgClassName="object-[center_50%]"
          sizes="100vw"
        />
      </Reveal>

      <section className="mt-14 bg-[#f1eee7] md:mt-24">
        <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-[52px] md:py-[90px]">
          <Reveal>
            <div className="mb-10 grid gap-7 md:mb-14 md:grid-cols-[5fr_7fr] md:gap-20">
              <div>
                <p className="mb-5 text-[10px] font-normal uppercase tracking-[0.28em] text-[#9a9486]">
                  Tipos de proyecto
                </p>
                <h2 className="text-[clamp(24px,3vw,40px)] font-light italic leading-tight text-[#131419] text-pretty">
                  Trabajamos en distintos contextos y escalas
                </h2>
              </div>
              <p className="self-center text-[15px] font-light leading-[1.9] text-[#493f2c] text-pretty">
                Cada tipo de espacio tiene sus propias lógicas, tiempos y necesidades. Conocé los rubros en
                los que trabaja el estudio y el enfoque que aplicamos en cada uno.
              </p>
            </div>
          </Reveal>
          <div className="grid border-t border-[#ddd8cd] md:grid-cols-2 md:gap-x-20">
            {projectTypes.map((type, index) => (
              <Reveal key={type.slug} delay={index * 35}>
                <Link
                  href={`/que-disenamos/${type.slug}`}
                  className="flex w-full items-center justify-between gap-4 border-b border-[#ddd8cd] py-[18px] text-left transition-colors hover:text-[#4a6038] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/30"
                >
                  <span className="text-[15px] font-normal leading-snug text-[#131419]">{type.title}</span>
                  <span className="shrink-0 text-[13px] text-[#6b7f52]">→</span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <PrimaryLink href="/que-disenamos">Ver todos los tipos de proyecto →</PrimaryLink>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <PortfolioPreview />
      </Reveal>
      <Reveal>
        <SiteFooter />
      </Reveal>
    </div>
  );
}
