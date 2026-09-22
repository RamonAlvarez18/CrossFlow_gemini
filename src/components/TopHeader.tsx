import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Inbox, 
  Menu, 
  Clock, 
  Globe, 
  Bell, 
  Sparkles,
  ChevronDown,
  UserCheck,
  Briefcase
} from 'lucide-react';
import { TeamRole, ClientProfile, ActiveView } from '../types';

interface TopHeaderProps {
  currentRole: TeamRole;
  setCurrentRole: (role: TeamRole) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  clients: ClientProfile[];
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  pendingClientApprovalCount: number;
  unreadMessagesCount?: number;
  onOpenCreatePost: () => void;
  onOpenMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentRole,
  setCurrentRole,
  activeView,
  setActiveView,
  clients,
  selectedClientId,
  setSelectedClientId,
  pendingClientApprovalCount,
  unreadMessagesCount = 14,
  onOpenCreatePost,
  onOpenMobileMenu,
}) => {
  const [phtTime, setPhtTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      setPhtTime(new Intl.DateTimeFormat('en-PH', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getGreetingName = () => {
    switch (currentRole) {
      case 'agency_admin': return 'Jam';
      case 'account_manager': return 'Althea';
      case 'social_media_manager': return 'Joshua';
      case 'copywriter': return 'Mikaela';
      case 'designer': return 'Angelo';
      case 'qa_specialist': return 'Patricia';
      case 'client_stakeholder': return 'Partner';
      default: return 'Jam';
    }
  };

  return (
    <header className="px-6 pt-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Greeting & Workspace status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-[#0F172A] border border-[#1E293B] text-slate-300 hover:text-white"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-['Outfit']">
            Magandang araw, {getGreetingName()} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Here's how Manila Growth Co.'s clients are doing today, Asia/Manila time.
          </p>
        </div>
      </div>

      {/* Right: Currency, Timezone, Inbox, and + New Post Button */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Currency Pill */}
        <div className="px-3 py-1.5 rounded-xl bg-[#0E1626] border border-[#1C283F] flex items-center gap-1.5 text-xs font-semibold text-emerald-400 shadow-sm">
          <span>₱</span>
          <span>PHP</span>
        </div>

        {/* Timezone Pill */}
        <div 
          className="px-3 py-1.5 rounded-xl bg-[#0E1626] border border-[#1C283F] flex items-center gap-2 text-xs font-medium text-slate-300 shadow-sm"
          title={`Philippine Standard Time (UTC+8): ${phtTime}`}
        >
          <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
            PH
          </span>
          <span className="text-slate-200">Asia/Manila</span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            {phtTime}
          </span>
        </div>

        {/* Inbox Button */}
        <button
          id="header-inbox-button"
          onClick={() => setActiveView('unified_inbox')}
          className="px-3 py-1.5 rounded-xl bg-[#0E1626] hover:bg-[#131E33] border border-[#1C283F] text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer relative"
        >
          <Inbox className="w-3.5 h-3.5 text-slate-400" />
          <span>Inbox</span>
          {unreadMessagesCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
          )}
        </button>

        {/* Client Portal Quick Switcher (For testing sign-off flow) */}
        {activeView === 'client_portal' ? (
          <button
            onClick={() => {
              setActiveView('dashboard');
              if (currentRole === 'client_stakeholder') setCurrentRole('agency_admin');
            }}
            className="px-3 py-1.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-xs font-medium text-teal-300 hover:bg-teal-500/25 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Back to Agency</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setActiveView('client_portal');
              setCurrentRole('client_stakeholder');
            }}
            className="px-3 py-1.5 rounded-xl bg-[#0E1626] hover:bg-[#131E33] border border-[#1C283F] text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer relative"
          >
            <UserCheck className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Client Portal</span>
            {pendingClientApprovalCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {pendingClientApprovalCount}
              </span>
            )}
          </button>
        )}

        {/* + New Post Button (Orange/Coral matching screenshot) */}
        <button
          id="header-new-post-button"
          onClick={onOpenCreatePost}
          className="px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Post</span>
        </button>
      </div>
    </header>
  );
};
