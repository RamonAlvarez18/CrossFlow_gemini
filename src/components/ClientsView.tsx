import React from 'react';
import { 
  Users, 
  ExternalLink, 
  ShieldCheck, 
  UserCheck, 
  Plus, 
  Calendar, 
  Clock, 
  Mail, 
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ClientProfile, TaskPost, Invoice, ActiveView } from '../types';

interface ClientsViewProps {
  clients: ClientProfile[];
  posts: TaskPost[];
  invoices: Invoice[];
  onSelectClientForPortal: (clientId: string) => void;
  setActiveView: (view: ActiveView) => void;
  onOpenCreatePost: () => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  posts,
  invoices,
  onSelectClientForPortal,
  setActiveView,
  onOpenCreatePost,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-[#0E1626] border border-[#1C283F] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-400" />
            <span>Active Clients & Approval Portals</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage client profiles, dedicated client portal links, brand guidelines, and monthly retainers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('pipeline')}
            className="px-3.5 py-2 rounded-xl bg-[#141F33] hover:bg-[#1B2944] text-slate-200 text-xs font-semibold border border-[#1C283F] transition-colors cursor-pointer"
          >
            + Onboard from CRM
          </button>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients.map((client) => {
          const clientPosts = posts.filter(p => p.clientId === client.id);
          const pendingApproval = clientPosts.filter(p => p.status === 'pending_client_approval');
          const clientInvoices = invoices.filter(i => i.clientName === client.contactPerson || i.companyName === client.companyName);
          const hasUnpaidInvoice = clientInvoices.some(i => i.status === 'unpaid');

          return (
            <div 
              key={client.id}
              className="bg-[#0E1626] border border-[#1C283F] hover:border-[#2A3C5E] rounded-2xl p-5 space-y-4 transition-all shadow-sm"
            >
              {/* Client Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={client.avatarUrl}
                    alt={client.companyName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white font-['Outfit']">
                      {client.companyName}
                    </h3>
                    <p className="text-xs text-teal-400 font-medium">
                      {client.industry} • {client.brandTagline}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-white font-mono bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2.5 py-1 rounded-xl">
                  ₱{client.monthlyRetainerPHP.toLocaleString()}/mo
                </span>
              </div>

              {/* Contact Info & Handles */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-[#090F1C] p-3 rounded-xl border border-[#182337]">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Contact Person</span>
                  <span className="font-semibold text-white">{client.contactPerson}</span>
                  <span className="text-slate-400 text-[11px] block">{client.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tone of Voice</span>
                  <span className="text-slate-300 text-[11px] block leading-tight">{client.toneOfVoice}</span>
                </div>
              </div>

              {/* Status Chips */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  {pendingApproval.length > 0 ? (
                    <span className="px-2.5 py-1 rounded-lg bg-[#37230F] text-[#FB923C] border border-[#EA580C]/30 text-[11px] font-medium">
                      {pendingApproval.length} Sign-off Pending
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-[#0B2A22] text-[#34D399] border border-[#059669]/30 text-[11px] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>All Approved</span>
                    </span>
                  )}

                  {hasUnpaidInvoice && (
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                      Invoice Due
                    </span>
                  )}
                </div>

                {/* Portal Access Button */}
                <button
                  onClick={() => {
                    onSelectClientForPortal(client.id);
                    setActiveView('client_portal');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Launch Portal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
