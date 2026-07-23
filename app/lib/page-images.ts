import { images, type ImageAsset } from "../palma-data";

export type PageImageId =
  | "nuestra-mirada-hero"
  | "nuestra-mirada-heidi"
  | "nuestra-mirada-isabella"
  | "contact-founders";

export type PageImageConfig = {
  id: PageImageId;
  page: "nuestra-mirada" | "contacto";
  pageLabel: string;
  slot: string;
  label: string;
  image_path: string;
  image_alt: string;
  image_width: number;
  image_height: number;
  fallback: ImageAsset;
};

export const pageImageConfigs = {
  "nuestra-mirada-hero": {
    id: "nuestra-mirada-hero",
    page: "nuestra-mirada",
    pageLabel: "Nuestra mirada",
    slot: "hero",
    label: "Imagen principal",
    image_path: "pages/nuestra-mirada/hero/current.jpg",
    image_alt: "Estudio de paisajismo Palma, Isabella de Sousa y Heidi Ignatov",
    image_width: images.designTable.width,
    image_height: images.designTable.height,
    fallback: images.designTable,
  },
  "nuestra-mirada-heidi": {
    id: "nuestra-mirada-heidi",
    page: "nuestra-mirada",
    pageLabel: "Nuestra mirada",
    slot: "heidi",
    label: "Heidi Ignatov",
    image_path: "pages/nuestra-mirada/heidi/current.jpg",
    image_alt: "Heidi Ignatov, paisajista de Palma",
    image_width: images.founders.width,
    image_height: images.founders.height,
    fallback: images.founders,
  },
  "nuestra-mirada-isabella": {
    id: "nuestra-mirada-isabella",
    page: "nuestra-mirada",
    pageLabel: "Nuestra mirada",
    slot: "isabella",
    label: "Isabella de Sousa",
    image_path: "pages/nuestra-mirada/isabella/current.jpg",
    image_alt: "Isabella de Sousa, paisajista de Palma",
    image_width: images.founders.width,
    image_height: images.founders.height,
    fallback: images.founders,
  },
  "contact-founders": {
    id: "contact-founders",
    page: "contacto",
    pageLabel: "Contacto",
    slot: "founders",
    label: "Fundadoras",
    image_path: "pages/contacto/founders/current.jpg",
    image_alt: images.founders.alt,
    image_width: images.founders.width,
    image_height: images.founders.height,
    fallback: images.founders,
  },
} satisfies Record<PageImageId, PageImageConfig>;

export function getPageImageConfig(id: string) {
  return pageImageConfigs[id as PageImageId] ?? null;
}
