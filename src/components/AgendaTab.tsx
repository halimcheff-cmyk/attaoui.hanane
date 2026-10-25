import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Filter } from 'lucide-react';
import { AgendaItem } from '../types/legal';

interface AgendaTabProps {
  agendaItems: AgendaItem[];
  onAddAgendaItem: (item: Omit<AgendaItem, 'id'>) => void;
  onUpdateAgendaItem: (id: string, updated: Partial<AgendaItem>) => void;
  onDeleteAgendaItem: (id: string) => void;
}

export const AgendaTab: React.FC<AgendaTabProps> = ({
  agendaItems,
  onAddAgendaItem,
  onUpdateAgendaItem,
  onDeleteAgendaItem,
}) => {
  const [selectedCourt, setSelectedCourt] = useState('الكل');

  const courts = [
    'الكل',
    'المحكمة الابتدائية بطنجة',
    'محكمة الاستئناف بطنجة',
  ];

  const handleAddNewRow = () => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    const dateStr = today.toISOString().slice(0, 10);

    onAddAgendaItem({
      dossierNumber: `2026/8201/${Math.floor(1000 + Math.random() * 9000)}`,
      court: 'المحكمة الابتدائية بطنجة',
      chamber: 'القاعة 2 - التجاري',
      parties: 'اسم الموكل ضد الخصم',
      hearingDate: dateStr,
      hearingTime: '09:00 ص',
      actionRequired: 'إيداع المذكرة أو المستندات',
      status: 'pending',
      statusLabel: 'في طور الإعداد',
    });
  };

  const filteredItems = agendaItems.filter((item) => {
    if (selectedCourt === 'الكل') return true;
    return item.court.includes(selectedCourt);
  });

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col space-y-5 bg-slate-950">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>جدول جلسات الأستاذة حنان العطاوي بمحاكم طنجة</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            يمكنك الضغط على أي خلية في الجدول لتعديل رقم الملف، المحكمة، الأطراف، التاريخ، أو الإجراء المطلوب
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleAddNewRow}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ إضافة جلسة جديدة</span>
          </button>
        </div>
      </div>

      {/* Court filter */}
      <div className="flex items-center gap-2 text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-slate-400 text-[11px] font-semibold">تصفية حسب المحكمة:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {courts.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCourt(c)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                selectedCourt === c
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <th className="p-3.5 whitespace-nowrap">رقم الملف</th>
                <th className="p-3.5 whitespace-nowrap">المحكمة والهيئة / القاعة</th>
                <th className="p-3.5 whitespace-nowrap">الأطراف (المدعي ضد المدعى عليه)</th>
                <th className="p-3.5 whitespace-nowrap">تاريخ وتوقيت الجلسة</th>
                <th className="p-3.5 whitespace-nowrap">المطلوب إعداده / الإجراء</th>
                <th className="p-3.5 whitespace-nowrap">الحالة</th>
                <th className="p-3.5 text-center whitespace-nowrap">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Dossier Number (Editable) */}
                  <td
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdateAgendaItem(item.id, {
                        dossierNumber: e.currentTarget.textContent || item.dossierNumber,
                      })
                    }
                    className="p-3.5 font-bold font-mono text-amber-400 cursor-text hover:bg-amber-500/10 rounded whitespace-nowrap"
                    title="اضغطي لتعديل رقم الملف"
                  >
                    {item.dossierNumber}
                  </td>

                  {/* Court & Chamber (Editable) */}
                  <td className="p-3.5 whitespace-nowrap">
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdateAgendaItem(item.id, {
                          court: e.currentTarget.textContent || item.court,
                        })
                      }
                      className="font-medium text-slate-100 cursor-text hover:bg-slate-800 px-1 py-0.5 rounded"
                    >
                      {item.court}
                    </div>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdateAgendaItem(item.id, {
                          chamber: e.currentTarget.textContent || item.chamber,
                        })
                      }
                      className="text-[11px] text-slate-400 cursor-text hover:bg-slate-800 px-1 rounded"
                    >
                      {item.chamber}
                    </div>
                  </td>

                  {/* Parties (Editable) */}
                  <td
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdateAgendaItem(item.id, {
                        parties: e.currentTarget.textContent || item.parties,
                      })
                    }
                    className="p-3.5 cursor-text hover:bg-slate-800 rounded min-w-[200px]"
                    title="اضغطي لتعديل أطراف الدعوى"
                  >
                    {item.parties}
                  </td>

                  {/* Date & Time (Editable) */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdateAgendaItem(item.id, {
                          hearingDate: e.currentTarget.textContent || item.hearingDate,
                        })
                      }
                      className="font-bold text-white font-mono cursor-text hover:bg-slate-800 px-1 py-0.5 rounded block"
                    >
                      {item.hearingDate}
                    </span>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdateAgendaItem(item.id, {
                          hearingTime: e.currentTarget.textContent || item.hearingTime,
                        })
                      }
                      className="text-[11px] text-slate-400 cursor-text hover:bg-slate-800 px-1 rounded block"
                    >
                      {item.hearingTime}
                    </span>
                  </td>

                  {/* Action Required (Editable) */}
                  <td
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdateAgendaItem(item.id, {
                        actionRequired: e.currentTarget.textContent || item.actionRequired,
                      })
                    }
                    className="p-3.5 text-amber-200 cursor-text hover:bg-slate-800 rounded min-w-[180px]"
                    title="اضغطي لتعديل الإجراء المطلوب للجلسة"
                  >
                    {item.actionRequired}
                  </td>

                  {/* Status Badge (Editable) */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdateAgendaItem(item.id, {
                          statusLabel: e.currentTarget.textContent || item.statusLabel,
                        })
                      }
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-text ${
                        item.status === 'ready'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.status === 'deliberation'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {item.statusLabel}
                    </span>
                  </td>

                  {/* Delete button */}
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onDeleteAgendaItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors"
                      title="حذف هذه الجلسة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
