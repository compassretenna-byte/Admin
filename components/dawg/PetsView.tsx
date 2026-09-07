'use client';

import React, { useState } from 'react';
import { PetRecord } from '@/lib/types';
import { Plus, User, Calendar } from 'lucide-react';

interface PetsViewProps {
  pets: PetRecord[];
  onAddPet: () => void;
}

export const PetsView: React.FC<PetsViewProps> = ({ pets, onAddPet }) => {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-black bg-white min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-black">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">
            <span>Pets &amp; Grooming Profiles</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Vaccination logs, coat types, behavioral notes, and grooming history.
          </p>
        </div>

        <button
          onClick={onAddPet}
          className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-black cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Pet Profile</span>
        </button>
      </div>

      {/* Pets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className="bg-white p-5 border border-black space-y-3.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow"
          >
            <div className="flex items-start justify-between border-b border-black pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-black bg-gray-50 flex items-center justify-center text-xl font-bold">
                  {pet.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-black text-sm uppercase">{pet.name}</h3>
                  <p className="text-[11px] text-gray-600">{pet.breed} • {pet.age} ({pet.weight})</p>
                </div>
              </div>

              <span className={`px-2 py-0.5 border border-black text-[10px] font-bold uppercase font-mono ${
                pet.vaccinationStatus === 'Up to date'
                  ? 'bg-black text-white'
                  : 'bg-white text-black'
              }`}>
                {pet.vaccinationStatus}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-black border border-black p-3 bg-gray-50">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-black" />
                <span>Owner: <strong className="text-black uppercase">{pet.ownerName}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-black" />
                <span>Last Groom: <strong className="font-mono">{pet.lastGroomDate}</strong></span>
              </div>
            </div>

            <div className="p-3 border border-black text-[11px] text-black bg-white">
              <p className="font-bold uppercase text-[10px] tracking-wider mb-1">Styling &amp; Medical Notes:</p>
              <p className="text-gray-700 italic">{pet.specialNotes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
