import React from 'react';
import { PERMISSION_MATRIX } from '../data/initialData';
import { Shield, Check, X, Info } from 'lucide-react';

interface RoleMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleMatrixModal: React.FC<RoleMatrixModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">System Architecture & Permission Matrix</h2>
              <p className="text-xs text-slate-400">Role Hierarchy & Access Controls (Super Admin → Admin → Recruiter → Candidate)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hierarchy Overview Box */}
        <div className="mt-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 font-mono text-xs text-slate-300">
          <div className="font-sans font-semibold text-indigo-300 mb-2">1. Role Hierarchy Tree</div>
          <p className="text-slate-400 font-sans mb-3 text-xs">
            Super Admin acts as Founder/Dev and creates unlimited Admins & Recruiters. Recruiters manage candidate pipelines.
          </p>
          <pre className="text-indigo-200 bg-slate-950 p-3 rounded-lg overflow-x-auto text-[11px] leading-relaxed">
{`Super Admin (Founder / Dev)
│
├── Creates unlimited ──> Admins
│                          │
│                          └── Creates ──> Recruiters (Company-level)
│
└── Can also directly create ──> Recruiters
                                  │
                                  └── Manages ──> Candidates (via job postings)`}
          </pre>
        </div>

        {/* Permission Table */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center space-x-2">
            <span>2. Role Permission Matrix</span>
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                  <th className="py-3 px-4 font-semibold">Action / Capability</th>
                  <th className="py-3 px-4 font-semibold text-center text-purple-300">Super Admin</th>
                  <th className="py-3 px-4 font-semibold text-center text-blue-300">Admin</th>
                  <th className="py-3 px-4 font-semibold text-center text-emerald-300">Recruiter</th>
                  <th className="py-3 px-4 font-semibold text-center text-amber-300">Candidate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {PERMISSION_MATRIX.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-4 font-medium text-slate-200">{item.action}</td>
                    
                    {/* Super Admin */}
                    <td className="py-2.5 px-4 text-center">
                      <span className="inline-flex items-center text-emerald-400 font-bold">
                        <Check className="w-4 h-4" />
                      </span>
                    </td>

                    {/* Admin */}
                    <td className="py-2.5 px-4 text-center">
                      {item.admin ? (
                        <span className="inline-flex items-center text-emerald-400 font-bold">
                          <Check className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-rose-500">
                          <X className="w-4 h-4" />
                        </span>
                      )}
                    </td>

                    {/* Recruiter */}
                    <td className="py-2.5 px-4 text-center">
                      {item.recruiter === 'all' ? (
                        <span className="inline-flex items-center text-emerald-400 font-bold">
                          <Check className="w-4 h-4" />
                        </span>
                      ) : item.recruiter === 'own' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-semibold text-[11px]">
                          ✓ (own)
                        </span>
                      ) : item.recruiter === 'per_job' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-semibold text-[11px]">
                          ✓ (per job)
                        </span>
                      ) : item.recruiter === 'template' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-semibold text-[11px]">
                          ✓ (template)
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-rose-500">
                          <X className="w-4 h-4" />
                        </span>
                      )}
                    </td>

                    {/* Candidate */}
                    <td className="py-2.5 px-4 text-center">
                      {item.candidate === 'own' ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold text-[11px]">
                          ✓ (own only)
                        </span>
                      ) : item.candidate === 'receives' ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold text-[11px]">
                          ✓ (receives)
                        </span>
                      ) : item.candidate === 'attends' ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold text-[11px]">
                          ✓ (attends)
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-rose-500">
                          <X className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 flex items-start space-x-2 p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
          <Info className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
          <p>
            You can use the header dropdown to switch between Super Admin, Admin, Recruiter, and Candidate accounts at any time to verify how each role interacts with candidate CVs, AI natural language search, scheduling, interviews, and offer letters.
          </p>
        </div>
      </div>
    </div>
  );
};
