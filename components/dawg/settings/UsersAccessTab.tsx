'use client';

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Mail, 
  Lock, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Key, 
  Shield, 
  UserCheck, 
  RefreshCw, 
  Search, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Plus,
  Send,
  MapPin,
  Clock,
  Smartphone,
  Save,
  Download
} from 'lucide-react';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  badgeId: string;
  assignedLocation: string;
  secondaryLocation?: string;
  roleTier: 'TIER 1: SUPER_ADMIN' | 'TIER 2: SALON MANAGER' | 'TIER 3: LEAD GROOMER' | 'TIER 3: MOBILE STYLIST' | 'TIER 4: RECEPTION & CASHIER' | 'TIER 5: OMS PACKER';
  roleCategory: 'super_admin' | 'manager' | 'groomer' | 'reception' | 'oms';
  roleSubtitle: string;
  accessScopes: string;
  accessDetail: string;
  status: 'ONLINE NOW' | 'ACTIVE TODAY' | 'ACTIVE (CLOCKED IN)' | 'ON ROUTE (GPS #02)' | 'OFFLINE';
  twoFactorType: string;
  avatarInitials: string;
}

export interface RoleTierDefinition {
  id: string;
  tierNum: number;
  name: string;
  category: 'super_admin' | 'manager' | 'groomer' | 'reception' | 'oms' | 'custom';
  description: string;
  usersBoundCount: number;
  permissions: {
    salonOps: {
      appointments: boolean;
      crm: boolean;
      rota: boolean;
      pos: boolean;
    };
    omsLogistics: {
      ordersQueue: boolean;
      productCatalog: boolean;
      purchaseOrders: boolean;
    };
    financialAccts: {
      paymentsDashboard: boolean;
      stripePayouts: boolean;
      taxJurisdiction: boolean;
    };
    bizOps: {
      operatingHours: boolean;
      staffCards: boolean;
      manageLocations: boolean;
    };
  };
}

const INITIAL_STAFF: StaffUser[] = [
  {
    id: 'staff-01',
    name: 'SYS ADMIN (DEV ROOT)',
    email: 'admin@allaboutpawz.com',
    badgeId: '#ADM-001',
    assignedLocation: 'ALL LOCATIONS',
    roleTier: 'TIER 1: SUPER_ADMIN',
    roleCategory: 'super_admin',
    roleSubtitle: 'BYPASS ALL POLICIES',
    accessScopes: 'GLOBAL: READ / WRITE / DELETE',
    accessDetail: 'FULL SYSTEM DOCK CONTROL',
    status: 'ONLINE NOW',
    twoFactorType: '2FA: ENFORCED (HARDWARE)',
    avatarInitials: 'SA'
  },
  {
    id: 'staff-02',
    name: 'DAVID CHEN',
    email: 'dchen@allaboutpawz.com',
    badgeId: '#MGR-014',
    assignedLocation: 'FRISCO HQ',
    secondaryLocation: 'PLANO WEST',
    roleTier: 'TIER 2: SALON MANAGER',
    roleCategory: 'manager',
    roleSubtitle: 'FACILITY ROSTER HEAD',
    accessScopes: 'SALON OPS: FULL R/W',
    accessDetail: 'FINANCE: READ-ONLY',
    status: 'ACTIVE TODAY',
    twoFactorType: '2FA: AUTH_APP (VERIFIED)',
    avatarInitials: 'DC'
  },
  {
    id: 'staff-03',
    name: 'SARAH MILLER',
    email: 'smiller@allaboutpawz.com',
    badgeId: '#GRM-008',
    assignedLocation: 'FRISCO HQ',
    secondaryLocation: 'BAY #01 // SENIOR STYLIST',
    roleTier: 'TIER 3: LEAD GROOMER',
    roleCategory: 'groomer',
    roleSubtitle: 'CANINE SPECIALIST',
    accessScopes: 'CALENDAR + PET CRM: R/W',
    accessDetail: 'POS: TIP & COMMISSIONS ONLY',
    status: 'ACTIVE (CLOCKED IN)',
    twoFactorType: '2FA: SMS OTP ACTIVE',
    avatarInitials: 'SM'
  },
  {
    id: 'staff-04',
    name: 'KEVIN DIAZ',
    email: 'kdiaz@allaboutpawz.com',
    badgeId: '#DRV-003',
    assignedLocation: 'MOBILE VAN FLEET',
    secondaryLocation: 'ASSIGNED: VAN-02',
    roleTier: 'TIER 3: MOBILE STYLIST',
    roleCategory: 'groomer',
    roleSubtitle: 'VAN OPERATOR & TECH',
    accessScopes: 'MOBILE DISPATCH: R/W',
    accessDetail: 'CLIENT GPS & CELLULAR TAP',
    status: 'ON ROUTE (GPS #02)',
    twoFactorType: '2FA: BIOMETRIC PASSOFF',
    avatarInitials: 'KD'
  },
  {
    id: 'staff-05',
    name: 'EMILY SANTOS',
    email: 'esantos@allaboutpawz.com',
    badgeId: '#OMS-022',
    assignedLocation: 'PLANO WEST HUB',
    secondaryLocation: 'FULFILLMENT PACK DOCK',
    roleTier: 'TIER 5: OMS PACKER',
    roleCategory: 'oms',
    roleSubtitle: 'INVENTORY & LABELS',
    accessScopes: 'OMS QUEUE + PACKING: R/W',
    accessDetail: 'SALON/CLIENT CRM: NO ACCESS',
    status: 'OFFLINE',
    twoFactorType: '2FA: SMS ACTIVE',
    avatarInitials: 'ES'
  }
];

const DEFAULT_ROLE_TIERS: RoleTierDefinition[] = [
  {
    id: 'tier-1',
    tierNum: 1,
    name: 'TIER 1: SUPER ADMIN',
    category: 'super_admin',
    description: 'Complete unrestricted root master clearance. Full system dock control, Supabase RLS bypass, Stripe merchant reconfiguration, and staff governance.',
    usersBoundCount: 3,
    permissions: {
      salonOps: { appointments: true, crm: true, rota: true, pos: true },
      omsLogistics: { ordersQueue: true, productCatalog: true, purchaseOrders: true },
      financialAccts: { paymentsDashboard: true, stripePayouts: true, taxJurisdiction: true },
      bizOps: { operatingHours: true, staffCards: true, manageLocations: true }
    }
  },
  {
    id: 'tier-2',
    tierNum: 2,
    name: 'TIER 2: SALON MANAGER',
    category: 'manager',
    description: 'Manages daily facility operations, appointments rota, inventory audits, and team shift reassignments. Inherits standard cashier and booking permissions.',
    usersBoundCount: 5,
    permissions: {
      salonOps: { appointments: true, crm: true, rota: true, pos: true },
      omsLogistics: { ordersQueue: true, productCatalog: true, purchaseOrders: true },
      financialAccts: { paymentsDashboard: true, stripePayouts: false, taxJurisdiction: false },
      bizOps: { operatingHours: true, staffCards: true, manageLocations: false }
    }
  },
  {
    id: 'tier-3',
    tierNum: 3,
    name: 'TIER 3: LEAD & PET GROOMER',
    category: 'groomer',
    description: 'Focused on salon grooming table execution, intake notes, canine temperament logs, timeclock stamps, and commission tracking.',
    usersBoundCount: 15,
    permissions: {
      salonOps: { appointments: true, crm: true, rota: false, pos: false },
      omsLogistics: { ordersQueue: false, productCatalog: false, purchaseOrders: false },
      financialAccts: { paymentsDashboard: false, stripePayouts: false, taxJurisdiction: false },
      bizOps: { operatingHours: false, staffCards: false, manageLocations: false }
    }
  },
  {
    id: 'tier-4',
    tierNum: 4,
    name: 'TIER 4: RECEPTION & CASHIER',
    category: 'reception',
    description: 'Front-desk point-of-sale checkout, phone bookings, client check-in intake, deposit collection, and walk-in queue management.',
    usersBoundCount: 4,
    permissions: {
      salonOps: { appointments: true, crm: true, rota: false, pos: true },
      omsLogistics: { ordersQueue: false, productCatalog: false, purchaseOrders: false },
      financialAccts: { paymentsDashboard: true, stripePayouts: false, taxJurisdiction: false },
      bizOps: { operatingHours: false, staffCards: false, manageLocations: false }
    }
  },
  {
    id: 'tier-5',
    tierNum: 5,
    name: 'TIER 5: OMS PACKER & LOGISTICS',
    category: 'oms',
    description: 'Fulfillment dock worker processing retail product shipments, printing courier labels, inventory receiving, and warehouse restocking.',
    usersBoundCount: 2,
    permissions: {
      salonOps: { appointments: false, crm: false, rota: false, pos: false },
      omsLogistics: { ordersQueue: true, productCatalog: true, purchaseOrders: true },
      financialAccts: { paymentsDashboard: false, stripePayouts: false, taxJurisdiction: false },
      bizOps: { operatingHours: false, staffCards: false, manageLocations: false }
    }
  }
];

export const UsersAccessTab: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffUser[]>(INITIAL_STAFF);
  const [roleTiers, setRoleTiers] = useState<RoleTierDefinition[]>(DEFAULT_ROLE_TIERS);
  const [selectedRoleTierId, setSelectedRoleTierId] = useState<string>('tier-2');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');

  // Modals & UI Feedback
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Invite Form State
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<StaffUser['roleTier']>('TIER 2: SALON MANAGER');
  const [inviteLocation, setInviteLocation] = useState('FRISCO HQ');

  // Custom Role Form State
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [baseTierInherit, setBaseTierInherit] = useState('tier-2');

  // Magic Link State
  const [magicLinkEmail, setMagicLinkEmail] = useState('');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const selectedRole = roleTiers.find(r => r.id === selectedRoleTierId) || roleTiers[1];

  const handleTogglePermission = (
    module: 'salonOps' | 'omsLogistics' | 'financialAccts' | 'bizOps',
    key: string
  ) => {
    setRoleTiers(prev => prev.map(role => {
      if (role.id !== selectedRoleTierId) return role;
      const modObj = role.permissions[module] as Record<string, boolean>;
      return {
        ...role,
        permissions: {
          ...role.permissions,
          [module]: {
            ...modObj,
            [key]: !modObj[key]
          }
        }
      };
    }));
  };

  const handleSavePermissions = () => {
    showNotification(`Permissions saved for role: ${selectedRole.name}!`);
  };

  const handleCloneRole = () => {
    const cloned: RoleTierDefinition = {
      ...selectedRole,
      id: `role-custom-${Date.now()}`,
      name: `${selectedRole.name} (CLONE)`,
      category: 'custom',
      usersBoundCount: 0
    };
    setRoleTiers([...roleTiers, cloned]);
    setSelectedRoleTierId(cloned.id);
    showNotification(`Cloned role tier: ${cloned.name}`);
  };

  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const base = roleTiers.find(r => r.id === baseTierInherit) || roleTiers[1];
    const newRole: RoleTierDefinition = {
      id: `role-custom-${Date.now()}`,
      tierNum: roleTiers.length + 1,
      name: newRoleName.toUpperCase(),
      category: 'custom',
      description: newRoleDesc || 'Custom salon RBAC role definition.',
      usersBoundCount: 0,
      permissions: JSON.parse(JSON.stringify(base.permissions))
    };

    setRoleTiers([...roleTiers, newRole]);
    setSelectedRoleTierId(newRole.id);
    setIsCreateRoleModalOpen(false);
    setNewRoleName('');
    setNewRoleDesc('');
    showNotification(`Created new role: ${newRole.name}`);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newStaff: StaffUser = {
      id: `staff-${Date.now()}`,
      name: inviteName.toUpperCase(),
      email: inviteEmail.toLowerCase(),
      badgeId: `#USR-${Math.floor(100 + Math.random() * 900)}`,
      assignedLocation: inviteLocation,
      roleTier: inviteRole,
      roleCategory: 'manager',
      roleSubtitle: 'NEWLY PROVISIONED',
      accessScopes: 'CUSTOM POLICY ATTACHED',
      accessDetail: 'INVITATION PENDING',
      status: 'ACTIVE TODAY',
      twoFactorType: '2FA: PENDING SETUP',
      avatarInitials: inviteName.slice(0, 2).toUpperCase()
    };

    setStaffList([newStaff, ...staffList]);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    showNotification(`Invite link generated & queued for ${inviteEmail}!`);
  };

  const handleGenerateMagicLink = () => {
    if (!magicLinkEmail.trim()) return;
    showNotification(`Client magic login OTP dispatched to ${magicLinkEmail}!`);
    setMagicLinkEmail('');
  };

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.badgeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.roleTier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = 
      roleFilter === 'ALL' ||
      (roleFilter === 'TIER 1' && staff.roleTier.includes('TIER 1')) ||
      (roleFilter === 'TIER 2' && staff.roleTier.includes('TIER 2')) ||
      (roleFilter === 'TIER 3' && staff.roleTier.includes('TIER 3')) ||
      (roleFilter === 'TIER 4' && staff.roleTier.includes('TIER 4')) ||
      (roleFilter === 'TIER 5' && staff.roleTier.includes('TIER 5'));

    const matchesLocation = 
      locationFilter === 'ALL' ||
      staff.assignedLocation.toUpperCase().includes(locationFilter.toUpperCase());

    return matchesSearch && matchesRole && matchesLocation;
  });

  return (
    <div className="space-y-6 font-mono">
      
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white border-2 border-white px-4 py-2.5 shadow-2xl flex items-center gap-2 text-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="font-bold">{notification}</span>
        </div>
      )}

      {/* TOP HEADER & STATS OVERVIEW */}
      <div className="border border-black bg-white p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase text-neutral-500 tracking-wider">
              BUSINESS OPS // ACCESS GOVERNANCE &amp; RBAC // MULTI-LOCATION MATRIX
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight mt-1 text-black">
              USERS, STAFF, ROLES &amp; PERMISSIONS
            </h2>
            <p className="text-xs text-neutral-600 mt-1 max-w-3xl">
              Administer employee rosters, define granular RBAC role tiers, manage cross-facility access scopes, audit active operator sessions, and configure client portal auth credentials.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="border border-black bg-white px-3 py-1.5 hover:bg-black hover:text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ INVITE NEW USER</span>
            </button>
            <button 
              onClick={() => setIsCreateRoleModalOpen(true)}
              className="border border-black bg-white px-3 py-1.5 hover:bg-black hover:text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>+ CREATE CUSTOM ROLE</span>
            </button>
            <button 
              onClick={() => showNotification('Audit ledger log exported (.CSV)!')}
              className="bg-black text-white px-3.5 py-1.5 hover:bg-neutral-800 font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>[EXPORT AUDIT LOG]</span>
            </button>
          </div>
        </div>

        {/* 6 KPI TILES */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4 pt-4 border-t border-black">
          <div className="border border-black p-2.5 bg-neutral-50 text-right min-w-[100px]">
            <div className="text-[9px] text-neutral-500 uppercase">TOTAL STAFF</div>
            <div className="text-lg font-bold">24 ACTIVE</div>
          </div>
          <div className="border border-black p-2.5 bg-neutral-50 text-right min-w-[100px]">
            <div className="text-[9px] text-neutral-500 uppercase">SUPER ADMINS</div>
            <div className="text-lg font-bold">03 ROOT</div>
          </div>
          <div className="border border-black p-2.5 bg-neutral-50 text-right min-w-[100px]">
            <div className="text-[9px] text-neutral-500 uppercase">GROOMERS</div>
            <div className="text-lg font-bold">15 ACTIVE</div>
          </div>
          <div className="border border-black p-2.5 bg-neutral-50 text-right min-w-[100px]">
            <div className="text-[9px] text-neutral-500 uppercase">RECEPTION/POS</div>
            <div className="text-lg font-bold">04 CASHIERS</div>
          </div>
          <div className="border border-black p-2.5 bg-neutral-50 text-right min-w-[100px]">
            <div className="text-[9px] text-neutral-500 uppercase">PENDING INVITES</div>
            <div className="text-lg font-bold text-black">02 QUEUED</div>
          </div>
          <div className="border border-black p-2.5 bg-neutral-50 text-right min-w-[100px]">
            <div className="text-[9px] text-neutral-500 uppercase">ROLE TIERS</div>
            <div className="text-lg font-bold">{roleTiers.length} DEFINED</div>
          </div>
        </div>
      </div>

      {/* MAIN CONFIGURATION GRID (BIFURCATED) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* COLUMN 1 & 2: STAFF & USER DIRECTORY + CLIENT PORTAL */}
        <div className="xl:col-span-2 space-y-4">
          
          {/* FILTER & SEARCH BAR */}
          <div className="border border-black p-3 bg-neutral-50 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[300px]">
                <div className="relative flex-1">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search staff, email, role, badge ID... [CTRL+K]"
                    className="w-full border border-black px-3 py-1.5 bg-white text-xs placeholder:text-neutral-400 focus:outline-none"
                  />
                </div>
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border border-black px-2 py-1.5 bg-white text-xs focus:outline-none"
                >
                  <option value="ALL">ROLE: ALL ROLES (5 TIERS)</option>
                  <option value="TIER 1">TIER 1: SUPER ADMIN</option>
                  <option value="TIER 2">TIER 2: SALON MANAGER</option>
                  <option value="TIER 3">TIER 3: LEAD &amp; PET GROOMER</option>
                  <option value="TIER 4">TIER 4: RECEPTION &amp; POS CASHIER</option>
                  <option value="TIER 5">TIER 5: LOGISTICS &amp; OMS PACKER</option>
                </select>
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="border border-black px-2 py-1.5 bg-white text-xs focus:outline-none"
                >
                  <option value="ALL">LOC: ALL LOCATIONS</option>
                  <option value="FRISCO">FRISCO HQ (MAIN LOC)</option>
                  <option value="PLANO">PLANO WEST BRANCH</option>
                  <option value="MOBILE">MOBILE VAN FLEET</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-500 uppercase">
                  VIEWING {filteredStaff.length} OF {staffList.length} USERS
                </span>
                <button 
                  onClick={() => { setSearchQuery(''); setRoleFilter('ALL'); setLocationFilter('ALL'); }}
                  className="border border-black bg-white px-2 py-1 hover:bg-black hover:text-white font-bold text-xs uppercase"
                >
                  RESET
                </button>
              </div>
            </div>
          </div>

          {/* STAFF DIRECTORY DATA TABLE */}
          <div className="border border-black bg-white overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-black text-[10px] uppercase font-bold tracking-wider text-black">
                    <th className="p-2.5 border-r border-black">STAFF MEMBER &amp; CONTACT</th>
                    <th className="p-2.5 border-r border-black">ASSIGNED LOCATION</th>
                    <th className="p-2.5 border-r border-black">ROLE TIER</th>
                    <th className="p-2.5 border-r border-black">ACCESS SCOPES</th>
                    <th className="p-2.5 border-r border-black">STATUS &amp; 2FA</th>
                    <th className="p-2.5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black text-[11px]">
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-2.5 border-r border-black">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-black text-white flex items-center justify-center font-bold text-[9px]">
                            {staff.avatarInitials}
                          </span>
                          <div>
                            <div className="font-bold uppercase text-xs text-black">{staff.name}</div>
                            <div className="text-neutral-500 text-[10px]">{staff.email} // {staff.badgeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2.5 border-r border-black font-bold uppercase">
                        {staff.assignedLocation === 'ALL LOCATIONS' ? (
                          <span className="bg-black text-white px-1.5 py-0.5 text-[9px]">ALL LOCATIONS</span>
                        ) : (
                          <span>{staff.assignedLocation}</span>
                        )}
                        {staff.secondaryLocation && (
                          <div className="text-neutral-500 text-[10px] mt-0.5">{staff.secondaryLocation}</div>
                        )}
                      </td>
                      <td className="p-2.5 border-r border-black">
                        <span className="border border-black bg-neutral-100 px-1.5 py-0.2 font-bold text-[10px] inline-block">
                          {staff.roleTier}
                        </span>
                        <div className="text-neutral-500 text-[9px] mt-0.5">{staff.roleSubtitle}</div>
                      </td>
                      <td className="p-2.5 border-r border-black text-[10px]">
                        <div className="font-bold text-black">{staff.accessScopes}</div>
                        <div className="text-neutral-500">{staff.accessDetail}</div>
                      </td>
                      <td className="p-2.5 border-r border-black">
                        <span className="bg-green-50 border border-black px-1.5 py-0.2 font-bold text-[10px] inline-block">
                          {staff.status}
                        </span>
                        <div className="text-[9px] text-neutral-500 mt-0.5">{staff.twoFactorType}</div>
                      </td>
                      <td className="p-2.5 text-right space-y-1">
                        <button 
                          onClick={() => {
                            const matchedTier = roleTiers.find(r => staff.roleTier.includes(r.name.split(':')[0])) || roleTiers[1];
                            setSelectedRoleTierId(matchedTier.id);
                            showNotification(`Inspecting RBAC policy for ${staff.name}`);
                          }}
                          className="border border-black px-1.5 py-0.5 text-[10px] font-bold hover:bg-black hover:text-white block w-full uppercase transition-colors"
                        >
                          INSPECT MATRIX
                        </button>
                        <button 
                          onClick={() => showNotification(`Location re-assignment dialog ready for ${staff.name}`)}
                          className="border border-black px-1.5 py-0.5 text-[10px] font-bold hover:bg-neutral-200 block w-full uppercase"
                        >
                          REASSIGN LOC
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TABLE PAGINATION FOOTER */}
            <div className="p-2.5 border-t border-black bg-neutral-50 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <span>PAGE 1 OF 1 ({filteredStaff.length} TOTAL OPERATORS DISPLAYED)</span>
                <span className="text-neutral-400">//</span>
                <span className="text-neutral-600">AUDIT TRAIL LOGGED VIA NODE:BIZ-OPS-01</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="border border-black px-2 py-0.5 bg-white font-bold hover:bg-neutral-200 uppercase">[PREV]</button>
                <span className="px-2 py-0.5 bg-black text-white font-bold">1</span>
                <button className="border border-black px-2 py-0.5 bg-white font-bold hover:bg-neutral-200 uppercase">[NEXT]</button>
              </div>
            </div>
          </div>

          {/* CLIENT PORTAL ACCESS & INVITATIONS MANAGEMENT */}
          <div className="border border-black p-4 bg-neutral-50 text-xs">
            <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="bg-black text-white font-bold text-[10px] px-1.5 py-0.5 uppercase">PORTAL AUTH</span>
                <h4 className="font-bold text-xs uppercase tracking-wider text-black">CLIENT PORTAL ACCESS &amp; INVITATION QUEUE</h4>
              </div>
              <span className="text-[10px] text-neutral-500">SUPABASE AUTH JWT POOL // 1,420 CLIENTS REGISTERED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border border-black p-3 bg-white space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase text-[11px] text-black">PENDING PET PARENT INVITES (02)</span>
                  <span className="bg-neutral-200 border border-black text-[9px] px-1 font-bold">EXPIRING &lt; 24H</span>
                </div>
                <div className="text-[10px] space-y-1">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-1">
                    <span>clara.vance@gmail.com (Pet: &apos;Bruno&apos;)</span>
                    <button 
                      onClick={() => showNotification('Invite link re-dispatched to clara.vance@gmail.com!')}
                      className="border border-black px-1 text-[9px] font-bold hover:bg-black hover:text-white uppercase"
                    >
                      RESEND LINK
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span>marcus.h@dallastx.net (Pet: &apos;Bella&apos;)</span>
                    <button 
                      onClick={() => showNotification('Invite link re-dispatched to marcus.h@dallastx.net!')}
                      className="border border-black px-1 text-[9px] font-bold hover:bg-black hover:text-white uppercase"
                    >
                      RESEND LINK
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-black p-3 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase text-[11px] text-black">DIRECT CLIENT MAGIC LINK GENERATOR</span>
                  <span className="text-[9px] text-neutral-500">INSTANT OTP</span>
                </div>
                <div className="flex gap-1.5">
                  <input 
                    type="email"
                    value={magicLinkEmail}
                    onChange={(e) => setMagicLinkEmail(e.target.value)}
                    placeholder="client@domain.com"
                    className="flex-1 border border-black p-1 text-xs focus:outline-none bg-white"
                  />
                  <button 
                    onClick={handleGenerateMagicLink}
                    className="bg-black text-white px-2.5 py-1 text-[10px] font-bold uppercase hover:bg-neutral-800"
                  >
                    GENERATE &amp; SEND
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 3: RBAC ROLE MATRIX POLICY INSPECTOR & SECURITY GOVERNANCE */}
        <div className="space-y-4">
          
          {/* ACTIVE ROLE POLICY INSPECTOR CARD */}
          <div className="border border-black p-4 bg-white text-xs">
            <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">ROLE POLICY INSPECTOR</span>
                <select 
                  value={selectedRoleTierId}
                  onChange={(e) => setSelectedRoleTierId(e.target.value)}
                  className="font-bold text-sm uppercase bg-white border border-black p-1 mt-0.5 focus:outline-none cursor-pointer"
                >
                  {roleTiers.map(tier => (
                    <option key={tier.id} value={tier.id}>
                      {tier.name}
                    </option>
                  ))}
                </select>
              </div>
              <span className="bg-black text-white text-[10px] px-2 py-0.5 font-bold">
                {selectedRole.usersBoundCount} USERS BOUND
              </span>
            </div>

            <p className="text-[11px] text-neutral-600 mb-3 leading-relaxed">
              {selectedRole.description}
            </p>

            {/* RBAC MATRIX MODULE GROUPS */}
            <div className="space-y-3">
              
              {/* MODULE 1: SALON OPS */}
              <div className="border border-black p-2.5 bg-neutral-50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold uppercase text-[11px] text-black">SEC:01 // SALON OPS</span>
                  <span className="bg-black text-white text-[9px] px-1 font-bold">FULL R/W</span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedRole.permissions.salonOps.appointments}
                      onChange={() => handleTogglePermission('salonOps', 'appointments')}
                      className="rounded-none accent-black w-3.5 h-3.5"
                    />
                    <span>Appointments &amp; Master Calendar (Edit, Void, Reschedule)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedRole.permissions.salonOps.crm}
                      onChange={() => handleTogglePermission('salonOps', 'crm')}
                      className="rounded-none accent-black w-3.5 h-3.5"
                    />
                    <span>Client &amp; Pet CRM Profiles (Create, Merge Records)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedRole.permissions.salonOps.rota}
                      onChange={() => handleTogglePermission('salonOps', 'rota')}
                      className="rounded-none accent-black w-3.5 h-3.5"
                    />
                    <span>Staff Rota &amp; Daily Groomer Bay Assignment</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedRole.permissions.salonOps.pos}
                      onChange={() => handleTogglePermission('salonOps', 'pos')}
                      className="rounded-none accent-black w-3.5 h-3.5"
                    />
                    <span>Integrated POS Register (Process Checkout &amp; Voids)</span>
                  </label>
                </div>
              </div>

              {/* MODULE 2: OMS & LOGISTICS */}
              <div className="border border-black p-2.5 bg-neutral-50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold uppercase text-[11px] text-black">SEC:02 // OMS &amp; LOGISTICS</span>
                  <span className="bg-neutral-200 border border-black text-[9px] px-1 font-bold">READ / WRITE</span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedRole.permissions.omsLogistics.ordersQueue}
                      onChange={() => handleTogglePermission('omsLogistics', 'ordersQueue')}
                      className="rounded-none accent-black w-3.5 h-3.5"
                    />
                    <span>Orders Master Queue &amp; Fulfillment Dispatch</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedRole.permissions.omsLogistics.productCatalog}
                      onChange={() => handleTogglePermission('omsLogistics', 'productCatalog')}
                      className="rounded-none accent-black w-3.5 h-3.5"
                    />
                    <span>Product Catalog &amp; Facility Reorder Requests</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedRole.permissions.omsLogistics.purchaseOrders}
                      onChange={() => handleTogglePermission('omsLogistics', 'purchaseOrders')}
                      className="rounded-none accent-black w-3.5 h-3.5"
                    />
                    <span>Purchase Orders Receiving &amp; Loading Bay Log</span>
                  </label>
                </div>
              </div>

              {/* MODULE 3: FINANCIAL & LEDGERS */}
              <div className="border border-black p-2.5 bg-neutral-50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold uppercase text-[11px] text-black">SEC:03 // FINANCIAL &amp; ACCTS</span>
                  <span className="border border-black bg-white text-[9px] px-1 font-bold text-neutral-600">RESTRICTED R/O</span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedRole.permissions.financialAccts.paymentsDashboard}
                      onChange={() => handleTogglePermission('financialAccts', 'paymentsDashboard')}
                      className="rounded-none accent-black w-3.5 h-3.5"
                    />
                    <span>Payments Dashboard (View Daily Facility Totals)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedRole.permissions.financialAccts.stripePayouts}
                      onChange={() => handleTogglePermission('financialAccts', 'stripePayouts')}
                      className="rounded-none accent-black w-3.5 h-3.5"
                    />
                    <span className={selectedRole.permissions.financialAccts.stripePayouts ? 'text-black' : 'text-neutral-500'}>
                      Stripe Payouts &amp; Bank Routing (SUPER_ADMIN ONLY)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedRole.permissions.financialAccts.taxJurisdiction}
                      onChange={() => handleTogglePermission('financialAccts', 'taxJurisdiction')}
                      className="rounded-none accent-black w-3.5 h-3.5"
                    />
                    <span className={selectedRole.permissions.financialAccts.taxJurisdiction ? 'text-black' : 'text-neutral-500'}>
                      Tax Jurisdiction Configuration (SUPER_ADMIN ONLY)
                    </span>
                  </label>
                </div>
              </div>

              {/* MODULE 4: BIZ OPS */}
              <div className="border border-black p-2.5 bg-neutral-50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold uppercase text-[11px] text-black">SEC:04 // BIZ OPS</span>
                  <span className="border border-black bg-neutral-100 text-[9px] px-1 font-bold">LOCATION-SCOPED</span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedRole.permissions.bizOps.operatingHours}
                      onChange={() => handleTogglePermission('bizOps', 'operatingHours')}
                      className="rounded-none accent-black w-3.5 h-3.5"
                    />
                    <span>Facility Operating Hours &amp; Holiday Exceptions</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedRole.permissions.bizOps.staffCards}
                      onChange={() => handleTogglePermission('bizOps', 'staffCards')}
                      className="rounded-none accent-black w-3.5 h-3.5"
                    />
                    <span>Staff Contact Cards &amp; Service Radius Bounds</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedRole.permissions.bizOps.manageLocations}
                      onChange={() => handleTogglePermission('bizOps', 'manageLocations')}
                      className="rounded-none accent-black w-3.5 h-3.5"
                    />
                    <span className={selectedRole.permissions.bizOps.manageLocations ? 'text-black' : 'text-neutral-500'}>
                      Create / Delete Location Pods (RESTRICTED)
                    </span>
                  </label>
                </div>
              </div>

            </div>

            {/* ROLE ACTION BUTTONS */}
            <div className="pt-3 border-t border-black flex items-center justify-between mt-3">
              <button 
                onClick={handleCloneRole}
                className="border border-black px-2 py-1 text-[10px] font-bold hover:bg-neutral-200 uppercase"
              >
                [CLONE ROLE TIER]
              </button>
              <button 
                onClick={handleSavePermissions}
                className="bg-black text-white px-3 py-1 text-[10px] font-bold hover:bg-neutral-800 uppercase"
              >
                [SAVE PERMISSION EDITS]
              </button>
            </div>
          </div>

          {/* SECURITY & 2FA AUDIT POLICIES WIDGET */}
          <div className="border border-black p-4 bg-neutral-50 text-xs">
            <div className="flex items-center justify-between border-b border-black pb-2 mb-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-black">SECURITY &amp; MFA POLICY</h4>
              <span className="bg-green-50 border border-black text-[9px] px-1 font-bold">STATUS: COMPLIANT</span>
            </div>
            <div className="space-y-2 text-[10px]">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-1">
                <span className="text-neutral-600 uppercase">2FA ENFORCEMENT</span>
                <span className="font-bold text-black">TIER 1 &amp; TIER 2 MANDATORY</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-1">
                <span className="text-neutral-600 uppercase">SESSION TIMEOUT</span>
                <span className="font-bold text-black">480 MIN (INACTIVITY: 30 MIN)</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-1">
                <span className="text-neutral-600 uppercase">IP GEO-FENCE</span>
                <span className="font-bold text-black">ACTIVE (NORTH TEXAS &amp; FLEET GPS)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 uppercase">PASSWORD ROTATION</span>
                <span className="font-bold text-black">90 DAYS ENFORCED</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* TELEMETRY STATUS BAR */}
      <div className="border-t border-black bg-neutral-50 p-2.5 flex flex-col md:flex-row items-center justify-between text-[10px] text-neutral-600">
        <div className="flex items-center gap-3">
          <span>AUTH_DAEMON: ACTIVE (SUPABASE RLS POLICIES VERIFIED)</span>
          <span>//</span>
          <span>RBAC_CACHE: SYNCED ({roleTiers.length} TIERS)</span>
          <span>//</span>
          <span>ACTIVE_SESSIONS: 18 OPERATORS CONNECTED</span>
        </div>
        <div className="flex items-center gap-2 mt-1 md:mt-0">
          <span className="text-neutral-500">AUDIT LOG: TAMPER_PROOF_POSTGRES</span>
          <span className="bg-black text-white px-1.5 py-0.2 font-bold">[V2.4 AUDIT ACTIVE]</span>
        </div>
      </div>

      {/* MODAL: INVITE NEW USER */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-black"></span>
                <h3 className="font-bold text-base uppercase text-black">INVITE NEW USER &amp; ASSIGN ROLE</h3>
              </div>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="text-neutral-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-[10px] text-neutral-600 mb-1">
                  FULL NAME *
                </label>
                <input 
                  type="text" 
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full border border-black p-2 bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[10px] text-neutral-600 mb-1">
                  OFFICIAL SALON EMAIL ADDRESS *
                </label>
                <input 
                  type="email" 
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. jhayes@allaboutpawz.com"
                  className="w-full border border-black p-2 bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-[10px] text-neutral-600 mb-1">
                    ROLE TIER *
                  </label>
                  <select 
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as StaffUser['roleTier'])}
                    className="w-full border border-black p-2 bg-white focus:outline-none"
                  >
                    <option value="TIER 1: SUPER_ADMIN">Tier 1: Super Admin</option>
                    <option value="TIER 2: SALON MANAGER">Tier 2: Salon Manager</option>
                    <option value="TIER 3: LEAD GROOMER">Tier 3: Lead Groomer</option>
                    <option value="TIER 3: MOBILE STYLIST">Tier 3: Mobile Stylist</option>
                    <option value="TIER 4: RECEPTION & CASHIER">Tier 4: Receptionist</option>
                    <option value="TIER 5: OMS PACKER">Tier 5: OMS Packer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-neutral-600 mb-1">
                    FACILITY SCOPE *
                  </label>
                  <select 
                    value={inviteLocation}
                    onChange={(e) => setInviteLocation(e.target.value)}
                    className="w-full border border-black p-2 bg-white focus:outline-none"
                  >
                    <option value="ALL LOCATIONS">All Locations</option>
                    <option value="FRISCO HQ">Frisco Main HQ</option>
                    <option value="PLANO WEST">Plano West Branch</option>
                    <option value="MOBILE VAN FLEET">Mobile Van Fleet</option>
                  </select>
                </div>
              </div>

              <div className="border border-black p-2.5 bg-neutral-50 text-[10px] text-neutral-600">
                Dispatches an automated Supabase Auth JWT invite email with password setup instructions.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-black">
                <button 
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="border border-black px-3 py-1.5 font-bold uppercase hover:bg-neutral-100"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="bg-black text-white px-4 py-1.5 font-bold uppercase hover:bg-neutral-800"
                >
                  SEND INVITATION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE CUSTOM ROLE */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-black"></span>
                <h3 className="font-bold text-base uppercase text-black">CREATE CUSTOM ROLE TIER</h3>
              </div>
              <button 
                onClick={() => setIsCreateRoleModalOpen(false)}
                className="text-neutral-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomRole} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-[10px] text-neutral-600 mb-1">
                  ROLE TITLE *
                </label>
                <input 
                  type="text" 
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. INVENTORY SPECIALIST"
                  className="w-full border border-black p-2 bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[10px] text-neutral-600 mb-1">
                  ROLE DESCRIPTION
                </label>
                <textarea 
                  rows={2}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Defines specific duties and security scope..."
                  className="w-full border border-black p-2 bg-white focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[10px] text-neutral-600 mb-1">
                  INHERIT BASE PERMISSIONS FROM
                </label>
                <select 
                  value={baseTierInherit}
                  onChange={(e) => setBaseTierInherit(e.target.value)}
                  className="w-full border border-black p-2 bg-white focus:outline-none"
                >
                  {roleTiers.map(tier => (
                    <option key={tier.id} value={tier.id}>
                      {tier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-black">
                <button 
                  type="button"
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="border border-black px-3 py-1.5 font-bold uppercase hover:bg-neutral-100"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="bg-black text-white px-4 py-1.5 font-bold uppercase hover:bg-neutral-800"
                >
                  CREATE ROLE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
