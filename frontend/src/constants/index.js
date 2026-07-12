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
