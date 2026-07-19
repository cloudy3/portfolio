import { Experience, Education, Certification } from "@/types";

export const EXPERIENCE_DATA: Experience[] = [
  {
    id: "bss-2023",
    company: "Bernhard Schulte Singapore Holdings",
    position: "Software Engineer (Full Stack)",
    location: "Singapore",
    startDate: new Date("2023-07-01"),
    endDate: undefined, // Current position
    description:
      "Leading full-stack development of cloud-native applications for maritime industry",
    achievements: [
      {
        description:
          "Designed and launched a Diving Application for Dive Marine Services",
        impact:
          "Led full end-to-end development, completed Singapore team onboarding, and initiated rollout to European teams",
      },
      {
        description:
          "Deployed a Compute Engine service to ingest global vessel telemetry via websocket",
        impact: "Built an interactive live-tracking dashboard",
      },
      {
        description: "Automated image compression via Firebase Extensions",
        impact: "Cutting storage costs by 96%",
        metrics: "96% cost reduction",
      },
      {
        description:
          "Deployed region-specific Cloud Storage / Firestore instances (Asia & Europe)",
        impact: "Reducing data-retrieval latency by ~50%",
        metrics: "50% latency improvement",
      },
      {
        description: "Integrated Microsoft OneDrive Picker API",
        impact: "Accelerating client upload workflows by 60%",
        metrics: "60% workflow acceleration",
      },
    ],
    technologies: [
      "Flutter",
      "Python",
      "Google Cloud",
      "Firebase",
      "Firestore",
      "Docker",
      "Cloud Run",
      "Cloud Functions",
      "Compute Engine",
    ],
    logo: "🏢",
  },
  {
    id: "resync-2021",
    company: "Resync",
    position: "Software Engineer Intern",
    location: "Singapore",
    startDate: new Date("2021-07-01"),
    endDate: new Date("2021-12-28"),
    description:
      "Drove full-stack development for energy management platform with mobile and web applications",
    achievements: [
      {
        description:
          "Delivered a Flutter mobile app with FCM push notifications adopted by the National Environment Agency (NEA)",
        impact: "Used by prominent organizations for energy management",
      },
      {
        description: "Built Angular portal and React components with Redux",
        impact: "Reducing frontend bugs by 30%",
        metrics: "30% bug reduction",
      },
      {
        description: "Containerized backend with Docker and PostgreSQL",
        impact: "Cutting setup time by 70%",
        metrics: "70% setup time reduction",
      },
      {
        description: "Established unit testing framework (Mocha, Chai, Sinon)",
        impact: "Raising coverage to 85%",
        metrics: "85% test coverage",
      },
    ],
    technologies: [
      "Flutter",
      "Angular",
      "React",
      "Redux",
      "Docker",
      "PostgreSQL",
      "Python",
      "Mocha",
      "Chai",
      "Sinon",
      "GitLab CI",
    ],
    logo: "💡",
  },
];

export const EDUCATION_DATA: Education[] = [
  {
    id: "ntu-2019",
    institution: "Nanyang Technological University",
    degree:
      "B.Eng. Computer Science with Highest Distinction (First Class Honours)",
    location: "Singapore",
    startDate: new Date("2019-08-01"),
    endDate: new Date("2023-06-30"),
    description:
      "Bachelor of Engineering in Computer Science with First Class Honours",
    achievements: [
      "Specialisations: Artificial Intelligence, Data Science & Analytics",
      "EDB-IPP PhD Scholarship (Offered, Declined)",
    ],
    logo: "🎓",
  },
];

export const CERTIFICATIONS_DATA: Certification[] = [
  {
    id: "cert-1",
    name: "The Complete 2024 Web Development Bootcamp",
    issuer: "Udemy",
    credentialId: "AWS-SAA-123456",
    logo: "☁️",
  },
  {
    id: "cert-2",
    name: "React Developer Certification",
    issuer: "Meta",
    credentialId: "META-REACT-789012",
    logo: "⚛️",
  },
  {
    id: "cert-3",
    name: "Google Analytics Certified",
    issuer: "Google",
    credentialId: "GOOGLE-GA-345678",
    logo: "📊",
  },
];

export const getCurrentExperience = () => {
  return EXPERIENCE_DATA.find((exp) => !exp.endDate);
};

export const getPastExperiences = () => {
  return EXPERIENCE_DATA.filter((exp) => exp.endDate).sort(
    (a, b) => new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime()
  );
};

/**
 * Number of complete calendar months between two dates.
 *
 * Day-based approximations (`diff / 30`) drift: exactly two years came out as
 * "2 years 1 month". Counting calendar months keeps the card and the stats row
 * in agreement.
 */
export const monthsBetween = (start: Date, end: Date): number => {
  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  // The final month is only complete once the day-of-month has been reached.
  if (end.getDate() < start.getDate()) months -= 1;

  return Math.max(0, months);
};

/** "5 months", "2 years", "1 year 3 months". */
export const formatDuration = (months: number): string => {
  if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"}`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const yearPart = `${years} year${years === 1 ? "" : "s"}`;

  if (remainingMonths === 0) return yearPart;

  return `${yearPart} ${remainingMonths} month${
    remainingMonths === 1 ? "" : "s"
  }`;
};

/** Duration of a single role, treating an open-ended role as running to today. */
export const getExperienceDuration = (
  experience: Pick<Experience, "startDate" | "endDate">,
  now: Date = new Date()
): string =>
  formatDuration(monthsBetween(experience.startDate, experience.endDate ?? now));

export const getTotalExperienceYears = (now: Date = new Date()) => {
  const totalMonths = EXPERIENCE_DATA.reduce(
    (total, exp) => total + monthsBetween(exp.startDate, exp.endDate ?? now),
    0
  );

  return Math.round((totalMonths / 12) * 10) / 10; // 1 decimal place
};
