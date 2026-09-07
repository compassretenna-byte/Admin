'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Plus, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  Terminal,
  CreditCard,
  Bell,
  Settings2,
  X,
  Printer,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { DawgNavSection } from '@/lib/types';

interface InvoicesViewProps {
  onNavigateSection?: (section: DawgNavSection) => void;
}

interface InvoiceItem {
  id: string;
  account: string;
  ownerName: string;
  pet: string;
  service: string;
  issueDate: string;
  dueDate: string;
  daysOverdue: number;
  total: number;
  unpaidBalance: number;
  bucket0_30: number;
  bucket31_60: number;
  bucket61_90: number;
  bucket90Plus: number;
  status: 'CURRENT' | 'OVERDUE' | 'CRITICAL' | 'PAID' | 'DRAFT';
  escalationLevel: string;
  lockoutActive: boolean;
  lastNotice: string;
  cardOnFile: string;
}

const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: 'INV-2025-0744',
    account: '#ACC-4491-F',
    ownerName: 'test freddy',
    pet: 'Duke [Canine // G-Shepherd]',
    service: 'Spa Suite & De-matting',
    issueDate: '15-DEC-2024',
    dueDate: '15-DEC-2024',
    daysOverdue: 68,
    total: 650.00,
    unpaidBalance: 650.00,
    bucket0_30: 0,
    bucket31_60: 0,
    bucket61_90: 650.00,
    bucket90Plus: 0,
    status: 'CRITICAL',
    escalationLevel: 'STAGE 3 ACCOUNT FROZEN',
    lockoutActive: true,
    lastNotice: '3 days ago (SMS+EML)',
    cardOnFile: 'Visa •••• 4019 (Failed)'
  },
  {
    id: 'INV-2025-0891',
    account: '#ACC-1088-M',
    ownerName: 'Marcus Johnson',
    pet: 'Rocky [Canine // Boxer Mix]',
    service: 'Boarding & Meds',
    issueDate: '10-JAN-2025',
    dueDate: '10-JAN-2025',
    daysOverdue: 42,
    total: 420.00,
    unpaidBalance: 420.00,
    bucket0_30: 0,
    bucket31_60: 420.00,
    bucket61_90: 0,
    bucket90Plus: 0,
    status: 'OVERDUE',
    escalationLevel: 'STAGE 2 DEMAND SMS SENT',
    lockoutActive: false,
    lastNotice: '5 days ago (Urgent SMS)',
    cardOnFile: 'Amex •••• 1009 (Declined)'
  },
  {
    id: 'INV-2025-0912',
    account: '#ACC-3120-S',
    ownerName: 'Sarah Johnson',
    pet: 'Buddy [Canine // Golden Retriever]',
    service: 'Spa & Grooming',
    issueDate: '18-JAN-2025',
    dueDate: '18-JAN-2025',
    daysOverdue: 34,
    total: 185.00,
    unpaidBalance: 185.00,
    bucket0_30: 0,
    bucket31_60: 185.00,
    bucket61_90: 0,
    bucket90Plus: 0,
    status: 'OVERDUE',
    escalationLevel: 'STAGE 1 GENTLE NOTICE',
    lockoutActive: false,
    lastNotice: 'Yesterday (SMS)',
    cardOnFile: 'Visa •••• 4242'
  },
  {
    id: 'INV-2025-0940',
    account: '#ACC-8812-D',
    ownerName: 'David Wilson',
    pet: 'Bella [Canine // Shih Tzu]',
    service: 'Full Groom + Blueberry Facial',
    issueDate: '02-MAY-2025',
    dueDate: '09-MAY-2025',
    daysOverdue: 3,
    total: 95.00,
    unpaidBalance: 95.00,
    bucket0_30: 95.00,
    bucket31_60: 0,
    bucket61_90: 0,
    bucket90Plus: 0,
    status: 'CURRENT',
    escalationLevel: 'STAGE 0 NORMAL',
    lockoutActive: false,
    lastNotice: 'Invoice Link Sent',
    cardOnFile: 'MasterCard •••• 3310'
  },
  {
    id: 'INV-2025-0938',
    account: '#ACC-2290-A',
    ownerName: 'Amanda Garcia',
    pet: 'Cooper [Canine // Labradoodle]',
    service: 'Bath & Brush + Nail Dremel',
    issueDate: '05-MAY-2025',
    dueDate: '12-MAY-2025',
    daysOverdue: 0,
    total: 75.00,
    unpaidBalance: 75.00,
    bucket0_30: 75.00,
    bucket31_60: 0,
    bucket61_90: 0,
    bucket90Plus: 0,
    status: 'CURRENT',
    escalationLevel: 'STAGE 0 NORMAL',
    lockoutActive: false,
    lastNotice: 'Invoice Link Sent',
    cardOnFile: 'Visa •••• 9941'
  }
];

export const InvoicesView: React.FC<InvoicesViewProps> = ({ onNavigateSection }) => {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
  const [activeTab, setActiveTab] = useState<'all' | 'current' | 'overdue' | 'matrix' | 'draft'>('overdue');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Policy toggles
  const [ruleAutoLockout, setRuleAutoLockout] = useState(true);
  const [ruleStripeRetry, setRuleStripeRetry] = useState(true);
  const [ruleLateFee, setRuleLateFee] = useState(false);

  // Create invoice modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClient, setNewClient] = useState('');
  const [newPet, setNewPet] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newService, setNewService] = useState('Full Grooming Service');

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      if (activeTab === 'current' && inv.status !== 'CURRENT') return false;
      if (activeTab === 'overdue' && inv.status !== 'OVERDUE' && inv.status !== 'CRITICAL') return false;
      if (activeTab === 'draft' && inv.status !== 'DRAFT') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mId = inv.id.toLowerCase().includes(q);
        const mName = inv.ownerName.toLowerCase().includes(q);
        const mPet = inv.pet.toLowerCase().includes(q);
        const mAcc = inv.account.toLowerCase().includes(q);
        return mId || mName || mPet || mAcc;
      }
      return true;
    });
  }, [invoices, activeTab, searchQuery]);

  const toggleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(i => i.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedInvoices(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchDunning = () => {
    if (selectedInvoices.length === 0) {
      showToast('Select at least one invoice for batch dunning.');
      return;
    }
    showToast(`Batch dunning notices sent to ${selectedInvoices.length} account(s) via Twilio + SendGrid.`);
    setSelectedInvoices([]);
  };

  const handleReattemptStripe = () => {
    if (selectedInvoices.length === 0) {
      showToast('Select at least one invoice to re-attempt autopay.');
      return;
    }
    showToast(`Re-attempting Stripe AutoPay for ${selectedInvoices.length} account(s)...`);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.trim() || !newAmount) return;
    const amt = parseFloat(newAmount);
    const newInv: InvoiceItem = {
      id: `INV-2025-09${41 + invoices.length}`,
      account: `#ACC-${Math.floor(1000 + Math.random() * 9000)}-N`,
      ownerName: newClient.trim(),
      pet: newPet || 'Canine',
      service: newService,
      issueDate: 'Today',
      dueDate: 'Today',
      daysOverdue: 0,
      total: amt,
      unpaidBalance: amt,
      bucket0_30: amt,
      bucket31_60: 0,
      bucket61_90: 0,
      bucket90Plus: 0,
      status: 'CURRENT',
      escalationLevel: 'STAGE 0 NORMAL',
      lockoutActive: false,
      lastNotice: 'Created at counter',
      cardOnFile: 'Card Pending'
    };

    setInvoices(prev => [newInv, ...prev]);
    setShowCreateModal(false);
    setNewClient('');
    setNewPet('');
    setNewAmount('');
    showToast(`Invoice ${newInv.id} ($${amt.toFixed(2)}) created successfully.`);
  };

  return (
    <div className="bg-white text-black font-mono text-[13px] leading-tight selection:bg-black selection:text-white flex flex-col min-h-screen">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-16 right-6 z-50 bg-black text-white px-4 py-2.5 border border-white flex items-center gap-2 shadow-lg text-xs font-mono">
          <span className="w-2 h-2 bg-white animate-ping"></span>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* TOP PERSISTENT SYSTEM TELEMETRY / APP BAR */}
      <div className="w-full bg-black text-white border-b border-black flex flex-wrap items-center justify-between px-3 py-1.5 z-30 select-none text-[11px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-[12px]">
            <span className="w-2.5 h-2.5 bg-white inline-block"></span>
            <span className="tracking-wider text-[13px]">DAWG OS</span>
            <span className="border border-white/40 px-1 py-0 text-[9px] text-white/90">V4.2.0</span>
          </div>
          <span className="text-white/40">/</span>
          <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider">
            <span className="text-white/60">TENANT:</span>
            <span className="font-semibold text-white">ALL ABOUT PAWZ [EAST-HQ]</span>
          </div>
          <span className="text-white/40 hidden md:inline">/</span>
          <div className="hidden md:flex items-center gap-1 text-[10px] text-white/80 uppercase">
            <span>NODE: US-EAST-ACCT-RECON</span>
            <span className="text-white/40">•</span>
            <span>LEDGER: LIVE</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="hidden lg:flex items-center gap-1 text-[10px] bg-neutral-900 border border-white/20 px-2 py-0.5">
            <span className="text-white/60 uppercase">AUTH_AGENT:</span>
            <span className="font-mono text-white">#AAP-FIN-9904 (CFO/REV)</span>
          </div>
          <div className="flex items-center gap-1 bg-white text-black px-1.5 py-0.5 font-bold text-[10px] tracking-widest uppercase">
            DUNNING_PROTOCOL: ARMED
          </div>
          <div className="flex items-center gap-2 pl-2 border-l border-white/30">
            <button 
              onClick={() => {
                if (onNavigateSection) onNavigateSection('settings');
              }}
              className="hover:underline text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SYS_ROOT</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-HEADER / CONTEXT COMMAND BAR */}
      <div className="border-b border-black p-3 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1 mb-1">
            <span>FINANCIAL &amp; ACCTS</span>
            <span>{'//'}</span>
            <span>INVOICES</span>
            <span>{'//'}</span>
            <span className="text-black font-bold">AGING ANALYSIS &amp; OVERDUE RECOVERY</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl tracking-tight uppercase text-black">
              AGING SCHEDULE &amp; DUNNING MATRIX
            </h1>
            <span className="bg-black text-white text-[10px] px-1.5 py-0.5 font-mono uppercase font-bold tracking-widest">
              SEC:03.4
            </span>
          </div>
        </div>
        {/* ACTION CONTROLS */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button 
            onClick={() => {
              const csv = invoices.map(i => `${i.id},${i.ownerName},${i.unpaidBalance},${i.status},${i.daysOverdue}`).join('\n');
              const blob = new Blob([`ID,Owner,Balance,Status,DaysOverdue\n${csv}`], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'dawg_aging_schedule.csv';
              a.click();
              showToast('Exported aging schedule .CSV');
            }}
            className="border border-black bg-white text-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-none flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT AGING SCHEDULE .CSV</span>
          </button>
          <button 
            onClick={handleBatchDunning}
            className="border border-black bg-white text-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-none flex items-center gap-1 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>SEND BULK DUNNING NOTICES</span>
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="border border-black bg-black text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-none flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>CREATE INVOICE +</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC TILES (6 TILES GRID - STRICT BLACK/WHITE MONOCHROME) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-b border-black bg-black gap-px">
        {/* KPI 1: TOTAL OUTSTANDING */}
        <div className="bg-white p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-neutral-600 uppercase font-mono">
            <span>TOTAL OUTSTANDING</span>
            <span>[IDX:01]</span>
          </div>
          <div className="my-1">
            <div className="font-bold text-xl tracking-tight text-black">$18,420.50</div>
            <div className="text-[10px] text-neutral-500 uppercase mt-0.5">34 ACTIVE INVOICES</div>
          </div>
          <div className="w-full bg-neutral-200 h-1 border border-black/20">
            <div className="bg-black h-full w-full"></div>
          </div>
        </div>
        {/* KPI 2: CURRENT (0-30 DAYS) */}
        <div className="bg-white p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-neutral-600 uppercase font-mono">
            <span>CURRENT (0-30 DAYS)</span>
            <span className="font-bold text-black">[GOOD]</span>
          </div>
          <div className="my-1">
            <div className="font-bold text-xl tracking-tight text-black">$11,240.00</div>
            <div className="text-[10px] text-neutral-500 uppercase mt-0.5">61.0% OF BOOK BALANCE</div>
          </div>
          <div className="w-full bg-neutral-200 h-1 border border-black/20">
            <div className="bg-black h-full" style={{ width: '61%' }}></div>
          </div>
        </div>
        {/* KPI 3: PAST DUE (31-60D) */}
        <div className="bg-white p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-neutral-600 uppercase font-mono">
            <span>PAST DUE (31-60D)</span>
            <span className="font-bold text-black">[WARN]</span>
          </div>
          <div className="my-1">
            <div className="font-bold text-xl tracking-tight text-black">$4,180.50</div>
            <div className="text-[10px] text-neutral-500 uppercase mt-0.5">22.7% • 8 ACCOUNTS</div>
          </div>
          <div className="w-full bg-neutral-200 h-1 border border-black/20">
            <div className="bg-black h-full" style={{ width: '22.7%' }}></div>
          </div>
        </div>
        {/* KPI 4: PAST DUE (61-90D) */}
        <div className="bg-white p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-neutral-600 uppercase font-mono">
            <span>PAST DUE (61-90D)</span>
            <span className="font-bold text-black">[!] RISK</span>
          </div>
          <div className="my-1">
            <div className="font-bold text-xl tracking-tight text-black">$2,100.00</div>
            <div className="text-[10px] text-neutral-500 uppercase mt-0.5">11.4% • 2 ACCOUNTS</div>
          </div>
          <div className="w-full bg-neutral-200 h-1 border border-black/20">
            <div className="bg-black h-full" style={{ width: '11.4%' }}></div>
          </div>
        </div>
        {/* KPI 5: CRITICAL (>90 DAYS) */}
        <div className="bg-white p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-neutral-600 uppercase font-mono">
            <span>CRITICAL (&gt;90 DAYS)</span>
            <span className="bg-black text-white px-1 text-[9px] font-bold">[FREEZE]</span>
          </div>
          <div className="my-1">
            <div className="font-bold text-xl tracking-tight text-black">$900.00</div>
            <div className="text-[10px] text-neutral-500 uppercase mt-0.5">4.9% • 1 REFERRED</div>
          </div>
          <div className="w-full bg-neutral-200 h-1 border border-black/20">
            <div className="bg-black h-full" style={{ width: '4.9%' }}></div>
          </div>
        </div>
        {/* KPI 6: DSO RATIO */}
        <div className="bg-white p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-neutral-600 uppercase font-mono">
            <span>AVG DSO RATIO</span>
            <span>[EFFICIENCY]</span>
          </div>
          <div className="my-1">
            <div className="font-bold text-xl tracking-tight text-black">18.4 <span className="text-xs font-normal font-mono">DAYS</span></div>
            <div className="text-[10px] text-neutral-500 uppercase mt-0.5">-2.1D FROM PRIOR MONTH</div>
          </div>
          <div className="w-full bg-neutral-200 h-1 border border-black/20">
            <div className="bg-black h-full" style={{ width: '38%' }}></div>
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="border-b border-black bg-neutral-100 flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center">
          <button 
            onClick={() => setActiveTab('all')}
            className={`border-r border-black px-3.5 py-2 font-mono text-[11px] uppercase transition-none cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all' ? 'bg-black text-white font-bold' : 'bg-neutral-100 hover:bg-neutral-200 text-black font-semibold'
            }`}
          >
            <span>ALL INVOICES</span>
            <span className="border border-black px-1 text-[9px] bg-white text-black">34</span>
          </button>
          <button 
            onClick={() => setActiveTab('current')}
            className={`border-r border-black px-3.5 py-2 font-mono text-[11px] uppercase transition-none cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'current' ? 'bg-black text-white font-bold' : 'bg-neutral-100 hover:bg-neutral-200 text-black font-semibold'
            }`}
          >
            <span>CURRENT 0-30D</span>
            <span className="border border-black px-1 text-[9px] bg-white text-black">18</span>
          </button>
          <button 
            onClick={() => setActiveTab('overdue')}
            className={`border-r border-black px-3.5 py-2 font-mono text-[11px] uppercase transition-none cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overdue' ? 'bg-black text-white font-bold' : 'bg-neutral-100 hover:bg-neutral-200 text-black font-semibold'
            }`}
          >
            <span>OVERDUE &gt;30D</span>
            <span className="border border-black px-1 text-[9px] bg-white text-black">11</span>
          </button>
          <button 
            onClick={() => setActiveTab('matrix')}
            className={`border-r border-black px-3.5 py-2 font-mono text-[11px] uppercase transition-none cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'matrix' ? 'bg-black text-white font-bold' : 'bg-white text-black font-bold hover:bg-neutral-200'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>AGING REPORT MATRIX</span>
            <span className="bg-black text-white px-1 text-[9px]">MATRIX</span>
          </button>
          <button 
            onClick={() => setActiveTab('draft')}
            className={`border-r border-black px-3.5 py-2 font-mono text-[11px] uppercase transition-none cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'draft' ? 'bg-black text-white font-bold' : 'bg-neutral-100 hover:bg-neutral-200 text-black font-semibold'
            }`}
          >
            <span>DRAFT / UNPAID</span>
            <span className="border border-black px-1 text-[9px] bg-white text-black">5</span>
          </button>
        </div>

        {/* SEARCH INPUT */}
        <div className="flex items-center gap-2 p-1.5">
          <div className="flex items-center border border-black bg-white px-2 py-0.5">
            <Search className="w-3.5 h-3.5 text-black mr-1" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="FILTER BY OWNER, PET, OR INV#..."
              className="border-0 p-0 text-[11px] font-mono uppercase bg-transparent outline-none focus:ring-0 w-48 text-black placeholder:text-neutral-500"
            />
          </div>
          <div className="flex items-center border border-black bg-white px-2 py-0.5 text-[11px] font-mono uppercase font-bold cursor-pointer hover:bg-neutral-100">
            <span>STATUS: &gt;30D CRITICAL</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5 rotate-90" />
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE SPLIT (LEFT 8 COLS MATRIX + RIGHT 4 COLS DUNNING ENGINE) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12">
        {/* LEFT: TABULAR AGING MATRIX (8 COLS) */}
        <div className="xl:col-span-8 flex flex-col border-b xl:border-b-0 xl:border-r border-black bg-white">
          {/* DATA VIEW HEADER */}
          <div className="px-3 py-1.5 border-b border-black bg-white flex items-center justify-between text-[11px] font-mono uppercase">
            <div className="flex items-center gap-2 font-bold">
              <span className="w-2 h-2 bg-black inline-block"></span>
              <span>DATA_VIEW: MATRIX_BUCKET_OVERDUE // ESCALATION_REGISTRY</span>
            </div>
            <div className="text-neutral-500 text-[10px]">
              DISPLAYING: {filteredInvoices.length} OF 11 FLAGGED INVOICES
            </div>
          </div>

          {/* BATCH SELECTION STRIP */}
          <div className="px-3 py-1 border-b border-black bg-neutral-100 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer select-none font-bold">
                <input 
                  type="checkbox" 
                  checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                  onChange={toggleSelectAll}
                  className="w-3.5 h-3.5 border-black text-black focus:ring-0 rounded-none cursor-pointer"
                />
                <span>SELECT ALL ({filteredInvoices.length})</span>
              </label>
              <span className="text-neutral-400">|</span>
              <button 
                onClick={handleBatchDunning}
                className="text-black hover:underline font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer"
              >
                <Bell className="w-3 h-3" />
                <span>TRIGGER BATCH DUNNING</span>
              </button>
              <span className="text-neutral-400">|</span>
              <button 
                onClick={handleReattemptStripe}
                className="text-black hover:underline font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer"
              >
                <CreditCard className="w-3 h-3" />
                <span>RE-ATTEMPT STRIPE AUTOPAY</span>
              </button>
            </div>
            <div className="text-[10px] text-neutral-600 uppercase">
              SORT: AGING_DESC (CRITICAL FIRST)
            </div>
          </div>

          {/* TABLE */}
          <div className="w-full overflow-x-auto flex-1">
            <table className="w-full border-collapse text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-black bg-neutral-200 text-black uppercase text-[10px] tracking-wider font-bold">
                  <th className="p-2 w-8 text-center border-r border-black">#</th>
                  <th className="p-2 border-r border-black">ACCOUNT / OWNER ID</th>
                  <th className="p-2 border-r border-black">INVOICE &amp; DATES</th>
                  <th className="p-2 border-r border-black text-right">TOTAL</th>
                  <th className="p-2 border-r border-black text-right bg-neutral-100">0-30D</th>
                  <th className="p-2 border-r border-black text-right bg-neutral-100">31-60D</th>
                  <th className="p-2 border-r border-black text-right bg-neutral-100">61-90D</th>
                  <th className="p-2 border-r border-black text-right bg-neutral-100">90D+</th>
                  <th className="p-2 border-r border-black">ESCALATION LEVEL</th>
                  <th className="p-2 text-center">OPERATIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-100 transition-none">
                    <td className="p-2 text-center border-r border-black align-top">
                      <input 
                        type="checkbox"
                        checked={selectedInvoices.includes(inv.id)}
                        onChange={() => toggleSelect(inv.id)}
                        className="w-3.5 h-3.5 border-black text-black focus:ring-0 rounded-none cursor-pointer mt-0.5"
                      />
                    </td>
                    <td className="p-2 border-r border-black align-top">
                      <div className="font-bold text-[13px] text-black tracking-tight">{inv.ownerName}</div>
                      <div className="text-[10px] text-neutral-600 mt-0.5">PET: {inv.pet}</div>
                      <div className="text-[9px] text-neutral-500 font-mono">ACCT: {inv.account}</div>
                    </td>
                    <td className="p-2 border-r border-black align-top whitespace-nowrap">
                      <div className="font-bold text-black">{inv.id}</div>
                      <div className="text-[10px] text-neutral-600">ISSUED: {inv.issueDate}</div>
                      {inv.daysOverdue > 0 ? (
                        <div className={`text-[10px] font-bold border border-black inline-block px-1 mt-0.5 ${
                          inv.daysOverdue > 60 ? 'bg-black text-white' : 'bg-neutral-200 text-black'
                        }`}>
                          {inv.daysOverdue} DAYS OVERDUE
                        </div>
                      ) : (
                        <div className="text-[10px] font-bold border border-black inline-block px-1 mt-0.5 bg-white text-black">
                          CURRENT
                        </div>
                      )}
                    </td>
                    <td className="p-2 border-r border-black align-top text-right whitespace-nowrap">
                      <div className="font-bold text-[14px] text-black">${inv.unpaidBalance.toFixed(2)}</div>
                      <div className="text-[9px] text-neutral-500 uppercase">UNPAID BAL</div>
                    </td>
                    <td className="p-2 border-r border-black align-top text-right text-neutral-400">
                      ${inv.bucket0_30.toFixed(2)}
                    </td>
                    <td className={`p-2 border-r border-black align-top text-right ${inv.bucket31_60 > 0 ? 'font-bold text-black bg-neutral-100' : 'text-neutral-400'}`}>
                      ${inv.bucket31_60.toFixed(2)}
                    </td>
                    <td className={`p-2 border-r border-black align-top text-right ${inv.bucket61_90 > 0 ? 'font-bold text-black bg-neutral-100' : 'text-neutral-400'}`}>
                      ${inv.bucket61_90.toFixed(2)}
                    </td>
                    <td className={`p-2 border-r border-black align-top text-right ${inv.bucket90Plus > 0 ? 'font-bold text-black bg-neutral-100' : 'text-neutral-400'}`}>
                      ${inv.bucket90Plus.toFixed(2)}
                    </td>
                    <td className="p-2 border-r border-black align-top">
                      <div className={`inline-block border border-black px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        inv.status === 'CRITICAL' ? 'bg-black text-white' : 'bg-neutral-200 text-black'
                      }`}>
                        {inv.escalationLevel}
                      </div>
                      <div className="text-[9px] text-black font-semibold mt-1">
                        LOCKOUT: {inv.lockoutActive ? 'ACTIVE • NO BOOKINGS' : 'PENDING (48H GRACE)'}
                      </div>
                      <div className="text-[9px] text-neutral-500">
                        {inv.lastNotice}
                      </div>
                    </td>
                    <td className="p-2 text-center align-top whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-stretch w-40 mx-auto">
                        <button 
                          onClick={() => showToast(`Formal demand notice dispatched to ${inv.ownerName}`)}
                          className="border border-black bg-white text-black text-[10px] px-2 py-1 uppercase font-bold hover:bg-black hover:text-white transition-none cursor-pointer"
                        >
                          SEND FORMAL DEMAND
                        </button>
                        <button 
                          onClick={() => showToast(`Triggered Stripe autopay for ${inv.id}`)}
                          className="border border-black bg-black text-white text-[10px] px-2 py-1 uppercase font-bold hover:bg-white hover:text-black transition-none cursor-pointer"
                        >
                          COLLECT VIA STRIPE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TABLE PAGINATION FOOTER */}
          <div className="border-t border-black bg-neutral-100 p-2 flex flex-wrap items-center justify-between text-[10px] font-mono uppercase">
            <div className="flex items-center gap-2">
              <span>QUEUED DISPATCH: {selectedInvoices.length} ACCOUNTS SELECTED</span>
              <span>•</span>
              <span className="font-bold">TOTAL AGED VALUE IN VIEW: ${filteredInvoices.reduce((acc, i) => acc + i.unpaidBalance, 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>PAGE 1 OF 1</span>
              <button className="border border-black px-2 py-0.5 bg-white text-black hover:bg-black hover:text-white cursor-pointer">&lt;</button>
              <button className="border border-black px-2 py-0.5 bg-black text-white cursor-pointer">&gt;</button>
            </div>
          </div>
        </div>

        {/* RIGHT: AUTOMATED DUNNING ENGINE & POLICY DRAWER (4 COLS) */}
        <div className="xl:col-span-4 bg-white flex flex-col justify-between">
          <div className="flex flex-col">
            {/* DRAWER HEADER */}
            <div className="p-2.5 border-b border-black bg-black text-white flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold font-mono text-[11px] uppercase tracking-wider">
                <Settings2 className="w-3.5 h-3.5" />
                <span>DUNNING_ENGINE // AUTOMATION CONFIG</span>
              </div>
              <span className="border border-white px-1 text-[9px] font-mono uppercase font-bold bg-black text-white">
                [STATUS: ARMED]
              </span>
            </div>

            {/* ESCALATION CADENCE STAGES */}
            <div className="p-3 border-b border-black flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-[10px] uppercase font-mono">
                <span className="text-neutral-600 font-bold tracking-widest">SCHEDULE // STAGE TIMERS</span>
                <span className="font-bold text-black">AUTOMATED CADENCE</span>
              </div>

              {/* STAGE 1 CARD */}
              <div className="border border-black p-2 bg-neutral-50 flex flex-col gap-1">
                <div className="flex items-center justify-between font-mono text-[11px] font-bold">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-black inline-block"></span>
                    <span>STAGE 1: GENTLE COURTESY</span>
                  </span>
                  <span className="bg-black text-white px-1 text-[9px]">DAY +3</span>
                </div>
                <p className="text-[11px] text-neutral-700 leading-normal">
                  Triggers automated friendly SMS notification + emailed PDF invoice receipt link. Zero late penalty applied.
                </p>
                <div className="flex items-center justify-between text-[9px] font-mono pt-1 border-t border-black/20">
                  <span className="uppercase">CHANNEL: SMS + EMAIL</span>
                  <span className="font-bold text-black">[ACTIVE: 100%]</span>
                </div>
              </div>

              {/* STAGE 2 CARD */}
              <div className="border border-black p-2 bg-neutral-50 flex flex-col gap-1">
                <div className="flex items-center justify-between font-mono text-[11px] font-bold">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-black inline-block"></span>
                    <span>STAGE 2: DEMAND &amp; SERVICE WARNING</span>
                  </span>
                  <span className="bg-black text-white px-1 text-[9px]">DAY +14</span>
                </div>
                <p className="text-[11px] text-neutral-700 leading-normal">
                  Formal reminder issued. Alerts client of impending account suspension and boarding reservation holds.
                </p>
                <div className="flex items-center justify-between text-[9px] font-mono pt-1 border-t border-black/20">
                  <span className="uppercase">CHANNEL: URGENT SMS + CERTIFIED EMAIL</span>
                  <span className="font-bold text-black">[ACTIVE: 100%]</span>
                </div>
              </div>

              {/* STAGE 3 CARD */}
              <div className="border border-black p-2 bg-neutral-50 flex flex-col gap-1">
                <div className="flex items-center justify-between font-mono text-[11px] font-bold">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-black inline-block"></span>
                    <span>STAGE 3: HARD LOCKOUT &amp; COLLECTIONS</span>
                  </span>
                  <span className="bg-black text-white px-1 text-[9px]">DAY +30</span>
                </div>
                <p className="text-[11px] text-neutral-700 leading-normal">
                  Immediate account restriction. Portal access revoked for daycare/boarding. File queued for 3rd-party recovery.
                </p>
                <div className="flex items-center justify-between text-[9px] font-mono pt-1 border-t border-black/20">
                  <span className="uppercase">ENFORCEMENT: PORTAL SUSPENSION</span>
                  <span className="font-bold text-black">[ACTIVE: 100%]</span>
                </div>
              </div>
            </div>

            {/* POLICY RULES MATRIX */}
            <div className="p-3 border-b border-black flex flex-col gap-2">
              <span className="text-[10px] font-mono text-neutral-600 uppercase font-bold tracking-widest">
                ENFORCEMENT POLICY RULES
              </span>
              <div className="flex flex-col gap-1.5">
                {/* RULE 1 */}
                <div className="border border-black p-2 bg-white flex items-start justify-between">
                  <div className="pr-2">
                    <div className="font-mono text-[11px] font-bold uppercase">AUTO-BOOKING LOCKOUT (&gt;30 DAYS)</div>
                    <div className="text-[10px] text-neutral-600 mt-0.5">
                      Block daycare check-ins and appointments if outstanding balance &gt; 30 days past due.
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={ruleAutoLockout}
                    onChange={(e) => setRuleAutoLockout(e.target.checked)}
                    className="w-4 h-4 border-black text-black focus:ring-0 rounded-none cursor-pointer mt-0.5"
                  />
                </div>
                {/* RULE 2 */}
                <div className="border border-black p-2 bg-white flex items-start justify-between">
                  <div className="pr-2">
                    <div className="font-mono text-[11px] font-bold uppercase">STRIPE SMART RETRY CADENCE</div>
                    <div className="text-[10px] text-neutral-600 mt-0.5">
                      Machine learning optimized re-charge attempts on file: Day 1, 3, 5, 10 post-due date.
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={ruleStripeRetry}
                    onChange={(e) => setRuleStripeRetry(e.target.checked)}
                    className="w-4 h-4 border-black text-black focus:ring-0 rounded-none cursor-pointer mt-0.5"
                  />
                </div>
                {/* RULE 3 */}
                <div className="border border-black p-2 bg-white flex items-start justify-between">
                  <div className="pr-2">
                    <div className="font-mono text-[11px] font-bold uppercase">LATE FEE ACCRUAL (+1.5% MO.)</div>
                    <div className="text-[10px] text-neutral-600 mt-0.5">
                      Automatically add statutory interest on unpaid aging balances crossing 30 calendar days.
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={ruleLateFee}
                    onChange={(e) => setRuleLateFee(e.target.checked)}
                    className="w-4 h-4 border-black text-black focus:ring-0 rounded-none cursor-pointer mt-0.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GATEWAY TELEMETRY & SUBMIT BAR */}
          <div className="p-3 bg-neutral-100 border-t border-black flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-[10px] text-neutral-600 uppercase">
              <span>GATEWAY TELEMETRY</span>
              <span className="font-bold text-black">STRIPE BILLING V4.1</span>
            </div>
            <div className="font-mono text-[11px] font-bold">AUTO-RECOVERY SUCCESS RATE: 74.2%</div>
            <div className="w-full bg-white h-2 border border-black overflow-hidden">
              <div className="bg-black h-full" style={{ width: '74.2%' }}></div>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-neutral-600 uppercase">
              <span>RECOVERED MTD: $6,420.00</span>
              <span>FAILED CARDS: 4</span>
            </div>
            <button 
              onClick={() => showToast('Dunning policy revisions successfully committed to master engine.')}
              className="w-full border border-black bg-black text-white py-2 font-mono text-[11px] uppercase font-bold tracking-wider hover:bg-white hover:text-black transition-none cursor-pointer mt-1"
            >
              COMMIT POLICY REVISIONS
            </button>
          </div>
        </div>
      </div>

      {/* AUDIT TERMINAL DOCK */}
      <footer className="border-t border-black bg-white px-3 py-1.5 flex flex-wrap items-center justify-between font-mono text-[10px] uppercase text-black select-none">
        <div className="flex items-center gap-2">
          <span className="font-bold">&gt;</span>
          <span className="font-bold">SYS_CMD // STATUS: MONITORING 11 OVERDUE NODES</span>
          <span className="w-1.5 h-3 bg-black inline-block animate-pulse"></span>
          <span className="text-neutral-400 hidden md:inline">|</span>
          <span className="text-neutral-600 hidden md:inline">STRIPE_WEBHOOK: LISTEN_200_OK</span>
          <span className="text-neutral-400 hidden md:inline">|</span>
          <span className="text-neutral-600 hidden md:inline">SMS_GATEWAY: TWILIO_FEED_READY</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-neutral-600">BUFFER_MEM: 128KB</span>
          <span className="border border-black px-1 font-bold bg-black text-white">ALL SYSTEMS GO</span>
        </div>
      </footer>

      {/* CREATE INVOICE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleCreateInvoice} className="bg-white border-2 border-black max-w-md w-full p-6 space-y-4 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <h3 className="font-bold text-sm uppercase">CREATE NEW SALON INVOICE</h3>
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-black hover:text-white border border-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-gray-600 uppercase text-[10px] mb-1">CUSTOMER / OWNER NAME *</label>
                <input 
                  type="text"
                  required
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="w-full border border-black p-2 bg-white font-bold"
                  placeholder="e.g. Rachel Green"
                />
              </div>

              <div>
                <label className="block text-gray-600 uppercase text-[10px] mb-1">PET NAME &amp; BREED</label>
                <input 
                  type="text"
                  value={newPet}
                  onChange={(e) => setNewPet(e.target.value)}
                  className="w-full border border-black p-2 bg-white"
                  placeholder="e.g. Barnaby [Doodle]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 uppercase text-[10px] mb-1">TOTAL DUE ($) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full border border-black p-2 bg-white font-bold text-base"
                    placeholder="85.00"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 uppercase text-[10px] mb-1">SERVICE TYPE</label>
                  <select 
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full border border-black p-2 bg-white font-bold"
                  >
                    <option>Full Grooming Service</option>
                    <option>Bath &amp; Blowout</option>
                    <option>Boarding &amp; Daycare</option>
                    <option>Add-on Specialty Package</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-black flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-black bg-black text-white hover:bg-neutral-800 uppercase font-bold text-xs"
              >
                Issue Invoice
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
