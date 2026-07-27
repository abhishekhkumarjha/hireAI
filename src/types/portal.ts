export type UserRole = 'super_admin' | 'admin' | 'recruiter' | 'candidate';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  provider: 'google' | 'github' | 'facebook' | 'email';
  providerId?: string;
  createdBy?: string;
  createdAt: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

export interface ParsedCVData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experienceYears: number;
  expectedSalary: string;
  availability: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
}

export interface CVItem {
  id: string;
  candidateId: string;
  title: string; // e.g. "Frontend CV", "Full-stack CV"
  isPrimary: boolean;
  fileUrl?: string;
  rawText?: string;
  parsedData: ParsedCVData;
  updatedAt: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar?: string;
  experienceYears: number;
  expectedSalary: string;
  availability: 'Immediate' | '15 Days' | '30 Days' | '60 Days';
  openToWork: boolean;
  domain: string;
  skills: string[];
  primaryCvId?: string;
  experience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  githubUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  admissionScore?: number;
  applicationProgress?: number;
  enrollmentStatus?: 'applicant' | 'student' | 'free_learner';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote' | 'Hybrid';
  domain: 'Engineering' | 'Product' | 'Design' | 'Data & AI' | 'DevOps' | 'Marketing';
  salaryRange: string;
  description: string;
  requirements: string[];
  status: 'active' | 'closed' | 'draft';
  postedBy: string; // userId
  createdAt: string;
  interviewTypeDefault: 'ai' | 'human';
  courseInfo?: CourseInfo;
}

export interface CourseInfo {
  duration: string;
  schedule: string;
  format: string;
  contentHours: string;
  practice: string;
  projects: string;
  technology: string;
  experience: string;
  guidance: string;
  careerPrep: string;
  certification: string;
  placement: string;
  entrepreneurship: string;
  access: string;
  regionalPricing: Record<string, string>;
}

export type ApplicationStage = 1 | 2 | 3 | 4; 
// 1: Auto-schedule Screening Call
// 2: AI / Human Interview
// 3: Decision (Selected/Rejected/Hold)
// 4: Auto Offer Letter Generation

export type ApplicationStatus = 
  | 'applied' 
  | 'shortlisted' 
  | 'screening_scheduled' 
  | 'interviewing' 
  | 'selected' 
  | 'rejected' 
  | 'hold' 
  | 'offer_sent' 
  | 'offer_accepted' 
  | 'offer_declined';

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  cvId: string;
  status: ApplicationStatus;
  stage: ApplicationStage;
  interviewType: 'ai' | 'human';
  appliedAt: string;
  screeningSlot?: string;
  notes?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Technical' | 'Behavioral' | 'System Design' | 'Problem Solving';
  candidateAnswer?: string;
  score?: number; // 0 - 100
  feedback?: string;
}

export interface InterviewRecord {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  type: 'ai' | 'human';
  scheduledAt: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  questions: InterviewQuestion[];
  overallScore?: number;
  technicalScore?: number;
  communicationScore?: number;
  relevanceScore?: number;
  summary?: string;
  transcript?: { speaker: string; text: string; time: string }[];
  videoCallUrl?: string;
  completedAt?: string;
}

export interface OfferTemplate {
  id: string;
  name: string;
  companyName: string;
  headerText: string;
  bodyTemplate: string;
  benefitsList: string[];
}

export interface OfferLetter {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  templateId: string;
  candidateName: string;
  role: string;
  companyName: string;
  salary: string;
  joiningDate: string;
  benefits: string[];
  content: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  sentAt?: string;
  respondedAt?: string;
}

export interface InviteToken {
  id: string;
  invitedBy: string;
  invitedByName: string;
  role: 'admin' | 'recruiter';
  email: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: string;
  createdAt: string;
}

export interface AISearchResult {
  candidateId: string;
  matchPercentage: number;
  relevanceReasoning: string;
  matchedSkills: string[];
  missingSkills: string[];
  highlights: string[];
}

export interface SearchChatMessage {
  id: string;
  sender: 'recruiter' | 'assistant';
  text: string;
  timestamp: string;
}


export interface PermissionMatrixItem {
  action: string;
  superAdmin: boolean;
  admin: boolean;
  recruiter: 'all' | 'own' | 'per_job' | 'template' | false;
  candidate: 'own' | 'receives' | 'attends' | false;
}
