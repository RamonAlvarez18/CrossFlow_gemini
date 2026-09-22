import React from 'react';
import { 
  LayoutDashboard, 
  GitPullRequestDraft, 
  ReceiptText, 
  KanbanSquare, 
  CalendarDays, 
  UserCheck, 
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { ActiveView } from '../types';

interface NavigationProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  pendingClientApprovalCount: number;
  pendingInternalQACount: number;
  unpaidInvoiceCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeView,
  setActiveView,
  pendingClientApprovalCount,
  pendingInternalQACount,
  unpaidInvoiceCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveView,
      label: 'Command Center',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'pipeline' as ActiveView,
      label: 'Lead Pipeline (CRM)',
      icon: TrendingUp,
      badge: 'GHL Flow',
    },
    {
      id: 'invoices_onboarding' as ActiveView,
      label: 'Invoices & Onboarding',
      icon: ReceiptText,
      badge: unpaidInvoiceCount > 0 ? `${unpaidInvoiceCount} Due` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'production_workspace' as ActiveView,
      label: 'Production Workspace',
      icon: KanbanSquare,
      badge: pendingInternalQACount > 0 ? `${pendingInternalQACount} QA` : null,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'social_planner' as ActiveView,
      label: 'Social Publishing & Grid',
      icon: CalendarDays,
      badge: 'Buffer / Gridoro',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'client_portal' as ActiveView,
      label: 'Client Approval Portal',
      icon: UserCheck,
      badge: pendingClientApprovalCount > 0 ? `${pendingClientApprovalCount} Pending` : 'Live',
      badgeColor: pendingClientApprovalCount > 0 ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
  ];

  return (
    <nav className="bg-[#0e1422] border-b border-slate-800/80 px-4 lg:px-6">
      <div className="max-w-[1700px] mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
