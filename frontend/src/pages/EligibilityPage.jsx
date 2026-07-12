import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Sparkles, AlertCircle, X } from 'lucide-react';

import EligibilityForm from '../components/prediction/EligibilityForm';
import RightPanel from '../components/prediction/RightPanel';
import { predictEligibility } from '../services/mlService';
import { fadeInUp, staggerContainer } from '../utils';

// ─── Page-level error banner ──────────────────────────────────────────────────

function ErrorBanner({ message, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-3 rounded-xl px-4 py-3 bg-[#da1e28]/10 border border-[#da1e28]/30 text-sm text-[#ff8389]"
    >
      <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#da1e28]" aria-hidden="true" />
      <span className="flex-1 leading-relaxed">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 text-[#da1e28]/70 hover:text-[#da1e28] transition-colors"
        aria-label="Dismiss error"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

// ─── EligibilityPage ──────────────────────────────────────────────────────────

/**
 * EligibilityPage — full welfare eligibility checker page.
 *
 * Layout (desktop):  left 60% = form  |  right 40% = information panel
 * Layout (mobile):   single column — form first, panel below
 *
 * This component owns the submission lifecycle:
 *   1. Receives validated formData from EligibilityForm.onSubmit()
 *   2. Calls predictEligibility() from mlService.js
 *   3. Handles network errors and loading state
 *   4. Will navigate to /result once the backend is connected
 */
export default function EligibilityPage() {
  const [submitError, setSubmitError] = useState(null);

  // Passed down to EligibilityForm as the onSubmit handler.
  // EligibilityForm calls this only after all fields are valid.
  const handlePrediction = useCallback(async (formData) => {
    setSubmitError(null);
    // predictEligibility() is architecturally ready — the POST will fire
    // once VITE_API_BASE_URL is configured and the Flask backend is deployed.
    await predictEligibility(formData);
    // On success: navigate to /result with prediction data (wired later)
    // navigate(ROUTES.RESULT, { state: { prediction: result } });
  }, []);

  return (
    <div className="min-h-screen ibm-grid-bg relative">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-[#0f62fe]/6 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#8a3ffc]/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* ── Page header ────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4 mb-10"
        >
          {/* Breadcrumb-style badge */}
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0f62fe]/10 border border-[#0f62fe]/25 text-[#4589ff] text-xs font-semibold tracking-widest uppercase">
              <ClipboardList size={12} aria-hidden="true" />
              Welfare Eligibility Checker
            </span>
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-2 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#f4f4f4] leading-tight">
              Check Eligibility with{' '}
              <span className="gradient-text">IBM AutoAI</span>
            </h1>
            <p className="text-base text-[#8d8d8d] leading-relaxed">
              Fill in the applicant's details below. The form data will be scored by
              IBM AutoAI and explained by Watsonx.ai in under 2 seconds.
            </p>
          </motion.div>

          {/* Info strip */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
          >
            {[
              { icon: Sparkles, text: 'Powered by IBM AutoAI' },
              { icon: ClipboardList, text: '14 data points · 4 sections' },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5 text-xs text-[#8d8d8d]">
                <Icon size={12} className="text-[#4589ff]" aria-hidden="true" />
                {text}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Error banner ───────────────────────────────────────── */}
        {submitError && (
          <div className="mb-6">
            <ErrorBanner
              message={submitError}
              onDismiss={() => setSubmitError(null)}
            />
          </div>
        )}

        {/* ── Two-column layout ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 items-start">

          {/* Left: form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <EligibilityForm onSubmit={handlePrediction} />
          </motion.div>

          {/* Right: information panel */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-5">
            <RightPanel />
          </div>
        </div>

      </div>
    </div>
  );
}
