import { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function CTASection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="cta-section relative overflow-hidden">
      {/* Gold light beam */}
      <div className="cta-beam absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-32 md:py-48 text-center">
        <p className="text-gold text-xs tracking-[0.35em] uppercase mb-6">
          Limited Production — 250 Units Worldwide
        </p>

        <h2 className="cta-title text-white mb-6">
          Reserve Your<br />
          <span className="gold-gradient-text">Legacy</span>
        </h2>

        <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-lg mx-auto">
          Priority allocation is available for qualifying clients.
          Register your interest and a dedicated MRX specialist will
          contact you within 48 hours.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="cta-input flex-1"
            />
            <button type="submit" className="cta-btn group flex items-center justify-center gap-2">
              <span>Register</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </form>
        ) : (
          <div className="confirmation-card max-w-md mx-auto">
            <div className="text-gold text-3xl mb-3">◈</div>
            <p className="text-white font-semibold mb-1">Registration Confirmed</p>
            <p className="text-gray-400 text-sm">
              Your MRX specialist will be in touch within 48 hours.
            </p>
          </div>
        )}

        <p className="text-gray-600 text-xs mt-6">
          No obligation. By registering you agree to our Privacy Policy.
        </p>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-800/50" />
    </section>
  );
}

export function ScrollHint() {
  return (
    <div className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30">
      <span className="text-gray-500 text-xs tracking-widest uppercase">Scroll</span>
      <ChevronDown size={16} className="text-gold animate-bounce" />
    </div>
  );
}
