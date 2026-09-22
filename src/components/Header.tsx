import React from 'react';
import { 
  Layers, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  UserCheck, 
  Bell, 
  ChevronDown,
  Sparkles,
  Briefcase
} from 'lucide-react';
import { TeamRole, ClientProfile, ActiveView } from '../types';

interface HeaderProps {
  currentRole: TeamRole;
  setCurrentRole: (role: TeamRole) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  clients: ClientProfile[];
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  pendingClientApprovalCount: number;
  unreadNotesCount: number;
  onOpenCreatePost: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  activeView,
  setActiveView,
  clients,
  selectedClientId,
  setSelectedClientId,
  pendingClientApprovalCount,
  onOpenCreatePost,
}) => {
  // Format current Philippine Standard Time (PHT is UTC+8)
  const [phtTime, setPhtTime] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      const formatted = new Intl.DateTimeFormat('en-PH', options).format(now);
      setPhtTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roleLabels: Record<TeamRole, { title: string; subtitle: string; color: string }> = {
    agency_admin: { title: 'Agency Admin', subtitle: 'Executive & Strategy', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    account_manager: { title: 'Account Manager', subtitle: 'Client Success & CRM', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
    copywriter: { title: 'Copywriter', subtitle: 'Mikaela Sison (Content)', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    designer: { title: 'Visual Designer', subtitle: 'Angelo Dizon (Creative)', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    qa_specialist: { title: 'Brand QA Specialist', subtitle: 'Patricia Lim (Reviewer)', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    client_stakeholder: { title: 'Client Stakeholder', subtitle: 'Client Approval Mode', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  };

  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-3">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 max-w-[1700px] mx-auto">
        
        {/* Left: Brand & Agency Identity */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveView('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-['Outfit']">CrossFlow</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Enterprise</span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide font-medium">Agency Management & Social OS</p>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs text-slate-300 font-medium">CrossCode PH Agency • BGC Manila HQ</span>
          </div>
        </div>

        {/* Center: Philippine Timezone Widget & View Switcher */}
        <div className="flex items-center gap-3">
          {/* PHT Time Clock */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono font-medium text-slate-200">{phtTime || '10:00:00 AM'}</span>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">PHT • GMT+8</span>
          </div>

          {/* Quick Perspective Toggle */}
          <div className="flex bg-slate-900/90 p-1 rounded-lg border border-slate-800">
            <button
              id="header-btn-agency-view"
              onClick={() => {
                if (activeView === 'client_portal') {
                  setActiveView('dashboard');
                  if (currentRole === 'client_stakeholder') setCurrentRole('agency_admin');
                }
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeView !== 'client_portal'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Agency Workspace
            </button>

            <button
              id="header-btn-client-portal"
              onClick={() => {
                setActiveView('client_portal');
                setCurrentRole('client_stakeholder');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 relative ${
                activeView === 'client_portal'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Client Portal
              {pendingClientApprovalCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                  {pendingClientApprovalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Right: Role Simulation Switcher & Action */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Active Client Context (if in portal or managing client) */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-slate-400">Client:</span>
            <select
              id="header-select-client"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-slate-100">
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher Pill */}
          <div className="relative group">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${roleLabels[currentRole].color}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <div className="text-left">
                <span className="font-semibold block leading-tight">{roleLabels[currentRole].title}</span>
                <span className="text-[10px] opacity-75 hidden lg:inline">{roleLabels[currentRole].subtitle}</span>
              </div>
              <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
            </div>

            {/* Dropdown Menu for Roles */}
            <div className="absolute right-0 mt-1 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                Switch Active Role Perspective
              </div>
              {(Object.keys(roleLabels) as TeamRole[]).map((role) => (
                <button
                  key={role}
                  id={`role-select-${role}`}
                  onClick={() => {
                    setCurrentRole(role);
                    if (role === 'client_stakeholder') {
                      setActiveView('client_portal');
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    currentRole === role ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-medium text-slate-200">{roleLabels[role].title}</div>
                    <div className="text-[10px] text-slate-400">{roleLabels[role].subtitle}</div>
                  </div>
                  {currentRole === role && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>}
                </button>
              ))}
            </div>
          </div>

          {/* New Post Button */}
          {activeView !== 'client_portal' && (
            <button
              id="header-btn-create-post"
              onClick={onOpenCreatePost}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Compose Post</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
