import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Sparkles } from 'lucide-react';

export const SajedaNewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <section className="py-14 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/10">
          <Sparkles className="w-4 h-4" />
          <span>Stay Connected</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            ভালো কাজের খবর আপনার ইনবক্সে
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto font-medium">
            আমাদের নতুন Campaign, সফলতার গল্প এবং Charity Updates পেতে Subscribe করুন।
          </p>
        </div>

        {subscribed ? (
          <div className="bg-white/10 border border-white/20 p-4 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-2 text-amber-300 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
            <span>ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="আপনার ইমেইল ঠিকানা দিন..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 text-xs sm:text-sm font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-md"
              />
            </div>
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-3 rounded-2xl shadow-md transition flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer shrink-0"
            >
              <span>Subscribe</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </section>
  );
};
