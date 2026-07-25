import React, { useState } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Header } from './components/Header';
import { RoleMatrixModal } from './components/RoleMatrixModal';
import { CandidateView } from './components/CandidateView';
import { RecruiterView } from './components/RecruiterView';
import { AdminView } from './components/AdminView';
import { AuthView } from './components/AuthView';
import { Shield, Sparkles, User, Briefcase, Cpu } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser } = usePortal();
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  if (!currentUser) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <Header onOpenMatrix={() => setIsMatrixOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Role View Header Indicator */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              {currentUser.role === 'candidate' ? (
                <User className="w-5 h-5" />
              ) : currentUser.role === 'recruiter' ? (
                <Briefcase className="w-5 h-5" />
              ) : (
                <Shield className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Active View Mode:
                </span>
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser.role === 'candidate'
                  ? 'Candidate Portal: Manage structured profile, CV versions, explore jobs, launch AI interviews & e-sign offer letters.'
                  : currentUser.role === 'recruiter'
                  ? 'Recruiter Dashboard: AI natural language candidate search, screening auto-scheduler, AI interview evaluator & offer release.'
                  : 'System Authority Panel: Team account onboarding, permission controls, AI API logs & platform config.'}
              </p>
            </div>
          </div>
        </div>

        {/* View Component Switcher */}
        {currentUser.role === 'candidate' ? (
          <CandidateView />
        ) : currentUser.role === 'recruiter' ? (
          <RecruiterView />
        ) : (
          <AdminView />
        )}
      </main>

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
