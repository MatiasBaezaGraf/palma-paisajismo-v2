import { images, type ImageAsset } from "../palma-data";

export type PageImageId = "methodology-hero" | "contact-founders";

export type PageImageConfig = {
  id: PageImageId;
  page: "metodologia" | "contacto";
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
  "methodology-hero": {
    id: "methodology-hero",
    page: "metodologia",
    pageLabel: "Metodología",
    slot: "hero",
    label: "Imagen principal",
    image_path: "pages/metodologia/hero/current.jpg",
    image_alt: images.designTable.alt,
    image_width: images.designTable.width,
    image_height: images.designTable.height,
    fallback: images.designTable,
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
