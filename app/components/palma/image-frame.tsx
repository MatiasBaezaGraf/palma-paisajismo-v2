import Image from "next/image";
import type { ImageAsset } from "../../palma-data";

export function ImageFrame({
  image,
  className,
  imgClassName = "",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  image: ImageAsset;
  className: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const positionClass = className.includes("absolute") || className.includes("fixed") ? "" : "relative";

  return (
    <div className={`${positionClass} overflow-hidden bg-[#e8e4de] ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${imgClassName}`}
      />
    </div>
  );
}
