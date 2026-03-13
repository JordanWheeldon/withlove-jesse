import Link from "next/link";

type FooterProps = {
  links: { href: string; label: string }[];
  siteTitle: string;
};

export function Footer({ links, siteTitle }: FooterProps) {
  const mid = Math.ceil(links.length / 2);
  const col1 = links.slice(0, mid);
  const col2 = links.slice(mid);

  return (
    <footer className="border-t border-sand-200 bg-premium-soft mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link
              href="/"
              className="font-serif text-lg font-medium text-premium-brown hover:text-premium-black"
            >
              {siteTitle}
            </Link>
            <p className="mt-4 text-sm text-premium-taupe max-w-xs leading-relaxed">
              Personalised greeting cards for every occasion. Made with care,
              sent with love.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-premium-brown mb-4">Shop</h4>
            <ul className="space-y-3">
              {col1.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-premium-taupe hover:text-premium-brown transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-premium-brown mb-4">Info</h4>
            <ul className="space-y-3">
              {col2.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-premium-taupe hover:text-premium-brown transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-sand-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-premium-taupe">
            © {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link
              href="/privacy"
              className="text-sm text-premium-taupe hover:text-premium-brown transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-premium-taupe hover:text-premium-brown transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
