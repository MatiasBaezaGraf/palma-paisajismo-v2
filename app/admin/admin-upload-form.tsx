"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { HomeImageRow, ProjectTypeRow } from "../lib/content";
import { getPublicImageUrl } from "../lib/images";

type ImageCardItem = HomeImageRow | ProjectTypeRow;

type UploadStatus =
  | { kind: "idle"; message: string }
  | { kind: "working"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const maxDimension = 1800;
const quality = 0.82;
const defaultStatus = "Las imagenes grandes se comprimen antes de subir.";

export function AdminUploadForm({
  item,
  action,
  hiddenName,
  hiddenValue,
}: {
  item: ImageCardItem;
  action: (formData: FormData) => Promise<void>;
  hiddenName: "slot" | "slug";
  hiddenValue: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [altValue, setAltValue] = useState(item.image_alt);
  const [status, setStatus] = useState<UploadStatus>({
    kind: "idle",
    message: defaultStatus,
  });
  const title = "title" in item ? item.title : item.label;
  const subtitle = "slot" in item ? item.slot : item.slug;
  const isProjectType = "sort_order" in item;
  const hardcodedAlt = isProjectType ? `image-${item.sort_order}` : item.image_alt;
  const hasChanges = Boolean(selectedFile) || (!isProjectType && altValue !== item.image_alt);

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
        formData.set("alt", isProjectType ? hardcodedAlt : altValue);

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
        fileInputRef.current!.value = "";
        setSelectedFile(null);
        setPreviewSrc((current) => {
          if (current) URL.revokeObjectURL(current);
          return null;
        });
        router.refresh();
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
      message: file ? "Previsualizacion lista. Se comprimira al guardar." : defaultStatus,
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
    setAltValue(item.image_alt);
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
      className="grid gap-4 border border-[#e0ddd7] bg-white/45 p-4 md:grid-cols-[220px_1fr] md:gap-6"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e4de]">
        {previewSrc ? (
          <div
            role="img"
            aria-label={isProjectType ? hardcodedAlt : altValue}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${previewSrc}")` }}
          />
        ) : (
          <Image
            src={getPublicImageUrl(item.image_path)}
            alt={isProjectType ? hardcodedAlt : item.image_alt}
            fill
            sizes="(min-width: 1024px) 220px, 100vw"
            className="object-cover"
          />
        )}
        {previewSrc ? (
          <span className="absolute left-3 top-3 bg-[#131419]/75 px-2.5 py-1 text-[10px] font-normal uppercase tracking-[0.12em] text-white">
            Vista previa
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <div>
          <p className="text-[10px] font-normal uppercase tracking-[0.2em] text-[#a9a79c]">{subtitle}</p>
          <h2 className="mt-1 text-lg font-light italic leading-tight text-[#131419]">{title}</h2>
        </div>

        <input type="hidden" name={hiddenName} value={hiddenValue} />

        <label className="grid gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
          Imagen
          <input
            ref={fileInputRef}
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="block w-full text-sm font-light normal-case tracking-normal text-[#493f2c] file:mr-4 file:border-0 file:bg-[#4a6038] file:px-4 file:py-2 file:text-[10px] file:font-normal file:uppercase file:tracking-[0.14em] file:text-white"
          />
        </label>

        {isProjectType ? (
          <div className="grid gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
            Texto alternativo
            <p className="border border-[#e0ddd7] bg-[#f9f7f4] px-3 py-3 text-sm font-light normal-case tracking-normal text-[#777674]">
              {hardcodedAlt}
            </p>
            <input type="hidden" name="alt" value={hardcodedAlt} />
          </div>
        ) : (
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
        )}

        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-1">
            <p className="text-[11px] font-light text-[#a9a79c]">
              Actualizado: {new Date(item.updated_at).toLocaleDateString("es-AR")}
            </p>
            <p
              data-upload-status={status.kind}
              className={`text-[11px] font-light ${
                status.kind === "error"
                  ? "text-[#8a3f31]"
                  : status.kind === "success"
                    ? "text-[#4a6038]"
                    : "text-[#777674]"
              }`}
            >
              {status.message}
            </p>
          </div>
          {hasChanges ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={isPending}
                onClick={handleCancel}
                className="inline-flex min-h-11 items-center justify-center border border-[#d8d3c8] px-6 py-3 text-[11px] font-normal uppercase tracking-[0.16em] text-[#493f2c] transition-colors hover:border-[#131419] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#131419]/20 disabled:cursor-wait disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex min-h-11 items-center justify-center bg-[#4a6038] px-6 py-3 text-[11px] font-normal uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#3d5030] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/45 disabled:cursor-wait disabled:bg-[#9a9486]"
              >
                {isPending ? "Guardando..." : "Guardar"}
              </button>
            </div>
          ) : null}
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
