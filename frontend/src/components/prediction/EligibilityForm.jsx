import { useState, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, DollarSign, Users, CheckCircle2 } from 'lucide-react';

import InputField from './InputField';
import SelectField from './SelectField';
import SectionCard from './SectionCard';
import FormActions from './FormActions';
import ProgressIndicator from './ProgressIndicator';

import {
  INITIAL_FORM_STATE,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  CATEGORY_OPTIONS,
  OCCUPATION_OPTIONS,
  STATE_OPTIONS,
  BPL_OPTIONS,
  YES_NO_OPTIONS,
} from '../../constants';

import { fadeInUp } from '../../utils';

// ─── Validation rules ─────────────────────────────────────────────────────────

/**
 * Pure validation function — returns an error messages map.
 * Returns an empty object when the form is fully valid.
 *
 * @param {typeof INITIAL_FORM_STATE} values
 * @param {boolean} checkAll  — when false, only validates touched fields
 * @returns {Record<string, string>}
 */
function validate(values) {
  const errors = {};

  if (!values.applicantName.trim()) {
    errors.applicantName = 'Applicant name is required.';
  } else if (values.applicantName.trim().length < 2) {
    errors.applicantName = 'Name must be at least 2 characters.';
  }

  if (!values.age) {
    errors.age = 'Age is required.';
  } else {
    const age = Number(values.age);
    if (!Number.isInteger(age) || age < 1 || age > 120) {
      errors.age = 'Enter a valid age between 1 and 120.';
    }
  }

  if (!values.gender) {
    errors.gender = 'Please select a gender.';
  }

  if (!values.maritalStatus) {
    errors.maritalStatus = 'Please select marital status.';
  }

  if (!values.category) {
    errors.category = 'Please select a social category.';
  }

  if (!values.occupation) {
    errors.occupation = 'Please select an occupation.';
  }

  if (!values.state) {
    errors.state = 'Please select a state.';
  }

  if (!values.district.trim()) {
    errors.district = 'District / city is required.';
  }

  if (!values.annualIncome) {
    errors.annualIncome = 'Annual income is required.';
  } else {
    const income = Number(values.annualIncome);
    if (isNaN(income) || income < 0) {
      errors.annualIncome = 'Enter a valid income (0 or above).';
    }
  }

  if (!values.bplStatus) {
    errors.bplStatus = 'Please indicate BPL status.';
  }

  if (!values.disabilityStatus) {
    errors.disabilityStatus = 'Please indicate disability status.';
  }

  if (!values.widowStatus) {
    errors.widowStatus = 'Please indicate widow/widower status.';
  }

  if (!values.aadhaarAvailable) {
    errors.aadhaarAvailable = 'Please indicate Aadhaar availability.';
  }

  if (!values.bankAccountAvailable) {
    errors.bankAccountAvailable = 'Please indicate bank account availability.';
  }

  return errors;
}

// ─── Section step labels for the progress indicator ──────────────────────────
const FORM_STEPS = ['Personal', 'Location', 'Economic', 'Social'];

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
        <h3 className="text-xl font-bold text-[#f4f4f4]">
          Prediction Request Submitted
        </h3>
        <p className="text-sm text-[#8d8d8d] max-w-sm leading-relaxed">
          The form data has been prepared and passed to the IBM AutoAI prediction
          service. Results will appear on the Report page once the backend is connected.
        </p>
      </div>

      <motion.button
        type="button"
        onClick={onReset}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="h-10 px-6 rounded-xl glass-card text-sm font-semibold text-[#4589ff] hover:border-[#4589ff]/40 transition-colors duration-150"
      >
        Submit Another Application
      </motion.button>
    </motion.div>
  );
}

// ─── EligibilityForm ──────────────────────────────────────────────────────────

/**
 * EligibilityForm — the full multi-section eligibility form.
 *
 * Props:
 *   onSubmit  (formData: typeof INITIAL_FORM_STATE) => Promise<void>
 *             Called with validated form data. The parent page
 *             (EligibilityPage) owns loading / error state and calls
 *             predictEligibility() from mlService.js.
 */
export default function EligibilityForm({ onSubmit }) {
  const formId = useId();

  // Controlled form values
  const [values, setValues] = useState({ ...INITIAL_FORM_STATE });

  // Track which fields the user has interacted with (for deferred validation)
  const [touched, setTouched] = useState({});

  // Submission lifecycle
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Compute active errors only for touched fields (while pristine)
  const allErrors = validate(values);
  const visibleErrors = Object.fromEntries(
    Object.entries(allErrors).filter(([key]) => touched[key])
  );
  const totalErrorCount = Object.keys(allErrors).length;

  // Derive the currently-focused section from touched fields
  const sectionIndex = (() => {
    if (touched.disabilityStatus || touched.widowStatus) return 3;
    if (touched.annualIncome || touched.bplStatus)        return 2;
    if (touched.state || touched.district)                return 1;
    return 0;
  })();

  // ── Field change handler ─────────────────────────────────────────────────
  const handleChange = useCallback((field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  // ── Blur handler — marks a field as touched ──────────────────────────────
  const handleBlur = useCallback((field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setValues({ ...INITIAL_FORM_STATE });
    setTouched({});
    setIsSubmitting(false);
    setSubmitted(false);
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e) => {
    if (e?.preventDefault) e.preventDefault();

    // Mark all fields touched so errors show
    const allTouched = Object.fromEntries(
      Object.keys(INITIAL_FORM_STATE).map((k) => [k, true])
    );
    setTouched(allTouched);

    // Abort if there are validation errors
    if (Object.keys(validate(values)).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <form
      id={`${formId}-form`}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Welfare eligibility application form"
      className="flex flex-col gap-6"
    >
      {/* Progress indicator */}
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
            {/* ── Section 1: Personal Information ─────────────────── */}
            <SectionCard
              title="Personal Information"
              icon={<User size={14} />}
            >
              <InputField
                id={`${formId}-name`}
                label="Applicant Name"
                placeholder="Full name as per Aadhaar"
                value={values.applicantName}
                onChange={handleChange('applicantName')}
                onBlur={handleBlur('applicantName')}
                error={visibleErrors.applicantName}
                required
              />

              <InputField
                id={`${formId}-age`}
                label="Age"
                type="number"
                placeholder="e.g. 35"
                value={values.age}
                onChange={handleChange('age')}
                onBlur={handleBlur('age')}
                error={visibleErrors.age}
                hint="Must be between 1 and 120"
                required
                min={1}
                max={120}
              />

              <SelectField
                id={`${formId}-gender`}
                label="Gender"
                placeholder="Select gender"
                options={GENDER_OPTIONS}
                value={values.gender}
                onChange={handleChange('gender')}
                onBlur={handleBlur('gender')}
                error={visibleErrors.gender}
                required
              />

              <SelectField
                id={`${formId}-maritalStatus`}
                label="Marital Status"
                placeholder="Select marital status"
                options={MARITAL_STATUS_OPTIONS}
                value={values.maritalStatus}
                onChange={handleChange('maritalStatus')}
                onBlur={handleBlur('maritalStatus')}
                error={visibleErrors.maritalStatus}
                required
              />

              <SelectField
                id={`${formId}-category`}
                label="Social Category"
                placeholder="Select category"
                options={CATEGORY_OPTIONS}
                value={values.category}
                onChange={handleChange('category')}
                onBlur={handleBlur('category')}
                error={visibleErrors.category}
                required
              />

              <SelectField
                id={`${formId}-occupation`}
                label="Occupation"
                placeholder="Select occupation"
                options={OCCUPATION_OPTIONS}
                value={values.occupation}
                onChange={handleChange('occupation')}
                onBlur={handleBlur('occupation')}
                error={visibleErrors.occupation}
                required
              />
            </SectionCard>

            {/* ── Section 2: Location ──────────────────────────────── */}
            <SectionCard
              title="Location"
              icon={<MapPin size={14} />}
            >
              <SelectField
                id={`${formId}-state`}
                label="State"
                placeholder="Select state"
                options={STATE_OPTIONS}
                value={values.state}
                onChange={handleChange('state')}
                onBlur={handleBlur('state')}
                error={visibleErrors.state}
                required
              />

              <InputField
                id={`${formId}-district`}
                label="District / City"
                placeholder="e.g. Varanasi"
                value={values.district}
                onChange={handleChange('district')}
                onBlur={handleBlur('district')}
                error={visibleErrors.district}
                required
              />
            </SectionCard>

            {/* ── Section 3: Economic Information ─────────────────── */}
            <SectionCard
              title="Economic Information"
              icon={<DollarSign size={14} />}
            >
              <InputField
                id={`${formId}-annualIncome`}
                label="Annual Income (₹)"
                type="number"
                placeholder="e.g. 120000"
                value={values.annualIncome}
                onChange={handleChange('annualIncome')}
                onBlur={handleBlur('annualIncome')}
                error={visibleErrors.annualIncome}
                hint="Enter total household income in Indian Rupees"
                required
                min={0}
              />

              <SelectField
                id={`${formId}-bplStatus`}
                label="Below Poverty Line (BPL) Status"
                placeholder="Select BPL status"
                options={BPL_OPTIONS}
                value={values.bplStatus}
                onChange={handleChange('bplStatus')}
                onBlur={handleBlur('bplStatus')}
                error={visibleErrors.bplStatus}
                required
              />
            </SectionCard>

            {/* ── Section 4: Social Information ───────────────────── */}
            <SectionCard
              title="Social Information"
              icon={<Users size={14} />}
            >
              <SelectField
                id={`${formId}-disabilityStatus`}
                label="Person with Disability (PwD)"
                placeholder="Select option"
                options={YES_NO_OPTIONS}
                value={values.disabilityStatus}
                onChange={handleChange('disabilityStatus')}
                onBlur={handleBlur('disabilityStatus')}
                error={visibleErrors.disabilityStatus}
                required
              />

              <SelectField
                id={`${formId}-widowStatus`}
                label="Widow / Widower"
                placeholder="Select option"
                options={YES_NO_OPTIONS}
                value={values.widowStatus}
                onChange={handleChange('widowStatus')}
                onBlur={handleBlur('widowStatus')}
                error={visibleErrors.widowStatus}
                required
              />

              <SelectField
                id={`${formId}-aadhaarAvailable`}
                label="Aadhaar Card Available"
                placeholder="Select option"
                options={YES_NO_OPTIONS}
                value={values.aadhaarAvailable}
                onChange={handleChange('aadhaarAvailable')}
                onBlur={handleBlur('aadhaarAvailable')}
                error={visibleErrors.aadhaarAvailable}
                required
              />

              <SelectField
                id={`${formId}-bankAccountAvailable`}
                label="Bank Account Available"
                placeholder="Select option"
                options={YES_NO_OPTIONS}
                value={values.bankAccountAvailable}
                onChange={handleChange('bankAccountAvailable')}
                onBlur={handleBlur('bankAccountAvailable')}
                error={visibleErrors.bankAccountAvailable}
                hint="Required for DBT (Direct Benefit Transfer)"
                required
              />
            </SectionCard>

            {/* ── Form actions ──────────────────────────────────────── */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              <FormActions
                onReset={handleReset}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isDisabled={false}
                errorCount={Object.keys(touched).length > 0 ? Object.keys(visibleErrors).length : 0}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
