import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  DollarSign, 
  Phone, 
  Mail, 
  Calendar, 
  Share2, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles,
  ChevronRight,
  Receipt,
  X
} from 'lucide-react';
import { Lead, LeadSource, PipelineStage } from '../types';

interface PipelineViewProps {
  leads: Lead[];
  onUpdateLeadStage: (leadId: string, newStage: PipelineStage) => void;
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'lastActivity'>) => void;
  onConvertToInvoice: (lead: Lead) => void;
}

const STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'inbound', label: 'Inbound Inquiries', color: 'border-blue-500/40 text-blue-300' },
  { id: 'discovery', label: 'Discovery Call', color: 'border-indigo-500/40 text-indigo-300' },
  { id: 'proposal_sent', label: 'Proposal Sent', color: 'border-amber-500/40 text-amber-300' },
  { id: 'negotiation', label: 'Contract Negotiation', color: 'border-purple-500/40 text-purple-300' },
  { id: 'closed_won', label: 'Closed Won (Ready to Bill)', color: 'border-emerald-500/40 text-emerald-300' },
];

const SOURCE_TAGS: Record<LeadSource, { bg: string; text: string; icon: string }> = {
  'Facebook Ads': { bg: 'bg-blue-600/20 border-blue-500/40', text: 'text-blue-300', icon: 'FB' },
  'TikTok Organic/Ads': { bg: 'bg-pink-600/20 border-pink-500/40', text: 'text-pink-300', icon: 'TT' },
  'Website Form': { bg: 'bg-violet-600/20 border-violet-500/40', text: 'text-violet-300', icon: 'WEB' },
  'Google Ads': { bg: 'bg-emerald-600/20 border-emerald-500/40', text: 'text-emerald-300', icon: 'GGL' },
  'Referral / Partner': { bg: 'bg-amber-600/20 border-amber-500/40', text: 'text-amber-300', icon: 'REF' },
  'Instagram DM': { bg: 'bg-rose-600/20 border-rose-500/40', text: 'text-rose-300', icon: 'IG' },
};

export const PipelineView: React.FC<PipelineViewProps> = ({
  leads,
  onUpdateLeadStage,
  onAddLead,
  onConvertToInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);

  // Form state for new lead
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSource, setNewSource] = useState<LeadSource>('Facebook Ads');
  const [newDealValue, setNewDealValue] = useState('75000');
  const [newIndustry, setNewIndustry] = useState('E-commerce / Retail');
  const [newAssignedTo, setNewAssignedTo] = useState('Althea Cruz (Account Exec)');
  const [newNotes, setNewNotes] = useState('');

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = selectedSource === 'all' || l.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  const totalValue = filteredLeads.reduce((acc, curr) => acc + curr.dealValuePHP, 0);

  const handleSubmitNewLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newName) return;

    onAddLead({
      name: newName,
      company: newCompany,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '.')}@example.ph`,
      phone: newPhone || '+63 917 000 0000',
      source: newSource,
      stage: 'inbound',
      dealValuePHP: Number(newDealValue) || 50000,
      assignedTo: newAssignedTo,
      notes: newNotes || 'Inbound prospect interested in Philippine social media retainer.',
      industry: newIndustry,
    });

    // Reset form
    setNewName('');
    setNewCompany('');
    setNewEmail('');
    setNewPhone('');
    setNewNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827]/90 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              GoHighLevel Pipeline Flow
            </span>
            <span className="text-xs text-slate-400">Total Active Pipeline: <strong className="text-emerald-400 font-mono">₱{totalValue.toLocaleString()}</strong></span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-['Outfit'] mt-1">
            Client Acquisition & Lead Tracking
          </h1>
          <p className="text-xs text-slate-300">
            Track lead sources from Facebook Ads, TikTok campaigns, website forms, and referrals through to invoice issuance.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="pipeline-search-input"
              type="text"
              placeholder="Search leads, brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48"
            />
          </div>

          <select
            id="pipeline-source-filter"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Lead Sources</option>
            <option value="Facebook Ads">Facebook Ads</option>
            <option value="TikTok Organic/Ads">TikTok Organic/Ads</option>
            <option value="Website Form">Website Form</option>
            <option value="Google Ads">Google Ads</option>
            <option value="Instagram DM">Instagram DM</option>
            <option value="Referral / Partner">Referral / Partner</option>
          </select>

          <button
            id="pipeline-btn-add-lead"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
          const stageTotal = stageLeads.reduce((sum, l) => sum + l.dealValuePHP, 0);

          return (
            <div key={stage.id} className="bg-[#111827]/60 border border-slate-800/80 rounded-2xl p-3 flex flex-col min-w-[280px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div>
                  <h3 className={`font-semibold text-xs ${stage.color}`}>{stage.label}</h3>
                  <div className="text-[10px] text-slate-400 font-mono">
                    ₱{stageTotal.toLocaleString()} ({stageLeads.length})
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              </div>

              {/* Lead Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-1">
                {stageLeads.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-600 border border-dashed border-slate-800/60 rounded-xl">
                    No leads in this stage
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const sourceInfo = SOURCE_TAGS[lead.source] || { bg: 'bg-slate-800 border-slate-700', text: 'text-slate-300', icon: 'SRC' };
                    return (
                      <div
                        key={lead.id}
                        id={`lead-card-${lead.id}`}
                        onClick={() => setSelectedLeadForDetail(lead)}
                        className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer shadow-sm group hover:-translate-y-0.5"
                      >
                        {/* Source Tag & Value */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${sourceInfo.bg} ${sourceInfo.text}`}>
                            {lead.source}
                          </span>
                          <span className="font-bold text-xs text-emerald-400 font-mono">
                            ₱{lead.dealValuePHP.toLocaleString()}
                          </span>
                        </div>

                        {/* Company & Contact */}
                        <h4 className="font-semibold text-xs text-slate-100 group-hover:text-indigo-300 transition-colors">
                          {lead.company}
                        </h4>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{lead.name}</span>
                          <span>•</span>
                          <span className="truncate">{lead.industry}</span>
                        </div>

                        {/* Note preview */}
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-2 bg-slate-950/50 p-1.5 rounded border border-slate-900">
                          {lead.notes}
                        </p>

                        {/* Footer & Actions */}
                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{lead.assignedTo.split(' ')[0]}</span>
                          
                          {/* Quick Stage Mover or Win Deal */}
                          <div className="flex items-center gap-1">
                            {stage.id === 'closed_won' ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onConvertToInvoice(lead);
                                }}
                                className="px-2 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 font-semibold flex items-center gap-1 transition-all"
                              >
                                <Receipt className="w-3 h-3" />
                                <span>Issue Invoice</span>
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const currentIndex = STAGES.findIndex(s => s.id === stage.id);
                                  if (currentIndex < STAGES.length - 1) {
                                    onUpdateLeadStage(lead.id, STAGES[currentIndex + 1].id);
                                  }
                                }}
                                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 border border-slate-700 flex items-center gap-0.5 transition-colors"
                                title="Move to next stage"
                              >
                                <span>Advance</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
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

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">Add Inbound Client Lead</h3>
                <p className="text-xs text-slate-400">Capture lead from Meta Ads, TikTok, website inquiries, or direct contact.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewLead} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Company / Brand Name *</label>
                  <input
                    id="new-lead-company"
                    type="text"
                    required
                    placeholder="e.g. Boracay Sands Resort"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Contact Person Name *</label>
                  <input
                    id="new-lead-name"
                    type="text"
                    required
                    placeholder="e.g. Maria Santos"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Lead Source (Origin) *</label>
                  <select
                    id="new-lead-source"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value as LeadSource)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Facebook Ads">Facebook Ads</option>
                    <option value="TikTok Organic/Ads">TikTok Organic/Ads</option>
                    <option value="Website Form">Website Form</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Instagram DM">Instagram DM</option>
                    <option value="Referral / Partner">Referral / Partner</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Estimated Monthly Deal (PHP ₱) *</label>
                  <input
                    id="new-lead-value"
                    type="number"
                    step="5000"
                    value={newDealValue}
                    onChange={(e) => setNewDealValue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="contact@brand.ph"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Philippine Phone / Mobile</label>
                  <input
                    type="text"
                    placeholder="+63 917 123 4567"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Industry / Niche</label>
                <input
                  type="text"
                  placeholder="e.g. Specialty Food, Real Estate, Health Clinic"
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Requirements & Discovery Notes</label>
                <textarea
                  rows={3}
                  placeholder="Client wants 20 social posts + 8 TikTok videos per month targeting Metro Manila..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="new-lead-submit-btn"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Create & Track Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Detail & Stage Changer Modal */}
      {selectedLeadForDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {selectedLeadForDetail.source}
                </span>
                <h3 className="text-lg font-bold text-white font-['Outfit'] mt-1">{selectedLeadForDetail.company}</h3>
                <p className="text-xs text-slate-400">{selectedLeadForDetail.name} • {selectedLeadForDetail.industry}</p>
              </div>
              <button 
                onClick={() => setSelectedLeadForDetail(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Monthly Contract Value:</span>
                <span className="text-emerald-400 font-bold font-mono text-base">₱{selectedLeadForDetail.dealValuePHP.toLocaleString()} / mo</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Phone</span>
                  <span className="font-mono">{selectedLeadForDetail.phone}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Email</span>
                  <span className="truncate block">{selectedLeadForDetail.email}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Latest Activity / Notes</span>
                <p className="text-slate-200">{selectedLeadForDetail.notes}</p>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Move Pipeline Stage</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {STAGES.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        onUpdateLeadStage(selectedLeadForDetail.id, st.id);
                        setSelectedLeadForDetail({ ...selectedLeadForDetail, stage: st.id });
                      }}
                      className={`p-2 rounded-lg text-[11px] font-medium border text-left transition-all ${
                        selectedLeadForDetail.stage === st.id
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedLeadForDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  onConvertToInvoice(selectedLeadForDetail);
                  setSelectedLeadForDetail(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Issue Invoice & Start Onboarding</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
