export const categories = {
  Frontend:            { accent: "text-primary",   dot: "bg-primary",   groupHover: "group-hover:text-primary" },
  Backend:             { accent: "text-secondary", dot: "bg-secondary", groupHover: "group-hover:text-secondary" },
  Career:              { accent: "text-primary",   dot: "bg-primary",   groupHover: "group-hover:text-primary" },
  "Engineering Notes": { accent: "text-tertiary",  dot: "bg-tertiary",  groupHover: "group-hover:text-tertiary" },
  Networking:          { accent: "text-secondary", dot: "bg-secondary", groupHover: "group-hover:text-secondary" },
  AI:                  { accent: "text-primary", dot: "bg-primary", groupHover: "group-hover:text-primary" },
} as const;

export type Category = keyof typeof categories;
