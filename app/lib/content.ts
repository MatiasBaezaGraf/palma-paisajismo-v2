import { images, projectTypes as fallbackProjectTypes, type ImageAsset, type ProjectType } from "../palma-data";
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

export function projectTypeFromRow(row: ProjectTypeRow): ProjectType {
  return {
    slug: row.slug,
    title: row.title,
    desc: row.description,
    image: imageFromRow(row),
  };
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
    .select("slug, title, description, sort_order, image_path, image_alt, image_width, image_height, is_active, updated_at")
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
    .select("slug, title, description, sort_order, image_path, image_alt, image_width, image_height, is_active, updated_at")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return fallback;
  }

  return projectTypeFromRow(data);
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
  const [{ data: homeImages, error: homeError }, { data: projectTypes, error: projectError }] = await Promise.all([
    supabase
      .from("home_images")
      .select("slot, label, image_path, image_alt, image_width, image_height, updated_at")
      .order("slot", { ascending: true }),
    supabase
      .from("project_types")
      .select("slug, title, description, sort_order, image_path, image_alt, image_width, image_height, is_active, updated_at")
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
  };
}
