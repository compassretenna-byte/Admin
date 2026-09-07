'use client';

import React, { useState, useRef } from 'react';
import { AppointmentItem, AppointmentStatus } from '@/lib/types';
import { RICH_APPOINTMENTS_DATA } from '@/lib/appointments-rich-data';
import { FullCalendarView } from './FullCalendarView';
import { KanbanView } from './KanbanView';
import { HourlyTimelineView } from './HourlyTimelineView';
import { AppointmentActionMenu } from './AppointmentActionMenu';
import { StatusLegendModal } from './StatusLegendModal';
import { AppointmentTaskModals, AppointmentActionType } from './AppointmentTaskModals';
import { QuickActionsModal, UnifiedQuickActionType } from './QuickActionsModal';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  Plus, 
  RotateCw, 
  List, 
  LayoutGrid, 
  Columns,
  Clock,
  Download, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal,
  Info,
  CheckCircle2,
  Zap,
  X
} from 'lucide-react';

interface AppointmentsViewProps {
  appointments?: AppointmentItem[];
  onAddAppointment?: () => void;
  onUpdateStatus?: (id: string, newStatus: AppointmentItem['status']) => void;
}

type HorizonTab = 
  | 'All Appointments' 
  | 'Today' 
  | 'Tomorrow' 
  | 'This Week' 
  | 'Next 7 Days' 
  | 'This Month' 
  | 'Waitlist' 
  | 'Past' 
  | 'Canceled';

type ViewMode = 'list' | 'kanban' | 'timeline' | 'calendar' | 'grid';

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments: initialPropAppointments,
  onAddAppointment: propOnAddAppointment,
  onUpdateStatus: propOnUpdateStatus,
}) => {
  const nextIdRef = useRef(1000);

  // State for appointments
  const [appointmentsList, setAppointmentsList] = useState<AppointmentItem[]>(
    initialPropAppointments && initialPropAppointments.length > 0 
      ? initialPropAppointments 
      : RICH_APPOINTMENTS_DATA
  );

  React.useEffect(() => {
    let isMounted = true;
    fetch('/api/bookings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data?.appointments || !Array.isArray(data.appointments) || data.appointments.length === 0) return;
        const liveIds = new Set(data.appointments.map((a: any) => a.id));
        const mockFiltered = RICH_APPOINTMENTS_DATA.filter(a => !liveIds.has(a.id));
        if (isMounted) {
          setAppointmentsList([...data.appointments, ...mockFiltered]);
        }
      })
      .catch((err) => {
        console.log('Using local cached appointments:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Navigation Horizon Tabs matching designs
  const [activeTab, setActiveTab] = useState<HorizonTab>('All Appointments');
  
  // View mode switcher: List vs Kanban vs Timeline vs Calendar vs Grid
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const handleTabChange = (tab: HorizonTab) => {
    setActiveTab(tab);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [groomerFilter, setGroomerFilter] = useState('All Groomers');
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [sortBy] = useState('Date & Time');

  // Active row dropdown state
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  // Modals & Tasks
  const [showStatusLegend, setShowStatusLegend] = useState(false);
  const [activeTaskAction, setActiveTaskAction] = useState<AppointmentActionType | null>(null);
  const [activeTaskAppointment, setActiveTaskAppointment] = useState<AppointmentItem | null>(null);
  const [isGlobalQuickActionsOpen, setIsGlobalQuickActionsOpen] = useState(false);
  const [selectedAppointmentForQuickActions, setSelectedAppointmentForQuickActions] = useState<AppointmentItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUnifiedQuickAction = (action: UnifiedQuickActionType) => {
    setIsGlobalQuickActionsOpen(false);
    const targetAppt = selectedAppointmentForQuickActions || appointmentsList[0];
    if (!targetAppt) return;

    if (action === 'status-check-in') {
      updateAppointmentStatus(targetAppt.id, 'Checked In');
    } else if (action === 'status-in-service') {
      updateAppointmentStatus(targetAppt.id, 'In Progress');
    } else if (action === 'status-complete') {
      updateAppointmentStatus(targetAppt.id, 'Completed');
    } else if (action === 'status-no-show') {
      updateAppointmentStatus(targetAppt.id, 'No Show');
    } else if (action === 'status-hold') {
      updateAppointmentStatus(targetAppt.id, 'Scheduled');
      showToast(`Appointment for ${targetAppt.petName} placed on hold.`);
    } else if (
      action === 'reschedule' ||
      action === 'duplicate' ||
      action === 'cancel'
    ) {
      setActiveTaskAppointment(targetAppt);
      setActiveTaskAction(action as AppointmentActionType);
    } else if (action === 'confirm-appointment') {
      updateAppointmentStatus(targetAppt.id, 'Confirmed');
    } else if (action === 'send-reminder') {
      showToast(`Reminder SMS/Email sent to ${targetAppt.customerName}`);
    } else if (action === 'follow-up') {
      showToast(`Follow-up reminder set for ${targetAppt.customerName}`);
    } else if (action === 'waitlist') {
      updateAppointmentStatus(targetAppt.id, 'Waitlisted');
    } else if (action === 'new-appointment') {
      if (propOnAddAppointment) propOnAddAppointment();
      else showToast('Opening new appointment booking flow...');
    } else if (action === 'take-payment') {
      showToast(`Payment portal loaded for ${targetAppt.customerName} ($${(targetAppt.price || 0).toFixed(2)})`);
    } else if (action === 'send-message') {
      showToast(`Messaging channel opened with ${targetAppt.customerName}`);
    } else if (action === 'add-note') {
      showToast(`Grooming note modal opened for ${targetAppt.petName}`);
    } else if (action === 'add-pet') {
      showToast(`Add pet flow started for ${targetAppt.customerName}`);
    } else if (action === 'call-customer') {
      showToast(`Calling ${targetAppt.customerName}...`);
    } else {
      showToast(`Action "${action}" processed.`);
    }
  };

  const getAvatarBg = (initials?: string) => {
    if (!initials) return 'bg-amber-100 text-amber-800';
    if (initials === 'KM' || initials === 'AC') return 'bg-cyan-100 text-cyan-800';
    if (initials === 'DJ' || initials === 'BT') return 'bg-blue-100 text-blue-800';
    if (initials === 'SP' || initials === 'NH') return 'bg-purple-100 text-purple-800';
    if (initials === 'MB' || initials === 'PA') return 'bg-amber-100 text-amber-800';
    if (initials === 'JC' || initials === 'EM') return 'bg-rose-100 text-rose-800';
    if (initials === 'LW') return 'bg-teal-100 text-teal-800';
    if (initials === 'AG') return 'bg-emerald-100 text-emerald-800';
    if (initials === 'TA') return 'bg-indigo-100 text-indigo-800';
    if (initials === 'RG') return 'bg-pink-100 text-pink-800';
    return 'bg-amber-100 text-amber-800';
  };

  const getCanceledAvatarBg = (initials?: string) => {
    if (!initials) return 'bg-slate-100 text-slate-700';
    if (initials === 'PA') return 'bg-amber-100 text-amber-800';
    if (initials === 'AC') return 'bg-cyan-100 text-cyan-800';
    if (initials === 'BT') return 'bg-blue-100 text-blue-800';
    if (initials === 'NH') return 'bg-purple-100 text-purple-800';
    if (initials === 'EM') return 'bg-slate-200 text-slate-800';
    return 'bg-slate-100 text-slate-700';
  };

  const getStaffBadgeBg = (initials?: string) => {
    if (!initials) return 'bg-indigo-100 text-indigo-700';
    if (initials.includes('J') || initials === 'JL') return 'bg-purple-100 text-purple-700';
    if (initials.includes('M') || initials === 'MR') return 'bg-cyan-100 text-cyan-800';
    return 'bg-indigo-100 text-indigo-700';
  };

  const getStatusBadgeStyle = (status: AppointmentStatus) => {
    switch (status) {
      case 'Checked In':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Progress':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Completed':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Canceled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'No Show':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Waitlisted':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Scheduled':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const formatDateHeader = (dateStr?: string, tab?: HorizonTab) => {
    if (!dateStr) return 'May 16, 2025';
    if (tab === 'Next 7 Days') {
      if (dateStr === '2025-05-18') return 'Sun, May 18, 2025';
      if (dateStr === '2025-05-19') return 'Mon, May 19, 2025';
      if (dateStr === '2025-05-20') return 'Tue, May 20, 2025';
      if (dateStr === '2025-05-21') return 'Wed, May 21, 2025';
      if (dateStr === '2025-05-22') return 'Thu, May 22, 2025';
      if (dateStr === '2025-05-23') return 'Fri, May 23, 2025';
    }
    if (dateStr === '2025-05-16') return 'May 16, 2025';
    if (dateStr === '2025-05-17') return 'May 17, 2025';
    if (dateStr === '2025-05-15') return 'May 15, 2025';
    if (dateStr === '2025-05-14') return 'May 14, 2025';
    if (dateStr === '2025-05-13') return 'May 13, 2025';
    if (dateStr === '2025-05-12') return 'May 12, 2025';
    return dateStr;
  };

  // Filter logic based on active horizon tab
  const filteredAppointments = appointmentsList.filter((item) => {
    // 1. Tab filter
    if (activeTab === 'Today') {
      const isToday =
        item.date === '2025-05-16' ||
        ['appt-101', 'appt-102', 'appt-103', 'appt-104', 'appt-105', 'appt-106'].includes(item.id);
      if (!isToday) return false;
    } else if (activeTab === 'Tomorrow') {
      const isTomorrow =
        item.date === '2025-05-17' ||
        ['appt-107', 'appt-108', 'appt-109', 'appt-110', 'appt-111'].includes(item.id);
      if (!isTomorrow) return false;
    } else if (activeTab === 'Next 7 Days') {
      const isNext7 =
        ['appt-113', 'appt-114', 'appt-115', 'appt-116', 'appt-117', 'appt-112'].includes(item.id) ||
        (item.date && item.date >= '2025-05-18' && item.date <= '2025-05-24' && item.status !== 'Completed' && item.status !== 'Canceled');
      if (!isNext7) return false;
    } else if (activeTab === 'This Week') {
      const isThisWeek =
        ['appt-101', 'appt-102', 'appt-103', 'appt-104', 'appt-105', 'appt-106', 'appt-107', 'appt-108', 'appt-110', 'appt-111', 'appt-112', 'appt-113', 'appt-114', 'appt-115', 'appt-116', 'appt-117'].includes(item.id) ||
        (item.date && item.date >= '2025-05-16' && item.date <= '2025-05-23' && item.status !== 'Completed' && item.status !== 'Canceled' && item.status !== 'Waitlisted');
      if (!isThisWeek) return false;
    } else if (activeTab === 'This Month') {
      const isThisMonth =
        (item.date && item.date.startsWith('2025-05') && item.status !== 'Canceled') ||
        (!item.id.includes('canc') && !item.id.includes('wait'));
      if (!isThisMonth) return false;
    } else if (activeTab === 'Waitlist') {
      const isWaitlist =
        item.status === 'Waitlisted' ||
        item.id.startsWith('appt-wait') ||
        item.id === 'appt-109';
      if (!isWaitlist) return false;
    } else if (activeTab === 'Past') {
      const isPast =
        item.status === 'Completed' ||
        item.id.startsWith('appt-past') ||
        (item.date && item.date < '2025-05-16' && item.status !== 'Canceled');
      if (!isPast) return false;
    } else if (activeTab === 'Canceled') {
      const isCanceled =
        item.status === 'Canceled' ||
        item.status === 'No Show' ||
        item.id.startsWith('appt-canc');
      if (!isCanceled) return false;
    }

    // 2. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPet = item.petName.toLowerCase().includes(q);
      const matchCustomer = item.customerName?.toLowerCase().includes(q);
      const matchService = item.serviceName.toLowerCase().includes(q);
      const matchGroomer = item.staffName?.toLowerCase().includes(q);
      if (!matchPet && !matchCustomer && !matchService && !matchGroomer) return false;
    }

    // 3. Dropdown filters
    if (activeTab !== 'Waitlist' && activeTab !== 'Canceled') {
      if (groomerFilter !== 'All Groomers' && item.staffName && !item.staffName.includes(groomerFilter)) {
        return false;
      }
      if (serviceFilter !== 'All Services' && !item.serviceName.includes(serviceFilter)) {
        return false;
      }
      if (statusFilter !== 'All Statuses' && item.status !== statusFilter) {
        return false;
      }
      if (locationFilter !== 'All Locations' && item.location && !item.location.includes(locationFilter)) {
        return false;
      }
    }

    return true;
  });

  const updateAppointmentStatus = async (id: string, newStatus: AppointmentStatus) => {
    // Optimistic UI update
    setAppointmentsList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    if (propOnUpdateStatus) {
      propOnUpdateStatus(id, newStatus as any);
    }

    // Persist to Supabase if valid UUID / Supabase record
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (e) {
      console.log('Status update stored in local session:', e);
    }
  };

  // Action Menu Dispatcher
  const handleActionClick = (actionKey: string, appt: AppointmentItem) => {
    setActiveActionMenuId(null);
    if (actionKey === 'check-in') {
      updateAppointmentStatus(appt.id, 'Checked In');
      showToast(`✓ ${appt.petName} checked in successfully!`);
    } else if (actionKey === 'mark-in-progress') {
      updateAppointmentStatus(appt.id, 'In Progress');
      showToast(`⏱ Grooming marked in progress for ${appt.petName}.`);
    } else if (actionKey === 'mark-complete') {
      updateAppointmentStatus(appt.id, 'Completed');
      showToast(`🎉 Appointment completed for ${appt.petName}! Ready for pickup.`);
    } else if (actionKey === 'duplicate') {
      nextIdRef.current += 1;
      const copy: AppointmentItem = {
        ...appt,
        id: `appt-dup-${nextIdRef.current}`,
        time: '10:00 AM',
        status: 'Scheduled',
      };
      setAppointmentsList((prev) => [copy, ...prev]);
      showToast(`Duplicated appointment for ${appt.petName}.`);
    } else if (actionKey === 'add-waitlist') {
      updateAppointmentStatus(appt.id, 'Waitlisted');
      showToast(`Added ${appt.petName} to waitlist queue.`);
    } else {
      // Direct task modal handlers: view-details, edit, reschedule, add-on, take-payment, send-message, add-note, print-sheet, print-invoice, cancel, no-show, delete
      setActiveTaskAppointment(appt);
      setActiveTaskAction(actionKey as AppointmentActionType);
    }
  };

  const handleAddNewAppointment = (prefilledDate?: string, time?: string, groomer?: string, status?: AppointmentStatus) => {
    if (propOnAddAppointment) {
      propOnAddAppointment();
      return;
    }
    nextIdRef.current += 1;
    const newAppt: AppointmentItem = {
      id: `appt-new-${nextIdRef.current}`,
      date: prefilledDate ? prefilledDate.split('T')[0] : '2025-05-16',
      time: time || '9:00 AM',
      duration: '2.5 hrs',
      customerName: 'New Client',
      customerInitials: 'NC',
      petName: 'Bella',
      breed: 'Poodle',
      petEmoji: '🐩',
      serviceName: 'Full Groom',
      staffName: groomer || 'Sarah M.',
      staffInitials: groomer ? groomer[0] : 'SM',
      location: 'Main Location',
      status: status || 'Scheduled',
      price: 85.0,
      paymentStatus: 'Deposit Paid',
      depositAmount: 25.0,
      notes: 'New intake appointment.',
    };
    setAppointmentsList([newAppt, ...appointmentsList]);
    showToast(`New appointment booked for ${newAppt.petName}!`);
  };

  const hasActiveFilters = 
    locationFilter !== 'All Locations' || 
    groomerFilter !== 'All Groomers' || 
    serviceFilter !== 'All Services' || 
    statusFilter !== 'All Statuses' || 
    searchQuery.trim().length > 0;

  const resetFilters = () => {
    setLocationFilter('All Locations');
    setGroomerFilter('All Groomers');
    setServiceFilter('All Services');
    setStatusFilter('All Statuses');
    setSearchQuery('');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white text-black font-sans">
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-black text-white px-4 py-2.5 border border-black shadow-xl flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header matching Screen 1, 2, 3 + Upgraded Header Navigation */}
      <header className="h-16 bg-white border-b border-black px-6 sm:px-8 flex items-center justify-between flex-shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-black uppercase tracking-tight text-black leading-tight">Appointments</h1>
              <span className="inline-flex items-center px-2 py-0.5 border border-black text-xs font-mono font-bold bg-white text-black">
                {filteredAppointments.length} Active
              </span>
            </div>
          </div>
        </div>

        {/* Header Controls: View Switcher + Actions */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* VIEW SWITCHER MOVED UP TO HEADER FOR FULL-WIDTH CANVAS */}
          <div className="flex items-center border border-black bg-white p-0.5">
            <button
              type="button"
              onClick={() => handleViewModeChange('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
              title="Table View with Row Actions"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>

            <button
              type="button"
              onClick={() => handleViewModeChange('kanban')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
              title="Kanban Board View by Stage"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Kanban</span>
            </button>

            <button
              type="button"
              onClick={() => handleViewModeChange('timeline')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
              title="Collision-Free Hourly Timeline by Groomer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Hourly</span>
            </button>

            <button
              type="button"
              onClick={() => handleViewModeChange('calendar')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
              title="FullCalendar Day/Week/Month"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Calendar</span>
            </button>

            <button
              type="button"
              onClick={() => handleViewModeChange('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Grid</span>
            </button>
          </div>

          <button
            onClick={() => showToast('Exporting appointment schedule CSV...')}
            className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-black hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {/* Global Quick Actions Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedAppointmentForQuickActions(appointmentsList[0] || null);
              setIsGlobalQuickActionsOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-black hover:text-white text-black border border-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Quick Actions</span>
          </button>

          <div className="inline-flex border border-black bg-black text-white">
            <button
              onClick={() => handleAddNewAppointment()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
            <span className="w-px bg-neutral-700 my-1" />
            <button 
              onClick={() => handleAddNewAppointment()}
              className="px-2 py-1.5 hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Horizon Filter Tabs matching all reference images */}
      <div className="bg-white border-b border-black px-6 sm:px-8 flex-shrink-0">
        <nav className="flex space-x-4 overflow-x-auto text-xs font-bold custom-scrollbar uppercase tracking-wider">
          {[
            'All Appointments',
            'Calendar',
            'Today',
            'Tomorrow',
            'This Week',
            'Next 7 Days',
            'This Month',
            'Waitlist',
            'Past',
            'Canceled',
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab as HorizonTab)}
              className={`pb-3 pt-2.5 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeTab === tab
                  ? 'border-black text-black font-black bg-black/5 px-2'
                  : 'border-transparent text-gray-500 hover:text-black px-2'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Workspace Area (100% Full Width) */}
      <div className="flex-1 flex overflow-hidden bg-white">
        <main className="flex-1 flex flex-col overflow-y-auto px-6 sm:px-8 py-4 space-y-4 custom-scrollbar">
          {/* Secondary Pure Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 flex-shrink-0 bg-white p-3 border border-black">
            <div className="flex items-center gap-2 flex-1 max-w-5xl flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" />
                Filters:
              </span>

              {/* Location Select */}
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="appearance-none bg-white border border-black px-2.5 py-1.5 pr-7 text-xs text-black font-bold uppercase tracking-wider focus:outline-none cursor-pointer"
                >
                  <option>All Locations</option>
                  <option>Main Location</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-black absolute right-2 top-2 pointer-events-none" />
              </div>

              {/* Groomer Select */}
              <div className="relative">
                <select
                  value={groomerFilter}
                  onChange={(e) => setGroomerFilter(e.target.value)}
                  className="appearance-none bg-white border border-black px-2.5 py-1.5 pr-7 text-xs text-black font-bold uppercase tracking-wider focus:outline-none cursor-pointer"
                >
                  <option>All Groomers</option>
                  <option>Sarah M.</option>
                  <option>Mike R.</option>
                  <option>Jessica L.</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-black absolute right-2 top-2 pointer-events-none" />
              </div>

              {/* Service Select */}
              <div className="relative">
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="appearance-none bg-white border border-black px-2.5 py-1.5 pr-7 text-xs text-black font-bold uppercase tracking-wider focus:outline-none cursor-pointer"
                >
                  <option>All Services</option>
                  <option>Full Groom</option>
                  <option>Bath &amp; Brush</option>
                  <option>Deluxe Spa</option>
                  <option>Nail Trim</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-black absolute right-2 top-2 pointer-events-none" />
              </div>

              {/* Status Select */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-black px-2.5 py-1.5 pr-7 text-xs text-black font-bold uppercase tracking-wider focus:outline-none cursor-pointer"
                >
                  <option>All Statuses</option>
                  <option>Scheduled</option>
                  <option>Confirmed</option>
                  <option>Checked In</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Waitlisted</option>
                  <option>Canceled</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-black absolute right-2 top-2 pointer-events-none" />
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-black hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Status Legend Modal Trigger */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowStatusLegend(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-black hover:text-white border border-black text-xs font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Status Legend</span>
              </button>
            </div>
          </div>

          {/* Section Counter */}
          <div className="flex items-center justify-between text-xs px-1 flex-shrink-0">
            <div className="flex items-center gap-2 font-black uppercase tracking-wider text-black">
              <span>
                {filteredAppointments.length}{' '}
                {activeTab === 'Waitlist'
                  ? 'Pets on Waitlist'
                  : activeTab === 'Past'
                  ? 'Past Appointments'
                  : activeTab === 'Canceled'
                  ? 'Canceled Appointments'
                  : activeTab === 'Tomorrow'
                  ? 'Appointments Tomorrow'
                  : activeTab === 'Next 7 Days'
                  ? 'Appointments Next 7 Days'
                  : activeTab === 'Today'
                  ? 'Appointments Today'
                  : activeTab === 'This Week'
                  ? 'Appointments This Week'
                  : activeTab === 'This Month'
                  ? 'Appointments This Month'
                  : 'Appointments'}
              </span>
              <button 
                onClick={() => showToast('Refreshing appointment list...')}
                className="p-1 hover:bg-gray-100 border border-black text-black transition-colors cursor-pointer"
                title="Refresh"
              >
                <RotateCw className="w-3 h-3" />
              </button>
            </div>

            {viewMode === 'list' && (
              <div className="flex items-center gap-1.5 text-gray-600 font-mono text-[11px]">
                <span>Sort:</span>
                <span className="font-bold text-black uppercase">{sortBy}</span>
              </div>
            )}
          </div>

          {/* Main View Mode Switch: Calendar / Kanban / Timeline / Grid / List */}
          {viewMode === 'calendar' ? (
            /* FullCalendar Interactive Engine */
            <FullCalendarView
              appointments={appointmentsList}
              onSelectAppointment={(appt) => handleActionClick('view-details', appt)}
              onAddAppointment={(dateStr) => handleAddNewAppointment(dateStr)}
            />
          ) : viewMode === 'kanban' ? (
            /* Kanban Board by Stage */
            <KanbanView
              appointments={filteredAppointments}
              onSelectAppointment={(appt) => handleActionClick('view-details', appt)}
              onUpdateStatus={updateAppointmentStatus}
              onAddAppointment={(status) => handleAddNewAppointment(undefined, undefined, undefined, status)}
              onActionClick={handleActionClick}
            />
          ) : viewMode === 'timeline' ? (
            /* Hourly Timeline by Groomer (Collision-Free) */
            <HourlyTimelineView
              appointments={filteredAppointments}
              onSelectAppointment={(appt) => handleActionClick('view-details', appt)}
              onAddAppointment={(date, time, groomer) => handleAddNewAppointment(date, time, groomer)}
              onUpdateStatus={updateAppointmentStatus}
              onActionClick={handleActionClick}
            />
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAppointments.map((appt) => (
                <div
                  key={appt.id}
                  onClick={() => handleActionClick('view-details', appt)}
                  className="bg-white border border-black p-4 space-y-3 relative hover:border-2 hover:border-black transition cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 border border-black bg-white flex items-center justify-center font-bold text-black text-base">
                        {appt.petEmoji}
                      </div>
                      <div>
                        <h4 className="font-bold text-black text-xs uppercase">{appt.customerName || 'Pet Parent'}</h4>
                        <p className="text-[11px] text-gray-600 font-medium">{appt.petName} • {appt.breed}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-black ${
                      appt.status === 'Checked In'
                        ? 'bg-amber-50 text-amber-800'
                        : appt.status === 'In Progress'
                        ? 'bg-purple-50 text-purple-800'
                        : appt.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-800'
                        : appt.status === 'Completed'
                        ? 'bg-teal-50 text-teal-900'
                        : appt.status === 'Canceled'
                        ? 'bg-rose-50 text-rose-800'
                        : appt.status === 'Waitlisted'
                        ? 'bg-orange-50 text-orange-800'
                        : 'bg-blue-50 text-blue-800'
                    }`}>
                      {appt.status}
                    </span>
                  </div>

                  <div className="bg-white border border-black p-2.5 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase font-mono">Service:</span>
                      <span className="font-bold text-black">{appt.serviceName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase font-mono">Time:</span>
                      <span className="font-bold text-black font-mono">{appt.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase font-mono">Groomer:</span>
                      <span className="font-bold text-black">{appt.staffName || 'Unassigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase font-mono">Price:</span>
                      <span className="font-bold text-black font-mono">${appt.price?.toFixed(2) || '85.00'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleActionClick('view-details', appt)}
                      className="text-xs text-black font-bold uppercase hover:underline cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setActiveActionMenuId(activeActionMenuId === appt.id ? null : appt.id)}
                      className="w-7 h-7 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors text-black cursor-pointer"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {activeActionMenuId === appt.id && (
                    <AppointmentActionMenu
                      appointment={appt}
                      onClose={() => setActiveActionMenuId(null)}
                      onAction={handleActionClick}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Standard Full-Feature Appointments Table matching Screens 1, 2, 3, 4, 5, 8 */
            <div className="relative bg-white border border-black overflow-visible">
              <div className="overflow-x-auto">
                {activeTab === 'Canceled' ? (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-black bg-white text-[10px] font-black uppercase tracking-widest text-black">
                        <th className="py-3 px-4">Date &amp; Time</th>
                        <th className="py-3 px-4">Customer / Pet</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Groomer</th>
                        <th className="py-3 px-4">Cancellation Reason</th>
                        <th className="py-3 px-4">Canceled At</th>
                        <th className="py-3 px-4">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 text-black text-xs">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-gray-500">
                            <p className="font-bold uppercase text-sm">No canceled appointments</p>
                            <p className="text-xs mt-1">Try clearing filters or search query.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((appt) => (
                          <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 whitespace-nowrap font-bold text-black">
                              {formatDateHeader(appt.date, activeTab)}{' '}
                              <span className="text-gray-500 font-normal font-mono text-[11px]">{appt.time || '9:00 AM'}</span>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 border border-black bg-black text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                                  {appt.customerInitials || 'PA'}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-black leading-tight">{appt.customerName}</span>
                                  <span className="text-[10px] text-gray-500 leading-tight">{appt.petName}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-black font-medium">{appt.serviceName}</td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-black">{appt.staffName || 'Sarah M.'}</td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-1.5 py-0.5 border border-black text-[9px] font-bold uppercase tracking-wider ${
                                appt.cancellationReason === 'Canceled by Salon'
                                  ? 'bg-amber-50 text-amber-800'
                                  : appt.cancellationReason === 'No Show' || appt.status === 'No Show'
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-rose-50 text-rose-800'
                              }`}>
                                {appt.cancellationReason || (appt.status === 'No Show' ? 'No Show' : 'Canceled by Customer')}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-gray-600 font-mono text-[11px]">{appt.canceledAt || 'May 13, 2025 2:30 PM'}</td>
                            <td className="py-3.5 px-4 text-gray-600 text-[11px]">{appt.notes || '—'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                ) : activeTab === 'Waitlist' ? (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-black bg-white text-[10px] font-black uppercase tracking-widest text-black">
                        <th className="py-3.5 px-5">Customer / Pet</th>
                        <th className="py-3.5 px-4">Service</th>
                        <th className="py-3.5 px-4">Preferred Date</th>
                        <th className="py-3.5 px-4">Notes</th>
                        <th className="py-3.5 px-4">Added On</th>
                        <th className="py-3.5 px-4 text-right">Row Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 text-black text-xs">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-gray-500">
                            <p className="font-bold uppercase text-sm">No pets on waitlist</p>
                            <p className="text-xs mt-1">Try clearing filters or search query.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((appt) => (
                          <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-5 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 border border-black bg-white overflow-hidden flex items-center justify-center shrink-0 text-black font-bold text-xs">
                                  {appt.petAvatar ? (
                                    <img alt={appt.petName} className="w-full h-full object-cover" src={appt.petAvatar} />
                                  ) : (
                                    <span>{appt.customerInitials || appt.petEmoji}</span>
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-black leading-tight">{appt.customerName}</div>
                                  <div className="text-[11px] text-gray-600 leading-tight">{appt.petName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap font-bold text-black">{appt.serviceName}</td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-black font-mono">{appt.preferredDate || 'Anytime'}</td>
                            <td className="py-3.5 px-4 text-gray-600">{appt.notes || '—'}</td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-gray-600 font-mono text-[11px]">{appt.addedOn || 'May 16, 2025'}</td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-right relative">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleAddNewAppointment(undefined, undefined, undefined, 'Scheduled')}
                                  className="px-2.5 py-1 bg-black text-white hover:bg-neutral-800 border border-black font-bold uppercase text-[10px] transition-colors cursor-pointer"
                                >
                                  Book Slot
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleActionClick('view-details', appt)}
                                  className="text-[11px] text-black font-bold uppercase px-2 py-1 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                                >
                                  Details
                                </button>
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setActiveActionMenuId(activeActionMenuId === appt.id ? null : appt.id)}
                                    className="w-7 h-7 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors text-black cursor-pointer"
                                  >
                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                  </button>
                                  {activeActionMenuId === appt.id && (
                                    <AppointmentActionMenu
                                      appointment={appt}
                                      onClose={() => setActiveActionMenuId(null)}
                                      onAction={handleActionClick}
                                    />
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-black bg-white text-[10px] font-black uppercase tracking-widest text-black">
                        <th className="py-3 px-4">Date &amp; Time</th>
                        <th className="py-3 px-4">Customer / Pet</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Groomer</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4 text-right">Assigned Row Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 text-black text-xs">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-gray-500">
                            <p className="font-bold uppercase text-sm">No appointments found</p>
                            <p className="text-xs mt-1">Try clearing filters or search query.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((appt) => (
                          <tr key={appt.id} className="hover:bg-gray-50 transition-colors relative">
                            {/* Date & Time */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-bold text-black">
                                {formatDateHeader(appt.date, activeTab)}
                              </div>
                              <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                                {appt.time} {appt.duration && `(${appt.duration})`}
                              </div>
                            </td>

                            {/* Customer / Pet */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2.5">
                                {appt.petAvatar ? (
                                  <img
                                    src={appt.petAvatar}
                                    alt={appt.petName}
                                    className="w-7 h-7 border border-black object-cover shrink-0"
                                  />
                                ) : (
                                  <div className="w-7 h-7 border border-black bg-black text-white font-bold flex items-center justify-center text-xs shrink-0">
                                    {appt.customerInitials || appt.petEmoji}
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-black leading-tight">
                                    {appt.customerName || 'Sarah Johnson'}
                                  </div>
                                  <div className="text-[11px] text-gray-600 leading-tight">
                                    {appt.petName}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Service */}
                            <td className="py-3 px-4 font-bold whitespace-nowrap text-black">
                              {appt.serviceName}
                            </td>

                            {/* Groomer */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {appt.staffAvatar ? (
                                  <img
                                    src={appt.staffAvatar}
                                    alt={appt.staffName || 'Groomer'}
                                    className="w-6 h-6 border border-black object-cover shrink-0"
                                  />
                                ) : (
                                  <div className="w-5 h-5 border border-black bg-white text-[9px] font-bold text-black flex items-center justify-center shrink-0">
                                    {appt.staffInitials || (appt.staffName ? appt.staffName[0] : 'SM')}
                                  </div>
                                )}
                                <span className="text-black font-medium">
                                  {appt.staffName || 'Sarah M.'}
                                </span>
                              </div>
                            </td>

                            {/* Location */}
                            <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                              {appt.location || 'Main Location'}
                            </td>

                            {/* Status Badge */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-1.5 py-0.5 border border-black text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeStyle(appt.status)}`}>
                                {appt.status}
                              </span>
                            </td>

                            {/* Payment */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              {appt.paymentStatus === '—' ? (
                                <span className="text-gray-400 font-medium">—</span>
                              ) : (
                                <>
                                  <div className="text-[10px] text-gray-500 font-mono uppercase leading-none mb-1">
                                    {appt.paymentStatus || 'Deposit Paid'}
                                  </div>
                                  <div className="font-bold text-black font-mono text-xs">
                                    ${appt.depositAmount ? appt.depositAmount.toFixed(2) : appt.price ? appt.price.toFixed(2) : '25.00'}
                                  </div>
                                </>
                              )}
                            </td>

                            {/* Actions with assigned row-level buttons */}
                            <td className="py-3 px-4 text-right whitespace-nowrap relative">
                              <div className="flex items-center justify-end gap-1.5">
                                {appt.status === 'Scheduled' && (
                                  <button
                                    type="button"
                                    onClick={() => updateAppointmentStatus(appt.id, 'Confirmed')}
                                    className="px-2 py-1 bg-white hover:bg-black hover:text-white border border-black text-black font-bold uppercase text-[10px] transition-colors cursor-pointer"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {appt.status === 'Confirmed' && (
                                  <button
                                    type="button"
                                    onClick={() => updateAppointmentStatus(appt.id, 'Checked In')}
                                    className="px-2 py-1 bg-white hover:bg-black hover:text-white border border-black text-black font-bold uppercase text-[10px] transition-colors cursor-pointer"
                                  >
                                    Check In
                                  </button>
                                )}
                                {appt.status === 'Checked In' && (
                                  <button
                                    type="button"
                                    onClick={() => updateAppointmentStatus(appt.id, 'In Progress')}
                                    className="px-2 py-1 bg-white hover:bg-black hover:text-white border border-black text-black font-bold uppercase text-[10px] transition-colors cursor-pointer"
                                  >
                                    Start Groom
                                  </button>
                                )}
                                {appt.status === 'In Progress' && (
                                  <button
                                    type="button"
                                    onClick={() => updateAppointmentStatus(appt.id, 'Completed')}
                                    className="px-2 py-1 bg-black text-white hover:bg-neutral-800 border border-black font-bold uppercase text-[10px] transition-colors cursor-pointer"
                                  >
                                    Complete
                                  </button>
                                )}
                                {appt.status === 'Completed' && (
                                  <button
                                    type="button"
                                    onClick={() => handleActionClick('invoice', appt)}
                                    className="px-2 py-1 bg-white hover:bg-black hover:text-white border border-black text-black font-bold uppercase text-[10px] transition-colors cursor-pointer"
                                  >
                                    Invoice
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleActionClick('view-details', appt)}
                                  className="text-[11px] text-black font-bold uppercase px-2 py-1 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                                >
                                  Details
                                </button>

                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setActiveActionMenuId(activeActionMenuId === appt.id ? null : appt.id)}
                                    className="w-7 h-7 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors text-black cursor-pointer"
                                  >
                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Dropdown Action Overlay Menu matching Screen 2 */}
                                  {activeActionMenuId === appt.id && (
                                    <AppointmentActionMenu
                                      appointment={appt}
                                      onClose={() => setActiveActionMenuId(null)}
                                      onAction={handleActionClick}
                                    />
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Table Pagination Footer matching design */}
              <div className="px-4 py-3 border-t border-black bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-black">
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase tracking-wider text-[11px]">Show</span>
                  <div className="relative">
                    <select className="appearance-none bg-white border border-black pl-2.5 pr-7 py-1 text-xs text-black font-bold uppercase focus:outline-none cursor-pointer">
                      <option>25</option>
                      <option>50</option>
                      <option>100</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-black absolute right-2 top-2 pointer-events-none" />
                  </div>
                  <span className="font-bold uppercase tracking-wider text-[11px]">per page</span>
                </div>

                <div className="flex items-center gap-1">
                  <button className="px-2 py-1 border border-black text-black hover:bg-black hover:text-white uppercase font-bold text-[11px] transition-colors cursor-pointer disabled:opacity-40" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-7 h-7 border border-black bg-black text-white font-bold flex items-center justify-center text-xs">1</button>
                  <button className="w-7 h-7 border border-black hover:bg-gray-100 text-black font-bold flex items-center justify-center text-xs cursor-pointer">2</button>
                  <button className="w-7 h-7 border border-black hover:bg-gray-100 text-black font-bold flex items-center justify-center text-xs cursor-pointer">3</button>
                  <button className="w-7 h-7 border border-black hover:bg-gray-100 text-black font-bold flex items-center justify-center text-xs cursor-pointer">4</button>
                  <button className="px-2 py-1 border border-black text-black hover:bg-black hover:text-white uppercase font-bold text-[11px] transition-colors cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-black font-mono text-[11px]">
                  1 – {filteredAppointments.length} of {appointmentsList.length} appointments
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      {showStatusLegend && (
        <StatusLegendModal onClose={() => setShowStatusLegend(false)} />
      )}

      {/* Global Quick Actions Modal */}
      <QuickActionsModal
        isOpen={isGlobalQuickActionsOpen}
        onClose={() => setIsGlobalQuickActionsOpen(false)}
        onSelectAction={handleUnifiedQuickAction}
        appointment={selectedAppointmentForQuickActions || appointmentsList[0] || null}
      />

      {/* Dynamic Action Task Completion Modals for all 16 Context Actions */}
      {activeTaskAction && activeTaskAppointment && (
        <AppointmentTaskModals
          actionType={activeTaskAction}
          appointment={activeTaskAppointment}
          onClose={() => {
            setActiveTaskAction(null);
            setActiveTaskAppointment(null);
          }}
          onUpdateAppointment={(updated) => {
            setAppointmentsList((prev) => 
              prev.map((a) => (a.id === updated.id ? updated : a))
            );
          }}
          onDeleteAppointment={(id) => {
            setAppointmentsList((prev) => prev.filter((a) => a.id !== id));
          }}
          onDuplicateAppointment={(appt) => {
            nextIdRef.current += 1;
            const copy: AppointmentItem = {
              ...appt,
              id: `appt-dup-${nextIdRef.current}`,
              time: '10:00 AM',
              status: 'Scheduled',
            };
            setAppointmentsList((prev) => [copy, ...prev]);
          }}
          onShowToast={showToast}
        />
      )}
    </div>
  );
};
