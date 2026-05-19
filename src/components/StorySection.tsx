import { useEffect, useRef } from 'react';

interface StorySectionProps {
  scrollProgress: number;
}

interface StorySlide {
  phase: [number, number];
  tag: string;
  title: string;
  body: string;
  stat: { value: string; label: string };
  align: 'left' | 'right';
}

const slides: StorySlide[] = [
  {
    phase: [0.18, 0.42],
    tag: '01 — Aerodynamics',
    title: 'Sculpted by\nthe Wind',
    body: 'Every contour of the MRX Apex is the result of 4,000 hours in the wind tunnel. The aggressive fastback profile generates 340lbs of downforce at 150mph, keeping all four corners planted.',
    stat: { value: '340', label: 'lbs downforce' },
    align: 'left',
  },
  {
    phase: [0.42, 0.68],
    tag: '02 — Powertrain',
    title: 'Fury\nUnleashed',
    body: 'The hand-built 5.2L flat-plane V8 screams to 8,250rpm, producing 760bhp and 590lb-ft of torque. Zero to sixty arrives in 2.9 seconds. The quarter mile in 10.6.',
    stat: { value: '760', label: 'bhp' },
    align: 'right',
  },
  {
    phase: [0.68, 0.92],
    tag: '03 — Craftsmanship',
    title: 'Art in\nMotion',
    body: 'Hand-stitched Nappa leather, carbon fibre trim, and a machined aluminium gear selector. Every MRX Apex is assembled by a single master craftsman who signs the build plate.',
    stat: { value: '47', label: 'days to build' },
    align: 'left',
  },
];

export default function StorySection({ scrollProgress }: StorySectionProps) {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    slides.forEach((slide, i) => {
      const el = slideRefs.current[i];
      if (!el) return;

      const [start, end] = slide.phase;
      const midpoint = (start + end) / 2;
      const fadeIn = 0.06;
      const fadeOut = 0.06;

      let opacity = 0;
      let translateY = 30;

      if (scrollProgress >= start && scrollProgress < start + fadeIn) {
        const p = (scrollProgress - start) / fadeIn;
        opacity = p;
        translateY = 30 * (1 - p);
      } else if (scrollProgress >= start + fadeIn && scrollProgress < end - fadeOut) {
        opacity = 1;
        translateY = 0;
      } else if (scrollProgress >= end - fadeOut && scrollProgress < end) {
        const p = (scrollProgress - (end - fadeOut)) / fadeOut;
        opacity = 1 - p;
        translateY = -20 * p;
      }

      el.style.opacity = String(opacity);
      el.style.transform = `translateY(${translateY}px)`;
      el.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';

      // Highlight active slide
      el.style.visibility = opacity < 0.01 ? 'hidden' : 'visible';

      // Progress bar
      const bar = el.querySelector('.story-progress-bar') as HTMLDivElement;
      if (bar) {
        const range = end - start;
        const clampedP = Math.max(0, Math.min(1, (scrollProgress - start) / range));
        bar.style.width = `${clampedP * 100}%`;
      }
    });
  }, [scrollProgress]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {slides.map((slide, i) => (
        <div
          key={i}
          ref={(el) => { slideRefs.current[i] = el; }}
          className={`story-slide absolute top-1/2 -translate-y-1/2 ${
            slide.align === 'left' ? 'left-8 md:left-16 lg:left-24' : 'right-8 md:right-16 lg:right-24'
          } max-w-xs md:max-w-sm`}
          style={{ opacity: 0, visibility: 'hidden', transition: 'opacity 0.15s, transform 0.15s' }}
        >
          <div className="story-card">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">
                {slide.tag}
              </span>
            </div>

            <h2 className="story-heading text-white mb-4">
              {slide.title.split('\n').map((line, j) => (
                <span key={j} className="block">{line}</span>
              ))}
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {slide.body}
            </p>

            <div className="story-stat mb-6">
              <span className="stat-value gold-gradient-text">{slide.stat.value}</span>
              <span className="stat-label text-gray-500 text-xs uppercase tracking-widest ml-2">
                {slide.stat.label}
              </span>
            </div>

            <div className="story-progress-track">
              <div className="story-progress-bar" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
