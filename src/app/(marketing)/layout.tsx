import { HomeFooter } from "@/components/home/home-footer";
import { HomeHeader } from "@/components/home/home-header";
import { GoogleAdSenseScript } from "@/components/ads/google-adsense-script";
import { MaintenanceScreen } from "@/components/marketing/maintenance-screen";
import { JsonLd } from "@/components/seo/json-ld";
import { auth } from "@/auth";
import { getSystemSettings } from "@/lib/system-settings";
import { siteNavigationJsonLd } from "@/lib/seo/json-ld";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [settings, session] = await Promise.all([getSystemSettings(), auth()]);
  const bypass =
    session?.user?.role === "ADMIN" || session?.user?.role === "EMPLOYER";

  if (settings.maintenance && !bypass) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--background)]">
        <GoogleAdSenseScript />
        <HomeHeader />
        <main className="flex-1">
          <MaintenanceScreen settings={settings} />
        </main>
        <HomeFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <GoogleAdSenseScript />
      <JsonLd data={siteNavigationJsonLd()} />
      <HomeHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <HomeFooter />
    </div>
  );
}
