import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Database, AlertCircle, X } from 'lucide-react';

import EligibilityForm from '../components/prediction/EligibilityForm';
import RightPanel from '../components/prediction/RightPanel';
import { predictEligibility } from '../services/mlService';
import { ROUTES } from '../constants';
import { fadeInUp, staggerContainer } from '../utils';

// ─── Dismissable error banner ─────────────────────────────────────────────────
function ErrorBanner({ message, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-3 rounded-xl px-4 py-3 bg-[#da1e28]/10 border border-[#da1e28]/30 text-sm text-[#ff8389]"
    >
      <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#da1e28]" aria-hidden="true" />
      <span className="flex-1 leading-relaxed">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 text-[#da1e28]/60 hover:text-[#da1e28] transition-colors"
        aria-label="Dismiss error"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

// ─── EligibilityPage ──────────────────────────────────────────────────────────
/**
 * Hosts the government statistics form and owns the full submission lifecycle:
 *
 *   1. EligibilityForm calls onSubmit(formData) with validated values.
 *   2. This page calls predictEligibility(formData) via the frontend mlService.
 *   3. On success → navigates to /result, passing the full API response as
 *      React Router location state so ResultPage can render it immediately.
 *   4. On failure → surfaces a dismissable error banner; form remains editable.
 */
export default function EligibilityPage() {
  const navigate     = useNavigate();
  const [submitError, setSubmitError] = useState(null);

  const handlePrediction = useCallback(async (formData) => {
    setSubmitError(null);
    // Calls POST /api/predict on the Express backend.
    // The backend handles IAM auth and forwards to IBM AutoAI.
    const result = await predictEligibility(formData);
    // Pass the full response envelope and original form data to ResultPage
    navigate(ROUTES.RESULT, {
      state: { prediction: result, submittedAt: new Date().toISOString(), formData },
    });
  }, [navigate]);

  return (
    <div className="min-h-screen ibm-grid-bg relative">
      {/* Ambient glows */}
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
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0f62fe]/10 border border-[#0f62fe]/25 text-[#4589ff] text-xs font-semibold tracking-widest uppercase">
              <ClipboardList size={12} aria-hidden="true" />
              IBM AutoAI · Scheme Prediction
            </span>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col gap-2 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#f4f4f4] leading-tight">
              Predict Welfare{' '}
              <span className="gradient-text">Scheme Code</span>
            </h1>
            <p className="text-base text-[#8d8d8d] leading-relaxed">
              Enter district-level beneficiary statistics. IBM AutoAI will analyse
              the data and predict the most applicable government welfare scheme code.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {[
              { icon: Database, text: '15 AutoAI input features' },
              { icon: ClipboardList, text: '4 data sections · 0 manual rules' },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5 text-xs text-[#8d8d8d]">
                <Icon size={12} className="text-[#4589ff]" aria-hidden="true" />
                {text}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Error banner ───────────────────────────────────────── */}
        <AnimatePresence>
          {submitError && (
            <div className="mb-6">
              <ErrorBanner
                message={submitError}
                onDismiss={() => setSubmitError(null)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* ── Two-column layout ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 items-start">

          {/* Left: statistics form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <EligibilityForm onSubmit={handlePrediction} />
          </motion.div>

          {/* Right: information panel (sticky on desktop) */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-5">
            <RightPanel />
          </div>
        </div>

      </div>
    </div>
  );
}
