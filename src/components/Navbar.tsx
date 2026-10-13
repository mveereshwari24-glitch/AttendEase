import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Logo } from './Logo';
import {
  Sun,
  Moon,
  QrCode,
  ScanLine,
  User,
  ChevronDown,
  LogOut,
  Bell,
  Menu,
  Shield,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onOpenQRGenerator?: () => void;
  onOpenQRScanner?: () => void;
  onOpenExport?: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenQRGenerator,
  onOpenQRScanner,
  onOpenExport,
  onToggleSidebar,
}) => {
  const {
    currentUser,
    users,
    switchUser,
    logout,
    theme,
    toggleTheme,
    settings,
    activeQRSession,
  } = useAttendance();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Quick switch demo users
  const adminUser = users.find((u) => u.role === 'ADMIN');
  const teacherUser = users.find((u) => u.role === 'TEACHER');
  const studentUser = users.find((u) => u.role === 'STUDENT');
  const parentUser = users.find((u) => u.role === 'PARENT');

  // Format tab name for breadcrumb
  const formatTabName = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard & Analytics';
      case 'students':
        return 'Student Directory';
      case 'teachers':
        return 'Faculty & Instructors';
      case 'classes':
        return 'Classes & Subjects';
      case 'timetable':
        return 'Weekly Timetable';
      case 'attendance':
        return 'Attendance Marking';
      case 'student-portal':
        return 'My Attendance Portal';
      case 'parent-portal':
        return 'Child Attendance Overview';
      case 'leaves':
        return 'Leave Applications';
      case 'reports':
        return 'Reports & Defaulter Audit';
      case 'settings':
        return 'Institutional Settings';
      default:
        return tab.charAt(0).toUpperCase() + tab.slice(1);
    }
  };

  return (
    <header className="h-16 px-4 md:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
      {/* Zone 1: Mobile Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg focus:outline-none"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs md:text-sm truncate">
          <span className="font-semibold text-slate-400 dark:text-slate-500 hidden sm:inline">
            AttendEase
          </span>
          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">/</span>
          <span className="font-semibold text-slate-900 dark:text-white truncate">
            {formatTabName(currentTab)}
          </span>
        </div>
      </div>

      {/* Zone 2: Semester status & Live QR alert */}
      <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        {activeQRSession?.active ? (
          <div
            onClick={onOpenQRGenerator}
            className="cursor-pointer flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 animate-pulse font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>QR Active: {activeQRSession.subjectName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
            <span>{settings.currentSemester}</span>
            <span className="text-slate-400">·</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{settings.attendanceThresholdPercent}% Target</span>
          </div>
        )}
      </div>

      {/* Zone 3: Actions + Theme + Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Student Scanner button if student */}
        {currentUser?.role === 'STUDENT' && (
          <button
            onClick={onOpenQRScanner}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>
        )}

        {/* Teacher / Admin QR Session Launch button */}
        {(currentUser?.role === 'TEACHER' || currentUser?.role === 'ADMIN') && (
          <button
            onClick={onOpenQRGenerator}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 flex items-center gap-1.5 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Launch QR</span>
          </button>
        )}

        {/* Dark / Light Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left"
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser?.name.charAt(0)}
              </div>
            )}
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[110px]">
                {currentUser?.name}
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                {currentUser?.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile & Demo Switcher Dropdown */}
          {isProfileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in duration-150"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                  {currentUser?.role} Account
                </span>
              </div>

              {/* Demo Switch Roles Section */}
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Demo Role
                </span>
                <div className="mt-1 space-y-1">
                  {adminUser && (
                    <button
                      onClick={() => switchUser(adminUser.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        currentUser?.id === adminUser.id ? 'bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-indigo-600' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Admin (Dr. Eleanor)</span>
                      </div>
                    </button>
                  )}
                  {teacherUser && (
                    <button
                      onClick={() => switchUser(teacherUser.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        currentUser?.id === teacherUser.id ? 'bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-indigo-600' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-sky-500" />
                        <span>Faculty (Prof. Marcus)</span>
                      </div>
                    </button>
                  )}
                  {studentUser && (
                    <button
                      onClick={() => switchUser(studentUser.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        currentUser?.id === studentUser.id ? 'bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-indigo-600' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Student (Sarah Jenkins)</span>
                      </div>
                    </button>
                  )}
                  {parentUser && settings.enableParentPortal && (
                    <button
                      onClick={() => switchUser(parentUser.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        currentUser?.id === parentUser.id ? 'bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-indigo-600' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-amber-500" />
                        <span>Parent (Robert Jenkins)</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-1">
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
