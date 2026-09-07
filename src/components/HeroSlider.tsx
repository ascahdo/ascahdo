import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { useAuth } from '../context/AuthContext';
import {
  ChevronLeft, ChevronRight, Sparkles, Heart, HeartPulse,
  BookOpen, ShoppingBag, Pause, Play, Edit3, ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

interface HeroSlide {
  id: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  badge: string;
  badgeBn: string;
  imageUrl: string;
  buttonText: string;
  buttonTextBn: string;
  buttonAction: string;
  secondaryButtonText?: string;
  secondaryButtonTextBn?: string;
  secondaryButtonAction?: string;
  active?: boolean;
}

interface HeroSliderProps {
  onNavigate: (view: string) => void;
  onOpenDonationModal: (campaign?: any) => void;
  onOpenBloodSOS: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onNavigate,
  onOpenDonationModal,
  onOpenBloodSOS
}) => {
  const { isBn } = useTranslation();
  const { user } = useAuth();

  const defaultSlides: HeroSlide[] = [
    {
      id: 'slide_1',
      title: 'Integrated Technology for Transparent Social Welfare',
      titleBn: 'স্বচ্ছ সমাজ বিনির্মাণে সমন্বিত ডিজিটাল ব্যবস্থাপনা',
      subtitle: 'Connecting 64 districts with emergency blood bank, transparent donation funds, interest-free somiti loans, vocational education, and fair marketplace.',
      subtitleBn: 'জরুরি রক্তসেবা, স্বচ্ছ অনুদান তহবিল, সুদবিহীন ক্ষুদ্রঋণ সমিতি, মাদ্রাসা ও স্কুল অ্যাকাডেমি এবং যৌথ মার্কেটপ্লেস সেবা সমন্বয়।',
      badge: 'Government Approved & Verified NGO Network',
      badgeBn: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত ও ভেরিফাইড প্ল্যাটফর্ম',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80',
      buttonText: 'Donate Now',
      buttonTextBn: 'অনলাইনে অনুদান দিন',
      buttonAction: 'donation',
      secondaryButtonText: 'Emergency Blood SOS',
      secondaryButtonTextBn: 'জরুরি রক্ত আবেদন',
      secondaryButtonAction: 'blood_sos'
    },
    {
      id: 'slide_2',
      title: 'Instant Emergency Blood Donation Bank Across 64 Districts',
      titleBn: '৬৪ জেলায় দ্রুততম জরুরি রক্তসেবা ও লাইভ রক্তদাতা নেটওয়ার্ক',
      subtitle: 'Find verified blood donors in minutes by blood group, district, and upazila without any middleman.',
      subtitleBn: 'রক্তের গ্রুপ, জেলা ও উপজেলা ভিত্তিক ভেরিফাইড রক্তদাতাদের সাথে তাৎক্ষণিক সরাসরি যোগাযোগ ও হাসপাতাল এসওএস।',
      badge: 'Live 24/7 Blood SOS Support',
      badgeBn: '২৪/৭ লাইভ রক্তদাতা ও জরুরি হাসপাতাল সাপোর্ট',
      imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1600&auto=format&fit=crop&q=80',
      buttonText: 'Find Blood Donor',
      buttonTextBn: 'রক্তদাতা খুঁজুন',
      buttonAction: 'blood-bank',
      secondaryButtonText: 'Register as Donor',
      secondaryButtonTextBn: 'রক্তদাতা হিসেবে নিবন্ধন',
      secondaryButtonAction: 'blood-bank'
    },
    {
      id: 'slide_3',
      title: '100% Transparent Donation Funds & Verified Relief Tracking',
      titleBn: '১০০% স্বচ্ছ অনুদান তহবিল ও ডিজিটাল অডিট লেজার',
      subtitle: 'Every taka donated is publicly recorded with instant digital PDF receipt and real-time project expense tracking.',
      subtitleBn: 'বন্যা, শীতবস্ত্র, এতিম পুনর্বাসন ও মসজিদ নির্মাণ তহবিলে সরাসরি স্বচ্ছ অনুদান ও ডিজিটাল অডিট ট্র্যাকিং।',
      badge: 'Zero Hidden Fees & Instant Receipt',
      badgeBn: 'শতভাগ স্বচ্ছতা ও স্বয়ংক্রিয় ডিজিটাল রসিদ',
      imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&auto=format&fit=crop&q=80',
      buttonText: 'Support a Cause',
      buttonTextBn: 'তহবিলে অংশ নিন',
      buttonAction: 'donation',
      secondaryButtonText: 'View Public Ledger',
      secondaryButtonTextBn: 'স্বচ্ছ হিসাব দেখুন',
      secondaryButtonAction: 'donation'
    },
    {
      id: 'slide_4',
      title: 'Skill Development & Free Technical Academy',
      titleBn: 'কারিগরি ও আইসিটি দক্ষতা উন্নয়ন প্রশিক্ষণ একাডেমি',
      subtitle: 'Empowering youth and rural communities with coding, graphic design, agriculture technology, and vocational certifications.',
      subtitleBn: 'যুবসমাজ ও সুবিধাবঞ্চিতদের স্বাবলম্বী করতে আধুনিক আইটি ও কারিগরি কোর্সে বিনামূল্যে এবং স্বল্প খরচে শিক্ষা।',
      badge: 'Certified Vocational LMS Platform',
      badgeBn: 'অনলাইন সার্টিফিকেট ও কর্মসংস্থান সহায়তা',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&auto=format&fit=crop&q=80',
      buttonText: 'Explore Courses',
      buttonTextBn: 'কোর্সসমূহ দেখুন',
      buttonAction: 'training',
      secondaryButtonText: 'Digital School',
      secondaryButtonTextBn: 'ডিজিটাল স্কুল পোর্টাল',
      secondaryButtonAction: 'school'
    }
  ];

  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Auto-play timer (5.5 seconds per slide)
  const SLIDE_DURATION = 5500;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const fetched = await api.getHeroSlides();
        if (fetched && Array.isArray(fetched) && fetched.length > 0) {
          const activeOnes = fetched.filter((s: any) => s.active !== false);
          if (activeOnes.length > 0) {
            setSlides(activeOnes);
          }
        }
      } catch (err) {
        console.error('Could not fetch custom hero slides, using defaults', err);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (isAutoPlaying && !isHovered && slides.length > 1) {
      timerRef.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, SLIDE_DURATION);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, isAutoPlaying, isHovered, slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleButtonClick = (action?: string) => {
    if (!action) return;
    if (action === 'donation') {
      onOpenDonationModal();
    } else if (action === 'blood_sos') {
      onOpenBloodSOS();
    } else {
      onNavigate(action);
    }
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  if (!slides.length) return null;

  const current = slides[currentSlide] || slides[0];

  return (
    <div
      id="homepage-hero-slider"
      className="relative w-full overflow-hidden bg-slate-950 text-white select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images with Cross-fade */}
      <div className="relative h-[560px] sm:h-[580px] md:h-[620px] lg:h-[650px] w-full">
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none z-0'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover object-center transform transition-transform duration-10000 ease-linear scale-105"
            />
            {/* Multi-layered cinematic gradient overlays for high legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-900/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
            <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
          </div>
        ))}

        {/* Slide Content Layer */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
            <div className="max-w-3xl space-y-5 sm:space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg animate-fadeIn">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>{isBn ? (current.badgeBn || current.badge) : current.badge}</span>
              </div>

              {/* Heading */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight drop-shadow-md">
                {isBn ? (
                  <span className="text-white">
                    {current.titleBn || current.title}
                  </span>
                ) : (
                  <span className="text-white">
                    {current.title}
                  </span>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed line-clamp-3 sm:line-clamp-none max-w-2xl font-normal drop-shadow">
                {isBn ? (current.subtitleBn || current.subtitle) : current.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  id="slider-primary-cta"
                  onClick={() => handleButtonClick(current.buttonAction)}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl shadow-xl shadow-emerald-950/40 hover:shadow-emerald-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Heart className="w-4 h-4 text-emerald-200 fill-emerald-200" />
                  <span>{isBn ? (current.buttonTextBn || current.buttonText) : current.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {current.secondaryButtonText && (
                  <button
                    id="slider-secondary-cta"
                    onClick={() => handleButtonClick(current.secondaryButtonAction)}
                    className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-slate-500 text-xs sm:text-sm font-bold px-5 py-3.5 rounded-xl backdrop-blur-md shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {current.secondaryButtonAction === 'blood_sos' || current.secondaryButtonAction === 'blood-bank' ? (
                      <HeartPulse className="w-4 h-4 text-rose-400" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-amber-400" />
                    )}
                    <span>{isBn ? (current.secondaryButtonTextBn || current.secondaryButtonText) : current.secondaryButtonText}</span>
                  </button>
                )}

                {/* Admin direct edit button if logged in as admin */}
                {user && (user.role === 'super_admin' || user.role === 'org_admin') && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="inline-flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-3 rounded-xl backdrop-blur-md transition"
                    title={isBn ? 'স্লাইডার এডিট করুন' : 'Edit Slider in Admin'}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isBn ? 'স্লাইডার এডিট' : 'Edit Slides'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          id="hero-slider-prev-btn"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-emerald-600 text-white border border-slate-700/70 hover:border-emerald-500 backdrop-blur-md transition shadow-lg opacity-80 hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          id="hero-slider-next-btn"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-emerald-600 text-white border border-slate-700/70 hover:border-emerald-500 backdrop-blur-md transition shadow-lg opacity-80 hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Control Bar: Dots & Slide Counter & Auto-play toggle */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dot Indicators */}
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full h-2.5 ${
                  idx === currentSlide
                    ? 'w-8 bg-emerald-500 shadow-lg shadow-emerald-500/50'
                    : 'w-2.5 bg-slate-600/80 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {/* Controls: Counter and Play/Pause */}
          <div className="flex items-center gap-3 bg-slate-900/70 backdrop-blur-md border border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-mono">
            <span className="text-emerald-400 font-bold">0{currentSlide + 1}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">0{slides.length}</span>

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="ml-1 text-slate-400 hover:text-white transition"
              title={isAutoPlaying ? (isBn ? 'বিরতি দিন' : 'Pause Autoplay') : (isBn ? 'চালু করুন' : 'Play Autoplay')}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Continuous Active Slide Progress Bar at the Bottom */}
        {isAutoPlaying && !isHovered && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900/80 z-30 overflow-hidden">
            <div
              key={currentSlide}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-progressBar"
              style={{
                animationDuration: `${SLIDE_DURATION}ms`,
                animationTimingFunction: 'linear'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
