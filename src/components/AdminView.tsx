import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { UserRole } from '../types/portal';
import {
  Users,
  Shield,
  Link,
  PlusCircle,
  Copy,
  CheckCircle2,
  Activity,
  Award,
  Settings,
  X,
  XCircle,
  Clock,
  Filter,
  SlidersHorizontal,
  FileText,
  Check,
  Search,
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
    permissionMatrix,
    auditLogs
  } = usePortal();

  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'audit_logs' | 'permissions'>('users');

  // Invite states
  const [inviteRole, setInviteRole] = useState<'admin' | 'recruiter'>('recruiter');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

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
    if (!confirm(`Are you sure you want to delete ${name}'s account? All profile details will be permanently removed.`)) return;
    if (!deleteUser(userId)) {
      alert('Failed to delete user account. Super Admin accounts are protected.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Admin control panel Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
              isSuperAdmin ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            }`}>
              {isSuperAdmin ? 'SUPER ADMIN MODE' : 'ADMIN CONTROL PANEL'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-2">CloudInnTech Platform Administration</h2>
          <p className="text-xs text-slate-400">
            Audit system logs, manage team onboarding tokens, configure roles access matrix, and verify system metrics.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { key: 'users' as const, label: 'Manage Users' },
            { key: 'analytics' as const, label: 'Analytics' },
            { key: 'audit_logs' as const, label: 'Audit Logs' },
            { key: 'permissions' as const, label: 'Permissions Matrix' }
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === t.key ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. MANAGE USERS */}
      {activeTab === 'users' && (
        <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in">
          
          {/* Invite team member */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 h-fit">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <PlusCircle className="w-4.5 h-4.5 text-indigo-400" />
              <span>Invite Recruiter / Admin</span>
            </h3>
            <p className="text-xs text-slate-400">Generate onboarding tokens to securely onboard administrators or recruiters.</p>

            <form onSubmit={handleGenerateInvite} className="space-y-3.5 text-xs">
              <label className="block space-y-1">
                <span className="text-slate-400">Role Privilege</span>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none">
                  <option value="recruiter">Recruiter</option>
                  {isSuperAdmin && <option value="admin">System Admin</option>}
                </select>
              </label>

              <label className="block space-y-1">
                <span className="text-slate-400">Email Address</span>
                <input required type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none" placeholder="name@company.com" />
              </label>

              <label className="block space-y-1">
                <span className="text-slate-450">Full Name</span>
                <input type="text" value={inviteName} onChange={e => setInviteName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none" placeholder="John Doe" />
              </label>

              <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-extrabold shadow transition">
                Create Onboarding Invitation
              </button>
            </form>

            {generatedLink && (
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Expiring Token Link:</span>
                <div className="flex gap-2">
                  <input readOnly type="text" value={generatedLink} className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-350 select-all font-mono" />
                  <button onClick={() => handleCopyLink(generatedLink)} className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold">
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User management list */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Onboarded User Accounts</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                    <th className="pb-2">User Name</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Created Date</th>
                    <th className="pb-2 text-right">Delete Account</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-850/30">
                      <td className="py-3">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{u.email}</div>
                      </td>
                      <td className="py-3 capitalize">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'super_admin' ? 'bg-purple-500/10 text-purple-300'
                          : u.role === 'admin' ? 'bg-blue-500/10 text-blue-300'
                          : u.role === 'recruiter' ? 'bg-emerald-500/10 text-emerald-300'
                          : 'bg-amber-500/10 text-amber-300'
                        }`}>{u.role.replace('_', ' ')}</span>
                      </td>
                      <td className="py-3 font-mono">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 text-right">
                        {u.role !== 'super_admin' && (
                          <button
                            onClick={() => handleDeleteAccount(u.id, u.name)}
                            className="px-2.5 py-1.5 rounded-lg border border-rose-500/20 bg-rose-950/10 text-rose-400 font-bold hover:bg-rose-950/30 transition text-[10px]"
                          >
                            Terminate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Global Platform Analytics</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total corporate jobs', val: jobs.length },
              { label: 'Total sourced candidates', val: candidateProfiles.length },
              { label: 'Active applications', val: applications.length },
              { label: 'Total active invites', val: invites.filter(i => i.status === 'pending').length }
            ].map((stat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">{stat.label}</span>
                <span className="text-xl font-black text-white mt-1 block">{stat.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. AUDIT LOGS */}
      {activeTab === 'audit_logs' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
            <Activity className="w-4.5 h-4.5 text-indigo-400" />
            <span>Audit Trail Activity logs</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px] font-bold">
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Actor</th>
                  <th className="pb-2">Action Cap</th>
                  <th className="pb-2 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 font-mono text-[10px]">No audit trail entries resolved yet.</td>
                  </tr>
                ) : (
                  auditLogs.map(l => (
                    <tr key={l.id} className="hover:bg-slate-850/30">
                      <td className="py-2.5 font-mono text-slate-500">{new Date(l.createdAt).toLocaleTimeString()}</td>
                      <td className="py-2.5 font-bold text-white">{l.actorName} ({l.actorRole.replace('_', ' ')})</td>
                      <td className="py-2.5 text-indigo-300 font-medium">{l.action}</td>
                      <td className="py-2.5 text-right text-slate-450">{l.details || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. PERMISSIONS MATRIX */}
      {activeTab === 'permissions' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
            <Shield className="w-4.5 h-4.5 text-indigo-400" />
            <span>System Access Controls Matrix</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">Action Capability</th>
                  <th className="p-3 text-center">Super Admin</th>
                  <th className="p-3 text-center">Admin</th>
                  <th className="p-3 text-center">Recruiter</th>
                  <th className="p-3 text-center">Candidate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {permissionMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/30">
                    <td className="p-3 font-semibold text-slate-200">{item.action}</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">{item.admin ? '✓' : '✗'}</td>
                    <td className="p-3 text-center text-slate-400">{item.recruiter ? `✓ (${item.recruiter})` : '✗'}</td>
                    <td className="p-3 text-center text-slate-400">{item.candidate ? `✓ (${item.candidate})` : '✗'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
