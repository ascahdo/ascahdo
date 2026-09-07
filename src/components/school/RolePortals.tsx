import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Award,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  Phone,
  BookOpen,
  Send,
  Download,
  QrCode,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const RolePortals: React.FC = () => {
  const {
    activeInstitution,
    userRole,
    students,
    teachers,
    routines,
    results,
    fees,
    homeworks,
    leaves,
    payFeeInvoice,
    applyLeave
  } = useSchool();

  const currentStudent = students[0];
  const currentTeacher = teachers[0];

  // Teacher Leave Form
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [leaveDays, setLeaveDays] = useState(2);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  const handleTeacherLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason) return;
    applyLeave({
      applicantType: 'teacher',
      applicantId: currentTeacher?.id || 'tch_1',
      applicantName: currentTeacher?.fullNameBn || 'শিক্ষক',
      leaveType,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + leaveDays * 86400000).toISOString().slice(0, 10),
      totalDays: leaveDays,
      reason: leaveReason,
      status: 'pending',
      appliedDate: new Date().toISOString().slice(0, 10)
    });
    setLeaveSubmitted(true);
    setLeaveReason('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* TEACHER PORTAL VIEW */}
      {userRole === 'teacher' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
            <img
              src={currentTeacher?.photo}
              alt="Teacher"
              className="w-24 h-24 rounded-2xl object-cover border-4 border-emerald-500 shadow-md"
            />
            <div className="space-y-1 text-center sm:text-left flex-1">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
                শিক্ষক ও অনুষদ পোর্টাল
              </span>
              <h2 className="text-2xl font-black">{currentTeacher?.fullNameBn}</h2>
              <p className="text-emerald-200 text-xs font-medium">
                {currentTeacher?.designationBn} • {currentTeacher?.department}
              </p>
              <div className="text-xs text-slate-300 pt-1">
                আইডি: {currentTeacher?.employeeId} | মোবাইল: {currentTeacher?.phone}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Classes */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>আজকের ক্লাস রুটিন</span>
              </h3>

              <div className="space-y-3">
                {(routines[0]?.periods || []).map((p) => (
                  <div key={p.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{p.subjectName}</div>
                      <div className="text-slate-500">রুম নং: {p.roomNo} • {p.timeSlot}</div>
                    </div>
                    <span className="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded text-[10px]">
                      পিরিয়ড #{p.periodNo}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave Application Form */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>ছুটির আবেদন করুন</span>
              </h3>

              {leaveSubmitted ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold">
                  ছুটির আবেদন সফলভাবে প্রধান শিক্ষকের অনুমোদনের জন্য জমা দেওয়া হয়েছে।
                </div>
              ) : (
                <form onSubmit={handleTeacherLeaveSubmit} className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ছুটির ধরন</label>
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    >
                      <option value="Casual Leave">নৈমিত্তিক ছুটি (Casual Leave)</option>
                      <option value="Medical Leave">চিকিৎসাজনিত ছুটি (Medical Leave)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ছুটির দিনের সংখ্যা</label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={leaveDays}
                      onChange={(e) => setLeaveDays(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ছুটির কারণ</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="ছুটির কারণ বিস্তারিত লিখুন..."
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl hover:bg-emerald-500 transition text-xs"
                  >
                    আবেদন সাবমিট করুন
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STUDENT PORTAL VIEW */}
      {userRole === 'student' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
            <img
              src={currentStudent?.photo}
              alt="Student"
              className="w-24 h-24 rounded-2xl object-cover border-4 border-blue-400 shadow-md"
            />
            <div className="space-y-1 text-center sm:text-left flex-1">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
                শিক্ষার্থী পোর্টাল
              </span>
              <h2 className="text-2xl font-black">{currentStudent?.fullNameBn}</h2>
              <p className="text-blue-200 text-xs font-medium">
                {currentStudent?.className} ({currentStudent?.section}) • রোল নম্বর: {currentStudent?.studentId}
              </p>
              <div className="text-xs text-slate-300 pt-1">
                উপস্থিতি: {currentStudent?.attendanceRate}% | রক্ত: {currentStudent?.bloodGroup}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Marksheet */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span>আমার রেজাল্ট ও গ্রেড</span>
              </h3>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-3 text-xs">
                <div className="flex justify-between items-center font-bold text-slate-900">
                  <span>অর্ধবার্ষিক মূল্যায়ন পরীক্ষা ২০২৬</span>
                  <span className="text-blue-700 font-mono font-black text-sm">GPA 5.00 (A+)</span>
                </div>
                <div className="text-slate-600">মেধাস্থান: <b>১ম</b> | সর্বমোট নম্বর: <b>৫৬৮</b></div>
                <button
                  onClick={() => window.print()}
                  className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> অফিসিয়াল মার্কশিট ডাউনলোড
                </button>
              </div>
            </div>

            {/* My Due Fees */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>মাসিক বেতন ও ফি পেমেন্ট</span>
              </h3>

              <div className="space-y-3">
                {fees.slice(0, 2).map((f) => (
                  <div key={f.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{f.feeType} ({f.monthYear})</div>
                      <div className="text-slate-500 font-mono">৳ {f.netAmount}</div>
                    </div>
                    {f.status === 'paid' ? (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded text-[10px]">
                        পরিশোধিত
                      </span>
                    ) : (
                      <button
                        onClick={() => payFeeInvoice(f.id, 'bKash')}
                        className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                      >
                        bKash এ দিন
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GUARDIAN PORTAL VIEW */}
      {userRole === 'guardian' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
            <div className="w-20 h-20 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-3xl shadow">
              👨‍👩‍👦
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
                অভিভাবক ড্যাশবোর্ড
              </span>
              <h2 className="text-2xl font-black">সন্তানের অ্যাকাডেমিক অগ্রগতি</h2>
              <p className="text-amber-200 text-xs font-medium">
                শিক্ষার্থী: {currentStudent?.fullNameBn} (রোল: {currentStudent?.studentId})
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-2">
              <div className="text-3xl font-black text-emerald-600 font-mono">
                {currentStudent?.attendanceRate}%
              </div>
              <div className="font-bold text-slate-900 text-sm">হাজিরা উপস্থিতি হার</div>
              <div className="text-xs text-slate-500">চলতি শিক্ষাবর্ষে সন্তোষজনক উপস্থিতি</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-2">
              <div className="text-3xl font-black text-blue-600 font-mono">GPA 5.00</div>
              <div className="font-bold text-slate-900 text-sm">সর্বশেষ পরীক্ষার রেজাল্ট</div>
              <div className="text-xs text-slate-500">মেধাস্থান: ১ম স্থান</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-2">
              <div className="text-3xl font-black text-purple-600 font-mono">পরিশোধিত</div>
              <div className="font-bold text-slate-900 text-sm">মাসিক টিউশন ফি</div>
              <div className="text-xs text-slate-500">কোনো বকেয়া ফি নেই</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
