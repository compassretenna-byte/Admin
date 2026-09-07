'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Bell, 
  ChevronDown, 
  Menu,
  Check,
  AlertCircle,
  FileText,
  Clock,
  Cake
} from 'lucide-react';
import { ALERTS_LIST } from '@/lib/mock-data';
import { AuthUser } from '@/lib/types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  currentDate: string;
  onChangeDate: (date: string) => void;
  onNavigateSection: (sec: any) => void;
  onSwitchToGroomer?: () => void;
  onSignOut?: () => void;
  currentUser?: AuthUser;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenSearch,
  currentDate,
  onChangeDate,
  onNavigateSection,
  onSwitchToGroomer,
  onSignOut,
  currentUser
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const dateOptions = [
    'Today (May 12, 2025)',
    'Tomorrow (May 13, 2025)',
    'This Week (May 12 - May 18)',
    'Custom Date Range...',
  ];

  return (
    <header className="h-14 bg-white border-b border-black px-6 flex items-center justify-between gap-4 shrink-0 z-30" data-purpose="top-header">
      {/* Title & Greeting + Mobile Menu Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-1 -ml-1 text-black hover:bg-black hover:text-white border border-transparent hover:border-black transition-colors lg:hidden"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-black tracking-tight uppercase text-black flex items-center gap-1.5">
            <span>Welcome back, Admin!</span>
            <span>👋</span>
          </h2>
        </div>
      </div>

      {/* Right Header Tools */}
      <div className="flex items-center gap-3">
        {/* Date Selector */}
        <div className="relative">
          <button
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="h-8 px-3 border border-black flex items-center gap-2 text-xs font-semibold hover:bg-gray-50 bg-white text-black"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-black flex-shrink-0" />
            <span className="hidden sm:inline">{currentDate}</span>
            <span className="sm:hidden">May 12</span>
            <ChevronDown className="w-3 h-3 text-black" />
          </button>

          {showDateDropdown && (
            <div className="absolute right-0 mt-1 w-56 bg-white border border-black shadow-lg p-1 z-40 space-y-0.5">
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    if (!opt.includes('Custom')) {
                      onChangeDate(opt.replace('Today (', '').replace(')', ''));
                    }
                    setShowDateDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-black hover:bg-gray-100 flex items-center justify-between font-medium"
                >
                  <span>{opt}</span>
                  {opt.includes(currentDate) && <Check className="w-3.5 h-3.5 text-black" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative w-44 sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            onClick={onOpenSearch}
            readOnly
            className="w-full h-8 pl-8 pr-14 text-xs bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black placeholder-gray-400 cursor-pointer text-black"
            placeholder="Search..."
            type="text"
          />
          <div className="absolute inset-y-0 right-0 pr-1.5 flex items-center pointer-events-none">
            <kbd className="px-1 border border-black text-[9px] font-mono uppercase bg-gray-50 text-black">Ctrl + K</kbd>
          </div>
        </div>

        {/* Notifications button with badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors text-black"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center border border-white">
            8
          </span>

          {showNotifications && (
            <div className="absolute right-0 mt-1 w-80 bg-white border border-black shadow-xl p-3 z-40 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-black">
                <span className="text-xs font-black uppercase tracking-wider text-black">Notifications &amp; Alerts</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-black hover:underline cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar">
                {ALERTS_LIST.map((alert) => (
                  <div 
                    key={alert.id}
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateSection(alert.type === 'inventory' ? 'inventory' : 'appointments');
                    }}
                    className="p-2 border border-black hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-2.5 bg-white"
                  >
                    <div className="p-1 border border-black bg-black text-white mt-0.5">
                      <AlertCircle className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs font-bold text-black leading-tight">{alert.title}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Monogram & Store label */}
        <div className="relative pl-2 border-l border-black">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 border border-black bg-black text-white text-xs font-black flex items-center justify-center">
              AP
            </div>
            <div className="leading-tight pr-1 text-left hidden md:block">
              <div className="text-[11px] font-bold leading-none text-black">All About</div>
              <div className="text-[10px] text-gray-500 uppercase font-mono">Pawz</div>
            </div>
            <ChevronDown className="w-3 h-3 text-black hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-black shadow-xl p-2 z-40 space-y-1">
              <div className="px-3 py-2 border-b border-black">
                <p className="text-xs font-bold text-black">{currentUser?.name || 'Admin User'}</p>
                <p className="text-[10px] text-gray-500 font-mono">{currentUser?.email || 'admin@test.com'}</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 border border-black text-black text-[9px] font-mono font-bold uppercase">
                  Administrator
                </span>
              </div>

              {onSwitchToGroomer && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSwitchToGroomer();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-black hover:bg-black hover:text-white font-bold uppercase tracking-wider flex items-center justify-between border border-transparent hover:border-black transition-colors"
                >
                  <span>✂ Groomer Station</span>
                  <span className="text-[9px] font-mono border border-black px-1">Sarah M.</span>
                </button>
              )}

              <button 
                onClick={() => {
                  onNavigateSection('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-black hover:bg-gray-100 font-medium"
              >
                Admin Settings Hub
              </button>
              <button 
                onClick={() => {
                  onNavigateSection('staff');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-black hover:bg-gray-100 font-medium"
              >
                Manage Staff &amp; Roles
              </button>
              <div className="h-px bg-black my-1" />
              <button 
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onSignOut) onSignOut();
                }}
                className="w-full text-left px-3 py-1.5 text-xs font-bold text-black hover:bg-black hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
