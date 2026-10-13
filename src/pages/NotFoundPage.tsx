import React from 'react';
import { Logo } from '../components/Logo';
import { Compass, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
        <Compass className="w-8 h-8" />
      </div>

      <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
        404 ERROR
      </span>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
        Page or Resource Not Found
      </h1>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2">
        The classroom schedule, student record, or audit report you are searching for does not exist or has been relocated.
      </p>

      <button
        onClick={onGoHome}
        className="mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};
