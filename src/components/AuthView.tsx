import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { Sparkles, Shield, User, Briefcase, Mail, Lock, LogIn, ArrowRight, UserPlus, Key, Info, CheckCircle2 } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { users, invites, loginUser, signupCandidate, signupViaInvite } = usePortal();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'invite'>('login');
  
  // Input fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState(''); // starts empty for security
  const [token, setToken] = useState('');
  const [provider, setProvider] = useState<'google' | 'github' | 'facebook' | 'email'>('google');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check URL parameters for invites
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      setAuthMode('invite');
      
      // Auto-look up invite email
      const matched = invites.find(inv => inv.token === tokenParam);
      if (matched) {
        setEmail(matched.email);
        setSuccessMsg(`Valid invite token detected for: ${matched.email} (${matched.role})`);
      } else {
        setErrorMsg('Expiring invite token not found or already consumed.');
      }
    }
  }, [invites]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email || !password) return;
    const success = loginUser(email, password);
    if (!success) {
      setErrorMsg('Invalid email address or incorrect password. Please try again.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email || !name || !password) {
      setErrorMsg('All fields including password are required.');
      return;
    }
    
    // Check if email already in use
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setErrorMsg('This email address is already registered. Try logging in.');
      return;
    }

    signupCandidate(name, email, password, provider);
    setSuccessMsg('Successfully signed up as candidate!');
  };

  const handleInviteSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name || !token || !password) {
      setErrorMsg('Please fill in your name and set a secure password.');
      return;
    }

    const user = signupViaInvite(name, email, password, token, provider);
    if (user) {
      setSuccessMsg(`Welcome aboard! Account activated as: ${user.role}`);
      // Clean up URL query param to clean the browser location bar
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setErrorMsg('Invalid or expired invite token. Please contact your Super Admin.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Decorative Blur Background circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-2">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">HirePortal</h2>
        <p className="text-sm text-slate-400">Talent Acquisition & Hiring Portal</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-900 border border-slate-800/80 shadow-2xl rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md">
          {/* View Tab Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => { setAuthMode('login'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 rounded-lg font-semibold transition text-center ${
                authMode === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 rounded-lg font-semibold transition text-center ${
                authMode === 'signup' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Candidate Join
            </button>
            <button
              onClick={() => { setAuthMode('invite'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 rounded-lg font-semibold transition text-center ${
                authMode === 'invite' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Use Invite Link
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-start space-x-2">
              <Info className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex.vance@hireai.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Access Portal Account</span>
              </button>
            </form>
          )}

          {/* 2. CANDIDATE SIGNUP FORM */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Anderson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. liam.a@devmail.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Set Password</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">Select OAuth provider</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="google">Google Login</option>
                    <option value="github">GitHub OAuth</option>
                    <option value="facebook">Facebook Connect</option>
                    <option value="email">Direct Email</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <div className="text-[10px] text-slate-500 leading-tight">
                    Simulates credential tokens for the Admin audit trail.
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register & Open Candidate Profile</span>
              </button>
            </form>
          )}

          {/* 3. INVITE TOKEN FORM */}
          {authMode === 'invite' && (
            <form onSubmit={handleInviteSignup} className="space-y-4">
              <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-[11px] text-indigo-300">
                <p>
                  Privileged roles (Admin, Recruiter) are closed for self-registration. Input a signed token generated by your administrator to sign up.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  <span>Invite Token / Token String</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. inv_token_recruiter_xxxx"
                  value={token}
                  onChange={(e) => {
                    let val = e.target.value.trim();
                    if (val.includes('?')) {
                      try {
                        const urlParams = new URLSearchParams(val.split('?')[1]);
                        const tokenParam = urlParams.get('token');
                        if (tokenParam) {
                          val = tokenParam;
                        }
                      } catch (err) {
                        console.error('Failed to parse token URL', err);
                      }
                    }
                    setToken(val);
                    const matched = invites.find(inv => inv.token === val);
                    if (matched) {
                      setEmail(matched.email);
                      setErrorMsg(null);
                    } else {
                      setEmail('');
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pre-verified Email Address</label>
                <input
                  type="email"
                  readOnly
                  placeholder="Will auto-fill on token match"
                  value={email}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-400 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Set Password</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Verify with provider</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="google">Google Consent</option>
                    <option value="github">GitHub Consent</option>
                    <option value="facebook">Facebook Consent</option>
                    <option value="email">Email Link</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Token & Activate Account</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
