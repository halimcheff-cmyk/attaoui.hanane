import React, { useState } from 'react';
import { Plus, Trash2, Copy, Check } from 'lucide-react';
import { ContractClause } from '../types/legal';

interface ContractTabProps {
  contractTitle: string;
  riskScore: string;
  clauses: ContractClause[];
  onUpdateContractTitle: (title: string) => void;
  onUpdateRiskScore: (score: string) => void;
  onUpdateClause: (id: string, updated: Partial<ContractClause>) => void;
  onAddClause: (clause: Omit<ContractClause, 'id'>) => void;
  onDeleteClause: (id: string) => void;
}

export const ContractTab: React.FC<ContractTabProps> = ({
  contractTitle,
  riskScore,
  clauses,
  onUpdateContractTitle,
  onUpdateRiskScore,
  onUpdateClause,
  onAddClause,
  onDeleteClause,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [newNumber, setNewNumber] = useState('البند الجديد');
  const [newOriginal, setNewOriginal] = useState('');
  const [newSeverity, setNewSeverity] = useState<'high' | 'medium' | 'low'>('high');
  const [newLabel, setNewLabel] = useState('بند عالي المخاطر');
  const [newAnalysis, setNewAnalysis] = useState('');
  const [newRecommendation, setNewRecommendation] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOriginal.trim() || !newAnalysis.trim()) return;

    onAddClause({
      clauseNumber: newNumber.trim() || 'بند مخصص',
      originalText: newOriginal.trim(),
      severity: newSeverity,
      severityLabel: newLabel.trim() || 'تدقيق قانوني',
      legalAnalysis: newAnalysis.trim(),
      recommendation: newRecommendation.trim(),
    });

    setNewOriginal('');
    setNewAnalysis('');
    setNewRecommendation('');
    setIsAddingNew(false);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col space-y-6 bg-slate-950">
      {/* Header and Risk Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <h2
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdateContractTitle(e.currentTarget.textContent || contractTitle)
            }
            className="text-xl font-bold text-white tracking-tight cursor-text hover:bg-slate-900 px-1 py-0.5 rounded"
            title="اضغطي لتعديل عنوان العقد الخاضع للتدقيق"
          >
            {contractTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            يمكنكِ الضغط على بنود العقد أدناه لتغيير الملاحظات القانونية، أو نسبة المخاطر، أو إضافة شروط بديلة
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdateRiskScore(e.currentTarget.textContent || riskScore)
            }
            className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/30 px-3.5 py-1.5 rounded-full font-bold cursor-text hover:bg-rose-500/20 transition-colors whitespace-nowrap"
            title="اضغطي لتعديل تقييم المخاطر"
          >
            {riskScore}
          </span>
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-3.5 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ إضافة بند للتدقيق</span>
          </button>
        </div>
      </div>

      {/* Inline Form to Add New Clause */}
      {isAddingNew && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-slate-900 border border-amber-500/40 p-5 rounded-2xl space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-amber-400 text-sm">
              إضافة بند عقدي وتدقيقه قانونياً
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              إلغاء
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300">رقم أو عنوان البند:</label>
              <input
                type="text"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                placeholder="مثال: البند 22 - الفسخ الاتفاقي"
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300">درجة الخطورة:</label>
              <select
                value={newSeverity}
                onChange={(e) => setNewSeverity(e.target.value as any)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="high">مرتفع (خطر قانوني جسيم)</option>
                <option value="medium">متوسط (يحتاج تعديلاً)</option>
                <option value="low">منخفض (بند متوازن)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300">وصف الخطر (الوسم):</label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="مثال: شرط تعسفي باطل"
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300">نص البند كما ورد في مسودة العقد:</label>
            <textarea
              required
              rows={2}
              value={newOriginal}
              onChange={(e) => setNewOriginal(e.target.value)}
              placeholder="اكتبي نص البند محل النزاع..."
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300">التحليل القانوني والسند التشريعي:</label>
            <textarea
              required
              rows={2}
              value={newAnalysis}
              onChange={(e) => setNewAnalysis(e.target.value)}
              placeholder="التحليل القانوني بحسب ق.ل.ع أو قانون 49.16 ومحكمة النقض..."
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300">الصيغة البديلة أو التوصية لموكلك:</label>
            <input
              type="text"
              value={newRecommendation}
              onChange={(e) => setNewRecommendation(e.target.value)}
              placeholder="الصيغة المقترحة لحماية مصالح موكلك..."
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
            >
              تراجع
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow"
            >
              إضافة البند
            </button>
          </div>
        </form>
      )}

      {/* Clauses Cards List */}
      <div className="space-y-4">
        {clauses.map((clause) => {
          const isHigh = clause.severity === 'high';
          const isMedium = clause.severity === 'medium';

          return (
            <div
              key={clause.id}
              className={`p-5 rounded-2xl border text-xs space-y-3 transition-all ${
                isHigh
                  ? 'bg-slate-900 border-rose-900/50 hover:border-rose-700/60'
                  : isMedium
                  ? 'bg-slate-900 border-amber-900/50 hover:border-amber-700/60'
                  : 'bg-slate-900 border-emerald-900/50 hover:border-emerald-700/60'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      isHigh ? 'text-rose-400' : isMedium ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {isHigh ? '🔴' : isMedium ? '🟡' : '🟢'}
                  </span>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdateClause(clause.id, {
                        clauseNumber: e.currentTarget.textContent || clause.clauseNumber,
                      })
                    }
                    className="font-bold text-slate-200 cursor-text hover:bg-slate-800 px-1 py-0.5 rounded text-sm"
                  >
                    {clause.clauseNumber}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdateClause(clause.id, {
                        severityLabel: e.currentTarget.textContent || clause.severityLabel,
                      })
                    }
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-text ${
                      isHigh
                        ? 'bg-rose-500/20 text-rose-300'
                        : isMedium
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {clause.severityLabel}
                  </span>
                </div>
              </div>

              {/* Original Clause Text (Editable) */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-bold block mb-1">
                  نص البند الأصلي في العقد:
                </span>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdateClause(clause.id, {
                      originalText: e.currentTarget.innerText || clause.originalText,
                    })
                  }
                  className="text-xs text-slate-200 leading-relaxed cursor-text hover:bg-slate-900 p-1 rounded"
                >
                  "{clause.originalText}"
                </p>
              </div>

              {/* Legal Analysis (Editable) */}
              <div className="space-y-1">
                <span className="text-[10px] text-amber-400 font-bold block">
                  التحليل القانوني والسند القضائي:
                </span>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdateClause(clause.id, {
                      legalAnalysis: e.currentTarget.innerText || clause.legalAnalysis,
                    })
                  }
                  className="text-xs text-slate-300 leading-relaxed cursor-text hover:bg-slate-950 p-1.5 rounded"
                >
                  {clause.legalAnalysis}
                </p>
              </div>

              {/* Recommendation / Alternative clause (Editable) */}
              {clause.recommendation && (
                <div className="space-y-1 bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                  <span className="text-[10px] text-emerald-400 font-bold block">
                    ✓ التوصية أو الصيغة البديلة المقترحة لموكلك:
                  </span>
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdateClause(clause.id, {
                        recommendation: e.currentTarget.innerText || clause.recommendation,
                      })
                    }
                    className="text-xs text-emerald-200 leading-relaxed cursor-text hover:bg-slate-900 p-1 rounded"
                  >
                    {clause.recommendation}
                  </p>
                </div>
              )}

              {/* Bottom toolbar */}
              <div className="flex items-center justify-end gap-2 pt-1 text-[11px] text-slate-400">
                <button
                  onClick={() =>
                    handleCopy(
                      clause.id,
                      `${clause.clauseNumber}: ${clause.originalText}\nالتحليل: ${clause.legalAnalysis}\nالتوصية: ${clause.recommendation}`
                    )
                  }
                  className="p-1 hover:text-slate-200 transition-colors"
                  title="نسخ تحليل البند"
                >
                  {copiedId === clause.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => onDeleteClause(clause.id)}
                  className="p-1 hover:text-rose-400 transition-colors"
                  title="حذف هذا البند"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
