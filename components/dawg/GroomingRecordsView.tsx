'use client';

import React from 'react';
import { GroomingRecord } from '@/lib/types';
import { Check } from 'lucide-react';

interface GroomingRecordsViewProps {
  records: GroomingRecord[];
}

export const GroomingRecordsView: React.FC<GroomingRecordsViewProps> = ({ records }) => {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-black bg-white min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-black">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">
            <span>Grooming Records &amp; Style Notes</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Archived haircut specifications, blade lengths, shampoo formulas, and completed receipts.
          </p>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white border border-black overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-black">
            <thead className="bg-gray-50 border-b border-black text-black font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4 border-r border-black">Date</th>
                <th className="py-3 px-4 border-r border-black">Pet &amp; Breed</th>
                <th className="py-3 px-4 border-r border-black">Service</th>
                <th className="py-3 px-4 border-r border-black">Groomer</th>
                <th className="py-3 px-4 border-r border-black">Cut &amp; Blade Notes</th>
                <th className="py-3 px-4 border-r border-black">Amount</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold font-mono text-black whitespace-nowrap border-r border-black">
                    {rec.date}
                  </td>
                  <td className="py-3.5 px-4 border-r border-black">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{rec.petEmoji}</span>
                      <div>
                        <p className="font-bold text-black uppercase">{rec.petName}</p>
                        <p className="text-[10px] text-gray-500">{rec.breed}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold uppercase text-black border-r border-black">
                    {rec.serviceName}
                  </td>
                  <td className="py-3.5 px-4 text-black border-r border-black">
                    {rec.groomer}
                  </td>
                  <td className="py-3.5 px-4 text-black max-w-xs border-r border-black">
                    <p className="font-medium text-black">{rec.cutDetails}</p>
                    {rec.coatCondition && (
                      <p className="text-[10px] text-gray-500 italic mt-0.5">{rec.coatCondition}</p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-black font-mono text-black border-r border-black">
                    ${rec.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-black text-[10px] font-bold bg-black text-white uppercase font-mono">
                      <Check className="w-3 h-3" />
                      <span>{rec.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
