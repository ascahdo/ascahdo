import React, { useState } from 'react';
import {
  ShoppingBag, X, Trash2, ArrowRight, ShieldCheck, Download,
  CheckCircle2, Truck, Sparkles, CreditCard, Tag, Key, Copy, AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'physical' | 'digital' | 'b2b_wholesale' | 'bundle';
  imageUrl?: string;
  downloadUrl?: string;
  fileFormat?: string;
  weight?: string;
  sellerName?: string;
  licenseType?: 'personal' | 'commercial';
  commercialPrice?: number;
}

interface MarketplaceCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenVault?: () => void;
  isBn: boolean;
}

export const MarketplaceCartDrawer: React.FC<MarketplaceCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOpenVault,
  isBn
}) => {
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [district, setDistrict] = useState('ঢাকা');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'bkash_online'>('bkash_online');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Copy indicator
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const items = cartItems || [];
  const hasPhysical = items.some(item => item.type === 'physical' || item.type === 'b2b_wholesale');
  const hasDigital = items.some(item => item.type === 'digital');

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const deliveryFee = hasPhysical ? (district.includes('ঢাকা') || district.toLowerCase().includes('dhaka') ? 60 : 120) : 0;
  const grandTotal = discountedSubtotal + deliveryFee;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await api.validateCoupon({
        code: couponCodeInput.trim(),
        totalAmount: subtotal
      });

      if (res && res.valid) {
        setAppliedCoupon(res);
      } else {
        setAppliedCoupon(null);
        setCouponError(res?.error || (isBn ? 'অবৈধ কুপন কোড' : 'Invalid coupon code'));
      }
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(isBn ? 'কুপন যাচাই করা যায়নি' : 'Failed to validate coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      const orderPayload = {
        isCartOrder: true,
        cartItems: items.map(it => ({
          productId: it.id,
          productName: it.name,
          quantity: it.quantity,
          price: it.price,
          type: it.type,
          licenseType: it.licenseType || 'personal',
          downloadUrl: it.downloadUrl,
          fileFormat: it.fileFormat
        })),
        buyerName,
        buyerPhone,
        buyerEmail,
        deliveryAddress: deliveryAddress || (hasDigital ? 'Digital Instant Vault Delivery' : 'N/A'),
        district,
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
        discountAmount
      };

      const res = await api.placeOrder(orderPayload);
      setCompletedOrder(res);
      onClearCart();
    } catch (err) {
      console.error(err);
      alert(isBn ? 'অর্ডার প্রক্রিয়া সম্পন্ন করা যায়নি' : 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setIsCheckingOut(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" onClick={handleClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">
                  {isBn ? 'আপনার শপিং কার্ট ও চেকআউট' : 'Your Shopping Cart'}
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {items.length} {isBn ? 'টি আইটেম যুক্ত রয়েছে' : 'items in cart'}
                  {hasDigital && ` • ${isBn ? 'ডিজিটাল ইনস্ট্যান্ট ডেলিভারি' : 'Digital Instant'}`}
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            
            {/* Order Success Screen */}
            {completedOrder ? (
              <div className="space-y-4 py-2">
                <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-200 text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-base text-emerald-950">
                    {isBn ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'Order Placed Successfully!'}
                  </h4>
                  <p className="text-xs text-emerald-800">
                    {isBn ? 'ইনভয়েস আইডি:' : 'Invoice ID:'} <span className="font-mono font-bold">{completedOrder.id}</span>
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    {isBn
                      ? 'অর্ডার কপি ও লাইসেন্স সার্টিফিকেট আপনার মোবাইল নম্বর ও ডিজিটাল ভল্টে সংরক্ষিত হয়েছে।'
                      : 'Confirmation saved to your phone & customer digital vault.'}
                  </p>
                </div>

                {/* Digital Download Access Links & Cryptographic License Keys */}
                {(completedOrder.isDigitalVaultAvailable ||
                  (completedOrder.items && completedOrder.items.some((it: any) => it.productType === 'digital')) ||
                  completedOrder.productType === 'digital') && (
                  <div className="bg-indigo-50/80 rounded-2xl p-4 border border-indigo-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-indigo-950 font-black text-xs">
                        <Key className="w-4 h-4 text-indigo-600" />
                        <span>{isBn ? 'আপনার ডিজিটাল লাইসেন্স কী ও ডাউনলোড' : 'Instant License Keys & Downloads'}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        {isBn ? 'অ্যাক্টিভ' : 'Active'}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {completedOrder.items
                        ? completedOrder.items
                            .filter((it: any) => it.productType === 'digital')
                            .map((it: any, idx: number) => (
                              <div key={idx} className="bg-white p-3 rounded-xl border border-indigo-200 space-y-2 shadow-xs">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-bold text-slate-900 truncate">{it.productName}</p>
                                  <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                    {it.licenseType || 'Personal'}
                                  </span>
                                </div>

                                {it.licenseKey && (
                                  <div className="bg-slate-900 text-amber-300 p-2 rounded-lg text-[11px] font-mono flex items-center justify-between">
                                    <span className="truncate select-all">{it.licenseKey}</span>
                                    <button
                                      onClick={() => handleCopyKey(it.licenseKey, `cart_${idx}`)}
                                      className="ml-2 text-slate-300 hover:text-white shrink-0 cursor-pointer"
                                    >
                                      {copiedKey === `cart_${idx}` ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                )}

                                <a
                                  href={it.downloadUrl || 'https://ascado.org/downloads/digital-file.zip'}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1 shadow-xs transition"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>{isBn ? 'ফাইল ডাউনলোড করুন' : 'Download File'}</span>
                                </a>
                              </div>
                            ))
                        : (
                          <div className="bg-white p-3 rounded-xl border border-indigo-200 space-y-2">
                            <p className="text-xs font-bold text-slate-900">{completedOrder.productName}</p>
                            {completedOrder.licenseKey && (
                              <div className="bg-slate-900 text-amber-300 p-2 rounded-lg text-[11px] font-mono flex items-center justify-between">
                                <span>{completedOrder.licenseKey}</span>
                                <button
                                  onClick={() => handleCopyKey(completedOrder.licenseKey, 'single')}
                                  className="ml-2 text-slate-300 hover:text-white"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                            <a
                              href={completedOrder.downloadUrl || 'https://ascado.org/downloads/digital-file.zip'}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1 shadow-xs transition"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{isBn ? 'ইনস্ট্যান্ট ডাউনলোড' : 'Download Now'}</span>
                            </a>
                          </div>
                        )}
                    </div>

                    {onOpenVault && (
                      <button
                        type="button"
                        onClick={() => {
                          handleClose();
                          onOpenVault();
                        }}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>{isBn ? '🔐 আমার ডিজিটাল ভল্টে সংরক্ষণ দেখুন' : 'View in Customer Vault'}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Physical Delivery Info */}
                {completedOrder.deliveryFee > 0 && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>{isBn ? 'কুরিয়ার ডেলিভারি আপডেট' : 'Courier Shipping'}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {isBn
                        ? `ডেলিভারি ঠিকানা: ${completedOrder.deliveryAddress}, ${completedOrder.district}। পণ্যটি আগামী ২-৩ কার্যদিবসের মধ্যে আপনার ঠিকানায় পৌঁছে যাবে।`
                        : `Delivery to ${completedOrder.deliveryAddress}. Estimated arrival within 2-3 business days.`}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  {isBn ? 'মার্কেটপ্লেসে ফিরে যান' : 'Continue Shopping'}
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-sm text-slate-700">
                  {isBn ? 'আপনার কার্ট খালি রয়েছে' : 'Your cart is empty'}
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {isBn ? 'পণ্য বা ডিজিটাল ফাইল নির্বাচন করে কার্টে যোগ করুন।' : 'Add products or digital items to begin shopping.'}
                </p>
              </div>
            ) : isCheckingOut ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-black text-slate-900">{isBn ? 'চেকআউট তথ্য পূরণ করুন' : 'Fill Checkout Details'}</span>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-indigo-600 font-bold hover:underline cursor-pointer"
                  >
                    ← {isBn ? 'কার্ট আইটেম দেখুন' : 'Back to Cart'}
                  </button>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isBn ? 'আপনার নাম' : 'Full Name'} *</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder={isBn ? 'যেমন: মোহাম্মদ তানভীর' : 'e.g. Tanvir Ahmed'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isBn ? 'মোবাইল নম্বর' : 'Phone Number'} *</label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {isBn ? 'ডিজিটাল ভল্ট থেকে লাইসেন্স ও ফাইল পুনরায় অ্যাক্সেস করতে এই নম্বর ব্যবহৃত হবে।' : 'Used to retrieve your purchases from the Digital Vault.'}
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ইমেইল অ্যাড্রেস (ডিজিটাল কপি প্রাপ্তি)' : 'Email Address'}</label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                {hasPhysical && (
                  <>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ডেলিভারি জেলা' : 'District'} *</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium"
                      >
                        <option value="ঢাকা">ঢাকা (ডেলিভারি চার্জ ৳৬০)</option>
                        <option value="চট্টগ্রাম">চট্টগ্রাম (ডেলিভারি চার্জ ৳১২০)</option>
                        <option value="সিলেট">সিলেট (ডেলিভারি চার্জ ৳১২০)</option>
                        <option value="রাজশাহী">রাজশাহী (ডেলিভারি চার্জ ৳১২০)</option>
                        <option value="খুলনা">খুলনা (ডেলিভারি চার্জ ৳১২০)</option>
                        <option value="বরিশাল">বরিশাল (ডেলিভারি চার্জ ৳১২০)</option>
                        <option value="রংপুর">রংপুর (ডেলিভারি চার্জ ৳১২০)</option>
                        <option value="ময়মনসিংহ">ময়মনসিংহ (ডেলিভারি চার্জ ৳১২০)</option>
                        <option value="অন্যান্য">অন্যান্য জেলা (ডেলিভারি চার্জ ৳১২০)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{isBn ? 'সম্পূর্ণ ডেলিভারি ঠিকানা' : 'Full Delivery Address'} *</label>
                      <textarea
                        required
                        rows={2}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder={isBn ? 'বাড়ি নং, রোড, এলাকা' : 'House, Road, Area'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                  </>
                )}

                {/* Payment Selection */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash_online')}
                      className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                        paymentMethod === 'bkash_online'
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-indigo-600" />
                      <span className="text-[11px]">bKash / Nagad / Card</span>
                    </button>

                    {hasPhysical && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash_on_delivery')}
                        className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                          paymentMethod === 'cash_on_delivery'
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        <Truck className="w-4 h-4 text-amber-600" />
                        <span className="text-[11px]">{isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{isBn ? 'সাবটোটাল:' : 'Subtotal:'}</span>
                    <span>৳{subtotal}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>{appliedCoupon.labelBn || appliedCoupon.code}:</span>
                      <span>-৳{appliedCoupon.discountAmount}</span>
                    </div>
                  )}
                  {hasPhysical && (
                    <div className="flex justify-between text-slate-600">
                      <span>{isBn ? 'কুরিয়ার ডেলিভারি:' : 'Shipping:'}</span>
                      <span>৳{deliveryFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-900 font-black pt-1 border-t border-slate-200 text-sm">
                    <span>{isBn ? 'মোট পরিশোধযোগ্য:' : 'Total Payable:'}</span>
                    <span className="text-indigo-600 font-mono">৳{grandTotal}</span>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{submitting ? (isBn ? 'অর্ডার প্রসেস হচ্ছে...' : 'Processing...') : (isBn ? `৳${grandTotal} পরিশোধ নিশ্চিত করুন` : `Confirm Payment (৳${grandTotal})`)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              // Items List & Coupon Code Area
              <div className="space-y-4">
                
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                        )}
                        <div className="overflow-hidden space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                item.type === 'digital'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : item.type === 'bundle'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {item.type === 'digital'
                                ? 'Digital'
                                : item.type === 'bundle'
                                ? 'Bundle'
                                : 'Physical'}
                            </span>
                            {item.type === 'digital' && (
                              <span className="text-[9px] font-bold text-slate-500">
                                {item.licenseType === 'commercial' ? 'Commercial' : 'Personal'}
                              </span>
                            )}
                          </div>
                          <h5 className="font-bold text-xs text-slate-900 truncate">{item.name}</h5>
                          <span className="text-xs font-black text-indigo-700">৳{item.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center bg-white rounded-lg border border-slate-200 px-1 py-0.5">
                          <button
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="w-5 h-5 flex items-center justify-center text-xs font-black text-slate-600 hover:text-slate-900 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-1.5 text-xs font-black text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-xs font-black text-slate-600 hover:text-slate-900 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <form onSubmit={handleApplyCoupon} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-slate-700 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isBn ? 'কুপন বা ডিসকাউন্ট ভাউচার' : 'Promo / Discount Code'}</span>
                    </span>
                    <span className="text-[10px] text-indigo-600 font-bold">DIGITAL20, HALAL10</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={isBn ? 'কুপন লিখুন (যেমন: DIGITAL20)' : 'e.g. DIGITAL20'}
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-mono text-xs uppercase focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                    >
                      {couponLoading ? '...' : (isBn ? 'প্রয়োগ' : 'Apply')}
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-[10px] text-rose-600 font-bold">{couponError}</p>
                  )}

                  {appliedCoupon && (
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                      <span className="font-bold">✓ {appliedCoupon.labelBn || appliedCoupon.code}</span>
                      <span className="font-black">-৳{appliedCoupon.discountAmount}</span>
                    </div>
                  )}
                </form>

              </div>
            )}

          </div>

          {/* Footer with summary and checkout trigger */}
          {!completedOrder && items.length > 0 && !isCheckingOut && (
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{isBn ? 'পণ্য মূল্য (সাবটোটাল):' : 'Subtotal:'}</span>
                  <span className="font-bold text-slate-900">৳{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>{isBn ? 'ডিসকাউন্ট কুপন:' : 'Discount:'}</span>
                    <span>-৳{appliedCoupon.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>{isBn ? 'ডেলিভারি চার্জ:' : 'Shipping:'}</span>
                  <span className="font-bold text-slate-900">
                    {hasPhysical ? `৳${deliveryFee}` : (isBn ? 'ফ্রি (ডিজিটাল ডাউনলোড)' : 'Free (Digital)')}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>{isBn ? 'সর্বমোট প্রদেয়:' : 'Grand Total:'}</span>
                  <span className="text-indigo-600 text-base font-mono">৳{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isBn ? 'চেকআউট ও পেমেন্টে এগিয়ে চলুন' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
