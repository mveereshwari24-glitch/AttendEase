import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  QrCode,
  GraduationCap,
  FileText,
  RotateCcw,
  Shield,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (o: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { currentUser, leaveRequests, resetAllData, settings } = useAttendance();

  // Pending leave count badge
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'PENDING').length;

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setIsMobileOpen(false);
  };

  // Build role-specific navigation items
  const getNavItems = () => {
    const role = currentUser?.role || 'ADMIN';

    if (role === 'STUDENT') {
      return [
        { id: 'student-portal', label: 'My Attendance', icon: GraduationCap },
        { id: 'timetable', label: 'Class Schedule', icon: Calendar },
        { id: 'leaves', label: 'Leave Requests', icon: FileText, badge: pendingLeaves > 0 ? pendingLeaves : undefined },
      ];
    }

    if (role === 'PARENT') {
      return [
        { id: 'parent-portal', label: 'Child Attendance', icon: GraduationCap },
        { id: 'timetable', label: 'Class Schedule', icon: Calendar },
        { id: 'leaves', label: 'Leave Requests', icon: FileText },
      ];
    }

    if (role === 'TEACHER') {
      return [
        { id: 'dashboard', label: 'Faculty Overview', icon: LayoutDashboard },
        { id: 'attendance', label: 'Mark Attendance', icon: ClipboardCheck },
        { id: 'timetable', label: 'Teaching Schedule', icon: Calendar },
        { id: 'students', label: 'Student Roster', icon: Users },
        { id: 'leaves', label: 'Leave Approvals', icon: FileCheck, badge: pendingLeaves > 0 ? pendingLeaves : undefined },
        { id: 'reports', label: 'Class Analytics', icon: BarChart3 },
      ];
    }

    // Default ADMIN
    return [
      { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'teachers', label: 'Faculty', icon: UserCheck },
      { id: 'classes', label: 'Classes & Subjects', icon: BookOpen },
      { id: 'timetable', label: 'Institutional Timetable', icon: Calendar },
      { id: 'attendance', label: 'Mark Attendance', icon: ClipboardCheck },
      { id: 'leaves', label: 'Leave Approvals', icon: FileCheck, badge: pendingLeaves > 0 ? pendingLeaves : undefined },
      { id: 'reports', label: 'Reports & Defaulters', icon: BarChart3 },
      { id: 'settings', label: 'System Settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between ${
          isMobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'}`}
      >
        {/* Top Header & Logo */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            {isCollapsed ? (
              <div className="mx-auto">
                <Logo variant="sidebar-collapsed" />
              </div>
            ) : (
              <Logo variant="navbar" showTagline={true} />
            )}

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors ml-auto"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:scale-110'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}

                  {/* Badge */}
                  {item.badge !== undefined && !isCollapsed && (
                    <span
                      className={`ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive
                          ? 'bg-white text-indigo-700'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Collapsed dot badge */}
                  {item.badge !== undefined && isCollapsed && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Current user info & quick reset */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          {!isCollapsed && (
            <div className="mb-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span>Threshold:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {settings.attendanceThresholdPercent}%
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                {settings.institutionName}
              </p>
            </div>
          )}

          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to default initial seed?')) {
                resetAllData();
              }
            }}
            title="Reset demo database"
            className={`w-full flex items-center gap-2 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[11px] ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span>Reset Demo Data</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
