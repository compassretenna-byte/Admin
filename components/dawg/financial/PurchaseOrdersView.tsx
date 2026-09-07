'use client';

import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Download, 
  Plus, 
  Truck, 
  Barcode, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Store,
  Check,
  X,
  FileText,
  DollarSign
} from 'lucide-react';
import { DawgNavSection } from '@/lib/types';

interface PoItem {
  id: string;
  vendor: string;
  items: string;
  delivery: string;
  eta: string;
  totalUnits: number;
  checkedUnits: number;
  cost: number;
  terms: string;
  status: 'IN TRANSIT' | 'ORDERED' | 'PARTIAL' | 'RECEIVED';
}

const INITIAL_POS: PoItem[] = [
  {
    id: 'PO-2025-019',
    vendor: 'Pawz Botanical Supplies',
    items: 'Blueberry Facial Wash (60), Oatmeal Conditioner (60)',
    delivery: 'MAY 15, 2025',
    eta: 'ETA: TOMORROW BY 14:00',
    totalUnits: 120,
    checkedUnits: 0,
    cost: 1440.0,
    terms: 'NET 30',
    status: 'IN TRANSIT',
  },
  {
    id: 'PO-2025-018',
    vendor: 'ProGroom Tools Ltd',
    items: 'De-shedding Undercoat Rakes (25), Slicker Pro Brushes (20)',
    delivery: 'MAY 18, 2025',
    eta: 'STANDARD FREIGHT',
    totalUnits: 45,
    checkedUnits: 0,
    cost: 890.0,
    terms: 'PAID (ACH)',
    status: 'ORDERED',
  },
  {
    id: 'PO-2025-017',
    vendor: 'BarkBoutique Wholesale',
    items: 'Organic Calming Lavender Hemp Treats (80 Bags)',
    delivery: 'MAY 10, 2025',
    eta: '20 UNITS REMAINING',
    totalUnits: 80,
    checkedUnits: 60,
    cost: 1090.0,
    terms: 'NET 15',
    status: 'PARTIAL',
  },
  {
    id: 'PO-2025-016',
    vendor: 'Pawz Botanical Supplies',
    items: 'Hypoallergenic Tearless Puppy Shampoo (200 Units)',
    delivery: 'MAY 02, 2025',
    eta: 'DOCKED AT MAIN HUB',
    totalUnits: 200,
    checkedUnits: 200,
    cost: 2400.0,
    terms: 'PAID (CARD)',
    status: 'RECEIVED',
  },
];

interface PurchaseOrdersViewProps {
  onNavigateSection?: (section: DawgNavSection) => void;
}

export const PurchaseOrdersView: React.FC<PurchaseOrdersViewProps> = ({ onNavigateSection }) => {
  const [pos, setPos] = useState<PoItem[]>(INITIAL_POS);
  const [activeTab, setActiveTab] = useState<'all' | 'ordered' | 'transit' | 'received'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scannedQty, setScannedQty] = useState(10);
  const [verifiedCount, setVerifiedCount] = useState(60);
  const totalExpected = 80;

  // Modals
  const [isCreatePoOpen, setIsCreatePoOpen] = useState(false);
  const [isVendorsModalOpen, setIsVendorsModalOpen] = useState(false);
  const [receivingPo, setReceivingPo] = useState<PoItem | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // New PO form state
  const [newVendor, setNewVendor] = useState('Pawz Botanical Supplies');
  const [newItemDesc, setNewItemDesc] = useState('Blueberry Facial Wash (16 oz)');
  const [newUnits, setNewUnits] = useState(50);
  const [newUnitCost, setNewUnitCost] = useState(12.0);
  const [newTerms, setNewTerms] = useState('NET 30');

  const handleScanCheckIn = () => {
    setVerifiedCount((prev) => Math.min(totalExpected, prev + scannedQty));
    setNoticeMessage(`Scanned +${scannedQty} units! Current progress tally updated.`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const percentComplete = Math.round((verifiedCount / totalExpected) * 100);

  const handleExportLedger = () => {
    const headers = 'PO Number,Vendor,Items,Delivery,Total Units,Total Cost,Terms,Status\n';
    const rows = pos
      .map((p) => `"${p.id}","${p.vendor}","${p.items}","${p.delivery}",${p.totalUnits},${p.cost},"${p.terms}","${p.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchase_orders_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `PO-2025-0${20 + Math.floor(Math.random() * 20)}`;
    const created: PoItem = {
      id: newId,
      vendor: newVendor,
      items: `${newItemDesc} (${newUnits} Units)`,
      delivery: 'MAY 22, 2025',
      eta: 'SCHEDULED FREIGHT',
      totalUnits: newUnits,
      checkedUnits: 0,
      cost: newUnits * newUnitCost,
      terms: newTerms,
      status: 'ORDERED',
    };
    setPos((prev) => [created, ...prev]);
    setIsCreatePoOpen(false);
    setNoticeMessage(`Purchase Order ${newId} issued to ${newVendor}!`);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  const handleFinalizeReceiving = () => {
    if (!receivingPo) return;
    setPos((prev) =>
      prev.map((p) =>
        p.id === receivingPo.id
          ? { ...p, status: 'RECEIVED', checkedUnits: p.totalUnits }
          : p
      )
    );
    setNoticeMessage(`PO ${receivingPo.id} received in full! Inventory catalog updated.`);
    setReceivingPo(null);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  const filteredPos = pos.filter((po) => {
    if (activeTab === 'ordered' && po.status !== 'ORDERED') return false;
    if (activeTab === 'transit' && po.status !== 'IN TRANSIT') return false;
    if (activeTab === 'received' && po.status !== 'RECEIVED' && po.status !== 'PARTIAL') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        po.id.toLowerCase().includes(q) ||
        po.vendor.toLowerCase().includes(q) ||
        po.items.toLowerCase().includes(q);
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
            <span className="bg-black text-white px-1.5 py-0.5 font-bold">LOGISTICS // OMS</span>
            <span>/</span>
            <span className="text-black font-bold">PO-RECV-STATION-01</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black">
            Purchase Orders &amp; Receiving
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Create vendor purchase orders, receive supplier shipments, and update inventory counts in bulk.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setIsVendorsModalOpen(true)}
            className="h-9 px-3 border border-black bg-white hover:bg-gray-100 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Vendors Directory</span>
          </button>
          <button 
            onClick={handleExportLedger}
            className="h-9 px-3 border border-black bg-white hover:bg-gray-100 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Ledger</span>
          </button>
          <button 
            onClick={() => setIsCreatePoOpen(true)}
            className="h-9 px-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-black cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create PO</span>
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
          <p className="text-[10px] text-gray-500 uppercase font-bold">Open Orders</p>
          <p className="text-2xl font-black text-black">{pos.filter((p) => p.status === 'ORDERED').length}</p>
          <p className="text-[10px] text-gray-600 font-mono mt-0.5">$3,420 committed</p>
        </div>

        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">In-Transit</p>
          <p className="text-2xl font-black text-black">{pos.filter((p) => p.status === 'IN TRANSIT').length}</p>
          <p className="text-[10px] text-gray-600 font-mono mt-0.5">ETA: 48-72 hrs</p>
        </div>

        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Partial Recv</p>
          <p className="text-2xl font-black text-amber-700">{pos.filter((p) => p.status === 'PARTIAL').length}</p>
          <p className="text-[10px] text-amber-700 font-bold font-mono mt-0.5">20 units left</p>
        </div>

        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Active Vendors</p>
          <p className="text-2xl font-black text-black">04</p>
          <p className="text-[10px] text-gray-600 font-mono mt-0.5">100% on-time</p>
        </div>

        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Recv This Month</p>
          <p className="text-2xl font-black text-black">$8,940</p>
          <p className="text-[10px] text-gray-600 font-mono mt-0.5">14 shipments</p>
        </div>

        <div className="border border-black p-3 bg-gray-50 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Low Stock Alerts</p>
          <p className="text-2xl font-black text-black">05</p>
          <p className="text-[10px] text-black font-bold font-mono mt-0.5">Reorder points</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="border border-black bg-white">
        {/* Tabs */}
        <div className="flex items-center overflow-x-auto border-b border-black">
          {[
            { id: 'all', label: 'All Orders', count: pos.length },
            { id: 'ordered', label: 'Open / Ordered', count: pos.filter((p) => p.status === 'ORDERED').length },
            { id: 'transit', label: 'In-Transit', count: pos.filter((p) => p.status === 'IN TRANSIT').length },
            { id: 'received', label: 'Received / Closed', count: pos.filter((p) => p.status === 'RECEIVED' || p.status === 'PARTIAL').length },
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
              placeholder="Filter PO #, vendor, or items..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-black text-black placeholder-gray-400 focus:outline-none font-bold"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-black border-collapse font-mono">
            <thead>
              <tr className="bg-gray-50 border-b border-black font-bold uppercase text-[10px] tracking-wider text-black">
                <th className="py-2.5 px-3 border-r border-black">PO Number</th>
                <th className="py-2.5 px-3 border-r border-black">Vendor Name</th>
                <th className="py-2.5 px-3 border-r border-black">Expected Delivery</th>
                <th className="py-2.5 px-3 border-r border-black text-center">Units Received</th>
                <th className="py-2.5 px-3 border-r border-black text-right">Total Cost</th>
                <th className="py-2.5 px-3 border-r border-black text-center">Terms</th>
                <th className="py-2.5 px-3 border-r border-black">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {filteredPos.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-black border-r border-black">
                    {po.id}
                  </td>
                  <td className="py-3 px-3 border-r border-black font-sans">
                    <p className="font-bold text-black">{po.vendor}</p>
                    <p className="text-[10px] text-gray-600 font-mono">{po.items}</p>
                  </td>
                  <td className="py-3 px-3 border-r border-black">
                    <p className="font-bold text-black">{po.delivery}</p>
                    <p className="text-[10px] text-gray-500">{po.eta}</p>
                  </td>
                  <td className="py-3 px-3 border-r border-black text-center font-bold">
                    {po.checkedUnits} / {po.totalUnits}
                  </td>
                  <td className="py-3 px-3 border-r border-black text-right font-black">
                    ${po.cost.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 border-r border-black text-center">
                    <span className="px-1.5 py-0.5 border border-black bg-gray-100 text-[10px] font-bold">
                      {po.terms}
                    </span>
                  </td>
                  <td className="py-3 px-3 border-r border-black">
                    <span className={`inline-block px-2 py-0.5 border border-black text-[10px] font-bold uppercase ${
                      po.status === 'IN TRANSIT'
                        ? 'bg-black text-white'
                        : po.status === 'PARTIAL'
                        ? 'bg-amber-600 text-white'
                        : po.status === 'RECEIVED'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-black'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button 
                      onClick={() => setReceivingPo(po)}
                      className="px-2.5 py-1 bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      Receive Dock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rapid Receiving Dock Barcode Scanner */}
      <div className="border border-black bg-white p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black pb-2">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-black text-white text-[10px] font-mono font-bold uppercase">STATION LIVE</span>
            <h3 className="font-black uppercase text-xs text-black">Rapid Receiving Dock // Barcode Scanner</h3>
          </div>
          <span className="text-[11px] font-mono text-gray-600">PO CONTEXT: PO-2025-017 (BARKBOUTIQUE)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs text-gray-600 font-mono">
              Scan barcode or enter internal SKU to automatically increment verified stock.
            </p>
            <div className="flex gap-2">
              <input 
                type="text"
                defaultValue="SKU-88210-CLMTREAT"
                className="flex-1 h-10 px-3 bg-gray-50 border border-black text-xs font-mono uppercase focus:outline-none font-bold"
              />
              <div className="flex items-center border border-black bg-gray-50 px-2 font-mono text-xs">
                <span className="text-gray-500 text-[10px] mr-2 font-bold">QTY</span>
                <input 
                  type="number"
                  value={scannedQty}
                  onChange={(e) => setScannedQty(parseInt(e.target.value) || 1)}
                  className="w-12 text-center font-bold bg-transparent focus:outline-none"
                />
              </div>
              <button 
                onClick={handleScanCheckIn}
                className="px-4 bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 border border-black cursor-pointer hover:bg-neutral-800"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm</span>
              </button>
            </div>
            <p className="text-[11px] font-mono text-gray-600">
              LAST SCANNED: <strong>Organic Calming Lavender Hemp Treats (100g)</strong> • 100% SKU HIT
            </p>
          </div>

          <div className="lg:col-span-5 border border-black p-4 bg-gray-50 space-y-3 font-mono text-xs">
            <div className="flex justify-between font-bold">
              <span>PO PROGRESS TALLY</span>
              <span>{percentComplete}% COMPLETE</span>
            </div>
            <div className="w-full h-3 border border-black bg-white overflow-hidden">
              <div className="h-full bg-black transition-all" style={{ width: `${percentComplete}%` }}></div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
              <div className="p-2 bg-white border border-black">
                <p className="text-gray-500">EXPECTED</p>
                <p className="text-base font-black text-black mt-0.5">{totalExpected}</p>
              </div>
              <div className="p-2 bg-white border border-black">
                <p className="text-gray-500">VERIFIED</p>
                <p className="text-base font-black text-black mt-0.5">{verifiedCount}</p>
              </div>
              <div className="p-2 bg-white border border-black">
                <p className="text-gray-500">REMAINING</p>
                <p className="text-base font-black text-black mt-0.5">{Math.max(0, totalExpected - verifiedCount)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Create Purchase Order */}
      {isCreatePoOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-lg w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase">Create Vendor Purchase Order</h3>
              </div>
              <button
                onClick={() => setIsCreatePoOpen(false)}
                className="p-1 hover:bg-black hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePo} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Supplier / Vendor
                </label>
                <select
                  value={newVendor}
                  onChange={(e) => setNewVendor(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-black bg-white font-bold cursor-pointer focus:outline-none"
                >
                  <option>Pawz Botanical Supplies</option>
                  <option>ProGroom Tools Ltd</option>
                  <option>BarkBoutique Wholesale</option>
                  <option>PureGroom Laboratories</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Product Description &amp; SKU
                </label>
                <input
                  type="text"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-black bg-white font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                    Units Ordered
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newUnits}
                    onChange={(e) => setNewUnits(parseInt(e.target.value) || 1)}
                    className="w-full px-2.5 py-1.5 border border-black bg-white font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                    Unit Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={newUnitCost}
                    onChange={(e) => setNewUnitCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 border border-black bg-white font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                    Payment Terms
                  </label>
                  <select
                    value={newTerms}
                    onChange={(e) => setNewTerms(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-black bg-white font-bold cursor-pointer focus:outline-none"
                  >
                    <option>NET 30</option>
                    <option>NET 15</option>
                    <option>ACH</option>
                    <option>CREDIT CARD</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-black flex justify-between items-center text-xs">
                <span className="font-bold uppercase text-gray-600">Calculated PO Subtotal:</span>
                <span className="font-black text-sm text-black">
                  ${(newUnits * newUnitCost).toFixed(2)} USD
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black">
                <button
                  type="button"
                  onClick={() => setIsCreatePoOpen(false)}
                  className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer border border-black"
                >
                  Commit &amp; Issue PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Vendors Directory */}
      {isVendorsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-xl w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase">Supplier &amp; Vendor Directory</h3>
              </div>
              <button
                onClick={() => setIsVendorsModalOpen(false)}
                className="p-1 hover:bg-black hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: 'Pawz Botanical Supplies', terms: 'NET 30', lead: '3 Days', contact: 'orders@pawzbotanicals.com', catalog: 'Shampoos, Conditioners, Sprays' },
                { name: 'ProGroom Tools Ltd', terms: 'ACH Prepaid', lead: '5 Days', contact: 'wholesale@progroom.com', catalog: 'Shears, Rakes, Nail Grinders' },
                { name: 'BarkBoutique Wholesale', terms: 'NET 15', lead: '2 Days', contact: 'supply@barkboutique.com', catalog: 'Hemp Treats, Calming Chews' },
              ].map((v) => (
                <div key={v.name} className="p-3 border border-black bg-gray-50 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="font-black text-black uppercase">{v.name}</p>
                    <span className="px-1.5 py-0.2 border border-black bg-white text-[10px] font-bold">{v.terms}</span>
                  </div>
                  <p className="text-gray-600">Lead Time: {v.lead} · Contact: {v.contact}</p>
                  <p className="text-[10px] text-gray-500 font-bold">Category: {v.catalog}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-black text-right">
              <button
                onClick={() => setIsVendorsModalOpen(false)}
                className="px-4 py-1.5 bg-black text-white font-bold text-xs uppercase cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Receiving Dock Action for specific PO */}
      {receivingPo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase">Receiving Freight: {receivingPo.id}</h3>
              </div>
              <button
                onClick={() => setReceivingPo(null)}
                className="p-1 hover:bg-black hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 border border-black bg-gray-50 text-xs space-y-1">
              <p className="font-bold text-black uppercase">Vendor: {receivingPo.vendor}</p>
              <p className="text-gray-600">Items: {receivingPo.items}</p>
              <p className="text-gray-600">Total Expected: {receivingPo.totalUnits} Units</p>
              <p className="text-gray-600">Invoice Total: ${receivingPo.cost.toFixed(2)} USD</p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-[10px] font-bold uppercase text-gray-700">
                Dock Inspection Checklist
              </label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-black w-3.5 h-3.5" />
                  <span>Pallet seals intact, no moisture/physical crushing</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-black w-3.5 h-3.5" />
                  <span>Item counts match BOL / packing manifest</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-black w-3.5 h-3.5" />
                  <span>Lot numbers &amp; expiration dates recorded to ledger</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-black">
              <button
                onClick={() => setReceivingPo(null)}
                className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalizeReceiving}
                className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer border border-black"
              >
                Finalize &amp; Stock Inventory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
