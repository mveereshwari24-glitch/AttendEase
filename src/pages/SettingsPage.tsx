import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  Settings,
  Shield,
  Save,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Users,
  QrCode,
  Bell,
  Building,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllData, theme, toggleTheme } = useAttendance();

  const [formData, setFormData] = useState({
    institutionName: settings.institutionName,
    academicYear: settings.academicYear,
    currentSemester: settings.currentSemester,
    attendanceThresholdPercent: settings.attendanceThresholdPercent,
    lateGracePeriodMinutes: settings.lateGracePeriodMinutes,
    enableParentPortal: settings.enableParentPortal,
    enableDynamicQR: settings.enableDynamicQR,
    allowGeofencing: settings.allowGeofencing,
    emailAlertsEnabled: settings.emailAlertsEnabled,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Institutional Configuration & Policies
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global attendance thresholds, parent visibility toggles, and academic calendar parameters
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Configuration saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Academic Profile */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Institutional Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                required
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                required
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Active Semester
              </label>
              <input
                type="text"
                required
                value={formData.currentSemester}
                onChange={(e) => setFormData({ ...formData, currentSemester: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Late Check-in Grace Period (Minutes)
              </label>
              <input
                type="number"
                min="0"
                max="60"
                value={formData.lateGracePeriodMinutes}
                onChange={(e) => setFormData({ ...formData, lateGracePeriodMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Attendance Threshold Rules */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Defaulter Criteria & Cutoff Policy
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  Minimum Institutional Attendance Percentage
                </span>
                <p className="text-[11px] text-slate-500">
                  Students below this mark are automatically tagged as Defaulters on reports & notifications
                </p>
              </div>
              <span className="font-mono text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {formData.attendanceThresholdPercent}%
              </span>
            </div>

            <input
              type="range"
              min="50"
              max="90"
              step="1"
              value={formData.attendanceThresholdPercent}
              onChange={(e) => setFormData({ ...formData, attendanceThresholdPercent: Number(e.target.value) })}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Shield className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Security & Module Controls
            </h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Enable Guardian / Parent Portal
                </span>
                <span className="text-slate-400 text-[11px]">
                  Permits parents to log in and review read-only child attendance analytics
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.enableParentPortal}
                onChange={(e) => setFormData({ ...formData, enableParentPortal: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Dynamic Rotating QR Sessions
                </span>
                <span className="text-slate-400 text-[11px]">
                  Enforces 20-second token rotation to eliminate proxy scanning in auditoriums
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.enableDynamicQR}
                onChange={(e) => setFormData({ ...formData, enableDynamicQR: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Automated Email Alert Dispatch
                </span>
                <span className="text-slate-400 text-[11px]">
                  Sends simulated email warnings to students and parents when falling below threshold
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.emailAlertsEnabled}
                onChange={(e) => setFormData({ ...formData, emailAlertsEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600"
              />
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo state to clean factory seed?')) {
                resetAllData();
              }
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Factory Demo Data</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
