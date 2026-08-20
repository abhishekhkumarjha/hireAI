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
  ApplicationStage,
  SearchChatMessage,
  PermissionMatrixItem,
  Notification,
  AuditLog,
  ApplicationEvent
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
  notifications: Notification[];
  auditLogs: AuditLog[];
  applicationEvents: ApplicationEvent[];

  // Actions
  switchRole: (role: UserRole) => void;
  createJob: (jobData: Omit<Job, 'id' | 'createdAt' | 'postedBy' | 'updatedAt'>) => Job;
  updateJob: (job: Job) => void;
  applyForJob: (jobId: string, cvId: string) => Application;
  updateApplicationStage: (appId: string, stageName: ApplicationStage, notes?: string) => void;
  parseCVAndSave: (rawText: string, cvTitle: string) => Promise<CVItem>;
  addParsedCVItem: (parsedData: ParsedCVData, title: string, rawText: string) => CVItem;
  runAISearch: (query: string, isRefinement?: boolean) => Promise<void>;
  clearSearchChat: () => void;
  scheduleScreeningCall: (appId: string, date: string, time: string, duration: number, interviewer: string, type: 'ai' | 'human', meetUrl?: string, notes?: string) => void;
  startAIInterview: (appId: string) => Promise<InterviewRecord>;
  submitAIInterviewAnswers: (interviewId: string, answers: { questionId: string; answer: string }[]) => Promise<void>;
  releaseOfferLetter: (appId: string, salary: string, joiningDate: string, customNotes?: string) => Promise<OfferLetter>;
  respondToOffer: (offerId: string, response: 'accepted' | 'declined') => void;
  createInvite: (role: 'admin' | 'recruiter', email: string, invitedName?: string) => InviteToken;
  updateProfile: (profile: CandidateProfile) => void;
  loginUser: (email: string, password?: string) => boolean;
  signupCandidate: (name: string, email: string, password?: string, provider?: any) => User;
  signupViaInvite: (name: string, email: string, password?: string, token?: string, provider?: any) => User | null;
  logoutUser: () => void;
  deleteUser: (userId: string) => boolean;
  updateOfferTemplate: (template: OfferTemplate) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  associateCandidateWithJob: (candidateId: string, jobId: string) => Application;
  addManualInterviewEvaluation: (appId: string, evaluation: { overallScore: number; technicalScore: number; communicationScore: number; relevanceScore: number; summary: string }) => void;
  addNotification: (userId: string, title: string, message: string, type: string) => void;
  markNotificationsAsRead: () => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [candidateProfiles, setCandidateProfiles] = useState<CandidateProfile[]>(INITIAL_CANDIDATE_PROFILES);
  const [cvs, setCvs] = useState<CVItem[]>(INITIAL_CVS);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [interviews, setInterviews] = useState<InterviewRecord[]>(INITIAL_INTERVIEWS);
  const [offerTemplates, setOfferTemplates] = useState<OfferTemplate[]>(INITIAL_OFFER_TEMPLATES);
  const [offerLetters, setOfferLetters] = useState<OfferLetter[]>(INITIAL_OFFER_LETTERS);
  const [invites, setInvites] = useState<InviteToken[]>(INITIAL_INVITE_TOKENS);
  const [searchChatHistory, setSearchChatHistory] = useState<SearchChatMessage[]>([]);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [applicationEvents, setApplicationEvents] = useState<ApplicationEvent[]>([]);

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
          if (db.notifications) setNotifications(db.notifications);
          if (db.auditLogs) setAuditLogs(db.auditLogs);
          if (db.applicationEvents) setApplicationEvents(db.applicationEvents);
        }
      } catch (err) {
        console.error('Failed to fetch initial database from backend:', err);
      }
    };
    fetchDb();
  }, []);

  // Sync to Remote DB on update
  useEffect(() => { syncCollection('users', users); }, [users]);
  useEffect(() => { syncCollection('candidateProfiles', candidateProfiles); }, [candidateProfiles]);
  useEffect(() => { syncCollection('cvs', cvs); }, [cvs]);
  useEffect(() => { syncCollection('jobs', jobs); }, [jobs]);
  useEffect(() => { syncCollection('applications', applications); }, [applications]);
  useEffect(() => { syncCollection('interviews', interviews); }, [interviews]);
  useEffect(() => { syncCollection('offerTemplates', offerTemplates); }, [offerTemplates]);
  useEffect(() => { syncCollection('offerLetters', offerLetters); }, [offerLetters]);
  useEffect(() => { syncCollection('invites', invites); }, [invites]);
  useEffect(() => { syncCollection('searchChatHistory', searchChatHistory); }, [searchChatHistory]);
  useEffect(() => { syncCollection('notifications', notifications); }, [notifications]);
  useEffect(() => { syncCollection('auditLogs', auditLogs); }, [auditLogs]);
  useEffect(() => { syncCollection('applicationEvents', applicationEvents); }, [applicationEvents]);

  // Polling mechanism for cross-portal/cross-domain remote database sync
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/db`);
        const result = await res.json();
        if (result.success && result.db) {
          const db = result.db;
          if (db.users && JSON.stringify(db.users) !== JSON.stringify(users)) setUsers(db.users);
          if (db.candidateProfiles && JSON.stringify(db.candidateProfiles) !== JSON.stringify(candidateProfiles)) setCandidateProfiles(db.candidateProfiles);
          if (db.cvs && JSON.stringify(db.cvs) !== JSON.stringify(cvs)) setCvs(db.cvs);
          if (db.jobs && JSON.stringify(db.jobs) !== JSON.stringify(jobs)) setJobs(db.jobs);
          if (db.applications && JSON.stringify(db.applications) !== JSON.stringify(applications)) setApplications(db.applications);
          if (db.interviews && JSON.stringify(db.interviews) !== JSON.stringify(interviews)) setInterviews(db.interviews);
          if (db.offerTemplates && JSON.stringify(db.offerTemplates) !== JSON.stringify(offerTemplates)) setOfferTemplates(db.offerTemplates);
          if (db.offerLetters && JSON.stringify(db.offerLetters) !== JSON.stringify(offerLetters)) setOfferLetters(db.offerLetters);
          if (db.invites && JSON.stringify(db.invites) !== JSON.stringify(invites)) setInvites(db.invites);
          if (db.searchChatHistory && JSON.stringify(db.searchChatHistory) !== JSON.stringify(searchChatHistory)) setSearchChatHistory(db.searchChatHistory);
          if (db.notifications && JSON.stringify(db.notifications) !== JSON.stringify(notifications)) setNotifications(db.notifications);
          if (db.auditLogs && JSON.stringify(db.auditLogs) !== JSON.stringify(auditLogs)) setAuditLogs(db.auditLogs);
          if (db.applicationEvents && JSON.stringify(db.applicationEvents) !== JSON.stringify(applicationEvents)) setApplicationEvents(db.applicationEvents);
        }
      } catch (err) {
        console.error('Failed to sync-poll from remote database:', err);
      }
    }, 4000);

    return () => clearInterval(pollInterval);
  }, [users, candidateProfiles, cvs, jobs, applications, interviews, offerTemplates, offerLetters, invites, searchChatHistory, notifications, auditLogs, applicationEvents]);

  // Log auditing
  const logAudit = (action: string, details?: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: `audit_${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      details,
      createdAt: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Log application events
  const addApplicationEvent = (appId: string, eventType: string, message: string, prev?: ApplicationStage, next?: ApplicationStage) => {
    if (!currentUser) return;
    const newEvent: ApplicationEvent = {
      id: `evt_${Date.now()}`,
      applicationId: appId,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      eventType,
      previousStatus: prev,
      newStatus: next,
      message,
      createdAt: new Date().toISOString()
    };
    setApplicationEvents(prevList => [...prevList, newEvent]);
  };

  const addNotification = (userId: string, title: string, message: string, type: string) => {
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, read: true } : n));
  };

  const switchRole = (role: UserRole) => {
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      logAudit(`Switched view mode to ${role}`);
    }
  };

  const loginUser = (email: string, password?: string): boolean => {
    if (!password || password.length < 6) return false;
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (found.password && found.password !== password) return false;
      setCurrentUser(found);
      // Generate standard notification
      addNotification(found.id, 'Secure Login Verified', 'You have logged into the CloudInnTech ATS environment successfully.', 'info');
      
      const newLog: AuditLog = {
        id: `audit_${Date.now()}`,
        actorId: found.id,
        actorName: found.name,
        actorRole: found.role,
        action: 'Login Successful',
        createdAt: new Date().toISOString()
      };
      setAuditLogs(prev => [newLog, ...prev]);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    if (currentUser) {
      logAudit('Logout Successful');
    }
    setCurrentUser(null);
  };

  const deleteUser = (userId: string): boolean => {
    if (currentUser?.role !== 'super_admin' || userId === currentUser.id) return false;
    const target = users.find((user) => user.id === userId);
    if (!target || target.role === 'super_admin') return false;

    setUsers((prev) => prev.filter((user) => user.id !== userId));
    logAudit('User Account Terminated', `Account email: ${target.email}`);
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
      certifications: [],
      profileCompletion: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setUsers(prev => [...prev, newUser]);
    setCandidateProfiles(prev => [...prev, newProfile]);
    setCurrentUser(newUser);

    // Initial event and notification
    addNotification(newUser.id, 'Welcome to HireAI', 'Complete your technical profile and upload a resume to match with open roles.', 'info');
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
    logAudit('Updated Employment Offer Template', updated.name);
  };

  const createJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'postedBy' | 'updatedAt'>): Job => {
    if (!currentUser || currentUser.role === 'candidate') {
      throw new Error('Only administrators and recruiters can create listings.');
    }
    const newJob: Job = {
      ...jobData,
      id: `job_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      postedBy: currentUser?.id || 'usr_super_admin',
    };
    setJobs((prev) => [newJob, ...prev]);
    logAudit('Created Job Opening', newJob.title);
    return newJob;
  };

  const updateJob = (updated: Job) => {
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : j)));
    logAudit('Updated Job Opening Details', updated.title);
  };

  const updateProfile = (updated: CandidateProfile) => {
    setCandidateProfiles((prev) => prev.map((p) => (p.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : p)));
    logAudit('Updated Candidate Technical Profile');
  };

  const applyForJob = (jobId: string, cvId: string): Application => {
    const job = jobs.find(j => j.id === jobId);
    const newApp: Application = {
      id: `app_${Date.now()}`,
      jobId,
      candidateId: currentUser?.id || '',
      cvId,
      status: 'applied',
      stage: 1,
      interviewType: 'ai',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setApplications((prev) => [newApp, ...prev]);
    
    // Add timeline event
    addApplicationEvent(newApp.id, 'applied', `Candidate submitted application for job role: ${job?.title || 'Unknown'}`);
    
    // Notify recruiter
    const recId = job?.postedBy || 'usr_super_admin';
    addNotification(recId, 'New Candidate Application', `${currentUser?.name || 'A candidate'} applied for ${job?.title || 'Job Opening'}.`, 'success');
    return newApp;
  };

  const associateCandidateWithJob = (candidateId: string, jobId: string): Application => {
    const candidateCvs = cvs.filter(c => c.candidateId === candidateId);
    const primaryCv = candidateCvs.find(c => c.isPrimary) || candidateCvs[0];
    const job = jobs.find(j => j.id === jobId);
    const candidateUser = users.find(u => u.id === candidateId);
    
    const newApp: Application = {
      id: `app_${Date.now()}`,
      jobId,
      candidateId,
      cvId: primaryCv ? primaryCv.id : 'no_cv',
      status: 'applied',
      stage: 1,
      interviewType: 'ai',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setApplications((prev) => [newApp, ...prev]);
    
    addApplicationEvent(newApp.id, 'applied', `Candidate was associated to job role: ${job?.title || 'Unknown'}`);
    addNotification(candidateId, 'Associated with Role', `A recruiter has added you as a candidate for the position: ${job?.title}.`, 'info');
    return newApp;
  };

  const updateApplicationStage = (appId: string, stageName: ApplicationStage, notes?: string) => {
    const target = applications.find((application) => application.id === appId);
    if (!target) return;
    
    const prevStatus = target.status;
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: stageName,
              recruiterNotes: notes || app.recruiterNotes,
              updatedAt: new Date().toISOString(),
            }
          : app
      )
    );
    
    addApplicationEvent(appId, stageName, `Application status updated to ${stageName.replace('_', ' ')}. ${notes || ''}`, prevStatus, stageName);
    
    // Send Candidate Notification
    addNotification(target.candidateId, 'Application Update', `Your application status has been moved to ${stageName.replace('_', ' ')}.`, 'info');
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
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCvs((prev) => [newCv, ...prev].map(c => c.id === newCv.id ? c : { ...c, isPrimary: false }));

    // Update candidate profile
    setCandidateProfiles((prev) =>
      prev.map((p) =>
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
              experience: parsedData.experience?.length ? parsedData.experience : p.experience,
              education: parsedData.education?.length ? parsedData.education : p.education,
              certifications: parsedData.certifications?.length ? parsedData.certifications : p.certifications,
              primaryCvId: newCv.id,
              profileCompletion: 80,
            }
          : p
      )
    );

    logAudit('Uploaded Candidate Resume', newCv.title);
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
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCvs((prev) => [newCv, ...prev].map(c => c.id === newCv.id ? c : { ...c, isPrimary: false }));

    setCandidateProfiles((prev) =>
      prev.map((p) =>
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
              experience: parsedData.experience?.length ? parsedData.experience : p.experience,
              education: parsedData.education?.length ? parsedData.education : p.education,
              certifications: parsedData.certifications?.length ? parsedData.certifications : p.certifications,
              primaryCvId: newCv.id,
              profileCompletion: 85,
            }
          : p
      )
    );

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

  const scheduleScreeningCall = (
    appId: string,
    date: string,
    time: string,
    duration: number,
    interviewer: string,
    type: 'ai' | 'human',
    meetUrl?: string,
    notes?: string
  ) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    const slotText = `${date} at ${time} (${duration} mins) with ${interviewer}`;
    
    // Create actual scheduled human/AI interview record
    const newRecord: InterviewRecord = {
      id: `int_${Date.now()}`,
      applicationId: appId,
      jobId: app.jobId,
      candidateId: app.candidateId,
      type,
      scheduledAt: `${date}T${time}:00`,
      duration,
      status: 'scheduled',
      interviewerIds: [interviewer],
      videoCallUrl: meetUrl || 'https://meet.google.com/abc-defg-hij',
      questions: []
    };

    setInterviews(prev => [newRecord, ...prev]);

    updateApplicationStage(appId, type === 'ai' ? 'ai_screening' : 'recruiter_screening', `Scheduled screening interview. details: ${slotText}. Notes: ${notes || ''}`);
    
    // Add visual screening slot string
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, screeningSlot: slotText } : a));

    addNotification(app.candidateId, 'Interview Scheduled', `Your interview has been scheduled for ${slotText}. Meeting Link: ${newRecord.videoCallUrl}`, 'info');
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
    updateApplicationStage(appId, 'ai_screening', 'Candidate entered automated AI Interview portal.');
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
              overallScore: evaluation.overallScore || 80,
              technicalScore: evaluation.technicalScore || 80,
              communicationScore: evaluation.communicationScore || 80,
              relevanceScore: evaluation.relevanceScore || 80,
              summary: evaluation.summary || 'Solid candidate performance.',
            }
          : i
      )
    );

    updateApplicationStage(
      int.applicationId,
      'under_review',
      `Completed AI interview with score of ${evaluation.overallScore || 80}%.`
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
    updateApplicationStage(appId, 'offer_sent', `Employment offer generated and sent.`);
    addNotification(profile!.userId, 'Employment Offer Released', `Congratulations! CloudInnTech has extended an employment offer for the ${job?.title} role.`, 'success');
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
              candidateResponse: `Signed and marked as ${response}.`
            }
          : o
      )
    );

    const offer = offerLetters.find((o) => o.id === offerId);
    if (offer) {
      updateApplicationStage(
        offer.applicationId,
        response === 'accepted' ? 'offer_accepted' : 'offer_declined',
        `Candidate marked offer response as ${response}.`
      );
      
      if (response === 'accepted') {
        updateApplicationStage(offer.applicationId, 'hired', 'Offer accepted. Onboarding sequence initialized.');
        
        // Upgrade recruiter view
        const job = jobs.find(j => j.id === offer.jobId);
        addNotification(job?.postedBy || 'usr_super_admin', 'Offer Accepted!', `${offer.candidateName} accepted the offer for the ${offer.role} role.`, 'success');
      }
    }
  };

  const createInvite = (role: 'admin' | 'recruiter', email: string, invitedName?: string): InviteToken => {
    const newInvite: InviteToken = {
      id: `inv_${Date.now()}`,
      invitedBy: currentUser?.id || 'usr_super_admin',
      invitedByName: invitedName || currentUser?.name || 'Super Admin',
      role,
      email,
      token: `inv_token_${role}_${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    setInvites((prev) => [newInvite, ...prev]);
    logAudit('Generated onboarding invitation link', `${role} role for ${email}`);
    return newInvite;
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
      problemSolvingScore: evaluation.overallScore,
      roleRelevanceScore: evaluation.relevanceScore,
      summary: evaluation.summary,
      questions: []
    };
    
    setInterviews(prev => [newRecord, ...prev.filter(i => i.applicationId !== appId)]);
    updateApplicationStage(appId, 'shortlisted', `Human panel interview evaluated. Overall Score: ${evaluation.overallScore}/100.`);
  };

  const submitAdmissionsApplication = (
    name: string,
    email: string,
    password?: string,
    profileDetails?: any,
    jobId?: string
  ) => {
    // For legacy compat but fully mapping to recruitment apply flow
    const newUser = signupCandidate(name, email, password);
    if (jobId) {
      associateCandidateWithJob(newUser.id, jobId);
    }
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
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
        notifications,
        auditLogs,
        applicationEvents,
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
        updateUser,
        associateCandidateWithJob,
        addManualInterviewEvaluation,
        submitAdmissionsApplication,
        addNotification,
        markNotificationsAsRead
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
