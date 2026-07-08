import { images, methodSteps } from "../../palma-data";
import { ImageFrame } from "./image-frame";
import { BottomBar, Cta } from "./layout-parts";

export function MethodologyScreen() {
  return (
    <div>
      <section className="relative h-[60vh] overflow-hidden md:h-[82vh]">
        <ImageFrame
          image={images.designTable}
          className="absolute inset-0"
          imgClassName="object-[center_20%]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#131419]/45" />
        <div className="absolute inset-x-5 bottom-12 md:inset-x-[52px] md:bottom-[72px]">
          <p className="mb-4 text-[10px] font-normal uppercase tracking-[0.34em] text-white/50">
            Metodología de trabajo
          </p>
          <h1 className="max-w-[820px] text-[clamp(36px,6.5vw,88px)] font-light italic leading-none text-white text-pretty">
            De la escucha al paisaje construido.
          </h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1440px] gap-7 border-b border-[#e0ddd7] px-5 py-14 md:grid-cols-[5fr_7fr] md:gap-20 md:px-[52px] md:py-[100px]">
        <h2 className="text-[clamp(22px,2.8vw,36px)] font-light italic leading-tight text-[#131419] text-pretty">
          Cada proyecto es un proceso de descubrimiento mutuo.
        </h2>
        <p className="self-center text-[15px] font-light leading-[1.92] text-[#493f2c] text-pretty">
          Escuchamos el lugar, comprendemos las necesidades de quienes lo habitarán o los requerimientos de
          quienes lo transitarán, y las traducimos a un diseño pensado especialmente para ese sitio.
        </p>
      </section>
      <section className="mx-auto max-w-[1440px] px-5 md:px-[52px]">
        {methodSteps.map((step) => (
          <div
            key={step.n}
            className="grid gap-7 border-b border-[#e0ddd7] py-9 md:grid-cols-[5fr_7fr] md:gap-20 md:py-14"
          >
            <div>
              <span className="text-[10px] font-normal uppercase tracking-[0.28em] text-[#c5c2bb]">
                {step.n}
              </span>
              <h3 className="mt-2.5 text-[clamp(22px,2.5vw,32px)] font-light italic leading-tight text-[#131419] text-pretty">
                {step.title}
              </h3>
            </div>
            <p className="pt-1 text-[15px] font-light leading-[1.92] text-[#493f2c] text-pretty">
              {step.description}
            </p>
          </div>
        ))}
      </section>
      <Cta
        title="¿Tenés un proyecto en mente?"
        description="Contanos sobre tu espacio y te contamos cómo podemos trabajar juntos."
        button="Contactanos"
        href="/contacto"
      />
      <BottomBar names />
    </div>
  );
}
