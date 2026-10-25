import React from 'react';
import { Save, Download, FileText, RotateCcw, Globe } from 'lucide-react';
import { LawyerProfile } from '../types/legal';

interface HeaderProps {
  profile: LawyerProfile;
  onUpdateProfile: (updated: Partial<LawyerProfile>) => void;
  onSave: () => void;
  onDownloadHtml: () => void;
  onExportWord: () => void;
  onReset: () => void;
  onOpenPublishModal: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onUpdateProfile,
  onSave,
  onDownloadHtml,
  onExportWord,
  onReset,
  onOpenPublishModal,
  isSaving,
  hasUnsavedChanges,
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/95 px-4 lg:px-6 flex items-center justify-between shrink-0 shadow-md backdrop-blur z-20">
      {/* Zone 1: Brand title & live editable indicator */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-amber-500/20 shrink-0">
            ⚖️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">
                مُحامـي<span className="text-amber-400">.AI</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                / المنظومة القانونية المتكاملة
              </span>
            </div>
            <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {hasUnsavedChanges ? (
                <span className="text-amber-400 font-semibold">توجد تعديلات غير محفوظة</span>
              ) : (
                <span>وضع التحرير المباشر مفعل (اضغطي وعدّلي أي نص)</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Zone 2 & 3: Actions & Lawyer Identity */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset button */}
        <button
          onClick={onReset}
          title="استعادة النص الافتراضي الأصلي"
          className="p-2 text-slate-400 hover:text-rose-300 hover:bg-slate-800/80 rounded-xl transition-colors shrink-0"
          aria-label="استعادة النصوص الافتراضية"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Word Document Export */}
        <button
          onClick={onExportWord}
          title="تصدير المقال الافتتاحي كملف Word صالح للطباعة والتقديم"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span>تصدير Word</span>
        </button>

        {/* Publish & Web Hosting Guide */}
        <button
          onClick={onOpenPublishModal}
          title="نشر المنظومة على الويب أو نسخ رابط الدخول"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-colors whitespace-nowrap shrink-0 shadow-sm border border-emerald-500/40"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-300" />
          <span>🌐 نشر على الويب</span>
        </button>

        {/* Download Standalone Modified HTML */}
        <button
          onClick={onDownloadHtml}
          title="تنزيل الملف كاملاً بكل نصوصك وقوانينك لفتحه في أي جهاز أوفلاين"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>تنزيل الملف</span>
        </button>

        {/* Save to LocalStorage */}
        <button
          onClick={onSave}
          disabled={isSaving}
          title="حفظ التعديلات في متصفحك"
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 shadow-sm ${
            hasUnsavedChanges
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 shadow-md ring-2 ring-emerald-500/40'
              : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
          }`}
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'جارٍ الحفظ...' : '💾 حفظ التعديلات'}</span>
        </button>

        {/* Lawyer Profile Card (Live Editable) */}
        <div className="flex items-center gap-3 border-r border-slate-800 pr-3 mr-1">
          <div className="text-left hidden lg:block leading-tight">
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdateProfile({ name: e.currentTarget.textContent || profile.name })}
              className="text-xs font-bold text-amber-400 hover:bg-amber-500/10 px-1 py-0.5 rounded cursor-text"
              title="اضغطي لتعديل اسم الأستاذة"
            >
              {profile.name}
            </p>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdateProfile({ bar: e.currentTarget.textContent || profile.bar })}
              className="text-[11px] text-slate-400 hover:bg-slate-800/80 px-1 py-0.5 rounded cursor-text"
              title="اضغطي لتعديل الهيئة"
            >
              {profile.bar}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm shadow shrink-0">
            ح
          </div>
        </div>
      </div>
    </header>
  );
};
