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
  githubUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
}

export interface CVItem {
  id: string;
  candidateId: string;
  title: string;
  isPrimary: boolean;
  fileUrl?: string;
  rawText?: string;
  parsedData: ParsedCVData;
  uploadedAt: string;
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
  currentSalary?: string;
  availability: 'Immediate' | '15 Days' | '30 Days' | '60 Days';
  noticePeriod?: string;
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
  profileCompletion: number;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  workMode: 'remote' | 'hybrid' | 'onsite';
  employmentType: 'full_time' | 'part_time' | 'contract' | 'internship';
  domain: 'Engineering' | 'Product' | 'Design' | 'Data & AI' | 'DevOps' | 'Marketing' | 'Sales' | 'HR';
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  minimumExperience: number;
  maximumExperience: number;
  educationRequirements: string[];
  certifications: string[];
  noticePeriodRequirement?: string;
  numberOfOpenings: number;
  status: 'draft' | 'published' | 'paused' | 'closed';
  postedBy: string; // userId
  assignedRecruiter?: string;
  hiringManager?: string;
  interviewProcess?: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export type ApplicationStage = 
  | 'applied'
  | 'ai_screening'
  | 'under_review'
  | 'shortlisted'
  | 'recruiter_screening'
  | 'technical_interview'
  | 'system_design'
  | 'final_interview'
  | 'decision_pending'
  | 'selected'
  | 'rejected'
  | 'hold'
  | 'offer_draft'
  | 'offer_sent'
  | 'offer_accepted'
  | 'offer_declined'
  | 'hired'
  | 'withdrawn';

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  cvId: string;
  status: ApplicationStage;
  stage: number; // For compatibility (1, 2, 3, 4)
  interviewType: 'ai' | 'human'; // For fallback compatibility
  aiMatchScore?: number;
  aiMatchReasoning?: string;
  matchedSkills?: string[];
  missingSkills?: string[];
  recruiterNotes?: string;
  assignedRecruiter?: string;
  hiringManager?: string;
  source?: string;
  appliedAt: string;
  updatedAt: string;
  screeningSlot?: string;
}

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  eventType: string;
  previousStatus?: ApplicationStage;
  newStatus?: ApplicationStage;
  message: string;
  metadata?: any;
  createdAt: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Technical' | 'Behavioral' | 'System Design' | 'Problem Solving' | 'Role Specific';
  candidateAnswer?: string;
  score?: number; // 0 - 100
  feedback?: string;
}

export interface InterviewRecord {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  type: 'ai' | 'human' | 'panel';
  interviewRound?: string;
  interviewerIds?: string[];
  scheduledAt: string;
  duration?: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  questions: InterviewQuestion[];
  overallScore?: number;
  technicalScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  roleRelevanceScore?: number;
  summary?: string;
  recommendation?: 'Strong Hire' | 'Hire' | 'Hold' | 'Reject';
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
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
  sentAt?: string;
  respondedAt?: string;
  candidateResponse?: string;
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
  experienceMatch?: number;
  skillMatch?: number;
  locationMatch?: number;
  availabilityMatch?: number;
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

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  ipAddress?: string;
  details?: string;
  createdAt: string;
}
