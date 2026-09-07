'use client';

import React, { useState, useMemo } from 'react';
import { 
  Gift, 
  Search, 
  Download, 
  Plus, 
  CreditCard, 
  Mail, 
  QrCode, 
  Check, 
  MoreHorizontal,
  DollarSign,
  Send,
  X,
  Printer,
  RefreshCw,
  Clock,
  Sparkles,
  ShieldCheck,
  Ban,
  ArrowRight,
  Wallet
} from 'lucide-react';
import { DawgNavSection } from '@/lib/types';

interface GiftCardsViewProps {
  onNavigateSection?: (section: DawgNavSection) => void;
}

export type CardType = 'DIGITAL' | 'PHYSICAL' | 'STORE CREDIT';
export type CardStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'DEPLETED';

interface CardItem {
  id: string;
  code: string;
  type: CardType;
  recipient: string;
  recipientEmail: string;
  recipientPhone: string;
  purchaser: string;
  initialValue: number;
  currentBalance: number;
  issueDate: string;
  lastUsed: string;
  status: CardStatus;
  notes?: string;
  expirationDate?: string;
}

const INITIAL_CARDS: CardItem[] = [
  {
    id: 'GC-PAWZ-8812',
    code: 'PAWZ-8812-9901',
    type: 'PHYSICAL',
    recipient: 'David Wilson',
    recipientEmail: 'dwilson@example.com',
    recipientPhone: '+1 (555) 892-1200',
    purchaser: 'Self Purchase (POS Terminal #1)',
    initialValue: 100.00,
    currentBalance: 65.00,
    issueDate: 'Apr 15, 2025',
    lastUsed: 'May 11, 2025',
    status: 'ACTIVE',
    expirationDate: 'Never Expires (TX State Compliant)',
    notes: 'Plastic gift card issued at Frisco HQ counter.'
  },
  {
    id: 'GC-PAWZ-9401',
    code: 'PAWZ-9401-2314',
    type: 'DIGITAL',
    recipient: 'Sarah Johnson (Gift for Mom - Linda)',
    recipientEmail: 'linda.j@example.com',
    recipientPhone: '+1 (555) 382-9011',
    purchaser: 'Sarah Johnson (Online Portal)',
    initialValue: 150.00,
    currentBalance: 150.00,
    issueDate: 'May 08, 2025',
    lastUsed: 'NEVER USED',
    status: 'ACTIVE',
    expirationDate: 'Never Expires',
    notes: 'Mother’s Day digital voucher delivery.'
  },
  {
    id: 'SC-CRED-0142',
    code: 'CRED-0142-TX97',
    type: 'STORE CREDIT',
    recipient: 'Chris Evans',
    recipientEmail: 'cevans@example.net',
    recipientPhone: '+1 (555) 902-8811',
    purchaser: 'Store Refund Credit (INV-1092)',
    initialValue: 32.50,
    currentBalance: 32.50,
    issueDate: 'Apr 25, 2025',
    lastUsed: 'NEVER USED',
    status: 'ACTIVE',
    expirationDate: 'Never Expires',
    notes: 'Courtesy credit for rescheduled bath.'
  },
  {
    id: 'GC-PAWZ-7719',
    code: 'PAWZ-7719-5501',
    type: 'PHYSICAL',
    recipient: 'Jessica Taylor',
    recipientEmail: 'jtaylor@example.com',
    recipientPhone: '+1 (555) 774-0012',
    purchaser: 'Holiday Pack Promo',
    initialValue: 50.00,
    currentBalance: 0.00,
    issueDate: 'Dec 15, 2024',
    lastUsed: 'May 02, 2025',
    status: 'DEPLETED',
    expirationDate: 'Expired',
    notes: 'Fully redeemed across 2 grooming sessions.'
  },
  {
    id: 'GC-PAWZ-6602',
    code: 'PAWZ-6602-1188',
    type: 'DIGITAL',
    recipient: 'Marcus Vance',
    recipientEmail: 'mvance@example.org',
    recipientPhone: '+1 (555) 441-2099',
    purchaser: 'Staff Loyalty Reward',
    initialValue: 75.00,
    currentBalance: 40.00,
    issueDate: 'Mar 10, 2025',
    lastUsed: 'Apr 18, 2025',
    status: 'ACTIVE',
    expirationDate: 'Never Expires',
    notes: 'Employee quarterly recognition credit.'
  },
  {
    id: 'SC-CRED-0141',
    code: 'CRED-0141-TX88',
    type: 'STORE CREDIT',
    recipient: 'Amanda Garcia',
    recipientEmail: 'agarcia@example.org',
    recipientPhone: '+1 (555) 129-4482',
    purchaser: 'Deposit Refund Conversion',
    initialValue: 25.00,
    currentBalance: 25.00,
    issueDate: 'May 02, 2025',
    lastUsed: 'NEVER USED',
    status: 'ACTIVE',
    expirationDate: 'Never Expires',
    notes: 'Released from cancelled deposit DEP-4083.'
  }
];

export const GiftCardsView: React.FC<GiftCardsViewProps> = ({ onNavigateSection }) => {
  const [cards, setCards] = useState<CardItem[]>(INITIAL_CARDS);
  const [activeTab, setActiveTab] = useState<'all' | 'digital' | 'physical' | 'credit' | 'depleted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cardTypeFilter, setCardTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [balanceFilter, setBalanceFilter] = useState('all');
  const [issuedFilter, setIssuedFilter] = useState('all');

  // Modals
  const [showCheckBalanceModal, setShowCheckBalanceModal] = useState(false);
  const [showIssueCreditModal, setShowIssueCreditModal] = useState(false);
  const [showIssueCardModal, setShowIssueCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Check Balance state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupCard, setLookupCard] = useState<CardItem | null>(null);

  // Issue Gift Card form state
  const [newCardType, setNewCardType] = useState<CardType>('DIGITAL');
  const [newRecipient, setNewRecipient] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAmount, setNewAmount] = useState('100.00');
  const [newPurchaser, setNewPurchaser] = useState('Salon Register');

  // Issue Store Credit form state
  const [creditRecipient, setCreditRecipient] = useState('');
  const [creditAmount, setCreditAmount] = useState('25.00');
  const [creditReason, setCreditReason] = useState('Customer Courtesy / Service Adjustment');

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Calculations
  const totalActiveBalance = useMemo(() => 
    cards.filter(c => c.status === 'ACTIVE').reduce((acc, c) => acc + c.currentBalance, 0),
    [cards]
  );

  const totalStoreCredits = useMemo(() => 
    cards.filter(c => c.type === 'STORE CREDIT' && c.status === 'ACTIVE').reduce((acc, c) => acc + c.currentBalance, 0),
    [cards]
  );

  const avgCardValue = useMemo(() => {
    const activeCards = cards.filter(c => c.status === 'ACTIVE');
    if (activeCards.length === 0) return 0;
    return activeCards.reduce((acc, c) => acc + c.initialValue, 0) / activeCards.length;
  }, [cards]);

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return cards.filter(c => {
      // Tab filter
      if (activeTab === 'digital' && c.type !== 'DIGITAL') return false;
      if (activeTab === 'physical' && c.type !== 'PHYSICAL') return false;
      if (activeTab === 'credit' && c.type !== 'STORE CREDIT') return false;
      if (activeTab === 'depleted' && c.status !== 'DEPLETED' && c.currentBalance > 0) return false;

      // Dropdown filters
      if (cardTypeFilter !== 'all' && c.type !== cardTypeFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (balanceFilter === 'zero' && c.currentBalance > 0) return false;
      if (balanceFilter === '1-50' && (c.currentBalance <= 0 || c.currentBalance > 50)) return false;
      if (balanceFilter === '50-100' && (c.currentBalance <= 50 || c.currentBalance > 100)) return false;
      if (balanceFilter === '100+' && c.currentBalance <= 100) return false;

      // Free text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mId = c.id.toLowerCase().includes(q);
        const mCode = c.code.toLowerCase().includes(q);
        const mRec = c.recipient.toLowerCase().includes(q);
        const mPur = c.purchaser.toLowerCase().includes(q);
        return mId || mCode || mRec || mPur;
      }

      return true;
    });
  }, [cards, activeTab, cardTypeFilter, statusFilter, balanceFilter, searchQuery]);

  // Handlers
  const handleCheckBalance = (e: React.FormEvent) => {
    e.preventDefault();
    const found = cards.find(c => 
      c.id.toLowerCase() === lookupQuery.trim().toLowerCase() ||
      c.code.toLowerCase() === lookupQuery.trim().toLowerCase() ||
      c.recipient.toLowerCase().includes(lookupQuery.trim().toLowerCase())
    );
    if (found) {
      setLookupCard(found);
      showToast(`Found card ${found.id} with balance $${found.currentBalance.toFixed(2)}`);
    } else {
      setLookupCard(null);
      showToast('Card or voucher code not found.');
    }
  };

  const handleIssueGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient.trim() || !newAmount) return;

    const val = parseFloat(newAmount);
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const newCard: CardItem = {
      id: `GC-PAWZ-${codeNum}`,
      code: `PAWZ-${codeNum}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: newCardType,
      recipient: newRecipient.trim(),
      recipientEmail: newEmail || `${newRecipient.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      recipientPhone: '+1 (555) 000-0000',
      purchaser: newPurchaser || 'Salon Register POS',
      initialValue: val,
      currentBalance: val,
      issueDate: 'Today (May 12, 2025)',
      lastUsed: 'NEVER USED',
      status: 'ACTIVE',
      expirationDate: 'Never Expires (TX State Compliant)'
    };

    setCards(prev => [newCard, ...prev]);
    setShowIssueCardModal(false);
    setNewRecipient('');
    setNewEmail('');
    showToast(`Gift card ${newCard.id} ($${val.toFixed(2)}) issued successfully.`);
  };

  const handleIssueStoreCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditRecipient.trim() || !creditAmount) return;

    const val = parseFloat(creditAmount);
    const codeNum = 143 + cards.length;
    const newCredit: CardItem = {
      id: `SC-CRED-0${codeNum}`,
      code: `CRED-0${codeNum}-TX${Math.floor(10 + Math.random() * 90)}`,
      type: 'STORE CREDIT',
      recipient: creditRecipient.trim(),
      recipientEmail: `${creditRecipient.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      recipientPhone: '+1 (555) 123-4567',
      purchaser: `Store Credit: ${creditReason}`,
      initialValue: val,
      currentBalance: val,
      issueDate: 'Today (May 12, 2025)',
      lastUsed: 'NEVER USED',
      status: 'ACTIVE',
      notes: creditReason
    };

    setCards(prev => [newCredit, ...prev]);
    setShowIssueCreditModal(false);
    setCreditRecipient('');
    showToast(`Store credit ${newCredit.id} ($${val.toFixed(2)}) granted to ${creditRecipient}.`);
  };

  const handleAddValue = (cardId: string) => {
    const topup = prompt('Enter top-up reload amount ($):', '25.00');
    if (topup && !isNaN(parseFloat(topup))) {
      const add = parseFloat(topup);
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, currentBalance: c.currentBalance + add } : c));
      showToast(`Added $${add.toFixed(2)} to ${cardId}.`);
      if (selectedCard?.id === cardId) {
        setSelectedCard(prev => prev ? { ...prev, currentBalance: prev.currentBalance + add } : null);
      }
    }
  };

  const handleRedeemBalance = (cardId: string) => {
    const redeemStr = prompt('Enter amount to redeem against sale ($):', '20.00');
    if (redeemStr && !isNaN(parseFloat(redeemStr))) {
      const amt = parseFloat(redeemStr);
      setCards(prev => prev.map(c => {
        if (c.id === cardId) {
          const rem = Math.max(0, c.currentBalance - amt);
          return { ...c, currentBalance: rem, status: rem === 0 ? 'DEPLETED' : 'ACTIVE', lastUsed: 'Today' };
        }
        return c;
      }));
      showToast(`Redeemed $${amt.toFixed(2)} from ${cardId}.`);
      if (selectedCard?.id === cardId) {
        setSelectedCard(prev => prev ? { ...prev, currentBalance: Math.max(0, prev.currentBalance - amt) } : null);
      }
    }
  };

  const handleDeactivate = (cardId: string) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, status: 'INACTIVE' } : c));
    showToast(`Card ${cardId} suspended/deactivated.`);
    if (selectedCard?.id === cardId) {
      setSelectedCard(prev => prev ? { ...prev, status: 'INACTIVE' } : null);
    }
  };

  const handleReactivate = (cardId: string) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, status: 'ACTIVE' } : c));
    showToast(`Card ${cardId} reactivated.`);
    if (selectedCard?.id === cardId) {
      setSelectedCard(prev => prev ? { ...prev, status: 'ACTIVE' } : null);
    }
  };

  const handleConvertToStoreCredit = (cardId: string) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, type: 'STORE CREDIT' } : c));
    showToast(`Card ${cardId} converted to client store credit.`);
    if (selectedCard?.id === cardId) {
      setSelectedCard(prev => prev ? { ...prev, type: 'STORE CREDIT' } : null);
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

      {/* Header Bar with Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] bg-black text-white px-1.5 py-0.5 uppercase font-bold">SEC:03.6</span>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black flex items-center gap-2">
              <span>📄 Gift Cards &amp; Credits Dashboard</span>
            </h1>
          </div>
          <p className="text-xs text-gray-600 mt-1 font-mono">
            Digital e-gift vouchers, physical plastic gift cards, customer wallet balances, and store credit ledgers.
          </p>
        </div>

        {/* Top actions: Check card Balance, Issue Store Credit, Issue Gift Card */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCheckBalanceModal(true)}
            className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Check card Balance</span>
          </button>
          <button
            onClick={() => setShowIssueCreditModal(true)}
            className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Issue Store Credit</span>
          </button>
          <button
            onClick={() => setShowIssueCardModal(true)}
            className="px-3 py-1.5 border border-black bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Issue Gift Card</span>
          </button>
        </div>
      </div>

      {/* 📊 Summary Cards (each is a clickable navigation or filter) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        {/* TOTAL ACTIVE BALANCE */}
        <button
          onClick={() => { setActiveTab('all'); setStatusFilter('ACTIVE'); showToast('Showing all active gift cards and credits with balances'); }}
          className={`border border-black p-3.5 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            activeTab === 'all' && statusFilter === 'ACTIVE' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider opacity-80">
            <span>TOTAL ACTIVE BALANCE</span>
            <Gift className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl font-black font-mono mt-2 tracking-tight">${totalActiveBalance.toFixed(2)}</p>
          <p className="text-[10px] opacity-70 mt-0.5">[click card] → Active</p>
        </button>

        {/* REDEEMED (MTD) */}
        <button
          onClick={() => { setActiveTab('depleted'); showToast('Showing redemptions and usage'); }}
          className={`border border-black p-3.5 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            activeTab === 'depleted' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider opacity-80">
            <span>REDEEMED (MTD)</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl font-black font-mono mt-2 tracking-tight">$85.00</p>
          <p className="text-[10px] opacity-70 mt-0.5">[click card] → Redemptions</p>
        </button>

        {/* ISSUED THIS MONTH */}
        <button
          onClick={() => { setActiveTab('all'); showToast('Showing newly issued cards and credits this month'); }}
          className="border border-black p-3.5 text-left flex flex-col justify-between bg-white hover:bg-gray-50 text-black transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
            <span>ISSUED THIS MONTH</span>
            <Sparkles className="w-3.5 h-3.5 text-black" />
          </div>
          <p className="text-xl font-black font-mono mt-2 tracking-tight text-black">$275.00</p>
          <p className="text-[10px] text-gray-600 mt-0.5">[click card] → 3 Issued</p>
        </button>

        {/* STORE CREDITS OUTSTANDING */}
        <button
          onClick={() => { setActiveTab('credit'); showToast('Showing outstanding store credit balances'); }}
          className={`border border-black p-3.5 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            activeTab === 'credit' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider opacity-80">
            <span>STORE CREDITS</span>
            <Wallet className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl font-black font-mono mt-2 tracking-tight">${totalStoreCredits.toFixed(2)}</p>
          <p className="text-[10px] opacity-70 mt-0.5">[click card] → Store credit</p>
        </button>

        {/* EXPIRED / INACTIVE */}
        <button
          onClick={() => { setActiveTab('all'); setStatusFilter('INACTIVE'); showToast('Showing inactive or suspended cards'); }}
          className={`border border-black p-3.5 text-left flex flex-col justify-between transition-colors cursor-pointer ${
            statusFilter === 'INACTIVE' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider opacity-80">
            <span>EXPIRED / INACTIVE</span>
            <Ban className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl font-black font-mono mt-2 tracking-tight">1 CARD</p>
          <p className="text-[10px] opacity-70 mt-0.5">[click card] → Inactive</p>
        </button>

        {/* AVERAGE CARD VALUE */}
        <div className="border border-black p-3.5 bg-neutral-50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-600">
            <span>AVERAGE CARD VALUE</span>
            <CreditCard className="w-3.5 h-3.5 text-black" />
          </div>
          <p className="text-xl font-black font-mono mt-2 tracking-tight text-black">${avgCardValue.toFixed(2)}</p>
          <p className="text-[10px] font-bold uppercase text-black underline underline-offset-2 cursor-pointer mt-0.5">
            [STATS // MEDIAN]
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="border border-black bg-white">
        {/* 📋 Card List Tabs (filter the main table by type) */}
        <div className="flex items-center overflow-x-auto border-b border-black bg-neutral-100 font-mono">
          {[
            { id: 'all', label: 'ALL CARDS & CREDITS', count: cards.length },
            { id: 'digital', label: 'DIGITAL GIFT CARDS', count: cards.filter(c => c.type === 'DIGITAL').length },
            { id: 'physical', label: 'PHYSICAL GIFT CARDS', count: cards.filter(c => c.type === 'PHYSICAL').length },
            { id: 'credit', label: 'STORE CREDITS', count: cards.filter(c => c.type === 'STORE CREDIT').length },
            { id: 'depleted', label: 'DEPLETED / ZERO BALANCE', count: cards.filter(c => c.currentBalance === 0).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-r border-black whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-black hover:bg-neutral-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* 🔍 Search & Filters (modify which cards/credits are shown) */}
        <div className="p-3 bg-white border-b border-black flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            {/* Search bar with [⌨️K] */}
            <div className="relative flex-1 max-w-sm">
              <span className="absolute left-2.5 top-2.5 text-gray-500 pointer-events-none">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search card #, recipient, purchaser..."
                className="w-full h-8 pl-8 pr-12 text-xs bg-white border border-black text-black placeholder-gray-400 focus:outline-none"
              />
              <span className="absolute right-2 top-2 px-1 text-[9px] border border-black bg-neutral-100 text-black font-bold">
                ⌨️K
              </span>
            </div>

            {/* CARD TYPE dropdown */}
            <div className="flex items-center gap-1 border border-black bg-white px-2 py-1 text-xs">
              <span className="text-gray-500 uppercase text-[10px]">CARD TYPE:</span>
              <select
                value={cardTypeFilter}
                onChange={(e) => setCardTypeFilter(e.target.value)}
                className="bg-transparent font-bold uppercase focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">ALL ▼</option>
                <option value="DIGITAL">Digital</option>
                <option value="PHYSICAL">Physical</option>
                <option value="STORE CREDIT">Store Credit</option>
              </select>
            </div>

            {/* STATUS dropdown */}
            <div className="flex items-center gap-1 border border-black bg-white px-2 py-1 text-xs">
              <span className="text-gray-500 uppercase text-[10px]">STATUS:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-bold uppercase focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">ALL STATUS ▼</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DEPLETED">Depleted</option>
              </select>
            </div>

            {/* BALANCE dropdown */}
            <div className="flex items-center gap-1 border border-black bg-white px-2 py-1 text-xs">
              <span className="text-gray-500 uppercase text-[10px]">BALANCE:</span>
              <select
                value={balanceFilter}
                onChange={(e) => setBalanceFilter(e.target.value)}
                className="bg-transparent font-bold uppercase focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">ALL ▼</option>
                <option value="zero">$0 (Depleted)</option>
                <option value="1-50">$1 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100+">$100+</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setCardTypeFilter('all');
              setStatusFilter('all');
              setBalanceFilter('all');
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
                <th className="py-2.5 px-3 border-r border-black">CARD / CODE #</th>
                <th className="py-2.5 px-3 border-r border-black">RECIPIENT / HOLDER</th>
                <th className="py-2.5 px-3 border-r border-black">PURCHASER / SOURCE</th>
                <th className="py-2.5 px-3 border-r border-black text-right">INITIAL VALUE</th>
                <th className="py-2.5 px-3 border-r border-black text-right">CURRENT BALANCE</th>
                <th className="py-2.5 px-3 border-r border-black">ISSUE DATE</th>
                <th className="py-2.5 px-3 border-r border-black">LAST USED</th>
                <th className="py-2.5 px-3 border-r border-black text-center">STATUS</th>
                <th className="py-2.5 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {filteredCards.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500 font-mono text-xs">
                    No cards or credits matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredCards.map((card) => (
                  <tr 
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className="hover:bg-neutral-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 font-bold border-r border-black whitespace-nowrap group-hover:underline">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 ${card.type === 'STORE CREDIT' ? 'bg-neutral-500' : 'bg-black'}`}></span>
                        <span>{card.id}</span>
                      </div>
                      <span className="text-[9px] text-gray-500 font-normal block">{card.code}</span>
                    </td>
                    <td className="py-2.5 px-3 border-r border-black">
                      <p className="font-bold text-black uppercase">{card.recipient}</p>
                      <p className="text-[10px] text-gray-500">{card.recipientEmail}</p>
                    </td>
                    <td className="py-2.5 px-3 border-r border-black text-gray-700">
                      {card.purchaser}
                    </td>
                    <td className="py-2.5 px-3 border-r border-black text-right text-gray-500">
                      ${card.initialValue.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 border-r border-black text-right font-black text-black">
                      ${card.currentBalance.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 border-r border-black text-gray-600 whitespace-nowrap">
                      {card.issueDate}
                    </td>
                    <td className="py-2.5 px-3 border-r border-black text-gray-700 whitespace-nowrap">
                      {card.lastUsed}
                    </td>
                    <td className="py-2.5 px-3 border-r border-black text-center">
                      <span className={`inline-block px-1.5 py-0.5 border border-black text-[9px] font-bold uppercase ${
                        card.status === 'ACTIVE'
                          ? 'bg-black text-white'
                          : card.status === 'DEPLETED'
                          ? 'bg-neutral-200 text-black'
                          : 'bg-white text-gray-600'
                      }`}>
                        {card.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      {/* ✏️ Row-Level Actions */}
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setSelectedCard(card)}
                          title="Open full card/credit detail view"
                          className="px-2 py-0.5 border border-black bg-white hover:bg-neutral-100 text-[10px] font-bold uppercase transition-colors"
                        >
                          View
                        </button>
                        {card.status === 'ACTIVE' && (
                          <>
                            <button
                              onClick={() => handleRedeemBalance(card.id)}
                              title="Manually apply balance to transaction"
                              className="px-2 py-0.5 border border-black bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase transition-colors"
                            >
                              Redeem
                            </button>
                            <button
                              onClick={() => handleAddValue(card.id)}
                              title="Top-up / reload balance"
                              className="px-2 py-0.5 border border-black bg-white hover:bg-neutral-100 text-[10px] font-bold uppercase transition-colors"
                            >
                              + Reload
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            showToast(`Reminder email dispatched to ${card.recipientEmail}`);
                          }}
                          title="Send balance reminder to customer"
                          className="px-2 py-0.5 border border-black bg-white hover:bg-neutral-100 text-[10px] font-bold uppercase transition-colors"
                        >
                          Send
                        </button>
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
            Showing {filteredCards.length} of {cards.length} gift cards and store credit records
          </p>
          <div className="flex items-center gap-2 text-[11px]">
            <span>Active Filter: <strong className="uppercase">{activeTab}</strong></span>
            <span>•</span>
            <span>Total Active Value: <strong>${totalActiveBalance.toFixed(2)}</strong></span>
          </div>
        </div>
      </div>

      {/* 🔍 Check Balance Modal */}
      {showCheckBalanceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full p-6 space-y-4 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <h3 className="font-bold text-sm uppercase">CHECK CARD OR STORE CREDIT BALANCE</h3>
              <button 
                onClick={() => { setShowCheckBalanceModal(false); setLookupCard(null); setLookupQuery(''); }}
                className="p-1 hover:bg-black hover:text-white border border-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCheckBalance} className="space-y-3">
              <div>
                <label className="block text-gray-600 uppercase text-[10px] mb-1">SCAN CARD BARCODE OR ENTER CODE #</label>
                <div className="flex gap-1">
                  <input 
                    type="text"
                    required
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    className="flex-1 border border-black p-2 bg-white font-bold"
                    placeholder="e.g. PAWZ-8812-9901 or David Wilson"
                  />
                  <button type="submit" className="px-4 border border-black bg-black text-white font-bold uppercase text-xs">
                    Look Up
                  </button>
                </div>
              </div>
            </form>

            {lookupCard && (
              <div className="border border-black p-4 bg-neutral-50 space-y-3">
                <div className="flex justify-between items-center border-b border-black pb-2">
                  <div>
                    <span className="font-bold text-sm uppercase">{lookupCard.id}</span>
                    <span className="text-[10px] text-gray-500 block">{lookupCard.type}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-black text-white font-bold text-xs uppercase">{lookupCard.status}</span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-gray-600 text-[10px] uppercase">REMAINING BALANCE:</span>
                  <span className="text-2xl font-black text-black">${lookupCard.currentBalance.toFixed(2)}</span>
                </div>

                <div className="text-[10px] space-y-1 text-gray-600 pt-2 border-t border-gray-300">
                  <p>Holder: <strong className="text-black">{lookupCard.recipient}</strong></p>
                  <p>Issued: {lookupCard.issueDate} • Last Used: {lookupCard.lastUsed}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      handleRedeemBalance(lookupCard.id);
                      setShowCheckBalanceModal(false);
                    }}
                    className="flex-1 py-1.5 border border-black bg-black text-white font-bold uppercase text-xs"
                  >
                    Redeem on POS
                  </button>
                  <button
                    onClick={() => {
                      handleAddValue(lookupCard.id);
                      setShowCheckBalanceModal(false);
                    }}
                    className="flex-1 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs"
                  >
                    Add Value
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ➕ Issue Gift Card Modal */}
      {showIssueCardModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleIssueGiftCard} className="bg-white border-2 border-black max-w-lg w-full p-6 space-y-4 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <h3 className="font-bold text-sm uppercase">ISSUE NEW GIFT CARD</h3>
              <button 
                type="button"
                onClick={() => setShowIssueCardModal(false)}
                className="p-1 hover:bg-black hover:text-white border border-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 uppercase text-[10px] mb-1">CARD FORMAT</label>
                <select 
                  value={newCardType}
                  onChange={(e) => setNewCardType(e.target.value as CardType)}
                  className="w-full border border-black p-2 bg-white font-bold"
                >
                  <option value="DIGITAL">Digital / e-Gift Card (Email)</option>
                  <option value="PHYSICAL">Physical Plastic Swipe Card</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 uppercase text-[10px] mb-1">INITIAL VALUE ($) *</label>
                <input 
                  type="number"
                  step="5"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full border border-black p-2 bg-white font-bold text-base"
                  placeholder="100.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 uppercase text-[10px] mb-1">RECIPIENT NAME *</label>
              <input 
                type="text"
                required
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                className="w-full border border-black p-2 bg-white font-bold"
                placeholder="e.g. Jessica Taylor"
              />
            </div>

            <div>
              <label className="block text-gray-600 uppercase text-[10px] mb-1">RECIPIENT EMAIL (FOR DIGITAL DISPATCH)</label>
              <input 
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full border border-black p-2 bg-white"
                placeholder="jessica.t@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-600 uppercase text-[10px] mb-1">PURCHASER / SOURCE</label>
              <input 
                type="text"
                value={newPurchaser}
                onChange={(e) => setNewPurchaser(e.target.value)}
                className="w-full border border-black p-2 bg-white"
                placeholder="Front Counter Register #1"
              />
            </div>

            <div className="pt-2 border-t border-black flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowIssueCardModal(false)}
                className="px-4 py-2 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-black bg-black text-white hover:bg-neutral-800 uppercase font-bold text-xs"
              >
                Activate &amp; Issue Card
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 💼 Issue Store Credit Modal */}
      {showIssueCreditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleIssueStoreCredit} className="bg-white border-2 border-black max-w-lg w-full p-6 space-y-4 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <h3 className="font-bold text-sm uppercase">ISSUE CLIENT STORE CREDIT</h3>
              <button 
                type="button"
                onClick={() => setShowIssueCreditModal(false)}
                className="p-1 hover:bg-black hover:text-white border border-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 uppercase text-[10px] mb-1">CUSTOMER RECIPIENT *</label>
                <input 
                  type="text"
                  required
                  value={creditRecipient}
                  onChange={(e) => setCreditRecipient(e.target.value)}
                  className="w-full border border-black p-2 bg-white font-bold"
                  placeholder="e.g. Chris Evans"
                />
              </div>
              <div>
                <label className="block text-gray-600 uppercase text-[10px] mb-1">CREDIT AMOUNT ($) *</label>
                <input 
                  type="number"
                  step="0.01"
                  required
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="w-full border border-black p-2 bg-white font-bold text-base"
                  placeholder="25.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 uppercase text-[10px] mb-1">REASON / JUSTIFICATION</label>
              <select 
                value={creditReason}
                onChange={(e) => setCreditReason(e.target.value)}
                className="w-full border border-black p-2 bg-white font-bold"
              >
                <option>Customer Courtesy / Service Adjustment</option>
                <option>Deposit Refund Converted to Wallet Credit</option>
                <option>VIP Member Anniversary Reward</option>
                <option>Rescheduled Appointment Compensation</option>
              </select>
            </div>

            <div className="pt-2 border-t border-black flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowIssueCreditModal(false)}
                className="px-4 py-2 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-black bg-black text-white hover:bg-neutral-800 uppercase font-bold text-xs"
              >
                Issue Store Credit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Row-Level Full Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-xl w-full p-6 space-y-4 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-black text-white font-bold text-xs uppercase">
                  {selectedCard.status}
                </span>
                <h3 className="font-bold text-sm uppercase">{selectedCard.type}: {selectedCard.id}</h3>
              </div>
              <button 
                onClick={() => setSelectedCard(null)}
                className="p-1 hover:bg-black hover:text-white border border-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-3 border border-black">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">RECIPIENT / HOLDER</span>
                <p className="font-bold text-sm">{selectedCard.recipient}</p>
                <p className="text-[10px] text-gray-600">{selectedCard.recipientEmail}</p>
                <p className="text-[10px] text-gray-600">{selectedCard.recipientPhone}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">CODE &amp; BARCODE</span>
                <p className="font-bold text-sm">{selectedCard.code}</p>
                <p className="text-[10px] text-gray-600">Source: {selectedCard.purchaser}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border border-black p-3">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">CURRENT BALANCE</span>
                <p className="font-black text-xl text-black">${selectedCard.currentBalance.toFixed(2)}</p>
                <span className="text-[9px] text-gray-500">Initial: ${selectedCard.initialValue.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">ISSUE DATE</span>
                <p className="font-bold text-xs">{selectedCard.issueDate}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">LAST USED</span>
                <p className="font-bold text-xs">{selectedCard.lastUsed}</p>
              </div>
            </div>

            <div className="border border-black p-3 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase block">INTERNAL NOTES</span>
              <p className="text-[11px] text-gray-700">{selectedCard.notes || 'Standard card on file in salon ledger.'}</p>
              <p className="text-[10px] text-gray-500">{selectedCard.expirationDate || 'Never Expires'}</p>
            </div>

            {/* Row-Level Action Buttons */}
            <div className="pt-2 border-t border-black flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => {
                    showToast(`Receipt/Reissue sent to ${selectedCard.recipientEmail}`);
                  }}
                  className="px-2 py-1 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3 h-3" />
                  <span>Receipt/Reissue</span>
                </button>
                <button
                  onClick={() => {
                    const to = prompt('Enter customer name/account to transfer to:');
                    if (to) {
                      setCards(prev => prev.map(c => c.id === selectedCard.id ? { ...c, recipient: to } : c));
                      setSelectedCard(prev => prev ? { ...prev, recipient: to } : null);
                      showToast(`Transferred balance to ${to}`);
                    }
                  }}
                  className="px-2 py-1 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-[10px] cursor-pointer"
                >
                  Transfer
                </button>
                <button
                  onClick={() => handleConvertToStoreCredit(selectedCard.id)}
                  className="px-2 py-1 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-[10px] cursor-pointer"
                >
                  Convert to Store Credit
                </button>
                <button
                  onClick={() => {
                    showToast(`Reminder email sent to ${selectedCard.recipientEmail}`);
                  }}
                  className="px-2 py-1 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-[10px] cursor-pointer"
                >
                  Send Reminder
                </button>
              </div>

              <div className="flex gap-1">
                {selectedCard.status === 'ACTIVE' ? (
                  <>
                    <button
                      onClick={() => handleDeactivate(selectedCard.id)}
                      className="px-2.5 py-1 border border-black bg-neutral-200 hover:bg-black hover:text-white uppercase font-bold text-[10px] cursor-pointer"
                    >
                      Deactivate
                    </button>
                    <button
                      onClick={() => handleAddValue(selectedCard.id)}
                      className="px-3 py-1 border border-black bg-white hover:bg-neutral-100 uppercase font-bold text-[10px] cursor-pointer"
                    >
                      + Add Value
                    </button>
                    <button
                      onClick={() => handleRedeemBalance(selectedCard.id)}
                      className="px-3 py-1 border border-black bg-black text-white hover:bg-neutral-800 uppercase font-bold text-[10px] cursor-pointer"
                    >
                      Redeem
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleReactivate(selectedCard.id)}
                    className="px-3 py-1 border border-black bg-black text-white hover:bg-neutral-800 uppercase font-bold text-[10px] cursor-pointer"
                  >
                    Reactivate
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
