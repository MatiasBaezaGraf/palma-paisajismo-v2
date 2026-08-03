"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSession, requireAdminSession } from "../lib/admin-auth";
import { PALMA_IMAGE_BUCKET } from "../lib/images";
import { getPageImageConfig } from "../lib/page-images";
import { createClient } from "../lib/supabase/server";

const maxUploadSize = 10 * 1024 * 1024;
const mimeExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getPositiveInteger(formData: FormData, key: string) {
  const value = Number(getString(formData, key));
  return Number.isInteger(value) && value > 0 ? value : null;
}

function getCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getSlug(formData: FormData, key: string) {
  const slug = getString(formData, key).toLowerCase();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : "";
}

function safeNextPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/admin";
}

async function uploadImage(
  file: FormDataEntryValue | null,
  folder: string,
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  if (file.size > maxUploadSize) {
    throw new Error("La imagen no puede superar 10 MB.");
  }

  const extension = mimeExtensions[file.type];

  if (!extension) {
    throw new Error("Formato no permitido. Usá JPG, PNG o WebP.");
  }

  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(PALMA_IMAGE_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  return path;
}

async function uploadFixedImage(
  file: FormDataEntryValue | null,
  path: string,
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Seleccioná una imagen para guardar.");
  }

  if (file.size > maxUploadSize) {
    throw new Error("La imagen no puede superar 10 MB.");
  }

  const extension = mimeExtensions[file.type];

  if (!extension) {
    throw new Error("Formato no permitido. Usá JPG, PNG o WebP.");
  }

  const { error } = await supabase.storage.from(PALMA_IMAGE_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function signIn(formData: FormData) {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const next = safeNextPath(getString(formData, "next"));
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/admin/login?error=credentials");
  }

  const admin = await getAdminSession();

  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateHomeImage(formData: FormData) {
  const admin = await requireAdminSession();
  const slot = getString(formData, "slot");
  const alt = getString(formData, "alt");

  if (slot !== "hero" && slot !== "studio") {
    throw new Error("Slot inválido.");
  }

  if (!alt) {
    throw new Error("El texto alternativo es obligatorio.");
  }

  const imagePath = await uploadImage(formData.get("image"), `home/${slot}`, admin.supabase);
  const update: Record<string, string> = {
    image_alt: alt,
    updated_at: new Date().toISOString(),
    updated_by: admin.userId,
  };

  if (imagePath) {
    update.image_path = imagePath;
    const width = getPositiveInteger(formData, "image_width");
    const height = getPositiveInteger(formData, "image_height");
    if (width && height) {
      update.image_width = String(width);
      update.image_height = String(height);
    }
  }

  const { error } = await admin.supabase.from("home_images").update(update).eq("slot", slot);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateProjectTypeImage(formData: FormData) {
  const admin = await requireAdminSession();
  const slug = getString(formData, "slug");

  if (!slug) {
    throw new Error("Slug inválido.");
  }

  const { data: projectType, error: projectTypeError } = await admin.supabase
    .from("project_types")
    .select("sort_order")
    .eq("slug", slug)
    .single();

  if (projectTypeError || !projectType) {
    throw new Error(projectTypeError?.message ?? "Tipo de proyecto inválido.");
  }

  const imagePath = await uploadImage(formData.get("image"), `project-types/${slug}`, admin.supabase);
  const update: Record<string, string> = {
    image_alt: `image-${projectType.sort_order}`,
    updated_at: new Date().toISOString(),
    updated_by: admin.userId,
  };

  if (imagePath) {
    update.image_path = imagePath;
    const width = getPositiveInteger(formData, "image_width");
    const height = getPositiveInteger(formData, "image_height");
    if (width && height) {
      update.image_width = String(width);
      update.image_height = String(height);
    }
  }

  const { error } = await admin.supabase.from("project_types").update(update).eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/que-disenamos");
  revalidatePath(`/que-disenamos/${slug}`);
  revalidatePath("/admin");
}

export async function updateProjectTypeText(formData: FormData) {
  const admin = await requireAdminSession();
  const slug = getString(formData, "slug");

  if (!slug) {
    throw new Error("Slug inválido.");
  }

  const stepCount = getPositiveInteger(formData, "step_count") ?? 0;
  const steps: { title: string; body: string }[] = [];

  for (let index = 0; index < stepCount; index += 1) {
    const title = getString(formData, `step_title_${index}`);
    const body = getString(formData, `step_body_${index}`);

    if (title || body) {
      steps.push({ title, body });
    }
  }

  const description = getString(formData, "description");

  if (!description) {
    throw new Error("El subtítulo es obligatorio.");
  }

  const update = {
    description,
    detail_intro: getString(formData, "detail_intro"),
    detail_steps: steps,
    updated_at: new Date().toISOString(),
    updated_by: admin.userId,
  };

  const { error } = await admin.supabase.from("project_types").update(update).eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/que-disenamos");
  revalidatePath(`/que-disenamos/${slug}`);
  revalidatePath("/admin");
}

export async function updatePageImage(formData: FormData) {
  const admin = await requireAdminSession();
  const imageId = getString(formData, "imageId");
  const config = getPageImageConfig(imageId);

  if (!config) {
    throw new Error("Imagen inválida.");
  }

  await uploadFixedImage(formData.get("image"), config.image_path, admin.supabase);

  if (config.page === "nuestra-mirada") {
    revalidatePath("/nuestra-mirada");
  }

  if (config.page === "contacto") {
    revalidatePath("/contacto");
  }

  revalidatePath("/admin");
}

export async function updateProductsSectionAvailability(formData: FormData) {
  const admin = await requireAdminSession();
  const isEnabled = getCheckbox(formData, "is_enabled");

  const { error } = await admin.supabase.from("site_sections").upsert(
    {
      slug: "productos",
      label: "Productos",
      is_enabled: isEnabled,
      updated_at: new Date().toISOString(),
      updated_by: admin.userId,
    },
    { onConflict: "slug" },
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin");
}

export async function createProduct(formData: FormData) {
  const admin = await requireAdminSession();
  const slug = getSlug(formData, "slug");
  const title = getString(formData, "title");
  const subtitle = getString(formData, "subtitle");
  const price = getString(formData, "price");
  const description = getString(formData, "description");
  const sortOrder = getPositiveInteger(formData, "sort_order");

  if (!slug) {
    throw new Error("Usá un slug válido, en minúsculas y separado por guiones.");
  }

  if (!title || !subtitle || !price || !description || !sortOrder) {
    throw new Error("Completá nombre, slug, subtítulo, precio, descripción y orden.");
  }

  const imagePath = await uploadImage(formData.get("image"), `products/${slug}`, admin.supabase);
  const insert: Record<string, string | number | boolean> = {
    slug,
    title,
    subtitle,
    price,
    description,
    sort_order: sortOrder,
    image_path: imagePath ?? "",
    image_alt: title,
    image_width: 1200,
    image_height: 980,
    is_active: getCheckbox(formData, "is_active"),
    updated_at: new Date().toISOString(),
    updated_by: admin.userId,
  };

  if (imagePath) {
    const width = getPositiveInteger(formData, "image_width");
    const height = getPositiveInteger(formData, "image_height");
    if (width && height) {
      insert.image_width = width;
      insert.image_height = height;
    }
  }

  const { error } = await admin.supabase.from("products").insert(insert);

  if (error) {
    throw new Error(error.code === "23505" ? "Ya existe un producto con ese slug." : error.message);
  }

  revalidatePath("/productos");
  revalidatePath("/admin");
}

export async function updateProduct(formData: FormData) {
  const admin = await requireAdminSession();
  const slug = getString(formData, "slug");
  const title = getString(formData, "title");
  const subtitle = getString(formData, "subtitle");
  const price = getString(formData, "price");
  const description = getString(formData, "description");

  if (!slug) {
    throw new Error("Producto inválido.");
  }

  if (!title || !subtitle || !price || !description) {
    throw new Error("Completá el nombre, subtítulo, precio y descripción.");
  }

  const imagePath = await uploadImage(formData.get("image"), `products/${slug}`, admin.supabase);
  const update: Record<string, string | boolean> = {
    title,
    subtitle,
    price,
    description,
    image_alt: title,
    is_active: getCheckbox(formData, "is_active"),
    updated_at: new Date().toISOString(),
    updated_by: admin.userId,
  };

  if (imagePath) {
    update.image_path = imagePath;
    const width = getPositiveInteger(formData, "image_width");
    const height = getPositiveInteger(formData, "image_height");
    if (width && height) {
      update.image_width = String(width);
      update.image_height = String(height);
    }
  }

  const { error } = await admin.supabase.from("products").update(update).eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/productos");
  revalidatePath("/admin");
}

export async function deleteProduct(formData: FormData) {
  const admin = await requireAdminSession();
  const slug = getString(formData, "slug");

  if (!slug) {
    throw new Error("Producto inválido.");
  }

  const { data: product, error: readError } = await admin.supabase
    .from("products")
    .select("image_path")
    .eq("slug", slug)
    .single();

  if (readError || !product) {
    throw new Error(readError?.message ?? "Producto inválido.");
  }

  const { error } = await admin.supabase.from("products").delete().eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }

  if (product.image_path) {
    await admin.supabase.storage.from(PALMA_IMAGE_BUCKET).remove([product.image_path]);
  }

  revalidatePath("/productos");
  revalidatePath("/admin");
}
