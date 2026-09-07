import React, { useState, useEffect } from 'react';
import {
  X, Star, ShieldCheck, Download, Truck, ShoppingCart, CheckCircle,
  Package, Store, FileText, Sparkles, Eye, Key, CheckCircle2,
  Calendar, Layers, MessageSquare, Send, Bot, HelpCircle, RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

interface ProductDetailsModalProps {
  product: any | null;
  onClose: () => void;
  onAddToCart: (product: any, licenseType?: string) => void;
  onDirectOrder: (product: any, licenseType?: string) => void;
  onOpenPreview?: (product: any) => void;
  onOpenAiRobot?: (product: any) => void;
  isBn: boolean;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectOrder,
  onOpenPreview,
  onOpenAiRobot,
  isBn
}) => {
  if (!product) return null;

  const isDigital = product.productType === 'digital' || product.type === 'digital' || product.isDigital;
  const isBundle = product.type === 'bundle';

  // License selection state
  const [selectedLicense, setSelectedLicense] = useState<'personal' | 'commercial'>('personal');
  const personalPrice = product.price;
  const commercialPrice = product.commercialPrice || Math.round(product.price * 1.8);
  const activePrice = isDigital && selectedLicense === 'commercial' ? commercialPrice : personalPrice;

  // Active tab in modal: 'details' | 'reviews' | 'qa'
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'qa'>('details');

  // Q&A State
  const [qaList, setQaList] = useState<any[]>(product.qaList || []);
  const [userQuestion, setUserQuestion] = useState('');
  const [askerName, setAskerName] = useState('');
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [qaSuccessMsg, setQaSuccessMsg] = useState('');

  useEffect(() => {
    if (product && product.id) {
      api.getProductQa(product.id)
        .then(list => {
          if (Array.isArray(list)) setQaList(list);
        })
        .catch(err => console.error('Failed to load product Q&A', err));
    }
  }, [product?.id]);

  const handleAskQuestion = async (e: React.FormEvent, customQ?: string) => {
    if (e) e.preventDefault();
    const qText = customQ || userQuestion;
    if (!qText.trim() || submittingQuestion) return;

    setSubmittingQuestion(true);
    try {
      const res = await api.askProductQuestion(product.id, {
        question: qText.trim(),
        askerName: askerName.trim() || (isBn ? 'সম্মানিত গ্রাহক' : 'Valued Customer')
      });

      if (res && res.qaItem) {
        setQaList([res.qaItem, ...qaList]);
        setUserQuestion('');
        setQaSuccessMsg(isBn ? 'রোবট আপনার প্রশ্নের সরাসরি ও তাৎক্ষণিক উত্তর প্রদান করেছে!' : 'Robot answered your question directly!');
        setTimeout(() => setQaSuccessMsg(''), 5000);
      }
    } catch (err) {
      console.error('Failed to ask product question', err);
    } finally {
      setSubmittingQuestion(false);
    }
  };

  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewsList, setReviewsList] = useState<any[]>(product.reviews || []);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await api.submitProductReview(product.id, {
        author: reviewerName.trim() || (isBn ? 'সম্মানিত ক্রেতা' : 'Verified Buyer'),
        rating: ratingVal,
        comment: reviewComment.trim(),
        verifiedBuyer: true
      });

      if (res && res.review) {
        setReviewsList([res.review, ...reviewsList]);
        setReviewComment('');
        setShowReviewForm(false);
        setReviewSuccessMsg(isBn ? 'আপনার মূল্যবান রিভিউ সফলভাবে যুক্ত হয়েছে!' : 'Your review was published!');
        setTimeout(() => setReviewSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const productForAction = {
    ...product,
    price: activePrice,
    selectedLicense: isDigital ? selectedLicense : undefined
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-amber-200 my-6 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                isDigital
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  : isBundle
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isDigital
                ? (isBn ? 'ডিজিটাল প্রোডাক্ট (ইনস্ট্যান্ট ডেলিভারি)' : 'Digital Product (Instant Delivery)')
                : isBundle
                ? (isBn ? 'মেগা সেভার বান্ডিল' : 'Special Bundle')
                : (isBn ? '১০০% খাঁটি ফিজিক্যাল পণ্য' : 'Halal Physical Product')}
            </span>
            {product.verified && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isBn ? 'ভেরিফায়েড হালাল' : 'Halal Certified'}</span>
              </span>
            )}
            {isDigital && (
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {product.version || 'v2.6'}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs flex-wrap">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1.5 rounded-xl font-black transition cursor-pointer ${
              activeTab === 'details'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {isBn ? 'পণ্যের বিবরণ ও স্পেসিফিকেশন' : 'Product Details'}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isBn ? `গ্রাহক রিভিউ (${reviewsList.length})` : `Reviews (${reviewsList.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3 py-1.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'qa'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-600 bg-indigo-50/70 hover:bg-indigo-100 hover:text-indigo-800 border border-indigo-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-amber-300" />
            <span>{isBn ? `🤖 রোবট প্রশ্নোত্তর (${qaList.length})` : `AI Robot Q&A (${qaList.length})`}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {/* TAB 1: PRODUCT DETAILS */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Left Column: Image & Seller */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square shadow-inner">
                <img
                  src={product.imageUrl}
                  alt={product.name || product.titleBn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {product.discountBadge && (
                  <div className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                    {product.discountBadge}
                  </div>
                )}
                {isDigital && (
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isBn ? 'ইনস্ট্যান্ট ডাউনলোড ফাইল' : 'Instant Download File'}</span>
                    </span>
                    <span className="font-mono text-[10px] text-amber-300">{product.fileSize || '38 MB'}</span>
                  </div>
                )}
              </div>

              {/* Sample Live Demo Button for Digital Products */}
              {isDigital && onOpenPreview && (
                <button
                  type="button"
                  onClick={() => onOpenPreview(product)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isBn ? '👁️ লাইভ স্যাম্পল ডেমো ও প্রিভিউ দেখুন' : 'Live Sample Demo & Preview'}</span>
                </button>
              )}

              {/* Seller Card */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-600/10 text-amber-800 flex items-center justify-center font-black">
                  <Store className="w-4 h-4" />
                </div>
                <div className="overflow-hidden flex-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    {isBn ? 'ভেরিফায়েড বিক্রেতা' : 'Verified Vendor'}
                  </span>
                  <h5 className="font-black text-xs text-slate-900 truncate">{product.sellerName || 'Verified Halal Merchant'}</h5>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {isBn ? 'অনুমোদিত' : 'Authorized'}
                </span>
              </div>
            </div>

            {/* Right Column: Information, Pricing & License */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-amber-700 block mb-0.5">
                  {product.categoryBn || product.category}
                </span>
                <h3 className="font-black text-lg sm:text-xl text-slate-900 leading-snug">
                  {product.nameBn || product.titleBn || product.name}
                </h3>

                <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{product.rating || 5.0}</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {reviewsList.length} {isBn ? 'রিভিউ' : 'reviews'}
                  </span>
                  {product.salesCount && (
                    <>
                      <span className="text-slate-300">|</span>
                      <span className="text-xs text-emerald-600 font-bold">
                        {product.salesCount}+ {isBn ? 'সফল ডাউনলোড ও বিক্রি' : 'Sales'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Dynamic Price Box */}
              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-slate-900">৳{activePrice}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through font-bold ml-2">৳{product.originalPrice}</span>
                  )}
                </div>

                {isDigital && (
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-2.5 py-1 rounded-full border border-indigo-200">
                    {selectedLicense === 'commercial' ? (isBn ? '🏢 কমার্শিয়াল রেট' : 'Commercial Rate') : (isBn ? '👤 ব্যক্তিগত রেট' : 'Personal Rate')}
                  </span>
                )}
              </div>

              {/* DIGITAL SHOP: LICENSE SELECTION */}
              {isDigital && (
                <div className="space-y-2 pt-1">
                  <label className="block text-[11px] font-black text-slate-700 uppercase">
                    {isBn ? 'লাইসেন্স ক্যাটাগরি বেছে নিন:' : 'Choose License Category:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedLicense('personal')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        selectedLicense === 'personal'
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-black text-slate-900">{isBn ? 'ব্যক্তিগত' : 'Personal'}</span>
                        <span className="font-bold text-slate-700">৳{personalPrice}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">১ জন ব্যক্তি / নিজ ডিভাইসে</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedLicense('commercial')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        selectedLicense === 'commercial'
                          ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-black text-amber-900">{isBn ? 'কমার্শিয়াল' : 'Commercial'}</span>
                        <span className="font-bold text-amber-700">৳{commercialPrice}</span>
                      </div>
                      <span className="text-[10px] text-slate-600 mt-1">ক্লায়েন্ট প্রজেক্ট / বাণিজ্যিক</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Digital Specifications Grid */}
              {isDigital && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">{isBn ? 'ফাইল ফরম্যাট:' : 'Format:'}</span>
                    <span className="font-mono font-bold text-indigo-700">{product.fileFormat || 'PDF, ZIP, SVG, AI'}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">{isBn ? 'ভার্সন ও আপডেট:' : 'Version:'}</span>
                    <span className="font-bold text-slate-800">{product.version || 'v2.6'} ({product.lastUpdated || '২০২৬'})</span>
                  </div>
                  {product.compatibility && (
                    <div className="py-1">
                      <span className="text-slate-500 font-medium block mb-1">{isBn ? 'সামঞ্জস্যপূর্ণ প্ল্যাটফর্ম:' : 'Compatibility:'}</span>
                      <div className="flex flex-wrap gap-1">
                        {product.compatibility.map((comp: string, i: number) => (
                          <span key={i} className="text-[10px] font-bold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'লাইসেন্স কী ও ভল্ট সার্টিফিকেট অন্তর্ভুক্ত' : 'Cryptographic License Included'}</span>
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.description || product.descriptionBn}
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    onAddToCart(productForAction, selectedLicense);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl border-2 border-indigo-600 text-indigo-700 hover:bg-indigo-50 font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isBn ? 'কার্টে রাখুন' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={() => {
                    onDirectOrder(productForAction, selectedLicense);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{isBn ? `৳${activePrice} এখনই কিনুন` : `Buy Now ৳${activePrice}`}</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: REVIEWS & FEEDBACK */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            
            {reviewSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{reviewSuccessMsg}</span>
              </div>
            )}

            {/* Write a review header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  {isBn ? 'ভেরিফায়েড ক্রেতাদের অভিজ্ঞতা ও মতামত' : 'Customer Reviews & Feedback'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isBn ? 'সকল রিভিউ বাস্তব অর্ডারের ভিত্তিতে যাচাইকৃত।' : 'Verified real customer experiences.'}
                </p>
              </div>

              {!showReviewForm && (
                <button
                  type="button"
                  onClick={() => setShowReviewForm(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition cursor-pointer"
                >
                  {isBn ? '+ রিভিউ লিখুন' : '+ Write Review'}
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">
                    {isBn ? 'আপনার রিভিউ প্রদান করুন' : 'Submit your review'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {isBn ? 'আপনার নাম' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      placeholder={isBn ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {isBn ? 'রেটিং (স্টার)' : 'Rating (Stars)'}
                    </label>
                    <div className="flex items-center gap-2 py-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRatingVal(s)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              s <= ratingVal ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-1">{ratingVal} / 5</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {isBn ? 'আপনার মন্তব্য বা অভিজ্ঞতা' : 'Your Feedback'}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={isBn ? 'ডিজিটাল ফাইলের কোয়ালিটি বা সেবা সম্পর্কে লিখুন...' : 'Write about product quality...'}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? (isBn ? 'জমা হচ্ছে...' : 'Submitting...') : (isBn ? 'রিভিউ সাবমিট করুন' : 'Post Review')}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {reviewsList.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400 font-medium">
                  {isBn ? 'এখনও কোনো রিভিউ যুক্ত হয়নি। আপনিই প্রথম রিভিউ দিন!' : 'No reviews yet. Be the first to leave one!'}
                </p>
              ) : (
                reviewsList.map((rev: any, idx: number) => (
                  <div key={idx} className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.author}</span>
                        {rev.verifiedBuyer && (
                          <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md">
                            {isBn ? 'ভেরিফায়েড ক্রেতা' : 'Verified Buyer'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-snug">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block">{rev.date || '২০২৬'}</span>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB 3: AI ROBOT Q&A */}
        {activeTab === 'qa' && (
          <div className="space-y-4">
            
            {/* Header info banner */}
            <div className="p-4 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl text-white flex items-center justify-between flex-wrap gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-300/30 flex items-center justify-center text-amber-300 shadow-inner">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <span>{isBn ? 'স্বয়ংক্রিয় এআই রোবট প্রশ্নোত্তর' : 'Automated AI Robot Q&A'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                      {isBn ? 'তাৎক্ষণিক উত্তর' : 'Instant Reply'}
                    </span>
                  </h4>
                  <p className="text-xs text-indigo-200">
                    {isBn
                      ? 'এই পণ্য সম্পর্কে যেকোনো প্রশ্ন লিখুন—আমাদের রোবট সরাসরি সঠিক তথ্য জানিয়ে দেবে।'
                      : 'Ask anything about this product—our AI robot provides direct, verified answers.'}
                  </p>
                </div>
              </div>

              {onOpenAiRobot && (
                <button
                  type="button"
                  onClick={() => onOpenAiRobot(product)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/40 hover:bg-indigo-500/60 text-white font-bold text-xs border border-indigo-300/30 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isBn ? 'ফুলস্ক্রিন রোবট চ্যাট' : 'Full Robot Chat'}</span>
                </button>
              )}
            </div>

            {/* Success notification */}
            {qaSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{qaSuccessMsg}</span>
              </div>
            )}

            {/* Ask Question Form */}
            <form onSubmit={(e) => handleAskQuestion(e)} className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>{isBn ? 'পণ্য সম্পর্কে প্রশ্ন করুন (রোবট সরাসরি উত্তর দেবে)' : 'Ask a Question to the Robot'}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {isBn ? 'আপনার নাম' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={isBn ? 'যেমন: আরিফুল ইসলাম' : 'e.g. Ariful Islam'}
                    value={askerName}
                    onChange={(e) => setAskerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {isBn ? 'আপনার প্রশ্ন' : 'Your Question'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={isBn ? 'যেমন: পণ্যটি কি খাঁটি? ডেলিভারি কত দিনে পাব?' : 'e.g. Is it authentic? When will I receive it?'}
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                      disabled={submittingQuestion}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={submittingQuestion || !userQuestion.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
                    >
                      {submittingQuestion ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>{isBn ? 'রোবট উত্তর দিচ্ছে...' : 'Answering...'}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>{isBn ? 'উত্তর নিন' : 'Get Answer'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Fast Suggested Questions */}
              <div className="pt-2 border-t border-indigo-100 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">
                  {isBn ? 'ঝটপট প্রশ্ন:' : 'Quick Questions:'}
                </span>
                {[
                  isBn ? 'পণ্যটির খাঁটি ও হালাল নিশ্চয়তা কী?' : 'What is the authenticity guarantee?',
                  isBn ? 'ডেলিভারি কত দিন লাগবে ও চার্জ কত?' : 'What is the delivery timeframe & cost?',
                  isBn ? 'ক্যাশ অন ডেলিভারিতে নেওয়ার নিয়ম কী?' : 'How does Cash on Delivery work?',
                  isBn ? 'ত্রুটিযুক্ত হলে পণ্য রিটার্ন করা যাবে?' : 'Is return available if damaged?'
                ].map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => {
                      setUserQuestion(preset);
                      handleAskQuestion(null as any, preset);
                    }}
                    disabled={submittingQuestion}
                    className="text-[10px] font-medium bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full transition cursor-pointer disabled:opacity-50"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </form>

            {/* List of Q&A Threads */}
            <div className="space-y-3 pt-2">
              <h5 className="text-xs font-black text-slate-900 flex items-center justify-between">
                <span>{isBn ? 'পূর্ববর্তী প্রশ্নোত্তর ও রোবটের উত্তর' : 'Previous Questions & Robot Answers'}</span>
                <span className="text-[10px] text-slate-400 font-bold">{qaList.length} {isBn ? 'টি প্রশ্নোত্তর' : 'items'}</span>
              </h5>

              {qaList.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Bot className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">
                    {isBn
                      ? 'এখনো কোনো প্রশ্ন করা হয়নি। প্রথম প্রশ্নটি করুন এবং রোবটের সরাসরি উত্তর পান!'
                      : 'No questions yet. Be the first to ask and get an instant robot reply!'}
                  </p>
                </div>
              ) : (
                qaList.map((qa: any, idx: number) => (
                  <div key={qa.id || idx} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2.5">
                    {/* User Question */}
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        Q
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-0.5">
                          <span className="font-bold text-slate-800">{qa.askerName || 'সম্মানিত গ্রাহক'}</span>
                          <span>{qa.date || '২০২৬'}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 leading-snug">{qa.question}</p>
                      </div>
                    </div>

                    {/* AI Robot Answer */}
                    <div className="flex items-start gap-2 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-indigo-800 flex items-center gap-1">
                            <span>{qa.answeredBy || (isBn ? 'আসকাডো এআই রোবট' : 'Ascado AI Robot')}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          </span>
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded-md">
                            {isBn ? 'সরাসরি উত্তর' : 'Direct Reply'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans">{qa.answer}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

