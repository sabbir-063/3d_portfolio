interface AnimatedBlobProps {
  color: string;
  size?: string;
  position: string;
  duration?: number;
  delay?: number;
}

export default function AnimatedBlob({
  color,
  size = "w-[350px] h-[350px]",
  position,
  duration = 10,
  delay = 0,
}: AnimatedBlobProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        willChange: "transform",
      }}
      className={`blob-drift absolute pointer-events-none opacity-20 blur-[70px] z-0 rounded-full transform-gpu ${color} ${size} ${position}`}
    />
  );
}
