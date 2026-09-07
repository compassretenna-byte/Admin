'use client';

import React, { useState, useMemo } from 'react';
import { 
  Undo2, 
  Search, 
  Download, 
  Plus, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  DollarSign,
  Settings,
  X,
  Printer,
  ChevronDown,
  ArrowRight,
  TrendingDown,
  CreditCard,
  Building2,
  Clock,
  Check,
  Ban
} from 'lucide-react';
import { DawgNavSection } from '@/lib/types';

interface RefundsViewProps {
  onNavigateSection?: (section: DawgNavSection) => void;
}

export type RefundStatus = 'COMPLETED' | 'PENDING' | 'REJECTED' | 'DISPUTED' | 'VOIDED';

interface RefundItem {
  id: string;
  originalTx: string;
  customer: string;
  email: string;
  phone: string;
  serviceItem: string;
  pet: string;
  reason: string;
  method: string;
  processedDate: string;
  amount: number;
  status: RefundStatus;
  operator: string;
  notes?: string;
  isPartial: boolean;
  creditNoteId?: string;
}

const INITIAL_REFUNDS: RefundItem[] = [
  {
    id: 'RF-1092',
    originalTx: 'TX-9836',
    customer: 'Tom Anderson',
    email: 'tom.a@example.com',
    phone: '+1 (555) 234-8910',
    serviceItem: 'Full Grooming Package',
    pet: 'Buster (Golden Retriever)',
    reason: 'Customer Request // Doctor Note',
    method: 'Credit Card (Visa •••• 9921)',
    processedDate: 'May 10, 2025',
    amount: 120.00,
    status: 'COMPLETED',
    operator: 'David Chen (GM)',
    isPartial: false,
    notes: 'Approved under vet emergency cancellation policy.'
  },
  {
    id: 'RF-1091',
    originalTx: 'TX-9750',
    customer: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 382-9011',
    serviceItem: 'Add-on: Blueberry Facial Scrub',
    pet: 'Bella (Shih Tzu)',
    reason: 'Service Not Needed',
    method: 'Store Credit (Wallet)',
    processedDate: 'May 05, 2025',
    amount: 15.00,
    status: 'COMPLETED',
    operator: 'Sarah Miller (Lead)',
    isPartial: true,
    creditNoteId: 'CRD-0142',
    notes: 'Client decided to skip facial due to sensitive eye tearing.'
  },
  {
    id: 'RF-1090',
    originalTx: 'TX-9698',
    customer: 'Amanda Garcia',
    email: 'agarcia@example.org',
    phone: '+1 (555) 129-4482',
    serviceItem: 'Grooming Deposit Hold',
    pet: 'Cooper (Labradoodle)',
    reason: 'Duplicate Payment / Card Glitch',
    method: 'Credit Card (Visa •••• 4242)',
    processedDate: 'May 02, 2025',
    amount: 25.00,
    status: 'COMPLETED',
    operator: 'David Chen (GM)',
    isPartial: false,
    notes: 'Stripe terminal double-tap corrected.'
  },
  {
    id: 'RF-1089',
    originalTx: 'TX-9654',
    customer: 'Marcus Johnson',
    email: 'marcus.j@example.com',
    phone: '+1 (555) 902-8371',
    serviceItem: 'Deluxe Spa Treatment',
    pet: 'Max (Goldendoodle)',
    reason: 'Quality Inspection / Dissatisfied Finish',
    method: 'Credit Card (Amex •••• 1009)',
    processedDate: 'May 11, 2025',
    amount: 45.00,
    status: 'PENDING',
    operator: 'Front Desk Terminal',
    isPartial: true,
    notes: 'Manager authorization requested for 50% courtesy adjustment.'
  },
  {
    id: 'RF-1088',
    originalTx: 'TX-9512',
    customer: 'Kevin Diaz',
    email: 'kevin.d@example.com',
    phone: '+1 (555) 881-3042',
    serviceItem: 'Full Groom - Mobile Unit 2',
    pet: 'Rocky (Boxer Mix)',
    reason: 'Chargeback / Unrecognized Charge',
    method: 'Dispute Case #DISP-2025-004',
    processedDate: 'May 01, 2025',
    amount: 85.00,
    status: 'DISPUTED',
    operator: 'Stripe Ingestion Bot',
    isPartial: false,
    notes: 'Evidence submitted via Stripe Connect dispute chamber. 100% win rate historic.'
  }
];

export const RefundsView: React.FC<RefundsViewProps> = ({ onNavigateSection }) => {
  const [refunds, setRefunds] = useState<RefundItem[]>(INITIAL_REFUNDS);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending' | 'disputes' | 'credit'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [staffFilter, setStaffFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('this-month');

  // Modals
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<RefundItem | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // New Refund Form
  const [newOrigTx, setNewOrigTx] = useState('TX-9844');
  const [newCustomer, setNewCustomer] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newReason, setNewReason] = useState('Customer Request');
  const [newMethod, setNewMethod] = useState('Original Payment Method');
  const [newNotes, setNewNotes] = useState('');

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Metrics
  const totalRefundedMTD = useMemo(() => 
    refunds.filter(r => r.status === 'COMPLETED').reduce((acc, r) => acc + r.amount, 0),
    [refunds]
  );

  const fullRefundsTotal = useMemo(() => 
    refunds.filter(r => r.status === 'COMPLETED' && !r.isPartial).reduce((acc, r) => acc + r.amount, 0),
    [refunds]
  );

  const partialRefundsTotal = useMemo(() => 
    refunds.filter(r => r.isPartial).reduce((acc, r) => acc + r.amount, 0),
    [refunds]
  );

  // Filtered List
  const filteredRefunds = useMemo(() => {
    return refunds.filter(r => {
      // Tab filter
      if (activeTab === 'completed' && r.status !== 'COMPLETED') return false;
      if (activeTab === 'pending' && r.status !== 'PENDING') return false;
      if (activeTab === 'disputes' && r.status !== 'DISPUTED') return false;
      if (activeTab === 'credit' && !r.method.toLowerCase().includes('credit') && !r.method.toLowerCase().includes('wallet')) return false;

      // Dropdown filters
      if (reasonFilter !== 'all' && !r.reason.toLowerCase().includes(reasonFilter.toLowerCase())) return false;
      if (methodFilter !== 'all' && !r.method.toLowerCase().includes(methodFilter.toLowerCase())) return false;
      if (staffFilter !== 'all' && !r.operator.toLowerCase().includes(staffFilter.toLowerCase())) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mId = r.id.toLowerCase().includes(q);
        const mTx = r.originalTx.toLowerCase().includes(q);
        const mCust = r.customer.toLowerCase().includes(q);
        const mItem = r.serviceItem.toLowerCase().includes(q);
        const mReason = r.reason.toLowerCase().includes(q);
        return mId || mTx || mCust || mItem || mReason;
      }

      return true;
    });
  }, [refunds, activeTab, reasonFilter, methodFilter, staffFilter, searchQuery]);

  // Actions
  const handleApproveRefund = (refId: string) => {
    setRefunds(prev => prev.map(r => r.id === refId ? { ...r, status: 'COMPLETED' } : r));
    showToast(`Refund ${refId} approved and submitted to Stripe.`);
    if (selectedRefund?.id === refId) {
      setSelectedRefund(prev => prev ? { ...prev, status: 'COMPLETED' } : null);
    }
  };

  const handleRejectRefund = (refId: string) => {
    const reason = prompt('Reason for rejection:', 'Does not meet 24h cancellation criteria');
    if (reason !== null) {
      setRefunds(prev => prev.map(r => r.id === refId ? { ...r, status: 'REJECTED', notes: `Rejected: ${reason}` } : r));
      showToast(`Refund ${refId} rejected.`);
      if (selectedRefund?.id === refId) {
        setSelectedRefund(prev => prev ? { ...prev, status: 'REJECTED', notes: `Rejected: ${reason}` } : null);
      }
    }
  };

  const handleVoidRefund = (refId: string) => {
    setRefunds(prev => prev.map(r => r.id === refId ? { ...r, status: 'VOIDED' } : r));
    showToast(`Refund ${refId} voided.`);
    if (selectedRefund?.id === refId) {
      setSelectedRefund(prev => prev ? { ...prev, status: 'VOIDED' } : null);
    }
  };

  const handleCreateRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.trim() || !newAmount) return;

    const amt = parseFloat(newAmount);
    const newRef: RefundItem = {
      id: `RF-${1093 + refunds.length}`,
      originalTx: newOrigTx || 'TX-9844',
      customer: newCustomer.trim(),
      email: `${newCustomer.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: '+1 (555) 000-1122',
      serviceItem: 'Grooming Service Adjustment',
      pet: 'Pet On File',
      reason: newReason,
      method: newMethod === 'Store Credit' ? 'Store Credit (Wallet)' : 'Credit Card (Original)',
      processedDate: 'Today (May 12, 2025)',
      amount: amt,
      status: 'COMPLETED',
      operator: 'David Chen (GM)',
      isPartial: amt < 100,
      notes: newNotes
    };

    setRefunds(prev => [newRef, ...prev]);
    setShowIssueModal(false);
    setNewCustomer('');
    setNewAmount('');
    setNewNotes('');
    showToast(`Refund ${newRef.id} ($${amt.toFixed(2)}) processed successfully.`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-black font-sans">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-16 right-6 z-50 bg-black text-white px-4 py-2.5 border border-white flex items-center gap-2 shadow-lg text-xs font-mono">
          <span className="w-2 h-2 bg-white animate-ping"></span>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] bg-black text-white px-1.5 py-0.5 uppercase font-bold">SEC:03.5</span>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black flex items-center gap-2">
              <span>📄 Refunds &amp; Adjustments Dashboard</span>
            </h1>
          </div>
          <p className="text-xs text-gray-600 mt-1 font-mono">
            Transaction voids, chargebacks, customer goodwill credits, and Stripe ledger refund reversions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* [REFUND POLICY SETTINGS] */}
          <button
            onClick={() => setShowPolicyModal(true)}
            className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>[REFUND POLICY SETTINGS]</span>
          </button>
          {/* [+ ISSUE REFUND] */}
          <button
            onClick={() => setShowIssueModal(true)}
            className="px-3 py-1.5 border border-black bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>[+ ISSUE REFUND]</span>
          </button>
        </div>
      </div>

      {/* 📊 Summary Cards (each is a clickable navigation or filter) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5 font-mono">
        {/* TOTAL REFUNDED (MTD) */}
        <button
          onClick={() => { setActiveTab('all'); setDateRangeFilter('this-month'); showToast('Showing all refunds this month'); }}
          className={`border border-black p-3 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            activeTab === 'all' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <span className="text-[9px] uppercase font-bold opacity-80">TOTAL REFUNDED</span>
          <span className="text-lg font-black tracking-tight mt-1">${totalRefundedMTD.toFixed(2)}</span>
          <span className="text-[8px] opacity-70 mt-0.5">[click] → MTD</span>
        </button>

        {/* 5 TRANSACTIONS */}
        <button
          onClick={() => { setActiveTab('all'); showToast('Viewing list of all 5 transactions'); }}
          className={`border border-black p-3 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            activeTab === 'all' ? 'bg-white hover:bg-gray-50 text-black' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <span className="text-[9px] uppercase font-bold text-gray-600">5 TRANSACTIONS</span>
          <span className="text-lg font-black tracking-tight mt-1">{refunds.length} LOGGED</span>
          <span className="text-[8px] text-gray-500 mt-0.5">[click] → Full List</span>
        </button>

        {/* ALL REFUNDS */}
        <button
          onClick={() => { setActiveTab('all'); showToast('Showing all refunds default view'); }}
          className={`border border-black p-3 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            activeTab === 'all' ? 'bg-neutral-200 text-black font-bold' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <span className="text-[9px] uppercase font-bold text-gray-600">ALL REFUNDS</span>
          <span className="text-lg font-black tracking-tight mt-1">{refunds.length}</span>
          <span className="text-[8px] text-gray-500 mt-0.5">[click] → Default</span>
        </button>

        {/* COMPLETED */}
        <button
          onClick={() => { setActiveTab('completed'); showToast('Showing completed processed refunds'); }}
          className={`border border-black p-3 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            activeTab === 'completed' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <span className="text-[9px] uppercase font-bold opacity-80">COMPLETED</span>
          <span className="text-lg font-black tracking-tight mt-1">
            {refunds.filter(r => r.status === 'COMPLETED').length}
          </span>
          <span className="text-[8px] opacity-70 mt-0.5">[click] → Processed</span>
        </button>

        {/* PENDING APPROVAL */}
        <button
          onClick={() => { setActiveTab('pending'); showToast('Showing refunds awaiting authorization'); }}
          className={`border border-black p-3 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            activeTab === 'pending' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <span className="text-[9px] uppercase font-bold opacity-80">PENDING APPR.</span>
          <span className="text-lg font-black tracking-tight mt-1 text-amber-600">
            {refunds.filter(r => r.status === 'PENDING').length}
          </span>
          <span className="text-[8px] opacity-70 mt-0.5">[click] → Authorize</span>
        </button>

        {/* DISPUTES */}
        <button
          onClick={() => { setActiveTab('disputes'); showToast('Showing chargebacks and dispute cases'); }}
          className={`border border-black p-3 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            activeTab === 'disputes' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <span className="text-[9px] uppercase font-bold opacity-80">DISPUTES</span>
          <span className="text-lg font-black tracking-tight mt-1">
            {refunds.filter(r => r.status === 'DISPUTED').length}
          </span>
          <span className="text-[8px] opacity-70 mt-0.5">[click] → Chargebacks</span>
        </button>

        {/* STORE CREDIT ISSUED */}
        <button
          onClick={() => { setActiveTab('credit'); showToast('Showing refunds issued as store credit'); }}
          className={`border border-black p-3 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            activeTab === 'credit' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <span className="text-[9px] uppercase font-bold opacity-80">STORE CREDIT</span>
          <span className="text-lg font-black tracking-tight mt-1">$15.00</span>
          <span className="text-[8px] opacity-70 mt-0.5">[click] → Wallet</span>
        </button>

        {/* TARGET: <2.0% TOTAL SALES */}
        <button
          onClick={() => { showToast('Opening refund benchmark report: Current 0.8% well below 2.0% SLA limit.'); }}
          className="border border-black p-3 text-left flex flex-col justify-between bg-neutral-50 hover:bg-neutral-100 text-black transition-colors cursor-pointer"
        >
          <span className="text-[9px] uppercase font-bold text-gray-600">TARGET &lt;2.0%</span>
          <span className="text-lg font-black tracking-tight mt-1 text-emerald-700">0.8%</span>
          <span className="text-[8px] text-gray-500 mt-0.5">[click] → Benchmarks</span>
        </button>
      </div>

      {/* 📊 Mini Metric Cards (clickable filters) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <button
          onClick={() => {
            setRefunds(prev => prev);
            showToast('Filter: Showing partial refunds ($60.00 total)');
          }}
          className="border border-black p-3 bg-white text-left hover:bg-gray-50 flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="text-[10px] uppercase text-gray-500 block">PARTIAL REFUNDS</span>
            <span className="text-base font-bold text-black">${partialRefundsTotal.toFixed(2)}</span>
            <span className="text-[9px] text-gray-500 block mt-0.5">1 PENDING REQUEST</span>
          </div>
          <span className="text-xs font-bold border border-black px-1.5 py-0.5">[FILTER]</span>
        </button>

        <button
          onClick={() => {
            showToast('Filter: Showing full refunds ($175.00 total)');
          }}
          className="border border-black p-3 bg-white text-left hover:bg-gray-50 flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="text-[10px] uppercase text-gray-500 block">FULL REFUNDS</span>
            <span className="text-base font-bold text-black">${fullRefundsTotal.toFixed(2)}</span>
            <span className="text-[9px] text-gray-500 block mt-0.5">3 ISSUED COMPLETE</span>
          </div>
          <span className="text-xs font-bold border border-black px-1.5 py-0.5">[FILTER]</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('disputes');
            showToast('Navigating to dispute management view: 1 active dispute case.');
          }}
          className="border border-black p-3 bg-white text-left hover:bg-gray-50 flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="text-[10px] uppercase text-gray-500 block">CHARGEBACKS / DISPUTES</span>
            <span className="text-base font-bold text-black">1 ACTIVE // 100% WON</span>
            <span className="text-[9px] text-gray-500 block mt-0.5">$85.00 UNDER REVIEW</span>
          </div>
          <span className="text-xs font-bold border border-black bg-black text-white px-1.5 py-0.5">[DISPUTES]</span>
        </button>

        <button
          onClick={() => {
            showToast('Refund rate analytics: 0.8% of total salon billings.');
          }}
          className="border border-black p-3 bg-white text-left hover:bg-gray-50 flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="text-[10px] uppercase text-gray-500 block">REFUND RATE</span>
            <span className="text-base font-bold text-black">0.8% <span className="text-xs font-normal text-gray-500">(Target &lt;2.0%)</span></span>
            <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">✓ EXCELLENT SCORE</span>
          </div>
          <span className="text-xs font-bold border border-black px-1.5 py-0.5">[TRENDS]</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="border border-black bg-white">
        {/* 🔎 Table Filters */}
        <div className="p-3 bg-neutral-100 border-b border-black flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <span className="absolute left-2.5 top-2 text-gray-500 pointer-events-none">
                <Search className="w-3 h-3" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search refund ID, TX #, customer, reason..."
                className="w-full h-7 pl-7 pr-2 text-xs bg-white border border-black text-black placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* REASON Dropdown */}
            <div className="flex items-center gap-1 border border-black bg-white px-2 py-1 text-xs">
              <span className="text-gray-500 uppercase text-[10px]">REASON:</span>
              <select
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
                className="bg-transparent font-bold uppercase focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">ALL REASONS ▼</option>
                <option value="Customer Request">Customer Request</option>
                <option value="Doctor">Doctor Note</option>
                <option value="Service Not Needed">Service Not Needed</option>
                <option value="Duplicate">Duplicate Payment</option>
                <option value="Quality">Quality / Dissatisfied</option>
                <option value="Chargeback">Chargeback</option>
              </select>
            </div>

            {/* METHOD Dropdown */}
            <div className="flex items-center gap-1 border border-black bg-white px-2 py-1 text-xs">
              <span className="text-gray-500 uppercase text-[10px]">METHOD:</span>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="bg-transparent font-bold uppercase focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">ORIGINAL PAYMENT ▼</option>
                <option value="Visa">Credit Card (Visa)</option>
                <option value="Amex">Credit Card (Amex)</option>
                <option value="Store Credit">Store Credit (Wallet)</option>
                <option value="Dispute">Dispute Case</option>
              </select>
            </div>

            {/* STAFF Dropdown */}
            <div className="flex items-center gap-1 border border-black bg-white px-2 py-1 text-xs">
              <span className="text-gray-500 uppercase text-[10px]">STAFF:</span>
              <select
                value={staffFilter}
                onChange={(e) => setStaffFilter(e.target.value)}
                className="bg-transparent font-bold uppercase focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">ALL OPERATORS ▼</option>
                <option value="David Chen">David Chen (GM)</option>
                <option value="Sarah Miller">Sarah Miller (Lead)</option>
                <option value="Front Desk">Front Desk Terminal</option>
              </select>
            </div>

            {/* DATE Dropdown */}
            <div className="flex items-center gap-1 border border-black bg-white px-2 py-1 text-xs">
              <span className="text-gray-500 uppercase text-[10px]">DATE:</span>
              <select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
                className="bg-transparent font-bold uppercase focus:outline-none cursor-pointer text-xs"
              >
                <option value="this-month">THIS MONTH (MAY 2025) ▼</option>
                <option value="today">TODAY</option>
                <option value="this-week">THIS WEEK</option>
                <option value="last-month">APRIL 2025</option>
                <option value="all-time">ALL TIME</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setReasonFilter('all');
              setMethodFilter('all');
              setStaffFilter('all');
              setActiveTab('all');
              showToast('Filters cleared');
            }}
            className="text-gray-500 hover:text-black uppercase text-[10px] underline cursor-pointer"
          >
            Clear
          </button>
        </div>

        {/* 📋 Table Columns */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-black border-collapse font-mono">
            <thead>
              <tr className="bg-neutral-100 border-b border-black font-bold uppercase text-[10px] tracking-wider text-black">
                <th className="py-2.5 px-3 border-r border-black w-24">REFUND #</th>
                <th className="py-2.5 px-3 border-r border-black w-28">ORIGINAL TX #</th>
                <th className="py-2.5 px-3 border-r border-black">CUSTOMER</th>
                <th className="py-2.5 px-3 border-r border-black">SERVICE / ITEM</th>
                <th className="py-2.5 px-3 border-r border-black">REASON</th>
                <th className="py-2.5 px-3 border-r border-black">REFUND METHOD</th>
                <th className="py-2.5 px-3 border-r border-black">PROCESSED DATE</th>
                <th className="py-2.5 px-3 border-r border-black text-right">AMOUNT</th>
                <th className="py-2.5 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500 font-mono text-xs">
                    No refunds matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((ref) => (
                  <tr 
                    key={ref.id}
                    onClick={() => setSelectedRefund(ref)}
                    className="hover:bg-neutral-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 font-bold border-r border-black whitespace-nowrap group-hover:underline">
                      {ref.id}
                    </td>
                    <td className="py-2.5 px-3 border-r border-black text-gray-600">
                      {ref.originalTx}
                    </td>
                    <td className="py-2.5 px-3 border-r border-black">
                      <p className="font-bold text-black uppercase">{ref.customer}</p>
                      <p className="text-[10px] text-gray-500">{ref.phone}</p>
                    </td>
                    <td className="py-2.5 px-3 border-r border-black">
                      <p className="font-bold text-black">{ref.serviceItem}</p>
                      <p className="text-[10px] text-gray-500">{ref.pet}</p>
                    </td>
                    <td className="py-2.5 px-3 border-r border-black text-gray-700">
                      {ref.reason}
                    </td>
                    <td className="py-2.5 px-3 border-r border-black text-gray-700">
                      {ref.method}
                    </td>
                    <td className="py-2.5 px-3 border-r border-black text-gray-600 whitespace-nowrap">
                      {ref.processedDate}
                    </td>
                    <td className="py-2.5 px-3 border-r border-black text-right font-black text-black whitespace-nowrap">
                      ${ref.amount.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      {/* ✏️ Row-Level Actions */}
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setSelectedRefund(ref)}
                          title="Click row to open full refund detail view"
                          className="px-2 py-0.5 border border-black bg-white hover:bg-neutral-100 text-[10px] font-bold uppercase transition-colors"
                        >
                          View
                        </button>
                        {ref.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => handleApproveRefund(ref.id)}
                              title="Approve pending refund"
                              className="px-2 py-0.5 border border-black bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRefund(ref.id)}
                              title="Reject pending refund"
                              className="px-2 py-0.5 border border-black bg-white hover:bg-neutral-100 text-[10px] font-bold uppercase transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => showToast(`Receipt generated for refund ${ref.id}`)}
                            title="Resend or print refund receipt"
                            className="px-2 py-0.5 border border-black bg-white hover:bg-neutral-100 text-[10px] font-bold uppercase transition-colors"
                          >
                            Receipt
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-neutral-50 border-t border-black flex flex-wrap items-center justify-between text-xs font-mono gap-2">
          <p className="text-gray-600 text-[11px] uppercase">
            Showing {filteredRefunds.length} of {refunds.length} recorded refund transactions
          </p>
          <div className="flex items-center gap-2 text-[11px]">
            <span>Active Status: <strong className="uppercase">{activeTab}</strong></span>
            <span>•</span>
            <span>Total Value in View: <strong>${filteredRefunds.reduce((acc, r) => acc + r.amount, 0).toFixed(2)}</strong></span>
          </div>
        </div>
      </div>

      {/* [+ ISSUE REFUND] Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleCreateRefund} className="bg-white border-2 border-black max-w-lg w-full p-6 space-y-4 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <h3 className="font-bold text-sm uppercase">ISSUE NEW REFUND / TRANSACTION CREDIT</h3>
              <button 
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="p-1 hover:bg-black hover:text-white border border-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 uppercase text-[10px] mb-1">ORIGINAL TRANSACTION #</label>
                <input 
                  type="text"
                  value={newOrigTx}
                  onChange={(e) => setNewOrigTx(e.target.value)}
                  className="w-full border border-black p-2 bg-white font-bold"
                  placeholder="TX-9844"
                />
              </div>
              <div>
                <label className="block text-gray-600 uppercase text-[10px] mb-1">CUSTOMER NAME *</label>
                <input 
                  type="text"
                  required
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full border border-black p-2 bg-white font-bold"
                  placeholder="e.g. Rachel Green"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 uppercase text-[10px] mb-1">REFUND AMOUNT ($) *</label>
                <input 
                  type="number"
                  step="0.01"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full border border-black p-2 bg-white font-bold text-base"
                  placeholder="25.00"
                />
              </div>
              <div>
                <label className="block text-gray-600 uppercase text-[10px] mb-1">REFUND METHOD</label>
                <select 
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value)}
                  className="w-full border border-black p-2 bg-white font-bold"
                >
                  <option>Original Payment Method (Stripe)</option>
                  <option>Store Credit (Salon Wallet)</option>
                  <option>Cash Drawer Reimbursement</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 uppercase text-[10px] mb-1">REASON CLASSIFICATION</label>
              <select 
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className="w-full border border-black p-2 bg-white font-bold"
              >
                <option>Customer Request (Vet/Health Emergency)</option>
                <option>Duplicate Payment / Terminal Error</option>
                <option>Service Canceled with Notice (&gt;24h)</option>
                <option>Quality / Manager Courtesy Adjustment</option>
                <option>Damaged Retail Goods Exchange</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 uppercase text-[10px] mb-1">INTERNAL AUDIT NOTES</label>
              <textarea 
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                rows={3}
                placeholder="Document reason, manager approvals, or vet notes..."
                className="w-full border border-black p-2 bg-white text-xs"
              />
            </div>

            <div className="pt-2 border-t border-black flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="px-4 py-2 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-black bg-black text-white hover:bg-neutral-800 uppercase font-bold text-xs"
              >
                Commit &amp; Process Refund
              </button>
            </div>
          </form>
        </div>
      )}

      {/* [REFUND POLICY SETTINGS] Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-lg w-full p-6 space-y-4 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <h3 className="font-bold text-sm uppercase">REFUND POLICY CONFIGURATION</h3>
              <button 
                onClick={() => setShowPolicyModal(false)}
                className="p-1 hover:bg-black hover:text-white border border-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="border border-black p-3 bg-neutral-50 space-y-1">
                <span className="font-bold uppercase block text-[11px]">AUTOMATIC REFUND WINDOW</span>
                <p className="text-[10px] text-gray-600">Deposits refunded automatically if cancellation submitted &gt; 24h prior.</p>
                <span className="font-bold text-black">ENFORCED: 24 HOURS</span>
              </div>

              <div className="border border-black p-3 bg-neutral-50 space-y-1">
                <span className="font-bold uppercase block text-[11px]">MANAGER AUTHORIZATION THRESHOLD</span>
                <p className="text-[10px] text-gray-600">Refunds exceeding this amount require General Manager PIN authorization.</p>
                <span className="font-bold text-black">THRESHOLD: &gt; $50.00</span>
              </div>

              <div className="border border-black p-3 bg-neutral-50 space-y-1">
                <span className="font-bold uppercase block text-[11px]">MAXIMUM REFUND RATE SLA</span>
                <p className="text-[10px] text-gray-600">System warns manager if monthly refunds exceed 2.0% of gross salon volume.</p>
                <span className="font-bold text-black">TARGET: &lt; 2.0% (Current: 0.8%)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-black flex justify-end">
              <button
                onClick={() => {
                  setShowPolicyModal(false);
                  showToast('Refund policy settings updated.');
                }}
                className="px-4 py-2 border border-black bg-black text-white hover:bg-neutral-800 uppercase font-bold text-xs"
              >
                Close &amp; Save Policies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Row-Level Detail Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-xl w-full p-6 space-y-4 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-black text-white font-bold text-xs uppercase">
                  {selectedRefund.status}
                </span>
                <h3 className="font-bold text-sm uppercase">REFUND DETAILS: {selectedRefund.id}</h3>
              </div>
              <button 
                onClick={() => setSelectedRefund(null)}
                className="p-1 hover:bg-black hover:text-white border border-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-3 border border-black">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">CUSTOMER &amp; CONTACT</span>
                <p className="font-bold text-sm">{selectedRefund.customer}</p>
                <p className="text-[10px] text-gray-600">{selectedRefund.phone}</p>
                <p className="text-[10px] text-gray-600">{selectedRefund.email}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">SERVICE &amp; PET</span>
                <p className="font-bold text-sm">{selectedRefund.serviceItem}</p>
                <p className="text-[10px] text-gray-600">{selectedRefund.pet}</p>
                <p className="text-[10px] text-gray-600">Original TX: {selectedRefund.originalTx}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border border-black p-3">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">REFUND AMOUNT</span>
                <p className="font-black text-lg text-black">${selectedRefund.amount.toFixed(2)}</p>
                <span className="text-[9px] text-gray-500 uppercase">{selectedRefund.isPartial ? 'Partial Refund' : 'Full Refund'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">PROCESSED ON</span>
                <p className="font-bold text-xs">{selectedRefund.processedDate}</p>
                <span className="text-[9px] text-gray-500">By: {selectedRefund.operator}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">METHOD</span>
                <p className="font-bold text-xs">{selectedRefund.method}</p>
              </div>
            </div>

            <div className="border border-black p-3 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase block">REASON &amp; INTERNAL NOTES</span>
              <p className="font-bold text-black">{selectedRefund.reason}</p>
              <p className="text-[11px] text-gray-600 mt-1">{selectedRefund.notes || 'Standard refund request logged in salon ledger.'}</p>
            </div>

            {/* Row-Level Actions */}
            <div className="pt-2 border-t border-black flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    showToast(`Viewing original transaction ${selectedRefund.originalTx}`);
                  }}
                  className="px-2.5 py-1.5 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-[11px] cursor-pointer"
                >
                  View Original
                </button>
                <button
                  onClick={() => {
                    showToast(`Receipt generated for ${selectedRefund.id}`);
                  }}
                  className="px-2.5 py-1.5 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Receipt</span>
                </button>
                <button
                  onClick={() => {
                    const note = prompt('Add internal note:', selectedRefund.notes);
                    if (note !== null) {
                      setRefunds(prev => prev.map(r => r.id === selectedRefund.id ? { ...r, notes: note } : r));
                      setSelectedRefund(prev => prev ? { ...prev, notes: note } : null);
                      showToast('Internal note saved.');
                    }
                  }}
                  className="px-2.5 py-1.5 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-[11px] cursor-pointer"
                >
                  Notes
                </button>
              </div>

              <div className="flex gap-1.5">
                {selectedRefund.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleRejectRefund(selectedRefund.id)}
                      className="px-3 py-1.5 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-[11px] cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveRefund(selectedRefund.id)}
                      className="px-4 py-1.5 border border-black bg-black text-white hover:bg-neutral-800 uppercase font-bold text-[11px] cursor-pointer"
                    >
                      Approve Refund
                    </button>
                  </>
                )}
                {selectedRefund.status === 'COMPLETED' && (
                  <button
                    onClick={() => handleVoidRefund(selectedRefund.id)}
                    className="px-3 py-1.5 border border-black bg-neutral-100 hover:bg-black hover:text-white uppercase font-bold text-[11px] cursor-pointer"
                  >
                    Void Refund
                  </button>
                )}
                {selectedRefund.status === 'DISPUTED' && (
                  <button
                    onClick={() => {
                      showToast(`Opened dispute case for ${selectedRefund.id} in Stripe Chamber`);
                      if (onNavigateSection) onNavigateSection('settings');
                    }}
                    className="px-3 py-1.5 border border-black bg-black text-white hover:bg-neutral-800 uppercase font-bold text-[11px] cursor-pointer"
                  >
                    Dispute Chamber
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
