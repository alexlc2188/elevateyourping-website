import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function BlogsPage() {
  const [featured, ...rest] = await getAllPosts();

  return (
    <main className="bg-gradient-to-br from-slate-950 to-slate-900 h-full text-white">
      {/* Hero Banner */}
      <section className="relative w-full bg-black text-white overflow-hidden md:h-[600px]">
        {/* Background blur */}
        <Image
          src={featured?.meta.image ?? ""}
          alt={featured.meta.title}
          fill
          className="object-cover object-center opacity-70 blur-lg scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-transparent" />

        {/* Foreground layout */}
        <div className="relative z-10 px-6 md:px-20 max-w-7xl mx-auto pt-6 pb-10 md:pt-0 md:pb-0 flex items-center h-auto md:h-[600px]">
          <div className="grid md:grid-cols-[480px_1fr] gap-10 items-center w-full">
            {/* Thumbnail */}
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-3xl">
              <Image
                src={featured?.meta.image ?? ""}
                alt={featured.meta.title}
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Text */}
            <div>
              <p className="text-xs tracking-widest bg-blue-400 text-black self-start px-2 py-1 uppercase font-semibold inline-block rounded mb-3">
                Featured Article
              </p>
              <h1 className="text-3xl md:text-5xl drop-shadow-lg">
                {featured.meta.title}
              </h1>
              <p className="mt-4 text-base md:text-lg text-slate-200 max-w-xl drop-shadow">
                {featured.meta.description}
              </p>
              <Button asChild size={"lg"} className="text-lg mt-6">
                <Link href={`/blog/${featured.slug}`}>
                  <span>Read the full story</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Posts */}
      <section id="blog-section" className="px-6 md:px-20 pb-24 pt-24 md:pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {rest.map((post, index) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.slug}
              className="group relative bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-md transition-all shadow-lg hover:shadow-blue-600/30 md:-mt-12">
              {post.meta.image && (
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={post.meta.image}
                    alt={post.meta.title}
                    fill
                    className="object-cover object-center transition-transform "
                  />
                </div>
              )}
              <div className="text-xs text-blue-300 uppercase my-1 tracking-wider">
                {post.meta.date}
              </div>
              <h3 className="text-xl  ">{post.meta.title}</h3>
              <p className="mt-2 text-sm text-slate-300 line-clamp-3 lg:text-base">
                {post.meta.description}
              </p>
              <div className="mt-4 inline-flex items-center text-secondary font-medium text-base group-hover:translate-x-1 transition-transform">
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
