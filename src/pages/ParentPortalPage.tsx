import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Mail,
  Shield,
  BookOpen,
} from 'lucide-react';

export const ParentPortalPage: React.FC = () => {
  const { currentUser, getStudentSummary, settings, subjects, attendanceRecords } = useAttendance();

  // Child linked to parent (default to Sarah Jenkins CS2024-042)
  const childId = 'usr-student-sarah';
  const childSummary = getStudentSummary(childId);

  if (!settings.enableParentPortal) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500">
        <Users className="w-12 h-12 mx-auto mb-3 text-slate-400" />
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Parent Portal Access Disabled
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          The institutional administrator has currently turned off public parent portal visibility in system settings.
        </p>
      </div>
    );
  }

  if (!childSummary) {
    return (
      <div className="p-12 text-center text-slate-500">
        No linked student record found for this guardian account.
      </div>
    );
  }

  const isSafe = childSummary.percentage >= settings.attendanceThresholdPercent;

  // Student recent attendance records
  const childLogs = attendanceRecords
    .filter((r) => r.studentId === childId)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Parent Welcome Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xl">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Guardian Portal
            </span>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {childSummary.name}'s Academic Attendance Record
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Roll No: {childSummary.rollNumber} · Computer Science & Engineering
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Overall Rate</span>
            <span
              className={`text-2xl font-extrabold tabular-nums ${
                isSafe ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {childSummary.percentage}%
            </span>
          </div>
          <div
            className={`p-2 rounded-xl ${
              isSafe
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600'
                : 'bg-rose-50 dark:bg-rose-950/70 text-rose-600'
            }`}
          >
            {isSafe ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-400 block">Total Classes Held</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1 block">
            {childSummary.totalClasses}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-400 block">Classes Attended</span>
          <span className="text-xl font-bold text-emerald-600 font-mono mt-1 block">
            {childSummary.presentCount}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-400 block">Classes Missed</span>
          <span className="text-xl font-bold text-rose-600 font-mono mt-1 block">
            {childSummary.absentCount}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-400 block">Excused Leaves</span>
          <span className="text-xl font-bold text-sky-600 font-mono mt-1 block">
            {childSummary.excusedCount}
          </span>
        </div>
      </div>

      {/* Subject Progress */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Subject Attendance Detail
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current semester performance against the minimum {settings.attendanceThresholdPercent}% cutoff
          </p>
        </div>

        <div className="space-y-3">
          {childSummary.subjectBreakdown.map((sub) => {
            const isSubSafe = sub.percentage >= settings.attendanceThresholdPercent;
            return (
              <div
                key={sub.subjectId}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {sub.subjectCode}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {sub.subjectName}
                    </span>
                  </div>
                  <span
                    className={`font-mono font-bold tabular-nums ${
                      isSubSafe ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isSubSafe ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${sub.percentage}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono mt-1.5">
                  <span>
                    Attended {sub.present} of {sub.total} sessions
                  </span>
                  <span>{isSubSafe ? 'Satisfactory' : 'Attendance Deficit'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent History Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Recent Classroom Activity
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Real-time check-in record verified by classroom sensor/faculty
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-sans">
                <th className="py-2.5 px-3 font-semibold">Date</th>
                <th className="py-2.5 px-3 font-semibold">Course</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {childLogs.map((log) => {
                const sub = subjects.find((s) => s.id === log.subjectId);
                return (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-300">{log.date}</td>
                    <td className="py-2 px-3 font-sans font-medium text-slate-800 dark:text-slate-200">
                      {sub?.name || 'Class Lecture'}
                    </td>
                    <td className="py-2 px-3 text-center font-sans">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          log.status === 'PRESENT'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                            : log.status === 'ABSENT'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                            : 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
