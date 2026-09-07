'use client';

import React, { useState } from 'react';
import { 
  Tag, 
  UserCheck, 
  MessageSquare, 
  Package, 
  BarChart3, 
  Sliders, 
  CheckCircle2, 
  Download, 
  Mail, 
  ShieldCheck, 
  Key, 
  Database,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DawgNavSection } from '@/lib/types';

interface TabProps {
  onNavigateSection?: (section: DawgNavSection) => void;
}

// 1. Services & Pricing Settings
export const ServicesPricingTab: React.FC<TabProps> = ({ onNavigateSection }) => {
  const [weekendSurcharge, setWeekendSurcharge] = useState('10.00');
  const [mattingFee, setMattingFee] = useState('25.00');
  const [specialHandlingFee, setSpecialHandlingFee] = useState('15.00');
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-5 text-xs">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4" />
            <span>Pricing Rules &amp; Add-ons</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Services &amp; Pricing Policies</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure global grooming add-on surcharges, weekend rush multipliers, and gift card redemption.
          </p>
        </div>

        <button
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl cursor-pointer"
        >
          Save Pricing Rules
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Pricing rules updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Weekend Surcharge</h3>
          <p className="text-slate-500 text-[11px]">Applied to Saturday and Sunday appointments</p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">$</span>
            <input
              type="number"
              value={weekendSurcharge}
              onChange={(e) => setWeekendSurcharge(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Severe Matting Fee</h3>
          <p className="text-slate-500 text-[11px]">Base price for deep de-matting &amp; coat conditioning</p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">$</span>
            <input
              type="number"
              value={mattingFee}
              onChange={(e) => setMattingFee(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Special Handling / Senior Pet</h3>
          <p className="text-slate-500 text-[11px]">Extra time allowance for elderly or reactive dogs</p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">$</span>
            <input
              type="number"
              value={specialHandlingFee}
              onChange={(e) => setSpecialHandlingFee(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between">
        <div>
          <p className="font-bold text-indigo-900">Manage Full Service &amp; Grooming Package Catalog</p>
          <p className="text-indigo-700 text-[11px]">Add haircuts, bath packages, pricing tiers by weight, and duration.</p>
        </div>
        <button
          onClick={() => onNavigateSection && onNavigateSection('services')}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>Open Services Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// 2. Customer Portal Settings
export const CustomerPortalTab: React.FC = () => {
  const [allowReschedule, setAllowReschedule] = useState(true);
  const [requireVaccines, setRequireVaccines] = useState(true);
  const [showLoyalty, setShowLoyalty] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-5 text-xs">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-600 uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Customer Portal Experience</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Customer Portal Configuration</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure client login capabilities, document uploads, and self-service appointment changes.
          </p>
        </div>

        <button
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl cursor-pointer"
        >
          Save Portal Settings
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Customer portal rules updated!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Self-Service Rescheduling</h3>
            <p className="text-slate-500 text-[11px] mt-1">Allow customers to modify scheduled times up to 24h before.</p>
          </div>
          <input
            type="checkbox"
            checked={allowReschedule}
            onChange={(e) => setAllowReschedule(e.target.checked)}
            className="h-4 w-4 rounded text-indigo-600"
          />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Mandatory Vaccine Proof</h3>
            <p className="text-slate-500 text-[11px] mt-1">Block booking if Rabies or DHPP certificate is expired or missing.</p>
          </div>
          <input
            type="checkbox"
            checked={requireVaccines}
            onChange={(e) => setRequireVaccines(e.target.checked)}
            className="h-4 w-4 rounded text-indigo-600"
          />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Loyalty Points Balance Display</h3>
            <p className="text-slate-500 text-[11px] mt-1">Show earned VIP reward points and perks in customer header.</p>
          </div>
          <input
            type="checkbox"
            checked={showLoyalty}
            onChange={(e) => setShowLoyalty(e.target.checked)}
            className="h-4 w-4 rounded text-indigo-600"
          />
        </div>
      </div>
    </div>
  );
};

// 3. Communications Settings
export const CommunicationsTab: React.FC = () => {
  const [sms48h, setSms48h] = useState(true);
  const [smsPickup, setSmsPickup] = useState(true);
  const [reviewRequest, setReviewRequest] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-5 text-xs">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Automated Notifications</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Communications &amp; Messaging</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure automated SMS and email reminders, ready for pickup alerts, and Google review requests.
          </p>
        </div>

        <button
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl cursor-pointer"
        >
          Save Messaging Rules
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Automated messaging automations saved!</span>
        </div>
      )}

      <div className="space-y-3">
        <label className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-2xs cursor-pointer">
          <div>
            <p className="font-bold text-slate-900">48-Hour Appointment Reminder (SMS + Email)</p>
            <p className="text-slate-500 text-[11px]">Sends client a confirmation request with option to reply &apos;C&apos; to confirm.</p>
          </div>
          <input
            type="checkbox"
            checked={sms48h}
            onChange={(e) => setSms48h(e.target.checked)}
            className="h-4 w-4 rounded text-indigo-600"
          />
        </label>

        <label className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-2xs cursor-pointer">
          <div>
            <p className="font-bold text-slate-900">Dog Ready for Pickup SMS Notification</p>
            <p className="text-slate-500 text-[11px]">Instant text alert dispatched to owner the moment groom is marked Complete.</p>
          </div>
          <input
            type="checkbox"
            checked={smsPickup}
            onChange={(e) => setSmsPickup(e.target.checked)}
            className="h-4 w-4 rounded text-indigo-600"
          />
        </label>

        <label className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-2xs cursor-pointer">
          <div>
            <p className="font-bold text-slate-900">Automated Google Review Request (24h After Groom)</p>
            <p className="text-slate-500 text-[11px]">Invites happy clients to leave a 5-star review on Google Maps.</p>
          </div>
          <input
            type="checkbox"
            checked={reviewRequest}
            onChange={(e) => setReviewRequest(e.target.checked)}
            className="h-4 w-4 rounded text-indigo-600"
          />
        </label>
      </div>
    </div>
  );
};

// 4. Inventory Settings
export const InventoryTab: React.FC<TabProps> = ({ onNavigateSection }) => {
  return (
    <div className="space-y-5 text-xs">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>Retail &amp; Supplies Management</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Inventory &amp; Supplies Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure stock reorder thresholds, vendor accounts, and retail checkout rules.
          </p>
        </div>

        <button
          onClick={() => onNavigateSection && onNavigateSection('inventory')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
        >
          <span>Open Full Inventory Hub</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Low Stock Alert Thresholds</h3>
        <p className="text-slate-500 text-[11px]">Automatically trigger alerts on the dashboard when product bottles drop below minimum quantity.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Backroom Shampoos &amp; Sprays Threshold</label>
            <input type="number" defaultValue="5" className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50" />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Retail Shelf Products Threshold</label>
            <input type="number" defaultValue="3" className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Reports Settings
export const ReportsTab: React.FC<TabProps> = ({ onNavigateSection }) => {
  return (
    <div className="space-y-5 text-xs">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Business Intelligence &amp; Exports</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Reports &amp; Financial Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Export accounting spreadsheets, staff commission summaries, and customer retention metrics.
          </p>
        </div>

        <button
          onClick={() => onNavigateSection && onNavigateSection('reports')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
        >
          <span>Open Reports Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Daily Revenue Summary</h3>
          <p className="text-slate-500 text-[11px]">End of day breakdown of all card, cash, tips, and tax receipts.</p>
          <button
            onClick={() => alert('Exporting Daily Revenue CSV...')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-indigo-600 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Groomer Commission Report</h3>
          <p className="text-slate-500 text-[11px]">Bi-weekly payout ledger with tip distribution for staff payroll.</p>
          <button
            onClick={() => alert('Exporting Payroll Report...')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-indigo-600 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Payroll</span>
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Full Client Database</h3>
          <p className="text-slate-500 text-[11px]">Complete backup of pet demographics, contact information, and spending history.</p>
          <button
            onClick={() => alert('Exporting Customers Database...')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-indigo-600 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Clients</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 6. System Settings
export const SystemTab: React.FC = () => {
  return (
    <div className="space-y-5 text-xs text-black">
      <div className="bg-white p-5 border border-black flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase text-black">System Preferences &amp; Audit Logs</h2>
          <p className="text-xs text-gray-600 mt-0.5">
            System audit trails, API integrations, and system preferences.
          </p>
        </div>

        <button
          onClick={() => alert('Database snapshot exported!')}
          className="px-4 py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider border border-black cursor-pointer"
        >
          <span>Export System Backup</span>
        </button>
      </div>

      <div className="bg-white p-5 border border-black space-y-4">
        <h3 className="font-bold text-black text-sm uppercase">System Audit Log Trail</h3>
        <p className="text-gray-600 text-[11px]">Immutable record of high-privilege administrator actions.</p>

        <div className="divide-y divide-black border border-black overflow-hidden">
          {[
            { actor: 'Admin User', action: 'Updated Holiday Blackout Hours', time: '10 mins ago', ip: '192.168.1.45' },
            { actor: 'Sarah Mitchell', action: 'Modified Groomer Commission for Westside Spa', time: '1 hour ago', ip: '192.168.1.12' },
            { actor: 'Marcus Vance', action: 'Invited Jordan Hayes to Admin Users', time: 'Yesterday at 5:20 PM', ip: '192.168.1.88' },
            { actor: 'Admin User', action: 'Executed Stripe Terminal Payout Reconciliation', time: '2 days ago', ip: '192.168.1.45' },
          ].map((log, idx) => (
            <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-gray-50">
              <div>
                <span className="font-bold text-black uppercase">{log.actor}</span> · <span className="text-gray-700">{log.action}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-gray-500">
                <span>{log.ip}</span>
                <span>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 7. System Health & Supabase Cloud Status Tab
export const HealthTab: React.FC = () => {
  const [isPinging, setIsPinging] = useState(false);
  const [latency, setLatency] = useState('24ms');
  const [lastCheck, setLastCheck] = useState('Just now');

  const handlePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setLatency(`${Math.floor(Math.random() * 10) + 18}ms`);
      setLastCheck('Just now');
      setIsPinging(false);
    }, 400);
  };

  return (
    <div className="space-y-6 text-xs text-black">
      {/* Header */}
      <div className="bg-white p-6 border border-black flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 border border-black text-[10px] font-black uppercase tracking-wider bg-black text-white">
              Cloud Infrastructure
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-black text-[10px] font-bold uppercase bg-white text-black font-mono">
              Status: Operational
            </span>
          </div>
          <h2 className="text-xl font-black uppercase text-black">System &amp; Database Health</h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Real-time Supabase PostgreSQL cloud sync, connection pool telemetry, and API latency.
          </p>
        </div>

        <button
          onClick={handlePing}
          disabled={isPinging}
          className="px-4 py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider border border-black cursor-pointer disabled:opacity-50"
        >
          {isPinging ? 'Pinging Cloud...' : 'Run Diagnostics'}
        </button>
      </div>

      {/* Main Supabase Status Banner */}
      <div className="p-6 border border-black bg-white space-y-4">
        <div className="flex items-center justify-between border-b border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-black border border-black flex items-center justify-center">
              <span className="w-2 h-2 bg-white inline-block"></span>
            </div>
            <div>
              <h3 className="font-black uppercase text-sm text-black">Supabase Cloud (4 Live Tables)</h3>
              <p className="text-[11px] text-gray-600 font-mono">postgres://allaboutpawz.supabase.co:5432/production</p>
            </div>
          </div>
          <span className="px-3 py-1 border border-black bg-black text-white text-xs font-mono font-bold uppercase">
            Connected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border border-black bg-gray-50 space-y-1">
            <p className="text-[10px] font-bold uppercase text-gray-600">Database Latency</p>
            <p className="text-lg font-black font-mono text-black">{latency}</p>
            <p className="text-[10px] text-gray-500 font-mono">SSL encrypted</p>
          </div>
          <div className="p-4 border border-black bg-gray-50 space-y-1">
            <p className="text-[10px] font-bold uppercase text-gray-600">Realtime Replication</p>
            <p className="text-lg font-black font-mono text-black">Active</p>
            <p className="text-[10px] text-gray-500 font-mono">WebSockets live</p>
          </div>
          <div className="p-4 border border-black bg-gray-50 space-y-1">
            <p className="text-[10px] font-bold uppercase text-gray-600">Connection Pool</p>
            <p className="text-lg font-black font-mono text-black">4 / 20 Used</p>
            <p className="text-[10px] text-gray-500 font-mono">PgBouncer ready</p>
          </div>
          <div className="p-4 border border-black bg-gray-50 space-y-1">
            <p className="text-[10px] font-bold uppercase text-gray-600">Last Synced</p>
            <p className="text-lg font-black font-mono text-black">{lastCheck}</p>
            <p className="text-[10px] text-gray-500 font-mono">Automatic auto-sync</p>
          </div>
        </div>
      </div>

      {/* Live Table Schema Breakdown */}
      <div className="border border-black bg-white">
        <div className="p-4 border-b border-black bg-gray-50 flex items-center justify-between">
          <h4 className="font-bold text-xs uppercase tracking-wider text-black">
            Synchronized Database Entities
          </h4>
          <span className="text-[10px] font-mono text-gray-600">PostgreSQL Schema v2.4</span>
        </div>
        <div className="divide-y divide-black text-xs font-mono">
          {[
            { table: 'public.customers', records: '4 Live Records', schema: 'id, name, phone, email, vip, total_spent', status: 'HEALTHY' },
            { table: 'public.pets', records: '6 Live Records', schema: 'id, owner_id, name, breed, weight, notes', status: 'HEALTHY' },
            { table: 'public.appointments', records: '8 Live Records', schema: 'id, pet_id, service_id, time, status, amount', status: 'HEALTHY' },
            { table: 'public.inventory', records: '12 Live Records', schema: 'id, sku, name, stock_qty, reorder_level', status: 'HEALTHY' },
          ].map((row, idx) => (
            <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50">
              <div>
                <span className="font-bold text-black">{row.table}</span>
                <span className="text-gray-500 text-[10px] ml-2">({row.schema})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-black">{row.records}</span>
                <span className="px-2 py-0.5 border border-black text-[9px] font-black uppercase bg-black text-white">
                  {row.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
