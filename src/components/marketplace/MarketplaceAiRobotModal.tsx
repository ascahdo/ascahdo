import React, { useState, useEffect, useRef } from 'react';
import {
  Bot, Sparkles, Send, X, MessageSquare, ShieldCheck, CheckCircle2,
  Copy, Check, ArrowRight, CornerDownLeft, RefreshCw, ShoppingCart,
  HelpCircle, ChevronRight, Zap
} from 'lucide-react';
import { api } from '../../services/api';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedProducts?: any[];
}

interface MarketplaceAiRobotModalProps {
  isOpen: boolean;
  onClose: () => void;
  productContext?: any | null;
  onSelectProduct?: (product: any) => void;
  onDirectOrder?: (product: any) => void;
  isBn: boolean;
}

export const MarketplaceAiRobotModal: React.FC<MarketplaceAiRobotModalProps> = ({
  isOpen,
  onClose,
  productContext,
  onSelectProduct,
  onDirectOrder,
  isBn
}) => {
  if (!isOpen) return null;

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const initialGreeting = productContext
    ? (isBn
        ? `আসসালামু আলাইকুম! আমি আসকাডো মার্কেটপ্লেসের স্বয়ংক্রিয় এআই রোবট। আপনি "${productContext.nameBn || productContext.name}" সম্পর্কে যেকোনো প্রশ্ন করতে পারেন—যেমন: পণ্যটির খাঁটি মান, বর্তমান স্টক, ঢাকা ও দেশব্যাপী ডেলিভারির সময়, ক্যাশ অন ডেলিভারি বা ব্যবহারের নিয়ম। আমি তাৎক্ষণিকভাবে সরাসরি উত্তর প্রদান করব!`
        : `Assalamu Alaikum! I am the Ascado Halal Marketplace AI Robot. Feel free to ask anything about "${productContext.nameBn || productContext.name}"—authenticity, stock, delivery, return policy, or pricing!`)
    : (isBn
        ? `আসসালামু আলাইকুম! আমি আসকাডো হালাল মার্কেটপ্লেসের সার্বক্ষণিক স্মার্ট এআই রোবট। খাঁটি সরিষার তেল, সুন্দরবনের মধু, ঐতিহ্যবাহী নকশিকাঁথা, ইসলামিক ডিজিটাল বই বা ডেলিভারি ও পেমেন্ট সংক্রান্ত আপনার যেকোনো প্রশ্নের সরাসরি সঠিক উত্তর দিতে আমি প্রস্তুত। কী জানতে চান বলুন!`
        : `Assalamu Alaikum! I am the 24/7 Ascado Halal Marketplace AI Robot. Ask me any question regarding our products, purity certifications, delivery timeframes, or digital licenses!`);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_msg',
      sender: 'bot',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickQuestions = productContext ? [
    (isBn ? 'পণ্যটি কি শতভাগ খাঁটি ও হালাল?' : 'Is this 100% genuine and halal?'),
    (isBn ? 'ডেলিভারি পেতে কত দিন লাগবে এবং চার্জ কত?' : 'What is the delivery time and fee?'),
    (isBn ? 'পেমেন্ট কীভাবে করতে হবে? ক্যাশ অন ডেলিভারি আছে?' : 'Can I pay Cash on Delivery?'),
    (isBn ? 'কোনো সমস্যা হলে কি পণ্য ফেরত বা পরিবর্তন করা যাবে?' : 'What is the return policy?')
  ] : [
    (isBn ? 'খাঁটি মধু ও সরিষার তেলের দাম ও ডেলিভারি কেমন?' : 'Honey and mustard oil pricing & delivery?'),
    (isBn ? 'ঢাকা ও ঢাকার বাইরে হোম ডেলিভারি কত দিনে হয়?' : 'Home delivery times across Bangladesh?'),
    (isBn ? 'বিকাশ ও ক্যাশ অন ডেলিভারিতে অর্ডারের নিয়ম কী?' : 'How to pay via bKash or Cash on Delivery?'),
    (isBn ? 'ডিজিটাল প্রোডাক্ট কেনার পর কীভাবে ডাউনলোড করব?' : 'How to download digital purchases?'),
    (isBn ? 'আসকাডো মার্কেটপ্লেসে হালাল মান কীভাবে নিশ্চিত করা হয়?' : 'How is Halal authenticity verified?')
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.askMarketplaceAiRobot({
        message: textToSend.trim(),
        productId: productContext?.id,
        history: messages.slice(-4).map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }))
      });

      const botReply = res?.reply || (isBn
        ? 'আসসালামু আলাইকুম! আসকাডো মার্কেটপ্লেসের প্রতিটি পণ্য ১০০% খাঁটি ও হালাল। বিস্তারিত তথ্যের জন্য আমাদের কাস্টমার হেল্পলাইনেও যোগাযোগ করতে পারেন।'
        : 'Assalamu Alaikum! All products on Ascado Marketplace are authentic and halal-compliant.');

      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: res?.suggestedProducts || []
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('AI assistant request failed', err);
      setMessages(prev => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: 'bot',
          text: isBn
            ? 'আসসালামু আলাইকুম! আমাদের মার্কেটপ্লেসে ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা (৬০ টাকা) এবং ঢাকার বাইরে ২-৩ দিনে (১২০ টাকা) ক্যাশ অন ডেলিভারিতে পণ্য পৌঁছানো হয়। যেকোনো ত্রুটিতে রয়েছে ৭ দিনের রিটার্ন গ্যারান্টি।'
            : 'Assalamu Alaikum! Deliveries take 24-48h in Dhaka (60 BDT) and 2-3 days outside Dhaka (120 BDT) with cash on delivery.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-indigo-200 flex flex-col h-[90vh] sm:h-[650px] overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between border-b border-indigo-700/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/30 border border-indigo-300/40 flex items-center justify-center text-amber-300 shadow-inner">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-100 animate-ping" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                  <span>{isBn ? 'মার্কেটপ্লেস এআই রোবট' : 'Marketplace AI Robot'}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/40 border border-indigo-300/30 text-indigo-100 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    <span>Gemini AI</span>
                  </span>
                </h3>
              </div>
              <p className="text-[11px] text-indigo-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{isBn ? 'স্বয়ংক্রিয়ভাবে সরাসরি উত্তর প্রদান করছে' : 'Instant Direct Robot Answers 24/7'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Optional Context Banner if opened from a specific product */}
        {productContext && (
          <div className="bg-amber-50/90 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={productContext.imageUrl}
                alt=""
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-lg object-cover border border-amber-300 shrink-0"
              />
              <div className="truncate">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">
                  {isBn ? 'বর্তমান জিজ্ঞাসিত পণ্য' : 'Current Product Focus'}
                </span>
                <span className="font-black text-slate-900 truncate block">
                  {productContext.nameBn || productContext.name}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-black text-amber-900 text-sm">৳{productContext.price}</span>
            </div>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/70">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 text-xs leading-relaxed space-y-2 relative shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
                    <span className="text-[10px] font-black text-indigo-700 flex items-center gap-1">
                      <Bot className="w-3 h-3 text-indigo-600" />
                      <span>{isBn ? 'আসকাডো রোবটের সরাসরি উত্তর' : 'Direct AI Robot Reply'}</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer transition"
                      title={isBn ? 'উত্তর কপি করুন' : 'Copy answer'}
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}

                <div className="whitespace-pre-wrap font-sans text-xs">
                  {msg.text}
                </div>

                {/* Suggested Product Cards if returned by bot */}
                {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">
                      {isBn ? 'প্রাসঙ্গিক প্রস্তাবিত পণ্যসমূহ:' : 'Recommended Products:'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.suggestedProducts.map((sp: any) => (
                        <div
                          key={sp.id}
                          className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2 hover:border-indigo-300 transition"
                        >
                          <img
                            src={sp.imageUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="overflow-hidden flex-1">
                            <span className="text-[11px] font-bold text-slate-900 block truncate">
                              {sp.nameBn || sp.name}
                            </span>
                            <span className="text-xs font-black text-indigo-700">৳{sp.price}</span>
                          </div>
                          {onDirectOrder && (
                            <button
                              onClick={() => onDirectOrder(sp)}
                              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold shrink-0 cursor-pointer"
                            >
                              {isBn ? 'কিনুন' : 'Order'}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[9px] pt-1 text-right ${
                    msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-indigo-600 bg-white border border-indigo-100 p-3 rounded-2xl max-w-xs shadow-xs">
              <div className="w-7 h-7 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 animate-spin">
                <RefreshCw className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 block">
                  {isBn ? 'রোবট উত্তর তৈরি করছে...' : 'Robot is generating answer...'}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {isBn ? 'তাৎক্ষণিক তথ্য যাচাই করা হচ্ছে' : 'Searching marketplace data'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="bg-white border-t border-slate-100 px-3.5 py-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 shrink-0 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-indigo-500" />
              <span>{isBn ? 'দ্রুত প্রশ্ন:' : 'Quick:'}</span>
            </span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 rounded-full text-[11px] font-medium transition cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  isBn
                    ? (productContext
                        ? `এই পণ্য সম্পর্কে রোবটকে প্রশ্ন করুন...`
                        : 'মার্কেটপ্লেসের পণ্য বা ডেলিভারি সম্পর্কে যেকোনো প্রশ্ন লিখুন...')
                    : 'Ask the robot any question...'
                }
                disabled={loading}
                className="w-full pl-4 pr-10 py-3 bg-slate-50 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-4 sm:px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isBn ? 'জিজ্ঞাসা করুন' : 'Ask'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-2">
            {isBn
              ? '🤖 গুগল জেমিনি এআই চালিত আসকাডো রোবট সরাসরি ও তাৎক্ষণিকভাবে উত্তর প্রদান করে।'
              : 'Powered by Google Gemini AI • Instant automated replies.'}
          </p>
        </div>

      </div>
    </div>
  );
};
