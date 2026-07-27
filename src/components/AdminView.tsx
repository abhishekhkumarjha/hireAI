import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Application, Job, UserRole } from '../types/portal';
import {
  Users,
  Shield,
  Link,
  PlusCircle,
  Copy,
  CheckCircle2,
  Activity,
  CreditCard,
  Cpu,
  Layers,
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  IndianRupee,
  Settings,
  X,
  XCircle,
  Clock,
  Filter,
  SlidersHorizontal,
  Github,
  Linkedin,
  Globe,
  FileText,
  Check,
  Search,
  Pencil,
  Save,
  Trash2
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    currentUser,
    users,
    invites,
    jobs,
    applications,
    candidateProfiles,
    cvs,
    createInvite,
    deleteUser,
    updateJob,
    updateApplicationStage,
    releaseOfferLetter,
    scheduleScreeningCall,
    permissionMatrix
  } = usePortal();

  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'course_catalog' | 'course_admissions' | 'learners' | 'invite_billing'>('course_admissions');
  const [activeStatusTab, setActiveStatusTab] = useState<'pending' | 'approved' | 'rejected' | 'interview'>('pending');

  // Admissions Modal States
  const [openAppId, setOpenAppId] = useState<string | null>(null);
  const [interviewNotesText, setInterviewNotesText] = useState('');
  const [overallFitText, setOverallFitText] = useState('Excellent performance in Gen AI assessment quiz.');
  
  // Modals for Offer and Interview
  const [selectedAppForOffer, setSelectedAppForOffer] = useState<Application | null>(null);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState<Application | null>(null);
  const [offerSalary, setOfferSalary] = useState('₹12,00,000 / yr');
  const [offerJoiningDate, setOfferJoiningDate] = useState('2026-08-15');
  const [customNotes, setCustomNotes] = useState('Standard cohort equipment allowance applies.');
  const [isReleasingOffer, setIsReleasingOffer] = useState(false);
  const [interviewTimeSlot, setInterviewTimeSlot] = useState('2026-08-01T10:00');

  // Invite states
  const [inviteRole, setInviteRole] = useState<'admin' | 'recruiter'>('recruiter');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Filters for Admissions
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProgram, setFilterProgram] = useState('All');
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseDraft, setCourseDraft] = useState<Job | null>(null);

  const courseJobs = jobs.filter((job) => job.id.includes('bootcamp'));
  const learnerRows = candidateProfiles.map((profile) => ({
    profile,
    applications: applications.filter((application) => application.candidateId === profile.userId),
  }));

  const beginCourseEdit = (course: Job) => {
    setEditingCourseId(course.id);
    setCourseDraft({ ...course, requirements: [...course.requirements] });
  };

  const saveCourse = () => {
    if (!courseDraft) return;
    updateJob({
      ...courseDraft,
      requirements: courseDraft.requirements.filter(Boolean),
    });
    setEditingCourseId(null);
    setCourseDraft(null);
  };

  const handleGenerateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const inv = createInvite(inviteRole, inviteEmail, inviteName);
    const link = `${window.location.origin}/invite?token=${inv.token}&role=${inv.role}`;
    setGeneratedLink(link);
    setInviteEmail('');
    setInviteName('');
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteAccount = (userId: string, name: string) => {
    if (!confirm(`Delete ${name}'s account? Candidate records will be removed. Recruiter and Admin listings will be retained under Super Admin ownership.`)) return;
    if (!deleteUser(userId)) alert('This account cannot be deleted. Only non–Super Admin accounts can be removed.');
  };

  // -------------------------------------------------------------
  // ACTION HANDLERS
  // -------------------------------------------------------------
  const handleReleaseOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForOffer) return;
    
    setIsReleasingOffer(true);
    try {
      await releaseOfferLetter(selectedAppForOffer.id, offerSalary, offerJoiningDate, customNotes);
      alert('Confirmation of Admission Letter Released Successfully!');
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
      updateApplicationStage(appId, 3, 'rejected', 'Admissions profile reviewed and rejected by Admissions Board.');
    }
  };

  const handleRequestMoreInfo = (appId: string) => {
    const reason = prompt("Describe what details are missing (e.g. Portfolio link, higher education degree):", "Please add your portfolio URL.");
    if (reason) {
      updateApplicationStage(appId, 1, 'need_more_info', reason);
      alert('Application updated to Need More Info!');
    }
  };

  // Math for Billing & Revenue
  const enrolledCount = applications.filter(a => a.status === 'offer_accepted').length;
  const cohortRevenue = enrolledCount * 45000;

  // Filter Course Applications (AI Engineer & DevOps Bootcamps)
  const getCourseApplications = () => {
    return applications.filter(app => {
      const job = jobs.find(j => j.id === app.jobId);
      if (!job) return false;
      // Admin and Super Admin manage every course offering; recruiter job postings stay scoped to recruiters.
      return job.id.includes('bootcamp');
    });
  };

  const courseApps = getCourseApplications();

  const getFilteredCourseApplications = () => {
    return courseApps.filter(app => {
      const profile = candidateProfiles.find(p => p.userId === app.candidateId);
      const job = jobs.find(j => j.id === app.jobId);
      if (!profile || !job) return false;

      // Status check
      const matchesTab = 
        activeStatusTab === 'pending' ? (app.status === 'applied' || app.status === 'shortlisted' || app.status === 'need_more_info') :
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

      return true;
    });
  };

  const filteredCourseApps = getFilteredCourseApplications();

  const pendingCount = courseApps.filter(a => a.status === 'applied' || a.status === 'shortlisted' || a.status === 'need_more_info').length;
  const approvedCount = courseApps.filter(a => a.status === 'selected' || a.status === 'offer_sent' || a.status === 'offer_accepted').length;
  const rejectedCount = courseApps.filter(a => a.status === 'rejected').length;
  const interviewCount = courseApps.filter(a => a.status === 'screening_scheduled' || a.status === 'interviewing').length;

  return (
    <div className="space-y-6">
      
      {/* Super Admin Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
              isSuperAdmin ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            }`}>
              {isSuperAdmin ? 'SUPER ADMIN (FOUNDER / DEV AUTHORITY)' : 'ADMIN (COHORT DIRECTOR)'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-2">Platform Control & Onboarding Panel</h2>
          <p className="text-xs text-slate-400">
            Supervise course applications admissions, generate recruiter invite links, and audit billing registers.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('course_catalog')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'course_catalog' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Course Catalog
          </button>
          <button
            onClick={() => setActiveTab('course_admissions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'course_admissions' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Course Admissions
          </button>
          <button
            onClick={() => setActiveTab('learners')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'learners' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Students & Applicants
          </button>
          <button
            onClick={() => setActiveTab('invite_billing')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'invite_billing' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Invites & Billing
          </button>
        </div>
      </div>

      {activeTab === 'course_catalog' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white"><BookOpen className="w-4 h-4 text-indigo-400" />Course Catalog</h3>
            <p className="mt-1 text-xs text-slate-400">Course changes are shared immediately with admissions, applicant records, and the candidate course catalog.</p>
          </div>
          {courseJobs.map((course) => {
            const isEditing = editingCourseId === course.id && courseDraft;
            const courseApps = applications.filter((application) => application.jobId === course.id);
            const displayed = isEditing ? courseDraft : course;
            return (
              <div key={course.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{courseApps.length} application{courseApps.length === 1 ? '' : 's'}</p><h4 className="text-base font-bold text-white">{course.title}</h4></div>
                  {isEditing ? <div className="flex gap-2"><button onClick={() => { setEditingCourseId(null); setCourseDraft(null); }} className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300">Cancel</button><button onClick={saveCourse} className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white"><Save className="w-3.5 h-3.5" />Save</button></div> : <button onClick={() => beginCourseEdit(course)} className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-indigo-300"><Pencil className="w-3.5 h-3.5" />Edit course</button>}
                </div>
                {isEditing ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    <input value={displayed.title} onChange={(event) => setCourseDraft({ ...displayed, title: event.target.value })} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white" placeholder="Course title" />
                    <select value={displayed.status} onChange={(event) => setCourseDraft({ ...displayed, status: event.target.value as Job['status'] })} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"><option value="active">Active</option><option value="draft">Draft</option><option value="closed">Closed</option></select>
                    <input value={displayed.location} onChange={(event) => setCourseDraft({ ...displayed, location: event.target.value })} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white" placeholder="Location" />
                    <input value={displayed.salaryRange} onChange={(event) => setCourseDraft({ ...displayed, salaryRange: event.target.value })} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white" placeholder="Course fee" />
                    <textarea value={displayed.description} onChange={(event) => setCourseDraft({ ...displayed, description: event.target.value })} className="min-h-24 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white md:col-span-2" placeholder="Course description" />
                    <input value={displayed.requirements.join(', ')} onChange={(event) => setCourseDraft({ ...displayed, requirements: event.target.value.split(',').map((item) => item.trim()) })} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white md:col-span-2" placeholder="Requirements, comma separated" />
                    {displayed.courseInfo && <><input value={displayed.courseInfo.duration} onChange={(event) => setCourseDraft({ ...displayed, courseInfo: { ...displayed.courseInfo!, duration: event.target.value } })} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white" placeholder="Duration" /><input value={displayed.courseInfo.schedule} onChange={(event) => setCourseDraft({ ...displayed, courseInfo: { ...displayed.courseInfo!, schedule: event.target.value } })} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white" placeholder="Schedule" /><input value={displayed.courseInfo.regionalPricing.India || ''} onChange={(event) => setCourseDraft({ ...displayed, courseInfo: { ...displayed.courseInfo!, regionalPricing: { ...displayed.courseInfo!.regionalPricing, India: event.target.value } } })} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white md:col-span-2" placeholder="India course fee" /></>}
                  </div>
                ) : <div className="grid gap-2 text-xs text-slate-400 md:grid-cols-3"><span>Status: <b className="capitalize text-white">{course.status}</b></span><span>Location: <b className="text-white">{course.location}</b></span><span>Fee: <b className="text-white">{course.salaryRange}</b></span><p className="md:col-span-3">{course.description}</p>{course.courseInfo && <details className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 md:col-span-3"><summary className="cursor-pointer font-bold text-cyan-300">Program structure, learner benefits, and regional pricing</summary><div className="mt-3 grid gap-2 text-[11px] md:grid-cols-2"><span><b>Schedule:</b> {course.courseInfo.schedule}</span><span><b>Format:</b> {course.courseInfo.format}</span><span><b>Learning:</b> {course.courseInfo.contentHours}; {course.courseInfo.practice}</span><span><b>Projects:</b> {course.courseInfo.projects}</span><span><b>Career:</b> {course.courseInfo.experience}; {course.courseInfo.guidance}</span><span><b>Support:</b> {course.courseInfo.careerPrep}; {course.courseInfo.placement}</span><span className="md:col-span-2"><b>Regional pricing:</b> {Object.entries(course.courseInfo.regionalPricing).map(([region, fee]) => `${region}: ${fee}`).join(' · ')}</span></div></details>}</div>}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'learners' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4"><h3 className="flex items-center gap-2 text-sm font-bold text-white"><Users className="w-4 h-4 text-cyan-400" />Students & Applicants</h3><p className="mt-1 text-xs text-slate-400">All learner profiles and their applied courses. Open an application to review the complete admissions record.</p></div>
          <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="border-b border-slate-800 text-slate-500"><tr><th className="pb-3">Learner</th><th className="pb-3">Status</th><th className="pb-3">Applications</th><th className="pb-3">Courses</th><th className="pb-3"></th></tr></thead><tbody>{learnerRows.map(({ profile, applications: learnerApplications }) => <tr key={profile.id} className="border-b border-slate-800/60 text-slate-300"><td className="py-3"><div className="font-bold text-white">{profile.fullName}</div><div className="text-[10px] text-slate-500">{profile.email}</div></td><td className="py-3 capitalize"><span className="rounded-full bg-indigo-500/10 px-2 py-1 text-[10px] text-indigo-300">{profile.enrollmentStatus || 'applicant'}</span></td><td className="py-3">{learnerApplications.length}</td><td className="py-3 text-slate-400">{learnerApplications.map((application) => jobs.find((job) => job.id === application.jobId)?.title).filter(Boolean).join(', ') || '—'}</td><td className="py-3">{learnerApplications[0] && <button onClick={() => setOpenAppId(learnerApplications[0].id)} className="text-xs font-bold text-cyan-400 hover:text-cyan-300">View details</button>}</td></tr>)}</tbody></table></div>
        </div>
      )}

      {/* =============================================================
          TAB 1: COURSE ADMISSIONS REVIEW
          ============================================================= */}
      {activeTab === 'course_admissions' && (
        <div className="space-y-6">
          {/* Sourcing Search panel */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span>CloudInnTech Edutech Masters Admissions Review</span>
              </h3>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Pending Review</span>
                <span className="text-xl font-black text-cyan-400">{pendingCount} Applicants</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search textfield */}
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-650" />
                <input
                  type="text"
                  placeholder="Search applicant name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none placeholder-slate-600"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500"><Filter className="w-3.5 h-3.5 inline mr-1" />Program:</span>
                  <select
                    value={filterProgram}
                    onChange={(e) => setFilterProgram(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                  >
                    <option value="All">All Course Bootcamps</option>
                    <option value="Masters in AI with Project Management">Masters in AI with Project Management</option>
                    <option value="Masters in AWS DevOps Engineer">Masters in AWS DevOps Engineer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-t border-slate-800/80 pt-4 gap-2 text-xs font-bold uppercase tracking-wider">
              {[
                { key: 'pending' as const, label: `Pending Admissions (${pendingCount})` },
                { key: 'approved' as const, label: `Approved Enrolled (${approvedCount})` },
                { key: 'interview' as const, label: `Interviews scheduled (${interviewCount})` },
                { key: 'rejected' as const, label: `Rejected applicants (${rejectedCount})` }
              ].map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStatusTab(tab.key)}
                  className={`px-4 py-2 border rounded-xl transition ${
                    activeStatusTab === tab.key
                      ? `bg-slate-955 border-cyan-500/40 text-cyan-300 bg-slate-950/80 shadow`
                      : 'bg-slate-950/40 border-slate-850 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="space-y-4">
            {filteredCourseApps.length === 0 ? (
              <div className="py-12 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
                No active course applications match the filters or search parameters.
              </div>
            ) : (
              filteredCourseApps.map((app, idx) => {
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
                          Course Admissions
                        </span>
                        <span className="text-[10px] text-slate-450 font-bold">{job.title}</span>
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
                        <span>Experience: <span className="text-slate-355 font-bold text-slate-300">{profile.experienceYears > 0 ? `${profile.experienceYears} Years` : "Student"}</span></span>
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
        </div>
      )}

      {/* =============================================================
          TAB 2: INVITES & BILLING
          ============================================================= */}
      {activeTab === 'invite_billing' && (
        <div className="space-y-6 animate-fade-in">
          {/* Grid Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-xs text-slate-400 block font-semibold">Total Accounts</span>
              <span className="text-2xl font-black text-white mt-1 block">{users.length}</span>
              <span className="text-[10px] text-indigo-400 mt-1 block font-medium">Admins, Recruiters, Students</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-xs text-slate-400 block font-semibold">Enrolled Students</span>
              <span className="text-2xl font-black text-white mt-1 block">{enrolledCount}</span>
              <span className="text-[10px] text-emerald-400 mt-1 block font-medium">Active Cohort Seats</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-xs text-slate-400 block font-semibold">Admissions Ledger</span>
              <span className="text-2xl font-black text-white mt-1 block">₹{cohortRevenue.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-purple-400 mt-1 block font-medium">Bootcamp Tuition Fees</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-xs text-slate-400 block font-semibold">Master Bootcamps</span>
              <span className="text-2xl font-black text-white mt-1 block">{jobs.filter(j => j.id.includes('bootcamp')).length}</span>
              <span className="text-[10px] text-amber-400 mt-1 block font-medium">Active Curriculums</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Onboard Team Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center space-x-2">
                <Link className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Invite Cohort Admins / Recruiters</h3>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Generate signed, expiring invite links. Invitees automatically receive custom role privileges upon signup.
              </p>

              <form onSubmit={handleGenerateInvite} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Privilege</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="recruiter">Recruiter</option>
                      {isSuperAdmin && <option value="admin">Admin</option>}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@cloudinntech.co.in"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Generate Signed Invite
                </button>
              </form>

              {generatedLink && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Share this Invite Link:</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-slate-300 focus:outline-none"
                    />
                    <button
                      onClick={() => handleCopyLink(generatedLink)}
                      className="px-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-200 transition"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cohort Programs List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Active Master Bootcamps</h3>
              </div>
              
              <div className="space-y-2">
                {jobs.filter(j => j.id.includes('bootcamp')).map((job, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-855 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">{job.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{job.company} • {job.location}</p>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Invites list log */}
          {invites.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>Admissions Onboarding Log</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500">
                      <th className="pb-2">Invited Email</th>
                      <th className="pb-2">Target Privilege</th>
                      <th className="pb-2">Token</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invites.map((inv, idx) => (
                      <tr key={idx} className="border-b border-slate-850/50 text-slate-300">
                        <td className="py-2.5">{inv.email}</td>
                        <td className="py-2.5 capitalize">{inv.role}</td>
                        <td className="py-2.5 font-mono text-[10px] text-indigo-400">{inv.token}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inv.status === 'pending' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/25' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {isSuperAdmin && (
            <div className="bg-slate-900 border border-rose-500/20 rounded-2xl p-6 shadow-xl space-y-4">
              <div><h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Trash2 className="w-4 h-4 text-rose-400" />Account Management</h3><p className="mt-1 text-xs text-slate-400">Only Super Admin can delete accounts. Candidate records are deleted with the account; organisational listings are preserved and reassigned.</p></div>
              <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-slate-800 text-slate-500"><th className="pb-2">Account</th><th className="pb-2">Role</th><th className="pb-2">Created</th><th className="pb-2"></th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b border-slate-800/60 text-slate-300"><td className="py-3"><div className="font-bold text-white">{user.name}</div><div className="text-[10px] text-slate-500">{user.email}</div></td><td className="py-3 capitalize">{user.role.replace('_', ' ')}</td><td className="py-3 text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td><td className="py-3 text-right">{user.role === 'super_admin' ? <span className="text-[10px] text-slate-600">Protected</span> : <button onClick={() => handleDeleteAccount(user.id, user.name)} className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 px-2.5 py-1.5 text-[10px] font-bold text-rose-300 transition hover:bg-rose-500/10"><Trash2 className="w-3 h-3" />Delete</button>}</td></tr>)}</tbody></table></div>
            </div>
          )}
        </div>
      )}

      {/* =============================================================
          MODAL DRAWER: ADMISSIONS DETAILS FOR ADMIN REVIEW
          ============================================================= */}
      {openAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest font-mono">Bootcamp Course Candidate Details</span>
                <h3 className="text-base font-extrabold text-white mt-0.5 animate-pulse">
                  {candidateProfiles.find(p => p.userId === applications.find(a => a.id === openAppId)?.candidateId)?.fullName}
                </h3>
              </div>
              <button
                onClick={() => setOpenAppId(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {/* Course details */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <h4 className="font-extrabold text-white text-xs border-b border-slate-850 pb-1 font-mono">Program Course</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-450 text-slate-400">
                  <div>Course Applied: <span className="text-white font-bold">{jobs.find(j => j.id === applications.find(a => a.id === openAppId)?.jobId)?.title}</span></div>
                  <div>Application Date: <span className="text-white font-bold">{new Date(applications.find(a => a.id === openAppId)?.appliedAt || '').toLocaleDateString()}</span></div>
                </div>
              </div>

              {/* Resume raw content */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <h4 className="font-extrabold text-white text-xs border-b border-slate-855 pb-1">Resume Text</h4>
                <p className="text-slate-400 font-mono text-[10px] leading-relaxed">
                  {cvs.find(c => c.candidateId === applications.find(a => a.id === openAppId)?.candidateId)?.rawText || "No resume text content indexed."}
                </p>
              </div>

              {/* Portfolios links */}
              <div className="p-4 bg-slate-950 border border-slate-855 rounded-xl space-y-2">
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
              <div className="p-4 bg-slate-955 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <h4 className="font-extrabold text-white text-xs border-b border-slate-850 pb-1">Assessment Score</h4>
                <div>
                  Score Rank: <span className="font-extrabold text-cyan-400">{candidateProfiles.find(p => p.userId === applications.find(a => a.id === openAppId)?.candidateId)?.admissionScore || "Pending"}%</span>
                </div>
              </div>

              {/* Notes */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <h4 className="font-extrabold text-white text-xs border-b border-slate-850 pb-1">Interview & Evaluation Notes</h4>
                <textarea
                  value={interviewNotesText}
                  onChange={(e) => setInterviewNotesText(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {/* Fit */}
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
              <button
                onClick={() => {
                  setSelectedAppForOffer(applications.find(a => a.id === openAppId) || null);
                  setOpenAppId(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-black text-white shadow transition cursor-pointer"
              >
                Approve Course Admissions
              </button>
              <button
                onClick={() => {
                  setSelectedAppForInterview(applications.find(a => a.id === openAppId) || null);
                  setOpenAppId(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300 transition cursor-pointer"
              >
                Schedule Interview
              </button>
              <button
                onClick={() => {
                  handleRequestMoreInfo(openAppId || '');
                  setOpenAppId(null);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-xs transition cursor-pointer"
              >
                Need Info
              </button>
              <button
                onClick={() => {
                  handleRejectApplication(openAppId || '');
                  setOpenAppId(null);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-red-950/40 rounded-lg text-xs font-bold text-red-400 border border-slate-800 hover:border-red-950 transition cursor-pointer"
              >
                Reject File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admissions Offer Release Modal */}
      {selectedAppForOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/80 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-1">
                <Award className="w-4.5 h-4.5 text-cyan-400" />
                <span>Approve Bootcamp Admission</span>
              </h3>
              <button onClick={() => setSelectedAppForOffer(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReleaseOfferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-450 mb-1">Confirmation Allowances</label>
                <input
                  type="text"
                  value={offerSalary}
                  onChange={(e) => setOfferSalary(e.target.value)}
                  className="w-full bg-slate-955 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-450 mb-1">Cohort Start Date</label>
                <input
                  type="date"
                  value={offerJoiningDate}
                  onChange={(e) => setOfferJoiningDate(e.target.value)}
                  className="w-full bg-slate-955 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-450 mb-1">Admissions Notes</label>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-955 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isReleasingOffer}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-black tracking-wider transition uppercase cursor-pointer"
              >
                {isReleasingOffer ? 'Approving and sending files...' : 'Confirm Admission Offer'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {selectedAppForInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/80 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-1">
                <Calendar className="w-4.5 h-4.5 text-cyan-400" />
                <span>Schedule Admissions Interview</span>
              </h3>
              <button onClick={() => setSelectedAppForInterview(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-450 mb-1">Pick Meeting slot</label>
                <input
                  type="datetime-local"
                  value={interviewTimeSlot}
                  onChange={(e) => setInterviewTimeSlot(e.target.value)}
                  className="w-full bg-slate-955 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black tracking-wider transition uppercase cursor-pointer"
              >
                Schedule Interview Slot
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
