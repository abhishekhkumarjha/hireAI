import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { UserRole } from '../types/portal';
import {
  Sparkles,
  Shield,
  UserCheck,
  Briefcase,
  User as UserIcon,
  ChevronDown,
  Layers,
  Link,
  PlusCircle,
  Copy,
  CheckCircle2,
  X,
} from 'lucide-react';

interface HeaderProps {
  onOpenMatrix: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMatrix }) => {
  const { currentUser, users, setCurrentUser, logoutUser, createInvite } = usePortal();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteRole, setInviteRole] = useState<'admin' | 'recruiter'>('recruiter');
  const [inviteEmail, setInviteEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'recruiter':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'candidate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin (Founder)';
      case 'admin':
        return 'Admin (HR Director)';
      case 'recruiter':
        return 'Recruiter';
      case 'candidate':
        return 'Candidate';
    }
  };

  const handleGenerateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const inv = createInvite(inviteRole, inviteEmail);
    const link = `${window.location.origin}/invite?token=${inv.token}&role=${inv.role}`;
    setGeneratedLink(link);
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight">HirePortal</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Recruitment Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Talent Acquisition & Hiring System</p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Permission Matrix Button */}
          {(currentUser?.role === 'super_admin' || currentUser?.role === 'admin') && (
            <button
              onClick={onOpenMatrix}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="View Permission Matrix"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Permissions Matrix</span>
            </button>
          )}

          {/* Invite Generator (Super Admin / Admin only) */}
          {(currentUser?.role === 'super_admin' || currentUser?.role === 'admin') && (
            <button
              onClick={() => {
                setShowInviteModal(true);
                setGeneratedLink(null);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition"
            >
              <Link className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Invite Team</span>
            </button>
          )}

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 transition"
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/40"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-black text-indigo-300 ring-2 ring-indigo-500/40">
                  {currentUser?.name?.slice(0, 2).toUpperCase() || 'US'}
                </div>
              )}
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-slate-200 line-clamp-1">{currentUser?.name}</div>
                <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                  <span>Role:</span>
                  <span className={`font-semibold capitalize text-indigo-300`}>
                    {currentUser?.role?.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-2xl border border-slate-700/80 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="pb-3 border-b border-slate-700/60 mb-2">
                  <p className="text-xs font-bold text-slate-200">{currentUser?.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser?.email}</p>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    setShowRoleDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/20 font-bold transition"
                >
                  Log Out Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Link className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-white">Generate Role Invite Link</h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 my-3">
              Super Admin and Admins can generate signed, expiring invite links for Recruiter or Admin onboarding.
            </p>

            <form onSubmit={handleGenerateInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Role To Assign</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'recruiter')}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="recruiter">Recruiter (Company Level)</option>
                  {currentUser?.role === 'super_admin' && <option value="admin">Admin (System Level)</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Invitee Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. new.recruiter@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg text-xs shadow-md transition"
              >
                Generate Signed Link
              </button>
            </form>

            {generatedLink && (
              <div className="mt-4 p-3 bg-slate-800/80 rounded-xl border border-indigo-500/30">
                <p className="text-[11px] font-semibold text-indigo-300 mb-1">Signed Invite Link Created:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] font-mono text-slate-300 select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-white text-xs transition flex items-center space-x-1"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
