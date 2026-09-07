import React, { useState } from 'react';
import {
  X, BookOpen, Layers, Calculator, Volume2, ShieldCheck,
  Download, ArrowRight, ArrowLeft, Check, Sparkles, Star,
  ExternalLink, Eye, Play, CheckCircle2, Copy
} from 'lucide-react';

interface DigitalSamplePreviewModalProps {
  product: any | null;
  onClose: () => void;
  onAddToCart: (product: any, licenseType?: string) => void;
  onDirectOrder: (product: any, licenseType?: string) => void;
  isBn: boolean;
}

export const DigitalSamplePreviewModal: React.FC<DigitalSamplePreviewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectOrder,
  isBn
}) => {
  if (!product) return null;

  // Selected License
  const [selectedLicense, setSelectedLicense] = useState<'personal' | 'commercial'>('personal');

  // Reader state (for e-books & planners)
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Calculator Simulator state (for Zakat / Excel products)
  const [calcCash, setCalcCash] = useState(250000);
  const [calcGoldBhori, setCalcGoldBhori] = useState(3);
  const [calcBusinessStock, setCalcBusinessStock] = useState(350000);
  const [calcDebts, setCalcDebts] = useState(50000);

  // Sound test state (for kids app / audio products)
  const [activeSoundIdx, setActiveSoundIdx] = useState<number | null>(null);
  const [playingAudio, setPlayingAudio] = useState(false);

  // Copy indicator
  const [copiedText, setCopiedText] = useState(false);

  const sampleData = product.sampleData || {};
  const demoType = product.demoType || (product.category?.includes('Book') ? 'reader' : 'vector_gallery');

  const personalPrice = product.price;
  const commercialPrice = product.commercialPrice || Math.round(product.price * 1.8);
  const currentPrice = selectedLicense === 'commercial' ? commercialPrice : personalPrice;

  // Interactive Zakat calculation demo logic
  const goldPricePerBhori = sampleData.goldPricePerBhori || 135000;
  const nisabThreshold = sampleData.nisabSilverBDT || 115500;
  const totalAssets = calcCash + (calcGoldBhori * goldPricePerBhori) + calcBusinessStock;
  const netWealth = Math.max(0, totalAssets - calcDebts);
  const isZakatEligible = netWealth >= nisabThreshold;
  const calculatedZakat = isZakatEligible ? Math.round(netWealth * 0.025) : 0;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const playSimulatedSound = (idx: number) => {
    setActiveSoundIdx(idx);
    setPlayingAudio(true);
    // Beep / Tone synthesis using Web Audio API safely
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440 + idx * 80, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // Audio fallback
    }
    setTimeout(() => setPlayingAudio(false), 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-indigo-200 my-6 space-y-6 relative">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md">
              <Eye className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase border border-indigo-200">
                  {isBn ? 'ইন্টারঅ্যাক্টিভ লাইভ ডেমো ও স্যাম্পল' : 'Live Interactive Sample Preview'}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {product.version || 'v2.6'}
                </span>
              </div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg leading-tight mt-0.5">
                {product.nameBn || product.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Demo Container */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200/80">
          
          {/* MODE 1: E-BOOK & DIGITAL PLANNER SAMPLE READER */}
          {demoType === 'reader' && sampleData.pages && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200 text-xs">
                <div className="flex items-center gap-2 text-indigo-900 font-bold">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>
                    {isBn
                      ? `স্যাম্পল পৃষ্ঠা ${activePageIndex + 1} / ${sampleData.pages.length} (মোট ${sampleData.totalPages || 1200}+ পৃষ্ঠা)`
                      : `Sample Excerpt Page ${activePageIndex + 1} of ${sampleData.pages.length}`}
                  </span>
                </div>
                
                {/* Font Size Selector */}
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold mr-1">{isBn ? 'ফন্ট সাইজ:' : 'Font:'}</span>
                  <button
                    onClick={() => setReaderFontSize('sm')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${readerFontSize === 'sm' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
                  >
                    ছোট
                  </button>
                  <button
                    onClick={() => setReaderFontSize('base')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${readerFontSize === 'base' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
                  >
                    মাঝারি
                  </button>
                  <button
                    onClick={() => setReaderFontSize('lg')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${readerFontSize === 'lg' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
                  >
                    বড়
                  </button>
                </div>
              </div>

              {/* Sample Page Viewport */}
              <div className="bg-amber-50/40 rounded-2xl p-6 sm:p-8 border border-amber-200/70 shadow-xs min-h-[220px] flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                      {sampleData.pages[activePageIndex]?.title}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                      পেইজ {sampleData.pages[activePageIndex]?.page}
                    </span>
                  </div>
                  <p
                    className={`text-slate-800 leading-relaxed font-serif ${
                      readerFontSize === 'sm' ? 'text-xs' : readerFontSize === 'lg' ? 'text-base' : 'text-sm'
                    }`}
                  >
                    {sampleData.pages[activePageIndex]?.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-200/50 flex items-center justify-between text-xs mt-4">
                  <button
                    disabled={activePageIndex === 0}
                    onClick={() => setActivePageIndex((prev) => Math.max(0, prev - 1))}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{isBn ? 'পূর্ববর্তী পৃষ্ঠা' : 'Prev Page'}</span>
                  </button>

                  <span className="text-[11px] text-amber-800 font-bold">
                    {isBn ? 'সম্পূর্ণ সংস্করণ পেতে এখনই অর্ডার করুন' : 'Purchase full digital edition'}
                  </span>

                  <button
                    disabled={activePageIndex >= sampleData.pages.length - 1}
                    onClick={() => setActivePageIndex((prev) => Math.min(sampleData.pages.length - 1, prev + 1))}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <span>{isBn ? 'পরবর্তী পৃষ্ঠা' : 'Next Page'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: INTERACTIVE FINANCIAL / ZAKAT SIMULATOR */}
          {demoType === 'interactive_calc' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                <span className="flex items-center gap-1.5 font-black text-slate-800">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'লাইভ সফটওয়্যার ডেমো: ইনস্ট্যান্ট জাকাত ও ইনভেস্টমেন্ট হিসাব' : 'Live Software Simulator Demo'}</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-md">
                  ২০২৬ নিসাব: ৳{nisabThreshold.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Inputs */}
                <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">
                      {isBn ? 'নগদ ক্যাশ ও ব্যাংক ব্যালেন্স (৳)' : 'Cash & Bank Balance (BDT)'}
                    </label>
                    <input
                      type="number"
                      value={calcCash}
                      onChange={(e) => setCalcCash(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">
                      {isBn ? 'স্বর্ণের পরিমাণ (ভরি)' : 'Gold Amount (Bhori)'}
                    </label>
                    <input
                      type="number"
                      value={calcGoldBhori}
                      onChange={(e) => setCalcGoldBhori(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400">বাজারমূল্য: ৳{goldPricePerBhori.toLocaleString()} / ভরি</span>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">
                      {isBn ? 'ব্যবসায়িক পণ্যের স্টক বা ইনভেস্টমেন্ট (৳)' : 'Business Stock (BDT)'}
                    </label>
                    <input
                      type="number"
                      value={calcBusinessStock}
                      onChange={(e) => setCalcBusinessStock(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">
                      {isBn ? 'বর্তমান ঋণ বা দেনা (৳)' : 'Debts / Liabilities (BDT)'}
                    </label>
                    <input
                      type="number"
                      value={calcDebts}
                      onChange={(e) => setCalcDebts(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-rose-600"
                    />
                  </div>
                </div>

                {/* Output Card */}
                <div className="bg-emerald-950 text-white p-5 rounded-2xl flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-1">
                      {isBn ? 'স্বয়ংক্রিয় সফটওয়্যার রেজাল্ট' : 'Automated Calculation Result'}
                    </span>
                    <div className="space-y-1 py-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>{isBn ? 'মোট সম্পদ:' : 'Total Assets:'}</span>
                        <span className="font-mono font-bold">৳{totalAssets.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-rose-300">
                        <span>{isBn ? 'বাদ যাবে দেনা:' : 'Less Debts:'}</span>
                        <span className="font-mono font-bold">-৳{calcDebts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-emerald-800">
                        <span>{isBn ? 'নেট জাকাতযোগ্য সম্পদ:' : 'Net Wealth:'}</span>
                        <span className="font-mono text-emerald-300">৳{netWealth.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-900/80 p-4 rounded-xl border border-emerald-700/50 text-center">
                    <span className="text-[11px] text-emerald-200 block">
                      {isZakatEligible ? (isBn ? 'ফরজ জাকাতের পরিমাণ (২.৫%)' : 'Obligatory Zakat (2.5%)') : (isBn ? 'নিসাবের নিচে সম্পদ' : 'Below Nisab Threshold')}
                    </span>
                    <span className="text-2xl font-black text-emerald-300 font-mono block mt-1">
                      ৳{calculatedZakat.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-[10px] text-emerald-300/80 text-center leading-relaxed">
                    {isBn
                      ? '✓ ক্রয় করলে আপনি পাবেন আনলিমিটেড এন্ট্রি সহ পূর্ণাঙ্গ অটোমেটিক এক্সেল ম্যাক্রো সফটওয়্যার।'
                      : 'Full Excel template contains 12+ modules with multi-currency & tax optimization.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: VECTOR GALLERY & ASSET PREVIEW */}
          {demoType === 'vector_gallery' && sampleData.previewItems && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                <span className="flex items-center gap-1.5 font-black text-slate-800">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>{isBn ? 'অন্তর্ভুক্ত ভেক্টর আর্ট ও অ্যাসেটের স্যাম্পল গ্যালারি' : 'Sample Vector & Art Gallery'}</span>
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {sampleData.totalAssets || 200}+ {isBn ? 'টি প্রিমিয়াম ফাইল' : 'Assets Included'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sampleData.previewItems.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                          {item.format}
                        </span>
                        {item.tag && (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <h5 className="font-bold text-xs text-slate-800 truncate">{item.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono block">{item.dpi}</span>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-500 text-center pt-2">
                {isBn
                  ? '🔒 স্যাম্পলগুলোতে সুরক্ষার জন্য ওয়াটারমার্ক রয়েছে। ডাউনলোডের পর ১০০% পরিষ্কার সিএমওয়াইকে ভেক্টর ও হাই-রেজ আর্ট পাবেন।'
                  : 'Full package includes clean transparent SVGs, scalable AI source files, and 300 DPI PNGs.'}
              </p>
            </div>
          )}

          {/* MODE 4: SOUND TEST & PHONETICS (KIDS & AUDIO PACK) */}
          {demoType === 'sound_test' && sampleData.letters && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                <span className="flex items-center gap-1.5 font-black text-slate-800">
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>{isBn ? 'ইন্টারঅ্যাক্টিভ অডিও ও সাউন্ড টেস্ট ডেমো' : 'Interactive Sound & Audio Demo'}</span>
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                  {playingAudio ? '🔊 অডিও চলছে...' : 'ক্লিক করে শব্দ শুনুন'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sampleData.letters.map((item: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => playSimulatedSound(idx)}
                    className={`p-4 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-between gap-2 ${
                      activeSoundIdx === idx
                        ? 'bg-amber-100 border-amber-400 shadow-md scale-105'
                        : 'bg-white border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <span className="text-3xl font-serif text-slate-900">{item.letter}</span>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">{item.name}</span>
                      <span className="text-[10px] text-amber-700 font-bold">{item.phonetics}</span>
                    </div>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{isBn ? 'শুনুন' : 'Play'}</span>
                    </span>
                  </button>
                ))}
              </div>

              {activeSoundIdx !== null && sampleData.letters[activeSoundIdx] && (
                <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-slate-700 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{sampleData.letters[activeSoundIdx].soundText}</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* LICENSE SELECTOR SECTION */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase">
              {isBn ? 'লাইসেন্স ও বাণিজ্যিক ব্যবহারের অধিকার নির্বাচন করুন' : 'Select Commercial License Rights'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {isBn ? 'কেনার সাথে সাথেই ইনস্ট্যান্ট লাইসেন্স কী জেনারেট হবে' : 'Instant cryptographically verified key'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Personal License */}
            <div
              onClick={() => setSelectedLicense('personal')}
              className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                selectedLicense === 'personal'
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="licenseModal"
                checked={selectedLicense === 'personal'}
                onChange={() => setSelectedLicense('personal')}
                className="mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-black text-slate-900">
                    {isBn ? '👤 ব্যক্তিগত লাইসেন্স (Personal License)' : 'Personal Single User'}
                  </h5>
                  <span className="text-sm font-black text-slate-900">৳{personalPrice}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {isBn
                    ? '১ জন ব্যবহারকারী। ব্যক্তিগত শিক্ষা, ইবাদত বা পরিবারের নিজস্ব ডিভাইসে ব্যবহারের জন্য।'
                    : 'For single individual or personal home use on your own devices.'}
                </p>
              </div>
            </div>

            {/* Commercial License */}
            <div
              onClick={() => setSelectedLicense('commercial')}
              className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                selectedLicense === 'commercial'
                  ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="licenseModal"
                checked={selectedLicense === 'commercial'}
                onChange={() => setSelectedLicense('commercial')}
                className="mt-1 text-amber-600 focus:ring-amber-500"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-black text-amber-950 flex items-center gap-1">
                    <span>{isBn ? '🏢 কমার্শিয়াল ও ফ্রিল্যান্সার লাইসেন্স' : 'Commercial & Agency Rights'}</span>
                    <span className="bg-amber-200 text-amber-950 text-[9px] font-black px-1.5 py-0.2 rounded">PRO</span>
                  </h5>
                  <span className="text-sm font-black text-amber-700">৳{commercialPrice}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {isBn
                    ? 'ক্লায়েন্ট প্রজেক্ট, বাণিজ্যিক ডিজাইন, প্রিন্টিং ও ব্যবসায়িক মাল্টি-ইউজ ব্যবহারের পূর্ণ অধিকার।'
                    : 'Allowed for client work, commercial prints, and business multi-device deployment.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Footer & Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 space-y-0.5 text-center sm:text-left">
            <p>
              <span className="font-bold text-slate-700">{isBn ? 'সামঞ্জস্যপূর্ণ প্ল্যাটফর্ম:' : 'Compatibility:'}</span>{' '}
              {(product.compatibility || ['Windows', 'Android', 'iOS', 'Mac']).join(', ')}
            </p>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center justify-center sm:justify-start gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isBn ? 'পেমেন্ট সম্পন্ন হওয়ার ১ সেকেন্ডের মধ্যে ইনস্ট্যান্ট ডাউনলোড লিংক পাবেন' : 'Instant download link + Lifetime updates'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onAddToCart({ ...product, selectedLicense, price: currentPrice });
                onClose();
              }}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl border-2 border-slate-300 hover:border-slate-400 font-black text-xs text-slate-800 transition cursor-pointer"
            >
              {isBn ? 'কার্টে রাখুন' : 'Add to Cart'}
            </button>

            <button
              onClick={() => {
                onDirectOrder({ ...product, selectedLicense, price: currentPrice }, selectedLicense);
                onClose();
              }}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isBn ? `৳${currentPrice} কিনুন (${selectedLicense === 'commercial' ? 'কমার্শিয়াল' : 'ব্যক্তিগত'})` : `Buy Now ৳${currentPrice}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
