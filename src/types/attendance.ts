export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  // Student specific
  rollNumber?: string;
  classId?: string;
  parentEmail?: string;
  parentName?: string;
  // Teacher specific
  assignedSubjects?: string[]; // subjectIds
  assignedClasses?: string[]; // classIds
}

export interface AcademicClass {
  id: string;
  name: string; // e.g. "CS - Year 3 (Section A)"
  code: string; // e.g. "CS3-A"
  department: string;
  semester: number;
  totalStudents: number;
}

export interface Subject {
  id: string;
  code: string; // e.g. "CS301"
  name: string; // e.g. "Data Structures & Algorithms"
  classId: string;
  teacherId: string;
  totalClassesHeld: number;
  credits: number;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number; // 1 to 6
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  classId: string;
  subjectId: string;
  teacherId: string;
  room: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  date: string; // YYYY-MM-DD
  period?: number;
  status: AttendanceStatus;
  remarks?: string;
  markedVia?: 'MANUAL' | 'QR_CODE' | 'LEAVE_APPROVAL';
  timestamp: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: 'Medical' | 'Academic' | 'Personal' | 'Other';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewRemarks?: string;
  submittedAt: string;
}

export interface QRSession {
  sessionId: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  teacherName: string;
  subjectName: string;
  token: string;
  passcode: string; // 6 digit manual fallback
  createdAt: string;
  expiresAt: string; // ISO date
  rotationIntervalSeconds: number; // 20s
  active: boolean;
  attendeesCount: number;
  recentScans: {
    studentId: string;
    studentName: string;
    rollNumber: string;
    scannedAt: string;
  }[];
}

export interface SystemSettings {
  institutionName: string;
  academicYear: string;
  currentSemester: string;
  attendanceThresholdPercent: number; // default 75
  lateGracePeriodMinutes: number; // default 15
  enableParentPortal: boolean;
  enableDynamicQR: boolean;
  allowGeofencing: boolean;
  emailAlertsEnabled: boolean;
}

export interface StudentAttendanceSummary {
  studentId: string;
  name: string;
  rollNumber: string;
  classId: string;
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  percentage: number;
  isDefaulter: boolean;
  subjectBreakdown: {
    subjectId: string;
    subjectName: string;
    subjectCode: string;
    total: number;
    present: number;
    percentage: number;
    isDefaulter: boolean;
  }[];
}
