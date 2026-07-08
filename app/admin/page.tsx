import { AdminImageCard } from "./admin-image-card";
import { signOut, updateHomeImage, updateProjectTypeImage } from "./actions";
import { getAdminContent } from "../lib/content";
import { requireAdminSession } from "../lib/admin-auth";

export default async function AdminPage() {
  const admin = await requireAdminSession();
  const { homeImages, projectTypes } = await getAdminContent();

  return (
    <main className="min-h-screen bg-[#f9f7f4] text-[#131419]">
      <header className="border-b border-[#e0ddd7] bg-[#f1eee7]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-[52px]">
          <div>
            <p className="text-[10px] font-normal uppercase tracking-[0.24em] text-[#9a9486]">Admin</p>
            <h1 className="mt-2 text-[clamp(30px,4vw,52px)] font-light italic leading-none">
              Contenido del sitio
            </h1>
            <p className="mt-3 text-sm font-light text-[#777674]">{admin.email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center border border-[#131419] px-6 py-3 text-[11px] font-normal uppercase tracking-[0.16em] text-[#131419] transition-colors hover:bg-[#131419] hover:text-[#f9f7f4]"
            >
              Salir
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-10 md:px-[52px] md:py-14">
        <section>
          <div className="mb-5 flex flex-col gap-2 border-b border-[#e0ddd7] pb-4">
            <p className="text-[10px] font-normal uppercase tracking-[0.24em] text-[#a9a79c]">Home</p>
            <h2 className="text-2xl font-light italic">Imágenes principales</h2>
          </div>
          <div className="grid gap-5">
            {homeImages.length ? (
              homeImages.map((image) => (
                <AdminImageCard
                  key={image.slot}
                  item={image}
                  action={updateHomeImage}
                  hiddenName="slot"
                  hiddenValue={image.slot}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-2 border-b border-[#e0ddd7] pb-4">
            <p className="text-[10px] font-normal uppercase tracking-[0.24em] text-[#a9a79c]">
              Qué diseñamos
            </p>
            <h2 className="text-2xl font-light italic">Tipos de proyecto</h2>
          </div>
          <div className="grid gap-5">
            {projectTypes.length ? (
              projectTypes.map((type) => (
                <AdminImageCard
                  key={type.slug}
                  item={type}
                  action={updateProjectTypeImage}
                  hiddenName="slug"
                  hiddenValue={type.slug}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-[#d8d3c8] p-6 text-sm font-light leading-relaxed text-[#777674]">
      No hay contenido cargado todavía. Ejecutá <code>yarn seed:supabase</code> para subir las imágenes
      iniciales y crear las filas editables.
    </div>
  );
}
