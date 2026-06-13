interface SectionBlobProps {
  color: string;     // e.g. "bg-primary"
  size?: string;     // e.g. "w-[400px] h-[400px]"
  position: string;  // e.g. "-top-20 -right-16"
}

export default function SectionBlob({
  color,
  size = "w-[350px] h-[350px]",
  position,
}: SectionBlobProps) {
  return (
    <div className={`section-bg-blob ${color} ${size} ${position}`} />
  );
}
