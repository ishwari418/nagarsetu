import { requireCitizen } from "@/lib/session";
import { ProfileForm } from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireCitizen();
  return (
    <ProfileForm
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender ?? "",
        address: user.address ?? "",
        city: user.city ?? "",
        state: user.state ?? "",
        district: user.district ?? "",
        ward: user.ward ?? "",
        pinCode: user.pinCode ?? "",
      }}
      language={user.preferredLanguage || "en"}
    />
  );
}
