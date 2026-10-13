import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { LeaveRequest } from '../types/attendance';
import {
  FileText,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  X,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const LeaveManagementPage: React.FC = () => {
  const { currentUser, leaveRequests, submitLeaveRequest, reviewLeaveRequest, classes } = useAttendance();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [reviewingLeaveId, setReviewingLeaveId] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  // Form for applying leave
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    reason: '',
    type: 'Academic' as 'Medical' | 'Academic' | 'Personal' | 'Other',
  });

  const isStudent = currentUser?.role === 'STUDENT';

  // Filter requests
  const displayedRequests = leaveRequests.filter((req) => {
    if (isStudent && req.studentId !== currentUser?.id) return false;
    if (filterStatus !== 'ALL' && req.status !== filterStatus) return false;
    return true;
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    submitLeaveRequest({
      studentId: currentUser.id,
      studentName: currentUser.name,
      classId: currentUser.classId || classes[0]?.id || 'class-cs3a',
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      type: formData.type,
    });

    setIsApplyModalOpen(false);
    setFormData({
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      reason: '',
      type: 'Academic',
    });
  };

  const openReviewModal = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setReviewingLeaveId(id);
    setReviewStatus(status);
    setReviewRemarks(
      status === 'APPROVED'
        ? 'Leave sanctioned. Excused attendance granted for requested duration.'
        : 'Leave request declined due to institutional requirements.'
    );
  };

  const handleExecuteReview = () => {
    if (reviewingLeaveId) {
      reviewLeaveRequest(reviewingLeaveId, reviewStatus, reviewRemarks);
      setReviewingLeaveId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Leave Requests & Excuse Approvals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isStudent
              ? 'Submit official absence requests with supporting academic or medical documentation'
              : 'Review and approve student absences. Approved leaves automatically convert to Excused attendance.'}
          </p>
        </div>

        {isStudent && (
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Status Filter:</span>
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterStatus === st
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="text-slate-400">
          Showing {displayedRequests.length} requests
        </span>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {displayedRequests.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 italic text-xs">
            No leave requests matching the selected filter.
          </div>
        ) : (
          displayedRequests.map((req) => {
            const isPending = req.status === 'PENDING';
            const isApproved = req.status === 'APPROVED';

            return (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {req.studentName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {req.type} Leave
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isPending
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                          : isApproved
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {req.reason}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{req.startDate} to {req.endDate}</span>
                    </div>
                    {req.reviewedBy && (
                      <span className="text-slate-500 font-sans">
                        · Reviewed by: <strong className="text-slate-700 dark:text-slate-300">{req.reviewedBy}</strong>
                      </span>
                    )}
                  </div>

                  {req.reviewRemarks && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-850 p-2 rounded-lg mt-2 border border-slate-100 dark:border-slate-800">
                      Remark: "{req.reviewRemarks}"
                    </p>
                  )}
                </div>

                {/* Review Actions (Teacher / Admin) */}
                {!isStudent && isPending && (
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => openReviewModal(req.id, 'APPROVED')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Leave</span>
                    </button>
                    <button
                      onClick={() => openReviewModal(req.id, 'REJECTED')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Submit Leave Application
              </h3>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Leave Category *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Academic">Academic (Hackathon / Conference / Project)</option>
                  <option value="Medical">Medical (Health issue with certificate)</option>
                  <option value="Personal">Personal / Family Emergency</option>
                  <option value="Other">Other Institutional Activity</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason & Documentation Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Provide explicit context for your absence..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingLeaveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Confirm {reviewStatus === 'APPROVED' ? 'Approval' : 'Rejection'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-3">
              {reviewStatus === 'APPROVED'
                ? 'Approving will automatically mark the student as Excused in all matching attendance periods.'
                : 'Rejecting will maintain any recorded absences.'}
            </p>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Faculty Remarks
              </label>
              <textarea
                rows={3}
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="pt-4 mt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setReviewingLeaveId(null)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReview}
                className={`px-4 py-2 rounded-xl text-white font-semibold ${
                  reviewStatus === 'APPROVED'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {reviewStatus}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
