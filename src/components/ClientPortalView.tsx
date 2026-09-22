import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Smartphone, 
  Calendar, 
  Receipt, 
  Sparkles, 
  ThumbsUp, 
  RotateCcw, 
  Eye, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  Building2,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskPost, ClientProfile, Invoice } from '../types';

interface ClientPortalViewProps {
  clients: ClientProfile[];
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  posts: TaskPost[];
  invoices: Invoice[];
  onApprovePost: (postId: string) => void;
  onRequestRevisions: (postId: string, feedback: string) => void;
  onSendClientNote: (postId: string, note: string) => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  clients,
  selectedClientId,
  setSelectedClientId,
  posts,
  invoices,
  onApprovePost,
  onRequestRevisions,
  onSendClientNote,
}) => {
  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const clientPosts = posts.filter(p => p.clientId === currentClient.id);
  const clientInvoices = invoices.filter(i => i.companyName.toLowerCase() === currentClient.companyName.toLowerCase());

  const pendingApprovalPosts = clientPosts.filter(p => p.status === 'pending_client_approval');
  const changesRequestedPosts = clientPosts.filter(p => p.status === 'changes_requested');
  const approvedPosts = clientPosts.filter(p => p.status === 'client_approved' || p.status === 'scheduled' || p.status === 'published');

  const [activeTab, setActiveTab] = useState<'approvals' | 'calendar' | 'progress' | 'invoices'>('approvals');
  const [revisionModalPost, setRevisionModalPost] = useState<TaskPost | null>(null);
  const [revisionFeedbackText, setRevisionFeedbackText] = useState('');
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  const handleConfirmApproval = (post: TaskPost) => {
    onApprovePost(post.id);
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  const handleConfirmRevisions = () => {
    if (!revisionModalPost || !revisionFeedbackText.trim()) return;
    onRequestRevisions(revisionModalPost.id, revisionFeedbackText.trim());
    setRevisionFeedbackText('');
    setRevisionModalPost(null);
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      
      {/* Client Portal Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-slate-800 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Client Identity */}
          <div className="flex items-center gap-4">
            <img 
              src={currentClient.avatarUrl} 
              alt={currentClient.companyName} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500/40 shadow-xl"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  CrossFlow Client Portal
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Access Key: <strong className="text-emerald-400">{currentClient.portalAccessKey}</strong>
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight font-['Outfit'] mt-1">
                {currentClient.companyName}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Welcome back, <strong>{currentClient.contactPerson}</strong>! Review pending social posts, request edits, and track live campaigns.
              </p>
            </div>
          </div>

          {/* Switch Client Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <span className="text-slate-400 mr-2">Viewing as Client:</span>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-slate-100">
                    {c.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Retainer Active (₱{currentClient.monthlyRetainerPHP.toLocaleString()}/mo)</span>
            </div>
          </div>

        </div>

        {/* Client Portal Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto">
          {[
            { id: 'approvals', label: `Pending Approvals (${pendingApprovalPosts.length})`, highlight: pendingApprovalPosts.length > 0 },
            { id: 'calendar', label: 'Approved Publishing Calendar', highlight: false },
            { id: 'progress', label: 'Campaign Progress & Tasks', highlight: false },
            { id: 'invoices', label: 'Invoices & Retainers', highlight: false },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' 
                  : tab.highlight 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: PENDING CLIENT APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <span>Posts Awaiting Your Sign-Off</span>
                {pendingApprovalPosts.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                    Action Required
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Per CrossFlow policy, no post goes live to your Facebook, Instagram, or TikTok channels without your explicit approval here.
              </p>
            </div>
          </div>

          {pendingApprovalPosts.length === 0 ? (
            <div className="bg-[#111827]/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white font-['Outfit']">You're All Caught Up!</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                There are no posts currently waiting for your review. Our creative team (copywriter, designer, QA) is preparing the next batch of content.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingApprovalPosts.map((post) => (
                <div 
                  key={post.id}
                  className="bg-[#111827] border-2 border-rose-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    {/* Post Card Top Bar */}
                    <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Pending Client Approval
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Target: {post.scheduledDate} @ {post.scheduledTime} PHT
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {post.platforms.map(p => (
                          <span key={p} className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Creative Visual Asset */}
                    <div className="relative bg-black aspect-video overflow-hidden">
                      <img 
                        src={post.mediaUrls[0] || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800'} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-[10px] font-bold text-white flex items-center gap-1 border border-white/10">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Passed Internal Brand QA</span>
                      </div>
                    </div>

                    {/* Content & Caption */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-sm font-bold text-white font-['Outfit']">{post.title}</h3>
                        <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
                          {post.caption}
                        </p>
                      </div>

                      {/* Hashtags */}
                      <div className="flex flex-wrap gap-1.5">
                        {post.hashtags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Agency Team Sign-off list */}
                      <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                        <span>Copy: <strong className="text-slate-200">Mikaela</strong></span>
                        <span>•</span>
                        <span>Design: <strong className="text-slate-200">Angelo</strong></span>
                        <span>•</span>
                        <span>QA: <strong className="text-emerald-400">Patricia ✓</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Client Approval Action Bar */}
                  <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center gap-3">
                    <button
                      id={`client-approve-btn-${post.id}`}
                      onClick={() => handleConfirmApproval(post)}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Lock for Publishing</span>
                    </button>

                    <button
                      id={`client-revision-btn-${post.id}`}
                      onClick={() => {
                        setRevisionModalPost(post);
                        setRevisionFeedbackText('');
                      }}
                      className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Request Changes</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* If there are items with changes requested */}
          {changesRequestedPosts.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>Posts Currently Being Revised by Agency Team ({changesRequestedPosts.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {changesRequestedPosts.map(post => (
                  <div key={post.id} className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">{post.title}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                        Revision Round {post.revisionRound}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-amber-950/20 text-amber-200 border border-amber-900/50 text-[11px]">
                      <strong>Your Feedback:</strong> {post.clientFeedbackNotes}
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      Assigned to Angelo Dizon (Designer) & Mikaela Sison (Copy) for updates.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: APPROVED PUBLISHING CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="bg-[#111827]/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white font-['Outfit']">
                Approved Content Distribution Schedule
              </h2>
              <p className="text-xs text-slate-400">
                All approved posts scheduled to publish to your brand channels during peak Philippine engagement hours.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {approvedPosts.length} Posts Ready / Live
            </span>
          </div>

          <div className="space-y-3">
            {approvedPosts.map((post) => (
              <div key={post.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {post.status === 'published' ? 'Live Published' : 'Approved & Scheduled'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">{post.caption}</p>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Platforms: {post.platforms.join(', ').toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 font-mono">
                  <div className="text-xs text-slate-200 font-bold">{post.scheduledDate}</div>
                  <div className="text-xs text-indigo-400 font-semibold">{post.scheduledTime} PHT</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CAMPAIGN PROGRESS & RETAINER DELIVERABLES */}
      {activeTab === 'progress' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Retainer Progress Card */}
          <div className="md:col-span-2 bg-[#111827]/80 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="font-bold text-base text-white font-['Outfit']">
              Monthly Social Deliverables Breakdown
            </h3>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>Monthly Retainer Content Quota</span>
                <span className="font-mono text-emerald-400 font-bold">14 / 20 Posts Delivered (70%)</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full w-[70%]"></div>
              </div>
            </div>

            {/* Breakdown Items */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Static & Carousel Posts</span>
                <span className="text-lg font-bold text-white font-mono mt-1 block">10 / 12</span>
                <span className="text-[10px] text-emerald-400 font-semibold">On Track</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Vertical Video Reels / TikTok</span>
                <span className="text-lg font-bold text-white font-mono mt-1 block">4 / 6</span>
                <span className="text-[10px] text-emerald-400 font-semibold">On Track</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Community Engagement</span>
                <span className="text-lg font-bold text-white font-mono mt-1 block">Daily</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
              </div>
            </div>

            {/* Brand Kit Profile */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-white block">Active Brand Style Guide on File</span>
              <div className="text-slate-300 text-[11px] leading-relaxed">
                <strong>Tone of Voice:</strong> {currentClient.toneOfVoice}
              </div>
              <div className="text-slate-300 text-[11px]">
                <strong>Target Audience:</strong> {currentClient.targetAudience}
              </div>
            </div>
          </div>

          {/* Dedicated Agency Team Contacts */}
          <div className="bg-[#111827]/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-base text-white font-['Outfit']">
              Your Agency Team
            </h3>
            <p className="text-xs text-slate-400">
              CrossCode PH Creative Agency assigned personnel for your account.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-indigo-400 font-bold uppercase block">Account Manager</span>
                <div className="font-bold text-white mt-0.5">Althea Cruz</div>
                <div className="text-[11px] text-slate-400">althea@crosscode.ph</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-amber-400 font-bold uppercase block">Senior Copywriter</span>
                <div className="font-bold text-white mt-0.5">Mikaela Sison</div>
                <div className="text-[11px] text-slate-400">Content & Taglish Specialist</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Visual Designer</span>
                <div className="font-bold text-white mt-0.5">Angelo Dizon</div>
                <div className="text-[11px] text-slate-400">Multimedia & Video Lead</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: INVOICES & RETAINERS */}
      {activeTab === 'invoices' && (
        <div className="bg-[#111827]/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white font-['Outfit']">
                Billing & Retainer Invoices
              </h2>
              <p className="text-xs text-slate-400">
                Official agency receipts and payment logs settled via GCash, Maya, or Philippine bank transfer.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientInvoices.map((inv) => (
              <div key={inv.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-slate-400 text-[10px]">{inv.invoiceNumber}</span>
                    <h4 className="font-bold text-white text-sm">{inv.companyName}</h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    inv.status === 'paid' 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {inv.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-slate-300 font-mono text-lg font-bold">
                  ₱{inv.totalAmountPHP.toLocaleString()}
                </div>

                {inv.status === 'paid' && (
                  <div className="text-[11px] text-slate-400 space-y-0.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div>Paid via: <strong className="text-emerald-400">{inv.paymentMethod}</strong></div>
                    <div>Ref: <span className="font-mono text-slate-300">{inv.referenceNumber}</span></div>
                    <div>Date: {inv.paidAt}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {revisionModalPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">Request Changes to Post</h3>
                <p className="text-xs text-slate-400">Describe what you would like the copywriter or designer to modify.</p>
              </div>
              <button 
                onClick={() => setRevisionModalPost(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Post:</span>
                <strong className="text-white text-xs">{revisionModalPost.title}</strong>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Your Revision Notes *</label>
                <textarea
                  id="revision-feedback-textarea"
                  rows={4}
                  required
                  placeholder="e.g. Please change the promo price from ₱150 to ₱180, and ensure our BGC branch address is prominent in the second carousel slide..."
                  value={revisionFeedbackText}
                  onChange={(e) => setRevisionFeedbackText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRevisionModalPost(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                id="submit-revision-btn"
                onClick={handleConfirmRevisions}
                disabled={!revisionFeedbackText.trim()}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-amber-600/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Revision to Agency</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
