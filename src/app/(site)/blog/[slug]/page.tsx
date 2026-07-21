import path from "path";
import fs from "fs";
import { Metadata } from "next";
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb";
import { BackButton } from "@/components/back-button";
import { BlogBreadcrumb } from "../_components/breadcrumb";

export function generateStaticParams() {
  const directory = path.join(process.cwd(), "src/app/(site)/blog/_posts");
  const files = fs.readdirSync(directory);
  return files.map((file) => ({
    slug: file.replace(/\.mdx$/, ""),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = await import(`../_posts/${slug}.mdx`);

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: metadata.openGraph,
    twitter: metadata.twitter,
  };
}

// export default PostPage;
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post, metadata } = await import(`../_posts/${slug}.mdx`);

  return (
    <>
      {metadata.youtubeId && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: metadata.title,
              description: metadata.description,
              thumbnailUrl: [
                `https://img.youtube.com/vi/${metadata.youtubeId}/maxresdefault.jpg`,
              ],
              uploadDate: new Date(metadata.datetime).toISOString(),
              embedUrl: `https://www.youtube.com/embed/${metadata.youtubeId}`,
              contentUrl: `https://www.elevateyourping.com/blog/${slug}`,
              publisher: {
                "@type": "Organization",
                name: "Elevate Your Ping",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.elevateyourping.com/logos/full-logo.png",
                },
              },
            }),
          }}
        />
      )}
      <div id="blog-page" className="bg-[#f9f9f9] px-4 md:px-6 mx-auto py-8">
        <article className="bg-white max-w-4xl lg:max-w-5xl mx-auto rounded-xl shadow-sm p-6 prose prose-headings:font-sans prose-headings:mt-8 prose-p:leading-relaxed prose-img:rounded-lg prose-img:my-6">
          <div className="not-prose">
            <BlogBreadcrumb />
          </div>
          <Post />
        </article>
      </div>
    </>
  );
}

export const dynamicParams = false;
