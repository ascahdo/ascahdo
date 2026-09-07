import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Check, Image as ImageIcon, Link as LinkIcon, RefreshCw } from 'lucide-react';

interface MemberPhotoUploadProps {
  photoUrl: string;
  onChange: (url: string) => void;
  label?: string;
  isBn?: boolean;
  required?: boolean;
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
];

export const MemberPhotoUpload: React.FC<MemberPhotoUploadProps> = ({
  photoUrl,
  onChange,
  label,
  isBn = true,
  required = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError(isBn ? 'অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG) নির্বাচন করুন' : 'Please select an image file (JPG, PNG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(isBn ? 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে' : 'File size must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.onerror = () => {
      setUploadError(isBn ? 'ছবি লোড করতে সমস্যা হয়েছে, আবার চেষ্টা করুন' : 'Failed to read image');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleUrlApply = () => {
    if (urlInputValue.trim()) {
      onChange(urlInputValue.trim());
      setShowUrlInput(false);
      setUrlInputValue('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label || (isBn ? 'পাসপোর্ট সাইজ ছবি *' : 'Passport Size Photo *')}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? (isBn ? 'ফাইল আপলোড মোড' : 'Upload Mode') : (isBn ? 'অনলাইন লিঙ্ক ব্যবহার' : 'Use URL Link')}</span>
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
          <button
            type="button"
            onClick={handleUrlApply}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
          >
            {isBn ? 'যোগ' : 'Set'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          {/* Photo Preview Box */}
          <div className="relative group shrink-0">
            <div className="w-24 h-28 rounded-xl overflow-hidden bg-slate-200 border-2 border-emerald-500 shadow-sm flex items-center justify-center">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Member Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-2 text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-[10px] font-medium block">{isBn ? 'ছবি নেই' : 'No Photo'}</span>
                </div>
              )}
            </div>

            {photoUrl && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition active:scale-90"
                title={isBn ? 'ছবি মুছুন' : 'Remove Photo'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Upload / Drag-and-Drop Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 w-full border-2 border-dashed rounded-xl p-3 sm:p-4 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[100px] ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-300 hover:border-emerald-400 bg-white hover:bg-emerald-50/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5 shadow-xs">
              <Upload className="w-4 h-4" />
            </div>

            <p className="text-xs font-bold text-slate-800">
              {isBn ? 'ছবি এখানে ড্র্যাগ করুন অথবা ক্লিক করে নির্বাচন করুন' : 'Drag & drop photo or click to browse'}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {isBn ? 'পাসপোর্ট সাইজ রঙিন ছবি (JPG, PNG, সর্বোচ্চ ৫ MB)' : 'Passport size color photo (JPG, PNG up to 5MB)'}
            </p>
          </div>
        </div>
      )}

      {uploadError && (
        <p className="text-[11px] font-bold text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
          ⚠️ {uploadError}
        </p>
      )}

      {/* Preset Quick Avatars for Fast Demo/Testing */}
      <div className="flex items-center gap-1.5 pt-1">
        <span className="text-[10px] text-slate-500 font-semibold">{isBn ? 'নমুনা ছবি:' : 'Presets:'}</span>
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {DEFAULT_AVATARS.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(url)}
              className={`w-6 h-6 rounded-full overflow-hidden border transition shrink-0 ${
                photoUrl === url ? 'ring-2 ring-emerald-500 scale-110' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
