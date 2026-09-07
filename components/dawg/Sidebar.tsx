'use client';

import React, { useState } from 'react';
import { DawgNavSection, LocationItem } from '@/lib/types';
import { 
  X, 
  ChevronDown, 
  Plus, 
  Building2, 
  MapPin, 
  Terminal, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { Tenant, fetchTenants, createTenant, createLocation } from '@/lib/supabase';

interface SidebarProps {
  activeSection: DawgNavSection;
  onSelectSection: (section: DawgNavSection) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  locationsList?: LocationItem[];
  currentTenant?: Tenant;
  onSelectTenant?: (tenant: Tenant) => void;
  onRefreshLocations?: () => void;
}

interface NavItem {
  id: DawgNavSection;
  num: string;
  label: string;
  badge: string;
}

interface NavSectionGroup {
  header: string;
  tag: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  mobileOpen,
  onCloseMobile,
  selectedLocation,
  onSelectLocation,
  locationsList = [],
  currentTenant = { id: '00000000-0000-0000-0000-000000000001', name: 'Primary Workspace', slug: 'primary-workspace', active: true },
  onSelectTenant,
  onRefreshLocations,
}) => {
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);

  // New Tenant form state
  const [newOrgName, setNewOrgName] = useState('');
  const [isCreatingTenant, setIsCreatingTenant] = useState(false);
  const [tenantList, setTenantList] = useState<Tenant[]>([currentTenant]);

  // New Location form state
  const [newLocName, setNewLocName] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocCity, setNewLocCity] = useState('Frisco');
  const [newLocState, setNewLocState] = useState('TX');
  const [newLocZip, setNewLocZip] = useState('75034');
  const [newLocType, setNewLocType] = useState('Branch Spa');
  const [isCreatingLocation, setIsCreatingLocation] = useState(false);

  // Load tenants on mount
  React.useEffect(() => {
    fetchTenants().then(t => {
      if (t && t.length > 0) setTenantList(t);
    }).catch(console.error);
  }, []);

  const handleCreateNewTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    setIsCreatingTenant(true);
    try {
      const created = await createTenant(newOrgName.trim());
      if (created) {
        setTenantList(prev => [...prev, created]);
        if (onSelectTenant) onSelectTenant(created);
        setShowAddTenantModal(false);
        setNewOrgName('');
      }
    } catch (err) {
      console.error('Failed to create tenant:', err);
    } finally {
      setIsCreatingTenant(false);
    }
  };

  const handleCreateNewLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim()) return;
    setIsCreatingLocation(true);
    try {
      const created = await createLocation({
        name: newLocName.trim(),
        tenant_id: currentTenant.id,
        address: newLocAddress.trim() || '100 Business Pkwy',
        city: newLocCity.trim() || 'Frisco',
        state: newLocState.trim() || 'TX',
        zip: newLocZip.trim() || '75034',
        type: newLocType,
        status: 'Active',
        station_count: 4,
        operating_hours: 'Mon-Sat: 8:00 AM – 6:00 PM',
        is_default: false
      });
      if (created) {
        onSelectLocation(created.name);
        if (onRefreshLocations) onRefreshLocations();
        setShowAddLocationModal(false);
        setNewLocName('');
        setNewLocAddress('');
      }
    } catch (err) {
      console.error('Failed to create location:', err);
    } finally {
      setIsCreatingLocation(false);
    }
  };

  const fallbackLocations = [
    'All About Pawz – Main Location',
    'All About Pawz – Westside Spa',
    'All About Pawz – Mobile Van #1',
  ];

  const displayLocations = locationsList && locationsList.length > 0
    ? locationsList.map(l => l.name)
    : fallbackLocations;

  const navSections: NavSectionGroup[] = [
    {
      header: 'SEC:01 // SALON OPERATIONS [CORE]',
      tag: 'SYS.OPS',
      items: [
        { id: 'dashboard', num: '01', label: 'Dashboard', badge: 'RT-01' },
        { id: 'appointments', num: '02', label: 'Appointments', badge: 'CAL' },
        { id: 'customers', num: '03', label: 'Customers & Pets', badge: 'DIR' },
        { id: 'staff', num: '04', label: 'Staff & Schedules', badge: 'ROTA' },
        { id: 'payments', num: '05', label: 'Walk-in Registers / POS', badge: 'TERM' },
      ],
    },
    {
      header: 'SEC:02 // ORDER MANAGEMENT // OMS [RETAIL]',
      tag: 'OMS.RET',
      items: [
        { id: 'orders', num: '06', label: 'Orders', badge: 'ACT' },
        { id: 'order-details', num: '07', label: 'Order Details', badge: 'DTL' },
        { id: 'inventory', num: '08', label: 'Products & Inventory', badge: 'SKU' },
        { id: 'shipping', num: '09', label: 'Shipping & Label Station', badge: 'SHIP' },
        { id: 'returns', num: '10', label: 'Returns & Exchanges', badge: 'RMA' },
        { id: 'purchase-orders', num: '11', label: 'Purchase Orders', badge: 'PO#' },
      ],
    },
    {
      header: 'SEC:03 // FINANCIAL & LEDGERS [ACCTS]',
      tag: 'FIN.LED',
      items: [
        { id: 'payments', num: '12', label: 'Payments', badge: 'PAY' },
        { id: 'invoices', num: '13', label: 'Invoices', badge: 'INV' },
        { id: 'deposits', num: '14', label: 'Deposits', badge: 'DEP' },
        { id: 'refunds', num: '15', label: 'Refunds', badge: 'RFD' },
        { id: 'gift-cards', num: '16', label: 'Gift Cards / Credits', badge: 'CRD' },
      ],
    },
    {
      header: 'SEC:04 // CMS & CONFIGURATION [SETUP]',
      tag: 'CFG.WIZ',
      items: [
        { id: 'services', num: '17', label: 'Services & Pricing', badge: 'SVC' },
        { id: 'settings', num: '18', label: 'Booking Wizard Config', badge: 'FLOW' },
        { id: 'documents', num: '19', label: 'Legal & Waivers', badge: 'DOC' },
        { id: 'marketing', num: '20', label: 'Website & Banners', badge: 'PUB' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside 
        id="dawg-sidebar-container"
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-black flex flex-col flex-shrink-0 h-full select-none transition-transform duration-200 ease-in-out font-mono ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand System Header */}
        <div className="p-3.5 border-b border-black flex items-center justify-between bg-white text-black flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-black text-white flex items-center justify-center text-[11px] font-black tracking-tighter">
              D
            </div>
            <div>
              <div className="text-xs font-black tracking-wider uppercase leading-none text-black flex items-center gap-1.5">
                <span>DAWG OS</span>
                <span className="text-[9px] px-1 py-0.2 bg-black text-white font-bold">V2.4</span>
              </div>
              <p className="text-[9px] text-gray-500 font-mono tracking-tight mt-0.5">SYS://ALL-ABOUT-PAWZ</p>
            </div>
          </div>
          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1 hover:bg-black hover:text-white border border-transparent hover:border-black transition-colors" 
            type="button"
            aria-label="Close Mobile Navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Section Hierarchy (Top Level) */}
        <nav 
          id="dawg-sidebar-nav" 
          className="flex-1 overflow-y-auto divide-y divide-black text-black custom-scrollbar select-none"
        >
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="border-b border-black">
              {/* Category Header: Brand Light Grey with Black Border */}
              <div className="px-3 py-1.5 bg-neutral-100 border-b border-black flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider text-black uppercase">
                  {sec.header}
                </span>
                <span className="text-[9px] font-mono font-bold px-1 py-0.2 bg-white text-neutral-600 border border-black">
                  {sec.tag}
                </span>
              </div>

              {/* Section Items */}
              <ul className="py-1">
                {sec.items.map((item) => {
                  const isActive = activeSection === item.id || 
                    (item.id === 'inventory' && activeSection === 'products-and-inventory') ||
                    (item.id === 'shipping' && activeSection === 'shipping-and-label-station') ||
                    (item.id === 'returns' && activeSection === 'returns-and-exchanges');

                  return (
                    <li key={`${sec.tag}-${item.num}-${item.id}`}>
                      <button
                        onClick={() => {
                          onSelectSection(item.id);
                          onCloseMobile();
                        }}
                        data-path={item.id}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-mono transition-none text-left cursor-pointer border-l-2 ${
                          isActive
                            ? 'font-bold bg-black text-white border-orange-500'
                            : 'font-normal text-neutral-700 hover:bg-neutral-100 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-orange-400' : 'text-neutral-400'}`}>
                            {item.num}
                          </span>
                          <span className="truncate text-[11px] tracking-tight">{item.label}</span>
                        </div>
                        <span className={`text-[9px] font-mono px-1 py-0.2 border ${
                          isActive ? 'border-orange-400 text-orange-400 bg-black' : 'border-neutral-300 text-neutral-500 bg-white'
                        }`}>
                          {item.badge}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* BOTTOM SECTION: Salon Location & Organization Switchers */}
        <div className="border-t-2 border-black bg-neutral-50 p-2.5 space-y-2 flex-shrink-0 text-[10px] font-mono">
          {/* Active Salon Location Selector */}
          <div className="relative">
            <div className="flex items-center justify-between text-[9px] font-bold text-neutral-600 uppercase px-1 mb-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-orange-600" />
                <span>ACTIVE LOCATION</span>
              </span>
              <span className="text-[8px] bg-emerald-600 text-white px-1 font-bold">ONLINE</span>
            </div>
            <button
              onClick={() => {
                setShowLocationMenu(!showLocationMenu);
                setShowTenantMenu(false);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-left border border-black hover:bg-white text-[11px] bg-white text-black cursor-pointer font-bold"
            >
              <span className="truncate uppercase">{selectedLocation}</span>
              <ChevronDown className="w-3 h-3 text-black flex-shrink-0" />
            </button>

            {showLocationMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border-2 border-black p-1.5 z-50 space-y-1 shadow-2xl">
                <div className="px-1.5 py-0.5 text-[9px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
                  Select Active Facility
                </div>
                {displayLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      onSelectLocation(loc);
                      setShowLocationMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 text-[10px] truncate transition-none cursor-pointer border flex items-center justify-between ${
                      selectedLocation === loc ? 'bg-black text-white border-black font-bold' : 'text-black border-transparent hover:bg-neutral-100'
                    }`}
                  >
                    <span className="truncate">{loc}</span>
                    {selectedLocation === loc && <Check className="w-3 h-3 text-orange-400 flex-shrink-0" />}
                  </button>
                ))}
                <div className="border-t border-black pt-1 mt-1">
                  <button
                    onClick={() => {
                      setShowLocationMenu(false);
                      setShowAddLocationModal(true);
                    }}
                    className="w-full text-left px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add New Location</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Business Organization Selector */}
          <div className="relative">
            <div className="flex items-center justify-between text-[9px] font-bold text-neutral-500 uppercase px-1 mb-0.5">
              <span>BUSINESS ENTITY</span>
              <span className="text-[8px] border border-black px-1 bg-white font-bold">HQ</span>
            </div>
            <button
              onClick={() => {
                setShowTenantMenu(!showTenantMenu);
                setShowLocationMenu(false);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1 text-left border border-neutral-300 hover:border-black text-[10px] bg-white text-neutral-800 cursor-pointer"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="w-3 h-3 text-neutral-600 flex-shrink-0" />
                <span className="truncate uppercase font-medium">{currentTenant.name}</span>
              </div>
              <ChevronDown className="w-2.5 h-2.5 text-neutral-600 flex-shrink-0" />
            </button>

            {showTenantMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border-2 border-black p-1.5 z-50 space-y-1 shadow-2xl">
                <div className="px-1.5 py-0.5 text-[9px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
                  Select Organization
                </div>
                {tenantList.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (onSelectTenant) onSelectTenant(t);
                      setShowTenantMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1 text-[10px] truncate transition-none cursor-pointer border flex items-center justify-between ${
                      currentTenant.id === t.id ? 'bg-black text-white border-black font-bold' : 'text-black border-transparent hover:bg-neutral-100'
                    }`}
                  >
                    <span className="truncate">{t.name}</span>
                    {currentTenant.id === t.id && <Check className="w-3 h-3 text-orange-400 flex-shrink-0" />}
                  </button>
                ))}
                <div className="border-t border-black pt-1 mt-1">
                  <button
                    onClick={() => {
                      setShowTenantMenu(false);
                      setShowAddTenantModal(true);
                    }}
                    className="w-full text-left px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add Business Entity</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Console Hub Button */}
          <button
            onClick={() => onSelectSection('settings')}
            className={`w-full flex items-center justify-between p-2 border border-black text-xs font-mono font-bold uppercase transition-none cursor-pointer ${
              activeSection === 'settings'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-black hover:text-white group'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span className="text-[11px]">ADMIN SETTINGS HUB</span>
            </div>
            <span className={`px-1 py-0.2 border text-[9px] font-bold ${
              activeSection === 'settings' ? 'border-orange-400 text-orange-400 bg-neutral-900' : 'border-black text-black group-hover:border-white group-hover:text-white'
            }`}>
              RESTRICTED
            </span>
          </button>

          <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 px-1 pt-0.5">
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
              <span>3 SALONS OPERATIONAL</span>
            </span>
            <span>STAFF READY</span>
          </div>
        </div>
      </aside>

      {/* Modal: Add New Organization / Tenant */}
      {showAddTenantModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase tracking-tight">Create Organization / Tenant</h3>
              </div>
              <button 
                onClick={() => setShowAddTenantModal(false)}
                className="p-1 hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTenant} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Organization Name</label>
                <input
                  autoFocus
                  type="text"
                  required
                  placeholder="e.g. All About Pawz Dallas East"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="w-full px-3 py-2 border border-black bg-white text-xs font-bold focus:outline-none"
                />
              </div>

              <div className="bg-gray-50 border border-black/20 p-2 text-[10px] text-gray-600 space-y-1">
                <p className="font-bold text-black uppercase">Multitenant Isolation Notice:</p>
                <p>Creating a new organization generates an isolated tenant workspace with separate staff, orders, customer profiles, and RLS security boundaries.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black">
                <button
                  type="button"
                  onClick={() => setShowAddTenantModal(false)}
                  className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTenant}
                  className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase cursor-pointer border border-black flex items-center gap-1.5"
                >
                  {isCreatingTenant ? 'Provisioning...' : '+ Create Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Multiple Locations */}
      {showAddLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-lg w-full shadow-2xl p-5 space-y-4 font-mono text-black">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-black" />
                <h3 className="font-black text-sm uppercase tracking-tight">Add Location to Tenant</h3>
              </div>
              <button 
                onClick={() => setShowAddLocationModal(false)}
                className="p-1 hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewLocation} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Branch / Location Name</label>
                <input
                  autoFocus
                  type="text"
                  required
                  placeholder="e.g. All About Pawz – Legacy West Spa"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  className="w-full px-3 py-2 border border-black bg-white font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Location Type</label>
                  <select
                    value={newLocType}
                    onChange={(e) => setNewLocType(e.target.value)}
                    className="w-full px-2 py-2 border border-black bg-white font-bold focus:outline-none"
                  >
                    <option>Main Location</option>
                    <option>Branch Spa</option>
                    <option>Mobile Van Fleet</option>
                    <option>Retail Hub & Salon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 7820 Legacy Dr Suite 100"
                    value={newLocAddress}
                    onChange={(e) => setNewLocAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-black bg-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newLocCity}
                    onChange={(e) => setNewLocCity(e.target.value)}
                    className="w-full px-2 py-1.5 border border-black bg-white font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={newLocState}
                    onChange={(e) => setNewLocState(e.target.value)}
                    className="w-full px-2 py-1.5 border border-black bg-white font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">ZIP</label>
                  <input
                    type="text"
                    value={newLocZip}
                    onChange={(e) => setNewLocZip(e.target.value)}
                    className="w-full px-2 py-1.5 border border-black bg-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-gray-50 border border-black/20 p-2 text-[10px] text-gray-600">
                <span>Bound to Tenant: <strong>{currentTenant.name}</strong> ({currentTenant.id.slice(0, 8)}...)</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black">
                <button
                  type="button"
                  onClick={() => setShowAddLocationModal(false)}
                  className="px-3 py-1.5 border border-black bg-white hover:bg-gray-100 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingLocation}
                  className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase cursor-pointer border border-black flex items-center gap-1.5"
                >
                  {isCreatingLocation ? 'Saving...' : '+ Add Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

