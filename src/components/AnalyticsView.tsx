import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Share2, 
  Heart, 
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const channelBreakdown = [
    { name: 'Facebook Page', reach: '458,200', engagement: '6.4%', growth: '+14.2%', color: 'bg-blue-500' },
    { name: 'Instagram', reach: '210,400', engagement: '8.1%', growth: '+22.5%', color: 'bg-pink-500' },
    { name: 'TikTok', reach: '1,240,000', engagement: '9.8%', growth: '+38.0%', color: 'bg-teal-400' },
    { name: 'Messenger & Broadcast', reach: '12,300', engagement: '92.0%', growth: '+18.4%', color: 'bg-indigo-500' },
    { name: 'Viber Community', reach: '5,880', engagement: '44.5%', growth: '+9.1%', color: 'bg-purple-500' },
  ];

  const topPerformingHooks = [
    {
      hook: 'Bakit nga ba laging sold out ang cheese toasted buns tuwing 3 PM?',
      brand: "Lola Nena's Kitchen",
      views: '482K',
      shares: '12.4K',
      theme: 'Behind-The-Scenes / Foodie',
    },
    {
      hook: 'Payday Budol: 5 kitchen hacks na magpapagaan ng buhay ng bawat Pinoy 🛒',
      brand: 'Sari-Sari Express',
      views: '320K',
      shares: '8.9K',
      theme: 'Payday Special / Lifestyle',
    },
    {
      hook: 'Paano magpadala ng fragile items from Manila to Cebu without damage? 📦',
      brand: 'BlueWave Logistics',
      views: '194K',
      shares: '4.2K',
      theme: 'Educational / B2B',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0E1626] border border-[#1C283F] rounded-2xl p-5">
        <div>
          <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            <span>CrossFlow Performance & ROI Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated cross-platform analytics for Manila Growth Co.'s enterprise clients in Asia/Manila (PHT).
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 font-semibold">
            Last 30 Days (Trailing)
          </span>
        </div>
      </div>

      {/* Top 3 High-Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0E1626] border border-[#1C283F] rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Total Multi-Platform Impressions</div>
          <div className="text-2xl lg:text-3xl font-bold text-white font-['Outfit'] mt-1">2.12M</div>
          <div className="text-xs font-semibold text-emerald-400 mt-2">▲ 24.6% vs previous cycle</div>
        </div>

        <div className="bg-[#0E1626] border border-[#1C283F] rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Average Client Engagement Rate</div>
          <div className="text-2xl lg:text-3xl font-bold text-white font-['Outfit'] mt-1">7.42%</div>
          <div className="text-xs font-semibold text-emerald-400 mt-2">▲ 3.2x industry benchmark</div>
        </div>

        <div className="bg-[#0E1626] border border-[#1C283F] rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Inbound Lead Inquiries (DMs & Forms)</div>
          <div className="text-2xl lg:text-3xl font-bold text-white font-['Outfit'] mt-1">1,490</div>
          <div className="text-xs font-semibold text-emerald-400 mt-2">▲ ₱482K attributed revenue</div>
        </div>
      </div>

      {/* Channel Breakdown */}
      <div className="bg-[#0E1626] border border-[#1C283F] rounded-2xl p-5">
        <h3 className="text-base font-bold text-white font-['Outfit'] mb-4">
          Platform Channel Performance
        </h3>
        <div className="space-y-3">
          {channelBreakdown.map((ch, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#090F1C] border border-[#182337] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${ch.color}`} />
                <span className="font-semibold text-xs text-white">{ch.name}</span>
              </div>
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Reach</span>
                  <span className="font-mono text-white font-bold">{ch.reach}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Engagement</span>
                  <span className="font-mono text-teal-400 font-bold">{ch.engagement}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">MoM Growth</span>
                  <span className="font-mono text-emerald-400 font-bold">{ch.growth}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Hooks & Angles */}
      <div className="bg-[#0E1626] border border-[#1C283F] rounded-2xl p-5">
        <h3 className="text-base font-bold text-white font-['Outfit'] mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Top Taglish Hooks & Campaign Angles</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {topPerformingHooks.map((h, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#090F1C] border border-[#182337] space-y-2">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                {h.brand}
              </span>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                "{h.hook}"
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{h.views} views</span>
                <span className="text-emerald-400 font-bold">{h.shares} shares</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
