import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { CVItem, Job, Application, InterviewRecord, OfferLetter } from '../types/portal';
import {
  User,
  FileText,
  Briefcase,
  Sparkles,
  Upload,
  CheckCircle2,
  Clock,
  Calendar,
  Send,
  Download,
  Check,
  X,
  Award,
  DollarSign,
  MapPin,
  Tag,
  MessageSquare,
  Play,
  FileCheck,
  Zap,
  PlusCircle,
  HelpCircle,
  TrendingUp,
  ExternalLink,
  Laptop,
  GraduationCap,
  BookOpen,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import jsPDF from 'jspdf';

const freeCourses = [
  { id: 'free-1', title: 'Intro to AI & Prompt Engineering', cat: 'Foundational' },
  { id: 'free-2', title: 'Building LLM Agents with Gemini', cat: 'Practical' },
  { id: 'free-3', title: 'Machine Learning & Math 101', cat: 'Math & Stats' }
];

export const CandidateView: React.FC<{ portalHost?: 'apply' | 'app' }> = ({ portalHost = 'apply' }) => {
  const {
    currentUser,
    candidateProfiles,
    cvs,
    jobs,
    applications,
    interviews,
    offerLetters,
    applyForJob,
    parseCVAndSave,
    addParsedCVItem,
    scheduleScreeningCall,
    startAIInterview,
    submitAIInterviewAnswers,
    respondToOffer,
    updateProfile,
    updateApplicationStage,
    logoutUser,
  } = usePortal();

  // Find candidate profile
  const profile = candidateProfiles.find((p) => p.userId === currentUser?.id) || candidateProfiles[0];
  const userCvs = cvs.filter((c) => c.candidateId === currentUser?.id);
  const userApplications = applications.filter((a) => a.candidateId === currentUser?.id);
  const userOffers = offerLetters.filter((o) => o.candidateId === currentUser?.id);

  // States
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedBootcampId, setSelectedBootcampId] = useState<string>(() => {
    return localStorage.getItem('zeptrax_selected_job_id') || 'job_ai_bootcamp';
  });

  // Autosave indicators
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');

  // Application Form inputs
  const [appPhone, setAppPhone] = useState(profile.phone || '');
  const [appLocation, setAppLocation] = useState(profile.location || 'Noida');
  const [appBio, setAppBio] = useState(profile.bio || '');
  const [appDegree, setAppDegree] = useState('B.Tech in Computer Science');
  const [appInstitution, setAppInstitution] = useState('VIT University');
  const [appGradYear, setAppGradYear] = useState('2025');
  const [appCompany, setAppCompany] = useState('');
  const [appExpRole, setAppExpRole] = useState('');
  const [appExpDuration, setAppExpDuration] = useState('');
  const [appExpDesc, setAppExpDesc] = useState('');
  
  // Resume Parsing States
  const [cvText, setCvText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);

  // Career Quiz states
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [activeQuizQ, setActiveQuizQ] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const quizQuestions = [
    { q: "Which programming language do you prefer for machine learning?", options: ["Python", "JavaScript", "C++", "Java"] },
    { q: "What is your main goal in AI?", options: ["Build Generative Agents", "Deploy Cloud MLOps pipelines", "Data Science & BI analytics", "Smart Contracts & Blockchain"] },
    { q: "What is your comfort level with SQL databases?", options: ["Advanced (Indexing/Slices)", "Intermediate (Joins/Views)", "Beginner", "None"] }
  ];

  // Active AI interview state
  const [interviewRecord, setInterviewRecord] = useState<InterviewRecord | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'candidate'; text: string }>>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Enrolled Student states
  const [activeStudentModule, setActiveStudentModule] = useState(0);
  const [studentLessonsCompleted, setStudentLessonsCompleted] = useState<boolean[]>([true, false, false, false]);
  const [studentChatInput, setStudentChatInput] = useState('');
  const [studentChatLog, setStudentChatLog] = useState<Array<{ sender: 'zep' | 'student'; text: string }>>([
    { sender: 'zep', text: 'Hello! I am Zep, your AI Learning Mentor. Ask me anything about Python, Agentic AI, or Cloud MLOps!' }
  ]);

  // Free Learner states
  const [activeFreeModule, setActiveFreeModule] = useState(0);
  const [freeLessonsCompleted, setFreeLessonsCompleted] = useState<boolean[]>([true, false, false]);
  const [selectedFreeCourseId, setSelectedFreeCourseId] = useState('free-2'); // Generative AI

  const activeBootcamp = jobs.find(j => j.id === selectedBootcampId) || jobs[0];
  const assignedRecruiter = activeBootcamp.id === 'job_ai_bootcamp' ? 'Rahul Sharma' : 'John';

  // Initialize values from profile
  useEffect(() => {
    if (profile) {
      setAppPhone(profile.phone || '');
      setAppLocation(profile.location || 'Noida');
      setAppBio(profile.bio || '');
    }
  }, [profile]);

  // Autosave cache read on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('zeptrax_app_draft');
    if (savedDraft) {
      try {
        const data = JSON.parse(savedDraft);
        if (data.phone) setAppPhone(data.phone);
        if (data.location) setAppLocation(data.location);
        if (data.bio) setAppBio(data.bio);
        if (data.degree) setAppDegree(data.degree);
        if (data.institution) setAppInstitution(data.institution);
        if (data.gradYear) setAppGradYear(data.gradYear);
        if (data.company) setAppCompany(data.company);
        if (data.role) setAppExpRole(data.role);
        if (data.duration) setAppExpDuration(data.duration);
        if (data.desc) setAppExpDesc(data.desc);
        if (data.cvText) setCvText(data.cvText);
        if (data.activeStep) setActiveStep(data.activeStep);
      } catch (e) {
        console.error("Error reading draft:", e);
      }
    }
  }, []);

  // Autosave sync to localStorage loop (debounce simulation)
  useEffect(() => {
    const draftData = {
      phone: appPhone,
      location: appLocation,
      bio: appBio,
      degree: appDegree,
      institution: appInstitution,
      gradYear: appGradYear,
      company: appCompany,
      role: appExpRole,
      duration: appExpDuration,
      desc: appExpDesc,
      cvText,
      activeStep
    };

    const timer = setTimeout(() => {
      localStorage.setItem('zeptrax_app_draft', JSON.stringify(draftData));
      setIsSavingDraft(true);
      setLastSaved(new Date().toLocaleTimeString());
      const hideTimer = setTimeout(() => setIsSavingDraft(false), 2000);
      return () => clearTimeout(hideTimer);
    }, 1000);

    return () => clearTimeout(timer);
  }, [appPhone, appLocation, appBio, appDegree, appInstitution, appGradYear, appCompany, appExpRole, appExpDuration, appExpDesc, cvText, activeStep]);

  // -------------------------------------------------------------
  // HANDLERS FOR APPLICANT WIZARD
  // -------------------------------------------------------------
  
  const handleSavePersonalInfo = () => {
    if (!appPhone.trim() || !appLocation.trim()) {
      alert("Please fill in both Contact Phone and Current Location.");
      return;
    }
    updateProfile({
      ...profile,
      phone: appPhone,
      location: appLocation,
      bio: appBio,
      applicationProgress: Math.max(profile.applicationProgress || 0, 25)
    });
    setActiveStep(2);
  };

  const handleSaveEducationAndExp = () => {
    if (!appInstitution.trim() || !appDegree.trim()) {
      alert("Please enter both Institution and Degree Program.");
      return;
    }
    const updatedEdu = [{ id: 'edu_1', institution: appInstitution, degree: appDegree, year: appGradYear }];
    const updatedExp = appCompany ? [{ id: 'exp_1', company: appCompany, role: appExpRole, duration: appExpDuration, description: appExpDesc }] : [];
    updateProfile({
      ...profile,
      education: updatedEdu,
      experience: updatedExp,
      applicationProgress: Math.max(profile.applicationProgress || 0, 50)
    });
    setActiveStep(3);
  };

  const handleParseResume = async () => {
    if (!cvText.trim()) {
      alert("Please paste your CV / Resume text to continue.");
      return;
    }
    setIsParsing(true);
    try {
      await parseCVAndSave(cvText, "Application CV");
      setParseSuccess(true);
      updateProfile({
        ...profile,
        applicationProgress: Math.max(profile.applicationProgress || 0, 75)
      });
      setTimeout(() => {
        setActiveStep(4);
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleQuizAnswer = (ans: string) => {
    const newAnswers = [...quizAnswers, ans];
    setQuizAnswers(newAnswers);
    if (activeQuizQ + 1 < quizQuestions.length) {
      setActiveQuizQ(activeQuizQ + 1);
    } else {
      const score = 80 + Math.floor(Math.random() * 20); // 80 - 100
      setQuizScore(score);
      updateProfile({
        ...profile,
        admissionScore: score,
        applicationProgress: Math.max(profile.applicationProgress || 0, 85)
      });
    }
  };

  const handleLaunchAdmissionsInterview = async () => {
    let app = userApplications.find(a => a.jobId === selectedBootcampId);
    if (!app) {
      app = applyForJob(selectedBootcampId, userCvs[0]?.id || 'no_cv');
    }
    
    setIsEvaluating(true);
    try {
      const record = await startAIInterview(app.id);
      setInterviewRecord(record);
      setChatMessages([
        { sender: 'ai', text: `Welcome to the Admissions Interview for ${activeBootcamp.title}! I am your AI Evaluator. Let's begin.` },
        { sender: 'ai', text: record.questions[0]?.question || "Can you explain your experience with software development?" }
      ]);
      setCurrentQuestionIdx(0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSubmitInterviewAnswer = async () => {
    if (!currentAnswer.trim() || !interviewRecord) return;

    const updatedMessages = [...chatMessages, { sender: 'candidate' as const, text: currentAnswer }];
    setChatMessages(updatedMessages);
    const savedAnswer = currentAnswer;
    setCurrentAnswer('');

    if (currentQuestionIdx + 1 < interviewRecord.questions.length) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { sender: 'ai', text: interviewRecord.questions[nextIdx].question }
        ]);
      }, 800);
    } else {
      setIsEvaluating(true);
      setTimeout(async () => {
        const formattedAnswers = interviewRecord.questions.map((q, idx) => ({
          questionId: q.id,
          answer: idx === currentQuestionIdx ? savedAnswer : 'Coherent technical explanation.'
        }));
        
        await submitAIInterviewAnswers(interviewRecord.id, formattedAnswers);
        
        setIsEvaluating(false);
        setChatMessages(prev => [
          ...prev,
          { sender: 'ai', text: 'Thank you! Your admissions interview answers have been processed by the local model.' }
        ]);
        
        updateProfile({
          ...profile,
          applicationProgress: 100,
          admissionScore: 91
        });

        setTimeout(() => {
          setActiveStep(5);
        }, 1200);
      }, 1200);
    }
  };

  const handleFinalSubmitApplication = () => {
    let app = userApplications.find(a => a.jobId === selectedBootcampId);
    if (!app) {
      app = applyForJob(selectedBootcampId, userCvs[0]?.id || 'no_cv');
    }
    
    // Set application status directly in mock database to shortlisted (Gate 2 pending review)
    updateApplicationStage(app.id, 2, 'shortlisted', 'Admissions application submitted by candidate.');
    
    // Update profile status
    updateProfile({
      ...profile,
      enrollmentStatus: 'applicant',
      applicationProgress: 100
    });
    
    // Clear autosave draft cache
    localStorage.removeItem('zeptrax_app_draft');
  };

  const handleUpgradeToPremium = () => {
    updateProfile({
      ...profile,
      enrollmentStatus: 'applicant',
      applicationProgress: 10
    });
    setActiveStep(1);
  };

  // -------------------------------------------------------------
  // STUDENT INTERACTIVE CHAT & SYLLABUS CONTROLS
  // -------------------------------------------------------------
  const handleStudentChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentChatInput.trim()) return;

    const userMsg = { sender: 'student' as const, text: studentChatInput };
    setStudentChatLog(prev => [...prev, userMsg]);
    const query = studentChatInput.toLowerCase();
    setStudentChatInput('');

    setTimeout(() => {
      let response = "That's an excellent question! In our curriculum, we cover this concept in detail. Let me know if you want to run a code sandbox.";
      if (query.includes("python")) {
        response = "Python is the core language of Zeptrax. We use it for data manipulation, neural network definitions with PyTorch, and managing prompt loops. Check out Lesson 1 resources for code snippets.";
      } else if (query.includes("agent") || query.includes("agentic")) {
        response = "Agentic AI refers to models that have tool access, loop workflows, and self-evaluation. LangGraph and CrewAI are standard multi-agent orchestration frameworks we study in Module 3.";
      } else if (query.includes("aws") || query.includes("cloud")) {
        response = "AWS DevOps and GCP are essential for production MLOps. In Module 4, we practice hosting model endpoints on SageMaker using AWS Docker containers.";
      }
      setStudentChatLog(prev => [...prev, { sender: 'zep', text: response }]);
    }, 1000);
  };

  const handleToggleStudentLesson = (idx: number) => {
    const updated = [...studentLessonsCompleted];
    updated[idx] = !updated[idx];
    setStudentLessonsCompleted(updated);
  };

  const handleToggleFreeLesson = (idx: number) => {
    const updated = [...freeLessonsCompleted];
    updated[idx] = !updated[idx];
    setFreeLessonsCompleted(updated);
  };

  const studentProgress = Math.round((studentLessonsCompleted.filter(Boolean).length / studentLessonsCompleted.length) * 100);
  const freeProgress = Math.round((freeLessonsCompleted.filter(Boolean).length / freeLessonsCompleted.length) * 100);

  // Check if candidate is awaiting review (Gate 1 or Gate 2 pending review)
  const activeApp = userApplications[0];
  const isPending = activeApp && (
    activeApp.status === 'applied' || 
    activeApp.status === 'shortlisted' || 
    activeApp.status === 'screening_scheduled' || 
    activeApp.status === 'interviewing'
  );

  const isRejected = activeApp && activeApp.status === 'rejected';

  // Application status helper
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
      applied: { color: 'text-cyan-400', bg: 'bg-cyan-500/20', label: 'Applied' },
      shortlisted: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Shortlisted' },
      screening_scheduled: { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Screening Scheduled' },
      interviewing: { color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'Interviewing' },
      offer_sent: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Offer Sent' },
      offer_accepted: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Offer Accepted' },
      rejected: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Rejected' },
    };
    return statusConfig[status] || { color: 'text-slate-400', bg: 'bg-slate-500/20', label: status };
  };

  // =============================================================
  // APPLICATION TRACKING DASHBOARD
  // =============================================================
  const ApplicationTrackingDashboard = () => {
    if (!activeApp && userApplications.length === 0) return null;

    const app = activeApp || userApplications[0];
    const statusInfo = getStatusBadge(app.status);
    const appJob = jobs.find(j => j.id === app.jobId);
    const appInterview = interviews.find(i => i.applicationId === app.id);
    const appOffer = userOffers.find(o => o.applicationId === app.id);

    return (
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest">Application Tracking</span>
            <h3 className="text-sm font-bold text-white mt-0.5">{appJob?.title || 'Application'}</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusInfo.bg} ${statusInfo.color} border border-opacity-20 border-current`}>
            {statusInfo.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Applied On</span>
            </div>
            <p className="text-xs font-bold text-white">{new Date(app.appliedAt).toLocaleDateString()}</p>
          </div>

          {appInterview && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Interview Status</span>
              </div>
              <p className="text-xs font-bold text-white">{appInterview.status}</p>
            </div>
          )}

          {appOffer && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Offer Status</span>
              </div>
              <p className="text-xs font-bold text-white">{appOffer.status}</p>
            </div>
          )}
        </div>

        {app.stage && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Current Stage</span>
              </div>
              <span className="text-xs font-bold text-white">Stage {app.stage}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${(app.stage / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {appOffer && appOffer.status === 'pending' && (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <Award className="w-4 h-4" />
              <span>Offer Received!</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Salary:</span>
                <p className="font-bold text-white">{appOffer.salary}</p>
              </div>
              <div>
                <span className="text-slate-500">Joining Date:</span>
                <p className="font-bold text-white">{appOffer.joiningDate}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => respondToOffer(appOffer.id, 'accepted')}
                className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
              >
                Accept Offer
              </button>
              <button
                onClick={() => respondToOffer(appOffer.id, 'declined')}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition"
              >
                Decline
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // =============================================================
  // GATES & WORKSPACES RENDER
  // =============================================================

  // Approved Student attempting to use apply.zeptrax.ai is redirected!
  if (portalHost === 'apply' && profile.enrollmentStatus === 'student') {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <Award className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
        
        <div className="space-y-2">
          <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 text-[10px] font-black uppercase tracking-wider">
            Admissions Approved
          </span>
          <h3 className="text-2xl font-black text-white tracking-tight">Your application has been accepted!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Congratulations, **{profile.fullName}**! Your student account has been created and assigned to **{activeBootcamp.title}** (Batch August).
            Your workspace is active on the learning platform.
          </p>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-left space-y-2.5 text-xs font-mono max-w-sm mx-auto">
          <div className="flex justify-between border-b border-slate-850 pb-1.5">
            <span className="text-slate-500">Student ID:</span>
            <span className="font-extrabold text-white">STU-2026-X82</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Learning Workspace:</span>
            <span className="text-emerald-400 font-extrabold font-bold">app.zeptrax.ai</span>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
            Click the button below to launch the LMS player, watch live cohorts, and connect with your mentor.
          </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              const event = new CustomEvent('zeptrax-switch-portal', { detail: 'app' });
              window.dispatchEvent(event);
            }}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md tracking-wider transition uppercase inline-block cursor-pointer"
          >
            Launch app.zeptrax.ai LMS
          </button>
        </div>
      </div>
    );
  }

  // Strict Pre-Approval Login Locks for candidates
  if (currentUser?.role === 'candidate' && isPending) {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <Clock className="w-16 h-16 text-cyan-400 mx-auto animate-pulse" />
        
        <div className="space-y-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/25 text-[10px] font-black uppercase tracking-wider">
            Admissions Gate
          </span>
          <h3 className="text-2xl font-black text-white tracking-tight">Your application is under review</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Your application for the **{activeBootcamp.title}** has been received. 
            Sign-in access to the student workspace is locked until your profile is approved.
          </p>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-left space-y-2.5 text-xs font-mono max-w-md mx-auto">
          <div className="flex justify-between border-b border-slate-850 pb-1.5">
            <span className="text-slate-500">Applicant:</span>
            <span className="font-extrabold text-white">{profile.fullName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-850 pb-1.5">
            <span className="text-slate-500">Assigned Recruiter:</span>
            <span className="text-slate-300 font-bold">{assignedRecruiter}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Expected Review:</span>
            <span className="text-cyan-400 font-extrabold">48 Hours</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          The admissions office is verifying your details. We will notify you when portal access is generated.
        </p>

        <div className="pt-2">
          <button
            onClick={logoutUser}
            className="px-6 py-2.5 bg-red-650 hover:bg-red-500 bg-red-600 rounded-xl text-xs font-bold text-white transition active:scale-[0.98] cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (currentUser?.role === 'candidate' && isRejected) {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <X className="w-16 h-16 text-red-500 mx-auto" />
        
        <div className="space-y-2">
          <span className="px-2.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/25 text-[10px] font-black uppercase tracking-wider">
            Admissions Gate
          </span>
          <h3 className="text-2xl font-black text-white tracking-tight">Application Status: Rejected</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Thank you for applying to the **{activeBootcamp.title}**. After reviewing your profile, we are unable to approve your application.
          </p>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-left space-y-2.5 text-xs font-mono max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-slate-500">Verdict:</span>
            <span className="text-red-500 font-extrabold">REJECTED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Reason:</span>
            <span className="text-slate-300 font-medium">You may reapply after 30 days.</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={logoutUser}
            className="px-6 py-2.5 bg-red-650 hover:bg-red-500 bg-red-600 rounded-xl text-xs font-bold text-white transition active:scale-[0.98] cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // 1. FREE LEARNER WORKSPACE
  if (profile.enrollmentStatus === 'free_learner') {
    return (
      <div className="space-y-6">
        <ApplicationTrackingDashboard />
        <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/40 border border-cyan-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-500/30">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Standard Student Plan Available</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Upgrade to Zeptrax Premium Masters</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Unlock certified live classes, 1-on-1 mentorship, comprehensive Git code reviews, and placement assistance with average starting salaries of ₹8,00,000–₹18,00,000.
            </p>
          </div>
          <button
            onClick={handleUpgradeToPremium}
            className="shrink-0 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition flex items-center gap-2 self-start md:self-auto"
          >
            <span>Apply to Premium Master Bootcamp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <h3 className="text-lg font-bold text-white mb-4">Free AI Academy Course Catalog</h3>
              <div className="space-y-3">
                {freeCourses.map((c, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedFreeCourseId(`free-${idx + 1}`)}
                    className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                      selectedFreeCourseId === `free-${idx + 1}`
                        ? 'bg-slate-950 border-cyan-500/30 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedFreeCourseId === `free-${idx + 1}` ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-900 text-slate-500'
                      }`}>
                        <Laptop className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{c.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{c.cat} • Self-paced</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest">Active Player Sandbox</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    Course: {freeCourses.find(c => `free-${freeCourses.indexOf(c) + 1}` === selectedFreeCourseId)?.title || "Introduction to AI"}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">Free Academy</span>
              </div>

              <div className="aspect-video w-full rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
                <Play className="w-12 h-12 text-cyan-400 group-hover:scale-110 transition pointer-events-none" />
                <span className="text-xs text-slate-400 font-mono mt-3">Watch Mock Video Lesson: Foundations of Generative Models</span>
                <div className="absolute bottom-3 right-3 text-[10px] bg-slate-900/80 px-2 py-0.5 rounded text-slate-400 font-mono">
                  12:45 Min
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="text-xs font-bold text-slate-300">Modules Checklist</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-850/50">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={freeLessonsCompleted[0]} 
                        onChange={() => handleToggleFreeLesson(0)}
                        className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-800 w-3.5 h-3.5"
                      />
                      <span className="text-xs text-slate-200 font-medium">Lesson 1: What is Generative AI & Large Language Models?</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">Completed</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-850/50">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={freeLessonsCompleted[1]} 
                        onChange={() => handleToggleFreeLesson(1)}
                        className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-850 w-3.5 h-3.5"
                      />
                      <span className="text-xs text-slate-200 font-medium">Lesson 2: Prompt Engineering fundamentals (Zero-shot vs Few-shot)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Pending</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-850/50">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={freeLessonsCompleted[2]} 
                        onChange={() => handleToggleFreeLesson(2)}
                        className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-805 w-3.5 h-3.5"
                      />
                      <span className="text-xs text-slate-200 font-medium">Lesson 3: Building a Simple Chatbot using Gemini API & Python</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <h3 className="text-sm font-bold text-white mb-2">Learning Progress</h3>
              <div className="flex items-end justify-between text-xs mb-1.5">
                <span className="text-slate-400">Bootcamp Prep</span>
                <span className="text-cyan-400 font-extrabold">{freeProgress}% Complete</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-850">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${freeProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Finish all prep courses to unlock the final quiz verification!</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
              <h3 className="text-sm font-bold text-white">Admissions & Badges</h3>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-center flex flex-col items-center">
                <Award className={`w-10 h-10 mb-2 ${freeProgress === 100 ? 'text-cyan-400 animate-bounce' : 'text-slate-700'}`} />
                <h4 className="text-xs font-bold text-white">Foundation Skill Up Badge</h4>
                <p className="text-[10px] text-slate-500 mt-1">Completing prep courses earns a blockchain-minted Skill Up Badge.</p>
                {freeProgress === 100 ? (
                  <div className="mt-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-lg text-[9px] font-black uppercase tracking-wider">
                    Minted Verified Badge
                  </div>
                ) : (
                  <div className="mt-3 py-1 bg-slate-900 border border-slate-800 text-slate-500 rounded-lg text-[9px] font-bold">
                    Lock Status (Finish Prep)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. ENROLLED STUDENT WORKSPACE
  if (profile.enrollmentStatus === 'student') {
    return (
      <div className="space-y-6">
        <ApplicationTrackingDashboard />
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg flex items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-36 h-36 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back, {profile.fullName}! 👋</h2>
            <p className="text-xs text-slate-400">
              You are actively enrolled in the **{activeBootcamp.title}** cohort. Let's make today count!
            </p>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-extrabold uppercase">
            Active Student
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <h3 className="text-lg font-bold text-white mb-4">Syllabus Curriculum Tracks</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["1. Foundations", "2. Gen AI Models", "3. Agentic Frameworks", "4. Cloud MLOps"].map((chap, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStudentModule(idx)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-20 ${
                      activeStudentModule === idx
                        ? 'bg-slate-950 border-indigo-500/40 text-white shadow-md'
                        : 'bg-slate-950/30 border-slate-850 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Track 0{idx + 1}</span>
                    <span className="text-xs font-extrabold truncate w-full">{chap}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Active Player</span>
                  <h3 className="text-sm font-black text-white mt-0.5">
                    {activeStudentModule === 0 ? "Track 1: Python and Mathematical Slices" :
                     activeStudentModule === 1 ? "Track 2: LLMs Fine-Tuning & Prompt Tuning" :
                     activeStudentModule === 2 ? "Track 3: Multi-Agent Orchestration & Tool Use" :
                     "Track 4: SageMaker Endpoints, CI/CD, & Kubernetes Scaling"}
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-extrabold">Batch August</span>
              </div>

              <div className="aspect-video w-full rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
                <Play className="w-12 h-12 text-indigo-500 group-hover:scale-110 transition pointer-events-none" />
                <span className="text-xs text-slate-400 font-mono mt-3">Watch Lesson: Fine-Tuning Weights and Bias Optimization</span>
                <div className="absolute bottom-3 right-3 text-[10px] bg-slate-900/80 px-2 py-0.5 rounded text-slate-400 font-mono">
                  42:15 Min
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <h4 className="text-xs font-bold text-slate-300">Curriculum Completion Checklist</h4>
                <div className="space-y-1.5">
                  {[
                    "Lesson 1: Deep Dive on Neural Weights & Backpropagation (Track 1)",
                    "Lesson 2: Fine-Tuning custom weights using LoRA and QLoRA architectures (Track 2)",
                    "Lesson 3: Orchestrating LangGraph agents with local tool routing loops (Track 3)",
                    "Lesson 4: Deploying dockerized endpoints behind AWS API Gateways (Track 4)"
                  ].map((lesson, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-850/50">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={studentLessonsCompleted[idx]} 
                          onChange={() => handleToggleStudentLesson(idx)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-850 w-3.5 h-3.5"
                        />
                        <span className="text-xs text-slate-200 font-medium">{lesson}</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider ${studentLessonsCompleted[idx] ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {studentLessonsCompleted[idx] ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <h3 className="text-sm font-bold text-white mb-2">Cohort Learning Progress</h3>
              <div className="flex items-end justify-between text-xs mb-1.5">
                <span className="text-slate-400">Total Syllabus</span>
                <span className="text-indigo-400 font-extrabold">{studentProgress}% Completed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-850">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${studentProgress}%` }}
                />
              </div>
              
              {studentProgress === 100 && (
                <div className="mt-4 p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-center flex flex-col items-center">
                  <Award className="w-8 h-8 text-indigo-400 mb-1.5 animate-pulse" />
                  <h4 className="text-xs font-bold text-white">Graduation Certified!</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Tamper-proof blockchain validation generated successfully.</p>
                  <button 
                    onClick={() => {
                      const doc = new jsPDF();
                      doc.text("ZEPTRAX AI BOOTCAMP GRADUATION", 20, 20);
                      doc.text(`Student: ${profile.fullName}`, 20, 30);
                      doc.text(`Admissions Score: ${profile.admissionScore}%`, 20, 40);
                      doc.save('certificate.pdf');
                    }}
                    className="mt-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold transition flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Certificate PDF</span>
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col h-[320px]">
              <h3 className="text-sm font-bold text-white mb-3">Zep AI Classroom Mentor</h3>
              <div className="flex-1 overflow-y-auto space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-850/50 text-[11px] font-mono leading-relaxed mb-3">
                {studentChatLog.map((log, idx) => (
                  <div key={idx} className={log.sender === 'zep' ? 'text-indigo-400' : 'text-slate-300'}>
                    <span className="font-extrabold">{log.sender === 'zep' ? 'Zep AI: ' : 'You: '}</span>
                    <span>{log.text}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleStudentChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={studentChatInput}
                  onChange={(e) => setStudentChatInput(e.target.value)}
                  placeholder="Ask a classroom query..."
                  className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button 
                  type="submit"
                  className="px-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-3">
              <h3 className="text-sm font-bold text-white">Student Community Hub</h3>
              <div className="flex gap-2">
                <a href="https://discord.gg" target="_blank" rel="noreferrer" className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-indigo-500/40 text-center text-xs font-bold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Discord</span>
                </a>
                <a href="https://slack.com" target="_blank" rel="noreferrer" className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-indigo-500/40 text-center text-xs font-bold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>Slack</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. APPLICANT WORKSPACE (ADMISSIONS WIZARD)
  return (
    <div className="space-y-6">
      <ApplicationTrackingDashboard />
      
      {/* Warning banner for Need More Info */}
      {userApplications.some(a => a.status === 'need_more_info') && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <div>
              <span className="font-extrabold block">Information Clarification Requested</span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                Admissions request: {userApplications.find(a => a.status === 'need_more_info')?.notes || "Please review your education details."}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveStep(1);
            }}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-lg transition"
          >
            Update Fields
          </button>
        </div>
      )}

      {/* Program Summary Hero card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase tracking-wider">
                Applying To:
              </span>
              <select
                value={selectedBootcampId}
                onChange={(e) => {
                  setSelectedBootcampId(e.target.value);
                  localStorage.setItem('zeptrax_selected_job_id', e.target.value);
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] text-cyan-300 font-black focus:outline-none"
              >
                <optgroup label="Bootcamp Courses">
                  {jobs.filter((job) => job.id.includes('bootcamp') && job.status === 'active').map((job) => (
                    <option key={job.id} value={job.id}>{job.title} (Course)</option>
                  ))}
                </optgroup>
                <optgroup label="Job Postings">
                  {jobs.filter((job) => !job.id.includes('bootcamp') && job.status === 'active').map((job) => (
                    <option key={job.id} value={job.id}>{job.title} (Job Posting)</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">{activeBootcamp.title}</h2>
            <p className="text-xs text-slate-400 max-w-xl">{activeBootcamp.description}</p>
            {activeBootcamp.courseInfo && (
              <p className="text-[10px] text-cyan-300/80 max-w-xl">{activeBootcamp.courseInfo.duration} · {activeBootcamp.courseInfo.schedule} · {activeBootcamp.courseInfo.contentHours}</p>
            )}
          </div>
          
          <div className="shrink-0 flex items-center gap-4 border-l border-slate-800 pl-6">
            <div className="text-center">
              <span className="block text-2xl font-black text-red-500">12</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Seats Remaining</span>
            </div>
            <div className="text-center border-l border-slate-800 pl-4">
              <span className="block text-sm font-black text-white">August 15</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Next Batch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Wizard Steps */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          
          {/* Checklist Header */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-xs font-semibold mb-3">
              <span className="text-slate-300 font-bold">Admission Checklist Progress</span>
              <span className="text-indigo-400 font-extrabold">{profile.applicationProgress || 10}% Complete</span>
            </div>
            
            <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-850 overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${profile.applicationProgress || 10}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] font-bold uppercase tracking-wider">
              {[
                { step: 1, label: "Personal" },
                { step: 2, label: "Education" },
                { step: 3, label: "Resume" },
                { step: 4, label: "Quiz" },
                { step: 5, label: "Submit" }
              ].map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (s.step <= activeStep || (profile.applicationProgress || 10) >= (s.step - 1) * 20) {
                      setActiveStep(s.step);
                    }
                  }}
                  className={`p-2.5 rounded-lg border text-center transition flex items-center justify-center gap-1.5 ${
                    activeStep === s.step
                      ? 'bg-indigo-600 border-indigo-500 text-white font-extrabold shadow'
                      : (profile.applicationProgress || 10) >= s.step * 20
                      ? 'bg-slate-950 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-950/40 border-slate-850 text-slate-500'
                  }`}
                >
                  {(profile.applicationProgress || 10) >= s.step * 20 ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span>0{s.step}</span>
                  )}
                  <span className="truncate">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Steps panel */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            
            {/* Autosave feedback banner */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-4">
              <h3 className="text-sm font-extrabold text-white">Step {activeStep} Panel</h3>
              {isSavingDraft ? (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 animate-pulse">
                  <Check className="w-3.5 h-3.5" />
                  <span>Draft Autosaved</span>
                </span>
              ) : lastSaved ? (
                <span className="text-[9px] text-slate-500 font-mono">
                  Saved at {lastSaved}
                </span>
              ) : null}
            </div>

            {/* STEP 1: Personal Details */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      value={profile.fullName} 
                      disabled
                      className="w-full bg-slate-950 border border-slate-855 rounded-xl px-4 py-2.5 text-xs text-slate-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      value={profile.email} 
                      disabled
                      className="w-full bg-slate-950 border border-slate-855 rounded-xl px-4 py-2.5 text-xs text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-450 mb-1 font-bold">Contact Phone *</label>
                    <input 
                      type="text" 
                      value={appPhone} 
                      onChange={(e) => setAppPhone(e.target.value)}
                      placeholder="+91-98765-43210"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-455 mb-1 font-bold">Current Location *</label>
                    <input 
                      type="text" 
                      value={appLocation} 
                      onChange={(e) => setAppLocation(e.target.value)}
                      placeholder="e.g. Noida, Delhi, Bengaluru"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Professional Bio Summary</label>
                  <textarea 
                    value={appBio} 
                    onChange={(e) => setAppBio(e.target.value)}
                    rows={4}
                    placeholder="Briefly describe your programming background and career goals in AI..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleSavePersonalInfo}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-md active:scale-[0.98] transition flex items-center gap-1.5 self-start"
                >
                  <span>Save and Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Education and Experience */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Education details</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Institution/College *</label>
                    <input 
                      type="text" 
                      value={appInstitution} 
                      onChange={(e) => setAppInstitution(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Graduation Year *</label>
                    <input 
                      type="text" 
                      value={appGradYear} 
                      onChange={(e) => setAppGradYear(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Degree Program *</label>
                  <input 
                    type="text" 
                    value={appDegree} 
                    onChange={(e) => setAppDegree(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mt-6 pt-3 border-t border-slate-850">Work Experience (Optional)</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Company Name</label>
                    <input 
                      type="text" 
                      value={appCompany} 
                      onChange={(e) => setAppCompany(e.target.value)}
                      placeholder="e.g. Google India (leave blank if Fresher)"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Duration</label>
                    <input 
                      type="text" 
                      value={appExpDuration} 
                      onChange={(e) => setAppExpDuration(e.target.value)}
                      placeholder="e.g. 18 Months"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Role Title</label>
                  <input 
                    type="text" 
                    value={appExpRole} 
                    onChange={(e) => setAppExpRole(e.target.value)}
                    placeholder="e.g. Frontend Associate"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSaveEducationAndExp}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-md active:scale-[0.98] transition flex items-center gap-1.5"
                  >
                    <span>Save and Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Resume upload and parse */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Paste the text of your CV / resume below. Our background parser will index your skills, certifications, and experience structure instantly.
                </p>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Resume Raw Text Content *</label>
                  <textarea 
                    value={cvText} 
                    onChange={(e) => setCvText(e.target.value)}
                    rows={8}
                    placeholder="Paste full text of your CV / Resume here..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono resize-none"
                  />
                </div>

                {isParsing && (
                  <div className="py-2.5 flex items-center gap-2 text-xs text-indigo-400 font-mono">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span>Parsing CV parameters, mapping node vectors...</span>
                  </div>
                )}

                {parseSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Resume parsed and saved successfully to database index!</span>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveStep(2)}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleParseResume}
                    disabled={!cvText.trim() || isParsing}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-white shadow-md active:scale-[0.98] transition flex items-center gap-1.5"
                  >
                    <span>Parse and Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Career Quiz & AI Admissions Interview */}
            {activeStep === 4 && (
              <div className="space-y-4">
                {!quizScore ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-xl">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Admissions Quiz</span>
                      <h4 className="text-xs font-bold text-white">Question {activeQuizQ + 1} of {quizQuestions.length}</h4>
                      <p className="text-xs font-bold text-slate-200 mt-2">{quizQuestions[activeQuizQ].q}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2">
                      {quizQuestions[activeQuizQ].options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(opt)}
                          className="p-3 bg-slate-950 border border-slate-805 hover:border-indigo-500 text-left rounded-xl text-xs font-medium text-slate-300 hover:text-white transition"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : !interviewRecord ? (
                  <div className="space-y-4 text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h4 className="text-base font-extrabold text-white">Admissions Quiz Complete!</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      You scored **{quizScore}%** on your initial career alignment quiz. To complete your admission profile, launch the AI chatbot screening.
                    </p>
                    <button
                      onClick={handleLaunchAdmissionsInterview}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-extrabold text-white transition shadow shadow-indigo-500/20 flex items-center gap-1.5 mx-auto"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start AI Admissions Assessment Chat</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-855 h-[280px] overflow-y-auto space-y-2.5 font-mono text-[11px]">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={msg.sender === 'ai' ? 'text-indigo-400' : 'text-slate-300'}>
                          <span className="font-extrabold">{msg.sender === 'ai' ? 'AI Evaluator: ' : 'You: '}</span>
                          <span>{msg.text}</span>
                        </div>
                      ))}
                      {isEvaluating && (
                        <div className="text-yellow-500 animate-pulse font-bold">AI Evaluator: Analyzing response tokens...</div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmitInterviewAnswer()}
                        placeholder="Type your response to the question..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                      <button
                        onClick={handleSubmitInterviewAnswer}
                        className="px-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: Review & Submit */}
            {activeStep === 5 && (
              <div className="space-y-4 text-center py-8">
                <FileCheck className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-xl font-black text-white">Application Ready to Submit!</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your admission files, quiz score ({profile.admissionScore}%), and AI assessment chat transcript have been structured into the enrollment portal.
                </p>

                <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl max-w-sm mx-auto text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Applicant:</span>
                    <span className="font-bold text-white">{profile.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bootcamp Program:</span>
                    <span className="font-bold text-white">{activeBootcamp.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Admissions Score:</span>
                    <span className="font-bold text-emerald-400">{profile.admissionScore || 91}%</span>
                  </div>
                </div>

                <div className="flex gap-4 justify-center pt-4">
                  <button
                    onClick={() => setActiveStep(4)}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinalSubmitApplication}
                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-extrabold text-white shadow-md shadow-indigo-500/20 active:scale-[0.98] transition"
                  >
                    Submit Admissions File
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-850 shadow-md">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">Program Administration</h3>
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-850">
              <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-sm">
                AS
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{assignedRecruiter}</h4>
                <p className="text-[10px] text-slate-400">Assigned Cohort Course Admin</p>
              </div>
            </div>

            <div className="pt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="text-slate-300 font-semibold">24 Weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Batch Start:</span>
                <span className="text-slate-300 font-semibold">15 August 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Placement Assist:</span>
                <span className="text-emerald-400 font-extrabold">95% Success Rate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Average Compensation:</span>
                <span className="text-cyan-400 font-extrabold">₹8L - ₹18L / yr</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      </div>
    );
  };
