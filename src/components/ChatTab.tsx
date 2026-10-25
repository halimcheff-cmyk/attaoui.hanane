import React, { useState, useRef, useEffect } from 'react';
import { Send, Copy, ArrowRight, Sparkles, Trash2, Check } from 'lucide-react';
import { ChatMessage } from '../types/legal';

interface ChatTabProps {
  messages: ChatMessage[];
  activeCaseTitle: string;
  onUpdateActiveCaseTitle: (title: string) => void;
  onUpdateMessage: (id: string, updated: Partial<ChatMessage>) => void;
  onSendMessage: (text: string) => void;
  onDeleteMessage: (id: string) => void;
  onNavigateToDraft: () => void;
  isLoading: boolean;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  messages,
  activeCaseTitle,
  onUpdateActiveCaseTitle,
  onUpdateMessage,
  onSendMessage,
  onDeleteMessage,
  onNavigateToDraft,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    'حساب تعويض الطرد التعسفي طبقاً لمدونة الشغل',
    'أجل الطعن بالنقض في الأحكام الاستئنافية التجارية',
    'شروط استرجاع حيازة محل تجاري مهجور (المادة 57 قانون 49.16)',
    'الدفع بعدم الاختصاص المكاني للمحكمة التجارية بطنجة',
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
      {/* Active Case Top Banner (Live Editable) */}
      <div className="px-6 py-2.5 border-b border-slate-800 bg-slate-900/40 flex flex-wrap items-center justify-between text-xs shrink-0 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] font-medium">الملف القضائي النشط:</span>
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateActiveCaseTitle(e.currentTarget.textContent || activeCaseTitle)}
            className="font-bold text-amber-400 px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 transition-colors cursor-text"
            title="اضغطي لتعديل رقم واسم الملف"
          >
            {activeCaseTitle}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 hidden sm:inline">
          (انقري على أي سؤال أو جواب لتعديل نصوصه بحرية)
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => {
          const isLawyer = msg.sender === 'lawyer';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-4xl group ${
                isLawyer ? 'mr-auto' : 'ml-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-md ${
                  isLawyer
                    ? 'bg-slate-800 border border-slate-700 text-amber-400'
                    : 'bg-amber-500 text-slate-950 text-base shadow-amber-500/20'
                }`}
              >
                {msg.avatarText}
              </div>

              {/* Message Content Container */}
              <div
                className={`flex-1 min-w-0 p-5 rounded-2xl border text-sm leading-relaxed shadow-sm transition-all ${
                  isLawyer
                    ? 'bg-slate-900/90 border-slate-800 text-slate-200 rounded-tr-none'
                    : 'bg-slate-900/95 border-slate-800 text-slate-200 rounded-tl-none space-y-4'
                }`}
              >
                {/* AI Response Header (if present) */}
                {msg.title && (
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdateMessage(msg.id, { title: e.currentTarget.textContent || msg.title })
                      }
                      className="font-bold text-amber-400 text-base cursor-text hover:bg-amber-500/10 px-1 py-0.5 rounded"
                    >
                      {msg.title}
                    </span>
                    {msg.statusBadge && (
                      <span className="text-[11px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                        {msg.statusBadge}
                      </span>
                    )}
                  </div>
                )}

                {/* Primary Message Body (Editable) */}
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdateMessage(msg.id, { content: e.currentTarget.innerText || msg.content })
                  }
                  className="text-slate-300 leading-relaxed cursor-text hover:bg-slate-800/40 p-1.5 rounded-lg whitespace-pre-line"
                  title="اضغطي هنا لتعديل هذا النص مباشرة"
                >
                  {msg.content}
                </div>

                {/* Structured Legal Articles / Rulings (if present) */}
                {msg.articles && msg.articles.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {msg.articles.map((art, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5"
                      >
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newArticles = [...msg.articles!];
                            newArticles[idx] = {
                              ...newArticles[idx],
                              title: e.currentTarget.textContent || art.title,
                            };
                            onUpdateMessage(msg.id, { articles: newArticles });
                          }}
                          className="font-bold text-xs text-amber-300 cursor-text hover:bg-amber-500/10 px-1 py-0.5 rounded"
                        >
                          {art.title}
                        </p>
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newArticles = [...msg.articles!];
                            newArticles[idx] = {
                              ...newArticles[idx],
                              text: e.currentTarget.textContent || art.text,
                            };
                            onUpdateMessage(msg.id, { articles: newArticles });
                          }}
                          className="text-xs text-slate-300 leading-relaxed cursor-text hover:bg-slate-900 px-1 py-0.5 rounded"
                        >
                          {art.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Message Bottom Toolbar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="text-[11px] font-mono">{msg.timestamp}</span>
                    {!isLawyer && (
                      <button
                        onClick={onNavigateToDraft}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>✍️ تعديل المقال الافتتاحي المرتبط</span>
                        <ArrowRight className="w-3 h-3 rotate-180" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      title="نسخ نص الاستشارة"
                      className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      title="حذف هذه الرسالة"
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl max-w-md animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ⚖️
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> جارٍ استحضار الفصول والاجتهادات القضائية المغربية...
              </p>
              <p className="text-[11px] text-slate-400">قوانين الكراء، المسطرة المدنية، وهيئة طنجة</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-900/40 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
        <span className="text-[11px] text-slate-400 font-semibold whitespace-nowrap">
          نماذج أسئلة سريعة:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(prompt)}
            className="px-3 py-1 bg-slate-800/80 hover:bg-slate-700 hover:text-amber-300 text-slate-300 rounded-lg text-[11px] whitespace-nowrap transition-colors border border-slate-700/60"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/70 shrink-0">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto flex items-end gap-2 bg-slate-900 border border-slate-700/80 p-2.5 rounded-2xl focus-within:border-amber-500 transition-all shadow-lg"
        >
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={1}
            placeholder="اكتبي استفسارك القانوني يا أستاذة حنان (مثلاً: نازلة عقارية، كراء، شغل، استئناف...)"
            className="flex-1 bg-transparent border-0 resize-none text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none py-1.5 px-2 max-h-32"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow"
          >
            <span>استشارة</span>
            <Send className="w-3.5 h-3.5 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};
