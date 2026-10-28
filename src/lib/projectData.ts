import { Project } from "@/types";

export const sampleProjects: Project[] = [
  {
    id: "passaggio",
    title: "Passaggio",
    tagline: "Turning my singing lessons into focused practice.",
    description:
      "An iPhone app I built and use to turn recorded singing lessons into timestamped feedback, recurring insights, and practice routines.",
    technologies: ["Swift", "SwiftUI", "SwiftData", "AVFoundation", "OpenAI API"],
    category: "mobile",
    images: [],
    githubUrl: "https://github.com/cloudy3/passaggio",
    featured: true,
    // Portfolio reference month, not a claim that this actively used app is finished.
    completedAt: new Date("2026-10-01"),
    video: {
      src: "/projects/passaggio/teaser.mp4",
      poster: "/projects/passaggio/poster.webp",
      width: 1920,
      height: 1080,
      duration: 24.3,
      description:
        "The teaser shows teacher feedback linked to moments in a lesson, corrections recurring across lessons, and practice routines with piano tracks for my range. It also introduces support for screaming lessons. The closing line reads: So your teacher only has to say it once.",
      captionsSrc: "/projects/passaggio/teaser.vtt",
    },
    caseStudy: [
      {
        heading: "Why I built it",
        paragraphs: [
          "I record my singing lessons, but having the recordings didn't make them easy to revisit. Finding one explanation meant scrubbing through a long lesson. Between sessions, I'd forget corrections, lose track of issues that kept coming back, and struggle to remember when we covered a particular concept.",
          "I built Passaggio to bring those details into my daily practice. I now use it for my own lessons.",
        ],
      },
      {
        heading: "From recordings to practice",
        paragraphs: [
          "Revisit the exact moment. Timestamped key points let me jump from a correction to where my teacher explained it, with the original words and context close at hand.",
          "See what keeps coming back. Recurring insights bring repeated corrections together across lessons, so I can recognize patterns without comparing recordings by hand.",
          "Know what to practise. Focused routines draw on recent and recurring feedback, with piano exercises for my range and clips from lessons to practise along with.",
        ],
      },
      {
        heading: "The engineering behind it",
        paragraphs: [
          "Speaker-labeled transcription separates teacher speech from the rest of a lesson. Extracted feedback points refer to transcript segments, so their timestamps lead back to the source recording. Long recordings are processed in overlapping chunks while preserving the lesson timeline.",
          "Routine planning weights topics by both recurrence and recency. Piano scales and exercises are rendered locally with AVFoundation, while SwiftData stores the lesson library and practice history.",
          "The teacher remains the authority. Prompts are designed to organize their guidance and preserve their wording, rather than introduce new vocal advice. Keeping the recording one tap away makes it easier to check the original context.",
        ],
      },
      {
        heading: "What changed for me",
        paragraphs: [
          "I now find specific feedback faster, have a clearer idea of what to practise between lessons, and notice patterns that were difficult to recognize across separate recordings.",
        ],
      },
    ],
  },
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
      "Engineering portfolio built around a continuous geometric canvas field, Japanese kinetic minimalism, and accessible motion.",
    role: "Design, implementation, and deployment",
    problem:
      "Needed a fast, accessible site that presents engineering work clearly without feeling like a generic template.",
    solution:
      "Next.js App Router with Tailwind, a shared Canvas 2D composition engine, structured project pages, and Motion isolated to interface transitions.",
    outcomes: [
      "SSR for SEO and shareable project URLs",
      "CI/CD deploy pipeline to Vercel",
      "Accessibility and responsive layout across breakpoints",
    ],
    longDescription:
      "Built a responsive portfolio using Next.js and Tailwind CSS with server-rendered content, dynamic project pages, and a CI/CD deployment pipeline to Vercel. A fixed Canvas 2D field recomposes itself around protected content regions as sections change, creating a distinctive visual system without sacrificing legibility. Motion handles restrained interface transitions, while reduced-motion visitors receive deliberate static compositions.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Canvas 2D",
      "Motion",
      "Vercel",
      "AI Assistance",
    ],
    category: "web",
    images: ["/projects/portfolio-1.png"],
    liveUrl: "https://www.jingfeng-cheah.me/",
    githubUrl: "https://github.com/cloudy3/portfolio",
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
  category: string,
): Project[] => {
  if (category === "all") {
    return projects;
  }
  return projects.filter((project) => project.category === category);
};

export const sortProjectsByDate = (
  projects: Project[],
  ascending: boolean = false,
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
