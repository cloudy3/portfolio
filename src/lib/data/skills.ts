import { TechnicalSkills } from "@/types";

export const TECHNICAL_SKILLS: TechnicalSkills = {
  languages: {
    name: "Programming Languages",
    items: [
      {
        name: "Dart",
        category: "mobile",
        icon: "🎯",
      },
      {
        name: "Python",
        category: "backend",
        icon: "🐍",
      },
      {
        name: "JavaScript/TypeScript",
        category: "frontend",
        icon: "📘",
      },
      {
        name: "Java",
        category: "backend",
        icon: "☕",
      },
      {
        name: "C/C++",
        category: "systems",
        icon: "⚡",
      },
      {
        name: "SQL",
        category: "database",
        icon: "🗃️",
      },
    ],
  },
  frameworks: {
    name: "Frameworks & Libraries",
    items: [
      {
        name: "Flutter",
        category: "mobile",
        icon: "📱",
      },
      {
        name: "React",
        category: "frontend",
        icon: "⚛️",
      },
      {
        name: "Next.js",
        category: "frontend",
        icon: "▲",
      },
      {
        name: "Angular",
        category: "frontend",
        icon: "🅰️",
      },
      {
        name: "Node.js",
        category: "backend",
        icon: "🟢",
      },
      {
        name: "Flask",
        category: "backend",
        icon: "🌶️",
      },
      {
        name: "Django",
        category: "backend",
        icon: "🎸",
      },
    ],
  },
  cloudInfra: {
    name: "Cloud & Infrastructure",
    items: [
      {
        name: "Google Cloud Platform",
        category: "cloud",
        icon: "☁️",
      },
      {
        name: "Cloud Run",
        category: "cloud",
        icon: "🏃",
      },
      {
        name: "Cloud Functions",
        category: "cloud",
        icon: "⚡",
      },
      {
        name: "Compute Engine",
        category: "cloud",
        icon: "🖥️",
      },
      {
        name: "Firebase",
        category: "cloud",
        icon: "🔥",
      },
      {
        name: "Firestore",
        category: "database",
        icon: "🗄️",
      },
      {
        name: "Docker",
        category: "devops",
        icon: "🐳",
      },
      {
        name: "GitLab CI",
        category: "devops",
        icon: "🦊",
      },
    ],
  },
  databases: {
    name: "Databases",
    items: [
      {
        name: "PostgreSQL",
        category: "database",
        icon: "🐘",
      },
      {
        name: "MySQL",
        category: "database",
        icon: "🐬",
      },
      {
        name: "Hive (local DB)",
        category: "database",
        icon: "🍯",
      },
    ],
  },
  tools: {
    name: "Tools & Technologies",
    items: [
      {
        name: "Git",
        category: "devops",
        icon: "📝",
      },
      {
        name: "Figma",
        category: "design",
        icon: "🎨",
      },
      {
        name: "GetX",
        category: "mobile",
        icon: "🧩",
      },
      {
        name: "Agile/Scrum",
        category: "methodology",
        icon: "🔄",
      },
    ],
  },
};

// Utility functions for skills data
export const getSkillsByCategory = (categoryName: string) => {
  const categories = Object.values(TECHNICAL_SKILLS);
  const category = categories.find((cat) => cat.name === categoryName);
  return category ? category.items : [];
};

export const getAllSkillCategories = () => {
  return Object.values(TECHNICAL_SKILLS).map((category) => category.name);
};

// Flattened skills array for section lists
export const SKILLS_DATA = Object.values(TECHNICAL_SKILLS).flatMap(
  (category) => category.items
);
