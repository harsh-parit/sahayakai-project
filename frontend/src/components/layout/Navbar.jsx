import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, Brain } from 'lucide-react';
import { NAV_LINKS } from '../../constants';
import { cn } from '../../utils';

/**
 * Professional sticky Navbar with blur background, mobile hamburger menu,
 * and active route highlighting.
 */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Detect scroll to apply stronger backdrop */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on resize to desktop */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navbarClass = cn(
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
    scrolled
      ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/20'
      : 'bg-[#0a0a0f]/60 backdrop-blur-md border-b border-transparent'
  );

  return (
    <header className={navbarClass} role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ─────────────────────────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none"
            aria-label="SahayakAI — Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0f62fe] to-[#8a3ffc] flex items-center justify-center shadow-lg shadow-blue-900/40 group-hover:scale-105 transition-transform duration-200">
              <Brain size={16} className="text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-[#f4f4f4]">Sahayak</span>
              <span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* ── Desktop navigation ───────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'text-[#4589ff] bg-[#0f62fe]/10'
                      : 'text-[#c6c6c6] hover:text-[#f4f4f4] hover:bg-white/5'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-lg bg-[#0f62fe]/10 -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── CTA + hamburger ──────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <Link
              to="/eligibility"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#0f62fe] text-white text-sm font-semibold hover:bg-[#0043ce] transition-colors duration-150 shadow-md shadow-blue-900/30"
            >
              <Sparkles size={14} aria-hidden="true" />
              Check Eligibility
            </Link>

            {/* Hamburger */}
            <button
              type="button"
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#c6c6c6] hover:text-[#f4f4f4] hover:bg-white/8 transition-colors duration-150"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/8"
          >
            <nav className="px-4 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150',
                      isActive
                        ? 'text-[#4589ff] bg-[#0f62fe]/10'
                        : 'text-[#c6c6c6] hover:text-[#f4f4f4] hover:bg-white/5'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <Link
                to="/eligibility"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-[#0f62fe] text-white text-sm font-semibold hover:bg-[#0043ce] transition-colors duration-150"
              >
                <Sparkles size={14} aria-hidden="true" />
                Check Eligibility
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
