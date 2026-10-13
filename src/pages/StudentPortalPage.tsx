import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  GraduationCap,
  ScanLine,
  Calendar,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  Calculator,
  ChevronRight,
  FileText,
} from 'lucide-react';

interface StudentPortalPageProps {
  onOpenQRScanner: () => void;
  onNavigateToLeaves: () => void;
}

export const StudentPortalPage: React.FC<StudentPortalPageProps> = ({
  onOpenQRScanner,
  onNavigateToLeaves,
}) => {
  const { currentUser, getStudentSummary, settings, attendanceRecords, subjects } = useAttendance();

  const [simulatedClassesToAttend, setSimulatedClassesToAttend] = useState<number>(0);
  const [simulatedClassesToMiss, setSimulatedClassesToMiss] = useState<number>(0);

  // Student summary
  const studentId = currentUser?.id || 'usr-student-sarah';
  const summary = getStudentSummary(studentId);

  if (!summary) {
    return (
      <div className="p-8 text-center text-slate-500">
        Student attendance profile not found.
      </div>
    );
  }

  const threshold = settings.attendanceThresholdPercent;
  const isSafe = summary.percentage >= threshold;

  // Safe-Bunk / Target Math:
  // Let T = totalClasses, P = effective present.
  // Current pct = P / T.
  // 1) To reach target threshold (say 75% = 0.75):
  // (P + x) / (T + x) >= 0.75  =>  P + x >= 0.75 T + 0.75 x  =>  0.25 x >= 0.75 T - P  =>  x >= (0.75 T - P) / 0.25
  const neededToReachThreshold = Math.max(
    0,
    Math.ceil(( (threshold / 100) * summary.totalClasses - (summary.presentCount + summary.lateCount * 0.75) ) / (1 - threshold / 100))
  );

  // 2) How many can be safely missed:
  // P / (T + y) >= 0.75  =>  P >= 0.75 T + 0.75 y  =>  0.75 y <= P - 0.75 T  =>  y <= (P - 0.75 T) / 0.75
  const canSafelyMiss = Math.max(
    0,
    Math.floor(
      ((summary.presentCount + summary.lateCount * 0.75) - (threshold / 100) * summary.totalClasses) /
        (threshold / 100)
    )
  );

  // Simulated Outcome
  const simTotal = summary.totalClasses + simulatedClassesToAttend + simulatedClassesToMiss;
  const simPresent = summary.presentCount + summary.lateCount * 0.75 + simulatedClassesToAttend;
  const simPercentage = simTotal > 0 ? Math.round((simPresent / simTotal) * 1000) / 10 : 100;

  // Recent 10 attendance records for this student
  const studentLogs = attendanceRecords
    .filter((r) => r.studentId === studentId)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Attendance Status & Scanner Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10">
          {/* Circular Percentage Ring */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={isSafe ? '#10B981' : '#F43F5E'}
                strokeWidth="8"
                strokeDasharray={`${(summary.percentage / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold tracking-tight tabular-nums">
                {summary.percentage}%
              </span>
              <span className="text-[10px] text-slate-300 font-medium">Aggregate</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                {currentUser?.name || summary.name}
              </h1>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isSafe
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {isSafe ? 'Good Standing' : 'Defaulter Alert'}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-1">
              Roll No: {summary.rollNumber} · B.Tech Computer Science & Eng.
            </p>
            <p className="text-xs text-indigo-200 mt-2">
              {isSafe
                ? `Great job! You are safely above the institutional ${threshold}% threshold.`
                : `Action required: Your attendance is below ${threshold}%. Please attend upcoming classes.`}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 z-10 w-full sm:w-auto">
          <button
            onClick={onOpenQRScanner}
            className="px-5 py-3 rounded-xl bg-white text-indigo-950 hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <ScanLine className="w-4 h-4 text-indigo-600" />
            <span>Scan Live Class QR</span>
          </button>
          <button
            onClick={onNavigateToLeaves}
            className="px-4 py-3 rounded-xl bg-indigo-800/60 hover:bg-indigo-700/60 border border-indigo-700/50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>

      {/* Attendance Bunk / Target Calculator Widget */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Safe-Bunk & Target Attendance Calculator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Institutional formula engine based on the {threshold}% minimum criteria
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Smart Recommendation Card */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between ${
              isSafe
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                {isSafe ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                )}
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {isSafe ? 'Safe Margin Allowance' : 'Remedial Target'}
                </span>
              </div>

              {isSafe ? (
                <div>
                  <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {canSafelyMiss} <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Classes</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    You can safely miss up to <strong>{canSafelyMiss} classes</strong> and still maintain your attendance above {threshold}%.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
                    {neededToReachThreshold} <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Classes Needed</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    You must attend the next <strong>{neededToReachThreshold} consecutive classes</strong> without absence to recover to {threshold}%.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 font-mono">
              Current: {summary.presentCount} attended / {summary.totalClasses} total held
            </div>
          </div>

          {/* Interactive Simulator */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-col justify-between text-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Interactive Simulator
                </span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm tabular-nums">
                  Simulated: {simPercentage}%
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>If I attend upcoming:</span>
                    <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{simulatedClassesToAttend} classes</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={simulatedClassesToAttend}
                    onChange={(e) => setSimulatedClassesToAttend(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>If I miss upcoming:</span>
                    <span className="font-bold font-mono text-rose-600 dark:text-rose-400">{simulatedClassesToMiss} classes</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={simulatedClassesToMiss}
                    onChange={(e) => setSimulatedClassesToMiss(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
              Projected Status:{' '}
              <span
                className={`font-semibold ${
                  simPercentage >= threshold ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {simPercentage >= threshold ? 'Eligible for Finals' : 'Barred from Finals'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Breakdown Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Course Subject Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.subjectBreakdown.map((sub) => {
            const isSubBelow = sub.isDefaulter;
            return (
              <div
                key={sub.subjectId}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {sub.subjectCode}
                    </span>
                    <span
                      className={`text-xs font-mono font-extrabold tabular-nums ${
                        isSubBelow ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {sub.percentage}%
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {sub.subjectName}
                  </h3>
                </div>

                <div className="mt-4">
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSubBelow ? 'bg-rose-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${sub.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>
                      {sub.present} / {sub.total} Sessions
                    </span>
                    <span
                      className={`font-semibold ${
                        isSubBelow ? 'text-rose-500' : 'text-slate-400'
                      }`}
                    >
                      {isSubBelow ? 'Deficient' : 'Clear'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Attendance History Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Recent Attendance Activity
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Latest check-in entries logged across lectures
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-sans">
                <th className="py-2.5 px-3 font-semibold">Date</th>
                <th className="py-2.5 px-3 font-semibold">Subject</th>
                <th className="py-2.5 px-3 font-semibold">Verification Mode</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {studentLogs.map((log) => {
                const sub = subjects.find((s) => s.id === log.subjectId);
                return (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{log.date}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800 dark:text-slate-200">
                      {sub?.name || 'Class Lecture'}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-500 text-[11px]">
                      {log.markedVia === 'QR_CODE' ? '📱 Dynamic QR' : '✍ Faculty Sheet'}
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          log.status === 'PRESENT'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                            : log.status === 'ABSENT'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                            : log.status === 'LATE'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
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
