'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Check, 
  Barcode, 
  Printer, 
  Sparkles, 
  AlertTriangle,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  HelpCircle,
  Tag,
  Package,
  Layers,
  Store,
  Globe,
  Truck
} from 'lucide-react';
import { uploadProductImage } from '@/lib/supabase';

export interface CreatedProductItem {
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
  imageUrl?: string;
  weightLbs?: number;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (product: CreatedProductItem) => void;
}

const PRESET_STUDIO_IMAGES = [
  {
    name: 'Oatmeal & Aloe Shampoo',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    caption: 'HERO_01 - Amber Glass 16oz',
  },
  {
    name: 'Blueberry Facial Foaming Wash',
    url: 'https://images.unsplash.com/photo-1608248597359-00994f71eb32?w=500&auto=format&fit=crop&q=80',
    caption: 'DETAIL_02 - Foaming Wash Dispenser',
  },
  {
    name: 'Paw & Nose Organic Balm',
    url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80',
    caption: 'DETAIL_03 - Balm Stick',
  },
  {
    name: 'Stainless Undercoat Rake',
    url: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=500&auto=format&fit=crop&q=80',
    caption: 'DETAIL_04 - Grooming Tool Spec',
  },
];

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSaveProduct,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState('Ultra-Soothing Organic Oatmeal & Aloe Canine Shampoo (16 fl oz)');
  const [category, setCategory] = useState('Grooming & Coat Care');
  const [subCategory, setSubCategory] = useState('Shampoos & Specialty Washes');
  const [brand, setBrand] = useState('All About Pawz Proprietary Formulations LLC');
  const [description, setDescription] = useState(
    'Veterinary-grade colloidal oatmeal wash fortified with cold-pressed organic aloe vera barbadensis leaf extract and panthenol pro-vitamin B5. Engineered for canine coats susceptible to seasonal pruritus, allergic dermatitis, and environmental dry-skin irritation. Gentle hypoallergenic foaming matrix; free of parabens, sulfates, and synthetic dyes.'
  );

  // Imagery & Storage Bucket State
  const [heroImage, setHeroImage] = useState<string>(PRESET_STUDIO_IMAGES[0].url);
  const [altImage, setAltImage] = useState<string>(PRESET_STUDIO_IMAGES[1].url);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Channels
  const [posChannel, setPosChannel] = useState(true);
  const [shelfTag, setShelfTag] = useState('AISLE 02 // SHELF B // BAY DISPLAY');
  const [ecommChannel, setEcommChannel] = useState(true);
  const [onlineVisibility, setOnlineVisibility] = useState('PUBLIC SEARCHABLE & FEATURED ON HOMEPAGE CAROUSEL');

  // Stock Matrix
  const [preventOversell, setPreventOversell] = useState(true);
  const [stockFriscoShop, setStockFriscoShop] = useState(48);
  const [stockFriscoEcomm, setStockFriscoEcomm] = useState(72);
  const [reorderFrisco, setReorderFrisco] = useState(15);

  const [stockPlanoShop, setStockPlanoShop] = useState(24);
  const [stockPlanoEcomm, setStockPlanoEcomm] = useState(0);
  const [reorderPlano, setReorderPlano] = useState(8);

  const [stockVanCaddy, setStockVanCaddy] = useState(12);
  const [reorderVan, setReorderVan] = useState(4);

  // Financials
  const [msrp, setMsrp] = useState('24.00');
  const [vipPrice, setVipPrice] = useState('20.40');
  const [cogs, setCogs] = useState('7.50');
  const [taxClass, setTaxClass] = useState('TAXABLE // TEXAS STANDARD TANGIBLE PERSONAL PROPERTY (8.25%)');

  // Identifiers
  const [sku, setSku] = useState('SKU: AAP-SHAMP-OAT-16OZ');
  const [barcode, setBarcode] = useState('810092345019');
  const [supplierCode, setSupplierCode] = useState('SUPP-COASTAL-449');
  const [primaryVendor, setPrimaryVendor] = useState('Coastal Pet Labs & Formulations LLC');
  const [batchTracking, setBatchTracking] = useState(true);
  const [lotId, setLotId] = useState('LOT-2025-05A');
  const [expiryDate, setExpiryDate] = useState('2027-05-31');

  // Shipping Specs
  const [weightLbs, setWeightLbs] = useState('1.25');
  const [dimL, setDimL] = useState('3.50');
  const [dimW, setDimW] = useState('3.50');
  const [dimH, setDimH] = useState('8.50');
  const [eligiblePickup, setEligiblePickup] = useState(true);
  const [eligibleGround, setEligibleGround] = useState(true);
  const [eligibleVanAddon, setEligibleVanAddon] = useState(true);

  if (!isOpen) return null;

  // Computations
  const msrpNum = parseFloat(msrp) || 0;
  const cogsNum = parseFloat(cogs) || 0;
  const unitProfit = Math.max(0, msrpNum - cogsNum);
  const marginPct = msrpNum > 0 ? Math.round((unitProfit / msrpNum) * 1000) / 10 : 0;
  const totalUnits = stockFriscoShop + stockFriscoEcomm + stockPlanoShop + stockPlanoEcomm + stockVanCaddy;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadProductImage(file);
      setHeroImage(uploadedUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateSku = () => {
    const catCode = category.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setSku(`SKU: AAP-${catCode}-${randomNum}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const channels: string[] = [];
    if (posChannel) channels.push('POS');
    if (ecommChannel) channels.push('Online');
    if (eligibleVanAddon) channels.push('Van');

    const created: CreatedProductItem = {
      id: `prod-${Date.now()}`,
      sku: sku.replace('SKU: ', '').trim() || `AAP-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: barcode || '810092345019',
      name: title.trim(),
      brand: brand || 'All About Pawz Proprietary',
      category: category,
      binLocation: shelfTag.split('//')[0]?.trim() || 'AISLE 02',
      onHand: totalUnits,
      reserve: 0,
      reorderPoint: reorderFrisco + reorderPlano + reorderVan,
      unitCost: cogsNum,
      retailPrice: msrpNum,
      status: totalUnits > 10 ? 'IN_STOCK' : totalUnits > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK',
      channels,
      imageUrl: heroImage,
      weightLbs: parseFloat(weightLbs) || 1.0,
    };

    onSaveProduct(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-mono text-black">
      <div className="bg-white border-2 border-black max-w-6xl w-full my-auto shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* TOP COMMAND STRIP */}
        <div className="border-b border-black bg-neutral-100 px-4 py-2 flex items-center justify-between text-xs font-bold select-none">
          <div className="flex items-center gap-2">
            <span className="bg-black text-white px-1.5 py-0.5 text-[10px] uppercase">OMS // SKU-GEN</span>
            <span className="text-neutral-500">{'//'}</span>
            <span className="text-black uppercase">PRODUCTS &amp; INVENTORY // ADD NEW PRODUCT</span>
            <span className="hidden md:inline text-neutral-400 font-normal">| STORAGE BUCKET WIRED</span>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 hover:bg-black hover:text-white border border-transparent hover:border-black transition-none cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* HEADER PANEL */}
        <div className="p-4 border-b border-black bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight text-black">
              CREATE PRODUCT &amp; MULTI-CHANNEL INVENTORY ALLOCATION
            </h1>
            <p className="text-xs text-neutral-600 mt-0.5">
              Define global SKU metadata, retail barcode bindings, and allocate physical in-salon shop stock vs online e-commerce fulfillment buffers.
            </p>
          </div>
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={onClose}
              className="border border-black px-3 py-1.5 text-xs font-bold uppercase hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-black text-white px-4 py-1.5 text-xs font-bold uppercase hover:bg-neutral-800 flex items-center gap-1.5 border border-black shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Publish &amp; Commit Stock</span>
            </button>
          </div>
        </div>

        {/* TELEMETRY BADGES STRIP */}
        <div className="border-b border-black bg-neutral-50 grid grid-cols-2 md:grid-cols-4 divide-x divide-black text-xs">
          <div className="p-2.5">
            <span className="text-[9px] text-neutral-500 uppercase block font-bold">CHANNEL SYNC PROTOCOL</span>
            <span className="font-bold text-black text-[11px]">2 ACTIVE CHANNELS (POS + E-COMM)</span>
          </div>
          <div className="p-2.5">
            <span className="text-[9px] text-neutral-500 uppercase block font-bold">TOTAL COMMITTED UNITS</span>
            <span className="font-bold text-black text-[11px]">{totalUnits} UNITS READY</span>
          </div>
          <div className="p-2.5">
            <span className="text-[9px] text-neutral-500 uppercase block font-bold">BARCODE PROTOCOL</span>
            <span className="font-bold text-black text-[11px]">UPC-A / EAN-13 VALIDATED</span>
          </div>
          <div className="p-2.5">
            <span className="text-[9px] text-neutral-500 uppercase block font-bold">TAX CLASSIFICATION</span>
            <span className="font-bold text-black text-[11px]">TEXAS STD 8.25% TANGIBLE</span>
          </div>
        </div>

        {/* SCROLLABLE MAIN 2-COLUMN GRID FORM */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 bg-white text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT COLUMN (7 / 12) */}
            <div className="lg:col-span-7 space-y-6">

              {/* SEC:A GENERAL PRODUCT INFORMATION & ASSETS */}
              <div className="border border-black bg-white">
                <div className="bg-neutral-100 px-3 py-1.5 border-b border-black flex items-center justify-between font-bold">
                  <span className="uppercase text-[11px]">SEC:A // GENERAL PRODUCT INFORMATION &amp; ASSETS</span>
                  <span className="text-[9px] bg-white border border-black px-1.5 py-0.2">REQUIRED FIELDS [05/05]</span>
                </div>
                <div className="p-4 space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">
                      PRODUCT TITLE / PRIMARY CATALOG NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-black px-2.5 py-1.5 font-bold bg-white text-black focus:bg-neutral-50 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">
                        PRIMARY CATEGORY *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-black p-1.5 font-bold bg-white focus:outline-none cursor-pointer"
                      >
                        <option>Grooming &amp; Coat Care</option>
                        <option>Retail Wellness &amp; Topicals</option>
                        <option>Nutritional Supplements</option>
                        <option>Apparel &amp; Walking Gear</option>
                        <option>Sanitation &amp; Disinfectants</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">
                        SUB-CATEGORY / LINE *
                      </label>
                      <select
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        className="w-full border border-black p-1.5 font-bold bg-white focus:outline-none cursor-pointer"
                      >
                        <option>Shampoos &amp; Specialty Washes</option>
                        <option>Conditioners &amp; De-shed Rinses</option>
                        <option>Leave-in Sprays &amp; Detanglers</option>
                        <option>Paw &amp; Nose Balms</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">
                      BRAND / PROPRIETARY FORMULATOR
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full border border-black px-2.5 py-1.5 bg-white text-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-bold uppercase text-neutral-700">
                        DETAILED CATALOG DESCRIPTION (MARKDOWN)
                      </label>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => setDescription(prev => `**${prev}**`)} className="border border-black px-1.5 py-0.2 text-[9px] hover:bg-neutral-200 font-bold">B</button>
                        <button type="button" onClick={() => setDescription(prev => `*${prev}*`)} className="border border-black px-1.5 py-0.2 text-[9px] hover:bg-neutral-200 italic">I</button>
                        <button type="button" onClick={() => setDescription(prev => `${prev}\n- Feature item`)} className="border border-black px-1.5 py-0.2 text-[9px] hover:bg-neutral-200">[LIST]</button>
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border border-black p-2 bg-neutral-50 text-[11px] leading-relaxed focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Product Imagery & Supabase Storage Dropzone */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[10px] font-bold uppercase text-neutral-700">
                        PRODUCT IMAGERY &amp; MEDIA DROPZONE
                      </label>
                      <span className="text-[9px] text-emerald-700 font-bold">
                        BUCKET: product-media [STORAGE READY]
                      </span>
                    </div>

                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      {/* Upload Box */}
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="sm:col-span-2 border border-dashed-2 border-black bg-neutral-50 p-3 flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer hover:bg-neutral-100 transition-none"
                      >
                        <Upload className="w-5 h-5 text-black" />
                        <span className="font-bold text-[11px] uppercase">
                          {isUploading ? 'Uploading to Bucket...' : '[CLICK OR DROP IMAGE HERE]'}
                        </span>
                        <span className="text-[9px] text-neutral-500">
                          SUPPORTS WEBP, JPG, PNG (MAX 10MB)
                        </span>
                        <button 
                          type="button" 
                          className="border border-black bg-black text-white px-2 py-0.5 text-[9px] uppercase font-bold mt-1"
                        >
                          Browse Files
                        </button>
                      </div>

                      {/* Hero Image Preview */}
                      <div className="border border-black bg-white p-1.5 flex flex-col justify-between">
                        <div className="relative w-full h-24 bg-neutral-100 border border-black flex items-center justify-center overflow-hidden">
                          {heroImage ? (
                            <img src={heroImage} alt="Product Hero Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-neutral-400" />
                          )}
                          <span className="absolute top-1 left-1 bg-black text-white text-[8px] font-bold px-1 uppercase">
                            HERO_01
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1 text-[9px]">
                          <span className="font-bold text-emerald-700">[PRIMARY HERO]</span>
                          <button 
                            type="button"
                            onClick={() => setHeroImage(PRESET_STUDIO_IMAGES[0].url)} 
                            className="text-neutral-500 hover:text-black uppercase underline"
                          >
                            Reset
                          </button>
                        </div>
                      </div>

                      {/* Detail Image Preview */}
                      <div className="border border-black bg-white p-1.5 flex flex-col justify-between">
                        <div className="relative w-full h-24 bg-neutral-100 border border-black flex items-center justify-center overflow-hidden">
                          {altImage ? (
                            <img src={altImage} alt="Detail View" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-neutral-400" />
                          )}
                          <span className="absolute top-1 left-1 bg-neutral-200 text-black border border-black text-[8px] font-bold px-1 uppercase">
                            DETAIL_02
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1 text-[9px]">
                          <span className="text-neutral-500">DETAIL ANGLE</span>
                          <button 
                            type="button"
                            onClick={() => setAltImage(PRESET_STUDIO_IMAGES[1].url)} 
                            className="text-neutral-500 hover:text-black uppercase underline"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quick Studio Presets */}
                    <div className="mt-2.5 pt-2 border-t border-neutral-200">
                      <span className="text-[9px] text-neutral-500 uppercase block font-bold mb-1">
                        OR SELECT CURATED STUDIO ASSET:
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {PRESET_STUDIO_IMAGES.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setHeroImage(preset.url)}
                            className={`px-2 py-0.5 border text-[9px] font-bold uppercase transition-none cursor-pointer ${
                              heroImage === preset.url ? 'bg-black text-white border-black' : 'bg-white border-neutral-300 hover:border-black text-neutral-700'
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEC:B SALES CHANNELS & DESTINATION GATING */}
              <div className="border border-black bg-white">
                <div className="bg-neutral-100 px-3 py-1.5 border-b border-black flex items-center justify-between font-bold">
                  <span className="uppercase text-[11px]">SEC:B // SALES CHANNELS &amp; DESTINATION GATING</span>
                  <span className="text-[9px] text-neutral-600 uppercase">[MODE: DUAL_ROUTE]</span>
                </div>
                <div className="p-4 space-y-3">
                  {/* In-Salon Retail Shop */}
                  <div className="border border-black p-3 bg-neutral-50 space-y-2">
                    <div className="flex items-center justify-between border-b border-black pb-1.5">
                      <label className="flex items-center gap-2 cursor-pointer font-bold uppercase text-[11px]">
                        <input
                          type="checkbox"
                          checked={posChannel}
                          onChange={(e) => setPosChannel(e.target.checked)}
                          className="accent-black w-4 h-4 rounded-none cursor-pointer"
                        />
                        <span>01. IN-SALON RETAIL SHOP (POS COUNTER)</span>
                      </label>
                      <span className="bg-black text-white px-1.5 py-0.2 text-[9px] font-bold uppercase">
                        ACTIVE AT FRONT DESK
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-neutral-500 uppercase text-[9px] block">CHANNEL BEHAVIOR</span>
                        <p className="text-neutral-700 leading-tight">
                          Enables instant barcode scan at register terminals. Stylists can add bottle to customer tickets during pet pickup.
                        </p>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-neutral-600 mb-0.5">
                          RETAIL SHELF LOCATION TAG
                        </label>
                        <input
                          type="text"
                          value={shelfTag}
                          onChange={(e) => setShelfTag(e.target.value)}
                          className="w-full border border-black p-1 bg-white font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Online E-Commerce Storefront */}
                  <div className="border border-black p-3 bg-neutral-50 space-y-2">
                    <div className="flex items-center justify-between border-b border-black pb-1.5">
                      <label className="flex items-center gap-2 cursor-pointer font-bold uppercase text-[11px]">
                        <input
                          type="checkbox"
                          checked={ecommChannel}
                          onChange={(e) => setEcommChannel(e.target.checked)}
                          className="accent-black w-4 h-4 rounded-none cursor-pointer"
                        />
                        <span>02. ONLINE E-COMMERCE STOREFRONT (PORTAL &amp; WEB)</span>
                      </label>
                      <span className="border border-black bg-white px-1.5 py-0.2 text-[9px] font-bold uppercase">
                        SHOPPING CART SYNC
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-neutral-500 uppercase text-[9px] block">CHANNEL BEHAVIOR</span>
                        <p className="text-neutral-700 leading-tight">
                          Syncs to client iOS/Android portal and public salon web store. Supports salon pickup or ground carrier shipping.
                        </p>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-neutral-600 mb-0.5">
                          ONLINE VISIBILITY STATUS
                        </label>
                        <select
                          value={onlineVisibility}
                          onChange={(e) => setOnlineVisibility(e.target.value)}
                          className="w-full border border-black p-1 bg-white font-bold cursor-pointer"
                        >
                          <option>PUBLIC SEARCHABLE &amp; FEATURED ON HOMEPAGE CAROUSEL</option>
                          <option>PUBLIC SEARCHABLE (STANDARD LISTING)</option>
                          <option>CLIENT PORTAL EXCLUSIVE (VIP MEMBERS ONLY)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEC:C MULTI-HUB STOCK SPLIT MATRIX */}
              <div className="border border-black bg-white">
                <div className="bg-neutral-100 px-3 py-1.5 border-b border-black flex items-center justify-between font-bold">
                  <span className="uppercase text-[11px]">SEC:C // MULTI-HUB STOCK SPLIT MATRIX (SHOP VS E-COMMERCE)</span>
                  <span className="text-[9px] bg-black text-white px-1.5 py-0.2">COMMITTED: {totalUnits} UNITS</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-black pb-2 text-[10px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold uppercase">RATIO PRESETS:</span>
                      <button 
                        type="button" 
                        onClick={() => { setStockFriscoShop(60); setStockFriscoEcomm(60); }} 
                        className="border border-black px-1.5 py-0.5 hover:bg-neutral-200"
                      >
                        [50/50 BALANCED]
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { setStockFriscoShop(84); setStockFriscoEcomm(36); }} 
                        className="border border-black px-1.5 py-0.5 bg-neutral-200 hover:bg-black hover:text-white font-bold"
                      >
                        [70% SHOP / 30% ONLINE]
                      </button>
                    </div>
                    <label className="flex items-center gap-1.5 font-bold uppercase cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preventOversell}
                        onChange={(e) => setPreventOversell(e.target.checked)}
                        className="accent-black"
                      />
                      <span>PREVENT OVERSELLING</span>
                    </label>
                  </div>

                  <div className="overflow-x-auto border border-black">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-neutral-100 border-b border-black text-[9px] uppercase font-bold">
                        <tr>
                          <th className="p-2 border-r border-black">LOCATION / HUB</th>
                          <th className="p-2 border-r border-black">IN-SALON SHOP</th>
                          <th className="p-2 border-r border-black">ONLINE BUFFER</th>
                          <th className="p-2 border-r border-black text-center">TOTAL ON-HAND</th>
                          <th className="p-2 text-center">REORDER ALERT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black">
                        <tr>
                          <td className="p-2 border-r border-black font-bold">
                            FRISCO HQ (MAIN SALON)
                          </td>
                          <td className="p-1.5 border-r border-black">
                            <input
                              type="number"
                              value={stockFriscoShop}
                              onChange={(e) => setStockFriscoShop(parseInt(e.target.value) || 0)}
                              className="w-16 border border-black p-1 text-center font-bold"
                            />
                          </td>
                          <td className="p-1.5 border-r border-black">
                            <input
                              type="number"
                              value={stockFriscoEcomm}
                              onChange={(e) => setStockFriscoEcomm(parseInt(e.target.value) || 0)}
                              className="w-16 border border-black p-1 text-center font-bold"
                            />
                          </td>
                          <td className="p-2 border-r border-black text-center font-bold">
                            {stockFriscoShop + stockFriscoEcomm} UNITS
                          </td>
                          <td className="p-1.5 text-center">
                            <input
                              type="number"
                              value={reorderFrisco}
                              onChange={(e) => setReorderFrisco(parseInt(e.target.value) || 0)}
                              className="w-14 border border-black p-1 text-center"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 border-r border-black font-bold">
                            PLANO WEST BRANCH
                          </td>
                          <td className="p-1.5 border-r border-black">
                            <input
                              type="number"
                              value={stockPlanoShop}
                              onChange={(e) => setStockPlanoShop(parseInt(e.target.value) || 0)}
                              className="w-16 border border-black p-1 text-center font-bold"
                            />
                          </td>
                          <td className="p-1.5 border-r border-black">
                            <input
                              type="number"
                              value={stockPlanoEcomm}
                              onChange={(e) => setStockPlanoEcomm(parseInt(e.target.value) || 0)}
                              className="w-16 border border-black p-1 text-center font-bold"
                            />
                          </td>
                          <td className="p-2 border-r border-black text-center font-bold">
                            {stockPlanoShop + stockPlanoEcomm} UNITS
                          </td>
                          <td className="p-1.5 text-center">
                            <input
                              type="number"
                              value={reorderPlano}
                              onChange={(e) => setReorderPlano(parseInt(e.target.value) || 0)}
                              className="w-14 border border-black p-1 text-center"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 border-r border-black font-bold">
                            MOBILE VAN FLEET (3 VANS)
                          </td>
                          <td className="p-1.5 border-r border-black">
                            <input
                              type="number"
                              value={stockVanCaddy}
                              onChange={(e) => setStockVanCaddy(parseInt(e.target.value) || 0)}
                              className="w-16 border border-black p-1 text-center font-bold"
                            />
                          </td>
                          <td className="p-2 border-r border-black text-neutral-400 text-center">
                            [VAN LOCK]
                          </td>
                          <td className="p-2 border-r border-black text-center font-bold">
                            {stockVanCaddy} UNITS
                          </td>
                          <td className="p-1.5 text-center">
                            <input
                              type="number"
                              value={reorderVan}
                              onChange={(e) => setReorderVan(parseInt(e.target.value) || 0)}
                              className="w-14 border border-black p-1 text-center"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (5 / 12) */}
            <div className="lg:col-span-5 space-y-6">

              {/* SEC:D PRICING, MARGINS & FINANCIALS */}
              <div className="border border-black bg-white">
                <div className="bg-neutral-100 px-3 py-1.5 border-b border-black flex items-center justify-between font-bold">
                  <span className="uppercase text-[11px]">SEC:D // PRICING, MARGINS &amp; FINANCIALS</span>
                  <span className="bg-black text-white px-1.5 py-0.2 text-[9px]">MARGIN: {marginPct}%</span>
                </div>
                <div className="p-4 space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">
                        RETAIL PRICE (MSRP) *
                      </label>
                      <div className="flex border border-black">
                        <span className="p-1.5 bg-neutral-100 border-r border-black font-bold">$</span>
                        <input
                          type="text"
                          required
                          value={msrp}
                          onChange={(e) => setMsrp(e.target.value)}
                          className="w-full p-1.5 font-bold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">
                        VIP CLUB / MEMBER PRICE
                      </label>
                      <div className="flex border border-black">
                        <span className="p-1.5 bg-neutral-100 border-r border-black font-bold">$</span>
                        <input
                          type="text"
                          value={vipPrice}
                          onChange={(e) => setVipPrice(e.target.value)}
                          className="w-full p-1.5 font-bold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">
                        UNIT COST (COGS)
                      </label>
                      <div className="flex border border-black">
                        <span className="p-1.5 bg-neutral-100 border-r border-black font-bold">$</span>
                        <input
                          type="text"
                          value={cogs}
                          onChange={(e) => setCogs(e.target.value)}
                          className="w-full p-1.5 font-bold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-end">
                      <span className="text-[10px] font-bold uppercase text-neutral-700 mb-1">
                        UNIT PROFIT
                      </span>
                      <div className="border border-black p-1.5 bg-neutral-50 flex items-center justify-between">
                        <span className="text-[9px] text-neutral-500">PROFIT / UNIT:</span>
                        <span className="font-bold text-black text-sm">+${unitProfit.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">
                      TAX CLASSIFICATION
                    </label>
                    <select
                      value={taxClass}
                      onChange={(e) => setTaxClass(e.target.value)}
                      className="w-full border border-black p-1.5 bg-white font-bold cursor-pointer"
                    >
                      <option>TAXABLE // TEXAS STANDARD TANGIBLE PERSONAL PROPERTY (8.25%)</option>
                      <option>NON-TAXABLE // PRESCRIPTION VETERINARY FORMULA (0.00%)</option>
                      <option>REDUCED TAX // HYGIENE SERVICE EXEMPTION (4.00%)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SEC:E IDENTIFIERS & 1D BARCODE BINDING */}
              <div className="border border-black bg-white">
                <div className="bg-neutral-100 px-3 py-1.5 border-b border-black flex items-center justify-between font-bold">
                  <span className="uppercase text-[11px]">SEC:E // IDENTIFIERS &amp; 1D BARCODE BINDING</span>
                  <span className="text-[9px] text-neutral-600 uppercase">[POS SCAN ENABLED]</span>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-bold uppercase text-neutral-700">
                        PRIMARY SKU *
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateSku}
                        className="border border-black px-1.5 py-0.2 text-[9px] uppercase font-bold hover:bg-black hover:text-white"
                      >
                        [AUTO-GENERATE SKU]
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full border border-black p-1.5 font-bold bg-white text-black"
                    />
                  </div>

                  {/* UPC Barcode & 1D Graphic Render */}
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">
                        UPC-A / EAN-13 BARCODE
                      </label>
                      <input
                        type="text"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        className="w-full border border-black p-1.5 font-bold bg-white"
                      />
                    </div>
                    {/* Simulated 1D Barcode Graphic */}
                    <div className="border border-black p-1.5 bg-white flex flex-col items-center justify-center">
                      <div className="flex items-center justify-center h-8 w-full gap-[2px] px-2 bg-white">
                        <span className="w-[2px] h-full bg-black"></span>
                        <span className="w-[1px] h-full bg-black"></span>
                        <span className="w-[3px] h-full bg-black"></span>
                        <span className="w-[1px] h-full bg-black"></span>
                        <span className="w-[4px] h-full bg-black"></span>
                        <span className="w-[2px] h-full bg-black"></span>
                        <span className="w-[1px] h-full bg-black"></span>
                        <span className="w-[3px] h-full bg-black"></span>
                        <span className="w-[2px] h-full bg-black"></span>
                        <span className="w-[4px] h-full bg-black"></span>
                      </div>
                      <span className="text-[9px] tracking-[0.2em] font-bold mt-0.5">{barcode || '810092345019'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">
                        SUPPLIER CODE
                      </label>
                      <input
                        type="text"
                        value={supplierCode}
                        onChange={(e) => setSupplierCode(e.target.value)}
                        className="w-full border border-black p-1.5 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">
                        PRIMARY VENDOR
                      </label>
                      <input
                        type="text"
                        value={primaryVendor}
                        onChange={(e) => setPrimaryVendor(e.target.value)}
                        className="w-full border border-black p-1.5 bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Batch / Expiration */}
                  <div className="border border-black p-2.5 bg-neutral-50 space-y-2">
                    <div className="flex items-center justify-between border-b border-black pb-1">
                      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase cursor-pointer">
                        <input
                          type="checkbox"
                          checked={batchTracking}
                          onChange={(e) => setBatchTracking(e.target.checked)}
                          className="accent-black"
                        />
                        <span>BATCH &amp; EXPIRATION TRACKING</span>
                      </label>
                      <span className="bg-black text-white px-1 py-0.2 text-[8px] uppercase font-bold">LOT CONTROL</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-neutral-500 uppercase block text-[9px]">LOT IDENTIFIER</span>
                        <input
                          type="text"
                          value={lotId}
                          onChange={(e) => setLotId(e.target.value)}
                          className="w-full border border-black p-1 bg-white"
                        />
                      </div>
                      <div>
                        <span className="text-neutral-500 uppercase block text-[9px]">EXPIRATION DATE</span>
                        <input
                          type="date"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="w-full border border-black p-1 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEC:F SHIPPING, WEIGHT & LOGISTICS SPECS */}
              <div className="border border-black bg-white">
                <div className="bg-neutral-100 px-3 py-1.5 border-b border-black flex items-center justify-between font-bold">
                  <span className="uppercase text-[11px]">SEC:F // SHIPPING, WEIGHT &amp; LOGISTICS SPECS</span>
                  <span className="text-[9px] text-neutral-600 uppercase">[DISPATCH: READY]</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">
                        NET UNIT WEIGHT (LBS) *
                      </label>
                      <input
                        type="text"
                        value={weightLbs}
                        onChange={(e) => setWeightLbs(e.target.value)}
                        className="w-full border border-black p-1.5 font-bold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">
                        DIMENSIONS (L x W x H INCHES)
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        <input type="text" value={dimL} onChange={(e) => setDimL(e.target.value)} className="border border-black p-1 text-center font-bold" />
                        <input type="text" value={dimW} onChange={(e) => setDimW(e.target.value)} className="border border-black p-1 text-center font-bold" />
                        <input type="text" value={dimH} onChange={(e) => setDimH(e.target.value)} className="border border-black p-1 text-center font-bold" />
                      </div>
                    </div>
                  </div>

                  <div className="border border-black p-2.5 bg-neutral-50 space-y-1 text-[10px]">
                    <span className="font-bold uppercase block text-neutral-700 mb-1">DISPATCH CAPABILITIES</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={eligiblePickup} onChange={(e) => setEligiblePickup(e.target.checked)} className="accent-black" />
                      <span>Same-Day In-Salon Customer Pickup</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={eligibleGround} onChange={(e) => setEligibleGround(e.target.checked)} className="accent-black" />
                      <span>Nationwide Ground Shipping (FedEx / UPS / USPS)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={eligibleVanAddon} onChange={(e) => setEligibleVanAddon(e.target.checked)} className="accent-black" />
                      <span>Mobile Van Direct-at-Door Delivery Add-on</span>
                    </label>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </form>

        {/* BOTTOM ACTION DOCK */}
        <div className="border-t-2 border-black bg-neutral-50 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-600 inline-block animate-pulse"></span>
            <span className="font-bold uppercase text-[11px]">READY FOR CATALOGUE PUBLISH</span>
            <span className="text-neutral-400">{'//'}</span>
            <span className="text-neutral-500">TOTAL STOCK TO INITIALIZE: {totalUnits} UNITS</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="border border-black bg-white px-3 py-1.5 font-bold uppercase hover:bg-neutral-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => alert(`Printing Zebra ZD420 test label for SKU: ${sku} [UPC: ${barcode}]`)}
              className="border border-black bg-white px-3 py-1.5 font-bold uppercase hover:bg-neutral-200 cursor-pointer flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Barcode Test</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-black text-white px-5 py-1.5 font-bold uppercase hover:bg-neutral-800 cursor-pointer flex items-center gap-1.5 border border-black shadow-md"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Publish Item &amp; Commit Stock</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
