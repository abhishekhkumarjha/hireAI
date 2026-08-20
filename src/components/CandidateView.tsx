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
  TrendingUp,
  ExternalLink,
  Laptop,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import jsPDF from 'jspdf';

export const CandidateView: React.FC = () => {
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

  // Navigation states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'resume' | 'browse' | 'applications' | 'interviews' | 'offers'>('dashboard');

  // Profile Form States
  const [phone, setPhone] = useState(profile?.phone || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [expYears, setExpYears] = useState(profile?.experienceYears || 0);
  const [expectedSalary, setExpectedSalary] = useState(profile?.expectedSalary || '');
  const [avail, setAvail] = useState(profile?.availability || 'Immediate');
  const [openToWork, setOpenToWork] = useState(profile?.openToWork || true);
  const [skills, setSkills] = useState(profile?.skills?.join(', ') || '');

  // Resume Parsing States
  const [cvText, setCvText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);

  // Active AI interview state
  const [activeInterview, setActiveInterview] = useState<InterviewRecord | null>(null);
  const [aiAnswer, setAiAnswer] = useState('');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [interviewChat, setInterviewChat] = useState<Array<{ sender: 'ai' | 'candidate'; text: string }>>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Load profile values on mount
  useEffect(() => {
    if (profile) {
      setPhone(profile.phone || '');
      setLocation(profile.location || '');
      setBio(profile.bio || '');
      setExpYears(profile.experienceYears || 0);
      setExpectedSalary(profile.expectedSalary || '');
      setAvail(profile.availability || 'Immediate');
      setOpenToWork(profile.openToWork || true);
      setSkills(profile.skills?.join(', ') || '');
    }
  }, [profile]);

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    updateProfile({
      ...profile,
      phone,
      location,
      bio,
      experienceYears: Number(expYears),
      expectedSalary,
      availability: avail,
      openToWork,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      profileCompletion: 75
    });
    alert('Technical recruitment profile updated successfully!');
  };

  const handleParseResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvText.trim()) return;
    setIsParsing(true);
    try {
      await parseCVAndSave(cvText, "Primary Resume File");
      setParseSuccess(true);
      setTimeout(() => setParseSuccess(false), 3000);
      setCvText('');
    } catch (err) {
      console.error(err);
      alert('AI resume parsing failed. Falling back to local data entries.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleStartInterview = async (appId: string) => {
    setIsEvaluating(true);
    try {
      const record = await startAIInterview(appId);
      setActiveInterview(record);
      setInterviewChat([
        { sender: 'ai', text: `Welcome to your AI technical screening interview! I've loaded questions based on your profile and the job opening requirements.` },
        { sender: 'ai', text: record.questions[0]?.question || "Explain your experience working with standard backend architectures?" }
      ]);
      setCurrentQuestionIdx(0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!aiAnswer.trim() || !activeInterview) return;
    const updatedChat = [...interviewChat, { sender: 'candidate' as const, text: aiAnswer }];
    setInterviewChat(updatedChat);
    const candidateResponse = aiAnswer;
    setAiAnswer('');

    if (currentQuestionIdx + 1 < activeInterview.questions.length) {
      const nextQ = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextQ);
      setTimeout(() => {
        setInterviewChat(prev => [...prev, { sender: 'ai', text: activeInterview.questions[nextQ].question }]);
      }, 700);
    } else {
      setIsEvaluating(true);
      setTimeout(async () => {
        const answers = activeInterview.questions.map((q, idx) => ({
          questionId: q.id,
          answer: idx === currentQuestionIdx ? candidateResponse : 'Technical definition detailed.'
        }));
        await submitAIInterviewAnswers(activeInterview.id, answers);
        setIsEvaluating(false);
        setActiveInterview(null);
        alert('AI technical interview evaluated and saved to recruiter timeline.');
      }, 1000);
    }
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6 font-sans">
      
      {/* Sidebar Controls */}
      <div className="lg:col-span-1 rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2">
        <div className="p-3 border-b border-slate-800 mb-2">
          <div className="font-extrabold text-white text-xs">CloudInnTech HireAI</div>
          <span className="text-[10px] text-slate-500 font-mono">Candidate Workspace</span>
        </div>
        {[
          { key: 'dashboard' as const, label: 'Dashboard' },
          { key: 'profile' as const, label: 'My Tech Profile' },
          { key: 'resume' as const, label: 'Upload Resume / CV' },
          { key: 'browse' as const, label: 'Browse Jobs' },
          { key: 'applications' as const, label: 'My Applications' },
          { key: 'interviews' as const, label: 'Technical Interviews' },
          { key: 'offers' as const, label: 'Offer Letters' }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === item.key
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Workspace Layout */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* 1. DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
              <h3 className="text-lg font-black text-white">Welcome back, {profile?.fullName || 'Candidate'}!</h3>
              <p className="text-xs text-slate-450 mt-1">Complete your technical profile to match with CloudInnTech corporate openings.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-850">
                <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Active Applications</span>
                <p className="text-2xl font-black text-white mt-1">{userApplications.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-850">
                <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Upcoming Interviews</span>
                <p className="text-2xl font-black text-white mt-1">
                  {interviews.filter(i => i.candidateId === currentUser?.id && i.status === 'scheduled').length}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-850">
                <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Pending Offers</span>
                <p className="text-2xl font-black text-white mt-1">
                  {userOffers.filter(o => o.status === 'sent').length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. PROFILE CONFIG VIEW */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfileSubmit} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Technical Recruiter Profile</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block space-y-1 text-xs">
                <span className="text-slate-400">Phone Number</span>
                <input required type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500" />
              </label>
              <label className="block space-y-1 text-xs">
                <span className="text-slate-450">Current Location</span>
                <input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500" />
              </label>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <label className="block space-y-1 text-xs">
                <span className="text-slate-400">Experience (Years)</span>
                <input type="number" value={expYears} onChange={e => setExpYears(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500" />
              </label>
              <label className="block space-y-1 text-xs">
                <span className="text-slate-450">Expected Annual Salary</span>
                <input type="text" value={expectedSalary} onChange={e => setExpectedSalary(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500" placeholder="e.g. ₹15,00,000 / yr" />
              </label>
              <label className="block space-y-1 text-xs">
                <span className="text-slate-450">Availability</span>
                <select value={avail} onChange={e => setAvail(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500">
                  <option value="Immediate">Immediate</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="60 Days">60 Days</option>
                </select>
              </label>
            </div>

            <label className="block space-y-1 text-xs">
              <span className="text-slate-400">Bio Summary</span>
              <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500 resize-none" />
            </label>

            <label className="block space-y-1 text-xs">
              <span className="text-slate-400">Technical Skills (Comma separated)</span>
              <input type="text" value={skills} onChange={e => setSkills(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500" placeholder="e.g. Python, AWS, Docker" />
            </label>

            <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-extrabold shadow transition">
              Save Tech Profile
            </button>
          </form>
        )}

        {/* 3. RESUME UPLOAD */}
        {activeTab === 'resume' && (
          <form onSubmit={handleParseResume} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">AI Resume Parser</h3>
            <p className="text-xs text-slate-450 leading-relaxed">Paste your raw CV text below. Our Gemini parsing client will extract skills, experience levels, and structure your account profile variables immediately.</p>

            <textarea
              required
              rows={8}
              value={cvText}
              onChange={e => setCvText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono resize-none"
              placeholder="Paste raw CV copy content..."
            />

            {isParsing && (
              <div className="flex items-center space-x-2 text-xs text-indigo-400 font-mono">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span>Gemini Parser active, indexing skills...</span>
              </div>
            )}

            {parseSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs font-bold">
                Resume parsed, primary profile variables updated successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={isParsing || !cvText.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-white font-extrabold shadow transition"
            >
              Parse CV Details
            </button>
          </form>
        )}

        {/* 4. BROWSE JOBS */}
        {activeTab === 'browse' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Available CloudInnTech Openings</h3>
            {jobs.filter(j => j.status === 'published').map(job => {
              const alreadyApplied = userApplications.some(a => a.jobId === job.id);
              return (
                <div key={job.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center gap-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{job.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{job.company} · {job.location} · {job.workMode}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.requiredSkills.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-850 text-indigo-300 text-[10px] font-mono">{s}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (alreadyApplied) return;
                      const primaryCv = userCvs.find(c => c.isPrimary) || userCvs[0];
                      applyForJob(job.id, primaryCv ? primaryCv.id : 'no_cv');
                      alert('Job Application submitted successfully!');
                    }}
                    disabled={alreadyApplied}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition shrink-0 ${
                      alreadyApplied ? 'bg-slate-850 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
                    }`}
                  >
                    {alreadyApplied ? 'Applied' : 'Apply Now'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. MY APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">My Corporate Applications</h3>
            {userApplications.map(app => {
              const job = jobs.find(j => j.id === app.jobId);
              return (
                <div key={app.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center gap-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{job?.title || 'Job Opening'}</h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* 6. TECHNICAL INTERVIEWS */}
        {activeTab === 'interviews' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            {/* Active chat overlay */}
            {activeInterview ? (
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Automated AI Technical Screener</h4>
                  <span className="text-[10px] text-slate-500 font-mono">Q: {currentQuestionIdx + 1} of {activeInterview.questions.length}</span>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-855 rounded-2xl h-[280px] overflow-y-auto space-y-2 text-[11px] font-mono leading-relaxed">
                  {interviewChat.map((msg, idx) => (
                    <div key={idx} className={msg.sender === 'ai' ? 'text-indigo-400' : 'text-slate-350'}>
                      <span className="font-extrabold">{msg.sender === 'ai' ? 'AI: ' : 'You: '}</span>
                      <span>{msg.text}</span>
                    </div>
                  ))}
                  {isEvaluating && (
                    <div className="text-yellow-500 animate-pulse font-bold">Evaluating technical context details...</div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiAnswer}
                    onChange={e => setAiAnswer(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAnswerSubmit()}
                    placeholder="Type technical answer..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                  />
                  <button onClick={handleAnswerSubmit} className="px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold">Submit</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recruitment Interviews</h3>
                {interviews.filter(i => i.candidateId === currentUser?.id).map(i => (
                  <div key={i.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        {jobs.find(j => j.id === i.jobId)?.title} Interview
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">Interviewer: {i.interviewerIds?.join(', ') || 'AI Bot'}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">Scheduled: {new Date(i.scheduledAt).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {i.status === 'scheduled' && i.type === 'ai' && (
                        <button
                          onClick={() => handleStartInterview(i.applicationId)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow transition"
                        >
                          Start AI Interview
                        </button>
                      )}
                      <span className="px-2.5 py-1 bg-slate-950 border border-slate-850 rounded-lg text-[10px] font-bold uppercase text-slate-400">
                        {i.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. OFFERS LETTERS */}
        {activeTab === 'offers' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Employment Offer Letters</h3>
            {userOffers.map(o => (
              <div key={o.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{o.role} Job Offer</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{o.companyName} · compensation: {o.salary}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                    o.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
                  }`}>{o.status}</span>
                </div>

                <p className="text-xs text-slate-350 font-mono leading-relaxed whitespace-pre-wrap bg-slate-950 p-4 border border-slate-850 rounded-xl max-h-[220px] overflow-y-auto">
                  {o.content}
                </p>

                {o.status === 'sent' && (
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        respondToOffer(o.id, 'accepted');
                        alert('Congratulations! Employment offer accepted successfully.');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition"
                    >
                      Accept Job Offer
                    </button>
                    <button
                      onClick={() => {
                        respondToOffer(o.id, 'declined');
                        alert('Offer declined.');
                      }}
                      className="px-4 py-2 bg-slate-900 hover:bg-rose-950/20 text-rose-400 border border-slate-800 rounded-lg text-xs font-bold transition"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
