import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkToc from "remark-toc";

const docs = defineCollection({
  name: "docs",
  directory: "content/docs",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.string(),
    links: z
      .object({
        source: z.string().optional(),
        api_reference: z.string().optional(),
      })
      .optional(),
    // The raw MDX content — populated automatically by the frontmatter parser
    content: z.string(),
  }),
  transform: async (doc, ctx) => {
    const body = await compileMDX(ctx, doc, {
      remarkPlugins: [remarkToc],
      rehypePlugins: [
        rehypeSlug,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [rehypePrettyCode, { theme: "dracula-soft" }] as any,
      ],
    });
    // Derive url: content/docs/foo/bar.mdx → /docs/foo/bar
    // Strip trailing /index so the docs root resolves correctly
    const slug = doc._meta.path.replace(/\/index$/, "").replace(/^index$/, "");
    const url = `/docs${slug ? `/${slug}` : ""}`;
    return { ...doc, body, url };
  },
});

export default defineConfig({
  content: [docs],
});
