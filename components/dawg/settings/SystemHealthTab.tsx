'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  Database, 
  Server, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Download,
  Terminal,
  Zap,
  HardDrive
} from 'lucide-react';

export const SystemHealthTab: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white border-2 border-white px-4 py-2.5 shadow-2xl flex items-center gap-2 text-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="font-bold">{notification}</span>
        </div>
      )}

      {/* HEADER & TELEMETRY STRIP */}
      <div className="border border-black bg-white p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase text-neutral-500 tracking-wider">
              BUSINESS OPS // CORE INFRASTRUCTURE &amp; SUPABASE TELEMETRY
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight mt-1 text-black">
              SYSTEM HEALTH, SUPABASE STATUS &amp; MICROSERVICES
            </h2>
            <p className="text-xs text-neutral-600 mt-1 max-w-3xl">
              Inspect live connection pools, monitor microservice heartbeats, audit tamper-proof security logs, test hardware printer fleets, and manage failover caching protocols.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => showNotification('Dispatched ping packets to all 6 microservices: 100% HEALTHY')}
              className="border border-black bg-white px-3 py-1.5 hover:bg-neutral-100 font-bold text-xs uppercase flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>[PING ALL SERVICES]</span>
            </button>
            <button 
              onClick={() => showNotification('Triggering manual hot backup to AWS S3 & Supabase Cold Storage... [SUCCESS]')}
              className="bg-black text-white px-3.5 py-1.5 hover:bg-neutral-800 font-bold text-xs uppercase flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-green-400" />
              <span>[TRIGGER HOT BACKUP]</span>
            </button>
          </div>
        </div>

        {/* 5 TELEMETRY TILES */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4 pt-4 border-t border-black">
          <div className="border border-black p-2.5 bg-neutral-50 text-right">
            <div className="text-[9px] text-neutral-500 uppercase">GLOBAL STATUS</div>
            <div className="text-base font-bold text-black">OPERATIONAL</div>
          </div>
          <div className="border border-black p-2.5 bg-neutral-50 text-right">
            <div className="text-[9px] text-neutral-500 uppercase">SUPABASE REGION</div>
            <div className="text-base font-bold text-black">us-east-1 (AWS)</div>
          </div>
          <div className="border border-black p-2.5 bg-neutral-50 text-right">
            <div className="text-[9px] text-neutral-500 uppercase">DB LATENCY</div>
            <div className="text-base font-bold text-black">14ms (EDGE CACHED)</div>
          </div>
          <div className="border border-black p-2.5 bg-neutral-50 text-right">
            <div className="text-[9px] text-neutral-500 uppercase">UPTIME (30D)</div>
            <div className="text-base font-bold text-black">99.98%</div>
          </div>
          <div className="border border-black p-2.5 bg-neutral-50 text-right">
            <div className="text-[9px] text-neutral-500 uppercase">BACKUP LAST RUN</div>
            <div className="text-base font-bold text-black">04:00 AM CST</div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* COLUMN 1 & 2: SECTIONS A, B, C */}
        <div className="xl:col-span-2 space-y-6">

          {/* SECTION A: MICROSERVICES HEARTBEATS */}
          <div className="border border-black p-5 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-black"></span>
                <h3 className="font-bold text-sm uppercase tracking-wider text-black">CORE MICROSERVICES &amp; INTEGRATION HEARTBEATS</h3>
              </div>
              <span className="text-[10px] text-neutral-500">POLLING CADENCE: 30s</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: 'SUPABASE POSTGRESQL & AUTH', desc: 'RLS Active · Connection Pool 48/100 · 14ms Latency', status: 'HEALTHY' },
                { name: 'STORAGE BUCKETS (S3/SUPABASE)', desc: 'Pet Photos & Signed Legal Waivers Vault · 24.2 GB', status: 'HEALTHY' },
                { name: 'TWILIO SMS & COMMUNICATIONS', desc: 'Automated Reminders, Waitlist Alerts & Pickup SMS', status: 'ONLINE' },
                { name: 'STRIPE CONNECT PAYMENTS API', desc: 'WisePOS E Terminal Fleet & Digital Checkout Webhook', status: 'ONLINE' },
                { name: 'STAR MICRONICS THERMAL FLEET', desc: 'Frisco Till 01 & Plano Till 01 Receipt Printing', status: 'CONNECTED' },
                { name: 'MAPBOX & GPS TELEMETRY FLEET', desc: 'Mobile Van Fleet Live GPS Tracking & Geofences', status: 'STREAMING' },
              ].map(s => (
                <div key={s.name} className="border border-black p-3 bg-neutral-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold uppercase text-[11px] text-black">{s.name}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">{s.desc}</div>
                  </div>
                  <span className="bg-black text-white text-[9px] px-1.5 py-0.5 font-bold uppercase shrink-0 ml-2">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION B: DATABASE CONNECTION POOL & BACKUP LOGS */}
          <div className="border border-black p-5 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-black"></span>
                <h3 className="font-bold text-sm uppercase tracking-wider text-black">DATABASE CONNECTION POOL &amp; BACKUP LOGS</h3>
              </div>
              <button 
                onClick={() => showNotification('Downloading DB snapshot archive...')}
                className="border border-black px-2 py-0.5 text-[10px] font-bold uppercase hover:bg-neutral-100"
              >
                [DOWNLOAD SNAPSHOT]
              </button>
            </div>

            <div className="overflow-x-auto border border-black">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 border-b border-black text-[10px] uppercase font-bold text-neutral-600">
                  <tr>
                    <th className="p-2 border-r border-black">BACKUP ID</th>
                    <th className="p-2 border-r border-black">TIMESTAMP</th>
                    <th className="p-2 border-r border-black">TYPE</th>
                    <th className="p-2 border-r border-black text-right">SIZE</th>
                    <th className="p-2 text-right">INTEGRITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black text-[11px]">
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2 border-r border-black font-bold text-black">bkp_20250220_0400</td>
                    <td className="p-2 border-r border-black">Today, 04:00 AM CST</td>
                    <td className="p-2 border-r border-black">Automated Daily Hot Backup</td>
                    <td className="p-2 border-r border-black text-right font-mono">1.42 GB</td>
                    <td className="p-2 text-right font-bold text-green-700">VERIFIED (SHA-256)</td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2 border-r border-black font-bold text-black">bkp_20250219_0400</td>
                    <td className="p-2 border-r border-black">Yesterday, 04:00 AM CST</td>
                    <td className="p-2 border-r border-black">Automated Daily Hot Backup</td>
                    <td className="p-2 border-r border-black text-right font-mono">1.39 GB</td>
                    <td className="p-2 text-right font-bold text-green-700">VERIFIED (SHA-256)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* COLUMN 3: REALTIME AUDIT & EMERGENCY CONTROLS */}
        <div className="space-y-6">

          {/* REALTIME AUDIT STREAM */}
          <div className="border border-black p-4 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-black">REALTIME AUDIT STREAM</h4>
              <span className="bg-black text-white text-[9px] px-1.5 py-0.2 font-bold uppercase">LIVE</span>
            </div>

            <div className="space-y-2 text-[10px] max-h-56 overflow-y-auto pr-1">
              <div className="border-b border-neutral-200 pb-1">
                <span className="text-neutral-500">[09:24:12]</span> <span className="font-bold">ADMIN_AUTH:</span> Sys Admin logged in from IP 72.181.42.12 (2FA Verified).
              </div>
              <div className="border-b border-neutral-200 pb-1">
                <span className="text-neutral-500">[09:18:04]</span> <span className="font-bold">STRIPE_HOOK:</span> Payout #po_1Qv8921A initiated for $14,210.80.
              </div>
              <div className="border-b border-neutral-200 pb-1">
                <span className="text-neutral-500">[09:05:33]</span> <span className="font-bold">APPT_DISPATCH:</span> Waitlist slot offered to Luna (Goldendoodle) via SMS.
              </div>
              <div className="border-b border-neutral-200 pb-1">
                <span className="text-neutral-500">[08:44:19]</span> <span className="font-bold">FLEET_GPS:</span> Mobile Van 02 arrived at client GPS coordinates (Plano).
              </div>
            </div>
          </div>

          {/* EMERGENCY OPERATIONS & CACHE CONTROL */}
          <div className="border border-black p-4 bg-neutral-50 space-y-3">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-black" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-black">EMERGENCY OPS &amp; CACHE</h4>
              </div>
              <span className="border border-black bg-white text-[9px] px-1 font-bold text-neutral-600">ROOT ONLY</span>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => showNotification('Redis edge cache purged across all regions!')}
                className="w-full border border-black bg-white hover:bg-neutral-100 py-2 text-xs font-bold uppercase"
              >
                [FLUSH REDIS EDGE CACHE]
              </button>

              <button 
                onClick={() => showNotification('Supabase JWT tokens rotated: All active sessions re-authenticated.')}
                className="w-full border border-black bg-white hover:bg-neutral-100 py-2 text-xs font-bold uppercase"
              >
                [ROTATE JWT SECRET KEYS]
              </button>

              <div className="pt-2 border-t border-black flex items-center justify-between">
                <div>
                  <span className="font-bold text-[11px] block text-black">MAINTENANCE MODE</span>
                  <span className="text-[9px] text-neutral-500">Locks public booking wizard</span>
                </div>
                <button 
                  onClick={() => {
                    setMaintenanceMode(!maintenanceMode);
                    showNotification(`Maintenance mode ${!maintenanceMode ? 'ENABLED' : 'DISABLED'}`);
                  }}
                  className={`px-2 py-1 text-[10px] font-bold uppercase border border-black ${
                    maintenanceMode ? 'bg-red-600 text-white' : 'bg-white text-black'
                  }`}
                >
                  [{maintenanceMode ? 'ACTIVE' : 'DISABLED'}]
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
