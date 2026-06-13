# Mohammad Sabbir Musfique — Portfolio

Personal portfolio website built with Next.js 16, TypeScript, Tailwind CSS, Framer Motion, GSAP, and Lenis smooth scroll.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion + GSAP + ScrollTrigger |
| Smooth Scroll | Lenis |
| Fonts | Space Grotesk · Inter (Google Fonts) |
| Icons | Material Symbols Outlined + custom brand SVGs |
| Deployment | Vercel |

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout — fonts, theme script, SEO metadata
│   ├── page.tsx            # Home page — section composition
│   ├── projects/page.tsx   # All projects archive
│   ├── blogs/page.tsx      # All blog posts archive
│   ├── sitemap.ts          # Auto-generated sitemap.xml
│   └── robots.ts           # Auto-generated robots.txt
│
├── components/
│   ├── navbar/             # Navbar, SideNav, ThemeToggle, NavLogo, useActiveSection
│   ├── hero/               # HeroContent, HeroImage, ScrollBridge
│   ├── about/              # About, StatCard, Education, Experience, aboutData
│   ├── technologies/       # Technologies, TechCard, techData
│   ├── skills/             # Skills, SkillRadial, SkillBar, skillData
│   ├── projects/           # Projects, ProjectCard, projectData
│   ├── blogs/              # Blogs, BlogCard, blogData
│   ├── contact/            # ContactForm
│   ├── footer/             # Footer
│   └── ui/                 # Shared: SectionHeading, ScrollReveal, AnimatedBlob,
│                           #         TagPill, BackToTop, BrandIcon, Typewriter…
│
├── lib/
│   └── gsap.ts             # GSAP singleton with ScrollTrigger pre-registered
│
├── styles/
│   └── globals.css         # CSS variables (light/dark), glass-panel, scrollbar
│
└── public/
    ├── favicon.svg
    └── headshot_mohammad_sabbir_musfique.jpg
```

## Sections

- **Hero** — Typewriter role cycle, floating tech badges, scroll-to-explore indicator
- **About** — Animated stat counters, education timeline, experience timeline
- **Technologies** — Filterable technology grid by category
- **Skills** — Radial SVG skill meters + animated bar charts
- **Projects** — 2-column card grid with GitHub and Live Site links
- **Blog** — Full-width horizontal post rows with alternating image sides
- **Contact** — Animated form with underline inputs
- **Footer** — Brand, navigation links, contact info, availability status

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Update your details

| File | What to change |
|---|---|
| `components/hero/HeroContent.tsx` | Social links (GitHub, LinkedIn, Facebook URLs) |
| `components/about/aboutData.ts` | Education, experience, skills |
| `components/projects/projectData.ts` | Projects with `gitUrl` and `liveUrl` |
| `components/blogs/blogData.ts` | Blog posts |
| `components/technologies/techData.ts` | Technology stack |
| `components/skills/skillData.ts` | Skill levels |
| `app/layout.tsx` | SEO metadata, `SITE_URL` |
| `app/sitemap.ts` | `SITE_URL` |
| `app/robots.ts` | `SITE_URL` |

### Theme

The design uses CSS custom properties in `styles/globals.css`. Colours are defined in space-separated RGB format so Tailwind opacity modifiers (`/10`, `/30` etc.) work in both light and dark mode.

### Images

Remote image domains must be whitelisted in `next.config.ts` under `images.remotePatterns`.

## Deployment

The project deploys to Vercel automatically. The `vercel.json` at the root sets the framework to `nextjs` to prevent detection issues.

```json
{
  "framework": "nextjs",
  "buildCommand": "next build"
}
```

Push to `main` → Vercel picks it up and deploys.

## License

MIT — free to use as a template. Attribution appreciated but not required.
