// Application constants.
//
// Design tokens are NOT duplicated here — colors, typography, spacing,
// breakpoints and radii live in the @theme block in globals.css, which is the
// single source Tailwind generates utilities from. The COLORS/TYPOGRAPHY/
// SPACING/BREAKPOINTS/DURATIONS/PERFORMANCE groups that used to sit here were
// hardcoded copies with no callers.

export const NAVIGATION_ITEMS = [
  { id: "hero", label: "Home", href: "#hero" },
  { id: "work", label: "Work", href: "#work", path: "/projects" },
  { id: "about", label: "About", href: "#about" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "contact", label: "Contact", href: "#contact" },
] as const;

/** Single source of truth for the contact address. */
export const CONTACT_EMAIL = "cjingfeng98@gmail.com";

// Social media links
export const SOCIAL_LINKS = [
  { name: "GitHub", url: "https://github.com/cloudy3", icon: "github" },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/jingfeng-cheah/",
    icon: "linkedin",
  },
  { name: "Email", url: `mailto:${CONTACT_EMAIL}`, icon: "email" },
] as const;

// Project categories
export const PROJECT_CATEGORIES = [
  "all",
  "web",
  "mobile",
  "desktop",
  "other",
] as const;

// Contact form validation
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  minNameLength: 2,
  maxNameLength: 50,
  minMessageLength: 10,
  maxMessageLength: 1000,
} as const;
