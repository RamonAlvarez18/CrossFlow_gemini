import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Grid3X3, 
  List, 
  Smartphone, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Music, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Layers,
  ThumbsUp,
  RotateCcw,
  Tag,
  Filter,
  Flag,
  PartyPopper,
  Flame,
  CalendarDays,
  Users,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { TaskPost, ClientProfile, SocialPlatform, ContentTheme, PhilippineEvent } from '../types';
import { philippineCalendarEvents, teamMembersList } from '../data/mockData';

interface SocialPlannerViewProps {
  posts: TaskPost[];
  clients: ClientProfile[];
  onOpenCreatePost: () => void;
  onSelectPost: (post: TaskPost) => void;
  onScheduleForEvent?: (event: PhilippineEvent) => void;
}

export const SocialPlannerView: React.FC<SocialPlannerViewProps> = ({
  posts,
  clients,
  onOpenCreatePost,
  onSelectPost,
  onScheduleForEvent,
}) => {
  const [plannerMode, setPlannerMode] = useState<'calendar' | 'grid' | 'ph_events' | 'queue'>('calendar');
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>('facebook');
  const [selectedPostForPreview, setSelectedPostForPreview] = useState<TaskPost>(posts[0] || null);
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('all');
  const [selectedEventModal, setSelectedEventModal] = useState<PhilippineEvent | null>(null);

  // Month navigation (defaulting to September 2026)
  const [currentMonth, setCurrentMonth] = useState(9); // September
  const [currentYear, setCurrentYear] = useState(2026);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filtering posts
  const filteredPosts = posts.filter(p => {
    const matchesClient = selectedClientId === 'all' || p.clientId === selectedClientId;
    const matchesTheme = selectedTheme === 'all' || p.theme === selectedTheme;
    const matchesPlatform = selectedPlatformFilter === 'all' || p.platforms.includes(selectedPlatformFilter as SocialPlatform);
    return matchesClient && matchesTheme && matchesPlatform;
  });

  const activeClient = clients.find(c => c.id === selectedPostForPreview?.clientId) || clients[0];

  // Days in selected month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  const daysCount = getDaysInMonth(currentYear, currentMonth);
  const daysInMonthArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  // Theme badges helper
  const getThemeBadge = (theme: ContentTheme) => {
    switch (theme) {
      case 'lifestyle':
        return { label: 'Lifestyle', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'business':
        return { label: 'Business', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'entertainment':
        return { label: 'Entertainment', color: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30' };
      case 'promotions':
        return { label: 'Promotions', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'educational':
        return { label: 'Educational', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'culture_holiday':
        return { label: 'Culture & Holiday', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      default:
        return { label: theme, color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  // Find Philippine holidays & trending topics for a specific day
  const getPhEventsForDay = (day: number) => {
    return philippineCalendarEvents.filter(e => e.month === currentMonth && e.day === day);
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      
      {/* Top Header & Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#111827]/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Philippine Social Media Publishing OS
            </span>
            <span className="text-xs text-slate-400 font-mono">PHT (Asia/Manila GMT+8)</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-['Outfit'] mt-1">
            Social Media Content Calendar & Philippine Cultural Planner
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Schedule campaigns across Facebook, Instagram, TikTok, LinkedIn, and YouTube. Highlight major Philippine holidays (EDSA, National Heroes' Day, Christmas), cultural festivals (Sinulog, Panagbenga), and local shopping peaks (Sweldo 15th/30th, 9.9 / 10.10 / 11.11 / 12.12 Mega Sales).
          </p>
        </div>

        {/* Action Button: Compose Post */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreatePost}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Compose Social Post</span>
          </button>
        </div>
      </div>

      {/* Control Bar: View Switcher & Multi-dimensional Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111827]/80 border border-slate-800 rounded-2xl p-4">
        
        {/* Left: View Mode Toggles */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setPlannerMode('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              plannerMode === 'calendar' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Month Calendar</span>
          </button>
          
          <button
            onClick={() => setPlannerMode('ph_events')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              plannerMode === 'ph_events' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-amber-400" />
            <span>Philippine Holidays & Trends ({philippineCalendarEvents.length})</span>
          </button>

          <button
            onClick={() => setPlannerMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              plannerMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>3x3 Feed Grid (Gridoro)</span>
          </button>

          <button
            onClick={() => setPlannerMode('queue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              plannerMode === 'queue' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Queue List ({filteredPosts.length})</span>
          </button>
        </div>

        {/* Right: Filters (Client, Theme, Platform) */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
            <span className="text-slate-400 text-[11px]">Brand:</span>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Brands</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.companyName}</option>
              ))}
            </select>
          </div>

          {/* Theme Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 text-[11px]">Theme:</span>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer capitalize"
            >
              <option value="all">All Themes</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="business">Business</option>
              <option value="entertainment">Entertainment</option>
              <option value="promotions">Promotions</option>
              <option value="educational">Educational</option>
              <option value="culture_holiday">Culture & Holidays</option>
            </select>
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
            <span className="text-slate-400 text-[11px]">Platform:</span>
            <select
              value={selectedPlatformFilter}
              onChange={(e) => setSelectedPlatformFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer capitalize"
            >
              <option value="all">All Channels</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Content Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* MODE 1: MONTH CALENDAR VIEW */}
          {plannerMode === 'calendar' && (
            <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              
              {/* Calendar Month Navigation Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setCurrentMonth(prev => prev === 1 ? 12 : prev - 1)}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-sm text-white px-3 font-['Outfit']">
                      {monthNames[currentMonth - 1]} {currentYear}
                    </span>
                    <button
                      onClick={() => setCurrentMonth(prev => prev === 12 ? 1 : prev + 1)}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Asia/Manila (PHT GMT+8)</span>
                </div>

                {/* Calendar Legend */}
                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    <span>PH Holiday</span>
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"></span>
                    <span>Cultural Festival</span>
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Payday / E-Com Trend</span>
                  </span>
                </div>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 py-1.5 border-b border-slate-800/80">
                <span className="text-rose-400">SUN</span>
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span className="text-indigo-400">SAT</span>
              </div>

              {/* 7-column Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {daysInMonthArray.map((day) => {
                  const dateStr = `${currentYear}-${currentMonth < 10 ? '0' + currentMonth : currentMonth}-${day < 10 ? '0' + day : day}`;
                  const dayPosts = filteredPosts.filter(p => p.scheduledDate === dateStr);
                  const dayPhEvents = getPhEventsForDay(day);
                  const isToday = currentMonth === 9 && day === 22;

                  return (
                    <div
                      key={day}
                      className={`min-h-[115px] p-2 rounded-2xl border flex flex-col justify-between transition-all group ${
                        isToday 
                          ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md shadow-indigo-500/10' 
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Day Number and Badges */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                          isToday ? 'bg-indigo-600 text-white' : 'text-slate-300'
                        }`}>
                          {day}
                        </span>

                        {dayPosts.length > 0 && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {dayPosts.length} {dayPosts.length === 1 ? 'post' : 'posts'}
                          </span>
                        )}
                      </div>

                      {/* Philippine Events / Holidays on this day */}
                      {dayPhEvents.length > 0 && (
                        <div className="space-y-1 my-1">
                          {dayPhEvents.map(evt => {
                            const badgeStyle = evt.type === 'regular_holiday' || evt.type === 'special_non_working'
                              ? 'bg-rose-500/20 text-rose-200 border-rose-500/30 hover:bg-rose-500/30'
                              : evt.type === 'cultural_festival'
                                ? 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-500/30 hover:bg-fuchsia-500/30'
                                : 'bg-amber-500/20 text-amber-200 border-amber-500/30 hover:bg-amber-500/30';
                            
                            return (
                              <div
                                key={evt.id}
                                onClick={() => setSelectedEventModal(evt)}
                                className={`p-1 rounded-lg text-[9px] font-bold border truncate cursor-pointer transition-transform hover:scale-[1.02] flex items-center gap-1 ${badgeStyle}`}
                                title={`${evt.name}: ${evt.description}`}
                              >
                                <span>🇵🇭</span>
                                <span className="truncate">{evt.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Scheduled Posts on this day */}
                      <div className="space-y-1 mt-auto">
                        {dayPosts.map((post) => {
                          const themeBadge = getThemeBadge(post.theme);
                          const isSelected = selectedPostForPreview?.id === post.id;

                          return (
                            <div
                              key={post.id}
                              onClick={() => {
                                setSelectedPostForPreview(post);
                                if (post.platforms.length > 0) setPreviewPlatform(post.platforms[0]);
                              }}
                              className={`p-1.5 rounded-xl text-[10px] font-medium cursor-pointer transition-all border ${
                                isSelected 
                                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' 
                                  : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-750'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-mono text-[9px] opacity-80">{post.scheduledTime}</span>
                                <span className={`text-[8px] font-bold uppercase px-1 rounded ${
                                  post.status === 'scheduled' || post.status === 'published'
                                    ? 'bg-emerald-500/30 text-emerald-200'
                                    : post.status === 'pending_client_approval'
                                      ? 'bg-rose-500/30 text-rose-200'
                                      : 'bg-slate-700 text-slate-300'
                                }`}>
                                  {post.status === 'pending_client_approval' ? 'Approval Req' : post.status.replace(/_/g, ' ')}
                                </span>
                              </div>
                              <div className="truncate font-semibold mt-0.5">{post.title}</div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* MODE 2: PHILIPPINE HOLIDAYS & TRENDING MOMENTS EXPLORER */}
          {plannerMode === 'ph_events' && (
            <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-lg text-white font-['Outfit'] flex items-center gap-2">
                    <Flag className="w-5 h-5 text-amber-400" />
                    <span>Philippine Holidays, Cultural Festivals & Mega Sales</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    High-impact local dates curated for Philippine digital agencies, e-commerce, and creator brands.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                  {philippineCalendarEvents.length} Curated PH Events
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {philippineCalendarEvents.map((evt) => {
                  const themeBadge = getThemeBadge(evt.suggestedTheme);

                  return (
                    <div 
                      key={evt.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 space-y-3 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {evt.date} (Month {evt.month})
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            evt.type === 'regular_holiday' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                            evt.type === 'cultural_festival' ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30' :
                            'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}>
                            {evt.type.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-white font-['Outfit'] mt-2">{evt.name}</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{evt.description}</p>
                        
                        {/* Campaign Hook Suggestion */}
                        <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px]">
                          <strong className="text-indigo-300 block mb-0.5">Campaign Hook & Idea:</strong>
                          <span className="text-slate-300">{evt.campaignHook}</span>
                        </div>

                        {/* Suggested Hashtags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {evt.hashtags.map((tag, idx) => (
                            <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          setSelectedEventModal(evt);
                        }}
                        className="w-full py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-3"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Schedule Post for this PH Date</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE 3: 3x3 INSTAGRAM GRID (GRIDORO / LATER) */}
          {plannerMode === 'grid' && (
            <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-white font-['Outfit']">Feed Aesthetic Visualizer (3x3 Grid)</h3>
                  <p className="text-xs text-slate-400">Preview visual harmony of posts scheduled for Philippine peak times before final publishing.</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  Gridoro Mode
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 aspect-square max-w-md mx-auto p-2 bg-black rounded-3xl border border-slate-800 shadow-2xl">
                {filteredPosts.slice(0, 9).map((post) => (
                  <div
                    key={post.id}
                    onClick={() => {
                      setSelectedPostForPreview(post);
                      setPreviewPlatform('instagram');
                    }}
                    className={`relative rounded-2xl overflow-hidden aspect-square border transition-all cursor-pointer group ${
                      selectedPostForPreview?.id === post.id ? 'border-indigo-400 ring-2 ring-indigo-500' : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <img 
                      src={post.mediaUrls[0] || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400'} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white text-[10px]">
                      <span className="font-bold uppercase tracking-wider text-indigo-300">{post.theme}</span>
                      <p className="line-clamp-2 font-medium">{post.title}</p>
                      <div className="flex justify-between items-center text-[9px] font-mono opacity-80">
                        <span>{post.scheduledDate}</span>
                        <span>{post.scheduledTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODE 4: QUEUE LIST VIEW */}
          {plannerMode === 'queue' && (
            <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-base text-white font-['Outfit']">
                  Scheduled Distribution Queue (PHT Timezone)
                </h3>
                <span className="text-xs font-mono text-slate-400">{filteredPosts.length} Tasks Queued</span>
              </div>

              <div className="space-y-2.5">
                {filteredPosts.map((post) => {
                  const themeBadge = getThemeBadge(post.theme);

                  return (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPostForPreview(post)}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all cursor-pointer ${
                        selectedPostForPreview?.id === post.id 
                          ? 'bg-slate-900 border-indigo-500 shadow-md' 
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <img 
                          src={post.mediaUrls[0] || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100'} 
                          alt={post.title}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{post.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${themeBadge.color}`}>
                              {themeBadge.label}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {post.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{post.caption}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-1">
                            <span>Platforms: {post.platforms.join(', ').toUpperCase()}</span>
                            <span>•</span>
                            <span>Copy: {post.assignedCopywriter.split(' ')[0]}</span>
                            <span>•</span>
                            <span>Design: {post.assignedDesigner.split(' ')[0]}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 font-mono">
                        <div className="text-xs text-slate-200 font-bold">{post.scheduledDate}</div>
                        <div className="text-xs text-indigo-400 font-semibold">{post.scheduledTime} PHT</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optimal Posting Windows in the Philippines */}
          <div className="bg-[#111827]/80 border border-slate-800 rounded-3xl p-5 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2 text-xs">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Peak Engagement Windows for Philippine Consumers (PHT • UTC+8)</span>
              </span>
              <span className="text-[11px] text-slate-400">Based on PH Audience Heatmaps</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="text-indigo-400 font-bold font-mono text-sm block">11:30 AM</span>
                <span className="text-[11px] text-slate-200 font-medium">Lunch Break Rush</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">High FB & IG Scrolling</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="text-indigo-400 font-bold font-mono text-sm block">1:30 PM</span>
                <span className="text-[11px] text-slate-200 font-medium">Afternoon Break</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">BPO & Corporate Peak</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="text-indigo-400 font-bold font-mono text-sm block">7:30 PM</span>
                <span className="text-[11px] text-slate-200 font-medium">Commute & Dinner</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">MRT/EDSA Bus Feed Catchup</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="text-indigo-400 font-bold font-mono text-sm block">9:30 PM</span>
                <span className="text-[11px] text-slate-200 font-medium">Bedtime Scroll</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Peak TikTok & Reel Views</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar: Live Simulator & Post Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Post Inspector Details */}
          {selectedPostForPreview && (
            <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Task Post Inspector
                </span>
                <button
                  onClick={() => onSelectPost(selectedPostForPreview)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  Open in Workspace →
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getThemeBadge(selectedPostForPreview.theme).color}`}>
                    {getThemeBadge(selectedPostForPreview.theme).label}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedPostForPreview.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white font-['Outfit'] mt-1.5">
                  {selectedPostForPreview.title}
                </h3>
              </div>

              {/* Client Approval Status Check */}
              <div className={`p-3 rounded-xl border text-xs ${
                selectedPostForPreview.status === 'client_approved' || selectedPostForPreview.status === 'scheduled' || selectedPostForPreview.status === 'published'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : selectedPostForPreview.status === 'pending_client_approval'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {selectedPostForPreview.status === 'client_approved' || selectedPostForPreview.status === 'scheduled' ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span>
                    {selectedPostForPreview.status === 'client_approved' || selectedPostForPreview.status === 'scheduled'
                      ? 'Approved by Client for Posting'
                      : selectedPostForPreview.status === 'pending_client_approval'
                        ? 'Requires Client Sign-off in Portal'
                        : 'In Production Pipeline'}
                  </span>
                </div>
              </div>

              {/* Assigned Team Members */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-[11px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Assigned Team Roles
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-400">Copywriter:</span>
                  <span className="text-slate-200 font-medium">{selectedPostForPreview.assignedCopywriter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Designer:</span>
                  <span className="text-slate-200 font-medium">{selectedPostForPreview.assignedDesigner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">QA Specialist:</span>
                  <span className="text-slate-200 font-medium">{selectedPostForPreview.assignedQA}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Social Media Mgr:</span>
                  <span className="text-slate-200 font-medium">{selectedPostForPreview.assignedSocialMediaManager || 'Joshua Bernardo'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Mgr:</span>
                  <span className="text-slate-200 font-medium">{selectedPostForPreview.assignedAccountManager || 'Althea Cruz'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Live Device Simulator */}
          <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-xs text-white uppercase tracking-wider font-['Outfit']">
                  Live Feed Simulator
                </h3>
              </div>

              {/* Platform Switcher */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {(['facebook', 'instagram', 'tiktok', 'linkedin'] as SocialPlatform[]).map(plat => (
                  <button
                    key={plat}
                    onClick={() => setPreviewPlatform(plat)}
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      previewPlatform === plat 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {plat === 'facebook' ? 'FB' : plat === 'instagram' ? 'IG' : plat === 'tiktok' ? 'TT' : 'LI'}
                  </button>
                ))}
              </div>
            </div>

            {/* MOCKUP CONTAINER */}
            <div className="flex justify-center">
              {previewPlatform === 'facebook' && selectedPostForPreview && (
                <div className="w-full bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-300 text-xs">
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={activeClient.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <div className="font-bold text-xs flex items-center gap-1">
                          <span>{activeClient.companyName}</span>
                          <span className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[7px]">✓</span>
                        </div>
                        <div className="text-[10px] text-slate-500">Scheduled: {selectedPostForPreview.scheduledDate} • 🌐</div>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 pb-2 text-[11px] leading-relaxed text-slate-800 whitespace-pre-line">
                    {selectedPostForPreview.caption}
                    <div className="text-blue-600 font-medium mt-1">{selectedPostForPreview.hashtags.join(' ')}</div>
                  </div>
                  <div className="aspect-video bg-slate-100 overflow-hidden">
                    <img src={selectedPostForPreview.mediaUrls[0]} alt="visual" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-2.5 border-t border-slate-100 flex items-center justify-around text-slate-600 text-[11px]">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> Like</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> Comment</span>
                    <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Share</span>
                  </div>
                </div>
              )}

              {previewPlatform === 'tiktok' && selectedPostForPreview && (
                <div className="w-[260px] h-[480px] bg-black text-white rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 relative flex flex-col justify-between p-3 select-none">
                  <img src={selectedPostForPreview.mediaUrls[0]} alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-85" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none"></div>
                  
                  <div className="relative z-10 flex justify-center gap-3 text-xs font-semibold pt-1">
                    <span className="text-white/60">Following</span>
                    <span className="text-white font-bold border-b-2 border-white pb-0.5">For You</span>
                  </div>

                  <div className="relative z-10 self-end space-y-3 flex flex-col items-center mb-6 mr-1 text-[10px]">
                    <div className="w-8 h-8 rounded-full border border-white overflow-hidden">
                      <img src={activeClient.avatarUrl} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-center"><Heart className="w-5 h-5 text-white" /><span>18.4K</span></div>
                    <div className="text-center"><MessageCircle className="w-5 h-5 text-white" /><span>1.2K</span></div>
                    <div className="text-center"><Bookmark className="w-5 h-5 text-white" /><span>4.8K</span></div>
                    <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center animate-spin">
                      <Music className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="relative z-10 space-y-1 max-w-[190px] text-xs">
                    <div className="font-bold flex items-center gap-1">
                      <span>{activeClient.socialHandles.tiktok || '@brandnameph'}</span>
                      <span className="text-[8px] bg-red-500 px-1 rounded">PH</span>
                    </div>
                    <p className="text-[10px] line-clamp-2 text-white/95">{selectedPostForPreview.caption}</p>
                    <div className="text-[9px] font-bold text-yellow-300">{selectedPostForPreview.hashtags.slice(0, 3).join(' ')}</div>
                  </div>
                </div>
              )}

              {previewPlatform === 'instagram' && selectedPostForPreview && (
                <div className="w-full bg-black text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800 text-xs">
                  <div className="p-2.5 flex items-center justify-between border-b border-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full p-[1px] bg-gradient-to-tr from-amber-500 to-rose-500">
                        <img src={activeClient.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover border border-black" referrerPolicy="no-referrer" />
                      </div>
                      <span className="font-bold text-xs">{activeClient.socialHandles.instagram || '@brandname.ph'}</span>
                    </div>
                  </div>
                  <div className="aspect-square bg-slate-950 overflow-hidden">
                    <img src={selectedPostForPreview.mediaUrls[0]} alt="ig" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-3 space-y-1.5">
                    <div className="flex justify-between items-center text-white">
                      <div className="flex gap-2.5">
                        <Heart className="w-4 h-4 cursor-pointer hover:text-rose-500" />
                        <MessageCircle className="w-4 h-4" />
                        <Send className="w-4 h-4" />
                      </div>
                      <Bookmark className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-[11px]">2,190 likes</div>
                    <p className="text-[10px] leading-relaxed line-clamp-3">
                      <span className="font-bold mr-1">{activeClient.socialHandles.instagram || '@brandname.ph'}</span>
                      {selectedPostForPreview.caption}
                    </p>
                  </div>
                </div>
              )}

              {previewPlatform === 'linkedin' && selectedPostForPreview && (
                <div className="w-full bg-[#1b1f23] text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 text-xs p-3.5 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <img src={activeClient.avatarUrl} alt="avatar" className="w-9 h-9 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <div className="font-bold text-white text-xs">{activeClient.companyName}</div>
                      <div className="text-[10px] text-slate-400">Scheduled for {selectedPostForPreview.scheduledDate}</div>
                    </div>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-200 line-clamp-3">{selectedPostForPreview.caption}</p>
                  <div className="aspect-video rounded-lg overflow-hidden border border-slate-700">
                    <img src={selectedPostForPreview.mediaUrls[0]} alt="li" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Event Details & Fast Campaign Dispatch Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇵🇭</span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                    {selectedEventModal.type.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white font-['Outfit']">
                    {selectedEventModal.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedEventModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Philippine Date:</span>
                <strong className="text-white font-mono text-sm">{selectedEventModal.date}</strong>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Cultural Significance & Background:</span>
                <p className="text-slate-200 leading-relaxed p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  {selectedEventModal.description}
                </p>
              </div>

              <div>
                <span className="text-indigo-400 font-bold block mb-1">Strategic Social Campaign Hook:</span>
                <p className="text-slate-200 leading-relaxed p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
                  {selectedEventModal.campaignHook}
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {selectedEventModal.hashtags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedEventModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const evt = selectedEventModal;
                  setSelectedEventModal(null);
                  if (onScheduleForEvent) {
                    onScheduleForEvent(evt);
                  } else {
                    onOpenCreatePost();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Campaign for this Date</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
