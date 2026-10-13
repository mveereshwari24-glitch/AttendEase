import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { TimetableSlot } from '../types/attendance';
import {
  Calendar,
  Clock,
  Plus,
  MapPin,
  User,
  X,
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react';

export const TimetablePage: React.FC = () => {
  const {
    timetable,
    classes,
    subjects,
    users,
    addTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot,
    currentUser,
  } = useAttendance();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'class-cs3a');
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const periods = [
    { num: 1, time: '09:00 - 10:00' },
    { num: 2, time: '10:00 - 11:00' },
    { num: 3, time: '11:15 - 12:15' },
    { num: 4, time: '13:00 - 14:00' },
    { num: 5, time: '14:00 - 15:00' },
    { num: 6, time: '15:00 - 16:00' },
  ];

  const [slotForm, setSlotForm] = useState<{
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    period: number;
    startTime: string;
    endTime: string;
    classId: string;
    subjectId: string;
    teacherId: string;
    room: string;
  }>({
    day: 'Monday',
    period: 1,
    startTime: '09:00',
    endTime: '10:00',
    classId: selectedClassId,
    subjectId: subjects[0]?.id || '',
    teacherId: users.find((u) => u.role === 'TEACHER')?.id || '',
    room: 'Hall 302',
  });

  const teachers = users.filter((u) => u.role === 'TEACHER');

  // Filter slots for the current selected class
  const classSlots = timetable.filter((s) => s.classId === selectedClassId);

  const openAddSlot = (day?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday', period?: number) => {
    setEditingSlot(null);
    setConflictWarning(null);
    const initialSub = subjects.find((s) => s.classId === selectedClassId) || subjects[0];

    setSlotForm({
      day: day || 'Monday',
      period: period || 1,
      startTime: period === 1 ? '09:00' : period === 2 ? '10:00' : '11:15',
      endTime: period === 1 ? '10:00' : period === 2 ? '11:00' : '12:15',
      classId: selectedClassId,
      subjectId: initialSub?.id || '',
      teacherId: initialSub?.teacherId || teachers[0]?.id || '',
      room: 'Hall 302',
    });
    setIsSlotModalOpen(true);
  };

  const openEditSlot = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setConflictWarning(null);
    setSlotForm({
      day: slot.day,
      period: slot.period,
      startTime: slot.startTime,
      endTime: slot.endTime,
      classId: slot.classId,
      subjectId: slot.subjectId,
      teacherId: slot.teacherId,
      room: slot.room,
    });
    setIsSlotModalOpen(true);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();

    // Check for collisions: Room or Teacher booked in another class at same day & period
    const roomCollision = timetable.find(
      (s) =>
        s.id !== editingSlot?.id &&
        s.day === slotForm.day &&
        s.period === slotForm.period &&
        s.room.toLowerCase() === slotForm.room.toLowerCase()
    );

    if (roomCollision) {
      setConflictWarning(`Room Collision: ${slotForm.room} is already booked for another session at this time.`);
      return;
    }

    if (editingSlot) {
      updateTimetableSlot({
        ...editingSlot,
        ...slotForm,
      });
    } else {
      addTimetableSlot(slotForm);
    }
    setIsSlotModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Institutional Weekly Timetable
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standard 6-period master schedule with room assignments and conflict checking
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Class Selector */}
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white font-medium"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} ({c.name})
              </option>
            ))}
          </select>

          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={() => openAddSlot()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lecture Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* Timetable Weekly Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-3 font-semibold w-24 text-center">Day</th>
                {periods.map((p) => (
                  <th key={p.num} className="py-3 px-3 font-semibold text-center border-l border-slate-200 dark:border-slate-800">
                    <span className="block text-slate-900 dark:text-white font-bold">Period {p.num}</span>
                    <span className="block text-[10px] text-slate-400 font-mono font-normal">{p.time}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {days.map((day) => (
                <tr key={day} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  {/* Day Column */}
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white text-center bg-slate-50/40 dark:bg-slate-850/40">
                    {day}
                  </td>

                  {/* 6 Periods */}
                  {periods.map((p) => {
                    const slot = classSlots.find((s) => s.day === day && s.period === p.num);
                    const sub = slot ? subjects.find((s) => s.id === slot.subjectId) : null;
                    const teacher = slot ? users.find((u) => u.id === slot.teacherId) : null;

                    return (
                      <td
                        key={p.num}
                        className="p-2 border-l border-slate-100 dark:border-slate-800/80 align-top h-24"
                      >
                        {slot ? (
                          <div className="h-full p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 flex flex-col justify-between group relative hover:shadow-xs transition-shadow">
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-mono font-bold text-[10px] text-indigo-700 dark:text-indigo-300">
                                  {sub?.code || 'CS301'}
                                </span>
                                {currentUser?.role === 'ADMIN' && (
                                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                    <button
                                      onClick={() => openEditSlot(slot)}
                                      className="p-0.5 text-slate-400 hover:text-indigo-600"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (window.confirm('Delete timetable slot?')) {
                                          deleteTimetableSlot(slot.id);
                                        }
                                      }}
                                      className="p-0.5 text-slate-400 hover:text-rose-600"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <p className="font-bold text-[11px] text-slate-900 dark:text-white leading-tight mt-1 line-clamp-2">
                                {sub?.name}
                              </p>
                            </div>

                            <div className="mt-2 pt-1 border-t border-indigo-100/80 dark:border-indigo-900/40 text-[10px] text-slate-500 space-y-0.5">
                              <div className="flex items-center gap-1 truncate">
                                <User className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                <span className="truncate">{teacher?.name.split(' ')[1] || 'Faculty'}</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-400 font-mono">
                                <MapPin className="w-2.5 h-2.5 shrink-0" />
                                <span>{slot.room}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          currentUser?.role === 'ADMIN' ? (
                            <button
                              onClick={() => openAddSlot(day, p.num)}
                              className="w-full h-full rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center justify-center text-slate-300 hover:text-indigo-500 transition-colors"
                              title="Assign lecture"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          ) : (
                            <div className="w-full h-full rounded-xl bg-slate-50/20 dark:bg-slate-900/20 flex items-center justify-center text-[10px] text-slate-300 dark:text-slate-700">
                              Free
                            </div>
                          )
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Slot Modal */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingSlot ? 'Edit Timetable Lecture Slot' : 'Assign New Lecture Slot'}
              </h3>
              <button
                onClick={() => setIsSlotModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {conflictWarning && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{conflictWarning}</span>
              </div>
            )}

            <form onSubmit={handleSaveSlot} className="space-y-3.5 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Day of Week
                  </label>
                  <select
                    value={slotForm.day}
                    onChange={(e) => setSlotForm({ ...slotForm, day: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Period Slot
                  </label>
                  <select
                    value={slotForm.period}
                    onChange={(e) => setSlotForm({ ...slotForm, period: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {periods.map((p) => (
                      <option key={p.num} value={p.num}>
                        Period {p.num} ({p.time})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Course *
                </label>
                <select
                  value={slotForm.subjectId}
                  onChange={(e) => {
                    const sub = subjects.find((s) => s.id === e.target.value);
                    setSlotForm({
                      ...slotForm,
                      subjectId: e.target.value,
                      teacherId: sub?.teacherId || slotForm.teacherId,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
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
                  Faculty Instructor *
                </label>
                <select
                  value={slotForm.teacherId}
                  onChange={(e) => setSlotForm({ ...slotForm, teacherId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Lecture Hall / Room *
                </label>
                <input
                  type="text"
                  required
                  value={slotForm.room}
                  onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
                  placeholder="e.g. Hall 302, System Lab 2"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSlotModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Save Timetable Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
