'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Download, 
  Plus, 
  Printer, 
  Truck, 
  Store, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  Filter, 
  ExternalLink, 
  Barcode, 
  Package, 
  Layers,
  X,
  CreditCard,
  User,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { DawgNavSection } from '@/lib/types';

interface OrderItem {
  id: string;
  time: string;
  dateText: string;
  customer: string;
  pets: string;
  items: string;
  bins: string;
  total: number;
  payment: string;
  method: string;
  methodType: 'shipping' | 'pickup';
  weight: string;
  urgency: string;
  due: string;
  status: 'UNFULFILLED' | 'READY' | 'LOCAL_PICKUP' | 'SHIPPED' | 'DELIVERED';
}

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ORD-2025-1048',
    time: '1h 40m ago',
    dateText: 'Today, 10:14 AM',
    customer: 'Sarah Johnson',
    pets: 'Buddy (Golden) & Luna',
    items: '2x Blueberry Facial Wash (250ml), 1x De-shedding Rake Pro',
    bins: 'BIN B-04 · BIN T-12',
    total: 85.00,
    payment: 'PAID (STRIPE)',
    method: 'USPS Ground Adv.',
    methodType: 'shipping',
    weight: '2.4 lbs',
    urgency: 'RUSH WAVE',
    due: 'DUE 15:30',
    status: 'UNFULFILLED',
  },
  {
    id: 'ORD-2025-1047',
    time: '2h 00m ago',
    dateText: 'Today, 09:42 AM',
    customer: 'Marcus Johnson',
    pets: 'Rocky (Rottweiler Mix)',
    items: '1x Hypo Shampoo (1 Gal), 1x Ear Cleaner 16oz',
    bins: 'BAY 4 (BULK) · BIN S-08',
    total: 124.50,
    payment: 'PAID (ONLINE)',
    method: 'Curbside Vehicle (Bay 1)',
    methodType: 'pickup',
    weight: '9.8 lbs',
    urgency: 'ARRIVED',
    due: 'ARRIVED 4M AGO',
    status: 'READY',
  },
  {
    id: 'ORD-2025-1046',
    time: '2h 10m ago',
    dateText: 'Today, 09:30 AM',
    customer: 'Emily Davis',
    pets: 'Charlie (Toy Poodle)',
    items: '1x Paw Balm Stick, 1x Silk Coat Spray',
    bins: 'SHELF P-03',
    total: 32.00,
    payment: 'PAID (ONLINE)',
    method: 'In-Salon Counter',
    methodType: 'pickup',
    weight: '0.8 lbs',
    urgency: 'HOLDING',
    due: 'READY ON SHELF',
    status: 'LOCAL_PICKUP',
  },
  {
    id: 'ORD-2025-1045',
    time: '3h ago',
    dateText: 'Today, 08:30 AM',
    customer: 'David Wilson',
    pets: 'Max (German Shepherd)',
    items: '1x Pro Shears 8", 1x Undercoat Comb',
    bins: 'DISPATCH HUB',
    total: 168.00,
    payment: 'PAID (VISA)',
    method: 'USPS Priority Mail',
    methodType: 'shipping',
    weight: '1.4 lbs',
    urgency: 'IN TRANSIT',
    due: 'DELIVERY TODAY',
    status: 'SHIPPED',
  },
  {
    id: 'ORD-2025-1044',
    time: '2h 15m ago',
    dateText: 'Today, 09:39 AM',
    customer: 'Jessica Ramirez',
    pets: 'Oliver (DSH Feline)',
    items: '3x Wild Organic Salmon Oil 16oz, 1x Foam Wash',
    bins: 'BIN S-01 · BIN S-08',
    total: 54.20,
    payment: 'PAID (APPLE PAY)',
    method: 'USPS Priority Mail',
    methodType: 'shipping',
    weight: '3.8 lbs',
    urgency: 'STANDARD',
    due: 'DUE 18:00',
    status: 'UNFULFILLED',
  },
  {
    id: 'ORD-2025-1043',
    time: '3h 30m ago',
    dateText: 'Today, 08:18 AM',
    customer: 'Anthony Thorne',
    pets: 'Titan (Great Dane)',
    items: '1x XXL Orthopedic Bolster Bed',
    bins: 'BULK BAY 4',
    total: 210.00,
    payment: 'PARTIAL (50% DUE)',
    method: 'Curbside Vehicle (Bay 3)',
    methodType: 'pickup',
    weight: '14.5 lbs',
    urgency: 'ARRIVED',
    due: 'BAL $105 DUE',
    status: 'READY',
  },
  {
    id: 'ORD-2025-1042',
    time: '3h 10m ago',
    dateText: 'Today, 08:44 AM',
    customer: 'Claire Sterling',
    pets: 'Bella & Milo (Frenchies)',
    items: '2x Velvet Step-in Harness (Exchange M→S)',
    bins: 'AISLE 02-B',
    total: 0.00,
    payment: 'EXCHANGED (BAL 0)',
    method: 'USPS Ground Adv.',
    methodType: 'shipping',
    weight: '1.1 lbs',
    urgency: 'WARRANTY',
    due: 'RMA VERIFIED',
    status: 'UNFULFILLED',
  },
  {
    id: 'ORD-2025-1032',
    time: '4h ago',
    dateText: 'May 08, 09:15 AM',
    customer: 'Sarah Johnson',
    pets: 'Buddy (Golden)',
    items: '2x Blueberry Facial Wash, 1x Silk Coat Spray',
    bins: 'PORCH VERIFIED',
    total: 64.00,
    payment: 'PAID (STRIPE)',
    method: 'USPS Priority (POD Photo)',
    methodType: 'shipping',
    weight: '1.5 lbs',
    urgency: 'VERIFIED',
    due: 'DELIVERED',
    status: 'DELIVERED',
  },
];

interface OrdersViewProps {
  onNavigateSection?: (section: DawgNavSection) => void;
  onOpenOrderDetails?: (orderId: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ 
  onNavigateSection,
  onOpenOrderDetails 
}) => {
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<'all' | 'unfulfilled' | 'ready' | 'pickup' | 'shipped' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>(['ORD-2025-1048', 'ORD-2025-1044']);

  // Modals
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isBatchPrintModalOpen, setIsBatchPrintModalOpen] = useState(false);
  const [handoverOrder, setHandoverOrder] = useState<OrderItem | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // New Order Draft State (Mockup 5)
  const [draftClient, setDraftClient] = useState('Sarah Johnson');
  const [draftPet, setDraftPet] = useState('Buddy (Golden Retriever)');
  const [draftItem1, setDraftItem1] = useState('Blueberry Facial Wash (16 oz)');
  const [draftQty1, setDraftQty1] = useState(2);
  const [draftMethod, setDraftMethod] = useState<'shipping' | 'pickup'>('shipping');
  const [draftPayMethod, setDraftPayMethod] = useState('Stripe Card Terminal');

  const handleToggleSelect = (id: string) => {
    setSelectedOrders((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o.id));
    }
  };

  const handleBatchMarkFulfilled = () => {
    setOrders((prev) =>
      prev.map((ord) =>
        selectedOrders.includes(ord.id)
          ? { ...ord, status: ord.methodType === 'pickup' ? 'READY' : 'SHIPPED' }
          : ord
      )
    );
    setNoticeMessage(`Marked ${selectedOrders.length} orders as fulfilled!`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const handleExportCSV = () => {
    const headers = 'Order ID,Customer,Pets,Items,Total,Status,Method\n';
    const rows = orders
      .map((o) => `"${o.id}","${o.customer}","${o.pets}","${o.items}",${o.total},"${o.status}","${o.method}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_manifest_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateDraftOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `ORD-2025-${Math.floor(1050 + Math.random() * 50)}`;
    const created: OrderItem = {
      id: newId,
      time: 'Just now',
      dateText: 'Today, Just now',
      customer: draftClient,
      pets: draftPet,
      items: `${draftQty1}x ${draftItem1}`,
      bins: 'BIN B-04',
      total: draftQty1 * 24.0,
      payment: `PAID (${draftPayMethod.toUpperCase()})`,
      method: draftMethod === 'shipping' ? 'USPS Priority Mail' : 'Curbside Pickup (Bay 1)',
      methodType: draftMethod,
      weight: '1.8 lbs',
      urgency: 'RUSH WAVE',
      due: 'DUE TODAY',
      status: 'UNFULFILLED',
    };
    setOrders((prev) => [created, ...prev]);
    setIsDraftModalOpen(false);
    setNoticeMessage(`Order ${newId} created successfully & queued!`);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  const handleConfirmHandover = () => {
    if (!handoverOrder) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === handoverOrder.id ? { ...o, status: 'DELIVERED' } : o))
    );
    setNoticeMessage(`Order ${handoverOrder.id} handed over to ${handoverOrder.customer}!`);
    setHandoverOrder(null);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const filteredOrders = orders.filter((ord) => {
    if (activeTab === 'unfulfilled' && ord.status !== 'UNFULFILLED') return false;
    if (activeTab === 'ready' && ord.status !== 'READY') return false;
    if (activeTab === 'pickup' && ord.methodType !== 'pickup') return false;
    if (activeTab === 'shipped' && ord.status !== 'SHIPPED') return false;
    if (activeTab === 'delivered' && ord.status !== 'DELIVERED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        ord.id.toLowerCase().includes(q) ||
        ord.customer.toLowerCase().includes(q) ||
        ord.pets.toLowerCase().includes(q) ||
        ord.items.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1650px] mx-auto text-black bg-white min-h-full font-mono">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-black pb-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            <span className="bg-black text-white px-1.5 py-0.5 font-bold">OMS // LIVE QUEUE</span>
            <span>/</span>
            <span className="text-black font-bold">STATION: MAIN-SALON-A</span>
            <span>/</span>
            <span className="text-emerald-700 font-bold">MULTITENANT RLS SYNCED</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black">
            Orders &amp; Fulfillment
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage customer retail orders, track warehouse picking queues, and coordinate shipping dispatches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handleExportCSV}
            className="h-9 px-3 border border-black bg-white hover:bg-gray-100 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={() => onNavigateSection?.('shipping')}
            className="h-9 px-3 border border-black bg-white hover:bg-gray-100 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Shipping &amp; Labels</span>
          </button>
          <button 
            onClick={() => setIsBatchPrintModalOpen(true)}
            className="h-9 px-3 border border-black bg-white hover:bg-gray-100 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Batch Slips ({selectedOrders.length})</span>
          </button>
          <button 
            onClick={() => setIsDraftModalOpen(true)}
            className="h-9 px-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-black cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Order Draft</span>
          </button>
        </div>
      </div>

      {noticeMessage && (
        <div className="p-3 border border-black bg-emerald-500 text-white font-bold text-xs flex items-center justify-between">
          <span>{noticeMessage}</span>
          <Check className="w-4 h-4" />
        </div>
      )}

      {/* KPI 6-Tile Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Total Orders</p>
          <p className="text-2xl font-black text-black">{orders.length}</p>
          <p className="text-[10px] text-gray-500">Gross: $1,489.20</p>
        </div>
        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Unfulfilled Queue</p>
          <p className="text-2xl font-black text-amber-700">
            {orders.filter((o) => o.status === 'UNFULFILLED').length}
          </p>
          <p className="text-[10px] text-amber-700 font-bold">Priority Pack Wave</p>
        </div>
        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Ready Curbside</p>
          <p className="text-2xl font-black text-blue-700">
            {orders.filter((o) => o.status === 'READY').length}
          </p>
          <p className="text-[10px] text-blue-700 font-bold">Bays 1 &amp; 3 Active</p>
        </div>
        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Counter Pickup</p>
          <p className="text-2xl font-black text-black">
            {orders.filter((o) => o.status === 'LOCAL_PICKUP').length}
          </p>
          <p className="text-[10px] text-gray-500">Staged on Shelf P</p>
        </div>
        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Shipped (USPS)</p>
          <p className="text-2xl font-black text-black">
            {orders.filter((o) => o.status === 'SHIPPED').length}
          </p>
          <p className="text-[10px] text-emerald-700 font-bold">Tracking Active</p>
        </div>
        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Completed / Delivered</p>
          <p className="text-2xl font-black text-black">
            {orders.filter((o) => o.status === 'DELIVERED').length}
          </p>
          <p className="text-[10px] text-gray-500">Settled to Ledger</p>
        </div>
      </div>

      {/* Batch Action Bar */}
      {selectedOrders.length > 0 && (
        <div className="p-3 border-2 border-black bg-black text-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-white text-black px-2 py-0.5 font-black text-[11px]">
              {selectedOrders.length} ORDERS SELECTED
            </span>
            <span className="text-gray-300">Choose batch operation:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchMarkFulfilled}
              className="px-3 py-1 bg-white text-black hover:bg-gray-100 font-bold uppercase cursor-pointer"
            >
              ✓ Mark Fulfilled ({selectedOrders.length})
            </button>
            <button
              onClick={() => setIsBatchPrintModalOpen(true)}
              className="px-3 py-1 border border-white bg-transparent hover:bg-neutral-800 text-white font-bold uppercase cursor-pointer flex items-center gap-1"
            >
              <Printer className="w-3 h-3" />
              <span>Print Batch Labels</span>
            </button>
            <button
              onClick={() => setSelectedOrders([])}
              className="px-2 py-1 text-gray-400 hover:text-white cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Orders Table Container */}
      <div className="border border-black bg-white">
        {/* Table Filter Tabs */}
        <div className="p-3 border-b border-black flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: `ALL ORDERS (${orders.length})` },
              { id: 'unfulfilled', label: `UNFULFILLED (${orders.filter((o) => o.status === 'UNFULFILLED').length})` },
              { id: 'ready', label: `READY CURBSIDE (${orders.filter((o) => o.status === 'READY').length})` },
              { id: 'pickup', label: 'LOCAL PICKUP' },
              { id: 'shipped', label: 'SHIPPED' },
              { id: 'delivered', label: 'DELIVERED' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3 py-1 text-xs font-bold uppercase border cursor-pointer transition-colors ${
                  activeTab === t.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black hover:bg-gray-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, client, pet, items..."
              className="pl-8 pr-3 py-1 border border-black bg-white text-xs font-bold focus:outline-none w-52 sm:w-64"
            />
          </div>
        </div>

        {/* The Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono text-black">
            <thead className="bg-gray-50 border-b border-black text-[10px] uppercase font-bold text-black tracking-wider">
              <tr>
                <th className="p-3 border-r border-black w-8 text-center">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={handleSelectAll}
                    className="w-3.5 h-3.5 accent-black cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3 border-r border-black">Order ID &amp; Time</th>
                <th className="py-2.5 px-3 border-r border-black">Client &amp; Pet</th>
                <th className="py-2.5 px-3 border-r border-black">Items &amp; Allocation</th>
                <th className="py-2.5 px-3 border-r border-black text-right">Total &amp; Payment</th>
                <th className="py-2.5 px-3 border-r border-black">Fulfillment Method</th>
                <th className="py-2.5 px-3 border-r border-black text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {filteredOrders.map((ord) => {
                const isSelected = selectedOrders.includes(ord.id);
                return (
                  <tr
                    key={ord.id}
                    className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-gray-50' : ''}`}
                  >
                    <td className="p-3 text-center border-r border-black">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(ord.id)}
                        className="w-3.5 h-3.5 accent-black cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3 border-r border-black">
                      <button
                        onClick={() => {
                          onOpenOrderDetails?.(ord.id);
                          onNavigateSection?.('order-details');
                        }}
                        className="font-black text-black hover:underline cursor-pointer uppercase text-xs"
                      >
                        {ord.id}
                      </button>
                      <p className="text-[10px] text-gray-500">{ord.time}</p>
                    </td>
                    <td className="py-3 px-3 border-r border-black font-sans">
                      <p className="font-bold text-black uppercase">{ord.customer}</p>
                      <p className="text-[10px] font-mono text-gray-500">{ord.pets}</p>
                    </td>
                    <td className="py-3 px-3 border-r border-black">
                      <p className="text-xs text-black line-clamp-1">{ord.items}</p>
                      <p className="text-[10px] text-gray-500 font-bold">{ord.bins}</p>
                    </td>
                    <td className="py-3 px-3 border-r border-black text-right">
                      <p className="font-black text-black">${ord.total.toFixed(2)}</p>
                      <p className="text-[9px] font-bold text-gray-600">{ord.payment}</p>
                    </td>
                    <td className="py-3 px-3 border-r border-black">
                      <p className="font-bold text-black">{ord.method}</p>
                      <p className="text-[10px] text-gray-500">Wt: {ord.weight}</p>
                    </td>
                    <td className="py-3 px-3 border-r border-black text-center">
                      <span
                        className={`inline-block px-2 py-0.5 border border-black text-[10px] font-bold uppercase ${
                          ord.status === 'UNFULFILLED'
                            ? 'bg-black text-white'
                            : ord.status === 'READY'
                            ? 'bg-blue-600 text-white'
                            : ord.status === 'LOCAL_PICKUP'
                            ? 'bg-gray-100 text-black'
                            : ord.status === 'SHIPPED'
                            ? 'bg-neutral-800 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ord.methodType === 'pickup' && ord.status === 'READY' ? (
                          <button
                            onClick={() => setHandoverOrder(ord)}
                            className="px-2.5 py-1 bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase cursor-pointer"
                          >
                            Handover
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onOpenOrderDetails?.(ord.id);
                              onNavigateSection?.('order-details');
                            }}
                            className="px-2.5 py-1 bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase cursor-pointer"
                          >
                            Fulfill
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onOpenOrderDetails?.(ord.id);
                            onNavigateSection?.('order-details');
                          }}
                          className="p-1 border border-black bg-white hover:bg-gray-100 text-[10px] cursor-pointer"
                          title="View Order Details"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Terminal Intake Draft Order (Mockup 5) */}
      {isDraftModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-xl w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase tracking-tight">
                  Terminal Order Intake Draft (#DRF-2025-091)
                </h3>
              </div>
              <button
                onClick={() => setIsDraftModalOpen(false)}
                className="p-1 hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDraftOrder} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                    Customer Account
                  </label>
                  <select
                    value={draftClient}
                    onChange={(e) => setDraftClient(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-black bg-white font-bold cursor-pointer focus:outline-none"
                  >
                    <option>Sarah Johnson</option>
                    <option>Marcus Johnson</option>
                    <option>Emily Davis</option>
                    <option>David Wilson</option>
                    <option>Walk-in Salon Customer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                    Associated Pet
                  </label>
                  <input
                    type="text"
                    value={draftPet}
                    onChange={(e) => setDraftPet(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-black bg-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Catalog Product Item
                </label>
                <select
                  value={draftItem1}
                  onChange={(e) => setDraftItem1(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-black bg-white font-bold cursor-pointer focus:outline-none"
                >
                  <option>Blueberry Facial Wash (16 oz) - $24.00</option>
                  <option>De-shedding Undercoat Rake - $32.50</option>
                  <option>Calming Lavender Hemp Treats - $18.00</option>
                  <option>Hypoallergenic Puppy Wash (Gallon) - $36.00</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                    Quantity Units
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={draftQty1}
                    onChange={(e) => setDraftQty1(parseInt(e.target.value) || 1)}
                    className="w-full px-2.5 py-1.5 border border-black bg-white font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                    Fulfillment Mode
                  </label>
                  <select
                    value={draftMethod}
                    onChange={(e) => setDraftMethod(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-black bg-white font-bold cursor-pointer focus:outline-none"
                  >
                    <option value="shipping">USPS Shipping</option>
                    <option value="pickup">Curbside Pickup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                    Payment Terminal
                  </label>
                  <select
                    value={draftPayMethod}
                    onChange={(e) => setDraftPayMethod(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-black bg-white font-bold cursor-pointer focus:outline-none"
                  >
                    <option>Stripe Card Terminal</option>
                    <option>Cash at Register</option>
                    <option>On-File Card</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-black flex justify-between items-center text-xs">
                <span className="font-bold uppercase text-gray-600">Calculated Order Total:</span>
                <span className="font-black text-sm text-black">
                  ${(draftQty1 * 24.0).toFixed(2)} USD
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black">
                <button
                  type="button"
                  onClick={() => setIsDraftModalOpen(false)}
                  className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer border border-black"
                >
                  + Commit Order to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Batch Slips & Thermal Labels */}
      {isBatchPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase">Batch Spooler ({selectedOrders.length} Orders)</h3>
              </div>
              <button
                onClick={() => setIsBatchPrintModalOpen(false)}
                className="p-1 hover:bg-black hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Spooled {selectedOrders.length} packing manifests and shipping labels to Zebra ZD420 (Raw Port 9100).
            </p>

            <div className="p-3 border border-black bg-gray-50 text-xs space-y-1">
              {selectedOrders.map((id) => (
                <div key={id} className="flex justify-between">
                  <span className="font-bold">{id}</span>
                  <span className="text-gray-500">4x6 Thermal Label + 8.5x11 Manifest</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-black">
              <button
                onClick={() => setIsBatchPrintModalOpen(false)}
                className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setIsBatchPrintModalOpen(false);
                }}
                className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer border border-black flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Send to Spooler</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Pickup Handover Verification */}
      {handoverOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase">Curbside Handover: {handoverOrder.id}</h3>
              </div>
              <button
                onClick={() => setHandoverOrder(null)}
                className="p-1 hover:bg-black hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 border border-black bg-gray-50 space-y-1">
                <p className="font-bold uppercase text-black">Client: {handoverOrder.customer}</p>
                <p className="text-gray-600">Vehicle / Bay: {handoverOrder.method}</p>
                <p className="text-gray-600">Items: {handoverOrder.items}</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Recipient Identity Verification
                </label>
                <input
                  type="text"
                  defaultValue="Driver License / SMS Confirmation verified"
                  className="w-full px-2.5 py-1.5 border border-black bg-white font-bold focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black">
                <button
                  onClick={() => setHandoverOrder(null)}
                  className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmHandover}
                  className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer border border-black"
                >
                  Confirm Handover Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
