import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Filter,
  MessageCircle,
  Paperclip,
  Check
} from 'lucide-react';
import { SocialPlatform } from '../types';

interface MessageThread {
  id: string;
  sender: string;
  avatar: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'viber';
  lastMessage: string;
  time: string;
  unread: boolean;
  clientBrand: string;
  conversation: {
    id: string;
    sender: string;
    text: string;
    time: string;
    isAgency: boolean;
  }[];
}

export const UnifiedInboxView: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeThreadId, setActiveThreadId] = useState('t-1');
  const [replyText, setReplyText] = useState('');

  const [threads, setThreads] = useState<MessageThread[]>([
    {
      id: 't-1',
      sender: 'Bea Alonzo-Tan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      platform: 'facebook',
      lastMessage: 'Hi po! Available pa po ba yung Payday Bundle discount code? Can I pay via GCash?',
      time: '10m ago',
      unread: true,
      clientBrand: 'Sari-Sari Express',
      conversation: [
        { id: 'm1', sender: 'Bea Alonzo-Tan', text: 'Good morning! Nakita ko yung post niyo about the Payday Sale.', time: '10:15 AM', isAgency: false },
        { id: 'm2', sender: 'Bea Alonzo-Tan', text: 'Hi po! Available pa po ba yung Payday Bundle discount code? Can I pay via GCash?', time: '10:16 AM', isAgency: false },
      ],
    },
    {
      id: 't-2',
      sender: 'Chef Marvin Agustin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      platform: 'instagram',
      lastMessage: 'Love the toasted cheese bun reels! Are you open for BGC pop-up catering collaboration?',
      time: '24m ago',
      unread: true,
      clientBrand: "Lola Nena's Kitchen",
      conversation: [
        { id: 'm1', sender: 'Chef Marvin Agustin', text: 'Hey team! Saw the latest kitchen reel.', time: '9:50 AM', isAgency: false },
        { id: 'm2', sender: 'Chef Marvin Agustin', text: 'Love the toasted cheese bun reels! Are you open for BGC pop-up catering collaboration?', time: '9:52 AM', isAgency: false },
      ],
    },
    {
      id: 't-3',
      sender: 'Kenjie Santos (Logistics Mgr)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      platform: 'viber',
      lastMessage: 'Inquire sana kami ng dedicated freight contract for our Cebu to Davao deliveries.',
      time: '1h ago',
      unread: true,
      clientBrand: 'BlueWave Logistics',
      conversation: [
        { id: 'm1', sender: 'Kenjie Santos', text: 'Magandang araw! From Cebu food distributors kami.', time: '9:00 AM', isAgency: false },
        { id: 'm2', sender: 'Kenjie Santos', text: 'Inquire sana kami ng dedicated freight contract for our Cebu to Davao deliveries.', time: '9:05 AM', isAgency: false },
      ],
    },
    {
      id: 't-4',
      sender: 'tiktok_user_ph88',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      platform: 'tiktok',
      lastMessage: 'Magkano shipping fee papuntang Pampanga via J&T or Lalamove? 🚚',
      time: '2h ago',
      unread: true,
      clientBrand: 'Sari-Sari Express',
      conversation: [
        { id: 'm1', sender: 'tiktok_user_ph88', text: 'Ganda nung kitchen organizing racks!', time: '8:10 AM', isAgency: false },
        { id: 'm2', sender: 'tiktok_user_ph88', text: 'Magkano shipping fee papuntang Pampanga via J&T or Lalamove? 🚚', time: '8:12 AM', isAgency: false },
      ],
    },
    {
      id: 't-5',
      sender: 'Dr. Clarisse Gomez',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      platform: 'facebook',
      lastMessage: 'Thank you! Successfully paid our monthly agency retainer via Maya QR invoice.',
      time: '3h ago',
      unread: false,
      clientBrand: 'GlowSkin Clinic PH',
      conversation: [
        { id: 'm1', sender: 'Dr. Clarisse Gomez', text: 'Hello Althea, just received the invoice for October.', time: '7:00 AM', isAgency: false },
        { id: 'm2', sender: 'Althea Cruz (CrossFlow)', text: 'Good morning Doc! Yes, Maya QR and BDO options are attached.', time: '7:15 AM', isAgency: true },
        { id: 'm3', sender: 'Dr. Clarisse Gomez', text: 'Thank you! Successfully paid our monthly agency retainer via Maya QR invoice.', time: '7:30 AM', isAgency: false },
      ],
    },
  ]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const filteredThreads = threads.filter(t => {
    const matchesPlatform = selectedPlatform === 'all' || t.platform === selectedPlatform;
    const matchesSearch = t.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.clientBrand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    const newMessage = {
      id: 'm-' + Date.now(),
      sender: 'Jam Cruz (Agency Director)',
      text: replyText,
      time: 'Just now',
      isAgency: true,
    };

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          unread: false,
          lastMessage: `You: ${replyText}`,
          time: 'Just now',
          conversation: [...t.conversation, newMessage],
        };
      }
      return t;
    }));

    setReplyText('');
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <span className="bg-[#1877F2] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">FB</span>;
      case 'instagram': return <span className="bg-gradient-to-tr from-[#F58529] to-[#DD2A7B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">IG</span>;
      case 'tiktok': return <span className="bg-black border border-slate-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">TT</span>;
      case 'viber': return <span className="bg-[#7360F2] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">V</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-[#0E1626] border border-[#1C283F] rounded-2xl overflow-hidden shadow-xl min-h-[600px] flex flex-col md:flex-row">
      {/* Thread List Column */}
      <div className="w-full md:w-80 lg:w-96 border-r border-[#1C283F] flex flex-col bg-[#0B111E]">
        {/* Header & Filter */}
        <div className="p-4 border-b border-[#1C283F] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Inbox className="w-4 h-4 text-teal-400" />
              <span>Unified Inbox</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F97316] text-white">
              14 Unread
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Philippine inquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0E1626] border border-[#1C283F] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Platform chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {['all', 'facebook', 'instagram', 'tiktok', 'viber'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wider transition-colors capitalize cursor-pointer ${
                  selectedPlatform === p
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-[#0E1626]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#182337] no-scrollbar">
          {filteredThreads.map((thread) => {
            const isActive = thread.id === activeThreadId;

            return (
              <div
                key={thread.id}
                onClick={() => {
                  setActiveThreadId(thread.id);
                  setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unread: false } : t));
                }}
                className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                  isActive ? 'bg-[#131E33]' : 'hover:bg-[#0E1626]'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={thread.avatar}
                    alt={thread.sender}
                    className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1">
                    {getPlatformIcon(thread.platform)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <div className="font-semibold text-xs text-white truncate">
                      {thread.sender}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {thread.time}
                    </span>
                  </div>

                  <div className="text-[10px] text-teal-400 font-medium">
                    {thread.clientBrand}
                  </div>

                  <p className="text-xs text-slate-300 truncate mt-0.5">
                    {thread.lastMessage}
                  </p>
                </div>

                {thread.unread && (
                  <span className="w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0 mt-1.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Conversation Column */}
      <div className="flex-1 flex flex-col bg-[#0E1626]">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#1C283F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={activeThread.avatar}
              alt={activeThread.sender}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-2 font-['Outfit']">
                <span>{activeThread.sender}</span>
                {getPlatformIcon(activeThread.platform)}
              </div>
              <div className="text-xs text-slate-400">
                Connected via <strong>{activeThread.clientBrand}</strong> • Response time &lt; 6 mins
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-medium">
              Active Sync
            </span>
          </div>
        </div>

        {/* Conversation Message History */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-[#0A101D]">
          {activeThread.conversation.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isAgency ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-md rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                  msg.isAgency
                    ? 'bg-teal-600 text-white rounded-br-none'
                    : 'bg-[#152136] text-slate-200 border border-[#1E2E4A] rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">
                {msg.sender} • {msg.time}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Taglish Canned Responses */}
        <div className="px-4 py-2 bg-[#0C1322] border-t border-[#1C283F] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex-shrink-0">
            Quick PH Canned Replies:
          </span>
          <button
            onClick={() => setReplyText('Hi po! Yes po, GCash and Maya QR are accepted. Here is the QR code for convenient checkout: ')}
            className="px-2.5 py-1 rounded-lg bg-[#141F33] hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 text-[11px] whitespace-nowrap transition-colors"
          >
            💰 GCash/Maya Payment
          </button>
          <button
            onClick={() => setReplyText('Good day! We ship nationwide via J&T and Lalamove. Orders above ₱999 are eligible for free shipping! 🚚')}
            className="px-2.5 py-1 rounded-lg bg-[#141F33] hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 text-[11px] whitespace-nowrap transition-colors"
          >
            📦 Shipping & J&T
          </button>
          <button
            onClick={() => setReplyText('Salamat po sa pag-inquire! Our Manila and Cebu team is currently reviewing this. Will follow up in a bit! ✨')}
            className="px-2.5 py-1 rounded-lg bg-[#141F33] hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 text-[11px] whitespace-nowrap transition-colors"
          >
            🙏 Salamat / Reviewing
          </button>
        </div>

        {/* Reply Input Bar */}
        <div className="p-3 bg-[#0E1626] border-t border-[#1C283F] flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your Taglish or English reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendReply();
            }}
            className="flex-1 bg-[#090F1C] border border-[#1C283F] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          <button
            onClick={handleSendReply}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
