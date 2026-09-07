'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  Plus, 
  Smartphone,
  Info,
  DollarSign
} from 'lucide-react';

export const BookingOperationsTab: React.FC = () => {
  const [requireDeposit, setRequireDeposit] = useState(true);
  const [firstTimeDepositRate, setFirstTimeDepositRate] = useState('$35.00');
  const [firstTimeDepositType, setFirstTimeDepositType] = useState('$35.00 Flat Fee');
  const [repeatClientThreshold, setRepeatClientThreshold] = useState('> 5 Completed Visits (Deposit Waived)');
  const [depositTerms, setDepositTerms] = useState(
    'Deposits are fully refundable if appointment is cancelled or rescheduled 24+ hours prior to scheduled bay time. Cancellations inside 24 hours forfeit 100% of deposit as a facility readiness compensation fee.'
  );

  // Cancellation Rules
  const [cancelDeadlineHours, setCancelDeadlineHours] = useState(24);
  const [lateCancelFeeMode, setLateCancelFeeMode] = useState('50% of Scheduled Service Fee');
  const [noShowAction, setNoShowAction] = useState('Auto-charge card on file + Ban online booking');
  const [gracePeriodMinutes, setGracePeriodMinutes] = useState(15);

  // Capacity Engine
  const [friscoCapacity, setFriscoCapacity] = useState(8);
  const [planoCapacity, setPlanoCapacity] = useState(5);
  const [mobileCapacity, setMobileCapacity] = useState(1);
  const [cleanBufferMinutes, setCleanBufferMinutes] = useState(15);
  const [multiPetDiscount, setMultiPetDiscount] = useState('10% Off Second Dog');

  // Waitlist
  const [waitlistAutoDispatch, setWaitlistAutoDispatch] = useState(true);
  const [waitlistResponseMinutes, setWaitlistResponseMinutes] = useState(10);
  const [vipPriorityWeighting, setVipPriorityWeighting] = useState('Highest LTV & Frequency Ranks First');

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('Booking & operational policies saved (Build v2.4.9)!');
  };

  const handleResetDefaults = () => {
    setRequireDeposit(true);
    setCancelDeadlineHours(24);
    setGracePeriodMinutes(15);
    setFriscoCapacity(8);
    setPlanoCapacity(5);
    setCleanBufferMinutes(15);
    showNotification('Reset all policies to factory salon standards');
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white border-2 border-white px-4 py-2.5 shadow-2xl flex items-center gap-2 text-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="font-bold">{notification}</span>
        </div>
      )}

      {/* HEADER & TOP CONTROLS */}
      <div className="border border-black bg-white p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase text-neutral-500 tracking-wider">
              BUSINESS OPS // ENGINE POLICIES &amp; SCHEDULING CONSTRAINTS
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight mt-1 text-black">
              BOOKING RULES, SCHEDULING POLICIES &amp; OPERATIONAL PARAMETERS
            </h2>
            <p className="text-xs text-neutral-600 mt-1 max-w-3xl">
              Govern client booking deposit thresholds, cancellation penalties, bay concurrency constraints, breed duration buffers, and waitlist auto-dispatch parameters across all facilities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={handleResetDefaults}
              className="border border-black bg-white px-3 py-1.5 hover:bg-neutral-100 font-bold text-xs uppercase"
            >
              [RESET TO DEFAULTS]
            </button>
            <button 
              type="button"
              onClick={handleSave}
              className="bg-black text-white px-3.5 py-1.5 hover:bg-neutral-800 font-bold text-xs uppercase flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>[SAVE CONFIGURATION // v2.4.9]</span>
            </button>
          </div>
        </div>

        {/* 5-METRIC STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4 pt-4 border-t border-black">
          <div className="border border-black p-2 bg-neutral-50 text-right min-w-[120px]">
            <div className="text-[9px] text-neutral-500 uppercase">DEFAULT DEPOSIT</div>
            <div className="text-base font-bold">$25.00 / 20%</div>
          </div>
          <div className="border border-black p-2 bg-neutral-50 text-right min-w-[120px]">
            <div className="text-[9px] text-neutral-500 uppercase">CANCEL LOCKOUT</div>
            <div className="text-base font-bold">24H WINDOW</div>
          </div>
          <div className="border border-black p-2 bg-neutral-50 text-right min-w-[120px]">
            <div className="text-[9px] text-neutral-500 uppercase">NO-SHOW PENALTY</div>
            <div className="text-base font-bold">100% FORFEIT</div>
          </div>
          <div className="border border-black p-2 bg-neutral-50 text-right min-w-[120px]">
            <div className="text-[9px] text-neutral-500 uppercase">WAITLIST DISPATCH</div>
            <div className="text-base font-bold text-black">ENABLED (SMS)</div>
          </div>
          <div className="border border-black p-2 bg-neutral-50 text-right min-w-[120px]">
            <div className="text-[9px] text-neutral-500 uppercase">MAX CONCURRENCY</div>
            <div className="text-base font-bold">1 DOG/GROOMER</div>
          </div>
        </div>
      </div>

      {/* MAIN CONFIGURATION GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* COLUMN 1 & 2: SECTIONS A, B, C */}
        <div className="xl:col-span-2 space-y-6">

          {/* SECTION A: DEPOSITS & PAYMENT REQUIREMENTS */}
          <div className="border border-black p-5 bg-white">
            <div className="flex items-start justify-between border-b border-black pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-black text-white font-bold flex items-center justify-center text-xs">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base uppercase text-black">DEPOSITS &amp; PAYMENT REQUIREMENTS</h3>
                    <span className="bg-black text-white text-[10px] px-1.5 py-0.2 font-bold uppercase">STRIPE ATTACHED</span>
                    <span className="border border-black text-[10px] px-1.5 py-0.2 uppercase bg-green-50">ENFORCED ONLINE</span>
                  </div>
                  <div className="text-xs text-neutral-500">GATEWAY PROTOCOL: STRIPE_SETUP_INTENT // CAPTURE_ON_HOLD</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-500 uppercase text-[10px]">GATEWAY STATUS:</span>
                <span className="font-bold bg-neutral-100 border border-black px-1.5 py-0.5">ACTIVE (TEST/PROD)</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-black p-3 bg-neutral-50 flex items-center justify-between">
                <div>
                  <span className="font-bold uppercase block text-black">REQUIRE DEPOSIT FOR ONLINE BOOKING</span>
                  <p className="text-[11px] text-neutral-500">Forces card authorization or payment capture at checkout before calendar confirmation.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setRequireDeposit(!requireDeposit)}
                  className="bg-black text-white px-2.5 py-1 font-bold text-[10px] uppercase border border-black cursor-pointer"
                >
                  [TOGGLE: {requireDeposit ? 'ON' : 'OFF'}]
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-black p-3 bg-white space-y-2">
                  <label className="block font-bold uppercase text-[11px] text-black">FIRST-TIME CLIENT DEPOSIT RATE</label>
                  <div className="text-[10px] text-neutral-500">Applied automatically when pet or owner profile has 0 past completed checkouts.</div>
                  <div className="flex gap-2">
                    <select 
                      value={firstTimeDepositType}
                      onChange={(e) => setFirstTimeDepositType(e.target.value)}
                      className="w-1/2 border border-black p-1.5 bg-neutral-50 focus:bg-white focus:outline-none"
                    >
                      <option>$35.00 Flat Fee</option>
                      <option>50% of Service</option>
                      <option>100% Full Prepay</option>
                    </select>
                    <input 
                      type="text" 
                      value={firstTimeDepositRate}
                      onChange={(e) => setFirstTimeDepositRate(e.target.value)}
                      className="w-1/2 border border-black p-1.5 font-bold bg-neutral-50 text-right focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="border border-black p-3 bg-white space-y-2">
                  <label className="block font-bold uppercase text-[11px] text-black">REPEAT CLIENT DEPOSIT WAIVER THRESHOLD</label>
                  <div className="text-[10px] text-neutral-500">Waives upfront deposit requirement for established trustworthy clients.</div>
                  <select 
                    value={repeatClientThreshold}
                    onChange={(e) => setRepeatClientThreshold(e.target.value)}
                    className="w-full border border-black p-1.5 bg-neutral-50 focus:bg-white focus:outline-none"
                  >
                    <option>&gt; 5 Completed Visits (Deposit Waived)</option>
                    <option>&gt; 3 Completed Visits</option>
                    <option>&gt; 10 Completed Visits</option>
                    <option>Never Waive (Enforce All)</option>
                  </select>
                </div>
              </div>

              <div className="border border-black p-3 bg-white space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold uppercase text-[10px] text-neutral-600">
                    REFUNDABLE VS NON-REFUNDABLE DEPOSIT TERMS EDITOR
                  </label>
                  <span className="text-[9px] text-neutral-400">DISCLOSED ON CHECKOUT &amp; SMS CONFIRMATION</span>
                </div>
                <textarea 
                  rows={3} 
                  value={depositTerms}
                  onChange={(e) => setDepositTerms(e.target.value)}
                  className="w-full border border-black p-2 bg-neutral-50 text-[11px] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION B: CANCELLATION & RESCHEDULING RULES */}
          <div className="border border-black p-5 bg-white">
            <div className="flex items-start justify-between border-b border-black pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-black text-white font-bold flex items-center justify-center text-xs">
                  B
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base uppercase text-black">CANCELLATION &amp; RESCHEDULING RULES</h3>
                    <span className="border border-black text-[10px] px-1.5 py-0.2 uppercase bg-neutral-100 font-bold">LOCKOUT AUTOMATION</span>
                  </div>
                  <div className="text-xs text-neutral-500">POLICY REF: POL_CANC_2025 // ENFORCEMENT DAEMON: AUTO_CHARGE</div>
                </div>
              </div>
              <span className="bg-neutral-100 border border-black text-[10px] px-2 py-1 uppercase font-bold">SEVERITY: STRICT</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-black p-3 bg-neutral-50 space-y-2">
                  <label className="block font-bold uppercase text-[11px] text-black">CANCELLATION DEADLINE WITHOUT FEE</label>
                  <p className="text-[10px] text-neutral-500">Cutoff threshold before late cancellation calculation is triggered.</p>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="number" 
                      value={cancelDeadlineHours}
                      onChange={(e) => setCancelDeadlineHours(Number(e.target.value))}
                      className="w-24 border border-black p-1.5 bg-white font-bold text-center focus:outline-none"
                    />
                    <span className="font-bold uppercase text-black">HOURS PRIOR TO APPOINTMENT</span>
                  </div>
                </div>

                <div className="border border-black p-3 bg-neutral-50 space-y-2">
                  <label className="block font-bold uppercase text-[11px] text-black">LATE CANCELLATION FEE CALCULATION</label>
                  <p className="text-[10px] text-neutral-500">Applied automatically to stored card or billed to client profile ledger.</p>
                  <select 
                    value={lateCancelFeeMode}
                    onChange={(e) => setLateCancelFeeMode(e.target.value)}
                    className="w-full border border-black p-1.5 bg-white focus:outline-none"
                  >
                    <option>50% of Scheduled Service Fee</option>
                    <option>100% of Scheduled Service Fee</option>
                    <option>$35.00 Flat Penalty</option>
                    <option>Deposit Forfeit Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-black p-3 bg-white space-y-2">
                  <label className="block font-bold uppercase text-[11px] text-black">NO-SHOW ENFORCEMENT ACTION</label>
                  <p className="text-[10px] text-neutral-500">Triggered after grace buffer expires without arrival or check-in contact.</p>
                  <select 
                    value={noShowAction}
                    onChange={(e) => setNoShowAction(e.target.value)}
                    className="w-full border border-black p-1.5 bg-neutral-50 focus:bg-white focus:outline-none"
                  >
                    <option>Auto-charge card on file + Ban online booking</option>
                    <option>Auto-charge card on file only</option>
                    <option>Flag account as High Risk (Manager Review)</option>
                    <option>Forfeit deposit and close slot</option>
                  </select>
                </div>

                <div className="border border-black p-3 bg-white space-y-2">
                  <label className="block font-bold uppercase text-[11px] text-black">GRACE PERIOD BUFFER</label>
                  <p className="text-[10px] text-neutral-500">Allowed late arrival before bay status shifts to Standby or Late Arrival penalty.</p>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="number" 
                      value={gracePeriodMinutes}
                      onChange={(e) => setGracePeriodMinutes(Number(e.target.value))}
                      className="w-24 border border-black p-1.5 bg-neutral-50 font-bold text-center focus:bg-white focus:outline-none"
                    />
                    <span className="font-bold uppercase text-black">MINUTES AFTER APPT START</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION C: SALON CAPACITY & AVAILABILITY ENGINE */}
          <div className="border border-black p-5 bg-white">
            <div className="flex items-start justify-between border-b border-black pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-black text-white font-bold flex items-center justify-center text-xs">
                  C
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base uppercase text-black">SALON CAPACITY &amp; AVAILABILITY ENGINE</h3>
                    <span className="bg-black text-white text-[10px] px-1.5 py-0.2 font-bold uppercase">BAY THROTTLING</span>
                  </div>
                  <div className="text-xs text-neutral-500">RESOURCE SCHEDULER: DISPATCH_V2 // SYNC_MODE: REALTIME</div>
                </div>
              </div>
              <span className="border border-black text-[10px] px-1.5 py-0.2 uppercase bg-green-50 font-bold">OPTIMIZER ONLINE</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-black p-3 bg-neutral-50">
                <span className="font-bold uppercase block mb-2 text-black">MAX SIMULTANEOUS DOGS PER FACILITY</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="border border-black p-2 bg-white flex items-center justify-between">
                    <div>
                      <span className="font-bold uppercase block text-[11px] text-black">FRISCO HQ</span>
                      <span className="text-[9px] text-neutral-500">8 BAYS // PRIMARY</span>
                    </div>
                    <input 
                      type="number" 
                      value={friscoCapacity}
                      onChange={(e) => setFriscoCapacity(Number(e.target.value))}
                      className="w-14 border border-black p-1 text-center font-bold bg-neutral-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="border border-black p-2 bg-white flex items-center justify-between">
                    <div>
                      <span className="font-bold uppercase block text-[11px] text-black">PLANO WEST</span>
                      <span className="text-[9px] text-neutral-500">5 BAYS // BRANCH</span>
                    </div>
                    <input 
                      type="number" 
                      value={planoCapacity}
                      onChange={(e) => setPlanoCapacity(Number(e.target.value))}
                      className="w-14 border border-black p-1 text-center font-bold bg-neutral-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="border border-black p-2 bg-white flex items-center justify-between">
                    <div>
                      <span className="font-bold uppercase block text-[11px] text-black">MOBILE VAN FLEET</span>
                      <span className="text-[9px] text-neutral-500">1 VAN / APPOINTMENT</span>
                    </div>
                    <input 
                      type="number" 
                      value={mobileCapacity}
                      onChange={(e) => setMobileCapacity(Number(e.target.value))}
                      className="w-14 border border-black p-1 text-center font-bold bg-neutral-50 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-black p-3 bg-white space-y-2">
                  <label className="block font-bold uppercase text-[11px] text-black">SERVICE DURATION PADDING / CLEAN-UP BUFFER</label>
                  <p className="text-[10px] text-neutral-500">Added automatically after each service slot for sanitization and tool reset.</p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={cleanBufferMinutes}
                      onChange={(e) => setCleanBufferMinutes(Number(e.target.value))}
                      className="w-24 border border-black p-1.5 bg-neutral-50 font-bold text-center focus:bg-white focus:outline-none"
                    />
                    <span className="font-bold uppercase text-black">MINUTES BETWEEN DOGS</span>
                  </div>
                </div>

                <div className="border border-black p-3 bg-white space-y-2">
                  <label className="block font-bold uppercase text-[11px] text-black">MULTI-PET BOOKING DISCOUNT</label>
                  <p className="text-[10px] text-neutral-500">Incentive discount calculated when scheduling multiple pets in consecutive bays.</p>
                  <select 
                    value={multiPetDiscount}
                    onChange={(e) => setMultiPetDiscount(e.target.value)}
                    className="w-full border border-black p-1.5 bg-neutral-50 focus:bg-white focus:outline-none"
                  >
                    <option>10% Off Second Dog</option>
                    <option>15% Off Second Dog</option>
                    <option>$10.00 Flat Off Each Sibling</option>
                    <option>No Multi-Pet Discount</option>
                  </select>
                </div>
              </div>

              <div className="border border-black p-3 bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase block text-[11px] text-black">BREED-SPECIFIC DURATION EXTENSIONS (COAT PREP MATRIX)</span>
                  <button 
                    type="button"
                    onClick={() => showNotification('Breed override dialog ready')}
                    className="border border-black bg-white px-2 py-0.5 text-[9px] font-bold uppercase hover:bg-black hover:text-white"
                  >
                    + ADD BREED OVERRIDE
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between border border-black p-2 bg-white">
                    <span className="font-bold text-black">STANDARD POODLE / DOODLE MIXES</span>
                    <span className="bg-neutral-100 border border-black px-1.5 py-0.5 font-bold">+30 MINS COAT PREP &amp; DRYING</span>
                  </div>
                  <div className="flex items-center justify-between border border-black p-2 bg-white">
                    <span className="font-bold text-black">GIANT SCHNAUZER / GREAT PYRENEES / NEWFOUNDLAND</span>
                    <span className="bg-neutral-100 border border-black px-1.5 py-0.5 font-bold">+45 MINS HEAVY COAT / DESHED</span>
                  </div>
                  <div className="flex items-center justify-between border border-black p-2 bg-white">
                    <span className="font-bold text-black">BRACHYCEPHALIC (FRENCHIE / BULLDOG)</span>
                    <span className="bg-neutral-100 border border-black px-1.5 py-0.5 font-bold">+15 MINS LOW-HEAT BLOWOUT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 3: SECTION D WAITLIST & SIDEBAR CONTROLS */}
        <div className="space-y-6">

          {/* SECTION D: WAITLIST AUTOMATION & STANDBY DISPATCH */}
          <div className="border border-black p-5 bg-white">
            <div className="flex items-start justify-between border-b border-black pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-black text-white font-bold flex items-center justify-center text-xs">
                  D
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase text-black">WAITLIST AUTOMATION &amp; STANDBY DISPATCH</h3>
                  <div className="text-[10px] text-neutral-500">DAEMON: DISPATCH_WAITLIST_TWILIO</div>
                </div>
              </div>
              <span className="bg-black text-white text-[9px] px-1.5 py-0.5 font-bold uppercase">AUTO-STANDBY</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-black p-3 bg-neutral-50 flex items-center justify-between">
                <div>
                  <span className="font-bold uppercase text-[11px] block text-black">AUTO-DISPATCH SMS ALERT</span>
                  <span className="text-[9px] text-neutral-500">Instantly alerts waitlist when cancellation occurs</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setWaitlistAutoDispatch(!waitlistAutoDispatch)}
                  className="bg-black text-white px-2 py-0.5 font-bold text-[10px] uppercase border border-black"
                >
                  [{waitlistAutoDispatch ? 'ON' : 'OFF'}]
                </button>
              </div>

              <div className="border border-black p-3 bg-white space-y-1">
                <label className="block font-bold uppercase text-[10px] text-neutral-600">RESPONSE WINDOW BEFORE NEXT CLIENT</label>
                <p className="text-[10px] text-neutral-500 mb-2">Time allotted for client to tap SMS confirm link before offering slot to next customer in line.</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={waitlistResponseMinutes}
                    onChange={(e) => setWaitlistResponseMinutes(Number(e.target.value))}
                    className="w-20 border border-black p-1.5 bg-neutral-50 font-bold text-center focus:bg-white focus:outline-none"
                  />
                  <span className="font-bold uppercase text-[11px] text-black">MINUTES HOLD</span>
                </div>
              </div>

              <div className="border border-black p-3 bg-white space-y-2">
                <label className="block font-bold uppercase text-[10px] text-neutral-600">VIP PRIORITY WEIGHTING</label>
                <select 
                  value={vipPriorityWeighting}
                  onChange={(e) => setVipPriorityWeighting(e.target.value)}
                  className="w-full border border-black p-1.5 bg-neutral-50 focus:bg-white focus:outline-none text-[11px]"
                >
                  <option>Highest LTV &amp; Frequency Ranks First</option>
                  <option>First-Come First-Served (Strict Chronological)</option>
                  <option>VIP Tier 1 Only Pre-Emption</option>
                </select>
              </div>

              <div className="border border-black p-3 bg-neutral-50 text-[11px] space-y-2">
                <div className="flex items-center justify-between font-bold border-b border-black pb-1.5 text-black">
                  <span>LIVE STANDBY QUEUE</span>
                  <span className="bg-black text-white px-1.5 py-0.2 text-[9px]">9 QUEUED</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between"><span>1. Luna (Goldendoodle)</span><span className="font-bold text-black">VIP ★★★ (5m lock)</span></div>
                  <div className="flex justify-between text-neutral-600"><span>2. Barnaby (Bernedoodle)</span><span>VIP ★★ (Standby)</span></div>
                  <div className="flex justify-between text-neutral-600"><span>3. Winston (Frenchie)</span><span>Standard</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* AUDIT TRAIL & POLICY ENFORCEMENT SUMMARY CARD */}
          <div className="border border-black p-4 bg-white">
            <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-black">POLICY AUDIT &amp; SYNC</h4>
              <span className="text-[10px] bg-neutral-100 border border-black px-1 font-bold">ACTIVE DAEMON</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border border-black p-2 bg-neutral-50 text-[11px]">
                <span className="text-neutral-600">CURRENT ENGINE BUILD:</span>
                <span className="font-bold text-black">BUILD_V2.4.9_STABLE</span>
              </div>
              <div className="flex justify-between border border-black p-2 bg-neutral-50 text-[11px]">
                <span className="text-neutral-600">LAST MODIFIED BY:</span>
                <span className="font-bold text-black">SYS_ADMIN (DAWG-ROOT)</span>
              </div>
              <div className="flex justify-between border border-black p-2 bg-neutral-50 text-[11px]">
                <span className="text-neutral-600">REPLICATION SCOPE:</span>
                <span className="font-bold text-black">ALL 3 FACILITIES</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
