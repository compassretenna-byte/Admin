'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Scissors, 
  X, 
  CheckCircle2,
  ArrowRight,
  PawPrint,
  Sparkles,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Heart
} from 'lucide-react';
import { AuthUser } from '@/lib/types';
import { DEMO_AUTH_USERS } from '@/lib/dawg-mock-data';

interface LandingLoginViewProps {
  onLogin: (user: AuthUser, initialSection?: string) => void;
}

export const LandingLoginView: React.FC<LandingLoginViewProps> = ({ onLogin }) => {
  // Login mode: 'member' or 'staff'
  const [authMode, setAuthMode] = useState<'member' | 'staff'>('member');

  // Member credentials
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Staff specific state
  const [staffRole, setStaffRole] = useState<'admin' | 'groomer' | 'frontdesk'>('admin');

  // Modals
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetSentEmail, setResetSentEmail] = useState('');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Registration modal state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPetName, setRegPetName] = useState('');
  const [regPetBreed, setRegPetBreed] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Google OAuth / Mock Action
  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin({
        id: 'usr-google-1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@gmail.com',
        role: 'customer',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      });
      setIsSubmitting(false);
    }, 300);
  };

  const handleMemberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (usernameOrEmail.toLowerCase().includes('admin')) {
        onLogin(
          {
            id: 'usr-admin-1',
            name: 'Salon Administrator',
            email: usernameOrEmail || 'admin@allaboutpawz.com',
            role: 'admin',
            avatarUrl: DEMO_AUTH_USERS[0].avatarUrl,
            stationName: 'Central Management & RBAC Portal',
          },
          'dashboard'
        );
      } else if (
        usernameOrEmail.toLowerCase().includes('groomer') || 
        usernameOrEmail.toLowerCase().includes('sarah')
      ) {
        onLogin({
          id: 'usr-groomer-1',
          name: 'Sarah Miller',
          email: usernameOrEmail || 'sarah.groomer@allaboutpawz.com',
          role: 'groomer',
          avatarUrl: DEMO_AUTH_USERS[1].avatarUrl,
          stationName: 'Station #3 (Master Grooming Suite)',
        });
      } else {
        onLogin({
          id: 'usr-client-1',
          name: usernameOrEmail.split('@')[0] || 'Sarah Johnson',
          email: usernameOrEmail || 'sarah.johnson@client.com',
          role: 'customer',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        });
      }
      setIsSubmitting(false);
    }, 180);
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (staffRole === 'admin') {
        onLogin(
          {
            id: 'usr-admin-1',
            name: 'Salon Administrator',
            email: usernameOrEmail || 'admin@allaboutpawz.com',
            role: 'admin',
            avatarUrl: DEMO_AUTH_USERS[0].avatarUrl,
            stationName: 'Central Management & RBAC Portal',
          },
          'dashboard'
        );
      } else if (staffRole === 'groomer') {
        onLogin({
          id: 'usr-groomer-1',
          name: 'Sarah Miller',
          email: usernameOrEmail || 'sarah.groomer@allaboutpawz.com',
          role: 'groomer',
          avatarUrl: DEMO_AUTH_USERS[1].avatarUrl,
          stationName: 'Station #3 (Master Grooming Suite)',
        });
      } else {
        onLogin({
          id: 'usr-frontdesk-1',
          name: 'Front Desk Reception',
          email: usernameOrEmail || 'reception@allaboutpawz.com',
          role: 'admin',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
          stationName: 'Intake & Concierge Desk',
        }, 'dashboard');
      }
      setIsSubmitting(false);
    }, 180);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSuccess(true);
    setTimeout(() => {
      onLogin({
        id: `usr-cust-${Date.now()}`,
        name: regName || 'Valued Pet Parent',
        email: regEmail || 'member@allaboutpawz.com',
        role: 'customer',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      });
      setRegisterModalOpen(false);
      setRegSuccess(false);
    }, 500);
  };

  return (
    <div className="w-full min-h-screen bg-black flex flex-col antialiased selection:bg-amber-500 selection:text-white">
      
      {/* 2-Column Responsive Layout (Scrollable - No Locked Height) */}
      <main className="w-full grid grid-cols-1 lg:grid-cols-2 bg-black">
        
        {/* ================= LEFT HALF: FULL IMAGE IN NATURAL FLOW ================= */}
        <section 
          aria-label="All About Pawz Presentation"
          className="w-full bg-black flex flex-col items-center justify-start select-none"
        >
          <div className="w-full bg-black flex items-center justify-center">
            {/* The Image is displayed with 100% natural aspect ratio so you can scroll down to the bottom where it ends */}
            <Image
              src="/assets/auth_image.png_2K_202609060354.jpeg"
              alt="All About Pawz - Luxury Grooming Salon"
              width={1000}
              height={1400}
              priority
              className="w-full h-auto object-contain block"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>


        {/* ================= RIGHT HALF: AUTHENTICATION FORM ================= */}
        <section 
          aria-label="Member Authentication Terminal"
          className="bg-white flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 min-h-[500px]"
        >
          <div className="w-full max-w-[360px] flex flex-col my-auto py-8">
            
            {/* Mode Switcher / Title */}
            {authMode === 'member' ? (
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-[26px] font-serif tracking-[0.16em] text-zinc-900 uppercase font-normal mb-1">
                  MEMBER LOGIN
                </h1>
                <p className="text-[12px] text-zinc-400 font-light">
                  Sign in to book &amp; manage pet spa appointments
                </p>
              </div>
            ) : (
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-amber-400 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> Staff &amp; Admin OS
                </div>
                <h1 className="text-2xl sm:text-[26px] font-serif tracking-[0.14em] text-zinc-900 uppercase font-normal">
                  STAFF PORTAL
                </h1>
                <p className="text-[12px] text-zinc-400 font-light">
                  Authorized salon personnel &amp; management access
                </p>
              </div>
            )}

            {/* Google Sign-in Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-white hover:bg-zinc-50 active:bg-zinc-100 border border-zinc-300 rounded-md text-zinc-700 text-xs font-semibold flex items-center justify-center gap-3 transition shadow-2xs cursor-pointer mb-5"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-zinc-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-zinc-400 uppercase tracking-wider">
                Or with email
              </span>
              <div className="border-t border-zinc-200 w-full" />
            </div>

            {/* ================= MEMBER FORM ================= */}
            {authMode === 'member' ? (
              <form onSubmit={handleMemberLogin} className="space-y-4">
                
                {/* Username/Email */}
                <div>
                  <label 
                    htmlFor="member-username" 
                    className="block text-[13px] font-normal text-zinc-700 mb-1.5"
                  >
                    Username/Email
                  </label>
                  <input
                    id="member-username"
                    type="text"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="Username/Email"
                    className="w-full bg-white border border-zinc-300 rounded-md px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-700 transition"
                  />
                </div>

                {/* Password */}
                <div>
                  <label 
                    htmlFor="member-password" 
                    className="block text-[13px] font-normal text-zinc-700 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="member-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-white border border-zinc-300 rounded-md px-3.5 pr-10 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-700 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Right-aligned Forgot Password? */}
                  <div className="flex justify-end pt-1.5">
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-[12px] text-zinc-500 hover:text-zinc-900 font-serif italic transition cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-black hover:bg-zinc-800 active:bg-zinc-900 text-white font-medium text-xs tracking-[0.18em] uppercase rounded-md transition shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>LOG IN</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegisterModalOpen(true)}
                    className="w-full py-2.5 bg-white hover:bg-zinc-50 active:bg-zinc-100 text-zinc-900 font-medium text-xs tracking-[0.18em] uppercase border border-zinc-900 rounded-md transition flex items-center justify-center cursor-pointer"
                  >
                    REGISTER
                  </button>
                </div>

                {/* Bottom Route to Staff */}
                <div className="pt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setAuthMode('staff')}
                    className="text-[13px] font-serif text-zinc-700 hover:text-black underline underline-offset-4 transition cursor-pointer"
                  >
                    Staff here.
                  </button>
                </div>

              </form>
            ) : (
              /* ================= STAFF & ADMIN ROUTE FORM ================= */
              <form onSubmit={handleStaffLogin} className="space-y-4 animate-in fade-in duration-200">
                
                {/* Staff Role Selector Tabs */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-100 rounded-lg border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setStaffRole('admin')}
                    className={`py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                      staffRole === 'admin' 
                        ? 'bg-zinc-900 text-white shadow-xs' 
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    Administrator
                  </button>
                  <button
                    type="button"
                    onClick={() => setStaffRole('groomer')}
                    className={`py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                      staffRole === 'groomer' 
                        ? 'bg-zinc-900 text-white shadow-xs' 
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    Groomer
                  </button>
                  <button
                    type="button"
                    onClick={() => setStaffRole('frontdesk')}
                    className={`py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                      staffRole === 'frontdesk' 
                        ? 'bg-zinc-900 text-white shadow-xs' 
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    Front Desk
                  </button>
                </div>

                {/* Staff Email or Employee ID */}
                <div>
                  <label 
                    htmlFor="staff-id" 
                    className="block text-[13px] font-normal text-zinc-700 mb-1.5"
                  >
                    Staff Email or ID
                  </label>
                  <input
                    id="staff-id"
                    type="text"
                    value={usernameOrEmail || (staffRole === 'admin' ? 'admin@allaboutpawz.com' : staffRole === 'groomer' ? 'sarah.groomer@allaboutpawz.com' : 'reception@allaboutpawz.com')}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-md px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-700 transition"
                  />
                </div>

                {/* Security Passcode / Password */}
                <div>
                  <label 
                    htmlFor="staff-passcode" 
                    className="block text-[13px] font-normal text-zinc-700 mb-1.5"
                  >
                    Password or 4-Digit Station PIN
                  </label>
                  <input
                    id="staff-passcode"
                    type="password"
                    defaultValue="••••••••"
                    className="w-full bg-white border border-zinc-300 rounded-md px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-700 transition"
                  />
                </div>

                {/* Staff Actions */}
                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-zinc-900 hover:bg-black text-white font-medium text-xs tracking-[0.18em] uppercase rounded-md transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>ENTER {staffRole === 'admin' ? 'ADMIN OS' : staffRole === 'groomer' ? 'GROOMER SUITE' : 'FRONT DESK'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('member')}
                    className="w-full py-2.5 text-zinc-600 hover:text-zinc-900 text-xs font-medium transition cursor-pointer"
                  >
                    ← Return to Member Login
                  </button>
                </div>

              </form>
            )}

          </div>
        </section>

      </main>


      {/* ================= MODERN SALON FOOTER (WHERE IMAGE & FORM END) ================= */}
      <footer className="w-full bg-zinc-950 border-t border-zinc-800/80 text-zinc-400 py-10 px-6 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-widest text-white text-sm uppercase font-semibold">
                ALL ABOUT PAWZ
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                Luxury Pet Salon &amp; Spa
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Premier breed-standard styling, hydrotherapy baths, coat treatments &amp; spa services.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-300">
            <button 
              onClick={() => setAuthMode('member')}
              className="hover:text-white transition cursor-pointer"
            >
              Member Portal
            </button>
            <button 
              onClick={() => setAuthMode('staff')}
              className="hover:text-white transition cursor-pointer text-amber-400"
            >
              Staff &amp; Admin Access
            </button>
            <span className="text-zinc-600">•</span>
            <span className="hover:text-white transition cursor-pointer">
              Grooming Menu
            </span>
            <span className="hover:text-white transition cursor-pointer">
              VIP Pawz Club
            </span>
            <span className="hover:text-white transition cursor-pointer">
              Privacy Policy
            </span>
          </div>

          {/* Copyright */}
          <div className="text-[11px] text-zinc-400 text-center md:text-right">
            © {new Date().getFullYear()} All About Pawz. All rights reserved.
          </div>
        </div>
      </footer>


      {/* ================= REGISTER PET PARENT MODAL ================= */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-5 bg-zinc-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
                  <PawPrint className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">New Member Registration</h3>
                  <p className="text-[11px] text-zinc-300">Join All About Pawz Rewards &amp; Booking Portal</p>
                </div>
              </div>
              <button
                onClick={() => setRegisterModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
              {regSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                  <h4 className="text-base font-bold text-zinc-900">Welcome to All About Pawz!</h4>
                  <p className="text-xs text-zinc-600">Setting up your member dashboard...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Jessica Williams"
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="jessica@example.com"
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="(214) 555-0199"
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Pet Name</label>
                      <input
                        type="text"
                        required
                        value={regPetName}
                        onChange={(e) => setRegPetName(e.target.value)}
                        placeholder="e.g. Milo"
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Pet Breed &amp; Details</label>
                    <input
                      type="text"
                      value={regPetBreed}
                      onChange={(e) => setRegPetBreed(e.target.value)}
                      placeholder="e.g. Mini Goldendoodle, 22 lbs"
                      className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setRegisterModalOpen(false)}
                      className="px-4 py-2 border border-zinc-300 text-xs font-semibold text-zinc-700 rounded-lg hover:bg-zinc-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                    >
                      Complete Registration
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}


      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-zinc-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900">Reset Your Password</h3>
              <button
                onClick={() => {
                  setForgotPasswordOpen(false);
                  setResetSentEmail('');
                }}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSentEmail ? (
              <div className="space-y-3 text-center py-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-xs text-zinc-700">
                  Password reset link sent to <strong>{resetSentEmail}</strong>. Please check your inbox.
                </p>
                <button
                  onClick={() => {
                    setForgotPasswordOpen(false);
                    setResetSentEmail('');
                  }}
                  className="w-full py-2 bg-zinc-900 text-white text-xs font-semibold rounded-lg mt-2 cursor-pointer"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setResetSentEmail(usernameOrEmail || 'your.email@example.com');
                }}
                className="space-y-3"
              >
                <p className="text-xs text-zinc-500">
                  Enter your registered username or email and we will send you a password recovery link.
                </p>
                <input
                  type="email"
                  required
                  defaultValue={usernameOrEmail}
                  placeholder="Enter your email"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-black hover:bg-zinc-900 text-white font-semibold text-xs rounded-lg transition cursor-pointer"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
