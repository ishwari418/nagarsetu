import { requireAdmin } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <Shell
      tone="admin"
      title={`${admin.firstName} ${admin.lastName} · City administration`}
      subtitle={`${admin.city ?? "City"} municipal console`}
      nav={[
        { href: "/admin/dashboard", label: "Dashboard" },
        { href: "/admin/complaints", label: "Complaints" },
        { href: "/admin/incidents", label: "Incidents" },
      ]}
      onLogout={<LogoutButton />}
    >
      {children}
    </Shell>
  );
}
