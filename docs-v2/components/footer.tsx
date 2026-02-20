"use client";

import { Text } from "@/components/retroui/Text";

const quickLinks = [
  { name: "Docs", href: "/docs" },
  { name: "GitHub", href: "https://github.com/AnomalyCo/opentabs" },
  { name: "Installation", href: "/docs/install" },
];

function Footer() {
  return (
    <footer className="border-t-2 mt-24">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 max-w-md">
            <Text as="h2" className="mb-4">
              OpenTabs
            </Text>
            <Text className="text-muted-foreground leading-relaxed text-sm">
              AI agents for any web app. Give AI agents access to any web
              application through your authenticated browser session.
            </Text>
          </div>

          <div className="lg:col-span-1">
            <Text as="h4" className="mb-6">
              Quick Links
            </Text>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:underline font-medium underline-offset-4 decoration-primary decoration-2 transition-all"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-foreground">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <Text className="text-sm text-background">
            &copy; 2025 OpenTabs. Open source under MIT license.
          </Text>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
