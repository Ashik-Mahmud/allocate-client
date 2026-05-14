import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { resolveLocaleFromAcceptLanguage } from "@/lib/i18n";

export default async function AboutUsRedirectPage() {
  const headerStore = await headers();
  const locale = resolveLocaleFromAcceptLanguage(
    headerStore.get("accept-language")
  );

  redirect(`/${locale}/about-us`);
}
