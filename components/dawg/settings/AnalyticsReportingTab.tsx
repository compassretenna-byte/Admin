'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Download, 
  RefreshCw, 
  Calendar, 
  Filter, 
  CheckCircle2,
  Award,
  ArrowUpRight
} from 'lucide-react';

export const AnalyticsReportingTab: React.FC = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days (Feb 2025)');
  const [facilityFilter, setFacilityFilter] = useState('ALL FACILITIES (ROLLUP)');
  const [notification, setNotification] = useState<string | null>(null);

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

      {/* HEADER & CONTROLS */}
      <div className="border border-black bg-white p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase text-neutral-500 tracking-wider">
              BUSINESS OPS // FINANCIAL AUDIT &amp; CROSS-FACILITY TELEMETRY
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight mt-1 text-black">
              ANALYTICS, MULTI-LOCATION REPORTING &amp; COMMISSIONS
            </h2>
            <p className="text-xs text-neutral-600 mt-1 max-w-3xl">
              Audit booking conversion funnel performance, cross-branch revenue rollups, repeat visit cadence metrics, and stylist commission / tip disbursement balances.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-black p-1.5 bg-white text-xs font-bold focus:outline-none"
            >
              <option>Last 30 Days (Feb 2025)</option>
              <option>Month to Date (MTD)</option>
              <option>Q1 2025 Projection</option>
              <option>Full Year 2024 (Historic)</option>
            </select>
            <select 
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              className="border border-black p-1.5 bg-white text-xs font-bold focus:outline-none"
            >
              <option>ALL FACILITIES (ROLLUP)</option>
              <option>FRISCO MAIN HQ</option>
              <option>PLANO WEST BRANCH</option>
              <option>MOBILE VAN FLEET</option>
            </select>
            <button 
              onClick={() => showNotification('Exporting executive multi-location P&L (.CSV)')}
              className="bg-black text-white px-3.5 py-1.5 hover:bg-neutral-800 font-bold text-xs uppercase flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>[EXPORT FULL P&amp;L CSV]</span>
            </button>
          </div>
        </div>

        {/* 4 CONVERSION FUNNEL STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 pt-4 border-t border-black">
          <div className="border border-black p-2.5 bg-neutral-50 text-right">
            <div className="text-[9px] text-neutral-500 uppercase">TOTAL VISITS</div>
            <div className="text-lg font-bold text-black">14,820 SESSIONS</div>
            <div className="text-[9px] text-neutral-500 mt-0.5">PUBLIC PORTAL &amp; SITE</div>
          </div>
          <div className="border border-black p-2.5 bg-neutral-50 text-right">
            <div className="text-[9px] text-neutral-500 uppercase">BOOKINGS INITIATED</div>
            <div className="text-lg font-bold text-black">4,210 (28.4%)</div>
            <div className="text-[9px] text-neutral-500 mt-0.5">SLOT SELECTION REACHED</div>
          </div>
          <div className="border border-black p-2.5 bg-neutral-50 text-right">
            <div className="text-[9px] text-neutral-500 uppercase">DEPOSIT CAPTURED</div>
            <div className="text-lg font-bold text-black">3,980 (94.5%)</div>
            <div className="text-[9px] text-neutral-500 mt-0.5">STRIPE SECURE HOLD</div>
          </div>
          <div className="border border-black p-2.5 bg-neutral-50 text-right">
            <div className="text-[9px] text-neutral-500 uppercase">COMPLETED GROOMS</div>
            <div className="text-lg font-bold text-black">3,890 (92.4%)</div>
            <div className="text-[9px] text-neutral-500 mt-0.5">TOTAL FINISHED INTAKES</div>
          </div>
        </div>
      </div>

      {/* RETENTION & REVISIT CADENCE TELEMETRY */}
      <div className="border border-black p-4 bg-white">
        <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase">CADENCE</span>
            <h4 className="font-bold text-xs uppercase tracking-wider text-black">CLIENT RETENTION &amp; LIFETIME VALUE (LTV)</h4>
          </div>
          <span className="text-[10px] text-neutral-500">NORTH TEXAS ACTIVE DATABASE: 1,420 CANINES</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="border border-black p-3 bg-neutral-50">
            <span className="text-[10px] text-neutral-500 uppercase block">REPEAT CLIENT RATIO</span>
            <div className="text-xl font-bold mt-1 text-black">78.4%</div>
            <span className="text-[10px] text-green-700 font-bold mt-1 block">▲ +3.2% vs Last Quarter</span>
          </div>
          <div className="border border-black p-3 bg-neutral-50">
            <span className="text-[10px] text-neutral-500 uppercase block">AVG 60-DAY REVISIT</span>
            <div className="text-xl font-bold mt-1 text-black">24.2 DAYS</div>
            <span className="text-[10px] text-neutral-500 mt-1 block">Standard Doodle/Yorkie cycle</span>
          </div>
          <div className="border border-black p-3 bg-neutral-50">
            <span className="text-[10px] text-neutral-500 uppercase block">CHURN / DORMANT RISK</span>
            <div className="text-xl font-bold mt-1 text-black">4.2%</div>
            <span className="text-[10px] text-neutral-500 mt-1 block">&gt; 90 days without visit</span>
          </div>
          <div className="border border-black p-3 bg-neutral-50">
            <span className="text-[10px] text-neutral-500 uppercase block">AVG ANNUAL LTV</span>
            <div className="text-xl font-bold mt-1 text-black">$1,420.00</div>
            <span className="text-[10px] text-neutral-500 mt-1 block">Services + Retail Add-ons</span>
          </div>
        </div>
      </div>

      {/* MULTI-LOCATION PERFORMANCE ROLLUP TABLE */}
      <div className="border border-black bg-white overflow-hidden">
        <div className="bg-neutral-100 p-3 border-b border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-black"></span>
            <h3 className="font-bold text-xs uppercase tracking-wider text-black">MULTI-LOCATION PERFORMANCE ROLLUP</h3>
          </div>
          <span className="text-[10px] text-neutral-500">CONSOLIDATED LEDGER</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-neutral-50 border-b border-black text-[10px] uppercase font-bold text-neutral-600">
              <tr>
                <th className="p-2.5 border-r border-black">FACILITY &amp; DISPATCH POD</th>
                <th className="p-2.5 border-r border-black text-center">ACTIVE BAYS / CAPACITY</th>
                <th className="p-2.5 border-r border-black text-right">GROSS REVENUE (MTD)</th>
                <th className="p-2.5 border-r border-black text-right">APPOINTMENTS COMPLETED</th>
                <th className="p-2.5 border-r border-black text-right">REBOOKING RATE</th>
                <th className="p-2.5 text-right">CSAT / RATING</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black text-[11px]">
              <tr className="hover:bg-neutral-50">
                <td className="p-2.5 border-r border-black font-bold text-black">
                  FRISCO MAIN HQ (1234 MAPLE DR)
                  <span className="block text-[10px] text-neutral-500 font-normal">Primary Salon Hub &amp; Retail Center</span>
                </td>
                <td className="p-2.5 border-r border-black text-center font-bold">8 Bays (94% Utl)</td>
                <td className="p-2.5 border-r border-black text-right font-bold text-black">$32,450.00</td>
                <td className="p-2.5 border-r border-black text-right">215 Grooms</td>
                <td className="p-2.5 border-r border-black text-right font-bold">81.2%</td>
                <td className="p-2.5 text-right font-bold text-black">4.95 ★ (342 Reviews)</td>
              </tr>
              <tr className="hover:bg-neutral-50">
                <td className="p-2.5 border-r border-black font-bold text-black">
                  PLANO WEST BRANCH (5800 LEGACY DR)
                  <span className="block text-[10px] text-neutral-500 font-normal">Branch Salon &amp; Express Bath</span>
                </td>
                <td className="p-2.5 border-r border-black text-center font-bold">5 Bays (88% Utl)</td>
                <td className="p-2.5 border-r border-black text-right font-bold text-black">$16,840.00</td>
                <td className="p-2.5 border-r border-black text-right">112 Grooms</td>
                <td className="p-2.5 border-r border-black text-right font-bold">76.5%</td>
                <td className="p-2.5 text-right font-bold text-black">4.88 ★ (118 Reviews)</td>
              </tr>
              <tr className="hover:bg-neutral-50">
                <td className="p-2.5 border-r border-black font-bold text-black">
                  MOBILE GROOMING FLEET (3 VANS)
                  <span className="block text-[10px] text-neutral-500 font-normal">Doorstep Luxury Van Dispatch</span>
                </td>
                <td className="p-2.5 border-r border-black text-center font-bold">3 Vans (91% Utl)</td>
                <td className="p-2.5 border-r border-black text-right font-bold text-black">$9,200.00</td>
                <td className="p-2.5 border-r border-black text-right">61 Mobile Stn</td>
                <td className="p-2.5 border-r border-black text-right font-bold">72.8%</td>
                <td className="p-2.5 text-right font-bold text-black">4.92 ★ (88 Reviews)</td>
              </tr>
              <tr className="bg-neutral-100 font-bold">
                <td className="p-2.5 border-r border-black text-black">CONSOLIDATED ENTERPRISE ROLLUP</td>
                <td className="p-2.5 border-r border-black text-center">16 Total Units</td>
                <td className="p-2.5 border-r border-black text-right text-sm text-black">$58,490.00</td>
                <td className="p-2.5 border-r border-black text-right">388 Grooms</td>
                <td className="p-2.5 border-r border-black text-right">78.4% Avg</td>
                <td className="p-2.5 text-right text-black">4.92 ★ Network</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TECHNICIAN COMMISSION & TIPS BREAKDOWN */}
      <div className="border border-black bg-white overflow-hidden">
        <div className="bg-neutral-100 p-3 border-b border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-black"></span>
            <h3 className="font-bold text-xs uppercase tracking-wider text-black">GROOMER COMMISSION &amp; TIPS BREAKDOWN</h3>
          </div>
          <button 
            onClick={() => showNotification('Payroll disbursement batch sent to payroll engine')}
            className="border border-black bg-white px-2 py-0.5 text-[10px] font-bold uppercase hover:bg-black hover:text-white"
          >
            [DISBURSE COMMISSIONS]
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-neutral-50 border-b border-black text-[10px] uppercase font-bold text-neutral-600">
              <tr>
                <th className="p-2.5 border-r border-black">STYLIST / TECHNICIAN</th>
                <th className="p-2.5 border-r border-black">PRIMARY FACILITY</th>
                <th className="p-2.5 border-r border-black text-right">COMPLETED</th>
                <th className="p-2.5 border-r border-black text-right">SERVICE REV</th>
                <th className="p-2.5 border-r border-black text-right">COMMISSION (RATE)</th>
                <th className="p-2.5 border-r border-black text-right">TIPS (STRIPE)</th>
                <th className="p-2.5 text-right font-bold text-black">TOTAL PAYOUT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black text-[11px]">
              <tr className="hover:bg-neutral-50">
                <td className="p-2.5 border-r border-black font-bold text-black">Sarah Miller (Lead Stylist)</td>
                <td className="p-2.5 border-r border-black">Frisco HQ (Bay #01)</td>
                <td className="p-2.5 border-r border-black text-right">48 Grooms</td>
                <td className="p-2.5 border-r border-black text-right">$4,560.00</td>
                <td className="p-2.5 border-r border-black text-right font-bold">$2,280.00 (50%)</td>
                <td className="p-2.5 border-r border-black text-right text-green-700">+$612.00</td>
                <td className="p-2.5 text-right font-bold text-black">$2,892.00</td>
              </tr>
              <tr className="hover:bg-neutral-50">
                <td className="p-2.5 border-r border-black font-bold text-black">Kevin Diaz (Mobile Tech)</td>
                <td className="p-2.5 border-r border-black">Mobile Van 02</td>
                <td className="p-2.5 border-r border-black text-right">38 Mobile</td>
                <td className="p-2.5 border-r border-black text-right">$4,180.00</td>
                <td className="p-2.5 border-r border-black text-right font-bold">$2,090.00 (50%)</td>
                <td className="p-2.5 border-r border-black text-right text-green-700">+$540.00</td>
                <td className="p-2.5 text-right font-bold text-black">$2,630.00</td>
              </tr>
              <tr className="hover:bg-neutral-50">
                <td className="p-2.5 border-r border-black font-bold text-black">Marcus Vance (Stylist)</td>
                <td className="p-2.5 border-r border-black">Plano West Hub</td>
                <td className="p-2.5 border-r border-black text-right">34 Grooms</td>
                <td className="p-2.5 border-r border-black text-right">$3,230.00</td>
                <td className="p-2.5 border-r border-black text-right font-bold">$1,453.50 (45%)</td>
                <td className="p-2.5 border-r border-black text-right text-green-700">+$398.00</td>
                <td className="p-2.5 text-right font-bold text-black">$1,851.50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
