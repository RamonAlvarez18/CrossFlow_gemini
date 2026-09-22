import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Grid3X3, 
  List, 
  Smartphone, 
  Monitor, 
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
  RotateCcw
} from 'lucide-react';
import { TaskPost, ClientProfile, SocialPlatform } from '../types';
import { phMarketAiPresets } from '../data/mockData';

interface SocialPlannerViewProps {
  posts: TaskPost[];
  clients: ClientProfile[];
  onOpenCreatePost: () => void;
  onSelectPost: (post: TaskPost) => void;
}

export const SocialPlannerView: React.FC<SocialPlannerViewProps> = ({
  posts,
  clients,
  onOpenCreatePost,
  onSelectPost,
}) => {
  const [plannerMode, setPlannerMode] = useState<'calendar' | 'grid' | 'queue'>('calendar');
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>('facebook');
  const [selectedPostForPreview, setSelectedPostForPreview] = useState<TaskPost>(posts[0]);
  const [selectedClientId, setSelectedClientId] = useState<string>('all');

  const filteredPosts = posts.filter(p => 
    selectedClientId === 'all' || p.clientId === selectedClientId
  );

  const activeClient = clients.find(c => c.id === selectedPostForPreview?.clientId) || clients[0];

  // Calendar dates generation for current month (September 2026)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="max-w-[1700px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      
      {/* Top Header & View Modes */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827]/90 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Social Media Management & Planner
            </span>
            <span className="text-xs text-slate-400">Buffer • Later • Gridoro • Hootsuite Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-['Outfit'] mt-1">
            Publishing Calendar & 3x3 Grid Visualizer
          </h1>
          <p className="text-xs text-slate-300">
            Schedule across Facebook, Instagram, TikTok, and LinkedIn with accurate Philippine peak timing (PHT) and realistic live device simulations.
          </p>
        </div>

        {/* Controls: Mode Switcher & Client Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Brand Feeds</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.companyName}</option>
            ))}
          </select>

          {/* View Toggles */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPlannerMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                plannerMode === 'calendar' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Month Calendar</span>
            </button>
            <button
              onClick={() => setPlannerMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                plannerMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>3x3 Feed Grid (Gridoro)</span>
            </button>
            <button
              onClick={() => setPlannerMode('queue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                plannerMode === 'queue' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Queue List</span>
            </button>
          </div>

          <button
            onClick={onOpenCreatePost}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Compose Post</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout: Planner on Left (2 cols), Live Device Preview on Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Calendar / Grid / Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Calendar View */}
          {plannerMode === 'calendar' && (
            <div className="bg-[#111827]/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-base text-white font-['Outfit']">September 2026</h3>
                  <span className="text-xs text-slate-400 font-mono">Asia/Manila (PHT)</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-blue-400 mr-1"></span>
                  <span>{filteredPosts.length} Campaigns Plotted</span>
                </div>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400 py-1 border-b border-slate-800">
                <span>SUN</span>
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {daysInMonth.map((day) => {
                  const dateStr = `2026-09-${day < 10 ? '0' + day : day}`;
                  const dayPosts = filteredPosts.filter(p => p.scheduledDate === dateStr);
                  const isToday = day === 22;

                  return (
                    <div 
                      key={day} 
                      className={`min-h-[85px] p-1.5 rounded-xl border flex flex-col justify-between transition-colors ${
                        isToday 
                          ? 'bg-indigo-950/30 border-indigo-500/50' 
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={`font-mono font-bold ${isToday ? 'text-indigo-400 bg-indigo-500/20 px-1 rounded' : 'text-slate-400'}`}>
                          {day}
                        </span>
                        {dayPosts.length > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        )}
                      </div>

                      <div className="space-y-1 mt-1">
                        {dayPosts.map((post) => (
                          <div
                            key={post.id}
                            onClick={() => {
                              setSelectedPostForPreview(post);
                              if (post.platforms.length > 0) setPreviewPlatform(post.platforms[0]);
                            }}
                            className={`p-1 rounded text-[9px] truncate font-medium cursor-pointer transition-transform hover:scale-[1.02] ${
                              selectedPostForPreview?.id === post.id 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                            }`}
                            title={post.title}
                          >
                            <span className="opacity-75 font-mono mr-0.5">{post.scheduledTime}</span>
                            <span>{post.title}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-[9px] text-slate-600 text-right">
                        {/* Empty slot placeholder */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3x3 Instagram / Feed Grid Planner (Gridoro / Later style) */}
          {plannerMode === 'grid' && (
            <div className="bg-[#111827]/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-white font-['Outfit']">Feed Aesthetic Visualizer (3x3 Grid)</h3>
                  <p className="text-xs text-slate-400">Preview how published and scheduled posts harmonize on the Instagram / Facebook feed before publishing.</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  Gridoro Mode
                </span>
              </div>

              {/* 3x3 Square Grid */}
              <div className="grid grid-cols-3 gap-2 aspect-square max-w-md mx-auto p-2 bg-black rounded-2xl border border-slate-800 shadow-2xl">
                {filteredPosts.slice(0, 9).map((post, idx) => (
                  <div
                    key={post.id}
                    onClick={() => {
                      setSelectedPostForPreview(post);
                      setPreviewPlatform('instagram');
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border transition-all cursor-pointer group ${
                      selectedPostForPreview?.id === post.id ? 'border-indigo-400 ring-2 ring-indigo-500' : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <img 
                      src={post.mediaUrls[0] || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400'} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white text-[10px]">
                      <span className="font-bold uppercase tracking-wider text-indigo-300">{post.status.replace(/_/g, ' ')}</span>
                      <p className="line-clamp-2">{post.title}</p>
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

          {/* Queue List View */}
          {plannerMode === 'queue' && (
            <div className="bg-[#111827]/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-base text-white font-['Outfit'] pb-2 border-b border-slate-800">
                Scheduled Publishing Queue (PHT Timezone)
              </h3>
              <div className="space-y-2.5">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPostForPreview(post)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all cursor-pointer ${
                      selectedPostForPreview?.id === post.id 
                        ? 'bg-slate-900 border-indigo-500' 
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={post.mediaUrls[0] || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100'} 
                        alt={post.title}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-700 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-100">{post.title}</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                            {post.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{post.caption}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 font-mono text-xs text-slate-300">
                      <div>{post.scheduledDate}</div>
                      <div className="text-indigo-400">{post.scheduledTime} PHT</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Peak Times to Post in the Philippines Tip Box */}
          <div className="bg-[#111827]/80 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
            <span className="font-bold text-white flex items-center gap-1.5 text-xs">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Optimal Philippine Social Media Posting Windows (PHT / GMT+8)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-indigo-400 font-bold font-mono block">11:30 AM</span>
                <span className="text-[10px] text-slate-400">Lunch Break Rush</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-indigo-400 font-bold font-mono block">1:30 PM</span>
                <span className="text-[10px] text-slate-400">Afternoon Slump</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-indigo-400 font-bold font-mono block">7:30 PM</span>
                <span className="text-[10px] text-slate-400">Prime Commute & Dinner</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-indigo-400 font-bold font-mono block">9:30 PM</span>
                <span className="text-[10px] text-slate-400">Bedtime Scrolling (Peak TikTok)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Interactive Device Mockup (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-5 sticky top-20">
            
            {/* Simulator Platform Selector */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white font-['Outfit']">Live Device Simulation</h3>
              </div>

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
              
              {/* FACEBOOK FEED MOCK */}
              {previewPlatform === 'facebook' && (
                <div className="w-full max-w-sm bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-300 text-xs">
                  {/* FB Post Header */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={activeClient.avatarUrl} 
                        alt="Brand avatar" 
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                          <span>{activeClient.companyName}</span>
                          <span className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px]">✓</span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span>Scheduled for {selectedPostForPreview.scheduledDate}</span>
                          <span>•</span>
                          <span>🌐 Public</span>
                        </div>
                      </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-slate-500" />
                  </div>

                  {/* FB Caption */}
                  <div className="px-3 pb-2 text-[11px] leading-relaxed text-slate-800 whitespace-pre-line">
                    {selectedPostForPreview.caption}
                    <div className="text-blue-600 font-medium mt-1">
                      {selectedPostForPreview.hashtags.join(' ')}
                    </div>
                  </div>

                  {/* FB Media Image */}
                  <div className="bg-slate-100 aspect-video overflow-hidden">
                    <img 
                      src={selectedPostForPreview.mediaUrls[0] || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600'} 
                      alt="Post visual"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* FB Reactions bar */}
                  <div className="p-3 border-t border-slate-100 flex items-center justify-between text-slate-600 text-[11px]">
                    <div className="flex items-center gap-1.5 font-medium cursor-pointer hover:text-blue-600">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Like</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium cursor-pointer hover:text-blue-600">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Comment</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium cursor-pointer hover:text-blue-600">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TIKTOK VERTICAL PHONE MOCK */}
              {previewPlatform === 'tiktok' && (
                <div className="w-[280px] h-[520px] bg-black text-white rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 relative flex flex-col justify-between p-3 select-none">
                  {/* Background vertical video/image */}
                  <img 
                    src={selectedPostForPreview.mediaUrls[0] || 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600'} 
                    alt="TikTok background"
                    className="absolute inset-0 w-full h-full object-cover opacity-85"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient shadow overlay for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none"></div>

                  {/* Top Bar: LIVE / Following / For You */}
                  <div className="relative z-10 flex items-center justify-center gap-3 text-xs font-semibold pt-1">
                    <span className="text-white/60">Following</span>
                    <span className="text-white font-bold border-b-2 border-white pb-0.5">For You</span>
                  </div>

                  {/* Right Action Stack: Profile, Like, Comment, Bookmark, Share, Sound */}
                  <div className="relative z-10 self-end space-y-3 flex flex-col items-center mb-10 mr-1">
                    <div className="w-9 h-9 rounded-full border border-white overflow-hidden">
                      <img src={activeClient.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-center">
                      <Heart className="w-6 h-6 text-white fill-white/20 mx-auto" />
                      <span className="text-[10px] font-bold">14.2K</span>
                    </div>
                    <div className="text-center">
                      <MessageCircle className="w-6 h-6 text-white mx-auto" />
                      <span className="text-[10px] font-bold">894</span>
                    </div>
                    <div className="text-center">
                      <Bookmark className="w-6 h-6 text-white mx-auto" />
                      <span className="text-[10px] font-bold">3.1K</span>
                    </div>
                    <div className="text-center">
                      <Share2 className="w-6 h-6 text-white mx-auto" />
                      <span className="text-[10px] font-bold">Share</span>
                    </div>
                    {/* Spinning Music Disc */}
                    <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center animate-spin">
                      <Music className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  {/* Bottom Info: Taglish caption & Music marquee */}
                  <div className="relative z-10 space-y-1 max-w-[210px] text-xs">
                    <div className="font-bold flex items-center gap-1">
                      <span>{activeClient.socialHandles.tiktok || '@brandnameph'}</span>
                      <span className="text-[9px] bg-red-500 px-1 rounded">PH</span>
                    </div>
                    <p className="text-[10px] line-clamp-2 leading-tight text-white/95">
                      {selectedPostForPreview.caption}
                    </p>
                    <div className="text-[9px] font-bold text-yellow-300">
                      {selectedPostForPreview.hashtags.slice(0, 3).join(' ')}
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-white/70 font-mono pt-1">
                      <Music className="w-2.5 h-2.5" />
                      <span className="truncate">Original Sound - Trending Manila Beats</span>
                    </div>
                  </div>
                </div>
              )}

              {/* INSTAGRAM POST MOCK */}
              {previewPlatform === 'instagram' && (
                <div className="w-full max-w-sm bg-black text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800 text-xs">
                  {/* IG Post Header */}
                  <div className="p-3 flex items-center justify-between border-b border-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                        <img 
                          src={activeClient.avatarUrl} 
                          alt="Avatar" 
                          className="w-full h-full rounded-full object-cover border border-black" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="font-bold text-xs">{activeClient.socialHandles.instagram || '@manilaroast.ph'}</span>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* IG Media */}
                  <div className="aspect-square bg-slate-950 overflow-hidden">
                    <img 
                      src={selectedPostForPreview.mediaUrls[0] || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600'} 
                      alt="IG Media"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* IG Actions Bar */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 cursor-pointer hover:text-rose-500" />
                        <MessageCircle className="w-5 h-5 cursor-pointer hover:text-slate-400" />
                        <Send className="w-5 h-5 cursor-pointer hover:text-slate-400" />
                      </div>
                      <Bookmark className="w-5 h-5 cursor-pointer hover:text-slate-400" />
                    </div>

                    <div className="font-bold text-xs">1,824 likes</div>

                    <div className="text-[11px] leading-relaxed">
                      <span className="font-bold mr-1.5">{activeClient.socialHandles.instagram || '@brandname.ph'}</span>
                      <span className="text-slate-200">{selectedPostForPreview.caption}</span>
                      <div className="text-indigo-400 mt-1 font-medium">
                        {selectedPostForPreview.hashtags.join(' ')}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 uppercase font-mono">
                      Scheduled for {selectedPostForPreview.scheduledDate} • PHT
                    </div>
                  </div>
                </div>
              )}

              {/* LINKEDIN POST MOCK */}
              {previewPlatform === 'linkedin' && (
                <div className="w-full max-w-sm bg-[#1b1f23] text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 text-xs p-4 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <img src={activeClient.avatarUrl} alt="Logo" className="w-10 h-10 rounded-md object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <div className="font-bold text-white text-xs">{activeClient.companyName}</div>
                      <div className="text-[10px] text-slate-400">{activeClient.brandTagline}</div>
                      <div className="text-[9px] text-slate-500 font-mono">Scheduled • Manila HQ</div>
                    </div>
                  </div>

                  <p className="text-[11px] leading-relaxed text-slate-200 line-clamp-4">
                    {selectedPostForPreview.caption}
                  </p>

                  <div className="rounded-lg overflow-hidden border border-slate-700 aspect-video">
                    <img 
                      src={selectedPostForPreview.mediaUrls[0] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600'} 
                      alt="LinkedIn asset" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
