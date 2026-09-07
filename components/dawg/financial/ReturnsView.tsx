'use client';

import React, { useState } from 'react';
import { 
  RotateCcw, 
  Search, 
  Download, 
  Plus, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  Gift, 
  CreditCard,
  Layers,
  ArrowRight,
  X,
  Check,
  Package,
  FileText,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { DawgNavSection } from '@/lib/types';

interface RmaItem {
  id: string;
  time: string;
  orderRef: string;
  customer: string;
  pet: string;
  item: string;
  condition: string;
  reason: string;
  resolution: string;
  status: 'Pending Inspection' | 'Awaiting Package' | 'Replacement Packed' | 'Resolved / Restocked';
  amount: number;
}

const INITIAL_RMAS: RmaItem[] = [
  {
    id: 'RMA-2025-042',
    time: 'Created 2h ago',
    orderRef: '#ORD-2025-1012',
    customer: 'Chris Evans',
    pet: 'Dodger (Golden Retriever)',
    item: 'Ergonomic De-shedding Slicker Brush (Medium)',
    condition: 'Unopened original packaging',
    reason: 'Duplicate Gift',
    resolution: 'Store Credit ($32.50)',
    status: 'Awaiting Package',
    amount: 32.50,
  },
  {
    id: 'RMA-2025-041',
    time: 'Delivered to Salon',
    orderRef: '#ORD-2025-0994',
    customer: 'Amanda Garcia',
    pet: 'Bella (French Bulldog)',
    item: 'Blueberry Spa Facial Foam Cleanser (250ml)',
    condition: 'Opened / Safety seal broken',
    reason: 'Opened / Scent Disliked',
    resolution: 'Original Card ($18.00)',
    status: 'Pending Inspection',
    amount: 18.00,
  },
  {
    id: 'RMA-2025-040',
    time: 'Returned Item Received',
    orderRef: '#ORD-2025-0988',
    customer: 'Mike Ross',
    pet: 'Harvey (Labrador)',
    item: 'All-Weather Insulated Winter Vest (Size: Large)',
    condition: 'Like New with tags attached',
    reason: 'Wrong Size',
    resolution: 'Direct Exchange (Size: XL)',
    status: 'Replacement Packed',
    amount: 54.00,
  },
  {
    id: 'RMA-2025-039',
    time: 'Yesterday',
    orderRef: '#ORD-2025-0965',
    customer: 'Rachel Green',
    pet: 'Emma (Cavalier)',
    item: 'Silk Coat Conditioning Spray 8oz',
    condition: 'Damaged in transit / Leaking pump',
    reason: 'Carrier Damage',
    resolution: 'Immediate Reshipment',
    status: 'Resolved / Restocked',
    amount: 22.00,
  },
];

interface ReturnsViewProps {
  onNavigateSection?: (section: DawgNavSection) => void;
}

export const ReturnsView: React.FC<ReturnsViewProps> = ({ onNavigateSection }) => {
  const [rmas, setRmas] = useState<RmaItem[]>(INITIAL_RMAS);
  const [activeTab, setActiveTab] = useState<'all' | 'action' | 'transit' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [inspectingRma, setInspectingRma] = useState<RmaItem | null>(null);
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // New RMA Form state
  const [newOrderRef, setNewOrderRef] = useState('ORD-2025-1048');
  const [newCustomer, setNewCustomer] = useState('Sarah Johnson');
  const [newItem, setNewItem] = useState('Blueberry Facial Foam Wash (8 oz)');
  const [newReason, setNewReason] = useState('Wrong Size / Formula');
  const [newResolution, setNewResolution] = useState('Store Credit');

  // Inspection Decision state
  const [disposition, setDisposition] = useState<'RESTOCK' | 'SCRAP' | 'RTV'>('RESTOCK');
  const [refundMethod, setRefundMethod] = useState<'CREDIT' | 'STRIPE' | 'EXCHANGE'>('CREDIT');

  const filteredRmas = rmas.filter((rma) => {
    if (activeTab === 'action' && rma.status !== 'Pending Inspection') return false;
    if (activeTab === 'transit' && rma.status !== 'Awaiting Package') return false;
    if (activeTab === 'completed' && (rma.status !== 'Replacement Packed' && rma.status !== 'Resolved / Restocked')) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        rma.id.toLowerCase().includes(q) ||
        rma.orderRef.toLowerCase().includes(q) ||
        rma.customer.toLowerCase().includes(q) ||
        rma.item.toLowerCase().includes(q) ||
        rma.reason.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleResolveInspection = () => {
    if (!inspectingRma) return;
    setRmas((prev) =>
      prev.map((r) =>
        r.id === inspectingRma.id
          ? {
              ...r,
              status: 'Resolved / Restocked',
              resolution:
                refundMethod === 'CREDIT'
                  ? `Store Credit ($${inspectingRma.amount.toFixed(2)})`
                  : refundMethod === 'STRIPE'
                  ? `Refunded to Card ($${inspectingRma.amount.toFixed(2)})`
                  : 'Exchange Dispatched',
            }
          : r
      )
    );
    setNoticeMessage(`RMA ${inspectingRma.id} successfully inspected and settled via ${refundMethod}!`);
    setInspectingRma(null);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  const handleCreateRma = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `RMA-2025-0${43 + Math.floor(Math.random() * 50)}`;
    const created: RmaItem = {
      id: newId,
      time: 'Just now',
      orderRef: `#${newOrderRef}`,
      customer: newCustomer,
      pet: 'Verified Pet Parent',
      item: newItem,
      condition: 'Awaiting receipt at salon station',
      reason: newReason,
      resolution: newResolution === 'Store Credit' ? 'Store Credit ($24.00)' : 'Card Refund ($24.00)',
      status: 'Awaiting Package',
      amount: 24.00,
    };
    setRmas((prev) => [created, ...prev]);
    setIsInitiateModalOpen(false);
    setNoticeMessage(`RMA ${newId} created! Prepaid return barcode dispatched.`);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1650px] mx-auto text-black bg-white min-h-full font-mono">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-black pb-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            <span>OPERATIONS</span>
            <span>/</span>
            <span>OMS</span>
            <span>/</span>
            <span className="text-black font-bold">REVERSE LOGISTICS &amp; RMA</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black">
            Returns &amp; Exchanges (RMA)
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Inspect incoming retail returns, issue replacements, and synchronize refunds or store credits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setIsPolicyModalOpen(true)}
            className="h-9 px-3 border border-black bg-white hover:bg-gray-100 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Return Policy</span>
          </button>
          <button 
            onClick={() => setIsLabelModalOpen(true)}
            className="h-9 px-3 border border-black bg-white hover:bg-gray-100 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Return Label</span>
          </button>
          <button 
            onClick={() => setIsInitiateModalOpen(true)}
            className="h-9 px-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-black cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Initiate RMA</span>
          </button>
        </div>
      </div>

      {noticeMessage && (
        <div className="p-3 border border-black bg-emerald-500 text-white font-bold text-xs flex items-center justify-between">
          <span>{noticeMessage}</span>
          <Check className="w-4 h-4" />
        </div>
      )}

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Open RMA Requests</p>
          <p className="text-2xl font-black text-black">{rmas.length}</p>
          <p className="text-[10px] text-gray-500">Active cases</p>
        </div>
        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">In-Transit to Salon</p>
          <p className="text-2xl font-black text-black">
            {rmas.filter((r) => r.status === 'Awaiting Package').length}
          </p>
          <p className="text-[10px] text-gray-500">USPS Returns</p>
        </div>
        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Awaiting Inspection</p>
          <p className="text-2xl font-black text-amber-700">
            {rmas.filter((r) => r.status === 'Pending Inspection').length}
          </p>
          <p className="text-[10px] text-amber-700 font-bold">At Salon Hub</p>
        </div>
        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Processed (MTD)</p>
          <p className="text-2xl font-black text-black">18</p>
          <p className="text-[10px] text-gray-500">$594.00 volume</p>
        </div>
        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Store Credit Retained</p>
          <p className="text-2xl font-black text-emerald-700">68%</p>
          <p className="text-[10px] text-emerald-700 font-bold">Kept in-house</p>
        </div>
        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Restock Rate</p>
          <p className="text-2xl font-black text-black">91%</p>
          <p className="text-[10px] text-gray-500">Resellable condition</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="border border-black bg-white">
        {/* Tabs */}
        <div className="flex items-center overflow-x-auto border-b border-black">
          {[
            { id: 'all', label: 'All Returns', count: rmas.length },
            { id: 'action', label: 'Action Required', count: rmas.filter((r) => r.status === 'Pending Inspection').length },
            { id: 'transit', label: 'Awaiting Package', count: rmas.filter((r) => r.status === 'Awaiting Package').length },
            { id: 'completed', label: 'Completed', count: rmas.filter((r) => r.status === 'Resolved / Restocked' || r.status === 'Replacement Packed').length },
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

        {/* Search */}
        <div className="p-3 bg-gray-50 border-b border-black flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-2.5 top-2.5 text-gray-500 pointer-events-none">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search RMA #, order #, customer, or item..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-black text-black placeholder-gray-400 focus:outline-none font-bold"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-black border-collapse font-mono">
            <thead>
              <tr className="bg-gray-50 border-b border-black font-bold uppercase text-[10px] tracking-wider text-black">
                <th className="py-2.5 px-3 border-r border-black">RMA ID</th>
                <th className="py-2.5 px-3 border-r border-black">Order Ref</th>
                <th className="py-2.5 px-3 border-r border-black">Customer &amp; Pet</th>
                <th className="py-2.5 px-3 border-r border-black">Item &amp; Condition</th>
                <th className="py-2.5 px-3 border-r border-black">Reason</th>
                <th className="py-2.5 px-3 border-r border-black">Resolution</th>
                <th className="py-2.5 px-3 border-r border-black text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {filteredRmas.map((rma) => (
                <tr key={rma.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-black border-r border-black">
                    <p>{rma.id}</p>
                    <p className="text-[10px] text-gray-500 font-normal">{rma.time}</p>
                  </td>
                  <td className="py-3 px-3 border-r border-black">
                    <button
                      onClick={() => onNavigateSection?.('order-details')}
                      className="font-bold underline cursor-pointer hover:text-gray-600 uppercase"
                    >
                      {rma.orderRef}
                    </button>
                  </td>
                  <td className="py-3 px-3 border-r border-black font-sans">
                    <p className="font-bold text-black uppercase">{rma.customer}</p>
                    <p className="text-[10px] text-gray-600 font-mono">{rma.pet}</p>
                  </td>
                  <td className="py-3 px-3 border-r border-black font-sans max-w-xs">
                    <p className="font-medium text-black">{rma.item}</p>
                    <p className="text-[10px] text-gray-500 font-mono">Cond: {rma.condition}</p>
                  </td>
                  <td className="py-3 px-3 border-r border-black">
                    <span className="px-1.5 py-0.5 border border-black bg-gray-100 text-[10px] font-bold">
                      {rma.reason}
                    </span>
                  </td>
                  <td className="py-3 px-3 border-r border-black font-bold text-black">
                    {rma.resolution}
                  </td>
                  <td className="py-3 px-3 border-r border-black text-center">
                    <span className={`inline-block px-2 py-0.5 border border-black text-[10px] font-bold uppercase ${
                      rma.status === 'Pending Inspection'
                        ? 'bg-black text-white'
                        : rma.status === 'Resolved / Restocked'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-black'
                    }`}>
                      {rma.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button 
                      onClick={() => setInspectingRma(rma)}
                      className="px-2.5 py-1 border border-black bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Rapid Inspection & Disposition Workstation */}
      {inspectingRma && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-lg w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase">
                  Rapid Inspection &amp; Disposition: {inspectingRma.id}
                </h3>
              </div>
              <button
                onClick={() => setInspectingRma(null)}
                className="p-1 hover:bg-black hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 border border-black bg-gray-50 text-xs space-y-1">
              <p className="font-bold text-black uppercase">Product: {inspectingRma.item}</p>
              <p className="text-gray-600">Client: {inspectingRma.customer} ({inspectingRma.pet})</p>
              <p className="text-gray-600">Original Order: {inspectingRma.orderRef}</p>
              <p className="text-gray-600">Return Reason: {inspectingRma.reason}</p>
              <p className="font-bold text-black">Refund Value: ${inspectingRma.amount.toFixed(2)} USD</p>
            </div>

            {/* Physical Condition & Restock Decision */}
            <div className="space-y-2 text-xs">
              <label className="block text-[10px] font-bold uppercase text-gray-700">
                1. Physical Inspection Disposition
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'RESTOCK', label: 'Restock To Shelf', desc: 'Seal intact' },
                  { id: 'SCRAP', label: 'Scrap / Damaged', desc: 'Write off' },
                  { id: 'RTV', label: 'Return To Vendor', desc: 'Warranty credit' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDisposition(d.id as any)}
                    className={`p-2 border text-left cursor-pointer transition-colors ${
                      disposition === d.id
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-bold uppercase text-[10px]">{d.label}</p>
                    <p className="text-[9px] opacity-80">{d.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Settlement */}
            <div className="space-y-2 text-xs">
              <label className="block text-[10px] font-bold uppercase text-gray-700">
                2. Financial Settlement
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CREDIT', label: 'Store Credit', desc: 'Digital voucher' },
                  { id: 'STRIPE', label: 'Stripe Refund', desc: 'Back to card' },
                  { id: 'EXCHANGE', label: 'Dispatch Exchange', desc: 'Ship new unit' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setRefundMethod(m.id as any)}
                    className={`p-2 border text-left cursor-pointer transition-colors ${
                      refundMethod === m.id
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-bold uppercase text-[10px]">{m.label}</p>
                    <p className="text-[9px] opacity-80">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-black">
              <button
                onClick={() => setInspectingRma(null)}
                className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveInspection}
                className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer border border-black"
              >
                Commit Disposition &amp; Settle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Initiate RMA Form */}
      {isInitiateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase">Initiate Reverse RMA</h3>
              </div>
              <button
                onClick={() => setIsInitiateModalOpen(false)}
                className="p-1 hover:bg-black hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRma} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Original Order ID
                </label>
                <input
                  type="text"
                  value={newOrderRef}
                  onChange={(e) => setNewOrderRef(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-black bg-white font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-black bg-white font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Item to Return
                </label>
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-black bg-white font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Reason for Return
                </label>
                <select
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-black bg-white font-bold cursor-pointer focus:outline-none"
                >
                  <option>Wrong Size / Formula</option>
                  <option>Duplicate Gift</option>
                  <option>Pet Refused / Allergic</option>
                  <option>Carrier Damage</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black">
                <button
                  type="button"
                  onClick={() => setIsInitiateModalOpen(false)}
                  className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer border border-black"
                >
                  Create RMA &amp; Send Label
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Return Policy */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase">Salon Return &amp; Hygiene Standards</h3>
              </div>
              <button
                onClick={() => setIsPolicyModalOpen(false)}
                className="p-1 hover:bg-black hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2 leading-relaxed">
              <p className="font-bold text-black">• 30-Day Guarantee on All Unopened Retails</p>
              <p className="text-gray-600">
                Products returned with intact tamper seals are entitled to 100% refund to original card or store credit voucher.
              </p>
              <p className="font-bold text-black">• Grooming Tools &amp; Shears Policy</p>
              <p className="text-gray-600">
                Due to Texas Board hygiene protocols, brushes or shears exposed to animal coats must undergo ultrasonic sanitation before restocking.
              </p>
              <p className="font-bold text-black">• Treats &amp; Edible Supplements</p>
              <p className="text-gray-600">
                Opened edible bags are non-restockable and disposed immediately with store credit provided for client satisfaction.
              </p>
            </div>

            <div className="pt-2 border-t border-black text-right">
              <button
                onClick={() => setIsPolicyModalOpen(false)}
                className="px-4 py-1.5 bg-black text-white font-bold text-xs uppercase cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Generate Return Shipping Label */}
      {isLabelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase">Prepaid Return Label Dispatch</h3>
              </div>
              <button
                onClick={() => setIsLabelModalOpen(false)}
                className="p-1 hover:bg-black hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border-2 border-black bg-white space-y-3 text-center">
              <div className="flex justify-between items-center text-[10px] border-b border-black pb-1">
                <span className="font-bold">USPS GROUND ADVANTAGE RETURN</span>
                <span>POSTAGE PAID</span>
              </div>
              <div className="flex items-center justify-center py-2">
                <QrCode className="w-24 h-24 text-black" />
              </div>
              <p className="text-xs font-bold">QR CODE FOR POST OFFICE SCAN-AND-DROP</p>
              <p className="text-[10px] text-gray-500">Tracking: 9400 1118 9956 2837 0199 01</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-black">
              <button
                onClick={() => setIsLabelModalOpen(false)}
                className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setIsLabelModalOpen(false);
                }}
                className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer border border-black"
              >
                Print / Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
