'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  Printer, 
  Scale, 
  Box, 
  FileText, 
  CheckCircle2, 
  DollarSign, 
  Sparkles,
  Barcode
} from 'lucide-react';
import { DawgNavSection } from '@/lib/types';

interface ShippingStationViewProps {
  onNavigateSection?: (section: DawgNavSection) => void;
}

export const ShippingStationView: React.FC<ShippingStationViewProps> = ({ onNavigateSection }) => {
  const [selectedCarrier, setSelectedCarrier] = useState('usps-ground');
  const [weight, setWeight] = useState(1.50);
  const [boxPreset, setBoxPreset] = useState<'small' | 'med' | 'padded' | 'custom'>('small');
  const [sigRequired, setSigRequired] = useState(false);
  const [printedNotice, setPrintedNotice] = useState(false);

  const rates = [
    {
      id: 'usps-ground',
      carrier: 'USPS Ground Advantage™',
      badge: 'RECOMMENDED',
      delivery: 'Est. Delivery: Wednesday, May 14 (2–3 days)',
      price: 8.50,
      retail: 10.20,
      tracking: '9400 1118 9956 2837 0124 92',
    },
    {
      id: 'ups-ground',
      carrier: 'UPS Ground®',
      badge: 'INSURED',
      delivery: 'Est. Delivery: Wednesday, May 14 (End of Day)',
      price: 10.45,
      retail: 13.00,
      tracking: '1Z 999 999 03 1234 5678',
    },
    {
      id: 'usps-priority',
      carrier: 'USPS Priority Mail®',
      badge: 'FASTEST FLAT',
      delivery: 'Est. Delivery: Tuesday, May 13 (1–2 days)',
      price: 12.20,
      retail: 15.50,
      tracking: '9205 5000 0000 0000 0000 00',
    },
    {
      id: 'ups-2day',
      carrier: 'UPS 2nd Day Air®',
      badge: 'EXPEDITED',
      delivery: 'Guaranteed: Wednesday, May 14 by 12:00 PM',
      price: 18.90,
      retail: 24.00,
      tracking: '1Z 999 999 02 8847 1122',
    },
  ];

  const currentRate = rates.find(r => r.id === selectedCarrier) || rates[0];
  const totalPrice = (currentRate.price + (sigRequired ? 3.50 : 0)).toFixed(2);

  const handleBuyAndPrint = () => {
    setPrintedNotice(true);
    setTimeout(() => setPrintedNotice(false), 3500);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-black bg-white min-h-full">
      {/* Top Station Header */}
      <div className="border border-black bg-white p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black pb-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-500">
              <span className="bg-black text-white px-1.5 py-0.5 font-bold">PACK &amp; SHIP STATION</span>
              <span>•</span>
              <span className="text-black font-bold">ROLLO-USB4 &amp; SCALE CONNECTED</span>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-black mt-1">
              Shipping &amp; Label Printing Station
            </h1>
            <p className="text-xs text-gray-600 mt-0.5">
              Configure package dimensions, compare live commercial rates, and print 4x6 thermal labels.
            </p>
          </div>

          <div className="flex items-center border border-black divide-x divide-black text-xs font-mono">
            <div className="p-2.5 bg-white text-center">
              <p className="text-[10px] text-gray-500 uppercase">Queue</p>
              <p className="font-bold text-black">12 Ready</p>
            </div>
            <div className="p-2.5 bg-white text-center">
              <p className="text-[10px] text-gray-500 uppercase">Thermal</p>
              <p className="font-bold text-black">Rollo 203 DPI</p>
            </div>
            <div className="p-2.5 bg-white text-center">
              <p className="text-[10px] text-gray-500 uppercase">Scale</p>
              <p className="font-bold text-black">Online (COM3)</p>
            </div>
          </div>
        </div>

        {/* Order Selector */}
        <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-bold text-black">DISPATCH:</span>
            <select className="h-8 px-2 border border-black bg-white font-bold uppercase focus:outline-none w-full sm:w-96 cursor-pointer">
              <option>#ORD-2025-1048 — Sarah Johnson (Frisco, TX) • 3 items • 1.50 lbs</option>
              <option>#ORD-2025-1044 — Jessica Ramirez (Plano, TX) • 4 items • 3.80 lbs</option>
              <option>#ORD-2025-1040 — Kevin Vance (Dallas, TX) • 2 items • 9.40 lbs</option>
            </select>
          </div>

          <button 
            onClick={() => onNavigateSection?.('orders')}
            className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
          >
            Back to Orders
          </button>
        </div>
      </div>

      {/* Main 2-Column Pack Bench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scale & Carrier Engine (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Destination Summary */}
          <div className="border border-black bg-white p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-black pb-2 font-mono">
              <span className="font-bold uppercase text-[10px] text-gray-500">Destination: USPS CASS Certified</span>
              <span className="font-bold text-black flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                DPV MATCH 100%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="font-black text-sm uppercase text-black">Sarah Johnson</p>
                <p className="font-mono text-gray-700">1234 Maple Drive<br />Frisco, TX 75034-4921</p>
              </div>
              <div className="border-l border-black pl-3 font-mono text-[11px] text-gray-600 space-y-1">
                <p className="font-bold text-black uppercase text-[10px]">Package Items:</p>
                <p>• 2x Blueberry Facial Wash (16 oz)</p>
                <p>• 1x De-shedding Rake (5 oz)</p>
                <p>• 1x Hemp Treats (3 oz)</p>
              </div>
            </div>
          </div>

          {/* Scale & Dimensions */}
          <div className="border border-black bg-white p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-black pb-2 font-mono text-xs">
              <span className="font-bold uppercase text-[10px] text-gray-500">Package Weight &amp; Scale</span>
              <span className="font-bold text-black">SCALE: LIVE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-black p-3 bg-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-gray-500 uppercase font-bold">DIGITAL SCALE</p>
                  <p className="text-3xl font-black font-mono text-black">{weight.toFixed(2)} <span className="text-sm font-normal">LBS</span></p>
                </div>
                <button 
                  onClick={() => setWeight(0.00)}
                  className="px-2 py-1 border border-black bg-white text-[10px] font-mono font-bold uppercase hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  Tare
                </button>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Presets:</p>
                <div className="grid grid-cols-3 gap-1">
                  <button 
                    onClick={() => setWeight(0.75)} 
                    className="p-1 border border-black bg-white hover:bg-gray-100 text-[10px] font-bold"
                  >
                    0.75#
                  </button>
                  <button 
                    onClick={() => setWeight(1.50)} 
                    className="p-1 border border-black bg-black text-white text-[10px] font-bold"
                  >
                    1.50#
                  </button>
                  <button 
                    onClick={() => setWeight(3.80)} 
                    className="p-1 border border-black bg-white hover:bg-gray-100 text-[10px] font-bold"
                  >
                    3.80#
                  </button>
                </div>
              </div>
            </div>

            {/* Box Presets */}
            <div className="space-y-1.5 font-mono text-xs">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Preset Box Size:</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'small', label: 'Small Box', dims: '8 x 6 x 4 in' },
                  { id: 'med', label: 'Med Box', dims: '12 x 9 x 6 in' },
                  { id: 'padded', label: 'Padded Mailer', dims: '10 x 7 x 1 in' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBoxPreset(b.id as any)}
                    className={`p-2 border border-black text-left cursor-pointer transition-colors ${
                      boxPreset === b.id ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-bold uppercase text-[11px]">{b.label}</p>
                    <p className="text-[10px]">{b.dims}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Commercial Rates */}
          <div className="border border-black bg-white p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-black pb-2 font-mono text-xs">
              <span className="font-bold uppercase text-[10px] text-gray-500">Live Carrier Rates</span>
              <span className="font-bold text-black">COMMERCIAL PLUS</span>
            </div>

            <div className="space-y-2">
              {rates.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedCarrier(r.id)}
                  className={`border p-3 flex items-center justify-between cursor-pointer transition-all ${
                    selectedCarrier === r.id
                      ? 'border-2 border-black bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'border-black bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs uppercase text-black">{r.carrier}</span>
                      <span className="px-1.5 py-0.2 border border-black text-[9px] font-mono font-bold bg-white text-black">
                        {r.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 font-mono">{r.delivery}</p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-base font-black text-black">${r.price.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400 line-through">${r.retail.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Endorsement options */}
            <div className="pt-2 border-t border-black flex items-center justify-between text-xs font-mono">
              <label className="flex items-center gap-2 cursor-pointer font-bold">
                <input 
                  type="checkbox"
                  checked={sigRequired}
                  onChange={(e) => setSigRequired(e.target.checked)}
                  className="rounded-none border-black accent-black"
                />
                <span>Adult Signature Required (+$3.50)</span>
              </label>
              <span className="text-gray-500">Includes $100 Carrier Ins.</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleBuyAndPrint}
            className="w-full h-12 bg-black hover:bg-neutral-800 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-black cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Buy &amp; Print Label (${totalPrice})</span>
          </button>
        </div>

        {/* Right Column: 4x6 Thermal Label Visual Raster (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="border border-black bg-white p-3 flex items-center justify-between font-mono text-xs">
            <span className="font-bold uppercase text-black">Live Raster Preview // 4&quot; × 6&quot; Thermal</span>
            <span className="px-2 py-0.5 border border-black bg-gray-100 text-[10px]">203 DPI · 1:1 SCALE</span>
          </div>

          {/* 4x6 Thermal Label Container */}
          <div className="border-2 border-black bg-white p-5 max-w-md mx-auto shadow-md font-mono text-black space-y-3">
            {/* Header / Postage stamp */}
            <div className="border-b-4 border-black pb-2 flex items-start justify-between">
              <div>
                <p className="text-3xl font-black leading-none">P</p>
                <p className="text-[9px] uppercase font-bold leading-tight mt-1">
                  U.S. POSTAGE PAID<br />
                  FRISCO TX<br />
                  PERMIT NO. 448
                </p>
              </div>
              <div className="text-right">
                <span className="border-2 border-black px-2 py-0.5 font-black text-xs uppercase inline-block">
                  {currentRate.carrier}
                </span>
                <p className="text-[10px] font-bold mt-1">COMMERCIAL PLUS</p>
                <p className="text-[10px] font-bold">ZONE 2 • {weight.toFixed(2)} LBS</p>
              </div>
            </div>

            {/* Return Address & 2D Matrix */}
            <div className="border-b-2 border-black pb-2 text-[10px] uppercase space-y-0.5">
              <p className="font-bold">SHIP FROM:</p>
              <p className="font-black">ALL ABOUT PAWZ - MAIN SALON</p>
              <p>7820 MAIN STREET, SUITE 104</p>
              <p>FRISCO TX 75034-4001</p>
            </div>

            {/* Ship To Recipient */}
            <div className="border-b-4 border-black pb-3 pt-1 space-y-1">
              <p className="text-[10px] font-bold uppercase text-gray-600">SHIP TO:</p>
              <p className="text-base font-black uppercase leading-none">SARAH JOHNSON</p>
              <p className="text-sm font-bold uppercase leading-tight">1234 MAPLE DRIVE</p>
              <p className="text-base font-black uppercase tracking-wide">FRISCO TX 75034-4921</p>
            </div>

            {/* Barcode representation */}
            <div className="py-2 border-b-2 border-black text-center space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest">USPS TRACKING # eVS</p>
              
              {/* Simulated high contrast barcode strip */}
              <div className="h-14 bg-black flex items-center justify-between px-1 py-0.5">
                {Array.from({ length: 48 }).map((_, i) => (
                  <span 
                    key={i} 
                    className={`h-full inline-block ${i % 3 === 0 ? 'bg-white w-1.5' : i % 2 === 0 ? 'bg-black w-1' : 'bg-white w-0.5'}`} 
                  />
                ))}
              </div>

              <p className="text-xs font-black tracking-widest">{currentRate.tracking}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[9px] pt-1 uppercase font-bold">
              <span className="border border-black px-1 py-0.5">★ FRAGILE // PET CARE LIQUIDS ★</span>
              <span>PKG 1 OF 1</span>
            </div>
          </div>

          {/* Quick Hardware Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={handleBuyAndPrint}
              className="p-2 border border-black bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase text-center cursor-pointer"
            >
              Print 4x6
            </button>
            <button 
              onClick={() => {
                window.print();
                setPrintedNotice(true);
                setTimeout(() => setPrintedNotice(false), 3000);
              }}
              className="p-2 border border-black bg-white hover:bg-gray-100 text-xs font-bold uppercase text-center cursor-pointer"
            >
              Download PDF
            </button>
            <button 
              onClick={() => {
                setPrintedNotice(true);
                setTimeout(() => setPrintedNotice(false), 3000);
              }}
              className="p-2 border border-black bg-white hover:bg-gray-100 text-xs font-bold uppercase text-center cursor-pointer"
            >
              SMS Tracking
            </button>
          </div>

          {printedNotice && (
            <div className="p-3 border-2 border-black bg-emerald-600 text-white text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Label #{currentRate.tracking.slice(0, 10)}... spooled to Rollo Direct Thermal! SMS dispatched to Sarah Johnson.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
