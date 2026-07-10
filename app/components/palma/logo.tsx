import Image from "next/image";
import { images } from "../../palma-data";

export function LogoFull({ className = "h-12" }: { className?: string }) {
  return (
    <Image
      src={images.logoFull.src}
      alt={images.logoFull.alt}
      width={images.logoFull.width}
      height={images.logoFull.height}
      className={`h-12 w-auto max-w-full self-start object-contain ${className}`}
      priority
    />
  );
}
