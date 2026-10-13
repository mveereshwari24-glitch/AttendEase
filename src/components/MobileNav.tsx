import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  LayoutDashboard,
  ClipboardCheck,
  GraduationCap,
  Calendar,
  Users,
  ScanLine,
  BarChart3,
} from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenQRScanner?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenQRScanner,
}) => {
  const { currentUser } = useAttendance();

  // Role actions
  const role = currentUser?.role || 'ADMIN';

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-30 flex items-center justify-around px-2 shadow-lg">
      {role === 'STUDENT' ? (
        <>
          <button
            onClick={() => setCurrentTab('student-portal')}
            className={`flex flex-col items-center justify-center w-16 py-1 ${
              currentTab === 'student-portal' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Overview</span>
          </button>

          <button
            onClick={onOpenQRScanner}
            className="flex flex-col items-center justify-center -mt-5 bg-indigo-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-indigo-700 active:scale-95 transition-transform"
          >
            <ScanLine className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentTab('timetable')}
            className={`flex flex-col items-center justify-center w-16 py-1 ${
              currentTab === 'timetable' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Schedule</span>
          </button>

          <button
            onClick={() => setCurrentTab('leaves')}
            className={`flex flex-col items-center justify-center w-16 py-1 ${
              currentTab === 'leaves' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500'
            }`}
          >
            <span className="w-5 h-5 flex items-center justify-center font-bold text-xs">✉</span>
            <span className="text-[10px] mt-0.5">Leave</span>
          </button>
        </>
      ) : role === 'TEACHER' ? (
        <>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center justify-center w-16 py-1 ${
              currentTab === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('attendance')}
            className={`flex flex-col items-center justify-center w-16 py-1 ${
              currentTab === 'attendance' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500'
            }`}
          >
            <ClipboardCheck className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Attendance</span>
          </button>

          <button
            onClick={() => setCurrentTab('timetable')}
            className={`flex flex-col items-center justify-center w-16 py-1 ${
              currentTab === 'timetable' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Timetable</span>
          </button>

          <button
            onClick={() => setCurrentTab('reports')}
            className={`flex flex-col items-center justify-center w-16 py-1 ${
              currentTab === 'reports' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Reports</span>
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center justify-center w-16 py-1 ${
              currentTab === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('students')}
            className={`flex flex-col items-center justify-center w-16 py-1 ${
              currentTab === 'students' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Students</span>
          </button>

          <button
            onClick={() => setCurrentTab('attendance')}
            className={`flex flex-col items-center justify-center w-16 py-1 ${
              currentTab === 'attendance' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500'
            }`}
          >
            <ClipboardCheck className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Attendance</span>
          </button>

          <button
            onClick={() => setCurrentTab('reports')}
            className={`flex flex-col items-center justify-center w-16 py-1 ${
              currentTab === 'reports' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Reports</span>
          </button>
        </>
      )}
    </nav>
  );
};
