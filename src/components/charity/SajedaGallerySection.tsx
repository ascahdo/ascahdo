import React, { useState } from 'react';
import { Image as ImageIcon, Video, Eye, X, Filter, Sparkles } from 'lucide-react';
import { SYF_GALLERY_ITEMS } from '../../data/sajedaCharityData';
import { GalleryMediaItem } from '../../types/donationTypes';

export const SajedaGallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedLightboxItem, setSelectedLightboxItem] = useState<GalleryMediaItem | null>(null);

  const categories = [
    { id: 'all', labelBn: 'সকল ছবি' },
    { id: 'disaster', labelBn: 'দুর্যোগ ত্রাণ' },
    { id: 'education', labelBn: 'শিক্ষা সহায়তা' },
    { id: 'healthcare', labelBn: 'স্বাস্থ্যসেবা' },
    { id: 'charity', labelBn: 'মানবকল্যাণ' },
    { id: 'volunteers', labelBn: 'স্বেচ্ছাসেবক' }
  ];

  const filteredItems = SYF_GALLERY_ITEMS.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <section className="py-16 lg:py-24 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-left">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <ImageIcon className="w-4 h-4 text-emerald-700" />
              <span>Visual Documentary Gallery</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              আমাদের মাঠপর্যায়ের চিত্রশালা
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              সাজেদা ইয়ুথ ফাউন্ডেশনের প্রতিটি সেবা কার্যক্রমের বাস্তব মুহূর্ত ক্যামেরাবন্দী।
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat.labelBn}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedLightboxItem(item)}
              className="relative h-64 rounded-3xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 bg-slate-900"
            >
              <img
                src={item.url}
                alt={item.titleBn}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

              {/* Hover Details Overlay */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition duration-300 text-white text-left">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-600/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.categoryBn}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-black leading-snug">{item.titleBn}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{item.captionBn}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedLightboxItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 animate-in zoom-in-95">
            <button
              onClick={() => setSelectedLightboxItem(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/70 text-white flex items-center justify-center hover:bg-slate-950 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedLightboxItem.url}
              alt={selectedLightboxItem.titleBn}
              className="w-full max-h-[70vh] object-contain bg-black"
            />

            <div className="p-5 text-white text-left space-y-1 bg-slate-900">
              <span className="text-xs text-amber-300 font-bold">{selectedLightboxItem.categoryBn} • {selectedLightboxItem.dateBn}</span>
              <h3 className="text-base font-black">{selectedLightboxItem.titleBn}</h3>
              <p className="text-xs text-slate-300">{selectedLightboxItem.captionBn}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
