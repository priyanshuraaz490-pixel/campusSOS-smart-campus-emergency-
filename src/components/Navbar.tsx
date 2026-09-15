import React, { useState } from 'react';
import { ShieldAlert, LogIn, LogOut, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentRole: 'student' | 'responder';
  studentView: 'home' | 'report' | 'alert-sent' | 'my-reports';
  responderTab: 'dashboard' | 'active' | 'history';
  onSelectStudentView: (view: 'home' | 'report' | 'my-reports') => void;
  onSelectResponderTab: (tab: 'dashboard' | 'active' | 'history') => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onQuickSwitchToStudent: () => void;
  activeCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  studentView,
  responderTab,
  onSelectStudentView,
  onSelectResponderTab,
  onOpenLogin,
  onLogout,
  onQuickSwitchToStudent,
  activeCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStudentNav = (view: 'home' | 'report' | 'my-reports') => {
    onSelectStudentView(view);
    setMobileMenuOpen(false);
  };

  const handleResponderNav = (tab: 'dashboard' | 'active' | 'history') => {
    onSelectResponderTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Logo & Branding - Left */}
        <button
          onClick={() => {
            if (currentRole === 'student') {
              onSelectStudentView('home');
            } else {
              onSelectResponderTab('dashboard');
            }
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 text-left cursor-pointer hover:opacity-90 transition-opacity min-w-0 shrink"
        >
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-slate-900 text-base leading-tight flex items-center gap-2 truncate">
              CampusSOS
              {currentRole === 'responder' && (
                <span className="bg-slate-800 text-white text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                  Responder Portal
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 font-medium hidden sm:block truncate">
              Smart Campus Emergency Response System
            </div>
          </div>
        </button>

        {/* Desktop Navigation Tabs (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-1.5 sm:gap-2 shrink-0">
          {currentRole === 'student' ? (
            <>
              <button
                onClick={() => onSelectStudentView('home')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  studentView === 'home'
                    ? 'bg-red-50 text-red-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onSelectStudentView('report')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  studentView === 'report' || studentView === 'alert-sent'
                    ? 'bg-red-50 text-red-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Report Emergency
              </button>
              <button
                onClick={() => onSelectStudentView('my-reports')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  studentView === 'my-reports'
                    ? 'bg-red-50 text-red-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                My Reports
              </button>

              <div className="h-5 w-px bg-slate-200 mx-1" />

              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Responder Login</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onSelectResponderTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  responderTab === 'dashboard'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onSelectResponderTab('active')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  responderTab === 'active'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Active Emergencies</span>
                {activeCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">
                    {activeCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => onSelectResponderTab('history')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  responderTab === 'history'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                History
              </button>

              <div className="h-5 w-px bg-slate-200 mx-1" />

              <button
                onClick={onLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          )}
        </nav>

        {/* Mobile Hamburger Button (Visible only on mobile/small tablets) */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown / Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 shadow-lg animate-in fade-in duration-150">
          {currentRole === 'student' ? (
            <>
              <button
                type="button"
                onClick={() => handleStudentNav('home')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer flex items-center justify-between ${
                  studentView === 'home'
                    ? 'bg-red-50 text-red-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Home</span>
              </button>
              <button
                type="button"
                onClick={() => handleStudentNav('report')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer flex items-center justify-between ${
                  studentView === 'report' || studentView === 'alert-sent'
                    ? 'bg-red-50 text-red-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Report Emergency</span>
              </button>
              <button
                type="button"
                onClick={() => handleStudentNav('my-reports')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer flex items-center justify-between ${
                  studentView === 'my-reports'
                    ? 'bg-red-50 text-red-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>My Reports</span>
              </button>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-slate-600" />
                  <span>Responder Login</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleResponderNav('dashboard')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                  responderTab === 'dashboard'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => handleResponderNav('active')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer flex items-center justify-between ${
                  responderTab === 'active'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Active Emergencies</span>
                {activeCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">
                    {activeCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleResponderNav('history')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                  responderTab === 'history'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                History
              </button>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onQuickSwitchToStudent();
                  }}
                  className="flex-1 text-center px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Student Mode
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="flex-1 text-center px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
