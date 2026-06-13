import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";
import HeroDecorations from "./HeroDecorations";
import ScrollBridge from "./ScrollBridge";
import { AnimatedBlob } from "@/components/ui";

export default function Hero() {
  return (
    <section
      id="Home"
      className="min-h-screen flex flex-col px-6 md:px-16 lg:px-24 pt-28 pb-20 relative overflow-hidden"
    >
      <AnimatedBlob color="bg-primary" size="w-[500px] h-[500px]" position="-top-[10%] -left-[5%]" duration={12} />
      <AnimatedBlob color="bg-secondary" size="w-[300px] h-[300px]" position="bottom-[10%] right-[5%]" duration={9} delay={2} />
      <HeroDecorations />

      {/* Main hero content — grows to fill available space */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 flex-1">
        <HeroContent />
        <HeroImage />
      </div>

      {/* Scroll indicator — centered at bottom, fades out on scroll */}
      <div className="relative z-20 mt-auto pt-10 flex justify-center">
        <ScrollBridge />
      </div>
    </section>
  );
}
