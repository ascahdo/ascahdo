import React, { useState, useEffect } from 'react';
import {
  Store, PlusCircle, DollarSign, Package, TrendingUp, ShieldCheck,
  CheckCircle2, Clock, Truck, Download, AlertCircle, FileText, Sparkles, Filter
} from 'lucide-react';
import { api } from '../../services/api';

interface VendorPortalViewProps {
  vendors: any[];
  isBn: boolean;
  onProductAdded: (newProduct: any) => void;
  onOpenRegisterModal: () => void;
}

export const VendorPortalView: React.FC<VendorPortalViewProps> = ({
  vendors,
  isBn,
  onProductAdded,
  onOpenRegisterModal
}) => {
  const [selectedVendorId, setSelectedVendorId] = useState<string>(vendors?.[0]?.id || 'vnd_01');
  const [vendorOrders, setVendorOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New Product Form State
  const [productType, setProductType] = useState<'physical' | 'digital'>('physical');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('অর্গানিক ফুড');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>(50);
  const [weight, setWeight] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileFormat, setFileFormat] = useState('PDF');
  const [submittingProduct, setSubmittingProduct] = useState(false);

  const currentVendor = (vendors || []).find((v) => v.id === selectedVendorId) || vendors?.[0];

  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedVendorId) return;
      setLoadingOrders(true);
      try {
        const orders = await api.getMarketplaceOrders({ vendorId: selectedVendorId });
        setVendorOrders(orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [selectedVendorId]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    setSubmittingProduct(true);
    try {
      const numPrice = Number(price);
      const newProd = {
        name,
        nameBn: name,
        type: productType,
        productType,
        category,
        categoryBn: category,
        price: numPrice,
        originalPrice: Math.round(numPrice * 1.15),
        sellerId: currentVendor?.id || 'vnd_01',
        sellerName: currentVendor?.storeNameBn || currentVendor?.storeName || 'Verified Halal Seller',
        stock: productType === 'digital' ? 99999 : (Number(stock) || 50),
        weight: productType === 'physical' ? (weight || '1 kg') : undefined,
        fileFormat: productType === 'digital' ? fileFormat : undefined,
        downloadUrl: productType === 'digital' ? (downloadUrl || 'https://ascado.org/downloads/sample-file.pdf') : undefined,
        imageUrl: imageUrl || (productType === 'digital'
          ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80'),
        platformCommissionRate: 0.10,
        rating: 5.0,
        reviewsCount: 1,
        verified: true,
        description
      };

      const created = await api.createProduct(newProd);
      onProductAdded(created);
      setShowAddProductModal(false);
      // Reset form
      setName('');
      setPrice('');
      setDescription('');
      setImageUrl('');
      setDownloadUrl('');
      alert(isBn ? 'নতুন পণ্য সফলভাবে যুক্ত করা হয়েছে!' : 'Product added successfully!');
    } catch (err) {
      console.error(err);
      alert(isBn ? 'পণ্য যুক্ত করা সম্ভব হয়নি' : 'Failed to add product');
    } finally {
      setSubmittingProduct(false);
    }
  };

  const totalGross = vendorOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalCommission = Math.round(totalGross * 0.10);
  const totalNetPayout = totalGross - totalCommission;

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Active Vendor Selector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentVendor?.logo || 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=200&auto=format&fit=crop&q=80'}
            alt="Store Logo"
            className="w-16 h-16 rounded-2xl object-cover border border-amber-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900">
                {currentVendor?.storeNameBn || currentVendor?.storeName}
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>{isBn ? 'ভেরিফায়েড মার্চেন্ট' : 'Verified'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isBn ? 'স্বত্বাধিকারী:' : 'Proprietor:'} <span className="font-bold text-slate-700">{currentVendor?.ownerName}</span> | {isBn ? 'জেলা:' : 'Location:'} {currentVendor?.district}
            </p>
          </div>
        </div>

        {/* Vendor Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              {isBn ? 'ভেন্ডর স্টোর পরিবর্তন' : 'Switch Vendor Store'}
            </span>
            <select
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 text-slate-800"
            >
              {(vendors || []).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.storeNameBn || v.storeName} ({v.district})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer self-end"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isBn ? 'নতুন পণ্য যুক্ত করুন' : 'Add New Product'}</span>
          </button>

          <button
            onClick={onOpenRegisterModal}
            className="px-4 py-2.5 rounded-xl border border-amber-300 text-amber-900 hover:bg-amber-50 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer self-end"
          >
            <Store className="w-4 h-4" />
            <span>{isBn ? 'নতুন ভেন্ডর নিবন্ধন' : 'Register Store'}</span>
          </button>
        </div>
      </div>

      {/* Financial Performance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold">{isBn ? 'মোট বিক্রয় (Gross)' : 'Gross Sales'}</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">৳{totalGross}</p>
          <span className="text-[10px] text-slate-400 block">{vendorOrders.length} {isBn ? 'টি অর্ডার সম্পন্ন' : 'orders'}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold">{isBn ? 'প্ল্যাটফর্ম ফি (১০%)' : 'Platform Fee (10%)'}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600">৳{totalCommission}</p>
          <span className="text-[10px] text-slate-400 block">{isBn ? 'সার্ভার ও কাস্টমার সাপোর্ট' : 'Server & Operations'}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold">{isBn ? 'ভেন্ডর প্রদেয় (৯০%)' : 'Net Vendor Payout (90%)'}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">৳{totalNetPayout}</p>
          <span className="text-[10px] text-emerald-700 font-medium block">✓ {isBn ? 'সাপ্তাহিক স্বয়ংক্রিয় সেটেলমেন্ট' : 'Weekly Automated Payout'}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold">{isBn ? 'রেটিং ও বিশ্বাসযোগ্যতা' : 'Store Rating'}</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">★ {currentVendor?.rating || 5.0} / 5.0</p>
          <span className="text-[10px] text-slate-400 block">{isBn ? '১০০% হালাল অঙ্গীকারভুক্ত' : 'Halal Guaranteed'}</span>
        </div>

      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 pb-2 flex items-center justify-between border-b border-slate-100">
          <div>
            <h4 className="font-black text-base text-slate-900">
              {isBn ? 'ভেন্ডরের সাম্প্রতিক অর্ডার ও শিপমেন্ট তালিকা' : 'Vendor Incoming Orders'}
            </h4>
            <p className="text-xs text-slate-500">
              {isBn ? 'কাস্টমারদের অর্ডার স্ট্যাটাস এবং প্রদেয় হিসাব' : 'Real-time order tracker and payout breakdown'}
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            {vendorOrders.length} {isBn ? 'টি অর্ডার' : 'Orders'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{isBn ? 'অর্ডার আইডি' : 'Order ID'}</th>
                <th className="py-3 px-4">{isBn ? 'পণ্য' : 'Product'}</th>
                <th className="py-3 px-4">{isBn ? 'ধরন' : 'Type'}</th>
                <th className="py-3 px-4">{isBn ? 'পরিমাণ' : 'Qty'}</th>
                <th className="py-3 px-4">{isBn ? 'মোট মূল্য' : 'Gross Total'}</th>
                <th className="py-3 px-4">{isBn ? 'ভেন্ডর পাবে (৯০%)' : 'Net Payout'}</th>
                <th className="py-3 px-4">{isBn ? 'ক্রেতা ও ঠিকানা' : 'Customer & Contact'}</th>
                <th className="py-3 px-4">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendorOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    {isBn ? 'এই ভেন্ডরের অধীনে এখনও কোনো অর্ডার রেকর্ড হয়নি।' : 'No orders found for this vendor yet.'}
                  </td>
                </tr>
              ) : (
                vendorOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{o.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 max-w-[180px] truncate">
                      {o.productName || (o.items && o.items[0]?.productName) || 'Halal Item'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        o.productType === 'digital'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {o.productType === 'digital' ? 'Digital' : 'Physical'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">{o.quantity || o.itemCount || 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">৳{o.totalAmount}</td>
                    <td className="py-3 px-4 font-black text-emerald-600">৳{o.sellerPayout || Math.round(o.totalAmount * 0.9)}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{o.buyerName}</div>
                      <div className="font-mono text-[11px] text-slate-500">{o.buyerPhone}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{o.deliveryAddress}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {o.status === 'completed' || o.productType === 'digital' ? '✓ সম্পন্ন / ডেলিভার্ড' : 'কনফার্মড'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-amber-200 my-8 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900">
                    {isBn ? 'নতুন হালাল পণ্য তালিকাভুক্ত করুন' : 'List New Halal Product'}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {isBn ? 'ডিজিটাল অথবা ফিজিক্যাল পণ্য আপলোড' : 'Publish Digital or Physical goods'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              
              {/* Type Switcher */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{isBn ? 'পণ্যের ধরন' : 'Product Type'} *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setProductType('physical')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex items-center justify-center gap-2 ${
                      productType === 'physical'
                        ? 'border-amber-600 bg-amber-50/70 text-amber-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>{isBn ? 'ফিজিক্যাল পণ্য (মধু, তেল, ইত্যাদি)' : 'Physical Product'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductType('digital')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex items-center justify-center gap-2 ${
                      productType === 'digital'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>{isBn ? 'ডিজিটাল পণ্য (ই-বুক, ফাইল, সফটওয়্যার)' : 'Digital Download'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isBn ? 'পণ্যের নাম' : 'Product Name'} *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={productType === 'digital' ? 'যেমন: আধুনিক ইসলামিক ফিন্যান্স ই-বুক' : 'যেমন: সুন্দরবনের প্রাকৃতিক চাকের মধু'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ক্যাটাগরি' : 'Category'}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    {productType === 'digital' ? (
                      <>
                        <option value="ডিজিটাল ই-বুক ও সফটওয়্যার">ডিজিটাল ই-বুক ও সফটওয়্যার</option>
                        <option value="ডিজিটাল গ্রাফিক্স ও আর্ট">ডিজিটাল গ্রাফিক্স ও আর্ট</option>
                        <option value="ডিজিটাল টুলস ও সফটওয়্যার">ডিজিটাল টুলস ও সফটওয়্যার</option>
                        <option value="শিক্ষা ও লার্নিং অ্যাপ">শিক্ষা ও লার্নিং অ্যাপ</option>
                      </>
                    ) : (
                      <>
                        <option value="অর্গানিক ফুড">অর্গানিক ফুড (মধু, তেল, ঘি)</option>
                        <option value="হস্তশিল্প ও কুটিরশিল্প">হস্তশিল্প ও কুটিরশিল্প</option>
                        <option value="সুগন্ধি ও আতর">সুগন্ধি ও আতর</option>
                        <option value="ভেষজ ও সুন্নতি পণ্য">ভেষজ ও সুন্নতি পণ্য</option>
                        <option value="বি২বি পাইকারি">বি২বি পাইকারি বাল্ক</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isBn ? 'বিক্রয় মূল্য (টাকা)' : 'Price (BDT)'} *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="500"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                  />
                  {price && (
                    <span className="text-[10px] text-emerald-600 block mt-1">
                      {isBn ? `ভেন্ডর পাবে (৯০%): ৳${Math.round(Number(price) * 0.9)} | প্ল্যাটফর্ম ফি (১০%): ৳${Math.round(Number(price) * 0.1)}` : ''}
                    </span>
                  )}
                </div>
              </div>

              {productType === 'digital' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-indigo-50/40 p-3 rounded-xl border border-indigo-100">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ফাইল ফরম্যাট' : 'File Format'}</label>
                    <input
                      type="text"
                      value={fileFormat}
                      onChange={(e) => setFileFormat(e.target.value)}
                      placeholder="PDF / ZIP / EPUB / SVG"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ডাউনলোড লিঙ্ক / স্টোরেজ URL' : 'Download URL'}</label>
                    <input
                      type="url"
                      value={downloadUrl}
                      onChange={(e) => setDownloadUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ওজন / সাইজ' : 'Weight / Size'}</label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="১ কেজি / ৫০০ গ্রাম"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'স্টক সংখ্যা' : 'Stock Qty'}</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value ? Number(e.target.value) : '')}
                      placeholder="50"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isBn ? 'পণ্যের ছবির লিঙ্ক (Image URL)' : 'Product Image URL'}</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isBn ? 'পণ্য ও হালাল বৈশিষ্ট্যের বিবরণ' : 'Description & Halal Features'}</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="পণ্যের গুণাগুণ ও উপাদান..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submittingProduct}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black shadow-md cursor-pointer"
                >
                  {submittingProduct ? (isBn ? 'যুক্ত হচ্ছে...' : 'Adding...') : (isBn ? 'পণ্য প্রকাশ করুন' : 'Publish Product')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
