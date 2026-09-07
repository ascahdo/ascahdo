import React, { useState, useEffect } from 'react';
import { useTranslation } from '../locales/i18nContext';
import {
  ShoppingBag, ShieldCheck, Tag, CheckCircle, Percent, Package,
  Truck, Search, Star, ArrowRight, Heart, Sparkles, PlusCircle,
  Phone, MapPin, CheckCircle2, Filter, ShoppingCart, Award, Clock,
  Download, Store, Layers, FileText, Check, ChevronRight, X, Key, Eye,
  Bot, HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import { AdBannerBox } from '../components/AdBannerBox';
import { MarketplaceCartDrawer, CartItem } from '../components/marketplace/MarketplaceCartDrawer';
import { ProductDetailsModal } from '../components/marketplace/ProductDetailsModal';
import { VendorRegistrationModal } from '../components/marketplace/VendorRegistrationModal';
import { VendorPortalView } from '../components/marketplace/VendorPortalView';
import { DigitalVaultModal } from '../components/marketplace/DigitalVaultModal';
import { DigitalSamplePreviewModal } from '../components/marketplace/DigitalSamplePreviewModal';
import { MarketplaceAiRobotModal } from '../components/marketplace/MarketplaceAiRobotModal';

export const MarketplacePage: React.FC = () => {
  const { isBn } = useTranslation();

  // Primary Data State
  const [products, setProducts] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'all' | 'digital' | 'physical' | 'bundles' | 'vendors' | 'portal'>('all');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVendorFilter, setSelectedVendorFilter] = useState<string | null>(null);

  // Cart State (stored in local state & localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ascado_marketplace_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals
  const [detailsProduct, setDetailsProduct] = useState<any | null>(null);
  const [isVendorRegOpen, setIsVendorRegOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<any | null>(null);
  const [isAiRobotOpen, setIsAiRobotOpen] = useState(false);
  const [aiRobotProduct, setAiRobotProduct] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ascado_marketplace_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Initial Fetch
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodsRes, bundlesRes, vendorsRes] = await Promise.all([
        api.getProducts().catch(() => []),
        api.getBundles().catch(() => []),
        api.getVendors().catch(() => [])
      ]);
      setProducts(prodsRes || []);
      setBundles(bundlesRes || []);
      setVendors(vendorsRes || []);
    } catch (err) {
      console.error('Failed to load marketplace data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart Handlers
  const handleAddToCart = (item: any) => {
    const isDigital = item.productType === 'digital' || item.type === 'digital' || item.isDigital;
    const isBundle = item.type === 'bundle';
    const type = isDigital ? 'digital' : isBundle ? 'bundle' : (item.type || 'physical');

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((p) => p.id === item.id);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.nameBn || item.titleBn || item.name,
          price: item.price,
          quantity: 1,
          type,
          imageUrl: item.imageUrl,
          downloadUrl: item.downloadUrl,
          fileFormat: item.fileFormat,
          weight: item.weight,
          sellerName: item.sellerName
        }
      ];
    });

    showToast(isBn ? `"${item.nameBn || item.titleBn || item.name}" কার্টে যোগ করা হয়েছে` : 'Item added to cart');
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const newQty = it.quantity + delta;
            return newQty > 0 ? { ...it, quantity: newQty } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleDirectOrder = (item: any) => {
    handleAddToCart(item);
    setIsCartOpen(true);
  };

  // Filtering Products
  const filteredProducts = (products || []).filter((p) => {
    if (!p) return false;

    // Vendor filter
    if (selectedVendorFilter && p.sellerId !== selectedVendorFilter) {
      return false;
    }

    // Tab filter
    if (activeTab === 'digital' && !(p.productType === 'digital' || p.type === 'digital' || p.isDigital)) {
      return false;
    }
    if (activeTab === 'physical' && (p.productType === 'digital' || p.type === 'digital' || p.isDigital)) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const pCat = (p.categoryBn || p.category || '').toLowerCase();
      if (!pCat.includes(selectedCategory.toLowerCase())) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (p.name && p.name.toLowerCase().includes(q)) || (p.nameBn && p.nameBn.toLowerCase().includes(q));
      const matchDesc = (p.description && p.description.toLowerCase().includes(q)) || (p.descriptionBn && p.descriptionBn.toLowerCase().includes(q));
      const matchCat = (p.category && p.category.toLowerCase().includes(q)) || (p.categoryBn && p.categoryBn.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    return true;
  });

  const activeVendorInfo = vendors.find((v) => v.id === selectedVendorFilter);
  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-600 selection:text-white">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. DEDICATED TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md font-black">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {isBn ? 'আসকাডো হালাল মার্কেটপ্লেস' : 'ASCADO Halal Marketplace'}
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {isBn ? '১০০% হালাল' : '100% Halal'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {isBn ? 'ডিজিটাল ই-বুক, সফটওয়্যার, অর্গানিক খাদ্য ও হস্তশিল্পের সমৃদ্ধ হাট' : 'Digital Goods, Organic Commodities & Verified Multi-Vendor Hub'}
              </p>
            </div>
          </div>

          {/* Center Navigation Links / Tabs */}
          <nav className="hidden xl:flex items-center gap-2 text-xs font-bold text-slate-600">
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedVendorFilter(null);
              }}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeTab === 'all' && !selectedVendorFilter
                  ? 'bg-amber-100 text-amber-900 font-black'
                  : 'hover:text-amber-600'
              }`}
            >
              {isBn ? 'সকল পণ্য' : 'All Products'}
            </button>
            <button
              onClick={() => {
                setActiveTab('digital');
                setSelectedVendorFilter(null);
              }}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                activeTab === 'digital'
                  ? 'bg-indigo-100 text-indigo-900 font-black'
                  : 'hover:text-indigo-600'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isBn ? 'ডিজিটাল পণ্য' : 'Digital Goods'}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('physical');
                setSelectedVendorFilter(null);
              }}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                activeTab === 'physical'
                  ? 'bg-emerald-100 text-emerald-900 font-black'
                  : 'hover:text-emerald-600'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{isBn ? 'ফিজিক্যাল পণ্য' : 'Physical Goods'}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('bundles');
                setSelectedVendorFilter(null);
              }}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                activeTab === 'bundles'
                  ? 'bg-amber-100 text-amber-900 font-black'
                  : 'hover:text-amber-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{isBn ? 'বান্ডিল অফার' : 'Bundles'}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('vendors');
                setSelectedVendorFilter(null);
              }}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                activeTab === 'vendors'
                  ? 'bg-amber-100 text-amber-900 font-black'
                  : 'hover:text-amber-600'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>{isBn ? 'ভেন্ডর ডিরেক্টরি' : 'Vendors'}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('portal');
                setSelectedVendorFilter(null);
              }}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                activeTab === 'portal'
                  ? 'bg-slate-900 text-white font-black'
                  : 'hover:text-slate-900'
              }`}
            >
              <span>{isBn ? 'ভেন্ডর পোর্টাল' : 'Vendor Portal'}</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Customer Digital Vault Trigger */}
            <button
              onClick={() => setIsVaultOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 hover:bg-indigo-100 text-xs font-bold transition cursor-pointer shadow-2xs"
              title={isBn ? 'আপনার পূর্বের ক্রয়কৃত ফাইল ও লাইসেন্স কী দেখুন' : 'Lookup your bought digital assets & licenses'}
            >
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">{isBn ? 'ডিজিটাল ভল্ট' : 'Digital Vault'}</span>
            </button>

            {/* Register as Vendor */}
            <button
              onClick={() => setIsVendorRegOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 text-amber-900 hover:bg-amber-50 text-xs font-bold transition cursor-pointer"
            >
              <Store className="w-4 h-4 text-amber-600" />
              <span>{isBn ? 'ভেন্ডর হোন' : 'Become Seller'}</span>
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-amber-600 hover:bg-amber-500 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">{isBn ? 'কার্ট' : 'Cart'}</span>
              {totalCartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-slate-950 text-white text-[10px] font-black flex items-center justify-center -mr-1">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* 2. IMMERSIVE HERO BANNER */}
      <section className="relative bg-gradient-to-r from-slate-950 via-amber-950 to-slate-900 text-white overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600"
            alt="Halal Marketplace"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20 filter blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-amber-950/85 to-slate-900/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-black px-3.5 py-1.5 rounded-full uppercase border border-amber-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>100% SHARIAH-COMPLIANT & ETHICAL TRADE</span>
            </span>
            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-400/30 flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{isBn ? 'ডিজিটাল ফাইল ইনস্ট্যান্ট ডাউনলোড' : 'Instant Digital Downloads'}</span>
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>{isBn ? 'সারাদেশে ক্যাশ অন ডেলিভারি' : 'Nationwide COD'}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            {isBn
              ? 'খাঁটি দেশীয় পণ্য ও ইসলামিক ডিজিটাল এসেটসের পূর্ণাঙ্গ মার্কেটপ্লেস'
              : 'The Authentic Halal Marketplace for Physical & Digital Commodities'}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            {isBn
              ? 'সুন্দরবনের খাঁটি চাকের মধু, কাঠের ঘানির সরিষার তেল, গাওয়া ঘি থেকে শুরু করে প্রামাণ্য ইসলামিক ই-বুক, আরবি ক্যালিগ্রাফি ভেক্টর আর্ট ও ডিজিটাল প্ল্যানার—সব পাবেন বিশ্বস্ত উৎপাদক ও ক্রিয়েটরদের কাছ থেকে ন্যায্যমূল্যে।'
              : 'Direct from verified rural farmers, women artisans and digital creators. Buy pure physical produce and download instant Islamic software, e-books and templates.'}
          </p>

          {/* Quick Statistics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 max-w-2xl">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-xl font-black text-amber-400 block">{products.length}+</span>
              <span className="text-[10px] text-slate-300">{isBn ? 'তালিকাভুক্ত পণ্য' : 'Active Products'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-xl font-black text-emerald-400 block">{vendors.length}</span>
              <span className="text-[10px] text-slate-300">{isBn ? 'ভেরিফায়েড ভেন্ডর' : 'Verified Vendors'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-xl font-black text-indigo-400 block">০%</span>
              <span className="text-[10px] text-slate-300">{isBn ? 'সুদ ও ভেজালমুক্ত' : 'Zero Adulteration'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-xl font-black text-amber-300 block">৯০%</span>
              <span className="text-[10px] text-slate-300">{isBn ? 'উৎপাদক পেআউট' : 'Seller Revenue Share'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. MAIN INTERACTIVE CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        
        {/* Navigation Tab Pills (Mobile & Desktop) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('all');
              setSelectedVendorFilter(null);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all' && !selectedVendorFilter
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isBn ? 'সকল পণ্য' : 'All Products'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('digital');
              setSelectedVendorFilter(null);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'digital'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isBn ? 'ডিজিটাল পণ্য (ই-বুক ও সফটওয়্যার)' : 'Digital Goods'}</span>
            <span className="bg-indigo-100 text-indigo-900 text-[10px] px-1.5 py-0.2 rounded-full">
              {products.filter((p) => p.productType === 'digital' || p.type === 'digital' || p.isDigital).length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('physical');
              setSelectedVendorFilter(null);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'physical'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{isBn ? 'ফিজিক্যাল পণ্য (মধু, তেল, ঘি)' : 'Physical Goods'}</span>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] px-1.5 py-0.2 rounded-full">
              {products.filter((p) => !(p.productType === 'digital' || p.type === 'digital' || p.isDigital)).length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bundles');
              setSelectedVendorFilter(null);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bundles'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? 'বান্ডিল ও কম্বো অফার' : 'Bundles & Combos'}</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full">
              {bundles.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('vendors');
              setSelectedVendorFilter(null);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'vendors'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{isBn ? 'ভেন্ডর ডিরেক্টরি' : 'Vendors'}</span>
            <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full">
              {vendors.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setSelectedVendorFilter(null);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'portal'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>{isBn ? 'ভেন্ডর পোর্টাল ও ম্যানেজমেন্ট' : 'Vendor Portal'}</span>
          </button>
        </div>

        {/* AI Robot Assistant Promotional Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 rounded-3xl p-4 sm:p-6 text-white shadow-xl border border-indigo-700/50 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-13 h-13 rounded-2xl bg-indigo-600/40 border border-indigo-400/40 flex items-center justify-center text-amber-300 shadow-inner shrink-0 relative">
              <Bot className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-100 animate-ping" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-sm sm:text-base text-white">
                  {isBn ? '🤖 আসকাডো মার্কেটপ্লেস স্বয়ংক্রিয় এআই রোবট' : 'Ascado Marketplace AI Robot Assistant'}
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{isBn ? 'সার্বক্ষণিক সক্রিয়' : '24/7 Live Automated'}</span>
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-1 max-w-xl leading-relaxed">
                {isBn
                  ? 'মার্কেটপ্লেসের যেকোনো পণ্য, খাঁটি মধু ও তেলের মান, বর্তমান স্টক, ঢাকা ও সারাদেশে ডেলিভারি চার্জ বা রিটার্ন পলিসি সম্পর্কে যে কোনো প্রশ্ন সরাসরি রোবটকে জিজ্ঞাসা করুন।'
                  : 'Get instant, direct answers from our AI Robot regarding product authenticity, stock, nationwide delivery, Cash on Delivery, or digital licenses.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-stretch md:self-auto justify-end relative z-10">
            <button
              onClick={() => {
                setAiRobotProduct(null);
                setIsAiRobotOpen(true);
              }}
              className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer transform hover:scale-102"
            >
              <Bot className="w-4 h-4" />
              <span>{isBn ? 'রোবটের সাথে কথা বলুন' : 'Ask AI Robot Now'}</span>
            </button>
          </div>
        </div>

        {/* Active Vendor Storefront Filter Notice */}
        {selectedVendorFilter && activeVendorInfo && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={activeVendorInfo.logo}
                alt="Logo"
                className="w-10 h-10 rounded-xl object-cover border border-amber-300"
              />
              <div>
                <span className="text-[10px] uppercase font-black text-amber-700 tracking-wider">
                  {isBn ? 'ভেন্ডর স্টোর প্রদর্শন' : 'STOREFRONT FILTER'}
                </span>
                <h4 className="font-black text-sm text-slate-900">
                  {activeVendorInfo.storeNameBn || activeVendorInfo.storeName} ({activeVendorInfo.district})
                </h4>
              </div>
            </div>
            <button
              onClick={() => setSelectedVendorFilter(null)}
              className="text-xs font-bold text-amber-900 hover:text-rose-600 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isBn ? 'ফিল্টার মুছুন' : 'Clear Filter'}</span>
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW TAB 1: VENDOR PORTAL VIEW */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'portal' && (
          <VendorPortalView
            vendors={vendors}
            isBn={isBn}
            onProductAdded={(newProd) => {
              setProducts((prev) => [newProd, ...prev]);
            }}
            onOpenRegisterModal={() => setIsVendorRegOpen(true)}
          />
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW TAB 2: VENDOR DIRECTORY */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'vendors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase text-amber-600 tracking-wider">VERIFIED MERCHANT NETWORK</span>
                <h3 className="text-2xl font-black text-slate-900">
                  {isBn ? 'নিবন্ধিত ভেন্ডর ও উৎপাদক স্টোর সমূহ' : 'Halal Vendor Stores'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn ? 'যাচাইকৃত শতভাগ হালাল পণ্য ও ডিজিটাল কন্টেন্ট সরবরাহকারী প্রতিষ্ঠান' : 'Direct certified shops with verified seller credentials'}
                </p>
              </div>
              <button
                onClick={() => setIsVendorRegOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isBn ? 'ভেন্ডর হিসেবে নিবন্ধন করুন' : 'Become a Vendor'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(vendors || []).map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="h-32 relative overflow-hidden bg-slate-100">
                      <img
                        src={v.banner || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80'}
                        alt={v.storeName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                        {v.type === 'digital' ? 'Digital' : v.type === 'both' ? 'Hybrid' : 'Physical'}
                      </div>
                    </div>

                    <div className="p-6 pt-0 relative space-y-3">
                      <div className="flex items-end justify-between -mt-10 mb-2">
                        <img
                          src={v.logo}
                          alt={v.storeName}
                          className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                        />
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{v.rating}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-black text-base text-slate-900 group-hover:text-amber-600 transition">
                          {v.storeNameBn || v.storeName}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {isBn ? 'স্বত্বাধিকারী:' : 'Owner:'} {v.ownerName} • {v.district}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {v.descriptionBn}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                        <span>{v.totalProducts || 12} {isBn ? 'টি পণ্য' : 'products'}</span>
                        <span className="text-emerald-700 font-bold">✓ {isBn ? '১০% প্ল্যাটফর্ম ফি ভেরিফায়েড' : 'Verified'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => {
                        setSelectedVendorFilter(v.id);
                        setActiveTab('all');
                      }}
                      className="w-full py-2.5 rounded-xl border border-amber-400 hover:bg-amber-50 text-amber-900 font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Store className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isBn ? 'দোকানের সকল পণ্য দেখুন' : 'View Store Products'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW TAB 3: BUNDLE SPECIAL OFFERS */}
        {/* ------------------------------------------------------------- */}
        {(activeTab === 'bundles' || activeTab === 'all') && bundles.length > 0 && !selectedVendorFilter && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-amber-600 tracking-wider">EXCLUSIVE COMBO OFFERS</span>
                <h3 className="text-2xl font-black text-slate-900">
                  {isBn ? 'রমজান ও স্পেশাল মেগা সেভার বান্ডিল' : 'Halal Mega Saver Bundles'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn ? 'একত্রে ক্রয় করে পান সর্বোচ্চ ৪০% পর্যন্ত সাশ্রয় এবং সম্পূর্ণ ফ্রি ডেলিভারি' : 'Bundled packages combining natural commodities and digital suites'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="bg-white rounded-3xl border-2 border-amber-200 overflow-hidden shadow-sm hover:shadow-xl transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 relative overflow-hidden bg-slate-100">
                      <img
                        src={bundle.imageUrl}
                        alt={bundle.titleBn}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{bundle.discountBadge || 'স্পেশাল বান্ডিল'}</span>
                      </div>
                      <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        ★ {bundle.rating} ({bundle.salesCount || 100}+ sold)
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <span className="text-[10px] font-black text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {bundle.category || 'কম্বো অফার'}
                      </span>

                      <h4 className="font-black text-base text-slate-900 group-hover:text-amber-600 transition leading-snug">
                        {bundle.titleBn || bundle.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {bundle.descriptionBn}
                      </p>

                      {/* Included Items Checklist */}
                      {bundle.includedItemsBn && (
                        <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100 space-y-1.5 text-xs">
                          <span className="font-bold text-[10px] uppercase text-amber-900 block">
                            {isBn ? 'বান্ডিলের মধ্যে রয়েছে:' : 'Included:'}
                          </span>
                          {bundle.includedItemsBn.map((item: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-amber-600">৳{bundle.price}</span>
                        {bundle.originalPrice && (
                          <span className="text-xs text-slate-400 line-through font-bold">৳{bundle.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block font-bold">{bundle.sellerName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(bundle)}
                        className="p-2.5 rounded-xl border border-amber-300 text-amber-800 hover:bg-amber-50 transition cursor-pointer"
                        title={isBn ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDirectOrder(bundle)}
                        className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1"
                      >
                        <span>{isBn ? 'বান্ডিল কিনুন' : 'Buy Bundle'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW TAB 4: PRODUCTS CATALOG (DIGITAL & PHYSICAL) */}
        {/* ------------------------------------------------------------- */}
        {activeTab !== 'portal' && activeTab !== 'vendors' && (
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase text-amber-600 tracking-wider">CATALOGUE & STOCK</span>
                  <h3 className="text-xl font-black text-slate-900">
                    {activeTab === 'digital'
                      ? (isBn ? 'ইসলামিক ও প্রডাক্টিভিটি ডিজিটাল প্রোডাক্ট' : 'Digital Products & Software')
                      : activeTab === 'physical'
                      ? (isBn ? 'খাঁটি ফিজিক্যাল ও কৃষিজ সামগ্রী' : 'Organic Physical Commodities')
                      : (isBn ? 'সকল খাঁটি পণ্য ও ডিজিটাল সামগ্রী' : 'All Products & Downloads')}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isBn ? 'নাম, ক্যাটাগরি দিয়ে খুঁজুন...' : 'Search products...'}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 font-medium bg-slate-50"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 text-slate-800"
                  >
                    <option value="all">{isBn ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
                    <option value="অর্গানিক">{isBn ? 'অর্গানিক ফুড' : 'Organic Food'}</option>
                    <option value="ডিজিটাল ই-বুক">{isBn ? 'ডিজিটাল ই-বুক ও সফটওয়্যার' : 'Digital Books & Apps'}</option>
                    <option value="গ্রাফিক্স">{isBn ? 'ডিজিটাল গ্রাফিক্স ও ভেক্টর' : 'Graphics & Vectors'}</option>
                    <option value="হস্তশিল্প">{isBn ? 'হস্তশিল্প ও কুটিরশিল্প' : 'Handicrafts'}</option>
                    <option value="সুগন্ধি">{isBn ? 'আতর ও সুগন্ধি' : 'Attar & Perfumes'}</option>
                    <option value="পাইকারি">{isBn ? 'বি২বি পাইকারি বাল্ক' : 'B2B Wholesale'}</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const isDigital = p.productType === 'digital' || p.type === 'digital' || p.isDigital;

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition group flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Image & Badges */}
                      <div className="h-56 overflow-hidden relative bg-slate-100">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer"
                          onClick={() => setDetailsProduct(p)}
                        />

                        {/* Type Badge: Digital vs Physical */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          {isDigital ? (
                            <span className="bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-xs">
                              <Download className="w-3 h-3" />
                              <span>Digital Download</span>
                            </span>
                          ) : (
                            <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1">
                              <Truck className="w-3 h-3" />
                              <span>{p.type === 'b2b_wholesale' ? 'Wholesale' : 'Physical'}</span>
                            </span>
                          )}
                        </div>

                        {p.verified && (
                          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>100% Halal</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            {p.categoryBn || p.category || 'অর্গানিক'}
                          </span>
                          {p.rating && (
                            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{p.rating}</span>
                            </div>
                          )}
                        </div>

                        <h4
                          onClick={() => setDetailsProduct(p)}
                          className="font-black text-base text-slate-900 group-hover:text-amber-600 transition cursor-pointer line-clamp-1"
                        >
                          {p.nameBn || p.name}
                        </h4>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {p.description || p.descriptionBn}
                        </p>

                        {/* Digital Specs: Format / Size */}
                        {isDigital && (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-md border border-indigo-200">
                              {p.fileFormat || 'PDF / ZIP'}
                            </span>
                            {p.fileSize && (
                              <span className="text-[10px] font-mono text-slate-500">
                                {p.fileSize}
                              </span>
                            )}
                            <span className="text-[10px] text-emerald-600 font-bold ml-auto">
                              ✓ ইনস্ট্যান্ট এক্সেস
                            </span>
                          </div>
                        )}

                        {/* Physical Specs: Weight / Stock */}
                        {!isDigital && p.weight && (
                          <div className="text-[11px] text-slate-500 font-medium">
                            {isBn ? 'ওজন / পরিমাপ:' : 'Weight:'} <span className="font-bold text-slate-700">{p.weight}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Pricing & Action */}
                    <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">{p.sellerName}</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-black text-slate-900">৳{p.price}</span>
                          {p.originalPrice && (
                            <span className="text-xs text-slate-400 line-through font-bold">৳{p.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Ask AI Robot Button for this product */}
                        <button
                          type="button"
                          onClick={() => {
                            setAiRobotProduct(p);
                            setIsAiRobotOpen(true);
                          }}
                          className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                          title={isBn ? 'এই পণ্য সম্পর্কে এআই রোবটকে প্রশ্ন করুন' : 'Ask AI Robot about this product'}
                        >
                          <Bot className="w-4 h-4" />
                        </button>

                        {isDigital && (
                          <button
                            type="button"
                            onClick={() => setPreviewProduct(p)}
                            className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/60 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                            title={isBn ? 'নমুনা প্রিভিউ ও ডেমো দেখুন' : 'Live Sample Demo'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleAddToCart(p)}
                          className="p-2.5 rounded-xl border border-amber-300 text-amber-800 hover:bg-amber-50 transition cursor-pointer"
                          title={isBn ? 'কার্টে রাখুন' : 'Add to Cart'}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDirectOrder(p)}
                          className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-white font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1 ${
                            isDigital ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-amber-600 hover:bg-amber-500'
                          }`}
                        >
                          <span>{isDigital ? (isBn ? 'কিনুন' : 'Buy') : (isBn ? 'অর্ডার' : 'Order')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-black text-base text-slate-800">
                  {isBn ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products match your criteria'}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {isBn ? 'অন্য কোনো কিওয়ার্ড দিয়ে সার্চ করুন অথবা ফিল্টার পরিবর্তন করুন।' : 'Try adjusting your search query or clear the filter.'}
                </p>
              </div>
            )}

          </div>
        )}

        {/* 4. TRUST & HALAL COMMITMENT SECTION */}
        <section id="trust" className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase text-amber-600 tracking-wider">HALAL & ETHICAL FOUNDATION</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {isBn ? 'কেন আসকাডো মার্কেটপ্লেস শতভাগ নির্ভরযোগ্য?' : 'Our Four Halal Trade Commitments'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {isBn
                ? 'ইসলামিক শরিয়াহর মৌলিক মূলনীতি অনুযায়ী প্রতারণামুক্ত বাণিজ্য ও ন্যায্য লেনদেনে আমরা দায়বদ্ধ।'
                : 'Built upon strict Islamic commercial jurisprudence, consumer protection and mutual benefit.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-slate-900">
                {isBn ? 'শরিয়াহসম্মত পণ্যের নিশ্চয়তা' : '100% Halal Verified'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isBn
                  ? 'কোনো প্রকার সুদ, হারাম বা অনৈতিক সামগ্রী নেই। প্রতিটি পণ্য আলেম বোর্ড ও গুণগত মান নিয়ন্ত্রণ টিম দ্বারা যাচাইকৃত।'
                  : 'Zero tolerance for prohibited elements. Every vendor undergoes Halal compliance review.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Download className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-slate-900">
                {isBn ? 'ডিজিটাল ইনস্ট্যান্ট ডেলিভারি' : 'Instant Digital Access'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isBn
                  ? 'অর্ডার সফল হওয়ার সাথে সাথেই যেকোনো ডিজিটাল ফাইল সরাসরি ডাউনলোড করুন। লাইফটাইম ক্লাউড স্টোরেজ এক্সেস সুবিধা।'
                  : 'Immediate high-speed download links for all e-books, templates, and software suites.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-slate-900">
                {isBn ? 'ন্যায্য মূল্য ও ৯০% ভেন্ডর পেআউট' : 'Fair 90% Vendor Share'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isBn
                  ? 'মধ্যস্বত্বভোগী ছাড়া উৎপাদকদের ন্যায্য পারিশ্রমিক দেওয়া হয়। প্ল্যাটফর্ম ফি মাত্র ১০%, যা সম্পূর্ণ সার্ভার ও ব্যবস্থাপনায় ব্যয়িত।'
                  : 'Minimizing middleman exploitation. 90% of order value goes directly to rural farmers and creators.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-slate-900">
                {isBn ? 'সন্তুষ্টি না হলে ফ্রি রিটার্ন' : 'Hassle-Free Returns'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isBn
                  ? 'ফিজিক্যাল পণ্যে ডেলিভারিম্যানের সামনে আনপ্যাক করে দেখে নেওয়ার সুযোগ। কোনো ত্রুটি থাকলে সাথে সাথেই ফ্রিতে রিটার্নযোগ্য।'
                  : 'Open-box inspection on physical items with instant free return guarantee at doorstep.'}
              </p>
            </div>

          </div>
        </section>

        {/* 5. AD BANNER INTEGRATION */}
        <AdBannerBox zoneId="marketplace_bottom_banner" />

      </main>

      {/* 6. BECOME A SELLER / VENDOR BANNER */}
      <section id="seller" className="bg-amber-950 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider">JOIN AS HALAL PRODUCER</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black">
              {isBn ? 'আপনার ডিজিটাল বা ফিজিক্যাল পণ্য পৌঁছে দিন দেশজুড়ে' : 'Sell Your Products Nationwide on ASCADO Halal Marketplace'}
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              {isBn
                ? 'আপনি কি খাঁটি মধু, তেল, ঘি বা হস্তশিল্পের কারিগর? অথবা ইসলামিক ই-বুক, সফটওয়্যার, আরবি ক্যালিগ্রাফি ডিজাইনার? আসকাডো মার্কেটপ্লেসে মাত্র ১০% নামমাত্র প্ল্যাটফর্ম ফিতে বিক্রয় শুরু করুন এবং লাখো ক্রেতার কাছে পৌঁছান।'
                : 'Start selling your authentic agro produce or Islamic digital assets. Enjoy automated settlements, transparent weekly payouts, and zero hidden charges.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsVendorRegOpen(true)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>{isBn ? 'আজই ভেন্ডর হিসেবে যোগ দিন' : 'Register as Vendor Now'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-4">
            <h3 className="font-black text-base">{isBn ? 'মার্চেন্ট ও ভেন্ডর অনবোর্ডিং হেল্পলাইন' : 'Merchant Registration Helpdesk'}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isBn
                ? 'আমাদের মার্চেন্ট ভেরিফিকেশন টিমের সাথে সরাসরি কথা বলে স্টোর চালু করতে কল করুন:'
                : 'Call our vendor onboarding team directly for store verification:'}
            </p>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center font-mono font-black text-amber-900 text-lg">
              📞 01973817167
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              {isBn ? 'সকাল ০৯:০০ টা থেকে রাত ১০:০০ টা পর্যন্ত (শুক্রবার সহ খোলা)' : '9:00 AM to 10:00 PM (Daily)'}
            </p>
          </div>

        </div>
      </section>

      {/* 7. DEDICATED MARKETPLACE FOOTER */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-black text-sm text-white">ASCADO Halal Market</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              ন্যায্যমূল্যে শতভাগ নির্ভেজাল খাদ্য, ডিজিটাল সফটওয়্যার, ইসলামিক ই-বুক ও হস্তশিল্প সামগ্রী সরবরাহে অঙ্গীকারবদ্ধ আধুনিক ইসলামিক ই-কমার্স ইকোসিস্টেম।
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-black text-white text-xs uppercase tracking-wider">{isBn ? 'গ্রাহক সেবা' : 'Customer Support'}</h5>
            <p className="text-[11px]">হটলাইন: 01973817167</p>
            <p className="text-[11px]">ইমেইল: shop@ascado.org</p>
            <p className="text-[11px]">ডেলিভারি সময়: ২-৩ কার্যদিবস</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-black text-white text-xs uppercase tracking-wider">{isBn ? 'পণ্য বিভাগ' : 'Categories'}</h5>
            <ul className="space-y-1 text-[11px]">
              <li><button onClick={() => { setActiveTab('digital'); }} className="hover:text-amber-400 cursor-pointer">ডিজিটাল ই-বুক ও সফটওয়্যার</button></li>
              <li><button onClick={() => { setActiveTab('physical'); }} className="hover:text-amber-400 cursor-pointer">অর্গানিক মধু, ঘি ও তেল</button></li>
              <li><button onClick={() => { setActiveTab('bundles'); }} className="hover:text-amber-400 cursor-pointer">রমজান ও স্পেশাল বান্ডিল</button></li>
              <li><button onClick={() => { setActiveTab('vendors'); }} className="hover:text-amber-400 cursor-pointer">ভেন্ডর স্টোর সমূহ</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-black text-white text-xs uppercase tracking-wider">{isBn ? 'রিটার্ন পলিসি' : 'Return Policy'}</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ফিজিক্যাল পণ্য প্রাপ্তির সময় সন্তুষ্ট না হলে আনপ্যাক করে সাথে সাথে ডেলিভারিম্যানের কাছে সম্পূর্ণ ফ্রিতে রিটার্ন করার নিশ্চয়তা।
            </p>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-4 border-t border-slate-900 text-center text-[10px] text-slate-500">
          © {new Date().getFullYear()} ASCADO Halal & Agro Marketplace. All Rights Reserved.
        </div>
      </footer>

      {/* 8. MODALS & DRAWERS */}
      
      {/* Shopping Cart Drawer */}
      <MarketplaceCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOpenVault={() => setIsVaultOpen(true)}
        isBn={isBn}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={detailsProduct}
        onClose={() => setDetailsProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectOrder={handleDirectOrder}
        onOpenPreview={(prod) => setPreviewProduct(prod)}
        onOpenAiRobot={(prod) => {
          setDetailsProduct(null);
          setAiRobotProduct(prod);
          setIsAiRobotOpen(true);
        }}
        isBn={isBn}
      />

      {/* Interactive Digital Sample Preview Modal */}
      <DigitalSamplePreviewModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
        onBuyNow={(prod) => {
          setPreviewProduct(null);
          handleDirectOrder(prod);
        }}
        isBn={isBn}
      />

      {/* Customer Digital Vault Modal */}
      <DigitalVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        isBn={isBn}
      />

      {/* Vendor Registration Modal */}
      <VendorRegistrationModal
        isOpen={isVendorRegOpen}
        onClose={() => setIsVendorRegOpen(false)}
        onSuccess={(newVendor) => {
          setVendors((prev) => [newVendor, ...prev]);
          showToast(isBn ? 'অভিনন্দন! আপনার ভেন্ডর স্টোর সফলভাবে নিবন্ধিত হয়েছে' : 'Vendor registered successfully');
          setActiveTab('portal');
        }}
        isBn={isBn}
      />

      {/* Automated Marketplace AI Robot Modal */}
      <MarketplaceAiRobotModal
        isOpen={isAiRobotOpen}
        onClose={() => {
          setIsAiRobotOpen(false);
          setAiRobotProduct(null);
        }}
        productContext={aiRobotProduct}
        onSelectProduct={(prod) => {
          setIsAiRobotOpen(false);
          setDetailsProduct(prod);
        }}
        onDirectOrder={(prod) => {
          setIsAiRobotOpen(false);
          handleDirectOrder(prod);
        }}
        isBn={isBn}
      />

      {/* Floating 24/7 AI Robot Assistant Trigger Button */}
      <button
        onClick={() => {
          setAiRobotProduct(null);
          setIsAiRobotOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-700 via-indigo-600 to-slate-900 hover:from-indigo-600 hover:to-indigo-800 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl border border-indigo-400/40 flex items-center gap-2.5 group transition transform hover:scale-105 cursor-pointer"
        title={isBn ? 'মার্কেটপ্লেস এআই রোবটকে প্রশ্ন করুন' : 'Ask Marketplace AI Robot'}
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition duration-300" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-900 animate-ping" />
        </div>
        <span className="hidden sm:inline text-xs font-black tracking-wide">
          {isBn ? 'এআই রোবট সাহায্য' : 'Marketplace AI Robot'}
        </span>
      </button>

    </div>
  );
};
