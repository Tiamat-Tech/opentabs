import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from "contentlayer/source-files";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkToc from "remark-toc";

const Links = defineNestedType(() => {
  return {
    name: "Links",
    fields: {
      source: { type: "string", required: false },
      api_reference: { type: "string", required: false },
    },
  };
});

export const Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: `docs/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    lastUpdated: { type: "date", required: true },
    links: {
      type: "nested",
      of: Links,
      required: false,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  mdx: {
    remarkPlugins: [remarkToc],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode as any,
        {
          theme: "dracula-soft",
        },
      ],
    ],
  },
  contentDirPath: "./content",
  documentTypes: [Doc],
});
