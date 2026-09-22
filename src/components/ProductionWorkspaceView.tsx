import React, { useState } from 'react';
import { 
  KanbanSquare, 
  ListFilter, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  Share2, 
  Eye, 
  Upload, 
  ShieldCheck, 
  Send, 
  User, 
  Calendar,
  X,
  Check,
  ChevronRight,
  Filter
} from 'lucide-react';
import { TaskPost, PostStatus, TeamRole, ClientProfile, SocialPlatform } from '../types';
import { phMarketAiPresets } from '../data/mockData';

interface ProductionWorkspaceViewProps {
  posts: TaskPost[];
  clients: ClientProfile[];
  currentRole: TeamRole;
  onUpdatePostStatus: (postId: string, newStatus: PostStatus) => void;
  onUpdatePost: (updatedPost: TaskPost) => void;
  onOpenCreatePost: () => void;
  selectedPost: TaskPost | null;
  setSelectedPost: (post: TaskPost | null) => void;
}

const PRODUCTION_STAGES: { id: PostStatus; label: string; role: string; color: string }[] = [
  { id: 'draft_idea', label: '1. Idea & Brief', role: 'Account Manager', color: 'border-slate-700 text-slate-300' },
  { id: 'copywriting', label: '2. Copywriting', role: 'Copywriter', color: 'border-amber-500/40 text-amber-300' },
  { id: 'designing', label: '3. Creative & Visuals', role: 'Visual Designer', color: 'border-emerald-500/40 text-emerald-300' },
  { id: 'internal_qa', label: '4. Brand & QA Review', role: 'Brand QA Specialist', color: 'border-purple-500/40 text-purple-300' },
  { id: 'pending_client_approval', label: '5. Client Approval', role: 'Client Stakeholder', color: 'border-rose-500/40 text-rose-300' },
  { id: 'client_approved', label: '6. Client Approved', role: 'Publishing Engine', color: 'border-teal-500/40 text-teal-300' },
  { id: 'scheduled', label: '7. Scheduled for PHT', role: 'Auto-Dispatcher', color: 'border-blue-500/40 text-blue-300' },
];

export const ProductionWorkspaceView: React.FC<ProductionWorkspaceViewProps> = ({
  posts,
  clients,
  currentRole,
  onUpdatePostStatus,
  onUpdatePost,
  onOpenCreatePost,
  selectedPost,
  setSelectedPost,
}) => {
  const [filterClient, setFilterClient] = useState<string>('all');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [newCommentText, setNewCommentText] = useState('');

  const filteredPosts = posts.filter(p => {
    const matchesClient = filterClient === 'all' || p.clientId === filterClient;
    const matchesPlatform = filterPlatform === 'all' || p.platforms.includes(filterPlatform as SocialPlatform);
    return matchesClient && matchesPlatform;
  });

  const handleAddComment = (post: TaskPost) => {
    if (!newCommentText.trim()) return;

    const authorMap: Record<TeamRole, string> = {
      agency_admin: 'Agency Director',
      account_manager: 'Althea Cruz',
      copywriter: 'Mikaela Sison',
      designer: 'Angelo Dizon',
      qa_specialist: 'Patricia Lim',
      client_stakeholder: 'Client Stakeholder',
    };

    const newComment = {
      id: 'c-' + Date.now(),
      authorName: authorMap[currentRole] || 'Team Member',
      role: currentRole,
      text: newCommentText.trim(),
      timestamp: 'Just now',
      isClientNote: currentRole === 'client_stakeholder',
    };

    const updated: TaskPost = {
      ...post,
      internalComments: [...post.internalComments, newComment],
    };

    onUpdatePost(updated);
    setSelectedPost(updated);
    setNewCommentText('');
  };

  const handleToggleQAChecklist = (post: TaskPost, key: keyof TaskPost['qaChecklist']) => {
    const updated: TaskPost = {
      ...post,
      qaChecklist: {
        ...post.qaChecklist,
        [key]: !post.qaChecklist[key],
      },
    };
    onUpdatePost(updated);
    setSelectedPost(updated);
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827]/90 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Agency Multi-Role Production Engine
            </span>
            <span className="text-xs text-slate-400">Collaborative Workspace for Copy, Design & QA</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-['Outfit'] mt-1">
            Social Media Project Workspace
          </h1>
          <p className="text-xs text-slate-300">
            Every campaign moves strictly from Copywriting to Visual Design, through Internal QA, and finally to the Client Portal for mandatory client approval before posting.
          </p>
        </div>

        {/* Filters and CTA */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Brand Clients</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.companyName}</option>
            ))}
          </select>

          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Social Platforms</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
          </select>

          <button
            onClick={onOpenCreatePost}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task Post</span>
          </button>
        </div>
      </div>

      {/* Production Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 overflow-x-auto pb-4">
        {PRODUCTION_STAGES.map((stage) => {
          const stagePosts = filteredPosts.filter(p => {
            if (stage.id === 'pending_client_approval') {
              return p.status === 'pending_client_approval' || p.status === 'changes_requested';
            }
            return p.status === stage.id;
          });

          return (
            <div key={stage.id} className="bg-[#111827]/60 border border-slate-800/80 rounded-2xl p-3 flex flex-col min-w-[240px]">
              
              {/* Column Header */}
              <div className="pb-2 mb-3 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className={`font-semibold text-xs ${stage.color}`}>{stage.label}</h3>
                  <div className="text-[10px] text-slate-400">
                    {stage.role} • <strong className="text-slate-300 font-mono">{stagePosts.length}</strong>
                  </div>
                </div>
              </div>

              {/* Task Cards in this Stage */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-1">
                {stagePosts.length === 0 ? (
                  <div className="py-8 text-center text-[10px] text-slate-600 border border-dashed border-slate-800/60 rounded-xl">
                    No active tasks
                  </div>
                ) : (
                  stagePosts.map((post) => {
                    const client = clients.find(c => c.id === post.clientId);
                    const isRevision = post.status === 'changes_requested';

                    return (
                      <div
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className={`p-3 rounded-xl bg-slate-900/90 border transition-all cursor-pointer shadow-sm group hover:-translate-y-0.5 ${
                          isRevision 
                            ? 'border-amber-500/50 bg-amber-950/10' 
                            : 'border-slate-800 hover:border-indigo-500/50'
                        }`}
                      >
                        {/* Client & Revision Tag */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] font-bold text-indigo-400 truncate">
                            {client?.companyName}
                          </span>
                          {isRevision && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Revision R{post.revisionRound}
                            </span>
                          )}
                        </div>

                        {/* Title & Preview Image */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 line-clamp-2 leading-tight">
                            {post.title}
                          </h4>

                          {post.mediaUrls.length > 0 && (
                            <div className="relative rounded-lg overflow-hidden border border-slate-800 aspect-video bg-black/40">
                              <img 
                                src={post.mediaUrls[0]} 
                                alt={post.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold uppercase text-white backdrop-blur-xs">
                                {post.mediaType}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Platforms & Scheduled Time */}
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                          <div className="flex gap-1">
                            {post.platforms.map(p => (
                              <span key={p} className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono uppercase text-[9px]">
                                {p.substring(0, 2)}
                              </span>
                            ))}
                          </div>
                          <span className="font-mono text-slate-400">{post.scheduledTime} PHT</span>
                        </div>

                        {/* Comments & QA indicator */}
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-slate-500" />
                            <span>{post.internalComments.length}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {Object.values(post.qaChecklist).every(Boolean) ? (
                              <span className="text-emerald-400 flex items-center gap-0.5 text-[9px]">
                                <CheckCircle2 className="w-3 h-3" /> QA Ready
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[9px]">QA Incomplete</span>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Collaboration & Multi-Role Inspector Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150 overflow-hidden">
            
            {/* Modal Top Bar */}
            <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {clients.find(c => c.id === selectedPost.clientId)?.companyName}
                  </span>
                  <span className="text-xs text-slate-400">
                    Status: <strong className="text-white capitalize">{selectedPost.status.replace(/_/g, ' ')}</strong>
                  </span>
                  <span className="text-xs text-slate-400">
                    • Slot: <span className="font-mono text-slate-200">{selectedPost.scheduledDate} @ {selectedPost.scheduledTime} PHT</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit'] mt-1">{selectedPost.title}</h3>
              </div>

              <button 
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 2 Columns */}
            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Creative Assets & Content */}
              <div className="space-y-4 text-xs">
                
                {/* Media Preview */}
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Visual Asset (Designer's Output)</label>
                  {selectedPost.mediaUrls.length > 0 ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video">
                      <img 
                        src={selectedPost.mediaUrls[0]} 
                        alt="Creative preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="p-8 border border-dashed border-slate-700 rounded-xl text-center text-slate-500">
                      No media uploaded yet
                    </div>
                  )}

                  {/* Creative upload simulator for Designer role */}
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Assigned Designer: <strong className="text-slate-200">{selectedPost.assignedDesigner}</strong></span>
                    <button
                      onClick={() => {
                        const newMockImage = 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80';
                        const updated = { ...selectedPost, mediaUrls: [newMockImage] };
                        onUpdatePost(updated);
                        setSelectedPost(updated);
                      }}
                      className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload New Artwork</span>
                    </button>
                  </div>
                </div>

                {/* Caption & Copywriting */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-medium block">Copywriting & Pinoy Caption</label>
                    <span className="text-[10px] text-slate-400">{selectedPost.assignedCopywriter}</span>
                  </div>

                  <textarea
                    rows={6}
                    value={selectedPost.caption}
                    onChange={(e) => {
                      const updated = { ...selectedPost, caption: e.target.value };
                      onUpdatePost(updated);
                      setSelectedPost(updated);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                  />

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedPost.hashtags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Client Revision Note if changes requested */}
                {selectedPost.clientFeedbackNotes && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-300">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Client Revision Request:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{selectedPost.clientFeedbackNotes}</p>
                  </div>
                )}

              </div>

              {/* Right Column: QA Checklist, Stage Advance & Collaboration Thread */}
              <div className="space-y-4 text-xs">
                
                {/* Brand QA Review Panel */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span className="font-bold text-white text-xs">Brand QA Checklist (Patricia Lim)</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Must pass before client approval</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { key: 'spellingAndGrammar' as const, label: 'Spelling, grammar & natural Taglish phrasing verified' },
                      { key: 'brandGuidelinesFollowed' as const, label: 'Client brand colors, fonts & logo guidelines met' },
                      { key: 'aspectRatioCorrect' as const, label: 'Platform aspect ratio (4:5 FB/IG, 9:16 TikTok) verified' },
                      { key: 'linksAndDisclaimersVerified' as const, label: 'Promos, pricing, DTI permit / disclaimers accurate' },
                    ].map(item => (
                      <label 
                        key={item.key} 
                        className="flex items-start gap-2.5 text-slate-300 cursor-pointer hover:text-white transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPost.qaChecklist[item.key]}
                          onChange={() => handleToggleQAChecklist(selectedPost, item.key)}
                          className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-[11px]">{item.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Advance to Client Approval Action */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {Object.values(selectedPost.qaChecklist).every(Boolean) ? 'All 4 QA checks passed' : 'Checks remaining'}
                    </span>

                    <button
                      onClick={() => {
                        const updated: TaskPost = {
                          ...selectedPost,
                          status: 'pending_client_approval',
                          qaChecklist: {
                            spellingAndGrammar: true,
                            brandGuidelinesFollowed: true,
                            aspectRatioCorrect: true,
                            linksAndDisclaimersVerified: true,
                          },
                        };
                        onUpdatePost(updated);
                        setSelectedPost(updated);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] flex items-center gap-1 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Push to Client for Approval</span>
                    </button>
                  </div>
                </div>

                {/* Team Comments / Discussion Stream */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-white text-xs">Team Collaboration Thread</span>
                      <span className="text-[10px] text-slate-400">{selectedPost.internalComments.length} notes</span>
                    </div>

                    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto pr-1">
                      {selectedPost.internalComments.map((comment) => (
                        <div 
                          key={comment.id}
                          className={`p-2 rounded-lg text-[11px] border ${
                            comment.isClientNote 
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' 
                              : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] mb-0.5">
                            <span className="font-bold text-slate-200">{comment.authorName}</span>
                            <span className="text-slate-500">{comment.timestamp}</span>
                          </div>
                          <p>{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      placeholder="Add an internal note or task update..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(selectedPost);
                      }}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => handleAddComment(selectedPost)}
                      className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Bottom Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Quick Change Stage:</span>
                <select
                  value={selectedPost.status}
                  onChange={(e) => {
                    const newSt = e.target.value as PostStatus;
                    const updated = { ...selectedPost, status: newSt };
                    onUpdatePost(updated);
                    setSelectedPost(updated);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="draft_idea">1. Idea & Brief</option>
                  <option value="copywriting">2. Copywriting</option>
                  <option value="designing">3. Creative & Visuals</option>
                  <option value="internal_qa">4. Brand & QA Review</option>
                  <option value="pending_client_approval">5. Client Approval</option>
                  <option value="changes_requested">5b. Revisions Requested</option>
                  <option value="client_approved">6. Client Approved</option>
                  <option value="scheduled">7. Scheduled for PHT</option>
                  <option value="published">8. Published Live</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
