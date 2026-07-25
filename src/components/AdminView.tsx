import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
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
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { currentUser, users, invites, jobs, applications, candidateProfiles, createInvite } = usePortal();

  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [inviteRole, setInviteRole] = useState<'admin' | 'recruiter'>('recruiter');
  const [inviteEmail, setInviteEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const inv = createInvite(inviteRole, inviteEmail);
    const link = `${window.location.origin}/invite?token=${inv.token}&role=${inv.role}`;
    setGeneratedLink(link);
    setInviteEmail('');
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
              isSuperAdmin ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            }`}>
              {isSuperAdmin ? 'SUPER ADMIN (FOUNDER / DEV)' : 'ADMIN (HR DIRECTOR)'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Platform Control & Team Onboarding</h2>
          <p className="text-xs text-slate-400">
            {isSuperAdmin
              ? 'Full platform authority: Create Admins & Recruiters, manage jobs, view all CVs, monitor system logs, and configure billing.'
              : 'System Admin authority: Onboard Recruiters, oversee hiring pipelines, and audit candidate interviews.'}
          </p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 block font-medium">Platform Users</span>
          <span className="text-2xl font-black text-white mt-1 block">{users.length}</span>
          <span className="text-[10px] text-indigo-400 mt-1 block font-medium">Admins, Recruiters, Candidates</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 block font-medium">Candidate Profiles</span>
          <span className="text-2xl font-black text-white mt-1 block">{candidateProfiles.length}</span>
          <span className="text-[10px] text-emerald-400 mt-1 block font-medium">Indexed for Search</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 block font-medium">Active Applications</span>
          <span className="text-2xl font-black text-white mt-1 block">{applications.length}</span>
          <span className="text-[10px] text-purple-400 mt-1 block font-medium">Post-Shortlist Pipeline</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 block font-medium">Posted Jobs</span>
          <span className="text-2xl font-black text-white mt-1 block">{jobs.length}</span>
          <span className="text-[10px] text-amber-400 mt-1 block font-medium">Multi-domain Tech Jobs</span>
        </div>
      </div>

      {/* Section: Generate Invite Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2">
            <Link className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Generate Role Invite Link</h3>
          </div>
          <p className="text-xs text-slate-400">
            Generate signed, expiring invite links for new team members. Invitees auto-receive privileged role upon signup.
          </p>

          <form onSubmit={handleGenerateInvite} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role To Assign</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'admin' | 'recruiter')}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="recruiter">Recruiter (Company-Level)</option>
                {isSuperAdmin && <option value="admin">Admin (System-Level)</option>}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Invitee Email</label>
              <input
                type="email"
                required
                placeholder="e.g. recruiter.lead@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
            >
              Generate Expiring Invite Link
            </button>
          </form>

          {generatedLink && (
            <div className="p-3 bg-slate-800/80 rounded-xl border border-indigo-500/30 space-y-2">
              <span className="text-[11px] font-bold text-indigo-300 block">Signed Link Ready:</span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] font-mono text-slate-300"
                />
                <button
                  onClick={() => handleCopyLink(generatedLink)}
                  className="p-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-white text-xs"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Pending Invite Keys log */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-indigo-300">Pending Expiring Invite Links ({invites.filter(i => i.status === 'pending').length})</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {invites.map((inv) => (
                <div key={inv.id} className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-slate-300 font-bold block">{inv.email}</span>
                    <span className="text-[10px] font-mono text-slate-500">{inv.token}</span>
                  </div>
                  <div className="text-right">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                      inv.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {inv.status}
                    </span>
                    <span className="text-[9px] text-slate-500 block mt-0.5 capitalize">{inv.role} role</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Existing Users Provider Audit Trail */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Identity Audit Trail ({users.length})</h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left border-collapse text-[11px] text-slate-300">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-200">
                  <th className="p-2 font-bold">User / Email</th>
                  <th className="p-2 font-bold">Role</th>
                  <th className="p-2 font-bold">Source</th>
                  <th className="p-2 font-bold">Creator/Invited By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-2 font-medium">
                      <div className="font-bold text-white line-clamp-1">{u.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{u.email}</div>
                    </td>
                    <td className="p-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        u.role === 'super_admin' ? 'text-purple-300 bg-purple-500/20' :
                        u.role === 'admin' ? 'text-blue-300 bg-blue-500/20' :
                        u.role === 'recruiter' ? 'text-emerald-300 bg-emerald-500/20' :
                        'text-amber-300 bg-amber-500/20'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className="capitalize">{u.provider}</span>
                      {u.providerId && <span className="text-[9px] text-slate-500 block font-mono">ID: {u.providerId.slice(0, 8)}</span>}
                    </td>
                    <td className="p-2 text-slate-400">
                      {u.createdBy ? (
                        <span>Admin ({u.createdBy.slice(4, 9)})</span>
                      ) : (
                        <span className="text-[10px] text-slate-600">Self registered / System</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Super Admin Exclusive: Platform Config & Billing */}
      {isSuperAdmin && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Platform Configuration & Billing</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                  Super Admin Exclusive
                </span>
              </h3>
              <p className="text-xs text-slate-400">Manage platform database configurations, indexing metrics, and enterprise subscription tier.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-slate-400 block font-medium">Search Database Indexer</span>
              <span className="font-mono text-indigo-300 font-bold text-sm block">Hybrid Vector & Keyword</span>
              <span className="text-[11px] text-emerald-400">Main Database Cluster Connected</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-slate-400 block font-medium">Monthly Search Queries Used</span>
              <span className="font-mono text-purple-300 font-bold text-sm block">128,450 / 1,000,000 reqs</span>
              <span className="text-[11px] text-slate-400">Includes CV Parsers & Keyword Search</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-slate-400 block font-medium">Subscription Tier</span>
              <span className="font-bold text-emerald-400 text-sm block">Enterprise Pro (₹40,000 / mo)</span>
              <span className="text-[11px] text-slate-400">Unlimited Recruiter Accounts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
