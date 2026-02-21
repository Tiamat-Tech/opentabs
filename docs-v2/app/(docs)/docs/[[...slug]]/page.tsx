import React from "react";
import { allDocs } from "content-collections";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import MDX from "@/components/MDX";
import { Metadata } from "next";
import { generateToc } from "@/lib/toc";
import TableOfContents from "@/components/TableOfContents";

interface IProps {
  params: Promise<{ slug?: string[] }>;
}

function getDoc(slug: string[] | undefined) {
  const path = `/docs${slug ? `/${slug.join("/")}` : ""}`;
  return allDocs.find((doc) => doc.url === path) ?? null;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);

  if (!doc) {
    return { title: "Not Found | OpenTabs" };
  }

  return {
    title: `${doc.title} | OpenTabs`,
    description: doc.description,
  };
}

export default async function DocPage({ params }: IProps) {
  const { slug } = await params;
  const doc = getDoc(slug);

  if (!doc) {
    return notFound();
  }

  const toc = await generateToc(doc.content);
  return (
    <>
      {/* Main Content */}
      <div className="flex-1 space-y-12 py-12 px-4 max-w-2xl mx-auto w-full">
        <div>
          <MDX code={doc.body} />
        </div>
        <p className="text-right">
          Last Updated: {format(new Date(doc.lastUpdated), "dd MMM, yyy")}
        </p>
      </div>

      {/* Table of Contents */}
      <div className="hidden lg:block lg:w-60 flex-shrink-0 sticky top-36 self-start space-y-6">
        <TableOfContents toc={toc} />
      </div>
    </>
  );
}
