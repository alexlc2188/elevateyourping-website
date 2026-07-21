import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { NavbarSite } from "../../components/navigation/navbar-site";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full flex-col">
      <div className="fixed inset-y-0 z-50 h-[80px] w-full">
        <NavbarSite />
      </div>
      <main className="flex-1 pt-[80px]">{children}</main>
      <CookieConsentBanner />
      {/* <Footer /> */}
    </div>
  );
}
