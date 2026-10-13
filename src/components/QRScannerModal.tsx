import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useAttendance } from '../context/AttendanceContext';
import { X, Camera, CheckCircle, AlertCircle, Sparkles, KeyRound, ShieldAlert } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, activeQRSession, scanQRCode } = useAttendance();
  const [passcode, setPasscode] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setFeedbackMessage('');
      setPasscode('');
    }
  }, [isOpen]);

  // Attempt real camera stream if available
  useEffect(() => {
    if (!isOpen || !isUsingCamera) return;

    let stream: MediaStream | null = null;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch((err) => {
        console.warn('Camera stream unavailable, switching to simulated scanner', err);
        setIsUsingCamera(false);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, isUsingCamera]);

  const fireCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#0EA5E9', '#16A34A', '#F59E0B'],
      });
    } catch (e) {
      // fallback
    }
  };

  const handleManualSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentUser) return;

    const result = scanQRCode(passcode, currentUser.id);
    if (result.success) {
      setStatus('success');
      setFeedbackMessage(result.message);
      fireCelebration();
    } else {
      setStatus('error');
      setFeedbackMessage(result.message);
    }
  };

  const handleSimulateScan = () => {
    if (!currentUser) return;
    setStatus('scanning');

    setTimeout(() => {
      if (!activeQRSession || !activeQRSession.active) {
        setStatus('error');
        setFeedbackMessage('No live attendance session is active right now. Ask your professor to launch a QR session.');
        return;
      }

      // Simulate capturing the active token
      const result = scanQRCode(activeQRSession.token, currentUser.id);
      if (result.success) {
        setStatus('success');
        setFeedbackMessage(result.message);
        fireCelebration();
      } else {
        setStatus('error');
        setFeedbackMessage(result.message);
      }
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2">
            <Camera className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Mark Your Attendance
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Scan the projection screen in class or enter the 6-digit passcode
          </p>
        </div>

        {/* Success State */}
        {status === 'success' ? (
          <div className="py-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Verified & Present!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xs mx-auto">
              {feedbackMessage}
            </p>
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
              Recorded for <span className="font-semibold">{currentUser?.name}</span> ({currentUser?.rollNumber})
            </div>
            <button
              onClick={onClose}
              className="mt-5 w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Camera Viewfinder / Simulation Box */}
            <div className="relative aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden bg-slate-900 border-2 border-indigo-500/40 flex items-center justify-center shadow-lg mb-4">
              {isUsingCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4 text-center bg-radial from-slate-800 to-slate-950">
                  {/* Viewfinder Target Reticle */}
                  <div className="w-44 h-44 border-2 border-dashed border-indigo-400/70 rounded-xl relative flex items-center justify-center">
                    {/* Animated scanning laser line */}
                    <div className="absolute left-2 right-2 h-0.5 bg-indigo-400 shadow-[0_0_12px_#818cf8] animate-pulse" />
                    <Camera className="w-8 h-8 text-indigo-300/40" />
                  </div>
                  <span className="text-[11px] text-slate-300 mt-3 font-medium">
                    Align QR code within frame
                  </span>
                </div>
              )}

              {/* Corner framing indicators */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-indigo-400" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-indigo-400" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-indigo-400" />
            </div>

            {/* Error banner if any */}
            {status === 'error' && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{feedbackMessage}</span>
              </div>
            )}

            {/* Quick action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSimulateScan}
                disabled={status === 'scanning'}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {status === 'scanning' ? 'Verifying Token...' : 'Scan Active Session Code'}
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                <span className="shrink-0 px-2 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Or enter 6-digit passcode
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              </div>

              {/* Manual Passcode Form */}
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="e.g. 542891"
                    maxLength={6}
                    className="w-full pl-9 pr-3 py-2 text-sm font-mono tracking-widest text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={passcode.length < 6}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                  Verify
                </button>
              </form>

              {activeQRSession?.active && (
                <div className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                  Active subject: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{activeQRSession.subjectName}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
