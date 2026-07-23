import type { ImageAsset } from "../../palma-data";
import { Cta, BottomBar, ReturnLink } from "./layout-parts";
import { ImageFrame } from "./image-frame";
import { Reveal } from "./reveal";

const thinkingParagraphs = [
  "Por eso abordamos cada proyecto de manera personalizada, comprendiendo que cada lugar tiene su propia identidad, sus necesidades y su potencial.",
  "Antes de diseñar, dedicamos tiempo a conocer el sitio: la luz, el suelo, la arquitectura, los recorridos y la forma en que ese espacio será habitado. A partir de esa lectura definimos el alcance del proyecto. Es el propio lugar el que nos indica cuántas etapas requiere y en qué momento conviene llevar adelante cada una.",
  "Buscamos que cada decisión sea eficiente, precisa y respetuosa de los tiempos de la naturaleza. Entendemos el paisajismo como un proceso, no como un resultado inmediato.",
];

const afterWorkParagraphs = [
  "Diseñamos, proyectamos y ejecutamos, pero también acompañamos el desarrollo del jardín después de la plantación. Porque un jardín comienza a construirse mucho después de terminada la obra.",
  "Creemos, además, que parte de nuestro trabajo consiste en acompañar a nuestros clientes en un cambio de mirada: aprender a observar los cambios de las estaciones, valorar las transformaciones del paisaje y comprender que la naturaleza tiene sus propios ritmos. No buscamos imponer un jardín perfecto e inmóvil, sino crear paisajes vivos, capaces de madurar, sorprender y expresar su belleza en cada etapa.",
];

export function NuestraMiradaScreen({
  heroImage,
  heidiImage,
  isabellaImage,
}: {
  heroImage: ImageAsset;
  heidiImage: ImageAsset;
  isabellaImage: ImageAsset;
}) {
  return (
    <div>
      <section className="relative h-[64vh] min-h-[480px] overflow-hidden md:h-[82vh]">
        <ImageFrame
          image={heroImage}
          className="absolute inset-0 animate-[scaleReveal_1.6s_ease-out_both]"
          imgClassName="object-[center_20%]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#131419]/45" />
        <div className="absolute left-5 top-24 z-10 md:left-[52px] md:top-[120px]">
          <ReturnLink href="/" tone="light">
            Inicio
          </ReturnLink>
        </div>
        <div className="absolute inset-x-5 bottom-12 animate-[fadeUp_0.9s_0.5s_ease-out_both] md:inset-x-[52px] md:bottom-[72px]">
          <p className="mb-4 text-[10px] font-normal uppercase tracking-[0.34em] text-white/50">
            Nuestra mirada
          </p>
          <h1 className="max-w-[820px] text-[clamp(36px,6.5vw,88px)] font-light italic leading-none text-white text-pretty">
            Cada jardín es único
          </h1>
        </div>
      </section>

      <Reveal>
        <EditorialSection eyebrow="Cómo pensamos cada proyecto" paragraphs={thinkingParagraphs} />
      </Reveal>

      <Reveal>
        <section className="mt-14 bg-[#131419] px-5 py-16 md:mt-[100px] md:px-[52px] md:py-[92px]">
          <div className="mx-auto max-w-[1080px] text-center">
            <p className="mb-6 text-[10px] font-normal uppercase tracking-[0.3em] text-white/40">
              Lo que nos distingue
            </p>
            <h2 className="text-[clamp(24px,4vw,44px)] font-light italic leading-[1.35] text-white text-pretty">
              No vendemos un jardín terminado
              <br />
              Acompañamos la construcción de un paisaje en el tiempo
            </h2>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <EditorialSection eyebrow="Después de la obra" paragraphs={afterWorkParagraphs} bordered />
      </Reveal>

      <section className="mx-auto max-w-[1440px] px-5 pt-14 md:px-[52px] md:pt-[100px]">
        <Reveal>
          <div>
            <p className="mb-4 text-[10px] font-normal uppercase tracking-[0.28em] text-[#a9a79c]">
              El estudio
            </p>
            <h2 className="mb-10 text-[clamp(24px,2.8vw,38px)] font-light italic leading-tight text-[#3d2e69] text-pretty md:mb-12">
              Isabella de Sousa · Heidi Ignatov
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-10 md:grid-cols-2 md:gap-20 lg:gap-[96px]">
          <Reveal delay={40}>
            <TeamCard
              image={isabellaImage}
              name="Isabella de Sousa"
              role="Paisajista"
              body="Texto pendiente de confirmación."
              pending
            />
          </Reveal>
          <Reveal delay={90}>
            <TeamCard
              image={heidiImage}
              name="Heidi Ignatov"
              role="Paisajista"
              body="Me formé como paisajista en Pampa Infinita en 2010, luego de un recorrido previo vinculado al diseño. Desde entonces nunca dejé de estudiar, investigar y descubrir nuevas maneras de mirar el paisaje. Mi recorrido me llevó desde las especies nativas y los distintos ecosistemas hasta los proyectos de gran escala, sin perder el interés por los jardines de escala acotada, donde cada elemento tiene un propósito y cada detalle transforma la experiencia del espacio. Mi búsqueda permanente es la belleza. Mis ojos siempre se posan allí: en la luz, el movimiento, los reflejos y esos detalles sutiles que hacen único a cada paisaje."
            />
          </Reveal>
        </div>
      </section>

      <Reveal>
        <Cta
          title="¿Tenés un proyecto en mente?"
          description="Contanos sobre tu espacio y te contamos cómo podemos trabajar juntos."
          button="Contactanos"
          href="/contacto"
        />
      </Reveal>
      <Reveal>
        <BottomBar names />
      </Reveal>
    </div>
  );
}

function EditorialSection({
  eyebrow,
  paragraphs,
  bordered = false,
}: {
  eyebrow: string;
  paragraphs: string[];
  bordered?: boolean;
}) {
  return (
    <section
      className={`mx-auto grid max-w-[1440px] gap-7 px-5 py-14 md:grid-cols-[5fr_7fr] md:gap-20 md:px-[52px] md:py-[100px] ${
        bordered ? "border-b border-[#e0ddd7]" : "pb-0 md:pb-0"
      }`}
    >
      <div>
        <p className="text-[10px] font-normal uppercase tracking-[0.28em] text-[#a9a79c]">{eyebrow}</p>
      </div>
      <div className="flex flex-col gap-6">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-base font-light leading-[1.9] text-[#493f2c] text-pretty">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

function TeamCard({
  image,
  name,
  role,
  body,
  pending = false,
}: {
  image?: ImageAsset;
  name: string;
  role: string;
  body: string;
  pending?: boolean;
}) {
  return (
    <article>
      {image ? (
        <ImageFrame
          image={image}
          className="mb-6 h-[360px] w-full md:h-[520px]"
          imgClassName="object-[center_20%]"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      ) : (
        <div className="mb-6 flex h-[360px] w-full items-center justify-center overflow-hidden bg-[repeating-linear-gradient(135deg,#e8e4de,#e8e4de_10px,#f1eee7_10px,#f1eee7_20px)] md:h-[520px]">
          <span className="bg-[#f9f7f4] px-3 py-1.5 font-mono text-[11px] tracking-[0.05em] text-[#a9a79c]">
            foto de Isabella - pendiente
          </span>
        </div>
      )}
      <h3 className="mb-1 text-lg font-normal italic text-[#3d2e69]">{name}</h3>
      <p className="mb-[18px] text-[10px] font-normal uppercase tracking-[0.16em] text-[#6b7f52]">{role}</p>
      <p
        className={`text-sm font-light leading-[1.85] text-pretty ${
          pending ? "italic text-[#b3afa6]" : "text-[#493f2c]"
        }`}
      >
        {body}
      </p>
    </article>
  );
}
