import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Application, CandidateProfile, Job, User } from '../types/portal';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Briefcase,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Award,
  Calendar,
  Send,
  BookOpen,
  Filter,
  Users,
  MessageSquare,
  Sparkles,
  Play,
  FileText,
  X
} from 'lucide-react';

export const RecruiterView: React.FC = () => {
  const {
    currentUser,
    candidateProfiles,
    jobs,
    applications,
    interviews,
    offerLetters,
    offerTemplates,
    cvs,
    runAISearch,
    clearSearchChat,
    scheduleScreeningCall,
    startAIInterview,
    updateApplicationStage,
    releaseOfferLetter,
    updateOfferTemplate,
    associateCandidateWithJob,
    addManualInterviewEvaluation,
  } = usePortal();

  // Navigation states
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'admissions' | 'aiSearch'>('admissions');
  const [activeStatusTab, setActiveStatusTab] = useState<'pending' | 'approved' | 'rejected' | 'interview'>('pending');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProgram, setFilterProgram] = useState('All');
  const [filterExp, setFilterExp] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');

  // AI query search states
  const [nlQuery, setNlQuery] = useState('Find candidates with Python skills who scored above 90% in admissions.');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState<any[]>([]);

  const [selectedAppForOffer, setSelectedAppForOffer] = useState<Application | null>(null);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState<Application | null>(null);
  const [openAppId, setOpenAppId] = useState<string | null>(null);
  const [interviewNotesText, setInterviewNotesText] = useState('');
  const [overallFitText, setOverallFitText] = useState('Excellent match for Gen AI track');
  
  // Admission Offer inputs
  const [offerSalary, setOfferSalary] = useState('₹12,00,050 / yr');
  const [offerJoiningDate, setOfferJoiningDate] = useState('2026-08-15');
  const [customNotes, setCustomNotes] = useState('Standard cohort equipment allowance applies.');
  const [isReleasingOffer, setIsReleasingOffer] = useState(false);

  // Interview Schedule inputs
  const [interviewTimeSlot, setInterviewTimeSlot] = useState('2026-08-01T11:30:00Z');

  // -------------------------------------------------------------
  // ADMISSIONS FILTER LOGIC
  // -------------------------------------------------------------
  
  const getApplicationsForRole = () => {
    return applications.filter(app => {
      const job = jobs.find(j => j.id === app.jobId);
      if (!job) return false;
      // Courses are reviewed by Admin and Super Admin only!
      if (job.id.includes('bootcamp')) {
        return false;
      }
      // Recruiters see Job Postings:
      if (currentUser?.role === 'recruiter') {
        if (currentUser?.email === 'rahul@cloudinntech.co.in' && job.id !== 'job_senior_dev') {
          return false;
        }
        if (currentUser?.email === 'john@cloudinntech.co.in' && job.id !== 'job_security_analyst') {
          return false;
        }
      }
      return true;
    });
  };

  const roleApps = getApplicationsForRole();

  const getFilteredApplications = () => {
    return roleApps.filter(app => {
      const profile = candidateProfiles.find(p => p.userId === app.candidateId);
      const job = jobs.find(j => j.id === app.jobId);
      if (!profile || !job) return false;

      // Status check based on active tab
      const matchesTab = 
        activeStatusTab === 'pending' ? (app.status === 'applied' || app.status === 'shortlisted' || app.status === 'applied') :
        activeStatusTab === 'approved' ? (app.status === 'selected' || app.status === 'offer_sent' || app.status === 'offer_accepted') :
        activeStatusTab === 'rejected' ? (app.status === 'rejected') :
        activeStatusTab === 'interview' ? (app.status === 'screening_scheduled' || app.status === 'interviewing') :
        false;

      if (!matchesTab) return false;

      // Search query check
      const matchesSearch = profile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            profile.email.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Program check
      const matchesProgram = filterProgram === 'All' || job.title === filterProgram;
      if (!matchesProgram) return false;

      // Experience check
      let matchesExp = true;
      if (filterExp !== 'All') {
        if (filterExp === 'Fresher') matchesExp = profile.experienceYears === 0;
        else if (filterExp === '1-2 Years') matchesExp = profile.experienceYears > 0 && profile.experienceYears <= 2;
        else if (filterExp === '3+ Years') matchesExp = profile.experienceYears > 2;
      }
      if (!matchesExp) return false;

      // Location / Country check
      const matchesLocation = filterLocation === 'All' || profile.location.toLowerCase().includes(filterLocation.toLowerCase());
      if (!matchesLocation) return false;

      return true;
    });
  };

  const filteredApps = getFilteredApplications();

  // Counts for tabs based on role assignments
  const pendingCount = roleApps.filter(a => a.status === 'applied' || a.status === 'shortlisted').length;
  const approvedCount = roleApps.filter(a => a.status === 'selected' || a.status === 'offer_sent' || a.status === 'offer_accepted').length;
  const rejectedCount = roleApps.filter(a => a.status === 'rejected').length;
  const interviewCount = roleApps.filter(a => a.status === 'screening_scheduled' || a.status === 'interviewing').length;

  // -------------------------------------------------------------
  // ACTIONS HANDLERS
  // -------------------------------------------------------------

  const handleReleaseOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForOffer) return;
    
    setIsReleasingOffer(true);
    try {
      // release offer letter
      await releaseOfferLetter(selectedAppForOffer.id, offerSalary, offerJoiningDate, customNotes);
      alert('Admission Offer Released Successfully!');
      setSelectedAppForOffer(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReleasingOffer(false);
    }
  };

  const handleScheduleInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForInterview) return;

    scheduleScreeningCall(selectedAppForInterview.id, interviewTimeSlot);
    alert('Admissions Interview Scheduled successfully!');
    setSelectedAppForInterview(null);
  };

  const handleRejectApplication = (appId: string) => {
    if (confirm('Are you sure you want to reject this admissions file?')) {
      updateApplicationStage(appId, 3, 'rejected', 'Admissions profile reviewed and rejected by Course Admin.');
    }
  };

  const handleRequestMoreInfo = (appId: string) => {
    const reason = prompt("Describe what details are missing (e.g. Portfolio link, higher education degree):", "Please add your portfolio URL.");
    if (reason) {
      updateApplicationStage(appId, 1, 'need_more_info', reason);
      alert('Application updated to Need More Info!');
    }
  };

  const handleApproveRegistration = (appId: string) => {
    updateApplicationStage(appId, 1, 'under_review', 'Admissions request approved. Candidate is allowed to enter academic/work details.');
    alert('Application request approved! Candidate can now sign in and complete the details.');
  };

  // AI Sourcing Slices
  const handleAISearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlQuery.trim()) return;

    setIsAiSearching(true);
    setTimeout(() => {
      setIsAiSearching(false);
      // Filter candidate profiles locally to mock
      const match = candidateProfiles.filter(p => p.admissionScore && p.admissionScore >= 80);
      setAiSearchResults(match);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Workspace Selector Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveWorkspaceTab('admissions')}
          className={`pb-3 font-extrabold text-sm transition-all flex items-center gap-2 border-b-2 ${
            activeWorkspaceTab === 'admissions'
              ? 'border-cyan-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Cohort Admissions Panel</span>
        </button>
        <button
          onClick={() => setActiveWorkspaceTab('aiSearch')}
          className={`pb-3 font-extrabold text-sm transition-all flex items-center gap-2 border-b-2 ${
            activeWorkspaceTab === 'aiSearch'
              ? 'border-cyan-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>AI Admissions Query Search</span>
        </button>
      </div>

      {activeWorkspaceTab === 'admissions' ? (
        <div className="space-y-6">
          
          {/* Filters & Search Block */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search applicant name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none placeholder-slate-600"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                
                {/* Program filter */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500"><Filter className="w-3.5 h-3.5 inline mr-1" />Program:</span>
                  <select
                    value={filterProgram}
                    onChange={(e) => setFilterProgram(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                  >
                    <option value="All">All Bootcamps</option>
                    <option value="AI Engineer Bootcamp">AI Engineer Bootcamp</option>
                    <option value="DevOps Systems Masters">DevOps Systems Masters</option>
                  </select>
                </div>

                {/* Experience filter */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500">Exp:</span>
                  <select
                    value={filterExp}
                    onChange={(e) => setFilterExp(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                  >
                    <option value="All">All Levels</option>
                    <option value="Fresher">Freshers</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="3+ Years">3+ Years</option>
                  </select>
                </div>

                {/* Location / Country filter */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500">Location:</span>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                  >
                    <option value="All">All Cities</option>
                    <option value="Noida">Noida</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Application status sub-tabs */}
            <div className="flex border-t border-slate-800/80 pt-4 gap-2 text-xs font-bold uppercase tracking-wider">
              {[
                { key: 'pending' as const, label: `Pending Admissions (${pendingCount})`, color: 'text-indigo-400 border-indigo-500' },
                { key: 'approved' as const, label: `Approved Enrolled (${approvedCount})`, color: 'text-emerald-400 border-emerald-500' },
                { key: 'interview' as const, label: `Interviews scheduled (${interviewCount})`, color: 'text-amber-400 border-amber-500' },
                { key: 'rejected' as const, label: `Rejected applicants (${rejectedCount})`, color: 'text-red-400 border-red-500' }
              ].map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStatusTab(tab.key)}
                  className={`px-4 py-2 border rounded-xl transition ${
                    activeStatusTab === tab.key
                      ? `bg-slate-950 border-cyan-500/40 text-cyan-300 shadow`
                      : 'bg-slate-950/40 border-slate-850 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredApps.length === 0 ? (
              <div className="py-12 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
                No active applications match the filters or search parameters.
              </div>
            ) : (
              filteredApps.map((app, idx) => {
                const profile = candidateProfiles.find(p => p.userId === app.candidateId);
                const job = jobs.find(j => j.id === app.jobId);
                if (!profile || !job) return null;

                const hasCv = cvs.some(c => c.candidateId === profile.userId);
                const hasPortfolio = !!profile.portfolioUrl;

                return (
                  <div key={idx} className="p-5 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-800 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black tracking-widest px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {job.title.includes("DevOps") ? "Cybersecurity & DevOps" : "AI Engineering"}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white">{profile.fullName}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 font-medium">
                        <span className={hasCv ? "text-emerald-400" : "text-slate-600"}>
                          Resume {hasCv ? "✓" : "✗"}
                        </span>
                        <span>•</span>
                        <span className={hasPortfolio ? "text-emerald-400" : "text-slate-650"}>
                          Portfolio {hasPortfolio ? "✓" : "✗"}
                        </span>
                        <span>•</span>
                        <span>Assessment: <span className="text-indigo-400 font-extrabold">{profile.admissionScore ? `${profile.admissionScore}%` : "Pending"}</span></span>
                        <span>•</span>
                        <span>Experience: <span className="text-slate-350 font-bold">{profile.experienceYears > 0 ? `${profile.experienceYears} Years` : "Student"}</span></span>
                        <span>•</span>
                        <span>Status: <span className="text-cyan-400 font-bold capitalize">{app.status.replace('_', ' ')}</span></span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setOpenAppId(app.id);
                        setInterviewNotesText(app.notes || "Strong tech profile and prompt loop fundamentals.");
                      }}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
                    >
                      [Open]
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Admissions Offer Release Modal */}
          {selectedAppForOffer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-1">
                    <Award className="w-4.5 h-4.5 text-cyan-400" />
                    <span>Approve Bootcamp Admission</span>
                  </h3>
                  <button onClick={() => setSelectedAppForOffer(null)} className="text-slate-400 hover:text-white">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleReleaseOfferSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Confirmation Allowances (Compensation / hr)</label>
                    <input
                      type="text"
                      value={offerSalary}
                      onChange={(e) => setOfferSalary(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Cohort Start Date</label>
                    <input
                      type="date"
                      value={offerJoiningDate}
                      onChange={(e) => setOfferJoiningDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Admissions Notes</label>
                    <textarea
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isReleasingOffer}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-black tracking-wider transition uppercase"
                  >
                    {isReleasingOffer ? 'Approving and sending files...' : 'Confirm Admission Offer'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Schedule Interview Modal */}
          {selectedAppForInterview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-1">
                    <Calendar className="w-4.5 h-4.5 text-cyan-400" />
                    <span>Schedule Admissions Interview</span>
                  </h3>
                  <button onClick={() => setSelectedAppForInterview(null)} className="text-slate-400 hover:text-white">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Pick Meeting slot</label>
                    <input
                      type="datetime-local"
                      value={interviewTimeSlot}
                      onChange={(e) => setInterviewTimeSlot(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black tracking-wider transition uppercase"
                  >
                    Schedule Interview Slot
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* AI Sourcing Slices panel */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <h3 className="text-lg font-bold text-white mb-2">Query Sourcing Console</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enter queries in natural language to rank candidate profiles by custom test grades, project history, and experience.
            </p>

            <form onSubmit={handleAISearchSubmit} className="flex gap-2 mb-6">
              <input
                type="text"
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
              />
              <button
                type="submit"
                className="px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs transition"
              >
                Query DB
              </button>
            </form>

            {isAiSearching && (
              <div className="py-8 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono text-indigo-400">Scanning index records...</span>
              </div>
            )}

            {!isAiSearching && aiSearchResults.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] font-mono text-slate-500">Query resolved. Found {aiSearchResults.length} matching candidates:</p>
                {aiSearchResults.map((cand, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-extrabold text-white">{cand.fullName}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{cand.email} • Exp: {cand.experienceYears} yrs</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {cand.skills.map((s: string, sIdx: number) => (
                          <span key={sIdx} className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500">{s}</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-400 shrink-0">{cand.admissionScore}% Match</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {openAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Application File Details</span>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  {candidateProfiles.find(p => p.userId === applications.find(a => a.id === openAppId)?.candidateId)?.fullName}
                </h3>
              </div>
              <button
                onClick={() => setOpenAppId(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {/* Application Details */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <h4 className="font-extrabold text-white text-xs border-b border-slate-850 pb-1">Application</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-400">
                  <div>Applied Course: <span className="text-white font-bold">{jobs.find(j => j.id === applications.find(a => a.id === openAppId)?.jobId)?.title}</span></div>
                  <div>Applied Date: <span className="text-white font-bold">{new Date(applications.find(a => a.id === openAppId)?.appliedAt || '').toLocaleDateString()}</span></div>
                </div>
              </div>

              {/* Resume */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <h4 className="font-extrabold text-white text-xs border-b border-slate-850 pb-1">Resume</h4>
                <p className="text-slate-400 font-mono text-[10px] leading-relaxed">
                  {cvs.find(c => c.candidateId === applications.find(a => a.id === openAppId)?.candidateId)?.rawText || "No resume text content indexed."}
                </p>
              </div>

              {/* Links */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <h4 className="font-extrabold text-white text-xs border-b border-slate-850 pb-1">External Links & Portfolios</h4>
                <div className="flex flex-wrap gap-4 text-cyan-400 font-bold">
                  <span className="text-slate-500">Portfolio: </span>
                  {candidateProfiles.find(p => p.userId === applications.find(a => a.id === openAppId)?.candidateId)?.portfolioUrl ? (
                    <a href={candidateProfiles.find(p => p.userId === applications.find(a => a.id === openAppId)?.candidateId)?.portfolioUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Portfolio Link ✓</span>
                    </a>
                  ) : (
                    <span className="text-slate-600 font-normal">Not Provided</span>
                  )}
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-500">GitHub: </span>
                  {candidateProfiles.find(p => p.userId === applications.find(a => a.id === openAppId)?.candidateId)?.githubUrl ? (
                    <a href={candidateProfiles.find(p => p.userId === applications.find(a => a.id === openAppId)?.candidateId)?.githubUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub Link ✓</span>
                    </a>
                  ) : (
                    <span className="text-slate-600 font-normal">Not Provided</span>
                  )}
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-500">LinkedIn: </span>
                  {candidateProfiles.find(p => p.userId === applications.find(a => a.id === openAppId)?.candidateId)?.linkedinUrl ? (
                    <a href={candidateProfiles.find(p => p.userId === applications.find(a => a.id === openAppId)?.candidateId)?.linkedinUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>LinkedIn Link ✓</span>
                    </a>
                  ) : (
                    <span className="text-slate-600 font-normal">Not Provided</span>
                  )}
                </div>
              </div>

              {/* Assessment */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <h4 className="font-extrabold text-white text-xs border-b border-slate-850 pb-1">Assessment Score</h4>
                <div>
                  Score Rank: <span className="font-extrabold text-cyan-400">{candidateProfiles.find(p => p.userId === applications.find(a => a.id === openAppId)?.candidateId)?.admissionScore || "Pending"}%</span>
                </div>
              </div>

              {/* Interview Notes */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <h4 className="font-extrabold text-white text-xs border-b border-slate-850 pb-1">Interview Notes</h4>
                <textarea
                  value={interviewNotesText}
                  onChange={(e) => setInterviewNotesText(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Overall Fit */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <h4 className="font-extrabold text-white text-xs border-b border-slate-850 pb-1">Overall Fit</h4>
                <input
                  type="text"
                  value={overallFitText}
                  onChange={(e) => setOverallFitText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Action buttons footer */}
            <div className="pt-4 border-t border-slate-800 mt-4 flex flex-wrap gap-2 justify-end">
              {applications.find(a => a.id === openAppId)?.status === 'applied' ? (
                <>
                  <button
                    onClick={() => {
                      handleApproveRegistration(openAppId || '');
                      setOpenAppId(null);
                    }}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-xs font-black text-white shadow"
                  >
                    Approve Application Request
                  </button>
                  <button
                    onClick={() => {
                      handleRejectApplication(openAppId || '');
                      setOpenAppId(null);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-red-950/40 rounded-lg text-xs font-bold text-red-400 border border-slate-800 hover:border-red-950"
                  >
                    Reject Request
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setSelectedAppForOffer(applications.find(a => a.id === openAppId) || null);
                      setOpenAppId(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-black text-white shadow"
                  >
                    Approve File
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAppForInterview(applications.find(a => a.id === openAppId) || null);
                      setOpenAppId(null);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300"
                  >
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => {
                      handleRequestMoreInfo(openAppId || '');
                      setOpenAppId(null);
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-xs"
                  >
                    Need Info
                  </button>
                  <button
                    onClick={() => {
                      handleRejectApplication(openAppId || '');
                      setOpenAppId(null);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-red-950/40 rounded-lg text-xs font-bold text-red-400 border border-slate-800 hover:border-red-950"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
