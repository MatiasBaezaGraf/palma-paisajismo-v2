import type { ProjectType } from "../../palma-data";
import { typeProcessSteps, fallbackTypeIntro } from "../../palma-data";
import { ImageFrame } from "./image-frame";
import { BottomBar, Cta, ReturnLink } from "./layout-parts";
import { Reveal } from "./reveal";

export function TypeDetailScreen({ type }: { type: ProjectType }) {
  const intro = type.intro?.trim() ? type.intro : fallbackTypeIntro;
  const steps = type.steps?.length ? type.steps : typeProcessSteps;

  return (
    <div>
      <div className="mx-auto max-w-[1440px] px-5 pt-20 md:px-[52px] md:pt-[120px]">
        <ReturnLink href="/que-disenamos">Qué diseñamos</ReturnLink>
      </div>
      <Reveal>
        <div className="mx-auto max-w-[1440px] border-b border-[#e0ddd7] px-5 pb-12 pt-6 md:px-[52px]">
          <p className="mb-4 text-[10px] font-normal uppercase tracking-[0.28em] text-[#a9a79c]">
            Tipo de proyecto
          </p>
          <h1 className="max-w-5xl text-[clamp(30px,4.5vw,60px)] font-light italic leading-[1.08] text-[#3d2e69] text-pretty">
            {type.title}
          </h1>
        </div>
      </Reveal>
      <Reveal>
        <section className="mx-auto grid max-w-[1440px] gap-7 border-b border-[#e0ddd7] px-5 py-14 md:grid-cols-[5fr_7fr] md:gap-20 md:px-[52px] md:py-[100px]">
          <div>
            {intro.split(/\n{2,}/).map((paragraph, index) => (
              <p
                key={index}
                className="text-base font-light leading-[1.9] text-[#493f2c] text-pretty [&:not(:first-child)]:mt-5"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <ImageFrame image={type.image} className="h-[260px] md:h-[420px]" />
        </section>
      </Reveal>
      <section className="mx-auto max-w-[1440px] px-5 md:px-[52px]">
        <Reveal>
          <div className="py-14 pb-6 md:py-[100px] md:pb-6">
            <p className="mb-3.5 text-[10px] font-normal uppercase tracking-[0.28em] text-[#a9a79c]">
              Nuestro enfoque para este tipo de proyecto
            </p>
            <h2 className="text-[clamp(22px,2.6vw,34px)] font-light italic text-[#3d2e69] text-pretty">
              Cómo lo abordamos
            </h2>
          </div>
        </Reveal>
        {steps.map((step, index) => (
          <Reveal key={`${index}-${step.title}`} delay={index * 45}>
            <div className="grid gap-7 border-t border-[#e0ddd7] py-9 md:grid-cols-[5fr_7fr] md:gap-20 md:py-14">
              <h3 className="text-[clamp(20px,2.2vw,28px)] font-light italic leading-tight text-[#3d2e69] text-pretty">
                {step.title}
              </h3>
              <p className="pt-1 text-[15px] font-light leading-[1.9] text-[#493f2c] text-pretty">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </section>
      <Reveal>
        <Cta title="¿Tenés un proyecto de este tipo?" button="Contactanos" href="/contacto" />
      </Reveal>
      <BottomBar backToTypes />
    </div>
  );
}
