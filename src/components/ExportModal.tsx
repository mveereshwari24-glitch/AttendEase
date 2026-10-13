import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Logo } from './Logo';
import { X, Download, Printer, FileSpreadsheet, FileText, CheckCircle2, Sliders } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'all' | 'defaulters';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'all',
}) => {
  const { getAllStudentSummaries, settings, classes, subjects } = useAttendance();
  const [filterClass, setFilterClass] = useState<string>('all');
  const [exportType, setExportType] = useState<'all' | 'defaulters'>(defaultMode);
  const [threshold, setThreshold] = useState<number>(settings.attendanceThresholdPercent);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const summaries = getAllStudentSummaries();
  const filteredStudents = summaries.filter((s) => {
    if (filterClass !== 'all' && s.classId !== filterClass) return false;
    if (exportType === 'defaulters' && s.percentage >= threshold) return false;
    return true;
  });

  // Handle CSV Download
  const handleDownloadCSV = () => {
    const headers = [
      'Roll Number',
      'Student Name',
      'Class',
      'Total Classes Held',
      'Classes Attended',
      'Attendance Percentage',
      'Status',
    ];

    const rows = filteredStudents.map((s) => {
      const cls = classes.find((c) => c.id === s.classId)?.code || s.classId;
      const status = s.percentage < threshold ? 'DEFAULTER' : 'REGULAR';
      return [
        `"${s.rollNumber}"`,
        `"${s.name}"`,
        `"${cls}"`,
        s.totalClasses,
        s.presentCount + s.lateCount,
        `${s.percentage}%`,
        status,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `AttendEase_Report_${exportType}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Handle Print Preview / PDF Export
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Export Attendance Reports
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate official spreadsheets and printable institutional audit reports
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-4 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">
              Scope
            </label>
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value as 'all' | 'defaulters')}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">Full Institutional Roster</option>
              <option value="defaulters">Defaulters List Only (&lt; Threshold)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">
              Class Section
            </label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-500 dark:text-slate-400 font-medium">
                Defaulter Threshold
              </label>
              <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
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
          </div>
        </div>

        {/* Printable Document Preview */}
        <div className="flex-1 overflow-y-auto my-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-sans text-xs">
          {/* Printable Report Header */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
            <div>
              <Logo variant="report" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                {settings.institutionName}
              </h3>
              <p className="text-[11px] text-slate-500">
                Academic Term: {settings.currentSemester} ({settings.academicYear})
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Report Type: {exportType === 'defaulters' ? 'DEFICIENCY LIST' : 'CONSOLIDATED ATTENDANCE'}
              </p>
              <p>Generated: {new Date().toLocaleDateString()}</p>
              <p>Min. Attendance Required: {threshold}%</p>
            </div>
          </div>

          {/* Table Preview */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px]">
                <th className="py-2 px-2 font-medium">Roll No</th>
                <th className="py-2 px-2 font-medium">Student Name</th>
                <th className="py-2 px-2 font-medium">Class</th>
                <th className="py-2 px-2 font-medium text-right">Attended / Total</th>
                <th className="py-2 px-2 font-medium text-right">Attendance %</th>
                <th className="py-2 px-2 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filteredStudents.slice(0, 15).map((s) => {
                const isUnder = s.percentage < threshold;
                return (
                  <tr key={s.studentId} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50">
                    <td className="py-2 px-2 font-semibold text-slate-700 dark:text-slate-300">{s.rollNumber}</td>
                    <td className="py-2 px-2 font-sans font-medium text-slate-900 dark:text-white">{s.name}</td>
                    <td className="py-2 px-2 text-slate-500">
                      {classes.find((c) => c.id === s.classId)?.code || 'CS3-A'}
                    </td>
                    <td className="py-2 px-2 text-right text-slate-600 dark:text-slate-400">
                      {s.presentCount + s.lateCount} / {s.totalClasses}
                    </td>
                    <td
                      className={`py-2 px-2 text-right font-bold tabular-nums ${
                        isUnder ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {s.percentage}%
                    </td>
                    <td className="py-2 px-2 text-center font-sans">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          isUnder
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {isUnder ? 'Defaulter' : 'Clear'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredStudents.length > 15 && (
            <p className="text-center text-[11px] text-slate-400 italic mt-3">
              + {filteredStudents.length - 15} additional records in exported file
            </p>
          )}

          {/* Institutional Signature Footer */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 dark:border-slate-700" />
              <p className="mt-1 font-semibold text-slate-700 dark:text-slate-300">Department Head Signature</p>
            </div>
            <div className="text-right">
              <div className="h-10 border-b border-dashed border-slate-300 dark:border-slate-700" />
              <p className="mt-1 font-semibold text-slate-700 dark:text-slate-300">Dean of Academic Affairs</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500">
            Total Records: <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredStudents.length}</span> students
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / PDF
            </button>
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm transition-colors"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Excel (CSV)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
