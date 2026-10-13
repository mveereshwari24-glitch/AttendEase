import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  AcademicClass,
  Subject,
  TimetableSlot,
  AttendanceRecord,
  LeaveRequest,
  SystemSettings,
  QRSession,
  StudentAttendanceSummary,
  AttendanceStatus,
} from '../types/attendance';
import {
  initialSettings,
  initialClasses,
  initialSubjects,
  initialUsers,
  initialTimetable,
  generateSeedAttendance,
  initialLeaveRequests,
} from '../data/mockData';

interface AttendanceContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  classes: AcademicClass[];
  subjects: Subject[];
  timetable: TimetableSlot[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  settings: SystemSettings;
  activeQRSession: QRSession | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  // Auth
  login: (email: string, role?: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  // CRUD
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  bulkImportStudents: (students: Partial<User>[]) => number;
  addClass: (cls: Omit<AcademicClass, 'id'>) => AcademicClass;
  updateClass: (cls: AcademicClass) => void;
  deleteClass: (id: string) => void;
  addSubject: (sub: Omit<Subject, 'id'>) => Subject;
  updateSubject: (sub: Subject) => void;
  deleteSubject: (id: string) => void;
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => TimetableSlot;
  updateTimetableSlot: (slot: TimetableSlot) => void;
  deleteTimetableSlot: (id: string) => void;
  // Attendance actions
  markAttendance: (records: AttendanceRecord[]) => void;
  submitSingleAttendance: (
    studentId: string,
    classId: string,
    subjectId: string,
    status: AttendanceStatus,
    date?: string
  ) => void;
  // Leaves
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => LeaveRequest;
  reviewLeaveRequest: (id: string, status: 'APPROVED' | 'REJECTED', remarks: string) => void;
  // Settings
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  resetAllData: () => void;
  // QR Code
  startQRSession: (classId: string, subjectId: string) => QRSession;
  stopQRSession: () => void;
  scanQRCode: (tokenOrPasscode: string, studentId: string) => { success: boolean; message: string; record?: AttendanceRecord };
  // Analytics Helpers
  getStudentSummary: (studentId: string) => StudentAttendanceSummary | null;
  getAllStudentSummaries: () => StudentAttendanceSummary[];
  getDefaulters: (threshold?: number) => StudentAttendanceSummary[];
  getTodayAttendanceStats: () => { total: number; present: number; absent: number; late: number; excused: number; percentage: number };
  get30DayAttendanceTrend: () => { date: string; displayDate: string; percentage: number; present: number; total: number }[];
  getClassComparison: () => { className: string; code: string; percentage: number; totalStudents: number }[];
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'attendease_v1_';

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}theme`);
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // State initialization with localStorage fallback
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [classes, setClasses] = useState<AcademicClass[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}classes`);
    return saved ? JSON.parse(saved) : initialClasses;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}subjects`);
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}timetable`);
    return saved ? JSON.parse(saved) : initialTimetable;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}attendance`);
    return saved ? JSON.parse(saved) : generateSeedAttendance();
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}leaves`);
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  // Current active logged in user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedId = localStorage.getItem(`${STORAGE_KEY_PREFIX}currentUser_id`);
    if (savedId) {
      const found = users.find((u) => u.id === savedId);
      if (found) return found;
    }
    // Default to admin user for showcase
    return users.find((u) => u.id === 'usr-admin-1') || users[0] || null;
  });

  // Active QR session
  const [activeQRSession, setActiveQRSession] = useState<QRSession | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}settings`, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}classes`, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}subjects`, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}timetable`, JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}attendance`, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}leaves`, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}currentUser_id`, currentUser.id);
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}currentUser_id`);
    }
  }, [currentUser]);

  // QR Session Token Rotation Timer
  useEffect(() => {
    if (!activeQRSession || !activeQRSession.active) return;

    const interval = setInterval(() => {
      setActiveQRSession((prev) => {
        if (!prev || !prev.active) return null;
        // Generate new 10-char token
        const newToken = 'TOKEN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        return {
          ...prev,
          token: newToken,
          expiresAt: new Date(Date.now() + 25000).toISOString(),
        };
      });
    }, 20000); // rotates every 20 seconds

    return () => clearInterval(interval);
  }, [activeQRSession?.sessionId, activeQRSession?.active]);

  // Auth methods
  const login = (email: string, role?: string): boolean => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    // If role specified and email matches generic demo, find by role
    if (role) {
      const byRole = users.find((u) => u.role === role);
      if (byRole) {
        setCurrentUser(byRole);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  // CRUD for Users
  const addUser = (userData: Omit<User, 'id'>): User => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
    };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  };

  const updateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setAttendanceRecords((prev) => prev.filter((r) => r.studentId !== id && r.teacherId !== id));
  };

  const bulkImportStudents = (newStudentsData: Partial<User>[]): number => {
    const targetClass = classes[0]?.id || 'class-cs3a';
    const created: User[] = newStudentsData.map((s, index) => ({
      id: `usr-import-${Date.now()}-${index}`,
      name: s.name || `Student ${index + 1}`,
      email: s.email || `student.${Date.now()}.${index}@attendease.edu`,
      role: 'STUDENT',
      rollNumber: s.rollNumber || `CS2025-${String(index + 100).padStart(3, '0')}`,
      classId: s.classId || targetClass,
      department: s.department || 'Computer Science & Engineering',
      phone: s.phone || '+1 (555) 000-0000',
      parentEmail: s.parentEmail,
      parentName: s.parentName,
    }));

    setUsers((prev) => [...created, ...prev]);
    return created.length;
  };

  // CRUD for Classes
  const addClass = (clsData: Omit<AcademicClass, 'id'>): AcademicClass => {
    const newClass: AcademicClass = {
      ...clsData,
      id: `class-${Date.now()}`,
    };
    setClasses((prev) => [...prev, newClass]);
    return newClass;
  };

  const updateClass = (updatedClass: AcademicClass) => {
    setClasses((prev) => prev.map((c) => (c.id === updatedClass.id ? updatedClass : c)));
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  // CRUD for Subjects
  const addSubject = (subData: Omit<Subject, 'id'>): Subject => {
    const newSub: Subject = {
      ...subData,
      id: `sub-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, newSub]);
    return newSub;
  };

  const updateSubject = (updatedSub: Subject) => {
    setSubjects((prev) => prev.map((s) => (s.id === updatedSub.id ? updatedSub : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  // CRUD for Timetable
  const addTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>): TimetableSlot => {
    const newSlot: TimetableSlot = {
      ...slotData,
      id: `slot-${Date.now()}`,
    };
    setTimetable((prev) => [...prev, newSlot]);
    return newSlot;
  };

  const updateTimetableSlot = (updatedSlot: TimetableSlot) => {
    setTimetable((prev) => prev.map((s) => (s.id === updatedSlot.id ? updatedSlot : s)));
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetable((prev) => prev.filter((s) => s.id !== id));
  };

  // Attendance Actions
  const markAttendance = (records: AttendanceRecord[]) => {
    // Merge or replace by date + subjectId + studentId
    setAttendanceRecords((prev) => {
      const lookup = new Map<string, AttendanceRecord>();
      prev.forEach((r) => lookup.set(`${r.date}_${r.subjectId}_${r.studentId}`, r));
      records.forEach((r) => lookup.set(`${r.date}_${r.subjectId}_${r.studentId}`, r));
      return Array.from(lookup.values());
    });
  };

  const submitSingleAttendance = (
    studentId: string,
    classId: string,
    subjectId: string,
    status: AttendanceStatus,
    date?: string
  ) => {
    const recordDate = date || new Date().toISOString().split('T')[0];
    const teacherId = subjects.find((s) => s.id === subjectId)?.teacherId || currentUser?.id || 'usr-teacher-1';

    const newRecord: AttendanceRecord = {
      id: `rec-${recordDate}-${subjectId}-${studentId}`,
      studentId,
      classId,
      subjectId,
      teacherId,
      date: recordDate,
      status,
      markedVia: 'MANUAL',
      timestamp: new Date().toISOString(),
    };

    setAttendanceRecords((prev) => {
      const filtered = prev.filter(
        (r) => !(r.date === recordDate && r.subjectId === subjectId && r.studentId === studentId)
      );
      return [newRecord, ...filtered];
    });
  };

  // QR Session Launch & Verification
  const startQRSession = (classId: string, subjectId: string): QRSession => {
    const sub = subjects.find((s) => s.id === subjectId);
    const teacher = users.find((u) => u.id === (sub?.teacherId || currentUser?.id));
    const randomPasscode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit passcode
    const initialToken = 'TOKEN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const session: QRSession = {
      sessionId: `qr-${Date.now()}`,
      classId,
      subjectId,
      teacherId: teacher?.id || 'usr-teacher-1',
      teacherName: teacher?.name || 'Prof. Faculty',
      subjectName: sub?.name || 'Academic Class',
      token: initialToken,
      passcode: randomPasscode,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30000).toISOString(),
      rotationIntervalSeconds: 20,
      active: true,
      attendeesCount: 0,
      recentScans: [],
    };

    setActiveQRSession(session);
    return session;
  };

  const stopQRSession = () => {
    if (activeQRSession) {
      setActiveQRSession((prev) => (prev ? { ...prev, active: false } : null));
    }
  };

  const scanQRCode = (
    tokenOrPasscode: string,
    studentId: string
  ): { success: boolean; message: string; record?: AttendanceRecord } => {
    if (!activeQRSession || !activeQRSession.active) {
      return { success: false, message: 'No active attendance session is currently accepting check-ins.' };
    }

    const cleanInput = tokenOrPasscode.trim().toUpperCase();
    const tokenMatch = cleanInput === activeQRSession.token.toUpperCase();
    const passcodeMatch = cleanInput === activeQRSession.passcode;

    if (!tokenMatch && !passcodeMatch) {
      return {
        success: false,
        message: 'Invalid or expired QR code token. Please scan the current rotating code or enter the 6-digit passcode.',
      };
    }

    // Check if student already checked in for this session
    const existing = activeQRSession.recentScans.find((s) => s.studentId === studentId);
    if (existing) {
      return { success: false, message: 'You have already checked in for this session!' };
    }

    const student = users.find((u) => u.id === studentId);
    if (!student) {
      return { success: false, message: 'Student account not found.' };
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const newRecord: AttendanceRecord = {
      id: `rec-${todayDate}-${activeQRSession.subjectId}-${studentId}`,
      studentId,
      classId: activeQRSession.classId,
      subjectId: activeQRSession.subjectId,
      teacherId: activeQRSession.teacherId,
      date: todayDate,
      status: 'PRESENT',
      markedVia: 'QR_CODE',
      timestamp: new Date().toISOString(),
      remarks: 'Verified via dynamic QR code',
    };

    // Save attendance record
    setAttendanceRecords((prev) => {
      const filtered = prev.filter(
        (r) => !(r.date === todayDate && r.subjectId === activeQRSession.subjectId && r.studentId === studentId)
      );
      return [newRecord, ...filtered];
    });

    // Update active QR session attendees
    setActiveQRSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        attendeesCount: prev.attendeesCount + 1,
        recentScans: [
          {
            studentId,
            studentName: student.name,
            rollNumber: student.rollNumber || 'CS-2025',
            scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          },
          ...prev.recentScans,
        ],
      };
    });

    return {
      success: true,
      message: `Attendance marked successfully for ${activeQRSession.subjectName}!`,
      record: newRecord,
    };
  };

  // Leaves
  const submitLeaveRequest = (reqData: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>): LeaveRequest => {
    const student = users.find((u) => u.id === reqData.studentId);
    const newReq: LeaveRequest = {
      ...reqData,
      studentName: student?.name || reqData.studentName || 'Student',
      id: `leave-${Date.now()}`,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    };

    setLeaveRequests((prev) => [newReq, ...prev]);
    return newReq;
  };

  const reviewLeaveRequest = (id: string, status: 'APPROVED' | 'REJECTED', remarks: string) => {
    const reviewerName = currentUser?.name || 'Administrator';
    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status,
              reviewedBy: reviewerName,
              reviewRemarks: remarks,
            }
          : l
      )
    );

    // If approved, automatically update corresponding student attendance records to EXCUSED
    if (status === 'APPROVED') {
      const req = leaveRequests.find((l) => l.id === id);
      if (req) {
        // Convert date range to records if existing
        setAttendanceRecords((prev) =>
          prev.map((r) => {
            if (r.studentId === req.studentId && r.date >= req.startDate && r.date <= req.endDate) {
              return {
                ...r,
                status: 'EXCUSED',
                remarks: `Approved Leave: ${req.reason}`,
                markedVia: 'LEAVE_APPROVAL',
              };
            }
            return r;
          })
        );
      }
    }
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setSettings(initialSettings);
    setUsers(initialUsers);
    setClasses(initialClasses);
    setSubjects(initialSubjects);
    setTimetable(initialTimetable);
    setAttendanceRecords(generateSeedAttendance());
    setLeaveRequests(initialLeaveRequests);
    setCurrentUser(initialUsers[0]);
    setActiveQRSession(null);
  };

  // ==========================================
  // COMPUTED ANALYTICS HELPERS
  // ==========================================

  const getStudentSummary = (studentId: string): StudentAttendanceSummary | null => {
    const student = users.find((u) => u.id === studentId);
    if (!student || student.role !== 'STUDENT') return null;

    const studentRecords = attendanceRecords.filter((r) => r.studentId === studentId);
    const totalClasses = studentRecords.length;
    const presentCount = studentRecords.filter((r) => r.status === 'PRESENT').length;
    const absentCount = studentRecords.filter((r) => r.status === 'ABSENT').length;
    const lateCount = studentRecords.filter((r) => r.status === 'LATE').length;
    const excusedCount = studentRecords.filter((r) => r.status === 'EXCUSED').length;

    // Institution policy: Late counts as present or 0.8 present. In AttendEase: Late counts as 0.75 present, Excused doesn't penalize.
    const effectivePresent = presentCount + lateCount * 0.75 + excusedCount * 1.0;
    const percentage = totalClasses > 0 ? Math.round((effectivePresent / totalClasses) * 1000) / 10 : 100;
    const isDefaulter = percentage < settings.attendanceThresholdPercent;

    // Subject breakdown
    const subjectBreakdown = subjects.map((sub) => {
      const subRecords = studentRecords.filter((r) => r.subjectId === sub.id);
      const subTotal = subRecords.length;
      const subPresent = subRecords.filter((r) => r.status === 'PRESENT').length;
      const subLate = subRecords.filter((r) => r.status === 'LATE').length;
      const subExcused = subRecords.filter((r) => r.status === 'EXCUSED').length;
      const subEffective = subPresent + subLate * 0.75 + subExcused * 1.0;
      const subPct = subTotal > 0 ? Math.round((subEffective / subTotal) * 1000) / 10 : 100;

      return {
        subjectId: sub.id,
        subjectName: sub.name,
        subjectCode: sub.code,
        total: subTotal,
        present: subPresent + subLate,
        percentage: subPct,
        isDefaulter: subPct < settings.attendanceThresholdPercent,
      };
    });

    return {
      studentId,
      name: student.name,
      rollNumber: student.rollNumber || 'N/A',
      classId: student.classId || 'class-cs3a',
      totalClasses,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      percentage,
      isDefaulter,
      subjectBreakdown,
    };
  };

  const getAllStudentSummaries = (): StudentAttendanceSummary[] => {
    const students = users.filter((u) => u.role === 'STUDENT');
    return students
      .map((s) => getStudentSummary(s.id))
      .filter((s): s is StudentAttendanceSummary => s !== null)
      .sort((a, b) => a.percentage - b.percentage); // Ascending so defaulters show on top
  };

  const getDefaulters = (threshold?: number): StudentAttendanceSummary[] => {
    const cutoff = threshold ?? settings.attendanceThresholdPercent;
    return getAllStudentSummaries().filter((s) => s.percentage < cutoff);
  };

  const getTodayAttendanceStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendanceRecords.filter((r) => r.date === today);

    // If no records today yet, use latest recorded date
    let recordsToUse = todayRecords;
    if (recordsToUse.length === 0) {
      // Find latest date in records
      const dates = Array.from(new Set(attendanceRecords.map((r) => r.date))).sort().reverse();
      const latestDate = dates[0];
      recordsToUse = attendanceRecords.filter((r) => r.date === latestDate);
    }

    const total = recordsToUse.length;
    const present = recordsToUse.filter((r) => r.status === 'PRESENT').length;
    const absent = recordsToUse.filter((r) => r.status === 'ABSENT').length;
    const late = recordsToUse.filter((r) => r.status === 'LATE').length;
    const excused = recordsToUse.filter((r) => r.status === 'EXCUSED').length;

    const percentage = total > 0 ? Math.round(((present + late * 0.75 + excused) / total) * 1000) / 10 : 88.5;

    return {
      total: total || 45,
      present: present || 38,
      absent: absent || 4,
      late: late || 2,
      excused: excused || 1,
      percentage,
    };
  };

  const get30DayAttendanceTrend = () => {
    const dates = Array.from(new Set(attendanceRecords.map((r) => r.date)))
      .sort()
      .slice(-30);

    return dates.map((d) => {
      const dayRecs = attendanceRecords.filter((r) => r.date === d);
      const total = dayRecs.length;
      const present = dayRecs.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
      const pct = total > 0 ? Math.round((present / total) * 100) : 85;
      const dt = new Date(d);
      const displayDate = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      return {
        date: d,
        displayDate,
        percentage: pct,
        present,
        total,
      };
    });
  };

  const getClassComparison = () => {
    return classes.map((cls) => {
      const clsRecords = attendanceRecords.filter((r) => r.classId === cls.id);
      const total = clsRecords.length;
      const present = clsRecords.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
      const pct = total > 0 ? Math.round((present / total) * 100) : Math.floor(78 + Math.random() * 14);

      return {
        className: cls.name,
        code: cls.code,
        percentage: pct,
        totalStudents: cls.totalStudents,
      };
    });
  };

  return (
    <AttendanceContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        classes,
        subjects,
        timetable,
        attendanceRecords,
        leaveRequests,
        settings,
        activeQRSession,
        theme,
        toggleTheme,
        login,
        logout,
        switchUser,
        addUser,
        updateUser,
        deleteUser,
        bulkImportStudents,
        addClass,
        updateClass,
        deleteClass,
        addSubject,
        updateSubject,
        deleteSubject,
        addTimetableSlot,
        updateTimetableSlot,
        deleteTimetableSlot,
        markAttendance,
        submitSingleAttendance,
        submitLeaveRequest,
        reviewLeaveRequest,
        updateSettings,
        resetAllData,
        startQRSession,
        stopQRSession,
        scanQRCode,
        getStudentSummary,
        getAllStudentSummaries,
        getDefaulters,
        getTodayAttendanceStats,
        get30DayAttendanceTrend,
        getClassComparison,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
