import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Upload, 
  Clock, 
  Calendar, 
  Send, 
  Check, 
  Layers, 
  Smartphone, 
  Plus,
  HelpCircle
} from 'lucide-react';
import { TaskPost, ClientProfile, SocialPlatform, PostStatus } from '../types';
import { phMarketAiPresets } from '../data/mockData';

interface CreatePostModalProps {
  clients: ClientProfile[];
  onClose: () => void;
  onCreatePost: (newPost: Omit<TaskPost, 'id' | 'revisionRound' | 'internalComments' | 'qaChecklist'>) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  clients,
  onClose,
  onCreatePost,
}) => {
  const [clientId, setClientId] = useState<string>(clients[0]?.id || 'client-1');
  const [campaignName, setCampaignName] = useState('Octoberfest & Payday Weekend');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtagsStr, setHashtagsStr] = useState('#SupportLocalPH #ManilaFinds');
  const [mediaType, setMediaType] = useState<'image' | 'carousel' | 'video'>('image');
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(['facebook', 'instagram']);
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80');
  const [scheduledDate, setScheduledDate] = useState('2026-09-28');
  const [scheduledTime, setScheduledTime] = useState('11:30');
  const [assignedCopywriter, setAssignedCopywriter] = useState('Mikaela Sison (Senior Copy)');
  const [assignedDesigner, setAssignedDesigner] = useState('Angelo Dizon (Visual Lead)');
  const [assignedQA, setAssignedQA] = useState('Patricia Lim (Brand QA)');
  const [initialStatus, setInitialStatus] = useState<PostStatus>('copywriting');

  const togglePlatform = (p: SocialPlatform) => {
    if (platforms.includes(p)) {
      if (platforms.length > 1) setPlatforms(platforms.filter(item => item !== p));
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const handleApplyAiPreset = (preset: typeof phMarketAiPresets[0]) => {
    setCaption(`${preset.hook}\n\n${preset.callToAction}`);
    setHashtagsStr(preset.suggestedHashtags.join(' '));
    if (!title) {
      setTitle(preset.label + ' Campaign');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !caption.trim()) return;

    const hashtags = hashtagsStr
      .split(' ')
      .map(tag => tag.trim())
      .filter(tag => tag.startsWith('#') || tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`);

    onCreatePost({
      clientId,
      campaignName,
      title,
      caption,
      hashtags,
      mediaUrls: [mediaUrl],
      mediaType,
      platforms,
      status: initialStatus,
      scheduledDate,
      scheduledTime,
      timezone: 'PHT (Asia/Manila)',
      assignedCopywriter,
      assignedDesigner,
      assignedQA,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                CrossFlow Composer
              </span>
              <span className="text-xs text-slate-400">Social Media Campaign Task</span>
            </div>
            <h2 className="text-xl font-bold text-white font-['Outfit'] mt-1">
              Create New Social Task & Schedule
            </h2>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Target Client & Campaign */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Brand Client *</label>
              <select
                id="create-post-client-select"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.companyName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Campaign Tag / Objective</label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Octoberfest Promo, Payday Sweldo Hook"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Social Platforms Selector */}
          <div>
            <label className="text-slate-300 font-medium block mb-1">Publishing Channels</label>
            <div className="flex flex-wrap gap-2">
              {(['facebook', 'instagram', 'tiktok', 'linkedin', 'youtube'] as SocialPlatform[]).map(plat => {
                const isSelected = platforms.includes(plat);
                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => togglePlatform(plat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm' 
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {plat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post Title */}
          <div>
            <label className="text-slate-300 font-medium block mb-1">Task / Post Title *</label>
            <input
              id="create-post-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekend Coffee Roast Tasting + Free Pastry Promo"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          {/* AI Philippine Market Preset Pills */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Philippine Market AI Content Presets
              </span>
              <span className="text-[10px] text-slate-400">1-Click Local Hooks</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {phMarketAiPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyAiPreset(preset)}
                  className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group cursor-pointer"
                >
                  <span className="font-bold text-indigo-300 block text-[11px] group-hover:text-indigo-200">
                    {preset.label}
                  </span>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {preset.hook}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Caption Textarea */}
          <div>
            <label className="text-slate-300 font-medium block mb-1">Post Caption (Pinoy Taglish or English) *</label>
            <textarea
              id="create-post-caption"
              rows={4}
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write an engaging caption tailored to Filipino consumers..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
            ></textarea>
          </div>

          {/* Hashtags & Media Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Hashtags</label>
              <input
                type="text"
                value={hashtagsStr}
                onChange={(e) => setHashtagsStr(e.target.value)}
                placeholder="#ManilaCoffee #BGCFoodie #PaydayPH"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Creative Format</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="image">Single Static Graphic (1:1 or 4:5)</option>
                <option value="carousel">Multi-slide Carousel</option>
                <option value="video">Vertical Reel / TikTok Video (9:16)</option>
              </select>
            </div>
          </div>

          {/* Scheduled Date & Time (PHT) */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <span className="font-bold text-white block text-xs">
              Philippine Publishing Window (PHT • Asia/Manila)
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Target Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Time (PHT)</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs font-mono"
                />
              </div>
            </div>

            {/* Quick Best Times */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 mr-1">Best Times:</span>
              {['11:30', '13:30', '19:30', '21:30'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setScheduledTime(t)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                    scheduledTime === t 
                      ? 'bg-indigo-600 text-white border-indigo-500' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {t} PHT
                </button>
              ))}
            </div>
          </div>

          {/* Initial Workflow Stage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Starting Stage in Production</label>
              <select
                value={initialStatus}
                onChange={(e) => setInitialStatus(e.target.value as PostStatus)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="draft_idea">1. Idea & Brief</option>
                <option value="copywriting">2. Copywriting (Mikaela)</option>
                <option value="designing">3. Visual Design (Angelo)</option>
                <option value="internal_qa">4. Internal Brand QA (Patricia)</option>
                <option value="pending_client_approval">5. Ready for Client Sign-Off</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Assigned QA Reviewer</label>
              <input
                type="text"
                disabled
                value={assignedQA}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-slate-400"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-create-post-btn"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Create & Dispatch to Team</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
