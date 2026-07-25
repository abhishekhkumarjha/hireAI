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
  }
];

export const INITIAL_CANDIDATE_PROFILES: CandidateProfile[] = [];

export const INITIAL_CVS: CVItem[] = [];

export const INITIAL_JOBS: Job[] = [];

export const INITIAL_APPLICATIONS: Application[] = [];

export const INITIAL_INTERVIEWS: InterviewRecord[] = [];

export const INITIAL_OFFER_TEMPLATES: OfferTemplate[] = [
  {
    id: 'tmpl_standard_tech',
    name: 'Standard Senior Engineering Offer Template',
    companyName: 'TechScale Innovations',
    headerText: 'OFFER OF EMPLOYMENT — TECHSCALE INNOVATIONS',
    bodyTemplate: 'Dear {{candidate_name}},\n\nWe are thrilled to offer you the position of {{role}} at {{company_name}}! Based on your outstanding interview performance and deep expertise, we believe you will be a transformative addition to our engineering organization.\n\nYour starting compensation will be {{salary}} per annum, effective from your joining date on {{joining_date}}.\n\nWe look forward to building the future of software with you!',
    benefitsList: [
      'Comprehensive Health, Dental, and Vision Coverage (100% employer paid)',
      'Flexible Remote Work & ₹50,000 Home Office Equipment Allowance',
      'Provident Fund (PF) Matching up to 12% with immediate vesting',
      'Unlimited Paid Time Off (PTO) & Annual Learning Stipend (₹1,50,000)'
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
