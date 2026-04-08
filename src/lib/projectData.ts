import { Project } from "@/types";

export const sampleProjects: Project[] = [
  {
    id: "image-processing-api",
    title: "Cloud-Native Image Processing API",
    description:
      "Python Flask API deployed on Google Cloud Run for large-scale image processing with automated compression.",
    role: "End-to-end API design, cloud deployment, and integrations",
    problem:
      "Teams needed reliable large-scale image handling with efficient storage and smoother bulk uploads from enterprise file sources.",
    solution:
      "Built a Flask API on Cloud Run with automated compression via Firebase Extensions, OneDrive Picker integration for batch uploads, and solid error handling and monitoring.",
    outcomes: [
      "Automated compression pipeline tied to Firebase Extensions",
      "Integrated Microsoft OneDrive Picker for large batch uploads",
      "Streamlined CI/CD and operational monitoring for the service",
    ],
    longDescription:
      "Designed and implemented a Python Flask API deployed on Google Cloud Run for large-scale image processing operations. The system includes automated image compression using Firebase Extensions, resulting in 96% reduction in storage costs. Integrated with Microsoft OneDrive Picker API to accelerate client upload workflows by 60% for large image batches. The API handles long-running tasks efficiently and includes comprehensive error handling and monitoring. Successfully streamlined CI/CD processes and improved overall system performance.",
    technologies: [
      "Python",
      "Flask",
      "Google Cloud Run",
      "Firebase Extensions",
      "Cloud Storage",
      "OneDrive API",
      "Docker",
    ],
    category: "web",
    images: ["/projects/dms-web-1.png", "/projects/dms-web-2.png"],
    featured: false,
    completedAt: new Date("2023-10-10"),
  },
  {
    id: "diving-application",
    title: "Diving Application for Maritime Services",
    description:
      "Full-stack Flutter application for dive marine services with real-time data synchronization and offline capabilities.",
    role: "Led end-to-end product development",
    problem:
      "Field teams relied on manual vessel inspection workflows with limited real-time visibility and unreliable connectivity offshore.",
    solution:
      "Delivered a cross-platform Flutter app with offline-first patterns, cloud-backed sync, and reporting tailored to dive marine operations.",
    outcomes: [
      "Digitized manual inspection procedures",
      "Deployed to Singapore operations with European rollout initiated",
      "Integrated Google Cloud for scalable backend services",
    ],
    longDescription:
      "Led the complete end-to-end development of a comprehensive diving application for Dive Marine Services. The application digitizes manual vessel inspection procedures, provides real-time reporting capabilities, and supports offline functionality for field divers. Built with Flutter for cross-platform compatibility and integrated with Google Cloud services for scalable backend operations. Successfully deployed to Singapore team and initiated rollout to European teams.",
    technologies: [
      "Flutter",
      "Dart",
      "Firebase",
      "Firestore",
      "Google Cloud",
      "GetX",
      "Hive",
      "Cloud Functions",
    ],
    category: "mobile",
    images: ["/projects/diving-app-1.png"],
    featured: true,
    completedAt: new Date("2024-01-15"),
  },
  {
    id: "vessel-tracking-system",
    title: "Global Vessel Telemetry System",
    description:
      "Real-time vessel tracking system built on Google Compute Engine with interactive dashboard for global maritime operations.",
    role: "Full-stack development on ingestion pipeline and dashboard",
    problem:
      "Maritime operations required low-latency visualization of global vessel positions with data residency considerations across regions.",
    solution:
      "Implemented WebSocket ingestion, a live dashboard on Compute Engine, and region-scoped Firestore and Cloud Storage for Asia and Europe.",
    outcomes: [
      "Real-time ship positions in an interactive dashboard",
      "Region-specific storage reducing retrieval latency substantially",
      "Handles large-scale telemetry processing",
    ],
    longDescription:
      "Developed a comprehensive vessel tracking system that ingests global vessel telemetry data via WebSocket connections. The system is deployed on Google Compute Engine and features an interactive live-tracking dashboard that visualizes ship positions in real-time. Implemented region-specific Cloud Storage and Firestore instances across Asia and Europe, resulting in 50% reduction in data-retrieval latency. The system handles large-scale data processing and provides critical operational insights for maritime clients.",
    technologies: [
      "Python",
      "Google Compute Engine",
      "WebSocket",
      "Firestore",
      "Cloud Storage",
      "JavaScript",
      "Real-time Dashboard",
    ],
    category: "web",
    images: [
      "/projects/vessel-tracking-1.png",
      "/projects/vessel-tracking-2.png",
    ],
    featured: true,
    completedAt: new Date("2023-12-20"),
  },
  {
    id: "nea-energy-app",
    title: "NEA Energy Management Mobile App",
    description:
      "Flutter mobile application with push notifications for energy consumption tracking, adopted by the National Environment Agency.",
    role: "End-to-end mobile delivery (internship at Resync)",
    problem:
      "Organizations needed clearer energy consumption visibility and timely alerts for building and facility stakeholders.",
    solution:
      "Built a Flutter app with FCM notifications, sync and offline support, and analytics-oriented views for consumption data.",
    outcomes: [
      "Adopted by NEA and other organizations",
      "FCM-based notification workflows",
      "Analytics-focused UX for consumption tracking",
    ],
    longDescription:
      "Delivered an end-to-end Flutter mobile application with Firebase Cloud Messaging (FCM) push notifications for energy management and consumption tracking. The application was successfully adopted by the National Environment Agency (NEA) and other prominent organizations. Built during internship at Resync, the app enables smart tracking and visualization of energy consumption, providing users with critical data for optimization and cost efficiency. Features include real-time data synchronization, offline capabilities, and comprehensive analytics dashboard.",
    technologies: [
      "Flutter",
      "Dart",
      "Firebase",
      "FCM",
      "Python",
      "Docker",
      "PostgreSQL",
    ],
    category: "mobile",
    images: ["/projects/nea-app-1.svg", "/projects/nea-app-2.svg"],
    featured: true,
    completedAt: new Date("2021-12-15"),
  },
  {
    id: "portfolio-website",
    title: "Professional Portfolio Website",
    description:
      "Modern portfolio website built with Next.js, subtle motion, responsive design, and optimized performance.",
    role: "Design, implementation, and deployment",
    problem:
      "Needed a fast, accessible site that presents engineering work clearly without feeling like a generic template.",
    solution:
      "Next.js App Router with Tailwind, structured project pages, Framer Motion for UI motion, and performance-conscious lazy loading.",
    outcomes: [
      "SSR for SEO and shareable project URLs",
      "CI/CD deploy pipeline to Vercel",
      "Accessibility and responsive layout across breakpoints",
    ],
    longDescription:
      "Built a responsive portfolio using Next.js and Tailwind CSS (with AI assistance) featuring Server-Side Rendering (SSR) for SEO optimization, dynamic project pages, and CI/CD deployment pipeline to Vercel. The website showcases professional experience, technical skills, and project portfolio with modern web technologies. Includes Three.js for a restrained hero visual, Framer Motion for interface motion, and attention to Core Web Vitals. The site is accessible and optimized for all device sizes.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Three.js",
      "Framer Motion",
      "Vercel",
      "AI Assistance",
    ],
    category: "web",
    images: ["/projects/portfolio-1.png"],
    liveUrl: "https://portfolio.jingfeng.dev",
    githubUrl: "https://github.com/jingfeng/portfolio-website",
    featured: true,
    completedAt: new Date("2024-02-28"),
  },
];

export const getProjectBySlug = (slug: string): Project | undefined =>
  sampleProjects.find((p) => p.id === slug);

export const getAllProjectSlugs = (): string[] =>
  sampleProjects.map((p) => p.id);

export const filterProjectsByCategory = (
  projects: Project[],
  category: string
): Project[] => {
  if (category === "all") {
    return projects;
  }
  return projects.filter((project) => project.category === category);
};

export const filterProjectsByTechnology = (
  projects: Project[],
  technology: string
): Project[] => {
  return projects.filter((project) =>
    project.technologies.some((tech) =>
      tech.toLowerCase().includes(technology.toLowerCase())
    )
  );
};

export const searchProjects = (
  projects: Project[],
  searchTerm: string
): Project[] => {
  const term = searchTerm.toLowerCase();
  return projects.filter(
    (project) =>
      project.title.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(term))
  );
};

export const sortProjectsByDate = (
  projects: Project[],
  ascending: boolean = false
): Project[] => {
  return [...projects].sort((a, b) => {
    const dateA = new Date(a.completedAt).getTime();
    const dateB = new Date(b.completedAt).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const sortProjectsByFeatured = (projects: Project[]): Project[] => {
  return [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  });
};

export const getFeaturedProjects = (projects: Project[]): Project[] => {
  return projects.filter((project) => project.featured);
};

export const getProjectCategoryCounts = (
  projects: Project[]
): Record<string, number> => {
  const counts: Record<string, number> = {
    all: projects.length,
    web: 0,
    mobile: 0,
    desktop: 0,
    other: 0,
  };

  projects.forEach((project) => {
    counts[project.category] = (counts[project.category] || 0) + 1;
  });

  return counts;
};

export const getAllTechnologies = (projects: Project[]): string[] => {
  const technologies = new Set<string>();
  projects.forEach((project) => {
    project.technologies.forEach((tech) => technologies.add(tech));
  });
  return Array.from(technologies).sort();
};

export const getProjectsByTechnology = (
  projects: Project[],
  technology: string
): Project[] => {
  return projects.filter((project) =>
    project.technologies.includes(technology)
  );
};

export const getRecentProjects = (
  projects: Project[],
  months: number = 6
): Project[] => {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);

  return projects.filter(
    (project) => new Date(project.completedAt) >= cutoffDate
  );
};

export const getProjectsByTechStack = (
  projects: Project[]
): {
  flutter: Project[];
  python: Project[];
  googleCloud: Project[];
  webDevelopment: Project[];
} => {
  return {
    flutter: projects.filter((p) =>
      p.technologies.some(
        (tech) =>
          tech.toLowerCase().includes("flutter") ||
          tech.toLowerCase().includes("dart")
      )
    ),
    python: projects.filter((p) =>
      p.technologies.some(
        (tech) =>
          tech.toLowerCase().includes("python") ||
          tech.toLowerCase().includes("flask")
      )
    ),
    googleCloud: projects.filter((p) =>
      p.technologies.some(
        (tech) =>
          tech.toLowerCase().includes("google cloud") ||
          tech.toLowerCase().includes("firebase") ||
          tech.toLowerCase().includes("firestore") ||
          tech.toLowerCase().includes("cloud run") ||
          tech.toLowerCase().includes("compute engine")
      )
    ),
    webDevelopment: projects.filter((p) =>
      p.technologies.some(
        (tech) =>
          tech.toLowerCase().includes("next.js") ||
          tech.toLowerCase().includes("react") ||
          tech.toLowerCase().includes("angular") ||
          tech.toLowerCase().includes("typescript")
      )
    ),
  };
};
