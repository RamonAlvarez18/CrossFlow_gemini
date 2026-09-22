import React, { useState } from 'react';
import { 
  Receipt, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  CreditCard, 
  QrCode, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink, 
  UserCheck, 
  Check, 
  Palette, 
  Share2, 
  Send,
  X,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Invoice, ClientProfile, ActiveView } from '../types';

interface InvoicesOnboardingViewProps {
  invoices: Invoice[];
  clients: ClientProfile[];
  onPayInvoice: (invoiceId: string, paymentMethod: 'GCash' | 'Maya QR' | 'BDO / BPI Bank Transfer' | 'Credit Card', refNum: string) => void;
  onCompleteOnboarding: (newClient: ClientProfile) => void;
  setActiveView: (view: ActiveView) => void;
  setSelectedClientId: (id: string) => void;
}

export const InvoicesOnboardingView: React.FC<InvoicesOnboardingViewProps> = ({
  invoices,
  clients,
  onPayInvoice,
  onCompleteOnboarding,
  setActiveView,
  setSelectedClientId,
}) => {
  const [selectedInvoiceToPay, setSelectedInvoiceToPay] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'GCash' | 'Maya QR' | 'BDO / BPI Bank Transfer' | 'Credit Card'>('GCash');
  const [simulatedRef, setSimulatedRef] = useState('GCASH-' + Math.floor(100000 + Math.random() * 900000));
  
  // Onboarding Wizard State
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [targetInvoiceForOnboarding, setTargetInvoiceForOnboarding] = useState<Invoice | null>(null);

  // Wizard fields
  const [obCompany, setObCompany] = useState('');
  const [obContact, setObContact] = useState('');
  const [obEmail, setObEmail] = useState('');
  const [obPhone, setObPhone] = useState('+63 917 ');
  const [obTagline, setObTagline] = useState('');
  const [obIndustry, setObIndustry] = useState('Food & Beverage');
  const [obPrimaryColor, setObPrimaryColor] = useState('#6366F1');
  const [obSecondaryColor, setObSecondaryColor] = useState('#10B981');
  const [obTone, setObTone] = useState('Warm, relatable Taglish, vibrant & modern');
  const [obTargetAudience, setObTargetAudience] = useState('Metro Manila young professionals & college students');
  const [obFacebook, setObFacebook] = useState('@brandnameph');
  const [obInstagram, setObInstagram] = useState('@brandname.ph');
  const [obTikTok, setObTikTok] = useState('@brandnameph');
  const [obMonthlyRetainer, setObMonthlyRetainer] = useState(60000);

  const handleOpenPayModal = (inv: Invoice) => {
    setSelectedInvoiceToPay(inv);
    setSimulatedRef(paymentMethod.replace(/\s+/g, '').toUpperCase() + '-' + Math.floor(100000 + Math.random() * 900000));
  };

  const handleConfirmPayment = () => {
    if (!selectedInvoiceToPay) return;
    
    onPayInvoice(selectedInvoiceToPay.id, paymentMethod, simulatedRef);
    
    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }

    const currentInv = selectedInvoiceToPay;
    setSelectedInvoiceToPay(null);

    // Check if client already exists in clients array
    const existingClient = clients.find(c => c.companyName.toLowerCase() === currentInv.companyName.toLowerCase());
    if (!existingClient) {
      // Auto-prompt onboarding!
      setTargetInvoiceForOnboarding(currentInv);
      setObCompany(currentInv.companyName);
      setObContact(currentInv.clientName);
      setObMonthlyRetainer(currentInv.totalAmountPHP);
      setOnboardingStep(1);
      setShowOnboardingWizard(true);
    }
  };

  const handleFinishOnboarding = () => {
    const portalKey = 'CF-' + obCompany.substring(0, 3).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newClient: ClientProfile = {
      id: 'client-' + Date.now(),
      companyName: obCompany,
      brandTagline: obTagline || 'Authentic Philippine Quality Experience',
      industry: obIndustry,
      contactPerson: obContact,
      email: obEmail || `${obContact.toLowerCase().replace(/\s+/g, '.')}@${obCompany.toLowerCase().replace(/\s+/g, '')}.ph`,
      phone: obPhone,
      brandColors: [obPrimaryColor, obSecondaryColor, '#0F172A'],
      socialHandles: {
        facebook: obFacebook,
        instagram: obInstagram,
        tiktok: obTikTok,
      },
      toneOfVoice: obTone,
      targetAudience: obTargetAudience,
      monthlyRetainerPHP: obMonthlyRetainer,
      onboardingCompleted: true,
      onboardingDate: new Date().toISOString().split('T')[0],
      portalAccessKey: portalKey,
      avatarUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=150&auto=format&fit=crop&q=80',
    };

    onCompleteOnboarding(newClient);
    setSelectedClientId(newClient.id);
    setShowOnboardingWizard(false);

    try {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827]/90 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              GoHighLevel Automated Workflow
            </span>
            <span className="text-xs text-slate-400">Payment Unlocks Client Onboarding & Portal Access</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-['Outfit'] mt-1">
            Client Invoicing & Portal Onboarding
          </h1>
          <p className="text-xs text-slate-300">
            Once a deal is closed and the initial invoice is paid via GCash, Maya, or Bank Transfer, the system triggers the brand onboarding questionnaire and provisions the Client Approval Portal.
          </p>
        </div>

        <button
          onClick={() => {
            setTargetInvoiceForOnboarding(null);
            setObCompany('Isla Del Mar Resorts Palawan');
            setObContact('Patricia Gomez');
            setObMonthlyRetainer(120000);
            setOnboardingStep(1);
            setShowOnboardingWizard(true);
          }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Onboarding Wizard</span>
        </button>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm font-['Outfit'] flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-400" />
            Active Agency Invoices (PHP ₱)
          </h3>
          <span className="text-xs text-slate-400">
            {invoices.filter(i => i.status === 'paid').length} Paid • {invoices.filter(i => i.status === 'unpaid').length} Pending Payment
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoices.map((inv) => {
            const isPaid = inv.status === 'paid';
            const matchedClient = clients.find(c => c.companyName.toLowerCase() === inv.companyName.toLowerCase());

            return (
              <div 
                key={inv.id} 
                className={`bg-[#111827]/80 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                  isPaid ? 'border-slate-800' : 'border-amber-500/40 shadow-lg shadow-amber-500/5'
                }`}
              >
                <div>
                  {/* Top Status & Number */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">{inv.invoiceNumber}</span>
                      <h4 className="font-bold text-sm text-slate-100">{inv.companyName}</h4>
                      <span className="text-xs text-slate-400">{inv.clientName}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                      isPaid 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                    }`}>
                      {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {isPaid ? 'PAID' : 'PAYMENT DUE'}
                    </span>
                  </div>

                  {/* Line Items */}
                  <div className="py-3 space-y-2 text-xs border-b border-slate-800/80">
                    {inv.items.map(item => (
                      <div key={item.id} className="flex justify-between items-start text-slate-300">
                        <span className="text-slate-400 pr-2 line-clamp-1">{item.description}</span>
                        <span className="font-mono text-slate-200 flex-shrink-0">₱{item.unitPricePHP.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Due Date */}
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Amount</span>
                      <span className="text-lg font-bold text-white font-mono">
                        ₱{inv.totalAmountPHP.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">{isPaid ? 'Paid Date' : 'Due Date'}</span>
                      <span className="text-xs font-mono text-slate-300">
                        {isPaid ? inv.paidAt : inv.dueDate}
                      </span>
                    </div>
                  </div>

                  {/* Payment Details if Paid */}
                  {isPaid && (
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1 mb-3">
                      <div className="flex justify-between text-slate-400">
                        <span>Channel:</span>
                        <strong className="text-emerald-400">{inv.paymentMethod}</strong>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Ref Number:</span>
                        <span className="font-mono text-slate-300">{inv.referenceNumber}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Button */}
                <div className="pt-2">
                  {!isPaid ? (
                    <button
                      id={`pay-btn-${inv.id}`}
                      onClick={() => handleOpenPayModal(inv)}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Simulate Payment (GCash / Maya / Bank)</span>
                    </button>
                  ) : matchedClient?.onboardingCompleted ? (
                    <button
                      onClick={() => {
                        setSelectedClientId(matchedClient.id);
                        setActiveView('client_portal');
                      }}
                      className="w-full py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Open Client Portal ({matchedClient.portalAccessKey})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setTargetInvoiceForOnboarding(inv);
                        setObCompany(inv.companyName);
                        setObContact(inv.clientName);
                        setObMonthlyRetainer(inv.totalAmountPHP);
                        setOnboardingStep(1);
                        setShowOnboardingWizard(true);
                      }}
                      className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Kickoff Client Onboarding</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Onboarded Clients List */}
      <div className="bg-[#111827]/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-semibold text-white text-sm font-['Outfit']">
              Active Onboarded Clients & Portals
            </h3>
            <p className="text-xs text-slate-400">
              Clients who have completed the onboarding wizard, brand questionnaire, and have live portal approval access.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-semibold">
            {clients.length} Retainers Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clients.map((c) => (
            <div key={c.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <img 
                  src={c.avatarUrl} 
                  alt={c.companyName} 
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700" 
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-xs text-white">{c.companyName}</h4>
                  <span className="text-[11px] text-indigo-400 block">{c.industry}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <div className="flex justify-between">
                  <span>Portal Access Key:</span>
                  <span className="font-mono text-emerald-400 font-bold">{c.portalAccessKey}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contact:</span>
                  <span className="text-slate-200">{c.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Retainer:</span>
                  <span className="font-mono text-slate-200">₱{c.monthlyRetainerPHP.toLocaleString()}</span>
                </div>
              </div>

              {/* Brand Colors preview */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 mr-1">Brand Palette:</span>
                {c.brandColors.map((col, idx) => (
                  <span 
                    key={idx} 
                    className="w-4 h-4 rounded-full border border-slate-700 shadow-sm" 
                    style={{ backgroundColor: col }}
                    title={col}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  setSelectedClientId(c.id);
                  setActiveView('client_portal');
                }}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Client Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedInvoiceToPay && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">Simulate Invoice Payment</h3>
                <p className="text-xs text-slate-400">Philippine Payment Gateways</p>
              </div>
              <button 
                onClick={() => setSelectedInvoiceToPay(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Invoice:</span>
                <span className="text-slate-200 font-mono">{selectedInvoiceToPay.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Client:</span>
                <span className="text-slate-200 font-semibold">{selectedInvoiceToPay.companyName}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                <span>Amount Due:</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">
                  ₱{selectedInvoiceToPay.totalAmountPHP.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Select Payment Channel</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'GCash', label: 'GCash App', icon: '📱' },
                  { id: 'Maya QR', label: 'Maya / QR Ph', icon: '💳' },
                  { id: 'BDO / BPI Bank Transfer', label: 'BDO / BPI Bank', icon: '🏦' },
                  { id: 'Credit Card', label: 'Visa / Mastercard', icon: '💳' },
                ].map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(method.id as any);
                      setSimulatedRef(method.id.replace(/\s+/g, '').toUpperCase() + '-' + Math.floor(100000 + Math.random() * 900000));
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      paymentMethod === method.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-base mr-1.5">{method.icon}</span>
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Simulated Gateway Reference</span>
              <div className="font-mono text-slate-200 font-bold tracking-wider">{simulatedRef}</div>
              <p className="text-[10px] text-slate-400">Simulates real-time webhook callback from GCash / Maya / InstaPay.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedInvoiceToPay(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-payment-btn"
                onClick={handleConfirmPayment}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Payment of ₱{selectedInvoiceToPay.totalAmountPHP.toLocaleString()}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Wizard Modal */}
      {showOnboardingWizard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            
            {/* Wizard Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Step {onboardingStep} of 3
                  </span>
                  <span className="text-xs text-slate-400">Client Onboarding Flow</span>
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit'] mt-1">
                  {onboardingStep === 1 && 'Brand Identity & Core Style Guide'}
                  {onboardingStep === 2 && 'Social Media Channels & Audience'}
                  {onboardingStep === 3 && 'Provision Dedicated Client Portal'}
                </h3>
              </div>
              <button 
                onClick={() => setShowOnboardingWizard(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((st) => (
                <div 
                  key={st} 
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    st <= onboardingStep ? 'bg-indigo-500' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Brand Identity */}
            {onboardingStep === 1 && (
              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Company / Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={obCompany}
                      onChange={(e) => setObCompany(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Contact Stakeholder *</label>
                    <input
                      type="text"
                      required
                      value={obContact}
                      onChange={(e) => setObContact(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Industry / Niche</label>
                    <input
                      type="text"
                      value={obIndustry}
                      onChange={(e) => setObIndustry(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Brand Tagline / Slogan</label>
                    <input
                      type="text"
                      placeholder="e.g. Crafted for the Modern Filipino"
                      value={obTagline}
                      onChange={(e) => setObTagline(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Color Palette */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-slate-300 font-medium block">Brand Color Palette (HEX)</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={obPrimaryColor}
                        onChange={(e) => setObPrimaryColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Primary Accent</span>
                        <span className="font-mono text-slate-200 uppercase">{obPrimaryColor}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={obSecondaryColor}
                        onChange={(e) => setObSecondaryColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Secondary Tone</span>
                        <span className="font-mono text-slate-200 uppercase">{obSecondaryColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Tone of Voice (For Copywriters)</label>
                  <input
                    type="text"
                    value={obTone}
                    onChange={(e) => setObTone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Social Channels & Demographics */}
            {onboardingStep === 2 && (
              <div className="space-y-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <span className="text-slate-300 font-medium block">Social Media Handles to Manage</span>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Facebook Page</label>
                      <input
                        type="text"
                        value={obFacebook}
                        onChange={(e) => setObFacebook(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Instagram Handle</label>
                      <input
                        type="text"
                        value={obInstagram}
                        onChange={(e) => setObInstagram(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">TikTok Shop / Handle</label>
                      <input
                        type="text"
                        value={obTikTok}
                        onChange={(e) => setObTikTok(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Target Geographic & Demographic Focus</label>
                  <input
                    type="text"
                    value={obTargetAudience}
                    onChange={(e) => setObTargetAudience(e.target.value)}
                    placeholder="e.g. Metro Manila & Metro Cebu, B2B decision makers, 25-45"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Billing Email for Reports</label>
                    <input
                      type="email"
                      placeholder="client@company.ph"
                      value={obEmail}
                      onChange={(e) => setObEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">WhatsApp / Viber Number</label>
                    <input
                      type="text"
                      value={obPhone}
                      onChange={(e) => setObPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Portal Generation */}
            {onboardingStep === 3 && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center mx-auto text-indigo-300">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white font-['Outfit']">
                    Client Portal Ready for Deployment
                  </h4>
                  <p className="text-slate-300 max-w-md mx-auto text-[11px]">
                    A secure client collaboration portal will be provisioned for <strong>{obCompany}</strong>. 
                    {obContact} can log in anytime to review post drafts, inspect mockups, and approve or request revisions.
                  </p>
                </div>

                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Generated Portal Access Key:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {'CF-' + (obCompany.substring(0, 3) || 'NEW').toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Monthly Retainer:</span>
                    <span className="font-mono text-slate-200">₱{obMonthlyRetainer.toLocaleString()} / mo</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Assigned Stakeholder:</span>
                    <span className="text-slate-200">{obContact}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Navigation */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  if (onboardingStep > 1) setOnboardingStep(onboardingStep - 1);
                  else setShowOnboardingWizard(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                {onboardingStep === 1 ? 'Cancel' : 'Back'}
              </button>

              {onboardingStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setOnboardingStep(onboardingStep + 1)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  id="finish-onboarding-btn"
                  onClick={handleFinishOnboarding}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Activate Client & Launch Portal</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
