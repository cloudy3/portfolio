// Design constants and configuration values

/** Semantic palette — mirrors CSS variables in globals.css */
export const COLORS = {
  surface: {
    page: "#faf8f5",
    subtle: "#f3f1ed",
    elevated: "#ffffff",
    inverse: "#161618",
  },
  accent: {
    cyan: "#06b6d4",
    blue: "#2563eb",
    lime: "#84cc16",
    violet: "#7c3aed",
  },
  text: {
    primary: "#1a1a1c",
    secondary: "#4a4a52",
    muted: "#6b6b76",
  },
  success: "#16a34a",
  error: "#dc2626",
  warning: "#ca8a04",
  info: "#0891b2",
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    sans: ["var(--font-sans)", "system-ui", "sans-serif"],
    mono: ["var(--font-mono)", "ui-monospace", "monospace"],
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
} as const;

// Spacing scale
export const SPACING = {
  xs: "0.5rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "3rem",
  "2xl": "4rem",
  "3xl": "6rem",
  "4xl": "8rem",
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Z-index scale
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
} as const;

// Animation durations
export const DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 750,
} as const;

export const NAVIGATION_ITEMS = [
  { id: "hero", label: "Home", href: "#hero" },
  { id: "work", label: "Work", href: "#work", path: "/projects" },
  { id: "about", label: "About", href: "#about" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "contact", label: "Contact", href: "#contact" },
] as const;

// Social media links
export const SOCIAL_LINKS = [
  { name: "GitHub", url: "https://github.com/cloudy3", icon: "github" },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/jingfeng-cheah/",
    icon: "linkedin",
  },
  { name: "Email", url: "mailto:cjingfeng98@gmail.com", icon: "email" },
] as const;

// Project categories
export const PROJECT_CATEGORIES = [
  "all",
  "web",
  "mobile",
  "desktop",
  "other",
] as const;

// Skill categories
export const SKILL_CATEGORIES = [
  "frontend",
  "backend",
  "tools",
  "design",
  "other",
] as const;

// Performance thresholds
export const PERFORMANCE = {
  loadTime: 3000, // 3 seconds
  responseTime: 200, // 200ms
  imageQuality: 85, // 85% quality for optimized images
} as const;

// Contact form validation
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  minNameLength: 2,
  maxNameLength: 50,
  minMessageLength: 10,
  maxMessageLength: 1000,
} as const;
