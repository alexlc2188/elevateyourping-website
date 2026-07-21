import fs from "fs";
import path from "path";

import { compileMDX } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { ResponsiveIframe } from "@/app/(site)/blog/_components/responsive-iframe";
import { ReactElement } from "react";

const directory = path.join(process.cwd(), "src/app/(site)/blog/_posts");

export type Post = {
  meta: {
    title: string;
    date: string;
    datetime: string;
    description: string;
    image?: string;
    href: string;
  };
  slug: string;
  content: ReactElement;
};

export const getAllPosts = async (): Promise<Post[]> => {
  const directory = path.join(process.cwd(), "src/app/(site)/blog/_posts");
  const files = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".mdx"));

  const posts = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace(".mdx", "");
      const { metadata } = await import(
        `@/app/(site)/blog/_posts/${slug}.mdx`
      );

      return {
        meta: metadata,
        slug,
      } as Post;
    }),
  );

  return posts.sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime(),
  );
};

export const getPost = async (slug: string) => {
  try {
    const markdownFile = fs.readFileSync(
      path.join(process.cwd(), directory, slug + ".mdx"),
      "utf-8",
    );

    const { content, frontmatter } = await compileMDX<Post["meta"]>({
      source: markdownFile,
      options: { parseFrontmatter: true },
      components: {
        ResponsiveIframe, // add components here for mdx
      },
    });

    return {
      meta: frontmatter as Post["meta"],
      slug,
      content,
    };
  } catch (error) {
    return null;
  }
};
