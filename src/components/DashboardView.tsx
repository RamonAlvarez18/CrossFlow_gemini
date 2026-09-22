import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Mail, 
  CreditCard, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Sparkles, 
  ChevronRight,
  Send,
  MessageCircle,
  ThumbsUp,
  Share2
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
  onApprovePost?: (postId: string) => void;
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
  onApprovePost,
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [selectedPostPreview, setSelectedPostPreview] = useState<TaskPost | null>(null);

  // 14-day engagement simulated data (Sep 9 - Sep 22)
  const engagement14Days = [
    { day: 'Sep 9', label: 'Mon', value: 38, reach: '42.1K', interactions: 3820 },
    { day: 'Sep 10', label: 'Tue', value: 44, reach: '48.5K', interactions: 4410 },
    { day: 'Sep 11', label: 'Wed', value: 52, reach: '56.2K', interactions: 5290 },
    { day: 'Sep 12', label: 'Thu', value: 49, reach: '51.8K', interactions: 4940 },
    { day: 'Sep 13', label: 'Fri', value: 65, reach: '72.4K', interactions: 6510 },
    { day: 'Sep 14', label: 'Sat', value: 78, reach: '88.9K', interactions: 7820 },
    { day: 'Sep 15', label: 'Sun', value: 96, reach: '112.4K', interactions: 9640, isPayday: true }, // Payday spike!
    { day: 'Sep 16', label: 'Mon', value: 72, reach: '81.2K', interactions: 7230 },
    { day: 'Sep 17', label: 'Tue', value: 58, reach: '64.0K', interactions: 5850 },
    { day: 'Sep 18', label: 'Wed', value: 63, reach: '69.3K', interactions: 6310 },
    { day: 'Sep 19', label: 'Thu', value: 70, reach: '78.1K', interactions: 7020 },
    { day: 'Sep 20', label: 'Fri', value: 84, reach: '94.6K', interactions: 8430 },
    { day: 'Sep 21', label: 'Sat', value: 89, reach: '101.2K', interactions: 8910 },
    { day: 'Sep 22', label: 'Today', value: 92, reach: '108.7K', interactions: 9230 },
  ];

  // Connected Platforms data exactly from screenshot
  const platforms = [
    {
      id: 'fb',
      name: 'Facebook Page',
      handle: 'Manila Growth Co.',
      metric: '458K',
      metricSub: 'followers',
      iconBg: 'bg-[#1877F2]',
      icon: (
        <span className="font-bold text-white text-xs font-sans">f</span>
      ),
    },
    {
      id: 'messenger',
      name: 'Messenger',
      handle: 'Broadcast list · 12.3K',
      metric: '92%',
      metricSub: 'open rate',
      iconBg: 'bg-[#0084FF]',
      icon: (
        <span className="font-bold text-white text-xs font-sans">M</span>
      ),
    },
    {
      id: 'ig',
      name: 'Instagram',
      handle: '@manilagrowthco',
      metric: '210K',
      metricSub: 'followers',
      iconBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
      icon: (
        <span className="font-bold text-white text-xs">IG</span>
      ),
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: '@manilagrowthco',
      metric: '1.2M',
      metricSub: 'views (7d)',
      iconBg: 'bg-black border border-slate-700',
      icon: (
        <span className="font-bold text-white text-[11px]">Tt</span>
      ),
    },
    {
      id: 'viber',
      name: 'Viber Community',
      handle: 'Growth Circle PH',
      metric: '5,880',
      metricSub: 'members',
      iconBg: 'bg-[#7360F2]',
      icon: (
        <span className="font-bold text-white text-xs">V</span>
      ),
    },
  ];

  interface ApprovalRow {
    id: string;
    title: string;
    client: string;
    channel: string;
    scheduled: string;
    status: string;
    caption: string;
    previewImg: string;
    rawPost?: TaskPost;
  }

  // Upcoming approvals list matching screenshot & current app posts
  const defaultApprovals: ApprovalRow[] = [
    {
      id: 'appr-1',
      title: '"Sale ngayong payday weekend! 🛍️"',
      client: 'Sari-Sari Express',
      channel: 'Facebook + Messenger',
      scheduled: 'Sep 23, 7:00 PM',
      status: 'needs_approval',
      caption: 'Sulit shopping spree! Up to 50% OFF sa lahat ng Philippine essentials ngayong payday weekend. Free shipping via J&T & Lalamove pag naka-₱999 cart checkout! 📦✨ #PaydaySalePH #SariSariExpress',
      previewImg: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'appr-2',
      title: 'Reels: behind-the-scenes ng kitchen',
      client: "Lola Nena's Kitchen",
      channel: 'Instagram + TikTok',
      scheduled: 'Sep 23, 8:30 PM',
      status: 'approved',
      caption: 'Freshly baked cheese toasted buns galing sa aming oven diretso sa inyong hapag-kainan! 🧀 Ano ang paborito mong meryenda kasama ang mainit na kapeng barako? Comment below! #LolaNenas #FilipinoFoodie #MeriendaPH',
      previewImg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'appr-3',
      title: 'Job hiring post — Cebu branch',
      client: 'BlueWave Logistics',
      channel: 'Facebook',
      scheduled: 'Sep 24, 9:00 AM',
      status: 'needs_approval',
      caption: 'We are hiring! Delivery drivers, warehouse associates, at customer support specialist para sa aming bagong Mandaue Cebu hub. Competitive salary with SSS, PhilHealth, Pag-IBIG and 14th month pay! Apply na! #CebuJobs #BlueWaveLogistics',
      previewImg: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
    },
  ];

  // Merge with real posts that need client approval or are scheduled
  const activeApprovalPosts: ApprovalRow[] = posts
    .filter(p => p.status === 'pending_client_approval' || p.status === 'client_approved' || p.status === 'scheduled')
    .slice(0, 3)
    .map(p => {
      const client = clients.find(c => c.id === p.clientId);
      return {
        id: p.id,
        title: p.title,
        client: client ? client.companyName : 'Agency Client',
        channel: p.platforms.map(pl => pl.charAt(0).toUpperCase() + pl.slice(1)).join(' + '),
        scheduled: `${p.scheduledDate} ${p.scheduledTime}`,
        status: p.status === 'pending_client_approval' ? 'needs_approval' : 'approved',
        caption: p.caption,
        previewImg: p.mediaUrls[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        rawPost: p,
      };
    });

  const displayApprovals: ApprovalRow[] = activeApprovalPosts.length >= 3 ? activeApprovalPosts : defaultApprovals;

  return (
    <div className="space-y-6 pb-12">
      {/* 4 Metric Cards Row (Top) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total reach */}
        <div className="bg-[#0E1626] border border-[#1C283F] rounded-2xl p-4 transition-all hover:border-[#28395A] shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-3">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-400 font-medium">Total reach (7 days)</div>
          <div className="text-2xl lg:text-3xl font-bold text-white font-['Outfit'] mt-1 tracking-tight">
            812.4K
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-2 flex items-center gap-1">
            <span>▲</span>
            <span>18.2% vs last week</span>
          </div>
        </div>

        {/* Card 2: New followers */}
        <div className="bg-[#0E1626] border border-[#1C283F] rounded-2xl p-4 transition-all hover:border-[#28395A] shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-3">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-400 font-medium">New followers</div>
          <div className="text-2xl lg:text-3xl font-bold text-white font-['Outfit'] mt-1 tracking-tight">
            3,940
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-2 flex items-center gap-1">
            <span>▲</span>
            <span>9.1% vs last week</span>
          </div>
        </div>

        {/* Card 3: Unread messages */}
        <div 
          onClick={() => setActiveView('unified_inbox')}
          className="bg-[#0E1626] border border-[#1C283F] rounded-2xl p-4 transition-all hover:border-[#28395A] shadow-sm cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-3">
            <Mail className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-400 font-medium group-hover:text-sky-300 transition-colors">
            Unread messages
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-white font-['Outfit'] mt-1 tracking-tight">
            14
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-2 flex items-center gap-1">
            <span>▲</span>
            <span>6 min avg reply, 45% faster</span>
          </div>
        </div>

        {/* Card 4: MRR */}
        <div 
          onClick={() => setActiveView('invoices_onboarding')}
          className="bg-[#0E1626] border border-[#1C283F] rounded-2xl p-4 transition-all hover:border-[#28395A] shadow-sm cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-400 font-medium group-hover:text-purple-300 transition-colors">
            MRR (this workspace)
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-white font-['Outfit'] mt-1 tracking-tight">
            ₱248,000
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-2 flex items-center gap-1">
            <span>▲</span>
            <span>3 new clients closed</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Engagement Chart (60%) + Platforms connected (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Engagement Chart */}
        <div className="lg:col-span-7 bg-[#0E1626] border border-[#1C283F] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white font-['Outfit']">
                Engagement — last 14 days
              </h2>
              <button
                onClick={() => setActiveView('analytics')}
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Full analytics</span>
                <span>→</span>
              </button>
            </div>

            {/* Interactive Bar Chart */}
            <div className="pt-4 pb-2">
              <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-2 px-1 border-b border-slate-800/80">
                {engagement14Days.map((item, idx) => {
                  const isHovered = hoveredDay === idx;
                  const isCurrent = idx === engagement14Days.length - 1;

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredDay(idx)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className="flex-1 flex flex-col items-center gap-1 group cursor-pointer relative h-full justify-end"
                    >
                      {/* Tooltip */}
                      {isHovered && (
                        <div className="absolute bottom-full mb-2 bg-[#080D1A] border border-teal-500/40 text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-xl whitespace-nowrap z-20 pointer-events-none">
                          <div className="font-bold text-teal-300">{item.day} {item.isPayday ? '• Payday Spike 💰' : ''}</div>
                          <div className="text-slate-300">{item.reach} reach</div>
                          <div className="text-slate-400 text-[10px]">{item.interactions.toLocaleString()} interactions</div>
                        </div>
                      )}

                      {/* Bar */}
                      <div 
                        className={`w-full rounded-t-md transition-all duration-200 ${
                          item.isPayday 
                            ? 'bg-gradient-to-t from-teal-500 to-emerald-400 shadow-lg shadow-teal-500/30' 
                            : isCurrent
                            ? 'bg-teal-400 shadow-md shadow-teal-500/20'
                            : isHovered
                            ? 'bg-teal-300'
                            : 'bg-teal-500/40 group-hover:bg-teal-500/60'
                        }`}
                        style={{ height: `${item.value}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Day Labels */}
              <div className="flex justify-between text-[10px] text-slate-400 pt-2 px-1 font-mono">
                <span>Sep 9</span>
                <span>Sep 12</span>
                <span className="text-emerald-400 font-bold">Sep 15 (Sweldo)</span>
                <span>Sep 18</span>
                <span className="text-teal-400 font-semibold">Today</span>
              </div>
            </div>
          </div>

          {/* Quick Insights pill bar */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Peak engagement: <strong>Sep 15 Payday Campaign (96.4K)</strong>
            </span>
            <span className="text-[11px] text-teal-400 font-medium">
              4.8% Average Engagement Rate
            </span>
          </div>
        </div>

        {/* Platforms connected */}
        <div className="lg:col-span-5 bg-[#0E1626] border border-[#1C283F] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white font-['Outfit']">
              Platforms connected
            </h2>
            <span className="text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              5 Active Syncs
            </span>
          </div>

          <div className="space-y-3">
            {platforms.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#090F1C] border border-[#182337] hover:border-[#22334F] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${p.iconBg} flex items-center justify-center flex-shrink-0 shadow`}>
                    {p.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {p.handle}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-white font-mono">
                    {p.metric}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {p.metricSub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Upcoming approvals */}
      <div className="bg-[#0E1626] border border-[#1C283F] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
          <h2 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <span>Upcoming approvals</span>
          </h2>
          <button
            onClick={() => setActiveView('social_planner')}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Open calendar</span>
            <span>→</span>
          </button>
        </div>

        {/* Approvals Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800/60">
                <th className="pb-3 px-3">POST</th>
                <th className="pb-3 px-3">CLIENT</th>
                <th className="pb-3 px-3">CHANNEL</th>
                <th className="pb-3 px-3">SCHEDULED</th>
                <th className="pb-3 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {displayApprovals.map((row) => {
                const isNeedsApproval = row.status === 'needs_approval';

                return (
                  <tr 
                    key={row.id}
                    onClick={() => {
                      if (row.rawPost) {
                        onSelectPost(row.rawPost);
                      } else {
                        setSelectedPostPreview(row as any);
                      }
                    }}
                    className="hover:bg-[#111C31] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-3 font-medium text-white group-hover:text-teal-300 transition-colors">
                      {row.title}
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      {row.client}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400">
                      {row.channel}
                    </td>
                    <td className="py-3.5 px-3 text-slate-300 font-mono text-[11px]">
                      {row.scheduled}
                    </td>
                    <td className="py-3.5 px-3">
                      {isNeedsApproval ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#37230F] text-[#FB923C] border border-[#EA580C]/30 shadow-sm">
                          Needs approval
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#0B2A22] text-[#34D399] border border-[#059669]/30 shadow-sm">
                          Approved
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Post Preview Modal (When clicking a dashboard approval) */}
      {selectedPostPreview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1626] border border-[#1C283F] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                  Post Approval Preview
                </span>
                <h3 className="text-base font-bold text-white font-['Outfit'] mt-0.5">
                  {selectedPostPreview.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedPostPreview(null)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Client: <strong>{(selectedPostPreview as any).client}</strong></span>
                <span>Channel: <strong>{(selectedPostPreview as any).channel}</strong></span>
              </div>

              {(selectedPostPreview as any).previewImg && (
                <div className="rounded-xl overflow-hidden border border-slate-800 h-48 bg-slate-900">
                  <img 
                    src={(selectedPostPreview as any).previewImg} 
                    alt="Creative Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="bg-[#090E1A] p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed font-sans">
                {(selectedPostPreview as any).caption}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    setSelectedPostPreview(null);
                    setActiveView('client_portal');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  Open in Client Portal
                </button>
                <button
                  onClick={() => {
                    setSelectedPostPreview(null);
                    alert('Post approved! Ready for scheduled publishing.');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Post</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
