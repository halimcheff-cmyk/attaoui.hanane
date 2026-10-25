import React, { useState } from 'react';
import { Globe, Copy, Check, Download, ExternalLink, X, Server, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadHtml: () => void;
  sharedUrl: string;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  onDownloadHtml,
  sharedUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                نشر وحفظ المنظومة على الويب (Publish & Host Online)
              </h3>
              <p className="text-xs text-slate-400">
                طرق نشر التطبيق على الإنترنت ومشاركته مع الزملاء أو الموكلين
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs leading-relaxed text-slate-200">
          {/* Method 1: The Live Public URL Already Active! */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>الرابط المباشر منشور وشغال حالياً على الويب!</span>
              </span>
              <span className="text-slate-500 text-[10px]">Cloud Run / HTTPS</span>
            </div>

            <p className="text-slate-300 leading-relaxed">
              هذا التطبيق <strong>منشور ومتاح أونلاين بالفعل</strong> على خوادم سحابية آمنة (HTTPS). يمكنكِ إرسال هذا الرابط لأي شخص أو حفظه في هاتفك وحاسوبك للدخول إليه مباشرة في أي وقت:
            </p>

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 p-2 rounded-xl">
              <input
                type="text"
                readOnly
                dir="ltr"
                value={sharedUrl}
                className="flex-1 bg-transparent border-0 text-amber-400 font-mono text-[11px] focus:outline-none select-all px-2"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors whitespace-nowrap"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
              </button>
              <a
                href={sharedUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-300 hover:text-amber-400 transition-colors"
                title="فتح الرابط في نافذة جديدة"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Method 2: Download Standalone HTML */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                <span>الطريقة 2: تنزيل ملف الويب المستقل (HTML كامل)</span>
              </h4>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                أوفلاين أو أونلاين
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed">
              بالضغط على الزر أدناه، يتم تحميل ملف واحد مستقل (`.html`) يحتوي على المنظومة بكامل أكوادها وتعديلاتكِ الخاصة. يمكنكِ:
            </p>

            <ul className="list-disc list-inside space-y-1 text-slate-400 pr-2">
              <li>فتحه على أي حاسوب دون حاجة لاتصال بالإنترنت.</li>
              <li>رفعه على موقع مكتبكِ الخاص (مثل: `avocat-hanan.ma` أو `hanan-law.com`).</li>
              <li>وضعه على أي استضافة مثل <strong>cPanel</strong> أو <strong>Hostinger</strong> داخل مجلد `public_html` باسم `index.html`.</li>
            </ul>

            <button
              onClick={() => {
                onDownloadHtml();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow"
            >
              <Download className="w-4 h-4" />
              <span>📥 تنزيل ملف الويب الآن (assistant_hanan.html)</span>
            </button>
          </div>

          {/* Method 3: Free Instant Web Hosting (Netlify Drop / Vercel) */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <Server className="w-4 h-4 text-blue-400" />
              <span>الطريقة 3: رفعه على رابط مجاني دائم باسمكِ (في دقيقة واحدة)</span>
            </h4>
            <div className="space-y-2 text-slate-300 leading-relaxed text-[11px]">
              <p>
                إذا أردتِ نطاقاً خاصاً مجانياً (مثلاً: <code>maitre-hanan.netlify.app</code>):
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 pr-2">
                <li>نزّلي ملف HTML بالضغط على الزر أعلاه.</li>
                <li>افتحي موقع: <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-amber-400 underline font-mono">app.netlify.com/drop</a> (خدمة مجانية تماماً).</li>
                <li>اسحبي الملف وأفلتيه في الصفحة؛ وسيصبح لديكِ موقع ويب دائم وخاص بمكتبكِ بشهادة أمان SSL خلال 10 ثوانٍ!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>بياناتكِ مشفرة ومحفوظة بأمان محلياً</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
