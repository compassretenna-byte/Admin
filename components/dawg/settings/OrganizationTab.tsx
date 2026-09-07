'use client';

import React, { useState } from 'react';
import { LocationItem } from '@/lib/types';
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
  FileText,
  ShieldCheck,
  Percent,
  Download,
  Upload,
  ExternalLink,
  Save,
  Check,
  AlertTriangle
} from 'lucide-react';

interface OrganizationTabProps {
  locations: LocationItem[];
  selectedLocation: string;
  onSelectLocation: (locName: string) => void;
  onAddLocation: (newLoc: Partial<LocationItem>) => void;
  onDeleteLocation?: (id: string) => void;
}

type OrgSubTab = 'locations' | 'brand' | 'hours' | 'social' | 'tax';

export const OrganizationTab: React.FC<OrganizationTabProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onAddLocation,
  onDeleteLocation,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<OrgSubTab>('locations');
  const [notification, setNotification] = useState<string | null>(null);

  // New location draft state
  const [draftLocName, setDraftLocName] = useState('');
  const [draftLocType, setDraftLocType] = useState('Brick & Mortar Salon + Retail');
  const [draftMerchant, setDraftMerchant] = useState('Stripe Connected // Acct #acct_pawz_main');
  const [draftAddress, setDraftAddress] = useState('');
  const [draftCityZip, setDraftCityZip] = useState('Frisco, TX 75034');
  const [draftCapacity, setDraftCapacity] = useState('4');

  // Hours tab state
  const [selectedHoursLoc, setSelectedHoursLoc] = useState('FRISCO MAIN HQ');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateDraftLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftLocName.trim()) return;

    onAddLocation({
      name: draftLocName.startsWith('All About Pawz') ? draftLocName : `All About Pawz - ${draftLocName}`,
      type: draftLocType.includes('Mobile') ? 'Mobile Unit' : 'Branch Salon',
      address: draftAddress || '1234 Commercial Blvd',
      cityStateZip: draftCityZip,
      phone: '(214) 555-0199',
      email: 'hq@allaboutpawz.com',
      manager: 'Lead Stylist',
      stationCount: Number(draftCapacity) || 4,
      operatingHours: 'Mon-Sat: 8:00 AM – 6:00 PM',
      status: 'Active',
      isDefault: false
    });

    setDraftLocName('');
    setDraftAddress('');
    showNotification(`Successfully provisioned location: ${draftLocName}!`);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white border-2 border-white px-4 py-2.5 shadow-2xl flex items-center gap-2 text-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="font-bold">{notification}</span>
        </div>
      )}

      {/* HEADER & SUMMARY BAR */}
      <div className="border border-black bg-white p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase text-neutral-500 tracking-wider">
              BUSINESS PROFILE // ENTITY STRUCTURE // MULTI-UNIT SYNC
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight mt-1 text-black">
              ORGANIZATION, MULTI-LOCATION &amp; BRAND SETTINGS
            </h2>
            <p className="text-xs text-neutral-600 mt-1 max-w-3xl">
              Configure enterprise brand identities, manage multi-facility tax &amp; merchant bindings, configure physical salon operating hours, and govern global salon holidays across North Texas facilities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="border border-black p-2.5 bg-neutral-50 text-right min-w-[120px]">
              <div className="text-[10px] text-neutral-500 uppercase">ACTIVE LOCATIONS</div>
              <div className="text-xl font-bold">03 SALONS</div>
            </div>
            <div className="border border-black p-2.5 bg-neutral-50 text-right min-w-[120px]">
              <div className="text-[10px] text-neutral-500 uppercase">ACTIVE STAFF</div>
              <div className="text-xl font-bold">24 TEAM</div>
            </div>
            <div className="border border-black p-2.5 bg-neutral-50 text-right min-w-[140px]">
              <div className="text-[10px] text-neutral-500 uppercase">ENTERPRISE ENTITY</div>
              <div className="text-sm font-bold truncate">DAWG OS HOLDINGS</div>
            </div>
          </div>
        </div>

        {/* OPERATIONS INNER TABS */}
        <div className="flex items-center gap-1 mt-6 border-b border-black -mb-5">
          <button 
            onClick={() => setActiveSubTab('locations')}
            className={`px-4 py-2 font-mono text-xs font-bold border-t border-l border-r border-black uppercase transition-colors ${
              activeSubTab === 'locations' ? 'bg-black text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-black'
            }`}
          >
            {activeSubTab === 'locations' ? '■ ' : ''}LOCATIONS &amp; HUBS (3)
          </button>
          <button 
            onClick={() => setActiveSubTab('brand')}
            className={`px-4 py-2 font-mono text-xs font-bold border-t border-l border-r border-black uppercase transition-colors ${
              activeSubTab === 'brand' ? 'bg-black text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-black'
            }`}
          >
            {activeSubTab === 'brand' ? '■ ' : ''}BRAND &amp; VISUAL IDENTITY
          </button>
          <button 
            onClick={() => setActiveSubTab('hours')}
            className={`px-4 py-2 font-mono text-xs font-bold border-t border-l border-r border-black uppercase transition-colors ${
              activeSubTab === 'hours' ? 'bg-black text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-black'
            }`}
          >
            {activeSubTab === 'hours' ? '■ ' : ''}OPERATING &amp; HOLIDAY HOURS
          </button>
          <button 
            onClick={() => setActiveSubTab('social')}
            className={`px-4 py-2 font-mono text-xs font-bold border-t border-l border-r border-black uppercase transition-colors ${
              activeSubTab === 'social' ? 'bg-black text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-black'
            }`}
          >
            {activeSubTab === 'social' ? '■ ' : ''}SOCIAL LINKS &amp; DIRECTORIES
          </button>
          <button 
            onClick={() => setActiveSubTab('tax')}
            className={`px-4 py-2 font-mono text-xs font-bold border-t border-l border-r border-black uppercase transition-colors ${
              activeSubTab === 'tax' ? 'bg-black text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-black'
            }`}
          >
            {activeSubTab === 'tax' ? '■ ' : ''}TAX &amp; LEGAL ENTITY
          </button>
        </div>
      </div>

      {/* ========================================================
          SUB-TAB 1: LOCATIONS & HUBS
         ======================================================== */}
      {activeSubTab === 'locations' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* COLUMN 1 & 2: MULTI-LOCATION DIRECTORY & ACTIVE EDIT FORM */}
          <div className="xl:col-span-2 space-y-6">

            {/* LOCATION 01: FRISCO HQ */}
            <div className="border border-black p-5 bg-white">
              <div className="flex items-start justify-between border-b border-black pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-black text-white font-mono font-bold flex items-center justify-center text-xs">
                    01
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base uppercase text-black">ALL ABOUT PAWZ - FRISCO HQ (MAIN LOCATION)</h3>
                      <span className="bg-black text-white font-mono text-[10px] px-1.5 py-0.2 font-bold uppercase">PRIMARY HQ</span>
                      <span className="border border-black font-mono text-[10px] px-1.5 py-0.2 uppercase bg-green-50">ONLINE &amp; ACTIVE</span>
                    </div>
                    <div className="text-xs text-neutral-500">FACILITY_ID: LOC-TX-FRISCO-001 // ROUTING NODE: OMS-01</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { onSelectLocation('FRISCO HQ (MAIN LOC)'); showNotification('Switched to FRISCO HQ (MAIN LOC)'); }}
                    className="border border-black px-2 py-1 text-xs font-bold hover:bg-neutral-100 uppercase"
                  >
                    [SWITCH TO THIS]
                  </button>
                  <button 
                    onClick={() => showNotification('Editing Frisco HQ details')}
                    className="bg-black text-white px-2 py-1 text-xs font-bold hover:bg-neutral-800 uppercase"
                  >
                    [EDIT DETAILS]
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] block">PHYSICAL ADDRESS</span>
                  <p className="font-bold text-black">1234 MAPLE DRIVE</p>
                  <p>FRISCO, TX 75034</p>
                  <p className="text-neutral-500">COLLIN COUNTY // ZONE 1</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] block">COMMUNICATIONS &amp; DISPATCH</span>
                  <p className="font-bold text-black">TEL: (214) 555-0198</p>
                  <p>SMS: +1 (800) 555-PAWZ</p>
                  <p className="text-neutral-500">EMAIL: FRISCO@ALLABOUTPAWZ.COM</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] block">STATION CAPACITY &amp; STAFF</span>
                  <p className="font-bold text-black">GROOMING STATIONS: 08 BAYS</p>
                  <p>ACTIVE GROOMERS: 12 ON ROTA</p>
                  <p className="text-neutral-500">POS TERMINALS: 03 LANE TERMINALS</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] bg-neutral-50 p-2.5">
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">MON - FRI HOURS</span>
                  <span className="font-bold text-black">07:30 AM - 06:30 PM</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">SATURDAY HOURS</span>
                  <span className="font-bold text-black">08:00 AM - 05:00 PM</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">SUNDAY STATUS</span>
                  <span className="font-bold text-neutral-500">CLOSED (BOARDING ON-CALL)</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">TAX REGION / RATE</span>
                  <span className="font-bold text-black">TX_STATE (8.25%)</span>
                </div>
              </div>
            </div>

            {/* LOCATION 02: PLANO WEST */}
            <div className="border border-black p-5 bg-white">
              <div className="flex items-start justify-between border-b border-black pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-neutral-200 text-black font-bold flex items-center justify-center text-xs border border-black">
                    02
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base uppercase text-black">ALL ABOUT PAWZ - PLANO WEST BRANCH</h3>
                      <span className="border border-black text-[10px] px-1.5 py-0.2 uppercase bg-neutral-100 font-bold">BRANCH SALON</span>
                      <span className="border border-black text-[10px] px-1.5 py-0.2 uppercase bg-green-50">ONLINE &amp; ACTIVE</span>
                    </div>
                    <div className="text-xs text-neutral-500">FACILITY_ID: LOC-TX-PLANO-002 // ROUTING NODE: OMS-02</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { onSelectLocation('PLANO WEST BRANCH'); showNotification('Switched to PLANO WEST BRANCH'); }}
                    className="border border-black px-2 py-1 text-xs font-bold hover:bg-neutral-100 uppercase"
                  >
                    [SWITCH TO THIS]
                  </button>
                  <button 
                    onClick={() => showNotification('Editing Plano West details')}
                    className="border border-black px-2 py-1 text-xs font-bold hover:bg-black hover:text-white uppercase transition-colors"
                  >
                    [EDIT DETAILS]
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] block">PHYSICAL ADDRESS</span>
                  <p className="font-bold text-black">5800 LEGACY DRIVE, STE C</p>
                  <p>PLANO, TX 75024</p>
                  <p className="text-neutral-500">DALLAS/COLLIN // ZONE 2</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] block">COMMUNICATIONS &amp; DISPATCH</span>
                  <p className="font-bold text-black">TEL: (972) 555-8921</p>
                  <p>SMS: +1 (800) 555-PAWZ #2</p>
                  <p className="text-neutral-500">EMAIL: PLANO@ALLABOUTPAWZ.COM</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] block">STATION CAPACITY &amp; STAFF</span>
                  <p className="font-bold text-black">GROOMING STATIONS: 05 BAYS</p>
                  <p>ACTIVE GROOMERS: 07 ON ROTA</p>
                  <p className="text-neutral-500">POS TERMINALS: 02 LANE TERMINALS</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] bg-neutral-50 p-2.5">
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">MON - FRI HOURS</span>
                  <span className="font-bold text-black">08:00 AM - 06:00 PM</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">SATURDAY HOURS</span>
                  <span className="font-bold text-black">08:30 AM - 04:30 PM</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">SUNDAY STATUS</span>
                  <span className="font-bold text-neutral-500">CLOSED</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">TAX REGION / RATE</span>
                  <span className="font-bold text-black">TX_STATE (8.25%)</span>
                </div>
              </div>
            </div>

            {/* LOCATION 03: MOBILE VAN FLEET */}
            <div className="border border-black p-5 bg-white">
              <div className="flex items-start justify-between border-b border-black pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-neutral-200 text-black font-bold flex items-center justify-center text-xs border border-black">
                    03
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base uppercase text-black">ALL ABOUT PAWZ - MOBILE VAN DISPATCH FLEET</h3>
                      <span className="border border-black text-[10px] px-1.5 py-0.2 uppercase bg-neutral-100 font-bold">MOBILE UNIT</span>
                      <span className="border border-black text-[10px] px-1.5 py-0.2 uppercase bg-green-50">ONLINE &amp; DISPATCHING</span>
                    </div>
                    <div className="text-xs text-neutral-500">FACILITY_ID: LOC-TX-MOBILE-VAN-003 // FLEET HUB: 03 VANS ACTIVE</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { onSelectLocation('MOBILE VAN FLEET'); showNotification('Switched to MOBILE VAN FLEET'); }}
                    className="border border-black px-2 py-1 text-xs font-bold hover:bg-neutral-100 uppercase"
                  >
                    [SWITCH TO THIS]
                  </button>
                  <button 
                    onClick={() => showNotification('Editing Mobile Van Fleet details')}
                    className="border border-black px-2 py-1 text-xs font-bold hover:bg-black hover:text-white uppercase transition-colors"
                  >
                    [EDIT DETAILS]
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] block">DISPATCH BASE DOCK</span>
                  <p className="font-bold text-black">1234 MAPLE DRIVE (REAR BAY)</p>
                  <p>FRISCO, TX 75034</p>
                  <p className="text-neutral-500">SERVICE RADIUS: 25 MILES</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] block">COMMUNICATIONS &amp; GPS</span>
                  <p className="font-bold text-black">DISPATCH TEL: (214) 555-0199</p>
                  <p>TELEMETRY: VERIZON CONNECT GPS</p>
                  <p className="text-neutral-500">EMAIL: DISPATCH@ALLABOUTPAWZ.COM</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] block">FLEET VANS &amp; CREW</span>
                  <p className="font-bold text-black">ACTIVE VANS: VAN-01, 02, 03</p>
                  <p>MOBILE GROOMERS: 05 CERTIFIED</p>
                  <p className="text-neutral-500">CELLULAR TAP TERMINALS: 03 ACTIVE</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] bg-neutral-50 p-2.5">
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">OPERATING DAYS</span>
                  <span className="font-bold text-black">TUE - SAT // 08:00 - 05:00</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">AVERAGE STOPS / VAN</span>
                  <span className="font-bold text-black">5.4 CLIENTS / DAY</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">CALL-OUT SURCHARGE</span>
                  <span className="font-bold text-black">$35.00 TRAVEL / DOCK</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">STATE REGISTRATION</span>
                  <span className="font-bold text-black">TX_COMMERCIAL_FLEET</span>
                </div>
              </div>
            </div>

            {/* RAPID LOCATION CREATOR INTAKE FORM */}
            <div className="border border-black p-5 bg-neutral-50">
              <div className="flex items-center justify-between border-b border-black pb-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase bg-black text-white px-2 py-0.5">+ DRAFT STATION</span>
                  <h4 className="font-bold text-sm uppercase text-black">PROVISION NEW BUSINESS LOCATION / RETAIL HUB</h4>
                </div>
                <span className="text-xs text-neutral-500">NEW SALON OR DISPATCH POD</span>
              </div>

              <form onSubmit={handleCreateDraftLocation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-neutral-600 mb-1 uppercase text-[10px]">FACILITY NAME // CODE</label>
                    <input 
                      type="text" 
                      required
                      value={draftLocName}
                      onChange={(e) => setDraftLocName(e.target.value)}
                      placeholder="e.g. Dallas Uptown Salon" 
                      className="w-full border border-black p-2 bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1 uppercase text-[10px]">FACILITY TYPE</label>
                    <select 
                      value={draftLocType}
                      onChange={(e) => setDraftLocType(e.target.value)}
                      className="w-full border border-black p-2 bg-white focus:outline-none"
                    >
                      <option>Brick &amp; Mortar Salon + Retail</option>
                      <option>Mobile Van Dispatch Hub</option>
                      <option>Curbside Boutique Kiosk</option>
                      <option>Warehouse &amp; Fulfillment Depot</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1 uppercase text-[10px]">MERCHANT / STRIPE ACCOUNT</label>
                    <select 
                      value={draftMerchant}
                      onChange={(e) => setDraftMerchant(e.target.value)}
                      className="w-full border border-black p-2 bg-white focus:outline-none"
                    >
                      <option>Stripe Connected // Acct #acct_pawz_main</option>
                      <option>Separate Sub-Merchant Account</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="md:col-span-2">
                    <label className="block text-neutral-600 mb-1 uppercase text-[10px]">STREET ADDRESS</label>
                    <input 
                      type="text" 
                      value={draftAddress}
                      onChange={(e) => setDraftAddress(e.target.value)}
                      placeholder="Street Address Line 1" 
                      className="w-full border border-black p-2 bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1 uppercase text-[10px]">CITY, STATE, ZIP</label>
                    <input 
                      type="text" 
                      value={draftCityZip}
                      onChange={(e) => setDraftCityZip(e.target.value)}
                      placeholder="City, TX 75000" 
                      className="w-full border border-black p-2 bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1 uppercase text-[10px]">STATION CAPACITY</label>
                    <input 
                      type="number" 
                      value={draftCapacity}
                      onChange={(e) => setDraftCapacity(e.target.value)}
                      placeholder="4 Stations" 
                      className="w-full border border-black p-2 bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-black">
                  <button 
                    type="button"
                    onClick={() => { setDraftLocName(''); setDraftAddress(''); }}
                    className="border border-black bg-white px-4 py-1.5 text-xs uppercase font-bold hover:bg-neutral-200"
                  >
                    CLEAR FORM
                  </button>
                  <button 
                    type="submit"
                    className="bg-black text-white px-5 py-1.5 text-xs uppercase font-bold hover:bg-neutral-800"
                  >
                    SAVE &amp; INITIALIZE REPLICATION
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* COLUMN 3: GLOBAL BRAND IDENTITY & MULTI-LOCATION SWITCHER */}
          <div className="space-y-6">

            {/* MULTI-LOCATION CONSOLE SWITCHER */}
            <div className="border border-black p-4 bg-white">
              <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-black">ACTIVE CONSOLE SWITCHER</h4>
                <span className="text-[10px] text-neutral-500">HOTKEY: [ALT+L]</span>
              </div>
              <p className="text-xs text-neutral-600 mb-3">
                Selecting a location remaps calendar queues, client check-in registers, local tax rules, and employee timecards.
              </p>

              <div className="space-y-2 text-xs">
                <div 
                  onClick={() => onSelectLocation('FRISCO HQ (MAIN LOC)')}
                  className={`border-2 border-black p-3 flex items-center justify-between cursor-pointer ${
                    selectedLocation.includes('FRISCO') ? 'bg-neutral-100' : 'bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div>
                    <div className="font-bold uppercase flex items-center gap-1.5 text-black">
                      <span className="w-2 h-2 bg-black"></span>
                      <span>FRISCO MAIN HQ</span>
                    </div>
                    <div className="text-[10px] text-neutral-500">12 Groomers // 8 Bays // Primary</div>
                  </div>
                  {selectedLocation.includes('FRISCO') ? (
                    <span className="bg-black text-white text-[10px] px-1.5 py-0.5 font-bold">CURRENT</span>
                  ) : (
                    <button className="border border-black text-[10px] px-1.5 py-0.5 font-bold hover:bg-black hover:text-white uppercase">CONNECT</button>
                  )}
                </div>

                <div 
                  onClick={() => onSelectLocation('PLANO WEST BRANCH')}
                  className={`border border-black p-3 flex items-center justify-between cursor-pointer ${
                    selectedLocation.includes('PLANO') ? 'bg-neutral-100 border-2' : 'bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div>
                    <div className="font-bold uppercase flex items-center gap-1.5 text-black">
                      <span className="w-2 h-2 border border-black"></span>
                      <span>PLANO WEST BRANCH</span>
                    </div>
                    <div className="text-[10px] text-neutral-500">7 Groomers // 5 Bays // Branch</div>
                  </div>
                  {selectedLocation.includes('PLANO') ? (
                    <span className="bg-black text-white text-[10px] px-1.5 py-0.5 font-bold">CURRENT</span>
                  ) : (
                    <button className="border border-black text-[10px] px-1.5 py-0.5 font-bold hover:bg-black hover:text-white uppercase">CONNECT</button>
                  )}
                </div>

                <div 
                  onClick={() => onSelectLocation('MOBILE VAN FLEET')}
                  className={`border border-black p-3 flex items-center justify-between cursor-pointer ${
                    selectedLocation.includes('MOBILE') ? 'bg-neutral-100 border-2' : 'bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div>
                    <div className="font-bold uppercase flex items-center gap-1.5 text-black">
                      <span className="w-2 h-2 border border-black"></span>
                      <span>MOBILE VAN FLEET</span>
                    </div>
                    <div className="text-[10px] text-neutral-500">5 Groomers // 3 Vans // In-Transit</div>
                  </div>
                  {selectedLocation.includes('MOBILE') ? (
                    <span className="bg-black text-white text-[10px] px-1.5 py-0.5 font-bold">CURRENT</span>
                  ) : (
                    <button className="border border-black text-[10px] px-1.5 py-0.5 font-bold hover:bg-black hover:text-white uppercase">CONNECT</button>
                  )}
                </div>

                <div 
                  onClick={() => { onSelectLocation('ALL LOCATIONS'); showNotification('Switched to Consolidated Rollup'); }}
                  className="border border-black border-dashed p-3 hover:bg-neutral-50 flex items-center justify-between cursor-pointer"
                >
                  <div className="text-neutral-500">
                    <span className="font-bold uppercase text-[11px] text-black">+ ENTERPRISE ALL-LOCATIONS</span>
                    <div className="text-[10px]">Consolidated Rollup &amp; Global Ledger</div>
                  </div>
                  <button className="border border-black text-[10px] px-1.5 py-0.5 font-bold hover:bg-black hover:text-white uppercase">VIEW ALL</button>
                </div>
              </div>
            </div>

            {/* BRAND & IDENTITY ASSETS PANEL */}
            <div className="border border-black p-4 bg-white">
              <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-black">BRAND ASSETS &amp; THEME</h4>
                <span className="text-[10px] bg-neutral-100 border border-black px-1 font-bold">TOKEN: DAWG_CORE</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-neutral-500 uppercase text-[10px] block mb-1">REGISTERED TRADEMARKS &amp; BRAND NAME</span>
                  <input 
                    type="text" 
                    defaultValue="All About Pawz / All About the Dawg" 
                    className="w-full border border-black p-2 font-bold bg-neutral-50 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <span className="text-neutral-500 uppercase text-[10px] block mb-1">BRAND SLOGAN &amp; RECEIPT FOOTER</span>
                  <input 
                    type="text" 
                    defaultValue="Luxury Pet Care &amp; Dedicated Canine Stylists" 
                    className="w-full border border-black p-2 bg-neutral-50 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <span className="text-neutral-500 uppercase text-[10px] block mb-1">CORE LOGO &amp; WATERMARK ASSET</span>
                  <div className="border border-black p-3 bg-neutral-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-xs">
                        🐾
                      </div>
                      <div>
                        <div className="font-bold text-xs text-black">BRAND_LOGO_V2.SVG</div>
                        <div className="text-[10px] text-neutral-500">VECTOR // 512x512 // MONOCHROME</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => showNotification('Logo replacement dialog ready')}
                      className="border border-black px-2 py-1 text-[10px] uppercase font-bold hover:bg-black hover:text-white"
                    >
                      [REPLACE]
                    </button>
                  </div>
                </div>

                {/* COLOR & DESIGN SYSTEM TOKENS */}
                <div className="pt-2 border-t border-black">
                  <span className="text-neutral-500 uppercase text-[10px] block mb-2">COLOR &amp; TOKEN SPECIFICATION</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="border border-black p-2 bg-white flex items-center justify-between">
                      <span>PRIMARY:</span>
                      <span className="font-bold text-black">#000000 [BLACK]</span>
                    </div>
                    <div className="border border-black p-2 bg-white flex items-center justify-between">
                      <span>SURFACE:</span>
                      <span className="font-bold text-black">#FFFFFF [WHITE]</span>
                    </div>
                    <div className="border border-black p-2 bg-neutral-100 flex items-center justify-between">
                      <span>ACCENT DIM:</span>
                      <span className="font-bold text-black">#F3F3F4 [GRAY]</span>
                    </div>
                    <div className="border border-black p-2 bg-white flex items-center justify-between">
                      <span>CORNERS:</span>
                      <span className="font-bold text-black">0px [SQUARE]</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SOCIAL PROFILES & DIRECTORY INTEGRATIONS */}
            <div className="border border-black p-4 bg-white">
              <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-black">CHANNELS &amp; DIRECTORIES</h4>
                <span className="text-[10px] text-neutral-500">SYNC: 4 NETWORKS</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between border border-black p-2 bg-neutral-50">
                  <span className="font-bold text-black">GOOGLE BUSINESS PROFILE</span>
                  <span className="bg-black text-white text-[10px] px-1.5 py-0.2">SYNCED (4.9★)</span>
                </div>
                <div className="flex items-center justify-between border border-black p-2 bg-neutral-50">
                  <span className="font-bold text-black">INSTAGRAM (@ALLABOUTPAWZ)</span>
                  <span className="bg-black text-white text-[10px] px-1.5 py-0.2">CONNECTED</span>
                </div>
                <div className="flex items-center justify-between border border-black p-2 bg-neutral-50">
                  <span className="font-bold text-black">YELP PET SERVICES</span>
                  <span className="bg-black text-white text-[10px] px-1.5 py-0.2">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between border border-black p-2 bg-neutral-50">
                  <span className="font-bold text-black">FACEBOOK LOCAL HUB</span>
                  <span className="bg-black text-white text-[10px] px-1.5 py-0.2">CONNECTED</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: BRAND & VISUAL IDENTITY
         ======================================================== */}
      {activeSubTab === 'brand' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            
            {/* SECTION A: CORE BRAND ASSETS */}
            <div className="border border-black p-5 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-black text-white px-2 py-0.5 text-xs font-bold uppercase">SECTION A</span>
                  <h3 className="font-bold text-base uppercase text-black">CORE BRAND ASSETS &amp; WORDMARK SPECS</h3>
                </div>
                <span className="text-xs text-neutral-500">SPEC://ASSETS-V2.4</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-black p-4 bg-neutral-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase text-black">PRIMARY LOGO MARK (VECTOR)</span>
                    <span className="bg-green-50 border border-black text-[10px] px-1.5 py-0.2 uppercase font-bold">ONLINE &amp; SYNCED</span>
                  </div>
                  <div className="border border-black p-4 bg-white flex items-center justify-center">
                    <div className="w-20 h-20 bg-black text-white flex flex-col items-center justify-center font-bold text-2xl tracking-tighter">
                      <span className="text-2xl">🐾</span>
                      <span className="text-[9px] tracking-widest mt-0.5 font-mono">PAWZ</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-500 text-[10px] uppercase">CURRENT FILE:</span>
                      <span className="font-bold text-[11px] text-black">BRAND_LOGO_V2.SVG</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 text-[10px] uppercase">ASPECT RATIO:</span>
                      <span className="text-[11px]">1:1 // MIN 512x512</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-black">
                    <button 
                      onClick={() => showNotification('SVG upload dialog triggered')}
                      className="flex-1 bg-black text-white py-1.5 text-xs font-bold uppercase hover:bg-neutral-800"
                    >
                      [UPLOAD NEW SVG]
                    </button>
                    <button 
                      onClick={() => showNotification('Exporting logo SVG')}
                      className="border border-black px-3 py-1.5 text-xs font-bold uppercase hover:bg-neutral-200"
                    >
                      EXPORT
                    </button>
                  </div>
                </div>

                <div className="border border-black p-4 bg-neutral-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase text-black">SECONDARY HORIZONTAL WORDMARK</span>
                    <span className="border border-black bg-white text-[10px] px-1.5 py-0.2 uppercase font-bold">PROD APPROVED</span>
                  </div>
                  <div className="border border-black p-4 bg-white flex flex-col items-center justify-center space-y-2">
                    <div className="text-lg font-bold tracking-tight uppercase border-b border-black pb-1 text-black">
                      ALL ABOUT PAWZ
                    </div>
                    <div className="text-[10px] text-neutral-500 tracking-wider">
                      CANINE SPA &amp; BOUTIQUE STYLISTS
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-500 text-[10px] uppercase">EXPORT DIMENSIONS:</span>
                      <span className="font-bold text-[11px] text-black">1200 x 300 PX (4:1 RATIO)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 text-[10px] uppercase">VARIANTS COMPILED:</span>
                      <span className="text-[11px]">DARK &amp; LIGHT MODE SVG</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-black">
                    <button 
                      onClick={() => showNotification('Previewing theme variants')}
                      className="flex-1 border border-black bg-white py-1.5 text-xs font-bold uppercase hover:bg-neutral-200"
                    >
                      [PREVIEW LIGHT/DARK]
                    </button>
                    <button 
                      onClick={() => showNotification('Replace wordmark triggered')}
                      className="border border-black px-3 py-1.5 text-xs font-bold uppercase hover:bg-black hover:text-white"
                    >
                      REPLACE
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B: DESIGN SYSTEM TOKENS */}
            <div className="border border-black p-5 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-black text-white px-2 py-0.5 text-xs font-bold uppercase">SECTION B</span>
                  <h3 className="font-bold text-base uppercase text-black">DESIGN SYSTEM TOKENS &amp; MONOCHROME SPECIFICATION</h3>
                </div>
                <span className="text-xs text-neutral-500">DAWG_CORE // REVISION 4</span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-600">01 // SYSTEM PALETTE TOKENS</div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  <div className="border border-black p-2 bg-black text-white">
                    <div className="text-[9px] text-neutral-300 uppercase">PRIMARY</div>
                    <div className="font-bold text-xs mt-1">#000000</div>
                    <div className="text-[9px] text-neutral-400 mt-1">PITCH BLACK</div>
                  </div>
                  <div className="border border-black p-2 bg-white text-black">
                    <div className="text-[9px] text-neutral-500 uppercase">BG SURFACE</div>
                    <div className="font-bold text-xs mt-1">#FFFFFF</div>
                    <div className="text-[9px] text-neutral-500 mt-1">STARK WHITE</div>
                  </div>
                  <div className="border border-black p-2 bg-neutral-100 text-black">
                    <div className="text-[9px] text-neutral-500 uppercase">SURFACE DIM</div>
                    <div className="font-bold text-xs mt-1">#F3F3F4</div>
                    <div className="text-[9px] text-neutral-500 mt-1">OFF-WHITE CONT</div>
                  </div>
                  <div className="border border-black p-2 bg-neutral-50 text-black">
                    <div className="text-[9px] text-neutral-500 uppercase">BORDER RULE</div>
                    <div className="font-bold text-xs mt-1">#000000</div>
                    <div className="text-[9px] text-neutral-500 mt-1">1PX SOLID</div>
                  </div>
                  <div className="border border-black p-2 bg-black text-white">
                    <div className="text-[9px] text-neutral-300 uppercase">ACCENT / INVERSE</div>
                    <div className="font-bold text-xs mt-1">INVERSE_FILL</div>
                    <div className="text-[9px] text-neutral-400 mt-1">HIGH CONTRAST</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMN 3: TOUCHPOINTS BRANDING */}
          <div className="space-y-6">
            <div className="border border-black p-4 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase">SECTION C</span>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-black">TOUCHPOINTS BRANDING</h4>
                </div>
                <span className="text-[10px] text-neutral-500">OMNICHANNEL</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-black">01 // CLIENT BOOKING PORTAL THEME</div>
                <div>
                  <label className="text-neutral-500 uppercase text-[10px] block mb-1">HEADER BRAND TAGLINE</label>
                  <input 
                    type="text" 
                    defaultValue="Luxury Pet Care & Dedicated Canine Styling" 
                    className="w-full border border-black p-2 font-bold bg-neutral-50 focus:bg-white focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="text-neutral-500 uppercase text-[10px] block mb-1">CUSTOMER PORTAL HERO BANNER</label>
                  <div className="border border-black p-2 bg-neutral-50 flex items-center justify-between">
                    <span className="text-xs">BANNER_PAWZ_MONO_DARK.PNG</span>
                    <button 
                      onClick={() => showNotification('Banner configure tool opened')}
                      className="border border-black px-2 py-0.5 text-[10px] uppercase font-bold hover:bg-black hover:text-white"
                    >
                      CONFIGURE
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-3 border-t border-black">
                <div className="text-[11px] font-bold uppercase tracking-wider text-black">02 // PHYSICAL POS &amp; IN-SALON COLLATERAL</div>
                <div>
                  <label className="text-neutral-500 uppercase text-[10px] block mb-1">THERMAL RECEIPT FOOTER TEXT</label>
                  <textarea 
                    rows={2} 
                    defaultValue="Thank you for trusting us with your furry family! Texas Rabies Reg #826 compliant." 
                    className="w-full border border-black p-2 bg-neutral-50 focus:bg-white focus:outline-none text-xs"
                  />
                </div>
                <div className="border border-black p-2.5 bg-neutral-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs uppercase text-black">DOG COLLAR TAG BRANDING PRINT</div>
                    <div className="text-[10px] text-neutral-500">DIRECT THERMAL PRINT TEMPLATE</div>
                  </div>
                  <span className="bg-black text-white text-[10px] px-2 py-0.5 font-bold uppercase">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: OPERATING & HOLIDAY HOURS
         ======================================================== */}
      {activeSubTab === 'hours' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            
            {/* SECTION A: FACILITY SELECTOR */}
            <div className="border border-black p-5 bg-white">
              <div className="flex items-center justify-between border-b border-black pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-black"></span>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-black">SECTION A: FACILITY SELECTOR &amp; TIMEZONE CONFIG</h3>
                </div>
                <span className="text-[10px] text-neutral-500 uppercase">CONFIG_SYNC: REALTIME</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] text-neutral-500 uppercase mb-1">ACTIVE LOCATION PROFILE</label>
                  <select 
                    value={selectedHoursLoc}
                    onChange={(e) => setSelectedHoursLoc(e.target.value)}
                    className="w-full border border-black p-2 bg-white font-bold focus:outline-none"
                  >
                    <option value="FRISCO MAIN HQ">FRISCO MAIN HQ (1234 MAPLE DRIVE) [PRIMARY]</option>
                    <option value="PLANO WEST BRANCH">PLANO WEST BRANCH (5800 LEGACY DRIVE)</option>
                    <option value="MOBILE GROOMING VAN FLEET">MOBILE GROOMING VAN FLEET (DISPATCH HUB)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 uppercase mb-1">PRIMARY TIMEZONE / CLOCK</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value="America/Chicago (CST / UTC-06:00)" 
                      className="flex-1 border border-black p-2 bg-neutral-50 font-bold focus:outline-none"
                    />
                    <div className="border border-black px-2 py-2 bg-neutral-100 flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-neutral-600">DST:</span>
                      <span className="bg-black text-white text-[9px] px-1.5 py-0.5 font-bold">ENABLED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B: STANDARD WEEKLY OPERATING SCHEDULE */}
            <div className="border border-black p-5 bg-white">
              <div className="flex items-center justify-between border-b border-black pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-black"></span>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-black">
                    SECTION B: STANDARD WEEKLY OPERATING SCHEDULE ({selectedHoursLoc})
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => showNotification('Schedule copied to all secondary branches!')}
                    className="border border-black px-2.5 py-1 text-xs font-bold hover:bg-neutral-100 uppercase"
                  >
                    [COPY SCHEDULE TO OTHER LOCATIONS]
                  </button>
                  <button 
                    onClick={() => showNotification('Schedule edit mode enabled')}
                    className="bg-black text-white px-2.5 py-1 text-xs font-bold hover:bg-neutral-800 uppercase"
                  >
                    [EDIT HOURS]
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-black">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100 border-b border-black text-[10px] uppercase text-neutral-600">
                    <tr>
                      <th className="p-2.5 border-r border-black">DAY OF WEEK</th>
                      <th className="p-2.5 border-r border-black">OPERATIONAL HOURS</th>
                      <th className="p-2.5 border-r border-black">BAY SHIFTS &amp; CAPACITY</th>
                      <th className="p-2.5 border-r border-black">BREAK / SANITATION</th>
                      <th className="p-2.5 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black">
                    {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'].map(day => (
                      <tr key={day} className="hover:bg-neutral-50">
                        <td className="p-2.5 font-bold border-r border-black text-black">{day}</td>
                        <td className="p-2.5 border-r border-black font-bold">07:30 AM - 06:30 PM</td>
                        <td className="p-2.5 border-r border-black text-neutral-600">2 Shifts // 8 Bays Active</td>
                        <td className="p-2.5 border-r border-black text-neutral-500">12:30 PM - 01:00 PM (Sanitize)</td>
                        <td className="p-2.5 text-right">
                          <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase">OPEN</span>
                        </td>
                      </tr>
                    ))}
                    <tr className="hover:bg-neutral-50">
                      <td className="p-2.5 font-bold border-r border-black text-black">SATURDAY</td>
                      <td className="p-2.5 border-r border-black font-bold">08:00 AM - 05:00 PM</td>
                      <td className="p-2.5 border-r border-black text-neutral-600">1 Extended Shift // 8 Bays Active</td>
                      <td className="p-2.5 border-r border-black text-neutral-500">12:00 PM - 12:30 PM (Sanitize)</td>
                      <td className="p-2.5 text-right">
                        <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase">OPEN</span>
                      </td>
                    </tr>
                    <tr className="bg-neutral-100">
                      <td className="p-2.5 font-bold border-r border-black text-neutral-500">SUNDAY</td>
                      <td className="p-2.5 border-r border-black text-neutral-500 italic">CLOSED (BOARDING ON-CALL)</td>
                      <td className="p-2.5 border-r border-black text-neutral-500">Emergency Sanitation Maint Only</td>
                      <td className="p-2.5 border-r border-black text-neutral-400">—</td>
                      <td className="p-2.5 text-right">
                        <span className="border border-black px-2 py-0.5 text-[10px] font-bold uppercase bg-white text-black">CLOSED</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* COLUMN 3: HOLIDAY CLOSURES & WEATHER OVERRIDE */}
          <div className="space-y-6">
            <div className="border border-black p-4 bg-white">
              <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-black"></span>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-black">SECTION C: 2025 HOLIDAY CLOSURES</h4>
                </div>
                <span className="text-[10px] text-neutral-500">OBSERVED: 7</span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: 'MEMORIAL DAY', date: 'MAY 26, 2025 // ALL FACILITIES', status: 'FULL CLOSURE' },
                  { name: 'INDEPENDENCE DAY', date: 'JULY 4, 2025 // ALL FACILITIES', status: 'FULL CLOSURE' },
                  { name: 'LABOR DAY', date: 'SEPT 1, 2025 // ALL FACILITIES', status: 'FULL CLOSURE' },
                  { name: 'THANKSGIVING DAY', date: 'NOV 27, 2025 // ALL FACILITIES', status: 'FULL CLOSURE' },
                  { name: 'CHRISTMAS DAY', date: 'DEC 25, 2025 // ALL FACILITIES', status: 'FULL CLOSURE' }
                ].map(h => (
                  <div key={h.name} className="border border-black p-2.5 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-bold uppercase text-black">{h.name}</div>
                      <div className="text-[10px] text-neutral-500">{h.date}</div>
                    </div>
                    <span className="border border-black bg-neutral-100 text-[10px] px-2 py-0.5 font-bold uppercase">
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-black">
                <button 
                  onClick={() => showNotification('Add holiday dialog triggered')}
                  className="w-full border border-black bg-neutral-100 hover:bg-neutral-200 py-2 text-xs font-bold uppercase"
                >
                  + ADD CUSTOM HOLIDAY / EXCEPTION
                </button>
              </div>
            </div>

            {/* EMERGENCY WEATHER OVERRIDE */}
            <div className="border border-black p-4 bg-neutral-50">
              <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-black"></span>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-black">SECTION D: WEATHER OVERRIDE</h4>
                </div>
                <span className="bg-black text-white text-[9px] px-1.5 py-0.5 font-bold uppercase">IDLE - NORMAL</span>
              </div>
              <p className="text-xs text-neutral-600 mb-3">
                North Texas extreme freeze and storm protocol. When triggered, locks online scheduling instantly and triggers Twilio batch SMS broadcast.
              </p>
              <button 
                onClick={() => showNotification('Emergency weather lockdown triggered!')}
                className="w-full bg-black text-white hover:bg-neutral-800 py-2 text-xs font-bold uppercase transition-colors"
              >
                [ACTIVATE EMERGENCY OVERRIDE &amp; NOTIFY]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 4: SOCIAL LINKS & DIRECTORIES
         ======================================================== */}
      {activeSubTab === 'social' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            
            {/* PUBLIC DIRECTORIES & LOCAL SEO SYNC */}
            <div className="border border-black p-5 bg-white space-y-4">
              <div className="flex items-start justify-between border-b border-black pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase bg-black text-white px-2 py-0.5">SECTION A</span>
                    <h3 className="font-bold text-base uppercase text-black">PUBLIC DIRECTORIES &amp; LOCAL SEO SYNC</h3>
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    MULTI-LOCATION LISTINGS // MAP PACK VISIBILITY // REALTIME REPUTATION FEED
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => showNotification('NAP consistency audit: 100% PASS')}
                    className="border border-black px-2 py-1 text-xs font-bold hover:bg-neutral-100 uppercase"
                  >
                    [CHECK NAP CONSISTENCY]
                  </button>
                  <button 
                    onClick={() => showNotification('Force sync completed across all directories!')}
                    className="bg-black text-white px-2.5 py-1 text-xs font-bold hover:bg-neutral-800 uppercase"
                  >
                    [FORCE ALL SYNC]
                  </button>
                </div>
              </div>

              <div className="border border-black p-4 bg-neutral-50 space-y-3">
                <div className="flex items-center justify-between border-b border-black pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase text-sm text-black">GOOGLE BUSINESS PROFILE (GBP) API</span>
                    <span className="bg-black text-white text-[10px] px-1.5 py-0.2 font-bold">CONNECTED // OAUTH2</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">AUTO-DISPATCH: 15 MIN</span>
                </div>

                <div className="space-y-2">
                  {[
                    { name: '01. FRISCO HQ LISTING', rating: '4.9★ (342 Reviews) • Collin County Node', status: 'SYNCED [REALTIME]' },
                    { name: '02. PLANO WEST BRANCH', rating: '4.8★ (118 Reviews) • 5800 Legacy Dr', status: 'SYNCED' },
                    { name: '03. MOBILE VAN FLEET', rating: 'Service-Area Business (SAB) verified across North Texas', status: 'SAB VERIFIED' }
                  ].map(item => (
                    <div key={item.name} className="border border-black p-2.5 bg-white flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold uppercase text-black">{item.name}</span>
                          <span className="border border-black text-[10px] px-1.5 py-0.2 bg-green-50 uppercase font-bold">{item.status}</span>
                        </div>
                        <div className="text-[11px] text-neutral-500">{item.rating}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => showNotification(`Synced ${item.name}`)}
                          className="border border-black px-2 py-1 text-[10px] font-bold hover:bg-neutral-100 uppercase"
                        >
                          [SYNC NOW]
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SOCIAL MEDIA PLATFORMS */}
            <div className="border border-black p-5 bg-white space-y-4">
              <div className="flex items-start justify-between border-b border-black pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase bg-black text-white px-2 py-0.5">SECTION B</span>
                    <h3 className="font-bold text-base uppercase text-black">SOCIAL MEDIA PLATFORMS &amp; CHANNELS</h3>
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">CROSS-POSTING HOOKS &amp; SYNDICATION</div>
                </div>
                <button 
                  onClick={() => showNotification('Add channel dialog opened')}
                  className="border border-black px-2 py-1 text-xs font-bold hover:bg-neutral-100 uppercase"
                >
                  [ADD CHANNEL]
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'INSTAGRAM (@ALLABOUTPAWZ)', detail: 'Bio link mapped to /portal • Automated grooming before/after feed syndication [ACTIVE]', badge: '14.8K FOLLOWERS' },
                  { name: 'FACEBOOK BUSINESS PAGE', detail: 'Integrated Messenger webhook connected to salon reception desk inbox', badge: 'WEBHOOK CONNECTED' },
                  { name: 'TIKTOK // VIDEO SHOWCASE HUB', detail: 'Grooming transformations, doodle deshedding clip showcases, and technician highlights', badge: 'SYNCED' }
                ].map(s => (
                  <div key={s.name} className="border border-black p-3 bg-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold uppercase text-sm text-black">{s.name}</span>
                        <span className="bg-black text-white text-[10px] px-1.5 py-0.2 font-bold">{s.badge}</span>
                      </div>
                      <div className="text-[11px] text-neutral-600 mt-1">{s.detail}</div>
                    </div>
                    <button 
                      onClick={() => showNotification(`Testing hook for ${s.name}`)}
                      className="border border-black bg-white px-2 py-1 text-[10px] font-bold hover:bg-black hover:text-white uppercase"
                    >
                      [TEST HOOK]
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* COLUMN 3: CHANNEL SYNC HEALTH & SEO METRICS */}
          <div className="space-y-6">
            <div className="border border-black p-4 bg-white">
              <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-black">CHANNEL SYNC HEALTH</h4>
                <span className="text-[10px] text-neutral-500">ALL ENDPOINTS</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="border-2 border-black p-2.5 bg-neutral-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold uppercase text-black">GOOGLE BUSINESS PROFILE</div>
                    <div className="text-[10px] text-neutral-500">3 Nodes Synced // 4.9 Avg Stars</div>
                  </div>
                  <span className="bg-black text-white text-[10px] px-1.5 py-0.5 font-bold">100% OK</span>
                </div>
                <div className="border border-black p-2.5 bg-white flex items-center justify-between">
                  <div>
                    <div className="font-bold uppercase text-black">APPLE MAPS CONNECT</div>
                    <div className="text-[10px] text-neutral-500">Claimed // Placecards Live</div>
                  </div>
                  <span className="border border-black text-[10px] px-1.5 py-0.5 font-bold uppercase bg-green-50">HEALTHY</span>
                </div>
                <div className="border border-black p-2.5 bg-white flex items-center justify-between">
                  <div>
                    <div className="font-bold uppercase text-black">YELP PET SERVICES</div>
                    <div className="text-[10px] text-neutral-500">185 Reviews // CTA Bound</div>
                  </div>
                  <span className="border border-black text-[10px] px-1.5 py-0.5 font-bold uppercase bg-green-50">HEALTHY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 5: TAX & LEGAL ENTITY
         ======================================================== */}
      {activeSubTab === 'tax' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            
            {/* SECTION A: CORPORATE LEGAL ENTITY */}
            <div className="border border-black p-5 bg-white">
              <div className="flex items-center justify-between border-b border-black pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-black text-white font-bold flex items-center justify-center text-xs">
                    A
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base uppercase text-black">SECTION A: CORPORATE LEGAL ENTITY &amp; REGISTRATION</h3>
                      <span className="bg-black text-white text-[10px] px-1.5 py-0.2 font-bold uppercase">VERIFIED ENTITY</span>
                    </div>
                    <div className="text-xs text-neutral-500">TX SOS FILE: 0804921940 // REGISTRATION STATUS: ACTIVE GOOD STANDING</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => showNotification('Exporting Texas SOS Certificate (.PDF)')}
                    className="border border-black px-2 py-1 text-xs font-bold hover:bg-neutral-100 uppercase"
                  >
                    [EXPORT SOS CERT]
                  </button>
                  <button 
                    onClick={() => showNotification('Editing legal entity filings')}
                    className="bg-black text-white px-2 py-1 text-xs font-bold hover:bg-neutral-800 uppercase"
                  >
                    [EDIT FILING]
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] block">LEGAL BUSINESS NAME</span>
                  <p className="font-bold text-sm text-black">DAWG OS HOLDINGS LLC</p>
                  <p className="text-neutral-600">dba All About Pawz &amp; All About the Dawg</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] block">ENTITY STRUCTURE</span>
                  <p className="font-bold text-black">DOMESTIC LIMITED LIABILITY COMPANY</p>
                  <p className="text-neutral-500">Texas SOS File #0804921940 // Formation: 2021</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] block">FEDERAL TAX IDENTIFIER (EIN)</span>
                  <p className="font-bold text-sm text-black">XX-XXX9812</p>
                  <p className="text-neutral-500">[VERIFIED IRS FORM SS-4 ON FILE]</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] block">REGISTERED AGENT &amp; LEGAL ADDRESS</span>
                  <p className="font-bold text-black">1234 MAPLE DRIVE</p>
                  <p>FRISCO, TX 75034</p>
                  <p className="text-neutral-500">COUNTY: COLLIN // ZONE 1 HQ</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black bg-neutral-50 p-3 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold uppercase text-[11px] flex items-center gap-2 text-black">
                    <span className="w-2 h-2 bg-black inline-block"></span>
                    COMMERCIAL GENERAL LIABILITY &amp; GROOMING BAILMENT INSURANCE
                  </span>
                  <span className="bg-black text-white text-[9px] px-1.5 py-0.5 font-bold uppercase">STATUS: CURRENT</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-neutral-500 block text-[9px] uppercase">UNDERWRITER / POLICY #</span>
                    <span className="font-bold text-black">Lloyd&apos;s Underwriters #POL-VET-88390</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[9px] uppercase">COVERAGE LIMITS</span>
                    <span className="font-bold text-black">$2,000,000 Agg / $1,000,000 Occ</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[9px] uppercase">POLICY EXPIRATION</span>
                    <span className="font-bold text-black">Jan 15, 2026 (Auto-Renew)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B: MULTI-JURISDICTION SALES TAX ENGINE */}
            <div className="border border-black p-5 bg-white">
              <div className="flex items-center justify-between border-b border-black pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-black text-white font-bold flex items-center justify-center text-xs">
                    B
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base uppercase text-black">SECTION B: MULTI-JURISDICTION SALES TAX ENGINE</h3>
                      <span className="border border-black text-[10px] px-1.5 py-0.2 uppercase bg-neutral-100 font-bold">TX COMPTROLLER</span>
                    </div>
                    <div className="text-xs text-neutral-500">SALES &amp; USE TAX PERMIT: #32084918231 // FILING FREQUENCY: MONTHLY ELECTRONIC (EDI)</div>
                  </div>
                </div>
                <button 
                  onClick={() => showNotification('Nexus validation verified with Texas Comptroller!')}
                  className="border border-black px-2 py-1 text-xs font-bold hover:bg-neutral-100 uppercase"
                >
                  [RE-VALIDATE NEXUS]
                </button>
              </div>

              <div className="mb-4">
                <div className="text-xs uppercase text-neutral-500 mb-2 font-bold">TAX NEXUS BY OPERATING FACILITY</div>
                <div className="border border-black divide-y divide-black text-xs">
                  <div className="p-2.5 bg-neutral-100 font-bold grid grid-cols-12 gap-2 text-[10px] uppercase">
                    <div className="col-span-4">FACILITY &amp; JURISDICTION</div>
                    <div className="col-span-2 text-right">STATE</div>
                    <div className="col-span-2 text-right">COUNTY</div>
                    <div className="col-span-2 text-right">CITY / SP DIST</div>
                    <div className="col-span-2 text-right">TOTAL RATE</div>
                  </div>
                  <div className="p-2.5 bg-white grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4 font-bold text-black">FRISCO MAIN HQ<span className="block text-[10px] text-neutral-500 font-normal">COLLIN COUNTY</span></div>
                    <div className="col-span-2 text-right">6.25%</div>
                    <div className="col-span-2 text-right">0.00%</div>
                    <div className="col-span-2 text-right">2.00% (Frisco)</div>
                    <div className="col-span-2 text-right font-bold flex items-center justify-end gap-1.5">
                      <span>8.25%</span>
                      <span className="text-[9px] bg-black text-white px-1 py-0.2">ACTIVE</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-white grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4 font-bold text-black">PLANO WEST BRANCH<span className="block text-[10px] text-neutral-500 font-normal">DALLAS / COLLIN COUNTY</span></div>
                    <div className="col-span-2 text-right">6.25%</div>
                    <div className="col-span-2 text-right">0.00%</div>
                    <div className="col-span-2 text-right">2.00% (Plano)</div>
                    <div className="col-span-2 text-right font-bold flex items-center justify-end gap-1.5">
                      <span>8.25%</span>
                      <span className="text-[9px] bg-black text-white px-1 py-0.2">ACTIVE</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-white grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4 font-bold text-black">MOBILE VAN FLEET<span className="block text-[10px] text-neutral-500 font-normal">DESTINATION SOURCED</span></div>
                    <div className="col-span-2 text-right">6.25%</div>
                    <div className="col-span-2 text-right">0.00%</div>
                    <div className="col-span-2 text-right">Dynamic / ZIP</div>
                    <div className="col-span-2 text-right font-bold flex items-center justify-end gap-1.5">
                      <span>8.25%*</span>
                      <span className="text-[9px] bg-neutral-200 border border-black px-1 py-0.2">GEO</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION C: STATUTORY WAIVERS & VACCINE ENFORCEMENT */}
            <div className="border border-black p-5 bg-white">
              <div className="flex items-center justify-between border-b border-black pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-black text-white font-bold flex items-center justify-center text-xs">
                    C
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base uppercase text-black">SECTION C: STATUTORY WAIVERS, SIGN-OFFS &amp; VACCINE ENFORCEMENT</h3>
                      <span className="bg-black text-white text-[10px] px-1.5 py-0.2 font-bold uppercase">COMPLIANCE MANDATE</span>
                    </div>
                    <div className="text-xs text-neutral-500">TX HEALTH &amp; SAFETY CODE CH. 826 // DIGITAL SIGNATURE RETENTION GOVERNANCE</div>
                  </div>
                </div>
                <button 
                  onClick={() => showNotification('Waiver template editor opened')}
                  className="bg-black text-white px-3 py-1 text-xs font-bold hover:bg-neutral-800 uppercase"
                >
                  [UPDATE WAIVER TEMPLATE]
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="border border-black p-3 bg-neutral-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold uppercase text-black text-[11px]">TEXAS HEALTH &amp; SAFETY CODE CHAPTER 826 MANDATE</span>
                    <span className="bg-black text-white px-1.5 py-0.2 text-[9px] font-bold uppercase">STRICT ENFORCEMENT</span>
                  </div>
                  <p className="text-neutral-600 text-[11px]">
                    Mandatory rabies vaccination compliance verification required prior to check-in for all canines over 16 weeks of age. Unvaccinated intake is strictly blocked in calendar register.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border border-black p-3 bg-white space-y-1">
                    <span className="text-neutral-500 uppercase text-[10px] block">DIGITAL LIABILITY WAIVER VERSION</span>
                    <p className="font-bold text-sm text-black">V4.2-REV2025</p>
                    <p className="text-neutral-600 text-[11px]">Covers matted coat release, senior pet stress protocol, and emergency vet care authorization up to $1,500.</p>
                  </div>
                  <div className="border border-black p-3 bg-white space-y-1">
                    <span className="text-neutral-500 uppercase text-[10px] block">SIGNATURE ENCRYPTION &amp; RETENTION</span>
                    <p className="font-bold text-sm text-black">7 YEARS VAULT RETENTION</p>
                    <p className="text-neutral-600 text-[11px]">Encrypted in Supabase cold storage bucket (<code className="bg-neutral-100 px-1">legal_waivers_vault</code>) with immutable SHA-256 signatures.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMN 3: TAX CALENDAR & LEGAL DOSSIER */}
          <div className="space-y-6">
            <div className="border border-black p-4 bg-white">
              <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-black">TAX FILING CALENDAR</h4>
                <span className="text-[10px] bg-neutral-100 border border-black px-1 font-bold">YEAR 2025</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="border border-black p-2.5 bg-neutral-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-black">TX COMPTROLLER 01-2025</div>
                    <div className="text-[10px] text-neutral-500">DUE: FEB 20, 2025 // EDI #TX-8821</div>
                  </div>
                  <span className="bg-black text-white text-[10px] px-1.5 py-0.5 font-bold">FILED</span>
                </div>
                <div className="border border-black p-2.5 bg-neutral-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-black">TX COMPTROLLER 02-2025</div>
                    <div className="text-[10px] text-neutral-500">DUE: MAR 20, 2025 // EDI PENDING</div>
                  </div>
                  <span className="border border-black text-[10px] px-1.5 py-0.5 font-bold uppercase bg-white">UPCOMING</span>
                </div>
                <div className="border border-black p-2.5 bg-neutral-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-black">IRS 941 (Q1 PAYROLL TAX)</div>
                    <div className="text-[10px] text-neutral-500">DUE: APR 30, 2025 // EFTPS</div>
                  </div>
                  <span className="border border-black text-[10px] px-1.5 py-0.5 font-bold uppercase bg-white">SCHEDULED</span>
                </div>
              </div>
            </div>

            <div className="border border-black p-4 bg-neutral-50">
              <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-black">EXPORT LEGAL DOSSIER</h4>
                <span className="text-[10px] text-neutral-500">SECURE ARCHIVE</span>
              </div>
              <p className="text-xs text-neutral-600 mb-3">
                Download complete corporate binder including IRS SS-4, Texas SOS filing certificates, and insurance binders.
              </p>
              <button 
                onClick={() => showNotification('Legal Binder .ZIP archive downloaded')}
                className="w-full bg-black text-white py-2 text-xs uppercase font-bold hover:bg-neutral-800"
              >
                [DOWNLOAD LEGAL BINDER .ZIP]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TELEMETRY FOOTER */}
      <div className="border-t border-black bg-neutral-50 p-2.5 flex items-center justify-between text-[10px] text-neutral-600">
        <div className="flex items-center gap-4">
          <span>HOST: US-CENTRAL-NODE-01</span>
          <span>//</span>
          <span>LATENCY: 12ms</span>
          <span>//</span>
          <span>MULTI_LOC_STATUS: PASS (ALL NODES HEALTHY)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-neutral-500">DB: SUPABASE_POSTGRES_CORE</span>
          <span className="bg-black text-white px-2 py-0.5 font-bold">[V2.4 COMMIT]</span>
        </div>
      </div>

    </div>
  );
};
