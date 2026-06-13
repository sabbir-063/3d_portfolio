export interface Education {
  degree: string;
  institution: string;
  period: string;
  icon: string;
  detail?: string;
}

export interface Role {
  title: string;
  period: string;
  location?: string;
  mode?: string;
  description?: string;
  skills: string[];
  current?: boolean;
}

export interface Experience {
  company: string;
  type: string;
  roles: Role[];
}

export const education: Education[] = [
  {
    degree: "BSc in Computer Science & Engineering",
    institution: "MIST (Military Institute of Science and Technology)",
    period: "Apr 2021 – Jul 2025",
    icon: "school",
  },
  {
    degree: "HSC in Science",
    institution: "Quality Education College",
    period: "2018 – 2020",
    icon: "school",
  },
];

export const experiences: Experience[] = [
  {
    company: "Be Data Solutions",
    type: "Full-time",
    roles: [
      {
        title: "Software Engineer",
        period: "Sept 2025 – Present",
        location: "Dhaka, Bangladesh",
        mode: "On-site",
        description:
          "Architecting and developing production-grade systems across multiple product teams — from vector-powered search engines to microservices platforms.",
        skills: ["Java", "Spring Boot", "React", "Node.js", "PostgreSQL", "Prisma", "Docker"],
        current: true,
      },
    ],
  },
];
