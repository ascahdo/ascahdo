import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Image as ImageIcon,
  Sparkles,
  Calendar,
  Layers,
  ZoomIn,
  ZoomOut,
  X,
  Share2,
  Download,
  Info
} from 'lucide-react';
import { GalleryItem } from '../../types/schoolTypes';

export interface SchoolSlideItem {
  id: string;
  url: string;
  title: string;
  titleBn: string;
  category?: string;
  caption?: string;
  date?: string;
  badge?: string;
}

// 1. HERO CAMPUS PHOTO SLIDER COMPONENT
export const SchoolHeroPhotoSlider: React.FC<{
  slides: SchoolSlideItem[];
  institutionName?: string;
  onOpenAdmission?: () => void;
  onOpenGallery?: () => void;
}> = ({ slides, institutionName, onOpenAdmission, onOpenGallery }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto slide effect
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, slides.length, currentIndex]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleSlideSelect = (index: number) => {
    setCurrentIndex(index);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div
      id="school-hero-photo-slider"
      className="bg-white border border-slate-300 shadow-md rounded-xl overflow-hidden group/slider relative"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Main Large Stage / Image Screen */}
      <div className="relative aspect-[16/9] sm:aspect-[21/10] bg-slate-950 overflow-hidden select-none">
        {/* Render Slides with Fade Animation */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.url}
              alt={slide.titleBn || slide.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Subtle Gradient Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-950/15" />
          </div>
        ))}

        {/* Top Badges & Controls Overlay */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
          {/* Institution Campus Badge */}
          <div className="flex items-center gap-2">
            <span className="bg-sky-600/90 text-white font-bold text-[11px] sm:text-xs px-2.5 py-1 rounded-md backdrop-blur-md shadow flex items-center gap-1.5 border border-sky-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentSlide?.badge || 'ক্যাম্পাস ফটো গ্যালারি'}</span>
            </span>
            <span className="hidden sm:inline-flex bg-slate-900/70 text-slate-200 text-[11px] px-2 py-0.5 rounded border border-white/10 font-mono">
              {institutionName || 'স্মার্ট ক্যাম্পাস'}
            </span>
          </div>

          {/* Right Floating Control Tools (Play/Pause, Counter, Lightbox) */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/15 text-white shadow">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'স্লাইডার থামান' : 'স্লাইডার চালু করুন'}
              className="p-1 hover:bg-white/20 rounded transition text-slate-200 hover:text-white"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            {/* Slide Index Counter */}
            <span className="text-[11px] font-mono font-bold px-1.5 border-x border-white/20 text-amber-300">
              {currentIndex + 1} / {slides.length}
            </span>

            {/* Expand / Lightbox Button */}
            <button
              onClick={() => openLightbox(currentIndex)}
              title="ফুলস্ক্রিন ভিউ"
              className="p-1 hover:bg-white/20 rounded transition text-slate-200 hover:text-white"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Previous & Next Navigation Buttons */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/70 hover:bg-sky-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-lg hover:scale-110 opacity-85 group-hover/slider:opacity-100"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/70 hover:bg-sky-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-lg hover:scale-110 opacity-85 group-hover/slider:opacity-100"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Floating Caption Overlay Inside Slide */}
        <div className="absolute bottom-2.5 left-3 right-3 z-20 pointer-events-auto">
          <div className="bg-slate-950/75 backdrop-blur-md border border-white/15 rounded-lg p-2.5 sm:p-3 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-xl">
            <div className="space-y-0.5 max-w-2xl">
              <h3 className="text-xs sm:text-base font-bold text-white tracking-wide font-serif line-clamp-1">
                {currentSlide?.titleBn || currentSlide?.title}
              </h3>
              {currentSlide?.caption && (
                <p className="text-[11px] sm:text-xs text-sky-200/90 line-clamp-1 font-sans">
                  {currentSlide.caption}
                </p>
              )}
            </div>

            {/* Quick Action Buttons inside Slider */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {onOpenAdmission && (
                <button
                  onClick={onOpenAdmission}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] sm:text-xs px-2.5 py-1.5 rounded shadow transition flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-slate-900" />
                  <span>ভর্তি আবেদন</span>
                </button>
              )}
              {onOpenGallery && (
                <button
                  onClick={onOpenGallery}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 text-[11px] sm:text-xs px-2.5 py-1.5 rounded transition flex items-center gap-1"
                >
                  <ImageIcon className="w-3 h-3 text-sky-300" />
                  <span className="hidden sm:inline">সকল ছবি</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slider Bottom Dot Indicators & Mini Thumbnails Strip */}
      <div className="bg-slate-900 px-3 py-2 border-t border-slate-800 flex items-center justify-between gap-2">
        {/* Left: Interactive Dot Indicators */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleSlideSelect(idx)}
              title={`ছবি ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 sm:w-8 bg-amber-400'
                  : 'w-2 bg-slate-600 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Right: Quick Thumbnail Navigation Strip */}
        <div className="hidden md:flex items-center gap-1.5">
          {slides.slice(0, 6).map((slide, idx) => (
            <button
              key={slide.id || idx}
              onClick={() => handleSlideSelect(idx)}
              className={`w-9 h-6 rounded overflow-hidden border transition-all ${
                idx === currentIndex
                  ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105 opacity-100'
                  : 'border-slate-700 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={slide.url}
                alt={slide.titleBn}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal for Slider Photos */}
      {isLightboxOpen && (
        <SchoolLightboxModal
          isOpen={isLightboxOpen}
          slides={slides}
          initialIndex={lightboxIndex}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
};

// 2. INTERACTIVE PHOTO GALLERY CAROUSEL & GRID COMPONENT
export const SchoolPhotoGallerySlider: React.FC<{
  items: GalleryItem[];
  title?: string;
  subtitle?: string;
  onViewAll?: () => void;
}> = ({
  items,
  title = 'ক্যাম্পাস ফটো গ্যালারি স্লাইডার',
  subtitle = 'প্রতিষ্ঠান প্রাঙ্গণ, আধুনিক ল্যাব, শ্রেণিকক্ষ, বার্ষিক ক্রীড়া ও সাংস্কৃতিক অনুষ্ঠানের আলোকচিত্র',
  onViewAll
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'campus' | 'lab' | 'classroom' | 'sports' | 'cultural'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter Items
  const filteredItems = selectedCategory === 'all'
    ? (items || [])
    : (items || []).filter(
        (item) => item && (item.category === selectedCategory || item.album?.toLowerCase().includes(selectedCategory))
      );

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 320;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };

  const categories = [
    { id: 'all', label: 'সকল ফটো' },
    { id: 'campus', label: 'ক্যাম্পাস ও পরিবেশ' },
    { id: 'lab', label: 'বিজ্ঞান ও কম্পিউটার ল্যাব' },
    { id: 'classroom', label: 'শ্রেণিকক্ষ ও পাঠদান' },
    { id: 'sports', label: 'বার্ষিক ক্রীড়া' },
    { id: 'cultural', label: 'সাংস্কৃতিক ও জাতীয় দিবস' }
  ];

  return (
    <div className="bg-white border border-slate-300 shadow-sm rounded-xl overflow-hidden p-4 sm:p-5 space-y-4">
      {/* Header Bar with Title & Prev/Next Arrows */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-[#0275d8] rounded-lg">
              <ImageIcon className="w-5 h-5" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
              {title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Carousel Prev/Next Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs text-[#0275d8] hover:text-[#01549b] font-bold px-2 py-1 rounded hover:bg-sky-50 transition"
            >
              গ্যালারী পেজ দেখুন →
            </button>
          )}
          <button
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#0275d8] hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 shadow-xs"
            title="পূর্ববর্তী ছবি"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#0275d8] hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 shadow-xs"
            title="পরবর্তী ছবি"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-[#0275d8] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Horizontal Scrolling Photo Slider Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scroll-smooth"
      >
        {filteredItems.map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => openLightbox(idx)}
            className="group relative shrink-0 w-64 sm:w-72 bg-slate-900 rounded-lg overflow-hidden border border-slate-200 shadow-xs cursor-pointer aspect-[16/11] select-none"
          >
            <img
              src={item.url}
              alt={item.titleBn || item.title}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
              loading="lazy"
            />
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            {/* Top Tag */}
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-black/60 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                {item.album || 'ক্যাম্পাস'}
              </span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-2.5 text-white z-10 space-y-0.5">
              <h4 className="font-bold text-xs line-clamp-1 group-hover:text-amber-300 transition-colors">
                {item.titleBn || item.title}
              </h4>
              <p className="text-[10px] text-slate-300 line-clamp-1">
                {item.description || item.date}
              </p>
            </div>

            {/* Center Zoom Hover Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-[#0275d8]/80 text-white flex items-center justify-center shadow-lg backdrop-blur-xs">
                <Maximize2 className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="w-full py-12 text-center text-slate-400 text-xs">
            এই ক্যাটাগরিতে কোনো ছবি পাওয়া যায়নি।
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <SchoolLightboxModal
          isOpen={lightboxOpen}
          slides={filteredItems.map((f) => ({
            id: f.id,
            url: f.url,
            title: f.title,
            titleBn: f.titleBn || f.title,
            caption: f.description,
            date: f.date,
            badge: f.album
          }))}
          initialIndex={activePhotoIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};

// 3. FULLSCREEN INTERACTIVE LIGHTBOX MODAL COMPONENT
export const SchoolLightboxModal: React.FC<{
  isOpen: boolean;
  slides: SchoolSlideItem[];
  initialIndex?: number;
  onClose: () => void;
}> = ({ isOpen, slides, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
  }, [initialIndex]);

  // Handle Keyboard Navigation (Esc, Left, Right)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        setZoomLevel(1);
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        setZoomLevel(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, slides.length, onClose]);

  if (!isOpen || slides.length === 0) return null;

  const currentSlide = slides[currentIndex] || slides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setZoomLevel(1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setZoomLevel(1);
  };

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.5 : 1));
  };

  return (
    <div
      id="school-lightbox-modal"
      className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-2 sm:p-4 backdrop-blur-md select-none animate-fadeIn"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between text-white pb-2 border-b border-white/10 z-20">
        <div className="flex items-center gap-2.5">
          <span className="bg-sky-600 text-white font-bold text-xs px-2.5 py-1 rounded">
            ছবি {currentIndex + 1} / {slides.length}
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-200 truncate max-w-xs sm:max-w-md">
            {currentSlide?.titleBn || currentSlide?.title}
          </span>
        </div>

        {/* Right Tools: Zoom, Share, Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleZoom}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition"
            title={zoomLevel > 1 ? 'জুম আউট' : 'জুম ইন'}
          >
            {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>
          <a
            href={currentSlide?.url}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition"
            title="মূল ছবি ওপেন করুন"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition flex items-center gap-1 font-bold text-xs"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">বন্ধ করুন</span>
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden my-2">
        <img
          src={currentSlide?.url}
          alt={currentSlide?.titleBn || currentSlide?.title}
          style={{ transform: `scale(${zoomLevel})` }}
          className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300 cursor-zoom-in"
          onClick={toggleZoom}
        />

        {/* Prev / Next Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-sky-600 text-white flex items-center justify-center border border-white/20 transition-all shadow-xl"
          title="পূর্ববর্তী ছবি (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-sky-600 text-white flex items-center justify-center border border-white/20 transition-all shadow-xl"
          title="পরবর্তী ছবি (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Info & Thumbnail Strip */}
      <div className="space-y-2 z-20">
        {/* Caption Bar */}
        <div className="bg-white/10 rounded-lg p-2.5 text-center text-white max-w-2xl mx-auto backdrop-blur-xs">
          <p className="text-xs sm:text-sm font-bold text-amber-300">
            {currentSlide?.titleBn || currentSlide?.title}
          </p>
          {currentSlide?.caption && (
            <p className="text-xs text-slate-300 mt-0.5">{currentSlide.caption}</p>
          )}
        </div>

        {/* Thumbnails Row */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-thin">
          {slides.map((s, idx) => (
            <button
              key={s.id || idx}
              onClick={() => {
                setCurrentIndex(idx);
                setZoomLevel(1);
              }}
              className={`w-12 h-8 sm:w-16 sm:h-10 rounded overflow-hidden border-2 transition-all shrink-0 ${
                idx === currentIndex
                  ? 'border-amber-400 scale-110 opacity-100 ring-2 ring-amber-400/50'
                  : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={s.url} alt={s.titleBn} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
