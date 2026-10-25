import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-start gap-3 bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/80 rounded-2xl p-4 text-slate-100 max-w-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="mt-0.5 shrink-0">
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-amber-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-white">{toast.title}</p>
        {toast.description && (
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-200 p-1 -mr-1 rounded-lg transition-colors"
        aria-label="إغلاق"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
