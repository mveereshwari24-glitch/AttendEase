import {
  User,
  AcademicClass,
  Subject,
  TimetableSlot,
  AttendanceRecord,
  LeaveRequest,
  SystemSettings,
} from '../types/attendance';

export const initialSettings: SystemSettings = {
  institutionName: 'Stanford Institute of Technology & Science',
  academicYear: '2025-2026',
  currentSemester: 'Fall Semester 2025',
  attendanceThresholdPercent: 75,
  lateGracePeriodMinutes: 15,
  enableParentPortal: true,
  enableDynamicQR: true,
  allowGeofencing: true,
  emailAlertsEnabled: true,
};

export const initialClasses: AcademicClass[] = [
  {
    id: 'class-cs3a',
    name: 'B.Tech Computer Science - Year 3 (Sec A)',
    code: 'CS3-A',
    department: 'Computer Science & Engineering',
    semester: 5,
    totalStudents: 15,
  },
  {
    id: 'class-cs3b',
    name: 'B.Tech Computer Science - Year 3 (Sec B)',
    code: 'CS3-B',
    department: 'Computer Science & Engineering',
    semester: 5,
    totalStudents: 12,
  },
  {
    id: 'class-it2a',
    name: 'B.Tech Information Technology - Year 2',
    code: 'IT2-A',
    department: 'Information Technology',
    semester: 3,
    totalStudents: 14,
  },
  {
    id: 'class-se4a',
    name: 'B.Tech Software Engineering - Year 4',
    code: 'SE4-A',
    department: 'Software Engineering',
    semester: 7,
    totalStudents: 10,
  },
];

export const initialSubjects: Subject[] = [
  {
    id: 'sub-cs301',
    code: 'CS301',
    name: 'Data Structures & Algorithms',
    classId: 'class-cs3a',
    teacherId: 'usr-teacher-1',
    totalClassesHeld: 32,
    credits: 4,
  },
  {
    id: 'sub-cs302',
    code: 'CS302',
    name: 'Operating Systems & Kernels',
    classId: 'class-cs3a',
    teacherId: 'usr-teacher-1',
    totalClassesHeld: 28,
    credits: 4,
  },
  {
    id: 'sub-cs303',
    code: 'CS303',
    name: 'Database Management Systems',
    classId: 'class-cs3a',
    teacherId: 'usr-teacher-2',
    totalClassesHeld: 30,
    credits: 3,
  },
  {
    id: 'sub-cs304',
    code: 'CS304',
    name: 'Computer Networks & Protocols',
    classId: 'class-cs3a',
    teacherId: 'usr-teacher-2',
    totalClassesHeld: 26,
    credits: 3,
  },
  {
    id: 'sub-cs305',
    code: 'CS305',
    name: 'Artificial Intelligence & Neural Networks',
    classId: 'class-cs3a',
    teacherId: 'usr-teacher-3',
    totalClassesHeld: 24,
    credits: 4,
  },
];

export const initialUsers: User[] = [
  // Admin
  {
    id: 'usr-admin-1',
    name: 'Dr. Eleanor Vance',
    email: 'admin@attendease.edu',
    role: 'ADMIN',
    avatar: '/src/assets/images/avatar_admin_headshot_1791881351325.jpg',
    phone: '+1 (555) 234-8901',
    department: 'Academic Affairs & Administration',
  },
  // Teachers
  {
    id: 'usr-teacher-1',
    name: 'Prof. Marcus Chen',
    email: 'marcus.chen@attendease.edu',
    role: 'TEACHER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (555) 345-6789',
    department: 'Computer Science & Engineering',
    assignedSubjects: ['sub-cs301', 'sub-cs302'],
    assignedClasses: ['class-cs3a', 'class-cs3b'],
  },
  {
    id: 'usr-teacher-2',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@attendease.edu',
    role: 'TEACHER',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (555) 456-7890',
    department: 'Computer Science & Engineering',
    assignedSubjects: ['sub-cs303', 'sub-cs304'],
    assignedClasses: ['class-cs3a'],
  },
  {
    id: 'usr-teacher-3',
    name: 'Prof. David Miller',
    email: 'david.miller@attendease.edu',
    role: 'TEACHER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (555) 567-8901',
    department: 'Artificial Intelligence Lab',
    assignedSubjects: ['sub-cs305'],
    assignedClasses: ['class-cs3a'],
  },
  // Primary Student
  {
    id: 'usr-student-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@student.attendease.edu',
    role: 'STUDENT',
    avatar: '/src/assets/images/avatar_student_sarah_1791881349550.jpg',
    phone: '+1 (555) 890-1234',
    department: 'Computer Science & Engineering',
    rollNumber: 'CS2024-042',
    classId: 'class-cs3a',
    parentEmail: 'robert.jenkins@gmail.com',
    parentName: 'Robert Jenkins',
  },
  // Parent
  {
    id: 'usr-parent-robert',
    name: 'Robert Jenkins',
    email: 'robert.jenkins@gmail.com',
    role: 'PARENT',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (555) 890-5555',
  },
  // Additional Students in class CS3-A
  {
    id: 'usr-student-2',
    name: 'Alex Turner',
    email: 'alex.turner@student.attendease.edu',
    role: 'STUDENT',
    rollNumber: 'CS2024-009',
    classId: 'class-cs3a',
    department: 'Computer Science & Engineering',
    parentEmail: 'm.turner@gmail.com',
    parentName: 'Michael Turner',
  },
  {
    id: 'usr-student-3',
    name: 'Maya Patel',
    email: 'maya.patel@student.attendease.edu',
    role: 'STUDENT',
    rollNumber: 'CS2024-031',
    classId: 'class-cs3a',
    department: 'Computer Science & Engineering',
    parentEmail: 's.patel@gmail.com',
    parentName: 'Sanjay Patel',
  },
  {
    id: 'usr-student-4',
    name: 'Jordan Reed',
    email: 'jordan.reed@student.attendease.edu',
    role: 'STUDENT',
    rollNumber: 'CS2024-018',
    classId: 'class-cs3a',
    department: 'Computer Science & Engineering',
    parentEmail: 'k.reed@gmail.com',
    parentName: 'Karen Reed',
  },
  {
    id: 'usr-student-5',
    name: 'Liam Davis',
    email: 'liam.davis@student.attendease.edu',
    role: 'STUDENT',
    rollNumber: 'CS2024-015',
    classId: 'class-cs3a',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'usr-student-6',
    name: 'Emma Wilson',
    email: 'emma.wilson@student.attendease.edu',
    role: 'STUDENT',
    rollNumber: 'CS2024-023',
    classId: 'class-cs3a',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'usr-student-7',
    name: 'Chloe Bennett',
    email: 'chloe.bennett@student.attendease.edu',
    role: 'STUDENT',
    rollNumber: 'CS2024-004',
    classId: 'class-cs3a',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'usr-student-8',
    name: 'Ethan Hunt',
    email: 'ethan.hunt@student.attendease.edu',
    role: 'STUDENT',
    rollNumber: 'CS2024-027',
    classId: 'class-cs3a',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'usr-student-9',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@student.attendease.edu',
    role: 'STUDENT',
    rollNumber: 'CS2024-039',
    classId: 'class-cs3a',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'usr-student-10',
    name: 'Lucas Wright',
    email: 'lucas.wright@student.attendease.edu',
    role: 'STUDENT',
    rollNumber: 'CS2024-012',
    classId: 'class-cs3a',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'usr-student-11',
    name: 'Olivia Taylor',
    email: 'olivia.taylor@student.attendease.edu',
    role: 'STUDENT',
    rollNumber: 'CS2024-055',
    classId: 'class-cs3a',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'usr-student-12',
    name: 'Daniel Brooks',
    email: 'daniel.brooks@student.attendease.edu',
    role: 'STUDENT',
    rollNumber: 'CS2024-061',
    classId: 'class-cs3a',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'usr-student-13',
    name: 'Ava Robinson',
    email: 'ava.robinson@student.attendease.edu',
    role: 'STUDENT',
    rollNumber: 'CS2024-048',
    classId: 'class-cs3a',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'usr-student-14',
    name: 'Noah Green',
    email: 'noah.green@student.attendease.edu',
    role: 'STUDENT',
    rollNumber: 'CS2024-034',
    classId: 'class-cs3a',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'usr-student-15',
    name: 'Isabella King',
    email: 'isabella.king@student.attendease.edu',
    role: 'STUDENT',
    rollNumber: 'CS2024-021',
    classId: 'class-cs3a',
    department: 'Computer Science & Engineering',
  },
];

export const initialTimetable: TimetableSlot[] = [
  // Monday
  {
    id: 'slot-mon-1',
    day: 'Monday',
    period: 1,
    startTime: '09:00',
    endTime: '10:00',
    classId: 'class-cs3a',
    subjectId: 'sub-cs301',
    teacherId: 'usr-teacher-1',
    room: 'Hall 302',
  },
  {
    id: 'slot-mon-2',
    day: 'Monday',
    period: 2,
    startTime: '10:00',
    endTime: '11:00',
    classId: 'class-cs3a',
    subjectId: 'sub-cs302',
    teacherId: 'usr-teacher-1',
    room: 'System Lab 2',
  },
  {
    id: 'slot-mon-3',
    day: 'Monday',
    period: 3,
    startTime: '11:15',
    endTime: '12:15',
    classId: 'class-cs3a',
    subjectId: 'sub-cs303',
    teacherId: 'usr-teacher-2',
    room: 'Hall 204',
  },
  {
    id: 'slot-mon-4',
    day: 'Monday',
    period: 4,
    startTime: '13:00',
    endTime: '14:00',
    classId: 'class-cs3a',
    subjectId: 'sub-cs304',
    teacherId: 'usr-teacher-2',
    room: 'Hall 204',
  },
  // Tuesday
  {
    id: 'slot-tue-1',
    day: 'Tuesday',
    period: 1,
    startTime: '09:00',
    endTime: '10:00',
    classId: 'class-cs3a',
    subjectId: 'sub-cs305',
    teacherId: 'usr-teacher-3',
    room: 'AI Research Wing B',
  },
  {
    id: 'slot-tue-2',
    day: 'Tuesday',
    period: 2,
    startTime: '10:00',
    endTime: '11:00',
    classId: 'class-cs3a',
    subjectId: 'sub-cs301',
    teacherId: 'usr-teacher-1',
    room: 'Hall 302',
  },
  {
    id: 'slot-tue-3',
    day: 'Tuesday',
    period: 3,
    startTime: '11:15',
    endTime: '12:15',
    classId: 'class-cs3a',
    subjectId: 'sub-cs302',
    teacherId: 'usr-teacher-1',
    room: 'System Lab 2',
  },
  // Wednesday
  {
    id: 'slot-wed-1',
    day: 'Wednesday',
    period: 1,
    startTime: '09:00',
    endTime: '10:00',
    classId: 'class-cs3a',
    subjectId: 'sub-cs303',
    teacherId: 'usr-teacher-2',
    room: 'Hall 204',
  },
  {
    id: 'slot-wed-2',
    day: 'Wednesday',
    period: 2,
    startTime: '10:00',
    endTime: '11:00',
    classId: 'class-cs3a',
    subjectId: 'sub-cs304',
    teacherId: 'usr-teacher-2',
    room: 'Network Lab 1',
  },
  {
    id: 'slot-wed-3',
    day: 'Wednesday',
    period: 3,
    startTime: '11:15',
    endTime: '12:15',
    classId: 'class-cs3a',
    subjectId: 'sub-cs305',
    teacherId: 'usr-teacher-3',
    room: 'AI Research Wing B',
  },
  // Thursday
  {
    id: 'slot-thu-1',
    day: 'Thursday',
    period: 1,
    startTime: '09:00',
    endTime: '10:00',
    classId: 'class-cs3a',
    subjectId: 'sub-cs301',
    teacherId: 'usr-teacher-1',
    room: 'Hall 302',
  },
  {
    id: 'slot-thu-2',
    day: 'Thursday',
    period: 2,
    startTime: '10:00',
    endTime: '11:00',
    classId: 'class-cs3a',
    subjectId: 'sub-cs302',
    teacherId: 'usr-teacher-1',
    room: 'System Lab 2',
  },
  // Friday
  {
    id: 'slot-fri-1',
    day: 'Friday',
    period: 1,
    startTime: '09:00',
    endTime: '10:00',
    classId: 'class-cs3a',
    subjectId: 'sub-cs303',
    teacherId: 'usr-teacher-2',
    room: 'Hall 204',
  },
  {
    id: 'slot-fri-2',
    day: 'Friday',
    period: 2,
    startTime: '10:00',
    endTime: '11:00',
    classId: 'class-cs3a',
    subjectId: 'sub-cs305',
    teacherId: 'usr-teacher-3',
    room: 'AI Research Wing B',
  },
  // Saturday
  {
    id: 'slot-sat-1',
    day: 'Saturday',
    period: 1,
    startTime: '09:30',
    endTime: '11:30',
    classId: 'class-cs3a',
    subjectId: 'sub-cs301',
    teacherId: 'usr-teacher-1',
    room: 'Project Center 4',
  },
];

// Helper to generate seed attendance records for 30 historical days
export const generateSeedAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const studentIds = initialUsers.filter((u) => u.role === 'STUDENT').map((u) => u.id);
  const subjects = initialSubjects;
  const now = new Date();

  // Create attendance for past 30 days
  for (let d = 29; d >= 0; d--) {
    const curDate = new Date();
    curDate.setDate(now.getDate() - d);
    // Skip Sundays
    if (curDate.getDay() === 0) continue;

    const dateStr = curDate.toISOString().split('T')[0];

    subjects.forEach((subj) => {
      // Pick 2 subjects per day randomly based on day number
      if ((d + subj.code.charCodeAt(2)) % 2 !== 0) return;

      studentIds.forEach((studentId) => {
        let status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' = 'PRESENT';

        // Custom profiles for specific students
        if (studentId === 'usr-student-sarah') {
          // Sarah is high attendance (~88%)
          const rand = (d * 7 + 3) % 100;
          if (rand < 84) status = 'PRESENT';
          else if (rand < 92) status = 'LATE';
          else status = 'ABSENT';
        } else if (studentId === 'usr-student-2') {
          // Alex Turner is a chronic defaulter (~64%)
          const rand = (d * 13 + 5) % 100;
          if (rand < 62) status = 'PRESENT';
          else if (rand < 70) status = 'LATE';
          else status = 'ABSENT';
        } else if (studentId === 'usr-student-3') {
          // Maya Patel defaulter (~71%)
          const rand = (d * 11 + 2) % 100;
          if (rand < 70) status = 'PRESENT';
          else if (rand < 75) status = 'EXCUSED';
          else status = 'ABSENT';
        } else if (studentId === 'usr-student-4') {
          // Jordan Reed severe defaulter (~58%)
          const rand = (d * 17 + 8) % 100;
          if (rand < 55) status = 'PRESENT';
          else if (rand < 65) status = 'LATE';
          else status = 'ABSENT';
        } else {
          // Normal distribution (80-92% present)
          const seed = (d * 19 + studentId.charCodeAt(studentId.length - 1)) % 100;
          if (seed < 82) status = 'PRESENT';
          else if (seed < 90) status = 'LATE';
          else if (seed < 95) status = 'ABSENT';
          else status = 'EXCUSED';
        }

        records.push({
          id: `rec-${dateStr}-${subj.id}-${studentId}`,
          studentId,
          classId: 'class-cs3a',
          subjectId: subj.id,
          teacherId: subj.teacherId,
          date: dateStr,
          status,
          markedVia: d % 3 === 0 ? 'QR_CODE' : 'MANUAL',
          timestamp: `${dateStr}T09:12:00Z`,
        });
      });
    });
  }

  return records;
};

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-101',
    studentId: 'usr-student-sarah',
    studentName: 'Sarah Jenkins',
    classId: 'class-cs3a',
    startDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    reason: 'Representing university at IEEE Regional Hackathon Competition in Boston.',
    type: 'Academic',
    status: 'PENDING',
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'leave-102',
    studentId: 'usr-student-2',
    studentName: 'Alex Turner',
    classId: 'class-cs3a',
    startDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    endDate: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    reason: 'Severe seasonal flu with medical certificate from campus health clinic.',
    type: 'Medical',
    status: 'APPROVED',
    reviewedBy: 'Dr. Eleanor Vance',
    reviewRemarks: 'Medical certificate verified. Excused attendance granted.',
    submittedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'leave-103',
    studentId: 'usr-student-3',
    studentName: 'Maya Patel',
    classId: 'class-cs3a',
    startDate: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0],
    endDate: new Date(Date.now() - 86400000 * 11).toISOString().split('T')[0],
    reason: 'Family emergency wedding ceremony.',
    type: 'Personal',
    status: 'REJECTED',
    reviewedBy: 'Prof. Marcus Chen',
    reviewRemarks: 'Attendance is currently below institutional threshold (71%). Leave cannot be granted during mid-term review.',
    submittedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
];
