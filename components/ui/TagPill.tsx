interface TagPillProps {
  label: string;
  colorClass?: string;       // e.g. "text-primary"
  borderClass?: string;      // e.g. "border-primary/20"
  size?: "sm" | "xs";
}

export default function TagPill({
  label,
  colorClass = "text-on-surface-variant",
  borderClass = "border-black/[0.08] dark:border-white/10",
  size = "xs",
}: TagPillProps) {
  const textSize = size === "xs" ? "text-[10px]" : "text-xs";

  return (
    <span
      className={`${textSize} font-bold font-label uppercase tracking-wider px-2.5 py-1 glass-panel rounded-full border ${borderClass} ${colorClass}`}
    >
      {label}
    </span>
  );
}
