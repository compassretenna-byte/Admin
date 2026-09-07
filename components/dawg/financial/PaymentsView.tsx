'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  RotateCw, 
  Download, 
  Plus, 
  ChevronRight, 
  MoreHorizontal,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Undo2,
  Gift,
  Filter,
  DollarSign,
  Receipt
} from 'lucide-react';
import { DawgNavSection } from '@/lib/types';

interface PaymentsViewProps {
  onNavigateSection?: (section: DawgNavSection) => void;
  onOpenQuickPayment?: () => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({ 
  onNavigateSection,
  onOpenQuickPayment 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending' | 'refunded' | 'cash' | 'card'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');

  const paymentTransactions = [
    {
      id: 'TX-9842',
      customer: 'Sarah Johnson',
      pet: 'Buddy (Golden Retriever)',
      service: 'Full Groom + Blueberry Facial',
      invoice: 'INV-2025-0891',
      method: 'Visa •••• 4242',
      methodType: 'card',
      date: 'May 12, 2025',
      time: '10:30 AM EDT',
      groomer: 'Sarah M.',
      amount: 108.25,
      status: 'PAID',
    },
    {
      id: 'TX-9841',
      customer: 'Marcus Johnson',
      pet: 'Max (German Shepherd)',
      service: 'Bath & Brush (Max)',
      invoice: 'INV-2025-0890',
      method: 'Mastercard •••• 5555',
      methodType: 'card',
      date: 'May 12, 2025',
      time: '09:15 AM EDT',
      groomer: 'Jessica L.',
      amount: 55.00,
      status: 'PAID',
    },
    {
      id: 'TX-9840',
      customer: 'Mike Ross',
      pet: 'Luna (Husky)',
      service: 'Deluxe Spa & De-shedding',
      invoice: 'INV-2025-0888',
      method: 'Cash (Register 1)',
      methodType: 'cash',
      date: 'May 11, 2025',
      time: '03:45 PM EDT',
      groomer: 'Mike R.',
      amount: 95.00,
      status: 'PAID',
    },
    {
      id: 'TX-9839',
      customer: 'Emily Davis',
      pet: 'Appt: May 16, 2025',
      service: 'Deposit - Full Groom (May 16)',
      invoice: 'BK-4102',
      method: 'Amex •••• 1004',
      methodType: 'card',
      date: 'May 11, 2025',
      time: '01:20 PM EDT',
      groomer: 'Sarah M.',
      amount: 25.00,
      status: 'DEPOSIT',
    },
    {
      id: 'TX-9838',
      customer: 'David Wilson',
      pet: 'Charlie (Poodle)',
      service: 'Nail Trim & Teeth Cleaning',
      invoice: 'INV-2025-0879',
      method: 'Gift Card •••• 8812',
      methodType: 'gift',
      date: 'May 11, 2025',
      time: '11:00 AM EDT',
      groomer: 'Jessica L.',
      amount: 35.00,
      status: 'PAID',
    },
    {
      id: 'TX-9837',
      customer: 'Jennifer Lee',
      pet: 'Daisy (Shih Tzu)',
      service: 'Full Groom + Add-ons',
      invoice: 'INV-2025-0875',
      method: 'Terminal (Tap to Pay)',
      methodType: 'card',
      date: 'May 10, 2025',
      time: '04:10 PM EDT',
      groomer: 'Mike R.',
      amount: 85.00,
      status: 'PAID',
    },
    {
      id: 'TX-9836',
      customer: 'Tom Anderson',
      pet: 'Rocky (Labrador)',
      service: 'Full Grooming Package',
      invoice: 'REFUND #RF-104',
      method: 'Visa •••• 9921',
      methodType: 'refund',
      date: 'May 10, 2025',
      time: '02:00 PM EDT',
      groomer: 'Sarah M.',
      amount: -120.00,
      status: 'REFUNDED',
    },
  ];

  const filteredTransactions = paymentTransactions.filter((tx) => {
    if (activeTab === 'completed' && tx.status !== 'PAID') return false;
    if (activeTab === 'pending' && tx.status !== 'DEPOSIT') return false;
    if (activeTab === 'refunded' && tx.status !== 'REFUNDED') return false;
    if (activeTab === 'cash' && tx.methodType !== 'cash') return false;
    if (activeTab === 'card' && tx.methodType !== 'card') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        tx.id.toLowerCase().includes(q) ||
        tx.customer.toLowerCase().includes(q) ||
        tx.pet.toLowerCase().includes(q) ||
        tx.invoice.toLowerCase().includes(q) ||
        tx.groomer.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-black bg-white min-h-full">
      {/* Header & Global Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-black pb-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">
            <span>FINANCIAL</span>
            <span>/</span>
            <span className="text-black font-bold">TRANSACTIONS &amp; PAYMENTS</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black">Payments</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage transactions, track salon revenue, and review payment activity across all channels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => alert('Exporting Payment Ledger as CSV...')}
            className="h-9 px-3 border border-black bg-white hover:bg-gray-100 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={onOpenQuickPayment}
            className="h-9 px-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-black cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Strip - 6 Square Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="border border-black p-4 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <span>Total Revenue (MTD)</span>
              <TrendingUp className="w-3.5 h-3.5 text-black" />
            </div>
            <p className="text-xl font-black font-mono mt-2 tracking-tight text-black">$18,450.00</p>
            <p className="text-[10px] font-bold text-black mt-0.5 font-mono">+14.8% vs last mo</p>
          </div>
          <button 
            onClick={() => setActiveTab('all')} 
            className="mt-3 pt-2 border-t border-black text-[10px] font-bold uppercase tracking-wider text-left hover:underline cursor-pointer flex items-center justify-between"
          >
            <span>View All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="border-2 border-black p-4 bg-white flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-black">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-black inline-block"></span>
                Completed
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-black" />
            </div>
            <p className="text-xl font-black font-mono mt-2 tracking-tight text-black">142</p>
            <p className="text-[10px] text-gray-600 font-mono mt-0.5">Avg Ticket: $129.92</p>
          </div>
          <button 
            onClick={() => setActiveTab('completed')}
            className="mt-3 pt-2 border-t border-black text-[10px] font-bold uppercase tracking-wider text-left hover:underline cursor-pointer flex items-center justify-between"
          >
            <span>Filter Paid</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="border border-black p-4 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <span>Pending / Deposit</span>
              <Clock className="w-3.5 h-3.5 text-black" />
            </div>
            <p className="text-xl font-black font-mono mt-2 tracking-tight text-black">3 <span className="text-xs font-normal text-gray-500">($245.00)</span></p>
            <p className="text-[10px] text-gray-600 font-mono mt-0.5">2 ACH clearing</p>
          </div>
          <button 
            onClick={() => setActiveTab('pending')}
            className="mt-3 pt-2 border-t border-black text-[10px] font-bold uppercase tracking-wider text-left hover:underline cursor-pointer flex items-center justify-between"
          >
            <span>View Pending</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="border border-black p-4 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <span>Outstanding Invoices</span>
              <Receipt className="w-3.5 h-3.5 text-black" />
            </div>
            <p className="text-xl font-black font-mono mt-2 tracking-tight text-black">$2,450.25</p>
            <p className="text-[10px] text-black font-bold font-mono mt-0.5">8 Invoices Open</p>
          </div>
          <button 
            onClick={() => onNavigateSection?.('invoices')}
            className="mt-3 pt-2 border-t border-black text-[10px] font-bold uppercase tracking-wider text-left hover:underline cursor-pointer flex items-center justify-between"
          >
            <span>Open Invoices</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="border border-black p-4 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <span>Refunds Issued</span>
              <Undo2 className="w-3.5 h-3.5 text-black" />
            </div>
            <p className="text-xl font-black font-mono mt-2 tracking-tight text-black">$140.00</p>
            <p className="text-[10px] text-gray-600 font-mono mt-0.5">2 (0.75% of Rev)</p>
          </div>
          <button 
            onClick={() => onNavigateSection?.('refunds')}
            className="mt-3 pt-2 border-t border-black text-[10px] font-bold uppercase tracking-wider text-left hover:underline cursor-pointer flex items-center justify-between"
          >
            <span>Refund Ledger</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="border border-black p-4 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <span>Gift Cards Balance</span>
              <Gift className="w-3.5 h-3.5 text-black" />
            </div>
            <p className="text-xl font-black font-mono mt-2 tracking-tight text-black">$1,850.00</p>
            <p className="text-[10px] text-gray-600 font-mono mt-0.5">34 Active Cards</p>
          </div>
          <button 
            onClick={() => onNavigateSection?.('gift-cards')}
            className="mt-3 pt-2 border-t border-black text-[10px] font-bold uppercase tracking-wider text-left hover:underline cursor-pointer flex items-center justify-between"
          >
            <span>Manage Cards</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Financial Sub-systems Navigation Cards */}
      <div>
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">
          FINANCIAL SUB-SYSTEMS &amp; HARDWARE
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          <button
            onClick={() => onNavigateSection?.('invoices')}
            className="border border-black p-3 bg-white hover:bg-gray-50 flex items-center justify-between group cursor-pointer text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Receipt className="w-4 h-4 text-black" />
              <div>
                <p className="text-xs font-black uppercase text-black">Invoices</p>
                <p className="text-[10px] text-gray-600 font-mono">$2,450.25 Due (8)</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => onNavigateSection?.('deposits')}
            className="border border-black p-3 bg-white hover:bg-gray-50 flex items-center justify-between group cursor-pointer text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <DollarSign className="w-4 h-4 text-black" />
              <div>
                <p className="text-xs font-black uppercase text-black">Deposits Held</p>
                <p className="text-[10px] text-gray-600 font-mono">$680.00 Held (14)</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => onNavigateSection?.('refunds')}
            className="border border-black p-3 bg-white hover:bg-gray-50 flex items-center justify-between group cursor-pointer text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Undo2 className="w-4 h-4 text-black" />
              <div>
                <p className="text-xs font-black uppercase text-black">Refunds &amp; Disputes</p>
                <p className="text-[10px] text-gray-600 font-mono">$140.00 Total (2)</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => onNavigateSection?.('gift-cards')}
            className="border border-black p-3 bg-white hover:bg-gray-50 flex items-center justify-between group cursor-pointer text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Gift className="w-4 h-4 text-black" />
              <div>
                <p className="text-xs font-black uppercase text-black">Gift Cards</p>
                <p className="text-[10px] text-gray-600 font-mono">34 Active Cards</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="border border-black p-3 bg-white flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-black" />
              <div>
                <p className="text-xs font-black uppercase text-black">Stripe Terminals</p>
                <p className="text-[10px] text-black font-bold font-mono">3 Online (WisePOS E)</p>
              </div>
            </div>
            <span className="w-2 h-2 bg-black"></span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="border border-black bg-white">
        <div className="flex items-center overflow-x-auto border-b border-black">
          {[
            { id: 'all', label: 'All Payments', count: 142 },
            { id: 'completed', label: 'Completed', count: 137 },
            { id: 'pending', label: 'Pending / Deposits', count: 3 },
            { id: 'refunded', label: 'Refunded', count: 2 },
            { id: 'cash', label: 'Cash & Register', count: 18 },
            { id: 'card', label: 'Online / Terminal', count: 124 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-r border-black whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="p-3 bg-gray-50 border-b border-black flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-2.5 top-2.5 text-gray-500 pointer-events-none">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transaction ID, invoice #, customer, pet..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-black text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="h-8 px-2 border border-black bg-white text-xs font-bold uppercase text-black focus:outline-none cursor-pointer"
            >
              <option value="ALL">Method: All Channels</option>
              <option value="VISA">Visa / Mastercard</option>
              <option value="CASH">Cash / Drawer</option>
              <option value="TERMINAL">Card Reader</option>
              <option value="GIFT">Gift Card</option>
            </select>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="h-8 px-2 border border-black bg-white text-xs font-bold uppercase text-black focus:outline-none cursor-pointer"
            >
              <option value="ALL">Location: All Hubs</option>
              <option value="MAIN">Main Location</option>
              <option value="SPA">Westside Spa</option>
              <option value="VAN">Mobile Van 01</option>
            </select>

            <button
              onClick={() => {
                setSearchQuery('');
                setMethodFilter('ALL');
                setLocationFilter('ALL');
              }}
              className="h-8 px-3 border border-black bg-white hover:bg-gray-100 text-black text-xs font-bold uppercase cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-black border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-black font-bold uppercase text-[11px] tracking-wider text-black">
                <th className="py-2.5 px-3 border-r border-black">Tx ID</th>
                <th className="py-2.5 px-3 border-r border-black">Customer &amp; Pet</th>
                <th className="py-2.5 px-3 border-r border-black">Service / Invoice</th>
                <th className="py-2.5 px-3 border-r border-black">Payment Method</th>
                <th className="py-2.5 px-3 border-r border-black">Date &amp; Time</th>
                <th className="py-2.5 px-3 border-r border-black">Groomer</th>
                <th className="py-2.5 px-3 border-r border-black text-right">Amount</th>
                <th className="py-2.5 px-3 border-r border-black text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 font-bold font-mono text-black border-r border-black">
                    {tx.id}
                  </td>
                  <td className="py-3 px-3 border-r border-black">
                    <p className="font-bold text-black uppercase">{tx.customer}</p>
                    <p className="text-[10px] text-gray-600">{tx.pet}</p>
                  </td>
                  <td className="py-3 px-3 border-r border-black">
                    <p className="font-medium text-black">{tx.service}</p>
                    <p className="text-[10px] font-mono text-gray-500 uppercase">{tx.invoice}</p>
                  </td>
                  <td className="py-3 px-3 border-r border-black font-mono text-[11px]">
                    {tx.method}
                  </td>
                  <td className="py-3 px-3 border-r border-black">
                    <p className="font-mono text-black">{tx.date}</p>
                    <p className="text-[10px] font-mono text-gray-500">{tx.time}</p>
                  </td>
                  <td className="py-3 px-3 border-r border-black font-medium text-black">
                    {tx.groomer}
                  </td>
                  <td className={`py-3 px-3 border-r border-black text-right font-black font-mono ${
                    tx.amount < 0 ? 'text-black' : 'text-black'
                  }`}>
                    {tx.amount < 0 ? `-$${Math.abs(tx.amount).toFixed(2)}` : `$${tx.amount.toFixed(2)}`}
                  </td>
                  <td className="py-3 px-3 border-r border-black text-center">
                    <span className={`inline-block px-2 py-0.5 border border-black text-[10px] font-bold uppercase font-mono ${
                      tx.status === 'PAID'
                        ? 'bg-black text-white'
                        : tx.status === 'DEPOSIT'
                        ? 'bg-gray-100 text-black'
                        : 'bg-white text-black'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button 
                      onClick={() => alert(`Viewing payment details for ${tx.id}`)}
                      className="px-2 py-1 border border-black bg-white hover:bg-black hover:text-white text-[10px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-3 bg-gray-50 border-t border-black flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-gray-600 font-mono text-[11px] uppercase">
            Showing 1 to {filteredTransactions.length} of 142 total transactions
          </p>
          <div className="flex items-center gap-1 font-mono">
            <button className="px-2 py-1 border border-black bg-white text-black font-bold uppercase disabled:opacity-40" disabled>
              &lt; Prev
            </button>
            <button className="w-7 h-7 border border-black bg-black text-white font-bold flex items-center justify-center">
              1
            </button>
            <button className="w-7 h-7 border border-black bg-white text-black font-bold hover:bg-gray-100 flex items-center justify-center">
              2
            </button>
            <button className="px-2 py-1 border border-black bg-white hover:bg-gray-100 text-black font-bold uppercase">
              Next &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
