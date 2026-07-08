import { redirect } from "next/navigation";
import { getAdminSession } from "../../lib/admin-auth";
import { LoginForm } from "./login-form";

const errorMessages: Record<string, string> = {
  credentials: "Email o contraseña inválidos.",
  unauthorized: "La cuenta no tiene permisos de administración.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const admin = await getAdminSession();
  const params = await searchParams;

  if (admin) {
    redirect("/admin");
  }

  const error = params.error ? errorMessages[params.error] : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f9f7f4] px-5 py-10 text-[#131419]">
      <section className="w-full max-w-md border border-[#e0ddd7] bg-white/50 p-6 md:p-8">
        <p className="text-[10px] font-normal uppercase tracking-[0.24em] text-[#a9a79c]">Palma Admin</p>
        <h1 className="mt-3 text-[clamp(30px,7vw,44px)] font-light italic leading-none">Ingresar</h1>
        <p className="mt-4 text-sm font-light leading-relaxed text-[#777674]">
          Gestioná las imágenes principales del sitio y los tipos de proyecto.
        </p>

        {error ? (
          <p className="mt-5 border border-[#b65f4b]/30 bg-[#b65f4b]/10 px-4 py-3 text-sm font-light text-[#8a3f31]">
            {error}
          </p>
        ) : null}

        <LoginForm next={params.next ?? "/admin"} />
      </section>
    </main>
  );
}
