'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Truck, 
  Mail, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Send,
  AlertCircle,
  Barcode,
  Package,
  Scale,
  Box,
  MessageSquare,
  History,
  FileText,
  Sliders,
  Check,
  RotateCcw,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Terminal,
  X,
  Sparkles,
  MapPin,
  Smartphone
} from 'lucide-react';
import { DawgNavSection } from '@/lib/types';

interface OrderDetailsViewProps {
  onNavigateSection?: (section: DawgNavSection) => void;
  orderId?: string;
}

export const OrderDetailsView: React.FC<OrderDetailsViewProps> = ({ 
  onNavigateSection,
  orderId = 'ORD-2025-1048'
}) => {
  // Navigation Sub-tab
  const [activeTab, setActiveTab] = useState<'FULFILL' | 'DOCS' | 'SMS' | 'AUDIT'>('FULFILL');

  // Pick & Pack state (Mockup 6)
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [itemsChecked, setItemsChecked] = useState<{ [id: string]: boolean }>({
    'item-1': true,
    'item-2': true,
    'item-3': false,
  });
  const [scaleWeight, setScaleWeight] = useState(1.50);
  const [boxSelection, setBoxSelection] = useState<'BOX-S' | 'BOX-M' | 'PADDED' | 'CUSTOM'>('BOX-S');
  const [tareActive, setTareActive] = useState(false);
  const [packCompleteNotice, setPackCompleteNotice] = useState(false);

  // Print Hub state (Mockup 2)
  const [printDarkness, setPrintDarkness] = useState(11);
  const [printSpeed, setPrintSpeed] = useState('4.0 ips');
  const [labelZoom, setLabelZoom] = useState(100);
  const [printTriggerNotice, setPrintTriggerNotice] = useState<string | null>(null);

  // SMS / Comm state (Mockup 3)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'CUSTOMER',
      text: 'Hi, will this order go out today? Buddy needs his ear wash before Friday!',
      time: '10:22 AM',
    },
    {
      id: 2,
      sender: 'STAFF',
      text: 'Hello Sarah! Yes, your order is currently at Station 04 in our packing queue and scheduled for USPS dispatch today at 4:30 PM.',
      time: '10:25 AM',
    },
  ]);
  const [newMessageText, setNewMessageText] = useState('');
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [custAddress, setCustAddress] = useState({
    street: '1234 Maple Drive',
    apt: 'Suite 102',
    city: 'Frisco',
    state: 'TX',
    zip: '75034-4921',
  });
  const [triggerOrderReady, setTriggerOrderReady] = useState(true);
  const [triggerTracking, setTriggerTracking] = useState(true);
  const [triggerOutForDelivery, setTriggerOutForDelivery] = useState(true);

  // Audit Logs state (Mockup 4)
  const [expandedLog, setExpandedLog] = useState<string | null>('EV-0014');
  const [cliInput, setCliInput] = useState('');
  const [cliOutput, setCliOutput] = useState<string[]>([
    'DAWG-OS OMS CLI [v2.4.1-rc3]',
    'Connected to PostgreSQL tenancy sandbox session #9918',
    'Type "help" for a list of available OMS operations.',
  ]);

  const handleScanItem = (barcode: string) => {
    if (barcode.includes('AAP-SHP') || barcode.includes('810034928172')) {
      setItemsChecked((prev) => ({ ...prev, 'item-1': true }));
    } else if (barcode.includes('AAP-TLS') || barcode.includes('810034928219')) {
      setItemsChecked((prev) => ({ ...prev, 'item-2': true }));
    } else if (barcode.includes('AAP-TRT') || barcode.includes('810034928233')) {
      setItemsChecked((prev) => ({ ...prev, 'item-3': true }));
    } else {
      // Default to checking next unchecked
      setItemsChecked((prev) => {
        const next = { ...prev };
        if (!next['item-3']) next['item-3'] = true;
        else if (!next['item-1']) next['item-1'] = true;
        else if (!next['item-2']) next['item-2'] = true;
        return next;
      });
    }
    setScannedBarcode('');
  };

  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'STAFF',
        text: newMessageText.trim(),
        time: 'Just now',
      },
    ]);
    setNewMessageText('');
  };

  const handleRunCli = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;
    const cmd = cliInput.trim();
    setCliOutput((prev) => [...prev, `$ ${cmd}`]);

    if (cmd === 'help') {
      setCliOutput((prev) => [
        ...prev,
        'Available commands:',
        '  resend_webhook  - Re-dispatch Stripe / Shopify webhook payloads',
        '  verify_hash     - Recalculate RSA-SHA256 signature chain',
        '  export_audit    - Generate JSON dump of all audit events',
        '  clear           - Reset terminal output',
      ]);
    } else if (cmd === 'resend_webhook') {
      setCliOutput((prev) => [
        ...prev,
        'Dispatching POST https://api.allaboutpawz.com/webhooks/orders...',
        'Status: 200 OK (Latency: 48ms) · Payload Signature Verified.',
      ]);
    } else if (cmd === 'verify_hash') {
      setCliOutput((prev) => [
        ...prev,
        'Computed SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        'Ledger state integrity: 100% UNCOMPROMISED (Verified by RLS)',
      ]);
    } else if (cmd === 'clear') {
      setCliOutput(['DAWG-OS OMS CLI [v2.4.1-rc3]']);
    } else {
      setCliOutput((prev) => [...prev, `Unknown command: ${cmd}. Type "help" for instructions.`]);
    }
    setCliInput('');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1650px] mx-auto text-black bg-white min-h-full font-mono">
      {/* Top Header & Context Bar */}
      <div className="border border-black bg-white p-4.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-black pb-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500">
              <button
                onClick={() => onNavigateSection?.('orders')}
                className="hover:underline flex items-center gap-1 text-black font-bold cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>ORDERS QUEUE</span>
              </button>
              <span>{'//'}</span>
              <span className="bg-black text-white px-1.5 py-0.2 font-bold">{orderId}</span>
              <span>{'//'}</span>
              <span className="text-black font-bold">STATION 04 (FULFILLMENT &amp; AUDIT)</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <h1 className="text-2xl font-black uppercase tracking-tight text-black">
                Order #{orderId}
              </h1>
              <span className="px-2 py-0.5 border border-black bg-emerald-600 text-white text-[10px] font-bold uppercase">
                PAID (STRIPE)
              </span>
              <span className="px-2 py-0.5 border border-black bg-black text-white text-[10px] font-bold uppercase">
                USPS PRIORITY MAIL
              </span>
              <span className="px-2 py-0.5 border border-black bg-gray-100 text-black text-[10px] font-bold uppercase">
                BIN ALLOCATED (3/3)
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              PLACED: TODAY, 10:14 AM EDT · CLIENT: SARAH JOHNSON · PET: BUDDY (GOLDEN RETRIEVER)
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('DOCS');
                window.print();
              }}
              className="px-3.5 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip &amp; Label</span>
            </button>
            <button
              onClick={() => onNavigateSection?.('shipping')}
              className="px-3.5 py-1.5 border border-black bg-black text-white hover:bg-neutral-800 font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Label Station →</span>
            </button>
            <button
              onClick={() => onNavigateSection?.('returns')}
              className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Create RMA</span>
            </button>
          </div>
        </div>

        {/* 4 Interactive Station Tabs */}
        <div className="flex flex-wrap gap-2 pt-3">
          {[
            { id: 'FULFILL', label: '01. Pick & Pack Fulfillment', icon: Package },
            { id: 'DOCS', label: '02. Documentation & Print Hub', icon: Printer },
            { id: 'SMS', label: '03. Customer SMS & Tracking', icon: MessageSquare },
            { id: 'AUDIT', label: '04. Timeline & Audit Logs', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase border flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-black border-black hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PICK & PACK FULFILLMENT (MOCKUP 6)                                  */}
      {/* ========================================================================= */}
      {activeTab === 'FULFILL' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 Cols: Line Items Picking Checklist + Barcode Wand Scan */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border border-black bg-white p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-black pb-2.5">
                <div className="flex items-center gap-2">
                  <Barcode className="w-4 h-4 text-black" />
                  <h3 className="font-black text-xs uppercase">
                    Barcode Verification Scan Station
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-black text-white">
                  OPTICAL SCANNER READY
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={scannedBarcode}
                  onChange={(e) => setScannedBarcode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleScanItem(scannedBarcode);
                    }
                  }}
                  placeholder="Scan item UPC / SKU barcode with laser wand..."
                  className="flex-1 px-3 py-1.5 border border-black bg-white font-mono text-xs font-bold focus:outline-none"
                />
                <button
                  onClick={() => handleScanItem('810034928172')}
                  className="px-4 py-1.5 border border-black bg-gray-100 hover:bg-black hover:text-white font-bold text-xs uppercase cursor-pointer"
                >
                  Quick Scan
                </button>
              </div>
            </div>

            {/* Line items table with pick checklist */}
            <div className="border border-black bg-white">
              <div className="p-3.5 border-b border-black flex items-center justify-between bg-gray-50">
                <h2 className="font-black uppercase text-xs text-black">
                  Allocated Line Items (3 SKUs · 4 Total Units)
                </h2>
                <span className="text-[10px] font-mono text-black font-bold">
                  {Object.values(itemsChecked).filter(Boolean).length} of 3 ITEMS VERIFIED
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-white border-b border-black text-[10px] uppercase font-bold text-gray-600">
                      <th className="p-3 border-r border-black w-10 text-center">Scan</th>
                      <th className="p-3 border-r border-black">Product Details &amp; SKU</th>
                      <th className="p-3 border-r border-black text-center">Qty</th>
                      <th className="p-3 border-r border-black text-center">Bin Location</th>
                      <th className="p-3 border-r border-black text-right">Price</th>
                      <th className="p-3 text-center">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black text-xs">
                    <tr className={itemsChecked['item-1'] ? 'bg-emerald-50/50' : 'hover:bg-gray-50'}>
                      <td className="p-3 text-center border-r border-black">
                        <input
                          type="checkbox"
                          checked={itemsChecked['item-1']}
                          onChange={(e) =>
                            setItemsChecked((prev) => ({ ...prev, 'item-1': e.target.checked }))
                          }
                          className="w-4 h-4 accent-black cursor-pointer"
                        />
                      </td>
                      <td className="p-3 border-r border-black">
                        <p className="font-bold text-black uppercase">
                          Organic Blueberry Facial Foam Wash (8 oz)
                        </p>
                        <p className="text-[10px] text-gray-500">
                          SKU: AAP-SHP-001 · UPC: 810034928172
                        </p>
                      </td>
                      <td className="p-3 text-center border-r border-black font-bold">2 Units</td>
                      <td className="p-3 text-center border-r border-black">
                        <span className="px-1.5 py-0.5 border border-black bg-white text-[10px] font-bold">
                          BIN B-04
                        </span>
                      </td>
                      <td className="p-3 text-right border-r border-black font-bold">$48.00</td>
                      <td className="p-3 text-center">
                        {itemsChecked['item-1'] ? (
                          <span className="px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase">
                            ✓ VERIFIED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold uppercase">
                            AWAITING SCAN
                          </span>
                        )}
                      </td>
                    </tr>

                    <tr className={itemsChecked['item-2'] ? 'bg-emerald-50/50' : 'hover:bg-gray-50'}>
                      <td className="p-3 text-center border-r border-black">
                        <input
                          type="checkbox"
                          checked={itemsChecked['item-2']}
                          onChange={(e) =>
                            setItemsChecked((prev) => ({ ...prev, 'item-2': e.target.checked }))
                          }
                          className="w-4 h-4 accent-black cursor-pointer"
                        />
                      </td>
                      <td className="p-3 border-r border-black">
                        <p className="font-bold text-black uppercase">
                          Professional Undercoat De-shedding Rake
                        </p>
                        <p className="text-[10px] text-gray-500">
                          SKU: AAP-TLS-014 · UPC: 810034928219
                        </p>
                      </td>
                      <td className="p-3 text-center border-r border-black font-bold">1 Unit</td>
                      <td className="p-3 text-center border-r border-black">
                        <span className="px-1.5 py-0.5 border border-black bg-white text-[10px] font-bold">
                          BIN T-12
                        </span>
                      </td>
                      <td className="p-3 text-right border-r border-black font-bold">$32.50</td>
                      <td className="p-3 text-center">
                        {itemsChecked['item-2'] ? (
                          <span className="px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase">
                            ✓ VERIFIED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold uppercase">
                            AWAITING SCAN
                          </span>
                        )}
                      </td>
                    </tr>

                    <tr className={itemsChecked['item-3'] ? 'bg-emerald-50/50' : 'hover:bg-gray-50'}>
                      <td className="p-3 text-center border-r border-black">
                        <input
                          type="checkbox"
                          checked={itemsChecked['item-3']}
                          onChange={(e) =>
                            setItemsChecked((prev) => ({ ...prev, 'item-3': e.target.checked }))
                          }
                          className="w-4 h-4 accent-black cursor-pointer"
                        />
                      </td>
                      <td className="p-3 border-r border-black">
                        <p className="font-bold text-black uppercase">
                          Natural Calming Hemp Treats (30 count)
                        </p>
                        <p className="text-[10px] text-gray-500">
                          SKU: AAP-TRT-008 · UPC: 810034928233
                        </p>
                      </td>
                      <td className="p-3 text-center border-r border-black font-bold">1 Unit</td>
                      <td className="p-3 text-center border-r border-black">
                        <span className="px-1.5 py-0.5 border border-black bg-white text-[10px] font-bold">
                          BIN F-02
                        </span>
                      </td>
                      <td className="p-3 text-right border-r border-black font-bold">$18.00</td>
                      <td className="p-3 text-center">
                        {itemsChecked['item-3'] ? (
                          <span className="px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase">
                            ✓ VERIFIED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold uppercase">
                            AWAITING SCAN
                          </span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Packaging & Digital Scale Calibration */}
            <div className="border border-black bg-white p-4 space-y-4">
              <h3 className="font-black uppercase text-xs text-black">
                Packaging Configuration &amp; Scale Calibration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Box Selector */}
                <div className="space-y-2 text-xs">
                  <label className="block text-[10px] font-bold uppercase text-gray-700">
                    Box Preset Dimensions
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'BOX-S', label: 'Small Box', dims: '8 x 6 x 4 in' },
                      { id: 'BOX-M', label: 'Medium Box', dims: '12 x 9 x 6 in' },
                      { id: 'PADDED', label: 'Padded Mailer', dims: '10 x 7 x 1 in' },
                      { id: 'CUSTOM', label: 'Custom Dims', dims: 'Enter dims...' },
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBoxSelection(b.id as any)}
                        className={`p-2 border text-left cursor-pointer transition-colors ${
                          boxSelection === b.id
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-black hover:bg-gray-50'
                        }`}
                      >
                        <p className="font-bold text-xs uppercase">{b.label}</p>
                        <p className="text-[10px] opacity-80">{b.dims}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Digital Scale Readout */}
                <div className="space-y-2 text-xs border border-black p-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-black" />
                      <span>USB Digital Scale</span>
                    </span>
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 font-bold">
                      CALIBRATED
                    </span>
                  </div>

                  <div className="flex items-end justify-between py-1">
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase">MEASURED WEIGHT</p>
                      <p className="text-3xl font-black text-black leading-none">
                        {tareActive ? '0.00' : scaleWeight.toFixed(2)}{' '}
                        <span className="text-sm font-bold">LBS</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setTareActive(!tareActive)}
                      className="px-3 py-1 border border-black bg-white hover:bg-black hover:text-white text-xs font-bold uppercase transition-colors cursor-pointer"
                    >
                      {tareActive ? 'Untare' : 'Zero Tare'}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono">
                    Commercial Rate Bracket: Up to 2.0 lbs (Tier 1 Priority Mail)
                  </p>
                </div>
              </div>
            </div>

            {/* Complete Fulfillment Button */}
            <div className="flex items-center justify-between border border-black p-4 bg-gray-50">
              <div>
                <p className="font-bold text-xs text-black uppercase">Fulfillment Readiness:</p>
                <p className="text-xs text-gray-600">
                  {Object.values(itemsChecked).every(Boolean)
                    ? 'All 3 items verified. Scale stabilized. Ready for label creation.'
                    : 'Notice: Complete barcode scan verification on all items before sealing package.'}
                </p>
              </div>

              <button
                onClick={() => {
                  setPackCompleteNotice(true);
                  setTimeout(() => setPackCompleteNotice(false), 3500);
                }}
                className="px-5 py-2 bg-black text-white hover:bg-neutral-800 font-bold text-xs uppercase flex items-center gap-2 cursor-pointer border border-black"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Packed &amp; Queue Label</span>
              </button>
            </div>

            {packCompleteNotice && (
              <div className="p-3 border border-black bg-emerald-500 text-white font-bold text-xs flex items-center justify-between">
                <span>Order #{orderId} marked as PACKED! Label spooled to Zebra queue.</span>
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Right 4 Cols: Order Summary & Customer Snapshot */}
          <div className="lg:col-span-4 space-y-6">
            {/* Customer Snapshot */}
            <div className="border border-black bg-white p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <h3 className="font-black uppercase text-xs text-black">Customer Profile</h3>
                <span className="px-1.5 py-0.2 border border-black bg-black text-white text-[10px] font-bold">
                  VIP TIER 2
                </span>
              </div>
              <div>
                <p className="text-base font-bold text-black uppercase">Sarah Johnson</p>
                <p className="text-[10px] font-mono text-gray-500">Account: #AAP-CUS-0894</p>
              </div>
              <div className="p-2 border border-black bg-gray-50 text-xs font-mono space-y-1">
                <p className="font-bold text-black">Registered Pets:</p>
                <p>• Buddy (Golden Retriever)</p>
                <p>• Luna (French Bulldog)</p>
              </div>
              <div className="text-xs font-mono space-y-1 text-gray-700">
                <p>Tel: +1 (214) 555-0198</p>
                <p>Email: sarah.j@pawzmail.com</p>
                <p>Delivery: Front Porch / Gate Code #4921</p>
              </div>
            </div>

            {/* Financial Ledger Settlement */}
            <div className="border border-black bg-white p-4 space-y-2 text-xs font-mono">
              <h3 className="font-black uppercase text-xs text-black pb-2 border-b border-black">
                Payment &amp; Ledger
              </h3>
              <div className="flex justify-between">
                <span className="text-gray-600">Line Items:</span>
                <span className="font-bold">$98.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping (USPS):</span>
                <span className="font-bold">$8.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sales Tax (8.25%):</span>
                <span className="font-bold">$8.13</span>
              </div>
              <div className="border-t border-black pt-2 flex justify-between font-black text-sm text-black">
                <span>TOTAL PAID:</span>
                <span>$115.13</span>
              </div>
              <p className="text-[10px] text-gray-500 pt-1">
                Stripe Charge ID: ch_3N82J92K81002 · Authorized 10:15 AM
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DOCUMENTATION & PRINT HUB (MOCKUP 2)                                */}
      {/* ========================================================================= */}
      {activeTab === 'DOCS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 4x6 Thermal Label & 8.5x11 Packing Slip Preview */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border border-black bg-white p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-black" />
                  <h3 className="font-black text-xs uppercase">
                    High-Resolution Print Station Preview
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[10px] text-gray-500">Zoom:</span>
                  <button
                    onClick={() => setLabelZoom((z) => Math.max(75, z - 10))}
                    className="px-2 py-0.5 border border-black font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold">{labelZoom}%</span>
                  <button
                    onClick={() => setLabelZoom((z) => Math.min(150, z + 10))}
                    className="px-2 py-0.5 border border-black font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Thermal Label & Packing Slip Containers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-100 border border-black">
                {/* 1. Thermal 4x6 Label (Vector Code 128) */}
                <div className="bg-white border-2 border-black p-4 space-y-3 font-mono text-black shadow-md">
                  <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                    <div>
                      <p className="text-xl font-black tracking-tight">PRIORITY MAIL 1-DAY</p>
                      <p className="text-[10px]">US POSTAGE PAID · PERMIT NO. 441</p>
                    </div>
                    <div className="w-10 h-10 border-2 border-black flex items-center justify-center font-black text-lg">
                      P
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-[9px] text-gray-500 uppercase">SHIP FROM:</p>
                    <p className="font-bold">ALL ABOUT PAWZ SALON &amp; RETREAT</p>
                    <p>4500 LEGACY DR, SUITE 200</p>
                    <p>FRISCO, TX 75034-0001</p>
                  </div>

                  <div className="border-t border-black pt-2 text-xs space-y-1">
                    <p className="text-[9px] text-gray-500 uppercase">SHIP TO:</p>
                    <p className="font-black uppercase text-sm">SARAH JOHNSON</p>
                    <p>1234 MAPLE DRIVE</p>
                    <p>FRISCO, TX 75034-4921</p>
                  </div>

                  {/* High Resolution Vector Barcode */}
                  <div className="border-t-2 border-black pt-3 text-center space-y-1">
                    <svg className="w-full h-14" viewBox="0 0 200 40">
                      <rect x="5" y="0" width="3" height="40" fill="#000" />
                      <rect x="11" y="0" width="2" height="40" fill="#000" />
                      <rect x="16" y="0" width="5" height="40" fill="#000" />
                      <rect x="24" y="0" width="2" height="40" fill="#000" />
                      <rect x="29" y="0" width="4" height="40" fill="#000" />
                      <rect x="36" y="0" width="3" height="40" fill="#000" />
                      <rect x="42" y="0" width="6" height="40" fill="#000" />
                      <rect x="51" y="0" width="2" height="40" fill="#000" />
                      <rect x="56" y="0" width="4" height="40" fill="#000" />
                      <rect x="63" y="0" width="3" height="40" fill="#000" />
                      <rect x="69" y="0" width="5" height="40" fill="#000" />
                      <rect x="77" y="0" width="2" height="40" fill="#000" />
                      <rect x="82" y="0" width="4" height="40" fill="#000" />
                      <rect x="89" y="0" width="2" height="40" fill="#000" />
                      <rect x="94" y="0" width="6" height="40" fill="#000" />
                      <rect x="103" y="0" width="3" height="40" fill="#000" />
                      <rect x="109" y="0" width="2" height="40" fill="#000" />
                      <rect x="114" y="0" width="5" height="40" fill="#000" />
                      <rect x="122" y="0" width="3" height="40" fill="#000" />
                      <rect x="128" y="0" width="4" height="40" fill="#000" />
                      <rect x="135" y="0" width="2" height="40" fill="#000" />
                      <rect x="140" y="0" width="5" height="40" fill="#000" />
                      <rect x="148" y="0" width="2" height="40" fill="#000" />
                      <rect x="153" y="0" width="6" height="40" fill="#000" />
                      <rect x="162" y="0" width="3" height="40" fill="#000" />
                      <rect x="168" y="0" width="4" height="40" fill="#000" />
                      <rect x="175" y="0" width="2" height="40" fill="#000" />
                      <rect x="180" y="0" width="5" height="40" fill="#000" />
                      <rect x="188" y="0" width="3" height="40" fill="#000" />
                    </svg>
                    <p className="text-[10px] font-black tracking-widest">
                      USPS TRACKING # 9400 1118 9956 2837 0124 92
                    </p>
                  </div>
                </div>

                {/* 2. Packing Slip Manifest (8.5 x 11) */}
                <div className="bg-white border-2 border-black p-4 space-y-3 font-mono text-black shadow-md text-xs">
                  <div className="border-b border-black pb-2 flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-sm uppercase">PACKING SLIP</h4>
                      <p className="text-[10px] text-gray-600">ALL ABOUT PAWZ OMS-06</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[10px]">ORDER #{orderId}</p>
                      <p className="text-[9px] text-gray-500">DATE: TODAY, 10:14 AM</p>
                    </div>
                  </div>

                  <div className="p-2 border border-black bg-gray-50 text-[10px] space-y-0.5">
                    <p className="font-bold">DELIVER TO:</p>
                    <p>Sarah Johnson (Buddy &amp; Luna)</p>
                    <p>1234 Maple Drive, Frisco, TX 75034</p>
                  </div>

                  <div className="space-y-1 text-[10px]">
                    <p className="font-bold border-b border-black pb-0.5">MANIFEST ITEMS:</p>
                    <div className="flex justify-between">
                      <span>2x Blueberry Facial Foam Wash (8 oz)</span>
                      <span className="font-bold">BIN B-04</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1x De-shedding Rake Professional</span>
                      <span className="font-bold">BIN T-12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1x Calming Hemp Treats (30 count)</span>
                      <span className="font-bold">BIN F-02</span>
                    </div>
                  </div>

                  <div className="border-t border-black pt-2 text-[9px] text-gray-500">
                    <p>Packed with care by Station 04 Lead Groomer.</p>
                    <p>Questions? Call (214) 555-0100 or reply to this SMS.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Zebra ZD420 Printer Hardware Configuration */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-black bg-white p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <h3 className="font-black uppercase text-xs text-black">
                  Zebra ZD420 Hardware Setup
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-600 text-white">
                  CONNECTED
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                    Print Darkness Level: {printDarkness} / 15
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={printDarkness}
                    onChange={(e) => setPrintDarkness(parseInt(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                    Print Head Speed
                  </label>
                  <select
                    value={printSpeed}
                    onChange={(e) => setPrintSpeed(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-black bg-white font-bold cursor-pointer focus:outline-none"
                  >
                    <option>2.0 ips (Highest Quality)</option>
                    <option>4.0 ips (Standard Recommended)</option>
                    <option>6.0 ips (High Throughput)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                    Media Handling Mode
                  </label>
                  <select className="w-full px-2.5 py-1.5 border border-black bg-white font-bold cursor-pointer focus:outline-none">
                    <option>Tear-Off (Standard 4x6 Roll)</option>
                    <option>Peel-Off Auto-Dispenser</option>
                  </select>
                </div>

                <div className="border-t border-black pt-3 space-y-2">
                  <button
                    onClick={() => {
                      setPrintTriggerNotice('Thermal Label 4x6 sent to Zebra ZD420 spooler!');
                      setTimeout(() => setPrintTriggerNotice(null), 3000);
                    }}
                    className="w-full py-2 bg-black text-white hover:bg-neutral-800 font-bold text-xs uppercase cursor-pointer border border-black flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Thermal Label (4x6)</span>
                  </button>

                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="w-full py-2 bg-white text-black hover:bg-gray-100 font-bold text-xs uppercase cursor-pointer border border-black flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Print Packing Slip (8.5x11)</span>
                  </button>
                </div>

                {printTriggerNotice && (
                  <div className="p-2 border border-black bg-emerald-500 text-white font-bold text-xs text-center">
                    {printTriggerNotice}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CUSTOMER SMS & TRACKING (MOCKUP 3)                                  */}
      {/* ========================================================================= */}
      {activeTab === 'SMS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Twilio Two-Way SMS Thread */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border border-black bg-white p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-2.5">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-black" />
                  <h3 className="font-black text-xs uppercase">
                    Twilio Two-Way SMS Thread: +1 (214) 555-0198
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-600 text-white">
                  ONLINE · 100% CARRIER DELIVERED
                </span>
              </div>

              {/* Quick Macros */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-gray-500">Quick SMS Macros:</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    {
                      label: 'Order Ready',
                      text: 'Hi Sarah! Your All About Pawz order #ORD-2025-1048 is verified, packed, and ready for departure.',
                    },
                    {
                      label: 'Tracking Link',
                      text: 'Hi Sarah, tracking #9400111899562837012492 is active! Follow USPS delivery progress in real time here: https://tools.usps.com',
                    },
                    {
                      label: 'Address Verify',
                      text: 'Hi Sarah, please verify if Suite 102 requires a buzzer code for carrier gate entry today.',
                    },
                    {
                      label: 'Weather Delay',
                      text: 'Hi Sarah, regional storm advisory in North Texas may shift transit by 24h. We will monitor your shipment closely!',
                    },
                  ].map((macro) => (
                    <button
                      key={macro.label}
                      onClick={() => setNewMessageText(macro.text)}
                      className="px-2.5 py-1 border border-black bg-gray-50 hover:bg-black hover:text-white text-[10px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      {macro.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Chat Feed */}
              <div className="h-64 border border-black p-3 overflow-y-auto space-y-3 bg-gray-50">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'STAFF' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[75%] p-2.5 border border-black text-xs ${
                        msg.sender === 'STAFF'
                          ? 'bg-black text-white'
                          : 'bg-white text-black'
                      }`}
                    >
                      <p className="text-[9px] font-mono opacity-70 mb-0.5">
                        {msg.sender === 'STAFF' ? 'ALL ABOUT PAWZ STAFF' : 'SARAH JOHNSON'} · {msg.time}
                      </p>
                      <p className="font-sans leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input Bar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Type real-time SMS to Sarah Johnson..."
                  className="flex-1 px-3 py-2 border border-black bg-white font-mono text-xs focus:outline-none font-bold"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-black text-white hover:bg-neutral-800 font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer border border-black"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send SMS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: USPS DPV Address Validation & Notification Triggers */}
          <div className="lg:col-span-4 space-y-6">
            {/* USPS DPV Address Verification */}
            <div className="border border-black bg-white p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <h3 className="font-black uppercase text-xs text-black">
                  USPS DPV Address Validation
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-600 text-white">
                  VERIFIED DPV
                </span>
              </div>

              <div className="p-3 border border-black bg-gray-50 text-xs font-mono space-y-1">
                <p className="font-bold text-black uppercase">Sarah Johnson</p>
                <p>{custAddress.street}</p>
                <p>{custAddress.apt}</p>
                <p>
                  {custAddress.city}, {custAddress.state} {custAddress.zip}
                </p>
              </div>

              <button
                onClick={() => setAddressModalOpen(true)}
                className="w-full py-1.5 border border-black bg-white hover:bg-gray-100 font-bold text-xs uppercase cursor-pointer"
              >
                Edit / Correct Address
              </button>
            </div>

            {/* Automated Notification Triggers Matrix */}
            <div className="border border-black bg-white p-4 space-y-3">
              <h3 className="font-black uppercase text-xs text-black pb-2 border-b border-black">
                Automated SMS Trigger Matrix
              </h3>
              <div className="space-y-2 text-xs font-bold">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Order Confirmed &amp; Paid</span>
                  <input
                    type="checkbox"
                    checked={triggerOrderReady}
                    onChange={(e) => setTriggerOrderReady(e.target.checked)}
                    className="accent-black w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Packed &amp; Spooled Tracking #</span>
                  <input
                    type="checkbox"
                    checked={triggerTracking}
                    onChange={(e) => setTriggerTracking(e.target.checked)}
                    className="accent-black w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Carrier Out for Delivery</span>
                  <input
                    type="checkbox"
                    checked={triggerOutForDelivery}
                    onChange={(e) => setTriggerOutForDelivery(e.target.checked)}
                    className="accent-black w-4 h-4"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TIMELINE & AUDIT LOGS (MOCKUP 4)                                   */}
      {/* ========================================================================= */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-6">
          <div className="border border-black bg-white p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-black pb-2.5">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-black" />
                <h3 className="font-black text-xs uppercase">
                  Order Event Ledger &amp; Cryptographic Audit Trail
                </h3>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-black text-white">
                POSTGRESQL AUDIT LOG ENABLED
              </span>
            </div>

            {/* Chronological Event Ledger */}
            <div className="space-y-3">
              {[
                {
                  id: 'EV-0014',
                  title: 'Order Status Shift: AWAITING_PICK -> PACKING_VERIFIED',
                  actor: 'Staff Operator (Lead Groomer #04)',
                  time: '11:28:44 AM EDT',
                  ip: '192.168.1.104 (Station 04 Term)',
                  payload: {
                    event: 'fulfillment.packed',
                    order_id: orderId,
                    verified_items: ['AAP-SHP-001', 'AAP-TLS-014'],
                    scale_weight_lbs: 1.5,
                    box_type: 'BOX-S',
                    sha256_hash: '9a8b1c44810294101e9129841804910293810293',
                  },
                },
                {
                  id: 'EV-0013',
                  title: 'Thermal Shipping Label Spooled to Zebra ZD420',
                  actor: 'Zebra Service Daemon',
                  time: '11:30:12 AM EDT',
                  ip: '127.0.0.1:9100 (Raw Port)',
                  payload: {
                    event: 'printer.spooled',
                    media: '4x6 Thermal Roll',
                    tracking_number: '9400111899562837012492',
                    postage_paid_cents: 850,
                  },
                },
                {
                  id: 'EV-0012',
                  title: 'Stripe Webhook Received & Signature Verified',
                  actor: 'Stripe API Gateway',
                  time: '10:15:02 AM EDT',
                  ip: '54.187.205.235 (Stripe US-West)',
                  payload: {
                    event: 'payment_intent.succeeded',
                    charge_id: 'ch_3N82J92K81002',
                    amount: 11513,
                    currency: 'usd',
                    status: 'paid',
                  },
                },
                {
                  id: 'EV-0011',
                  title: 'Customer Order Placed via Pet Parent Storefront',
                  actor: 'Sarah Johnson (#AAP-CUS-0894)',
                  time: '10:14:18 AM EDT',
                  ip: '72.180.92.14 (Frisco, TX Broadband)',
                  payload: {
                    event: 'order.created',
                    cart_tokens: 3,
                    shipping_method: 'USPS Priority Mail',
                    total: 115.13,
                  },
                },
              ].map((ev) => (
                <div key={ev.id} className="border border-black bg-white">
                  <div
                    onClick={() => setExpandedLog(expandedLog === ev.id ? null : ev.id)}
                    className="p-3 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      {expandedLog === ev.id ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                      <span className="font-bold px-1.5 py-0.2 bg-black text-white text-[10px]">
                        {ev.id}
                      </span>
                      <span className="font-bold text-black">{ev.title}</span>
                    </div>

                    <div className="text-[10px] text-gray-500 font-mono">
                      <span>{ev.time}</span> · <span>{ev.actor}</span>
                    </div>
                  </div>

                  {expandedLog === ev.id && (
                    <div className="p-3 border-t border-black bg-white space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>ORIGIN IP: {ev.ip}</span>
                        <span>IMMUTABLE WRITE: OK</span>
                      </div>
                      <pre className="p-3 bg-gray-900 text-emerald-400 text-[11px] overflow-x-auto border border-black">
                        {JSON.stringify(ev.payload, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive OMS CLI Terminal */}
          <div className="border border-black bg-black text-white p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2 text-xs">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold uppercase tracking-wider text-emerald-400">
                  OMS Interactive Console
                </span>
              </div>
              <span className="text-[10px] text-gray-400">PORT 3000 · POSTGRESQL MULTITENANT</span>
            </div>

            <div className="h-36 overflow-y-auto space-y-1 text-xs text-gray-300 font-mono">
              {cliOutput.map((line, idx) => (
                <p
                  key={idx}
                  className={line.startsWith('$') ? 'text-emerald-400 font-bold' : ''}
                >
                  {line}
                </p>
              ))}
            </div>

            <form onSubmit={handleRunCli} className="flex gap-2 pt-2 border-t border-neutral-800">
              <span className="text-emerald-400 font-bold text-xs py-1">$</span>
              <input
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                placeholder='Type command (e.g. "help", "resend_webhook", "verify_hash")...'
                className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Execute
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Address Correction Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase">USPS Delivery Address Correction</h3>
              </div>
              <button
                onClick={() => setAddressModalOpen(false)}
                className="p-1 hover:bg-black hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={custAddress.street}
                  onChange={(e) => setCustAddress({ ...custAddress, street: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-black bg-white font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                  Apartment / Suite
                </label>
                <input
                  type="text"
                  value={custAddress.apt}
                  onChange={(e) => setCustAddress({ ...custAddress, apt: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-black bg-white font-bold focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={custAddress.city}
                    onChange={(e) => setCustAddress({ ...custAddress, city: e.target.value })}
                    className="w-full px-2 py-1.5 border border-black bg-white font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={custAddress.state}
                    onChange={(e) => setCustAddress({ ...custAddress, state: e.target.value })}
                    className="w-full px-2 py-1.5 border border-black bg-white font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">
                    ZIP
                  </label>
                  <input
                    type="text"
                    value={custAddress.zip}
                    onChange={(e) => setCustAddress({ ...custAddress, zip: e.target.value })}
                    className="w-full px-2 py-1.5 border border-black bg-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black">
                <button
                  onClick={() => setAddressModalOpen(false)}
                  className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer border border-black"
                >
                  Verify &amp; Save DPV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
