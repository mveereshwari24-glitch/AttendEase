import React, { useState, useEffect } from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { QRCodeModal } from './components/QRCodeModal';
import { QRScannerModal } from './components/QRScannerModal';
import { ExportModal } from './components/ExportModal';

// Pages
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentsPage } from './pages/StudentsPage';
import { TeachersPage } from './pages/TeachersPage';
import { ClassesSubjectsPage } from './pages/ClassesSubjectsPage';
import { TimetablePage } from './pages/TimetablePage';
import { AttendanceMarkingPage } from './pages/AttendanceMarkingPage';
import { StudentPortalPage } from './pages/StudentPortalPage';
import { ParentPortalPage } from './pages/ParentPortalPage';
import { LeaveManagementPage } from './pages/LeaveManagementPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppContent: React.FC = () => {
  const { currentUser, classes, subjects, startQRSession } = useAttendance();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global Modals
  const [isQRGeneratorOpen, setIsQRGeneratorOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Synchronize initial tab when switching user role
  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === 'STUDENT') {
      setCurrentTab('student-portal');
    } else if (currentUser.role === 'PARENT') {
      setCurrentTab('parent-portal');
    } else {
      setCurrentTab('dashboard');
    }
  }, [currentUser?.role, currentUser?.id]);

  // If user is not authenticated, render Login split layout
  if (!currentUser) {
    return <Login onLoginSuccess={() => setCurrentTab('dashboard')} />;
  }

  // Handle Launch QR Session from anywhere
  const handleOpenQRGenerator = () => {
    // Start session with first available class and subject if not already started
    const defaultClass = classes[0]?.id || 'class-cs3a';
    const defaultSubject = subjects[0]?.id || 'sub-cs301';
    startQRSession(defaultClass, defaultSubject);
    setIsQRGeneratorOpen(true);
  };

  // Role permissions guard
  const renderCurrentView = () => {
    const role = currentUser.role;

    // Student specific restrictions
    if (role === 'STUDENT') {
      if (['settings', 'teachers', 'classes', 'attendance'].includes(currentTab)) {
        return <ForbiddenPage onGoHome={() => setCurrentTab('student-portal')} />;
      }
    }

    // Parent specific restrictions
    if (role === 'PARENT') {
      if (['settings', 'teachers', 'classes', 'attendance', 'students'].includes(currentTab)) {
        return <ForbiddenPage onGoHome={() => setCurrentTab('parent-portal')} />;
      }
    }

    switch (currentTab) {
      case 'dashboard':
        return (
          <AdminDashboard
            onOpenQRGenerator={handleOpenQRGenerator}
            onOpenExport={() => setIsExportModalOpen(true)}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
          />
        );
      case 'students':
        return <StudentsPage />;
      case 'teachers':
        return <TeachersPage />;
      case 'classes':
        return <ClassesSubjectsPage />;
      case 'timetable':
        return <TimetablePage />;
      case 'attendance':
        return <AttendanceMarkingPage onOpenQRGenerator={handleOpenQRGenerator} />;
      case 'student-portal':
        return (
          <StudentPortalPage
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
            onNavigateToLeaves={() => setCurrentTab('leaves')}
          />
        );
      case 'parent-portal':
        return <ParentPortalPage />;
      case 'leaves':
        return <LeaveManagementPage />;
      case 'reports':
        return <ReportsPage onOpenExport={() => setIsExportModalOpen(true)} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <NotFoundPage onGoHome={() => setCurrentTab('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* Desktop Fixed Sidebar & Mobile Drawer */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Layout Wrap (with margin offset for desktop sidebar) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 pb-20 lg:pb-8 ${
          isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          onOpenQRGenerator={handleOpenQRGenerator}
          onOpenQRScanner={() => setIsQRScannerOpen(true)}
          onOpenExport={() => setIsExportModalOpen(true)}
          onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Viewport Content Container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (64px) */}
      <MobileNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
      />

      {/* Global Interactive Modals */}
      <QRCodeModal
        isOpen={isQRGeneratorOpen}
        onClose={() => setIsQRGeneratorOpen(false)}
      />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AttendanceProvider>
      <AppContent />
    </AttendanceProvider>
  );
}
