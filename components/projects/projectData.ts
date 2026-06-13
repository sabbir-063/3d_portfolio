export interface Project {
  id: string;
  label: string;
  title: string;
  description: string;
  gitUrl: string;
  liveUrl: string;
  image: string;
  accentColor: string;
  tags: string[];
  year: string;
  status: "Production" | "Open Source" | "In Development" | "Archived";
}

export const projects: Project[] = [
  {
    id: "nextblog",
    label: "Full Stack",
    title: "NextBlog",
    description:
      "A modern blogging platform built with Next.js featuring markdown rendering, code syntax highlighting, reading time estimates, and category filtering. Designed for developers to share technical articles with a clean reading experience.",
    gitUrl: "https://github.com/sabbir-063/BlogSite_frontend",
    liveUrl: "https://nextblogsite-nu.vercel.app/",
    image: "/projects/nextblog.png",
    accentColor: "text-primary",
    tags: ["Next.js", "TypeScript", "Markdown", "Tailwind CSS", "Vercel"],
    year: "2025",
    status: "Production",
  },
  {
    id: "bikreta",
    label: "Full Stack",
    title: "Bikreta",
    description:
      "A full-featured e-commerce platform with product listings, cart management, user authentication, and order processing. Built with React and Node.js, backed by MongoDB for flexible product data modeling.",
    gitUrl: "https://bikreta.netlify.app/",
    liveUrl: "https://bikreta.netlify.app/",
    image: "/projects/bikreta.png",
    accentColor: "text-secondary",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "JWT"],
    year: "2024",
    status: "Production",
  },
  {
    id: "oneconnect",
    label: "Mobile App",
    title: "OneConnect",
    description:
      "A community-focused mobile application built with Flutter featuring real-time messaging, user profiles, event management, and seamless cross-platform performance on Android and iOS.",
    gitUrl: "https://github.com/sabbir-063/one_connect_app",
    liveUrl: "https://www.youtube.com/watch?v=RrXlpB_5l7E",
    image: "/projects/oneconnect.jpeg",
    accentColor: "text-tertiary",
    tags: ["Flutter", "Dart", "Firebase", "GetX", "Cloud Firestore"],
    year: "2025",
    status: "Production",
  },
  {
    id: "cold-email-generator",
    label: "AI / ML",
    title: "Cold Email Generator",
    description:
      "An AI-powered tool that generates personalized cold emails using LangChain and a vector database. It scrapes job listings, matches them against a portfolio of skills, and produces tailored outreach emails.",
    gitUrl: "https://github.com/sabbir-063/LLM_Projects/tree/main/ColdEmailGenerator",
    liveUrl: "https://cold-mail-sabbir.streamlit.app/",
    image: "/projects/cold-email-generator.png",
    accentColor: "text-primary",
    tags: ["Python", "LangChain", "FAISS", "Groq API", "Streamlit"],
    year: "2025",
    status: "Open Source",
  },
];

export const MAX_HOMEPAGE_PROJECTS = 6;
