export interface Reflection {
  id: number;
  comment: string;
  name: string;
  designation: string;
  company: string;
  /** True if the person is no longer at the listed company. */
  formerly?: boolean;
  photo: string | null;
  initials: string;
}

export const reflections: Reflection[] = [
  {
    id: 1,
    comment:
      "Sabbir is a thoughtful engineer who takes real ownership of his work. He communicates clearly, breaks down complex problems, and delivers with care. Working with him has been a genuinely positive experience.",
    name: "Colleague",
    designation: "Software Engineer",
    company: "Be Data Solutions",
    photo: null,
    initials: "C1",
  },
  {
    id: 2,
    comment:
      "What stands out about Sabbir is his ability to learn fast and adapt. Whether it is a new framework or an unfamiliar domain, he picks things up quickly and applies them with quality. A reliable teammate.",
    name: "Colleague",
    designation: "Senior Developer",
    company: "Be Data Solutions",
    photo: null,
    initials: "C2",
  },
  {
    id: 3,
    comment:
      "Sabbir approaches engineering with both curiosity and discipline. He builds things that work, and he cares about the details that make them maintainable. A strong engineer with clear growth potential.",
    name: "Colleague",
    designation: "Team Lead",
    company: "Be Data Solutions",
    photo: null,
    initials: "C3",
  },
];
