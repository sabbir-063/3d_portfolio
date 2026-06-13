import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Services } from "@/components/services";
import { SkillsV2 as Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Reflections } from "@/components/reflections";
import { Blogs } from "@/components/blogs";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { getAllPostsMeta, getFeaturedPostsMeta } from "@/lib/blog";

const HOMEPAGE_BLOG_LIMIT = 2;

export default function Home() {
  const featured = getFeaturedPostsMeta(HOMEPAGE_BLOG_LIMIT);
  const total = getAllPostsMeta().length;

  return (
    <>
      <main className="relative z-10">
        <Hero />
        <About />
        <Services />
        <Skills />
        <Projects />
        <Blogs posts={featured} total={total} />
        <Reflections />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
