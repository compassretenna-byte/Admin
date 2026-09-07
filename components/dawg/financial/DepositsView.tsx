'use client';

import React, { useState, useMemo } from 'react';
import { 
  Coins, 
  Search, 
  Download, 
  Plus, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Undo2, 
  Calendar,
  Settings,
  ShieldCheck,
  Filter,
  X,
  Printer,
  Share2,
  ArrowRight,
  RefreshCw,
  FileText,
  User,
  Clock,
  CreditCard,
  Building2,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { DawgNavSection } from '@/lib/types';

interface DepositsViewProps {
  onNavigateSection?: (section: DawgNavSection) => void;
}

export type DepositStatus = 'HELD' | 'APPLIED' | 'RELEASED' | 'FORFEITED' | 'REFUNDED';
export type DepositType = 'all' | 'booking' | 'service' | 'promo' | 'holiday';
export type AppDateFilter = 'all' | 'upcoming' | 'past' | 'today';

interface DepositItem {
  id: string;
  customer: string;
  phone: string;
  email: string;
  pet: string;
  service: string;
  amount: number;
  collectedDate: string;
  targetAppt: string;
  targetApptDate: string;
  method: string;
  status: DepositStatus;
  location: string;
  type: 'booking' | 'service' | 'promo' | 'holiday';
  notes?: string;
  linkedInvoiceId?: string;
}

const INITIAL_DEPOSITS: DepositItem[] = [
  {
    id: 'DEP-4091',
    customer: 'Sarah Johnson',
    phone: '+1 (555) 382-9011',
    email: 'sarah.j@example.com',
    pet: 'Buddy (Golden Retriever)',
    service: 'Full Groom',
    amount: 25.00,
    collectedDate: 'May 09, 2025',
    targetAppt: 'May 16, 2025 (10:30 AM)',
    targetApptDate: '2025-05-16',
    method: 'Visa •••• 4242',
    status: 'HELD',
    location: 'Frisco Main HQ',
    type: 'booking',
    notes: 'Online booking deposit paid via Stripe.'
  },
  {
    id: 'DEP-4090',
    customer: 'Mike Ross',
    phone: '+1 (555) 742-1188',
    email: 'mike.ross@example.com',
    pet: 'Luna (Standard Poodle)',
    service: 'Full Groom + Add-ons',
    amount: 35.00,
    collectedDate: 'May 10, 2025',
    targetAppt: 'May 20, 2025 (10:30 AM)',
    targetApptDate: '2025-05-20',
    method: 'MasterCard •••• 8812',
    status: 'HELD',
    location: 'Frisco Main HQ',
    type: 'holiday',
    notes: 'Peak weekend slot reservation hold.'
  },
  {
    id: 'DEP-4089',
    customer: 'Marcus Johnson',
    phone: '+1 (555) 902-8371',
    email: 'marcus.j@example.com',
    pet: 'Max (Goldendoodle)',
    service: 'Bath & Brush',
    amount: 25.00,
    collectedDate: 'May 11, 2025',
    targetAppt: 'May 18, 2025 (01:00 PM)',
    targetApptDate: '2025-05-18',
    method: 'Amex •••• 1009',
    status: 'HELD',
    location: 'Plano West Branch',
    type: 'booking',
    notes: 'Mobile booking deposit.'
  },
  {
    id: 'DEP-4088',
    customer: 'Amanda Garcia',
    phone: '+1 (555) 129-4482',
    email: 'amanda.g@example.com',
    pet: 'Cooper (Labradoodle)',
    service: 'De-Shedding Treatment',
    amount: 30.00,
    collectedDate: 'May 08, 2025',
    targetAppt: 'May 14, 2025 (02:30 PM)',
    targetApptDate: '2025-05-14',
    method: 'Visa •••• 9941',
    status: 'HELD',
    location: 'Frisco Main HQ',
    type: 'service',
    notes: 'First time client deposit protocol.'
  },
  {
    id: 'DEP-4087',
    customer: 'David Wilson',
    phone: '+1 (555) 892-1200',
    email: 'dwilson@example.com',
    pet: 'Bella (Shih Tzu)',
    service: 'Puppy First Groom',
    amount: 25.00,
    collectedDate: 'May 02, 2025',
    targetAppt: 'May 10, 2025 (09:00 AM)',
    targetApptDate: '2025-05-10',
    method: 'Visa •••• 3310',
    status: 'APPLIED',
    location: 'Frisco Main HQ',
    type: 'booking',
    linkedInvoiceId: 'INV-2025-081',
    notes: 'Converted to payment against invoice INV-2025-081.'
  },
  {
    id: 'DEP-4086',
    customer: 'Jessica Lee',
    phone: '+1 (555) 774-0012',
    email: 'jlee@example.com',
    pet: 'Rocky (French Bulldog)',
    service: 'Full Groom',
    amount: 25.00,
    collectedDate: 'Apr 28, 2025',
    targetAppt: 'May 08, 2025 (11:00 AM)',
    targetApptDate: '2025-05-08',
    method: 'Apple Pay (Visa)',
    status: 'APPLIED',
    location: 'Plano West Branch',
    type: 'booking',
    linkedInvoiceId: 'INV-2025-078',
    notes: 'Applied at salon register POS.'
  },
  {
    id: 'DEP-4085',
    customer: 'Robert Taylor',
    phone: '+1 (555) 301-9988',
    email: 'rtaylor@example.com',
    pet: 'Duke (German Shepherd)',
    service: 'Full Grooming Suite',
    amount: 35.00,
    collectedDate: 'May 01, 2025',
    targetAppt: 'May 09, 2025 (08:30 AM)',
    targetApptDate: '2025-05-09',
    method: 'Visa •••• 1120',
    status: 'FORFEITED',
    location: 'Frisco Main HQ',
    type: 'booking',
    notes: 'Client cancelled 3 hours prior to appointment. 100% late cancel forfeiture.'
  },
  {
    id: 'DEP-4084',
    customer: 'Emily Watson',
    phone: '+1 (555) 662-8119',
    email: 'ewatson@example.com',
    pet: 'Coco (Cockapoo)',
    service: 'Bath & Brush',
    amount: 25.00,
    collectedDate: 'May 03, 2025',
    targetAppt: 'May 07, 2025 (03:00 PM)',
    targetApptDate: '2025-05-07',
    method: 'MasterCard •••• 5590',
    status: 'REFUNDED',
    location: 'Frisco Main HQ',
    type: 'booking',
    notes: 'Medical emergency with vet doctor note provided.'
  },
  {
    id: 'DEP-4083',
    customer: 'Brian Miller',
    phone: '+1 (555) 441-2099',
    email: 'bmiller@example.com',
    pet: 'Charlie (Corgi)',
    service: 'Spa Groom + Teeth',
    amount: 25.00,
    collectedDate: 'Apr 25, 2025',
    targetAppt: 'May 04, 2025 (10:00 AM)',
    targetApptDate: '2025-05-04',
    method: 'Visa •••• 8831',
    status: 'RELEASED',
    location: 'Mobile Van Fleet',
    type: 'booking',
    notes: 'Released back as customer wallet credit.'
  }
];

export const DepositsView: React.FC<DepositsViewProps> = ({ onNavigateSection }) => {
  const [deposits, setDeposits] = useState<DepositItem[]>(INITIAL_DEPOSITS);
  const [activeTab, setActiveTab] = useState<'all' | 'held' | 'applied' | 'released' | 'forfeited' | 'refunded'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<DepositType>('all');
  const [dateFilter, setDateFilter] = useState<AppDateFilter>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [sortField, setSortField] = useState<'id' | 'customer' | 'amount' | 'collected' | 'target'>('collected');
  const [sortAsc, setSortAsc] = useState(false);

  // Modals
  const [selectedDeposit, setSelectedDeposit] = useState<DepositItem | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Summary Metrics calculations
  const totalActiveHeld = useMemo(() => 
    deposits.filter(d => d.status === 'HELD').reduce((acc, d) => acc + d.amount, 0),
    [deposits]
  );
  const heldUpcoming = useMemo(() => 
    deposits.filter(d => d.status === 'HELD' && new Date(d.targetApptDate) >= new Date('2025-05-12')).reduce((acc, d) => acc + d.amount, 0),
    [deposits]
  );
  const appliedThisMonth = useMemo(() => 
    deposits.filter(d => d.status === 'APPLIED').reduce((acc, d) => acc + d.amount, 0),
    [deposits]
  );
  const forfeitedTotal = useMemo(() => 
    deposits.filter(d => d.status === 'FORFEITED').reduce((acc, d) => acc + d.amount, 0),
    [deposits]
  );
  const refundedTotal = useMemo(() => 
    deposits.filter(d => d.status === 'REFUNDED').reduce((acc, d) => acc + d.amount, 0),
    [deposits]
  );

  // Filtered deposits
  const filteredDeposits = useMemo(() => {
    return deposits.filter(dep => {
      // Tab filter
      if (activeTab === 'held' && dep.status !== 'HELD') return false;
      if (activeTab === 'applied' && dep.status !== 'APPLIED') return false;
      if (activeTab === 'released' && dep.status !== 'RELEASED') return false;
      if (activeTab === 'forfeited' && dep.status !== 'FORFEITED') return false;
      if (activeTab === 'refunded' && dep.status !== 'REFUNDED') return false;

      // Type filter
      if (typeFilter !== 'all' && dep.type !== typeFilter) return false;

      // Date filter
      if (dateFilter === 'upcoming' && new Date(dep.targetApptDate) < new Date('2025-05-12')) return false;
      if (dateFilter === 'past' && new Date(dep.targetApptDate) >= new Date('2025-05-12')) return false;
      if (dateFilter === 'today' && dep.targetApptDate !== '2025-05-12') return false;

      // Location filter
      if (locationFilter !== 'all' && dep.location !== locationFilter) return false;

      // Free text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = dep.id.toLowerCase().includes(query);
        const matchesCust = dep.customer.toLowerCase().includes(query);
        const matchesPet = dep.pet.toLowerCase().includes(query);
        const matchesService = dep.service.toLowerCase().includes(query);
        const matchesTarget = dep.targetAppt.toLowerCase().includes(query);
        return matchesId || matchesCust || matchesPet || matchesService || matchesTarget;
      }

      return true;
    }).sort((a, b) => {
      let valA: any = a.id;
      let valB: any = b.id;

      if (sortField === 'customer') {
        valA = a.customer.toLowerCase();
        valB = b.customer.toLowerCase();
      } else if (sortField === 'amount') {
        valA = a.amount;
        valB = b.amount;
      } else if (sortField === 'collected') {
        valA = new Date(a.collectedDate).getTime();
        valB = new Date(b.collectedDate).getTime();
      } else if (sortField === 'target') {
        valA = new Date(a.targetApptDate).getTime();
        valB = new Date(b.targetApptDate).getTime();
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [deposits, activeTab, typeFilter, dateFilter, locationFilter, searchQuery, sortField, sortAsc]);

  // Actions
  const handleApplyToInvoice = (depId: string) => {
    setDeposits(prev => prev.map(d => d.id === depId ? { ...d, status: 'APPLIED', linkedInvoiceId: 'INV-2025-090' } : d));
    showToast(`Deposit ${depId} converted to payment against open invoice.`);
    if (selectedDeposit?.id === depId) {
      setSelectedDeposit(prev => prev ? { ...prev, status: 'APPLIED', linkedInvoiceId: 'INV-2025-090' } : null);
    }
  };

  const handleReleaseDeposit = (depId: string) => {
    setDeposits(prev => prev.map(d => d.id === depId ? { ...d, status: 'RELEASED' } : d));
    showToast(`Deposit ${depId} released as customer wallet credit.`);
    if (selectedDeposit?.id === depId) {
      setSelectedDeposit(prev => prev ? { ...prev, status: 'RELEASED' } : null);
    }
  };

  const handleRefundDeposit = (depId: string) => {
    setDeposits(prev => prev.map(d => d.id === depId ? { ...d, status: 'REFUNDED' } : d));
    showToast(`Deposit ${depId} refunded to original payment method.`);
    if (selectedDeposit?.id === depId) {
      setSelectedDeposit(prev => prev ? { ...prev, status: 'REFUNDED' } : null);
    }
  };

  const handleForfeitDeposit = (depId: string) => {
    setDeposits(prev => prev.map(d => d.id === depId ? { ...d, status: 'FORFEITED' } : d));
    showToast(`Deposit ${depId} marked as forfeited (late cancel policy).`);
    if (selectedDeposit?.id === depId) {
      setSelectedDeposit(prev => prev ? { ...prev, status: 'FORFEITED' } : null);
    }
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
            <span className="font-mono text-[10px] bg-black text-white px-1.5 py-0.5 uppercase font-bold">SEC:03.3</span>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black flex items-center gap-2">
              <span>📄 Deposits Dashboard</span>
            </h1>
          </div>
          <p className="text-xs text-gray-600 mt-1 font-mono">
            All About Pawz holding account, reservation guarantees, and deposit lifecycle ledger.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csv = deposits.map(d => `${d.id},${d.customer},${d.amount},${d.status}`).join('\n');
              const blob = new Blob([`ID,Customer,Amount,Status\n${csv}`], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'all_about_pawz_deposits.csv';
              a.click();
              showToast('Exporting deposits ledger .CSV');
            }}
            className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              if (onNavigateSection) onNavigateSection('settings');
            }}
            className="px-3 py-1.5 border border-black bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Deposit Rules</span>
          </button>
        </div>
      </div>

      {/* 📊 Summary Cards (each is a clickable navigation or action) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* TOTAL ACTIVE DEPOSITS */}
        <button
          onClick={() => { setActiveTab('held'); showToast('Filtering all currently held active deposits'); }}
          className={`border border-black p-3.5 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            activeTab === 'held' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider opacity-80">
            <span>TOTAL ACTIVE DEPOSITS</span>
            <Coins className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl font-black font-mono mt-2 tracking-tight">${totalActiveHeld.toFixed(2)}</p>
          <p className="text-[10px] font-mono mt-0.5 opacity-70">
            [Click card] → Held ({deposits.filter(d => d.status === 'HELD').length})
          </p>
        </button>

        {/* HELD FOR UPCOMING */}
        <button
          onClick={() => { setActiveTab('held'); setDateFilter('upcoming'); showToast('Filtering deposits tied to upcoming appointments'); }}
          className={`border border-black p-3.5 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            activeTab === 'held' && dateFilter === 'upcoming' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider opacity-80">
            <span>HELD FOR UPCOMING</span>
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl font-black font-mono mt-2 tracking-tight">${heldUpcoming.toFixed(2)}</p>
          <p className="text-[10px] font-mono mt-0.5 opacity-70">[Click card] → Future appts</p>
        </button>

        {/* APPLIED THIS MONTH */}
        <button
          onClick={() => { setActiveTab('applied'); showToast('Filtering deposits applied to invoices this month'); }}
          className={`border border-black p-3.5 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            activeTab === 'applied' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider opacity-80">
            <span>APPLIED THIS MONTH</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl font-black font-mono mt-2 tracking-tight">${appliedThisMonth.toFixed(2)}</p>
          <p className="text-[10px] font-mono mt-0.5 opacity-70">
            [Click card] → Applied ({deposits.filter(d => d.status === 'APPLIED').length})
          </p>
        </button>

        {/* FORFEITED / LATE CANCEL */}
        <button
          onClick={() => { setActiveTab('forfeited'); showToast('Filtering forfeited deposits from late cancellations'); }}
          className={`border border-black p-3.5 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            activeTab === 'forfeited' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider opacity-80">
            <span>FORFEITED / CANCEL</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl font-black font-mono mt-2 tracking-tight">${forfeitedTotal.toFixed(2)}</p>
          <p className="text-[10px] font-mono mt-0.5 opacity-70">
            [Click card] → Forfeited ({deposits.filter(d => d.status === 'FORFEITED').length})
          </p>
        </button>

        {/* REFUNDED DEPOSITS */}
        <button
          onClick={() => { setActiveTab('refunded'); showToast('Filtering deposit refund history'); }}
          className={`border border-black p-3.5 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            activeTab === 'refunded' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider opacity-80">
            <span>REFUNDED DEPOSITS</span>
            <Undo2 className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl font-black font-mono mt-2 tracking-tight">${refundedTotal.toFixed(2)}</p>
          <p className="text-[10px] font-mono mt-0.5 opacity-70">
            [Click card] → Refunds ({deposits.filter(d => d.status === 'REFUNDED').length})
          </p>
        </button>

        {/* DEFAULT DEPOSIT REQ. */}
        <div className="border border-black p-3.5 bg-neutral-50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-600">
            <span>DEFAULT DEPOSIT REQ.</span>
            <Settings className="w-3.5 h-3.5 text-black" />
          </div>
          <p className="text-xl font-black font-mono mt-2 tracking-tight text-black">$25.00 <span className="text-xs font-normal text-gray-500">/ 20%</span></p>
          <button
            onClick={() => {
              if (onNavigateSection) onNavigateSection('settings');
            }}
            className="mt-1 text-[10px] font-bold uppercase font-mono text-black underline underline-offset-2 hover:text-neutral-600 text-left cursor-pointer"
          >
            [CONFIGURE] → Edit Rules
          </button>
        </div>
      </div>

      {/* Main Panel Container */}
      <div className="border border-black bg-white">
        {/* 📋 Deposit List Tabs (filter the main table by status) */}
        <div className="flex items-center overflow-x-auto border-b border-black bg-neutral-100">
          {[
            { id: 'all', label: 'ALL DEPOSITS', count: deposits.length },
            { id: 'held', label: 'HELD / ACTIVE', count: deposits.filter(d => d.status === 'HELD').length },
            { id: 'applied', label: 'APPLIED TO INVOICE', count: deposits.filter(d => d.status === 'APPLIED').length },
            { id: 'released', label: 'RELEASED', count: deposits.filter(d => d.status === 'RELEASED').length },
            { id: 'forfeited', label: 'FORFEITED', count: deposits.filter(d => d.status === 'FORFEITED').length },
            { id: 'refunded', label: 'REFUNDED', count: deposits.filter(d => d.status === 'REFUNDED').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold uppercase font-mono tracking-wider border-r border-black whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-black hover:bg-neutral-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* 🔍 Search & Filters (modify which deposits are shown) */}
        <div className="p-3 bg-white border-b border-black flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            {/* Search bar with [⌨️K] */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-2.5 top-2.5 text-gray-500 pointer-events-none">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Deposit ID, customer name, appointment..."
                className="w-full h-8 pl-8 pr-12 text-xs bg-white border border-black text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black font-mono"
              />
              <span className="absolute right-2 top-2 px-1 text-[9px] border border-black bg-neutral-100 text-black font-bold">
                ⌨️K
              </span>
            </div>

            {/* TYPE dropdown */}
            <div className="flex items-center gap-1 border border-black bg-white px-2 py-1 text-xs">
              <span className="text-gray-500 uppercase text-[10px]">TYPE:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as DepositType)}
                className="bg-transparent font-bold uppercase focus:outline-none cursor-pointer"
              >
                <option value="all">ALL ▼</option>
                <option value="booking">BOOKING DEPOSIT</option>
                <option value="service">SERVICE PREPAY</option>
                <option value="holiday">HOLIDAY / PEAK</option>
                <option value="promo">PROMO HOLD</option>
              </select>
            </div>

            {/* APP DATE dropdown */}
            <div className="flex items-center gap-1 border border-black bg-white px-2 py-1 text-xs">
              <span className="text-gray-500 uppercase text-[10px]">APP DATE:</span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as AppDateFilter)}
                className="bg-transparent font-bold uppercase focus:outline-none cursor-pointer"
              >
                <option value="all">ALL DATES ▼</option>
                <option value="upcoming">UPCOMING ▼</option>
                <option value="today">TODAY</option>
                <option value="past">PAST</option>
              </select>
            </div>

            {/* LOCATION dropdown */}
            <div className="flex items-center gap-1 border border-black bg-white px-2 py-1 text-xs">
              <span className="text-gray-500 uppercase text-[10px]">LOCATION:</span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-transparent font-bold uppercase focus:outline-none cursor-pointer"
              >
                <option value="all">ALL LOCATIONS ▼</option>
                <option value="Frisco Main HQ">FRISCO HQ</option>
                <option value="Plano West Branch">PLANO WEST</option>
                <option value="Mobile Van Fleet">MOBILE FLEET</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="px-3 py-1.5 border border-black bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>[MORE FILTERS]</span>
            </button>
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setDateFilter('all');
                setLocationFilter('all');
                setActiveTab('all');
                showToast('All filters reset');
              }}
              className="px-2 py-1.5 text-gray-500 hover:text-black uppercase text-[11px] underline cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Expandable More Filters Panel */}
        {showMoreFilters && (
          <div className="p-3 bg-neutral-50 border-b border-black grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div>
              <label className="block text-[10px] text-gray-600 uppercase mb-1">SORT BY COLUMN</label>
              <div className="flex gap-1">
                <select 
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as any)}
                  className="flex-1 border border-black p-1 bg-white font-bold text-xs uppercase"
                >
                  <option value="collected">Collected Date</option>
                  <option value="target">Target Appt Date</option>
                  <option value="amount">Deposit Amount</option>
                  <option value="customer">Customer Name</option>
                  <option value="id">Deposit ID</option>
                </select>
                <button
                  onClick={() => setSortAsc(!sortAsc)}
                  className="px-2 border border-black bg-white font-bold"
                >
                  {sortAsc ? 'ASC ↑' : 'DESC ↓'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-gray-600 uppercase mb-1">PAYMENT METHOD</label>
              <select className="w-full border border-black p-1 bg-white text-xs uppercase">
                <option>ALL METHODS</option>
                <option>VISA</option>
                <option>MASTERCARD</option>
                <option>AMEX</option>
                <option>APPLE PAY</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-gray-600 uppercase mb-1">AMOUNT RANGE</label>
              <div className="flex gap-1 items-center">
                <input type="number" placeholder="Min $" className="w-1/2 border border-black p-1 bg-white text-xs" />
                <span>-</span>
                <input type="number" placeholder="Max $" className="w-1/2 border border-black p-1 bg-white text-xs" />
              </div>
            </div>
          </div>
        )}

        {/* 📋 Table Columns */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-black border-collapse font-mono">
            <thead>
              <tr className="bg-neutral-100 border-b border-black font-bold uppercase text-[10px] tracking-wider text-black">
                <th 
                  onClick={() => { setSortField('id'); setSortAsc(!sortAsc); }}
                  className="py-2.5 px-3 border-r border-black cursor-pointer hover:bg-neutral-200"
                >
                  DEPOSIT ID {sortField === 'id' && (sortAsc ? '▲' : '▼')}
                </th>
                <th 
                  onClick={() => { setSortField('customer'); setSortAsc(!sortAsc); }}
                  className="py-2.5 px-3 border-r border-black cursor-pointer hover:bg-neutral-200"
                >
                  CUSTOMER {sortField === 'customer' && (sortAsc ? '▲' : '▼')}
                </th>
                <th className="py-2.5 px-3 border-r border-black">
                  PET &amp; SERVICE
                </th>
                <th 
                  onClick={() => { setSortField('amount'); setSortAsc(!sortAsc); }}
                  className="py-2.5 px-3 border-r border-black text-right cursor-pointer hover:bg-neutral-200"
                >
                  AMOUNT {sortField === 'amount' && (sortAsc ? '▲' : '▼')}
                </th>
                <th 
                  onClick={() => { setSortField('collected'); setSortAsc(!sortAsc); }}
                  className="py-2.5 px-3 border-r border-black cursor-pointer hover:bg-neutral-200"
                >
                  COLLECTED {sortField === 'collected' && (sortAsc ? '▲' : '▼')}
                </th>
                <th 
                  onClick={() => { setSortField('target'); setSortAsc(!sortAsc); }}
                  className="py-2.5 px-3 border-r border-black cursor-pointer hover:bg-neutral-200"
                >
                  TARGET APPOINTMENT {sortField === 'target' && (sortAsc ? '▲' : '▼')}
                </th>
                <th className="py-2.5 px-3 border-r border-black">
                  METHOD
                </th>
                <th className="py-2.5 px-3 border-r border-black text-center">
                  STATUS
                </th>
                <th className="py-2.5 px-3 text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500 font-mono text-xs">
                    No deposits matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((dep) => (
                  <tr 
                    key={dep.id} 
                    className="hover:bg-neutral-50 transition-colors cursor-pointer group"
                  >
                    <td 
                      onClick={() => setSelectedDeposit(dep)}
                      className="py-2.5 px-3 font-bold text-black border-r border-black whitespace-nowrap group-hover:underline"
                    >
                      {dep.id}
                    </td>
                    <td 
                      onClick={() => setSelectedDeposit(dep)}
                      className="py-2.5 px-3 border-r border-black"
                    >
                      <p className="font-bold text-black uppercase">{dep.customer}</p>
                      <p className="text-[10px] text-gray-500">{dep.phone}</p>
                    </td>
                    <td 
                      onClick={() => setSelectedDeposit(dep)}
                      className="py-2.5 px-3 border-r border-black"
                    >
                      <p className="font-bold text-black">{dep.pet}</p>
                      <p className="text-[10px] text-gray-600">{dep.service}</p>
                    </td>
                    <td 
                      onClick={() => setSelectedDeposit(dep)}
                      className="py-2.5 px-3 border-r border-black text-right font-black text-black"
                    >
                      ${dep.amount.toFixed(2)}
                    </td>
                    <td 
                      onClick={() => setSelectedDeposit(dep)}
                      className="py-2.5 px-3 border-r border-black text-gray-600 whitespace-nowrap"
                    >
                      {dep.collectedDate}
                    </td>
                    <td 
                      onClick={() => setSelectedDeposit(dep)}
                      className="py-2.5 px-3 border-r border-black text-black whitespace-nowrap"
                    >
                      {dep.targetAppt}
                    </td>
                    <td 
                      onClick={() => setSelectedDeposit(dep)}
                      className="py-2.5 px-3 border-r border-black text-gray-700 whitespace-nowrap"
                    >
                      {dep.method}
                    </td>
                    <td 
                      onClick={() => setSelectedDeposit(dep)}
                      className="py-2.5 px-3 border-r border-black text-center"
                    >
                      <span className={`inline-block px-1.5 py-0.5 border border-black text-[9px] font-bold uppercase ${
                        dep.status === 'HELD'
                          ? 'bg-white text-black'
                          : dep.status === 'APPLIED'
                          ? 'bg-black text-white'
                          : dep.status === 'FORFEITED'
                          ? 'bg-neutral-200 text-black border-dashed'
                          : dep.status === 'REFUNDED'
                          ? 'bg-neutral-100 text-neutral-800'
                          : 'bg-neutral-50 text-neutral-600'
                      }`}>
                        {dep.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      {/* ✏️ Row-Level Actions */}
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setSelectedDeposit(dep)}
                          title="Open full deposit detail view"
                          className="px-2 py-0.5 border border-black bg-white hover:bg-neutral-100 text-[10px] font-bold uppercase transition-colors"
                        >
                          View
                        </button>
                        {dep.status === 'HELD' && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleApplyToInvoice(dep.id); }}
                              title="Apply to Invoice"
                              className="px-2 py-0.5 border border-black bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase transition-colors"
                            >
                              Apply
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRefundDeposit(dep.id); }}
                              title="Initiate refund"
                              className="px-2 py-0.5 border border-black bg-white hover:bg-neutral-100 text-[10px] font-bold uppercase transition-colors"
                            >
                              Refund
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleForfeitDeposit(dep.id); }}
                              title="Forfeit deposit"
                              className="px-2 py-0.5 border border-black bg-neutral-100 hover:bg-black hover:text-white text-[10px] font-bold uppercase transition-colors"
                            >
                              Forfeit
                            </button>
                          </>
                        )}
                        {(dep.status === 'APPLIED' || dep.status === 'REFUNDED') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast(`Resending deposit receipt for ${dep.id} to ${dep.email}`);
                            }}
                            title="Resend or print deposit receipt"
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
            Showing {filteredDeposits.length} of {deposits.length} total recorded deposits
          </p>
          <div className="flex items-center gap-2 text-[11px]">
            <span>Active Filter: <strong className="uppercase">{activeTab}</strong></span>
            <span>•</span>
            <span>Type: <strong className="uppercase">{typeFilter}</strong></span>
          </div>
        </div>
      </div>

      {/* ✏️ Detail / Action Modal */}
      {selectedDeposit && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-xl w-full p-6 space-y-4 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-black text-white font-bold text-xs uppercase">
                  {selectedDeposit.status}
                </span>
                <h3 className="font-bold text-sm uppercase">DEPOSIT DETAIL: {selectedDeposit.id}</h3>
              </div>
              <button 
                onClick={() => setSelectedDeposit(null)}
                className="p-1 hover:bg-black hover:text-white border border-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-3 border border-black">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">CUSTOMER &amp; PHONE</span>
                <p className="font-bold text-sm">{selectedDeposit.customer}</p>
                <p className="text-[10px] text-gray-600">{selectedDeposit.phone}</p>
                <p className="text-[10px] text-gray-600">{selectedDeposit.email}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">PET &amp; SERVICE</span>
                <p className="font-bold text-sm">{selectedDeposit.pet}</p>
                <p className="text-[10px] text-gray-600">{selectedDeposit.service}</p>
                <p className="text-[10px] text-gray-600">Location: {selectedDeposit.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border border-black p-3">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">AMOUNT HELD</span>
                <p className="font-black text-lg">${selectedDeposit.amount.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">COLLECTED ON</span>
                <p className="font-bold text-xs">{selectedDeposit.collectedDate}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">PAYMENT METHOD</span>
                <p className="font-bold text-xs">{selectedDeposit.method}</p>
              </div>
            </div>

            <div className="border border-black p-3 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase block">TARGET APPOINTMENT</span>
              <p className="font-bold">{selectedDeposit.targetAppt}</p>
              <p className="text-[11px] text-gray-600 mt-1">{selectedDeposit.notes || 'Standard booking reservation deposit on file.'}</p>
              {selectedDeposit.linkedInvoiceId && (
                <p className="text-[11px] text-black font-bold pt-1">
                  Linked Invoice: {selectedDeposit.linkedInvoiceId} (Settled)
                </p>
              )}
            </div>

            {/* Row-Level Modal Action Buttons */}
            <div className="pt-2 border-t border-black flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    showToast(`Printing receipt for ${selectedDeposit.id}`);
                  }}
                  className="px-2.5 py-1.5 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Receipt</span>
                </button>
                <button
                  onClick={() => {
                    showToast(`Transfer dialog opened for ${selectedDeposit.id}`);
                  }}
                  className="px-2.5 py-1.5 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-[11px] cursor-pointer"
                >
                  Transfer
                </button>
                <button
                  onClick={() => {
                    const newNotes = prompt('Edit deposit notes:', selectedDeposit.notes);
                    if (newNotes !== null) {
                      setDeposits(prev => prev.map(d => d.id === selectedDeposit.id ? { ...d, notes: newNotes } : d));
                      setSelectedDeposit(prev => prev ? { ...prev, notes: newNotes } : null);
                      showToast('Deposit notes updated.');
                    }
                  }}
                  className="px-2.5 py-1.5 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-[11px] cursor-pointer"
                >
                  Edit
                </button>
              </div>

              <div className="flex gap-1.5">
                {selectedDeposit.status === 'HELD' && (
                  <>
                    <button
                      onClick={() => handleReleaseDeposit(selectedDeposit.id)}
                      className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-[11px] cursor-pointer"
                    >
                      Release
                    </button>
                    <button
                      onClick={() => handleForfeitDeposit(selectedDeposit.id)}
                      className="px-3 py-1.5 border border-black bg-neutral-200 hover:bg-black hover:text-white font-bold uppercase text-[11px] cursor-pointer"
                    >
                      Forfeit
                    </button>
                    <button
                      onClick={() => handleRefundDeposit(selectedDeposit.id)}
                      className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-[11px] cursor-pointer"
                    >
                      Refund
                    </button>
                    <button
                      onClick={() => handleApplyToInvoice(selectedDeposit.id)}
                      className="px-4 py-1.5 border border-black bg-black text-white hover:bg-neutral-800 font-bold uppercase text-[11px] cursor-pointer"
                    >
                      Apply to Invoice
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
