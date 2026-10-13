import React, { useState, useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { User, StudentAttendanceSummary } from '../types/attendance';
import {
  Users,
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  X,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Eye,
  Camera,
  Mail,
  Phone,
  GraduationCap,
} from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const {
    users,
    classes,
    addUser,
    updateUser,
    deleteUser,
    bulkImportStudents,
    getAllStudentSummaries,
    settings,
  } = useAttendance();

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'defaulter' | 'regular'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Clean view per page

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [viewingSummary, setViewingSummary] = useState<StudentAttendanceSummary | null>(null);

  // Bulk selection
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // CSV Import State
  const [csvText, setCsvText] = useState('');
  const [importPreview, setImportPreview] = useState<Partial<User>[]>([]);
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);

  // Form State for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    classId: classes[0]?.id || 'class-cs3a',
    department: 'Computer Science & Engineering',
    phone: '',
    parentName: '',
    parentEmail: '',
    avatar: '',
  });

  const students = useMemo(() => users.filter((u) => u.role === 'STUDENT'), [users]);
  const summaries = useMemo(() => getAllStudentSummaries(), [getAllStudentSummaries]);

  // Merge student record with computed attendance summary
  const studentDataWithSummaries = useMemo(() => {
    return students.map((st) => {
      const summary = summaries.find((s) => s.studentId === st.id);
      return {
        ...st,
        percentage: summary?.percentage ?? 100,
        isDefaulter: (summary?.percentage ?? 100) < settings.attendanceThresholdPercent,
        summary,
      };
    });
  }, [students, summaries, settings.attendanceThresholdPercent]);

  // Filtered dataset
  const filteredStudents = useMemo(() => {
    return studentDataWithSummaries.filter((st) => {
      const matchSearch =
        st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (st.rollNumber && st.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        st.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchClass = classFilter === 'all' || st.classId === classFilter;
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'defaulter' && st.isDefaulter) ||
        (statusFilter === 'regular' && !st.isDefaulter);

      return matchSearch && matchClass && matchStatus;
    });
  }, [studentDataWithSummaries, searchTerm, classFilter, statusFilter]);

  // Paginated
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  // Handlers for Add / Edit
  const openAddModal = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      email: '',
      rollNumber: `CS2025-${String(students.length + 10).padStart(3, '0')}`,
      classId: classes[0]?.id || 'class-cs3a',
      department: 'Computer Science & Engineering',
      phone: '+1 (555) 000-0000',
      parentName: '',
      parentEmail: '',
      avatar: '',
    });
    setIsAddEditOpen(true);
  };

  const openEditModal = (student: User) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber || '',
      classId: student.classId || classes[0]?.id || 'class-cs3a',
      department: student.department || 'Computer Science & Engineering',
      phone: student.phone || '',
      parentName: student.parentName || '',
      parentEmail: student.parentEmail || '',
      avatar: student.avatar || '',
    });
    setIsAddEditOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateUser({
        ...editingStudent,
        ...formData,
      });
    } else {
      addUser({
        ...formData,
        role: 'STUDENT',
      });
    }
    setIsAddEditOpen(false);
  };

  // Bulk Actions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(paginatedStudents.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedStudentIds.length} selected students?`)) {
      selectedStudentIds.forEach((id) => deleteUser(id));
      setSelectedStudentIds([]);
    }
  };

  // CSV Parsing
  const handleParseCsv = (text: string) => {
    setCsvText(text);
    const lines = text.trim().split('\n');
    const parsed: Partial<User>[] = [];

    // Skip header line if present
    const startLine = lines[0].toLowerCase().includes('name') ? 1 : 0;

    for (let i = startLine; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 2) {
        parsed.push({
          name: parts[0] || `Student ${i}`,
          rollNumber: parts[1] || `CS2025-${i + 100}`,
          email: parts[2] || `student.${Date.now()}.${i}@attendease.edu`,
          classId: classes[0]?.id || 'class-cs3a',
          department: parts[3] || 'Computer Science & Engineering',
          parentEmail: parts[4],
          parentName: parts[5],
        });
      }
    }
    setImportPreview(parsed);
  };

  const handleExecuteImport = () => {
    if (importPreview.length > 0) {
      const count = bulkImportStudents(importPreview);
      setImportSuccessCount(count);
      setTimeout(() => {
        setIsBulkImportOpen(false);
        setImportSuccessCount(null);
        setImportPreview([]);
        setCsvText('');
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Student Management Roster
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total {students.length} students enrolled across departments · Defaulter threshold: {settings.attendanceThresholdPercent}%
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsBulkImportOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Bulk CSV Import</span>
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, roll number, or email..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
            >
              <option value="all">All Class Sections</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
          >
            <option value="all">All Attendance Status</option>
            <option value="regular">Regular (&ge; {settings.attendanceThresholdPercent}%)</option>
            <option value="defaulter">Defaulters (&lt; {settings.attendanceThresholdPercent}%)</option>
          </select>

          {/* Bulk Delete Button if selected */}
          {selectedStudentIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete ({selectedStudentIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedStudents.length > 0 &&
                      selectedStudentIds.length === paginatedStudents.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                </th>
                <th className="py-3 px-3 font-semibold">Student Name</th>
                <th className="py-3 px-3 font-semibold">Roll Number</th>
                <th className="py-3 px-3 font-semibold">Class Section</th>
                <th className="py-3 px-3 font-semibold text-right">Attendance %</th>
                <th className="py-3 px-3 font-semibold text-center">Audit Status</th>
                <th className="py-3 px-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-sans italic">
                    No students match the specified filters. Try clearing your search query.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const isSelected = selectedStudentIds.includes(student.id);
                  const isBelow = student.isDefaulter;

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(student.id)}
                          className="rounded text-indigo-600"
                        />
                      </td>

                      {/* Name + Avatar */}
                      <td className="py-3 px-3 font-sans">
                        <div className="flex items-center gap-2.5">
                          {student.avatar ? (
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs">
                              {student.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                              {student.name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate max-w-[160px]">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                        {student.rollNumber || 'N/A'}
                      </td>

                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-sans">
                        {classes.find((c) => c.id === student.classId)?.code || 'CS3-A'}
                      </td>

                      <td className="py-3 px-3 text-right tabular-nums">
                        <span
                          className={`font-bold ${
                            isBelow ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {student.percentage}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center font-sans">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            isBelow
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                          }`}
                        >
                          {isBelow ? 'Defaulter' : 'Clear'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center font-sans">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => student.summary && setViewingSummary(student.summary)}
                            title="View Detailed Attendance Record"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(student)}
                            title="Edit Student"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ${student.name}?`)) {
                                deleteUser(student.id);
                              }
                            }}
                            title="Delete Student"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{paginatedStudents.length}</span> of{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredStudents.length}</span> students
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingStudent ? 'Edit Student Profile' : 'Enroll New Student'}
              </h3>
              <button
                onClick={() => setIsAddEditOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Roll Number / Student ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    placeholder="e.g. CS2024-042"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class Section *
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Student Institutional Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah.jenkins@student.attendease.edu"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="e.g. Robert Jenkins"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Parent Email
                  </label>
                  <input
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    placeholder="parent@gmail.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  {editingStudent ? 'Save Changes' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      {isBulkImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Bulk Student Import (CSV)
                </h3>
              </div>
              <button
                onClick={() => setIsBulkImportOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Paste or type CSV lines in the format: <br />
              <code className="text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">
                FullName, RollNumber, Email, Department, ParentEmail, ParentName
              </code>
            </p>

            <textarea
              rows={5}
              value={csvText}
              onChange={(e) => handleParseCsv(e.target.value)}
              placeholder={`Samantha Reed, CS2025-071, samantha.r@attendease.edu, Computer Science, parent.reed@gmail.com, Henry Reed\nDavid Kim, CS2025-072, david.kim@attendease.edu, Computer Science, parent.kim@gmail.com, June Kim`}
              className="w-full mt-3 p-3 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />

            {/* Quick Sample Button */}
            <button
              type="button"
              onClick={() => {
                const sample = `Rachel Adams, CS2025-081, rachel.adams@attendease.edu, Computer Science, p.adams@gmail.com, Mark Adams\nCarlos Santana, CS2025-082, carlos.santana@attendease.edu, Computer Science, p.santana@gmail.com, Elena Santana\nTyler Durden, CS2025-083, tyler.durden@attendease.edu, Computer Science, p.durden@gmail.com, Jack Durden`;
                handleParseCsv(sample);
              }}
              className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              + Load Sample Batch Data
            </button>

            {/* Preview Table */}
            {importPreview.length > 0 && (
              <div className="mt-4 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Preview ({importPreview.length} students detected):
                </span>
                <div className="max-h-32 overflow-y-auto mt-2 space-y-1 text-xs">
                  {importPreview.map((s, idx) => (
                    <div key={idx} className="flex justify-between text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      <span>{s.name} ({s.rollNumber})</span>
                      <span className="text-slate-400">{s.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {importSuccessCount !== null && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Successfully imported {importSuccessCount} students into database!</span>
              </div>
            )}

            <div className="pt-4 mt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsBulkImportOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={importPreview.length === 0}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-40 shadow-xs"
              >
                Import {importPreview.length} Students
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Detailed Summary Modal */}
      {viewingSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {viewingSummary.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Roll: {viewingSummary.rollNumber}
                </p>
              </div>
              <button
                onClick={() => setViewingSummary(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Overall Attendance
                </span>
                <p
                  className={`text-2xl font-extrabold tabular-nums ${
                    viewingSummary.isDefaulter
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {viewingSummary.percentage}%
                </p>
              </div>
              <div className="text-right text-xs text-slate-500 space-y-0.5 font-mono">
                <p>Present: <span className="font-bold text-emerald-600">{viewingSummary.presentCount}</span></p>
                <p>Absent: <span className="font-bold text-rose-600">{viewingSummary.absentCount}</span></p>
                <p>Late: <span className="font-bold text-amber-600">{viewingSummary.lateCount}</span></p>
                <p>Excused: <span className="font-bold text-sky-600">{viewingSummary.excusedCount}</span></p>
              </div>
            </div>

            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Subject-wise Breakdown:
            </h4>
            <div className="space-y-2">
              {viewingSummary.subjectBreakdown.map((sub) => (
                <div
                  key={sub.subjectId}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60"
                >
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {sub.subjectCode} - {sub.subjectName}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        sub.isDefaulter ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {sub.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sub.isDefaulter ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${sub.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>{sub.present} / {sub.total} classes attended</span>
                    <span>{sub.isDefaulter ? 'Deficient' : 'Satisfactory'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                onClick={() => setViewingSummary(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
