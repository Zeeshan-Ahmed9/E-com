import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface AdminPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminRedirectPage({ searchParams }: AdminPageProps) {
  const resolvedParams = await searchParams;
  const key = resolvedParams?.key || resolvedParams?.token;
  const cookieStore = await cookies();
  const isAuthorized = cookieStore.get("zm_admin_authorized")?.value === "true";

  if (isAuthorized || key === "admin2sstore2026" || key === "zm982x") {
    // Redirect to unique secret URL
    redirect("/admin-panel-zm982x");
  }

  // Not authorized: redirect to storefront home
  redirect("/");
}

