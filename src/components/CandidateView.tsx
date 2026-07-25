import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { CVItem, Job, Application } from '../types/portal';
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
  } = usePortal();

  const profile = candidateProfiles.find((p) => p.userId === currentUser?.id) || candidateProfiles[0];
  const userCvs = cvs.filter((c) => c.candidateId === currentUser?.id);
  const userApplications = applications.filter((a) => a.candidateId === currentUser?.id);
  const userOffers = offerLetters.filter((o) => o.candidateId === currentUser?.id);

  const [activeTab, setActiveTab] = useState<'profile' | 'parser' | 'jobs' | 'applications' | 'interview' | 'offers'>('jobs');

  // Parser state
  const [cvText, setCvText] = useState('');
  const [cvTitle, setCvTitle] = useState('My AI Parsed CV');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedSuccess, setParsedSuccess] = useState<CVItem | null>(null);

  // Parser review states
  const [parsedDataToReview, setParsedDataToReview] = useState<any | null>(null);
  const [editParsedName, setEditParsedName] = useState('');
  const [editParsedSummary, setEditParsedSummary] = useState('');
  const [editParsedSkills, setEditParsedSkills] = useState('');
  const [editParsedLocation, setEditParsedLocation] = useState('');
  const [editParsedSalary, setEditParsedSalary] = useState('');
  const [editParsedAvailability, setEditParsedAvailability] = useState('Immediate');
  const [editParsedExpYears, setEditParsedExpYears] = useState(0);

  // Profile editing form states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editExpYears, setEditExpYears] = useState(0);
  const [editSalary, setEditSalary] = useState('');
  const [editAvailability, setEditAvailability] = useState<'Immediate' | '15 Days' | '30 Days' | '60 Days'>('Immediate');
  const [editDomain, setEditDomain] = useState('Engineering');
  const [editSkills, setEditSkills] = useState('');

  const startEditingProfile = () => {
    setEditName(profile.fullName || '');
    setEditPhone(profile.phone || '');
    setEditLocation(profile.location || '');
    setEditBio(profile.bio || '');
    setEditExpYears(profile.experienceYears || 0);
    setEditSalary(profile.expectedSalary || '');
    setEditAvailability(profile.availability || 'Immediate');
    setEditDomain(profile.domain || 'Engineering');
    setEditSkills(profile.skills ? profile.skills.join(', ') : '');
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...profile,
      fullName: editName,
      email: profile.email, // keep email immutable for user
      phone: editPhone,
      location: editLocation,
      bio: editBio,
      experienceYears: Number(editExpYears),
      expectedSalary: editSalary,
      availability: editAvailability,
      domain: editDomain,
      skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
    });
    setIsEditingProfile(false);
  };

  // Apply Modal state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedCvId, setSelectedCvId] = useState<string>(userCvs[0]?.id || '');

  // AI Interview Room state
  const [activeInterviewAppId, setActiveInterviewAppId] = useState<string | null>(null);
  const [interviewAnswers, setInterviewAnswers] = useState<{ [qId: string]: string }>({});
  const [isSubmittingInterview, setIsSubmittingInterview] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // E-signature canvas state & handlers
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [agreeBinding, setAgreeBinding] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#6366f1'; // Indigo-500
    
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  // Slots for screening scheduler
  const availableSlots = [
    'Tomorrow, 10:00 AM PST',
    'Tomorrow, 2:30 PM PST',
    'Friday, 11:00 AM PST',
    'Friday, 4:00 PM PST',
  ];

  const handleParseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvText.trim()) return;
    setIsParsing(true);
    setParsedSuccess(null);
    setParsedDataToReview(null);
    try {
      const res = await fetch('/api/parse-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText }),
      });
      const result = await res.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to parse CV');
      }
      
      const pData = result.data;
      setParsedDataToReview(pData);
      setEditParsedName(pData.fullName || '');
      setEditParsedSummary(pData.summary || '');
      setEditParsedSkills(pData.skills ? pData.skills.join(', ') : '');
      setEditParsedLocation(pData.location || '');
      setEditParsedSalary(pData.expectedSalary || '₹10,00,000 / yr');
      setEditParsedAvailability(pData.availability || 'Immediate');
      setEditParsedExpYears(pData.experienceYears || 0);
    } catch (err: any) {
      alert(err.message || 'Failed to parse resume');
    } finally {
      setIsParsing(false);
    }
  };

  const handlePublishParsedCv = () => {
    if (!parsedDataToReview) return;
    const finalParsed: any = {
      ...parsedDataToReview,
      fullName: editParsedName,
      summary: editParsedSummary,
      skills: editParsedSkills.split(',').map(s => s.trim()).filter(Boolean),
      location: editParsedLocation,
      expectedSalary: editParsedSalary,
      availability: editParsedAvailability,
      experienceYears: Number(editParsedExpYears),
    };
    const newCv = addParsedCVItem(finalParsed, cvTitle, cvText);
    setParsedSuccess(newCv);
    setParsedDataToReview(null);
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    if (userCvs.length > 0) {
      setSelectedCvId(userCvs[0].id);
    }
  };

  const confirmApply = () => {
    if (!selectedJob) return;
    applyForJob(selectedJob.id, selectedCvId);
    setSelectedJob(null);
    setActiveTab('applications');
  };

  const activeInterview = interviews.find((i) => i.applicationId === activeInterviewAppId);

  const handleAnswerChange = (qId: string, val: string) => {
    setInterviewAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleInterviewSubmit = async () => {
    if (!activeInterview) return;
    setIsSubmittingInterview(true);
    const answersArray = activeInterview.questions.map((q) => ({
      questionId: q.id,
      answer: interviewAnswers[q.id] || 'Candidate provided concise summary answer.',
    }));

    try {
      await submitAIInterviewAnswers(activeInterview.id, answersArray);
      alert('AI Interview responses submitted & evaluated successfully!');
      setActiveInterviewAppId(null);
      setActiveTab('applications');
    } catch (err: any) {
      alert('Failed to submit interview: ' + err.message);
    } finally {
      setIsSubmittingInterview(false);
    }
  };

  const downloadOfferPDF = (offer: typeof offerLetters[0]) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(offer.companyName.toUpperCase(), 20, 20);
    doc.setFontSize(12);
    doc.text(`Official Offer Letter for ${offer.candidateName}`, 20, 30);
    doc.setFontSize(10);
    doc.text(`Position: ${offer.role}`, 20, 40);
    doc.text(`Salary: ${offer.salary}`, 20, 48);
    doc.text(`Joining Date: ${offer.joiningDate}`, 20, 56);
    
    doc.text('Key Benefits:', 20, 68);
    let y = 76;
    offer.benefits.forEach((b) => {
      doc.text(`• ${b}`, 25, y);
      y += 8;
    });

    const splitText = doc.splitTextToSize(offer.content, 170);
    doc.text(splitText, 20, y + 10);

    doc.save(`Offer_Letter_${offer.candidateName.replace(' ', '_')}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Candidate Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'jobs'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Job Marketplace ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'applications'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>My Applications ({userApplications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('parser')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'parser'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            <Briefcase className="w-4 h-4 text-indigo-300" />
            <span>Resume Parser</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & CV Versions ({userCvs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'offers'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Offer Letters ({userOffers.length})</span>
          </button>
        </div>

        {/* Candidate Open To Work Banner */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs">
          <span className="text-slate-400 font-medium">Open to Work:</span>
          <button
            onClick={() => updateProfile({ ...profile, openToWork: !profile.openToWork })}
            className={`px-2 py-0.5 rounded-full font-bold text-[11px] transition ${
              profile.openToWork
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-700 text-slate-400'
            }`}
          >
            {profile.openToWork ? 'ACTIVE' : 'OFF'}
          </button>
        </div>
      </div>

      {/* TAB 1: JOB MARKETPLACE */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Explore Open Opportunities</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono">
                  Multi-Domain Support
                </span>
              </h2>
              <p className="text-xs text-slate-400">Apply with your tailored AI CV version in one click.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => {
              const alreadyApplied = userApplications.some((a) => a.jobId === job.id);
              return (
                <div
                  key={job.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition shadow-lg"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {job.domain}
                        </span>
                        <h3 className="text-base font-bold text-white mt-1.5">{job.title}</h3>
                        <p className="text-xs font-medium text-slate-300">{job.company}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        {job.salaryRange}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-400 mt-3">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{job.location}</span>
                      </span>
                      <span>•</span>
                      <span className="capitalize">{job.type}</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">{job.description}</p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.requirements.slice(0, 3).map((req, idx) => (
                        <span key={idx} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Posted by Recruiter</span>

                    {alreadyApplied ? (
                      <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Applied</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(job)}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MY APPLICATIONS & AUTOMATION TRACKER */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4">
            <h2 className="text-base font-bold text-white">Application Stage Tracker</h2>
            <p className="text-xs text-slate-400">
              Post-Shortlist workflow: Screening Auto-Scheduler → Candidate Interview → Verdict → Offer Release
            </p>
          </div>

          {userApplications.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
              No active job applications found. Browse the Job Marketplace and apply!
            </div>
          ) : (
            <div className="space-y-4">
              {userApplications.map((app) => {
                const job = jobs.find((j) => j.id === app.jobId);
                const cv = cvs.find((c) => c.id === app.cvId);
                const appInterview = interviews.find((i) => i.applicationId === app.id);
                const appOffer = offerLetters.find((o) => o.applicationId === app.id);

                return (
                  <div
                    key={app.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div>
                        <h3 className="text-base font-bold text-white">{job?.title || 'Position'}</h3>
                        <p className="text-xs text-slate-400">{job?.company} • Attached CV: <span className="text-indigo-300 font-medium">{cv?.title || 'Primary CV'}</span></p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 capitalize">
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Stage Pipeline Visualization */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                      {/* Stage 1 */}
                      <div className={`p-3 rounded-xl border ${app.stage >= 1 ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
                        <div className="font-bold flex items-center justify-between mb-1">
                          <span>Stage 1: Screening Call</span>
                          {app.stage > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-indigo-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400">Calendar auto-scheduler</p>
                        {app.screeningSlot && (
                          <div className="mt-2 text-[10px] bg-indigo-500/20 p-1.5 rounded text-indigo-200 font-semibold">
                            Slot: {app.screeningSlot}
                          </div>
                        )}
                      </div>

                      {/* Stage 2 */}
                      <div className={`p-3 rounded-xl border ${app.stage >= 2 ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
                        <div className="font-bold flex items-center justify-between mb-1">
                          <span>Stage 2: AI Interview</span>
                          {appInterview?.status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4 text-amber-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400">Role-specific Q&A</p>
                        {appInterview?.overallScore && (
                          <div className="mt-2 text-[10px] bg-emerald-500/20 p-1.5 rounded text-emerald-300 font-semibold">
                            Score: {appInterview.overallScore}%
                          </div>
                        )}
                      </div>

                      {/* Stage 3 */}
                      <div className={`p-3 rounded-xl border ${app.stage >= 3 ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
                        <div className="font-bold flex items-center justify-between mb-1">
                          <span>Stage 3: Decision</span>
                          {app.status === 'selected' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-slate-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400">Recruiter verdict</p>
                        <div className="mt-2 text-[10px] font-semibold capitalize text-slate-300">
                          {app.status}
                        </div>
                      </div>

                      {/* Stage 4 */}
                      <div className={`p-3 rounded-xl border ${app.stage >= 4 ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
                        <div className="font-bold flex items-center justify-between mb-1">
                          <span>Stage 4: Offer Release</span>
                          {appOffer?.status === 'accepted' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Award className="w-4 h-4 text-purple-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400">Auto template fill</p>
                        {appOffer && (
                          <div className="mt-2 text-[10px] bg-purple-500/20 p-1.5 rounded text-purple-200 font-semibold">
                            Status: {appOffer.status}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Candidate Action Callouts */}
                    <div className="p-3 bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                      <div className="text-slate-300">
                        <span className="font-semibold text-white">Status Note: </span>
                        <span>{app.notes || 'Application submitted.'}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* If in Stage 1 & slot not selected, prompt selection */}
                        {app.stage === 1 && !app.screeningSlot && (
                          <div className="flex items-center space-x-1">
                            <span className="text-[11px] text-indigo-300 font-medium">Pick Slot:</span>
                            <select
                              onChange={(e) => scheduleScreeningCall(app.id, e.target.value)}
                              className="bg-slate-900 border border-indigo-500/50 rounded px-2 py-1 text-xs text-white"
                              defaultValue=""
                            >
                              <option value="" disabled>Select Time Slot</option>
                              {availableSlots.map((slot, idx) => (
                                <option key={idx} value={slot}>{slot}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Launch AI Interview button */}
                        {app.stage >= 1 && (!appInterview || appInterview.status === 'scheduled') && (
                          <button
                            onClick={async () => {
                              if (!appInterview) {
                                await startAIInterview(app.id);
                              }
                              setActiveInterviewAppId(app.id);
                              setActiveTab('interview');
                            }}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Launch AI Interview</span>
                          </button>
                        )}

                        {/* View Offer Letter button */}
                        {appOffer && (
                          <button
                            onClick={() => setActiveTab('offers')}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>View Offer Letter</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AI INTERVIEW ROOM */}
      {activeTab === 'interview' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>AI Automated Interview Workspace</span>
              </h2>
              <p className="text-xs text-slate-400">
                AI evaluates your responses against rubrics for technical accuracy, communication clarity, and keyword relevance.
              </p>
            </div>
          </div>

          {!activeInterview ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
              No active AI interview session selected. Go to <span className="text-indigo-300 font-bold">My Applications</span> and click <span className="text-indigo-300 font-bold">Launch AI Interview</span>.
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
              {/* Interview header & progress bar */}
              <div className="space-y-3 pb-4 border-b border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">STAGE 2: AUTOMATED AI SCREENING</span>
                    <h3 className="text-lg font-bold text-white">Interactive Assessment Workspace</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black border border-indigo-500/30">
                    Question {currentQuestionIdx + 1} of {activeInterview.questions.length}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIdx + 1) / activeInterview.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Bot Greeting Bubble */}
              <div className="flex items-start space-x-3 text-xs bg-indigo-950/20 border border-indigo-500/10 p-3 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                  AI
                </div>
                <div>
                  <div className="font-bold text-indigo-300">AI Recruiter Assistant</div>
                  <p className="text-slate-300 mt-0.5">
                    "Hello! Please answer the question below. I will evaluate your response based on technical accuracy, communication clarity, and keyword relevance. You can type or use your voice."
                  </p>
                </div>
              </div>

              {/* Current Question Block */}
              {(() => {
                const q = activeInterview.questions[currentQuestionIdx];
                if (!q) return null;
                return (
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800/50 pb-2">
                      <span className="text-xs font-black uppercase text-indigo-400">Assessment Question</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {q.category}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-100 leading-snug">{q.question}</h4>

                    <div className="relative">
                      <textarea
                        rows={5}
                        placeholder="Type your response or click the microphone to dictate your answer..."
                        value={interviewAnswers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-4 text-xs text-slate-200"
                      />

                      {/* Mock Dictation Microphone Action */}
                      <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                        {isRecordingVoice && (
                          <div className="flex items-center space-x-1 bg-rose-500/20 border border-rose-500/30 px-3 py-1 rounded-full text-rose-300 text-[10px] font-bold animate-pulse">
                            {/* Animated sound wave bars */}
                            <div className="flex items-end space-x-0.5 h-2.5 mr-1.5">
                              <div className="w-0.5 h-2 bg-rose-400 animate-bounce duration-300" style={{ animationDelay: '100ms' }} />
                              <div className="w-0.5 h-4 bg-rose-400 animate-bounce duration-300" style={{ animationDelay: '300ms' }} />
                              <div className="w-0.5 h-1 bg-rose-400 animate-bounce duration-300" style={{ animationDelay: '200ms' }} />
                              <div className="w-0.5 h-3 bg-rose-400 animate-bounce duration-300" style={{ animationDelay: '400ms' }} />
                            </div>
                            <span>Recording voice... speak clearly</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (isRecordingVoice) {
                              setIsRecordingVoice(false);
                            } else {
                              setIsRecordingVoice(true);
                              // Auto populate mock speech text after 2 seconds
                              setTimeout(() => {
                                handleAnswerChange(q.id, `In my experience, managing these requirements involves planning for high concurrent volumes. I rely on structured state machines, caching layers using Redis, and database indexes in PostgreSQL to keep query times optimal. I also ensure robust error catching and fallback configurations are written.`);
                                setIsRecordingVoice(false);
                              }, 2000);
                            }
                          }}
                          className={`p-2.5 rounded-full shadow border transition ${
                            isRecordingVoice 
                              ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500' 
                              : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                          title="Record response via dictation"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Wizard Nav Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setActiveInterviewAppId(null);
                    setActiveTab('applications');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition"
                >
                  Save & Exit
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                    className="px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition disabled:opacity-30"
                  >
                    Previous Question
                  </button>

                  {currentQuestionIdx < activeInterview.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={handleInterviewSubmit}
                      disabled={isSubmittingInterview}
                      className="flex items-center space-x-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                    >
                      {isSubmittingInterview ? (
                        <>
                          <Zap className="w-4 h-4 animate-spin text-indigo-200" />
                          <span>AI Evaluating...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Answers to AI</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AI RESUME PARSER */}
      {activeTab === 'parser' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>AI Resume Parser & Auto-Filler</span>
            </h2>
            <p className="text-xs text-slate-400">
              Paste raw resume text or document content. Server-side Gemini AI parses skills, experience, education, and auto-fills your structured profile.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleParseSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">CV Title / Version Name</label>
                <input
                  type="text"
                  value={cvTitle}
                  onChange={(e) => setCvTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Full-Stack Senior CV 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Paste Raw Resume Content / PDF Text</label>
                <textarea
                  rows={10}
                  required
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Paste work experience, skills, education, summary text here..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isParsing}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isParsing ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-indigo-200" />
                    <span>Server Gemini AI Parsing CV...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Resume Parser & Auto-Fill</span>
                  </>
                )}
              </button>
            </form>

            {/* Parsed Output Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>{parsedDataToReview ? 'Review & Edit Parsed Data' : 'AI Extracted Profile Preview'}</span>
                  </div>
                  {parsedDataToReview && (
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 font-mono animate-pulse">
                      Pending Publish
                    </span>
                  )}
                </h3>

                {parsedDataToReview ? (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">Full Name</label>
                        <input type="text" value={editParsedName} onChange={e=>setEditParsedName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-[11px] text-white focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">Location</label>
                        <input type="text" value={editParsedLocation} onChange={e=>setEditParsedLocation(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-[11px] text-white focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">Exp Years</label>
                        <input type="number" value={editParsedExpYears} onChange={e=>setEditParsedExpYears(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-[11px] text-white focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">Salary</label>
                        <input type="text" value={editParsedSalary} onChange={e=>setEditParsedSalary(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-[11px] text-white focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">Availability</label>
                        <select value={editParsedAvailability} onChange={e=>setEditParsedAvailability(e.target.value as any)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-[11px] text-white focus:outline-none focus:border-indigo-500">
                          <option value="Immediate">Immediate</option>
                          <option value="15 Days">15 Days</option>
                          <option value="30 Days">30 Days</option>
                          <option value="60 Days">60 Days</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Summary / Bio</label>
                      <textarea rows={2} value={editParsedSummary} onChange={e=>setEditParsedSummary(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-[11px] text-white focus:outline-none focus:border-indigo-500" />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Skills Extracted (Comma-separated)</label>
                      <input type="text" value={editParsedSkills} onChange={e=>setEditParsedSkills(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-[11px] text-white focus:outline-none focus:border-indigo-500" />
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handlePublishParsedCv}
                        className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                      >
                        Publish & Update Structured Profile
                      </button>
                    </div>
                  </div>
                ) : !parsedSuccess ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl p-4">
                    <Upload className="w-8 h-8 mb-2 text-slate-600" />
                    <p>Paste resume text on the left and click parse.</p>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl">
                      <div className="font-bold text-indigo-200 text-sm">{parsedSuccess.parsedData.fullName}</div>
                      <div className="text-slate-300">{parsedSuccess.parsedData.summary}</div>
                      <div className="mt-2 text-slate-400 flex items-center space-x-3 text-[11px]">
                        <span>Exp: {parsedSuccess.parsedData.experienceYears} Years</span>
                        <span>•</span>
                        <span>{parsedSuccess.parsedData.location}</span>
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-300 block mb-1">Extracted Skills Tagged:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {parsedSuccess.parsedData.skills?.map((sk, idx) => (
                          <span key={idx} className="bg-emerald-500/10 text-emerald-300 text-[11px] px-2 py-0.5 rounded font-medium border border-emerald-500/20">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-300 block mb-1">Work History Extracted:</span>
                      <div className="space-y-1.5">
                        {parsedSuccess.parsedData.experience?.map((exp, idx) => (
                          <div key={idx} className="bg-slate-800/60 p-2 rounded text-[11px]">
                            <span className="font-bold text-slate-200">{exp.role}</span> at <span className="text-slate-300">{exp.company}</span>
                            <p className="text-slate-400 line-clamp-1">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {parsedSuccess && !parsedDataToReview && (
                <div className="pt-3 border-t border-slate-800 mt-4 text-emerald-400 text-xs font-semibold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CV parsed and saved to candidate multi-CV collection!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PROFILE & CV VERSIONS */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Edit Structured Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                  <input type="text" required value={editName} onChange={e=>setEditName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Phone</label>
                  <input type="text" value={editPhone} onChange={e=>setEditPhone(e.target.value)} className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Location</label>
                  <input type="text" value={editLocation} onChange={e=>setEditLocation(e.target.value)} className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Experience Years</label>
                  <input type="number" value={editExpYears} onChange={e=>setEditExpYears(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Expected Salary</label>
                  <input type="text" value={editSalary} onChange={e=>setEditSalary(e.target.value)} className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Availability</label>
                  <select value={editAvailability} onChange={e=>setEditAvailability(e.target.value as any)} className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white">
                    <option value="Immediate">Immediate</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="60 Days">60 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Job Category Domain</label>
                  <select value={editDomain} onChange={e=>setEditDomain(e.target.value)} className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white">
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Skills (Comma-separated)</label>
                  <input type="text" value={editSkills} onChange={e=>setEditSkills(e.target.value)} className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Short Bio</label>
                <textarea rows={2} value={editBio} onChange={e=>setEditBio(e.target.value)} className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg p-2.5 text-xs text-white" />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={()=>setIsEditingProfile(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow">Save Changes</button>
              </div>
            </form>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={profile.avatar || currentUser?.avatar}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-500/30"
                />
                <div>
                  <h2 className="text-lg font-bold text-white">{profile.fullName}</h2>
                  <p className="text-xs text-slate-400">{profile.email} • {profile.location}</p>
                  <p className="text-[11px] text-slate-300 mt-1 max-w-xl">{profile.bio}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                      {profile.experienceYears} Years Experience
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80">
                      Expected: {profile.expectedSalary}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                      {profile.availability}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                      {profile.domain}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={startEditingProfile}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
                >
                  Edit Profile Fields
                </button>
                <button
                  onClick={() => setActiveTab('parser')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition"
                >
                  <PlusCircle className="w-4 h-4" strokeWidth={2} />
                  <span>Add New CV Version</span>
                </button>
              </div>
            </div>
          )}

          {/* Multi-CV Collection */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200">Attached Candidate CV Versions ({userCvs.length})</h3>
            <p className="text-xs text-slate-400">Candidates can maintain multiple tailored CVs and choose which one to attach per job application.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userCvs.map((cv) => (
                <div key={cv.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{cv.title}</span>
                    {cv.isPrimary && (
                      <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                        PRIMARY
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300">{cv.parsedData.summary}</p>

                  <div className="flex flex-wrap gap-1">
                    {cv.parsedData.skills?.map((sk, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {sk}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 text-[10px] text-slate-500 flex justify-between">
                    <span>Updated {new Date(cv.updatedAt).toLocaleDateString()}</span>
                    <span className="text-emerald-400 font-semibold">Indexed for Recruiter AI Search</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: OFFER LETTERS */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4">
            <h2 className="text-base font-bold text-white">Received Employment Offer Letters</h2>
            <p className="text-xs text-slate-400">View, download PDF, or respond to official offer letters.</p>
          </div>

          {userOffers.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
              No offer letters received yet. Complete AI interviews to receive automated offer releases!
            </div>
          ) : (
            <div className="space-y-4">
              {userOffers.map((offer) => (
                <div key={offer.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">OFFICIAL OFFER LETTER</span>
                      <h3 className="text-lg font-bold text-white">{offer.role}</h3>
                      <p className="text-xs text-slate-300">{offer.companyName}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadOfferPDF(offer)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${
                        offer.status === 'accepted'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : offer.status === 'declined'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {offer.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Offered Salary</span>
                      <span className="font-bold text-emerald-400">{offer.salary}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Joining Date</span>
                      <span className="font-bold text-slate-200">{offer.joiningDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Sent Date</span>
                      <span className="font-bold text-slate-200">{new Date(offer.sentAt || '').toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-serif leading-relaxed text-slate-300 whitespace-pre-wrap">
                    {offer.content}
                  </div>

                  {offer.status === 'sent' && (
                    <div className="space-y-4 pt-3 border-t border-slate-800">
                      {/* E-Signature Drawing Pad */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-black text-indigo-400 uppercase">E-Signature Verification Required</span>
                            <h4 className="text-xs font-bold text-white">Draw Signature below to sign contract</h4>
                          </div>
                          <button
                            type="button"
                            onClick={clearCanvas}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition"
                          >
                            Clear Signature
                          </button>
                        </div>
                        
                        <div className="relative bg-white rounded-lg border border-slate-700 h-28 overflow-hidden cursor-crosshair">
                          <canvas
                            ref={canvasRef}
                            width={500}
                            height={112}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="w-full h-full block"
                          />
                          {!hasSigned && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-mono">
                              Draw signature here
                            </div>
                          )}
                        </div>

                        <div className="flex items-start space-x-2 text-[11px] text-slate-400">
                          <input
                            type="checkbox"
                            id="agreeBinding"
                            checked={agreeBinding}
                            onChange={(e) => setAgreeBinding(e.target.checked)}
                            className="mt-0.5 accent-indigo-600 cursor-pointer"
                          />
                          <label htmlFor="agreeBinding" className="cursor-pointer select-none">
                            I understand that checking this box and drawing my signature represents a legally binding agreement to the offer terms of {offer.companyName}.
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-2">
                        <button
                          onClick={() => {
                            respondToOffer(offer.id, 'declined');
                            setAgreeBinding(false);
                            setHasSigned(false);
                          }}
                          className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold transition"
                        >
                          Decline Offer
                        </button>
                        <button
                          onClick={() => {
                            respondToOffer(offer.id, 'accepted');
                            setAgreeBinding(false);
                            setHasSigned(false);
                          }}
                          disabled={!hasSigned || !agreeBinding}
                          className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition disabled:opacity-30 disabled:pointer-events-none"
                        >
                          Accept & Sign Offer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Apply Confirmation Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Apply for {selectedJob.title}</h3>
              <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Attached CV Version</label>
              <select
                value={selectedCvId}
                onChange={(e) => setSelectedCvId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {userCvs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.parsedData.experienceYears} yrs exp)
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-300">
              Your profile and parsed CV will automatically trigger post-shortlist screening automation!
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmApply}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
