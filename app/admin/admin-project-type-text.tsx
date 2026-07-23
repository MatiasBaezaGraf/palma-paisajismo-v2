"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ProjectStep } from "../palma-data";
import type { ProjectTypeRow } from "../lib/content";
import { updateProjectTypeText } from "./actions";

type SaveStatus =
  | { kind: "idle"; message: string }
  | { kind: "working"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const defaultStatus = "Editá el texto que se muestra en la subpágina de este tipo de proyecto.";

function normalizeSteps(steps: ProjectStep[] | null | undefined): ProjectStep[] {
  if (!Array.isArray(steps)) {
    return [];
  }

  return steps.map((step) => ({
    title: typeof step?.title === "string" ? step.title : "",
    body: typeof step?.body === "string" ? step.body : "",
  }));
}

export function AdminProjectTypeText({ item }: { item: ProjectTypeRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(item.description ?? "");
  const [intro, setIntro] = useState(item.detail_intro ?? "");
  const [steps, setSteps] = useState<ProjectStep[]>(() => normalizeSteps(item.detail_steps));
  const [status, setStatus] = useState<SaveStatus>({ kind: "idle", message: defaultStatus });

  const handleStepChange = (index: number, field: keyof ProjectStep, value: string) => {
    setSteps((current) => current.map((step, i) => (i === index ? { ...step, [field]: value } : step)));
  };

  const handleAddStep = () => {
    setSteps((current) => [...current, { title: "", body: "" }]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps((current) => current.filter((_, i) => i !== index));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setStatus({ kind: "idle", message: defaultStatus });
  };

  const handleCancel = () => {
    setDescription(item.description ?? "");
    setIntro(item.detail_intro ?? "");
    setSteps(normalizeSteps(item.detail_steps));
    setIsEditing(false);
    setStatus({ kind: "idle", message: "Cambios descartados." });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        setStatus({ kind: "working", message: "Guardando texto..." });
        const formData = new FormData();
        formData.set("slug", item.slug);
        formData.set("description", description);
        formData.set("detail_intro", intro);
        formData.set("step_count", String(steps.length));
        steps.forEach((step, index) => {
          formData.set(`step_title_${index}`, step.title);
          formData.set(`step_body_${index}`, step.body);
        });

        await updateProjectTypeText(formData);
        router.refresh();
        setIsEditing(false);
        setStatus({ kind: "success", message: "Texto guardado." });
      } catch (error) {
        setStatus({
          kind: "error",
          message: error instanceof Error ? error.message : "No se pudo guardar el texto.",
        });
      }
    });
  };

  const fieldClass =
    "min-w-0 w-full border border-[#e0ddd7] bg-[#f9f7f4] px-3 py-2.5 text-sm font-light normal-case tracking-normal text-[#131419] outline-none focus:border-[#4a6038]";

  const storedSteps = normalizeSteps(item.detail_steps).filter(
    (step) => step.title.trim() || step.body.trim(),
  );

  return (
    <form
      onSubmit={handleSubmit}
      data-editing={isEditing ? "true" : "false"}
      className={`flex h-full min-w-0 max-w-full flex-col gap-4 overflow-hidden border p-3.5 transition-colors sm:p-4 ${
        isEditing ? "border-[#4a6038] bg-[#fbfbf6]" : "border-[#e0ddd7] bg-white/70"
      }`}
    >
      <div className="min-w-0">
        <p className="text-[10px] font-normal uppercase tracking-[0.16em] text-[#a9a79c] sm:tracking-[0.2em]">
          Texto de la subpágina
        </p>
        <h3 className="mt-1 text-[16px] font-light italic leading-tight text-[#3d2e69] text-pretty">
          {item.title}
        </h3>
      </div>

      {isEditing ? (
        <div className="grid min-w-0 gap-5 border-y border-[#ece9e4] py-4">
          <label className="grid gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
            Subtítulo (se muestra en Qué diseñamos)
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={2}
              className={`${fieldClass} resize-y leading-[1.7]`}
            />
          </label>

          <label className="grid gap-2 text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
            Texto de introducción
            <textarea
              value={intro}
              onChange={(event) => setIntro(event.target.value)}
              rows={5}
              className={`${fieldClass} resize-y leading-[1.7]`}
            />
          </label>

          {steps.map((step, index) => (
            <div key={index} className="grid min-w-0 gap-2 border-t border-[#ece9e4] pt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-normal uppercase tracking-[0.18em] text-[#a9a79c]">
                  Paso {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => handleRemoveStep(index)}
                  className="text-[10px] font-normal uppercase tracking-[0.12em] text-[#8a3f31] transition-colors hover:text-[#5f2b21] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a3f31]/30"
                >
                  Eliminar
                </button>
              </div>
              <input
                type="text"
                value={step.title}
                placeholder="Título del paso"
                onChange={(event) => handleStepChange(index, "title", event.target.value)}
                className={fieldClass}
              />
              <textarea
                value={step.body}
                placeholder="Descripción del paso"
                onChange={(event) => handleStepChange(index, "body", event.target.value)}
                rows={4}
                className={`${fieldClass} resize-y leading-[1.7]`}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddStep}
            className="inline-flex min-h-11 items-center justify-center border border-dashed border-[#c4bdb0] px-3 py-3 text-[11px] font-normal uppercase tracking-[0.12em] text-[#493f2c] transition-colors hover:border-[#4a6038] hover:text-[#4a6038] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/30 sm:tracking-[0.16em]"
          >
            + Agregar paso
          </button>
        </div>
      ) : (
        <div className="grid min-w-0 gap-2 border-y border-[#ece9e4] py-4">
          <p className="text-[13px] font-light leading-relaxed text-[#493f2c]">
            {item.description?.trim() ? item.description : "Sin subtítulo cargado."}
          </p>
          <p className="line-clamp-2 text-[12px] font-light leading-relaxed text-[#777674]">
            {item.detail_intro?.trim() ? item.detail_intro : "Sin texto de introducción cargado."}
          </p>
          <p className="text-[11px] font-light text-[#a9a79c]">
            {storedSteps.length} paso(s) con contenido
          </p>
        </div>
      )}

      <div className="mt-auto grid gap-3">
        {isEditing || status.kind !== "idle" ? (
          <p
            data-text-status={status.kind}
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

        {isEditing ? (
          <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            <button
              type="button"
              disabled={isPending}
              onClick={handleCancel}
              className="inline-flex min-h-11 min-w-0 items-center justify-center border border-[#d8d3c8] px-3 py-3 text-center text-[11px] font-normal uppercase tracking-[0.12em] text-[#493f2c] transition-colors hover:border-[#131419] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#131419]/20 disabled:cursor-wait disabled:opacity-60 sm:px-4 sm:tracking-[0.16em]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex min-h-11 min-w-0 items-center justify-center bg-[#4a6038] px-3 py-3 text-center text-[11px] font-normal uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#3d5030] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6038]/45 disabled:cursor-wait disabled:bg-[#9a9486] sm:px-4 sm:tracking-[0.16em]"
            >
              {isPending ? "Guardando..." : "Guardar texto"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex min-h-11 min-w-0 items-center justify-center border border-[#131419] px-3 py-3 text-center text-[11px] font-normal uppercase tracking-[0.12em] text-[#131419] transition-colors hover:bg-[#131419] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#131419]/20 sm:px-4 sm:tracking-[0.16em]"
          >
            Editar texto
          </button>
        )}
      </div>
    </form>
  );
}
