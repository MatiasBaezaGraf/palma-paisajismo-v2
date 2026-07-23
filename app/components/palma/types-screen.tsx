import Link from "next/link";
import type { ProjectType } from "../../palma-data";
import { ImageFrame } from "./image-frame";
import { BottomBar, PageHeader } from "./layout-parts";
import { Reveal } from "./reveal";

export function TypesScreen({ projectTypes }: { projectTypes: ProjectType[] }) {
  return (
    <div>
      <PageHeader
        backHref="/"
        backLabel="Inicio"
        eyebrow="Qué diseñamos"
        title="En qué trabajamos"
        description="Diseñamos espacios exteriores en diferentes escalas y contextos. Cada proyecto responde a necesidades particulares, formas de habitar y características propias del lugar. Elegí una categoría para conocer cómo trabajamos cada proceso."
      />
      <div className="mx-auto max-w-[1440px] px-5 md:px-[52px]">
        {projectTypes.map((type, index) => (
          <Reveal key={type.slug} delay={index * 45}>
            <Link
              href={`/que-disenamos/${type.slug}`}
              className="group grid w-full cursor-pointer items-stretch gap-[18px] border-b border-[#e0ddd7] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/30 md:grid-cols-[5fr_7fr] md:gap-[60px]"
            >
              <div className="flex flex-col justify-center gap-3.5 py-6 md:py-0">
                <h2 className="text-[clamp(22px,2.6vw,30px)] font-light italic leading-tight text-[#3d2e69] transition-colors group-hover:text-[#4a6038] text-pretty">
                  {type.title}
                </h2>
                <p className="max-w-sm text-sm font-light leading-[1.7] text-[#777674] text-pretty">
                  {type.desc}
                </p>
                <span className="text-[11px] font-normal uppercase tracking-[0.12em] text-[#6b7f52]">
                  Ver proceso →
                </span>
              </div>
              <ImageFrame
                image={type.image}
                className="h-[200px] md:h-60"
                imgClassName="transition-transform duration-700 group-hover:scale-[1.06]"
              />
            </Link>
          </Reveal>
        ))}
      </div>
      <BottomBar />
    </div>
  );
}
