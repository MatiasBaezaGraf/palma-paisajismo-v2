export const PALMA_IMAGE_BUCKET = "palma-images";

export function getPublicImageUrl(path: string) {
  if (path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!baseUrl) {
    return path;
  }

  return `${baseUrl}/storage/v1/object/public/${PALMA_IMAGE_BUCKET}/${path}`;
}
