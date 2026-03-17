import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { StorefrontChrome } from "@/components/layout/StorefrontChrome";
import { getNavigation } from "@/lib/navigation";
import { getSiteSettings } from "@/lib/settings";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "Withlove, Jesse | Personalised Greeting Cards",
    template: "%s | Withlove, Jesse",
  },
  description:
    "Beautiful, personalised greeting cards for every occasion. Birthday, anniversary, wedding, Christmas and more. Elegant, warm, and made with love.",
  openGraph: {
    type: "website",
    title: "Withlove, Jesse | Personalised Greeting Cards",
    description: "Beautiful, personalised greeting cards for every occasion. Made with love.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerLinks, footerLinks, settings] = await Promise.all([
    getNavigation("header"),
    getNavigation("footer"),
    getSiteSettings(),
  ]);
  const siteTitle = settings.site_title || "Withlove, Jesse";
  const marqueeRaw = settings.announcement_marquee?.trim();
  const announcementMessages = marqueeRaw
    ? marqueeRaw.split(/\n/).map((s) => s.trim()).filter(Boolean)
    : settings.announcement_bar
      ? [settings.announcement_bar]
      : [];

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <SessionProvider>
          <StorefrontChrome
            headerLinks={headerLinks}
            footerLinks={footerLinks}
            siteTitle={siteTitle}
            announcementMessages={announcementMessages}
          >
            {children}
          </StorefrontChrome>
        </SessionProvider>
      </body>
    </html>
  );
}
