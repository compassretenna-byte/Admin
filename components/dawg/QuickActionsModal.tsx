'use client';

import React from 'react';
import {
  Zap,
  X,
  CalendarPlus,
  PawPrint,
  DollarSign,
  MessageSquare,
  FileText,
  ShieldCheck,
  ClipboardList,
  Edit3,
  Copy,
  XCircle,
  CheckCheck,
  Bell,
  RotateCw,
  CheckCircle2,
  Activity,
  CheckCircle,
  PauseCircle,
  Phone,
  User,
  Receipt,
  RotateCcw,
  History,
  Plus,
  ArrowRight,
  Sliders
} from 'lucide-react';
import { CustomerFullProfile, AppointmentItem, AppointmentStatus } from '@/lib/types';

export type UnifiedQuickActionType =
  // Customer 6 Actions
  | 'new-appointment'
  | 'add-pet'
  | 'take-payment'
  | 'send-message'
  | 'add-note'
  | 'update-documents'
  // Appointment Lifecycle Actions
  | 'waitlist'
  | 'reschedule'
  | 'duplicate'
  | 'cancel'
  | 'confirm-appointment'
  | 'send-reminder'
  | 'follow-up'
  // Live Status Transitions
  | 'status-check-in'
  | 'status-in-service'
  | 'status-complete'
  | 'status-hold'
  | 'status-no-show'
  // Shared Actions
  | 'call-customer'
  | 'view-customer'
  | 'create-invoice'
  | 'issue-refund'
  | 'payment-history'
  | 'add-custom-action';

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: UnifiedQuickActionType) => void;
  customer?: CustomerFullProfile | null;
  appointment?: AppointmentItem | null;
  onUpdateStatus?: (status: AppointmentStatus) => void;
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  customer,
  appointment,
  onUpdateStatus,
}) => {
  if (!isOpen) return null;

  const handleActionClick = (action: UnifiedQuickActionType) => {
    if (action.startsWith('status-') && onUpdateStatus) {
      if (action === 'status-check-in') onUpdateStatus('Checked In');
      if (action === 'status-in-service') onUpdateStatus('In Progress');
      if (action === 'status-complete') onUpdateStatus('Completed');
      if (action === 'status-hold') onUpdateStatus('Scheduled');
      if (action === 'status-no-show') onUpdateStatus('No Show');
      onClose();
      return;
    }
    onSelectAction(action);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <section 
        aria-labelledby="modal-title" 
        aria-describedby="modal-description" 
        aria-modal="true" 
        role="dialog"
        className="bg-white w-full max-w-[780px] rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <header className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-xs">
              <Zap className="w-5 h-5 text-indigo-600 fill-indigo-100" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
                <span>Quick Actions</span>
                {customer && (
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {customer.name}
                  </span>
                )}
              </h2>
              <p id="modal-description" className="text-xs text-slate-500 mt-0.5">
                Choose an action to perform or customize your quick action workflows.
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button 
            type="button" 
            aria-label="Close modal" 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Modal Body Content */}
        <div className="px-6 py-5 space-y-6 overflow-y-auto bg-slate-50/40 max-h-[calc(88vh-130px)]">
          {/* Section 1: Customer Actions (Preserved 6 Actions) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full inline-block"></span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Customer</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Client & Pet Management</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* 1. New Appointment */}
              <button 
                type="button"
                onClick={() => handleActionClick('new-appointment')}
                className="group p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all duration-150 text-left flex items-start gap-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs shrink-0 group-hover:scale-105 transition-transform">
                  <CalendarPlus className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-800 leading-tight block truncate">New Appointment</span>
                  <span className="text-[10px] text-slate-500 leading-tight mt-0.5 block truncate">Create a new appointment for customer</span>
                </div>
                <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
              </button>

              {/* 2. Add Pet */}
              <button 
                type="button"
                onClick={() => handleActionClick('add-pet')}
                className="group p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all duration-150 text-left flex items-start gap-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs shrink-0 group-hover:scale-105 transition-transform">
                  <PawPrint className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-800 leading-tight block truncate">Add Pet</span>
                  <span className="text-[10px] text-slate-500 leading-tight mt-0.5 block truncate">Register a new pet to profile</span>
                </div>
                <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
              </button>

              {/* 3. Take Payment */}
              <button 
                type="button"
                onClick={() => handleActionClick('take-payment')}
                className="group p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all duration-150 text-left flex items-start gap-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs shrink-0 group-hover:scale-105 transition-transform">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-800 leading-tight block truncate">Take Payment</span>
                  <span className="text-[10px] text-slate-500 leading-tight mt-0.5 block truncate">Charge or record payment</span>
                </div>
                <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
              </button>

              {/* 4. Send Message */}
              <button 
                type="button"
                onClick={() => handleActionClick('send-message')}
                className="group p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all duration-150 text-left flex items-start gap-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-800 leading-tight block truncate">Send Message</span>
                  <span className="text-[10px] text-slate-500 leading-tight mt-0.5 block truncate">SMS or email message</span>
                </div>
                <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
              </button>

              {/* 5. Add Note */}
              <button 
                type="button"
                onClick={() => handleActionClick('add-note')}
                className="group p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all duration-150 text-left flex items-start gap-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-800 leading-tight block truncate">Add Note</span>
                  <span className="text-[10px] text-slate-500 leading-tight mt-0.5 block truncate">Internal or customer note</span>
                </div>
                <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
              </button>

              {/* 6. Update Documents */}
              <button 
                type="button"
                onClick={() => handleActionClick('update-documents')}
                className="group p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all duration-150 text-left flex items-start gap-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-800 leading-tight block truncate">Update Documents</span>
                  <span className="text-[10px] text-slate-500 leading-tight mt-0.5 block truncate">Vaccines, waivers & forms</span>
                </div>
                <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
              </button>
            </div>
          </div>

          {/* Section 2: Appointment Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full inline-block"></span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Appointment</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Scheduling & Status Controls</span>
            </div>

            {/* Sub-group A: Scheduling & Lifecycle Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Add to Waitlist */}
              <button 
                type="button"
                onClick={() => handleActionClick('waitlist')}
                className="group p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all duration-150 text-left flex flex-col justify-between h-[96px] cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
                    <ClipboardList className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 leading-tight block truncate">Add to Waitlist</span>
                  <span className="text-[9.5px] text-slate-400 leading-snug mt-0.5 block truncate">Queue customer for opening</span>
                </div>
              </button>

              {/* Reschedule */}
              <button 
                type="button"
                onClick={() => handleActionClick('reschedule')}
                className="group p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all duration-150 text-left flex flex-col justify-between h-[96px] cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
                    <Edit3 className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 leading-tight block truncate">Reschedule</span>
                  <span className="text-[9.5px] text-slate-400 leading-snug mt-0.5 block truncate">Change date or time</span>
                </div>
              </button>

              {/* Duplicate */}
              <button 
                type="button"
                onClick={() => handleActionClick('duplicate')}
                className="group p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all duration-150 text-left flex flex-col justify-between h-[96px] cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
                    <Copy className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 leading-tight block truncate">Duplicate</span>
                  <span className="text-[9.5px] text-slate-400 leading-snug mt-0.5 block truncate">Clone appointment details</span>
                </div>
              </button>

              {/* Cancel */}
              <button 
                type="button"
                onClick={() => handleActionClick('cancel')}
                className="group p-2.5 bg-white border border-slate-200 rounded-xl hover:border-rose-400 hover:shadow-xs transition-all duration-150 text-left flex flex-col justify-between h-[96px] cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
                    <XCircle className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-rose-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 leading-tight block truncate">Cancel</span>
                  <span className="text-[9.5px] text-slate-400 leading-snug mt-0.5 block truncate">Cancel scheduled appointment</span>
                </div>
              </button>

              {/* Confirm Appointment */}
              <button 
                type="button"
                onClick={() => handleActionClick('confirm-appointment')}
                className="group p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all duration-150 text-left flex flex-col justify-between h-[96px] cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
                    <CheckCheck className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 leading-tight block truncate">Confirm Appointment</span>
                  <span className="text-[9.5px] text-slate-400 leading-snug mt-0.5 block truncate">Mark appointment confirmed</span>
                </div>
              </button>

              {/* Send Reminder */}
              <button 
                type="button"
                onClick={() => handleActionClick('send-reminder')}
                className="group p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all duration-150 text-left flex flex-col justify-between h-[96px] cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 leading-tight block truncate">Send Reminder</span>
                  <span className="text-[9.5px] text-slate-400 leading-snug mt-0.5 block truncate">Trigger SMS/email reminder</span>
                </div>
              </button>

              {/* Follow Up */}
              <button 
                type="button"
                onClick={() => handleActionClick('follow-up')}
                className="group p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all duration-150 text-left flex flex-col justify-between h-[96px] cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
                    <RotateCw className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 leading-tight block truncate">Follow Up</span>
                  <span className="text-[9.5px] text-slate-400 leading-snug mt-0.5 block truncate">Log post-groom follow up</span>
                </div>
              </button>
            </div>

            {/* Sub-group B: Live Status Transitions */}
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-indigo-500" />
                <span>Live Status Transitions:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {/* Check In */}
                <button 
                  type="button"
                  onClick={() => handleActionClick('status-check-in')}
                  className="flex items-center gap-2 p-2 bg-emerald-50/50 border border-emerald-200/80 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-xs transition-all text-left group cursor-pointer"
                >
                  <span className="text-emerald-600 shrink-0"><CheckCircle2 className="w-4 h-4" /></span>
                  <div className="overflow-hidden">
                    <span className="text-xs font-semibold text-emerald-900 block truncate">Check In</span>
                    <span className="text-[9px] text-emerald-700/80 block truncate">Arrived</span>
                  </div>
                </button>

                {/* In Service */}
                <button 
                  type="button"
                  onClick={() => handleActionClick('status-in-service')}
                  className="flex items-center gap-2 p-2 bg-indigo-50/50 border border-indigo-200/80 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-xs transition-all text-left group cursor-pointer"
                >
                  <span className="text-indigo-600 shrink-0"><Activity className="w-4 h-4" /></span>
                  <div className="overflow-hidden">
                    <span className="text-xs font-semibold text-indigo-900 block truncate">In Service</span>
                    <span className="text-[9px] text-indigo-700/80 block truncate">Grooming</span>
                  </div>
                </button>

                {/* Complete */}
                <button 
                  type="button"
                  onClick={() => handleActionClick('status-complete')}
                  className="flex items-center gap-2 p-2 bg-blue-50/50 border border-blue-200/80 rounded-lg hover:border-blue-400 hover:bg-blue-50 hover:shadow-xs transition-all text-left group cursor-pointer"
                >
                  <span className="text-blue-600 shrink-0"><CheckCircle className="w-4 h-4" /></span>
                  <div className="overflow-hidden">
                    <span className="text-xs font-semibold text-blue-900 block truncate">Complete</span>
                    <span className="text-[9px] text-blue-700/80 block truncate">Ready</span>
                  </div>
                </button>

                {/* Hold */}
                <button 
                  type="button"
                  onClick={() => handleActionClick('status-hold')}
                  className="flex items-center gap-2 p-2 bg-amber-50/50 border border-amber-200/80 rounded-lg hover:border-amber-400 hover:bg-amber-50 hover:shadow-xs transition-all text-left group cursor-pointer"
                >
                  <span className="text-amber-600 shrink-0"><PauseCircle className="w-4 h-4" /></span>
                  <div className="overflow-hidden">
                    <span className="text-xs font-semibold text-amber-900 block truncate">Hold</span>
                    <span className="text-[9px] text-amber-700/80 block truncate">Paused</span>
                  </div>
                </button>

                {/* No Show */}
                <button 
                  type="button"
                  onClick={() => handleActionClick('status-no-show')}
                  className="flex items-center gap-2 p-2 bg-rose-50/50 border border-rose-200/80 rounded-lg hover:border-rose-400 hover:bg-rose-50 hover:shadow-xs transition-all text-left group cursor-pointer"
                >
                  <span className="text-rose-600 shrink-0"><XCircle className="w-4 h-4" /></span>
                  <div className="overflow-hidden">
                    <span className="text-xs font-semibold text-rose-900 block truncate">No Show</span>
                    <span className="text-[9px] text-rose-700/80 block truncate">Missed</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Shared Actions */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full inline-block"></span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Shared</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Operations, Comms & Billing</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Send Message */}
              <button 
                type="button"
                onClick={() => handleActionClick('send-message')}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all text-left flex flex-col justify-between h-[88px] group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 block leading-snug truncate">Send Message</span>
                  <span className="text-[9.5px] text-slate-400 block leading-tight mt-0.5 truncate">Chat, SMS, or email</span>
                </div>
              </button>

              {/* Call Customer */}
              <button 
                type="button"
                onClick={() => handleActionClick('call-customer')}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all text-left flex flex-col justify-between h-[88px] group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 block leading-snug truncate">Call Customer</span>
                  <span className="text-[9.5px] text-slate-400 block leading-tight mt-0.5 truncate">Direct voice call link</span>
                </div>
              </button>

              {/* Add Note */}
              <button 
                type="button"
                onClick={() => handleActionClick('add-note')}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all text-left flex flex-col justify-between h-[88px] group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 block leading-snug truncate">Add Note</span>
                  <span className="text-[9.5px] text-slate-400 block leading-tight mt-0.5 truncate">Activity & record note</span>
                </div>
              </button>

              {/* View Customer */}
              <button 
                type="button"
                onClick={() => handleActionClick('view-customer')}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all text-left flex flex-col justify-between h-[88px] group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 block leading-snug truncate">View Customer</span>
                  <span className="text-[9.5px] text-slate-400 block leading-tight mt-0.5 truncate">Open full client profile</span>
                </div>
              </button>

              {/* Take Payment */}
              <button 
                type="button"
                onClick={() => handleActionClick('take-payment')}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all text-left flex flex-col justify-between h-[88px] group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 block leading-snug truncate">Take Payment</span>
                  <span className="text-[9.5px] text-slate-400 block leading-tight mt-0.5 truncate">Terminal or card on file</span>
                </div>
              </button>

              {/* Create Invoice */}
              <button 
                type="button"
                onClick={() => handleActionClick('create-invoice')}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all text-left flex flex-col justify-between h-[88px] group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                    <Receipt className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 block leading-snug truncate">Create Invoice</span>
                  <span className="text-[9.5px] text-slate-400 block leading-tight mt-0.5 truncate">Generate billing invoice</span>
                </div>
              </button>

              {/* Issue Refund */}
              <button 
                type="button"
                onClick={() => handleActionClick('issue-refund')}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all text-left flex flex-col justify-between h-[88px] group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 block leading-snug truncate">Issue Refund</span>
                  <span className="text-[9.5px] text-slate-400 block leading-tight mt-0.5 truncate">Process customer refund</span>
                </div>
              </button>

              {/* Payment History */}
              <button 
                type="button"
                onClick={() => handleActionClick('payment-history')}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all text-left flex flex-col justify-between h-[88px] group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                    <History className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 block leading-snug truncate">Payment History</span>
                  <span className="text-[9.5px] text-slate-400 block leading-tight mt-0.5 truncate">View ledger & receipts</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 4: Add Quick Action Customizer */}
          <div className="pt-1">
            <button 
              type="button"
              onClick={() => handleActionClick('add-custom-action')}
              className="w-full py-3 px-4 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-xl transition-all flex items-center justify-center gap-2.5 text-center group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-transform">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-indigo-700 block leading-tight">Add Quick Action</span>
                <span className="text-[10px] text-indigo-500 leading-tight block">Customize or add a new shortcut to your workflow</span>
              </div>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <footer className="p-4 border-t border-slate-100 flex justify-end bg-white">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs hover:border-slate-300 transition-all focus:outline-none cursor-pointer"
          >
            Close
          </button>
        </footer>
      </section>
    </div>
  );
};
