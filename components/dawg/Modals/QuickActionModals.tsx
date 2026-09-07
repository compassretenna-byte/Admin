'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  PawPrint, 
  DollarSign, 
  Receipt, 
  FileText, 
  Check, 
  Search,
  CheckCircle2,
  Clock,
  Loader2,
  Package,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AppointmentItem, Customer, PetRecord, DawgNavSection } from '@/lib/types';
import { globalSearch, SearchResult } from '@/lib/supabase';

interface QuickActionModalsProps {
  activeModal: 'appointment' | 'customer' | 'pet' | 'intake' | 'payment' | 'invoice' | 'search' | null;
  onClose: () => void;
  onSaveAppointment: (appt: Partial<AppointmentItem>) => void;
  onSaveCustomer: (cust: Partial<Customer>) => void;
  onSavePet: (pet: Partial<PetRecord>) => void;
  onNavigateSection: (sec: DawgNavSection) => void;
  currentTenantId?: string;
}

export const QuickActionModals: React.FC<QuickActionModalsProps> = ({
  activeModal,
  onClose,
  onSaveAppointment,
  onSaveCustomer,
  onSavePet,
  onNavigateSection,
  currentTenantId,
}) => {
  // Appointment Form State
  const [petName, setPetName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [breed, setBreed] = useState('');
  const [serviceName, setServiceName] = useState('Full Groom');
  const [staffName, setStaffName] = useState('Sarah M.');
  const [date, setDate] = useState('2026-09-18');
  const [time, setTime] = useState('2:30 PM');
  const [price, setPrice] = useState('85.00');
  const [notes, setNotes] = useState('');

  // Customer Form State
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custPet, setCustPet] = useState('');

  // Pet Form State
  const [newPetName, setNewPetName] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetOwner, setNewPetOwner] = useState('');
  const [newPetAge, setNewPetAge] = useState('3 yrs');
  const [newPetWeight, setNewPetWeight] = useState('45 lbs');
  const [newPetNotes, setNewPetNotes] = useState('');

  // Payment Form State
  const [payAmount, setPayAmount] = useState('95.00');
  const [payMethod, setPayMethod] = useState('Credit Card / Stripe WisePOS');
  const [payClient, setPayClient] = useState('Sarah Johnson (Buddy)');
  const [paySuccess, setPaySuccess] = useState(false);

  // Invoice Form State
  const [invClient, setInvClient] = useState('Marcus Johnson');
  const [invAmount, setInvAmount] = useState('145.00');
  const [invDue, setInvDue] = useState('Net 15 Days');
  const [invSuccess, setInvSuccess] = useState(false);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setSearchError(null);
      try {
        const results = await globalSearch(searchTerm.trim(), 25, currentTenantId);
        setSearchResults(results);
      } catch (err: any) {
        console.error('Search error:', err);
        setSearchError(err?.message || 'Search service unavailable');
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm, currentTenantId]);

  if (!activeModal) return null;

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAppointment({
      petName: petName || 'Max',
      customerName: customerName || 'Sarah Johnson',
      breed: breed || 'Golden Retriever',
      serviceName,
      staffName,
      date,
      time,
      price: parseFloat(price) || 85.0,
      status: 'Scheduled',
      petEmoji: '🐶',
      notes,
    });
    onClose();
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCustomer({
      name: custName || 'New Client',
      email: custEmail || 'client@example.com',
      phone: custPhone || '(555) 000-1122',
      pets: [custPet || 'Milo (Labrador)'],
      totalSpent: 0,
      lastVisit: 'Today',
      preferredGroomer: 'Sarah M.',
    });
    onClose();
  };

  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePet({
      name: newPetName || 'Cooper',
      breed: newPetBreed || 'Aussie Shepherd',
      ownerName: newPetOwner || 'Emily Watson',
      age: newPetAge,
      weight: newPetWeight,
      emoji: '🐕',
      vaccinationStatus: 'Up to date',
      specialNotes: newPetNotes || 'Friendly, loves treats',
      lastGroomDate: 'May 12, 2025',
    });
    onClose();
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      onClose();
    }, 1200);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    setInvSuccess(true);
    setTimeout(() => {
      setInvSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto font-mono">
      <div 
        className="w-full max-w-lg bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b-2 border-black flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 border border-black bg-black text-white">
              {activeModal === 'appointment' && <Calendar className="w-4 h-4" />}
              {activeModal === 'customer' && <User className="w-4 h-4" />}
              {activeModal === 'pet' && <PawPrint className="w-4 h-4" />}
              {activeModal === 'intake' && <FileText className="w-4 h-4" />}
              {activeModal === 'payment' && <DollarSign className="w-4 h-4" />}
              {activeModal === 'invoice' && <Receipt className="w-4 h-4" />}
              {activeModal === 'search' && <Search className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-tight text-black">
                {activeModal === 'appointment' && 'Book New Appointment'}
                {activeModal === 'customer' && 'Register Customer Profile'}
                {activeModal === 'pet' && 'Add New Pet Record'}
                {activeModal === 'intake' && 'Client Intake & Health Waiver'}
                {activeModal === 'payment' && 'Process Terminal Payment'}
                {activeModal === 'invoice' && 'Generate Client Invoice'}
                {activeModal === 'search' && 'Command Palette (Ctrl + K)'}
              </h2>
              <p className="text-[10px] text-gray-500 uppercase">
                All About Pawz OS // Real-Time Dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Appointment Form */}
        {activeModal === 'appointment' && (
          <form onSubmit={handleCreateAppointment} className="p-5 space-y-3.5 text-xs text-black">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Pet Name</label>
                <input
                  type="text"
                  required
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g. Buster"
                  className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Breed</label>
                <input
                  type="text"
                  required
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="e.g. Golden Retriever"
                  className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Client / Owner Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Sarah Johnson"
                className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Service Type</label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-2 py-1.5 border border-black bg-white focus:outline-none text-black font-bold cursor-pointer"
                >
                  <option>Full Groom</option>
                  <option>Full Groom + De-Shed</option>
                  <option>Bath &amp; Brush</option>
                  <option>Nail Trim / Dremel</option>
                  <option>Puppy Spa Intro</option>
                </select>
              </div>
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Assigned Groomer</label>
                <select
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full px-2 py-1.5 border border-black bg-white focus:outline-none text-black font-bold cursor-pointer"
                >
                  <option>Sarah M. (Lead Groomer)</option>
                  <option>Mike R. (Stylist)</option>
                  <option>Jessica L. (Stylist)</option>
                  <option>Taylor P. (Bather)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Date &amp; Time</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 2:30 PM"
                  className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Estimated Price ($)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Styling &amp; Handling Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Specific cut instructions, temperament notes..."
                className="w-full p-2 border border-black bg-white focus:outline-none text-black resize-none"
              />
            </div>

            <div className="pt-2 border-t border-black flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 border border-black bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer"
              >
                Save &amp; Confirm Booking
              </button>
            </div>
          </form>
        )}

        {/* Modal Body: Customer Form */}
        {activeModal === 'customer' && (
          <form onSubmit={handleCreateCustomer} className="p-5 space-y-3.5 text-xs text-black">
            <div>
              <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                placeholder="e.g. Rachel Green"
                className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  placeholder="rachel@pawzmail.com"
                  className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="(214) 555-0199"
                  className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Primary Pet(s)</label>
              <input
                type="text"
                value={custPet}
                onChange={(e) => setCustPet(e.target.value)}
                placeholder="e.g. Chloe (Shih Tzu)"
                className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black font-bold"
              />
            </div>
            <div className="pt-2 border-t border-black flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 border border-black bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer"
              >
                Save Client Record
              </button>
            </div>
          </form>
        )}

        {/* Modal Body: Pet Form */}
        {activeModal === 'pet' && (
          <form onSubmit={handleCreatePet} className="p-5 space-y-3.5 text-xs text-black">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Pet Name</label>
                <input
                  type="text"
                  required
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                  placeholder="e.g. Copper"
                  className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Breed</label>
                <input
                  type="text"
                  required
                  value={newPetBreed}
                  onChange={(e) => setNewPetBreed(e.target.value)}
                  placeholder="e.g. Australian Shepherd"
                  className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Owner Name</label>
              <input
                type="text"
                required
                value={newPetOwner}
                onChange={(e) => setNewPetOwner(e.target.value)}
                placeholder="e.g. Sarah Johnson"
                className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Age</label>
                <input
                  type="text"
                  value={newPetAge}
                  onChange={(e) => setNewPetAge(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Weight</label>
                <input
                  type="text"
                  value={newPetWeight}
                  onChange={(e) => setNewPetWeight(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-black flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 border border-black bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer"
              >
                Save Pet Profile
              </button>
            </div>
          </form>
        )}

        {/* Modal Body: Intake Form */}
        {activeModal === 'intake' && (
          <div className="p-5 space-y-4 text-xs text-black font-mono">
            <div className="p-3 bg-gray-50 border border-black space-y-1">
              <p className="font-bold text-black uppercase">Rabies &amp; Bordetella Digital Waiver</p>
              <p className="text-[11px] text-gray-600">
                Verified veterinary authorization and de-matting liability release.
              </p>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2.5 border border-black bg-white cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded-none border-black accent-black" />
                <div>
                  <p className="font-bold text-black uppercase text-[11px]">Vaccinations Current</p>
                  <p className="text-[10px] text-gray-500">Rabies &amp; Bordetella verified within 12 mos</p>
                </div>
              </label>
              <label className="flex items-center gap-2 p-2.5 border border-black bg-white cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded-none border-black accent-black" />
                <div>
                  <p className="font-bold text-black uppercase text-[11px]">De-Matting Authorization</p>
                  <p className="text-[10px] text-gray-500">Humane restoration release signed</p>
                </div>
              </label>
            </div>
            <div className="pt-2 border-t border-black flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer border border-black"
              >
                Confirm &amp; File Waiver
              </button>
            </div>
          </div>
        )}

        {/* Modal Body: Payment Form */}
        {activeModal === 'payment' && (
          <form onSubmit={handleProcessPayment} className="p-5 space-y-3.5 text-xs text-black font-mono">
            <div>
              <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Select Client / Order</label>
              <input
                type="text"
                value={payClient}
                onChange={(e) => setPayClient(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Amount Due ($)</label>
                <input
                  type="text"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black font-black text-sm"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Method / Device</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-2 py-1.5 border border-black bg-white focus:outline-none text-black font-bold cursor-pointer"
                >
                  <option>WisePOS E Terminal #01</option>
                  <option>Apple Pay / Contactless</option>
                  <option>Cash Drawer Handover</option>
                  <option>Gift Card / Credit</option>
                </select>
              </div>
            </div>
            <div className="pt-2 border-t border-black flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer border border-black flex items-center gap-1.5"
              >
                {paySuccess ? <Check className="w-3.5 h-3.5" /> : <DollarSign className="w-3.5 h-3.5" />}
                <span>{paySuccess ? 'Transaction Approved!' : `Charge $${payAmount}`}</span>
              </button>
            </div>
          </form>
        )}

        {/* Modal Body: Invoice Form */}
        {activeModal === 'invoice' && (
          <form onSubmit={handleCreateInvoice} className="p-5 space-y-3.5 text-xs text-black font-mono">
            <div>
              <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Recipient Client</label>
              <input
                type="text"
                value={invClient}
                onChange={(e) => setInvClient(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Total Amount ($)</label>
                <input
                  type="text"
                  value={invAmount}
                  onChange={(e) => setInvAmount(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-black bg-white focus:outline-none text-black font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">Payment Terms</label>
                <select
                  value={invDue}
                  onChange={(e) => setInvDue(e.target.value)}
                  className="w-full px-2 py-1.5 border border-black bg-white focus:outline-none text-black font-bold cursor-pointer"
                >
                  <option>Due Upon Receipt</option>
                  <option>Net 15 Days</option>
                  <option>Net 30 Days</option>
                </select>
              </div>
            </div>
            <div className="pt-2 border-t border-black flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 border border-black bg-white hover:bg-gray-100 font-bold uppercase text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold uppercase text-xs cursor-pointer border border-black flex items-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>{invSuccess ? 'Invoice Dispatched!' : 'Send Invoice'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Modal Body: Command Palette Search */}
        {activeModal === 'search' && (
          <div className="p-4 space-y-3 font-mono text-black">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-black" />
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders, SKU items, customers, pets, bookings (RPC global_search)..."
                className="w-full pl-9 pr-9 py-2 bg-white border border-black text-xs text-black font-bold focus:outline-none"
              />
              {isSearching ? (
                <Loader2 className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-500" />
              ) : searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 text-gray-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>

            {/* Live Search Results from Supabase RPC */}
            {searchTerm.trim().length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase px-1">
                  <span>Search Results ({searchResults.length})</span>
                  <span className="text-[9px] font-mono text-gray-400">PostgreSQL RPC: global_search</span>
                </div>

                {isSearching && (
                  <div className="py-6 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Querying tenant index across PostgreSQL tables...</span>
                  </div>
                )}

                {!isSearching && searchResults.length === 0 && (
                  <div className="py-6 text-center text-xs text-gray-500 border border-dashed border-black/20 p-4">
                    <p className="font-bold text-black uppercase">No records found for &quot;{searchTerm}&quot;</p>
                    <p className="text-[11px] text-gray-500 mt-1">Try searching by Customer name, Pet breed, Order ID (#ORD), or SKU</p>
                  </div>
                )}

                {!isSearching && searchResults.length > 0 && (
                  <div className="max-h-64 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                    {searchResults.map((res) => {
                      // Determine target section from entity_type
                      let targetSec: DawgNavSection = 'dashboard';
                      let typeLabel = res.entity_type.toUpperCase();
                      let typeBadge = 'bg-black text-white';

                      if (res.entity_type === 'order') {
                        targetSec = 'orders';
                        typeLabel = 'ORDER';
                        typeBadge = 'bg-blue-600 text-white';
                      } else if (res.entity_type === 'customer') {
                        targetSec = 'customers';
                        typeLabel = 'CUSTOMER';
                        typeBadge = 'bg-emerald-700 text-white';
                      } else if (res.entity_type === 'dog') {
                        targetSec = 'pets';
                        typeLabel = 'PET / DOG';
                        typeBadge = 'bg-amber-600 text-white';
                      } else if (res.entity_type === 'booking') {
                        targetSec = 'appointments';
                        typeLabel = 'APPOINTMENT';
                        typeBadge = 'bg-purple-700 text-white';
                      } else if (res.entity_type === 'inventory_item') {
                        targetSec = 'inventory';
                        typeLabel = 'INVENTORY SKU';
                        typeBadge = 'bg-indigo-700 text-white';
                      } else if (res.entity_type === 'payment') {
                        targetSec = 'payments';
                        typeLabel = 'PAYMENT';
                        typeBadge = 'bg-emerald-800 text-white';
                      } else if (res.entity_type === 'staff') {
                        targetSec = 'staff';
                        typeLabel = 'STAFF';
                        typeBadge = 'bg-neutral-800 text-white';
                      }

                      return (
                        <button
                          key={`${res.entity_type}-${res.entity_id}`}
                          onClick={() => {
                            onNavigateSection(targetSec);
                            onClose();
                          }}
                          className="w-full text-left p-2.5 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer group space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 uppercase ${typeBadge}`}>
                                {typeLabel}
                              </span>
                              <span className="font-black text-xs tracking-tight group-hover:text-white">
                                {res.title}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono text-gray-500 group-hover:text-white flex items-center gap-1">
                              <span>Rank {res.rank ? res.rank.toFixed(2) : '1.0'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                          {res.snippet && (
                            <p className="text-[11px] text-gray-600 group-hover:text-gray-200 line-clamp-1">
                              {res.snippet}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Direct Navigation Quick List (when query is short or empty) */}
            {(!searchTerm || searchResults.length === 0) && (
              <div className="space-y-1 text-xs">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-1">
                  Direct Module Navigation
                </p>
                {[
                  { label: '06 Orders & Fulfillment (OMS)', sec: 'orders' },
                  { label: '07 Order Details Hub', sec: 'order-details' },
                  { label: '08 Products & Inventory (SKU Catalog)', sec: 'inventory' },
                  { label: '09 Shipping & Label Station', sec: 'shipping' },
                  { label: '10 Returns & Exchanges (RMA)', sec: 'returns' },
                  { label: '11 Purchase Orders & Receiving', sec: 'purchase-orders' },
                  { label: '12 Payments & Revenue Ledger', sec: 'payments' },
                  { label: '03 Customers Directory & Pets', sec: 'customers' },
                  { label: '02 Appointments Schedule', sec: 'appointments' },
                  { label: 'Admin Settings Console', sec: 'settings' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      onNavigateSection(item.sec as DawgNavSection);
                      onClose();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-black hover:text-white text-black font-bold text-xs transition-colors flex items-center justify-between border border-transparent hover:border-black cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] uppercase font-mono">Jump →</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
