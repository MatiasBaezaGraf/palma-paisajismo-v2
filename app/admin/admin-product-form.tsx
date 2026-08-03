"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { ProductRow } from "../lib/content";
import { getPublicImageUrl } from "../lib/images";
import { AdminConfirmationDialog } from "./admin-confirmation-dialog";
import { createProduct, deleteProduct, updateProduct } from "./actions";

type UploadStatus =
  | { kind: "idle"; message: string }
  | { kind: "working"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const maxDimension = 1800;
const quality = 0.82;
const defaultStatus = "Las imágenes grandes se comprimen antes de subir.";

type ProductFormValues = {
  title: string;
  subtitle: string;
  price: string;
  description: string;
  isActive: boolean;
};

export function AdminCreateProductForm({ nextSortOrder }: { nextSortOrder: number }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);
  const [status, setStatus] = useState<UploadStatus>({ kind: "idle", message: defaultStatus });
  const [values, setValues] = useState<ProductFormValues>({
    title: "",
    subtitle: "",
    price: "",
    description: "",
    isActive: true,
  });
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState(String(nextSortOrder));

  useEffect(() => {
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
    };
  }, [previewSrc]);

  const setValue = (key: keyof ProductFormValues, value: string | boolean) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleTitleChange = (value: string) => {
    setValue("title", value);
    if (!slugEdited) {
      setSlug(slugify(value));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setStatus({
      kind: "idle",
      message: file ? "Previsualización lista. Se comprimirá al guardar." : defaultStatus,
    });
    setPreviewSrc((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const resetForm = () => {
    formRef.current?.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSelectedFile(null);
    setValues({ title: "", subtitle: "", price: "", description: "", isActive: true });
    setSlug("");
    setSlugEdited(false);
    setSortOrder(String(nextSortOrder + 1));
    setPreviewSrc((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    startTransition(async () => {
      try {
        setStatus({ kind: "working", message: "Creando producto..." });
        const formData = new FormData(form);
        const file = selectedFile;
        let compressionMessage = "";

        if (file && file.size > 0) {
          const compressed = await compressImage(file);
          formData.set("image", compressed.file);
          formData.set("image_width", String(compressed.width));
          formData.set("image_height", String(compressed.height));
          compressionMessage = ` Comprimida de ${formatBytes(file.size)} a ${formatBytes(compressed.file.size)}.`;
          setStatus({ kind: "working", message: compressionMessage.trim() });
        }

        await createProduct(formData);
        resetForm();
        router.refresh();
        setIsCreating(false);
        setStatus({ kind: "success", message: `Producto creado.${compressionMessage}` });
      } catch (error) {
        setStatus({
          kind: "error",
          message: error instanceof Error ? error.message : "No se pudo crear el producto.",
        });
      }
    });
  };

  if (!isCreating) {
    return (
      <button
        type="button"
        onClick={() => setIsCreating(true)}
        className="inline-flex min-h-11 w-full items-center justify-center border border-[#4a6038] px-4 py-3 text-center text-[11px] font-normal uppercase tracking-[0.14em] text-[#4a6038] transition-colors hover:bg-[#4a6038] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/45"
      >
        Crear producto
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid min-w-0 gap-4 border border-[#d8d3c8] bg-white/70 p-4"
    >
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0">
          <p className="text-[10px] font-normal uppercase tracking-[0.2em] text-[#a9a79c]">
            Catálogo
          </p>
          <h3 className="mt-1 text-[20px] font-light italic leading-tight text-[#131419]">
            Nuevo producto
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-4 md:justify-end">
          <label className="flex items-center gap-3 text-[11px] font-normal uppercase tracking-[0.16em] text-[#493f2c]">
            <input
              name="is_active"
              type="checkbox"
              checked={values.isActive}
              onChange={(event) => setValue("isActive", event.target.checked)}
              className="h-4 w-4 accent-[#4a6038]"
            />
            Visible
          </label>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              resetForm();
              setStatus({ kind: "idle", message: defaultStatus });
              setIsCreating(false);
            }}
            className="text-[11px] font-normal uppercase tracking-[0.14em] text-[#777674] transition-colors hover:text-[#131419] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#131419]/20 disabled:cursor-wait disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="relative aspect-[4/3] overflow-hidden border border-[#d8d3c8] bg-[#f3f1eb]">
          {previewSrc ? (
            <div
              role="img"
              aria-label={values.title || "Vista previa"}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${previewSrc}")` }}
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, #f7f5ef 0 12px, #ece9e2 12px 24px)",
              }}
            >
              <span className="bg-[#f9f7f4] px-4 py-1.5 text-[11px] font-light lowercase tracking-[0.12em] text-[#9a9486]">
                imagen pendiente
              </span>
            </div>
          )}
        </div>

        <div className="grid min-w-0 gap-4">
          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            <TextField label="Nombre" name="title" value={values.title} onChange={handleTitleChange} />
            <TextField
              label="Slug"
              name="slug"
              value={slug}
              onChange={(value) => {
                setSlugEdited(true);
                setSlug(slugify(value));
              }}
            />
            <TextField
              label="Subtítulo"
              name="subtitle"
              value={values.subtitle}
              onChange={(value) => setValue("subtitle", value)}
            />
            <TextField label="Precio" name="price" value={values.price} onChange={(value) => setValue("price", value)} />
            <label className="grid gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
              Orden
              <input
                name="sort_order"
                type="number"
                min="1"
                required
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="min-w-0 border border-[#e0ddd7] bg-[#f9f7f4] px-3 py-3 text-sm font-light normal-case tracking-normal text-[#131419] outline-none focus:border-[#4a6038]"
              />
            </label>
            <label className="grid gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
              Imagen
              <input
                ref={fileInputRef}
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="block w-full max-w-full min-w-0 overflow-hidden text-[11px] font-light normal-case tracking-normal text-[#493f2c] file:mr-2 file:border-0 file:bg-[#4a6038] file:px-2.5 file:py-2 file:text-[10px] file:font-normal file:uppercase file:tracking-[0.1em] file:text-white sm:text-xs sm:file:mr-3 sm:file:px-3 sm:file:tracking-[0.12em]"
              />
            </label>
          </div>

          <label className="grid gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
            Descripción
            <textarea
              name="description"
              required
              rows={4}
              value={values.description}
              onChange={(event) => setValue("description", event.target.value)}
              className="min-w-0 resize-y border border-[#e0ddd7] bg-[#f9f7f4] px-3 py-3 text-sm font-light normal-case leading-relaxed tracking-normal text-[#131419] outline-none focus:border-[#4a6038]"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <p
              data-upload-status={status.kind}
              className={`text-[11px] font-light leading-relaxed ${
                status.kind === "error"
                  ? "text-[#8a3f31]"
                  : status.kind === "success"
                    ? "text-[#4a6038]"
                    : "text-[#777674]"
              }`}
            >
              {status.message}
            </p>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex min-h-11 min-w-0 items-center justify-center bg-[#4a6038] px-4 py-3 text-center text-[11px] font-normal uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#3d5030] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/45 disabled:cursor-wait disabled:bg-[#9a9486]"
            >
              {isPending ? "Creando..." : "Crear producto"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export function AdminProductForm({ product }: { product: ProductRow }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>({ kind: "idle", message: defaultStatus });
  const [values, setValues] = useState({
    title: product.title,
    subtitle: product.subtitle,
    price: product.price,
    description: product.description,
    isActive: product.is_active,
  });

  const imageSrc = product.image_path ? getPublicImageUrl(product.image_path) : "";
  const hasFieldChanges =
    values.title !== product.title ||
    values.subtitle !== product.subtitle ||
    values.price !== product.price ||
    values.description !== product.description ||
    values.isActive !== product.is_active;
  const hasChanges = Boolean(selectedFile) || hasFieldChanges;

  useEffect(() => {
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
    };
  }, [previewSrc]);

  const setValue = (key: keyof typeof values, value: string | boolean) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    startTransition(async () => {
      try {
        setStatus({ kind: "working", message: "Preparando producto..." });
        const formData = new FormData(form);
        const file = selectedFile;
        let compressionMessage = "";

        if (file && file.size > 0) {
          const compressed = await compressImage(file);
          formData.set("image", compressed.file);
          formData.set("image_width", String(compressed.width));
          formData.set("image_height", String(compressed.height));
          compressionMessage = ` Comprimida de ${formatBytes(file.size)} a ${formatBytes(compressed.file.size)}.`;
          setStatus({ kind: "working", message: compressionMessage.trim() });
        }

        await updateProduct(formData);
        formRef.current?.reset();
        if (fileInputRef.current) fileInputRef.current.value = "";
        setSelectedFile(null);
        setPreviewSrc((current) => {
          if (current) URL.revokeObjectURL(current);
          return null;
        });
        router.refresh();
        setIsEditing(false);
        setStatus({ kind: "success", message: `Producto guardado.${compressionMessage}` });
      } catch (error) {
        setStatus({
          kind: "error",
          message: error instanceof Error ? error.message : "No se pudo guardar el producto.",
        });
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setStatus({
      kind: "idle",
      message: file ? "Previsualización lista. Se comprimirá al guardar." : defaultStatus,
    });
    setPreviewSrc((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const handleCancel = () => {
    formRef.current?.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSelectedFile(null);
    setValues({
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      description: product.description,
      isActive: product.is_active,
    });
    setIsEditing(false);
    setPreviewSrc((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setStatus({ kind: "idle", message: "Cambios descartados." });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        setStatus({ kind: "working", message: "Eliminando producto..." });
        const formData = new FormData();
        formData.set("slug", product.slug);
        await deleteProduct(formData);
        setIsDeleteConfirming(false);
        router.refresh();
      } catch (error) {
        setStatus({
          kind: "error",
          message: error instanceof Error ? error.message : "No se pudo eliminar el producto.",
        });
      }
    });
  };

  return (
    <>
      <form
      ref={formRef}
      onSubmit={handleSubmit}
      data-editing={isEditing ? "true" : "false"}
      className={`flex h-full min-w-0 max-w-full flex-col overflow-hidden border bg-white/70 transition-colors ${
        isEditing ? "border-[#4a6038] bg-[#fbfbf6]" : "border-[#e0ddd7]"
      }`}
    >
      <div className="relative aspect-[4/3] min-h-0 overflow-hidden bg-[#e8e4de]">
        {previewSrc ? (
          <div
            role="img"
            aria-label={values.title}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${previewSrc}")` }}
          />
        ) : imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.image_alt || product.title}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center bg-[#f3f1eb]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #f7f5ef 0 12px, #ece9e2 12px 24px)",
            }}
          >
            <span className="bg-[#f9f7f4] px-4 py-1.5 text-[11px] font-light lowercase tracking-[0.12em] text-[#9a9486]">
              imagen pendiente
            </span>
          </div>
        )}
        {previewSrc ? (
          <span className="absolute left-3 top-3 bg-[#131419]/75 px-2.5 py-1 text-[10px] font-normal uppercase tracking-[0.12em] text-white">
            Vista previa
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-3.5 sm:p-4">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-normal uppercase tracking-[0.16em] text-[#a9a79c] sm:tracking-[0.2em]">
            {product.slug}
          </p>
          <h2 className="mt-1 text-[18px] font-light italic leading-tight text-[#131419] text-pretty sm:text-[20px]">
            {product.title}
          </h2>
          <p className="mt-2 text-[13px] font-light text-[#415733]">{product.price}</p>
        </div>

        <input type="hidden" name="slug" value={product.slug} />

        {isEditing ? (
          <div className="grid min-w-0 gap-4 border-y border-[#ece9e4] py-4">
            <label className="grid gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
              Imagen
              <input
                ref={fileInputRef}
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="block w-full max-w-full min-w-0 overflow-hidden text-[11px] font-light normal-case tracking-normal text-[#493f2c] file:mr-2 file:border-0 file:bg-[#4a6038] file:px-2.5 file:py-2 file:text-[10px] file:font-normal file:uppercase file:tracking-[0.1em] file:text-white sm:text-xs sm:file:mr-3 sm:file:px-3 sm:file:tracking-[0.12em]"
              />
            </label>

            <TextField label="Nombre" name="title" value={values.title} onChange={(value) => setValue("title", value)} />
            <TextField
              label="Subtítulo"
              name="subtitle"
              value={values.subtitle}
              onChange={(value) => setValue("subtitle", value)}
            />
            <TextField label="Precio" name="price" value={values.price} onChange={(value) => setValue("price", value)} />

            <label className="grid gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
              Descripción
              <textarea
                name="description"
                required
                rows={5}
                value={values.description}
                onChange={(event) => setValue("description", event.target.value)}
                className="min-w-0 resize-y border border-[#e0ddd7] bg-[#f9f7f4] px-3 py-3 text-sm font-light normal-case leading-relaxed tracking-normal text-[#131419] outline-none focus:border-[#4a6038]"
              />
            </label>

            <label className="flex items-center gap-3 text-[11px] font-normal uppercase tracking-[0.16em] text-[#493f2c]">
              <input
                name="is_active"
                type="checkbox"
                checked={values.isActive}
                onChange={(event) => setValue("isActive", event.target.checked)}
                className="h-4 w-4 accent-[#4a6038]"
              />
              Visible en la página
            </label>
          </div>
        ) : null}

        <div className="mt-auto grid gap-3 border-t border-[#ece9e4] pt-4">
          <div className="grid gap-1">
            <p className="text-[11px] font-light text-[#a9a79c]">
              Actualizado: {new Date(product.updated_at).toLocaleDateString("es-AR")}
            </p>
            {isEditing || status.kind !== "idle" ? (
              <p
                data-upload-status={status.kind}
                className={`text-[11px] font-light leading-relaxed ${
                  status.kind === "error"
                    ? "text-[#8a3f31]"
                    : status.kind === "success"
                      ? "text-[#4a6038]"
                      : "text-[#777674]"
                }`}
              >
                {status.message}
              </p>
            ) : null}
          </div>

          {isEditing ? (
            <div className="grid min-w-0 grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={handleCancel}
                className="inline-flex min-h-11 min-w-0 items-center justify-center border border-[#d8d3c8] px-3 py-3 text-center text-[11px] font-normal uppercase tracking-[0.12em] text-[#493f2c] transition-colors hover:border-[#131419] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#131419]/20 disabled:cursor-wait disabled:opacity-60 sm:px-4 sm:tracking-[0.16em]"
              >
                Cancelar
              </button>
              {hasChanges ? (
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex min-h-11 min-w-0 items-center justify-center bg-[#4a6038] px-3 py-3 text-center text-[11px] font-normal uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#3d5030] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/45 disabled:cursor-wait disabled:bg-[#9a9486] sm:px-4 sm:tracking-[0.16em]"
                >
                  {isPending ? "Guardando..." : "Guardar"}
                </button>
              ) : null}
            </div>
          ) : (
            <div className="grid min-w-0 grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsEditing(true)}
                className="inline-flex min-h-11 min-w-0 items-center justify-center border border-[#131419] px-3 py-3 text-center text-[11px] font-normal uppercase tracking-[0.12em] text-[#131419] transition-colors hover:bg-[#131419] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#131419]/20 disabled:cursor-wait disabled:opacity-60 sm:px-4 sm:tracking-[0.16em]"
              >
                Editar
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsDeleteConfirming(true)}
                className="inline-flex min-h-11 min-w-0 items-center justify-center border border-[#8a3f31] px-3 py-3 text-center text-[11px] font-normal uppercase tracking-[0.12em] text-[#8a3f31] transition-colors hover:bg-[#8a3f31] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a3f31]/30 disabled:cursor-wait disabled:opacity-60 sm:px-4 sm:tracking-[0.16em]"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
      </form>
      <AdminConfirmationDialog
        isOpen={isDeleteConfirming}
        isPending={isPending}
        title="Eliminar producto?"
        description={`"${product.title}" se eliminara del catalogo y no podra recuperarse.`}
        confirmLabel="Eliminar"
        pendingLabel="Eliminando..."
        destructive
        onCancel={() => setIsDeleteConfirming(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

function TextField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
      {label}
      <input
        name={name}
        type="text"
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 border border-[#e0ddd7] bg-[#f9f7f4] px-3 py-3 text-sm font-light normal-case tracking-normal text-[#131419] outline-none focus:border-[#4a6038]"
      />
    </label>
  );
}

async function compressImage(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Formato no permitido. Usa JPG, PNG o WebP.");
  }

  const image = await loadImage(file);
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("No se pudo preparar la imagen.");
  }

  context.drawImage(image, 0, 0, width, height);
  URL.revokeObjectURL(image.src);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob) {
    throw new Error("No se pudo comprimir la imagen.");
  }

  const compressedFile = new File([blob], replaceExtension(file.name, "jpg"), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });

  return {
    file: compressedFile,
    width,
    height,
  };
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen."));
    };
    image.src = url;
  });
}

function replaceExtension(fileName: string, extension: string) {
  return `${fileName.replace(/\.[^.]+$/, "")}.${extension}`;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
