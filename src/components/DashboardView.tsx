import React from 'react';
import { 
  TrendingUp, 
  Users, 
  FileCheck, 
  Calendar, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  DollarSign, 
  ShieldCheck,
  ChevronRight,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Lead, Invoice, ClientProfile, TaskPost, TeamRole, ActiveView } from '../types';

interface DashboardViewProps {
  currentRole: TeamRole;
  leads: Lead[];
  invoices: Invoice[];
  clients: ClientProfile[];
  posts: TaskPost[];
  setActiveView: (view: ActiveView) => void;
  onOpenCreatePost: () => void;
  onSelectPost: (post: TaskPost) => void;
  onOpenNewLeadModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentRole,
  leads,
  invoices,
  clients,
  posts,
  setActiveView,
  onOpenCreatePost,
  onSelectPost,
  onOpenNewLeadModal,
}) => {
  // Compute Key Metrics
  const totalRetainersPHP = clients.reduce((acc, c) => acc + c.monthlyRetainerPHP, 0);
  const totalPipelinePHP = leads
    .filter(l => l.stage !== 'closed_won')
    .reduce((acc, l) => acc + l.dealValuePHP, 0);
  const pendingClientApproval = posts.filter(p => p.status === 'pending_client_approval');
  const changesRequested = posts.filter(p => p.status === 'changes_requested');
  const pendingQA = posts.filter(p => p.status === 'internal_qa');
  const pendingCopy = posts.filter(p => p.status === 'copywriting');
  const pendingDesign = posts.filter(p => p.status === 'designing');
  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  const unpaidInvoices = invoices.filter(i => i.status === 'unpaid');

  // Role-specific urgency items
  const getRoleUrgency = () => {
    switch (currentRole) {
      case 'copywriter':
        return {
          title: 'Copywriting Queue (Mikaela Sison)',
          description: 'Draft hooks, captions & local Taglish hashtags for upcoming campaigns.',
          items: pendingCopy,
          actionText: 'Open in Production Workspace',
          targetView: 'production_workspace' as ActiveView,
        };
      case 'designer':
        return {
          title: 'Creative & Visual Queue (Angelo Dizon)',
          description: 'Carousel graphics, story layouts & TikTok vertical videos awaiting artwork.',
          items: pendingDesign,
          actionText: 'Upload Visuals in Workspace',
          targetView: 'production_workspace' as ActiveView,
        };
      case 'qa_specialist':
        return {
          title: 'Brand QA & Verification Queue (Patricia Lim)',
          description: 'Perform grammar, brand alignment & DTI compliance checks before client review.',
          items: pendingQA,
          actionText: 'Review QA Queue',
          targetView: 'production_workspace' as ActiveView,
        };
      case 'client_stakeholder':
        return {
          title: 'Awaiting Your Approval (Client Portal)',
          description: 'Review finalized social posts and give the go-signal before actual publishing.',
          items: [...pendingClientApproval, ...changesRequested],
          actionText: 'Open Client Approval Portal',
          targetView: 'client_portal' as ActiveView,
        };
      default:
        return {
          title: 'Client Review & Approval Watch',
          description: 'Content waiting for client sign-off before scheduled distribution.',
          items: pendingClientApproval,
          actionText: 'View Approval Workflow',
          targetView: 'client_portal' as ActiveView,
        };
    }
  };

  const urgency = getRoleUrgency();

  return (
    <div className="max-w-[1700px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      
      {/* Top Banner: Philippine Agency Command Center */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Manila Operation Center • Active
              </span>
              <span className="text-xs text-slate-400">PHT Timezone (GMT+8)</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-['Outfit']">
              CrossFlow Agency Command Center
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Unified agency management combining GoHighLevel-style lead pipelines, automated client invoicing & onboarding, multi-role social media production, and dedicated client approval portals.
            </p>
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="dashboard-quick-new-post"
              onClick={onOpenCreatePost}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Compose Campaign Post</span>
            </button>
            <button
              id="dashboard-quick-new-lead"
              onClick={onOpenNewLeadModal}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Inbound Lead</span>
            </button>
            <button
              id="dashboard-quick-view-portal"
              onClick={() => setActiveView('client_portal')}
              className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Client Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Retainers (PHP) */}
        <div className="bg-[#111827]/80 border border-slate-800 rounded-xl p-4 relative hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Monthly Active Retainers</span>
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              ₱
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-['Outfit']">
            ₱{totalRetainersPHP.toLocaleString()}
            <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{clients.length} Active Philippine Brand Accounts</span>
          </div>
        </div>

        {/* Lead Pipeline Value (GHL Style) */}
        <div 
          onClick={() => setActiveView('pipeline')}
          className="bg-[#111827]/80 border border-slate-800 rounded-xl p-4 relative hover:border-indigo-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Pipeline In-Flight (GHL CRM)</span>
            <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:scale-105 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-['Outfit']">
            ₱{totalPipelinePHP.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
            <span>{leads.length} active leads across FB, TikTok, Google Ads</span>
          </div>
        </div>

        {/* Client Approvals Pending */}
        <div 
          onClick={() => setActiveView('client_portal')}
          className="bg-[#111827]/80 border border-slate-800 rounded-xl p-4 relative hover:border-rose-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Client Approval Queue</span>
            <span className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg group-hover:scale-105 transition-transform">
              <FileCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-['Outfit'] flex items-baseline gap-2">
            <span>{pendingClientApproval.length} Posts</span>
            {changesRequested.length > 0 && (
              <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {changesRequested.length} Revisions
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-rose-400 mt-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Awaiting client review before actual posting</span>
          </div>
        </div>

        {/* Scheduled for Publishing */}
        <div 
          onClick={() => setActiveView('social_planner')}
          className="bg-[#111827]/80 border border-slate-800 rounded-xl p-4 relative hover:border-blue-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Scheduled & Grid Queue</span>
            <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-['Outfit']">
            {scheduledPosts.length} Queued
          </div>
          <div className="flex items-center gap-1 text-[11px] text-blue-400 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Time-locked to Manila peak hours (PHT)</span>
          </div>
        </div>

      </div>

      {/* Dynamic Role Action Focus & Production Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Urgency Queue for Current Role */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#111827]/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                <h2 className="font-semibold text-white text-sm font-['Outfit']">{urgency.title}</h2>
              </div>
              <button 
                onClick={() => setActiveView(urgency.targetView)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>{urgency.actionText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 mb-4">{urgency.description}</p>

            {/* Task Items */}
            {urgency.items.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500/40" />
                All caught up for this role! No blocking tasks in the queue.
              </div>
            ) : (
              <div className="space-y-2.5">
                {urgency.items.map((post) => {
                  const client = clients.find(c => c.id === post.clientId);
                  return (
                    <div 
                      key={post.id}
                      onClick={() => onSelectPost(post)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <img 
                          src={post.mediaUrls[0] || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100'} 
                          alt={post.title} 
                          className="w-12 h-12 rounded-lg object-cover border border-slate-800 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-indigo-400">
                              {client?.companyName || 'Manila Client'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              • {post.platforms.map(p => p.toUpperCase()).join(', ')}
                            </span>
                          </div>
                          <h4 className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                            {post.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {post.caption}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                          {post.scheduledDate} @ {post.scheduledTime} PHT
                        </span>
                        <span className="text-xs text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Agency Social Production Lifecycle Overview */}
          <div className="bg-[#111827]/80 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-semibold text-white text-sm font-['Outfit'] mb-3">
              Social Media Project Flow Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
              
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Idea</span>
                <span className="text-lg font-bold text-slate-200 mt-1 block">
                  {posts.filter(p => p.status === 'draft_idea').length}
                </span>
                <span className="text-[9px] text-slate-400">Account Mgr</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-medium text-amber-400 uppercase tracking-wider block">Copy</span>
                <span className="text-lg font-bold text-amber-300 mt-1 block">
                  {pendingCopy.length}
                </span>
                <span className="text-[9px] text-slate-400">Copywriter</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider block">Design</span>
                <span className="text-lg font-bold text-emerald-300 mt-1 block">
                  {pendingDesign.length}
                </span>
                <span className="text-[9px] text-slate-400">Designer</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-medium text-purple-400 uppercase tracking-wider block">QA</span>
                <span className="text-lg font-bold text-purple-300 mt-1 block">
                  {pendingQA.length}
                </span>
                <span className="text-[9px] text-slate-400">Brand QA</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-medium text-rose-400 uppercase tracking-wider block">Client</span>
                <span className="text-lg font-bold text-rose-300 mt-1 block">
                  {pendingClientApproval.length}
                </span>
                <span className="text-[9px] text-slate-400">Approval</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-medium text-blue-400 uppercase tracking-wider block">Queued</span>
                <span className="text-lg font-bold text-blue-300 mt-1 block">
                  {scheduledPosts.length}
                </span>
                <span className="text-[9px] text-slate-400">Auto-Sched</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-medium text-teal-400 uppercase tracking-wider block">Live</span>
                <span className="text-lg font-bold text-teal-300 mt-1 block">
                  {posts.filter(p => p.status === 'published').length}
                </span>
                <span className="text-[9px] text-slate-400">Published</span>
              </div>

            </div>
          </div>
        </div>

        {/* Right 1 Col: Inbound Leads & Invoice Alert */}
        <div className="space-y-4">
          
          {/* GoHighLevel Lead Pipeline Snippet */}
          <div className="bg-[#111827]/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-white text-sm font-['Outfit']">
                Recent Inbound Leads
              </h3>
              <button 
                onClick={() => setActiveView('pipeline')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                View Pipeline →
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {leads.slice(0, 4).map((lead) => (
                <div key={lead.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{lead.company}</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      ₱{lead.dealValuePHP.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Source: <strong className="text-slate-300">{lead.source}</strong></span>
                    <span className="capitalize px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {lead.stage.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Invoices & Onboarding Alert */}
          <div className="bg-[#111827]/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-white text-sm font-['Outfit'] flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Client Invoicing & Onboarding
              </h3>
              <button 
                onClick={() => setActiveView('invoices_onboarding')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                Manage →
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              CrossFlow requires invoice payment before provisioning brand assets and onboarding client portals.
            </p>

            <div className="mt-3 space-y-2">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-200">{inv.companyName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">₱{inv.totalAmountPHP.toLocaleString()} • {inv.invoiceNumber}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    inv.status === 'paid' 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {inv.status === 'paid' ? 'Paid & Onboarded' : 'Unpaid (Awaiting GCash/Bank)'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
