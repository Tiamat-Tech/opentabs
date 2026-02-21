import { Button, Text, Badge } from "@/components/retroui";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";

const steps = [
  {
    step: 1,
    title: "Install",
    description:
      "Clone the repo, build, and load the Chrome extension from ~/.opentabs/extension/.",
  },
  {
    step: 2,
    title: "Connect",
    description:
      "Point Claude Code, Cursor, or any MCP client at http://localhost:9515/mcp.",
  },
  {
    step: 3,
    title: "Build",
    description:
      "Use the Plugin SDK to define tools for any website and publish as npm packages.",
  },
];

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 520 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-lg"
      aria-hidden="true"
    >
      {/* ── Browser window ────────────────────────────────── */}
      <rect
        x="2"
        y="2"
        width="516"
        height="336"
        rx="0"
        fill="var(--color-background)"
        stroke="var(--color-foreground)"
        strokeWidth="4"
      />

      {/* Browser chrome bar */}
      <rect
        x="2"
        y="2"
        width="516"
        height="44"
        fill="var(--color-foreground)"
      />

      {/* Traffic-light dots */}
      <circle cx="26" cy="24" r="7" fill="var(--color-primary)" />
      <circle cx="50" cy="24" r="7" fill="var(--color-background)" />
      <circle cx="74" cy="24" r="7" fill="var(--color-background)" />

      {/* URL bar */}
      <rect
        x="100"
        y="12"
        width="260"
        height="24"
        rx="0"
        fill="var(--color-background)"
        stroke="none"
      />
      <text
        x="114"
        y="29"
        fontSize="11"
        fontFamily="var(--font-mono), monospace"
        fill="var(--color-foreground)"
        opacity="0.6"
      >
        app.slack.com/client
      </text>

      {/* Tab strip */}
      <rect x="2" y="46" width="120" height="28" fill="var(--color-primary)" />
      <text
        x="12"
        y="65"
        fontSize="11"
        fontFamily="var(--font-mono), monospace"
        fill="var(--color-primary-foreground)"
        fontWeight="bold"
      >
        #general
      </text>
      <rect
        x="122"
        y="46"
        width="100"
        height="28"
        fill="var(--color-background)"
        stroke="var(--color-foreground)"
        strokeWidth="2"
      />
      <text
        x="132"
        y="65"
        fontSize="11"
        fontFamily="var(--font-mono), monospace"
        fill="var(--color-foreground)"
        opacity="0.5"
      >
        #engineering
      </text>

      {/* Page content lines */}
      <rect
        x="24"
        y="98"
        width="180"
        height="10"
        rx="0"
        fill="var(--color-foreground)"
        opacity="0.12"
      />
      <rect
        x="24"
        y="118"
        width="280"
        height="8"
        rx="0"
        fill="var(--color-foreground)"
        opacity="0.08"
      />
      <rect
        x="24"
        y="134"
        width="240"
        height="8"
        rx="0"
        fill="var(--color-foreground)"
        opacity="0.08"
      />
      <rect
        x="24"
        y="150"
        width="200"
        height="8"
        rx="0"
        fill="var(--color-foreground)"
        opacity="0.08"
      />
      <rect
        x="24"
        y="174"
        width="280"
        height="8"
        rx="0"
        fill="var(--color-foreground)"
        opacity="0.08"
      />
      <rect
        x="24"
        y="190"
        width="160"
        height="8"
        rx="0"
        fill="var(--color-foreground)"
        opacity="0.08"
      />

      {/* ── Agent overlay panel ────────────────────────────── */}
      {/* Hard shadow (neobrutalist offset) */}
      <rect
        x="310"
        y="118"
        width="196"
        height="210"
        fill="var(--color-foreground)"
      />
      {/* Panel body */}
      <rect
        x="306"
        y="114"
        width="196"
        height="210"
        fill="var(--color-primary)"
        stroke="var(--color-foreground)"
        strokeWidth="4"
      />

      {/* Panel header */}
      <rect
        x="306"
        y="114"
        width="196"
        height="36"
        fill="var(--color-foreground)"
      />
      <text
        x="318"
        y="137"
        fontSize="11"
        fontFamily="var(--font-mono), monospace"
        fill="var(--color-primary)"
        fontWeight="bold"
      >
        AI Agent
      </text>

      {/* Small logo mark inside panel header */}
      <rect
        x="462"
        y="121"
        width="18"
        height="18"
        rx="3"
        fill="var(--color-primary)"
        opacity="0.3"
      />
      <rect
        x="468"
        y="127"
        width="10"
        height="10"
        rx="2"
        fill="var(--color-primary)"
        opacity="0.6"
      />

      {/* Tool call rows */}
      <rect
        x="318"
        y="164"
        width="60"
        height="10"
        rx="0"
        fill="var(--color-foreground)"
        opacity="0.4"
      />
      <rect
        x="382"
        y="164"
        width="104"
        height="10"
        rx="0"
        fill="var(--color-foreground)"
        opacity="0.2"
      />

      <rect
        x="318"
        y="184"
        width="80"
        height="10"
        rx="0"
        fill="var(--color-foreground)"
        opacity="0.4"
      />
      <rect
        x="402"
        y="184"
        width="84"
        height="10"
        rx="0"
        fill="var(--color-foreground)"
        opacity="0.2"
      />

      {/* Tool call chip */}
      <rect
        x="318"
        y="210"
        width="168"
        height="28"
        fill="var(--color-foreground)"
      />
      <text
        x="328"
        y="229"
        fontSize="10"
        fontFamily="var(--font-mono), monospace"
        fill="var(--color-primary)"
      >
        slack_send_message(...)
      </text>

      {/* Checkmark result */}
      <rect
        x="318"
        y="252"
        width="168"
        height="28"
        fill="var(--color-background)"
        stroke="var(--color-foreground)"
        strokeWidth="2"
      />
      <text
        x="328"
        y="271"
        fontSize="10"
        fontFamily="var(--font-mono), monospace"
        fill="var(--color-foreground)"
        opacity="0.7"
      >
        ✓ message sent
      </text>

      {/* ── Connection arrow from panel to browser ─────────── */}
      <path
        d="M 306 218 L 240 218"
        stroke="var(--color-foreground)"
        strokeWidth="2"
        strokeDasharray="6 4"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L8,3 L0,6 Z" fill="var(--color-foreground)" />
        </marker>
      </defs>
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="container max-w-6xl mx-auto px-4 lg:px-0 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            <Badge className="mb-6">Open Source</Badge>
            <Text
              as="h1"
              className="text-5xl lg:text-6xl text-foreground mt-4 mb-6"
            >
              AI agents for
              <br />
              any web app
            </Text>
            <p className="text-lg text-muted-foreground mb-10 max-w-md">
              Give AI agents access to any web application through your
              authenticated browser session. No API keys needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/docs/install" passHref>
                <Button>Get Started</Button>
              </Link>
              <Link
                href="https://github.com/AnomalyCo/opentabs"
                target="_blank"
                passHref
              >
                <Button variant="outline">
                  <GithubIcon size={16} className="mr-2" />
                  GitHub
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: illustration */}
          <div className="flex justify-center lg:justify-end">
            {/* Hard shadow offset — neobrutalist */}
            <div className="relative">
              <div className="absolute inset-0 translate-x-3 translate-y-3 bg-foreground" />
              <div className="relative border-4 border-foreground bg-background p-4">
                <HeroIllustration />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="container max-w-6xl mx-auto px-4 lg:px-0 py-20 border-t-2 border-foreground">
        <Text as="h2" className="text-3xl mb-12">
          How it works
        </Text>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="flex gap-5">
              <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 border-2 border-foreground font-bold text-sm bg-primary text-foreground">
                {item.step}
              </span>
              <div>
                <p className="font-bold text-foreground mb-1">{item.title}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="container max-w-6xl mx-auto px-4 lg:px-0 my-24">
        <div className="border-4 border-foreground bg-primary px-8 py-14 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <Text as="h2" className="text-foreground mb-2">
              Start building today
            </Text>
            <p className="text-foreground/70">
              Free and open source. No API keys. No config files.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <Link href="/docs/install" passHref>
              <Button className="bg-background" variant="outline">
                Installation Guide
              </Button>
            </Link>
            <Link
              href="https://github.com/AnomalyCo/opentabs"
              target="_blank"
              passHref
            >
              <Button className="bg-background" variant="outline">
                <GithubIcon size={16} className="mr-2" />
                View on GitHub
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
