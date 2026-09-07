'use client';

import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Check, 
  Search, 
  Barcode, 
  Printer, 
  ArrowUpDown, 
  TrendingUp, 
  Building2, 
  Layers, 
  Store, 
  Truck, 
  Globe, 
  Sparkles, 
  X,
  CheckCircle2,
  RefreshCw,
  Clock,
  ArrowRight
} from 'lucide-react';
import { DawgNavSection } from '@/lib/types';
import { AddProductModal, CreatedProductItem } from './AddProductModal';

interface InventoryItemData {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  brand: string;
  category: string;
  binLocation: string;
  onHand: number;
  reserve: number;
  reorderPoint: number;
  unitCost: number;
  retailPrice: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  channels: string[];
}

const INITIAL_INVENTORY: InventoryItemData[] = [
  {
    id: 'inv-01',
    sku: 'SKU-9924-BLU-01',
    barcode: '810034928172',
    name: 'Blueberry Facial Foaming Wash (16 fl oz)',
    brand: "Burt's Bees Pro Line",
    category: 'Consumables / Topicals',
    binLocation: 'BIN-A-04',
    onHand: 4,
    reserve: 1,
    reorderPoint: 12,
    unitCost: 8.40,
    retailPrice: 18.50,
    status: 'LOW_STOCK',
    channels: ['POS', 'Online', 'Van'],
  },
  {
    id: 'inv-02',
    sku: 'SKU-4412-OAT-04',
    barcode: '810034928196',
    name: 'Oatmeal Soothing Conditioner (Gallon)',
    brand: 'Pawz Botanical Pure',
    category: 'Consumables / Bulk',
    binLocation: 'BIN-C-02',
    onHand: 16,
    reserve: 2,
    reorderPoint: 8,
    unitCost: 14.20,
    retailPrice: 32.00,
    status: 'IN_STOCK',
    channels: ['POS', 'Van'],
  },
  {
    id: 'inv-03',
    sku: 'SKU-7721-RAK-02',
    barcode: '810034928219',
    name: 'Ergonomic De-shedding Undercoat Rake Pro',
    brand: 'ProGroom Tools Ltd',
    category: 'Tools & Blades',
    binLocation: 'BIN-B-12',
    onHand: 2,
    reserve: 0,
    reorderPoint: 6,
    unitCost: 11.50,
    retailPrice: 28.00,
    status: 'LOW_STOCK',
    channels: ['POS', 'Online'],
  },
  {
    id: 'inv-04',
    sku: 'SKU-1092-BAL-01',
    barcode: '810034928233',
    name: 'Organic Lavender Paw & Nose Balm Stick',
    brand: 'EcoPaw Organics',
    category: 'Spa & Wellness',
    binLocation: 'SHELF-FRONT-01',
    onHand: 28,
    reserve: 4,
    reorderPoint: 10,
    unitCost: 4.10,
    retailPrice: 12.00,
    status: 'IN_STOCK',
    channels: ['POS', 'Online', 'Van'],
  },
  {
    id: 'inv-05',
    sku: 'SKU-3321-HYP-01',
    barcode: '810034928257',
    name: 'Tearless Hypoallergenic Puppy Wash (1 Gal)',
    brand: 'Pawz Botanical Pure',
    category: 'Consumables / Bulk',
    binLocation: 'BIN-C-04',
    onHand: 0,
    reserve: 0,
    reorderPoint: 5,
    unitCost: 16.00,
    retailPrice: 36.00,
    status: 'OUT_OF_STOCK',
    channels: ['POS', 'Van'],
  },
  {
    id: 'inv-06',
    sku: 'SKU-5541-SLK-03',
    barcode: '810034928281',
    name: 'Stainless Steel Pin Slicker Brush (Large)',
    brand: 'ProGroom Tools Ltd',
    category: 'Tools & Blades',
    binLocation: 'BIN-B-08',
    onHand: 14,
    reserve: 1,
    reorderPoint: 6,
    unitCost: 9.20,
    retailPrice: 22.50,
    status: 'IN_STOCK',
    channels: ['POS', 'Online'],
  },
  {
    id: 'inv-07',
    sku: 'SKU-8829-EAR-01',
    barcode: '810034928304',
    name: 'Gentle Cleansing Ear Relief Drops (8 fl oz)',
    brand: 'VetChoice Therapeutics',
    category: 'Healthcare & First Aid',
    binLocation: 'BIN-A-09',
    onHand: 19,
    reserve: 2,
    reorderPoint: 8,
    unitCost: 5.50,
    retailPrice: 15.00,
    status: 'IN_STOCK',
    channels: ['POS', 'Van'],
  },
  {
    id: 'inv-08',
    sku: 'SKU-6612-BLD-10',
    barcode: '810034928328',
    name: '#10 CeramicEdge Clipper Blade Pro',
    brand: 'Andis Master Craft',
    category: 'Tools & Blades',
    binLocation: 'LOCKER-BLADE-02',
    onHand: 3,
    reserve: 1,
    reorderPoint: 8,
    unitCost: 22.00,
    retailPrice: 42.00,
    status: 'LOW_STOCK',
    channels: ['POS'],
  },
];

interface InventoryViewProps {
  onNavigateSection?: (section: DawgNavSection) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ onNavigateSection }) => {
  const [items, setItems] = useState<InventoryItemData[]>(INITIAL_INVENTORY);
  const [activeTab, setActiveTab] = useState<'ALL' | 'LOW' | 'OUT' | 'BIN_A' | 'BIN_B'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Rapid Restock Intake Panel State
  const [restockSkuInput, setRestockSkuInput] = useState('SKU-9924-BLU-01');
  const [restockQty, setRestockQty] = useState(24);
  const [restockPoRef, setRestockPoRef] = useState('#PO-2025-044 (BarkPro Wholesale)');
  const [restockDest, setRestockDest] = useState('Front Salon Shelf & Bay');
  const [restockSuccessAlert, setRestockSuccessAlert] = useState(false);

  // Quick Add Product Form State
  const [newCat, setNewCat] = useState('Consumables / Topicals');
  const [newName, setNewName] = useState('');
  const [newBarcode, setNewBarcode] = useState('');
  const [newSku, setNewSku] = useState('SKU-PAWZ-099');
  const [newStock, setNewStock] = useState('12');
  const [newBin, setNewBin] = useState('BIN-B-14');
  const [newCost, setNewCost] = useState('12.50');
  const [newRetail, setNewRetail] = useState('28.00');
  const [channelPos, setChannelPos] = useState(true);
  const [channelOnline, setChannelOnline] = useState(true);
  const [channelVan, setChannelVan] = useState(false);
  const [addSuccessAlert, setAddSuccessAlert] = useState(false);
  const [isFullAddModalOpen, setIsFullAddModalOpen] = useState(false);

  const handleSaveFullProduct = (newProd: CreatedProductItem) => {
    setItems((prev) => [newProd, ...prev]);
    setAddSuccessAlert(true);
    setTimeout(() => setAddSuccessAlert(false), 3500);
  };

  // Active Modals
  const [activeModalItem, setActiveModalItem] = useState<InventoryItemData | null>(null);
  const [modalMode, setModalMode] = useState<'restock' | 'adjust' | 'printTag' | null>(null);
  const [modalQty, setModalQty] = useState(10);
  const [modalNotice, setModalNotice] = useState<string | null>(null);

  // Profit / Margin Computations
  const costNum = parseFloat(newCost) || 0;
  const retailNum = parseFloat(newRetail) || 0;
  const unitProfit = retailNum > costNum ? retailNum - costNum : 0;
  const marginPct = retailNum > 0 ? Math.round((unitProfit / retailNum) * 1000) / 10 : 0;
  const markupPct = costNum > 0 ? Math.round(((retailNum - costNum) / costNum) * 1000) / 10 : 0;

  // Filter items
  const filteredItems = items.filter((it) => {
    if (activeTab === 'LOW' && it.status !== 'LOW_STOCK') return false;
    if (activeTab === 'OUT' && it.status !== 'OUT_OF_STOCK') return false;
    if (activeTab === 'BIN_A' && !it.binLocation.startsWith('BIN-A')) return false;
    if (activeTab === 'BIN_B' && !it.binLocation.startsWith('BIN-B')) return false;

    if (selectedCategory !== 'ALL' && !it.category.includes(selectedCategory)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        it.sku.toLowerCase().includes(q) ||
        it.name.toLowerCase().includes(q) ||
        it.brand.toLowerCase().includes(q) ||
        it.binLocation.toLowerCase().includes(q) ||
        it.barcode.includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleConfirmRestockIntake = () => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.sku.toUpperCase() === restockSkuInput.trim().toUpperCase()) {
          const updatedStock = it.onHand + restockQty;
          return {
            ...it,
            onHand: updatedStock,
            status: updatedStock > it.reorderPoint ? 'IN_STOCK' : 'LOW_STOCK',
          };
        }
        return it;
      })
    );
    setRestockSuccessAlert(true);
    setTimeout(() => setRestockSuccessAlert(false), 3500);
  };

  const handleRegisterNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const channels: string[] = [];
    if (channelPos) channels.push('POS');
    if (channelOnline) channels.push('Online');
    if (channelVan) channels.push('Van');

    const created: InventoryItemData = {
      id: `inv-${Date.now()}`,
      sku: newSku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: newBarcode || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      name: newName.trim(),
      brand: 'All About Pawz Salon Line',
      category: newCat,
      binLocation: newBin || 'BIN-GEN',
      onHand: parseInt(newStock) || 12,
      reserve: 0,
      reorderPoint: 6,
      unitCost: costNum,
      retailPrice: retailNum,
      status: (parseInt(newStock) || 12) > 6 ? 'IN_STOCK' : 'LOW_STOCK',
      channels,
    };

    setItems((prev) => [created, ...prev]);
    setAddSuccessAlert(true);
    setNewName('');
    setNewBarcode('');
    setTimeout(() => setAddSuccessAlert(false), 3500);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1650px] mx-auto text-black bg-white min-h-full font-mono">
      {/* Station Header */}
      <div className="border border-black bg-white p-4.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-black pb-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500">
              <span className="bg-black text-white px-1.5 py-0.5 font-bold">NODE: OMS-08</span>
              <span>•</span>
              <span className="text-black font-bold">STATION 08 // RESTOCK &amp; SKU ONBOARDING</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">ZEBRA ZD420 CONNECTED</span>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-black mt-1">
              Products &amp; Inventory Hub
            </h1>
            <p className="text-xs text-gray-600 mt-0.5">
              Live barcode scanning intake, multi-tier reorder thresholds, shelf tag printing, and salon bin ledgers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (onNavigateSection) onNavigateSection('purchase-orders');
              }}
              className="px-3.5 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Auto-Draft Low Stock POs</span>
            </button>
            <button
              onClick={() => {
                const first = items[0];
                if (first) {
                  setActiveModalItem(first);
                  setModalMode('printTag');
                }
              }}
              className="px-3.5 py-1.5 border border-black bg-white hover:bg-black hover:text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Batch Shelf Tags</span>
            </button>
            <button
              onClick={() => setIsFullAddModalOpen(true)}
              className="px-4 py-1.5 border border-black bg-black text-white hover:bg-neutral-800 font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Add Product &amp; Media</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-3 text-xs">
          <div className="border border-black p-2 bg-gray-50">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Total Registered SKUs</p>
            <p className="text-lg font-black text-black">{items.length} Active</p>
          </div>
          <div className="border border-black p-2 bg-gray-50">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Low Stock Alerts</p>
            <p className="text-lg font-black text-amber-700">
              {items.filter((i) => i.status === 'LOW_STOCK').length} SKUs
            </p>
          </div>
          <div className="border border-black p-2 bg-gray-50">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Out of Stock (Zero)</p>
            <p className="text-lg font-black text-red-700">
              {items.filter((i) => i.status === 'OUT_OF_STOCK').length} SKUs
            </p>
          </div>
          <div className="border border-black p-2 bg-gray-50">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Retail Inventory Value</p>
            <p className="text-lg font-black text-black">
              ${items.reduce((acc, i) => acc + i.onHand * i.retailPrice, 0).toLocaleString()}
            </p>
          </div>
          <div className="border border-black p-2 bg-gray-50">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Gross Cost Basis</p>
            <p className="text-lg font-black text-black">
              ${items.reduce((acc, i) => acc + i.onHand * i.unitCost, 0).toLocaleString()}
            </p>
          </div>
          <div className="border border-black p-2 bg-gray-50">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Blended Margin</p>
            <p className="text-lg font-black text-emerald-700">54.2% Gross</p>
          </div>
        </div>
      </div>

      {/* Top 2-Column Workstation: Rapid Restock Intake + Quick Add SKU Onboarding */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Rapid Restock Intake Workstation */}
        <div className="lg:col-span-6 border border-black bg-white p-4.5 space-y-4">
          <div className="flex items-center justify-between border-b border-black pb-2.5">
            <div className="flex items-center gap-2">
              <Barcode className="w-4 h-4 text-black" />
              <h2 className="font-black text-sm uppercase tracking-tight">Rapid Restock Intake</h2>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-black text-white">WAND SCANNER READY</span>
          </div>

          {/* Search SKU or Barcode */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase text-gray-700">
              Scan Barcode Wand or Enter SKU
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={restockSkuInput}
                  onChange={(e) => setRestockSkuInput(e.target.value)}
                  placeholder="e.g. SKU-9924-BLU-01 or 810034928172"
                  className="w-full pl-8 pr-3 py-1.5 border border-black bg-white font-mono text-xs font-bold text-black focus:outline-none"
                />
              </div>
              <button
                onClick={() => {
                  setRestockSkuInput('SKU-9924-BLU-01');
                }}
                className="px-3 py-1.5 border border-black bg-gray-100 hover:bg-black hover:text-white text-xs font-bold uppercase cursor-pointer"
              >
                Scan Wand
              </button>
            </div>
          </div>

          {/* Item Snapshot Card */}
          <div className="border border-black p-3 bg-gray-50 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase bg-black text-white px-1.5 py-0.2">
                  LOT# 2025-05 · EXP 08/27
                </span>
                <h3 className="font-black text-xs text-black uppercase mt-1">
                  Blueberry Facial Foaming Wash (16 fl oz)
                </h3>
                <p className="text-[11px] text-gray-600 font-mono">
                  Brand: Burt&apos;s Bees Pro · Cat: Consumables · Bin: BIN-A-04
                </p>
              </div>
              <span className="px-2 py-0.5 border border-black bg-amber-500 text-white font-bold text-[10px] uppercase">
                LOW STOCK ALERT
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-black/20 text-center font-mono">
              <div className="bg-white border border-black p-1">
                <p className="text-[9px] text-gray-500">ON HAND</p>
                <p className="font-black text-xs text-amber-700">4 UNITS</p>
              </div>
              <div className="bg-white border border-black p-1">
                <p className="text-[9px] text-gray-500">ACTIVE RES.</p>
                <p className="font-black text-xs text-black">1 UNIT</p>
              </div>
              <div className="bg-white border border-black p-1">
                <p className="text-[9px] text-gray-500">AVAILABLE</p>
                <p className="font-black text-xs text-black">3 UNITS</p>
              </div>
              <div className="bg-white border border-black p-1">
                <p className="text-[9px] text-gray-500">REORDER PT</p>
                <p className="font-black text-xs text-black">12 UNITS</p>
              </div>
            </div>
          </div>

          {/* Adjustment Inputs */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                Units Received (+ Stepper)
              </label>
              <div className="flex border border-black">
                <button
                  type="button"
                  onClick={() => setRestockQty((q) => Math.max(1, q - 6))}
                  className="px-3 py-1 bg-white hover:bg-gray-100 font-black border-r border-black cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  value={restockQty}
                  onChange={(e) => setRestockQty(parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 font-black bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setRestockQty((q) => q + 6)}
                  className="px-3 py-1 bg-white hover:bg-gray-100 font-black border-l border-black cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                Destination Bay / Shelf
              </label>
              <select
                value={restockDest}
                onChange={(e) => setRestockDest(e.target.value)}
                className="w-full px-2 py-1.5 border border-black bg-white font-bold cursor-pointer focus:outline-none"
              >
                <option>Front Salon Shelf &amp; Bay</option>
                <option>Warehouse Bulk Bay (Aisle 2)</option>
                <option>Mobile Van Fleet Locker</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                PO Manifest Reference
              </label>
              <input
                type="text"
                value={restockPoRef}
                onChange={(e) => setRestockPoRef(e.target.value)}
                className="w-full px-2 py-1.5 border border-black bg-white font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                Supplier Unit Cost ($)
              </label>
              <input
                type="text"
                defaultValue="8.40"
                className="w-full px-2 py-1.5 border border-black bg-white font-bold focus:outline-none"
              />
            </div>
          </div>

          {restockSuccessAlert && (
            <div className="p-2 border border-black bg-emerald-500 text-white flex items-center justify-between text-xs font-bold">
              <span>Restocked +{restockQty} units successfully into {restockDest}!</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}

          <div className="pt-2 border-t border-black flex items-center justify-between">
            <span className="text-[11px] text-gray-500">Zebra ZD420: Ready (24 Labels)</span>
            <button
              onClick={handleConfirmRestockIntake}
              className="px-4 py-2 bg-black text-white hover:bg-neutral-800 font-bold text-xs uppercase flex items-center gap-2 cursor-pointer border border-black"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Confirm Restock &amp; Print {restockQty} Tags</span>
            </button>
          </div>
        </div>

        {/* Right: Quick Add New Product // SKU Onboarding Form */}
        <div id="quick-add-form" className="lg:col-span-6 border border-black bg-white p-4.5 space-y-4">
          <div className="flex items-center justify-between border-b border-black pb-2.5">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-black" />
              <h2 className="font-black text-sm uppercase tracking-tight">
                Quick Add Product // SKU Onboarding
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 border border-black">
                AUTO-MARGIN MATRIX
              </span>
              <button
                type="button"
                onClick={() => setIsFullAddModalOpen(true)}
                className="text-[10px] font-bold px-2 py-0.5 bg-black text-white hover:bg-neutral-800 border border-black uppercase cursor-pointer"
              >
                [FULL BUILDER &amp; MEDIA]
              </button>
            </div>
          </div>

          <form onSubmit={handleRegisterNewProduct} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Product Category
                </label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="w-full px-2 py-1.5 border border-black bg-white font-bold cursor-pointer focus:outline-none"
                >
                  <option>Consumables / Topicals</option>
                  <option>Consumables / Bulk</option>
                  <option>Tools &amp; Blades</option>
                  <option>Spa &amp; Wellness</option>
                  <option>Retail Dog Treats</option>
                  <option>Healthcare &amp; First Aid</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  SKU Identifier
                </label>
                <input
                  type="text"
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value)}
                  className="w-full px-2 py-1.5 border border-black bg-white font-bold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                Product Title &amp; Spec
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hypoallergenic Oatmeal Conditioner (Gallon)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-black bg-white font-bold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Barcode (UPC/EAN)
                </label>
                <input
                  type="text"
                  placeholder="810034928172"
                  value={newBarcode}
                  onChange={(e) => setNewBarcode(e.target.value)}
                  className="w-full px-2 py-1.5 border border-black bg-white font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Bin / Shelf
                </label>
                <input
                  type="text"
                  value={newBin}
                  onChange={(e) => setNewBin(e.target.value)}
                  className="w-full px-2 py-1.5 border border-black bg-white font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Initial Stock
                </label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full px-2 py-1.5 border border-black bg-white font-bold focus:outline-none"
                />
              </div>
            </div>

            {/* Pricing & Margin Matrix */}
            <div className="grid grid-cols-2 gap-3 p-2.5 bg-gray-50 border border-black">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Supplier Cost ($)
                </label>
                <input
                  type="text"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  className="w-full px-2 py-1.5 border border-black bg-white font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Retail Price ($)
                </label>
                <input
                  type="text"
                  value={newRetail}
                  onChange={(e) => setNewRetail(e.target.value)}
                  className="w-full px-2 py-1.5 border border-black bg-white font-bold focus:outline-none"
                />
              </div>

              <div className="col-span-2 pt-2 border-t border-black/20 flex items-center justify-between text-[11px] font-mono">
                <div>
                  <span className="text-gray-500">Gross Margin:</span>{' '}
                  <strong className="text-emerald-700">{marginPct}%</strong>
                </div>
                <div>
                  <span className="text-gray-500">Markup:</span>{' '}
                  <strong className="text-black">{markupPct}%</strong>
                </div>
                <div>
                  <span className="text-gray-500">Unit Profit:</span>{' '}
                  <strong className="text-black">+${unitProfit.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Channel Allocation Checkboxes */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-gray-700">
                Channel Allocation &amp; Listing
              </label>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelPos}
                    onChange={(e) => setChannelPos(e.target.checked)}
                    className="accent-black"
                  />
                  <span>Salon In-Store POS</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelOnline}
                    onChange={(e) => setChannelOnline(e.target.checked)}
                    className="accent-black"
                  />
                  <span>Online Storefront</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelVan}
                    onChange={(e) => setChannelVan(e.target.checked)}
                    className="accent-black"
                  />
                  <span>Mobile Van Fleet</span>
                </label>
              </div>
            </div>

            {addSuccessAlert && (
              <div className="p-2 border border-black bg-emerald-500 text-white flex items-center justify-between text-xs font-bold">
                <span>Product registered! SKU shelf tag queued.</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}

            <div className="pt-2 border-t border-black flex items-center justify-end gap-2">
              <button
                type="submit"
                className="w-full py-2 bg-black text-white hover:bg-neutral-800 font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer border border-black"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Register SKU &amp; Print Shelf Tag</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Middle Grid: Physical Location Occupancy Radar & Automated Supplier Reorder Triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Physical Location Occupancy Radar */}
        <div className="lg:col-span-6 border border-black bg-white p-4.5 space-y-3">
          <div className="flex items-center justify-between border-b border-black pb-2">
            <h3 className="font-black text-xs uppercase text-black flex items-center gap-2">
              <Building2 className="w-4 h-4 text-black" />
              <span>Physical Location Occupancy &amp; Capacity Radar</span>
            </h3>
            <span className="text-[10px] text-gray-500">TOTAL BINS: 180</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-black">Front Salon Retail Displays</span>
                <span className="font-mono text-gray-600">39 / 50 SKUs (78%)</span>
              </div>
              <div className="w-full h-2 bg-gray-100 border border-black">
                <div className="h-full bg-black" style={{ width: '78%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-black flex items-center gap-1.5">
                  <span>Backroom Bulk Rack A</span>
                  <span className="text-[9px] px-1 bg-amber-500 text-white font-bold">NEAR CAPACITY</span>
                </span>
                <span className="font-mono text-amber-700 font-bold">110 / 120 Units (92%)</span>
              </div>
              <div className="w-full h-2 bg-gray-100 border border-black">
                <div className="h-full bg-amber-500" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-black">Mobile Grooming Van #1 Bin</span>
                <span className="font-mono text-gray-600">18 / 40 Units (45%)</span>
              </div>
              <div className="w-full h-2 bg-gray-100 border border-black">
                <div className="h-full bg-black" style={{ width: '45%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Automated Supplier Reorder Triggers */}
        <div className="lg:col-span-6 border border-black bg-white p-4.5 space-y-3">
          <div className="flex items-center justify-between border-b border-black pb-2">
            <h3 className="font-black text-xs uppercase text-black flex items-center gap-2">
              <Truck className="w-4 h-4 text-black" />
              <span>Automated Supplier Reorder Triggers</span>
            </h3>
            <span className="text-[10px] text-gray-500 font-mono">CRON: HOURLY</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 border border-black flex items-center justify-between bg-gray-50">
              <div>
                <p className="font-bold text-black">BarkPro Grooming Wholesale</p>
                <p className="text-[10px] text-amber-700 font-mono">
                  5 Items Below Reorder Point (Est. $480.00)
                </p>
              </div>
              <button
                onClick={() => {
                  if (onNavigateSection) onNavigateSection('purchase-orders');
                }}
                className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase hover:bg-neutral-800 cursor-pointer"
              >
                Auto-Draft PO →
              </button>
            </div>

            <div className="p-2.5 border border-black flex items-center justify-between bg-gray-50">
              <div>
                <p className="font-bold text-black">Groomer&apos;s Choice Supply</p>
                <p className="text-[10px] text-red-700 font-mono">
                  3 Items Out of Stock (Est. $310.00)
                </p>
              </div>
              <button
                onClick={() => {
                  if (onNavigateSection) onNavigateSection('purchase-orders');
                }}
                className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase hover:bg-neutral-800 cursor-pointer"
              >
                Auto-Draft PO →
              </button>
            </div>

            <div className="p-2.5 border border-black flex items-center justify-between bg-gray-50">
              <div>
                <p className="font-bold text-black">PetSafe Tech Distribution</p>
                <p className="text-[10px] text-emerald-700 font-mono">
                  All Items Nominal (Next cycle in 5 days)
                </p>
              </div>
              <span className="text-[10px] text-gray-500 font-bold uppercase">Nominal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Inventory Catalog & Shelf Ledger Table */}
      <div className="border border-black bg-white space-y-3">
        {/* Table Header Filter Controls */}
        <div className="p-4 border-b border-black flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'ALL', label: `ALL SKUS (${items.length})` },
              { id: 'LOW', label: `LOW STOCK (${items.filter((i) => i.status === 'LOW_STOCK').length})` },
              { id: 'OUT', label: `OUT OF STOCK (${items.filter((i) => i.status === 'OUT_OF_STOCK').length})` },
              { id: 'BIN_A', label: 'BIN-A AISLE' },
              { id: 'BIN_B', label: 'BIN-B AISLE' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1 text-xs font-bold uppercase border cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                className="pl-8 pr-3 py-1 border border-black bg-white text-xs font-bold focus:outline-none w-48 sm:w-60"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2 py-1 border border-black bg-white text-xs font-bold cursor-pointer focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Consumables">Consumables</option>
              <option value="Tools">Tools &amp; Blades</option>
              <option value="Spa">Spa &amp; Wellness</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>
        </div>

        {/* The Catalog Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-black border-collapse">
            <thead className="bg-gray-50 border-b border-black font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3 border-r border-black">SKU / Barcode</th>
                <th className="py-2.5 px-3 border-r border-black">Product &amp; Brand</th>
                <th className="py-2.5 px-3 border-r border-black">Category</th>
                <th className="py-2.5 px-3 border-r border-black">Location / Bin</th>
                <th className="py-2.5 px-3 border-r border-black text-center">On Hand</th>
                <th className="py-2.5 px-3 border-r border-black text-center">Reorder Pt</th>
                <th className="py-2.5 px-3 border-r border-black text-right">Cost</th>
                <th className="py-2.5 px-3 border-r border-black text-right">Retail</th>
                <th className="py-2.5 px-3 border-r border-black text-center">Margin</th>
                <th className="py-2.5 px-3 border-r border-black text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Rapid Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black font-mono">
              {filteredItems.map((item) => {
                const profit = item.retailPrice - item.unitCost;
                const margin = Math.round((profit / item.retailPrice) * 100);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 border-r border-black">
                      <p className="font-bold text-black">{item.sku}</p>
                      <p className="text-[10px] text-gray-500">{item.barcode}</p>
                    </td>
                    <td className="py-3 px-3 border-r border-black font-sans">
                      <p className="font-bold text-black uppercase text-xs">{item.name}</p>
                      <p className="text-[10px] font-mono text-gray-500">{item.brand}</p>
                    </td>
                    <td className="py-3 px-3 border-r border-black text-[11px] text-gray-700 font-sans">
                      {item.category}
                    </td>
                    <td className="py-3 px-3 border-r border-black font-bold text-black">
                      <span className="px-1.5 py-0.5 border border-black bg-white text-[10px]">
                        {item.binLocation}
                      </span>
                    </td>
                    <td className="py-3 px-3 border-r border-black text-center font-black text-xs">
                      {item.onHand} UNITS
                    </td>
                    <td className="py-3 px-3 border-r border-black text-center text-gray-600">
                      MIN {item.reorderPoint}
                    </td>
                    <td className="py-3 px-3 border-r border-black text-right text-gray-700">
                      ${item.unitCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 border-r border-black text-right font-black text-black">
                      ${item.retailPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 border-r border-black text-center">
                      <span className="px-1 py-0.5 border border-black bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                        {margin}%
                      </span>
                    </td>
                    <td className="py-3 px-3 border-r border-black text-center">
                      {item.status === 'LOW_STOCK' && (
                        <span className="px-1.5 py-0.5 border border-black bg-amber-500 text-white font-bold text-[9px] uppercase">
                          Low Stock
                        </span>
                      )}
                      {item.status === 'OUT_OF_STOCK' && (
                        <span className="px-1.5 py-0.5 border border-black bg-red-600 text-white font-bold text-[9px] uppercase">
                          Out of Stock
                        </span>
                      )}
                      {item.status === 'IN_STOCK' && (
                        <span className="px-1.5 py-0.5 border border-black bg-black text-white font-bold text-[9px] uppercase">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setActiveModalItem(item);
                            setModalMode('restock');
                            setModalQty(12);
                          }}
                          className="px-2 py-1 border border-black bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase cursor-pointer"
                        >
                          + Restock
                        </button>
                        <button
                          onClick={() => {
                            setActiveModalItem(item);
                            setModalMode('adjust');
                            setModalQty(item.onHand);
                          }}
                          className="px-2 py-1 border border-black bg-white hover:bg-gray-100 text-[10px] font-bold uppercase cursor-pointer"
                        >
                          Adjust
                        </button>
                        <button
                          onClick={() => {
                            setActiveModalItem(item);
                            setModalMode('printTag');
                          }}
                          className="p-1 border border-black bg-white hover:bg-black hover:text-white cursor-pointer"
                          title="Print Zebra Shelf Tag"
                        >
                          <Printer className="w-3.5 h-3.5" />
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

      {/* MODAL 1: Restock Item Modal */}
      {modalMode === 'restock' && activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase tracking-tight">
                  Restock: {activeModalItem.sku}
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="p-1 hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="font-black uppercase text-black">{activeModalItem.name}</p>
                <p className="text-[11px] text-gray-500 font-mono">
                  Bin: {activeModalItem.binLocation} · Current On Hand: {activeModalItem.onHand} Units
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Add Quantity Units
                </label>
                <div className="flex border border-black">
                  <button
                    type="button"
                    onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 bg-gray-100 font-bold border-r border-black cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={modalQty}
                    onChange={(e) => setModalQty(parseInt(e.target.value) || 1)}
                    className="w-full text-center font-bold bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setModalQty((q) => q + 1)}
                    className="px-3 py-1.5 bg-gray-100 font-bold border-l border-black cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 border border-black p-2.5 text-[11px]">
                <p className="font-bold text-black uppercase">Resulting Stock Summary:</p>
                <p className="text-gray-700 mt-0.5">
                  New Available: <strong>{activeModalItem.onHand + modalQty} Units</strong> (Above threshold {activeModalItem.reorderPoint})
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black">
                <button
                  onClick={() => setModalMode(null)}
                  className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setItems((prev) =>
                      prev.map((it) => {
                        if (it.id === activeModalItem.id) {
                          const updated = it.onHand + modalQty;
                          return {
                            ...it,
                            onHand: updated,
                            status: updated > it.reorderPoint ? 'IN_STOCK' : 'LOW_STOCK',
                          };
                        }
                        return it;
                      })
                    );
                    setModalMode(null);
                  }}
                  className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer border border-black"
                >
                  + Add {modalQty} Units &amp; Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Adjust Stock Count (Physical Audit) */}
      {modalMode === 'adjust' && activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase tracking-tight">
                  Cycle Count Audit: {activeModalItem.sku}
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="p-1 hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-gray-600">
                Override on-hand count following physical bin inspection at <strong>{activeModalItem.binLocation}</strong>.
              </p>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Actual Physical Units Counted
                </label>
                <input
                  type="number"
                  value={modalQty}
                  onChange={(e) => setModalQty(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-black font-bold text-center text-sm focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black">
                <button
                  onClick={() => setModalMode(null)}
                  className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setItems((prev) =>
                      prev.map((it) => {
                        if (it.id === activeModalItem.id) {
                          return {
                            ...it,
                            onHand: modalQty,
                            status: modalQty === 0 ? 'OUT_OF_STOCK' : modalQty <= it.reorderPoint ? 'LOW_STOCK' : 'IN_STOCK',
                          };
                        }
                        return it;
                      })
                    );
                    setModalMode(null);
                  }}
                  className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer border border-black"
                >
                  Commit Audit Count
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Print Thermal Shelf Tag Modal */}
      {modalMode === 'printTag' && activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-lg w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase tracking-tight">
                  Zebra ZD420 Shelf Tag Generator
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="p-1 hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* High-Fidelity 2x1 Thermal Shelf Tag Preview */}
            <div className="p-4 border border-black bg-gray-50 flex items-center justify-center">
              <div className="w-72 bg-white border-2 border-black p-3 space-y-2 text-black shadow-md font-mono">
                <div className="flex items-center justify-between border-b border-black pb-1">
                  <span className="text-[9px] font-black uppercase">ALL ABOUT PAWZ RETAIL</span>
                  <span className="text-[9px] font-bold border border-black px-1">
                    {activeModalItem.binLocation}
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-xs leading-tight line-clamp-2 uppercase">
                    {activeModalItem.name}
                  </h4>
                  <p className="text-[10px] text-gray-600 mt-0.5">{activeModalItem.brand}</p>
                </div>
                <div className="flex items-end justify-between pt-1">
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase">PRICE (USD)</p>
                    <p className="text-xl font-black text-black leading-none">
                      ${activeModalItem.retailPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold">{activeModalItem.sku}</p>
                    <svg className="w-24 h-6 mt-0.5" viewBox="0 0 100 24">
                      <rect x="2" y="0" width="3" height="24" fill="#000" />
                      <rect x="7" y="0" width="2" height="24" fill="#000" />
                      <rect x="11" y="0" width="4" height="24" fill="#000" />
                      <rect x="18" y="0" width="2" height="24" fill="#000" />
                      <rect x="22" y="0" width="5" height="24" fill="#000" />
                      <rect x="30" y="0" width="2" height="24" fill="#000" />
                      <rect x="34" y="0" width="4" height="24" fill="#000" />
                      <rect x="42" y="0" width="3" height="24" fill="#000" />
                      <rect x="48" y="0" width="2" height="24" fill="#000" />
                      <rect x="54" y="0" width="5" height="24" fill="#000" />
                      <rect x="62" y="0" width="3" height="24" fill="#000" />
                      <rect x="68" y="0" width="4" height="24" fill="#000" />
                      <rect x="75" y="0" width="2" height="24" fill="#000" />
                      <rect x="80" y="0" width="3" height="24" fill="#000" />
                      <rect x="86" y="0" width="5" height="24" fill="#000" />
                      <rect x="94" y="0" width="3" height="24" fill="#000" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Tag Count (Copies)
                </label>
                <input
                  type="number"
                  defaultValue="2"
                  className="w-full px-2.5 py-1.5 border border-black bg-white font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Media Type
                </label>
                <select className="w-full px-2 py-1.5 border border-black bg-white font-bold focus:outline-none cursor-pointer">
                  <option>2.00&quot; x 1.00&quot; Continuous Thermal</option>
                  <option>2.25&quot; x 1.25&quot; Shelf Tag</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-black">
              <button
                onClick={() => setModalMode(null)}
                className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setModalMode(null);
                }}
                className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer border border-black flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Send to Zebra ZD420</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Product & Media Builder Modal */}
      <AddProductModal
        isOpen={isFullAddModalOpen}
        onClose={() => setIsFullAddModalOpen(false)}
        onSaveProduct={handleSaveFullProduct}
      />
    </div>
  );
};
