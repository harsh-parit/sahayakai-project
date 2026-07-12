// ─── Route paths ───────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  ELIGIBILITY: '/eligibility',
  RESULT: '/result',
  ASSISTANT: '/assistant',
  DASHBOARD: '/dashboard',
  ABOUT: '/about',
};

// ─── Navigation links ──────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'Eligibility Checker', path: ROUTES.ELIGIBILITY },
  { label: 'AI Assistant', path: ROUTES.ASSISTANT },
  { label: 'Analytics', path: ROUTES.DASHBOARD },
  { label: 'About', path: ROUTES.ABOUT },
];

// ─── Feature cards ─────────────────────────────────────────────────────────────
export const FEATURES = [
  {
    id: 'autoai',
    icon: 'Brain',
    title: 'IBM AutoAI Prediction',
    description:
      'Leverages IBM AutoAI to automatically build, train, and deploy machine learning pipelines for accurate welfare eligibility scoring.',
    color: 'blue',
    tag: 'Machine Learning',
  },
  {
    id: 'watsonx',
    icon: 'MessageSquare',
    title: 'Watsonx.ai Explanation',
    description:
      'Uses IBM Watsonx generative AI to provide clear, explainable natural-language summaries of every eligibility decision.',
    color: 'purple',
    tag: 'Generative AI',
  },
  {
    id: 'orchestrate',
    icon: 'GitBranch',
    title: 'IBM Orchestrate Workflow',
    description:
      'Automates end-to-end case management workflows using IBM Orchestrate, routing approved applications to the right officials instantly.',
    color: 'cyan',
    tag: 'Automation',
  },
  {
    id: 'analytics',
    icon: 'BarChart3',
    title: 'Analytics Dashboard',
    description:
      'Real-time interactive dashboards powered by Recharts give administrators deep visibility into application trends and outcomes.',
    color: 'green',
    tag: 'Analytics',
  },
  {
    id: 'prediction',
    icon: 'Target',
    title: 'Eligibility Prediction',
    description:
      'Multi-factor scoring model evaluates income, household size, age, employment status, and regional factors simultaneously.',
    color: 'orange',
    tag: 'Prediction Engine',
  },
  {
    id: 'cloud',
    icon: 'Cloud',
    title: 'IBM Cloud Deployment',
    description:
      'Fully containerised on IBM Cloud with enterprise-grade security, 99.9% uptime SLA, and global CDN delivery.',
    color: 'indigo',
    tag: 'Cloud Infrastructure',
  },
];

// ─── How it works steps ────────────────────────────────────────────────────────
export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Enter Applicant Details',
    description:
      'Fill in the structured eligibility form with personal, income, household, and regional information.',
    icon: 'ClipboardList',
  },
  {
    step: 2,
    title: 'IBM AutoAI Prediction',
    description:
      'AutoAI processes 20+ features through an optimised ML pipeline to generate an eligibility score.',
    icon: 'Brain',
  },
  {
    step: 3,
    title: 'Watsonx AI Explanation',
    description:
      'Watsonx.ai produces a plain-language explanation of the score and the key factors that influenced it.',
    icon: 'Sparkles',
  },
  {
    step: 4,
    title: 'IBM Orchestrate Workflow',
    description:
      'Approved cases are automatically routed to the relevant government department via IBM Orchestrate.',
    icon: 'GitBranch',
  },
  {
    step: 5,
    title: 'Eligibility Report',
    description:
      'A comprehensive, downloadable PDF report is generated for the applicant and the reviewing officer.',
    icon: 'FileCheck',
  },
];

// ─── Technology stack ──────────────────────────────────────────────────────────
export const TECH_STACK = [
  { name: 'React 19', category: 'Frontend', color: '#61dafb' },
  { name: 'Vite', category: 'Build Tool', color: '#646cff' },
  { name: 'Tailwind CSS v4', category: 'Styling', color: '#38bdf8' },
  { name: 'Framer Motion', category: 'Animation', color: '#ff0055' },
  { name: 'IBM AutoAI', category: 'Machine Learning', color: '#0f62fe' },
  { name: 'Watsonx.ai', category: 'Generative AI', color: '#8a3ffc' },
  { name: 'IBM Orchestrate', category: 'Automation', color: '#0072c3' },
  { name: 'IBM Cloud', category: 'Infrastructure', color: '#1192e8' },
  { name: 'Recharts', category: 'Data Viz', color: '#22c55e' },
  { name: 'Python / Flask', category: 'Backend', color: '#fbbf24' },
];

// ─── Stats ─────────────────────────────────────────────────────────────────────
export const STATS = [
  { value: '95%', label: 'Prediction Accuracy', icon: 'Target' },
  { value: '< 2s', label: 'Response Time', icon: 'Zap' },
  { value: '10K+', label: 'Applications Processed', icon: 'Users' },
  { value: '99.9%', label: 'Uptime SLA', icon: 'Shield' },
];

// ─── Benefits ──────────────────────────────────────────────────────────────────
export const BENEFITS = [
  {
    icon: 'Clock',
    title: 'Reduce Processing Time',
    description: '10× faster than manual review — decisions in under 2 seconds.',
  },
  {
    icon: 'Shield',
    title: 'Eliminate Human Bias',
    description: 'Consistent, data-driven decisions that treat every applicant equally.',
  },
  {
    icon: 'TrendingUp',
    title: 'Improve Accuracy',
    description: 'AI-powered scoring outperforms traditional rule-based eligibility systems.',
  },
  {
    icon: 'Users',
    title: 'Scale Effortlessly',
    description: 'Handle thousands of simultaneous applications on IBM Cloud infrastructure.',
  },
];

// ─── IBM Technologies used in footer ──────────────────────────────────────────
export const IBM_TECHNOLOGIES = [
  'Watsonx.ai',
  'IBM AutoAI',
  'IBM Orchestrate',
  'IBM Cloud',
];

// ─── About page — project timeline ────────────────────────────────────────────
export const PROJECT_TIMELINE = [
  { phase: 'Phase 1', title: 'Data & ML Pipeline', status: 'complete' },
  { phase: 'Phase 2', title: 'React Frontend', status: 'complete' },
  { phase: 'Phase 3', title: 'Watsonx Integration', status: 'in-progress' },
  { phase: 'Phase 4', title: 'IBM Orchestrate Automation', status: 'upcoming' },
  { phase: 'Phase 5', title: 'Production Deployment', status: 'upcoming' },
];

// ─── About page — future scope ────────────────────────────────────────────────
export const FUTURE_SCOPE = [
  'Multi-language support (Hindi, Tamil, Telugu, Bengali)',
  'Mobile application (React Native)',
  'Offline-first PWA with IndexedDB caching',
  'Integration with Aadhaar / DigiLocker APIs',
  'Federated learning for privacy-preserving model training',
  'Real-time push notifications via IBM Event Streams',
];

// ─── Eligibility Form — dropdown options ──────────────────────────────────────

export const GENDER_OPTIONS = [
  { value: 'male',   label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other',  label: 'Other / Prefer not to say' },
];

export const MARITAL_STATUS_OPTIONS = [
  { value: 'single',   label: 'Single / Unmarried' },
  { value: 'married',  label: 'Married' },
  { value: 'widowed',  label: 'Widowed' },
  { value: 'divorced', label: 'Divorced / Separated' },
];

export const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'obc',     label: 'OBC (Other Backward Class)' },
  { value: 'sc',      label: 'SC (Scheduled Caste)' },
  { value: 'st',      label: 'ST (Scheduled Tribe)' },
  { value: 'ews',     label: 'EWS (Economically Weaker Section)' },
];

export const OCCUPATION_OPTIONS = [
  { value: 'unemployed',        label: 'Unemployed' },
  { value: 'daily_wage',        label: 'Daily Wage Worker' },
  { value: 'self_employed',     label: 'Self-Employed' },
  { value: 'farmer',            label: 'Farmer / Agricultural Worker' },
  { value: 'private_sector',    label: 'Private Sector Employee' },
  { value: 'government',        label: 'Government Employee' },
  { value: 'retired',           label: 'Retired' },
  { value: 'student',           label: 'Student' },
  { value: 'homemaker',         label: 'Homemaker' },
];

export const STATE_OPTIONS = [
  { value: 'andhra_pradesh',    label: 'Andhra Pradesh' },
  { value: 'assam',             label: 'Assam' },
  { value: 'bihar',             label: 'Bihar' },
  { value: 'chhattisgarh',      label: 'Chhattisgarh' },
  { value: 'gujarat',           label: 'Gujarat' },
  { value: 'haryana',           label: 'Haryana' },
  { value: 'himachal_pradesh',  label: 'Himachal Pradesh' },
  { value: 'jharkhand',         label: 'Jharkhand' },
  { value: 'karnataka',         label: 'Karnataka' },
  { value: 'kerala',            label: 'Kerala' },
  { value: 'madhya_pradesh',    label: 'Madhya Pradesh' },
  { value: 'maharashtra',       label: 'Maharashtra' },
  { value: 'manipur',           label: 'Manipur' },
  { value: 'meghalaya',         label: 'Meghalaya' },
  { value: 'odisha',            label: 'Odisha' },
  { value: 'punjab',            label: 'Punjab' },
  { value: 'rajasthan',         label: 'Rajasthan' },
  { value: 'tamil_nadu',        label: 'Tamil Nadu' },
  { value: 'telangana',         label: 'Telangana' },
  { value: 'uttar_pradesh',     label: 'Uttar Pradesh' },
  { value: 'uttarakhand',       label: 'Uttarakhand' },
  { value: 'west_bengal',       label: 'West Bengal' },
  { value: 'delhi',             label: 'Delhi (NCT)' },
];

export const BPL_OPTIONS = [
  { value: 'yes', label: 'Yes — holds BPL card' },
  { value: 'no',  label: 'No — above poverty line' },
];

export const YES_NO_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no',  label: 'No' },
];

// Initial empty form state — single source of truth for EligibilityForm
export const INITIAL_FORM_STATE = {
  // Personal
  applicantName: '',
  age: '',
  gender: '',
  maritalStatus: '',
  category: '',
  occupation: '',
  // Location
  state: '',
  district: '',
  // Economic
  annualIncome: '',
  bplStatus: '',
  // Social
  disabilityStatus: '',
  widowStatus: '',
  aadhaarAvailable: '',
  bankAccountAvailable: '',
};

// Supported welfare schemes displayed in the right panel
export const SUPPORTED_SCHEMES = [
  { name: 'PM Kisan Samman Nidhi',  domain: 'Agriculture' },
  { name: 'PMAY – Gramin',          domain: 'Housing' },
  { name: 'PMEGP',                  domain: 'Employment' },
  { name: 'Antyodaya Anna Yojana',  domain: 'Food Security' },
  { name: 'NSAP – IGNOAPS',         domain: 'Social Security' },
  { name: 'Ayushman Bharat – PMJAY',domain: 'Healthcare' },
  { name: 'Pradhan Mantri Awas',    domain: 'Urban Housing' },
  { name: 'Ujjwala Yojana',         domain: 'Energy' },
];

// Prediction pipeline steps shown in the right panel
export const PREDICTION_PIPELINE = [
  {
    id: 'autoai',
    label: 'IBM AutoAI',
    detail: 'Automated ML pipeline selects the best model from 20+ algorithms.',
    color: '#0f62fe',
  },
  {
    id: 'watsonx',
    label: 'Watsonx.ai',
    detail: 'Generative AI produces a plain-language decision explanation.',
    color: '#8a3ffc',
  },
  {
    id: 'orchestrate',
    label: 'IBM Orchestrate',
    detail: 'Approved cases are routed to the appropriate department workflow.',
    color: '#1192e8',
  },
  {
    id: 'confidence',
    label: 'Confidence Score',
    detail: 'Model certainty rating (0–100) accompanies every eligibility result.',
    color: '#42be65',
  },
];

// Required documents advisory shown in the right panel
export const REQUIRED_DOCUMENTS = [
  'Aadhaar Card / UID',
  'Income Certificate (issued by SDM / Tehsildar)',
  'Caste Certificate (for SC / ST / OBC applicants)',
  'BPL Ration Card (if applicable)',
  'Bank Passbook (first page)',
  'Disability Certificate (if applicable)',
  'Land / Property records (if applicable)',
];
