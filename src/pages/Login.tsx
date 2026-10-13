import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Logo } from '../components/Logo';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  GraduationCap,
  User,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { login, users, switchUser } = useAttendance();
  const [email, setEmail] = useState('admin@attendease.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Quick Demo credentials
  const demoAccounts = [
    {
      role: 'ADMIN',
      title: 'Administrator',
      name: 'Dr. Eleanor Vance',
      email: 'admin@attendease.edu',
      id: 'usr-admin-1',
      icon: Shield,
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    },
    {
      role: 'TEACHER',
      title: 'Faculty / Teacher',
      name: 'Prof. Marcus Chen',
      email: 'marcus.chen@attendease.edu',
      id: 'usr-teacher-1',
      icon: GraduationCap,
      badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    },
    {
      role: 'STUDENT',
      title: 'Student',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@student.attendease.edu',
      id: 'usr-student-sarah',
      icon: User,
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      role: 'PARENT',
      title: 'Parent (Read-only)',
      name: 'Robert Jenkins',
      email: 'robert.jenkins@gmail.com',
      id: 'usr-parent-robert',
      icon: Users,
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(email);
    if (success) {
      onLoginSuccess();
    } else {
      setError('Invalid credentials. Select one of the quick demo accounts below.');
    }
  };

  const handleQuickLogin = (userId: string) => {
    switchUser(userId);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Left Column: Brand Hero & Campus Illustration (Desktop only, 50-55% width) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden flex-col justify-between p-12 text-white">
        {/* Campus Background Image with Contrast Scrim */}
        <img
          src="/src/assets/images/login_campus_illustration_1791881348468.jpg"
          alt="University campus students"
          className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-90 contrast-105"
        />
        {/* Soft gradient overlay matching brand #4F46E5 & #0EA5E9 */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-indigo-950/70" />

        {/* Top Brand Logo */}
        <div className="relative z-10">
          <Logo variant="full" theme="dark" showTagline={true} />
        </div>

        {/* Central Value Proposition */}
        <div className="relative z-10 max-w-lg my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Next-Generation Institutional Attendance</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Effortless verification. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-indigo-200">
              Zero proxies. Complete clarity.
            </span>
          </h1>

          <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-md">
            Empower faculty with dynamic rotating QR sessions, keep students on track with instant safe-bunk analytics, and streamline compliance audits with single-click reports.
          </p>

          {/* Value Bullet Points */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Rotating cryptographically verified QR codes every 20 seconds</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Automated 75% attendance threshold monitoring & defaulter alerts</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Integrated leave request lifecycle with auto-excused hours</span>
            </div>
          </div>
        </div>

        {/* Bottom Trust Stamp */}
        <div className="relative z-10 pt-6 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Stanford Institute of Technology & Science</span>
          <span className="font-mono">v2.4 LTS · 2025-2026</span>
        </div>
      </div>

      {/* Right Column: 400px Wide Form Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile Brand Header */}
          <div className="lg:hidden text-center mb-8">
            <Logo variant="login" showTagline={true} />
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select a demo role or enter your institutional credentials
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@attendease.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 shadow-xs transition-shadow"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 shadow-xs transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">Remember me for 7 days</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <span className="block text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Fast Demo Switcher
            </span>

            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => handleQuickLogin(account.id)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-indigo-50/50 dark:hover:bg-slate-850 hover:border-indigo-300 dark:hover:border-indigo-700 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {account.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {account.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Reset Your Password
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your institutional email and we will send you a secure password reset link.
            </p>

            {resetEmailSent ? (
              <div className="my-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                Password reset link sent to <span className="font-semibold">{email}</span>.
              </div>
            ) : (
              <div className="my-4">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmailSent(false);
                }}
                className="px-3 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
              {!resetEmailSent && (
                <button
                  type="button"
                  onClick={() => setResetEmailSent(true)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
