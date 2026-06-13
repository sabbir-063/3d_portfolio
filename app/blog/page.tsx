import { getAllPostsMeta } from "@/lib/blog";
import BlogCard from "@/components/blogs/BlogCard";

export const metadata = {
  title: "The Codex",
  description:
    "Reflections on software engineering, system design, and the craft of building web systems — by Mohammad Sabbir Musfique.",
  keywords: [
    "software engineering blog",
    "React",
    "Spring Boot",
    "Flutter",
    "AI/ML",
    "system design",
    "Mohammad Sabbir Musfique",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "The Codex | Mohammad Sabbir Musfique",
    description:
      "Reflections on software engineering, system design, and the craft of building web systems.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPostsMeta();

  return (
    <main className="relative z-10 min-h-screen px-6 md:px-16 lg:px-24 pt-36 pb-28">
      <div className="max-w-6xl mx-auto">
        <header className="mb-14">
          <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tight text-on-surface">
            The <span className="text-tertiary text-glow">Codex</span>
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm font-body max-w-md">
            Reflections on engineering, system design, and the craft of building software.
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-tertiary to-transparent rounded-full mt-3" />
        </header>

        {posts.length === 0 ? (
          <div className="glass-panel rounded-2xl p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">edit_note</span>
            <p className="text-on-surface-variant text-sm mt-4 font-body">First post coming soon.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} {...post} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
