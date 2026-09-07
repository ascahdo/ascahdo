import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { HubBannerSlide } from '../../types/hubTypes';
import { useHubBranding } from '../../context/HubBrandingContext';

export const HubBannerSlider: React.FC<{
  hubId?: string;
  banners?: HubBannerSlide[];
  primaryColor?: string;
  onCtaClick?: (buttonLink: string) => void;
  onActionClick?: (buttonLink: string) => void;
}> = ({ hubId, banners: customBanners, primaryColor: customColor, onCtaClick, onActionClick }) => {
  const { getHubBranding } = useHubBranding();
  const hub = hubId ? getHubBranding(hubId as any) : undefined;
  
  const banners = customBanners || hub?.banners || [];
  const primaryColor = customColor || hub?.primaryColor || '#059669';
  const handleCta = onCtaClick || onActionClick;

  const activeBanners = (banners || []).filter((b) => b && b.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPlaying || activeBanners.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeBanners.length, currentIndex]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <div
      id="hub-banner-slider"
      className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-950 group select-none"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Slides Viewport */}
      <div className="relative aspect-[16/8] sm:aspect-[21/9] lg:aspect-[24/9] w-full overflow-hidden">
        {activeBanners.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Slide Image */}
            <img
              src={slide.imageUrl}
              alt={slide.titleBn || slide.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />

            {/* Slide Content Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-3xl">
              {/* Badge */}
              {(slide.badgeBn || slide.badge) && (
                <div className="mb-2 sm:mb-3">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full text-white shadow-md backdrop-blur-md border border-white/20"
                    style={{ backgroundColor: `${primaryColor}cc` }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{slide.badgeBn || slide.badge}</span>
                  </span>
                </div>
              )}

              {/* Title */}
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white font-serif leading-tight drop-shadow-md">
                {slide.titleBn || slide.title}
              </h2>

              {/* Subtitle */}
              {(slide.subtitleBn || slide.subtitle) && (
                <p className="text-xs sm:text-sm lg:text-base text-slate-200 mt-2 sm:mt-3 leading-relaxed drop-shadow line-clamp-2 max-w-2xl">
                  {slide.subtitleBn || slide.subtitle}
                </p>
              )}

              {/* CTA Button */}
              {(slide.buttonTextBn || slide.buttonText) && (
                <div className="mt-4 sm:mt-6 flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (handleCta) {
                        handleCta(slide.buttonLink || '#');
                      } else if (slide.buttonLink?.startsWith('http')) {
                        window.open(slide.buttonLink, '_blank');
                      }
                    }}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl text-white shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span>{slide.buttonTextBn || slide.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls: Prev / Next */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/60 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 group-hover:opacity-100 hover:scale-110 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/60 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 group-hover:opacity-100 hover:scale-110 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Bottom Bar: Dots & Play/Pause */}
      <div className="absolute bottom-3 inset-x-0 z-30 flex items-center justify-between px-6">
        {/* Slide Counter & Play/Pause */}
        <div className="flex items-center gap-2 bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-white text-xs font-mono">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'স্লাইডার থামান' : 'স্লাইডার চালু করুন'}
            className="text-slate-300 hover:text-white transition cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          <span className="text-[11px] text-amber-300 font-bold">
            {currentIndex + 1} / {activeBanners.length}
          </span>
        </div>

        {/* Slide Indicator Dots */}
        <div className="flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
