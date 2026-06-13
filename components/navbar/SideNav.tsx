"use client";

import { usePathname } from "next/navigation";
import BrandIcon from "@/components/ui/BrandIcon";

const socialLinks = [
  {
    label: "GitHub",
    icon: "github" as const,
    href: "https://github.com/sabbir-063",
    hover: "hover:text-on-surface dark:hover:text-white hover:bg-black/[0.08] dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/25",
  },
  {
    label: "LinkedIn",
    icon: "linkedin" as const,
    href: "https://www.linkedin.com/in/msmusfique063/",
    hover: "hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30",
  },
  {
    label: "Facebook",
    icon: "facebook" as const,
    href: "https://www.facebook.com/sabbirxyz.5/",
    hover: "hover:text-[#1877F2] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30",
  },
  {
    label: "Email",
    icon: "email" as const,
    href: "/#Contact",
    hover: "hover:text-primary hover:bg-primary/10 hover:border-primary/30",
  },
];

export default function SideNav() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-4 py-6 px-3 glass-panel rounded-full hidden lg:flex" style={{ backdropFilter: "blur(56px)", WebkitBackdropFilter: "blur(56px)" }}>
      {socialLinks.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target={s.href.startsWith("http") ? "_blank" : undefined}
          rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={s.label}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant backdrop-blur-sm bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition-all duration-300 ${s.hover}`}
        >
          <BrandIcon name={s.icon} className="w-[15px] h-[15px]" />
        </a>
      ))}
    </aside>
  );
}
