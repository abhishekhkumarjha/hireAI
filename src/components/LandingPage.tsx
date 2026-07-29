import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Sparkles, 
  Shield, 
  User, 
  Briefcase, 
  Cpu, 
  BookOpen, 
  Award, 
  Search, 
  ArrowRight, 
  GraduationCap, 
  Clock, 
  Settings, 
  DollarSign, 
  CheckCircle2, 
  Lock, 
  Terminal,
  Calculator,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  Flame,
  ChevronRight,
  ExternalLink,
  Laptop,
  Play,
  Check
} from 'lucide-react';

type AuthIntent = 'candidate' | 'recruiter' | 'admin';

interface LandingPageProps {
  onEnterPortal: (mode?: 'apply' | 'free' | 'signin', targetId?: string) => void;
  onEnterPortalAs?: (intent: AuthIntent) => void;
  isLoggedIn: boolean;
  currentUser?: { name: string; role: string } | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterPortal, onEnterPortalAs, isLoggedIn, currentUser }) => {
  const { jobs } = usePortal();
  const enterAs = (intent: AuthIntent) => {
    if (onEnterPortalAs) onEnterPortalAs(intent);
    else onEnterPortal('signin');
  };
  // Tabs for Hire vs Learn platforms
  const [activeTab, setActiveTab] = useState<'hire' | 'learn'>('hire');
  
  // States for interactive AI search simulation
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedResults, setSimulatedResults] = useState<any[]>([]);

  // States for ROI Calculator
  const [monthlyHires, setMonthlyHires] = useState(50);
  const [avgHourlyRate, setAvgHourlyRate] = useState(1500); // in Rupees

  // State for Course Category filter
  const [selectedCourseCat, setSelectedCourseCat] = useState('All');

  // Simulated AI Search Queries
  const mockQueries = [
    "Find Cloud Architects in Noida with 5+ years experience",
    "React frontend developers with TypeScript & AWS certifications",
    "DevOps engineers with Kubernetes expertise and immediate availability",
  ];

  const handleSimulateSearch = (query: string) => {
    setSearchPrompt(query);
    setIsSimulating(true);
    setSimulatedResults([]);
    
    setTimeout(() => {
      setIsSimulating(false);
      if (query.includes("Cloud")) {
        setSimulatedResults([
          { name: "Suresh Sharma", role: "AWS Cloud Architect", match: "97%", skills: ["AWS", "Terraform", "Python", "Docker"], location: "Noida" },
          { name: "Amit Verma", role: "Azure Solutions Specialist", match: "92%", skills: ["Azure", "K8s", "Shell", "Terraform"], location: "Bengaluru" }
        ]);
      } else if (query.includes("React")) {
        setSimulatedResults([
          { name: "Priya Patel", role: "Senior Frontend Engineer", match: "96%", skills: ["React", "TypeScript", "Redux", "Tailwind"], location: "Mumbai" },
          { name: "Rohan Gupta", role: "Fullstack React Developer", match: "89%", skills: ["React", "Node.js", "Express", "MongoDB"], location: "Delhi" }
        ]);
      } else {
        setSimulatedResults([
          { name: "Karan Singh", role: "DevOps & SRE Engineer", match: "95%", skills: ["Kubernetes", "Docker", "Jenkins", "AWS"], location: "Noida" },
          { name: "Neha Joshi", role: "Site Reliability Architect", match: "91%", skills: ["K8s", "Terraform", "Prometheus", "GCP"], location: "Bengaluru" }
        ]);
      }
    }, 1500);
  };

  // Masters Programs Data (All 30 Master's in AI Programs from CloudInnTech Edutech)
  const mastersPrograms = [
    { title: "01. Masters in AI with Project Management", cat: "Management", slug: "masters-in-ai-project-management" },
    { title: "02. Masters in AI with Business Intelligence", cat: "Data Science", slug: "masters-in-ai-business-intelligence" },
    { title: "03. Masters in AI with Data Science", cat: "Data Science", slug: "masters-in-ai-data-science" },
    { title: "04. Masters in AI with Business Analysis", cat: "Data Science", slug: "masters-in-ai-business-analysis" },
    { title: "05. Masters in AI with AWS Cloud Architect", cat: "Cloud", slug: "masters-in-ai-aws-cloud-architect" },
    { title: "06. Masters in AI with Google Cloud Architect", cat: "Cloud", slug: "masters-in-ai-google-cloud-architect" },
    { title: "07. Masters in AI with Microsoft Azure Cloud Architect", cat: "Cloud", slug: "masters-in-ai-azure-cloud-architect" },
    { title: "08. Masters in AI with Oracle Cloud Architect", cat: "Cloud", slug: "masters-in-ai-oracle-cloud-architect" },
    { title: "09. Masters in AI with Databricks", cat: "Data Science", slug: "masters-in-ai-databricks" },
    { title: "10. Masters in AI with AWS DevOps Engineering", cat: "DevOps", slug: "masters-in-ai-aws-devops" },
    { title: "11. Masters in AI with Google Cloud DevOps Engineering", cat: "DevOps", slug: "masters-in-ai-gcp-devops" },
    { title: "12. Masters in AI with Microsoft Azure DevOps Engineering", cat: "DevOps", slug: "masters-in-ai-azure-devops" },
    { title: "13. Masters in AI with AWS Data Engineering", cat: "Data Science", slug: "masters-in-ai-aws-data-engineering" },
    { title: "14. Masters in AI with Google Cloud Data Engineering", cat: "Data Science", slug: "masters-in-ai-gcp-data-engineering" },
    { title: "15. Masters in AI with Microsoft Azure & Microsoft Fabric", cat: "Data Science", slug: "masters-in-ai-azure-fabric" },
    { title: "16. Masters in AI with Oracle Data Engineering", cat: "Data Science", slug: "masters-in-ai-oracle-data" },
    { title: "17. Masters in Cortex AI with Snowflake", cat: "Data Science", slug: "masters-in-cortex-ai-snowflake" },
    { title: "18. Masters in AI with Snowflake Data Engineering", cat: "Data Science", slug: "masters-in-ai-snowflake-data" },
    { title: "19. Masters in AI with MLOps Engineering", cat: "DevOps", slug: "masters-in-ai-mlops" },
    { title: "20. Masters in AI with Full Stack Development", cat: "Development", slug: "masters-in-ai-full-stack" },
    { title: "21. Masters in AI with Blockchain Technology", cat: "Advanced Tech", slug: "masters-in-ai-blockchain" },
    { title: "22. Masters in AI with Cybersecurity (Blue Team)", cat: "Cybersecurity", slug: "masters-in-ai-cybersecurity-blue" },
    { title: "23. Masters in AI with Cybersecurity (Red Team)", cat: "Cybersecurity", slug: "masters-in-ai-cybersecurity-red" },
    { title: "24. Masters in AI with Cloud Security", cat: "Cybersecurity", slug: "masters-in-ai-cloud-security" },
    { title: "25. Masters in AI Automation", cat: "Advanced Tech", slug: "masters-in-ai-automation" },
    { title: "26. Masters in AI with Product Management", cat: "Management", slug: "masters-in-ai-product-management" },
    { title: "27. Masters in AI with Quantum Computing", cat: "Advanced Tech", slug: "masters-in-ai-quantum-computing" },
    { title: "28. Masters in AI with Banking and Insurance", cat: "Management", slug: "masters-in-ai-banking-insurance" },
    { title: "29. Masters in AI with Healthcare", cat: "Advanced Tech", slug: "masters-in-ai-healthcare" },
    { title: "30. Masters in AI with Finance and Accounting", cat: "Management", slug: "masters-in-ai-finance-accounting" }
  ];

  // Free starter courses from Zip
  const freeCourses = [
    { title: "Introduction to Artificial Intelligence", cat: "Free Starter" },
    { title: "Generative AI Fundamentals", cat: "Free Starter" },
    { title: "Prompt Engineering with ChatGPT, Claude & Gemini", cat: "Free Starter" },
    { title: "AI Productivity Tools", cat: "Free Starter" },
    { title: "AI Agents Fundamentals", cat: "Free Starter" },
    { title: "Python Programming Basics", cat: "Free Starter" },
    { title: "AWS Cloud Fundamentals", cat: "Free Starter" },
    { title: "Cyber Security Fundamentals", cat: "Free Starter" }
  ];

  const portalPrograms = jobs
    .filter((job) => job.id.includes('bootcamp') && job.status === 'active')
    .map((job) => ({ id: job.id, title: job.title, cat: job.domain, description: job.description, fee: job.salaryRange, courseInfo: job.courseInfo }));
  // The landing catalog is sourced exclusively from the portal. Closing or editing
  // a course in the Admin portal therefore updates this page immediately.
  const publishedPrograms = portalPrograms;
  const courseCategories = ["All", ...Array.from(new Set(publishedPrograms.map((program) => program.cat))), "Free Starter"];
  const filteredPrograms = publishedPrograms.filter(program => selectedCourseCat === 'All' || program.cat === selectedCourseCat);
  const showFreeStarter = selectedCourseCat === 'All' || selectedCourseCat === 'Free Starter';

  // Math for ROI Calculator
  // On average, screening takes 4 hours per candidate manually. AI cuts it down to 10 minutes.
  const hoursSaved = monthlyHires * 3.8; 
  const cashSaved = Math.round(hoursSaved * avgHourlyRate);

  const navigateToLMS = () => {
    window.location.href = '/learn/';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Neon Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-indigo-400/30 bg-slate-950 shadow-lg shadow-indigo-500/20">
              <img src="/cloudinntech-logo.png" alt="CloudInnTech" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-white tracking-tight">CloudInnTech</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition">Platform</a>
            <a href="#demo" className="hover:text-white transition">Demo</a>
            <a href="#courses" className="hover:text-white transition">Programs</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          <div className="flex items-center space-x-2">
            {/* Portal login options removed from the landing page to enforce domain separation */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Glow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cloud-Native Microservices AI Recruitment OS &amp; Edutech Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          AI-Powered Hiring: <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Faster, Smarter, Fairer</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Automate resume parsing, proctored anti-cheat screening, scheduling, and onboarding in one end-to-end platform engineered by <strong className="font-bold text-white">CloudInnTech</strong>.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onEnterPortal('apply')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-black bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Briefcase className="w-4.5 h-4.5" />
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => {
              const demoElem = document.getElementById('demo');
              if (demoElem) demoElem.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-black bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-cyan-400" />
            <span>Request Demo</span>
          </button>
        </div>

        {/* Social Proof Bar */}
        <div className="mt-16 border-t border-slate-900 pt-8">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Trusted by Hiring &amp; Engineering Teams at</p>
          <div className="mt-4 flex flex-wrap justify-center items-center gap-8 sm:gap-14 opacity-70">
            <span className="text-sm font-black text-slate-300 tracking-wider">ACME CORP</span>
            <span className="text-sm font-black text-slate-300 tracking-wider">TCS GLOBAL</span>
            <span className="text-sm font-black text-slate-300 tracking-wider">INFOSYS</span>
            <span className="text-sm font-black text-slate-300 tracking-wider">CLOUDINNTECH</span>
            <span className="text-sm font-black text-slate-300 tracking-wider">CLOUDINNTECH LABS</span>
          </div>
        </div>
      </section>

      {/* Main Feature Tabs section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white">Dual-Core Ecosystem Architecture</h2>
          <p className="text-sm text-slate-400 mt-2">
            CloudInnTech integrates industry-grade recruitment automation with curriculum-focused technical learning.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('hire')}
              className={`px-6 py-2.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === 'hire' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>CloudInnTech HIRE</span>
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-6 py-2.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === 'learn' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>CloudInnTech EDUTECH</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === 'hire' ? (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Automated Screening Chats</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Screen hundreds of candidates simultaneously using automated chat-based AI screening. Transcripts and metrics are compiled on scorecards immediately.
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Real-time answer scoring</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Custom difficulty adjustment</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Natural Language Search</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Recruiters can parse database profiles using natural language. Query skills, certifications, availability, and location without configuring complex SQL filters.
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Semantic keyword matching</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Auto parsing of uploaded CVs</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <Settings className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Interactive Kanban Board</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Organize candidates via an intuitive drag-and-drop workflow spanning Screening, Assessment, Verdict, and Offer Letter release. LocalStorage cross-tab sync triggers state alerts instantly.
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Rupee compensation calculation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Dynamic e-signature integration</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI-Focused Masters Programs</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Rigorous, industry-mapped 4-month programs linking advanced AI/ML architectures with Cloud Computing, Cybersecurity, DevOps, and Product Management.
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Practical hands-on projects</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Structured syllabus modules</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Blockchain-Verified Badges</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Every graduation badge earned is minted with blockchain verification. Credentials can be instantly embedded on LinkedIn, CVs, or team profiles.
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Standalone embed code</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Tamper-proof validation</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Zep Voice Agent & Support</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Interactive support powered by our custom Zep Voice AI Agent. Directly coordinates class modules, schedules, and admissions inquiries via phone or WhatsApp.
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> WhatsApp: +91-8368544821</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 24/7 AI learning buddy</li>
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Interactive AI Search Simulator */}
      <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
              <Terminal className="w-3.5 h-3.5" />
              <span>Recruiter AI Search Sandbox</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Test Drive Our AI Talent Sourcing Simulator
            </h2>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Experience the power of natural language sourcing. CloudInnTech processes complex recruiting queries, parses skills, and ranks matching candidates in a fraction of a second.
            </p>

            <div className="mt-6 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Try clicking a sample query:</p>
              <div className="flex flex-col gap-2">
                {mockQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSimulateSearch(q)}
                    className="text-left px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-xs font-medium text-slate-300 hover:text-white transition flex items-center justify-between"
                  >
                    <span>"{q}"</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sandbox console */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-[10px] font-mono text-slate-500 ml-2">cloudinntech-query-engine.sh</span>
              </div>
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest">Active Sim</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Enter Sourcing query:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchPrompt}
                    onChange={(e) => setSearchPrompt(e.target.value)}
                    placeholder="Type: Find React engineers with AWS..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none placeholder-slate-600 font-mono"
                  />
                  <button
                    onClick={() => handleSimulateSearch(searchPrompt || "Find React Developers")}
                    className="absolute right-2 top-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[10px] font-bold text-white transition"
                  >
                    Run Sourcing
                  </button>
                </div>
              </div>

              {/* Loader */}
              {isSimulating && (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-mono text-slate-400">Parsing query semantics and scanning index db...</span>
                </div>
              )}

              {/* Simulation Result */}
              {!isSimulating && simulatedResults.length > 0 && (
                <div className="space-y-3 animate-fade-in">
                  <p className="text-[10px] font-mono text-slate-500">Query processed successfully. Found {simulatedResults.length} matching candidates:</p>
                  {simulatedResults.map((cand, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-extrabold text-white">{cand.name}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{cand.location}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{cand.role}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {cand.skills.map((s: string, sIdx: number) => (
                            <span key={sIdx} className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-emerald-400">{cand.match} Match</span>
                        <p className="text-[9px] text-slate-500 mt-0.5">Rank Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Default Empty State */}
              {!isSimulating && simulatedResults.length === 0 && (
                <div className="py-8 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500">
                  <Search className="w-8 h-8 text-slate-600 mb-2" />
                  <span className="text-xs font-mono">Simulated query output terminal ready.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalog Showcase Section */}
      <section id="courses" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Program Catalog</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">CloudInnTech Edutech Masters & Certifications</h2>
            <p className="text-slate-400 text-sm mt-1">
              Select a specialized domain to see curriculum tracks designed with Indian corporate alignment.
            </p>
          </div>
          <button
            onClick={navigateToLMS}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>Launch LMS Player</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter categories pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {courseCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCourseCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition ${
                selectedCourseCat === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => (
            <div 
              key={prog.id} 
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {prog.cat}
                  </span>
                  <div className="flex items-center text-slate-500 text-[10px] gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{prog.courseInfo?.duration || '3–4 Months'}</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {prog.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {prog.description}
                </p>
                {prog.courseInfo && <p className="mt-2 text-[10px] text-slate-500">{prog.courseInfo.format} · {prog.courseInfo.contentHours}</p>}
              </div>

              <div className="mt-5 border-t border-slate-900 pt-3 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">{prog.fee}</span>
                <button
                  onClick={() => onEnterPortal('apply', prog.id)}
                  className="text-xs font-extrabold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredPrograms.length === 0 && selectedCourseCat !== 'Free Starter' && (
            <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center text-sm text-slate-500">
              No active programs are currently published. Course availability is managed in the portal.
            </div>
          )}

          {/* Render Free Courses */}
          {showFreeStarter && freeCourses.map((c, idx) => (
            <div 
              key={`free-${idx}`} 
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Free Course
                  </span>
                  <div className="flex items-center text-slate-500 text-[10px] gap-1">
                    <Laptop className="w-3 h-3" />
                    <span>Self-paced</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                  {c.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Completely free foundation modules. Earn a shareable Skill Up Certificate upon module completion.
                </p>
              </div>

              <div className="mt-5 border-t border-slate-900 pt-3 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">₹0 Tuition Fee</span>
                <button
                  onClick={() => onEnterPortal('free')}
                  className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Start Free</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Regional Program Investment & SaaS Subscription Tiers Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            <span>SaaS Platform &amp; Edutech Pricing</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Transparent Plans for Teams of All Sizes</h2>
          <p className="text-slate-400 text-sm mt-2">
            Choose a corporate SaaS recruitment plan or enroll directly in an accredited Master's Program.
          </p>
        </div>

        {/* 1. SaaS Recruitment OS Subscription Tiers Table (From Technical Spec) */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {/* Starter Plan */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/30 transition shadow-xl">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Starter Plan</span>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-black text-white">$99</span>
                <span className="text-xs text-slate-500 ml-1 font-mono">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">For startups and small HR teams starting with AI recruitment.</p>

              <div className="mt-6 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Basic ATS &amp; Candidate Portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AI Resume Parser (Tika / NLP OCR)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Job Listings (1 Organization)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Standard Proctored Quiz Engine</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onEnterPortal('apply')}
              className="mt-8 w-full py-3 bg-slate-950 border border-slate-800 hover:border-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Start Free Trial
            </button>
          </div>

          {/* Professional Plan */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 border-2 border-indigo-500 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow">
              Most Popular
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Professional Plan</span>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-black text-white">$299</span>
                <span className="text-xs text-slate-500 ml-1 font-mono">/ month</span>
              </div>
              <p className="text-xs text-slate-300 mt-2">For growing tech companies requiring AI matching and scheduling.</p>

              <div className="mt-6 space-y-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>All Starter Features Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Smart Calendar Scheduling (Google/Teams)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Vector Skill Matching (pgvector / embeddings)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>3 Recruiter Seats &amp; Kanban Pipelines</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Automated Zoom Video Interview Links</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onEnterPortal('apply')}
              className="mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              Start Free Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/30 transition shadow-xl">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Enterprise Plan</span>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-black text-white">Custom</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">For multi-region enterprises requiring custom SSO, SLAs, and dedicated SRE.</p>

              <div className="mt-6 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>All Professional Features Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Multi-Region Kubernetes Deployments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Custom SAML SSO (Okta / Azure AD)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>24/7 SLA &amp; Dedicated Solutions Engineer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>SOC2, GDPR &amp; PDPA Compliance Controls</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert("Enterprise Sales Desk: Contact sales@cloudinntech.co.in")}
              className="mt-8 w-full py-3 bg-slate-950 border border-slate-800 hover:border-purple-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Contact Sales
            </button>
          </div>
        </div>

        {/* Pricing Table Cards (Matches CloudInnTech Edutech Slide 4) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-16">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between shadow-lg hover:border-indigo-500/40 transition">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">United States (USD)</span>
              <span className="text-2xl font-black text-white mt-1 block">US$ 500</span>
            </div>
            <span className="text-3xl">🇺🇸</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between shadow-lg hover:border-indigo-500/40 transition">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">European Union (EUR)</span>
              <span className="text-2xl font-black text-white mt-1 block">€ 500</span>
            </div>
            <span className="text-3xl">🇪🇺</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between shadow-lg hover:border-indigo-500/40 transition">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">UAE / Dubai (AED)</span>
              <span className="text-2xl font-black text-white mt-1 block">AED 2,500</span>
            </div>
            <span className="text-3xl">🇦🇪</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between shadow-lg hover:border-indigo-500/40 transition">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Singapore (SGD)</span>
              <span className="text-2xl font-black text-white mt-1 block">SGD 600</span>
            </div>
            <span className="text-3xl">🇸🇬</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between shadow-lg hover:border-indigo-500/40 transition">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Australia (AUD)</span>
              <span className="text-2xl font-black text-white mt-1 block">AUS$ 850</span>
            </div>
            <span className="text-3xl">🇦🇺</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between shadow-lg hover:border-cyan-500/40 transition bg-indigo-950/20">
            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 block font-bold">India (INR)</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">Rs 50,000</span>
            </div>
            <span className="text-3xl">🇮🇳</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between shadow-lg hover:border-indigo-500/40 transition">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Russia (RUB)</span>
              <span className="text-2xl font-black text-white mt-1 block">RUB 50,000</span>
            </div>
            <span className="text-3xl">🇷🇺</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-indigo-500/30 flex flex-col justify-center text-center">
            <span className="text-[10px] text-slate-400">Indicative Master's course fees. Regional promos apply.</span>
          </div>
        </div>

        {/* Common Program Features Grid (Matches CloudInnTech Edutech Slide 2 & 3) */}
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Common Program Structure & Student Benefits</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
              <span className="font-extrabold text-cyan-400 block mb-1">⏱ Duration</span>
              <p className="text-slate-300">3–4 Months Intensive</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
              <span className="font-extrabold text-cyan-400 block mb-1">📅 Weekend Schedule</span>
              <p className="text-slate-300">Live Training: Sat 2 hrs, Sun 2 hrs</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
              <span className="font-extrabold text-cyan-400 block mb-1">💻 100% Online</span>
              <p className="text-slate-300">Live Instructor-Led Interactive Classes</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
              <span className="font-extrabold text-cyan-400 block mb-1">📚 Content Depth</span>
              <p className="text-slate-300">150+ Hours Expert-Led Sessions</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
              <span className="font-extrabold text-cyan-400 block mb-1">🛠 Practice Labs</span>
              <p className="text-slate-300">Hands-on Labs & Practical Assignments</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
              <span className="font-extrabold text-cyan-400 block mb-1">🚀 Industry Projects</span>
              <p className="text-slate-300">Real-Time Projects & Capstone</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
              <span className="font-extrabold text-cyan-400 block mb-1">💼 Live Internship</span>
              <p className="text-slate-300">Internship Opportunities on Live Projects</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
              <span className="font-extrabold text-cyan-400 block mb-1">🎓 Career & Placement</span>
              <p className="text-slate-300">Resume Building, Mentorship & Placement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Careers / Active Job Postings Section */}
      <section id="careers" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Career Opportunities</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Active Job Postings (Recruiter Sourced)</h2>
            <p className="text-slate-400 text-sm mt-1 font-medium">
              Apply to active vacancies with CloudInnTech and our network partners. Applications go directly to Course Recruiters.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {jobs.filter((job) => !job.id.includes('bootcamp') && job.status === 'active').map((job) => (
            <div key={job.id} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/30 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3"><span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{job.domain}</span><span className="text-[10px] text-slate-500">{job.type} · {job.location}</span></div>
                <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">{job.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{job.description}</p>
              </div>
              <div className="mt-5 border-t border-slate-900 pt-3 flex items-center justify-between"><span className="text-[10px] font-mono text-slate-500">{job.salaryRange}</span><button onClick={() => onEnterPortal('apply', job.id)} className="text-xs font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition cursor-pointer"><span>Apply Now</span><ChevronRight className="w-3.5 h-3.5" /></button></div>
            </div>
          ))}
          {false && <>
          {/* Job 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Engineering Team
                </span>
                <span className="text-[10px] text-slate-500">Full-time • Noida</span>
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                Senior Software Developer
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Join our AI engineering team constructing neural graph agents, agentic APIs, and RAG pipelines.
              </p>
            </div>
            <div className="mt-5 border-t border-slate-900 pt-3 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">₹12L - ₹22L / yr</span>
              <button
                onClick={() => onEnterPortal('apply', 'job_senior_dev')}
                className="text-xs font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition cursor-pointer"
              >
                <span>Apply Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Job 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Security Team
                </span>
                <span className="text-[10px] text-slate-500">Full-time • Remote</span>
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                Cybersecurity Specialist
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyze cloud network interfaces, design penetration assessments, and configure security parameters.
              </p>
            </div>
            <div className="mt-5 border-t border-slate-900 pt-3 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">₹14L - ₹24L / yr</span>
              <button
                onClick={() => onEnterPortal('apply', 'job_security_analyst')}
                className="text-xs font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition cursor-pointer"
              >
                <span>Apply Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          </>}
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="roi" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="grid lg:grid-cols-2 gap-12 items-center bg-slate-900/30 border border-slate-900 rounded-3xl p-8 sm:p-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
              <Calculator className="w-3.5 h-3.5" />
              <span>Interactive ROI Modeler</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Calculate Your Efficiency Gains
            </h2>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Recruiters waste hundreds of hours manually reviewing resumes and coordinating initial calls. Use our calculator to model the hours and costs CloudInnTech helps reclaim.
            </p>

            <div className="mt-8 space-y-6">
              {/* Slider 1 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Candidates Screened / Month</span>
                  <span className="text-indigo-400 font-extrabold">{monthlyHires} Candidates</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={monthlyHires}
                  onChange={(e) => setMonthlyHires(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Average Hourly Rate of HR/Recruiter</span>
                  <span className="text-indigo-400 font-extrabold">₹{avgHourlyRate.toLocaleString('en-IN')}/hr</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={avgHourlyRate}
                  onChange={(e) => setAvgHourlyRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* ROI Displays */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-center flex flex-col justify-center">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Recruiting Time Saved</span>
              <span className="text-3xl sm:text-4xl font-black text-white mt-2">{hoursSaved.toFixed(0)} hrs</span>
              <p className="text-xs text-slate-400 mt-2">Saved per month using AI screening and automated Zoom calendars</p>
            </div>

            <div className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-center flex flex-col justify-center">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Hiring Capital Saved</span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 mt-2">₹{cashSaved.toLocaleString('en-IN')}</span>
              <p className="text-xs text-slate-400 mt-2">Annualized savings of ₹{(cashSaved * 12).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Answers Hub</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2">What is CloudInnTech?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              CloudInnTech is a next-generation recruitment and upskilling ecosystem. It features an isolated applicant tracking system (ATS) for employers and candidates, combined with a comprehensive blockchain-verified Learning Management System (LMS) for professional training.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2">How do the AI Screening and Interview agents work?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When candidates apply for open roles, the platform can initiate an automated screening interview via chat. The AI agent asks structured questions, transcribes the conversation, dynamically grades response depth, and updates scorecards on the recruiter's Kanban board.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2">Do you provide certifications for the Masters and Free courses?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes. Completing our 4-month Masters programs or self-paced free courses awards you a shareable, blockchain-minted digital badge that recruiters can verify instantly online.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2">How can we contact CloudInnTech for partnership queries?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              You can contact our admissions or corporate partnerships team at <strong className="font-bold text-white">info@cloudinntech.co.in</strong> or chat with us on WhatsApp at <strong className="font-bold text-white">+91-8368544821</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-center text-slate-500">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-indigo-400/30 bg-slate-950 shadow-lg shadow-indigo-500/20">
              <img src="/cloudinntech-logo.png" alt="CloudInnTech" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">CloudInnTech</span>
          </div>
          
          <p className="text-xs max-w-md mx-auto leading-relaxed">
            Leading AI-first talent search engines, automated interviews, and credentialed LMS programs. Developed by <strong className="font-bold text-white">CloudInnTech Co. India</strong>.
          </p>

          <p className="text-[10px] text-slate-600">
            © {new Date().getFullYear()} CloudInnTech. All rights reserved. | Contact: info@cloudinntech.co.in | WhatsApp Support: +91-8368544821
          </p>
        </div>
      </footer>
    </div>
  );
};
