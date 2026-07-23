import Image from "next/image";
import { images, type ImageAsset } from "../../palma-data";

export function PortfolioPreview() {
  return (
    <>
      <div className="mx-auto flex max-w-[1440px] items-baseline justify-between border-b border-[#e0ddd7] px-5 pb-6 pt-14 md:px-[52px] md:pb-8 md:pt-[90px]">
        <div>
          <p className="mb-3 text-[10px] font-normal uppercase tracking-[0.28em] text-[#a9a79c]">
            Portfolio
          </p>
          <h2 className="text-[clamp(24px,3vw,42px)] font-light italic text-[#3d2e69]">
            Algunos de nuestros proyectos
          </h2>
        </div>
        <span className="ml-4 inline-flex items-center gap-2 whitespace-nowrap border border-[#ddd8cd] px-3.5 py-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#b3afa6]">
          ● Próximamente
        </span>
      </div>
      <div className="mx-auto mt-[3px] grid max-w-[1440px] gap-[3px] px-5 md:grid-cols-[1.35fr_1fr] md:px-[52px]">
        <ProjectPreviewImage
          image={images.residentialFront}
          className="h-[300px] md:row-span-2 md:h-[703px]"
          labelled
        />
        <ProjectPreviewImage image={images.heroGarden} className="h-60 md:h-[350px]" />
        <ProjectPreviewImage image={images.verticalGarden} className="h-60 md:h-[350px]" />
      </div>
      <div className="mx-auto max-w-[1440px] px-5 pt-6 md:px-[52px]">
        <p className="text-[13px] font-light leading-relaxed text-[#a9a79c]">
          Estamos preparando una selección de los proyectos realizados por el estudio.
        </p>
      </div>
    </>
  );
}

function ProjectPreviewImage({
  image,
  className,
  labelled = false,
}: {
  image: ImageAsset;
  className: string;
  labelled?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#131419]/45 to-transparent" />
      {labelled ? (
        <div className="absolute inset-x-0 bottom-0 p-7">
          <p className="text-lg font-light italic leading-tight text-white">Próximamente</p>
        </div>
      ) : null}
    </div>
  );
}
