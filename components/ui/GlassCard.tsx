import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: string;
}

export default function GlassCard({
  children,
  className = "",
  hover = false,
  padding = "p-6 md:p-8",
}: GlassCardProps) {
  return (
    <div
      className={`glass-panel rounded-2xl ${padding} ${
        hover ? "glass-card-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
