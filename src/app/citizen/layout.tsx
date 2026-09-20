import { requireCitizen } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { LogoutButton } from "@/components/LogoutButton";
import { LanguageProvider } from "@/components/LanguageProvider";
import { LanguageModal } from "@/components/LanguageModal";
import { translator } from "@/lib/i18n";

export default async function CitizenLayout({ children }: { children: React.ReactNode }) {
  const user = await requireCitizen();
  const lang = user.preferredLanguage || "en";
  const t = translator(lang);

  return (
    <LanguageProvider lang={lang}>
      {!user.languageChosen && <LanguageModal />}
      <Shell
        title={`${user.firstName} ${user.lastName}`}
        subtitle={`${user.ward ?? ""}, ${user.city ?? ""}`}
        nav={[
          { href: "/citizen/dashboard", label: t("nav.dashboard") },
          { href: "/citizen/complaints", label: t("nav.complaints") },
          { href: "/citizen/complaints/new", label: t("nav.new") },
          { href: "/citizen/profile", label: t("nav.profile") },
        ]}
        onLogout={<LogoutButton label={t("action.logout")} />}
      >
        {children}
      </Shell>
    </LanguageProvider>
  );
}
