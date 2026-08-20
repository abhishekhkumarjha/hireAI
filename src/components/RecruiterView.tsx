import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Application, CandidateProfile, Job, ApplicationStage } from '../types/portal';
import {
  Search,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Award,
  Calendar,
  Plus,
  Users,
  MessageSquare,
  Sparkles,
  FileText,
  X,
  TrendingUp,
  MapPin,
  Clock,
  Briefcase,
  AlertCircle
} from 'lucide-react';

export const RecruiterView: React.FC = () => {
  const {
    currentUser,
    candidateProfiles,
    jobs,
    applications,
    interviews,
    offerLetters,
    cvs,
    runAISearch,
    clearSearchChat,
    scheduleScreeningCall,
    startAIInterview,
    updateApplicationStage,
    releaseOfferLetter,
    createJob,
    searchChatHistory,
    isAiSearching,
    aiSearchResults,
    applicationEvents
  } = usePortal();

  // Primary navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'candidates' | 'applications' | 'pipeline' | 'ai_search' | 'interviews' | 'offers' | 'analytics'>('overview');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [minExpFilter, setMinExpFilter] = useState(0);

  // New Job Opening State
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('CloudInnTech Corp');
  const [newJobDept, setNewJobDept] = useState('Engineering');
  const [newJobLocation, setNewJobLocation] = useState('Bengaluru Office');
  const [newJobWorkMode, setNewJobWorkMode] = useState<'remote' | 'hybrid' | 'onsite'>('hybrid');
  const [newJobEmpType, setNewJobEmpType] = useState<'full_time' | 'part_time' | 'contract' | 'internship'>('full_time');
  const [newJobDomain, setNewJobDomain] = useState<Job['domain']>('Engineering');
  const [newJobSalaryMin, setNewJobSalaryMin] = useState(1200000);
  const [newJobSalaryMax, setNewJobSalaryMax] = useState(2000000);
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobReqs, setNewJobReqs] = useState('');
  const [newJobSkills, setNewJobSkills] = useState('');

  // Sourcing Copilot state
  const [searchQueryNL, setSearchQueryNL] = useState('');

  // Schedule Interview modal state
  const [activeAppForInterview, setActiveAppForInterview] = useState<Application | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-08-25');
  const [interviewTime, setInterviewTime] = useState('11:00');
  const [interviewDuration, setInterviewDuration] = useState(45);
  const [interviewerName, setInterviewerName] = useState('John Doe');
  const [interviewType, setInterviewType] = useState<'ai' | 'human'>('human');
  const [meetUrl, setMeetUrl] = useState('https://meet.google.com/xyz-pdqr-abc');
  const [interviewNotes, setInterviewNotes] = useState('');

  // Release offer modal state
  const [activeAppForOffer, setActiveAppForOffer] = useState<Application | null>(null);
  const [offerSalary, setOfferSalary] = useState('₹18,00,000 / yr');
  const [offerJoiningDate, setOfferJoiningDate] = useState('2026-09-01');
  const [offerNotes, setOfferNotes] = useState('');

  // Selected candidate profile detail view modal
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI Calculations
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'published').length;
  const totalCandidates = candidateProfiles.length;
  const newApplications = applications.filter(a => a.status === 'applied').length;
  const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length;
  const interviewsToday = interviews.filter(i => {
    const todayStr = new Date().toISOString().split('T')[0];
    return i.scheduledAt.startsWith(todayStr) && i.status === 'scheduled';
  }).length;
  const hiredCount = applications.filter(a => a.status === 'hired').length;
  const offersPending = offerLetters.filter(o => o.status === 'sent').length;

  // Filter application files based on user access
  const getAccessibleApplications = () => {
    return applications.filter(app => {
      const job = jobs.find(j => j.id === app.jobId);
      if (!job) return false;
      if (currentUser?.role === 'recruiter') {
        if (currentUser.id === 'usr_recruiter_rahul' && job.id !== 'job_senior_dev' && job.id !== 'job_snowflake_eng') {
          return false;
        }
        if (currentUser.id === 'usr_recruiter_john' && job.id !== 'job_security_analyst') {
          return false;
        }
      }
      return true;
    });
  };

  const getFilteredCandidates = () => {
    return candidateProfiles.filter(prof => {
      const matchesSearch = prof.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            prof.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            prof.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const app = applications.find(a => a.candidateId === prof.userId);
      const matchesJob = selectedJobFilter === 'All' || (app && app.jobId === selectedJobFilter);
      const matchesExp = prof.experienceYears >= minExpFilter;
      const matchesWorkMode = selectedWorkMode === 'All' || prof.location.toLowerCase().includes(selectedWorkMode.toLowerCase());
      
      return matchesSearch && matchesJob && matchesExp && matchesWorkMode;
    });
  };

  const handleCreateJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobDesc.trim()) return;

    createJob({
      title: newJobTitle,
      company: newJobCompany,
      department: newJobDept,
      location: newJobLocation,
      workMode: newJobWorkMode,
      employmentType: newJobEmpType,
      domain: newJobDomain,
      salaryMin: Number(newJobSalaryMin),
      salaryMax: Number(newJobSalaryMax),
      salaryCurrency: 'INR',
      description: newJobDesc,
      responsibilities: ['Lead development sprint logs', 'Build low latency microservices'],
      requirements: newJobReqs.split('\n').filter(Boolean),
      requiredSkills: newJobSkills.split(',').map(s => s.trim()).filter(Boolean),
      preferredSkills: ['TypeScript', 'Kubernetes'],
      minimumExperience: 3,
      maximumExperience: 8,
      educationRequirements: ['B.Tech Computer Science'],
      certifications: [],
      numberOfOpenings: 1,
      status: 'published'
    });

    setIsCreatingJob(false);
    setNewJobTitle('');
    setNewJobDesc('');
    setNewJobReqs('');
    setNewJobSkills('');
    triggerToast('New technical job opening published successfully!');
  };

  const handleScheduleInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppForInterview) return;
    
    scheduleScreeningCall(
      activeAppForInterview.id,
      interviewDate,
      interviewTime,
      interviewDuration,
      interviewerName,
      interviewType,
      meetUrl,
      interviewNotes
    );
    setActiveAppForInterview(null);
    triggerToast('Hiring interview scheduled and calendar links sync simulated.');
  };

  const handleReleaseOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppForOffer) return;

    await releaseOfferLetter(activeAppForOffer.id, offerSalary, offerJoiningDate, offerNotes);
    setActiveAppForOffer(null);
    triggerToast('Official employment offer letter released and candidate notified.');
  };

  // Drag and Drop implementation for Kanban board
  const movePipelineStage = (appId: string, nextStage: ApplicationStage) => {
    updateApplicationStage(appId, nextStage, 'Recruiter shifted stage on pipeline dashboard.');
    triggerToast(`Candidate application progressed to ${nextStage.replace('_', ' ')}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-xl bg-slate-900 border border-indigo-500/40 text-slate-100 flex items-center space-x-3 shadow-2xl animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Recruiter Tab Controls */}
      <div className="flex flex-wrap border-b border-slate-800 gap-1 sm:gap-2">
        {[
          { key: 'overview' as const, label: 'Overview' },
          { key: 'jobs' as const, label: 'Jobs Manager' },
          { key: 'candidates' as const, label: 'Candidates DB' },
          { key: 'pipeline' as const, label: 'Kanban Pipeline' },
          { key: 'ai_search' as const, label: 'AI Sourcing Copilot' },
          { key: 'interviews' as const, label: 'Interviews' },
          { key: 'offers' as const, label: 'Offers' },
          { key: 'analytics' as const, label: 'Analytics' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-xs transition border-b-2 ${
              activeTab === tab.key
                ? 'border-indigo-500 bg-slate-900/60 text-white'
                : 'border-transparent text-slate-450 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW VIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* KPI Dashboard Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Published Openings', val: activeJobs, desc: `Total positions: ${totalJobs}` },
              { label: 'Total Sourced candidates', val: totalCandidates, desc: 'Active records' },
              { label: 'Review Required', val: newApplications, desc: 'New submissions' },
              { label: 'Offers Released', val: offersPending, desc: 'Pending responses' }
            ].map((kpi, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{kpi.label}</p>
                <p className="text-2xl font-black text-white mt-1">{kpi.val}</p>
                <p className="text-[10px] text-slate-500 mt-1">{kpi.desc}</p>
              </div>
            ))}
          </div>

          {/* Sourcing funnel overview graph mockup */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Conversion Funnel Analytics</span>
            </h3>
            <div className="space-y-3.5">
              {[
                { stage: 'Sourced / Applied', count: totalCandidates, pct: 100, color: 'bg-indigo-500' },
                { stage: 'Passed AI Match Screening', count: Math.round(totalCandidates * 0.7), pct: 70, color: 'bg-blue-500' },
                { stage: 'Shortlisted / Interviews', count: Math.round(totalCandidates * 0.35), pct: 35, color: 'bg-amber-500' },
                { stage: 'Offers Extended', val: offersPending, count: Math.round(totalCandidates * 0.15), pct: 15, color: 'bg-emerald-500' }
              ].map((funnel, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span className="font-semibold text-slate-350">{funnel.stage}</span>
                    <span className="font-bold text-white">{funnel.count} candidates ({funnel.pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/60">
                    <div className={`h-full ${funnel.color} rounded-full`} style={{ width: `${funnel.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. JOBS MANAGER */}
      {activeTab === 'jobs' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">CloudInnTech Corporate Positions</h3>
            <button
              onClick={() => setIsCreatingJob(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Job opening</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between h-48">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/25">
                      {job.workMode}
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                      job.status === 'published' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white mt-3 line-clamp-1">{job.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{job.company} • {job.location}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500">Min Exp: {job.minimumExperience}+ yrs</span>
                  <span className="text-[10px] font-bold text-white">₹{(job.salaryMin / 100000).toFixed(1)}L - ₹{(job.salaryMax / 100000).toFixed(1)}L</span>
                </div>
              </div>
            ))}
          </div>

          {/* Create job modal */}
          {isCreatingJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Publish New Job Opening</h3>
                  <button onClick={() => setIsCreatingJob(false)} className="text-slate-450 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateJobSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block space-y-1">
                      <span className="text-slate-450 font-semibold">Job Title</span>
                      <input required type="text" value={newJobTitle} onChange={e => setNewJobTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus:border-indigo-500 text-white outline-none" placeholder="e.g. Senior Snowflake Architect" />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-slate-455 font-semibold">Department</span>
                      <input required type="text" value={newJobDept} onChange={e => setNewJobDept(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus:border-indigo-500 text-white outline-none" />
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <label className="block space-y-1">
                      <span className="text-slate-450 font-semibold">Location</span>
                      <input required type="text" value={newJobLocation} onChange={e => setNewJobLocation(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus:border-indigo-500 text-white outline-none" />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-slate-450 font-semibold">Work Mode</span>
                      <select value={newJobWorkMode} onChange={e => setNewJobWorkMode(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none">
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="onsite">Onsite</option>
                      </select>
                    </label>
                    <label className="block space-y-1">
                      <span className="text-slate-455 font-semibold">Employment Type</span>
                      <select value={newJobEmpType} onChange={e => setNewJobEmpType(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none">
                        <option value="full_time">Full-time</option>
                        <option value="part_time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block space-y-1">
                      <span className="text-slate-450 font-semibold">Salary Min (INR / yr)</span>
                      <input type="number" value={newJobSalaryMin} onChange={e => setNewJobSalaryMin(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none" />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-slate-450 font-semibold">Salary Max (INR / yr)</span>
                      <input type="number" value={newJobSalaryMax} onChange={e => setNewJobSalaryMax(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none" />
                    </label>
                  </div>

                  <label className="block space-y-1">
                    <span className="text-slate-450 font-semibold">Job Description</span>
                    <textarea required rows={3} value={newJobDesc} onChange={e => setNewJobDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none resize-none" placeholder="Provide roles and specifications..." />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-slate-450 font-semibold">Requirements (One per line)</span>
                    <textarea rows={2} value={newJobReqs} onChange={e => setNewJobReqs(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none resize-none" placeholder="e.g. 5+ Years Python programming..." />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-slate-450 font-semibold">Required Skills (Comma separated)</span>
                    <input type="text" value={newJobSkills} onChange={e => setNewJobSkills(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none" placeholder="e.g. Python, Spark, Snowflake" />
                  </label>

                  <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-extrabold shadow transition">
                    Publish Corporate Opening
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. CANDIDATES DATABASE */}
      {activeTab === 'candidates' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Sourcing filters */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search candidates database by name, skills..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Experience:</span>
              <select value={minExpFilter} onChange={e => setMinExpFilter(Number(e.target.value))} className="bg-slate-950 border border-slate-850 rounded-lg p-1.5 text-white">
                <option value={0}>All levels</option>
                <option value={2}>2+ Years</option>
                <option value={5}>5+ Years</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Work Mode:</span>
              <select value={selectedWorkMode} onChange={e => setSelectedWorkMode(e.target.value)} className="bg-slate-950 border border-slate-850 rounded-lg p-1.5 text-white">
                <option value="All">All Locations</option>
                <option value="Remote">Remote Only</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>
          </div>

          {/* Sourced list table */}
          <div className="border border-slate-800 rounded-2xl bg-slate-900 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Candidate Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Top Skills</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4 text-right">Profile Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {getFilteredCandidates().map(prof => (
                  <tr key={prof.id} className="hover:bg-slate-850/50 transition">
                    <td className="p-4 font-semibold text-white">
                      <div>
                        <div>{prof.fullName}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{prof.email}</div>
                      </div>
                    </td>
                    <td className="p-4">{prof.location}</td>
                    <td className="p-4 font-mono">{prof.experienceYears} Years</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {prof.skills.slice(0, 3).map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-300 text-[10px]">{s}</span>
                        ))}
                        {prof.skills.length > 3 && (
                          <span className="text-[10px] text-slate-500 ml-1">+{prof.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prof.availability === 'Immediate' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-950 text-slate-450'
                      }`}>{prof.availability}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedCandidateId(prof.userId)}
                        className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-indigo-400 hover:text-indigo-300 font-bold transition"
                      >
                        [Open Profile]
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. KANBAN PIPELINE BOARD */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recruitment Status Kanban Pipeline</h3>
            <span className="text-xs text-slate-450">Drag / move candidates to progress them through hiring stages</span>
          </div>

          <div className="flex space-x-4 overflow-x-auto pb-4">
            {(['applied', 'ai_screening', 'under_review', 'shortlisted', 'recruiter_screening', 'technical_interview', 'offer_sent', 'hired'] as ApplicationStage[]).map(stage => {
              const stageApps = getAccessibleApplications().filter(a => a.status === stage);
              return (
                <div key={stage} className="flex-1 min-w-[260px] bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">{stage.replace('_', ' ')}</span>
                    <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full font-bold">{stageApps.length}</span>
                  </div>

                  <div className="space-y-2.5 overflow-y-auto max-h-[60vh] pr-1">
                    {stageApps.map(app => {
                      const profile = candidateProfiles.find(p => p.userId === app.candidateId);
                      if (!profile) return null;
                      
                      const primaryCv = cvs.find(c => c.id === app.cvId);
                      return (
                        <div key={app.id} className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-3 shadow-md hover:border-slate-750 transition">
                          <div>
                            <div className="font-extrabold text-white text-xs">{profile.fullName}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{profile.expectedSalary} · {profile.availability}</div>
                          </div>

                          {/* Match rating scorecard */}
                          {app.aiMatchScore && (
                            <div className="flex items-center space-x-1">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                              <span className="text-[10px] text-indigo-300 font-black">AI Score: {app.aiMatchScore}%</span>
                            </div>
                          )}

                          {/* Controls to move stage */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                            <button
                              onClick={() => setSelectedCandidateId(profile.userId)}
                              className="text-[10px] font-bold text-slate-400 hover:text-white"
                            >
                              [Inspect]
                            </button>
                            
                            <select
                              value={app.status}
                              onChange={e => movePipelineStage(app.id, e.target.value as ApplicationStage)}
                              className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[9px] text-indigo-400 outline-none"
                            >
                              <option value="applied">Applied</option>
                              <option value="ai_screening">AI Screen</option>
                              <option value="under_review">Review</option>
                              <option value="shortlisted">Shortlist</option>
                              <option value="recruiter_screening">Screening</option>
                              <option value="technical_interview">Technical</option>
                              <option value="offer_sent">Offer Sent</option>
                              <option value="hired">Hired</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. AI SEARCH CHAT */}
      {activeTab === 'ai_search' && (
        <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* Chat Window */}
          <div className="lg:col-span-2 border border-slate-800 rounded-3xl bg-slate-900 p-5 flex flex-col justify-between h-[500px]">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Hiring Sourcing Copilot</h3>
                  <p className="text-[10px] text-slate-450 mt-0.5">Filter candidates dynamically using natural language queries</p>
                </div>
                <button
                  onClick={clearSearchChat}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 hover:bg-slate-850 rounded-lg text-[10px] text-slate-400 transition"
                >
                  Clear history
                </button>
              </div>

              {/* Message History */}
              <div className="space-y-4 overflow-y-auto max-h-[340px] pr-1 py-3">
                {searchChatHistory.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    Try typing: <span className="font-mono text-slate-400">"Find candidates with Java and React skills and immediate availability"</span>
                  </div>
                ) : (
                  searchChatHistory.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-[80%] text-xs ${
                        msg.sender === 'recruiter'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-950 border border-slate-850 text-slate-200 rounded-tl-none font-mono leading-relaxed'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Input form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!searchQueryNL.trim()) return;
                runAISearch(searchQueryNL, searchChatHistory.length > 0);
                setSearchQueryNL('');
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask your recruiting assistant..."
                value={searchQueryNL}
                onChange={e => setSearchQueryNL(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={isAiSearching}
                className="px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs transition"
              >
                {isAiSearching ? 'Scoring...' : 'Ask AI'}
              </button>
            </form>
          </div>

          {/* AI Search Matches Scoring Grid */}
          <div className="border border-slate-800 rounded-3xl bg-slate-900 p-5 space-y-4 h-[500px] overflow-y-auto">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Copilot Search Results</span>
            </h4>

            {aiSearchResults ? (
              <div className="space-y-3.5">
                {Object.values(aiSearchResults).map(r => {
                  const prof = candidateProfiles.find(p => p.userId === r.candidateId);
                  if (!prof) return null;
                  return (
                    <div key={r.candidateId} className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="font-extrabold text-white text-xs">{prof.fullName}</div>
                        <span className="text-xs text-emerald-400 font-mono font-black">{r.matchPercentage}%</span>
                      </div>
                      <p className="text-[10px] text-slate-450 leading-relaxed font-sans">{r.relevanceReasoning}</p>
                      
                      <div className="pt-2 border-t border-slate-850/50 flex justify-between items-center">
                        <button
                          onClick={() => setSelectedCandidateId(prof.userId)}
                          className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300"
                        >
                          [Inspect Profile]
                        </button>
                        <button
                          onClick={() => {
                            const app = getAccessibleApplications().find(a => a.candidateId === prof.userId);
                            if (app) {
                              setActiveAppForInterview(app);
                            } else {
                              // Auto associate
                              const newApp = associateCandidateWithJob(prof.userId, jobs[0].id);
                              setActiveAppForInterview(newApp);
                            }
                          }}
                          className="text-[10px] font-black text-emerald-400 hover:text-emerald-300"
                        >
                          [Schedule Call]
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-24 text-center text-slate-500 text-xs">
                Run an AI natural language query search to compute matchmaking scores against sourcing context.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. INTERVIEWS */}
      {activeTab === 'interviews' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Scheduled Technical & human Interviews</h3>
          </div>

          <div className="border border-slate-800 rounded-2xl bg-slate-900 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Scheduled Date & Time</th>
                  <th className="p-4">Interviewer</th>
                  <th className="p-4">Meeting URL</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-350">
                {interviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">No interviews scheduled yet.</td>
                  </tr>
                ) : (
                  interviews.map(i => {
                    const prof = candidateProfiles.find(p => p.userId === i.candidateId);
                    return (
                      <tr key={i.id} className="hover:bg-slate-850/50">
                        <td className="p-4 font-bold text-white">{prof?.fullName || 'Candidate'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            i.type === 'ai' ? 'bg-indigo-500/10 text-indigo-300' : 'bg-blue-500/10 text-blue-300'
                          }`}>{i.type.toUpperCase()}</span>
                        </td>
                        <td className="p-4 font-mono">{new Date(i.scheduledAt).toLocaleString()}</td>
                        <td className="p-4">{i.interviewerIds?.join(', ') || 'AI Agent'}</td>
                        <td className="p-4">
                          {i.videoCallUrl ? (
                            <a href={i.videoCallUrl} target="_blank" rel="noreferrer" className="text-indigo-400 font-bold flex items-center space-x-1 hover:underline">
                              <span>Open Call</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-600">Local Interview Room</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            i.status === 'completed' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
                          }`}>{i.status}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. OFFERS */}
      {activeTab === 'offers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Employment Offer letters released</h3>
          </div>

          <div className="border border-slate-800 rounded-2xl bg-slate-900 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Offered Role</th>
                  <th className="p-4">Compensation / yr</th>
                  <th className="p-4">Effective Joining Date</th>
                  <th className="p-4">Released At</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-350">
                {offerLetters.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">No offer letters generated yet.</td>
                  </tr>
                ) : (
                  offerLetters.map(o => (
                    <tr key={o.id} className="hover:bg-slate-850/50">
                      <td className="p-4 font-bold text-white">{o.candidateName}</td>
                      <td className="p-4">{o.role}</td>
                      <td className="p-4 font-mono">{o.salary}</td>
                      <td className="p-4 font-mono">{o.joiningDate}</td>
                      <td className="p-4 font-mono">{o.sentAt ? new Date(o.sentAt).toLocaleDateString() : 'N/A'}</td>
                      <td className="p-4 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          o.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-300'
                          : o.status === 'declined' ? 'bg-rose-500/10 text-rose-300'
                          : 'bg-amber-500/10 text-amber-300'
                        }`}>{o.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recruitment Metrics and analytics logs</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Sourcing Success metrics</h4>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-450">Active Hired Ratio:</span>
                  <span className="text-white font-bold">{( (hiredCount / (totalCandidates || 1)) * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">Average Time-to-Hire:</span>
                  <span className="text-white font-bold">14 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">AI Filter Pass Rate:</span>
                  <span className="text-white font-bold">72%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">Recruiter screening conversion:</span>
                  <span className="text-white font-bold">48%</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Applications per position</h4>
              <div className="space-y-3 text-xs">
                {jobs.map(j => {
                  const count = applications.filter(a => a.jobId === j.id).length;
                  return (
                    <div key={j.id} className="flex justify-between items-center">
                      <span className="text-slate-350 font-bold truncate max-w-[200px]">{j.title}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] text-indigo-400 font-bold">{count} Apps</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate details inspect overlay modal */}
      {selectedCandidateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          {(() => {
            const prof = candidateProfiles.find(p => p.userId === selectedCandidateId);
            const app = getAccessibleApplications().find(a => a.candidateId === selectedCandidateId);
            const cv = cvs.find(c => c.candidateId === selectedCandidateId);
            
            if (!prof) return null;
            return (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-3xl shadow-2xl flex flex-col max-h-[85vh] text-slate-100 space-y-5">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-white">{prof.fullName}</h3>
                    <p className="text-xs text-slate-450">{prof.email} • {prof.phone || 'No phone registered'}</p>
                  </div>
                  <button onClick={() => setSelectedCandidateId(null)} className="text-slate-450 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
                  {/* AI Match rating Scorecard section */}
                  {app && (
                    <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          <span>AI Hiring Match Scorecard</span>
                        </span>
                        <span className="text-base font-black text-indigo-400 font-mono">{app.aiMatchScore || 85}%</span>
                      </div>
                      
                      {app.aiMatchReasoning && (
                        <p className="text-[10px] text-slate-350 font-sans leading-relaxed">{app.aiMatchReasoning}</p>
                      )}

                      <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                        <div>
                          <div className="font-semibold text-emerald-400 flex items-center gap-1">✓ Matched Skills</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prof.skills.map((s, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-850 text-emerald-300">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-amber-400 flex items-center gap-1">⚠ Missing / Weak Skills</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-850 text-amber-300">Advanced MLOps</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Profile bio summary */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-white text-xs border-b border-slate-850 pb-1">Professional Bio</h4>
                    <p className="text-slate-400 leading-relaxed font-sans">{prof.bio}</p>
                  </div>

                  {/* Resume raw text view */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-white text-xs border-b border-slate-850 pb-1">Resume Text Indexed</h4>
                    <p className="text-slate-400 font-mono text-[10px] leading-relaxed max-h-[140px] overflow-y-auto whitespace-pre-wrap">
                      {cv?.rawText || 'No resume text indexed for this candidate profile.'}
                    </p>
                  </div>

                  {/* Activity History Timeline logs */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                    <h4 className="font-bold text-white text-xs border-b border-slate-850 pb-1">Application Activity Logs</h4>
                    <div className="space-y-2">
                      {applicationEvents.filter(e => app && e.applicationId === app.id).map(e => (
                        <div key={e.id} className="flex justify-between items-center text-[10px] text-slate-450 font-mono">
                          <span>{e.message}</span>
                          <span>{new Date(e.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer contextual actions based on pipeline stage */}
                {app && (
                  <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={() => {
                        setActiveAppForInterview(app);
                        setSelectedCandidateId(null);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition shadow"
                    >
                      Schedule Interview
                    </button>
                    <button
                      onClick={() => {
                        setActiveAppForOffer(app);
                        setSelectedCandidateId(null);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold text-white transition shadow"
                    >
                      Release Job Offer
                    </button>
                    <button
                      onClick={() => {
                        updateApplicationStage(app.id, 'rejected', 'Candidate rejected during review.');
                        setSelectedCandidateId(null);
                        triggerToast('Candidate marked as rejected.');
                      }}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-rose-950/20 hover:border-rose-950 rounded-lg text-xs font-bold text-rose-400 transition"
                    >
                      Reject Candidate
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Schedule Interview Modal overlay */}
      {activeAppForInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4.5 h-4.5 text-indigo-400" />
                <span>Schedule Interview Round</span>
              </h3>
              <button onClick={() => setActiveAppForInterview(null)} className="text-slate-450 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterviewSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="text-slate-450">Date</span>
                  <input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none" />
                </label>
                <label className="block space-y-1">
                  <span className="text-slate-450">Time</span>
                  <input type="time" value={interviewTime} onChange={e => setInterviewTime(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="text-slate-450">Duration (mins)</span>
                  <input type="number" value={interviewDuration} onChange={e => setInterviewDuration(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none" />
                </label>
                <label className="block space-y-1">
                  <span className="text-slate-450">Interviewer</span>
                  <input type="text" value={interviewerName} onChange={e => setInterviewerName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none" />
                </label>
              </div>

              <label className="block space-y-1">
                <span className="text-slate-450">Meeting Platform URL</span>
                <input type="text" value={meetUrl} onChange={e => setMeetUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none font-mono" />
              </label>

              <label className="block space-y-1">
                <span className="text-slate-455">Meeting notes</span>
                <textarea rows={2} value={interviewNotes} onChange={e => setInterviewNotes(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none resize-none" placeholder="Provide system setup criteria details..." />
              </label>

              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-extrabold shadow transition">
                Confirm and Send Calendar Invites
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Release Offer Modal overlay */}
      {activeAppForOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-indigo-400" />
                <span>Extend Official Employment Offer</span>
              </h3>
              <button onClick={() => setActiveAppForOffer(null)} className="text-slate-455 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReleaseOfferSubmit} className="space-y-3.5 text-xs">
              <label className="block space-y-1">
                <span className="text-slate-450">Starting Annual Compensation</span>
                <input type="text" value={offerSalary} onChange={e => setOfferSalary(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none" />
              </label>

              <label className="block space-y-1">
                <span className="text-slate-450">Target Joining Date</span>
                <input type="date" value={offerJoiningDate} onChange={e => setOfferJoiningDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none" />
              </label>

              <label className="block space-y-1">
                <span className="text-slate-455">Offer details/custom notes</span>
                <textarea rows={3} value={offerNotes} onChange={e => setOfferNotes(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none resize-none" placeholder="Provide extra perks details..." />
              </label>

              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-extrabold shadow transition">
                Sign and Send Offer Letter
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
