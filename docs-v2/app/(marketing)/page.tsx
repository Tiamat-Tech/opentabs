import { Button, Text, Card, Badge } from "@/components/retroui";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col items-center min-h-screen">
        <section className="container max-w-6xl mx-auto px-4 lg:px-0 flex justify-center items-center my-28">
          <div className="text-center w-full max-w-3xl">
            <Badge className="mb-4">Open Source</Badge>

            <Text as="h1" className="text-5xl text-foreground lg:text-6xl mt-8">
              AI agents for
              <br />
              any web app
            </Text>

            <p className="text-lg text-muted-foreground mb-8 mt-4">
              Give AI agents access to any web application through your
              authenticated browser session. No API keys needed.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link href="/docs/install" passHref>
                <Button>Get Started</Button>
              </Link>
              <Link href="/docs" passHref>
                <Button variant="outline">Read the Docs</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container max-w-6xl mx-auto px-4 lg:px-0 lg:my-24">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mb-8">
            <Card className="w-full bg-background">
              <Card.Header>
                <Card.Title>Plugin Architecture</Card.Title>
              </Card.Header>
              <Card.Content>
                <Text className="text-muted-foreground">
                  Anyone can publish OpenTabs plugins as standalone npm
                  packages. The MCP server discovers them at runtime.
                </Text>
              </Card.Content>
            </Card>
            <Card className="w-full bg-background">
              <Card.Header>
                <Card.Title>AI Agent Ready</Card.Title>
              </Card.Header>
              <Card.Content>
                <Text className="text-muted-foreground">
                  Connects to Claude Code, Cursor, and any MCP-compatible client
                  via Streamable HTTP.
                </Text>
              </Card.Content>
            </Card>
            <Card className="w-full bg-background">
              <Card.Header>
                <Card.Title>Zero Trust Access</Card.Title>
              </Card.Header>
              <Card.Content>
                <Text className="text-muted-foreground">
                  Uses your authenticated browser sessions. No API keys or OAuth
                  tokens shared with AI agents.
                </Text>
              </Card.Content>
            </Card>
            <Card className="w-full bg-background">
              <Card.Header>
                <Card.Title>Hot Reload</Card.Title>
              </Card.Header>
              <Card.Content>
                <Text className="text-muted-foreground">
                  The MCP server runs with bun --hot. File watchers detect
                  plugin changes automatically.
                </Text>
              </Card.Content>
            </Card>
            <Card className="w-full bg-background">
              <Card.Header>
                <Card.Title>Any Web App</Card.Title>
              </Card.Header>
              <Card.Content>
                <Text className="text-muted-foreground">
                  Works with any website — Slack, GitHub, Jira, Linear, and
                  more. If you can use it in Chrome, agents can too.
                </Text>
              </Card.Content>
            </Card>
            <Card className="w-full bg-background">
              <Card.Header>
                <Card.Title>Plugin SDK</Card.Title>
              </Card.Header>
              <Card.Content>
                <Text className="text-muted-foreground">
                  Define tools with Zod schemas. Build with opentabs build CLI.
                  Publish as npm packages.
                </Text>
              </Card.Content>
            </Card>
          </div>
        </section>
      </div>

      <section className="container max-w-6xl mx-auto border-2 bg-primary border-black py-16 px-4 lg:p-16 my-36">
        <Text as="h2" className="text-center text-black mb-2">
          Get Started
        </Text>
        <Text className="text-xl text-center text-black mb-8">
          OpenTabs is free and open source. Start building in minutes.
        </Text>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
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
              <GithubIcon size="16" className="mr-2" />
              View on GitHub
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
