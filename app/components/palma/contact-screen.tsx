"use client";

import Image from "next/image";
import { FormEvent, type ReactNode, useState } from "react";
import { contactOptions, images, type ImageAsset } from "../../palma-data";
import { PrimaryButton } from "./buttons";
import { ImageFrame } from "./image-frame";
import { ContactFact, Field, ReturnLink } from "./layout-parts";
import { LogoFull } from "./logo";
import { Reveal } from "./reveal";

export function ContactScreen({ foundersImage }: { foundersImage: ImageAsset }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <section className="mx-auto grid min-h-[85vh] max-w-[1440px] gap-9 px-5 pb-14 pt-24 md:grid-cols-[5fr_7fr] md:gap-20 md:px-[52px] md:pb-[60px] md:pt-40">
        <div>
          <ReturnLink href="/" className="mb-10">
            Inicio
          </ReturnLink>
          <Reveal>
            <p className="mb-6 text-[10px] font-normal uppercase tracking-[0.28em] text-[#a9a79c]">
              Contacto
            </p>
            <h1 className="mb-10 text-[clamp(32px,4.5vw,60px)] font-light italic leading-[1.12] text-[#3d2e69] text-pretty">
              Hablemos sobre
              <br />
              tu proyecto
            </h1>
            <div className="mb-9 flex flex-col gap-3 border-b border-[#e0ddd7] pb-9">
              <FounderName image={images.isabellaName} />
              <FounderName image={images.heidiName} />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="mb-10 flex flex-col gap-7">
              <ContactFact label="Email">hola@palmapaisajismo.com.ar</ContactFact>
              <ContactFact label="Instagram">@palma.paisajismo</ContactFact>
              <ContactFact label="Área de trabajo">
                Buenos Aires, Argentina
                <br />
                Proyectos en todo el país
              </ContactFact>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ImageFrame
              image={foundersImage}
              className="h-[200px] md:h-[220px]"
              imgClassName="object-[center_20%]"
              priority
            />
          </Reveal>
        </div>

        <Reveal delay={120} className="md:pt-[230px] lg:pt-[256px]">
          {submitted ? (
            <div className="flex flex-col gap-5 pt-12 md:ml-auto md:max-w-[620px] md:border-t md:border-[#e0ddd7] md:pt-8">
              <div className="h-0.5 w-10 bg-[#4a6038]" />
              <h3 className="text-[34px] font-light italic leading-tight text-[#3d2e69]">
                Gracias por escribirnos
              </h3>
              <p className="text-[15px] font-light leading-[1.85] text-[#493f2c]">
                Te responderemos a la brevedad para charlar sobre tu proyecto.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              data-contact-form
              className="flex flex-col gap-7 pt-8 md:ml-auto md:w-full md:max-w-[620px] md:border-t md:border-[#e0ddd7] md:pt-8"
            >
              <Field label="Nombre" htmlFor="fname">
                <input id="fname" type="text" required placeholder="Tu nombre completo" className="field-control" />
              </Field>
              <Field label="Email" htmlFor="femail">
                <input id="femail" type="email" required placeholder="tu@email.com" className="field-control" />
              </Field>
              <Field label="Tipo de proyecto" htmlFor="ftype">
                <select id="ftype" className="field-control cursor-pointer appearance-none">
                  {contactOptions.map(([value, label]) => (
                    <option key={value || "empty"} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Contanos sobre tu espacio" htmlFor="fmessage">
                <textarea
                  id="fmessage"
                  rows={4}
                  placeholder="Describí tu espacio, tus ideas y lo que esperás del paisaje."
                  className="field-control resize-none leading-[1.7]"
                />
              </Field>
              <PrimaryButton type="submit" className="self-start px-9 tracking-[0.18em]">
                Enviar consulta
              </PrimaryButton>
            </form>
          )}
        </Reveal>
      </section>
      <Reveal>
        <div className="border-t border-[#e0ddd7]">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-[52px]">
            <LogoFull className="h-12" />
            <FooterText>© 2025 Palma — Diseño de Paisajes con Sentido</FooterText>
            <FooterText>Buenos Aires, Argentina</FooterText>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function FounderName({ image }: { image: ImageAsset }) {
  return (
    <div data-founder-name className="flex min-w-0 flex-col items-start gap-2">
      <span className="text-[10px] font-normal uppercase tracking-[0.1em] text-[#a9a79c]">Paisajista</span>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="h-8 w-auto max-w-[72%] object-contain sm:h-9 md:h-10"
      />
    </div>
  );
}

function FooterText({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-light text-[#a9a79c]">{children}</p>;
}
