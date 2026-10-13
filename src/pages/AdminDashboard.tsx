import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  Users,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  QrCode,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenQRGenerator: () => void;
  onOpenExport: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenQRGenerator,
  onOpenExport,
  onNavigateToTab,
}) => {
  const {
    users,
    classes,
    settings,
    getTodayAttendanceStats,
    get30DayAttendanceTrend,
    getClassComparison,
    getDefaulters,
  } = useAttendance();

  const [alertSentFor, setAlertSentFor] = useState<string | null>(null);
  const [trendHoverIndex, setTrendHoverIndex] = useState<number | null>(null);

  // Compute KPI values
  const studentUsers = users.filter((u) => u.role === 'STUDENT');
  const teacherUsers = users.filter((u) => u.role === 'TEACHER');
  const todayStats = getTodayAttendanceStats();
  const defaulters = getDefaulters();
  const trendData = get30DayAttendanceTrend();
  const classComparison = getClassComparison();

  const handleSendDefaulterAlert = (studentId: string, studentName: string) => {
    setAlertSentFor(studentId);
    setTimeout(() => setAlertSentFor(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Institutional Attendance Overview
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {settings.institutionName} · Current Term: {settings.currentSemester} · Minimum Target: {settings.attendanceThresholdPercent}%
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenExport}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Audit Reports</span>
          </button>
          <button
            onClick={onOpenQRGenerator}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-xs transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch Live QR</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Students */}
        <div
          onClick={() => onNavigateToTab('students')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Students</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {studentUsers.length}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> 100% enrolled
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Across {classes.length} active class sections
          </p>
        </div>

        {/* KPI 2: Total Teachers */}
        <div
          onClick={() => onNavigateToTab('teachers')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-300 dark:hover:border-sky-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Faculty Members</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {teacherUsers.length}
            </span>
            <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
              Active Instructors
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            5 accredited engineering courses
          </p>
        </div>

        {/* KPI 3: Today's Attendance % */}
        <div
          onClick={() => onNavigateToTab('attendance')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Attendance</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {todayStats.percentage}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({todayStats.present} Present)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {todayStats.absent} Absent · {todayStats.late} Late
          </p>
        </div>

        {/* KPI 4: Defaulters (<75%) */}
        <div
          onClick={() => onNavigateToTab('reports')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-300 dark:hover:border-rose-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Defaulters (&lt; {settings.attendanceThresholdPercent}%)</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
              {defaulters.length}
            </span>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" /> Action required
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Students at risk of semester debarment
          </p>
        </div>
      </div>

      {/* Charts Section: 30-Day Trend + Class Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 30-Day Attendance Trend Line Chart (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                30-Day Institutional Attendance Trend
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily student present rates against the {settings.attendanceThresholdPercent}% institutional baseline
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
                <span className="text-slate-600 dark:text-slate-400">Attendance %</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-400 border-t border-dashed border-rose-500" />
                <span className="text-slate-600 dark:text-slate-400">Threshold ({settings.attendanceThresholdPercent}%)</span>
              </div>
            </div>
          </div>

          {/* Custom Responsive SVG Chart */}
          <div className="relative h-64 w-full">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 600 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="20" x2="600" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
              <line x1="0" y1="70" x2="600" y2="70" stroke="#E2E8F0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#E2E8F0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
              <line x1="0" y1="170" x2="600" y2="170" stroke="#E2E8F0" strokeDasharray="3 3" className="dark:stroke-slate-800" />

              {/* 75% Threshold Line */}
              {/* Formula: y = 200 - (75 / 100) * 180 = 200 - 135 = 65 */}
              <line
                x1="0"
                y1={200 - (settings.attendanceThresholdPercent / 100) * 180}
                x2="600"
                y2={200 - (settings.attendanceThresholdPercent / 100) * 180}
                stroke="#DC2626"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Attendance Trend Area & Line */}
              {trendData.length > 1 && (
                <>
                  {/* Area */}
                  <polygon
                    points={`0,200 ${trendData
                      .map((d, i) => {
                        const x = (i / (trendData.length - 1)) * 600;
                        const y = 200 - (d.percentage / 100) * 180;
                        return `${x},${y}`;
                      })
                      .join(' ')} 600,200`}
                    fill="url(#trendGradient)"
                  />

                  {/* Line */}
                  <polyline
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={trendData
                      .map((d, i) => {
                        const x = (i / (trendData.length - 1)) * 600;
                        const y = 200 - (d.percentage / 100) * 180;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Data Points on Hover */}
                  {trendData.map((d, i) => {
                    const x = (i / (trendData.length - 1)) * 600;
                    const y = 200 - (d.percentage / 100) * 180;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={trendHoverIndex === i ? '5' : '2.5'}
                        fill="#FFFFFF"
                        stroke="#4F46E5"
                        strokeWidth="2"
                        className="cursor-pointer transition-all hover:scale-150"
                        onMouseEnter={() => setTrendHoverIndex(i)}
                        onMouseLeave={() => setTrendHoverIndex(null)}
                      />
                    );
                  })}
                </>
              )}
            </svg>

            {/* Hover Tooltip */}
            {trendHoverIndex !== null && trendData[trendHoverIndex] && (
              <div
                className="absolute z-10 p-2 rounded-lg bg-slate-900 text-white text-[11px] shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(trendHoverIndex / (trendData.length - 1)) * 100}%`,
                  top: `${200 - (trendData[trendHoverIndex].percentage / 100) * 180 - 10}px`,
                }}
              >
                <p className="font-bold">{trendData[trendHoverIndex].displayDate}</p>
                <p className="text-indigo-300 font-mono">
                  Attendance: {trendData[trendHoverIndex].percentage}%
                </p>
                <p className="text-slate-400 text-[10px]">
                  {trendData[trendHoverIndex].present} / {trendData[trendHoverIndex].total} students
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-mono">
            <span>30 days ago</span>
            <span>15 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Class-wise Attendance Comparison Bar Chart (1 col) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Class Performance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Average section attendance rates
            </p>
          </div>

          <div className="space-y-4 my-auto py-2">
            {classComparison.map((cls) => {
              const isBelow = cls.percentage < settings.attendanceThresholdPercent;
              return (
                <div key={cls.code} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cls.code}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        isBelow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {cls.percentage}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isBelow
                          ? 'bg-rose-500'
                          : cls.percentage >= 85
                          ? 'bg-emerald-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${cls.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span className="truncate max-w-[170px]">{cls.className}</span>
                    <span>{cls.totalStudents} enrolled</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Threshold Target: {settings.attendanceThresholdPercent}%</span>
            <button
              onClick={() => onNavigateToTab('classes')}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Manage Classes →
            </button>
          </div>
        </div>
      </div>

      {/* Defaulter Table (Top 10) & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Defaulter Table (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Attendance Defaulter Roster
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300">
                  Below {settings.attendanceThresholdPercent}%
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Students requiring warning notifications or parent counseling
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('reports')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Full Audit →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3 font-semibold">Roll No</th>
                  <th className="py-2.5 px-3 font-semibold">Student Name</th>
                  <th className="py-2.5 px-3 font-semibold">Class</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Attendance %</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Missed Classes</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {defaulters.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 italic">
                      No defaulters found! All enrolled students are meeting the {settings.attendanceThresholdPercent}% threshold.
                    </td>
                  </tr>
                ) : (
                  defaulters.slice(0, 8).map((student) => {
                    const missed = student.absentCount;
                    return (
                      <tr
                        key={student.studentId}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                          {student.rollNumber}
                        </td>
                        <td className="py-3 px-3 font-sans font-medium text-slate-900 dark:text-white">
                          {student.name}
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-sans">
                          {classes.find((c) => c.id === student.classId)?.code || 'CS3-A'}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                          {student.percentage}%
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400 tabular-nums">
                          {missed} sessions
                        </td>
                        <td className="py-3 px-3 text-center font-sans">
                          <button
                            onClick={() => handleSendDefaulterAlert(student.studentId, student.name)}
                            disabled={alertSentFor === student.studentId}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 mx-auto ${
                              alertSentFor === student.studentId
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/40'
                            }`}
                          >
                            {alertSentFor === student.studentId ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Alert Sent!</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3 h-3" />
                                <span>Send Warning</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed (1 col) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Live Activity Feed
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Real-time audit log of campus check-ins and requests
            </p>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                  <QrCode className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-tight">
                    Prof. Marcus Chen started dynamic QR session
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Data Structures & Algorithms · 12 minutes ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-tight">
                    Medical leave approved for Alex Turner
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Reviewed by Dr. Eleanor Vance · 2 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-tight">
                    Timetable updated for Lab Hall 302
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Period 2 rescheduled · Yesterday
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-tight">
                    Automated defaulter notice triggered
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    3 students flagged under 70% threshold
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
            <button
              onClick={() => onNavigateToTab('attendance')}
              className="w-full py-2 rounded-xl text-xs font-semibold text-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Open Live Attendance Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
