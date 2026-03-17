"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AnnouncementMarquee } from "./AnnouncementMarquee";

type StorefrontChromeProps = {
  children: React.ReactNode;
  headerLinks: { href: string; label: string }[];
  footerLinks: { href: string; label: string }[];
  siteTitle: string;
  announcementMessages: string[];
};

export function StorefrontChrome({
  children,
  headerLinks,
  footerLinks,
  siteTitle,
  announcementMessages,
}: StorefrontChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {announcementMessages.length > 0 && (
        <AnnouncementMarquee messages={announcementMessages} />
      )}
      <Header links={headerLinks} siteTitle={siteTitle} />
      <main className="flex-1">{children}</main>
      <Footer links={footerLinks} siteTitle={siteTitle} />
    </>
  );
}
