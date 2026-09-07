'use client';

import React from 'react';
import { StaffScheduleItem } from '@/lib/types';
import { UserCheck, Phone, DollarSign, Clock, Plus } from 'lucide-react';

interface StaffViewProps {
  staffList: StaffScheduleItem[];
}

export const StaffView: React.FC<StaffViewProps> = ({ staffList }) => {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-black bg-white min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-black">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">
            <span>Staff &amp; Groomer Management</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Shift capacity, appointment distribution, commission tiers, and contact information.
          </p>
        </div>

        <button className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-black cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((staff) => (
          <div
            key={staff.id}
            className="bg-white p-5 border border-black space-y-4 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow"
          >
            <div className="flex items-center justify-between border-b border-black pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-black bg-black text-white flex items-center justify-center font-black text-xs">
                  {staff.initials}
                </div>
                <div>
                  <h3 className="font-bold text-black text-sm uppercase">{staff.name}</h3>
                  <p className="text-xs text-gray-600 font-medium">{staff.role}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 border border-black bg-gray-50 text-black font-bold text-xs font-mono">
                {staff.appointmentsCount} APPTS
              </span>
            </div>

            <div className="border border-black p-3 space-y-2 text-xs text-black bg-white">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="w-3.5 h-3.5 text-black" /> Shift
                </span>
                <span className="font-bold text-black font-mono">9:00 AM – 5:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <DollarSign className="w-3.5 h-3.5 text-black" /> Commission
                </span>
                <span className="font-black text-black font-mono">{staff.commissionRate || 50}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Phone className="w-3.5 h-3.5 text-black" /> Phone
                </span>
                <span className="font-medium text-black">{staff.phone}</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-black uppercase tracking-wider mb-1.5">
                Today&apos;s Capacity Matrix:
              </p>
              <div className="flex items-center gap-1">
                {staff.slots.map((s, idx) => (
                  <span
                    key={idx}
                    title={`Slot ${idx + 1}: ${s}`}
                    className={`flex-1 h-3 border border-black ${
                      s === 'booked'
                        ? 'bg-black'
                        : s === 'break'
                        ? 'bg-gray-400'
                        : s === 'blocked'
                        ? 'bg-gray-200'
                        : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
