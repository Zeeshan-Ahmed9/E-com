import { getAdminDashboardData } from "@/app/actions/admin";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard • ZappMart Pakistan",
  description: "Secure product and order management portal for ZappMart.",
  robots: { index: false, follow: false },
};

interface AdminPanelPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminPanelPage({ searchParams }: AdminPanelPageProps) {
  const secretSlug = "admin-panel-zm982x";
  const resolved = await searchParams;
  const defaultTab = resolved?.tab === "orders" ? "orders" : "products";

  const data = await getAdminDashboardData();

  return (
    <AdminDashboardView
      initialProducts={data.products}
      initialCategories={data.categories}
      initialOrders={data.orders}
      stats={data.stats}
      secretSlug={secretSlug}
      defaultTab={defaultTab}
    />
  );
}

