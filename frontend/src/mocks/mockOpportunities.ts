export type OpportunityStatus =
  | "Applied"
  | "Upcoming Interview"
  | "Rejected";

export interface Opportunity {
  id: number;
  contractId: number;
  status: OpportunityStatus;
  title: string;
  company: string;
  location: string;
  jobType: "Full-time" | "Part-time" | "Contract";
  shortDescription: string;
  deadline: string; // ISO date
  salary: string;
}
export const mockOpportunities: Opportunity[] = [
  {
    id: 1,
    contractId: 1,
    status: "Applied",
    title: "React Frontend Developer",
    company: "DevLuck",
    location: "Remote",
    jobType: "Full-time",
    shortDescription:
      "We are looking for an experienced React developer to join our frontend development team. You will build scalable UI components, optimize performance, and collaborate with cross-functional teams.",
    deadline: "2025-07-30",
    salary: "$2,500 – $3,500 / month",
  },
  {
    id: 2,
    contractId: 2,
    status: "Upcoming Interview",
    title: "Backend Node.js Engineer",
    company: "TechNova",
    location: "Berlin, Germany",
    jobType: "Contract",
    shortDescription:
      "We are seeking a skilled Node.js engineer to design and maintain scalable backend services, focusing on performance, security, and clean architecture.",
    deadline: "2025-07-30",
    salary: "$4,000 – $5,500 / project",
  },
  {
    id: 3,
    contractId: 3,
    status: "Rejected",
    title: "UI/UX Designer",
    company: "PixelWorks",
    location: "Cairo, Egypt",
    jobType: "Full-time",
    shortDescription:
      "We are looking for a creative UI/UX designer to craft intuitive user experiences and polished visual designs in collaboration with product and engineering teams.",
    deadline: "2025-07-30",
    salary: "$1,800 – $2,500 / month",
  },
  {
    id: 4,
    contractId: 4,
    status: "Applied",
    title: "Mobile App Developer",
    company: "AppForge",
    location: "Remote",
    jobType: "Contract",
    shortDescription:
      "We are seeking a mobile app developer to build and maintain cross-platform applications, improve performance, and deliver high-quality user experiences.",
    deadline: "2025-07-30",
    salary: "$3,500 – $5,000 / project",
  },
  {
    id: 5,
    contractId: 5,
    status: "Applied",
    title: "Data Analyst",
    company: "Insightly",
    location: "London, UK",
    jobType: "Full-time",
    shortDescription:
      "We are looking for a data analyst to analyze business data, create dashboards, and provide actionable insights to stakeholders.",
    deadline: "2025-07-30",
    salary: "$3,000 – $4,200 / month",
  },
  {
    id: 6,
    contractId: 6,
    status: "Upcoming Interview",
    title: "DevOps Engineer",
    company: "Cloudify",
    location: "Amsterdam, NL",
    jobType: "Full-time",
    shortDescription:
      "We are seeking a DevOps engineer to manage CI/CD pipelines, cloud infrastructure, and ensure system reliability and scalability.",
    deadline: "2025-07-30",
    salary: "$4,500 – $6,000 / month",
  },
  {
    id: 7,
    contractId: 7,
    status: "Rejected",
    title: "QA Automation Engineer",
    company: "TestLab",
    location: "Remote",
    jobType: "Contract",
    shortDescription:
      "We are looking for a QA automation engineer to ensure product quality through automated testing and close collaboration with developers.",
    deadline: "2025-07-30",
    salary: "$30 – $45 / hour",
  },
  {
    id: 8,
    contractId: 8,
    status: "Applied",
    title: "Product Manager",
    company: "LaunchPad",
    location: "San Francisco, USA",
    jobType: "Full-time",
    shortDescription:
      "We are seeking a product manager to lead product strategy, define roadmaps, and coordinate cross-team delivery.",
    deadline: "2025-07-30",
    salary: "$6,000 – $8,000 / month",
  },
  {
    id: 9,
    contractId: 9,
    status: "Upcoming Interview",
    title: "Cybersecurity Specialist",
    company: "SecureNet",
    location: "Remote",
    jobType: "Contract",
    shortDescription:
      "We are looking for a cybersecurity specialist to protect systems and data, conduct audits, and implement security policies.",
    deadline: "2025-07-30",
    salary: "$5,000 – $7,000 / project",
  },
  {
    id: 10,
    contractId: 10,
    status: "Applied",
    title: "AI Research Assistant",
    company: "NeuroLabs",
    location: "Remote",
    jobType: "Part-time",
    shortDescription:
      "We are seeking an AI research assistant to support machine learning experiments, analyze results, and document research findings.",
    deadline: "2025-07-30",
    salary: "$25 – $40 / hour",
  },
];
