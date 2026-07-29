import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  CandidateProfile,
  CVItem,
  ParsedCVData,
  Job,
  Application,
  InterviewRecord,
  OfferTemplate,
  OfferLetter,
  InviteToken,
  AISearchResult,
  ApplicationStatus,
  ApplicationStage,
  SearchChatMessage,
  PermissionMatrixItem,
} from '../types/portal';
import {
  INITIAL_USERS,
  INITIAL_CANDIDATE_PROFILES,
  INITIAL_CVS,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_INTERVIEWS,
  INITIAL_OFFER_TEMPLATES,
  INITIAL_OFFER_LETTERS,
  INITIAL_INVITE_TOKENS,
  PERMISSION_MATRIX,
} from '../data/initialData';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

interface PortalContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  candidateProfiles: CandidateProfile[];
  cvs: CVItem[];
  jobs: Job[];
  applications: Application[];
  interviews: InterviewRecord[];
  offerTemplates: OfferTemplate[];
  offerLetters: OfferLetter[];
  invites: InviteToken[];
  aiSearchResults: { [candidateId: string]: AISearchResult } | null;
  aiSearchCriteria: any | null;
  isAiSearching: boolean;
  searchChatHistory: SearchChatMessage[];
  permissionMatrix: PermissionMatrixItem[];

  // Actions
  switchRole: (role: UserRole) => void;
  createJob: (jobData: Omit<Job, 'id' | 'createdAt' | 'postedBy'>) => Job;
  updateJob: (job: Job) => void;
  applyForJob: (jobId: string, cvId: string) => Application;
  updateApplicationStage: (appId: string, stage: ApplicationStage, status: ApplicationStatus, notes?: string) => void;
  parseCVAndSave: (rawText: string, cvTitle: string) => Promise<CVItem>;
  addParsedCVItem: (parsedData: ParsedCVData, title: string, rawText: string) => CVItem;
  runAISearch: (query: string, isRefinement?: boolean) => Promise<void>;
  clearSearchChat: () => void;
  scheduleScreeningCall: (appId: string, timeSlot: string) => void;
  startAIInterview: (appId: string) => Promise<InterviewRecord>;
  submitAIInterviewAnswers: (interviewId: string, answers: { questionId: string; answer: string }[]) => Promise<void>;
  releaseOfferLetter: (appId: string, salary: string, joiningDate: string, customNotes?: string) => Promise<OfferLetter>;
  respondToOffer: (offerId: string, response: 'accepted' | 'declined') => void;
  createInvite: (role: 'admin' | 'recruiter', email: string) => InviteToken;
  updateProfile: (profile: CandidateProfile) => void;
  loginUser: (email: string, password?: string) => boolean;
  signupCandidate: (name: string, email: string, password?: string, provider?: any) => User;
  signupViaInvite: (name: string, email: string, password?: string, token?: string, provider?: any) => User | null;
  logoutUser: () => void;
  deleteUser: (userId: string) => boolean;
  updateOfferTemplate: (template: OfferTemplate) => void;
  associateCandidateWithJob: (candidateId: string, jobId: string) => Application;
  addManualInterviewEvaluation: (appId: string, evaluation: { overallScore: number; technicalScore: number; communicationScore: number; relevanceScore: number; summary: string }) => void;
  submitAdmissionsApplication: (name: string, email: string, password?: string, profileDetails?: any, jobId?: string) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('hireai_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hireai_current_user');
    return saved ? JSON.parse(saved) : null; // Defaults to null for login view
  });

  const [candidateProfiles, setCandidateProfiles] = useState<CandidateProfile[]>(() => {
    const saved = localStorage.getItem('hireai_candidate_profiles');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATE_PROFILES;
  });

  const [cvs, setCvs] = useState<CVItem[]>(() => {
    const saved = localStorage.getItem('hireai_cvs');
    return saved ? JSON.parse(saved) : INITIAL_CVS;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('hireai_jobs');
    if (!saved) return INITIAL_JOBS;
    const savedJobs: Job[] = JSON.parse(saved);
    const savedById = new Map(savedJobs.map((job) => [job.id, job]));
    const mergedInitialJobs = INITIAL_JOBS.map((job) => {
      const savedJob = savedById.get(job.id);
      const isCourse = job.id.includes('bootcamp');
      return {
        ...job,
        ...savedJob,
        // The supplied country-wise price schedule is authoritative for every master's course.
        ...(isCourse ? {
          salaryRange: job.salaryRange,
          courseInfo: job.courseInfo ? {
            ...job.courseInfo,
            ...savedJob?.courseInfo,
            regionalPricing: job.courseInfo.regionalPricing,
          } : savedJob?.courseInfo,
        } : {}),
      };
    });
    const customJobs = savedJobs.filter((job) => !INITIAL_JOBS.some((initialJob) => initialJob.id === job.id));
    // Preserve administrator changes while adding newly published master programs
    // and their structured PDF-derived course information to existing portals.
    return [...mergedInitialJobs, ...customJobs];
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('hireai_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [interviews, setInterviews] = useState<InterviewRecord[]>(() => {
    const saved = localStorage.getItem('hireai_interviews');
    return saved ? JSON.parse(saved) : INITIAL_INTERVIEWS;
  });

  const [offerTemplates, setOfferTemplates] = useState<OfferTemplate[]>(() => {
    const saved = localStorage.getItem('hireai_offer_templates');
    return saved ? JSON.parse(saved) : INITIAL_OFFER_TEMPLATES;
  });

  const [offerLetters, setOfferLetters] = useState<OfferLetter[]>(() => {
    const saved = localStorage.getItem('hireai_offer_letters');
    return saved ? JSON.parse(saved) : INITIAL_OFFER_LETTERS;
  });

  const [invites, setInvites] = useState<InviteToken[]>(() => {
    const saved = localStorage.getItem('hireai_invites');
    return saved ? JSON.parse(saved) : INITIAL_INVITE_TOKENS;
  });

  const [searchChatHistory, setSearchChatHistory] = useState<SearchChatMessage[]>(() => {
    const saved = localStorage.getItem('hireai_search_chat_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [aiSearchResults, setAiSearchResults] = useState<{ [candidateId: string]: AISearchResult } | null>(null);
  const [aiSearchCriteria, setAiSearchCriteria] = useState<any | null>(null);
  const [isAiSearching, setIsAiSearching] = useState<boolean>(false);
  const [permissionMatrix] = useState<PermissionMatrixItem[]>(PERMISSION_MATRIX);

  const lastSyncedRefs = React.useRef<{ [key: string]: string }>({});

  const syncCollection = async (collection: string, data: any) => {
    const dataStr = JSON.stringify(data);
    if (lastSyncedRefs.current[collection] === dataStr) return;
    lastSyncedRefs.current[collection] = dataStr;

    try {
      await fetch(`${API_BASE}/api/db/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection, data }),
      });
    } catch (err) {
      console.error(`Failed to sync collection ${collection}:`, err);
    }
  };

  // Fetch remote database on startup
  useEffect(() => {
    const fetchDb = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/db`);
        const result = await res.json();
        if (result.success && result.db) {
          const db = result.db;
          if (db.users) {
            setUsers(db.users);
            lastSyncedRefs.current['users'] = JSON.stringify(db.users);
          }
          if (db.candidateProfiles) {
            setCandidateProfiles(db.candidateProfiles);
            lastSyncedRefs.current['candidateProfiles'] = JSON.stringify(db.candidateProfiles);
          }
          if (db.cvs) {
            setCvs(db.cvs);
            lastSyncedRefs.current['cvs'] = JSON.stringify(db.cvs);
          }
          if (db.jobs) {
            setJobs(db.jobs);
            lastSyncedRefs.current['jobs'] = JSON.stringify(db.jobs);
          }
          if (db.applications) {
            setApplications(db.applications);
            lastSyncedRefs.current['applications'] = JSON.stringify(db.applications);
          }
          if (db.interviews) {
            setInterviews(db.interviews);
            lastSyncedRefs.current['interviews'] = JSON.stringify(db.interviews);
          }
          if (db.offerTemplates) {
            setOfferTemplates(db.offerTemplates);
            lastSyncedRefs.current['offerTemplates'] = JSON.stringify(db.offerTemplates);
          }
          if (db.offerLetters) {
            setOfferLetters(db.offerLetters);
            lastSyncedRefs.current['offerLetters'] = JSON.stringify(db.offerLetters);
          }
          if (db.invites) {
            setInvites(db.invites);
            lastSyncedRefs.current['invites'] = JSON.stringify(db.invites);
          }
          if (db.searchChatHistory) {
            setSearchChatHistory(db.searchChatHistory);
            lastSyncedRefs.current['searchChatHistory'] = JSON.stringify(db.searchChatHistory);
          }
        }
      } catch (err) {
        console.error('Failed to fetch initial database from backend:', err);
      }
    };
    fetchDb();
  }, []);

  // Sync to localStorage and Remote DB
  useEffect(() => { 
    localStorage.setItem('hireai_users', JSON.stringify(users)); 
    syncCollection('users', users);
  }, [users]);

  useEffect(() => { 
    if (currentUser) {
      localStorage.setItem('hireai_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hireai_current_user');
    }
  }, [currentUser]);

  useEffect(() => { 
    localStorage.setItem('hireai_candidate_profiles', JSON.stringify(candidateProfiles)); 
    syncCollection('candidateProfiles', candidateProfiles);
  }, [candidateProfiles]);

  useEffect(() => { 
    localStorage.setItem('hireai_cvs', JSON.stringify(cvs)); 
    syncCollection('cvs', cvs);
  }, [cvs]);

  useEffect(() => { 
    localStorage.setItem('hireai_jobs', JSON.stringify(jobs)); 
    syncCollection('jobs', jobs);
  }, [jobs]);

  useEffect(() => { 
    localStorage.setItem('hireai_applications', JSON.stringify(applications)); 
    syncCollection('applications', applications);
  }, [applications]);

  useEffect(() => { 
    localStorage.setItem('hireai_interviews', JSON.stringify(interviews)); 
    syncCollection('interviews', interviews);
  }, [interviews]);

  useEffect(() => { 
    localStorage.setItem('hireai_offer_templates', JSON.stringify(offerTemplates)); 
    syncCollection('offerTemplates', offerTemplates);
  }, [offerTemplates]);

  useEffect(() => { 
    localStorage.setItem('hireai_offer_letters', JSON.stringify(offerLetters)); 
    syncCollection('offerLetters', offerLetters);
  }, [offerLetters]);

  useEffect(() => { 
    localStorage.setItem('hireai_invites', JSON.stringify(invites)); 
    syncCollection('invites', invites);
  }, [invites]);

  useEffect(() => { 
    localStorage.setItem('hireai_search_chat_history', JSON.stringify(searchChatHistory)); 
    syncCollection('searchChatHistory', searchChatHistory);
  }, [searchChatHistory]);

  // Clean old mock data if present to ensure 1 admin and fresh signup states
  useEffect(() => {
    const raw = localStorage.getItem('hireai_users');
    if (raw && !raw.includes('abhishek.jha@cloudinntech.co.in')) {
      localStorage.clear();
      window.location.reload();
    }
  }, []);

  // Real-time synchronization listener across browser tabs/portals
  useEffect(() => {
    const handleStorageSync = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        if (e.key === 'hireai_users') setUsers(parsed);
        if (e.key === 'hireai_candidate_profiles') setCandidateProfiles(parsed);
        if (e.key === 'hireai_cvs') setCvs(parsed);
        if (e.key === 'hireai_jobs') setJobs(parsed);
        if (e.key === 'hireai_applications') setApplications(parsed);
        if (e.key === 'hireai_interviews') setInterviews(parsed);
        if (e.key === 'hireai_offer_templates') setOfferTemplates(parsed);
        if (e.key === 'hireai_offer_letters') setOfferLetters(parsed);
        if (e.key === 'hireai_invites') setInvites(parsed);
        if (e.key === 'hireai_search_chat_history') setSearchChatHistory(parsed);
        if (e.key === 'hireai_current_user') setCurrentUser(parsed);
      } catch (err) {
        console.error('Error syncing storage key', e.key, err);
      }
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  // Polling mechanism for cross-portal/cross-domain remote database sync
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/db`);
        const result = await res.json();
        if (result.success && result.db) {
          const db = result.db;
          
          if (db.users) {
            const dataStr = JSON.stringify(db.users);
            if (dataStr !== JSON.stringify(users)) {
              setUsers(db.users);
              lastSyncedRefs.current['users'] = dataStr;
            }
          }
          if (db.candidateProfiles) {
            const dataStr = JSON.stringify(db.candidateProfiles);
            if (dataStr !== JSON.stringify(candidateProfiles)) {
              setCandidateProfiles(db.candidateProfiles);
              lastSyncedRefs.current['candidateProfiles'] = dataStr;
            }
          }
          if (db.cvs) {
            const dataStr = JSON.stringify(db.cvs);
            if (dataStr !== JSON.stringify(cvs)) {
              setCvs(db.cvs);
              lastSyncedRefs.current['cvs'] = dataStr;
            }
          }
          if (db.jobs) {
            const dataStr = JSON.stringify(db.jobs);
            if (dataStr !== JSON.stringify(jobs)) {
              setJobs(db.jobs);
              lastSyncedRefs.current['jobs'] = dataStr;
            }
          }
          if (db.applications) {
            const dataStr = JSON.stringify(db.applications);
            if (dataStr !== JSON.stringify(applications)) {
              setApplications(db.applications);
              lastSyncedRefs.current['applications'] = dataStr;
            }
          }
          if (db.interviews) {
            const dataStr = JSON.stringify(db.interviews);
            if (dataStr !== JSON.stringify(interviews)) {
              setInterviews(db.interviews);
              lastSyncedRefs.current['interviews'] = dataStr;
            }
          }
          if (db.offerTemplates) {
            const dataStr = JSON.stringify(db.offerTemplates);
            if (dataStr !== JSON.stringify(offerTemplates)) {
              setOfferTemplates(db.offerTemplates);
              lastSyncedRefs.current['offerTemplates'] = dataStr;
            }
          }
          if (db.offerLetters) {
            const dataStr = JSON.stringify(db.offerLetters);
            if (dataStr !== JSON.stringify(offerLetters)) {
              setOfferLetters(db.offerLetters);
              lastSyncedRefs.current['offerLetters'] = dataStr;
            }
          }
          if (db.invites) {
            const dataStr = JSON.stringify(db.invites);
            if (dataStr !== JSON.stringify(invites)) {
              setInvites(db.invites);
              lastSyncedRefs.current['invites'] = dataStr;
            }
          }
          if (db.searchChatHistory) {
            const dataStr = JSON.stringify(db.searchChatHistory);
            if (dataStr !== JSON.stringify(searchChatHistory)) {
              setSearchChatHistory(db.searchChatHistory);
              lastSyncedRefs.current['searchChatHistory'] = dataStr;
            }
          }
        }
      } catch (err) {
        console.error('Failed to sync-poll from remote database:', err);
      }
    }, 5000); // Poll every 5 seconds for backend updates

    return () => clearInterval(pollInterval);
  }, [users, candidateProfiles, cvs, jobs, applications, interviews, offerTemplates, offerLetters, invites, searchChatHistory]);

  const switchRole = (role: UserRole) => {
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
    }
  };

  const loginUser = (email: string, password?: string): boolean => {
    if (!password || password.length < 6) {
      return false;
    }
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (found.password && found.password !== password) {
        return false;
      }
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const deleteUser = (userId: string): boolean => {
    if (currentUser?.role !== 'super_admin' || userId === currentUser.id) return false;
    const target = users.find((user) => user.id === userId);
    // Super-admin accounts are protected to avoid removing the platform authority.
    if (!target || target.role === 'super_admin') return false;

    setUsers((prev) => prev.filter((user) => user.id !== userId));

    if (target.role === 'candidate') {
      setCandidateProfiles((prev) => prev.filter((profile) => profile.userId !== userId));
      setCvs((prev) => prev.filter((cv) => cv.candidateId !== userId));
      setApplications((prev) => prev.filter((application) => application.candidateId !== userId));
      setInterviews((prev) => prev.filter((interview) => interview.candidateId !== userId));
      setOfferLetters((prev) => prev.filter((offer) => offer.candidateId !== userId));
    } else {
      // Keep organisational records available, but transfer listings to Super Admin ownership.
      setJobs((prev) => prev.map((job) => job.postedBy === userId ? { ...job, postedBy: currentUser.id } : job));
    }

    setInvites((prev) => prev.filter((invite) => invite.email.toLowerCase() !== target.email.toLowerCase()));
    return true;
  };

  const signupCandidate = (name: string, email: string, password?: string, provider: User['provider'] = 'email'): User => {
    if (provider === 'email' && (!password || password.length < 6)) {
      throw new Error('Password must be at least 6 characters');
    }
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already registered');
    }
    const newUser: User = {
      id: `usr_cand_${Date.now()}`,
      name,
      email,
      password,
      role: 'candidate',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      provider,
      createdAt: new Date().toISOString()
    };
    
    const newProfile: CandidateProfile = {
      id: `prof_${Date.now()}`,
      userId: newUser.id,
      fullName: name,
      email,
      phone: '',
      location: 'Remote Friendly',
      bio: `Candidate registered via ${provider}`,
      avatar: newUser.avatar,
      experienceYears: 0,
      expectedSalary: '₹8,00,000 / yr',
      availability: 'Immediate',
      openToWork: true,
      domain: 'Engineering',
      skills: [],
      experience: [],
      education: [],
      certifications: []
    };
    
    setUsers(prev => [...prev, newUser]);
    setCandidateProfiles(prev => [...prev, newProfile]);
    setCurrentUser(newUser);
    return newUser;
  };

  const signupViaInvite = (name: string, email: string, password?: string, token?: string, provider: User['provider'] = 'email'): User | null => {
    if (provider === 'email' && (!password || password.length < 6)) {
      throw new Error('Password must be at least 6 characters');
    }
    const inviteIdx = invites.findIndex(inv => inv.token === token && inv.status === 'pending');
    if (inviteIdx === -1) return null;
    
    const invite = invites[inviteIdx];
    
    setInvites(prev => prev.map((inv, idx) => idx === inviteIdx ? { ...inv, status: 'accepted' } : inv));
    
    const newUser: User = {
      id: `usr_${invite.role}_${Date.now()}`,
      name,
      email: invite.email,
      password,
      role: invite.role,
      avatar: invite.role === 'admin' 
        ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      provider,
      createdBy: invite.invitedBy,
      createdAt: new Date().toISOString()
    };
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const updateOfferTemplate = (updated: OfferTemplate) => {
    setOfferTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const clearSearchChat = () => {
    setSearchChatHistory([]);
  };

  const createJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'postedBy'>): Job => {
    if (!currentUser || currentUser.role === 'candidate') {
      throw new Error('Only administrators and recruiters can create listings.');
    }
    const newJob: Job = {
      ...jobData,
      id: `job_${Date.now()}`,
      createdAt: new Date().toISOString(),
      postedBy: currentUser?.id || 'usr_super_admin',
    };
    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  };

  const updateJob = (updated: Job) => {
    const existing = jobs.find((job) => job.id === updated.id);
    if (!existing || !currentUser) return;
    const isCourse = existing.id.includes('bootcamp');
    const canEdit = currentUser.role === 'super_admin'
      || (currentUser.role === 'admin' && isCourse)
      || (currentUser.role === 'recruiter' && !isCourse && existing.postedBy === currentUser.id);
    if (!canEdit) return;
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
  };

  const updateProfile = (updated: CandidateProfile) => {
    setCandidateProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const applyForJob = (jobId: string, cvId: string): Application => {
    const newApp: Application = {
      id: `app_${Date.now()}`,
      jobId,
      candidateId: currentUser?.id || '',
      cvId,
      status: 'applied',
      stage: 1,
      interviewType: 'ai',
      appliedAt: new Date().toISOString(),
    };
    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const associateCandidateWithJob = (candidateId: string, jobId: string): Application => {
    const candidateCvs = cvs.filter(c => c.candidateId === candidateId);
    const primaryCv = candidateCvs.find(c => c.isPrimary) || candidateCvs[0];
    const newApp: Application = {
      id: `app_${Date.now()}`,
      jobId,
      candidateId,
      cvId: primaryCv ? primaryCv.id : 'no_cv',
      status: 'applied',
      stage: 1,
      interviewType: 'ai',
      appliedAt: new Date().toISOString(),
    };
    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const addManualInterviewEvaluation = (appId: string, evaluation: { overallScore: number; technicalScore: number; communicationScore: number; relevanceScore: number; summary: string }) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;
    
    const newRecord: InterviewRecord = {
      id: `int_${Date.now()}`,
      applicationId: appId,
      jobId: app.jobId,
      candidateId: app.candidateId,
      type: 'human',
      scheduledAt: new Date().toISOString(),
      status: 'completed',
      completedAt: new Date().toISOString(),
      overallScore: evaluation.overallScore,
      technicalScore: evaluation.technicalScore,
      communicationScore: evaluation.communicationScore,
      relevanceScore: evaluation.relevanceScore,
      summary: evaluation.summary,
      questions: []
    };
    
    setInterviews(prev => [newRecord, ...prev.filter(i => i.applicationId !== appId)]);
    updateApplicationStage(appId, 3, 'selected', 'Human interview completed and graded.');
  };

  const updateApplicationStage = (
    appId: string,
    stage: ApplicationStage,
    status: ApplicationStatus,
    notes?: string
  ) => {
    const target = applications.find((application) => application.id === appId);
    const targetJob = target && jobs.find((job) => job.id === target.jobId);
    if (!target || !targetJob || !currentUser) return;
    const isCourse = targetJob.id.includes('bootcamp');
    const canUpdate = currentUser.role === 'super_admin'
      || (currentUser.role === 'admin' && isCourse)
      || (currentUser.role === 'recruiter' && !isCourse && targetJob.postedBy === currentUser.id)
      || (currentUser.role === 'candidate' && target.candidateId === currentUser.id);
    if (!canUpdate) return;
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              stage,
              status,
              notes: notes || app.notes,
            }
          : app
      )
    );
  };

  const parseCVAndSave = async (rawText: string, cvTitle: string): Promise<CVItem> => {
    const res = await fetch(`${API_BASE}/api/parse-cv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvText: rawText }),
    });

    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to parse resume');
    }

    const parsedData = result.data;
    const newCv: CVItem = {
      id: `cv_${Date.now()}`,
      candidateId: currentUser?.id || '',
      title: cvTitle || `${parsedData.fullName || 'Parsed'} Resume`,
      isPrimary: true,
      rawText,
      parsedData,
      updatedAt: new Date().toISOString(),
    };

    setCvs((prev) => [newCv, ...prev]);

    // Update profile if candidate
    setCandidateProfiles((prev) => {
      const existing = prev.find((p) => p.userId === currentUser?.id);
      if (existing) {
        return prev.map((p) =>
          p.userId === currentUser?.id
            ? {
                ...p,
                skills: Array.from(new Set([...p.skills, ...(parsedData.skills || [])])),
                experienceYears: parsedData.experienceYears || p.experienceYears,
                expectedSalary: parsedData.expectedSalary || p.expectedSalary,
                experience: parsedData.experience?.length ? parsedData.experience : p.experience,
                education: parsedData.education?.length ? parsedData.education : p.education,
                primaryCvId: newCv.id,
              }
            : p
        );
      }
      return prev;
    });

    return newCv;
  };

  const addParsedCVItem = (parsedData: ParsedCVData, title: string, rawText: string): CVItem => {
    const newCv: CVItem = {
      id: `cv_${Date.now()}`,
      candidateId: currentUser?.id || '',
      title: title || `${parsedData.fullName || 'Parsed'} Resume`,
      isPrimary: true,
      rawText,
      parsedData,
      updatedAt: new Date().toISOString(),
    };

    setCvs((prev) => [newCv, ...prev].map(c => c.id === newCv.id ? c : { ...c, isPrimary: false }));

    setCandidateProfiles((prev) => {
      const existing = prev.find((p) => p.userId === currentUser?.id);
      if (existing) {
        return prev.map((p) =>
          p.userId === currentUser?.id
            ? {
                ...p,
                fullName: parsedData.fullName || p.fullName,
                email: parsedData.email || p.email,
                phone: parsedData.phone || p.phone,
                location: parsedData.location || p.location,
                bio: parsedData.summary || p.bio,
                skills: Array.from(new Set([...p.skills, ...(parsedData.skills || [])])),
                experienceYears: parsedData.experienceYears || p.experienceYears,
                expectedSalary: parsedData.expectedSalary || p.expectedSalary,
                availability: (parsedData.availability as any) || p.availability,
                experience: parsedData.experience?.length ? parsedData.experience : p.experience,
                education: parsedData.education?.length ? parsedData.education : p.education,
                certifications: parsedData.certifications?.length ? parsedData.certifications : p.certifications,
                primaryCvId: newCv.id,
              }
            : p
        );
      }
      return prev;
    });

    return newCv;
  };

  const runAISearch = async (query: string, isRefinement = false) => {
    setIsAiSearching(true);
    
    const newMsg: SearchChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'recruiter',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = isRefinement ? [...searchChatHistory, newMsg] : [newMsg];
    setSearchChatHistory(updatedHistory);

    try {
      const candidateData = candidateProfiles.map((prof) => {
        const candidateCvs = cvs.filter((c) => c.candidateId === prof.userId);
        return {
          id: prof.userId,
          fullName: prof.fullName,
          email: prof.email,
          location: prof.location,
          bio: prof.bio,
          experienceYears: prof.experienceYears,
          expectedSalary: prof.expectedSalary,
          availability: prof.availability,
          openToWork: prof.openToWork,
          skills: prof.skills,
          experienceHistory: prof.experience,
          cvsParsed: candidateCvs.map((c) => c.parsedData),
        };
      });

      const res = await fetch(`${API_BASE}/api/recruiter/ai-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, candidates: candidateData, history: updatedHistory }),
      });

      const result = await res.json();
      if (result.success && result.data) {
        const resultMap: { [candidateId: string]: AISearchResult } = {};
        result.data.results?.forEach((r: AISearchResult) => {
          resultMap[r.candidateId] = r;
        });
        setAiSearchResults(resultMap);
        setAiSearchCriteria(result.data.searchCriteriaSummary || null);

        const assistantMsg: SearchChatMessage = {
          id: `msg_${Date.now() + 1}`,
          sender: 'assistant',
          text: result.data.relevanceOverview || `Based on details, I have found ${result.data.results?.length || 0} matching candidates.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setSearchChatHistory([...updatedHistory, assistantMsg]);
      }
    } catch (err) {
      console.error('Error running AI search:', err);
    } finally {
      setIsAiSearching(false);
    }
  };

  const scheduleScreeningCall = (appId: string, timeSlot: string) => {
    updateApplicationStage(appId, 1, 'screening_scheduled', `Screening call scheduled for ${timeSlot}`);
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, screeningSlot: timeSlot } : a))
    );
  };

  const startAIInterview = async (appId: string): Promise<InterviewRecord> => {
    const app = applications.find((a) => a.id === appId);
    const job = jobs.find((j) => j.id === app?.jobId);
    const profile = candidateProfiles.find((p) => p.userId === app?.candidateId);

    const res = await fetch(`${API_BASE}/api/ai-interview/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: job?.title || 'Engineer',
        requirements: job?.requirements || [],
        candidateName: profile?.fullName || 'Candidate',
        candidateSkills: profile?.skills || [],
      }),
    });

    const data = await res.json();
    const questions = data.questions || [];

    const newInterview: InterviewRecord = {
      id: `int_${Date.now()}`,
      applicationId: appId,
      jobId: job?.id || '',
      candidateId: profile?.userId || '',
      type: 'ai',
      scheduledAt: new Date().toISOString(),
      status: 'scheduled',
      questions,
    };

    setInterviews((prev) => [newInterview, ...prev]);
    updateApplicationStage(appId, 2, 'interviewing', 'Candidate entered AI Interview room');
    return newInterview;
  };

  const submitAIInterviewAnswers = async (
    interviewId: string,
    answers: { questionId: string; answer: string }[]
  ) => {
    const int = interviews.find((i) => i.id === interviewId);
    if (!int) return;

    const job = jobs.find((j) => j.id === int.jobId);
    const questionsWithAnswers = int.questions.map((q) => {
      const match = answers.find((a) => a.questionId === q.id);
      return {
        ...q,
        candidateAnswer: match ? match.answer : 'No answer provided.',
      };
    });

    const res = await fetch(`${API_BASE}/api/ai-interview/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: job?.title || 'Role',
        questionsWithAnswers,
      }),
    });

    const result = await res.json();
    const evaluation = result.evaluation || {};

    const updatedQuestions = questionsWithAnswers.map((q) => {
      const qEval = evaluation.questionEvaluations?.find((e: any) => e.questionId === q.id);
      return {
        ...q,
        score: qEval?.score || 80,
        feedback: qEval?.feedback || 'Good response.',
      };
    });

    setInterviews((prev) =>
      prev.map((i) =>
        i.id === interviewId
          ? {
              ...i,
              status: 'completed',
              completedAt: new Date().toISOString(),
              questions: updatedQuestions,
              overallScore: evaluation.overallScore || 85,
              technicalScore: evaluation.technicalScore || 85,
              communicationScore: evaluation.communicationScore || 85,
              relevanceScore: evaluation.relevanceScore || 85,
              summary: evaluation.summary || 'Solid candidate performance.',
            }
          : i
      )
    );

    updateApplicationStage(
      int.applicationId,
      3,
      'selected',
      `Completed AI Interview with Score ${evaluation.overallScore || 85}%`
    );
  };

  const releaseOfferLetter = async (
    appId: string,
    salary: string,
    joiningDate: string,
    customNotes?: string
  ): Promise<OfferLetter> => {
    const app = applications.find((a) => a.id === appId);
    const job = jobs.find((j) => j.id === app?.jobId);
    const profile = candidateProfiles.find((p) => p.userId === app?.candidateId);

    const template = offerTemplates[0];

    const res = await fetch(`${API_BASE}/api/offer-letter/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateName: profile?.fullName || 'Candidate',
        role: job?.title || 'Engineer',
        companyName: job?.company || 'Company',
        salary,
        joiningDate,
        benefits: template.benefitsList,
        customNotes,
      }),
    });

    const data = await res.json();
    const offerContent = data.offerText || template.bodyTemplate;

    const newOffer: OfferLetter = {
      id: `off_${Date.now()}`,
      applicationId: appId,
      jobId: job?.id || '',
      candidateId: profile?.userId || '',
      templateId: template.id,
      candidateName: profile?.fullName || 'Candidate',
      role: job?.title || 'Engineer',
      companyName: job?.company || 'Company',
      salary,
      joiningDate,
      benefits: template.benefitsList,
      content: offerContent,
      status: 'sent',
      sentAt: new Date().toISOString(),
    };

    setOfferLetters((prev) => [newOffer, ...prev]);
    updateApplicationStage(appId, 4, 'offer_sent', `Offer letter sent for ${salary}`);
    return newOffer;
  };

  const respondToOffer = (offerId: string, response: 'accepted' | 'declined') => {
    setOfferLetters((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? {
              ...o,
              status: response,
              respondedAt: new Date().toISOString(),
            }
          : o
      )
    );

    const offer = offerLetters.find((o) => o.id === offerId);
    if (offer) {
      updateApplicationStage(
        offer.applicationId,
        4,
        response === 'accepted' ? 'offer_accepted' : 'offer_declined',
        `Candidate ${response} the offer letter.`
      );
      if (response === 'accepted') {
        // Keep user role as 'candidate' and upgrade enrollmentStatus in profiles
        setCandidateProfiles((prev) =>
          prev.map((p) =>
            p.userId === offer.candidateId
              ? {
                  ...p,
                  enrollmentStatus: 'student',
                  applicationProgress: 100,
                  bio: (p.bio || '') + `\n\nStudent ID: STU-2026-X${offer.candidateId.slice(-4).toUpperCase()}`
                }
              : p
          )
        );
        // Sync current user state if they are the one accepting (role remains 'candidate')
        if (currentUser && currentUser.id === offer.candidateId) {
          const updatedUser = { ...currentUser };
          setCurrentUser(updatedUser);
          localStorage.setItem('hireai_current_user', JSON.stringify(updatedUser));
        }
      }
    }
  };

  const createInvite = (role: 'admin' | 'recruiter', email: string, invitedName?: string): InviteToken => {
    const newInvite: InviteToken = {
      id: `inv_${Date.now()}`,
      invitedBy: currentUser?.id || 'usr_super_admin',
      invitedByName: invitedName || currentUser?.name || 'Alex Vance',
      role,
      email,
      token: `inv_token_${role}_${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    setInvites((prev) => [newInvite, ...prev]);
    return newInvite;
  };

  const submitAdmissionsApplication = (
    name: string,
    email: string,
    password?: string,
    profileDetails?: any,
    jobId?: string
  ) => {
    const newUserId = `usr_${Date.now()}`;
    const newUser = {
      id: newUserId,
      name,
      email,
      password: password || 'password123',
      role: 'candidate' as const,
      provider: 'email' as const,
      createdAt: new Date().toISOString()
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('hireai_users', JSON.stringify(updatedUsers));

    const newProfileId = `prof_${Date.now()}`;
    const newProfile = {
      id: newProfileId,
      userId: newUserId,
      fullName: name,
      email,
      phone: profileDetails?.phone || '',
      location: profileDetails?.location || 'Noida',
      bio: profileDetails?.bio || '',
      experienceYears: Number(profileDetails?.experienceYears) || 0,
      expectedSalary: '₹8,00,000 / yr',
      availability: 'Immediate',
      openToWork: true,
      domain: 'Engineering' as const,
      skills: profileDetails?.skills || [],
      experience: profileDetails?.experience || [],
      education: profileDetails?.education || [],
      certifications: [],
      githubUrl: profileDetails?.githubUrl || '',
      linkedinUrl: profileDetails?.linkedinUrl || '',
      portfolioUrl: profileDetails?.portfolioUrl || '',
      admissionScore: profileDetails?.admissionScore || 85,
      applicationProgress: 100,
      enrollmentStatus: 'applicant' as const
    };

    const updatedProfiles = [...candidateProfiles, newProfile];
    setCandidateProfiles(updatedProfiles);
    localStorage.setItem('hireai_candidate_profiles', JSON.stringify(updatedProfiles));

    let newCvId = 'no_cv';
    if (profileDetails?.cvText) {
      const newCv = {
        id: `cv_${Date.now()}`,
        candidateId: newUserId,
        title: `${name} Resume`,
        isPrimary: true,
        rawText: profileDetails.cvText,
        parsedData: {
          fullName: name,
          email,
          phone: profileDetails.phone || '',
          location: profileDetails.location || '',
          summary: profileDetails.bio || '',
          experienceYears: Number(profileDetails.experienceYears) || 0,
          expectedSalary: '₹8,00,000 / yr',
          availability: 'Immediate',
          skills: profileDetails.skills || [],
          experience: profileDetails.experience || [],
          education: profileDetails.education || [],
          certifications: []
        },
        updatedAt: new Date().toISOString()
      };
      newCvId = newCv.id;
      const updatedCvs = [...cvs, newCv];
      setCvs(updatedCvs);
      localStorage.setItem('hireai_cvs', JSON.stringify(updatedCvs));
    }

    const newApp = {
      id: `app_${Date.now()}`,
      jobId: jobId || 'job_ai_bootcamp',
      candidateId: newUserId,
      cvId: newCvId,
      status: 'shortlisted' as const,
      stage: 2 as const,
      interviewType: 'ai' as const,
      appliedAt: new Date().toISOString()
    };
    const updatedApps = [...applications, newApp];
    setApplications(updatedApps);
    localStorage.setItem('hireai_applications', JSON.stringify(updatedApps));

    setCurrentUser(newUser);
    localStorage.setItem('hireai_current_user', JSON.stringify(newUser));
  };

  return (
    <PortalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        candidateProfiles,
        cvs,
        jobs,
        applications,
        interviews,
        offerTemplates,
        offerLetters,
        invites,
        aiSearchResults,
        aiSearchCriteria,
        isAiSearching,
        searchChatHistory,
        permissionMatrix,
        switchRole,
        createJob,
        updateJob,
        applyForJob,
        updateApplicationStage,
        parseCVAndSave,
        addParsedCVItem,
        runAISearch,
        clearSearchChat,
        scheduleScreeningCall,
        startAIInterview,
        submitAIInterviewAnswers,
        releaseOfferLetter,
        respondToOffer,
        createInvite,
        updateProfile,
        loginUser,
        signupCandidate,
        signupViaInvite,
        logoutUser,
        deleteUser,
        updateOfferTemplate,
        associateCandidateWithJob,
        addManualInterviewEvaluation,
        submitAdmissionsApplication,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
