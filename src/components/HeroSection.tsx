import { useEffect, useRef } from 'react';

interface HeroSectionProps {
  scrollProgress: number;
}

export default function HeroSection({ scrollProgress }: HeroSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = scrollProgress;
    if (titleRef.current) {
      titleRef.current.style.transform = `translateY(${t * -60}px)`;
      titleRef.current.style.opacity = String(Math.max(0, 1 - t * 3));
    }
    if (subtitleRef.current) {
      subtitleRef.current.style.transform = `translateY(${t * -40}px)`;
      subtitleRef.current.style.opacity = String(Math.max(0, 1 - t * 3));
    }
    if (badgeRef.current) {
      badgeRef.current.style.opacity = String(Math.max(0, 1 - t * 4));
    }
  }, [scrollProgress]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
      <div ref={badgeRef} className="hero-badge mb-6">
        <span className="text-gold text-xs tracking-[0.3em] uppercase font-medium">
          The New Standard
        </span>
      </div>

      <h1
        ref={titleRef}
        className="hero-title text-center select-none"
        style={{ transition: 'none' }}
      >
        <span className="block text-white tracking-tight leading-none">
          MRX
        </span>
        <span className="block gold-gradient-text tracking-[0.25em] text-2xl md:text-4xl lg:text-5xl font-light mt-2">
          APEX SERIES
        </span>
      </h1>

      <p
        ref={subtitleRef}
        className="hero-subtitle text-center mt-6 max-w-lg"
        style={{ transition: 'none' }}
      >
        Where precision engineering meets raw, untamed power.
        <br />
        Born on the track. Built for the road.
      </p>

      <div
        ref={subtitleRef}
        className="mt-10 flex gap-4 pointer-events-auto"
        style={{ transition: 'none' }}
      />
    </div>
  );
}
