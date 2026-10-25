import React from 'react';
import { MessageSquare, BookOpen, ShieldAlert, FileEdit, Calendar, Lightbulb, Scale } from 'lucide-react';

export type TabType = 'chat' | 'laws' | 'contract' | 'draft' | 'agenda';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  lawsCount: number;
  agendaCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  lawsCount,
  agendaCount,
}) => {
  const tabs = [
    {
      id: 'chat' as TabType,
      label: 'المحادثة والاستشارات',
      icon: MessageSquare,
      badge: 'مفتوح للتحرير',
    },
    {
      id: 'laws' as TabType,
      label: 'مكتبة القوانين والنصوص',
      icon: BookOpen,
      count: lawsCount,
    },
    {
      id: 'contract' as TabType,
      label: 'فحص العقود والبنود',
      icon: ShieldAlert,
      badge: 'تدقيق 74%',
    },
    {
      id: 'draft' as TabType,
      label: 'صياغة المقالات والمذكرات',
      icon: FileEdit,
      badge: 'محرر Word',
    },
    {
      id: 'agenda' as TabType,
      label: 'جدول الجلسات وقضايا طنجة',
      icon: Calendar,
      count: agendaCount,
    },
  ];

  return (
    <aside className="w-64 md:w-72 border-l border-slate-800 bg-slate-900/40 p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3 px-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              الأقسام المفتوحة للتحرير
            </p>
            <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
              <Scale className="w-3 h-3" /> طنجة
            </span>
          </div>

          <nav className="space-y-1.5" aria-label="أقسام المنظومة">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-right ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>

                  {tab.count !== undefined ? (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  ) : tab.badge ? (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-normal ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-200'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Practical usage advice card */}
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span>نصيحة للاستعمال المباشر:</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            كل فقرة أو عنوان أو خلية جدول في الشاشة يمكنك النقر عليها بالماوس وإعادة كتابتها بحرية تامة بحال برنامج Word.
          </p>
          <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-emerald-400">
            <span>💾 لا تنسي الضغط على حفظ</span>
            <span>✓ تلقائي أو يدوي</span>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 text-center border-t border-slate-800/80 pt-3 flex flex-col gap-1">
        <p className="font-semibold text-slate-400">هيئة المحامين بطنجة</p>
        <p className="text-[10px] text-slate-600">المحكمة الابتدائية ومحكمة الاستئناف • 2026</p>
      </div>
    </aside>
  );
};
