import { User, CandidateProfile, CVItem, Job, Application, InterviewRecord, OfferTemplate, OfferLetter, InviteToken, PermissionMatrixItem } from '../types/portal';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_super_admin',
    name: 'ABHISHEKH KUMAR JHA',
    email: 'abhishek.jha@cloudinntech.co.in',
    password: 'password@cloudinntech',
    role: 'super_admin',
    provider: 'email',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr_recruiter_rahul',
    name: 'Rahul Sharma',
    email: 'rahul@cloudinntech.co.in',
    password: 'password123',
    role: 'recruiter',
    provider: 'email',
    createdAt: '2026-01-02T00:00:00Z',
  },
  {
    id: 'usr_recruiter_john',
    name: 'John Doe',
    email: 'john@cloudinntech.co.in',
    password: 'password123',
    role: 'recruiter',
    provider: 'email',
    createdAt: '2026-01-02T00:00:00Z',
  },
  {
    id: 'usr_candidate_priya',
    name: 'Priya Patel',
    email: 'priya@gmail.com',
    password: 'password123',
    role: 'candidate',
    provider: 'email',
    createdAt: '2026-01-03T00:00:00Z',
  },
  {
    id: 'usr_candidate_rohan',
    name: 'Rohan Gupta',
    email: 'rohan@gmail.com',
    password: 'password123',
    role: 'candidate',
    provider: 'email',
    createdAt: '2026-01-04T00:00:00Z',
  },
  {
    id: 'usr_candidate_amit',
    name: 'Amit Sharma',
    email: 'amit@gmail.com',
    password: 'password123',
    role: 'candidate',
    provider: 'email',
    createdAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 'usr_candidate_vikram',
    name: 'Vikram Singh',
    email: 'vikram@gmail.com',
    password: 'password123',
    role: 'candidate',
    provider: 'email',
    createdAt: '2026-01-06T00:00:00Z',
  },
  {
    id: 'usr_candidate_rahul_sharma',
    name: 'Rahul Kumar',
    email: 'rahul.sharma98@gmail.com',
    password: 'password123',
    role: 'candidate',
    provider: 'email',
    createdAt: '2026-01-07T00:00:00Z',
  }
];

export const INITIAL_CANDIDATE_PROFILES: CandidateProfile[] = [
  {
    id: 'prof_priya',
    userId: 'usr_candidate_priya',
    fullName: 'Priya Patel',
    email: 'priya@gmail.com',
    phone: '+91-9876543210',
    location: 'Mumbai, India',
    bio: 'Experienced Software Engineer specializing in Python microservices and backend database logic.',
    experienceYears: 1,
    expectedSalary: '₹8,00,000 / yr',
    currentSalary: '₹6,00,000 / yr',
    availability: 'Immediate',
    openToWork: true,
    domain: 'Engineering',
    skills: ['Python', 'SQL', 'HTML', 'CSS', 'PostgreSQL'],
    experience: [
      { id: 'exp_p1', company: 'TechLabs India', role: 'Junior Python Developer', duration: 'Jul 2024 - Present', description: 'Assisted in building REST APIs and scheduling ETL jobs in Python and SQL.' }
    ],
    education: [
      { id: 'edu_p1', institution: 'Mumbai University', degree: 'B.S. Information Technology', year: '2024' }
    ],
    certifications: [],
    githubUrl: 'https://github.com/priyapatel',
    portfolioUrl: 'https://priyapatel.dev',
    linkedinUrl: 'https://linkedin.com/in/priyapatel',
    profileCompletion: 80,
    createdAt: '2026-01-03T00:00:00Z',
    updatedAt: '2026-01-03T00:00:00Z'
  },
  {
    id: 'prof_rohan',
    userId: 'usr_candidate_rohan',
    fullName: 'Rohan Gupta',
    email: 'rohan@gmail.com',
    phone: '+91-8888888888',
    location: 'Delhi, India',
    bio: 'Fullstack Engineer focused on building reactive, accessible interfaces in React, TypeScript, and Node.js.',
    experienceYears: 2,
    expectedSalary: '₹12,00,000 / yr',
    currentSalary: '₹9,00,000 / yr',
    availability: '30 Days',
    openToWork: true,
    domain: 'Engineering',
    skills: ['React', 'Node.js', 'TypeScript', 'JavaScript', 'Tailwind CSS'],
    experience: [
      { id: 'exp_ro1', company: 'DevScale Co', role: 'Full Stack Engineer', duration: 'Jan 2024 - Present', description: 'Developed React web portals and unified dashboard views with low-latency client state synchronization.' }
    ],
    education: [
      { id: 'edu_ro1', institution: 'Delhi Technological University', degree: 'B.Tech Software Engineering', year: '2023' }
    ],
    certifications: [],
    githubUrl: 'https://github.com/rohangupta',
    portfolioUrl: 'https://rohan.dev',
    linkedinUrl: 'https://linkedin.com/in/rohangupta',
    profileCompletion: 85,
    createdAt: '2026-01-04T00:00:00Z',
    updatedAt: '2026-01-04T00:00:00Z'
  },
  {
    id: 'prof_amit',
    userId: 'usr_candidate_amit',
    fullName: 'Amit Sharma',
    email: 'amit@gmail.com',
    phone: '+91-9999999999',
    location: 'Noida, India',
    bio: 'Entry-level backend engineer interested in Python backend services and cloud pipelines.',
    experienceYears: 0,
    expectedSalary: '₹6,00,000 / yr',
    availability: 'Immediate',
    openToWork: true,
    domain: 'Engineering',
    skills: ['Python', 'SQL'],
    experience: [],
    education: [
      { id: 'edu_a1', institution: 'Amity University', degree: 'B.Tech Computer Science', year: '2025' }
    ],
    certifications: [],
    githubUrl: '',
    portfolioUrl: '',
    linkedinUrl: '',
    profileCompletion: 60,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-01-05T00:00:00Z'
  },
  {
    id: 'prof_vikram',
    userId: 'usr_candidate_vikram',
    fullName: 'Vikram Singh',
    email: 'vikram@gmail.com',
    phone: '+91-7777777777',
    location: 'Bengaluru, India',
    bio: 'DevOps automation expert specialized in Kubernetes deployment orchestrations and AWS infrastructure architecture.',
    experienceYears: 3,
    expectedSalary: '₹14,00,000 / yr',
    currentSalary: '₹11,00,000 / yr',
    availability: '30 Days',
    openToWork: true,
    domain: 'DevOps',
    skills: ['Kubernetes', 'AWS', 'Docker', 'Terraform', 'CI/CD'],
    experience: [
      { id: 'exp_v1', company: 'CloudOps Systems', role: 'DevOps Engineer', duration: 'Jun 2023 - Present', description: 'Maintained production AWS cluster configurations and built automatic testing pipelines.' }
    ],
    education: [
      { id: 'edu_v1', institution: 'VIT Vellore', degree: 'B.Tech Computer Science', year: '2023' }
    ],
    certifications: [
      { id: 'cert_v1', title: 'AWS Solutions Architect Associate', issuer: 'Amazon Web Services', year: '2024' }
    ],
    githubUrl: 'https://github.com/vikramdevops',
    portfolioUrl: '',
    linkedinUrl: '',
    profileCompletion: 80,
    createdAt: '2026-01-06T00:00:00Z',
    updatedAt: '2026-01-06T00:00:00Z'
  },
  {
    id: 'prof_rahul_sharma',
    userId: 'usr_candidate_rahul_sharma',
    fullName: 'Rahul Kumar',
    email: 'rahul.sharma98@gmail.com',
    phone: '+91-9123456789',
    location: 'Jaipur, India',
    bio: 'Senior Software Engineer with extensive experience in payment microservices, Spring Boot, React, Node.js, and AWS.',
    experienceYears: 6,
    expectedSalary: '₹18,00,000 / yr',
    currentSalary: '₹14,00,000 / yr',
    availability: '15 Days',
    openToWork: true,
    domain: 'Engineering',
    skills: ['Java', 'Spring Boot', 'Node.js', 'React', 'AWS', 'Kubernetes', 'Docker', 'SQL'],
    experience: [
      { id: 'exp_r1', company: 'TCS (Bangalore)', role: 'Senior Software Engineer', duration: 'Jul 2021–Present', description: 'Lead team of 4 in developing payment microservices using Java/Spring Boot on AWS.' },
      { id: 'exp_r2', company: 'Infosys (Pune)', role: 'Software Engineer', duration: 'Jun 2018–Jun 2021', description: 'Implemented RESTful APIs in Node.js for banking portal serving 1M users.' }
    ],
    education: [
      { id: 'edu_r1', institution: 'MNIT Jaipur', degree: 'B.Tech Computer Science', year: '2018' }
    ],
    certifications: [
      { id: 'cert_r1', title: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', year: '2023' },
      { id: 'cert_r2', title: 'Certified Scrum Master', issuer: 'Scrum Alliance', year: '2022' }
    ],
    githubUrl: 'https://github.com/rahul-sharma',
    portfolioUrl: 'https://rahul-sharma.dev',
    linkedinUrl: 'https://linkedin.com/in/rahul-sharma',
    profileCompletion: 95,
    createdAt: '2026-01-07T00:00:00Z',
    updatedAt: '2026-01-07T00:00:00Z'
  }
];

export const INITIAL_CVS: CVItem[] = [
  {
    id: 'cv_priya',
    candidateId: 'usr_candidate_priya',
    title: 'Priya Patel - Backend Python Developer',
    isPrimary: true,
    rawText: 'Priya Patel Resume. Python backend developer with experience in API testing and database programming.',
    parsedData: {
      fullName: 'Priya Patel',
      email: 'priya@gmail.com',
      phone: '+91-9876543210',
      location: 'Mumbai, India',
      summary: 'Backend Engineer specializing in Python and API scaling.',
      experienceYears: 1,
      expectedSalary: '₹8,00,000 / yr',
      availability: 'Immediate',
      skills: ['Python', 'SQL', 'PostgreSQL'],
      experience: [
        { id: 'exp_p1', company: 'TechLabs India', role: 'Junior Python Developer', duration: 'Jul 2024 - Present', description: 'Assisted in building REST APIs and scheduling ETL jobs in Python and SQL.' }
      ],
      education: [
        { id: 'edu_p1', institution: 'Mumbai University', degree: 'B.S. Information Technology', year: '2024' }
      ],
      certifications: []
    },
    uploadedAt: '2026-01-03T00:00:00Z',
    updatedAt: '2026-01-03T00:00:00Z'
  },
  {
    id: 'cv_vikram',
    candidateId: 'usr_candidate_vikram',
    title: 'Vikram Singh - DevOps CV',
    isPrimary: true,
    rawText: 'Vikram Singh Resume. DevOps engineer with Kubernetes, CI/CD, and AWS architecture certifications.',
    parsedData: {
      fullName: 'Vikram Singh',
      email: 'vikram@gmail.com',
      phone: '+91-7777777777',
      location: 'Bengaluru, India',
      summary: 'DevOps engineer with Kubernetes and cloud optimization focus.',
      experienceYears: 3,
      expectedSalary: '₹14,00,000 / yr',
      availability: '30 Days',
      skills: ['Kubernetes', 'AWS', 'Docker'],
      experience: [
        { id: 'exp_v1', company: 'CloudOps Systems', role: 'DevOps Engineer', duration: 'Jun 2023 - Present', description: 'Maintained production AWS cluster configurations and built automatic testing pipelines.' }
      ],
      education: [
        { id: 'edu_v1', institution: 'VIT Vellore', degree: 'B.Tech Computer Science', year: '2023' }
      ],
      certifications: [
        { id: 'cert_v1', title: 'AWS Solutions Architect Associate', issuer: 'Amazon Web Services', year: '2024' }
      ]
    },
    uploadedAt: '2026-01-06T00:00:00Z',
    updatedAt: '2026-01-06T00:00:00Z'
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job_senior_dev',
    title: 'Senior AI/ML Engineer',
    company: 'CloudInnTech Corp',
    department: 'AI & Data Intelligence',
    location: 'Noida Office',
    workMode: 'hybrid',
    employmentType: 'full_time',
    domain: 'Data & AI',
    salaryMin: 1800000,
    salaryMax: 3000000,
    salaryCurrency: 'INR',
    description: 'We are looking for a Senior AI/ML Engineer to lead the design and implementation of next-gen agentic workflows and LLM orchestration systems.',
    responsibilities: [
      'Architect scalable agentic AI workflows using modern orchestration frameworks.',
      'Deploy and optimize LLMs for structured data synthesis and extraction.',
      'Coordinate with senior business managers to translate requirements into engineering projects.'
    ],
    requirements: [
      'Demonstrated expertise with Python, PyTorch, and NLP libraries.',
      'Experience building custom Retrieval Augmented Generation (RAG) pipelines.',
      'Familiarity with containerized orchestration (Docker, Kubernetes).'
    ],
    requiredSkills: ['Python', 'LLMs', 'Vector Databases', 'Docker'],
    preferredSkills: ['TypeScript', 'Kubernetes', 'FastAPI'],
    minimumExperience: 5,
    maximumExperience: 10,
    educationRequirements: ['B.Tech or M.Tech in Computer Science or similar field'],
    certifications: [],
    numberOfOpenings: 2,
    status: 'published',
    postedBy: 'usr_super_admin',
    createdAt: '2026-01-03T00:00:00Z',
    updatedAt: '2026-01-03T00:00:00Z',
    publishedAt: '2026-01-03T00:00:00Z'
  },
  {
    id: 'job_security_analyst',
    title: 'Cloud Security Specialist',
    company: 'CloudInnTech Corp',
    department: 'SecOps & Infrastructure',
    location: 'Remote',
    workMode: 'remote',
    employmentType: 'full_time',
    domain: 'DevOps',
    salaryMin: 1400000,
    salaryMax: 2400000,
    salaryCurrency: 'INR',
    description: 'Responsible for auditing cloud security policies, building automated vulnerability checking, and managing IAM strategies.',
    responsibilities: [
      'Conduct regular cloud architecture vulnerability scanning and configure automated alarms.',
      'Standardize and audit IAM roles across AWS and GCP environments.',
      'Mitigate risks by implementing Zero Trust networking principles.'
    ],
    requirements: [
      'Proven experience in AWS/GCP security management.',
      'In-depth knowledge of Kubernetes pod security policies and networking.',
      'Familiarity with compliance standards like SOC2 and ISO27001.'
    ],
    requiredSkills: ['AWS', 'Cloud Security', 'IAM auditing', 'Kubernetes'],
    preferredSkills: ['Terraform', 'Python', 'Docker'],
    minimumExperience: 3,
    maximumExperience: 8,
    educationRequirements: ['Bachelor in Cybersecurity or Computer Science'],
    certifications: ['CISSP', 'AWS Certified Security Specialist'],
    numberOfOpenings: 1,
    status: 'published',
    postedBy: 'usr_super_admin',
    createdAt: '2026-01-04T00:00:00Z',
    updatedAt: '2026-01-04T00:00:00Z',
    publishedAt: '2026-01-04T00:00:00Z'
  },
  {
    id: 'job_snowflake_eng',
    title: 'Snowflake Data Engineer',
    company: 'CloudInnTech Corp',
    department: 'Data Platforms',
    location: 'Bengaluru Office',
    workMode: 'onsite',
    employmentType: 'full_time',
    domain: 'Data & AI',
    salaryMin: 1600000,
    salaryMax: 2600000,
    salaryCurrency: 'INR',
    description: 'We are seeking a Snowflake Data Engineer to optimize warehouse clustering, build secure streams, and orchestrate Apache Kafka data loads.',
    responsibilities: [
      'Optimize Snowflake warehouse resource usage and data loading paths.',
      'Build real-time ingestion pipelines using Kafka, Spark, and Snowflake Streams.',
      'Maintain transactional pipeline structures for reporting intelligence.'
    ],
    requirements: [
      'Advanced knowledge of Snowflake SQL dialect and clustering metrics.',
      'Hands-on experience with Apache Spark and Kafka stream integrations.',
      'Skilled in building modular, clean Python ETL data pipelines.'
    ],
    requiredSkills: ['Snowflake', 'Python', 'Spark', 'Kafka'],
    preferredSkills: ['Java', 'dbt', 'Airflow'],
    minimumExperience: 4,
    maximumExperience: 9,
    educationRequirements: ['B.E./B.Tech/M.C.A. in Computer Science or Statistics'],
    certifications: ['SnowPro Core', 'SnowPro Advanced Architect'],
    numberOfOpenings: 3,
    status: 'published',
    postedBy: 'usr_recruiter_rahul',
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-01-05T00:00:00Z',
    publishedAt: '2026-01-05T00:00:00Z'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app_priya',
    jobId: 'job_senior_dev',
    candidateId: 'usr_candidate_priya',
    cvId: 'cv_priya',
    status: 'ai_screening',
    stage: 1,
    interviewType: 'ai',
    aiMatchScore: 84,
    aiMatchReasoning: 'Candidate has python skills and standard database backgrounds matching 80%+ of requirements. Lacks PyTorch/LLM framework experience.',
    matchedSkills: ['Python', 'SQL'],
    missingSkills: ['LLMs', 'Vector Databases'],
    appliedAt: '2026-01-03T10:00:00Z',
    updatedAt: '2026-01-03T10:00:00Z'
  },
  {
    id: 'app_vikram',
    jobId: 'job_security_analyst',
    candidateId: 'usr_candidate_vikram',
    cvId: 'cv_vikram',
    status: 'under_review',
    stage: 1,
    interviewType: 'human',
    aiMatchScore: 92,
    aiMatchReasoning: 'Strong fit with Kubernetes experience, AWS management certifications, and hands-on vulnerability scan automation history.',
    matchedSkills: ['AWS', 'Kubernetes', 'Cloud Security'],
    missingSkills: ['IAM auditing'],
    appliedAt: '2026-01-06T10:00:00Z',
    updatedAt: '2026-01-06T10:00:00Z'
  },
  {
    id: 'app_amit_job',
    jobId: 'job_senior_dev',
    candidateId: 'usr_candidate_amit',
    cvId: 'no_cv',
    status: 'applied',
    stage: 1,
    interviewType: 'ai',
    aiMatchScore: 40,
    aiMatchReasoning: 'Entry-level Python/SQL developer applying for a Senior AI/ML Engineer role. Severe gaps in minimum experience requirements (0 years vs 5 required) and lacks NLP/LLM exposure.',
    matchedSkills: ['Python'],
    missingSkills: ['LLMs', 'Vector Databases', 'Docker'],
    appliedAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-01-05T10:00:00Z'
  }
];

export const INITIAL_INTERVIEWS: InterviewRecord[] = [];

export const INITIAL_OFFER_TEMPLATES: OfferTemplate[] = [
  {
    id: 'tmpl_standard_tech',
    name: 'CloudInnTech Employment Offer Confirmation',
    companyName: 'CloudInnTech Corp',
    headerText: 'EMPLOYMENT OFFER LETTER — CLOUDINNTECH CORP',
    bodyTemplate: 'Dear {{candidate_name}},\n\nWe are thrilled to offer you employment for the position of {{role}} at {{company_name}}! Based on your outstanding interview performance and deep tech profile, we believe you are fully prepared to contribute significantly to our technology division.\n\nYour effective start date will be {{joining_date}}. Your starting compensation will be {{salary}}. Upon accepting, you will gain access to your official Employee Portal.',
    benefitsList: [
      'Comprehensive Medical, Dental, and Vision Insurance plan coverage',
      'Flexible Paid Time Off (PTO) policy and corporate holiday schedule',
      'Remote Work Setup allowance & home office equipment grant',
      'Annual Performance and Skill Development bonuses'
    ]
  }
];

export const INITIAL_OFFER_LETTERS: OfferLetter[] = [];

export const INITIAL_INVITE_TOKENS: InviteToken[] = [];

export const PERMISSION_MATRIX: PermissionMatrixItem[] = [
  { action: 'Create Admin accounts', superAdmin: true, admin: false, recruiter: false, candidate: false },
  { action: 'Create Recruiter accounts', superAdmin: true, admin: true, recruiter: false, candidate: false },
  { action: 'Post/manage jobs', superAdmin: true, admin: true, recruiter: 'own', candidate: false },
  { action: 'View all CVs/profiles', superAdmin: true, admin: true, recruiter: 'per_job', candidate: 'own' },
  { action: 'Use AI CV search', superAdmin: true, admin: true, recruiter: 'all', candidate: false },
  { action: 'Schedule screening calls', superAdmin: true, admin: true, recruiter: 'all', candidate: 'receives' },
  { action: 'Trigger AI interview', superAdmin: true, admin: true, recruiter: 'all', candidate: 'attends' },
  { action: 'Release offer letters', superAdmin: true, admin: true, recruiter: 'template', candidate: 'receives' },
  { action: 'Platform config/billing', superAdmin: true, admin: false, recruiter: false, candidate: false },
];
