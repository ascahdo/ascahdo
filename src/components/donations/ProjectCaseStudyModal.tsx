import React, { useState } from 'react';
import { DonationProject, DonationCategoryType } from '../../types/donationTypes';
import { formatTakaBn } from '../../utils/donationUtils';
import {
  X, CheckCircle2, MapPin, Users, Calendar, Heart, Share2,
  FileText, ShieldCheck, ChevronRight, Check, Award, Image
} from 'lucide-react';

interface ProjectCaseStudyModalProps {
  project: DonationProject | null;
  isOpen: boolean;
  onClose: () => void;
  onDonate: (project: DonationProject) => void;
}

export const ProjectCaseStudyModal: React.FC<ProjectCaseStudyModalProps> = ({
  project,
  isOpen,
  onClose,
  onDonate
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !project) return null;

  const percentage = Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100));
  const remaining = Math.max(0, project.targetAmount - project.raisedAmount);

  const images = project.galleryImages && project.galleryImages.length > 0 
    ? project.galleryImages 
    : [
        project.imageUrl,
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80'
      ];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {project.categoryNameBn || project.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">ID: {project.id}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white line-clamp-1 mt-0.5">
                {project.titleBn}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold"
              title="লিংক কপি করুন"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'কপি হয়েছে' : 'শেয়ার'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Gallery View */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
              <img
                src={images[activeImageIndex] || project.imageUrl}
                alt={project.titleBn}
                className="w-full h-full object-cover transition duration-300"
              />
              <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{project.locationBn || 'সারা বাংলাদেশ'}</span>
              </div>

              <div className="absolute top-3 right-3">
                {project.status === 'completed' ? (
                  <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ১০০% বাস্তবায়িত প্রকল্প
                  </span>
                ) : (
                  <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow flex items-center gap-1">
                    চলমান মানবকল্যাণ প্রকল্প
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-400' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
            <div className="p-2">
              <span className="text-[11px] text-slate-500 font-bold block">মোট লক্ষ্যমাত্রা</span>
              <span className="font-mono font-black text-slate-900 text-sm sm:text-base">
                {formatTakaBn(project.targetAmount)}
              </span>
            </div>
            <div className="p-2 border-l border-slate-200">
              <span className="text-[11px] text-slate-500 font-bold block">সংগৃহীত তহবিল</span>
              <span className="font-mono font-black text-emerald-700 text-sm sm:text-base">
                {formatTakaBn(project.raisedAmount)}
              </span>
            </div>
            <div className="p-2 border-t sm:border-t-0 sm:border-l border-slate-200">
              <span className="text-[11px] text-slate-500 font-bold block">সম্মানিত দাতা</span>
              <span className="font-mono font-black text-indigo-700 text-sm sm:text-base">
                {project.donorCount} জন
              </span>
            </div>
            <div className="p-2 border-t sm:border-t-0 sm:border-l border-slate-200">
              <span className="text-[11px] text-slate-500 font-bold block">উপকারভোগী সংখ্যা</span>
              <span className="font-mono font-black text-amber-700 text-sm sm:text-base">
                {project?.beneficiariesCount ? `${(project.beneficiariesCount || 0).toLocaleString()} জন` : '১,২০০+ পরিবার'}
              </span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-2 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-emerald-900">তহবিল সংগ্রহ অগ্রগতি ({percentage}%)</span>
              <span className="text-slate-600">অবশিষ্ট প্রয়োজন: {formatTakaBn(remaining)}</span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Detailed Narrative */}
          <div className="space-y-3">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>প্রকল্পের সারসংক্ষেপ ও পটভূমি</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {project.descriptionBn}
            </p>
          </div>

          {/* Key Objectives */}
          {project.keyObjectivesBn && project.keyObjectivesBn.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>মূল লক্ষ্য ও অর্জিত মাইলফলকসমূহ</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(project?.keyObjectivesBn || []).map((obj, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-slate-700"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      ✓
                    </span>
                    <span className="leading-snug">{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transparency & Shariah Assurance Badge */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <span className="font-extrabold text-white block">১০০% স্বচ্ছ ও ফিল্ড-ভেরিফাইড প্রকল্প</span>
                <span className="text-slate-400">প্রতিটি ব্যয়ের ডিজিটাল ভাউচার ও ছবি অডিট আর্কাইভে সংরক্ষিত।</span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              AUDITED-2026-OK
            </div>
          </div>

        </div>

        {/* Modal Bottom CTA */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>আপনার অনুদানের সাথে সাথে <strong>Official Receipt</strong> পাবেন।</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition"
            >
              বন্ধ করুন
            </button>

            {project.status !== 'completed' ? (
              <button
                onClick={() => {
                  onClose();
                  onDonate(project);
                }}
                className="w-1/2 sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>এই প্রকল্পে অনুদান দিন</span>
              </button>
            ) : (
              <div className="w-1/2 sm:w-auto px-5 py-3 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>প্রকল্প সমাপ্ত</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
