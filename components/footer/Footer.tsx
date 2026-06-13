import BrandIcon from "@/components/ui/BrandIcon";
import { ScrollReveal } from "@/components/ui";
import { navLinks, contactLink } from "@/components/navbar/navLinks";
import FooterQuote from "./FooterQuote";

const socialLinks = [
  { label: "GitHub", icon: "github" as const, href: "https://github.com/sabbir-063" },
  { label: "LinkedIn", icon: "linkedin" as const, href: "https://www.linkedin.com/in/msmusfique063/" },
  { label: "Facebook", icon: "facebook" as const, href: "https://www.facebook.com/sabbirxyz.5/" },
  { label: "Email", icon: "email" as const, href: "/#Contact" },
];

const footerNavLinks = [...navLinks, contactLink];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/[0.06] dark:border-white/5 relative overflow-hidden">
      <ScrollReveal direction="up" amount={0.2}>
        <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-12 relative z-10">

          {/* Top row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-black/[0.06] dark:border-white/5">

            {/* Brand */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <svg className="w-9 h-9" viewBox="0 0 40 40" aria-hidden="true">
                  <defs>
                    <linearGradient id="footerLogoGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "rgb(var(--color-primary))" }} />
                      <stop offset="100%" style={{ stopColor: "rgb(var(--color-secondary))" }} />
                    </linearGradient>
                  </defs>
                  <path d="M25.5 14.5C23.5 11.8 19 11.3 16.5 13.2C14.2 15 15 17.8 18 19C20.5 20 24 20.7 25.5 22.8C27.2 25.2 25 28.4 21.5 28.9C18.5 29.3 15 28.3 13.5 25.8" fill="none" stroke="url(#footerLogoGrad)" strokeLinecap="round" strokeWidth="2.6" transform="translate(3.2,0) skewX(-10)" />
                  <path d="M12 34C10 34 8 32 8 30C8 28 10 26 12 26C14 26 16 28 16 30" fill="none" stroke="url(#footerLogoGrad)" strokeWidth="1.5" />
                </svg>
                <div>
                  <p className="text-sm font-bold text-on-surface font-headline leading-tight">Mohammad Sabbir Musfique</p>
                  <p className="text-[10px] text-on-surface-variant font-label tracking-widest uppercase mt-0.5">Software Engineer</p>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant font-body leading-relaxed max-w-xs">
                Building production systems across full stack, AI/ML, and mobile. Based in Dhaka, Bangladesh.
              </p>
              <div className="flex items-center gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={s.label}
                    className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all duration-300"
                  >
                    <BrandIcon name={s.icon} className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation — sourced from navLinks (single source of truth) */}
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary font-label mb-1">Navigation</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {footerNavLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-xs text-on-surface-variant hover:text-on-surface transition-colors font-body w-fit"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary font-label">Get in Touch</p>
              <div className="space-y-2">
                <a
                  href="mailto:sabbir.musfique01@gmail.com"
                  className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-on-surface transition-colors font-body"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary">mail</span>
                  sabbir.musfique01@gmail.com
                </a>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body">
                  <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                  Dhaka, Bangladesh
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body">
                  <span className="material-symbols-outlined text-[14px] text-primary">work</span>
                  Be Data Solutions · Software Engineer
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-3 py-2 glass-panel rounded-full w-fit mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label">
                  Open to opportunities
                </span>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-[10px] text-on-surface-variant font-label">
            <p>© {year} Mohammad Sabbir Musfique. All rights reserved.</p>
            <FooterQuote />
          </div>

        </div>
      </ScrollReveal>
    </footer>
  );
}
