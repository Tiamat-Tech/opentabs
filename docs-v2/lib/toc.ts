import { toc } from "mdast-util-toc";
import { remark } from "remark";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

const textTypes = ["text", "emphasis", "strong", "inlineCode"] as const;

function flattenNode(node: any): string {
  const p: string[] = [];
  visit(node as any, (node: any) => {
    if (!textTypes.includes(node.type as any)) return;
    if ("value" in node && typeof node.value === "string") {
      p.push(node.value);
    }
  });
  return p.join("");
}

interface Item {
  title: string;
  url: string;
  items?: Item[];
}

interface Items {
  items?: Item[];
}

function getItems(node: any, current: any): Items {
  if (!node) {
    return {};
  }

  if (node.type === "paragraph") {
    visit(node, (item: any) => {
      if (item.type === "link") {
        current.url = item.url;
        current.title = flattenNode(node);
      }

      if (item.type === "text") {
        current.title = flattenNode(node);
      }
    });

    return current;
  }

  if (node.type === "list") {
    current.items = node.children.map((i: any) => getItems(i, {}));

    return current;
  } else if (node.type === "listItem") {
    const heading = getItems(node.children[0], {});

    if (node.children.length > 1) {
      getItems(node.children[1], heading);
    }

    return heading;
  }

  return {};
}

const getToc = () => (node: any, file: VFile) => {
  const table = toc(node, { maxDepth: 3 });
  const items = getItems(table.map, {});

  file.data = { ...file.data, ...items };
};

export type TableOfContents = Items;

export const generateToc = async (
  content: string,
): Promise<TableOfContents> => {
  const result = await remark().use(getToc).process(content);

  return result.data as TableOfContents;
};
