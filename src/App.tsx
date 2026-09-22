import React, { useState, useEffect } from 'react';
import { 
  TeamRole, 
  ActiveView, 
  Lead, 
  Invoice, 
  ClientProfile, 
  TaskPost, 
  PipelineStage, 
  PostStatus,
  ContentTheme, 
  PhilippineEvent 
} from './types';
import { 
  initialClients, 
  initialLeads, 
  initialInvoices, 
  initialPosts 
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { PipelineView } from './components/PipelineView';
import { InvoicesOnboardingView } from './components/InvoicesOnboardingView';
import { ProductionWorkspaceView } from './components/ProductionWorkspaceView';
import { SocialPlannerView } from './components/SocialPlannerView';
import { ClientPortalView } from './components/ClientPortalView';
import { UnifiedInboxView } from './components/UnifiedInboxView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { ClientsView } from './components/ClientsView';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [postModalPreset, setPostModalPreset] = useState<{
    initialDate?: string;
    initialTheme?: ContentTheme;
    initialTitle?: string;
    initialCaption?: string;
    initialHashtags?: string[];
  } | null>(null);
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
    <div className="min-h-screen bg-[#080D1A] text-slate-100 flex font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Sleek Left Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        clients={clients}
        selectedClientId={selectedClientId}
        setSelectedClientId={setSelectedClientId}
        pendingClientApprovalCount={pendingClientApprovalCount}
        unreadMessagesCount={14}
        onOpenComposer={() => {
          setPostModalPreset(null);
          setShowCreatePostModal(true);
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          activeView={activeView}
          setActiveView={setActiveView}
          clients={clients}
          selectedClientId={selectedClientId}
          setSelectedClientId={setSelectedClientId}
          pendingClientApprovalCount={pendingClientApprovalCount}
          unreadMessagesCount={14}
          onOpenCreatePost={() => {
            setPostModalPreset(null);
            setShowCreatePostModal(true);
          }}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* View Content */}
        <main className="flex-1 px-6 pb-12 overflow-y-auto">
          {activeView === 'dashboard' && (
            <DashboardView
              currentRole={currentRole}
              leads={leads}
              invoices={invoices}
              clients={clients}
              posts={posts}
              setActiveView={setActiveView}
              onOpenCreatePost={() => {
                setPostModalPreset(null);
                setShowCreatePostModal(true);
              }}
              onSelectPost={(post) => {
                setSelectedPostForDetail(post);
                setActiveView('production_workspace');
              }}
              onApprovePost={handleClientApprovePost}
            />
          )}

          {activeView === 'social_planner' && (
            <SocialPlannerView
              posts={posts}
              clients={clients}
              onOpenCreatePost={() => {
                setPostModalPreset(null);
                setShowCreatePostModal(true);
              }}
              onSelectPost={(post) => {
                setSelectedPostForDetail(post);
                setActiveView('production_workspace');
              }}
              onScheduleForEvent={(event: PhilippineEvent) => {
                setPostModalPreset({
                  initialDate: event.date,
                  initialTheme: event.suggestedTheme,
                  initialTitle: `${event.name} Campaign`,
                  initialCaption: `${event.campaignHook}\n\n${event.description}`,
                  initialHashtags: event.hashtags,
                });
                setShowCreatePostModal(true);
              }}
            />
          )}

          {activeView === 'unified_inbox' && (
            <UnifiedInboxView />
          )}

          {activeView === 'pipeline' && (
            <PipelineView
              leads={leads}
              onUpdateLeadStage={handleUpdateLeadStage}
              onAddLead={handleAddLead}
              onConvertToInvoice={handleConvertToInvoice}
            />
          )}

          {activeView === 'clients' && (
            <ClientsView
              clients={clients}
              posts={posts}
              invoices={invoices}
              onSelectClientForPortal={(id) => {
                setSelectedClientId(id);
                setCurrentRole('client_stakeholder');
              }}
              setActiveView={setActiveView}
              onOpenCreatePost={() => {
                setPostModalPreset(null);
                setShowCreatePostModal(true);
              }}
            />
          )}

          {activeView === 'production_workspace' && (
            <ProductionWorkspaceView
              posts={posts}
              clients={clients}
              currentRole={currentRole}
              onUpdatePostStatus={handleUpdatePostStatus}
              onUpdatePost={handleUpdatePost}
              onOpenCreatePost={() => {
                setPostModalPreset(null);
                setShowCreatePostModal(true);
              }}
              selectedPost={selectedPostForDetail}
              setSelectedPost={setSelectedPostForDetail}
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

          {activeView === 'analytics' && (
            <AnalyticsView />
          )}

          {activeView === 'settings' && (
            <SettingsView
              currentRole={currentRole}
              setCurrentRole={setCurrentRole}
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

        {/* Global Modal: Create / Compose Post */}
        {showCreatePostModal && (
          <CreatePostModal
            clients={clients}
            onClose={() => {
              setShowCreatePostModal(false);
              setPostModalPreset(null);
            }}
            onCreatePost={handleCreatePost}
            initialDate={postModalPreset?.initialDate}
            initialTheme={postModalPreset?.initialTheme}
            initialTitle={postModalPreset?.initialTitle}
            initialCaption={postModalPreset?.initialCaption}
            initialHashtags={postModalPreset?.initialHashtags}
          />
        )}
      </div>

    </div>
  );
}
