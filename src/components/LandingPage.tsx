import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Sparkles, 
  Shield, 
  Briefcase, 
  Cpu, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Terminal,
  MessageSquare,
  TrendingUp,
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
  
  // Interactive search mock state
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedResults, setSimulatedResults] = useState<any[]>([]);

  const mockQueries = [
    "Find Cloud Engineers in Noida with 5+ years experience",
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
          { name: "Suresh Sharma", role: "AWS Cloud Architect", match: "97%", skills: ["AWS", "Terraform", "Python"], location: "Noida" },
          { name: "Amit Verma", role: "Azure Solutions Specialist", match: "92%", skills: ["Azure", "K8s", "Shell"], location: "Bengaluru" }
        ]);
      } else if (query.includes("React")) {
        setSimulatedResults([
          { name: "Priya Patel", role: "Senior Frontend Engineer", match: "96%", skills: ["React", "TypeScript", "Tailwind"], location: "Mumbai" },
          { name: "Rohan Gupta", role: "Fullstack React Developer", match: "89%", skills: ["React", "Node.js", "Express"], location: "Delhi" }
        ]);
      } else {
        setSimulatedResults([
          { name: "Karan Singh", role: "DevOps & SRE Engineer", match: "95%", skills: ["Kubernetes", "Docker", "AWS"], location: "Noida" }
        ]);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Neon Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
              HA
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">HireAI Corporate ATS</span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-semibold">
            {isLoggedIn ? (
              <span className="text-slate-450">Active Session: {currentUser?.name}</span>
            ) : (
              <button
                onClick={() => onEnterPortal('signin')}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time Talent Sourcing &amp; Applicant Tracking</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          AI-Powered Recruitment: <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Streamlined, Proctored, Fast</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Screen corporate candidates, trigger proctored testing modules, schedule live calendars, and release digital offer letters.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onEnterPortal('apply')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
          >
            <Briefcase className="w-4.5 h-4.5" />
            <span>Join Open Openings</span>
          </button>
        </div>
      </section>

      {/* Interactive AI Search Simulator */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
              <Terminal className="w-3.5 h-3.5" />
              <span>Sourcing Engine Sandbox</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Test Drive Our Sourcing Assistant Simulator
            </h2>
            <p className="text-slate-400 text-xs mt-4 leading-relaxed">
              Experience the power of parsing queries. The backend filters candidates instantly, analyzing credentials, location match rates, and skills.
            </p>

            <div className="mt-6 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Try clicking a sample query:</p>
              <div className="flex flex-col gap-2">
                {mockQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSimulateSearch(q)}
                    className="text-left px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-xs font-medium text-slate-350 hover:text-white transition flex items-center justify-between"
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
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-[10px] font-mono text-slate-500 ml-2">hire_ai_query_terminal.sh</span>
              </div>
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest">Active Sim</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Enter Sourcing query:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchPrompt}
                    onChange={(e) => setSearchPrompt(e.target.value)}
                    placeholder="Type: Find Cloud Engineers in Noida..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none placeholder-slate-600 font-mono"
                  />
                  <button
                    onClick={() => handleSimulateSearch(searchPrompt || "Find Cloud Engineers")}
                    className="absolute right-2 top-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[10px] font-bold text-white transition"
                  >
                    Run Search
                  </button>
                </div>
              </div>

              {/* Loader */}
              {isSimulating && (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-mono text-slate-400">Parsing query semantics & matching index db...</span>
                </div>
              )}

              {/* Simulation Result */}
              {!isSimulating && simulatedResults.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-mono text-slate-500">Query processed. Matches found:</p>
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
                            <span key={sIdx} className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-450">{s}</span>
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
                  <span className="text-xs font-mono">Simulated query output terminal ready.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Available Vacancies Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <h2 className="text-2xl font-extrabold text-white mb-6">Open vacancies</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {jobs.filter((job) => job.status === 'published').map((job) => (
            <div key={job.id} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/30 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{job.domain}</span>
                  <span className="text-[10px] text-slate-500">{job.location}</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">{job.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{job.description}</p>
              </div>
              <div className="mt-5 border-t border-slate-900 pt-3 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 capitalize">{job.employmentType?.replace('_', ' ')} · {job.workMode}</span>
                <button onClick={() => onEnterPortal('apply', job.id)} className="text-xs font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition cursor-pointer">
                  <span>Apply Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
