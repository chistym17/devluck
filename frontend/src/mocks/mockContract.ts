export type ContractStatus = "Running" | "Completed" | "Dispute";

export type OpportunityStatus =
  | "Applied"
  | "Upcoming Interview"
  | "Rejected";

export type OpportunityFrom = "Company" | "Investor"; // ✅ NEW

export interface Contract {
  id: number;
  applicantId: number;
  contractTitle: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  applicantIds: number[];          // ✅ now a list
  companyId: string;               // ✅ new

  opportunityStatus: OpportunityStatus;
  opportunityFrom: OpportunityFrom; // ✅ NEW
  deadline: string;
  salary: string;

  skills: string[];        // ✅ NEW
  benefits: string[];      // ✅ NEW

  jobDescription: string;
  keyResponsibilities: string[];
  whyYoullLoveWorkingHere: string[];
  jobType: "Full-time" | "Part-time" | "Contract";
  location: string;
  company: string;
  workProgress: number; // 0 → 100
}


export const mockContracts: Contract[] = [
  {
    id: 1,
    applicantId: 201,
    contractTitle: "Frontend Developer",
    startDate: "2024-01-10",
    endDate: "2024-07-10",
    status: "Running",
    applicantIds: [201,202,214],
    companyId: "C001",

    opportunityStatus: "Applied",
    opportunityFrom: "Company",
    deadline: "2025-07-30",
    salary: "$2,500",

    skills: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "REST APIs",
    "Git"
    ],

    benefits: [
      "Flexible working hours",
      "Remote work",
      "Health insurance",
      "Career growth opportunities"
    ],

    jobDescription:
      "Build and maintain modern user interfaces using React and Tailwind CSS. You will be responsible for creating intuitive and dynamic front-end experiences, implementing best practices for performance and accessibility, and collaborating closely with cross-functional teams to deliver high-quality software solutions.",
    keyResponsibilities: [
      "Develop responsive UI components",
      "Collaborate with designers and backend engineers",
      "Optimize application performance",
      "Write reusable and maintainable code",
      "Conduct code reviews and mentor junior developers",
      "Participate in sprint planning and agile ceremonies"
    ],
    whyYoullLoveWorkingHere: [
      "Flexible working hours",
      "Supportive engineering team",
      "Modern tech stack",
      "Opportunities for career growth",
      "Regular team events and hackathons",
      "Learning-friendly environment with mentorship"
    ],
    jobType: "Full-time",
    location: "Remote",
    company: "DevLuck",
    workProgress: 45,
  },
  {
    id: 2,
    applicantId: 202,
    contractTitle: "Backend Node.js Engineer",
    startDate: "2023-11-01",
    endDate: "2024-05-01",
    status: "Completed",
    applicantIds: [201,202,203,214],
    companyId: "C001",

    opportunityStatus: "Upcoming Interview",
    opportunityFrom: "Investor",
    deadline: "2025-07-30",
    salary: "$4,000",

    skills: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "REST APIs",
    "Git"
    ],

    benefits: [
      "Flexible working hours",
      "Remote work",
      "Health insurance",
      "Career growth opportunities"
    ],

    jobDescription:
      "Design scalable APIs and services using Node.js and PostgreSQL.",
    keyResponsibilities: [
      "Build RESTful APIs",
      "Database schema design",
      "Ensure system security",
    ],
    whyYoullLoveWorkingHere: [
      "Impactful work",
      "Learning opportunities",
      "Competitive compensation",
    ],
    jobType: "Contract",
    location: "Berlin, Germany",
    company: "TechNova",
    workProgress: 100,
  },
  {
    id: 3,
    applicantId: 203,
    contractTitle: "UI/UX Designer",
    startDate: "2024-02-01",
    endDate: "2024-08-01",
    status: "Running",
    applicantIds: [201,202,214,206],
    companyId: "C001",
    opportunityStatus: "Rejected",
    opportunityFrom: "Company",
    deadline: "2025-07-30",
    salary: "$1,800",
    jobDescription:
      "Create intuitive user experiences and polished visual designs.",

    skills: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "REST APIs",
    "Git"
  ],

  benefits: [
    "Flexible working hours",
    "Remote work",
    "Health insurance",
    "Career growth opportunities"
  ],
    keyResponsibilities: [
      "Design wireframes and prototypes",
      "Conduct user research",
      "Collaborate with product managers",
    ],
    whyYoullLoveWorkingHere: [
      "Creative freedom",
      "Design-driven culture",
      "Cross-functional collaboration",
    ],
    jobType: "Full-time",
    location: "Cairo, Egypt",
    company: "PixelWorks",
    workProgress: 60,
  },
  {
    id: 4,
    applicantId: 204,
    contractTitle: "Mobile App Developer",
    startDate: "2023-09-15",
    endDate: "2024-03-15",
    status: "Dispute",
    opportunityStatus: "Applied",
    opportunityFrom: "Investor",
    deadline: "2025-07-30",
    salary: "$3,500",
    applicantIds: [201],
    companyId: "C001",
    skills: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "REST APIs",
    "Git"
  ],

  benefits: [
    "Flexible working hours",
    "Remote work",
    "Health insurance",
    "Career growth opportunities"
  ],
    jobDescription:
      "Develop and maintain cross-platform mobile applications.",
    keyResponsibilities: [
      "Implement mobile UI components",
      "Fix bugs and improve performance",
      "Publish apps to stores",
    ],
    whyYoullLoveWorkingHere: [
      "Fast-growing startup",
      "Ownership of features",
      "Remote-friendly environment",
    ],
    jobType: "Contract",
    location: "Remote",
    company: "AppForge",
    workProgress: 80,
  },
  {
    id: 5,
    applicantId: 205,
    contractTitle: "Data Analyst",
    startDate: "2024-03-01",
    endDate: "2024-09-01",
    status: "Running",
    opportunityStatus: "Applied",
    opportunityFrom: "Company",
    applicantIds: [201,202,203,206],
    companyId: "C001",
    deadline: "2025-07-30",
    salary: "$3,000",
    skills: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "REST APIs",
    "Git"
  ],

  benefits: [
    "Flexible working hours",
    "Remote work",
    "Health insurance",
    "Career growth opportunities"
  ],
    jobDescription:
      "Analyze business data to generate insights and reports.",
    keyResponsibilities: [
      "Data cleaning and analysis",
      "Dashboard creation",
      "Present insights to stakeholders",
    ],
    whyYoullLoveWorkingHere: [
      "Data-driven decisions",
      "Career growth",
      "Collaborative team",
    ],
    jobType: "Full-time",
    location: "London, UK",
    company: "Insightly",
    workProgress: 30,
  },
  {
    id: 6,
    applicantId: 206,
    contractTitle: "DevOps Engineer",
    startDate: "2023-10-01",
    endDate: "2024-04-01",
    status: "Completed",
    opportunityStatus: "Upcoming Interview",
    opportunityFrom: "Investor",
    deadline: "2025-07-30",
    salary: "$4,500",
    applicantIds: [201,202,204,205],
    companyId: "C001",
    skills: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "REST APIs",
    "Git"
  ],

  benefits: [
    "Flexible working hours",
    "Remote work",
    "Health insurance",
    "Career growth opportunities"
  ],
    jobDescription:
      "Manage CI/CD pipelines and cloud infrastructure.",
    keyResponsibilities: [
      "Automate deployments",
      "Monitor system health",
      "Ensure high availability",
    ],
    whyYoullLoveWorkingHere: [
      "Cutting-edge cloud tech",
      "Autonomy",
      "Strong engineering culture",
    ],
    jobType: "Full-time",
    location: "Amsterdam, NL",
    company: "Cloudify",
    workProgress: 100,
  },
  {
    id: 7,
    applicantId: 207,
    contractTitle: "QA Automation Engineer",
    startDate: "2024-01-20",
    endDate: "2024-06-20",
    status: "Running",
    applicantIds: [201,203,214,209,207],
    companyId: "C001",
    opportunityStatus: "Rejected",
    opportunityFrom: "Company",
    deadline: "2025-07-30",
    salary: "$3,000",
    skills: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "REST APIs",
    "Git"
  ],

  benefits: [
    "Flexible working hours",
    "Remote work",
    "Health insurance",
    "Career growth opportunities"
  ],
    jobDescription:
      "Ensure product quality through automated testing.",
    keyResponsibilities: [
      "Write automated test scripts",
      "Identify and report bugs",
      "Collaborate with developers",
    ],
    whyYoullLoveWorkingHere: [
      "Quality-first mindset",
      "Agile environment",
      "Friendly team",
    ],
    jobType: "Contract",
    location: "Remote",
    company: "TestLab",
    workProgress: 55,
  },
  {
    id: 8,
    applicantId: 208,
    contractTitle: "Product Manager",
    startDate: "2023-08-01",
    endDate: "2024-02-01",
    applicantIds: [201,210,209,207],
    companyId: "C001",
    status: "Completed",
    opportunityStatus: "Applied",
    opportunityFrom: "Investor",
    deadline: "2025-07-30",
    salary: "$6,000",
    skills: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "REST APIs",
    "Git"
  ],

  benefits: [
    "Flexible working hours",
    "Remote work",
    "Health insurance",
    "Career growth opportunities"
  ],
    jobDescription:
      "Lead product strategy and roadmap execution.",
    keyResponsibilities: [
      "Define product vision",
      "Gather requirements",
      "Coordinate cross-team delivery",
    ],
    whyYoullLoveWorkingHere: [
      "Leadership role",
      "Direct user impact",
      "Strategic influence",
    ],
    jobType: "Full-time",
    location: "San Francisco, USA",
    company: "LaunchPad",
    workProgress: 100,
  },
  {
    id: 9,
    applicantId: 209,
    contractTitle: "Cybersecurity Specialist",
    startDate: "2024-02-15",
    endDate: "2024-08-15",
    status: "Dispute",
    opportunityStatus: "Upcoming Interview",
    opportunityFrom: "Company",
    deadline: "2025-07-30",
    salary: "$5,000",
    applicantIds: [201,204,206,208,214],
    companyId: "C001",
    skills: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "REST APIs",
    "Git"
  ],

  benefits: [
    "Flexible working hours",
    "Remote work",
    "Health insurance",
    "Career growth opportunities"
  ],
    jobDescription:
      "Protect systems and data from security threats.",
    keyResponsibilities: [
      "Conduct security audits",
      "Monitor vulnerabilities",
      "Implement security policies",
    ],
    whyYoullLoveWorkingHere: [
      "High-impact role",
      "Advanced security tools",
      "Critical responsibility",
    ],
    jobType: "Contract",
    location: "Remote",
    company: "SecureNet",
    workProgress: 70,
  },
  {
    id: 10,
    applicantId: 210,
    contractTitle: "AI Research Assistant",
    startDate: "2024-03-10",
    endDate: "2024-09-10",
    status: "Running",
    applicantIds: [201,202,204,214,211,205],
    companyId: "C001",
    opportunityStatus: "Applied",
    opportunityFrom: "Investor",
    deadline: "2025-07-30",
    salary: "$2,500",
    skills: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "REST APIs",
    "Git"
  ],

  benefits: [
    "Flexible working hours",
    "Remote work",
    "Health insurance",
    "Career growth opportunities"
  ],
    jobDescription:
      "Assist in AI model research and experimentation.",
    keyResponsibilities: [
      "Run ML experiments",
      "Analyze model performance",
      "Document findings",
    ],
    whyYoullLoveWorkingHere: [
      "Work with AI experts",
      "Research-focused environment",
      "Future-oriented projects",
    ],
    jobType: "Part-time",
    location: "Remote",
    company: "NeuroLabs",
    workProgress: 25,
  },

  {
  id: 11,
  applicantId: 201,
  contractTitle: "Full Stack Engineer",
  startDate: "2024-04-01",
  endDate: "2024-10-01",
  status: "Running",
  applicantIds: [201],
  companyId: "C002",

  opportunityStatus: "Upcoming Interview",
  opportunityFrom: "Company",
  deadline: "2025-07-30",
  salary: "$4,200",

  skills: ["Next.js", "Node.js", "PostgreSQL", "TypeScript"],
  benefits: ["Remote work", "Flexible hours", "Stock options"],

  jobDescription:
    "Build end-to-end features using modern full-stack technologies.",
  keyResponsibilities: [
    "Develop frontend and backend features",
    "Maintain APIs",
    "Collaborate with product teams",
  ],
  whyYoullLoveWorkingHere: [
    "Modern stack",
    "Fast-paced team",
    "Ownership of features",
  ],
  jobType: "Full-time",
  location: "Remote",
  company: "StackForge",
  workProgress: 35,
},
{
  id: 12,
  applicantId: 201,
  contractTitle: "Technical Product Analyst",
  startDate: "2024-02-15",
  endDate: "2024-08-15",
  status: "Completed",
  applicantIds: [201,203],
  companyId: "C003",

  opportunityStatus: "Upcoming Interview",
  opportunityFrom: "Investor",
  deadline: "2025-07-30",
  salary: "$3,800",

  skills: ["Data Analysis", "SQL", "Product Metrics", "Excel"],
  benefits: ["Hybrid work", "Learning budget"],

  jobDescription:
    "Analyze product data and support roadmap decisions.",
  keyResponsibilities: [
    "Analyze KPIs",
    "Prepare reports",
    "Support product strategy",
  ],
  whyYoullLoveWorkingHere: [
    "Strategic role",
    "Close to decision makers",
  ],
  jobType: "Contract",
  location: "London, UK",
  company: "InsightCore",
  workProgress: 100,
},
{
  id: 13,
  applicantId: 201,
  contractTitle: "Frontend Performance Engineer",
  startDate: "2024-05-01",
  endDate: "2024-11-01",
  status: "Running",
  applicantIds: [201,202],
  companyId: "C004",

  opportunityStatus: "Upcoming Interview",
  opportunityFrom: "Company",
  deadline: "2025-07-30",
  salary: "$3,200",

  skills: ["React", "Web Performance", "Lighthouse", "Tailwind CSS"],
  benefits: ["Remote", "Flexible schedule"],

  jobDescription:
    "Optimize frontend performance and improve UX metrics.",
  keyResponsibilities: [
    "Improve page load speed",
    "Audit frontend code",
    "Work with UI teams",
  ],
  whyYoullLoveWorkingHere: [
    "Performance-focused work",
    "Technical challenges",
  ],
  jobType: "Part-time",
  location: "Remote",
  company: "Speedify",
  workProgress: 60,
},

];
