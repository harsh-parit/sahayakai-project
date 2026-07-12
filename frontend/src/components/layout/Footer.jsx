import { Link } from 'react-router-dom';
import { Brain, GitFork, ExternalLink, Heart } from 'lucide-react';
import { IBM_TECHNOLOGIES, NAV_LINKS } from '../../constants';

const currentYear = new Date().getFullYear();

const techLinks = [
  { name: 'IBM AutoAI', href: 'https://www.ibm.com/products/autoai' },
  { name: 'Watsonx.ai', href: 'https://www.ibm.com/watsonx' },
  { name: 'IBM Orchestrate', href: 'https://www.ibm.com/products/ibm-orchestrate' },
  { name: 'IBM Cloud', href: 'https://www.ibm.com/cloud' },
  { name: 'IBM SkillsBuild', href: 'https://skillsbuild.org' },
];

/**
 * Responsive footer with project description, IBM technologies, navigation, and copyright.
 */
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/8 bg-[#0a0a0f]" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* ── Top grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group" aria-label="SahayakAI">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0f62fe] to-[#8a3ffc] flex items-center justify-center">
                <Brain size={16} className="text-white" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-[#f4f4f4]">Sahayak</span>
                <span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-sm text-[#8d8d8d] leading-relaxed max-w-sm">
              Smart AI-powered Welfare Eligibility &amp; Assistance Platform. Built with IBM
              Watsonx.ai, AutoAI, and IBM Orchestrate to bring transparent, explainable AI into
              government welfare systems.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-[#8d8d8d] hover:text-[#f4f4f4] hover:border-white/20 transition-colors duration-150"
                aria-label="GitHub repository"
              >
                <GitFork size={16} />
              </a>
              <span className="text-xs text-[#6f6f6f]">GitHub — Coming Soon</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-[#c6c6c6] tracking-widest uppercase mb-4">Navigation</h3>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-[#8d8d8d] hover:text-[#4589ff] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* IBM Technologies */}
          <div>
            <h3 className="text-xs font-semibold text-[#c6c6c6] tracking-widest uppercase mb-4">IBM Technologies</h3>
            <ul className="flex flex-col gap-2">
              {techLinks.map((t) => (
                <li key={t.name}>
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-[#8d8d8d] hover:text-[#4589ff] transition-colors duration-150"
                  >
                    {t.name}
                    <ExternalLink size={11} className="opacity-60" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Divider ──────────────────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6f6f6f]">
            © {currentYear} SahayakAI. Built during IBM SkillsBuild × Edunet Foundation Internship.
          </p>
          <p className="text-xs text-[#6f6f6f] flex items-center gap-1.5">
            Made with <Heart size={11} className="text-[#da1e28]" aria-hidden="true" /> using React, Vite &amp; IBM AI
          </p>
        </div>
      </div>
    </footer>
  );
}
