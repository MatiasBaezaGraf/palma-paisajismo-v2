import {
  images,
  projectTypes as fallbackProjectTypes,
  typeProcessSteps,
  fallbackTypeIntro,
  type ImageAsset,
  type ProjectStep,
  type ProjectType,
} from "../palma-data";
import { getPublicImageUrl } from "./images";
import { pageImageConfigs, type PageImageConfig, type PageImageId } from "./page-images";
import { createClient } from "./supabase/server";

export type HomeImageSlot = "hero" | "studio";

export type HomeImages = Record<HomeImageSlot, ImageAsset>;

export type HomeImageRow = {
  slot: HomeImageSlot;
  label: string;
  image_path: string;
  image_alt: string;
  image_width: number;
  image_height: number;
  updated_at: string;
};

export type ProjectTypeRow = {
  slug: string;
  title: string;
  description: string;
  sort_order: number;
  image_path: string;
  image_alt: string;
  image_width: number;
  image_height: number;
  detail_intro: string;
  detail_steps: ProjectStep[];
  is_active: boolean;
  updated_at: string;
};

export type PageImageRow = {
  id: PageImageId;
  page: PageImageConfig["page"];
  pageLabel: string;
  slot: string;
  label: string;
  image_path: string;
  image_alt: string;
  image_width: number;
  image_height: number;
  updated_at: string;
};

export type SiteSectionRow = {
  slug: string;
  label: string;
  is_enabled: boolean;
  updated_at: string;
};

export type ProductRow = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  description: string;
  sort_order: number;
  image_path: string;
  image_alt: string;
  image_width: number;
  image_height: number;
  is_active: boolean;
  updated_at: string;
};

export type Product = {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  description: string;
  image: ImageAsset | null;
};

export const fallbackProducts: Product[] = [
  {
    slug: "maceta-de-terracota-artesanal",
    title: "Maceta de terracota artesanal",
    subtitle: "Pieza torneada a mano, ideal para especies de mediana escala.",
    price: "$ 45.000 ARS",
    description:
      "Maceta de terracota torneada a mano por artesanos locales. Su porosidad favorece la aireación de la raíz y su pátina natural se profundiza con el tiempo y la intemperie. Disponible en distintos diámetros según el proyecto.",
    image: null,
  },
  {
    slug: "banco-de-jardin-en-madera-de-teca",
    title: "Banco de jardín en madera de teca",
    subtitle: "Mobiliario exterior resistente a la intemperie.",
    price: "$ 128.000 ARS",
    description:
      "Banco macizo de teca, pensado para permanecer a la intemperie durante todo el año. Su diseño simple acompaña tanto jardines contemporáneos como paisajes más silvestres.",
    image: null,
  },
  {
    slug: "set-de-herramientas-de-jardineria",
    title: "Set de herramientas de jardinería",
    subtitle: "Herramientas manuales de uso cotidiano en obra.",
    price: "$ 38.500 ARS",
    description:
      "Conjunto de herramientas manuales — pala de mano, tijera de podar y rastrillo — con mango de madera y cabezal de acero. Las mismas que usamos en el mantenimiento diario de nuestros proyectos.",
    image: null,
  },
  {
    slug: "luminaria-solar-de-exterior",
    title: "Luminaria solar de exterior",
    subtitle: "Iluminación de bajo consumo para senderos y canteros.",
    price: "$ 22.000 ARS",
    description:
      "Luminaria solar de bajo perfil, pensada para marcar recorridos y resaltar canteros durante la noche sin necesidad de instalación eléctrica.",
    image: null,
  },
  {
    slug: "sustrato-premium-organico-20kg",
    title: "Sustrato premium orgánico 20kg",
    subtitle: "Mezcla balanceada para plantación y trasplante.",
    price: "$ 9.800 ARS",
    description:
      "Sustrato orgánico balanceado, formulado para favorecer el enraizamiento en plantación y trasplante. Es el mismo que utilizamos en la preparación de canteros en obra.",
    image: null,
  },
  {
    slug: "aspersor-de-riego-automatico",
    title: "Aspersor de riego automático",
    subtitle: "Riego programable para jardines de mediana escala.",
    price: "$ 54.000 ARS",
    description:
      "Aspersor con temporizador programable, pensado para automatizar el riego en jardines residenciales de mediana escala y reducir el consumo de agua.",
    image: null,
  },
];

export const fallbackHomeImages: HomeImages = {
  hero: images.heroGarden,
  studio: images.studioGarden,
};

function imageFromRow(row: {
  image_path: string;
  image_alt: string;
  image_width: number;
  image_height: number;
}): ImageAsset {
  return {
    src: getPublicImageUrl(row.image_path),
    alt: row.image_alt,
    width: row.image_width,
    height: row.image_height,
  };
}

function imageFromPageImage(row: PageImageRow): ImageAsset {
  return {
    src: row.image_path,
    alt: row.image_alt,
    width: row.image_width,
    height: row.image_height,
  };
}

function versionedPublicPath(path: string, updatedAt?: string | null) {
  const url = getPublicImageUrl(path);
  return updatedAt ? `${url}?v=${encodeURIComponent(updatedAt)}` : url;
}

function splitStoragePath(path: string) {
  const parts = path.split("/");
  const name = parts.pop() ?? "";
  return {
    folder: parts.join("/"),
    name,
  };
}

async function getStorageUpdatedAt(path: string) {
  const supabase = await createClient();
  const { folder, name } = splitStoragePath(path);
  const { data, error } = await supabase.storage.from("palma-images").list(folder, {
    limit: 20,
    search: name,
  });

  if (error) {
    return null;
  }

  return data?.find((item) => item.name === name)?.updated_at ?? null;
}

async function pageImageRowFromConfig(config: PageImageConfig): Promise<PageImageRow> {
  const updatedAt = await getStorageUpdatedAt(config.image_path);
  const hasStorageImage = Boolean(updatedAt);

  return {
    id: config.id,
    page: config.page,
    pageLabel: config.pageLabel,
    slot: config.slot,
    label: config.label,
    image_path: hasStorageImage ? versionedPublicPath(config.image_path, updatedAt) : config.fallback.src,
    image_alt: config.image_alt,
    image_width: config.image_width,
    image_height: config.image_height,
    updated_at: updatedAt ?? new Date(0).toISOString(),
  };
}

function normalizeSteps(value: unknown): ProjectStep[] {
  if (!Array.isArray(value)) {
    return typeProcessSteps;
  }

  const steps = value
    .map((item) => {
      const record = item as Record<string, unknown>;
      return {
        title: typeof record?.title === "string" ? record.title : "",
        body: typeof record?.body === "string" ? record.body : "",
      };
    })
    .filter((step) => step.title.trim() || step.body.trim());

  return steps.length ? steps : typeProcessSteps;
}

export function projectTypeFromRow(row: ProjectTypeRow): ProjectType {
  return {
    slug: row.slug,
    title: row.title,
    desc: row.description,
    image: imageFromRow(row),
    intro: row.detail_intro?.trim() ? row.detail_intro : fallbackTypeIntro,
    steps: normalizeSteps(row.detail_steps),
  };
}

export function productFromRow(row: ProductRow): Product {
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    price: row.price,
    description: row.description,
    image: row.image_path
      ? {
          src: getPublicImageUrl(row.image_path),
          alt: row.image_alt || row.title,
          width: row.image_width,
          height: row.image_height,
        }
      : null,
  };
}

export async function isSiteSectionEnabled(slug: string, fallback = true): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_sections")
    .select("is_enabled")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return fallback;
  }

  return Boolean(data.is_enabled);
}

export async function getHomeImages(): Promise<HomeImages> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("home_images")
    .select("slot, label, image_path, image_alt, image_width, image_height, updated_at");

  if (error || !data?.length) {
    return fallbackHomeImages;
  }

  return data.reduce<HomeImages>(
    (acc, row) => {
      acc[row.slot as HomeImageSlot] = imageFromRow(row);
      return acc;
    },
    { ...fallbackHomeImages },
  );
}

export async function getProjectTypes(): Promise<ProjectType[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_types")
    .select("slug, title, description, sort_order, image_path, image_alt, image_width, image_height, detail_intro, detail_steps, is_active, updated_at")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackProjectTypes;
  }

  return data.map(projectTypeFromRow);
}

export async function getProjectType(slug: string): Promise<ProjectType | null> {
  const fallback = fallbackProjectTypes.find((type) => type.slug === slug) ?? null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_types")
    .select("slug, title, description, sort_order, image_path, image_alt, image_width, image_height, detail_intro, detail_steps, is_active, updated_at")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return fallback;
  }

  return projectTypeFromRow(data);
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, title, subtitle, price, description, sort_order, image_path, image_alt, image_width, image_height, is_active, updated_at",
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackProducts;
  }

  return data.map(productFromRow);
}

export async function getPageImage(id: PageImageId): Promise<ImageAsset> {
  const row = await pageImageRowFromConfig(pageImageConfigs[id]);
  return imageFromPageImage(row);
}

export async function getPageImages(): Promise<PageImageRow[]> {
  return Promise.all(Object.values(pageImageConfigs).map(pageImageRowFromConfig));
}

export async function getAdminContent() {
  const supabase = await createClient();
  const [
    { data: homeImages, error: homeError },
    { data: projectTypes, error: projectError },
    { data: siteSections, error: sectionsError },
    { data: products, error: productsError },
  ] = await Promise.all([
    supabase
      .from("home_images")
      .select("slot, label, image_path, image_alt, image_width, image_height, updated_at")
      .order("slot", { ascending: true }),
    supabase
      .from("project_types")
      .select("slug, title, description, sort_order, image_path, image_alt, image_width, image_height, detail_intro, detail_steps, is_active, updated_at")
      .order("sort_order", { ascending: true }),
    supabase
      .from("site_sections")
      .select("slug, label, is_enabled, updated_at")
      .order("slug", { ascending: true }),
    supabase
      .from("products")
      .select(
        "id, slug, title, subtitle, price, description, sort_order, image_path, image_alt, image_width, image_height, is_active, updated_at",
      )
      .order("sort_order", { ascending: true }),
  ]);

  if (homeError) {
    throw new Error(homeError.message);
  }

  if (projectError) {
    throw new Error(projectError.message);
  }

  const pageImages = await getPageImages();

  return {
    homeImages: (homeImages ?? []) as HomeImageRow[],
    projectTypes: (projectTypes ?? []) as ProjectTypeRow[],
    pageImages,
    siteSections: sectionsError
      ? [{ slug: "productos", label: "Productos", is_enabled: true, updated_at: new Date(0).toISOString() }]
      : ((siteSections ?? []) as SiteSectionRow[]),
    products: productsError ? [] : ((products ?? []) as ProductRow[]),
  };
}
