import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { useAuth } from '../context/AuthContext';
import {
  ChevronLeft, ChevronRight, Upload, Sparkles, Image as ImageIcon,
  Maximize2, X, Heart, MapPin, Calendar, User, Eye,
  Play, Pause, Grid, Layers, Search, Plus, CheckCircle,
  ExternalLink, Download, Share2, Trash2, Tag, AlertCircle, RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export interface GalleryPhotoItem {
  id: string;
  title: string;
  titleBn: string;
  description?: string;
  descriptionBn?: string;
  imageUrl: string;
  category: string;
  categoryBn?: string;
  location?: string;
  locationBn?: string;
  date?: string;
  uploaderName?: string;
  likesCount?: number;
  featured?: boolean;
}

const CATEGORY_OPTIONS = [
  { id: 'all', labelBn: 'সকল ছবি', labelEn: 'All Photos', icon: Layers },
  { id: 'relief', labelBn: 'ত্রাণ ও পুনর্বাসন', labelEn: 'Disaster Relief', icon: Heart },
  { id: 'sajeda', labelBn: 'সাজেদা ইয়ুথ', labelEn: 'Sajeda Youth', icon: Sparkles },
  { id: 'medical', labelBn: 'মেডিকেল ক্যাম্প', labelEn: 'Medical Camps', icon: Eye },
  { id: 'blood', labelBn: 'রক্তদান কর্মসূচি', labelEn: 'Blood Drives', icon: Heart },
  { id: 'education', labelBn: 'শিক্ষা ও প্রশিক্ষণ', labelEn: 'Education & IT', icon: Tag },
  { id: 'plantation', labelBn: 'বৃক্ষরোপণ', labelEn: 'Plantation', icon: Tag },
  { id: 'branch', labelBn: 'শাখা সম্মেলন', labelEn: 'Branch Meetings', icon: MapPin },
];

interface HomePhotoGallerySliderProps {
  onNavigate?: (view: string) => void;
  onOpenDonate?: () => void;
}

export const HomePhotoGallerySlider: React.FC<HomePhotoGallerySliderProps> = ({
  onNavigate,
  onOpenDonate
}) => {
  const { isBn } = useTranslation();
  const { user } = useAuth();

  const [photos, setPhotos] = useState<GalleryPhotoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');

  // Lightbox Modal
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhotoItem | null>(null);

  // Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadSource, setUploadSource] = useState<'file' | 'url'>('file');
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [uploadTitleBn, setUploadTitleBn] = useState<string>('');
  const [uploadTitleEn, setUploadTitleEn] = useState<string>('');
  const [uploadCategory, setUploadCategory] = useState<string>('relief');
  const [uploadLocationBn, setUploadLocationBn] = useState<string>('বসুরহাট, নোয়াখালী');
  const [uploadUploaderName, setUploadUploaderName] = useState<string>(user?.fullName || 'স্বেচ্ছাসেবক');
  const [uploadDescriptionBn, setUploadDescriptionBn] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string>('');
  const [likedPhotoIds, setLikedPhotoIds] = useState<Set<string>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_INTERVAL = 5000;

  // Load photos from API
  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const data = await api.getGalleryPhotos();
      if (Array.isArray(data) && data.length > 0) {
        setPhotos(data);
      } else {
        // Fallback default
        setPhotos([]);
      }
    } catch (err) {
      console.error('Failed to load gallery photos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Filtered photos based on category & search
  const filteredPhotos = (photos || []).filter((item) => {
    if (!item) return false;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.titleBn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locationBn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryBn?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Keep currentIndex in bounds when filtered photos change
  useEffect(() => {
    if (currentIndex >= filteredPhotos.length) {
      setCurrentIndex(0);
    }
  }, [filteredPhotos.length, currentIndex]);

  // Auto-play timer
  useEffect(() => {
    if (isAutoPlaying && !isHovered && filteredPhotos.length > 1 && viewMode === 'slider') {
      timerRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredPhotos.length);
      }, SLIDE_INTERVAL);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isAutoPlaying, isHovered, filteredPhotos.length, viewMode]);

  // Smooth scroll active thumbnail within its parent container only (never scrolling the window)
  useEffect(() => {
    if (thumbnailScrollRef.current) {
      const container = thumbnailScrollRef.current;
      const activeThumb = container.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        const targetScrollLeft = activeThumb.offsetLeft - (container.clientWidth / 2) + (activeThumb.clientWidth / 2);
        container.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (filteredPhotos.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const handlePrev = () => {
    if (filteredPhotos.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  // Like a photo
  const handleLike = async (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    if (likedPhotoIds.has(photoId)) return;

    setLikedPhotoIds((prev) => new Set(prev).add(photoId));
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, likesCount: (p.likesCount || 0) + 1 } : p))
    );

    try {
      await api.likeGalleryPhoto(photoId);
    } catch (err) {
      console.error('Failed to register like', err);
    }
  };

  // Delete a photo (Admin/Authorized)
  const handleDelete = async (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    if (!window.confirm(isBn ? 'আপনি কি এই ছবিটি গ্যালারি থেকে মুছে ফেলতে চান?' : 'Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      await api.deleteGalleryPhoto(photoId);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      if (lightboxPhoto?.id === photoId) {
        setLightboxPhoto(null);
      }
    } catch (err) {
      console.error('Failed to delete photo', err);
    }
  };

  // Handle File Input Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(isBn ? 'অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন' : 'Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit new photo upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadPreview) {
      alert(isBn ? 'অনুগ্রহ করে ছবি নির্বাচন বা ইমেজ লিঙ্ক প্রদান করুন' : 'Please select an image or provide an image link');
      return;
    }
    if (!uploadTitleBn.trim()) {
      alert(isBn ? 'অনুগ্রহ করে ছবির শিরোনাম বা বিবরণ দিন' : 'Please provide a photo title/description');
      return;
    }

    setIsUploading(true);
    try {
      const selectedCategoryObj = CATEGORY_OPTIONS.find((c) => c.id === uploadCategory);
      const payload = {
        title: uploadTitleEn || uploadTitleBn,
        titleBn: uploadTitleBn,
        imageUrl: uploadPreview,
        category: uploadCategory,
        categoryBn: selectedCategoryObj?.labelBn || 'সাধারণ কার্যক্রম',
        location: uploadLocationBn,
        locationBn: uploadLocationBn,
        uploaderName: uploadUploaderName || user?.fullName || 'সদস্য',
        description: uploadDescriptionBn,
        descriptionBn: uploadDescriptionBn,
        date: new Date().toISOString().split('T')[0],
        featured: true
      };

      const res = await api.createGalleryPhoto(payload);
      if (res && res.id) {
        setPhotos((prev) => [res, ...prev]);
        setCurrentIndex(0);
        setUploadSuccessMsg(isBn ? 'ছবিটি সফলভাবে আপলোড ও গ্যালারিতে যুক্ত হয়েছে!' : 'Photo uploaded successfully!');
        setTimeout(() => {
          setUploadSuccessMsg('');
          setIsUploadModalOpen(false);
          // reset form
          setUploadPreview('');
          setUploadTitleBn('');
          setUploadTitleEn('');
          setUploadDescriptionBn('');
        }, 1200);
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert(isBn ? 'ছবি আপলোড করতে সমস্যা হয়েছে' : 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const activePhoto = filteredPhotos[currentIndex] || photos[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6">
      {/* 1. Header & Quick Action Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-5 sm:p-7 text-white shadow-2xl border border-emerald-800/40 relative overflow-hidden mb-6">
        {/* Background glow & subtle patterns */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10">
          {/* Top Line: Badge + Counter + Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <ImageIcon className="w-3.5 h-3.5 text-emerald-300" />
                {isBn ? 'সেন্ট্রাল ফটো গ্যালারি স্লাইডার' : 'Live Activity Photo Gallery'}
              </span>

              <span className="text-xs text-slate-300 font-semibold hidden sm:inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isBn
                  ? `মোট ${photos.length}টি সংরক্ষিত ও আপলোডকৃত ছবি`
                  : `Total ${photos.length} Uploaded Activity Photos`}
              </span>
            </div>

            {/* View Mode & Upload Buttons */}
            <div className="flex items-center gap-2">
              {/* Autoplay Toggle */}
              {viewMode === 'slider' && (
                <button
                  onClick={() => setIsAutoPlaying((prev) => !prev)}
                  title={isAutoPlaying ? (isBn ? 'অটো-প্লে থামান' : 'Pause Autoplay') : (isBn ? 'অটো-প্লে চালু করুন' : 'Start Autoplay')}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
                >
                  {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                  <span className="hidden md:inline">{isAutoPlaying ? (isBn ? 'পজ' : 'Pause') : (isBn ? 'প্লে' : 'Play')}</span>
                </button>
              )}

              {/* View Switcher: Slider vs Grid */}
              <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700">
                <button
                  onClick={() => setViewMode('slider')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === 'slider'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isBn ? 'স্লাইডার' : 'Slider'}</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>{isBn ? 'সব ছবি' : 'All Grid'}</span>
                </button>
              </div>

              {/* Upload Photo Button */}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-900/40 hover:shadow-emerald-700/50 transition flex items-center gap-2 border border-emerald-400/40 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isBn ? 'ছবি আপলোড করুন' : 'Upload Photo'}</span>
              </button>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                {isBn
                  ? 'এসকাডো ও সাজেদা ফাউন্ডেশনের মাঠপর্যায়ের দৃশ্যচিত্র'
                  : 'Field Action & Humanitarian Event Showcase'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                {isBn
                  ? 'বন্যা পুনর্বাসন, ফ্রি মেডিকেল ক্যাম্প, স্বেচ্ছায় রক্তদান, এতিম সহায়তা ও কারিগরি প্রশিক্ষণের সকল আপলোডকৃত সত্য ছবিসমূহ।'
                  : 'Live visual documentary of our disaster relief, free healthcare, blood drives, orphan care, and youth empowerment across Bangladesh.'}
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isBn ? 'ইভেন্ট বা জেলা দিয়ে খুঁজুন...' : 'Search event, district...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_OPTIONS.map((cat) => {
              const count =
                cat.id === 'all'
                  ? (photos || []).length
                  : (photos || []).filter((p) => p && p.category === cat.id).length;
              const IconComp = cat.icon;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{isBn ? cat.labelBn : cat.labelEn}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-emerald-700 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Gallery Presentation */}
      {loading ? (
        <div className="bg-slate-100 rounded-3xl h-96 flex flex-col items-center justify-center gap-3 text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-semibold">{isBn ? 'গ্যালারির ছবি লোড হচ্ছে...' : 'Loading photo gallery...'}</p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {isBn ? 'কোনো ছবি পাওয়া যায়নি' : 'No photos found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            {isBn
              ? 'এই ক্যাটাগরিতে এখনো কোনো ছবি আপলোড করা হয়নি। আপনি প্রথম ছবি আপলোড করতে পারেন।'
              : 'No photos in this category yet. Be the first to upload one!'}
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black inline-flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? 'নতুন ছবি আপলোড করুন' : 'Upload First Photo'}</span>
          </button>
        </div>
      ) : viewMode === 'slider' ? (
        /* ==================== SLIDER VIEW ==================== */
        <div
          className="space-y-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Cinematic Showcase Frame */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 aspect-[16/9] sm:aspect-[21/9] max-h-[540px] group">
            {/* Image display */}
            <img
              src={activePhoto.imageUrl}
              alt={activePhoto.titleBn || activePhoto.title}
              className="w-full h-full object-cover transition-all duration-700 ease-out transform group-hover:scale-105"
            />

            {/* Dark gradient overlay for typography readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent pointer-events-none" />

            {/* Top Bar inside Slide: Category Badge, Photo Index, Fullscreen Zoom */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-xl bg-emerald-700/90 text-white text-xs font-extrabold backdrop-blur-md border border-emerald-400/40 shadow-lg flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-emerald-200" />
                  {activePhoto.categoryBn || activePhoto.category}
                </span>

                {activePhoto.locationBn && (
                  <span className="px-3 py-1 rounded-xl bg-black/60 text-slate-200 text-xs font-semibold backdrop-blur-md border border-white/10 hidden sm:inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {activePhoto.locationBn}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Photo Counter Pill */}
                <span className="px-3 py-1 rounded-xl bg-black/60 text-white text-xs font-black backdrop-blur-md border border-white/10">
                  {isBn
                    ? `ছবি ${currentIndex + 1} / ${filteredPhotos.length}`
                    : `Photo ${currentIndex + 1} of ${filteredPhotos.length}`}
                </span>

                {/* Lightbox / Zoom Button */}
                <button
                  onClick={() => setLightboxPhoto(activePhoto)}
                  className="p-2 rounded-xl bg-black/60 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 transition shadow-lg cursor-pointer"
                  title={isBn ? 'ফুলস্ক্রিন জুম ভিউ' : 'Fullscreen Zoom View'}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-black/50 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition opacity-80 hover:opacity-100 hover:scale-110 z-20 shadow-xl cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-black/50 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition opacity-80 hover:opacity-100 hover:scale-110 z-20 shadow-xl cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Details Box at Bottom */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 sm:bottom-6 z-20">
              <div className="bg-slate-900/85 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/15 text-white shadow-2xl max-w-3xl">
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mb-1.5">
                  {activePhoto.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      {activePhoto.date}
                    </span>
                  )}
                  {activePhoto.uploaderName && (
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-teal-400" />
                      {activePhoto.uploaderName}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-xl md:text-2xl font-black text-white leading-snug mb-1">
                  {isBn ? activePhoto.titleBn : activePhoto.title || activePhoto.titleBn}
                </h3>

                {(activePhoto.descriptionBn || activePhoto.description) && (
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-3">
                    {isBn ? activePhoto.descriptionBn : activePhoto.description || activePhoto.descriptionBn}
                  </p>
                )}

                {/* Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-700/60">
                  <div className="flex items-center gap-2">
                    {/* Like Button */}
                    <button
                      onClick={(e) => handleLike(e, activePhoto.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                        likedPhotoIds.has(activePhoto.id)
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-slate-800 hover:bg-rose-950/60 text-slate-200 hover:text-rose-300 border-slate-700'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          likedPhotoIds.has(activePhoto.id) ? 'fill-white' : ''
                        }`}
                      />
                      <span>{activePhoto.likesCount || 0}</span>
                      <span>{isBn ? 'লাইক' : 'Likes'}</span>
                    </button>

                    {/* View Fullscreen */}
                    <button
                      onClick={() => setLightboxPhoto(activePhoto)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-400" />
                      <span>{isBn ? 'বিস্তারিত দেখুন' : 'View Full'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Sajeda Charity Link if related */}
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('charity')}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 transition shadow cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isBn ? 'সাজেদা ইয়ুথ পোর্টাল' : 'SYF Charity Portal'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Progress Bar */}
            {isAutoPlaying && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 z-30">
                <div
                  key={currentIndex}
                  className="h-full bg-emerald-400 animate-[progress_5s_linear_infinite]"
                  style={{ animationDuration: `${SLIDE_INTERVAL}ms` }}
                />
              </div>
            )}
          </div>

          {/* 3. Horizontal Thumbnail Strip with quick navigation */}
          <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 mb-2">
              <span className="font-bold text-slate-300 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                {isBn ? 'সকল থাম্বনেইল প্রিভিউ (ক্লিক করে জাম্প করুন)' : 'Thumbnail Strip (Click to view)'}
              </span>
              <span className="text-[11px]">
                {currentIndex + 1} / {filteredPhotos.length}
              </span>
            </div>

            <div
              ref={thumbnailScrollRef}
              className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-slate-800"
            >
              {filteredPhotos.map((photo, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={photo.id || idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative flex-shrink-0 w-24 sm:w-28 h-16 sm:h-18 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'border-emerald-400 ring-2 ring-emerald-500/50 scale-105 shadow-lg shadow-emerald-950'
                        : 'border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500'
                    }`}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.titleBn || photo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    {isActive && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white font-bold px-1 py-0.5 truncate text-left">
                      {photo.titleBn || photo.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ==================== GRID VIEW (ALL PHOTOS) ==================== */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              onClick={() => setLightboxPhoto(photo)}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Photo Frame */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={photo.imageUrl}
                  alt={photo.titleBn || photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Badge */}
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-emerald-700/90 text-white text-[10px] font-extrabold shadow">
                  {photo.categoryBn || photo.category}
                </span>

                {/* Hover overlay zoom */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="p-2.5 rounded-full bg-white/90 text-slate-900 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Maximize2 className="w-5 h-5 text-emerald-700" />
                  </span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition">
                    {isBn ? photo.titleBn : photo.title || photo.titleBn}
                  </h4>
                  {photo.locationBn && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      {photo.locationBn}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-xs text-slate-500">
                  <span className="text-[10px]">{photo.date}</span>
                  <button
                    onClick={(e) => handleLike(e, photo.id)}
                    className={`flex items-center gap-1 font-bold ${
                      likedPhotoIds.has(photo.id) ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${likedPhotoIds.has(photo.id) ? 'fill-rose-600' : ''}`}
                    />
                    <span>{photo.likesCount || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================== 4. PHOTO UPLOAD MODAL ==================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-7 border border-slate-200 relative my-8">
            {/* Close Button */}
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {isBn ? 'নতুন ফটো আপলোড করুন' : 'Upload Activity Photo'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn
                    ? 'কার্যক্রম বা ইভেন্টের ছবি আপলোড করলে তা সাথে সাথে স্লাইডারে দৃশ্যমান হবে।'
                    : 'Uploaded photos will be immediately published to the live gallery slider.'}
                </p>
              </div>
            </div>

            {uploadSuccessMsg ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="font-black text-slate-900 text-lg">{uploadSuccessMsg}</h4>
                <p className="text-xs text-slate-500">{isBn ? 'গ্যালারি রিফ্রেশ করা হচ্ছে...' : 'Refreshing gallery...'}</p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* Upload Source Toggle: Local File vs Image URL */}
                <div className="flex rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setUploadSource('file')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      uploadSource === 'file'
                        ? 'bg-white text-emerald-800 shadow'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📁 {isBn ? 'ডিভাইস থেকে ফাইল সিলেক্ট' : 'Select from Device'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadSource('url')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      uploadSource === 'url'
                        ? 'bg-white text-emerald-800 shadow'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🔗 {isBn ? 'অনলাইন ইমেজ URL' : 'Image URL'}
                  </button>
                </div>

                {/* File Dropzone or URL input */}
                {uploadSource === 'file' ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/50 transition group"
                    >
                      {uploadPreview ? (
                        <div className="relative aspect-[16/9] max-h-48 rounded-xl overflow-hidden mx-auto shadow">
                          <img
                            src={uploadPreview}
                            alt="Upload preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-bold text-white bg-black/70 px-3 py-1 rounded-lg">
                              {isBn ? 'ছবি পরিবর্তন করুন' : 'Change Image'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                          <p className="text-xs font-bold text-slate-800">
                            {isBn ? 'ছবি ক্লিক করে বাছাই করুন বা ড্র্যাগ করুন' : 'Click to browse or drag & drop'}
                          </p>
                          <p className="text-[11px] text-slate-400">JPG, PNG, WebP (Max 10MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBn ? 'ইমেজ লিঙ্ক (Image URL)' : 'Direct Image URL'} *
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={uploadPreview}
                      onChange={(e) => setUploadPreview(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                    {uploadPreview && (
                      <div className="mt-2 aspect-[16/9] max-h-36 rounded-xl overflow-hidden border border-slate-200">
                        <img
                          src={uploadPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => alert(isBn ? 'ভুল ইমেজ লিঙ্ক' : 'Invalid image URL')}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Title (Bangla) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'ছবির শিরোনাম (বাংলায়)' : 'Photo Title (Bangla)'} *
                  </label>
                  <input
                    type="text"
                    placeholder={isBn ? 'যেমন: ফেনী বন্যা পুনর্বাসন খাদ্য বিতরণ কর্মসূচি' : 'e.g. Flood relief food distribution'}
                    value={uploadTitleBn}
                    onChange={(e) => setUploadTitleBn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Category & Location Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBn ? 'ক্যাটাগরি / অ্যালবাম' : 'Category / Album'} *
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                    >
                      {CATEGORY_OPTIONS.filter((c) => c.id !== 'all').map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {isBn ? cat.labelBn : cat.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBn ? 'জেলা / স্থান' : 'Location / District'}
                    </label>
                    <input
                      type="text"
                      placeholder="বসুরহাট, নোয়াখালী"
                      value={uploadLocationBn}
                      onChange={(e) => setUploadLocationBn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)' : 'Description (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={isBn ? 'ইভেন্ট বা কার্যক্রমের সংক্ষিপ্ত বিবরণ লিখুন...' : 'Brief summary of the activity...'}
                    value={uploadDescriptionBn}
                    onChange={(e) => setUploadDescriptionBn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isBn ? 'আপলোড হচ্ছে...' : 'Uploading...'}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>{isBn ? 'ফটো আপলোড সম্পন্ন করুন' : 'Publish Photo'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==================== 5. FULLSCREEN LIGHTBOX MODAL ==================== */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-md animate-fade-in">
          {/* Close Lightbox */}
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl w-full max-h-[92vh] flex flex-col rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
            {/* Image display */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[68vh]">
              <img
                src={lightboxPhoto.imageUrl}
                alt={lightboxPhoto.titleBn || lightboxPhoto.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Details Bar */}
            <div className="p-4 sm:p-6 bg-slate-950 text-white border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 text-xs text-slate-400">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-700 text-white font-bold text-[10px]">
                    {lightboxPhoto.categoryBn || lightboxPhoto.category}
                  </span>
                  {lightboxPhoto.locationBn && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {lightboxPhoto.locationBn}
                    </span>
                  )}
                  {lightboxPhoto.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {lightboxPhoto.date}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-black text-white">
                  {isBn ? lightboxPhoto.titleBn : lightboxPhoto.title || lightboxPhoto.titleBn}
                </h3>
                {(lightboxPhoto.descriptionBn || lightboxPhoto.description) && (
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    {isBn ? lightboxPhoto.descriptionBn : lightboxPhoto.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleLike(e, lightboxPhoto.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
                    likedPhotoIds.has(lightboxPhoto.id)
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedPhotoIds.has(lightboxPhoto.id) ? 'fill-white' : ''
                    }`}
                  />
                  <span>{lightboxPhoto.likesCount || 0}</span>
                </button>

                <a
                  href={lightboxPhoto.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  title={isBn ? 'আসল ছবি খুলুন / ডাউনলোড' : 'Open / Download Original'}
                >
                  <Download className="w-4 h-4" />
                </a>

                {/* Delete button */}
                <button
                  onClick={(e) => handleDelete(e, lightboxPhoto.id)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/80 text-rose-300 border border-slate-700 transition"
                  title={isBn ? 'ছবি মুছুন' : 'Delete Photo'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
