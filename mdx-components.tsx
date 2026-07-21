import slugify from "slugify";
import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import { ResponsiveIframe } from "@/app/(site)/blog/_components/responsive-iframe";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

function slugifyHeading(children: React.ReactNode): string {
  const getText = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return node.toString();
    if (Array.isArray(node)) return node.map(getText).join("");
    if (typeof node === "object" && node && "props" in node) {
      return getText((node as any).props.children);
    }
    return "";
  };

  const text = getText(children)
    .replace(/^\d+[\.\-\)]*\s*/, "") // remove numbered prefixes
    .trim();

  return slugify(text, { lower: true, strict: true });
}

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight my-8">
        {children}
      </h1>
    ),
    h2: ({ children }) => {
      const id = slugifyHeading(children);

      return (
        <h2
          id={id}
          className="text-2xl md:text-3xl font-sans font-semibold text-neutral-900 mt-12 mb-4 scroll-mt-24 ">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = slugifyHeading(children);

      return (
        <h3
          id={id}
          className="text-xl font-sans font-semibold text-neutral-800 mt-8 mb-3 scroll-mt-20">
          {children}
        </h3>
      );
    },
    p: ({ children }) => (
      <p className="text-base md:text-lg font-sans text-neutral-700 leading-relaxed my-4">
        {children}
      </p>
    ),
    ul: ({ children }) => <ul className="text-base md:text-lg">{children}</ul>,
    ol: ({ children }) => <ol className="text-base md:text-lg">{children}</ol>,
    li: ({ children }) => (
      <li className="leading-relaxed text-base md:text-lg">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-neutral-900">{children}</strong>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-neutral-600 my-6">
        {children}
      </blockquote>
    ),
    img: (props) => (
      <Image
        sizes="100vw"
        className="rounded-lg shadow-md my-6"
        style={{ width: "100%", height: "auto" }}
        {...(props as ImageProps)}
      />
    ),
    hr: () => <hr className="my-8 border-neutral-300" />,
    ResponsiveIframe,
    ...components,
  };
}
