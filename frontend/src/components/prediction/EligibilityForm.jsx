import { useState, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, MapPin, Users, Wifi, CheckCircle2 } from 'lucide-react';

import InputField   from './InputField';
import SectionCard  from './SectionCard';
import FormActions  from './FormActions';
import ProgressIndicator from './ProgressIndicator';
import { fadeInUp } from '../../utils';

// ─── Initial form state — mirrors the 15 AutoAI model input fields ────────────
const INITIAL_FORM_STATE = {
  // General Information
  finyear:           '',   // e.g. "2023-24"
  lgdstatecode:      '',   // numeric state code
  statename:         '',   // e.g. "Uttar Pradesh"
  lgddistrictcode:   '',   // numeric district code
  districtname:      '',   // e.g. "Varanasi"
  // Population Statistics
  totalbeneficiaries: '',
  totalmale:          '',
  totalfemale:        '',
  totaltransgender:   '',
  // Social Category
  totalsc:  '',
  totalst:  '',
  totalgen: '',
  totalobc: '',
  // Digital Coverage
  totalaadhaar:      '',
  totalmpbilenumber: '',
};

// ─── Progress step labels ─────────────────────────────────────────────────────
const FORM_STEPS = ['General', 'Population', 'Category', 'Digital'];

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Pure validation — returns a map of fieldName → errorMessage.
 * Empty object = form is valid.
 *
 * @param {typeof INITIAL_FORM_STATE} v
 * @returns {Record<string, string>}
 */
function validate(v) {
  const e = {};

  // ── General Information ────────────────────────────────────────────────────
  if (!v.finyear.trim()) {
    e.finyear = 'Financial year is required (e.g. 2023-24).';
  } else if (!/^\d{4}-\d{2,4}$/.test(v.finyear.trim())) {
    e.finyear = 'Format must be YYYY-YY or YYYY-YYYY (e.g. 2023-24).';
  }

  if (!v.lgdstatecode) {
    e.lgdstatecode = 'State code is required.';
  } else if (isNaN(Number(v.lgdstatecode)) || Number(v.lgdstatecode) < 1) {
    e.lgdstatecode = 'State code must be a positive number.';
  }

  if (!v.statename.trim()) {
    e.statename = 'State name is required.';
  }

  if (!v.lgddistrictcode) {
    e.lgddistrictcode = 'District code is required.';
  } else if (isNaN(Number(v.lgddistrictcode)) || Number(v.lgddistrictcode) < 1) {
    e.lgddistrictcode = 'District code must be a positive number.';
  }

  if (!v.districtname.trim()) {
    e.districtname = 'District name is required.';
  }

  // ── Population Statistics ──────────────────────────────────────────────────
  const popFields = [
    ['totalbeneficiaries', 'Total beneficiaries'],
    ['totalmale',          'Total male'],
    ['totalfemale',        'Total female'],
    ['totaltransgender',   'Total transgender'],
  ];
  for (const [field, label] of popFields) {
    if (v[field] === '' || v[field] === null || v[field] === undefined) {
      e[field] = `${label} is required.`;
    } else if (isNaN(Number(v[field])) || Number(v[field]) < 0) {
      e[field] = `${label} must be a non-negative number.`;
    }
  }

  // ── Social Category ────────────────────────────────────────────────────────
  const catFields = [
    ['totalsc',  'Total SC'],
    ['totalst',  'Total ST'],
    ['totalgen', 'Total General'],
    ['totalobc', 'Total OBC'],
  ];
  for (const [field, label] of catFields) {
    if (v[field] === '' || v[field] === null || v[field] === undefined) {
      e[field] = `${label} is required.`;
    } else if (isNaN(Number(v[field])) || Number(v[field]) < 0) {
      e[field] = `${label} must be a non-negative number.`;
    }
  }

  // ── Digital Coverage ───────────────────────────────────────────────────────
  if (v.totalaadhaar === '' || v.totalaadhaar === null || v.totalaadhaar === undefined) {
    e.totalaadhaar = 'Total Aadhaar count is required.';
  } else if (isNaN(Number(v.totalaadhaar)) || Number(v.totalaadhaar) < 0) {
    e.totalaadhaar = 'Must be a non-negative number.';
  }

  if (v.totalmpbilenumber === '' || v.totalmpbilenumber === null || v.totalmpbilenumber === undefined) {
    e.totalmpbilenumber = 'Total mobile number count is required.';
  } else if (isNaN(Number(v.totalmpbilenumber)) || Number(v.totalmpbilenumber) < 0) {
    e.totalmpbilenumber = 'Must be a non-negative number.';
  }

  return e;
}

// ─── Success overlay ──────────────────────────────────────────────────────────
function SubmissionSuccess({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center gap-6 py-16 text-center"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-[#24a148]/15 border-2 border-[#24a148]/50 flex items-center justify-center"
      >
        <CheckCircle2 size={40} className="text-[#42be65]" aria-hidden="true" />
      </motion.div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-[#f4f4f4]">Prediction Submitted</h3>
        <p className="text-sm text-[#8d8d8d] max-w-sm leading-relaxed">
          The district statistics have been forwarded to IBM AutoAI. Your result
          is loading on the next page.
        </p>
      </div>
      <motion.button
        type="button"
        onClick={onReset}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="h-10 px-6 rounded-xl glass-card text-sm font-semibold text-[#4589ff] hover:border-[#4589ff]/40 transition-colors duration-150"
      >
        Submit Another
      </motion.button>
    </motion.div>
  );
}

// ─── EligibilityForm ──────────────────────────────────────────────────────────
/**
 * Government district statistics form aligned to the IBM AutoAI model.
 *
 * Props:
 *   onSubmit (formData) => Promise<void>
 *     Called with validated raw form values. EligibilityPage owns the
 *     API call and navigation; this component owns only form state.
 */
export default function EligibilityForm({ onSubmit }) {
  const formId = useId();

  const [values,      setValues]      = useState({ ...INITIAL_FORM_STATE });
  const [touched,     setTouched]     = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  const allErrors     = validate(values);
  const visibleErrors = Object.fromEntries(
    Object.entries(allErrors).filter(([k]) => touched[k])
  );

  // Track which section the user is currently in for the progress indicator
  const sectionIndex = (() => {
    if (touched.totalaadhaar   || touched.totalmpbilenumber) return 3;
    if (touched.totalsc        || touched.totalst)           return 2;
    if (touched.totalbeneficiaries || touched.totalmale)     return 1;
    return 0;
  })();

  const handleChange = useCallback((field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleBlur = useCallback((field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleReset = useCallback(() => {
    setValues({ ...INITIAL_FORM_STATE });
    setTouched({});
    setIsSubmitting(false);
    setSubmitted(false);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    if (e?.preventDefault) e.preventDefault();
    // Mark all fields touched to surface any remaining errors
    setTouched(Object.fromEntries(Object.keys(INITIAL_FORM_STATE).map((k) => [k, true])));
    if (Object.keys(validate(values)).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit]);

  // ── Shared field props builder ──────────────────────────────────────────────
  const field = (name, overrides = {}) => ({
    id:       `${formId}-${name}`,
    value:    values[name],
    onChange: handleChange(name),
    onBlur:   handleBlur(name),
    error:    visibleErrors[name],
    required: true,
    ...overrides,
  });

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <form
      id={`${formId}-form`}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Government district eligibility statistics form"
      className="flex flex-col gap-6"
    >
      <ProgressIndicator steps={FORM_STEPS} currentStep={sectionIndex} />

      <AnimatePresence mode="wait">
        {submitted ? (
          <SubmissionSuccess key="success" onReset={handleReset} />
        ) : (
          <motion.div
            key="form-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-5"
          >
            {/* ── Section 1: General Information ──────────────────────── */}
            <SectionCard title="General Information" icon={<CalendarDays size={14} />}>
              <InputField
                {...field('finyear')}
                label="Financial Year"
                placeholder="e.g. 2023-24"
                hint="Format: YYYY-YY (e.g. 2023-24)"
              />
              <InputField
                {...field('lgdstatecode')}
                label="LGD State Code"
                type="number"
                placeholder="e.g. 9"
                hint="Local Government Directory numeric state code"
                min={1}
              />
              <InputField
                {...field('statename')}
                label="State Name"
                placeholder="e.g. Uttar Pradesh"
              />
              <InputField
                {...field('lgddistrictcode')}
                label="LGD District Code"
                type="number"
                placeholder="e.g. 197"
                hint="Local Government Directory numeric district code"
                min={1}
              />
              <InputField
                {...field('districtname')}
                label="District Name"
                placeholder="e.g. Varanasi"
              />
            </SectionCard>

            {/* ── Section 2: Population Statistics ────────────────────── */}
            <SectionCard title="Population Statistics" icon={<Users size={14} />}>
              <InputField
                {...field('totalbeneficiaries')}
                label="Total Beneficiaries"
                type="number"
                placeholder="e.g. 45230"
                min={0}
              />
              <InputField
                {...field('totalmale')}
                label="Total Male"
                type="number"
                placeholder="e.g. 22100"
                min={0}
              />
              <InputField
                {...field('totalfemale')}
                label="Total Female"
                type="number"
                placeholder="e.g. 23000"
                min={0}
              />
              <InputField
                {...field('totaltransgender')}
                label="Total Transgender"
                type="number"
                placeholder="e.g. 130"
                min={0}
              />
            </SectionCard>

            {/* ── Section 3: Social Category ───────────────────────────── */}
            <SectionCard title="Social Category" icon={<MapPin size={14} />}>
              <InputField
                {...field('totalsc')}
                label="Total SC (Scheduled Caste)"
                type="number"
                placeholder="e.g. 8400"
                min={0}
              />
              <InputField
                {...field('totalst')}
                label="Total ST (Scheduled Tribe)"
                type="number"
                placeholder="e.g. 3200"
                min={0}
              />
              <InputField
                {...field('totalgen')}
                label="Total General"
                type="number"
                placeholder="e.g. 22000"
                min={0}
              />
              <InputField
                {...field('totalobc')}
                label="Total OBC (Other Backward Class)"
                type="number"
                placeholder="e.g. 11630"
                min={0}
              />
            </SectionCard>

            {/* ── Section 4: Digital Coverage ──────────────────────────── */}
            <SectionCard title="Digital Coverage" icon={<Wifi size={14} />}>
              <InputField
                {...field('totalaadhaar')}
                label="Total Aadhaar Linked"
                type="number"
                placeholder="e.g. 41000"
                hint="Number of beneficiaries with Aadhaar linkage"
                min={0}
              />
              <InputField
                {...field('totalmpbilenumber')}
                label="Total Mobile Numbers"
                type="number"
                placeholder="e.g. 38500"
                hint="Number of beneficiaries with registered mobile"
                min={0}
              />
            </SectionCard>

            {/* ── Form actions ─────────────────────────────────────────── */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              <FormActions
                onReset={handleReset}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isDisabled={false}
                errorCount={
                  Object.keys(touched).length > 0
                    ? Object.keys(visibleErrors).length
                    : 0
                }
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
