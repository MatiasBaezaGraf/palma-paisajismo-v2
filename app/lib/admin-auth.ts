import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export type AdminSession = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  email: string;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims?.sub) {
    return null;
  }

  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id, email")
    .eq("user_id", claims.sub)
    .maybeSingle();

  if (adminError || !adminUser) {
    return null;
  }

  return {
    supabase,
    userId: claims.sub,
    email: adminUser.email,
  };
}

export async function requireAdminSession(): Promise<AdminSession> {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login?error=unauthorized");
  }

  return admin;
}
