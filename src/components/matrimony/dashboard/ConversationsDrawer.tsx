import React, { useState } from 'react';
import { X, Send, MessageSquare, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';
import { useMatrimonyAuth } from '../../../context/MatrimonyAuthContext';

interface ConversationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConversationsDrawer: React.FC<ConversationsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang } = useMatrimonyLanguage();
  const { messages = [], profiles = [], currentProfile, sendMessage } = useMatrimony();
  const { currentUser } = useMatrimonyAuth();

  const myProfileId = currentProfile?.id || currentUser?.profileId || '';

  // Generate conversation list from available messages and profiles
  const conversationList = React.useMemo(() => {
    const partnerMap = new Map<string, any>();

    // 1. Group from existing messages
    (messages || []).forEach(msg => {
      const isSentByMe = msg.senderProfileId === myProfileId;
      const partnerId = isSentByMe ? msg.receiverProfileId : msg.senderProfileId;
      if (!partnerId || partnerId === myProfileId) return;

      if (!partnerMap.has(partnerId)) {
        const partnerProf = (profiles || []).find(p => p.id === partnerId);
        partnerMap.set(partnerId, {
          id: partnerId,
          partnerId,
          partnerProfile: partnerProf,
          messages: [],
          lastMessage: msg.content || msg.text || '',
          timestamp: msg.timestamp || msg.createdAt || ''
        });
      }
      partnerMap.get(partnerId).messages.push({
        id: msg.id,
        senderId: msg.senderProfileId,
        text: msg.content || msg.text || '',
        timestamp: msg.timestamp || msg.createdAt || ''
      });
    });

    // 2. If no prior message history, show default sample conversation partners
    if (partnerMap.size === 0 && (profiles || []).length > 0) {
      (profiles || []).slice(0, 3).forEach(p => {
        if (p.id !== myProfileId) {
          partnerMap.set(p.id, {
            id: p.id,
            partnerId: p.id,
            partnerProfile: p,
            messages: [
              {
                id: `welcome-${p.id}`,
                senderId: p.id,
                text: lang === 'bn' ? 'আসসালামু আলাইকুম, কেমন আছেন?' : 'Assalamu Alaikum, how are you?',
                timestamp: 'আজ'
              }
            ],
            lastMessage: lang === 'bn' ? 'আসসালামু আলাইকুম, কেমন আছেন?' : 'Assalamu Alaikum, how are you?',
            timestamp: 'আজ'
          });
        }
      });
    }

    return Array.from(partnerMap.values());
  }, [messages, profiles, myProfileId, lang]);

  const [activePartnerId, setActivePartnerId] = useState<string>('');
  const [inputText, setInputText] = useState('');

  // Synchronize active partner
  const activeConv = conversationList.find(c => c.id === activePartnerId) || conversationList[0] || null;
  const partnerProfile = activeConv?.partnerProfile || (profiles || []).find(p => p.id === activeConv?.partnerId) || null;

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    sendMessage(activeConv.partnerId, inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-base font-serif">
              {lang === 'bn' ? 'নিরাপদ পাত্র-পাত্রী বার্তা বিনিময়' : 'Direct Matrimonial Messages'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messaging Container */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Conversation List (Left Sidebar) */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto shrink-0">
            <div className="p-3 font-bold text-xs text-slate-500 uppercase tracking-wider">
              {lang === 'bn' ? 'সাম্প্রতিক চ্যাট' : 'Recent Chats'}
            </div>
            {conversationList.map(conv => {
              const otherProf = conv.partnerProfile;
              const isSelected = activeConv?.id === conv.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActivePartnerId(conv.id)}
                  className={`w-full p-3 text-left flex items-center gap-3 border-b border-slate-200/60 transition ${
                    isSelected ? 'bg-rose-50 border-rose-200' : 'hover:bg-slate-100'
                  }`}
                >
                  <img
                    src={otherProf?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="truncate flex-1">
                    <h5 className="font-bold text-xs text-slate-900 truncate">
                      {otherProf?.displayName || 'User'}
                    </h5>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {conv.lastMessage || 'Click to chat'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chat Window (Right Section) */}
          <div className="flex-1 flex flex-col bg-white">
            {activeConv && partnerProfile ? (
              <>
                {/* Active Partner Info */}
                <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={partnerProfile.avatarUrl}
                      alt="Avatar"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 font-serif">
                        {partnerProfile.displayName}
                      </h4>
                      <p className="text-[10px] text-emerald-700 font-semibold">
                        {partnerProfile.profession?.designation} • {partnerProfile.location?.district}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full font-bold">
                    ID: {partnerProfile.id}
                  </span>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                  <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-[11px] text-slate-600 text-center">
                    🔒 এই চ্যাটটি প্ল্যাটফর্ম নীতিমালা অনুযায়ী পরিচালিত। শালীনতা বজায় রাখুন এবং আর্থিক লেনদেন থেকে বিরত থাকুন।
                  </div>

                  {(activeConv.messages || []).map((msg: any) => {
                    const isMe = msg.senderId === myProfileId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl text-xs sm:text-sm ${
                            isMe
                              ? 'bg-rose-700 text-white rounded-br-none'
                              : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none shadow-2xs'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span
                            className={`text-[9px] block text-right mt-1 ${
                              isMe ? 'text-rose-200' : 'text-slate-400'
                            }`}
                          >
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                  <input
                    type="text"
                    required
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="মার্জিতভাবে বার্তা লিখুন..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
                কোনো সক্রিয় কথোপকথন নির্বাচন করা হয়নি।
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
