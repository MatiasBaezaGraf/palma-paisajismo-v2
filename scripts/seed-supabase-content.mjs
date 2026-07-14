import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const envPath = path.join(rootDir, ".env.local");
const bucket = "palma-images";

function loadEnvFile() {
  return readFile(envPath, "utf8")
    .then((content) => {
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
        const [key, ...valueParts] = trimmed.split("=");
        process.env[key] ??= valueParts.join("=").replace(/^["']|["']$/g, "");
      }
    })
    .catch(() => undefined);
}

const homeImages = [
  {
    slot: "hero",
    label: "Imagen principal",
    file: "palma-04.jpg",
    path: "home/hero/palma-04.jpg",
    alt: "Jardín residencial con piscina diseñado por Palma",
    width: 1920,
    height: 1275,
  },
  {
    slot: "studio",
    label: "Imagen del estudio",
    file: "palma-03.jpg",
    path: "home/studio/palma-03.jpg",
    alt: "Patio y jardín residencial con área de estar exterior",
    width: 1920,
    height: 1275,
  },
];

const projectTypes = [
  {
    slug: "balcones-y-terrazas-verdes",
    title: "Balcones y terrazas verdes",
    description: "Paisajismo para espacios urbanos reducidos.",
    sort_order: 1,
    file: "palma-17.jpg",
    path: "project-types/balcones-y-terrazas-verdes/palma-17.jpg",
    alt: "Agua y vegetación para balcones y terrazas",
    width: 1200,
    height: 1200,
  },
  {
    slug: "patios-y-jardines-residenciales-de-todas-las-escalas",
    title: "Patios y jardines residenciales de todas las escalas",
    description: "Jardines pensados para cada forma de habitar y cada escala.",
    sort_order: 2,
    file: "palma-16.jpg",
    path: "project-types/patios-y-jardines-residenciales-de-todas-las-escalas/palma-16.jpg",
    alt: "Arbolado y jardín residencial",
    width: 1600,
    height: 1067,
  },
  {
    slug: "jardines-rurales-casas-de-campo-y-paisajes-de-gran-escala",
    title: "Jardines rurales, casas de campo y paisajes de gran escala",
    description: "Propuestas que dialogan con el paisaje y las condiciones del entorno.",
    sort_order: 3,
    file: "palma-12.jpg",
    path: "project-types/jardines-rurales-casas-de-campo-y-paisajes-de-gran-escala/palma-12.jpg",
    alt: "Flor amarilla en paisaje rural",
    width: 1600,
    height: 2400,
  },
  {
    slug: "diseno-paisajistico-para-barrios-privados-y-desarrollos-residenciales",
    title: "Diseño paisajístico para barrios privados y desarrollos residenciales",
    description: "Diseño de espacios comunes con identidad y continuidad paisajística.",
    sort_order: 4,
    file: "palma-18.jpg",
    path: "project-types/diseno-paisajistico-para-barrios-privados-y-desarrollos-residenciales/palma-18.jpg",
    alt: "Paisaje de agua para desarrollos residenciales",
    width: 1600,
    height: 1067,
  },
  {
    slug: "espacios-exteriores-para-empresas-y-entornos-corporativos",
    title: "Espacios exteriores para empresas y entornos corporativos",
    description: "Espacios exteriores que acompañan la dinámica y la imagen institucional.",
    sort_order: 5,
    file: "palma-13.jpg",
    path: "project-types/espacios-exteriores-para-empresas-y-entornos-corporativos/palma-13.jpg",
    alt: "Detalle floral en espacio exterior",
    width: 1600,
    height: 1067,
  },
  {
    slug: "paisajismo-para-areas-industriales-y-logisticas",
    title: "Paisajismo para áreas industriales y logísticas",
    description: "Paisajismo funcional para entornos productivos y de circulación.",
    sort_order: 6,
    file: "palma-11.jpg",
    path: "project-types/paisajismo-para-areas-industriales-y-logisticas/palma-11.jpg",
    alt: "Plano y textura de proyecto paisajístico",
    width: 1200,
    height: 1349,
  },
  {
    slug: "diseno-exterior-para-hoteleria-gastronomia-y-espacios-de-encuentro",
    title: "Diseño exterior para hotelería, gastronomía y espacios de encuentro",
    description: "Atmósferas que invitan a permanecer.",
    sort_order: 7,
    file: "palma-15.jpg",
    path: "project-types/diseno-exterior-para-hoteleria-gastronomia-y-espacios-de-encuentro/palma-15.jpg",
    alt: "Plantación y cuidado de espacios exteriores",
    width: 1200,
    height: 1200,
  },
  {
    slug: "consultoria-paisajistica-para-estudios-de-arquitectura",
    title: "Consultoría paisajística para estudios de arquitectura",
    description: "Asesoramiento y acompañamiento paisajístico en las distintas etapas del proyecto.",
    sort_order: 8,
    file: "palma-14.jpg",
    path: "project-types/consultoria-paisajistica-para-estudios-de-arquitectura/palma-14.jpg",
    alt: "Flores y vegetación para consultoría paisajística",
    width: 1600,
    height: 1067,
  },
];

const pageImages = [
  {
    file: "palma-06.jpg",
    path: "pages/nuestra-mirada/hero/current.jpg",
  },
  {
    file: "palma-05.jpg",
    path: "pages/nuestra-mirada/heidi/current.jpg",
  },
  {
    file: "palma-05.jpg",
    path: "pages/contacto/founders/current.jpg",
  },
];

function contentTypeFor(fileName) {
  if (fileName.endsWith(".png")) return "image/png";
  if (fileName.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

async function uploadImage(supabase, item) {
  const filePath = path.join(rootDir, "public", "palma", item.file);
  const file = await readFile(filePath);
  const { error } = await supabase.storage.from(bucket).upload(item.path, file, {
    contentType: contentTypeFor(item.file),
    upsert: true,
  });

  if (error) throw error;
}

async function main() {
  await loadEnvFile();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  if (!buckets.some((item) => item.id === bucket)) {
    const { error } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: 10485760,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    });
    if (error) throw error;
  }

  for (const item of [...homeImages, ...projectTypes, ...pageImages]) {
    await uploadImage(supabase, item);
  }

  const { error: homeError } = await supabase.from("home_images").upsert(
    homeImages.map((item) => ({
      slot: item.slot,
      label: item.label,
      image_path: item.path,
      image_alt: item.alt,
      image_width: item.width,
      image_height: item.height,
    })),
    { onConflict: "slot" },
  );
  if (homeError) throw homeError;

  const { error: projectError } = await supabase.from("project_types").upsert(
    projectTypes.map((item) => ({
      slug: item.slug,
      title: item.title,
      description: item.description,
      sort_order: item.sort_order,
      image_path: item.path,
      image_alt: `image-${item.sort_order}`,
      image_width: item.width,
      image_height: item.height,
      is_active: true,
    })),
    { onConflict: "slug" },
  );
  if (projectError) throw projectError;

  const { data: users, error: usersError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
  if (usersError) throw usersError;

  const adminUser = users.users.find((user) => user.email?.toLowerCase() === "admin@admin.com");

  if (adminUser?.email) {
    const { error: adminError } = await supabase
      .from("admin_users")
      .upsert({ user_id: adminUser.id, email: adminUser.email }, { onConflict: "user_id" });
    if (adminError) throw adminError;
    console.log("Seeded content and linked admin@admin.com in admin_users.");
  } else {
    console.log("Seeded content. Create admin@admin.com in Supabase Auth, then run this script again.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
