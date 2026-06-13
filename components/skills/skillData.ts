export interface Skill {
  name: string;
  level: number; // 0–100
}

export interface SkillGroup {
  category: string;
  icon: string;
  color: string;
  skills: Skill[];
}

export const featuredSkills: (Skill & { color: string; trackColor: string })[] = [
  { name: "React / Next.js", level: 88, color: "#61DAFB", trackColor: "rgba(97,218,251,0.15)" },
  { name: "Flutter / Dart", level: 80, color: "#02569B", trackColor: "rgba(2,87,155,0.15)" },
  { name: "Python / AI/ML", level: 82, color: "#FFD43B", trackColor: "rgba(255,212,59,0.15)" },
  { name: "Node.js / Spring Boot", level: 85, color: "#68A063", trackColor: "rgba(104,160,99,0.15)" },
];

export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    icon: "web",
    color: "text-primary",
    skills: [
      { name: "React / Next.js", level: 88 },
      { name: "Flutter / Dart", level: 80 },
      { name: "TypeScript", level: 85 },
      { name: "CSS / Tailwind", level: 82 },
    ],
  },
  {
    category: "Backend",
    icon: "hub",
    color: "text-secondary",
    skills: [
      { name: "Node.js / Express", level: 85 },
      { name: "Java / Spring Boot", level: 82 },
      { name: "Python / FastAPI", level: 78 },
      { name: "REST APIs", level: 85 },
    ],
  },
  {
    category: "AI / ML",
    icon: "psychology",
    color: "text-tertiary",
    skills: [
      { name: "Python / TensorFlow", level: 82 },
      { name: "LangChain / RAG", level: 75 },
      { name: "NLP / OpenCV", level: 72 },
      { name: "Faiss / Vector DB", level: 70 },
    ],
  },
  {
    category: "DevOps & Tools",
    icon: "terminal",
    color: "text-primary",
    skills: [
      { name: "Git & CI/CD", level: 80 },
      { name: "Docker / Jenkins", level: 72 },
      { name: "Firebase / Prisma", level: 80 },
      { name: "System Design", level: 72 },
    ],
  },
];
