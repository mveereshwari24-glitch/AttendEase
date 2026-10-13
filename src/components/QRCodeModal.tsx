import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { useAttendance } from '../context/AttendanceContext';
import { X, RefreshCw, Users, ShieldCheck, Key, CheckCircle2, Clock } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const { activeQRSession, stopQRSession } = useAttendance();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate QR code data URL whenever session token changes
  useEffect(() => {
    if (!activeQRSession || !activeQRSession.active) return;

    // Encoded payload contains session metadata and rotating token
    const payload = JSON.stringify({
      app: 'AttendEase',
      sessionId: activeQRSession.sessionId,
      token: activeQRSession.token,
      passcode: activeQRSession.passcode,
      subjectId: activeQRSession.subjectId,
      expiresAt: activeQRSession.expiresAt,
    });

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: {
        dark: '#1E1B4B',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR', err));

    setSecondsRemaining(20);
  }, [activeQRSession?.token]);

  // Countdown timer for next rotation
  useEffect(() => {
    if (!isOpen || !activeQRSession?.active) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : 20));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, activeQRSession?.active]);

  if (!isOpen || !activeQRSession) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            stopQRSession();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Attendance Session Active
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {activeQRSession.subjectName}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Instructor: {activeQRSession.teacherName} · Rotates automatically to prevent proxy sharing
          </p>
        </div>

        {/* QR Code Canvas Card */}
        <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-5 shadow-inner">
          <div className="relative p-3 bg-white rounded-xl shadow-md border border-slate-100">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Dynamic Attendance QR Code"
                className="w-64 h-64 md:w-72 md:h-72 object-contain"
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
            )}
            {/* Corner security watermark badge */}
            <div className="absolute -bottom-2.5 -right-2.5 bg-indigo-600 text-white rounded-full p-1.5 shadow-md">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Token Rotation Countdown Ring */}
          <div className="flex items-center gap-3 mt-4 text-xs font-medium text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 font-mono tabular-nums bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
              <Clock className="w-4 h-4 text-indigo-500 animate-spin" style={{ animationDuration: '4s' }} />
              Rotating in: <span className="font-bold text-indigo-600 dark:text-indigo-400">{secondsRemaining}s</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-900/40 text-xs">
              <Key className="w-3.5 h-3.5" />
              Passcode: <span className="font-mono font-bold tracking-widest">{activeQRSession.passcode}</span>
            </div>
          </div>
        </div>

        {/* Live Attendance Counter & Feed */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Live Check-ins
              </span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 tabular-nums">
              {activeQRSession.attendeesCount} Present
            </span>
          </div>

          {/* Scans list */}
          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
            {activeQRSession.recentScans.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">
                Waiting for students to scan QR code or enter passcode...
              </p>
            ) : (
              activeQRSession.recentScans.map((scan, idx) => (
                <div
                  key={`${scan.studentId}-${idx}`}
                  className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 animate-in fade-in"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">{scan.studentName}</span>
                    <span className="text-slate-400 font-mono">({scan.rollNumber})</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{scan.scannedAt}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-5">
          <button
            onClick={() => {
              stopQRSession();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            End Attendance Session
          </button>
        </div>
      </div>
    </div>
  );
};
