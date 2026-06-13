export interface NavLink {
  label: string;
  href: string;   // always "/#SectionId" — absolute to avoid relative-hash bugs
  icon: string;
  isPage?: boolean;
}

export const navLinks: NavLink[] = [
  { label: "Home",        href: "/#Home",        icon: "home" },
  { label: "About",       href: "/#About",       icon: "person" },
  { label: "Services",    href: "/#Services",    icon: "handyman" },
  { label: "Skills",      href: "/#Skills",      icon: "bar_chart" },
  { label: "Projects",    href: "/#Projects",    icon: "rocket_launch" },
  { label: "Blog",        href: "/#Blogs",       icon: "article" },
  { label: "Reflections", href: "/#Reflections", icon: "forum" },
];

export const contactLink: NavLink = {
  label: "Contact",
  href: "/#Contact",
  icon: "send",
};
