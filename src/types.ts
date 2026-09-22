export type TeamRole = 
  | 'agency_admin' 
  | 'account_manager' 
  | 'copywriter' 
  | 'designer' 
  | 'qa_specialist' 
  | 'client_stakeholder';

export type LeadSource = 
  | 'Facebook Ads' 
  | 'TikTok Organic/Ads' 
  | 'Website Form' 
  | 'Google Ads' 
  | 'Referral / Partner' 
  | 'Instagram DM';

export type PipelineStage = 
  | 'inbound' 
  | 'discovery' 
  | 'proposal_sent' 
  | 'negotiation' 
  | 'closed_won';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  stage: PipelineStage;
  dealValuePHP: number;
  assignedTo: string;
  notes: string;
  industry: string;
  createdAt: string;
  lastActivity: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  unitPricePHP: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  leadId?: string;
  clientName: string;
  companyName: string;
  items: InvoiceItem[];
  totalAmountPHP: number;
  status: 'unpaid' | 'paid' | 'overdue';
  dueDate: string;
  issuedDate: string;
  paymentMethod?: 'GCash' | 'Maya QR' | 'BDO / BPI Bank Transfer' | 'Credit Card';
  paidAt?: string;
  referenceNumber?: string;
}

export interface ClientProfile {
  id: string;
  companyName: string;
  brandTagline: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  brandColors: string[];
  socialHandles: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
  };
  toneOfVoice: string;
  targetAudience: string;
  monthlyRetainerPHP: number;
  onboardingCompleted: boolean;
  onboardingDate: string;
  portalAccessKey: string;
  avatarUrl: string;
}

export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'youtube';

export type PostStatus = 
  | 'draft_idea'
  | 'copywriting'
  | 'designing'
  | 'internal_qa'
  | 'pending_client_approval'
  | 'changes_requested'
  | 'client_approved'
  | 'scheduled'
  | 'published';

export interface PostComment {
  id: string;
  authorName: string;
  role: TeamRole;
  text: string;
  timestamp: string;
  isClientNote?: boolean;
}

export interface TaskPost {
  id: string;
  clientId: string;
  campaignName: string;
  title: string;
  caption: string;
  hashtags: string[];
  mediaUrls: string[];
  mediaType: 'image' | 'carousel' | 'video';
  platforms: SocialPlatform[];
  status: PostStatus;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  timezone: string; // e.g. "PHT (Asia/Manila)"
  assignedCopywriter: string;
  assignedDesigner: string;
  assignedQA: string;
  clientFeedbackNotes?: string;
  internalComments: PostComment[];
  revisionRound: number;
  qaChecklist: {
    spellingAndGrammar: boolean;
    brandGuidelinesFollowed: boolean;
    aspectRatioCorrect: boolean;
    linksAndDisclaimersVerified: boolean;
  };
  metrics?: {
    reach: number;
    engagement: number;
    likes: number;
    shares: number;
  };
}

export type ActiveView = 
  | 'dashboard'
  | 'pipeline'
  | 'invoices_onboarding'
  | 'production_workspace'
  | 'social_planner'
  | 'client_portal';
