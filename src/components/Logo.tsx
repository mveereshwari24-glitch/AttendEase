import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'navbar' | 'sidebar-collapsed' | 'login' | 'email' | 'report';
  theme?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
  className?: string;
  size?: number; // For custom icon size
}

/**
 * AttendEase Brand Logo Component
 * Concept: Rounded-square badge containing a check-mark merged with a graduation mortarboard cap.
 * Colors: Primary #4F46E5 (Indigo), Secondary #0EA5E9 (Sky Blue), Check #16A34A / #FFFFFF
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  theme = 'auto',
  showTagline = false,
  className = '',
  size,
}) => {
  // SVG Icon badge of AttendEase (Graduation Cap + Check Mark inside rounded badge)
  const renderIcon = (iconSize: number) => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200"
    >
      <defs>
        <linearGradient id="attendEaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
        <linearGradient id="checkGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>

      {/* Rounded-square badge with soft shadow */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill="url(#attendEaseGrad)"
      />

      {/* Graduation Cap (Mortarboard diamond) */}
      <path
        d="M32 14L13 24L32 34L51 24L32 14Z"
        fill="#EEF2FF"
      />
      {/* Cap Skull Base */}
      <path
        d="M20 29.5V40C20 44 25.4 47 32 47C38.6 47 44 44 44 40V29.5"
        stroke="#E0E7FF"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Tassel line & bob */}
      <path
        d="M47 26.5V36.5"
        stroke="#FCD34D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="47" cy="38" r="2" fill="#F59E0B" />

      {/* Dynamic Integrated Check-Mark (Verification & Attendance present symbol) */}
      <path
        d="M26 34L31 39L43 27"
        stroke="url(#checkGlow)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Text color classes based on theme
  const getWordmarkClasses = () => {
    if (theme === 'dark') return 'text-white';
    if (theme === 'light') return 'text-slate-900';
    return 'text-slate-900 dark:text-white';
  };

  const getTaglineClasses = () => {
    if (theme === 'dark') return 'text-slate-300';
    if (theme === 'light') return 'text-slate-500';
    return 'text-slate-500 dark:text-slate-400';
  };

  // 1. Icon Only
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center p-1 ${className}`}>
        {renderIcon(size || 48)}
      </div>
    );
  }

  // 2. Collapsed Sidebar Icon (32x32)
  if (variant === 'sidebar-collapsed') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} title="AttendEase">
        {renderIcon(32)}
      </div>
    );
  }

  // 3. Navbar / Sidebar Logo (Height 36px, icon 36x36 + wordmark)
  if (variant === 'navbar') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {renderIcon(36)}
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className={`text-lg font-bold tracking-tight ${getWordmarkClasses()}`}>
              Attend<span className="text-indigo-600 dark:text-indigo-400">Ease</span>
            </span>
          </div>
          {showTagline && (
            <span className={`text-[10px] font-medium leading-none ${getTaglineClasses()}`}>
              Attendance made effortless
            </span>
          )}
        </div>
      </div>
    );
  }

  // 4. Login Page Logo (72x72 icon centered above wordmark)
  if (variant === 'login') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="mb-4 drop-shadow-md">
          {renderIcon(72)}
        </div>
        <h1 className={`text-2xl font-extrabold tracking-tight ${getWordmarkClasses()}`}>
          Attend<span className="text-indigo-600 dark:text-indigo-400">Ease</span>
        </h1>
        <p className={`mt-1 text-xs font-medium ${getTaglineClasses()}`}>
          Attendance made effortless.
        </p>
      </div>
    );
  }

  // 5. Email Header Logo (160 x 40 px)
  if (variant === 'email') {
    return (
      <div className={`flex items-center gap-2.5 h-[40px] ${className}`}>
        {renderIcon(32)}
        <span className={`text-base font-bold tracking-tight ${getWordmarkClasses()}`}>
          Attend<span className="text-indigo-600 dark:text-indigo-400">Ease</span>
        </span>
      </div>
    );
  }

  // 6. Report Header Logo (PDF/Excel - 120 x 32 px)
  if (variant === 'report') {
    return (
      <div className={`flex items-center gap-2 h-[32px] ${className}`}>
        {renderIcon(26)}
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-slate-900 leading-none">
            Attend<span className="text-indigo-600">Ease</span>
          </span>
          <span className="text-[9px] text-slate-500 font-medium">
            Institutional Report
          </span>
        </div>
      </div>
    );
  }

  // 7. Full Logo (Default: 240 x 64 px equivalent ratio)
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {renderIcon(size || 44)}
      <div className="flex flex-col">
        <span className={`text-xl font-extrabold tracking-tight ${getWordmarkClasses()}`}>
          Attend<span className="text-indigo-600 dark:text-indigo-400">Ease</span>
        </span>
        {showTagline && (
          <span className={`text-xs font-medium tracking-normal ${getTaglineClasses()}`}>
            Attendance made effortless.
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
