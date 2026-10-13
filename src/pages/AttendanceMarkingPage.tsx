import React, { useState, useEffect } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { AttendanceStatus, AttendanceRecord } from '../types/attendance';
import {
  ClipboardCheck,
  QrCode,
  Check,
  X,
  Clock,
  Shield,
  Save,
  CheckCircle2,
  Calendar,
  Sparkles,
  Users,
} from 'lucide-react';

interface AttendanceMarkingPageProps {
  onOpenQRGenerator: () => void;
}

export const AttendanceMarkingPage: React.FC<AttendanceMarkingPageProps> = ({
  onOpenQRGenerator,
}) => {
  const {
    users,
    classes,
    subjects,
    currentUser,
    attendanceRecords,
    markAttendance,
    startQRSession,
    activeQRSession,
  } = useAttendance();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'class-cs3a');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'sub-cs301');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local student attendance map: studentId -> { status, remarks }
  const [rosterStatus, setRosterStatus] = useState<
    Record<string, { status: AttendanceStatus; remarks: string }>
  >({});

  // Get students for selected class
  const classStudents = users.filter(
    (u) => u.role === 'STUDENT' && (u.classId === selectedClassId || !u.classId)
  );

  // Load existing records for this class + subject + date if available
  useEffect(() => {
    const existingMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};

    classStudents.forEach((student) => {
      const match = attendanceRecords.find(
        (r) =>
          r.studentId === student.id &&
          r.subjectId === selectedSubjectId &&
          r.date === selectedDate
      );
      if (match) {
        existingMap[student.id] = { status: match.status, remarks: match.remarks || '' };
      } else {
        existingMap[student.id] = { status: 'PRESENT', remarks: '' }; // Default to present
      }
    });

    setRosterStatus(existingMap);
  }, [selectedClassId, selectedSubjectId, selectedDate, attendanceRecords.length]);

  // Status tally
  const counts = {
    present: Object.values(rosterStatus).filter((s) => s.status === 'PRESENT').length,
    absent: Object.values(rosterStatus).filter((s) => s.status === 'ABSENT').length,
    late: Object.values(rosterStatus).filter((s) => s.status === 'LATE').length,
    excused: Object.values(rosterStatus).filter((s) => s.status === 'EXCUSED').length,
  };

  const setStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setRosterStatus((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const setStudentRemarks = (studentId: string, remarks: string) => {
    setRosterStatus((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach((st) => {
      updated[st.id] = {
        status,
        remarks: rosterStatus[st.id]?.remarks || '',
      };
    });
    setRosterStatus(updated);
  };

  const handleSave = () => {
    const newRecords: AttendanceRecord[] = classStudents.map((student) => {
      const entry = rosterStatus[student.id] || { status: 'PRESENT', remarks: '' };
      return {
        id: `rec-${selectedDate}-${selectedSubjectId}-${student.id}`,
        studentId: student.id,
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        teacherId: currentUser?.id || 'usr-teacher-1',
        date: selectedDate,
        period: selectedPeriod,
        status: entry.status,
        remarks: entry.remarks,
        markedVia: 'MANUAL',
        timestamp: new Date().toISOString(),
      };
    });

    markAttendance(newRecords);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with QR Launcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Mark Class Attendance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manual roster sheet with batch actions or launch real-time dynamic QR attendance
          </p>
        </div>

        <button
          onClick={onOpenQRGenerator}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-xs transition-colors self-start md:self-auto"
        >
          <QrCode className="w-4 h-4" />
          <span>Launch Dynamic QR Session</span>
        </button>
      </div>

      {/* Control Bar: Class, Subject, Date, Period */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Class Section
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Course Subject
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
          >
          </input>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Lecture Period
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
          >
            <option value={1}>Period 1 (09:00 - 10:00 AM)</option>
            <option value={2}>Period 2 (10:00 - 11:00 AM)</option>
            <option value={3}>Period 3 (11:15 - 12:15 PM)</option>
            <option value={4}>Period 4 (01:00 - 02:00 PM)</option>
            <option value={5}>Period 5 (02:00 - 03:00 PM)</option>
            <option value={6}>Period 6 (03:00 - 04:00 PM)</option>
          </select>
        </div>
      </div>

      {/* Summary Bar & Fast Batch Buttons */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Live Counters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-400 mr-1">Roster Stats:</span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 font-semibold font-mono">
            {counts.present} Present
          </span>
          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 font-semibold font-mono">
            {counts.absent} Absent
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 font-semibold font-mono">
            {counts.late} Late
          </span>
          <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 font-semibold font-mono">
            {counts.excused} Excused
          </span>
        </div>

        {/* Quick Batch Selectors */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium hidden sm:inline">Quick Set:</span>
          <button
            type="button"
            onClick={() => handleMarkAll('PRESENT')}
            className="px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-semibold transition-colors"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={() => handleMarkAll('ABSENT')}
            className="px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold transition-colors"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3 px-3 font-semibold">Roll No</th>
                <th className="py-3 px-3 font-semibold">Student Name</th>
                <th className="py-3 px-3 font-semibold text-center w-72">Attendance Status</th>
                <th className="py-3 px-3 font-semibold">Remarks / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {classStudents.map((student) => {
                const current = rosterStatus[student.id]?.status || 'PRESENT';
                const remarks = rosterStatus[student.id]?.remarks || '';

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {student.rollNumber || 'CS-2025'}
                    </td>

                    <td className="py-3 px-3 font-sans font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt=""
                            className="w-6 h-6 rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-[10px]">
                            {student.name.charAt(0)}
                          </div>
                        )}
                        <span>{student.name}</span>
                      </div>
                    </td>

                    {/* Status Pill Toggle Buttons */}
                    <td className="py-3 px-3 font-sans">
                      <div className="flex items-center justify-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setStudentStatus(student.id, 'PRESENT')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            current === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Present
                        </button>

                        <button
                          type="button"
                          onClick={() => setStudentStatus(student.id, 'ABSENT')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            current === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Absent
                        </button>

                        <button
                          type="button"
                          onClick={() => setStudentStatus(student.id, 'LATE')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            current === 'LATE'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Late
                        </button>

                        <button
                          type="button"
                          onClick={() => setStudentStatus(student.id, 'EXCUSED')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            current === 'EXCUSED'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </td>

                    {/* Remarks Input */}
                    <td className="py-3 px-3 font-sans">
                      <input
                        type="text"
                        value={remarks}
                        onChange={(e) => setStudentRemarks(student.id, e.target.value)}
                        placeholder="Optional notes (e.g. sick, arrived at 9:15)..."
                        className="w-full px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:bg-white dark:focus:bg-slate-850"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Save Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Total students in class: <span className="font-semibold text-slate-900 dark:text-white">{classStudents.length}</span>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Attendance saved successfully!
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Attendance Sheet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
