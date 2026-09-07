'use client';

import React, { useState } from 'react';
import { SERVICES_CATALOG } from '@/lib/dawg-mock-data';
import { Sparkles, Clock, DollarSign, Plus, Edit2, Check } from 'lucide-react';

export const ServicesView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(SERVICES_CATALOG.map((s) => s.category)))];

  const filtered = selectedCategory === 'all'
    ? SERVICES_CATALOG
    : SERVICES_CATALOG.filter((s) => s.category === selectedCategory);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-black bg-white min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-black">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">
            <span>Services &amp; Pricing Menu</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Grooming packages, bath options, breed-size pricing tiers, and spa add-ons.
          </p>
        </div>

        <button className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-black cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border border-black cursor-pointer transition-colors ${
              selectedCategory === cat
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((srv) => (
          <div
            key={srv.id}
            className="bg-white p-5 border border-black flex flex-col justify-between space-y-4 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-black pb-3">
                <span className="px-2 py-0.5 border border-black text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-black">
                  {srv.category}
                </span>
                <span className="text-lg font-black text-black font-mono">
                  ${srv.price.toFixed(2)}
                </span>
              </div>
              <h3 className="font-bold text-black text-sm uppercase tracking-tight">{srv.name}</h3>
              <p className="text-xs text-gray-700 leading-relaxed">{srv.description}</p>
            </div>

            <div className="pt-3 border-t border-black flex items-center justify-between text-xs text-black">
              <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
                <Clock className="w-3.5 h-3.5 text-black" />
                <span>{srv.durationMinutes} MINS</span>
              </span>
              <button className="px-2.5 py-1 border border-black text-[11px] font-bold uppercase hover:bg-black hover:text-white transition-colors cursor-pointer">
                Edit Pricing
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
