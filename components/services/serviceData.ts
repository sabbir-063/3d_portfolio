export interface Service {
  number: string;
  icon: string;
  title: string;
  description: string;
  deliverables: string[];
  stack: string[];
  accentColor: string;
  glowColor: string;
  borderColor: string;
}

export const services: Service[] = [
  {
    number: "01",
    icon: "web",
    title: "Full Stack Web Applications",
    description:
      "End-to-end web development with modern frameworks. From interactive frontends to robust APIs and database design — I build the entire stack so every layer works together seamlessly.",
    deliverables: [
      "End-to-end application development",
      "REST API design & implementation",
      "Database modeling & optimization",
      "Responsive, production-ready UI",
    ],
    stack: ["React", "Next.js", "Node.js", "Spring Boot", "PostgreSQL"],
    accentColor: "text-primary",
    glowColor: "bg-primary",
    borderColor: "border-primary/20",
  },
  {
    number: "02",
    icon: "phone_iphone",
    title: "Mobile App Development",
    description:
      "Cross-platform mobile apps with Flutter that feel native on both Android and iOS. Clean architecture, responsive UI, and smooth performance from a single codebase.",
    deliverables: [
      "Cross-platform mobile apps (iOS & Android)",
      "Firebase integration & authentication",
      "State management (GetX / Riverpod)",
      "App Store & Play Store deployment",
    ],
    stack: ["Flutter", "Dart", "Firebase", "GetX", "Cloud Firestore"],
    accentColor: "text-secondary",
    glowColor: "bg-secondary",
    borderColor: "border-secondary/20",
  },
  {
    number: "03",
    icon: "psychology",
    title: "AI/ML Solutions",
    description:
      "Practical AI integrations that solve real problems — from RAG pipelines and vector search to NLP models and computer vision. I bridge the gap between research prototypes and production systems.",
    deliverables: [
      "RAG pipelines & vector search",
      "NLP models & text processing",
      "LangChain-based AI agents",
      "TensorFlow & Keras model deployment",
    ],
    stack: ["Python", "TensorFlow", "LangChain", "FAISS", "OpenCV"],
    accentColor: "text-tertiary",
    glowColor: "bg-tertiary",
    borderColor: "border-tertiary/20",
  },
  {
    number: "04",
    icon: "hub",
    title: "Backend & API Architecture",
    description:
      "Scalable backend systems with clean API design, microservices patterns, and event-driven architectures. Built for reliability, observability, and performance under load.",
    deliverables: [
      "Microservices architecture",
      "Event-driven systems (SSE)",
      "CI/CD pipeline setup",
      "Performance optimization & caching",
    ],
    stack: ["Java", "Spring Boot", "Node.js", "PostgreSQL", "Redis"],
    accentColor: "text-primary",
    glowColor: "bg-primary",
    borderColor: "border-primary/20",
  },
];
