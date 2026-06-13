export interface Tech {
  name: string;
  category: string;
  color: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
  abbr: string;
  siIcon?: string; // react-icons/si key e.g. "SiAngular"
}

export const techs: Tech[] = [
  // Language
  { name: "JavaScript", category: "Language", color: "#F7DF1E", textColor: "text-[#F7DF1E]", borderColor: "border-[#F7DF1E]/20", glowColor: "shadow-[0_0_20px_rgba(247,223,30,0.3)]", abbr: "JS", siIcon: "SiJavascript" },
  { name: "TypeScript", category: "Language", color: "#3178C6", textColor: "text-[#3178C6]", borderColor: "border-[#3178C6]/30", glowColor: "shadow-[0_0_20px_rgba(49,120,198,0.3)]", abbr: "TS", siIcon: "SiTypescript" },
  { name: "Python", category: "Language", color: "#3776AB", textColor: "text-[#3776AB]", borderColor: "border-[#3776AB]/30", glowColor: "shadow-[0_0_20px_rgba(55,118,171,0.3)]", abbr: "Py", siIcon: "SiPython" },
  { name: "Java", category: "Language", color: "#ED8B00", textColor: "text-[#ED8B00]", borderColor: "border-[#ED8B00]/30", glowColor: "shadow-[0_0_20px_rgba(237,139,0,0.3)]", abbr: "Jv", siIcon: "SiOpenjdk" },
  { name: "Dart", category: "Language", color: "#0175C2", textColor: "text-[#0175C2]", borderColor: "border-[#0175C2]/30", glowColor: "shadow-[0_0_20px_rgba(1,117,194,0.3)]", abbr: "Da", siIcon: undefined },

  // Frontend
  { name: "React", category: "Frontend", color: "#61DAFB", textColor: "text-[#61DAFB]", borderColor: "border-[#61DAFB]/25", glowColor: "shadow-[0_0_20px_rgba(97,218,251,0.3)]", abbr: "Re", siIcon: "SiReact" },
  { name: "Next.js", category: "Frontend", color: "#FFFFFF", textColor: "text-white", borderColor: "border-white/20", glowColor: "shadow-[0_0_20px_rgba(255,255,255,0.15)]", abbr: "Nx", siIcon: "SiNextdotjs" },
  { name: "Flutter", category: "Frontend", color: "#02569B", textColor: "text-[#02569B]", borderColor: "border-[#02569B]/30", glowColor: "shadow-[0_0_20px_rgba(2,87,155,0.3)]", abbr: "Fl", siIcon: "SiFlutter" },
  { name: "Tailwind", category: "Frontend", color: "#06B6D4", textColor: "text-[#06B6D4]", borderColor: "border-[#06B6D4]/25", glowColor: "shadow-[0_0_20px_rgba(6,182,212,0.3)]", abbr: "TW", siIcon: "SiTailwindcss" },

  // Backend
  { name: "Node.js", category: "Backend", color: "#339933", textColor: "text-[#339933]", borderColor: "border-[#339933]/30", glowColor: "shadow-[0_0_20px_rgba(51,153,51,0.3)]", abbr: "No", siIcon: "SiNodedotjs" },
  { name: "Express", category: "Backend", color: "#ABABAB", textColor: "text-[#ABABAB]", borderColor: "border-[#ABABAB]/20", glowColor: "shadow-[0_0_20px_rgba(171,171,171,0.2)]", abbr: "Ex", siIcon: "SiExpress" },
  { name: "Spring Boot", category: "Backend", color: "#6DB33F", textColor: "text-[#6DB33F]", borderColor: "border-[#6DB33F]/30", glowColor: "shadow-[0_0_20px_rgba(109,179,63,0.3)]", abbr: "SB", siIcon: "SiSpringboot" },
  { name: "Prisma", category: "Backend", color: "#2D3748", textColor: "text-[#2D3748] dark:text-white", borderColor: "border-[#2D3748]/25 dark:border-white/20", glowColor: "shadow-[0_0_20px_rgba(45,55,72,0.25)]", abbr: "Pr", siIcon: "SiPrisma" },

  // Database
  { name: "PostgreSQL", category: "Database", color: "#4169E1", textColor: "text-[#4169E1]", borderColor: "border-[#4169E1]/25", glowColor: "shadow-[0_0_20px_rgba(65,105,225,0.3)]", abbr: "Pg", siIcon: "SiPostgresql" },
  { name: "MongoDB", category: "Database", color: "#47A248", textColor: "text-[#47A248]", borderColor: "border-[#47A248]/30", glowColor: "shadow-[0_0_20px_rgba(71,162,72,0.3)]", abbr: "Mg", siIcon: "SiMongodb" },
  { name: "Redis", category: "Database", color: "#DC382D", textColor: "text-[#DC382D]", borderColor: "border-[#DC382D]/25", glowColor: "shadow-[0_0_20px_rgba(220,56,45,0.3)]", abbr: "Rd", siIcon: "SiRedis" },
  { name: "Firebase", category: "Database", color: "#FFCA28", textColor: "text-[#FFCA28]", borderColor: "border-[#FFCA28]/20", glowColor: "shadow-[0_0_20px_rgba(255,202,40,0.3)]", abbr: "Fb", siIcon: "SiFirebase" },

  // AI / ML
  { name: "TensorFlow", category: "AI/ML", color: "#FF6F00", textColor: "text-[#FF6F00]", borderColor: "border-[#FF6F00]/30", glowColor: "shadow-[0_0_20px_rgba(255,111,0,0.3)]", abbr: "TF", siIcon: "SiTensorflow" },
  { name: "Keras", category: "AI/ML", color: "#D00000", textColor: "text-[#D00000]", borderColor: "border-[#D00000]/30", glowColor: "shadow-[0_0_20px_rgba(208,0,0,0.3)]", abbr: "Ke", siIcon: undefined },
  { name: "LangChain", category: "AI/ML", color: "#412991", textColor: "text-[#412991]", borderColor: "border-[#412991]/30", glowColor: "shadow-[0_0_20px_rgba(65,41,145,0.3)]", abbr: "LC", siIcon: undefined },

  // DevOps
  { name: "Git", category: "DevOps", color: "#F05032", textColor: "text-[#F05032]", borderColor: "border-[#F05032]/25", glowColor: "shadow-[0_0_20px_rgba(240,80,50,0.3)]", abbr: "Git", siIcon: "SiGit" },
  { name: "Docker", category: "DevOps", color: "#2496ED", textColor: "text-[#2496ED]", borderColor: "border-[#2496ED]/25", glowColor: "shadow-[0_0_20px_rgba(36,150,237,0.3)]", abbr: "Dk", siIcon: "SiDocker" },
  { name: "Jenkins", category: "DevOps", color: "#D33833", textColor: "text-[#D33833]", borderColor: "border-[#D33833]/25", glowColor: "shadow-[0_0_20px_rgba(211,56,51,0.3)]", abbr: "Jk", siIcon: "SiJenkins" },
  { name: "Vercel", category: "DevOps", color: "#666666", textColor: "text-[#666666] dark:text-white", borderColor: "border-[#666666]/25 dark:border-white/20", glowColor: "shadow-[0_0_20px_rgba(102,102,102,0.25)]", abbr: "▲", siIcon: "SiVercel" },

  // Tools
  { name: "Postman", category: "Tools", color: "#FF6C37", textColor: "text-[#FF6C37]", borderColor: "border-[#FF6C37]/25", glowColor: "shadow-[0_0_20px_rgba(255,108,55,0.3)]", abbr: "Pm", siIcon: "SiPostman" },
  { name: "Figma", category: "Design", color: "#F24E1E", textColor: "text-[#F24E1E]", borderColor: "border-[#F24E1E]/25", glowColor: "shadow-[0_0_20px_rgba(242,78,30,0.3)]", abbr: "Fig", siIcon: "SiFigma" },
];

export const categories = ["All", "Language", "Frontend", "Backend", "Database", "AI/ML", "DevOps", "Tools", "Design"];
