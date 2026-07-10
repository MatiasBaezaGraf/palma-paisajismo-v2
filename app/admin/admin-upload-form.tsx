"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { HomeImageRow, PageImageRow, ProjectTypeRow } from "../lib/content";
import { getPublicImageUrl } from "../lib/images";

type ImageCardItem = HomeImageRow | PageImageRow | ProjectTypeRow;

type UploadStatus =
  | { kind: "idle"; message: string }
  | { kind: "working"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const maxDimension = 1800;
const quality = 0.82;
const defaultStatus = "Las imágenes grandes se comprimen antes de subir.";

export function AdminUploadForm({
  item,
  action,
  hiddenName,
  hiddenValue,
}: {
  item: ImageCardItem;
  action: (formData: FormData) => Promise<void>;
  hiddenName: "slot" | "slug" | "imageId";
  hiddenValue: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [altValue, setAltValue] = useState(item.image_alt);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<UploadStatus>({
    kind: "idle",
    message: defaultStatus,
  });

  const isProjectType = "sort_order" in item;
  const isPageImage = "page" in item;
  const title = isProjectType ? item.title : item.label;
  const subtitle = isProjectType ? item.slug : isPageImage ? `${item.pageLabel} / ${item.slot}` : item.slot;
  const fixedAlt = isProjectType ? `image-${item.sort_order}` : item.image_alt;
  const canEditAlt = !isProjectType && !isPageImage;
  const hasChanges = Boolean(selectedFile) || (canEditAlt && altValue !== item.image_alt);
  const imageSrc =
    item.image_path.startsWith("/") || item.image_path.startsWith("http")
      ? item.image_path
      : getPublicImageUrl(item.image_path);

  useEffect(() => {
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
    };
  }, [previewSrc]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    startTransition(async () => {
      try {
        setStatus({ kind: "working", message: "Preparando imagen..." });
        const formData = new FormData(form);
        const file = selectedFile;
        formData.set("alt", canEditAlt ? altValue : fixedAlt);

        let compressionMessage = "";

        if (file && file.size > 0) {
          const compressed = await compressImage(file);
          formData.set("image", compressed.file);
          formData.set("image_width", String(compressed.width));
          formData.set("image_height", String(compressed.height));
          formData.set("original_size", String(file.size));
          formData.set("compressed_size", String(compressed.file.size));
          compressionMessage = ` Comprimida de ${formatBytes(file.size)} a ${formatBytes(compressed.file.size)}.`;
          setStatus({
            kind: "working",
            message: compressionMessage.trim(),
          });
        }

        await action(formData);
        formRef.current?.reset();
        if (fileInputRef.current) fileInputRef.current.value = "";
        setSelectedFile(null);
        setPreviewSrc((current) => {
          if (current) URL.revokeObjectURL(current);
          return null;
        });
        router.refresh();
        setIsEditing(false);
        setStatus({
          kind: "success",
          message: `Imagen guardada.${compressionMessage}`,
        });
      } catch (error) {
        setStatus({
          kind: "error",
          message: error instanceof Error ? error.message : "No se pudo guardar la imagen.",
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

  const handleEdit = () => {
    setIsEditing(true);
    setStatus({ kind: "idle", message: defaultStatus });
  };

  const handleCancel = () => {
    formRef.current?.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSelectedFile(null);
    setAltValue(item.image_alt);
    setIsEditing(false);
    setPreviewSrc((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setStatus({ kind: "idle", message: "Cambios descartados." });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      data-editing={isEditing ? "true" : "false"}
      className={`flex h-full min-w-0 flex-col overflow-hidden border bg-white/70 transition-colors ${
        isEditing ? "border-[#4a6038] bg-[#fbfbf6]" : "border-[#e0ddd7]"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e4de]">
        {previewSrc ? (
          <div
            role="img"
            aria-label={canEditAlt ? altValue : fixedAlt}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${previewSrc}")` }}
          />
        ) : (
          <Image
            src={imageSrc}
            alt={canEditAlt ? item.image_alt : fixedAlt}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        )}
        {previewSrc ? (
          <span className="absolute left-3 top-3 bg-[#131419]/75 px-2.5 py-1 text-[10px] font-normal uppercase tracking-[0.12em] text-white">
            Vista previa
          </span>
        ) : null}
        {isEditing ? (
          <span className="absolute right-3 top-3 bg-[#4a6038] px-2.5 py-1 text-[10px] font-normal uppercase tracking-[0.12em] text-white">
            Editando
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-normal uppercase tracking-[0.2em] text-[#a9a79c]">{subtitle}</p>
          <h2 className="mt-1 text-[20px] font-light italic leading-tight text-[#131419] text-pretty">{title}</h2>
        </div>

        <input type="hidden" name={hiddenName} value={hiddenValue} />

        {isEditing ? (
          <div className="grid gap-4 border-y border-[#ece9e4] py-4">
            <label className="grid gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
              Imagen
              <input
                ref={fileInputRef}
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="block w-full text-xs font-light normal-case tracking-normal text-[#493f2c] file:mr-3 file:border-0 file:bg-[#4a6038] file:px-3 file:py-2 file:text-[10px] file:font-normal file:uppercase file:tracking-[0.12em] file:text-white"
              />
            </label>

            {canEditAlt ? (
              <label className="grid gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
                Texto alternativo
                <input
                  name="alt"
                  type="text"
                  required
                  value={altValue}
                  onChange={(event) => setAltValue(event.target.value)}
                  className="border border-[#e0ddd7] bg-[#f9f7f4] px-3 py-3 text-sm font-light normal-case tracking-normal text-[#131419] outline-none focus:border-[#4a6038]"
                />
              </label>
            ) : (
              <input type="hidden" name="alt" value={fixedAlt} />
            )}
          </div>
        ) : null}

        <div className="mt-auto grid gap-3 border-t border-[#ece9e4] pt-4">
          <div className="grid gap-1">
            <p className="text-[11px] font-light text-[#a9a79c]">
              Actualizado: {new Date(item.updated_at).toLocaleDateString("es-AR")}
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
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                disabled={isPending}
                onClick={handleCancel}
                className="inline-flex min-h-11 items-center justify-center border border-[#d8d3c8] px-4 py-3 text-[11px] font-normal uppercase tracking-[0.16em] text-[#493f2c] transition-colors hover:border-[#131419] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#131419]/20 disabled:cursor-wait disabled:opacity-60"
              >
                Cancelar
              </button>
              {hasChanges ? (
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex min-h-11 items-center justify-center bg-[#4a6038] px-4 py-3 text-[11px] font-normal uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#3d5030] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/45 disabled:cursor-wait disabled:bg-[#9a9486]"
                >
                  {isPending ? "Guardando..." : "Guardar"}
                </button>
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex min-h-11 items-center justify-center border border-[#131419] px-4 py-3 text-[11px] font-normal uppercase tracking-[0.16em] text-[#131419] transition-colors hover:bg-[#131419] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#131419]/20"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    </form>
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

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
