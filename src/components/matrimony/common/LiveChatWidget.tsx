import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  PhoneCall,
  CheckCheck,
  Minimize2,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'agent';
  text: string;
  time: string;
  senderName?: string;
}

interface QuickOption {
  id: string;
  labelBn: string;
  labelEn: string;
  responseBn: string;
  responseEn: string;
}

const QUICK_OPTIONS: QuickOption[] = [
  {
    id: 'how_to_search',
    labelBn: '🔍 উপযুক্ত পাত্র-পাত্রী কীভাবে খুঁজব?',
    labelEn: '🔍 How to find matching bride/groom?',
    responseBn:
      'মেনু থেকে "পাত্রী খুঁজুন" বা "পাত্র খুঁজুন"-এ ক্লিক করুন। সেখানে বয়স, জেলা, ধর্ম, শিক্ষাগত যোগ্যতা ও পেশা অনুযায়ী নিখুঁত ফিল্টার করে কাঙ্ক্ষিত বায়োডাটা খুঁজে পেতে পারেন।',
    responseEn:
      'Click on "Find Bride" or "Find Groom" in the navigation bar. You can filter profiles by age, district, religion, profession, and marital status to find your ideal match.',
  },
  {
    id: 'how_to_register',
    labelBn: '📝 ফ্রি বায়োডাটা কীভাবে তৈরি করব?',
    labelEn: '📝 How to create free Biodata?',
    responseBn:
      'উপরে ডানে "ফ্রি বায়োডাটা তৈরি করুন" বাটনে ক্লিক করুন। মাত্র কয়েকটি সহজ ধাপে আপনার ব্যক্তিগত, শিক্ষাগত, পেশাগত ও পরিবারের তথ্য দিয়ে মুহূর্তেই বায়োডাটা প্রকাশ করুন।',
    responseEn:
      'Click on "Register" or "Create Biodata" at the top right. In just 3-4 simple steps, you can publish your complete matrimonial biodata for free.',
  },
  {
    id: 'nid_verify',
    labelBn: '🛡️ এনআইডি ভেরিফিকেশন কীভাবে করব?',
    labelEn: '🛡️ How to verify NID / Biodata?',
    responseBn:
      'আপনার ড্যাশবোর্ডে গিয়ে "ভেরিফিকেশন" ট্যাবে ক্লিক করে আপনার এনআইডি বা পাসপোর্টের ছবি আপলোড করুন। আমাদের মডারেশন টিম দ্রুত যাচাই করে ব্লু ভেরিফাইড ব্যাজ যুক্ত করে দেবে।',
    responseEn:
      'Go to your Dashboard, click on the "Verification" tab, and upload a clear photo of your NID or Passport. Our verification team will review and assign a verified trust badge to your profile.',
  },
  {
    id: 'payment_plans',
    labelBn: '💳 মেম্বারশিপ প্যাকেজ ও খরচ কত?',
    labelEn: '💳 Membership packages & pricing?',
    responseBn:
      'বায়োডাটা তৈরি সম্পূর্ণ ফ্রি। সরাসরি অভিভাবকের নম্বর দেখা ও আনলিমিটেড চ্যাটের জন্য স্ট্যান্ডার্ড (১৪৯০ টাকা) ও গোল্ড ভিআইপি (২৯৯০ টাকা) প্যাকেজ রয়েছে যা বিকাশ, নগদ বা ব্যাংকে পরিশোধযোগ্য।',
    responseEn:
      'We offer Free Basic membership as well as Standard (BDT 1,490) and VIP (BDT 2,990) plans. Premium plans allow direct access to verified contact numbers and unlimited messaging.',
  },
  {
    id: 'speak_human',
    labelBn: '📞 ম্যাচমেকার কনসালট্যান্টের সাথে কথা বলব',
    labelEn: '📞 Speak directly to Matchmaking Consultant',
    responseBn:
      'আমাদের প্রধান কার্যালয়ের ম্যাচমেকারদের সাথে সরাসরি কথা বলতে কল করুন: +৮৮০ ১৮১৩-৮১৭১৬৭ অথবা হোয়াটসঅ্যাপে মেসেজ দিন। ইমেইল: ascahdo@gmail.com',
    responseEn:
      'Our matchmaking consultants are ready to assist you! Call our helpline at +880 1813-817167 or email us at ascahdo@gmail.com.',
  },
];

export const LiveChatWidget: React.FC = () => {
  const { lang } = useMatrimonyLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'agent',
      senderName: lang === 'bn' ? 'রোকেয়া পারভীন (সিনিয়র ম্যাচমেকার)' : 'Rokeya Parveen (Senior Consultant)',
      text:
        lang === 'bn'
          ? 'আসসালামু আলাইকুম! এসকাডো ম্যারেজ মিডিয়ায় আপনাকে স্বাগতম। পাত্র-পাত্রী সন্ধান বা যেকোনো তথ্যে আপনাকে কীভাবে সহায়তা করতে পারি?'
          : 'Welcome to Ascahdo Marriage Media! How may I assist you with your matchmaking today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      const lower = text.toLowerCase();
      const matchedQuick = QUICK_OPTIONS.find(
        q =>
          lower.includes(q.id) ||
          (lang === 'bn' ? q.labelBn.toLowerCase().includes(lower) : q.labelEn.toLowerCase().includes(lower))
      );

      if (matchedQuick) {
        replyText = lang === 'bn' ? matchedQuick.responseBn : matchedQuick.responseEn;
      } else if (lower.includes('ফোন') || lower.includes('মোবাইল') || lower.includes('phone') || lower.includes('call') || lower.includes('যোগাযোগ') || lower.includes('নম্বর') || lower.includes('email')) {
        replyText =
          lang === 'bn'
            ? 'আমাদের সরাসরি হটলাইন: +৮৮০ ১৮১৩-৮১৭১৬৭ এবং ইমেইল: ascahdo@gmail.com। প্রতিদিন সকাল ৯টা থেকে রাত ১০টা পর্যন্ত আমরা সেবায় নিয়োজিত।'
            : 'Our direct hotline is +880 1813-817167 and support email is ascahdo@gmail.com. We are available from 9 AM to 10 PM daily.';
      } else if (lower.includes('টাকা') || lower.includes('প্যাকেজ') || lower.includes('ফি') || lower.includes('price') || lower.includes('payment') || lower.includes('cost')) {
        replyText =
          lang === 'bn'
            ? 'বায়োডাটা দেখা ও রেজিস্ট্রেশন সম্পূর্ণ ফ্রি! অভিভাবকের সরাসরি নম্বর দেখতে সিলভার বা গোল্ড মেম্বারশিপে আপগ্রেড করতে পারেন।'
            : 'Browsing biodatas and basic registration is 100% free! You can upgrade to Silver or Gold membership to unlock direct contact numbers.';
      } else {
        replyText =
          lang === 'bn'
            ? 'আপনার বার্তার জন্য আন্তরিক ধন্যবাদ! আমাদের ম্যাচমেকিং টিম আপনার বিষয়টি নোট করেছে। যেকোনো জরুরি প্রয়োজনে কল করুন: +৮৮০ ১৮১৩-৮১৭১৬৭'
            : 'Thank you for your message! Our matchmaking support team has noted your query. You can also reach us directly at +880 1813-817167 or ascahdo@gmail.com.';
      }

      const botReply: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        senderName: lang === 'bn' ? 'এসকাডো কাস্টমার কেয়ার' : 'Ascahdo Live Support',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-32px)] sm:w-96 max-w-sm h-[520px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-3 animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-4 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-rose-700 flex items-center justify-center text-white font-bold border-2 border-rose-400/40">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-white font-serif flex items-center gap-1.5 truncate">
                  {lang === 'bn' ? 'ম্যারেজ লাইভ চ্যাট' : 'Ascahdo Live Chat'}
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-950/80 text-emerald-300 font-sans font-medium border border-emerald-800">
                    Online
                  </span>
                </h4>
                <p className="text-[10px] text-rose-200/80 truncate">
                  {lang === 'bn' ? '২৪/৭ ম্যাচমেকার সাপোর্ট' : '24/7 Matchmaking Support'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Direct Hotline & WhatsApp Quick Bar */}
          <div className="bg-rose-50 border-b border-rose-100 px-3 py-2 flex items-center justify-between text-xs text-rose-950 shrink-0 gap-1.5">
            <div className="flex items-center gap-1.5 font-medium truncate">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-mono truncate">
                {lang === 'bn' ? 'হটলাইন: +৮৮০ ১৮১৩-৮১৭১৬৭' : '+880 1813-817167'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href="https://wa.me/8801813817167?text=Hello%2C%20I%20want%20to%20know%20about%20Ascahdo%20Marriage%20Media%20biodatas"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition flex items-center gap-1 shadow-2xs"
                title="WhatsApp Chat"
              >
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:+8801813817167"
                className="px-2 py-0.5 rounded-full bg-rose-700 text-white text-[10px] font-bold hover:bg-rose-800 transition flex items-center gap-1 shadow-2xs"
              >
                <PhoneCall className="w-2.5 h-2.5" />
                {lang === 'bn' ? 'কল' : 'Call'}
              </a>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.sender !== 'user' && msg.senderName && (
                  <span className="text-[10px] text-slate-600 font-semibold mb-0.5 px-1">
                    {msg.senderName}
                  </span>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-rose-700 text-white rounded-tr-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-slate-600 mt-1 px-1">
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-rose-600" />}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-2xl p-2.5 max-w-[120px] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] text-slate-600 ml-1">টাইপ করছেন...</span>
              </div>
            )}

            {/* Quick Answer Buttons */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                {lang === 'bn' ? 'সাধারণ প্রশ্নসমূহ:' : 'Frequently Asked Questions:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleSendMessage(lang === 'bn' ? opt.labelBn : opt.labelEn)}
                    className="text-[11px] bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-900 rounded-xl px-2.5 py-1.5 transition text-left shadow-xs flex items-center gap-1"
                  >
                    <span>{lang === 'bn' ? opt.labelBn : opt.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={lang === 'bn' ? 'আপনার প্রশ্ন লিখুন...' : 'Type your question...'}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 bg-slate-50 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-2 rounded-xl transition flex items-center justify-center shrink-0 ${
                inputText.trim()
                  ? 'bg-rose-700 text-white hover:bg-rose-800 shadow-sm cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl hover:shadow-rose-900/30 transition-all transform hover:scale-105 flex items-center gap-2.5 border-2 border-rose-400/30 cursor-pointer"
        aria-label="Open Live Chat Support"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 text-white" />
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center border-2 border-white animate-pulse">
              1
            </span>
          )}
        </div>
        <span className="hidden sm:inline-block font-semibold text-xs text-white">
          {lang === 'bn' ? 'লাইভ সাপোর্ট' : 'Live Support'}
        </span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </button>
    </div>
  );
};
