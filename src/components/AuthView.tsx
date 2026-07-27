import React, { useEffect, useState } from 'react';
import { Briefcase, CheckCircle2, Key, Lock, LogIn, Mail, Shield, User, UserPlus, Info } from 'lucide-react';
import { usePortal } from '../context/PortalContext';

type AuthMode = 'login' | 'candidate_signup' | 'invite';

interface AuthViewProps {
  onBackToLanding?: () => void;
  onAuthenticated?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onBackToLanding, onAuthenticated }) => {
  const { users, invites, loginUser, signupCandidate, signupViaInvite } = usePortal();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [provider, setProvider] = useState<'google' | 'github' | 'facebook' | 'email'>('email');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const inputClass = 'w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500';

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(window.location.search).get('token');
    if (!tokenFromUrl) return;

    setToken(tokenFromUrl);
    setMode('invite');
    const invite = invites.find((item) => item.token === tokenFromUrl);
    if (invite) {
      setEmail(invite.email);
      setName(invite.invitedByName || '');
      setSuccessMsg(`Invite verified for ${invite.role}. Complete your account activation.`);
    } else {
      setErrorMsg('This invite token is invalid, expired, or has already been used.');
    }
  }, [invites]);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg(null);
    if (!loginUser(email, password)) {
      setErrorMsg('Invalid email or password. Please try again.');
      return;
    }
    onAuthenticated?.();
  };

  const handleCandidateSignup = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg(null);
    if (!name || !email || !password) {
      setErrorMsg('Please complete every field.');
      return;
    }
    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      setErrorMsg('This email is already registered. Please sign in instead.');
      return;
    }
    signupCandidate(name, email, password, provider);
    onAuthenticated?.();
  };

  const handleInviteSignup = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg(null);
    if (!name || !token || !password) {
      setErrorMsg('Please complete every required field.');
      return;
    }
    const user = signupViaInvite(name, email, password, token, provider);
    if (!user) {
      setErrorMsg('This invite token is invalid, expired, or has already been used.');
      return;
    }
    window.history.replaceState({}, document.title, window.location.pathname);
    onAuthenticated?.();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 font-sans text-slate-100">
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />

      {onBackToLanding && (
        <button onClick={onBackToLanding} className="absolute left-6 top-6 text-xs font-semibold text-slate-400 transition hover:text-white">
          Back to landing
        </button>
      )}

      <div className="z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-lg shadow-indigo-500/25">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">HirePortal</h1>
          <p className="mt-1 text-sm text-slate-400">Talent acquisition and hiring portal</p>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-800/80 bg-slate-900 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs">
            <button onClick={() => switchMode('login')} className={`flex-1 rounded-lg py-2 font-semibold transition ${mode === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Sign In</button>
            <button onClick={() => switchMode('candidate_signup')} className={`flex-1 rounded-lg py-2 font-semibold transition ${mode === 'candidate_signup' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Candidate Sign Up</button>
            <button onClick={() => switchMode('invite')} className={`flex-1 rounded-lg py-2 font-semibold transition ${mode === 'invite' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Recruiter / Admin</button>
          </div>

          {errorMsg && <div className="flex gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300"><Info className="h-4 w-4 shrink-0" />{errorMsg}</div>}
          {successMsg && <div className="flex gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300"><CheckCircle2 className="h-4 w-4 shrink-0" />{successMsg}</div>}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-center text-xs text-slate-400">Use your account credentials. Your portal opens automatically based on your access role.</p>
              <label className="block text-xs font-semibold text-slate-300"><span className="mb-1.5 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />Email address</span><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} /></label>
              <label className="block text-xs font-semibold text-slate-300"><span className="mb-1.5 flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" />Password</span><input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} /></label>
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"><LogIn className="h-4 w-4" />Sign In</button>
            </form>
          )}

          {mode === 'candidate_signup' && (
            <form onSubmit={handleCandidateSignup} className="space-y-4">
              <p className="text-xs text-slate-400">Create a candidate account to apply for jobs and manage your profile.</p>
              <label className="block text-xs font-semibold text-slate-300"><span className="mb-1.5 flex items-center gap-1.5"><User className="h-3.5 w-3.5" />Full name</span><input required value={name} onChange={(event) => setName(event.target.value)} className={inputClass} /></label>
              <label className="block text-xs font-semibold text-slate-300"><span className="mb-1.5 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />Email address</span><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} /></label>
              <label className="block text-xs font-semibold text-slate-300"><span className="mb-1.5 flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" />Password</span><input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} /></label>
              <select value={provider} onChange={(event) => setProvider(event.target.value as typeof provider)} className={inputClass}><option value="email">Email</option><option value="google">Google</option><option value="github">GitHub</option><option value="facebook">Facebook</option></select>
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"><UserPlus className="h-4 w-4" />Create Candidate Account</button>
            </form>
          )}

          {mode === 'invite' && (
            <form onSubmit={handleInviteSignup} className="space-y-4">
              <div className="flex gap-2 rounded-xl border border-indigo-500/20 bg-indigo-950/40 p-3 text-xs text-indigo-300"><Shield className="h-4 w-4 shrink-0" />Recruiter and Admin accounts are activated with an invite token issued by a Super Admin.</div>
              <label className="block text-xs font-semibold text-slate-300"><span className="mb-1.5 flex items-center gap-1.5"><Key className="h-3.5 w-3.5" />Invite token</span><input required value={token} onChange={(event) => { let value = event.target.value.trim(); if (value.includes('token=')) { const tokenMatch = value.match(/token=([^&]+)/); if (tokenMatch) value = tokenMatch[1]; } setToken(value); const invite = invites.find((item) => item.token === value); setEmail(invite?.email ?? ''); setName(invite?.invitedByName ?? ''); }} className={`${inputClass} font-mono`} /></label>
              <label className="block text-xs font-semibold text-slate-300"><span className="mb-1.5 flex items-center gap-1.5"><User className="h-3.5 w-3.5" />Full name</span><input required value={name} onChange={(event) => setName(event.target.value)} className={inputClass} /></label>
              <label className="block text-xs font-semibold text-slate-300"><span className="mb-1.5 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />Verified email</span><input readOnly value={email} className={`${inputClass} cursor-not-allowed text-slate-400`} /></label>
              <label className="block text-xs font-semibold text-slate-300"><span className="mb-1.5 flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" />Password</span><input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} /></label>
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"><CheckCircle2 className="h-4 w-4" />Activate Account</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
