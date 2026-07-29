import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Upload,
  Play,
  Send,
  Check,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Clock,
  Award,
  FileText,
  Sparkles,
  Laptop,
  CheckCircle2,
  Cpu,
  ShieldAlert,
  AlertTriangle,
  DollarSign,
  Globe,
  EyeOff
} from 'lucide-react';

interface LandingApplyWizardProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// Dynamic Question Banks per Target Domain/Role
const ROLE_QUESTION_BANKS: Record<string, Array<{ q: string; options: string[]; correctIdx: number }>> = {
  job_senior_dev: [
    {
      q: "In React 19 / Modern JS, how does memoization using useMemo optimize performance?",
      options: [
        "By caching calculation results across re-renders unless dependencies change",
        "By running the calculation inside a background web worker thread",
        "By converting JSON data into static binary buffers",
        "By preventing DOM updates entirely"
      ],
      correctIdx: 0
    },
    {
      q: "Which database index structure is optimized for fast B-Tree range queries and O(log N) lookups?",
      options: [
        "Balanced B-Tree (B+ Tree) Index",
        "Hash Index (O(1) exact match only)",
        "Unsorted Linked List",
        "Linear Array Scanning"
      ],
      correctIdx: 0
    },
    {
      q: "What design pattern decouples microservice event producers from consumers using message queues?",
      options: [
        "Publish-Subscribe (Pub/Sub) Event Bus",
        "Monolithic Synchronous RPC",
        "Client-Side Polling Loop",
        "Direct Shared Memory Mutex"
      ],
      correctIdx: 0
    }
  ],
  job_security_analyst: [
    {
      q: "What security vulnerability is mitigated by setting Content-Security-Policy (CSP) and HTTPOnly cookie flags?",
      options: [
        "Cross-Site Scripting (XSS) & Session Hijacking",
        "SQL Injection (SQLi) in database queries",
        "Buffer Overflow in C binary execution",
        "DNS Cache Poisoning"
      ],
      correctIdx: 0
    },
    {
      q: "In Cloud Identity and Access Management (IAM), what does the Principle of Least Privilege dictate?",
      options: [
        "Users/roles are granted ONLY the exact minimum permissions required to perform their task",
        "All engineers get full root access during emergency deployment windows",
        "Password rotation is enforced every 24 hours",
        "Firewall ports 80 and 443 are permanently blocked"
      ],
      correctIdx: 0
    },
    {
      q: "What is the primary objective of a Red Team engagement compared to Blue Team?",
      options: [
        "Red Team simulates real-world adversary attacks to uncover security flaws",
        "Red Team maintains firewall rules and monitors SOC alerts 24/7",
        "Red Team writes automated unit tests for frontend code",
        "Red Team manages cloud server billing accounts"
      ],
      correctIdx: 0
    }
  ],
  job_free_ai: [
    {
      q: "What does 'Prompt Engineering' refer to in Generative AI systems?",
      options: [
        "Crafting structured input text to guide LLM response quality, format, and behavior",
        "Building physical GPU microchips for neural networks",
        "Writing CSS styles for AI chat bubbles",
        "Compiling Python code into C++ binaries"
      ],
      correctIdx: 0
    },
    {
      q: "In Retrieval-Augmented Generation (RAG), what is the role of Vector Embeddings?",
      options: [
        "Converting text into numerical vectors to search semantically relevant context",
        "Encrypting user passwords with SHA-256 hash algorithms",
        "Compressing image file sizes for fast web loading",
        "Generating PDF certificates automatically"
      ],
      correctIdx: 0
    },
    {
      q: "Which library is most widely used in Python for data manipulation using DataFrames?",
      options: [
        "Pandas",
        "Express.js",
        "Tailwind",
        "Redux"
      ],
      correctIdx: 0
    }
  ],
  default: [
    {
      q: "Which programming language is predominantly used for machine learning and AI development?",
      options: ["Python", "PHP", "HTML", "Bash"],
      correctIdx: 0
    },
    {
      q: "What does API stand for in software engineering?",
      options: [
        "Application Programming Interface",
        "Automated Program Integration",
        "Advanced Protocol Infrastructure",
        "Applied Processing Identifier"
      ],
      correctIdx: 0
    },
    {
      q: "Which cloud provider offers AWS EC2 and S3 bucket storage services?",
      options: [
        "Amazon Web Services (AWS)",
        "Google Cloud Platform (GCP)",
        "Microsoft Azure",
        "Oracle Cloud"
      ],
      correctIdx: 0
    }
  ]
};

export const LandingApplyWizard: React.FC<LandingApplyWizardProps> = ({ onSuccess, onCancel }) => {
  const { jobs, submitAdmissionsApplication } = usePortal();

  // Wizard state
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedBootcampId, setSelectedBootcampId] = useState<string>(() => {
    return localStorage.getItem('cloudinntech_selected_job_id') || 'job_ai_bootcamp';
  });

  const activeBootcamp = jobs.find(j => j.id === selectedBootcampId) || jobs[0];

  // Detect if selected program is a Paid Master's Course (tuition based)
  const isPaidCourse = selectedBootcampId.includes('bootcamp') || activeBootcamp.title.toLowerCase().includes('masters');

  // Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Noida');
  const [bio, setBio] = useState('');

  // Edu & Exp
  const [degree, setDegree] = useState('B.Tech in Computer Science');
  const [institution, setInstitution] = useState('VIT University');
  const [gradYear, setGradYear] = useState('2025');
  const [company, setCompany] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expDuration, setExpDuration] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // CV Parsing
  const [cvText, setCvText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);

  // Dynamic Quiz / Assessment States
  const currentQuestionSet = ROLE_QUESTION_BANKS[selectedBootcampId] || ROLE_QUESTION_BANKS.default;
  const [activeQuizQ, setActiveQuizQ] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Anti-Cheat Engine States
  const [tabWarnings, setTabWarnings] = useState<number>(0);
  const [antiCheatViolated, setAntiCheatViolated] = useState<boolean>(false);
  const [questionTimer, setQuestionTimer] = useState<number>(25); // 25s per question
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);

  // AI Interview states
  const [aiInterviewActive, setAiInterviewActive] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'candidate'; text: string }>>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const interviewQuestions = [
    { id: 'q1', question: "Briefly explain the difference between supervised and unsupervised learning algorithms." },
    { id: 'q2', question: "How would you handle a dataset that has highly imbalanced target classes?" }
  ];

  // Autosave
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState('');

  useEffect(() => {
    const savedDraft = localStorage.getItem('cloudinntech_landing_draft');
    if (savedDraft) {
      try {
        const data = JSON.parse(savedDraft);
        if (data.name) setName(data.name);
        if (data.email) setEmail(data.email);
        if (data.phone) setPhone(data.phone);
        if (data.location) setLocation(data.location);
        if (data.bio) setBio(data.bio);
        if (data.degree) setDegree(data.degree);
        if (data.institution) setInstitution(data.institution);
        if (data.gradYear) setGradYear(data.gradYear);
        if (data.company) setCompany(data.company);
        if (data.expRole) setExpRole(data.expRole);
        if (data.expDuration) setExpDuration(data.expDuration);
        if (data.expDesc) setExpDesc(data.expDesc);
        if (data.cvText) setCvText(data.cvText);
        if (data.activeStep) setActiveStep(data.activeStep);
      } catch (e) {
        console.error("Draft reading failed:", e);
      }
    }
  }, []);

  useEffect(() => {
    const draft = { name, email, phone, location, bio, degree, institution, gradYear, company, expRole, expDuration, expDesc, cvText, activeStep };
    const timer = setTimeout(() => {
      localStorage.setItem('cloudinntech_landing_draft', JSON.stringify(draft));
      setIsSavingDraft(true);
      setLastSaved(new Date().toLocaleTimeString());
      const clearSave = setTimeout(() => setIsSavingDraft(false), 1500);
      return () => clearTimeout(clearSave);
    }, 1000);
    return () => clearTimeout(timer);
  }, [name, email, phone, location, bio, degree, institution, gradYear, company, expRole, expDuration, expDesc, cvText, activeStep]);

  // Anti-Cheat: Tab Switch & Window Blur Detector
  useEffect(() => {
    if (activeStep !== 4 || isPaidCourse || quizScore !== null || !isQuizActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden || !document.hasFocus()) {
        setTabWarnings(prev => {
          const nextCount = prev + 1;
          if (nextCount >= 3) {
            setAntiCheatViolated(true);
            setQuizScore(0);
            setIsQuizActive(false);
          }
          return nextCount;
        });
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleVisibilityChange);
    };
  }, [activeStep, isQuizActive, isPaidCourse, quizScore]);

  // Anti-Cheat: Question Timer Countdown
  useEffect(() => {
    if (activeStep !== 4 || !isQuizActive || quizScore !== null || isPaidCourse || antiCheatViolated) return;

    const timer = setInterval(() => {
      setQuestionTimer(prev => {
        if (prev <= 1) {
          handleAnswerQuiz("__TIME_EXPIRED__");
          return 25;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeStep, isQuizActive, activeQuizQ, quizScore, isPaidCourse, antiCheatViolated]);

  // Actions
  const handleSavePersonalInfo = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Account Name, Email, and secure Password are required to save credentials.");
      return;
    }
    if (!phone.trim() || !location.trim()) {
      alert("Please enter Contact Phone and Current Location.");
      return;
    }
    setActiveStep(2);
  };

  const handleSaveEducationAndExp = () => {
    if (!institution.trim() || !degree.trim()) {
      alert("Institution and Degree Program are required.");
      return;
    }
    setActiveStep(3);
  };

  const handleParseCV = () => {
    if (!cvText.trim()) {
      alert("Please enter or paste raw resume text to evaluate profile.");
      return;
    }
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
      setParseSuccess(true);
      setActiveStep(4);
      if (!isPaidCourse) {
        setIsQuizActive(true);
        setQuestionTimer(25);
      }
    }, 1200);
  };

  const handleAnswerQuiz = (option: string) => {
    const nextAnswers = [...quizAnswers, option];
    setQuizAnswers(nextAnswers);
    setQuestionTimer(25);

    if (activeQuizQ < currentQuestionSet.length - 1) {
      setActiveQuizQ(prev => prev + 1);
    } else {
      setIsQuizActive(false);
      const score = Math.round(((nextAnswers.filter((a, idx) => a === currentQuestionSet[idx]?.options[0]).length) / currentQuestionSet.length) * 100);
      setQuizScore(score);
    }
  };

  const handleStartAIInterview = () => {
    setAiInterviewActive(true);
    setChatMessages([
      { sender: 'ai', text: `Welcome ${name}! I am the CloudInnTech Admissions evaluator. ${interviewQuestions[0].question}` }
    ]);
  };

  const handleSubmitInterviewAnswer = () => {
    if (!currentAnswer.trim()) return;
    const msg = currentAnswer;
    setCurrentAnswer('');
    setChatMessages(prev => [...prev, { sender: 'candidate', text: msg }]);

    if (currentQuestionIdx < interviewQuestions.length - 1) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { sender: 'ai', text: interviewQuestions[nextIdx].question }
        ]);
      }, 600);
    } else {
      setIsEvaluating(true);
      setTimeout(() => {
        setIsEvaluating(false);
        setChatMessages(prev => [
          ...prev,
          { sender: 'ai', text: 'Evaluation complete. Your chatbot text logs have been compiled successfully.' }
        ]);
        setTimeout(() => setActiveStep(5), 1000);
      }, 1500);
    }
  };

  const handleFinalSubmit = () => {
    const profileDetails = {
      phone,
      location,
      bio,
      degree,
      institution,
      gradYear,
      company,
      experienceYears: company ? 2 : 0,
      skills: ['React', 'Python'],
      githubUrl: `https://github.com/${name.toLowerCase().replace(/\s/g, '')}`,
      linkedinUrl: `https://linkedin.com/in/${name.toLowerCase().replace(/\s/g, '')}`,
      portfolioUrl: `https://${name.toLowerCase().replace(/\s/g, '')}.dev`,
      cvText,
      admissionScore: quizScore || 95
    };

    submitAdmissionsApplication(name, email, password, profileDetails, selectedBootcampId);
    alert('Admissions application file submitted directly to the tracking portal!');
    localStorage.removeItem('cloudinntech_landing_draft');
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">

      {/* Background Neon Blurs — same as landing page */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Branded Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-white tracking-tight">CloudInnTech</span>
              <span className="block text-[9px] font-semibold text-slate-400 tracking-wider uppercase">Application Portal</span>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Wizard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        <div className="space-y-6">

          {/* Wizard Header Bar */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase tracking-wider">
                  Application Target:
                </span>
                <select
                  value={selectedBootcampId}
                  onChange={(e) => {
                    setSelectedBootcampId(e.target.value);
                    localStorage.setItem('cloudinntech_selected_job_id', e.target.value);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] text-cyan-300 font-black focus:outline-none cursor-pointer"
                >
                  <optgroup label="🎓 Paid Master's Programs (Test Waived)">
                    <option value="job_ai_bootcamp">01. Masters in AI with Project Management (Paid Course)</option>
                    <option value="job_devops_bootcamp">10. Masters in AI with AWS DevOps Engineering (Paid Course)</option>
                    <option value="job_cyber_bootcamp">22. Masters in AI with Cybersecurity - Blue Team (Paid Course)</option>
                    <option value="job_fullstack_bootcamp">20. Masters in AI with Full Stack Development (Paid Course)</option>
                    <option value="job_datascience_bootcamp">03. Masters in AI with Data Science (Paid Course)</option>
                  </optgroup>
                  <optgroup label="⚡ Free Starter Courses (Proctored Test Required)">
                    <option value="job_free_ai">Introduction to AI &amp; Generative AI Fundamentals (Free Starter)</option>
                  </optgroup>
                  <optgroup label="💼 Job Vacancies (Proctored Test Required)">
                    <option value="job_senior_dev">Senior Software Developer (Full-time Job Posting)</option>
                    <option value="job_security_analyst">Cybersecurity Specialist (Full-time Job Posting)</option>
                  </optgroup>
                </select>
              </div>
              <h2 className="text-xl font-black text-white">{activeBootcamp.title}</h2>
              <p className="text-xs text-slate-400 max-w-xl">{activeBootcamp.description}</p>
            </div>

            <button
              onClick={onCancel}
              className="px-4 py-2 bg-slate-950 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Cancel & Back
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left wizard grid panel */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-xs font-semibold mb-3">
                  <span className="text-slate-355 text-slate-300 font-bold">Details Questionnaire Progress</span>
                  <span className="text-indigo-400 font-extrabold">{activeStep * 20}% Complete</span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-850 overflow-hidden mb-6">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${activeStep * 20}%` }}
                  />
                </div>

                <div className="grid grid-cols-5 gap-1.5 text-[9px] font-bold uppercase tracking-wider text-center">
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
                        if (s.step < activeStep) setActiveStep(s.step);
                      }}
                      className={`py-2 rounded-lg border transition ${activeStep === s.step
                        ? 'bg-indigo-650/20 border-indigo-500 text-white font-extrabold shadow'
                        : activeStep > s.step
                          ? 'bg-slate-950 border-emerald-500/20 text-emerald-400'
                          : 'bg-slate-950/40 border-slate-850 text-slate-650 cursor-not-allowed'
                        }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                {/* Header info */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-4">
                  <h3 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest font-mono">Step {activeStep} Details Panel</h3>
                  {isSavingDraft && (
                    <span className="text-[9px] text-emerald-400 font-mono animate-pulse">Draft Autosaved</span>
                  )}
                </div>

                {/* STEP 1: Personal Profile */}
                {activeStep === 1 && (
                  <div className="space-y-4 text-slate-300">
                    <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs flex items-start gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Set up your login credentials. If your application is accepted, these will be used to access the Student Learning Workspace.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Full Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Abhishekh Kumar Jha"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Email Address *</label>
                        <input
                          type="email"
                          placeholder="name@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Set Password *</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-855 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Phone Number *</label>
                        <input
                          type="text"
                          placeholder="+91-98765-43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Profile Bio summary</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Short description of your skills and career targets."
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none font-mono"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleSavePersonalInfo}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition active:scale-[0.98] flex items-center gap-1 cursor-pointer"
                      >
                        <span>Save & Next</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Education & Job History */}
                {activeStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-450 mb-1">Alma Mater / Institution *</label>
                        <input
                          type="text"
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          className="w-full bg-slate-955 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-455 mb-1">Degree Program / Course *</label>
                        <input
                          type="text"
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          className="w-full bg-slate-955 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-455 mb-1">Graduation Year</label>
                      <input
                        type="text"
                        value={gradYear}
                        onChange={(e) => setGradYear(e.target.value)}
                        className="w-full bg-slate-955 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="border-t border-slate-800 pt-4">
                      <h4 className="text-xs font-black text-white mb-3">Prior Job Slicing (Optional)</h4>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Company</label>
                          <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="e.g. CloudInnTech"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Role Title</label>
                          <input
                            type="text"
                            value={expRole}
                            onChange={(e) => setExpRole(e.target.value)}
                            placeholder="e.g. Associate"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Duration</label>
                          <input
                            type="text"
                            value={expDuration}
                            onChange={(e) => setExpDuration(e.target.value)}
                            placeholder="e.g. 1 Year"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-between">
                      <button
                        onClick={() => setActiveStep(1)}
                        className="px-6 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSaveEducationAndExp}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition cursor-pointer"
                      >
                        Save & Next
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Resume Indexing */}
                {activeStep === 3 && (
                  <div className="space-y-4">
                    <div className="p-5 border border-dashed border-slate-800 rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-center space-y-3">
                      <Upload className="w-10 h-10 text-indigo-400" />
                      <h4 className="text-xs font-extrabold text-white">Paste Raw Resume Text</h4>
                      <p className="text-[10px] text-slate-500 max-w-sm">
                        Enter your skills, education, and credentials below. The parser indexes these fields to rank your application match score.
                      </p>
                    </div>

                    <textarea
                      value={cvText}
                      onChange={(e) => setCvText(e.target.value)}
                      placeholder="Paste your complete resume details here..."
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-550 focus:border-indigo-500 font-mono resize-none"
                    />

                    <div className="pt-2 flex justify-between items-center">
                      <button
                        onClick={() => setActiveStep(2)}
                        className="px-6 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleParseCV}
                        disabled={isParsing}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer"
                      >
                        {isParsing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Indexing CV...</span>
                          </>
                        ) : (
                          <span>Index & Parse Resume</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Assessment & Screening */}
                {activeStep === 4 && (
                  <div className="space-y-4">
                    {/* CASE A: Paid Course -> Assessment Waived, Direct Program Investment Info */}
                    {isPaidCourse ? (
                      <div className="space-y-5 animate-fade-in">
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
                          <GraduationCap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                              Direct Admissions — Paid Master's Program
                            </span>
                            <h4 className="text-sm font-bold text-white mt-0.5">
                              Technical Screening Test Waived for {activeBootcamp.title}
                            </h4>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              Because you are enrolling in an official Master's Degree program, pre-admissions technical tests are waived. Your application goes directly to counselor file generation.
                            </p>
                          </div>
                        </div>

                        {/* Program Investment breakdown from PDF */}
                        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <DollarSign className="w-4 h-4 text-cyan-400" />
                              <span>Program Investment (Tuition by Region)</span>
                            </span>
                            <span className="text-[10px] font-mono text-cyan-400 font-bold">Indicative Fees</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                            <div className="p-2 bg-slate-900 rounded-lg border border-slate-850">
                              <span className="text-slate-500 block text-[9px]">India</span>
                              <span className="text-emerald-400 font-extrabold">Rs 50,000</span>
                            </div>
                            <div className="p-2 bg-slate-900 rounded-lg border border-slate-850">
                              <span className="text-slate-500 block text-[9px]">United States</span>
                              <span className="text-white font-extrabold">US$ 500</span>
                            </div>
                            <div className="p-2 bg-slate-900 rounded-lg border border-slate-850">
                              <span className="text-slate-500 block text-[9px]">European Union</span>
                              <span className="text-white font-extrabold">€ 500</span>
                            </div>
                            <div className="p-2 bg-slate-900 rounded-lg border border-slate-850">
                              <span className="text-slate-500 block text-[9px]">UAE / Dubai</span>
                              <span className="text-white font-extrabold">AED 2,500</span>
                            </div>
                          </div>

                          <div className="pt-2 text-[10px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                            <span>✓ 3–4 Months Weekend Live Training</span>
                            <span>✓ 150+ Hours Expert-Led</span>
                            <span>✓ Live Project Internship</span>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-between items-center">
                          <button
                            onClick={() => setActiveStep(3)}
                            className="px-6 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            Back
                          </button>
                          <button
                            onClick={() => {
                              setQuizScore(100);
                              setActiveStep(5);
                            }}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow transition cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Proceed to Final Submission</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* CASE B: Job Application / Free Starter -> Proctored Anti-Cheat Assessment */
                      <div className="space-y-4 animate-fade-in" onCopy={(e) => { e.preventDefault(); alert("⚠️ Copying text is disabled during proctored assessment."); }} onPaste={(e) => { e.preventDefault(); alert("⚠️ Pasting text is disabled during proctored assessment."); }} onContextMenu={(e) => e.preventDefault()}>

                        {/* Proctored Header Badge */}
                        <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs">
                            <Lock className="w-4 h-4 text-emerald-400 animate-pulse" />
                            <span className="font-extrabold text-white">Proctored Anti-Cheat AI Assessment Active</span>
                          </div>
                          <div className="flex items-center space-x-3 text-[10px] font-mono">
                            <span className={`px-2 py-0.5 rounded ${tabWarnings > 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold' : 'bg-slate-900 text-slate-400'}`}>
                              Tab Warnings: {tabWarnings}/3
                            </span>
                            {isQuizActive && quizScore === null && (
                              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-extrabold flex items-center gap-1">
                                <Clock className="w-3 h-3 text-cyan-400 animate-spin" />
                                {questionTimer}s
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Anti-Cheat Violation Terminated Screen */}
                        {antiCheatViolated ? (
                          <div className="p-6 bg-rose-950/30 border border-rose-500/30 rounded-2xl text-center space-y-4">
                            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
                            <h4 className="text-base font-black text-rose-200">Assessment Invalidated: Cheating Violation Flagged</h4>
                            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                              Multiple window tab switches or browser focus losses were recorded ({tabWarnings}/3 warnings). Your test has been terminated and logged with a score penalty.
                            </p>
                            <button
                              onClick={() => {
                                setTabWarnings(0);
                                setAntiCheatViolated(false);
                                setQuizScore(null);
                                setActiveQuizQ(0);
                                setQuizAnswers([]);
                                setIsQuizActive(true);
                                setQuestionTimer(25);
                              }}
                              className="px-6 py-2.5 bg-slate-900 border border-slate-700 hover:border-slate-500 text-white rounded-xl text-xs font-bold transition"
                            >
                              Request Retake (Clear Warnings)
                            </button>
                          </div>
                        ) : quizScore === null ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-indigo-400 font-mono font-bold uppercase tracking-wider">
                                Role Domain: {activeBootcamp.domain || 'Software Technical'}
                              </span>
                              <span className="text-slate-400 text-[10px]">
                                Question {activeQuizQ + 1} of {currentQuestionSet.length}
                              </span>
                            </div>

                            {/* Animated Question Timer Bar */}
                            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                              <div
                                className="h-full bg-cyan-400 transition-all duration-1000 ease-linear"
                                style={{ width: `${(questionTimer / 25) * 100}%` }}
                              />
                            </div>

                            <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl select-none">
                              <p className="text-xs text-white font-extrabold mb-4 leading-relaxed">
                                {currentQuestionSet[activeQuizQ]?.q}
                              </p>

                              <div className="grid gap-2.5">
                                {currentQuestionSet[activeQuizQ]?.options.map((opt, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleAnswerQuiz(opt)}
                                    className="w-full p-3 bg-slate-900 border border-slate-800 hover:border-indigo-500/60 text-left rounded-xl text-xs font-medium text-slate-200 hover:text-white transition cursor-pointer flex items-center justify-between group"
                                  >
                                    <span>{opt}</span>
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5" />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                              <EyeOff className="w-3 h-3 text-slate-600" />
                              <span>Copy-Paste is locked. Leaving this browser window will trigger security warnings.</span>
                            </div>
                          </div>
                        ) : !aiInterviewActive ? (
                          <div className="text-center py-6 space-y-4 animate-fade-in">
                            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                            <h3 className="text-base font-black text-white">Technical Test Completed (Score: {quizScore}%)</h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                              Your proctored test results have been saved. Launch the <strong className="font-bold text-white">AI Chat Admissions Interview</strong> to finalize step 4 evaluation.
                            </p>
                            <button
                              onClick={handleStartAIInterview}
                              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow transition cursor-pointer animate-pulse"
                            >
                              Launch AI Chat Interview
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4 animate-fade-in flex flex-col h-[350px]">
                            <h3 className="text-xs font-bold text-white flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                              <span>AI Chat Admissions Interview</span>
                            </h3>

                            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-950 border border-slate-855 rounded-xl text-xs font-mono">
                              {chatMessages.map((msg, idx) => (
                                <div key={idx} className={msg.sender === 'ai' ? 'text-indigo-400' : 'text-slate-200'}>
                                  <span className="font-extrabold">{msg.sender === 'ai' ? 'Evaluator: ' : 'You: '}</span>
                                  <span>{msg.text}</span>
                                </div>
                              ))}
                              {isEvaluating && (
                                <div className="text-slate-500 italic animate-pulse">Running model analysis...</div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={currentAnswer}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmitInterviewAnswer()}
                                placeholder="Type answer and press Enter..."
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                              />
                              <button
                                onClick={handleSubmitInterviewAnswer}
                                className="px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-xs font-bold transition cursor-pointer"
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                )}

                {/* STEP 5: Final Submission */}
                {activeStep === 5 && (
                  <div className="space-y-4 text-center py-6">
                    <Award className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
                    <h3 className="text-lg font-black text-white">Application Ready to Submit!</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Your admissions file, score verification ({quizScore || 85}%), and chatbot logs are structured. Click below to submit.
                    </p>

                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl max-w-xs mx-auto text-left space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Applicant:</span>
                        <span className="font-bold text-white">{name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Email:</span>
                        <span className="font-bold text-white">{email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Target Role:</span>
                        <span className="font-bold text-white truncate max-w-[120px]">{activeBootcamp.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Admissions Score:</span>
                        <span className="font-bold text-emerald-450 text-emerald-400">{quizScore || 85}%</span>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center pt-2">
                      <button
                        onClick={() => setActiveStep(4)}
                        className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleFinalSubmit}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs transition cursor-pointer shadow"
                      >
                        Submit Admissions File
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right side info panel */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">Admissions Info</h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Program Duration:</span>
                    <span className="text-slate-300 font-semibold">24 Weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Next Orientation:</span>
                    <span className="text-slate-300 font-semibold">15 August 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Admissions Rate:</span>
                    <span className="text-emerald-400 font-black">Highly Competitive</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-4 text-center text-slate-500 mt-12">
        <p className="text-[10px]">
          © {new Date().getFullYear()} CloudInnTech. All rights reserved. | Contact: info@cloudinntech.co.in | WhatsApp Support: +91-8368544821
        </p>
      </footer>
    </div>
  );
};
