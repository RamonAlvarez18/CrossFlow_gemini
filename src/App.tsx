import React, { useState, useEffect } from 'react';
import { 
  TeamRole, 
  ActiveView, 
  Lead, 
  Invoice, 
  ClientProfile, 
  TaskPost, 
  PipelineStage, 
  PostStatus 
} from './types';
import { 
  initialClients, 
  initialLeads, 
  initialInvoices, 
  initialPosts 
} from './data/mockData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { PipelineView } from './components/PipelineView';
import { InvoicesOnboardingView } from './components/InvoicesOnboardingView';
import { ProductionWorkspaceView } from './components/ProductionWorkspaceView';
import { SocialPlannerView } from './components/SocialPlannerView';
import { ClientPortalView } from './components/ClientPortalView';
import { CreatePostModal } from './components/CreatePostModal';

export default function App() {
  // Local storage persisted state
  const [clients, setClients] = useState<ClientProfile[]>(() => {
    const saved = localStorage.getItem('cf_clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('cf_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('cf_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [posts, setPosts] = useState<TaskPost[]>(() => {
    const saved = localStorage.getItem('cf_posts');
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [currentRole, setCurrentRole] = useState<TeamRole>('agency_admin');
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string>('client-1');

  // Modals state
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<TaskPost | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('cf_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('cf_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('cf_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('cf_posts', JSON.stringify(posts));
  }, [posts]);

  // Counts for badges
  const pendingClientApprovalCount = posts.filter(p => p.status === 'pending_client_approval').length;
  const pendingInternalQACount = posts.filter(p => p.status === 'internal_qa').length;
  const unpaidInvoiceCount = invoices.filter(i => i.status === 'unpaid').length;

  // Handlers for Leads
  const handleUpdateLeadStage = (leadId: string, newStage: PipelineStage) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
  };

  const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'createdAt' | 'lastActivity'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: 'lead-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      lastActivity: 'Lead created via Pipeline manager',
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const handleConvertToInvoice = (lead: Lead) => {
    // Check if an invoice already exists
    const existing = invoices.find(i => i.companyName.toLowerCase() === lead.company.toLowerCase());
    if (existing) {
      setActiveView('invoices_onboarding');
      return;
    }

    const newInvoice: Invoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      leadId: lead.id,
      clientName: lead.name,
      companyName: lead.company,
      items: [
        {
          id: 'item-1',
          description: `Comprehensive Social Media Growth Package (${lead.industry})`,
          qty: 1,
          unitPricePHP: lead.dealValuePHP,
        }
      ],
      totalAmountPHP: lead.dealValuePHP,
      status: 'unpaid',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      issuedDate: new Date().toISOString().split('T')[0],
    };

    setInvoices(prev => [newInvoice, ...prev]);
    // Move lead to closed_won
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, stage: 'closed_won' } : l));
    setActiveView('invoices_onboarding');
  };

  // Handlers for Invoices & Onboarding
  const handlePayInvoice = (
    invoiceId: string, 
    paymentMethod: 'GCash' | 'Maya QR' | 'BDO / BPI Bank Transfer' | 'Credit Card', 
    refNum: string
  ) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          status: 'paid',
          paymentMethod,
          referenceNumber: refNum,
          paidAt: new Date().toISOString().split('T')[0],
        };
      }
      return inv;
    }));
  };

  const handleCompleteOnboarding = (newClient: ClientProfile) => {
    setClients(prev => {
      const filtered = prev.filter(c => c.companyName.toLowerCase() !== newClient.companyName.toLowerCase());
      return [newClient, ...filtered];
    });
    setSelectedClientId(newClient.id);
  };

  // Handlers for Tasks / Posts
  const handleUpdatePostStatus = (postId: string, newStatus: PostStatus) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, status: newStatus } : p));
  };

  const handleUpdatePost = (updatedPost: TaskPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const handleCreatePost = (newPostData: Omit<TaskPost, 'id' | 'revisionRound' | 'internalComments' | 'qaChecklist'>) => {
    const newPost: TaskPost = {
      ...newPostData,
      id: 'post-' + Date.now(),
      revisionRound: 1,
      qaChecklist: {
        spellingAndGrammar: false,
        brandGuidelinesFollowed: false,
        aspectRatioCorrect: false,
        linksAndDisclaimersVerified: false,
      },
      internalComments: [
        {
          id: 'c-' + Date.now(),
          authorName: 'Campaign Dispatcher',
          role: 'agency_admin',
          text: 'Campaign initiated and routed to assigned team members.',
          timestamp: 'Just now',
        }
      ],
    };

    setPosts(prev => [newPost, ...prev]);
    setActiveView('production_workspace');
  };

  // Client Portal Actions
  const handleClientApprovePost = (postId: string) => {
    const authorName = clients.find(c => c.id === selectedClientId)?.contactPerson || 'Client';
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          status: 'scheduled',
          clientFeedbackNotes: undefined,
          internalComments: [
            ...p.internalComments,
            {
              id: 'c-' + Date.now(),
              authorName: `${authorName} (Client Stakeholder)`,
              role: 'client_stakeholder',
              text: 'Approved! Locked for publishing.',
              timestamp: 'Just now',
              isClientNote: true,
            }
          ]
        };
      }
      return p;
    }));
  };

  const handleClientRequestRevisions = (postId: string, feedback: string) => {
    const authorName = clients.find(c => c.id === selectedClientId)?.contactPerson || 'Client';
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          status: 'changes_requested',
          revisionRound: p.revisionRound + 1,
          clientFeedbackNotes: feedback,
          qaChecklist: {
            ...p.qaChecklist,
            brandGuidelinesFollowed: false,
          },
          internalComments: [
            ...p.internalComments,
            {
              id: 'c-' + Date.now(),
              authorName: `${authorName} (Client Stakeholder)`,
              role: 'client_stakeholder',
              text: `[REVISION REQUESTED]: ${feedback}`,
              timestamp: 'Just now',
              isClientNote: true,
            }
          ]
        };
      }
      return p;
    }));
  };

  const handleSendClientNote = (postId: string, note: string) => {
    const authorName = clients.find(c => c.id === selectedClientId)?.contactPerson || 'Client';
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          internalComments: [
            ...p.internalComments,
            {
              id: 'c-' + Date.now(),
              authorName,
              role: 'client_stakeholder',
              text: note,
              timestamp: 'Just now',
              isClientNote: true,
            }
          ]
        };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeView={activeView}
        setActiveView={setActiveView}
        clients={clients}
        selectedClientId={selectedClientId}
        setSelectedClientId={setSelectedClientId}
        pendingClientApprovalCount={pendingClientApprovalCount}
        unreadNotesCount={1}
        onOpenCreatePost={() => setShowCreatePostModal(true)}
      />

      {/* Primary Navigation */}
      <Navigation
        activeView={activeView}
        setActiveView={setActiveView}
        pendingClientApprovalCount={pendingClientApprovalCount}
        pendingInternalQACount={pendingInternalQACount}
        unpaidInvoiceCount={unpaidInvoiceCount}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeView === 'dashboard' && (
          <DashboardView
            currentRole={currentRole}
            leads={leads}
            invoices={invoices}
            clients={clients}
            posts={posts}
            setActiveView={setActiveView}
            onOpenCreatePost={() => setShowCreatePostModal(true)}
            onSelectPost={(post) => {
              setSelectedPostForDetail(post);
              setActiveView('production_workspace');
            }}
            onOpenNewLeadModal={() => setActiveView('pipeline')}
          />
        )}

        {activeView === 'pipeline' && (
          <PipelineView
            leads={leads}
            onUpdateLeadStage={handleUpdateLeadStage}
            onAddLead={handleAddLead}
            onConvertToInvoice={handleConvertToInvoice}
          />
        )}

        {activeView === 'invoices_onboarding' && (
          <InvoicesOnboardingView
            invoices={invoices}
            clients={clients}
            onPayInvoice={handlePayInvoice}
            onCompleteOnboarding={handleCompleteOnboarding}
            setActiveView={setActiveView}
            setSelectedClientId={setSelectedClientId}
          />
        )}

        {activeView === 'production_workspace' && (
          <ProductionWorkspaceView
            posts={posts}
            clients={clients}
            currentRole={currentRole}
            onUpdatePostStatus={handleUpdatePostStatus}
            onUpdatePost={handleUpdatePost}
            onOpenCreatePost={() => setShowCreatePostModal(true)}
            selectedPost={selectedPostForDetail}
            setSelectedPost={setSelectedPostForDetail}
          />
        )}

        {activeView === 'social_planner' && (
          <SocialPlannerView
            posts={posts}
            clients={clients}
            onOpenCreatePost={() => setShowCreatePostModal(true)}
            onSelectPost={(post) => {
              setSelectedPostForDetail(post);
              setActiveView('production_workspace');
            }}
          />
        )}

        {activeView === 'client_portal' && (
          <ClientPortalView
            clients={clients}
            selectedClientId={selectedClientId}
            setSelectedClientId={setSelectedClientId}
            posts={posts}
            invoices={invoices}
            onApprovePost={handleClientApprovePost}
            onRequestRevisions={handleClientRequestRevisions}
            onSendClientNote={handleSendClientNote}
          />
        )}
      </main>

      {/* Create / Compose Post Modal */}
      {showCreatePostModal && (
        <CreatePostModal
          clients={clients}
          onClose={() => setShowCreatePostModal(false)}
          onCreatePost={handleCreatePost}
        />
      )}

      {/* Enterprise Agency Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F17] py-4 px-6 text-xs text-slate-400">
        <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200 font-['Outfit']">CrossFlow Enterprise Agency Management</span>
            <span>•</span>
            <span>Tailored for Philippine Digital Agencies & Creators</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Supported Gateways: <strong>GCash • Maya • BDO • BPI • QR Ph</strong></span>
            <span>•</span>
            <span className="text-emerald-400">PHT Timezone Synchronized (UTC+8)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
