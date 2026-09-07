'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  Trash2, 
  Store, 
  Truck, 
  CheckCircle2, 
  Globe, 
  Calendar,
  X,
  CreditCard,
  Tag,
  Users,
  Sliders,
  DollarSign,
  Activity,
  BarChart3,
  Search,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Percent,
  Lock,
  Smartphone,
  Save,
  Check,
  AlertTriangle,
  HelpCircle,
  FileText,
  Layers,
  ArrowRight,
  Printer,
  Download,
  Terminal,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import { LocationItem, DawgNavSection } from '@/lib/types';
import { BookingOperationsTab } from './settings/BookingOperationsTab';
import { UsersAccessTab } from './settings/UsersAccessTab';
import { PaymentsTab } from './settings/PaymentsTab';
import { OrganizationTab } from './settings/OrganizationTab';
import { AnalyticsReportingTab } from './settings/AnalyticsReportingTab';
import { SystemHealthTab } from './settings/SystemHealthTab';

export interface SettingsViewProps {
  locations: LocationItem[];
  selectedLocation: string;
  onSelectLocation: (locName: string) => void;
  onAddLocation: (newLoc: Partial<LocationItem>) => void;
  onDeleteLocation?: (id: string) => void;
  onNavigateSection?: (section: DawgNavSection) => void;
  onOpenQuickAction?: (action: 'appointment' | 'customer' | 'invoice' | 'message') => void;
  initialTab?: string;
}

export type AdminTabId = 
  | 'services'
  | 'booking-rules'
  | 'users-staff'
  | 'revenue-stripe'
  | 'cms-wizard'
  | 'analytics-reporting'
  | 'system-health'
  | 'locations-org'; // Placed at the bottom as explicitly requested!

interface TabMeta {
  id: AdminTabId;
  tabNum: string;
  label: string;
  subtitle: string;
  badge?: string;
}

const ADMIN_TABS: TabMeta[] = [
  { id: 'services', tabNum: '01', label: 'Services & Pricing Matrix', subtitle: 'Tiers, add-ons, breed weight surcharges & VIP packages' },
  { id: 'booking-rules', tabNum: '02', label: 'Booking Rules & Policies', subtitle: 'Deposits, cancellations, no-show fees & station capacity' },
  { id: 'users-staff', tabNum: '03', label: 'Users, Staff & Roles', subtitle: 'Staff directory, register access PINs & permissions', badge: '5 Active' },
  { id: 'revenue-stripe', tabNum: '04', label: 'Revenue & Stripe Gateway', subtitle: 'Merchant accounts, daily payouts & WisePOS hardware' },
  { id: 'analytics-reporting', tabNum: '05', label: 'Analytics & Reporting', subtitle: 'Booking conversion funnels, tips & branch rollups' },
  { id: 'system-health', tabNum: '06', label: 'System Health & Supabase', subtitle: 'Database status, SMS gateway, thermal printer & backups', badge: 'Healthy' },
];

const ADVANCED_ADMIN_TABS: TabMeta[] = [
  { id: 'locations-org', tabNum: '07', label: 'Active Location & Business Entity', subtitle: 'Salon facilities, mobile vans, hours & legal entity' },
  { id: 'cms-wizard', tabNum: '08', label: 'CMS & Online Booking Wizard', subtitle: 'Online booking step builder, website banners & SEO' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onAddLocation,
  onDeleteLocation,
  onNavigateSection,
  onOpenQuickAction,
  initialTab = 'services',
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabId>(
    (initialTab as AdminTabId) || 'services'
  );

  const [savedNotice, setSavedNotice] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 01 SERVICES & PRICING STATE
  const [serviceTiers, setServiceTiers] = useState([
    { id: 'srv-1', name: 'Bath & Brush Full Care', basePrice: 65, durationMin: 45, desc: 'Hypoallergenic bath, warm air hand dry, brush out, ear cleaning & nail trim.' },
    { id: 'srv-2', name: 'Full Groom / Style Haircut', basePrice: 95, durationMin: 75, desc: 'Breed standard haircut, sanitary trim, paw pad contour, bath & blowout.' },
    { id: 'srv-3', name: 'Puppy First Groom Intro', basePrice: 55, durationMin: 35, desc: 'Gentle desensitization, bath, face & sanitary trim, nail buffing for pups under 6 mos.' },
    { id: 'srv-4', name: 'De-Shedding Deep Treatment', basePrice: 115, durationMin: 90, desc: 'Specialized Furminator wash, deep undercoat rake, high-velocity blowout & leave-in.' },
  ]);

  const [addOns, setAddOns] = useState([
    { id: 'add-1', name: 'Blueberry Facial Scrub', price: 12.00, posQuickAdd: true },
    { id: 'add-2', name: 'Teeth Brushing & Polish', price: 15.00, posQuickAdd: true },
    { id: 'add-3', name: 'Paw Defense Balm & Soak', price: 10.00, posQuickAdd: true },
    { id: 'add-4', name: 'Flea & Tick Medicated Dip', price: 25.00, posQuickAdd: true },
  ]);

  const [weightSurcharges, setWeightSurcharges] = useState({
    small: 0,
    medium: 15,
    large: 30,
    giant: 50,
  });

  // 02 BOOKING RULES STATE
  const [depositAmount, setDepositAmount] = useState('25.00');
  const [depositWaiverVisits, setDepositWaiverVisits] = useState('3');
  const [cancelDeadlineHours, setCancelDeadlineHours] = useState('24');
  const [lateCancelFee, setLateCancelFee] = useState('25.00');
  const [noShowPenalty, setNoShowPenalty] = useState('100%');
  const [stationPaddingMin, setStationPaddingMin] = useState('15');
  const [autoWaitlistDispatch, setAutoWaitlistDispatch] = useState(true);

  // 03 STAFF & USERS STATE
  const [staffList, setStaffList] = useState([
    { id: 'st-1', name: 'Sarah Jenkins', role: 'General Manager', email: 'sarah@allaboutthedawg.com', hub: 'Frisco HQ', status: 'Active', pin: '****' },
    { id: 'st-2', name: 'Marcus Vance', role: 'Lead Master Groomer', email: 'marcus@allaboutthedawg.com', hub: 'Frisco HQ', status: 'Active', pin: '****' },
    { id: 'st-3', name: 'Elena Rostova', role: 'Salon Manager', email: 'elena@allaboutthedawg.com', hub: 'Plano West', status: 'Active', pin: '****' },
    { id: 'st-4', name: 'Tyler Brooks', role: 'Mobile Van Tech', email: 'tyler@allaboutthedawg.com', hub: 'Mobile Fleet', status: 'Active', pin: '****' },
    { id: 'st-5', name: 'Chloe Martinez', role: 'Front Desk / Cashier', email: 'chloe@allaboutthedawg.com', hub: 'Frisco HQ', status: 'Active', pin: '****' },
  ]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Groomer');
  const [newStaffHub, setNewStaffHub] = useState('Frisco HQ');

  // 04 STRIPE & PAYOUTS STATE
  const [payoutSchedule, setPayoutSchedule] = useState('Daily Automatic');
  const [selectedLedgerFilter, setSelectedLedgerFilter] = useState<'ALL' | 'FRISCO' | 'PLANO' | 'VAN'>('ALL');

  // 05 CMS & WIZARD STATE
  const [announcementBanner, setAnnouncementBanner] = useState('Summer Coat Blowout Specials Available Across All Branches · Book Online Today');
  const [bannerActive, setBannerActive] = useState(true);
  const [taglineText, setTaglineText] = useState('Gentle, Cage-Free Luxury Pet Grooming in Frisco & Plano, Texas.');

  // 08 LOCATIONS & ORG STATE (At the bottom!)
  const [locSubTab, setLocSubTab] = useState<'hubs' | 'brand' | 'hours' | 'social' | 'legal'>('hubs');
  const [isAddLocModalOpen, setIsAddLocModalOpen] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocType, setNewLocType] = useState<LocationItem['type']>('Main Location');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocPhone, setNewLocPhone] = useState('(214) 555-0199');
  const [newLocStations, setNewLocStations] = useState(4);

  const handleTriggerSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;
    setStaffList(prev => [
      ...prev,
      {
        id: `st-${Date.now()}`,
        name: newStaffName.trim(),
        role: newStaffRole,
        email: newStaffEmail.trim() || `${newStaffName.toLowerCase().replace(/\s+/g, '')}@allaboutthedawg.com`,
        hub: newStaffHub,
        status: 'Active',
        pin: '****'
      }
    ]);
    setIsInviteModalOpen(false);
    setNewStaffName('');
    setNewStaffEmail('');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleCreateLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim()) return;
    onAddLocation({
      name: newLocName.startsWith('All About the Dawg') ? newLocName : `All About the Dawg – ${newLocName}`,
      type: newLocType,
      address: newLocAddress || '100 Preston Rd',
      cityStateZip: 'Frisco, TX 75034',
      phone: newLocPhone,
      email: 'contact@allaboutthedawg.com',
      manager: 'Salon Lead',
      stationCount: Number(newLocStations) || 4,
      operatingHours: 'Mon-Sat: 8:00 AM – 6:00 PM',
      status: 'Active',
      isDefault: false,
    });
    setIsAddLocModalOpen(false);
    setNewLocName('');
    setNewLocAddress('');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="min-h-full bg-white text-black font-mono pb-16">
      
      {/* TOP COMMAND HEADER */}
      <header className="border-b border-black bg-white px-6 py-4 sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-neutral-500 mb-0.5">
              <span className="bg-black text-white px-1.5 py-0.5 font-bold">BUSINESS OPS</span>
              <span>{'//'}</span>
              <span className="text-black font-bold">ADMIN CONSOLE</span>
              <span>{'//'}</span>
              <span className="text-orange-600 font-bold">{ADMIN_TABS.find(t => t.id === activeTab)?.label}</span>
            </div>
            <h1 className="text-xl font-bold uppercase tracking-tight text-black flex items-center gap-2">
              <span>All About Pawz // Business Ops &amp; Admin Hub</span>
            </h1>
            <p className="text-xs text-neutral-600 mt-0.5">
              Comprehensive salon management: pricing tables, booking rules, staff roles, payments, and facility operations.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {savedNotice && (
              <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-600 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Changes Saved &amp; Synced!</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleTriggerSave}
              className="bg-black text-white px-4 py-2 text-xs font-bold uppercase hover:bg-neutral-800 border border-black flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save Config Changes</span>
            </button>
          </div>
        </div>
      </header>

      {/* HORIZONTAL SUB-NAVIGATION TABS BAR */}
      <nav className="bg-neutral-100 border-b border-black px-6 flex items-center justify-between overflow-x-auto select-none sticky top-[73px] z-10">
        <div className="flex space-x-0 py-0">
          {ADMIN_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-xs font-bold uppercase whitespace-nowrap border-r border-black transition-none cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-white text-black border-b-2 border-b-orange-600 font-black shadow-2xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-black'
                }`}
              >
                <span className={`text-[10px] px-1 py-0.2 border ${
                  isActive ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-black border-black'
                }`}>
                  {tab.tabNum}
                </span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-600 px-1 py-0.2 font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Hidden / Advanced Secondary Controls (Locations/Entity & CMS) */}
        <div className="flex items-center gap-1 pl-4 py-1.5 font-mono text-xs">
          <span className="text-gray-500 uppercase text-[10px] hidden xl:inline">Advanced:</span>
          <div className="flex border border-black bg-white">
            <button
              onClick={() => setActiveTab('locations-org')}
              className={`px-2.5 py-1 text-[11px] uppercase font-bold border-r border-black transition-colors ${
                activeTab === 'locations-org' ? 'bg-black text-white' : 'bg-white hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              Facility &amp; Entity
            </button>
            <button
              onClick={() => setActiveTab('cms-wizard')}
              className={`px-2.5 py-1 text-[11px] uppercase font-bold transition-colors ${
                activeTab === 'cms-wizard' ? 'bg-black text-white' : 'bg-white hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              CMS Wizard
            </button>
          </div>
        </div>
      </nav>

      {/* TAB BODY CONTAINER */}
      <main className="p-6 max-w-[1650px] mx-auto space-y-6">

        {/* ========================================================
            TAB 01: SERVICES & PRICING MATRIX
           ======================================================== */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            
            {/* SEC:A CORE SERVICE TIERS */}
            <div className="border border-black bg-white">
              <div className="bg-neutral-100 px-4 py-2 border-b border-black flex items-center justify-between font-bold text-xs">
                <span className="uppercase text-black">SEC:A // CORE SERVICE TIERS &amp; BASE RATES</span>
                <span className="text-[10px] bg-white border border-black px-2 py-0.5">FRONT DESK &amp; ONLINE MENU</span>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto border border-black">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100 border-b border-black text-[10px] uppercase font-bold">
                      <tr>
                        <th className="p-2.5 border-r border-black">SERVICE TIER</th>
                        <th className="p-2.5 border-r border-black">BASE PRICE</th>
                        <th className="p-2.5 border-r border-black">EST. DURATION</th>
                        <th className="p-2.5">DESCRIPTION &amp; PROTOCOL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black">
                      {serviceTiers.map((tier) => (
                        <tr key={tier.id} className="hover:bg-neutral-50">
                          <td className="p-2.5 border-r border-black font-bold text-black">{tier.name}</td>
                          <td className="p-2.5 border-r border-black font-mono font-bold text-black">
                            <div className="flex items-center gap-1">
                              <span>$</span>
                              <input 
                                type="number" 
                                defaultValue={tier.basePrice} 
                                className="w-16 border border-black p-1 text-center font-bold"
                              />
                            </div>
                          </td>
                          <td className="p-2.5 border-r border-black font-mono">
                            <div className="flex items-center gap-1">
                              <input 
                                type="number" 
                                defaultValue={tier.durationMin} 
                                className="w-14 border border-black p-1 text-center font-bold"
                              />
                              <span className="text-neutral-500 text-[10px]">MINS</span>
                            </div>
                          </td>
                          <td className="p-2.5 text-neutral-600 text-[11px]">{tier.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* SEC:B ADD-ONS & UP-SELL CATALOG */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 border border-black bg-white">
                <div className="bg-neutral-100 px-4 py-2 border-b border-black flex items-center justify-between font-bold text-xs">
                  <span className="uppercase text-black">SEC:B // ADD-ONS &amp; UP-SELL CATALOG (POS REGISTER)</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-600 px-1.5 py-0.2">
                    HIGH MARGIN
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="overflow-x-auto border border-black">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-100 border-b border-black text-[10px] uppercase font-bold">
                        <tr>
                          <th className="p-2 border-r border-black">ITEM NAME</th>
                          <th className="p-2 border-r border-black">PRICE</th>
                          <th className="p-2 text-center">POS TERMINAL BUTTON</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black">
                        {addOns.map((addon) => (
                          <tr key={addon.id}>
                            <td className="p-2 border-r border-black font-bold">{addon.name}</td>
                            <td className="p-2 border-r border-black font-bold">${addon.price.toFixed(2)}</td>
                            <td className="p-2 text-center">
                              <span className="px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase">
                                ENABLED AT TILL
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* SEC:C WEIGHT & BREED SURCHARGE ENGINE */}
              <div className="lg:col-span-5 border border-black bg-white">
                <div className="bg-neutral-100 px-4 py-2 border-b border-black flex items-center justify-between font-bold text-xs">
                  <span className="uppercase text-black">SEC:C // WEIGHT &amp; BREED SURCHARGES</span>
                  <span className="text-[10px] bg-white border border-black px-1.5 py-0.2">AUTO-CALCULATED</span>
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-black p-2.5 bg-neutral-50">
                      <span className="text-[10px] text-neutral-500 uppercase block font-bold">SMALL (0 - 20 LBS)</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="font-bold">+$</span>
                        <input 
                          type="number" 
                          value={weightSurcharges.small} 
                          onChange={(e) => setWeightSurcharges(prev => ({ ...prev, small: Number(e.target.value) }))}
                          className="w-16 border border-black p-1 text-center font-bold bg-white"
                        />
                      </div>
                    </div>

                    <div className="border border-black p-2.5 bg-neutral-50">
                      <span className="text-[10px] text-neutral-500 uppercase block font-bold">MEDIUM (21 - 45 LBS)</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="font-bold">+$</span>
                        <input 
                          type="number" 
                          value={weightSurcharges.medium} 
                          onChange={(e) => setWeightSurcharges(prev => ({ ...prev, medium: Number(e.target.value) }))}
                          className="w-16 border border-black p-1 text-center font-bold bg-white"
                        />
                      </div>
                    </div>

                    <div className="border border-black p-2.5 bg-neutral-50">
                      <span className="text-[10px] text-neutral-500 uppercase block font-bold">LARGE (46 - 75 LBS)</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="font-bold">+$</span>
                        <input 
                          type="number" 
                          value={weightSurcharges.large} 
                          onChange={(e) => setWeightSurcharges(prev => ({ ...prev, large: Number(e.target.value) }))}
                          className="w-16 border border-black p-1 text-center font-bold bg-white"
                        />
                      </div>
                    </div>

                    <div className="border border-black p-2.5 bg-neutral-50">
                      <span className="text-[10px] text-orange-600 uppercase block font-bold">GIANT / DOODLE (75+ LBS)</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="font-bold">+$</span>
                        <input 
                          type="number" 
                          value={weightSurcharges.giant} 
                          onChange={(e) => setWeightSurcharges(prev => ({ ...prev, giant: Number(e.target.value) }))}
                          className="w-16 border border-black p-1 text-center font-bold bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEC:D PROMOTIONS, BUNDLES & MEMBERSHIPS */}
            <div className="border border-black bg-white">
              <div className="bg-neutral-100 px-4 py-2 border-b border-black flex items-center justify-between font-bold text-xs">
                <span className="uppercase text-black">SEC:D // PROMOTIONS, BUNDLES &amp; MEMBERSHIP PACKAGES</span>
                <span className="text-[10px] bg-black text-white px-1.5 py-0.2">LOYALTY PASS</span>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="border border-black p-3 bg-neutral-50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase text-[11px]">VIP PAMPERED PUP MONTHLY CLUB</span>
                    <span className="bg-emerald-600 text-white px-2 py-0.2 text-[9px] font-bold">$149.00 / MO</span>
                  </div>
                  <p className="text-[11px] text-neutral-600">
                    Includes 1 Full Style Groom per month + unlimited complimentary between-groom nail buffs and 15% discount on all retail shelf products.
                  </p>
                </div>

                <div className="border border-black p-3 bg-neutral-50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase text-[11px]">MULTI-PET FAMILY DISCOUNT</span>
                    <span className="bg-black text-white px-2 py-0.2 text-[9px] font-bold">15% OFF 2ND DOG</span>
                  </div>
                  <p className="text-[11px] text-neutral-600">
                    Automatically applied at the register or booking wizard when two or more dogs from the same household book concurrent slots.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 02: BOOKING RULES & POLICIES
           ======================================================== */}
        {activeTab === 'booking-rules' && <BookingOperationsTab />}

        {/* ========================================================
            TAB 03: USERS, STAFF & ROLES
           ======================================================== */}
        {activeTab === 'users-staff' && <UsersAccessTab />}

        {/* ========================================================
            TAB 04: REVENUE & STRIPE GATEWAY
           ======================================================== */}
        {activeTab === 'revenue-stripe' && <PaymentsTab />}

        {/* ========================================================
            TAB 05: CMS & BOOKING WIZARD CONFIG
           ======================================================== */}
        {activeTab === 'cms-wizard' && (
          <div className="space-y-6">
            
            {/* SECTION A: BOOKING WIZARD FLOW */}
            <div className="border border-black bg-white">
              <div className="bg-neutral-100 px-4 py-2 border-b border-black flex items-center justify-between font-bold text-xs">
                <span className="uppercase text-black">SECTION A: ONLINE BOOKING WIZARD STEP BUILDER</span>
                <span className="text-[10px] bg-white border border-black px-1.5 py-0.2">7-STEP ENGINE</span>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-neutral-600">
                  Controls the exact sequence clients complete when booking an appointment on your public salon website or mobile portal:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="border border-black p-2.5 bg-neutral-50">
                    <span className="text-[9px] font-bold bg-black text-white px-1.5 py-0.2 uppercase">STEP 01</span>
                    <p className="font-bold mt-1 text-black">Pet Profile &amp; Breed</p>
                    <p className="text-[10px] text-neutral-500">Breed selection, coat type &amp; weight.</p>
                  </div>
                  <div className="border border-black p-2.5 bg-neutral-50">
                    <span className="text-[9px] font-bold bg-black text-white px-1.5 py-0.2 uppercase">STEP 02</span>
                    <p className="font-bold mt-1 text-black">Service &amp; Up-sells</p>
                    <p className="text-[10px] text-neutral-500">Bath, Haircut, Blueberry Facial, etc.</p>
                  </div>
                  <div className="border border-black p-2.5 bg-neutral-50">
                    <span className="text-[9px] font-bold bg-black text-white px-1.5 py-0.2 uppercase">STEP 03</span>
                    <p className="font-bold mt-1 text-black">Facility Location</p>
                    <p className="text-[10px] text-neutral-500">Frisco HQ, Plano West, or Mobile Van.</p>
                  </div>
                  <div className="border border-black p-2.5 bg-neutral-50">
                    <span className="text-[9px] font-bold bg-black text-white px-1.5 py-0.2 uppercase">STEP 04</span>
                    <p className="font-bold mt-1 text-black">Stylist &amp; Time Slot</p>
                    <p className="text-[10px] text-neutral-500">Live calendar schedule availability.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B: CMS WEBPAGES & BANNERS */}
            <div className="border border-black bg-white">
              <div className="bg-neutral-100 px-4 py-2 border-b border-black flex items-center justify-between font-bold text-xs">
                <span className="uppercase text-black">SECTION B: PUBLIC WEBSITE PROMOTIONS &amp; TAGLINE</span>
                <span className="text-[10px] bg-orange-600 text-white px-1.5 py-0.2 font-bold">WEBSITE LIVE</span>
              </div>
              <div className="p-4 space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold uppercase text-neutral-700">
                      Announcement Ribbon / Top Header Banner
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[10px]">
                      <input 
                        type="checkbox" 
                        checked={bannerActive} 
                        onChange={(e) => setBannerActive(e.target.checked)}
                        className="accent-black"
                      />
                      <span>SHOW ON PUBLIC WEBSITE</span>
                    </label>
                  </div>
                  <input 
                    type="text" 
                    value={announcementBanner} 
                    onChange={(e) => setAnnouncementBanner(e.target.value)}
                    className="w-full border border-black p-2 bg-white font-bold text-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">
                    Public Hero Tagline (Homepage)
                  </label>
                  <input 
                    type="text" 
                    value={taglineText} 
                    onChange={(e) => setTaglineText(e.target.value)}
                    className="w-full border border-black p-2 bg-white text-black focus:outline-none"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 06: ANALYTICS & REPORTING
           ======================================================== */}
        {activeTab === 'analytics-reporting' && <AnalyticsReportingTab />}

        {/* ========================================================
            TAB 07: SYSTEM HEALTH & SUPABASE
           ======================================================== */}
        {activeTab === 'system-health' && <SystemHealthTab />}

        {/* ========================================================
            TAB 08: LOCATIONS, HUBS & ORGANIZATION
            (Moved to the bottom as explicitly requested by user!)
           ======================================================== */}
        {activeTab === 'locations-org' && (
          <OrganizationTab 
            locations={locations}
            selectedLocation={selectedLocation}
            onSelectLocation={onSelectLocation}
            onAddLocation={onAddLocation}
            onDeleteLocation={onDeleteLocation}
          />
        )}

      </main>

      {/* MODAL: INVITE STAFF MEMBER */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <span className="font-bold uppercase text-xs">Invite Staff / Register User</span>
              <button 
                type="button" 
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full border border-black p-2 font-bold bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="jordan@allaboutthedawg.com"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  className="w-full border border-black p-2 bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">Role</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                    className="w-full border border-black p-2 font-bold bg-white cursor-pointer"
                  >
                    <option>Master Groomer</option>
                    <option>Bather / Tech</option>
                    <option>Front Desk / Cashier</option>
                    <option>Salon Manager</option>
                    <option>Mobile Van Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">Primary Hub</label>
                  <select
                    value={newStaffHub}
                    onChange={(e) => setNewStaffHub(e.target.value)}
                    className="w-full border border-black p-2 font-bold bg-white cursor-pointer"
                  >
                    <option>Frisco HQ</option>
                    <option>Plano West</option>
                    <option>Mobile Fleet</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-black">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="border border-black px-3 py-1.5 font-bold uppercase hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-1.5 font-bold uppercase hover:bg-neutral-800 border border-black"
                >
                  Send Invite &amp; Issue PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD LOCATION */}
      {isAddLocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <span className="font-bold uppercase text-xs">Add Salon Location / Mobile Van</span>
              <button 
                type="button" 
                onClick={() => setIsAddLocModalOpen(false)}
                className="p-1 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLocationSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. McKinney North Annex"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  className="w-full border border-black p-2 font-bold bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">Type</label>
                  <select
                    value={newLocType}
                    onChange={(e) => setNewLocType(e.target.value as LocationItem['type'])}
                    className="w-full border border-black p-2 font-bold bg-white cursor-pointer"
                  >
                    <option value="Main Location">Physical Salon</option>
                    <option value="Mobile Van">Mobile Van Unit</option>
                    <option value="Secondary">Branch Annex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">Stations / Tables</label>
                  <input
                    type="number"
                    value={newLocStations}
                    onChange={(e) => setNewLocStations(Number(e.target.value))}
                    className="w-full border border-black p-2 font-bold bg-white text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 5200 Eldorado Pkwy"
                  value={newLocAddress}
                  onChange={(e) => setNewLocAddress(e.target.value)}
                  className="w-full border border-black p-2 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newLocPhone}
                  onChange={(e) => setNewLocPhone(e.target.value)}
                  className="w-full border border-black p-2 bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-black">
                <button
                  type="button"
                  onClick={() => setIsAddLocModalOpen(false)}
                  className="border border-black px-3 py-1.5 font-bold uppercase hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-1.5 font-bold uppercase hover:bg-neutral-800 border border-black"
                >
                  Create Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MONOCHROME FOOTER TELEMETRY DOCK */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-black bg-white px-6 py-1.5 flex items-center justify-between text-[10px] uppercase font-bold text-neutral-600 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-600 inline-block animate-pulse"></span>
          <span className="text-black">STATUS: OPERATIONAL &amp; VERIFIED</span>
          <span className="text-neutral-400">{'//'}</span>
          <span>ALL SALON FACILITIES SYNCED</span>
          <span className="text-neutral-400">{'//'}</span>
          <span className="text-neutral-500">FACILITY ACTIVE: {selectedLocation}</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-neutral-500">
          <span>TIMEZONE: AMERICA/CHICAGO (CST)</span>
          <span>•</span>
          <span className="text-black">DAWG-OS KERNEL v2.4</span>
        </div>
      </footer>

    </div>
  );
};
