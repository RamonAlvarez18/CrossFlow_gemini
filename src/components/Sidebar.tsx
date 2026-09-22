import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  PenSquare, 
  Inbox, 
  TrendingUp, 
  Users, 
  Zap, 
  BarChart3, 
  CreditCard, 
  Settings, 
  ChevronDown, 
  Check, 
  ShieldCheck,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { ActiveView, TeamRole, ClientProfile } from '../types';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  currentRole: TeamRole;
  setCurrentRole: (role: TeamRole) => void;
  clients: ClientProfile[];
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  pendingClientApprovalCount: number;
  unreadMessagesCount?: number;
  onOpenComposer: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  currentRole,
  setCurrentRole,
  clients,
  selectedClientId,
  setSelectedClientId,
  pendingClientApprovalCount,
  unreadMessagesCount = 14,
  onOpenComposer,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const workspaces = [
    { id: 'w-1', name: 'Manila Growth Co.', type: 'Agency workspace', clientCount: clients.length },
    { id: 'w-2', name: 'Cebu Creator Hub', type: 'Secondary branch', clientCount: 4 },
    { id: 'w-3', name: 'BGC Brand Studios', type: 'Enterprise division', clientCount: 8 },
  ];
  const [currentWorkspace, setCurrentWorkspace] = useState(workspaces[0]);

  const roleProfiles: Record<TeamRole, { name: string; title: string; initials: string; plan: string }> = {
    agency_admin: { name: 'Jam Cruz', title: 'Agency Director', initials: 'JC', plan: 'Agency plan · ₱4,999/mo' },
    account_manager: { name: 'Althea Cruz', title: 'Account Manager', initials: 'AC', plan: 'Team Member · Unlimited' },
    social_media_manager: { name: 'Joshua Bernardo', title: 'Social Media Mgr', initials: 'JB', plan: 'Team Member · Unlimited' },
    copywriter: { name: 'Mikaela Sison', title: 'Lead Copywriter', initials: 'MS', plan: 'Creative Seat' },
    designer: { name: 'Angelo Dizon', title: 'Visual Designer', initials: 'AD', plan: 'Creative Seat' },
    qa_specialist: { name: 'Patricia Lim', title: 'Brand QA Specialist', initials: 'PL', plan: 'Compliance Seat' },
    client_stakeholder: { name: 'Client Stakeholder', title: 'Client Sign-Off Mode', initials: 'CS', plan: 'Client Guest Portal' },
  };

  const currentProfile = roleProfiles[currentRole] || roleProfiles.agency_admin;

  const navGroups = [
    {
      label: null,
      items: [
        {
          id: 'dashboard' as ActiveView,
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: null,
          action: () => setActiveView('dashboard'),
        },
        {
          id: 'social_planner' as ActiveView,
          label: 'Content Calendar',
          icon: CalendarDays,
          badge: null,
          action: () => setActiveView('social_planner'),
        },
        {
          id: 'composer' as ActiveView,
          label: 'Composer',
          icon: PenSquare,
          badge: null,
          action: () => onOpenComposer(),
        },
        {
          id: 'unified_inbox' as ActiveView,
          label: 'Unified Inbox',
          icon: Inbox,
          badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : null,
          badgeColor: 'bg-[#F97316] text-white',
          action: () => setActiveView('unified_inbox'),
        },
      ],
    },
    {
      label: 'AGENCY FLOW',
      items: [
        {
          id: 'pipeline' as ActiveView,
          label: 'Client Pipeline',
          icon: TrendingUp,
          badge: null,
          action: () => setActiveView('pipeline'),
        },
        {
          id: 'clients' as ActiveView,
          label: 'Clients',
          icon: Users,
          badge: pendingClientApprovalCount > 0 ? `${pendingClientApprovalCount} sign-offs` : null,
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
          action: () => setActiveView('clients'),
        },
        {
          id: 'production_workspace' as ActiveView,
          label: 'Automation',
          icon: Zap,
          badge: null,
          action: () => setActiveView('production_workspace'),
        },
      ],
    },
    {
      label: 'INSIGHTS',
      items: [
        {
          id: 'analytics' as ActiveView,
          label: 'Analytics',
          icon: BarChart3,
          badge: null,
          action: () => setActiveView('analytics'),
        },
        {
          id: 'invoices_onboarding' as ActiveView,
          label: 'Billing & Plan',
          icon: CreditCard,
          badge: null,
          action: () => setActiveView('invoices_onboarding'),
        },
      ],
    },
    {
      label: 'WORKSPACE',
      items: [
        {
          id: 'settings' as ActiveView,
          label: 'Settings',
          icon: Settings,
          badge: null,
          action: () => setActiveView('settings'),
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#080D1A] border-r border-[#152033] flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="p-4 pb-2 border-b border-[#152033]/60">
          <div className="flex items-center gap-2.5">
            {/* Cyan Wave Logo */}
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0">
              <svg 
                className="w-5 h-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M2 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
                <path d="M2 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
              </svg>
            </div>
            <div className="leading-tight overflow-hidden">
              <h1 className="font-bold text-base text-white tracking-tight flex items-center gap-1.5 font-['Outfit']">
                CrossFlow
              </h1>
              <p className="text-[10px] text-slate-400 truncate">
                by CrossCode Technologies · PH
              </p>
            </div>
          </div>

          {/* Workspace Switcher */}
          <div className="relative mt-3">
            <button
              id="sidebar-workspace-switcher"
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              className="w-full bg-[#0E1626] hover:bg-[#131E33] border border-[#1C283F] rounded-xl p-2.5 flex items-center justify-between text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-amber-500 flex-shrink-0 shadow-sm flex items-center justify-center text-slate-950 font-bold text-xs">
                  M
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate group-hover:text-teal-300 transition-colors">
                    {currentWorkspace.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {currentWorkspace.type}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
            </button>

            {/* Dropdown for Workspaces */}
            {showWorkspaceMenu && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                  Switch Workspace
                </div>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setCurrentWorkspace(ws);
                      setShowWorkspaceMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                      currentWorkspace.id === ws.id 
                        ? 'bg-teal-500/15 text-teal-300 font-medium' 
                        : 'text-slate-300 hover:bg-[#1E293B]/60'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{ws.name}</div>
                      <div className="text-[10px] text-slate-400">{ws.type}</div>
                    </div>
                    {currentWorkspace.id === ws.id && <Check className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 no-scrollbar">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {group.label && (
                <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">
                  {group.label}
                </div>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => {
                      item.action();
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-teal-950/70 text-teal-300 border border-teal-500/40 shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#111A2C] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Profile Bar */}
        <div className="p-3 border-t border-[#152033]/80 bg-[#070B16] relative">
          <button
            id="sidebar-profile-button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#10192A] transition-colors cursor-pointer group text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Orange Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#C2410C] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow">
                {currentProfile.initials}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate group-hover:text-teal-300 transition-colors">
                  {currentProfile.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {currentProfile.plan}
                </div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
          </button>

          {/* Role Perspective Selector Popover */}
          {showRoleMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-[#1E293B] flex items-center justify-between">
                <span>Switch Role Perspective</span>
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <div className="space-y-0.5 mt-1 max-h-60 overflow-y-auto no-scrollbar">
                {(Object.keys(roleProfiles) as TeamRole[]).map((r) => {
                  const prof = roleProfiles[r];
                  const isCurrent = currentRole === r;
                  return (
                    <button
                      key={r}
                      id={`sidebar-role-switch-${r}`}
                      onClick={() => {
                        setCurrentRole(r);
                        if (r === 'client_stakeholder') {
                          setActiveView('client_portal');
                        }
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                        isCurrent
                          ? 'bg-teal-500/15 text-teal-300 font-semibold'
                          : 'text-slate-300 hover:bg-[#1E293B]/70'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isCurrent ? 'bg-teal-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {prof.initials}
                        </div>
                        <div>
                          <div className="text-white text-xs">{prof.name}</div>
                          <div className="text-[10px] text-slate-400">{prof.title}</div>
                        </div>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
