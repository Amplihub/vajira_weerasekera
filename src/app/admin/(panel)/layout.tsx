import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/guard";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const collapsed = (await cookies()).get("admin_sidebar_collapsed")?.value === "1";
  return (
    <AdminShell
      user={{ email: session.user.email, name: session.user.name, image: session.user.image }}
      defaultCollapsed={collapsed}
    >
      {children}
    </AdminShell>
  );
}
