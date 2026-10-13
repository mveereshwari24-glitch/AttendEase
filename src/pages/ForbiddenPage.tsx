import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ForbiddenPageProps {
  onGoHome: () => void;
}

export const ForbiddenPage: React.FC<ForbiddenPageProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <span className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400">
        403 ACCESS DENIED
      </span>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
        Restricted Institutional Area
      </h1>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2">
        Your current role does not possess administrative privileges to inspect or alter this module. Contact the registrar if you require elevated clearance.
      </p>

      <button
        onClick={onGoHome}
        className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Permitted View</span>
      </button>
    </div>
  );
};
