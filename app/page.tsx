'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  DawgNavSection, 
  AppointmentItem, 
  Customer, 
  PetRecord, 
  StaffScheduleItem, 
  GroomingRecord,
  LocationItem,
  AuthUser,
} from '@/lib/types';
import { 
  KPI_METRICS, 
  STAFF_SCHEDULES, 
  BOOKING_FUNNEL, 
  GROOMING_RECORDS, 
  ALERTS_LIST,
  INITIAL_CUSTOMERS,
  INITIAL_PETS,
  INITIAL_LOCATIONS,
  DEMO_AUTH_USERS,
} from '@/lib/dawg-mock-data';
import { RICH_APPOINTMENTS_DATA } from '@/lib/appointments-rich-data';
import { Sidebar } from '@/components/dawg/Sidebar';
import { Header } from '@/components/dawg/Header';
import { DashboardView } from '@/components/dawg/DashboardView';
import { AppointmentsView } from '@/components/dawg/AppointmentsView';
import { CustomersView } from '@/components/dawg/CustomersView';
import { PetsView } from '@/components/dawg/PetsView';
import { GroomingRecordsView } from '@/components/dawg/GroomingRecordsView';
import { StaffView } from '@/components/dawg/StaffView';
import { ServicesView } from '@/components/dawg/ServicesView';
import { InventoryView } from '@/components/dawg/InventoryView';
import { SettingsView } from '@/components/dawg/SettingsView';
import { PaymentsView } from '@/components/dawg/financial/PaymentsView';
import { InvoicesView } from '@/components/dawg/financial/InvoicesView';
import { DepositsView } from '@/components/dawg/financial/DepositsView';
import { RefundsView } from '@/components/dawg/financial/RefundsView';
import { GiftCardsView } from '@/components/dawg/financial/GiftCardsView';
import { OrdersView } from '@/components/dawg/financial/OrdersView';
import { OrderDetailsView } from '@/components/dawg/financial/OrderDetailsView';
import { ShippingStationView } from '@/components/dawg/financial/ShippingStationView';
import { ReturnsView } from '@/components/dawg/financial/ReturnsView';
import { PurchaseOrdersView } from '@/components/dawg/financial/PurchaseOrdersView';
import { QuickActionModals } from '@/components/dawg/Modals/QuickActionModals';
import { LandingLoginView } from '@/components/dawg/LandingLoginView';
import { GroomerPortalView } from '@/components/dawg/GroomerPortalView';
import { CustomerPortalView } from '@/components/dawg/CustomerPortalView';
import { Tenant, fetchLocations } from '@/lib/supabase';

export default function Home() {
  // Auth state: null shows two-column Landing/Login page
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [activeSection, setActiveSection] = useState<DawgNavSection>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('May 12, 2025');
  const [selectedLocation, setSelectedLocation] = useState('All About Pawz – Main Location');
  const [locations, setLocations] = useState<LocationItem[]>(INITIAL_LOCATIONS);
  const [currentTenant, setCurrentTenant] = useState<Tenant>({
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Primary Workspace',
    slug: 'primary-workspace',
    active: true,
  });

  const refreshLocations = async (tenantId: string) => {
    try {
      const locs = await fetchLocations(tenantId);
      if (locs && locs.length > 0) {
        const mapped: LocationItem[] = locs.map((l: any) => ({
          id: l.id,
          name: l.name,
          type: (l.type as any) || 'Main Location',
          address: l.address || '4500 Legacy Dr',
          cityStateZip: `${l.city || 'Frisco'}, ${l.state || 'TX'} ${l.zip || '75034'}`,
          phone: l.phone || '(214) 555-0100',
          email: l.email || 'contact@allaboutpawz.com',
          manager: l.manager || 'Lead Groomer',
          status: (l.status as any) || 'Active',
          stationCount: l.station_count || 4,
          operatingHours: l.operating_hours || 'Mon-Sat: 8:00 AM – 6:00 PM',
          isDefault: l.is_default || false,
        }));
        setLocations(mapped);
        if (mapped[0]) setSelectedLocation(mapped[0].name);
      }
    } catch (e) {
      console.log('Using local branch state:', e);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetchLocations(currentTenant.id)
      .then((locs) => {
        if (!ignore && locs && locs.length > 0) {
          const mapped: LocationItem[] = locs.map((l: any) => ({
            id: l.id,
            name: l.name,
            type: (l.type as any) || 'Main Location',
            address: l.address || '4500 Legacy Dr',
            cityStateZip: `${l.city || 'Frisco'}, ${l.state || 'TX'} ${l.zip || '75034'}`,
            phone: l.phone || '(214) 555-0100',
            email: l.email || 'contact@allaboutpawz.com',
            manager: l.manager || 'Lead Groomer',
            status: (l.status as any) || 'Active',
            stationCount: l.station_count || 4,
            operatingHours: l.operating_hours || 'Mon-Sat: 8:00 AM – 6:00 PM',
            isDefault: l.is_default || false,
          }));
          setLocations(mapped);
          if (mapped[0]) setSelectedLocation(mapped[0].name);
        }
      })
      .catch((e) => {
        console.log('Using local branch state:', e);
      });

    return () => {
      ignore = true;
    };
  }, [currentTenant.id]);

  // Interactive Live Data State
  const [appointments, setAppointments] = useState<AppointmentItem[]>(RICH_APPOINTMENTS_DATA);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [pets, setPets] = useState<PetRecord[]>(INITIAL_PETS);
  const [staffSchedules, setStaffSchedules] = useState<StaffScheduleItem[]>(STAFF_SCHEDULES);
  const [groomingRecords, setGroomingRecords] = useState<GroomingRecord[]>(GROOMING_RECORDS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('ORD-2025-1048');

  // Modal State
  const [activeModal, setActiveModal] = useState<'appointment' | 'customer' | 'pet' | 'intake' | 'payment' | 'invoice' | 'search' | null>(null);

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setActiveModal('search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

  const handleAddAppointment = async (newAppt: Partial<AppointmentItem>) => {
    const created: AppointmentItem = {
      id: generateId('appt'),
      time: newAppt.time || '2:30 PM',
      date: newAppt.date || '2026-09-18',
      petName: newAppt.petName || 'Coco',
      breed: newAppt.breed || 'Poodle',
      petEmoji: newAppt.petEmoji || '🐩',
      serviceName: newAppt.serviceName || 'Full Groom',
      staffName: newAppt.staffName || 'Sarah M.',
      status: newAppt.status || 'Scheduled',
      price: newAppt.price || 85.0,
      notes: newAppt.notes,
    };
    setAppointments(prev => [created, ...prev]);

    // Persist to Supabase
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerName: newAppt.customerName || 'Walk-in Client',
          dogName: created.petName,
          breed: created.breed,
          service: created.serviceName,
          date: created.date,
          time: created.time,
          notes: created.notes || '',
          servicePrice: `$${created.price}.00`,
          status: 'CONFIRMED',
        }),
      });
    } catch (e) {
      console.log('Stored in local state:', e);
    }
  };

  const handleToggleAppointmentStatus = async (id: string) => {
    let nextStatus: AppointmentItem['status'] = 'Checked In';
    setAppointments(prev =>
      prev.map(a => {
        if (a.id === id) {
          nextStatus = a.status === 'Checked In' ? 'Completed' : 'Checked In';
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );

    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
    } catch (e) {
      console.log('Status updated locally:', e);
    }
  };

  const handleAddCustomer = async (newCust: Partial<Customer>) => {
    const created: Customer = {
      id: generateId('cust'),
      name: newCust.name || 'New Client',
      email: newCust.email || 'client@example.com',
      phone: newCust.phone || '(555) 000-1122',
      pets: newCust.pets || ['Milo (Labrador)'],
      totalSpent: 0,
      lastVisit: 'Today',
      preferredGroomer: newCust.preferredGroomer || 'Sarah M.',
    };
    setCustomers(prev => [created, ...prev]);

    // Persist to Supabase & Stripe
    try {
      const nameParts = (created.name || '').trim().split(' ');
      const firstName = nameParts[0] || 'Client';
      const lastName = nameParts.slice(1).join(' ') || '';
      await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: created.email,
          phone: created.phone,
        }),
      });
    } catch (e) {
      console.log('Customer stored in session:', e);
    }
  };

  const handleAddPet = (newPet: Partial<PetRecord>) => {
    const created: PetRecord = {
      id: generateId('pet'),
      name: newPet.name || 'Cooper',
      breed: newPet.breed || 'Golden Retriever',
      age: newPet.age || '2 yrs',
      weight: newPet.weight || '35 lbs',
      ownerName: newPet.ownerName || 'Emily Watson',
      emoji: '🐕',
      vaccinationStatus: newPet.vaccinationStatus || 'Up to date',
      specialNotes: newPet.specialNotes || 'Gentle trim',
      lastGroomDate: 'May 12, 2025',
    };
    setPets(prev => [created, ...prev]);
  };

  const handleAddLocation = (newLoc: Partial<LocationItem>) => {
    const created: LocationItem = {
      id: generateId('loc'),
      name: newLoc.name || 'All About Pawz – New Branch',
      type: newLoc.type || 'Main Location',
      address: newLoc.address || '4500 Legacy Dr',
      cityStateZip: newLoc.cityStateZip || 'Frisco, TX 75034',
      phone: newLoc.phone || '(214) 555-0100',
      email: newLoc.email || 'contact@allaboutpawz.com',
      manager: newLoc.manager || 'Lead Groomer',
      status: newLoc.status || 'Active',
      stationCount: newLoc.stationCount || 4,
      operatingHours: newLoc.operatingHours || 'Mon-Sat: 8:00 AM – 6:00 PM',
      isDefault: false,
    };
    setLocations(prev => [...prev, created]);
    setSelectedLocation(created.name);
  };

  const handleDeleteLocation = (id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id));
  };

  // 1. Two-Column Landing / Login Shell
  if (!currentUser) {
    return (
      <LandingLoginView
        onLogin={(user, initialSec) => {
          setCurrentUser(user);
          if (initialSec) {
            setActiveSection(initialSec as DawgNavSection);
          }
        }}
      />
    );
  }

  // 2. Groomer Station Portal Shell
  if (currentUser.role === 'groomer') {
    return (
      <GroomerPortalView
        currentUser={currentUser}
        onSwitchToAdmin={() => {
          setCurrentUser({
            id: 'usr-admin-1',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'admin',
            stationName: 'Central Management',
          });
          setActiveSection('dashboard');
        }}
        onSignOut={() => setCurrentUser(null)}
      />
    );
  }

  // 3. Pet Parent Customer Portal Shell
  if (currentUser.role === 'customer') {
    return (
      <CustomerPortalView
        currentUser={currentUser}
        onSwitchToAdmin={() => {
          setCurrentUser({
            id: 'usr-admin-1',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'admin',
            stationName: 'Central Management',
          });
          setActiveSection('dashboard');
        }}
        onSwitchToGroomer={() => {
          setCurrentUser({
            id: 'usr-groomer-1',
            name: 'Sarah M.',
            email: 'groomer@test.com',
            role: 'groomer',
            stationName: 'Station #3 (Spa Suite)',
          });
        }}
        onSignOut={() => setCurrentUser(null)}
      />
    );
  }

  // 4. Admin OS Shell (Defaulting & Picking up at Appointments)
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white text-black antialiased font-sans">
      {/* 1. Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        locationsList={locations}
        currentTenant={currentTenant}
        onSelectTenant={setCurrentTenant}
        onRefreshLocations={() => refreshLocations(currentTenant.id)}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white text-black">
        {/* Top Bar with Welcome Header & Controls */}
        <Header
          onOpenMobileMenu={() => setMobileOpen(true)}
          onOpenSearch={() => setActiveModal('search')}
          currentDate={currentDate}
          onChangeDate={setCurrentDate}
          onNavigateSection={setActiveSection}
          onSwitchToGroomer={() => {
            setCurrentUser({
              id: 'usr-groomer-1',
              name: 'Sarah M.',
              email: 'groomer@test.com',
              role: 'groomer',
              stationName: 'Station #3 (Spa Suite)',
            });
          }}
          onSignOut={() => setCurrentUser(null)}
          currentUser={currentUser}
        />

        {/* Scrollable Content View Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          {activeSection === 'dashboard' && (
            <DashboardView
              metrics={KPI_METRICS}
              appointments={appointments}
              staffSchedules={staffSchedules}
              bookingFunnel={BOOKING_FUNNEL}
              groomingRecords={groomingRecords}
              alerts={ALERTS_LIST}
              onNavigateSection={setActiveSection}
              onOpenQuickAction={(action) => setActiveModal(action)}
              onToggleAppointmentStatus={handleToggleAppointmentStatus}
            />
          )}

          {(activeSection === 'appointments' || activeSection === 'calendar') && (
            <AppointmentsView
              appointments={appointments}
              onAddAppointment={() => setActiveModal('appointment')}
              onUpdateStatus={(id, status) => {
                setAppointments(prev =>
                  prev.map(a => (a.id === id ? { ...a, status } : a))
                );
              }}
            />
          )}

          {activeSection === 'customers' && (
            <CustomersView
              customers={customers}
              onAddCustomer={() => setActiveModal('customer')}
              onOpenNewAppointment={() => setActiveModal('appointment')}
              onOpenAddPet={() => setActiveModal('pet')}
              onOpenTakePayment={() => setActiveModal('payment')}
              onOpenIntake={() => setActiveModal('intake')}
            />
          )}

          {activeSection === 'pets' && (
            <PetsView
              pets={pets}
              onAddPet={() => setActiveModal('pet')}
            />
          )}

          {activeSection === 'grooming-records' && (
            <GroomingRecordsView records={groomingRecords} />
          )}

          {(activeSection === 'staff' || activeSection === 'schedule' || activeSection === 'payroll') && (
            <StaffView staffList={staffSchedules} />
          )}

          {activeSection === 'services' && <ServicesView />}

          {activeSection === 'inventory' && <InventoryView />}

          {activeSection === 'orders' && (
            <OrdersView 
              onNavigateSection={setActiveSection}
              onOpenOrderDetails={(id) => {
                setSelectedOrderId(id);
                setActiveSection('order-details');
              }}
            />
          )}

          {activeSection === 'order-details' && (
            <OrderDetailsView 
              orderId={selectedOrderId}
              onNavigateSection={setActiveSection}
            />
          )}

          {activeSection === 'shipping' && (
            <ShippingStationView 
              onNavigateSection={setActiveSection}
            />
          )}

          {activeSection === 'returns' && (
            <ReturnsView 
              onNavigateSection={setActiveSection}
            />
          )}

          {activeSection === 'purchase-orders' && (
            <PurchaseOrdersView 
              onNavigateSection={setActiveSection}
            />
          )}

          {activeSection === 'settings' && (
            <SettingsView
              locations={locations}
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
              onAddLocation={handleAddLocation}
              onDeleteLocation={handleDeleteLocation}
              onNavigateSection={setActiveSection}
              onOpenQuickAction={(action) => {
                if (action === 'message') {
                  setActiveSection('communications');
                } else {
                  setActiveModal(action);
                }
              }}
            />
          )}

          {activeSection === 'payments' && (
            <PaymentsView 
              onNavigateSection={setActiveSection}
              onOpenQuickPayment={() => setActiveModal('payment')}
            />
          )}

          {activeSection === 'invoices' && (
            <InvoicesView 
              onNavigateSection={setActiveSection}
            />
          )}

          {activeSection === 'deposits' && (
            <DepositsView 
              onNavigateSection={setActiveSection}
            />
          )}

          {activeSection === 'refunds' && (
            <RefundsView 
              onNavigateSection={setActiveSection}
            />
          )}

          {activeSection === 'gift-cards' && (
            <GiftCardsView 
              onNavigateSection={setActiveSection}
            />
          )}

          {(activeSection === 'documents' || activeSection === 'communications' || activeSection === 'marketing' || activeSection === 'reports') && (
            <div className="p-8 max-w-4xl mx-auto space-y-6">
              <div className="bg-white p-6 border border-black space-y-4">
                <div className="flex items-center justify-between border-b border-black pb-4">
                  <div>
                    <h2 className="text-base font-black uppercase tracking-tight text-black">
                      {activeSection.replace('-', ' ')} Module
                    </h2>
                    <p className="text-xs text-gray-600 mt-0.5">
                      All About Pawz OS integrated business control center.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveSection('dashboard')}
                    className="px-3.5 py-1.5 border border-black bg-white hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Return to Dashboard
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-white border border-black space-y-2">
                    <p className="font-black uppercase tracking-wider text-black">Quick Access Actions</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveModal('appointment')}
                        className="px-3 py-1.5 bg-black text-white border border-black font-bold uppercase tracking-wider text-xs hover:bg-neutral-800 cursor-pointer"
                      >
                        + Book Appointment
                      </button>
                      <button
                        onClick={() => setActiveModal('payment')}
                        className="px-3 py-1.5 bg-white border border-black text-black font-bold uppercase tracking-wider text-xs hover:bg-black hover:text-white transition-colors cursor-pointer"
                      >
                        + Take Payment
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-white border border-black space-y-2">
                    <p className="font-black uppercase tracking-wider text-black">Branch Details</p>
                    <p className="text-gray-700 font-bold">{selectedLocation}</p>
                    <p className="text-gray-500 font-mono text-[11px]">Timezone: America/Chicago (CDT)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. Global Interactive Modals */}
      <QuickActionModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onSaveAppointment={handleAddAppointment}
        onSaveCustomer={handleAddCustomer}
        onSavePet={handleAddPet}
        onNavigateSection={setActiveSection}
        currentTenantId={currentTenant.id}
      />
    </div>
  );
}
