import React, { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Clock, 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  Users, 
  Check, 
  BellRing,
  Sparkles
} from 'lucide-react';
import { TeamRole } from '../types';

interface SettingsViewProps {
  currentRole: TeamRole;
  setCurrentRole: (role: TeamRole) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentRole,
  setCurrentRole,
}) => {
  const [savedSuccess, setSavedSuccess] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div className="bg-[#0E1626] border border-[#1C283F] rounded-2xl p-5">
        <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <Settings className="w-5 h-5 text-teal-400" />
          <span>Workspace & Agency Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure agency branding, PHT timezone synchronization, team permissions, and payment gateway options.
        </p>
      </div>

      {/* Agency Identity & Location */}
      <div className="bg-[#0E1626] border border-[#1C283F] rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-2">
          <Building2 className="w-4 h-4 text-teal-400" />
          <span>Agency Details</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Agency Name</label>
            <input 
              type="text" 
              defaultValue="Manila Growth Co. (CrossCode PH)" 
              className="w-full bg-[#090F1C] border border-[#1C283F] rounded-xl px-3.5 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">HQ Address</label>
            <input 
              type="text" 
              defaultValue="Bonifacio Global City (BGC), Taguig, Metro Manila" 
              className="w-full bg-[#090F1C] border border-[#1C283F] rounded-xl px-3.5 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Operating Timezone</label>
            <div className="flex items-center gap-2 bg-[#090F1C] border border-[#1C283F] rounded-xl px-3.5 py-2 text-emerald-400 font-mono font-medium">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Asia/Manila (PHT - UTC+8) • Enforced</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Base Currency</label>
            <div className="flex items-center gap-2 bg-[#090F1C] border border-[#1C283F] rounded-xl px-3.5 py-2 text-emerald-400 font-medium">
              <span className="font-bold">₱</span>
              <span>PHP (Philippine Peso) • GCash, Maya, QR Ph</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role & Permissions Configuration */}
      <div className="bg-[#0E1626] border border-[#1C283F] rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Production Team Roster & Roles</span>
        </h3>

        <div className="space-y-2 text-xs">
          {[
            { name: 'Jam Cruz', role: 'Agency Admin (Executive Director)', email: 'jam@manilagrowth.ph', badge: 'Admin' },
            { name: 'Althea Cruz', role: 'Account Manager (Client Liaison)', email: 'althea@manilagrowth.ph', badge: 'Client Success' },
            { name: 'Joshua Bernardo', role: 'Social Media Manager (PHT Scheduler)', email: 'joshua@manilagrowth.ph', badge: 'Growth' },
            { name: 'Mikaela Sison', role: 'Lead Copywriter (Taglish Hooks)', email: 'mikaela@manilagrowth.ph', badge: 'Content' },
            { name: 'Angelo Dizon', role: 'Visual Designer (Creative Director)', email: 'angelo@manilagrowth.ph', badge: 'Design' },
            { name: 'Patricia Lim', role: 'Brand QA Specialist (Compliance)', email: 'patricia@manilagrowth.ph', badge: 'QA' },
          ].map((member, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-[#090F1C] border border-[#182337] flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">{member.name}</div>
                <div className="text-[11px] text-slate-400">{member.role} • {member.email}</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                {member.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-2">
        {savedSuccess ? (
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </span>
        ) : <span />}

        <button
          onClick={() => {
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
          }}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-md"
        >
          Save Workspace Preferences
        </button>
      </div>
    </div>
  );
};
