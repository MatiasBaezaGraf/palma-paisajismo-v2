import { AdminDashboard } from "./admin-dashboard";
import { signOut } from "./actions";
import { getAdminContent } from "../lib/content";
import { requireAdminSession } from "../lib/admin-auth";

export default async function AdminPage() {
  const admin = await requireAdminSession();
  const { homeImages, projectTypes, pageImages } = await getAdminContent();

  return (
    <main className="min-h-screen bg-[#f9f7f4] text-[#131419]">
      <header className="border-b border-[#e0ddd7] bg-[#f1eee7]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-[52px]">
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

      <AdminDashboard homeImages={homeImages} projectTypes={projectTypes} pageImages={pageImages} />
    </main>
  );
}
