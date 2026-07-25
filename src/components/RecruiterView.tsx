import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Job, Application } from '../types/portal';
import {
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  Play,
  FileCheck,
  UserCheck,
  XCircle,
  PlusCircle,
  Briefcase,
  MapPin,
  DollarSign,
  ChevronRight,
  Send,
  Zap,
  Award,
  Video,
  FileText,
  X,
  AlertCircle,
  Check,
} from 'lucide-react';

export const RecruiterView: React.FC = () => {
  const {
    currentUser,
    jobs,
    candidateProfiles,
    cvs,
    applications,
    interviews,
    offerLetters,
    aiSearchResults,
    aiSearchCriteria,
    isAiSearching,
    searchChatHistory,
    runAISearch,
    clearSearchChat,
    createJob,
    scheduleScreeningCall,
    startAIInterview,
    updateApplicationStage,
    releaseOfferLetter,
    updateOfferTemplate,
    associateCandidateWithJob,
    addManualInterviewEvaluation,
  } = usePortal();

  const [activeTab, setActiveTab] = useState<'search' | 'jobs' | 'pipeline'>('search');

  // Search input
  const [nlQuery, setNlQuery] = useState(
    'Find candidates with 5+ years React and Node, based in Pune or remote, available immediately.'
  );
  const [refineQuery, setRefineQuery] = useState('');

  const presetQueries = [
    'Find candidates with 5+ years React and Node, based in Pune, available immediately.',
    'Senior AI Engineer skilled in Gemini API, PyTorch, and RAG pipelines.',
    'Full-stack developers with Kubernetes and Docker experience under ₹12 Lakhs expected salary.',
  ];

  // Create Job Modal
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('TechScale Innovations');
  const [newJobDomain, setNewJobDomain] = useState<'Engineering' | 'Product' | 'Design' | 'Data & AI' | 'DevOps' | 'Marketing'>('Engineering');
  const [newJobSalary, setNewJobSalary] = useState('₹12,00,000 - ₹18,00,000');
  const [newJobLocation, setNewJobLocation] = useState('Remote');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobReqs, setNewJobReqs] = useState('React, Node.js, TypeScript, PostgreSQL');

  // Offer Modal State
  const [offerApp, setOfferApp] = useState<Application | null>(null);
  const [offerSalary, setOfferSalary] = useState('₹15,00,000 / year');
  const [offerJoiningDate, setOfferJoiningDate] = useState('2026-03-15');
  const [isGeneratingOffer, setIsGeneratingOffer] = useState(false);

  // Pipeline controls & template state
  const [calendarSync, setCalendarSync] = useState(true);
  const [interviewTypes, setInterviewTypes] = useState<{[appId: string]: 'ai' | 'human'}>({});
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [templateBody, setTemplateBody] = useState('');
  const [templateBenefits, setTemplateBenefits] = useState('');

  // Human Interview Grading State
  const [gradingApp, setGradingApp] = useState<Application | null>(null);
  const [techScore, setTechScore] = useState(85);
  const [commScore, setCommScore] = useState(80);
  const [relScore, setRelScore] = useState(85);
  const [interviewSummary, setInterviewSummary] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlQuery.trim()) return;
    runAISearch(nlQuery, false);
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineQuery.trim()) return;
    runAISearch(refineQuery, true);
    setRefineQuery('');
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (offerTemplates.length > 0) {
      updateOfferTemplate(
        offerTemplates[0].id,
        templateBody,
        templateBenefits.split(',').map((s) => s.trim()).filter(Boolean)
      );
      setIsEditingTemplate(false);
      alert('Offer letter template updated successfully!');
    }
  };

  const startEditingTemplate = () => {
    if (offerTemplates.length > 0) {
      setTemplateBody(offerTemplates[0].bodyTemplate);
      setTemplateBenefits(offerTemplates[0].benefitsList.join(', '));
      setIsEditingTemplate(true);
    }
  };

  const handleCreateJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJob({
      title: newJobTitle,
      company: newJobCompany,
      location: newJobLocation,
      type: 'Full-time',
      domain: newJobDomain,
      salaryRange: newJobSalary,
      description: newJobDesc || `We are looking for a skilled ${newJobTitle} to join our engineering team.`,
      requirements: newJobReqs.split(',').map((s) => s.trim()),
      status: 'active',
      interviewTypeDefault: 'ai',
    });
    setShowCreateJobModal(false);
    setNewJobTitle('');
    setActiveTab('jobs');
  };

  const handleReleaseOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerApp) return;
    setIsGeneratingOffer(true);
    try {
      await releaseOfferLetter(offerApp.id, offerSalary, offerJoiningDate);
      alert('Offer letter generated with AI template & released to candidate via email!');
      setOfferApp(null);
      setActiveTab('pipeline');
    } catch (err: any) {
      alert('Failed to release offer: ' + err.message);
    } finally {
      setIsGeneratingOffer(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Recruiter Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'search'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>AI Natural Language Search</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'pipeline'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Automation Pipeline ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'jobs'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Posted Jobs ({jobs.length})</span>
          </button>
        </div>

        <button
          onClick={() => setShowCreateJobModal(true)}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* TAB 1: NATURAL-LANGUAGE CV SEARCH WITH CONVERSATIONAL REFINEMENT */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Natural-Language Candidate Search</h2>
                  <p className="text-xs text-slate-400">
                    Search using conversational phrases. Gemini AI extracts structured criteria + ranks semantic vector embeddings.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSearchSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={nlQuery}
                    onChange={(e) => setNlQuery(e.target.value)}
                    placeholder="e.g. Find candidates with 5+ years React and Node, based in Pune..."
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-32 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 shadow-inner"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <button
                    type="submit"
                    disabled={isAiSearching}
                    className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    {isAiSearching ? (
                      <>
                        <Zap className="w-3.5 h-3.5 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Search</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-500 font-medium">Try Preset Queries:</span>
                  {presetQueries.map((pq, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setNlQuery(pq);
                        runAISearch(pq, false);
                      }}
                      className="text-[11px] bg-slate-800 hover:bg-slate-700 text-indigo-300 px-2.5 py-1 rounded-lg border border-slate-700/80 transition"
                    >
                      "{pq.slice(0, 42)}..."
                    </button>
                  ))}
                </div>
              </form>
            </div>

            {/* Conversational Refinement Chat Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-[250px]">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <span className="text-xs font-bold text-white">Refinement Chat Panel</span>
                  <button
                    onClick={() => {
                      clearSearchChat();
                      setNlQuery('');
                    }}
                    className="text-[10px] bg-slate-805 hover:bg-slate-800 text-rose-400 px-2.5 py-0.5 rounded border border-rose-950 transition font-bold"
                  >
                    Reset Chat
                  </button>
                </div>

                <div className="space-y-2 overflow-y-auto max-h-[140px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                  {searchChatHistory.length === 0 ? (
                    <p className="text-[11px] text-slate-500 text-center py-6">No refinements yet. Submit a search, then refine it below.</p>
                  ) : (
                    searchChatHistory.map((msg, idx) => (
                      <div key={idx} className={`p-2 rounded-lg text-[11px] leading-snug ${
                        msg.role === 'user' 
                          ? 'bg-indigo-950/40 text-indigo-200 border border-indigo-500/10' 
                          : 'bg-slate-800/80 text-slate-350 border border-slate-750'
                      }`}>
                        <span className="font-black block uppercase tracking-wider text-[9px] text-slate-500 mb-0.5">
                          {msg.role === 'user' ? 'Recruiter Query' : 'AI Match Assist'}
                        </span>
                        {msg.content}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Refinement input */}
              <form onSubmit={handleRefineSubmit} className="pt-2 border-t border-slate-800 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Refine matches (e.g. 'only remote')..."
                  value={refineQuery}
                  onChange={(e) => setRefineQuery(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* AI Search Criteria Extraction Badge */}
          {aiSearchCriteria && (
            <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex flex-wrap items-center gap-4 text-xs text-indigo-200">
              <div className="font-bold flex items-center space-x-1.5 text-indigo-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>AI Parsed Criteria:</span>
              </div>
              {aiSearchCriteria.targetSkills && (
                <div>Skills: <span className="font-semibold text-white">{aiSearchCriteria.targetSkills.join(', ')}</span></div>
              )}
              {aiSearchCriteria.minExperienceYears && (
                <div>Min Exp: <span className="font-semibold text-white">{aiSearchCriteria.minExperienceYears} Yrs</span></div>
              )}
              {aiSearchCriteria.locationPreference && (
                <div>Location: <span className="font-semibold text-white">{aiSearchCriteria.locationPreference}</span></div>
              )}
            </div>
          )}

          {/* Candidate Result Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
              <span>Matching Candidate Profiles ({candidateProfiles.length})</span>
              <span className="text-xs text-slate-400 font-normal">Hybrid DB + Vector Match</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidateProfiles.map((candidate) => {
                const aiResult = aiSearchResults ? aiSearchResults[candidate.userId] : null;
                const candCvs = cvs.filter((c) => c.candidateId === candidate.userId);
                const primaryCv = candCvs.find((c) => c.isPrimary) || candCvs[0];

                const matchPct = aiResult ? aiResult.matchPercentage : candidate.userId === 'usr_cand_priya' ? 95 : candidate.userId === 'usr_cand_elena' ? 92 : 88;

                return (
                  <div
                    key={candidate.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg space-y-4 transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Header with Photo & Match % */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={candidate.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt=""
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/40"
                          />
                          <div>
                            <h4 className="text-base font-bold text-white">{candidate.fullName}</h4>
                            <p className="text-xs text-slate-400">{candidate.location}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`text-base font-black px-2.5 py-0.5 rounded-lg border ${
                            matchPct >= 90
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                          }`}>
                            {matchPct}% Match
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">AI Fit Score</span>
                        </div>
                      </div>

                      {/* Reasoning Summary */}
                      <p className="text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 leading-relaxed">
                        {aiResult?.relevanceReasoning || `${candidate.experienceYears} years experience in ${candidate.skills.slice(0, 4).join(', ')}. Available ${candidate.availability}.`}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.skills.map((sk, idx) => {
                          const isMatched = aiResult?.matchedSkills?.includes(sk) ?? true;
                          return (
                            <span
                              key={idx}
                              className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                                isMatched
                                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {sk}
                            </span>
                          );
                        })}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Expected: <span className="font-bold text-slate-200">{candidate.expectedSalary}</span></span>
                        <span>Availability: <span className="font-bold text-slate-200">{candidate.availability}</span></span>
                      </div>
                    </div>

                    {/* Recruiter Card Actions */}
                    <div className="pt-3 border-t border-slate-800/80 flex flex-col space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Recruiter Actions:</span>
                        <button
                          onClick={() => {
                            const cvText = primaryCv?.rawText || `${candidate.fullName} Resume\nSkills: ${candidate.skills.join(', ')}\nBio: ${candidate.bio}`;
                            const blob = new Blob([cvText], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${candidate.fullName.replace(/\s+/g, '_')}_CV.txt`;
                            link.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
                        >
                        <FileText className="w-3.5 h-3.5" />
                          <span>Download CV</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {/* Reject button */}
                        <button
                          onClick={() => {
                            let app = applications.find((a) => a.candidateId === candidate.userId);
                            if (!app) {
                              const job = jobs[0];
                              if (!job) {
                                alert('Please post a job in the portal before managing candidates.');
                                return;
                              }
                              app = associateCandidateWithJob(candidate.userId, job.id);
                            }
                            updateApplicationStage(app.id, app.stage, 'rejected', 'Candidate rejected by recruiter during profile search review.');
                            alert(`Candidate ${candidate.fullName} application marked as rejected.`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-350 text-[11px] font-semibold border border-rose-800/40 transition"
                        >
                          Reject
                        </button>

                        {/* Shortlist/Schedule Call */}
                        <button
                          onClick={() => {
                            let app = applications.find((a) => a.candidateId === candidate.userId);
                            if (!app) {
                              const job = jobs[0];
                              if (!job) {
                                alert('Please post a job in the portal before managing candidates.');
                                return;
                              }
                              app = associateCandidateWithJob(candidate.userId, job.id);
                            }
                            scheduleScreeningCall(app.id, 'Tomorrow at 2:00 PM PST');
                            alert(`Candidate ${candidate.fullName} associated with "${jobs.find(j=>j.id===app?.jobId)?.title}" and screening call scheduled!`);
                            setActiveTab('pipeline');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition flex items-center space-x-1"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Schedule Call</span>
                        </button>

                        {/* Trigger AI Interview */}
                        <button
                          onClick={async () => {
                            let app = applications.find((a) => a.candidateId === candidate.userId);
                            if (!app) {
                              const job = jobs[0];
                              if (!job) {
                                alert('Please post a job in the portal before managing candidates.');
                                return;
                              }
                              app = associateCandidateWithJob(candidate.userId, job.id);
                            }
                            await startAIInterview(app.id);
                            alert(`Candidate ${candidate.fullName} associated with "${jobs.find(j=>j.id===app?.jobId)?.title}" and AI Interview generated!`);
                            setActiveTab('pipeline');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition flex items-center space-x-1"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>AI Interview</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POST-SHORTLIST AUTOMATION PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">Automated Hiring Pipeline Manager</h2>
              <p className="text-xs text-slate-400">
                Track candidates post-shortlist: Stage 1 (Screening) → Stage 2 (Interview) → Stage 3 (Decision) → Stage 4 (Offer Letter)
              </p>
            </div>
            <button
              type="button"
              onClick={startEditingTemplate}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700 shrink-0"
            >
              Configure AI Offer Template
            </button>
          </div>

          {/* Offer Template Customizer Form */}
          {isEditingTemplate && (
            <form onSubmit={handleSaveTemplate} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                <h3 className="text-xs font-black uppercase text-indigo-400">AI Offer Letter Template Settings</h3>
                <button
                  type="button"
                  onClick={() => setIsEditingTemplate(false)}
                  className="text-xs text-slate-450 hover:text-slate-200"
                >
                  Close
                </button>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Standard Benefits Package (Comma-separated)</label>
                <input
                  type="text"
                  value={templateBenefits}
                  onChange={(e) => setTemplateBenefits(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">AI Offer Letter Template Body Text</label>
                <textarea
                  rows={6}
                  value={templateBody}
                  onChange={(e) => setTemplateBody(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg p-3 text-xs text-white font-mono leading-relaxed"
                  placeholder="Use tags like {{candidate_name}}, {{role}}, {{salary}}, {{joining_date}}..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditingTemplate(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-350 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-605 hover:bg-indigo-550 text-white text-xs font-bold shadow"
                >
                  Save Settings
                </button>
              </div>
            </form>
          )}

          {/* Kanban board view */}
          {(() => {
            const stage1Apps = applications.filter((a) => a.stage === 1 && a.status !== 'rejected');
            const stage2Apps = applications.filter((a) => a.stage === 2 && a.status !== 'rejected');
            const stage3Apps = applications.filter((a) => a.stage === 3 && a.status !== 'rejected');
            const stage4Apps = applications.filter((a) => a.stage === 4 && a.status !== 'rejected');

            const renderKanbanCard = (app: Application) => {
              const job = jobs.find((j) => j.id === app.jobId);
              const candidate = candidateProfiles.find((p) => p.userId === app.candidateId);
              const interview = interviews.find((i) => i.applicationId === app.id);
              const offer = offerLetters.find((o) => o.applicationId === app.id);
              const initials = candidate ? candidate.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : '??';

              return (
                <div key={app.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 space-y-3 shadow transition">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center space-x-2 min-w-0">
                      {candidate?.avatar ? (
                        <img src={candidate.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-800" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-605 flex items-center justify-center text-[10px] font-bold text-white border border-indigo-500 shrink-0">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{candidate?.fullName}</h4>
                        <p className="text-[10px] text-slate-400 truncate">{job?.title}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        updateApplicationStage(app.id, app.stage, 'rejected', 'Rejected by recruiter.');
                        alert(`Candidate ${candidate?.fullName} marked as rejected.`);
                      }}
                      className="text-slate-500 hover:text-rose-450 transition"
                      title="Reject Candidate"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-300">
                    {app.stage === 1 && (
                      <div className="bg-slate-800/40 p-2 rounded border border-slate-800/80 space-y-1">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Screening Slot:</div>
                        <div className="font-semibold text-slate-200">{app.screeningSlot || 'Pending candidate booking...'}</div>
                      </div>
                    )}

                    {app.stage === 2 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-800 pb-1">
                          <span className="font-bold uppercase tracking-wider">Interview Mode:</span>
                          <span className="font-bold uppercase text-indigo-300">{interviewTypes[app.id] || 'ai'}</span>
                        </div>
                        {(interviewTypes[app.id] || 'ai') === 'human' ? (
                          <div className="space-y-2">
                            <div className="bg-slate-800/40 p-2 rounded border border-slate-800 flex items-center justify-between text-[10px]">
                              <span className="font-mono text-slate-400 truncate mr-1.5">meet.google.com/qpx-ntvs-yhb</span>
                              <a href="https://meet.google.com/qpx-ntvs-yhb" target="_blank" rel="noreferrer" className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold hover:bg-blue-500 shrink-0 transition">
                                Join
                              </a>
                            </div>
                            <button
                              onClick={() => {
                                setGradingApp(app);
                                setTechScore(85);
                                setCommScore(80);
                                setRelScore(85);
                                setInterviewSummary('');
                              }}
                              className="w-full py-1.5 rounded bg-indigo-605 hover:bg-indigo-500 text-white font-bold text-[10px] transition shadow"
                            >
                              Grade Interview
                            </button>
                          </div>
                        ) : interview?.status === 'completed' ? (
                          <div className="space-y-1.5 bg-slate-800/40 p-2 rounded border border-slate-800">
                            <div className="flex justify-between font-bold text-emerald-400 text-[10px]">
                              <span>Overall: {interview.overallScore}%</span>
                              <span className="text-slate-500">AI Graded</span>
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{interview.summary}</p>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-450 italic">AI Interview pending candidate completion...</div>
                        )}
                      </div>
                    )}

                    {app.stage === 3 && (
                      <div className="bg-slate-800/40 p-2 rounded border border-slate-800/80 space-y-1">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Assessment Status:</div>
                        {interview ? (
                          <div className="space-y-1 text-[10px]">
                            <div className="font-bold text-emerald-400">Score: {interview.overallScore}%</div>
                            <div className="text-slate-400 line-clamp-2">Feedback: {interview.summary}</div>
                          </div>
                        ) : (
                          <div className="text-slate-400 italic">No score record found.</div>
                        )}
                      </div>
                    )}

                    {app.stage === 4 && (
                      <div className="bg-slate-800/40 p-2 rounded border border-slate-800/80 space-y-1 text-[10px]">
                        <div className="text-slate-500 font-bold uppercase tracking-wider">Offer Summary:</div>
                        <div className="font-bold text-purple-300 capitalize">{offer?.status || 'Sent'}</div>
                        {offer && <div className="text-slate-400 font-medium">Salary: {offer.salary}</div>}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end border-t border-slate-800/80 pt-2 text-[10px]">
                    {app.stage === 1 && app.screeningSlot && (
                      <button
                        onClick={() => updateApplicationStage(app.id, 2, 'interviewing', 'Screening call complete, starting assessment stage.')}
                        className="text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center space-x-1"
                      >
                        <span>Start Assessment</span>
                        <Play className="w-3 h-3" />
                      </button>
                    )}
                    {app.stage === 1 && !app.screeningSlot && (
                      <span className="text-slate-500 italic">Waiting for booking</span>
                    )}

                    {app.stage === 2 && (
                      <div className="flex items-center space-x-1 w-full justify-between">
                        <span className="text-slate-500">Mode:</span>
                        <select
                          value={interviewTypes[app.id] || 'ai'}
                          onChange={(e) => setInterviewTypes((prev) => ({ ...prev, [app.id]: e.target.value as 'ai' | 'human' }))}
                          className="bg-slate-800 border border-slate-700 rounded px-1 text-[10px] text-slate-300"
                        >
                          <option value="ai">AI Agent</option>
                          <option value="human">Human Meet</option>
                        </select>
                      </div>
                    )}

                    {app.stage === 3 && (
                      <div className="flex items-center justify-between w-full">
                        <button
                          onClick={() => {
                            updateApplicationStage(app.id, app.stage, 'rejected', 'Rejected by recruiter at decision stage.');
                            alert(`Rejected candidate ${candidate?.fullName}`);
                          }}
                          className="text-rose-450 hover:text-rose-350 font-bold"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            updateApplicationStage(app.id, 4, 'selected', 'Approved for hire. Transitioning to offer release stage.');
                            alert(`Promoted candidate ${candidate?.fullName} to offer letter release stage!`);
                          }}
                          className="text-emerald-405 hover:text-emerald-350 font-bold"
                        >
                          Approve Hire
                        </button>
                      </div>
                    )}

                    {app.stage === 4 && !offer && (
                      <button
                        onClick={() => setOfferApp(app)}
                        className="bg-purple-650 hover:bg-purple-600 text-white font-bold px-2 py-1 rounded w-full text-center transition"
                      >
                        Release Offer Letter
                      </button>
                    )}
                    {app.stage === 4 && offer && (
                      <span className="text-purple-300 font-bold capitalize">Offer Status: {offer.status}</span>
                    )}
                  </div>
                </div>
              );
            };

            return (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                {/* Column 1: Screening */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">1. Screening Call</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-bold">{stage1Apps.length}</span>
                  </div>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {stage1Apps.map((app) => renderKanbanCard(app))}
                    {stage1Apps.length === 0 && (
                      <div className="text-center py-8 text-slate-500 text-xs italic">No candidates in screening.</div>
                    )}
                  </div>
                </div>

                {/* Column 2: Assessment */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">2. Assessment</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold">{stage2Apps.length}</span>
                  </div>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {stage2Apps.map((app) => renderKanbanCard(app))}
                    {stage2Apps.length === 0 && (
                      <div className="text-center py-8 text-slate-500 text-xs italic">No candidates in assessment.</div>
                    )}
                  </div>
                </div>

                {/* Column 3: Decision */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-amber-400 tracking-wider">3. Verdict</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-bold">{stage3Apps.length}</span>
                  </div>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {stage3Apps.map((app) => renderKanbanCard(app))}
                    {stage3Apps.length === 0 && (
                      <div className="text-center py-8 text-slate-500 text-xs italic">No candidates awaiting verdict.</div>
                    )}
                  </div>
                </div>

                {/* Column 4: Offer */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-purple-400 tracking-wider">4. Offer Released</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[10px] font-bold">{stage4Apps.length}</span>
                  </div>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {stage4Apps.map((app) => renderKanbanCard(app))}
                    {stage4Apps.length === 0 && (
                      <div className="text-center py-8 text-slate-500 text-xs italic">No active offer releases.</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: POSTED JOBS */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4">
            <div>
              <h2 className="text-base font-bold text-white">Company Job Postings</h2>
              <p className="text-xs text-slate-400">Manage active postings and review candidate pipelines.</p>
            </div>
            <button
              onClick={() => setShowCreateJobModal(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
            >
              + Create Job
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {job.domain}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{job.title}</h3>
                    <p className="text-xs text-slate-400">{job.location} • {job.type}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    {job.salaryRange}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">{job.description}</p>

                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>Applicants: <span className="font-bold text-white">{applications.filter((a) => a.jobId === job.id).length}</span></span>
                  <span className="text-emerald-400 font-semibold capitalize">Status: {job.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE JOB MODAL */}
      {showCreateJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Post New Job</h3>
              <button onClick={() => setShowCreateJobModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJobSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Full-Stack Lead"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Domain</label>
                  <select
                    value={newJobDomain}
                    onChange={(e) => setNewJobDomain(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={newJobLocation}
                  onChange={(e) => setNewJobLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Requirements (Comma Separated)</label>
                <input
                  type="text"
                  value={newJobReqs}
                  onChange={(e) => setNewJobReqs(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateJobModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
                >
                  Publish Job Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RELEASE OFFER MODAL */}
      {offerApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Release Offer Letter</h3>
              <button onClick={() => setOfferApp(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReleaseOfferSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Offered Salary</label>
                <input
                  type="text"
                  required
                  value={offerSalary}
                  onChange={(e) => setOfferSalary(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Joining Date</label>
                <input
                  type="date"
                  required
                  value={offerJoiningDate}
                  onChange={(e) => setOfferJoiningDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-xs text-purple-200">
                Server Gemini AI auto-fills template placeholders ({'{{candidate_name}}'}, {'{{role}}'}, {'{{salary}}'}) and releases offer to candidate portal.
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setOfferApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingOffer}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {isGeneratingOffer ? 'AI Generating...' : 'Release Offer Letter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {gradingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 text-slate-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Grade Human Interview</h3>
              <button onClick={() => setGradingApp(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1">
                  Technical Score: {techScore}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={techScore}
                  onChange={(e) => setTechScore(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1">
                  Communication Score: {commScore}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={commScore}
                  onChange={(e) => setCommScore(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1">
                  Relevance & Alignment: {relScore}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={relScore}
                  onChange={(e) => setRelScore(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1">
                  Interview Evaluation Notes
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide brief feedback summary from the human call..."
                  value={interviewSummary}
                  onChange={(e) => setInterviewSummary(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setGradingApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-350 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const overall = Math.round((techScore + commScore + relScore) / 3);
                    addManualInterviewEvaluation(gradingApp.id, {
                      overallScore: overall,
                      technicalScore: techScore,
                      communicationScore: commScore,
                      relevanceScore: relScore,
                      summary: interviewSummary || `Completed human interview. Technical Alignment: ${techScore}%, Comm: ${commScore}%.`
                    });
                    setGradingApp(null);
                    alert('Interview graded successfully! Candidate promoted to Verdict Stage.');
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
                >
                  Submit Scorecard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
