import { requireCitizen } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { LogoutButton } from "@/components/LogoutButton";

export default async function CitizenLayout({ children }: { children: React.ReactNode }) {
  const user = await requireCitizen();

  return (
    <Shell
      title={`${user.firstName} ${user.lastName}`}
      subtitle={`${user.ward ?? ""}, ${user.city ?? ""}`}
      nav={[
        { href: "/citizen/dashboard", label: "Dashboard" },
        { href: "/citizen/complaints", label: "My complaints" },
        { href: "/citizen/complaints/new", label: "Report an issue" },
        { href: "/citizen/profile", label: "Profile" },
      ]}
      onLogout={<LogoutButton />}
    >
      {children}
    </Shell>
  );
}
