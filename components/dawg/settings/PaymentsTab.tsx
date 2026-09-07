'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Receipt, 
  AlertCircle, 
  ExternalLink,
  RefreshCw,
  Download,
  Smartphone,
  Check,
  Building2,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export const PaymentsTab: React.FC = () => {
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

      {/* HEADER & TOP SUMMARY */}
      <div className="border border-black bg-white p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase text-neutral-500 tracking-wider">
              BUSINESS OPS // STRIPE FINANCIAL ENGINE &amp; MULTI-HUB ROUTING
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight mt-1 text-black">
              PAYMENTS, STRIPE GATEWAY &amp; PAYOUTS LEDGER
            </h2>
            <p className="text-xs text-neutral-600 mt-1 max-w-3xl">
              Inspect multi-facility merchant accounts, manage Stripe Connect sub-accounts, configure card reader hardware fleets, audit scheduled bank payouts, and monitor chargeback dispute packages.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => showNotification('Force sync settlement executed with Stripe!')}
              className="border border-black bg-white px-3 py-1.5 hover:bg-neutral-100 font-bold text-xs uppercase flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>[FORCE SYNC SETTLEMENT]</span>
            </button>
            <button 
              onClick={() => showNotification('Redirecting to Stripe Express Dashboard...')}
              className="bg-black text-white px-3.5 py-1.5 hover:bg-neutral-800 font-bold text-xs uppercase flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>[OPEN STRIPE DASHBOARD]</span>
            </button>
          </div>
        </div>

        {/* 5-METRIC STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-4 pt-4 border-t border-black">
          <div className="border border-black p-2 bg-neutral-50 text-right min-w-[120px]">
            <div className="text-[9px] text-neutral-500 uppercase">GROSS REVENUE (MTD)</div>
            <div className="text-base font-bold text-black">$58,490.00</div>
          </div>
          <div className="border border-black p-2 bg-neutral-50 text-right min-w-[120px]">
            <div className="text-[9px] text-neutral-500 uppercase">SCHEDULED PAYOUT</div>
            <div className="text-base font-bold text-black">$14,210.80</div>
          </div>
          <div className="border border-black p-2 bg-neutral-50 text-right min-w-[120px]">
            <div className="text-[9px] text-neutral-500 uppercase">CHARGEBACKS (YTD)</div>
            <div className="text-base font-bold text-black">01 (100% WON)</div>
          </div>
          <div className="border border-black p-2 bg-neutral-50 text-right min-w-[120px]">
            <div className="text-[9px] text-neutral-500 uppercase">BLENDED PROCESSING</div>
            <div className="text-base font-bold text-black">2.7% + 30¢</div>
          </div>
          <div className="border border-black p-2 bg-neutral-50 text-right min-w-[120px]">
            <div className="text-[9px] text-neutral-500 uppercase">GATEWAY HEALTH</div>
            <div className="text-base font-bold text-black">VERIFIED &amp; LIVE</div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* COLUMN 1 & 2: SECTIONS A, B, C */}
        <div className="xl:col-span-2 space-y-6">

          {/* SECTION A: MULTI-LOCATION MERCHANT ROUTING */}
          <div className="border border-black p-5 bg-white space-y-4">
            <div className="flex items-start justify-between border-b border-black pb-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-black text-white font-bold flex items-center justify-center text-xs">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base uppercase text-black">MULTI-LOCATION MERCHANT ROUTING &amp; STRIPE CONNECT</h3>
                    <span className="bg-black text-white text-[10px] px-1.5 py-0.2 font-bold uppercase">CONNECT ENGINE</span>
                  </div>
                  <div className="text-xs text-neutral-500">PLATFORM ARCHITECTURE: STRIPE_CUSTOM_ACCOUNTS // SETTLEMENT_ROUTING: AUTOMATIC</div>
                </div>
              </div>
              <button 
                onClick={() => showNotification('Sub-merchant connection modal ready')}
                className="border border-black bg-white px-2.5 py-1 text-xs font-bold hover:bg-neutral-100 uppercase"
              >
                + ADD SUB-MERCHANT
              </button>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* NODE 1: FRISCO HQ */}
              <div className="border border-black p-3.5 bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase text-black text-sm">01. ALL ABOUT PAWZ - FRISCO MAIN HQ</span>
                    <span className="bg-black text-white text-[9px] px-1.5 py-0.2 font-bold uppercase">PRIMARY NODE</span>
                  </div>
                  <span className="border border-black text-[10px] px-1.5 py-0.2 uppercase bg-green-50 font-bold">STATUS: LIVE</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] block">STRIPE CONNECT ID</span>
                    <span className="font-bold text-black">acct_1NvPawzFrisco01</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] block">TERMINAL BINDINGS</span>
                    <span className="font-bold text-black">3 BBPOS WisePOS E Readers</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] block">PAYOUT DESTINATION</span>
                    <span className="font-bold text-black">JPMorgan Chase (*8921)</span>
                  </div>
                </div>
              </div>

              {/* NODE 2: PLANO WEST */}
              <div className="border border-black p-3.5 bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase text-black text-sm">02. ALL ABOUT PAWZ - PLANO WEST BRANCH</span>
                    <span className="border border-black text-[9px] px-1.5 py-0.2 font-bold uppercase bg-white">BRANCH NODE</span>
                  </div>
                  <span className="border border-black text-[10px] px-1.5 py-0.2 uppercase bg-green-50 font-bold">STATUS: LIVE</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] block">STRIPE CONNECT ID</span>
                    <span className="font-bold text-black">acct_1NvPawzPlano02</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] block">TERMINAL BINDINGS</span>
                    <span className="font-bold text-black">2 BBPOS WisePOS E Readers</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] block">PAYOUT DESTINATION</span>
                    <span className="font-bold text-black">JPMorgan Chase (*8921)</span>
                  </div>
                </div>
              </div>

              {/* NODE 3: MOBILE VAN FLEET */}
              <div className="border border-black p-3.5 bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase text-black text-sm">03. ALL ABOUT PAWZ - MOBILE VAN FLEET</span>
                    <span className="border border-black text-[9px] px-1.5 py-0.2 font-bold uppercase bg-white">MOBILE DISPATCH</span>
                  </div>
                  <span className="border border-black text-[10px] px-1.5 py-0.2 uppercase bg-green-50 font-bold">STATUS: LIVE</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] block">STRIPE CONNECT ID</span>
                    <span className="font-bold text-black">acct_1NvPawzMobile03</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] block">TERMINAL BINDINGS</span>
                    <span className="font-bold text-black">3 Stripe Reader M2 (Bluetooth)</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] block">PAYOUT DESTINATION</span>
                    <span className="font-bold text-black">JPMorgan Chase (*8921)</span>
                  </div>
                </div>
              </div>

              {/* NODE 4: WEB & CLIENT PORTAL */}
              <div className="border border-black p-3.5 bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase text-black text-sm">04. ONLINE BOOKING PORTAL &amp; CLIENT APP</span>
                    <span className="bg-black text-white text-[9px] px-1.5 py-0.2 font-bold uppercase">DIGITAL STRIPE ELEMENTS</span>
                  </div>
                  <span className="border border-black text-[10px] px-1.5 py-0.2 uppercase bg-green-50 font-bold">STATUS: LIVE</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] block">STRIPE ELEMENTS API</span>
                    <span className="font-bold text-black">Apple Pay, Google Pay, Cards</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] block">3D SECURE ENFORCEMENT</span>
                    <span className="font-bold text-black">SCA / Dynamic Risk Engine</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] block">AUTOMATIC DEPOSIT HOLD</span>
                    <span className="font-bold text-black">Capture Intent Enabled</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION B: SCHEDULED PAYOUTS & GROSS RECEIPTS LEDGER */}
          <div className="border border-black p-5 bg-white space-y-4">
            <div className="flex items-start justify-between border-b border-black pb-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-black text-white font-bold flex items-center justify-center text-xs">
                  B
                </div>
                <div>
                  <h3 className="font-bold text-base uppercase text-black">SCHEDULED PAYOUTS &amp; GROSS RECEIPTS LEDGER</h3>
                  <div className="text-xs text-neutral-500">SETTLEMENT CADENCE: ROLLING 2-DAY // ACH DIRECT DEPOSIT</div>
                </div>
              </div>
              <button 
                onClick={() => showNotification('Payout history ledger exported (.CSV)')}
                className="bg-black text-white px-3 py-1 text-xs font-bold hover:bg-neutral-800 uppercase flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>[EXPORT LEDGER]</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-black">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 border-b border-black text-[10px] uppercase text-neutral-600">
                  <tr>
                    <th className="p-2.5 border-r border-black">PAYOUT ID</th>
                    <th className="p-2.5 border-r border-black">DESTINATION</th>
                    <th className="p-2.5 border-r border-black">ESTIMATED ARRIVAL</th>
                    <th className="p-2.5 border-r border-black text-right">GROSS BATCH</th>
                    <th className="p-2.5 border-r border-black text-right">FEES</th>
                    <th className="p-2.5 border-r border-black text-right">NET DEPOSIT</th>
                    <th className="p-2.5 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black text-[11px]">
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold border-r border-black text-black">po_1Qv8921A</td>
                    <td className="p-2.5 border-r border-black">Chase (*8921)</td>
                    <td className="p-2.5 border-r border-black">Tomorrow, 9:00 AM</td>
                    <td className="p-2.5 border-r border-black text-right">$14,620.00</td>
                    <td className="p-2.5 border-r border-black text-right text-neutral-500">-$409.20</td>
                    <td className="p-2.5 border-r border-black text-right font-bold text-black">$14,210.80</td>
                    <td className="p-2.5 text-right">
                      <span className="border border-black bg-neutral-100 text-[9px] px-1.5 py-0.2 font-bold uppercase">IN TRANSIT</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold border-r border-black text-black">po_1Qv8810B</td>
                    <td className="p-2.5 border-r border-black">Chase (*8921)</td>
                    <td className="p-2.5 border-r border-black">Yesterday (Settled)</td>
                    <td className="p-2.5 border-r border-black text-right">$11,840.00</td>
                    <td className="p-2.5 border-r border-black text-right text-neutral-500">-$331.50</td>
                    <td className="p-2.5 border-r border-black text-right font-bold text-black">$11,508.50</td>
                    <td className="p-2.5 text-right">
                      <span className="bg-black text-white text-[9px] px-1.5 py-0.2 font-bold uppercase">PAID</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold border-r border-black text-black">po_1Qv8701C</td>
                    <td className="p-2.5 border-r border-black">Chase (*8921)</td>
                    <td className="p-2.5 border-r border-black">Feb 18, 2025</td>
                    <td className="p-2.5 border-r border-black text-right">$9,940.00</td>
                    <td className="p-2.5 border-r border-black text-right text-neutral-500">-$278.30</td>
                    <td className="p-2.5 border-r border-black text-right font-bold text-black">$9,661.70</td>
                    <td className="p-2.5 text-right">
                      <span className="bg-black text-white text-[9px] px-1.5 py-0.2 font-bold uppercase">PAID</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* COLUMN 3: CHARGEBACK CHAMBER & HARDWARE TERMINALS */}
        <div className="space-y-6">

          {/* SECTION C: CHARGEBACKS & DISPUTE CHAMBER */}
          <div className="border border-black p-4 bg-white">
            <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-black"></span>
                <h4 className="font-bold text-xs uppercase tracking-wider text-black">CHARGEBACK &amp; DISPUTE CHAMBER</h4>
              </div>
              <span className="bg-black text-white text-[9px] px-1.5 py-0.5 font-bold uppercase">100% WON</span>
            </div>

            <p className="text-xs text-neutral-600 mb-3">
              Automated evidence generation compiled from digital signature intake waivers, appointment timestamps, and pet grooming completion photos.
            </p>

            <div className="border border-black p-3 bg-neutral-50 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase text-black text-[11px]">DISPUTE #DP-99214</span>
                <span className="border border-black bg-white text-[9px] px-1 font-bold text-green-700">RESOLVED: WON</span>
              </div>
              <div className="text-[10px] text-neutral-600 space-y-0.5">
                <div>Client: Rachel Thorne // Amount: $145.00</div>
                <div>Reason: Fraudulent / Unrecognized</div>
                <div>Evidence: Chip Tap + Signed iPad Waiver attached</div>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-end">
                <button 
                  onClick={() => showNotification('Displaying evidence package dossier')}
                  className="border border-black px-2 py-0.5 text-[9px] font-bold uppercase hover:bg-black hover:text-white"
                >
                  VIEW EVIDENCE DOSSIER
                </button>
              </div>
            </div>
          </div>

          {/* SECTION D: HARDWARE FLEET BINDING */}
          <div className="border border-black p-4 bg-white">
            <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-black">PAYMENT TERMINAL FLEET</h4>
              <span className="text-[10px] text-neutral-500">8 REGISTERED</span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: 'FRISCO LANE 01 (FRONT POS)', model: 'BBPOS WisePOS E', status: 'ONLINE', ip: '192.168.1.101' },
                { name: 'FRISCO LANE 02 (PICKUP)', model: 'BBPOS WisePOS E', status: 'ONLINE', ip: '192.168.1.102' },
                { name: 'FRISCO LANE 03 (SPA CHECK)', model: 'BBPOS WisePOS E', status: 'ONLINE', ip: '192.168.1.103' },
                { name: 'PLANO WEST REG 01', model: 'BBPOS WisePOS E', status: 'ONLINE', ip: '192.168.2.101' },
                { name: 'VAN 01 MOBILE READER', model: 'Stripe Reader M2', status: 'CELLULAR TAP', ip: 'BT-BLE #9012' }
              ].map(d => (
                <div key={d.name} className="border border-black p-2.5 bg-neutral-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[11px] text-black">{d.name}</div>
                    <div className="text-[9px] text-neutral-500">{d.model} // {d.ip}</div>
                  </div>
                  <span className="border border-black text-[9px] px-1.5 py-0.2 uppercase bg-white font-bold text-black">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-black">
              <button 
                onClick={() => showNotification('Ping test dispatches packet to all 8 hardware terminals... [ALL RESPONDED < 40ms]')}
                className="w-full border border-black bg-neutral-100 hover:bg-neutral-200 py-1.5 text-xs font-bold uppercase"
              >
                [PING ALL TERMINALS]
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* TELEMETRY BAR */}
      <div className="border-t border-black bg-neutral-50 p-2.5 flex items-center justify-between text-[10px] text-neutral-600">
        <div className="flex items-center gap-4">
          <span>STRIPE_STATUS: OPERATIONAL (API v2024-12-18)</span>
          <span>//</span>
          <span>WEBHOOKS: 100% HEALTHY</span>
          <span>//</span>
          <span>SETTLEMENT_SYNC: AUTO_ACH</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-neutral-500">PCI_DSS: LEVEL_1_COMPLIANT</span>
          <span className="bg-black text-white px-2 py-0.5 font-bold">[GATEWAY LIVE]</span>
        </div>
      </div>

    </div>
  );
};
