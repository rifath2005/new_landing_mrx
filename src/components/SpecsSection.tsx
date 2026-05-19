import { useEffect, useRef } from 'react';

const specs = [
  { label: 'Engine', value: '5.2L Flat-Plane V8' },
  { label: 'Output', value: '760 BHP / 590 LB-FT' },
  { label: '0–60 mph', value: '2.9 sec' },
  { label: 'Top Speed', value: '211 mph' },
  { label: 'Transmission', value: '7-Speed PDK' },
  { label: 'Kerb Weight', value: '1,412 kg' },
  { label: 'Downforce', value: '340 lbs @ 150 mph' },
  { label: 'Redline', value: '8,250 rpm' },
];

export default function SpecsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const items = containerRef.current?.querySelectorAll('.spec-item');
            items?.forEach((item, i) => {
              setTimeout(() => {
                (item as HTMLElement).style.opacity = '1';
                (item as HTMLElement).style.transform = 'translateY(0)';
              }, i * 80);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="specs-section relative overflow-hidden">
      <div className="specs-bg-pattern absolute inset-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="text-center mb-16">
          <p className="text-gold text-xs tracking-[0.35em] uppercase mb-4">
            Technical Excellence
          </p>
          <h2 className="specs-title text-white">
            The Numbers<br />
            <span className="gold-gradient-text">Speak Volumes</span>
          </h2>
        </div>

        <div
          ref={containerRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-800/30"
        >
          {specs.map((spec, i) => (
            <div
              key={i}
              className="spec-item bg-black/80 p-6 md:p-8"
              style={{
                opacity: 0,
                transform: 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              <p className="text-gray-500 text-xs tracking-widest uppercase mb-3">
                {spec.label}
              </p>
              <p className="spec-value gold-gradient-text">
                {spec.value}
              </p>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '◈',
              title: 'Track Mode',
              desc: 'Adaptive suspension firms to race settings. Launch control, torque vectoring, and ABS tuned for circuit performance.',
            },
            {
              icon: '◇',
              title: 'Carbon Ceramic',
              desc: 'Six-piston Brembo calipers with carbon-ceramic rotors provide fade-free stopping from 200mph, lap after lap.',
            },
            {
              icon: '◉',
              title: 'Aeroshell',
              desc: 'Active rear spoiler deploys at 80mph, adding 120lbs of downforce. Folds flush under 80 for a clean silhouette.',
            },
          ].map((feat, i) => (
            <div key={i} className="feature-card group">
              <span className="feature-icon text-gold text-2xl mb-4 block">
                {feat.icon}
              </span>
              <h3 className="text-white text-lg font-semibold mb-3 group-hover:text-gold transition-colors duration-300">
                {feat.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
