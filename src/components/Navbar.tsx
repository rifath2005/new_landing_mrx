import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  scrolled: boolean;
}

const navLinks = ['Experience', 'Performance', 'Craftsmanship', 'Reserve'];

export default function Navbar({ scrolled }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const scrollToSection = (label: string) => {
    const map: Record<string, string> = {
      Experience: '#showcase',
      Performance: '#specs',
      Craftsmanship: '#specs',
      Reserve: '#reserve',
    };
    const id = map[label];
    if (id) document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <nav className={`navbar fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="navbar-logo">
          <span className="text-white font-bold tracking-[0.2em] text-xl">MRX</span>
          <span className="text-gold text-xs tracking-[0.15em] ml-2 hidden sm:inline">MOTORSPORT</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => scrollToSection(link)}
              className="nav-link text-gray-400 text-sm tracking-widest uppercase hover:text-gold transition-colors duration-300"
            >
              {link}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => scrollToSection('Reserve')}
          className="hidden md:flex items-center gap-2 nav-cta-btn text-xs tracking-widest uppercase"
        >
          Configure
        </button>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mobile-menu px-6 pb-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => scrollToSection(link)}
              className="text-gray-400 text-sm tracking-widest uppercase hover:text-gold transition-colors text-left"
            >
              {link}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
