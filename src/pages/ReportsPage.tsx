import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Sliders,
  Filter,
  AlertTriangle,
  Mail,
  CheckCircle2,
  Users,
  Search,
} from 'lucide-react';

interface ReportsPageProps {
  onOpenExport: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onOpenExport }) => {
  const {
    getAllStudentSummaries,
    settings,
    classes,
    subjects,
  } = useAttendance();

  const [threshold, setThreshold] = useState<number>(settings.attendanceThresholdPercent);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'defaulters' | 'regular'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [batchAlertSent, setBatchAlertSent] = useState(false);

  const summaries = getAllStudentSummaries();

  const filtered = summaries.filter((s) => {
    const isDefaulter = s.percentage < threshold;
    if (filterType === 'defaulters' && !isDefaulter) return false;
    if (filterType === 'regular' && isDefaulter) return false;
    if (selectedClass !== 'all' && s.classId !== selectedClass) return false;
    if (
      searchTerm &&
      !s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const defaultersCount = summaries.filter((s) => s.percentage < threshold).length;

  const handleSendBatchAlerts = () => {
    setBatchAlertSent(true);
    setTimeout(() => setBatchAlertSent(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Audit Reports & Defaulter Analysis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate institutional compliance records, adjust deficiency cutoffs, and export official spreadsheets
          </p>
        </div>

        <button
          onClick={onOpenExport}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Document (CSV / PDF)</span>
        </button>
      </div>

      {/* Filter and Threshold Controls */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Defaulter Threshold Slider */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                Defaulter Cutoff
              </span>
              <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                {threshold}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              step="1"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>50% (Permissive)</span>
              <span>75% (Standard)</span>
              <span>90% (Strict)</span>
            </div>
          </div>

          {/* Class Filter */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70 flex flex-col justify-between">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Class Section
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Class Sections</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400 mt-1">Filtered by enrolled cohort</span>
          </div>

          {/* Audit Scope */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70 flex flex-col justify-between">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Report Scope
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Students ({summaries.length})</option>
              <option value="defaulters">Defaulters Only (&lt; {threshold}%)</option>
              <option value="regular">Regular Students (&ge; {threshold}%)</option>
            </select>
            <span className="text-[10px] text-slate-400 mt-1">
              Current defaulters count: <strong className="text-rose-600">{defaultersCount}</strong>
            </span>
          </div>
        </div>

        {/* Search & Bulk Alert Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student or roll no..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          {defaultersCount > 0 && (
            <button
              onClick={handleSendBatchAlerts}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                batchAlertSent
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100'
              }`}
            >
              {batchAlertSent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Notices Sent to {defaultersCount} Guardians!</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Notify All {defaultersCount} Defaulters & Parents</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Audit Report Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-sans">
              <tr>
                <th className="py-3 px-3 font-semibold">Roll No</th>
                <th className="py-3 px-3 font-semibold">Student Name</th>
                <th className="py-3 px-3 font-semibold">Class Section</th>
                <th className="py-3 px-3 font-semibold text-right">Attended / Total</th>
                <th className="py-3 px-3 font-semibold text-right">Attendance %</th>
                <th className="py-3 px-3 font-semibold text-center">Deficit Hours</th>
                <th className="py-3 px-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filtered.map((s) => {
                const isUnder = s.percentage < threshold;
                const deficit = isUnder ? Math.ceil(((threshold / 100) * s.totalClasses) - (s.presentCount + s.lateCount * 0.75)) : 0;

                return (
                  <tr key={s.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {s.rollNumber}
                    </td>
                    <td className="py-3 px-3 font-sans font-medium text-slate-900 dark:text-white">
                      {s.name}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-500">
                      {classes.find((c) => c.id === s.classId)?.code || 'CS3-A'}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400">
                      {s.presentCount + s.lateCount} / {s.totalClasses}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-bold tabular-nums ${
                        isUnder ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {s.percentage}%
                    </td>
                    <td className="py-3 px-3 text-center text-slate-500">
                      {deficit > 0 ? (
                        <span className="text-rose-600 font-bold">-{deficit} classes</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-sans">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          isUnder
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                        }`}
                      >
                        {isUnder ? 'Defaulter' : 'Compliant'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Total matching students: <strong className="text-slate-900 dark:text-white">{filtered.length}</strong>
          </span>
          <button
            onClick={onOpenExport}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Download Print-Ready Report →
          </button>
        </div>
      </div>
    </div>
  );
};
