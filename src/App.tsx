import React, { useState, useEffect, useRef } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { RoleMatrixModal } from './components/RoleMatrixModal';
import { CandidateView } from './components/CandidateView';
import { RecruiterView } from './components/RecruiterView';
import { AdminView } from './components/AdminView';
import { AuthView } from './components/AuthView';
import {
  Shield,
  User,
  Briefcase,
} from 'lucide-react';

type PortalHost = 'landing' | 'auth' | 'app';
type AuthIntent = 'candidate' | 'recruiter' | 'admin';

const MainLayout: React.FC = () => {
  const { currentUser, candidateProfiles, updateProfile } = usePortal();
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [portalHost, setPortalHost] = useState<PortalHost>(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    if (path === '/portal' || path === '/signin' || params.has('portal')) {
      return 'auth';
    }
    return 'landing';
  });
  const [authIntent, setAuthIntent] = useState<AuthIntent | null>(null);
  const isCandidateStudent = !!(currentUser && (currentUser.role === 'candidate' || candidateProfiles.find(p => p.userId === currentUser.id)?.enrollmentStatus === 'student'));

  // ── Auto-advance from auth gate to app once user logs in/signs up ──
  const prevUserRef = useRef<any>(currentUser);
  useEffect(() => {
    // Auto-advance only when a login event occurred (previously no user)
    if (currentUser && portalHost === 'auth' && prevUserRef.current == null) {
      setPortalHost('app');
    }
    prevUserRef.current = currentUser;
  }, [currentUser, portalHost]);

  // ── Listen to custom cross-portal navigation events ──
  useEffect(() => {
    const handleSwitch = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === 'landing') setPortalHost('landing');
      else if (detail === 'auth') setPortalHost('auth');
      else setPortalHost('app');
    };
    window.addEventListener('cloudinntech-switch-portal', handleSwitch);
    return () => window.removeEventListener('cloudinntech-switch-portal', handleSwitch);
  }, []);

  const handleBackToHome = () => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    if (path === '/portal' || path === '/signin' || params.has('portal')) {
      window.location.href = '/';
    } else {
      setPortalHost('landing');
    }
  };

  // ── Landing Page CTA handler: always goes through auth gate first ──
  const handleEnterPortal = (mode?: 'apply' | 'free' | 'signin', targetId?: string) => {
    if (targetId) localStorage.setItem('cloudinntech_selected_job_id', targetId);

    // Map landing page mode to auth intent
    let intent: AuthIntent | null = null;
    if (mode === 'signin') {
      intent = null;
    } else if (mode === 'free' || mode === 'apply') {
      intent = 'candidate';
    }

    setAuthIntent(intent);

    // Always show the authentication gate first (diagram requires auth before portal access)
    if (currentUser && mode === 'free') {
      const profile = candidateProfiles.find(p => p.userId === currentUser.id);
      if (profile && profile.enrollmentStatus !== 'student') {
        updateProfile({ ...profile, enrollmentStatus: 'free_learner' });
      }
    }
    // Never redirect directly to the portal from a CTA; always present the auth form first
    setPortalHost('auth');
  };

  // Dedicated handler for recruiter/company/admin landing CTAs
  const handleEnterPortalAs = (intent: AuthIntent) => {
    setAuthIntent(intent);
    // Always route through the authentication gateway first
    setPortalHost('auth');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <div className="portal-3d-scene" aria-hidden="true">
        <div className="portal-glass-orb w-72 h-72 -top-24 -right-20 opacity-70" />
        <div className="portal-glass-orb w-52 h-52 bottom-12 -left-20 opacity-50 [animation-delay:-7s]" />
      </div>
      <img src="/cloudinntech-logo.png" alt="" aria-hidden="true" className="portal-watermark" />
      <div className="flex-1 flex flex-col">

        {/* ── SYSTEM 1: LANDING PAGE ── */}
        {portalHost === 'landing' && (
          <LandingPage
            onEnterPortal={handleEnterPortal}
            onEnterPortalAs={handleEnterPortalAs}
            isLoggedIn={!!currentUser}
            currentUser={currentUser}
          />
        )}

        {/* ── AUTHENTICATION GATE (always shown before portal if not logged in) ── */}
        {portalHost === 'auth' && (
          <AuthView
            onBackToLanding={handleBackToHome}
            onAuthenticated={() => setPortalHost('app')}
          />
        )}

        {/* ── SYSTEM 2: UNIFIED ERP PORTAL ── */}
        {portalHost === 'app' && (
          <>
            {!currentUser ? (
              /* Session expired / logged out → back to auth gate */
              <AuthView
                onBackToLanding={handleBackToHome}
                onAuthenticated={() => setPortalHost('app')}
              />
            ) : (
              <div className="flex-1 flex flex-col">
                <Header
                  onOpenMatrix={() => setIsMatrixOpen(true)}
                  onGoHome={handleBackToHome}
                />

                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                  {/* View Badge */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        {isCandidateStudent ? (
                          <User className="w-5 h-5" />
                        ) : currentUser.role === 'recruiter' ? (
                          <Briefcase className="w-5 h-5" />
                        ) : (
                          <Shield className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Active View:</span>
                          <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {currentUser.role.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isCandidateStudent
                            ? 'Candidate & Student Portal — Profile, resume OCR, proctored tests, AI interviews & e-sign offer letters.'
                            : currentUser.role === 'recruiter'
                            ? 'Recruiter Dashboard — AI candidate search, Kanban pipeline, screening scheduler & offer release.'
                            : 'System Authority Panel — Team onboarding, permission matrix, AI API logs & platform config.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Core ERP View Switcher */}
                  {currentUser.role === 'candidate' ? (
                    <CandidateView />
                  ) : currentUser.role === 'recruiter' ? (
                    <RecruiterView />
                  ) : (
                    <AdminView />
                  )}

                </main>
              </div>
            )}
          </>
        )}
      </div>

      <RoleMatrixModal isOpen={isMatrixOpen} onClose={() => setIsMatrixOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <PortalProvider>
      <MainLayout />
    </PortalProvider>
  );
}
