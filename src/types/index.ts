// Core data model interfaces for the portfolio website

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tagline?: string;
  video?: {
    src: string;
    poster: string;
    width: number;
    height: number;
    duration: number;
    description: string;
    captionsSrc?: string;
  };
  caseStudy?: { heading: string; paragraphs: string[] }[];
  /** Primary responsibility on the project */
  role?: string;
  /** Problem or context (1–2 sentences) */
  problem?: string;
  /** Approach / what you built */
  solution?: string;
  /** Observable outcomes or scope (no invented metrics) */
  outcomes?: string[];
  technologies: string[];
  category: "web" | "mobile" | "desktop" | "other";
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  completedAt: Date;
}

export interface Achievement {
  description: string;
  impact?: string;
  metrics?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  achievements: Achievement[];
  technologies: string[];
  logo?: string;
}

export interface Skill {
  name: string;
  category: string;
  icon?: string;
}

export interface SkillCategory {
  name: string;
  items: Skill[];
}

export interface TechnicalSkills {
  languages: SkillCategory;
  frameworks: SkillCategory;
  cloudInfra: SkillCategory;
  databases: SkillCategory;
  tools: SkillCategory;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: Date;
  endDate: Date;
  description: string;
  achievements?: string[];
  logo?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  summary: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  credentialId: string;
  logo?: string;
}

// Additional utility types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
