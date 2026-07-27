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
    email: 'rahul@zeptrax.ai',
    password: 'password123',
    role: 'recruiter',
    provider: 'email',
    createdAt: '2026-01-02T00:00:00Z',
  },
  {
    id: 'usr_recruiter_john',
    name: 'John',
    email: 'john@zeptrax.ai',
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
    role: 'candidate', // Approved, can login directly! (enrollmentStatus controls student access)
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
    name: 'Rahul Sharma',
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
    location: 'Mumbai',
    bio: 'Aspiring AI engineer with a background in python programming.',
    experienceYears: 1,
    expectedSalary: '₹8,00,000 / yr',
    availability: 'Immediate',
    openToWork: true,
    domain: 'Engineering',
    skills: ['Python', 'SQL', 'HTML', 'CSS'],
    experience: [],
    education: [],
    certifications: [],
    githubUrl: 'https://github.com/priyapatel',
    portfolioUrl: 'https://priyapatel.dev',
    linkedinUrl: 'https://linkedin.com/in/priyapatel',
    admissionScore: 91,
    applicationProgress: 100,
    enrollmentStatus: 'applicant'
  },
  {
    id: 'prof_rohan',
    userId: 'usr_candidate_rohan',
    fullName: 'Rohan Gupta',
    email: 'rohan@gmail.com',
    phone: '+91-8888888888',
    location: 'Delhi',
    bio: 'Fullstack developer currently enrolled in the AI Boot Camp.',
    experienceYears: 2,
    expectedSalary: '₹12,00,000 / yr',
    availability: '30 Days',
    openToWork: false,
    domain: 'Engineering',
    skills: ['React', 'Node.js'],
    experience: [],
    education: [],
    certifications: [],
    githubUrl: 'https://github.com/rohangupta',
    portfolioUrl: 'https://rohan.dev',
    linkedinUrl: 'https://linkedin.com/in/rohangupta',
    admissionScore: 85,
    applicationProgress: 100,
    enrollmentStatus: 'student'
  },
  {
    id: 'prof_amit',
    userId: 'usr_candidate_amit',
    fullName: 'Amit Sharma',
    email: 'amit@gmail.com',
    phone: '+91-9999999999',
    location: 'Noida',
    bio: 'Wants to build Generative Agents.',
    experienceYears: 0,
    expectedSalary: '₹6,00,000 / yr',
    availability: 'Immediate',
    openToWork: true,
    domain: 'Engineering',
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    githubUrl: '',
    portfolioUrl: '',
    linkedinUrl: '',
    admissionScore: undefined,
    applicationProgress: 100,
    enrollmentStatus: 'applicant'
  },
  {
    id: 'prof_vikram',
    userId: 'usr_candidate_vikram',
    fullName: 'Vikram Singh',
    email: 'vikram@gmail.com',
    phone: '+91-7777777777',
    location: 'Bengaluru',
    bio: 'Interested in DevOps automation.',
    experienceYears: 3,
    expectedSalary: '₹14,00,000 / yr',
    availability: '30 Days',
    openToWork: true,
    domain: 'Engineering',
    skills: ['Kubernetes', 'AWS'],
    experience: [],
    education: [],
    certifications: [],
    githubUrl: 'https://github.com/vikramdevops',
    portfolioUrl: '',
    linkedinUrl: '',
    admissionScore: 88,
    applicationProgress: 100,
    enrollmentStatus: 'applicant'
  },
  {
    id: 'prof_rahul_sharma',
    userId: 'usr_candidate_rahul_sharma',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma98@gmail.com',
    phone: '+91-9123456789',
    location: 'Jaipur, India',
    bio: 'Senior Software Engineer with experience in payment microservices, Spring Boot, React, Node.js, and AWS.',
    experienceYears: 6,
    expectedSalary: '₹18,00,000 / yr',
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
    admissionScore: 94,
    applicationProgress: 100,
    enrollmentStatus: 'applicant'
  }
];

export const INITIAL_CVS: CVItem[] = [
  {
    id: 'cv_priya',
    candidateId: 'usr_candidate_priya',
    title: 'Priya Patel CV',
    isPrimary: true,
    rawText: 'Priya Patel Resume.',
    parsedData: {
      fullName: 'Priya Patel',
      email: 'priya@gmail.com',
      phone: '+91-9876543210',
      location: 'Mumbai',
      summary: 'Aspiring AI engineer.',
      experienceYears: 1,
      expectedSalary: '₹8,0,000 / yr',
      availability: 'Immediate',
      skills: ['Python', 'SQL'],
      experience: [],
      education: [],
      certifications: []
    },
    updatedAt: '2026-01-03T00:00:00Z'
  },
  {
    id: 'cv_vikram',
    candidateId: 'usr_candidate_vikram',
    title: 'Vikram Singh CV',
    isPrimary: true,
    rawText: 'Vikram Singh Resume. DevOps.',
    parsedData: {
      fullName: 'Vikram Singh',
      email: 'vikram@gmail.com',
      phone: '+91-7777777777',
      location: 'Bengaluru',
      summary: 'DevOps Engineer.',
      experienceYears: 3,
      expectedSalary: '₹14,0,000 / yr',
      availability: '30 Days',
      skills: ['Kubernetes', 'AWS'],
      experience: [],
      education: [],
      certifications: []
    },
    updatedAt: '2026-01-06T00:00:00Z'
  }
];

const ZEPTRAX_COURSE_INFO = {
  duration: '3–4 Months',
  schedule: 'Weekend live training — Saturday: 2 hours, Sunday: 2 hours',
  format: '100% online live instructor-led interactive classes',
  contentHours: '150+ hours of expert-led sessions',
  practice: 'Hands-on labs and practical assignments',
  projects: 'Real-time industry projects and a capstone project',
  technology: 'AI tools, Generative AI, and Agentic AI integration',
  experience: 'Internship opportunity on live projects',
  guidance: 'Industry mentor support',
  careerPrep: 'Resume building and interview preparation',
  certification: 'Certification assistance',
  placement: 'Placement assistance',
  entrepreneurship: 'Freelancing and startup guidance',
  access: 'Lifetime access to learning resources and recorded sessions',
  regionalPricing: {
    'United States': 'US$500',
    'European Union': '€500',
    'UAE / Dubai': 'AED 2,500',
    Singapore: 'SGD 600',
    Australia: 'AUS$850',
    India: 'Rs 50,000',
    Russia: 'RUB 50,000',
  },
};

const ZEPTRAX_MASTERS_PROGRAMS: Array<{ id: string; title: string; domain: Job['domain'] }> = [
  { id: 'job_ai_bootcamp', title: 'Masters in AI with Project Management', domain: 'Product' },
  { id: 'job_business_intelligence_bootcamp', title: 'Masters in AI with Business Intelligence', domain: 'Data & AI' },
  { id: 'job_data_science_bootcamp', title: 'Masters in AI with Data Science', domain: 'Data & AI' },
  { id: 'job_business_analysis_bootcamp', title: 'Masters in AI with Business Analysis', domain: 'Product' },
  { id: 'job_aws_cloud_bootcamp', title: 'Masters in AI with AWS Cloud Architect', domain: 'DevOps' },
  { id: 'job_gcp_cloud_bootcamp', title: 'Masters in AI with Google Cloud Architect', domain: 'DevOps' },
  { id: 'job_azure_cloud_bootcamp', title: 'Masters in AI with Microsoft Azure Cloud Architect', domain: 'DevOps' },
  { id: 'job_oracle_cloud_bootcamp', title: 'Masters in AI with Oracle Cloud Architect', domain: 'DevOps' },
  { id: 'job_databricks_bootcamp', title: 'Masters in AI with Databricks', domain: 'Data & AI' },
  { id: 'job_devops_bootcamp', title: 'Masters in AI with AWS DevOps Engineering', domain: 'DevOps' },
  { id: 'job_gcp_devops_bootcamp', title: 'Masters in AI with Google Cloud DevOps Engineering', domain: 'DevOps' },
  { id: 'job_azure_devops_bootcamp', title: 'Masters in AI with Microsoft Azure DevOps Engineering', domain: 'DevOps' },
  { id: 'job_aws_data_engineering_bootcamp', title: 'Masters in AI with AWS Data Engineering', domain: 'Data & AI' },
  { id: 'job_gcp_data_engineering_bootcamp', title: 'Masters in AI with Google Cloud Data Engineering', domain: 'Data & AI' },
  { id: 'job_azure_fabric_bootcamp', title: 'Masters in AI with Microsoft Azure & Microsoft Fabric', domain: 'Data & AI' },
  { id: 'job_oracle_data_engineering_bootcamp', title: 'Masters in AI with Oracle Data Engineering', domain: 'Data & AI' },
  { id: 'job_cortex_snowflake_bootcamp', title: 'Masters in Cortex AI with Snowflake', domain: 'Data & AI' },
  { id: 'job_snowflake_data_bootcamp', title: 'Masters in AI with Snowflake Data Engineering', domain: 'Data & AI' },
  { id: 'job_mlops_bootcamp', title: 'Masters in AI with MLOps Engineering', domain: 'DevOps' },
  { id: 'job_full_stack_bootcamp', title: 'Masters in AI with Full Stack Development', domain: 'Engineering' },
  { id: 'job_blockchain_bootcamp', title: 'Masters in AI with Blockchain Technology', domain: 'Engineering' },
  { id: 'job_cyber_blue_bootcamp', title: 'Masters in AI with Cybersecurity (Blue Team)', domain: 'DevOps' },
  { id: 'job_cyber_red_bootcamp', title: 'Masters in AI with Cybersecurity (Red Team)', domain: 'DevOps' },
  { id: 'job_cloud_security_bootcamp', title: 'Masters in AI with Cloud Security', domain: 'DevOps' },
  { id: 'job_automation_bootcamp', title: 'Masters in AI Automation', domain: 'Data & AI' },
  { id: 'job_product_management_bootcamp', title: 'Masters in AI with Product Management', domain: 'Product' },
  { id: 'job_quantum_bootcamp', title: 'Masters in AI with Quantum Computing', domain: 'Data & AI' },
  { id: 'job_banking_insurance_bootcamp', title: 'Masters in AI with Banking and Insurance', domain: 'Data & AI' },
  { id: 'job_healthcare_bootcamp', title: 'Masters in AI with Healthcare', domain: 'Data & AI' },
  { id: 'job_finance_accounting_bootcamp', title: 'Masters in AI with Finance and Accounting', domain: 'Data & AI' },
];

export const INITIAL_JOBS: Job[] = [
  // 1. Course offerings (Bootcamps)
  {
    id: 'job_ai_bootcamp',
    title: 'Masters in AI with Project Management',
    company: 'Zeptrax AI Academy',
    location: 'Noida & Remote',
    type: 'Full-time',
    domain: 'Data & AI',
    salaryRange: 'Rs 50,000 (India) · Country-wise pricing available',
    description: 'Course offering. A comprehensive 24-week professional program building production-ready generative and agentic AI systems.',
    requirements: ['Python Programming', 'Machine Learning Foundations', 'APIs and Integrations', 'RAG Pipelines'],
    status: 'active',
    postedBy: 'usr_super_admin',
    createdAt: '2026-01-01T00:00:00Z',
    interviewTypeDefault: 'ai'
    ,courseInfo: ZEPTRAX_COURSE_INFO
  },
  {
    id: 'job_devops_bootcamp',
    title: 'Masters in AI with AWS DevOps Engineering',
    company: 'Zeptrax AI Academy',
    location: 'Bengaluru & Remote',
    type: 'Hybrid',
    domain: 'DevOps',
    salaryRange: 'Rs 50,000 (India) · Country-wise pricing available',
    description: 'Course offering. Master CI/CD pipelines, Kubernetes scheduling, infrastructure as code, and cloud solutions automation.',
    requirements: ['Kubernetes', 'AWS Solutions Architect', 'Docker Containerization', 'Terraform (IaC)'],
    status: 'active',
    postedBy: 'usr_super_admin',
    createdAt: '2026-01-02T00:00:00Z',
    interviewTypeDefault: 'ai',
    courseInfo: ZEPTRAX_COURSE_INFO
  },
  ...ZEPTRAX_MASTERS_PROGRAMS
    .filter((program) => program.id !== 'job_ai_bootcamp' && program.id !== 'job_devops_bootcamp')
    .map((program) => ({
      id: program.id,
      title: program.title,
      company: 'Zeptrax AI Edutech',
      location: '100% Online Live',
      type: 'Remote' as const,
      domain: program.domain,
      salaryRange: 'Rs 50,000 (India) · Country-wise pricing available',
      description: `${program.title}. Industry-focused master's program for high-demand AI careers with live training, practical labs, real-world projects, and career support.`,
      requirements: ['Interest in AI and technology', 'Computer with internet access', 'Commitment to weekend live training'],
      status: 'active' as const,
      postedBy: 'usr_super_admin',
      createdAt: '2026-01-01T00:00:00Z',
      interviewTypeDefault: 'ai' as const,
      courseInfo: ZEPTRAX_COURSE_INFO,
    })),
  // 2. Careers Job Postings
  {
    id: 'job_senior_dev',
    title: 'Senior Software Developer',
    company: 'Zeptrax Tech Corp',
    location: 'Noida Office',
    type: 'Full-time',
    domain: 'Engineering',
    salaryRange: '₹12,00,000 - ₹22,00,000 / yr',
    description: 'Job Posting. Join the AI Engineering Team developing next-gen agentic workflows.',
    requirements: ['Python', 'FastAPI', 'PyTorch', 'Docker'],
    status: 'active',
    postedBy: 'usr_recruiter_rahul',
    createdAt: '2026-01-03T00:00:00Z',
    interviewTypeDefault: 'ai'
  },
  {
    id: 'job_security_analyst',
    title: 'Cybersecurity Specialist',
    company: 'Zeptrax Tech Corp',
    location: 'Remote',
    type: 'Full-time',
    domain: 'DevOps',
    salaryRange: '₹14,00,000 - ₹24,00,000 / yr',
    description: 'Job Posting. Audit cloud security configurations and configure threat detection protocols.',
    requirements: ['Cloud Security', 'Kubernetes Security', 'IAM auditing'],
    status: 'active',
    postedBy: 'usr_recruiter_john',
    createdAt: '2026-01-04T00:00:00Z',
    interviewTypeDefault: 'ai'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  // Course applications (Visible to Admin / Super Admin)
  {
    id: 'app_priya',
    jobId: 'job_ai_bootcamp',
    candidateId: 'usr_candidate_priya',
    cvId: 'cv_priya',
    status: 'shortlisted',
    stage: 2,
    interviewType: 'ai',
    appliedAt: '2026-01-03T10:00:00Z'
  },
  {
    id: 'app_vikram',
    jobId: 'job_devops_bootcamp',
    candidateId: 'usr_candidate_vikram',
    cvId: 'cv_vikram',
    status: 'shortlisted',
    stage: 2,
    interviewType: 'ai',
    appliedAt: '2026-01-06T10:00:00Z'
  },
  // Job applications (Visible to recruiters)
  {
    id: 'app_amit_job',
    jobId: 'job_senior_dev',
    candidateId: 'usr_candidate_amit',
    cvId: 'no_cv',
    status: 'applied', // Pending Review by Rahul
    stage: 1,
    interviewType: 'ai',
    appliedAt: '2026-01-05T10:00:00Z'
  }
];

export const INITIAL_INTERVIEWS: InterviewRecord[] = [];

export const INITIAL_OFFER_TEMPLATES: OfferTemplate[] = [
  {
    id: 'tmpl_standard_tech',
    name: 'Zeptrax AI Master Bootcamp Admission Confirmation',
    companyName: 'Zeptrax AI Academy',
    headerText: 'ADMISSION LETTER — ZEPTRAX AI BOOTCAMP',
    bodyTemplate: 'Dear {{candidate_name}},\n\nWe are thrilled to offer you admission into the {{role}} at {{company_name}}! Based on your outstanding interview performance and tech profile, we believe you are fully prepared for this rigorous cohort.\n\nYour program effective start date will be {{joining_date}}. Upon accepting, you will gain access to your Student Workspace.',
    benefitsList: [
      'Interactive Live Classes & 24/7 Slack/Discord Community support',
      'Hands-on Lab environments with GPU resources for AI Model Fine-Tuning',
      'Blockchain-verified shareable Graduation Badge & Master Certification',
      '1-on-1 career assistance and hiring partner catalog matching'
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
