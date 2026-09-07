'use client';

import React, { useState } from 'react';
import { 
  DawgNavSection, 
  KPIMetric, 
  AppointmentItem, 
  StaffScheduleItem, 
  FunnelStage, 
  GroomingRecord, 
  AlertNotification 
} from '@/lib/types';
import { 
  Calendar, 
  DollarSign, 
  UserPlus, 
  PawPrint, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRight, 
  ChevronDown, 
  Plus, 
  MoreHorizontal,
  ShieldAlert,
  FileText,
  Cake,
  Package,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface DashboardViewProps {
  metrics: KPIMetric[];
  appointments: AppointmentItem[];
  staffSchedules: StaffScheduleItem[];
  bookingFunnel: FunnelStage[];
  groomingRecords: GroomingRecord[];
  alerts: AlertNotification[];
  onNavigateSection: (section: DawgNavSection) => void;
  onOpenQuickAction: (actionType: 'appointment' | 'customer' | 'pet' | 'intake' | 'payment' | 'invoice') => void;
  onSelectAppointment?: (appt: AppointmentItem) => void;
  onToggleAppointmentStatus?: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  appointments,
  staffSchedules,
  bookingFunnel,
  groomingRecords,
  alerts,
  onNavigateSection,
  onOpenQuickAction,
  onSelectAppointment,
  onToggleAppointmentStatus
}) => {
  const [revenuePeriod, setRevenuePeriod] = useState<'This Week' | 'This Month' | 'Quarter'>('This Week');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(4); // default Friday highlighted

  // Revenue chart dataset
  const revenuePoints = [
    { day: 'Mon', amount: '$4,200', x: 30, y: 95 },
    { day: 'Tue', amount: '$4,800', x: 75, y: 88 },
    { day: 'Wed', amount: '$6,200', x: 120, y: 62 },
    { day: 'Thu', amount: '$5,900', x: 165, y: 72 },
    { day: 'Fri', amount: '$8,400', x: 210, y: 40 },
    { day: 'Sat', amount: '$6,900', x: 255, y: 64 },
    { day: 'Sun', amount: '$5,400', x: 300, y: 80 },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1600px] mx-auto bg-white text-black font-sans">
      {/* 1. KEY PERFORMANCE INDICATOR CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5" data-purpose="kpi-metrics-grid">
        {/* Card 1: Today's Appointments */}
        <div 
          onClick={() => onNavigateSection('appointments')}
          className="bg-white p-3.5 border border-black hover:border-2 transition-all cursor-pointer flex items-center gap-3"
        >
          <div className="w-11 h-11 border border-black bg-black text-white flex items-center justify-center text-xl flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 truncate">Today&apos;s Appointments</p>
            <p className="text-xl font-black text-black font-mono tracking-tight">28</p>
            <p className="text-[10px] font-bold text-black flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" /> 12% <span className="font-normal text-gray-400 ml-0.5">vs yesterday</span>
            </p>
          </div>
        </div>

        {/* Card 2: Today's Revenue */}
        <div 
          onClick={() => onNavigateSection('payments')}
          className="bg-white p-3.5 border border-black hover:border-2 transition-all cursor-pointer flex items-center gap-3"
        >
          <div className="w-11 h-11 border border-black bg-black text-white flex items-center justify-center text-xl flex-shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 truncate">Today&apos;s Revenue</p>
            <p className="text-xl font-black text-black font-mono tracking-tight">$6,842.50</p>
            <p className="text-[10px] font-bold text-black flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" /> 18% <span className="font-normal text-gray-400 ml-0.5">vs yesterday</span>
            </p>
          </div>
        </div>

        {/* Card 3: New Customers (30d) */}
        <div 
          onClick={() => onNavigateSection('customers')}
          className="bg-white p-3.5 border border-black hover:border-2 transition-all cursor-pointer flex items-center gap-3"
        >
          <div className="w-11 h-11 border border-black bg-black text-white flex items-center justify-center text-xl flex-shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 truncate">New Customers (30d)</p>
            <p className="text-xl font-black text-black font-mono tracking-tight">46</p>
            <p className="text-[10px] font-bold text-black flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" /> 15% <span className="font-normal text-gray-400 ml-0.5">vs last 30 days</span>
            </p>
          </div>
        </div>

        {/* Card 4: No Show Rate (30d) */}
        <div 
          onClick={() => onNavigateSection('reports')}
          className="bg-white p-3.5 border border-black hover:border-2 transition-all cursor-pointer flex items-center gap-3"
        >
          <div className="w-11 h-11 border border-black bg-black text-white flex items-center justify-center text-xl flex-shrink-0">
            <PawPrint className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 truncate">No Show Rate (30d)</p>
            <p className="text-xl font-black text-black font-mono tracking-tight">4.2%</p>
            <p className="text-[10px] font-bold text-black flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3 stroke-[2.5]" /> 1.3% <span className="font-normal text-gray-400 ml-0.5">vs last 30 days</span>
            </p>
          </div>
        </div>

        {/* Card 5: Rebook Rate (30d) */}
        <div 
          onClick={() => onNavigateSection('reports')}
          className="bg-white p-3.5 border border-black hover:border-2 transition-all cursor-pointer flex items-center gap-3"
        >
          <div className="w-11 h-11 border border-black bg-black text-white flex items-center justify-center text-xl flex-shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 truncate">Rebook Rate (30d)</p>
            <p className="text-xl font-black text-black font-mono tracking-tight">68%</p>
            <p className="text-[10px] font-bold text-black flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" /> 6% <span className="font-normal text-gray-400 ml-0.5">vs last 30 days</span>
            </p>
          </div>
        </div>
      </section>

      {/* 2. MID SECTION (Appointments, Revenue Chart, Staff Schedule) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5" data-purpose="primary-operations-grid">
        {/* Column 1: Today's Appointments List (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-black p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-black">
              <h3 className="font-black text-xs uppercase tracking-wider text-black">Today&apos;s Appointments</h3>
              <button
                onClick={() => onNavigateSection('calendar')}
                className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
              >
                View Calendar
              </button>
            </div>

            {/* List of Appointments */}
            <div className="space-y-3">
              {appointments.slice(0, 5).map((appt) => (
                <div 
                  key={appt.id} 
                  onClick={() => onToggleAppointmentStatus && onToggleAppointmentStatus(appt.id)}
                  className="flex items-center justify-between text-xs py-1 hover:bg-gray-50 px-1 border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer"
                >
                  <span className="text-gray-500 font-mono text-[11px] w-14">{appt.time}</span>
                  <div className="flex items-center gap-2 flex-1 min-w-0 px-2">
                    <div className="w-7 h-7 border border-black bg-white flex items-center justify-center text-black text-xs font-bold flex-shrink-0">
                      {appt.petEmoji}
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-black leading-tight truncate uppercase">{appt.petName}</p>
                      <p className="text-[10px] text-gray-500 leading-tight">{appt.breed}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] text-black font-bold">{appt.serviceName}</p>
                    {appt.staffName && (
                      <span className="text-[10px] text-gray-500 block">{appt.staffName}</span>
                    )}
                    <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase border border-black ${
                      appt.status === 'Checked In'
                        ? 'text-amber-800 bg-amber-50'
                        : appt.status === 'In Progress'
                        ? 'text-purple-800 bg-purple-50'
                        : appt.status === 'Completed'
                        ? 'text-teal-900 bg-teal-50'
                        : 'text-blue-800 bg-blue-50'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-black">
            <button
              onClick={() => onNavigateSection('appointments')}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-black hover:underline"
            >
              <span>View all appointments</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Column 2: Revenue Overview (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-black p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-xs uppercase tracking-wider text-black">Revenue Overview</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-black text-black font-mono tracking-tight">$34,341.00</span>
                  <span className="text-[11px] font-bold text-black flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" /> 16.4% <span className="font-normal text-gray-500 ml-0.5">vs last week</span>
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setRevenuePeriod(p => p === 'This Week' ? 'This Month' : 'This Week')}
                className="flex items-center gap-1 text-[11px] font-bold uppercase bg-white border border-black px-2 py-1 hover:bg-black hover:text-white transition-colors"
              >
                <span>{revenuePeriod}</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* SVG Line Chart */}
            <div className="mt-4 h-36 w-full relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 120">
                {/* Grid Lines */}
                <line stroke="#000000" strokeDasharray="2 2" strokeOpacity="0.2" strokeWidth="1" x1="20" x2="310" y1="20" y2="20" />
                <line stroke="#000000" strokeDasharray="2 2" strokeOpacity="0.2" strokeWidth="1" x1="20" x2="310" y1="50" y2="50" />
                <line stroke="#000000" strokeDasharray="2 2" strokeOpacity="0.2" strokeWidth="1" x1="20" x2="310" y1="80" y2="80" />
                <line stroke="#000000" strokeDasharray="2 2" strokeOpacity="0.2" strokeWidth="1" x1="20" x2="310" y1="110" y2="110" />

                {/* Left Axis Labels */}
                <text fill="#000000" fontSize="8" fontWeight="bold" fontFamily="monospace" x="0" y="24">$8K</text>
                <text fill="#000000" fontSize="8" fontWeight="bold" fontFamily="monospace" x="0" y="54">$6K</text>
                <text fill="#000000" fontSize="8" fontWeight="bold" fontFamily="monospace" x="0" y="84">$4K</text>
                <text fill="#000000" fontSize="8" fontWeight="bold" fontFamily="monospace" x="0" y="114">$0</text>

                {/* Area Fill */}
                <path d="M 30 95 L 75 88 L 120 62 L 165 72 L 210 40 L 255 64 L 300 80 L 300 110 L 30 110 Z" fill="#000000" fillOpacity="0.06" />

                {/* Main Line */}
                <path d="M 30 95 L 75 88 L 120 62 L 165 72 L 210 40 L 255 64 L 300 80" fill="none" stroke="#000000" strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" />

                {/* Interactive Nodes */}
                {revenuePoints.map((pt, i) => (
                  <g key={pt.day} onMouseEnter={() => setHoveredPoint(i)}>
                    <rect
                      x={pt.x - (hoveredPoint === i ? 4 : 2.5)}
                      y={pt.y - (hoveredPoint === i ? 4 : 2.5)}
                      width={hoveredPoint === i ? 8 : 5}
                      height={hoveredPoint === i ? 8 : 5}
                      fill={hoveredPoint === i ? '#000000' : '#ffffff'}
                      stroke="#000000"
                      strokeWidth={1.5}
                      className="cursor-pointer transition-all"
                    />
                  </g>
                ))}
              </svg>

              {/* X-Axis Labels */}
              <div className="flex justify-between pl-6 pr-2 text-[9px] text-black mt-1 font-mono font-bold uppercase">
                {revenuePoints.map((pt, i) => (
                  <span 
                    key={pt.day}
                    className={hoveredPoint === i ? 'bg-black text-white px-1' : ''}
                  >
                    {pt.day}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Stat Category Pills */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-black text-center">
            <div className="bg-white p-2 border border-black">
              <p className="text-[10px] text-gray-500 uppercase font-mono">Services</p>
              <p className="text-xs font-black text-black font-mono">$26,541.00</p>
              <p className="text-[9px] text-black font-bold font-mono">77%</p>
            </div>
            <div className="bg-white p-2 border border-black">
              <p className="text-[10px] text-gray-500 uppercase font-mono">Products</p>
              <p className="text-xs font-black text-black font-mono">$4,842.00</p>
              <p className="text-[9px] text-black font-bold font-mono">14%</p>
            </div>
            <div className="bg-white p-2 border border-black">
              <p className="text-[10px] text-gray-500 uppercase font-mono">Add-ons</p>
              <p className="text-xs font-black text-black font-mono">$2,958.00</p>
              <p className="text-[9px] text-black font-bold font-mono">9%</p>
            </div>
          </div>
        </div>

        {/* Column 3: Today's Schedule (Staff Capacity) (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-black p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-black">
              <h3 className="font-black text-xs uppercase tracking-wider text-black">Today&apos;s Schedule (Staff)</h3>
              <button
                onClick={() => onNavigateSection('schedule')}
                className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
              >
                View Full Schedule
              </button>
            </div>

            {/* Staff Grid Slots */}
            <div className="space-y-3.5">
              {staffSchedules.map((staff) => (
                <div key={staff.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 w-28 flex-shrink-0">
                    <div className="w-7 h-7 border border-black bg-white text-black flex items-center justify-center font-bold text-[10px]">
                      {staff.initials}
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-black leading-tight truncate uppercase">{staff.name}</p>
                      <p className="text-[10px] text-gray-500">{staff.role}</p>
                    </div>
                  </div>

                  {/* Mini slot bars */}
                  <div className="flex items-center gap-1">
                    {staff.slots.map((slot, idx) => (
                      <span
                        key={idx}
                        title={`${staff.name} - Slot ${idx + 1}: ${slot}`}
                        className={`w-2.5 h-4 border border-black transition-colors ${
                          slot === 'booked'
                            ? 'bg-black'
                            : slot === 'break'
                            ? 'bg-gray-400'
                            : slot === 'blocked'
                            ? 'bg-gray-700'
                            : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="text-right w-10">
                    <span className="font-black text-black text-xs font-mono">{staff.appointmentsCount}</span>
                    <span className="text-[10px] text-gray-500 block uppercase">appts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Legend */}
          <div className="flex items-center justify-center gap-4 text-[10px] text-black font-bold uppercase pt-3 border-t border-black">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 border border-black bg-black" /> Booked</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 border border-black bg-white" /> Available</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 border border-black bg-gray-400" /> Break</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 border border-black bg-gray-700" /> Blocked</div>
          </div>
        </div>
      </section>

      {/* 3. LOWER SECTION (Funnel, Records, Alerts) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5" data-purpose="funnel-records-alerts-grid">
        {/* Bookings Funnel (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-black p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-xs uppercase tracking-wider text-black mb-3">Bookings Funnel (30 Days)</h3>

            {/* Trapezoid Funnel Representation */}
            <div className="flex flex-col items-center justify-center py-2 space-y-1 relative">
              {/* Tier 1 */}
              <div className="w-11/12 bg-white border border-black text-black py-1.5 px-3 text-center">
                <p className="font-black text-xs font-mono">412</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Website Visits</p>
              </div>

              {/* Conversion indicator 1 */}
              <div className="text-[10px] font-mono font-bold text-black self-end mr-6 flex items-center gap-1">
                <span className="w-3 h-px bg-black" /> 45.9%
              </div>

              {/* Tier 2 */}
              <div className="w-9/12 bg-gray-100 border border-black text-black py-1.5 px-3 text-center">
                <p className="font-black text-xs font-mono">189</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Account Created</p>
              </div>

              {/* Conversion indicator 2 */}
              <div className="text-[10px] font-mono font-bold text-black self-end mr-10 flex items-center gap-1">
                <span className="w-3 h-px bg-black" /> 75.1%
              </div>

              {/* Tier 3 */}
              <div className="w-7/12 bg-gray-200 border border-black text-black py-1.5 px-3 text-center">
                <p className="font-black text-xs font-mono">142</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-black">Intake Completed</p>
              </div>

              {/* Conversion indicator 3 */}
              <div className="text-[10px] font-mono font-bold text-black self-end mr-14 flex items-center gap-1">
                <span className="w-3 h-px bg-black" /> 81.4%
              </div>

              {/* Tier 4 */}
              <div className="w-5/12 bg-gray-300 border border-black text-black py-1.5 px-3 text-center">
                <p className="font-black text-xs font-mono">118</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-black">Booked</p>
              </div>

              {/* Conversion indicator 4 */}
              <div className="text-[10px] font-mono font-bold text-black self-end mr-16 flex items-center gap-1">
                <span className="w-3 h-px bg-black" /> 81.4%
              </div>

              {/* Tier 5 */}
              <div className="w-4/12 bg-black text-white border border-black py-1.5 px-2 text-center">
                <p className="font-black text-xs font-mono">96</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white">Completed</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-2 text-[11px] text-gray-600 font-mono">
            Overall Conversion: <span className="font-black text-black">23.3%</span> (Visit to Completed)
          </div>
        </div>

        {/* Recent Grooming Records (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-black p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-black">
              <h3 className="font-black text-xs uppercase tracking-wider text-black">Recent Grooming Records</h3>
              <button
                onClick={() => onNavigateSection('grooming-records')}
                className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
              >
                View All
              </button>
            </div>

            {/* Grooming Record items */}
            <div className="space-y-3">
              {groomingRecords.slice(0, 4).map((rec) => (
                <div key={rec.id} className="flex items-center justify-between text-xs py-1 hover:bg-gray-50 px-1 border-b border-gray-100 last:border-b-0 transition-colors">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                    <div className="w-7 h-7 border border-black bg-white flex items-center justify-center text-xs flex-shrink-0">
                      {rec.petEmoji}
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-black leading-tight truncate uppercase">{rec.petName}</p>
                      <p className="text-[10px] text-gray-500 leading-tight truncate">{rec.breed}</p>
                    </div>
                  </div>
                  <div className="text-center text-[10px] text-gray-600 px-1">
                    <p className="font-bold text-black">{rec.date} • {rec.serviceName}</p>
                    <p className="text-gray-500">Groomer: {rec.groomer}</p>
                  </div>
                  <div className="text-right w-16 flex-shrink-0">
                    <p className="font-black text-black font-mono">${rec.amount.toFixed(2)}</p>
                    <span className="text-[9px] font-bold text-black uppercase font-mono">Paid</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-black">
            <button
              onClick={() => onNavigateSection('grooming-records')}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-black hover:underline"
            >
              <span>View all grooming records</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Alerts & Reminders (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-black p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-black">
              <h3 className="font-black text-xs uppercase tracking-wider text-black">Alerts &amp; Reminders</h3>
              <span className="text-[11px] font-mono text-gray-500 uppercase">Priority Feed</span>
            </div>

            {/* Alert rows */}
            <div className="space-y-3">
              {/* Alert 1 */}
              <div 
                onClick={() => onNavigateSection('pets')}
                className="flex items-center justify-between p-2 border border-black hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 border border-black bg-white flex items-center justify-center text-lg flex-shrink-0 text-black">
                    <ShieldAlert className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-black">Vaccinations Expiring</p>
                    <p className="text-[10px] text-gray-600">12 pets have vaccinations expiring in 30 days</p>
                  </div>
                </div>
                <span className="w-6 h-6 border border-black bg-black text-white font-mono font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  12
                </span>
              </div>

              {/* Alert 2 */}
              <div 
                onClick={() => onNavigateSection('documents')}
                className="flex items-center justify-between p-2 border border-black hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 border border-black bg-white flex items-center justify-center text-lg flex-shrink-0 text-black">
                    <FileText className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-black">Unsigned Documents</p>
                    <p className="text-[10px] text-gray-600">8 documents need customer signature</p>
                  </div>
                </div>
                <span className="w-6 h-6 border border-black bg-black text-white font-mono font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  8
                </span>
              </div>

              {/* Alert 3 */}
              <div 
                onClick={() => onNavigateSection('pets')}
                className="flex items-center justify-between p-2 border border-black hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 border border-black bg-white flex items-center justify-center text-lg flex-shrink-0 text-black">
                    <Cake className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-black">Upcoming Birthdays</p>
                    <p className="text-[10px] text-gray-600">5 pets have birthdays this week</p>
                  </div>
                </div>
                <span className="w-6 h-6 border border-black bg-black text-white font-mono font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  5
                </span>
              </div>

              {/* Alert 4 */}
              <div 
                onClick={() => onNavigateSection('inventory')}
                className="flex items-center justify-between p-2 border border-black hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 border border-black bg-white flex items-center justify-center text-lg flex-shrink-0 text-black">
                    <Package className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-black">Low Inventory</p>
                    <p className="text-[10px] text-gray-600">7 products are running low</p>
                  </div>
                </div>
                <span className="w-6 h-6 border border-black bg-black text-white font-mono font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  7
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-black">
            <button
              onClick={() => onNavigateSection('appointments')}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-black hover:underline"
            >
              <span>View all alerts</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM QUICK ACTIONS BAR */}
      <section className="bg-white border border-black p-3 flex flex-wrap items-center justify-between gap-2" data-purpose="quick-actions-bar">
        <span className="text-xs font-black uppercase tracking-wider text-black px-2">Quick Actions</span>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Action: New Appointment */}
          <button 
            onClick={() => onOpenQuickAction('appointment')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-black bg-black text-white hover:bg-neutral-800 font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Appointment</span>
          </button>

          {/* Action: Add Customer */}
          <button 
            onClick={() => onOpenQuickAction('customer')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-black bg-white text-black hover:bg-black hover:text-white font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>

          {/* Action: Add Pet */}
          <button 
            onClick={() => onOpenQuickAction('pet')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-black bg-white text-black hover:bg-black hover:text-white font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Pet</span>
          </button>

          {/* Action: Intake Form */}
          <button 
            onClick={() => onOpenQuickAction('intake')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-black bg-white text-black hover:bg-black hover:text-white font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Intake Form</span>
          </button>

          {/* Action: Payment */}
          <button 
            onClick={() => onOpenQuickAction('payment')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-black bg-white text-black hover:bg-black hover:text-white font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Payment</span>
          </button>

          {/* Action: Invoice */}
          <button 
            onClick={() => onOpenQuickAction('invoice')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-black bg-white text-black hover:bg-black hover:text-white font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Invoice</span>
          </button>

          {/* Action: More Actions */}
          <button 
            onClick={() => onNavigateSection('settings')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-black bg-white text-black hover:bg-black hover:text-white font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
            <span>More Actions</span>
          </button>
        </div>
      </section>
    </div>
  );
};
