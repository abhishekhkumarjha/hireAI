import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  CandidateProfile,
  CVItem,
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
} from '../data/initialData';

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
  updateOfferTemplate: (template: OfferTemplate) => void;
  associateCandidateWithJob: (candidateId: string, jobId: string) => Application;
  addManualInterviewEvaluation: (appId: string, evaluation: { overallScore: number; technicalScore: number; communicationScore: number; relevanceScore: number; summary: string }) => void;
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
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
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

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('hireai_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { 
    if (currentUser) {
      localStorage.setItem('hireai_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hireai_current_user');
    }
  }, [currentUser]);
  useEffect(() => { localStorage.setItem('hireai_candidate_profiles', JSON.stringify(candidateProfiles)); }, [candidateProfiles]);
  useEffect(() => { localStorage.setItem('hireai_cvs', JSON.stringify(cvs)); }, [cvs]);
  useEffect(() => { localStorage.setItem('hireai_jobs', JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem('hireai_applications', JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem('hireai_interviews', JSON.stringify(interviews)); }, [interviews]);
  useEffect(() => { localStorage.setItem('hireai_offer_templates', JSON.stringify(offerTemplates)); }, [offerTemplates]);
  useEffect(() => { localStorage.setItem('hireai_offer_letters', JSON.stringify(offerLetters)); }, [offerLetters]);
  useEffect(() => { localStorage.setItem('hireai_invites', JSON.stringify(invites)); }, [invites]);
  useEffect(() => { localStorage.setItem('hireai_search_chat_history', JSON.stringify(searchChatHistory)); }, [searchChatHistory]);

  // Clean old mock data if present to ensure 1 admin and fresh signup states
  useEffect(() => {
    const raw = localStorage.getItem('hireai_users');
    if (raw && (raw.includes('usr_cand_priya') || !raw.includes('abhishek.jha@cloudinntech.co.in'))) {
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

  const switchRole = (role: UserRole) => {
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
    }
  };

  const loginUser = (email: string, password?: string): boolean => {
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

  const signupCandidate = (name: string, email: string, password?: string, provider = 'email'): User => {
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

  const signupViaInvite = (name: string, email: string, password?: string, token?: string, provider = 'email'): User | null => {
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
    const res = await fetch('/api/parse-cv', {
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

      const res = await fetch('/api/recruiter/ai-search', {
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

    const res = await fetch('/api/ai-interview/generate', {
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

    const res = await fetch('/api/ai-interview/evaluate', {
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

    const res = await fetch('/api/offer-letter/generate', {
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
    }
  };

  const createInvite = (role: 'admin' | 'recruiter', email: string): InviteToken => {
    const newInvite: InviteToken = {
      id: `inv_${Date.now()}`,
      invitedBy: currentUser?.id || 'usr_super_admin',
      invitedByName: currentUser?.name || 'Alex Vance',
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
        updateOfferTemplate,
        associateCandidateWithJob,
        addManualInterviewEvaluation,
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
