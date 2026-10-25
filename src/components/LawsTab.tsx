import React, { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Copy, Check, Filter, X, Tag, Sparkles } from 'lucide-react';
import { LawCard } from '../types/legal';

interface LawsTabProps {
  laws: LawCard[];
  onAddLaw: (law: Omit<LawCard, 'id'>) => void;
  onUpdateLaw: (id: string, updated: Partial<LawCard>) => void;
  onDeleteLaw: (id: string) => void;
}

export const LawsTab: React.FC<LawsTabProps> = ({
  laws,
  onAddLaw,
  onUpdateLaw,
  onDeleteLaw,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New law card form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('كراء المحلات التجارية والصناعية');
  const [newBadge, setNewBadge] = useState('نص قانوني معتمد');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('طنجة, قانون');

  const categories = [
    'الكل',
    'الالتزامات والعقود',
    'كراء المحلات التجارية والصناعية',
    'المسطرة المدنية',
    'اجتهادات محكمة النقض',
  ];

  // Quick suggestions for Maître Hanan
  const quickSearchQueries = [
    { label: 'الفصل 230', query: '230' },
    { label: 'المادة 8 (تماطل)', query: 'المادة 8' },
    { label: 'الفصل 32 (ق.م.م)', query: '32' },
    { label: 'محكمة النقض', query: 'النقض' },
    { label: 'قانون 49.16', query: '49.16' },
    { label: 'ق.ل.ع', query: 'الالتزامات والعقود' },
  ];

  // Filter laws based on search keyword or article number
  const filteredLaws = useMemo(() => {
    const termClean = searchTerm.trim().toLowerCase();
    return laws.filter((law) => {
      const matchesCategory =
        selectedCategory === 'الكل' || law.category === selectedCategory;

      if (!termClean) return matchesCategory;

      const titleMatch = law.title.toLowerCase().includes(termClean);
      const contentMatch = law.content.toLowerCase().includes(termClean);
      const badgeMatch = Boolean(law.badge && law.badge.toLowerCase().includes(termClean));
      const categoryMatch = law.category.toLowerCase().includes(termClean);
      const tagsMatch = Boolean(
        law.tags && law.tags.some((t) => t.toLowerCase().includes(termClean))
      );
      const jurisMatch = Boolean(
        law.jurisprudenceNumber && law.jurisprudenceNumber.toLowerCase().includes(termClean)
      );

      return (
        matchesCategory &&
        (titleMatch || contentMatch || badgeMatch || categoryMatch || tagsMatch || jurisMatch)
      );
    });
  }, [laws, searchTerm, selectedCategory]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const parsedTags = newTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onAddLaw({
      title: newTitle.trim(),
      category: newCategory,
      badge: newBadge.trim() || 'نص مخصص',
      content: newContent.trim(),
      tags: parsedTags,
    });

    setNewTitle('');
    setNewContent('');
    setNewTags('طنجة, قانون');
    setIsAddingNew(false);
  };

  // Helper to highlight matching text in search results
  const renderHighlighted = (text: string) => {
    const query = searchTerm.trim();
    if (!query || query.length < 2) return text;

    try {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      return parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-amber-400 text-slate-950 px-1 py-0.2 rounded font-bold"
          >
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch {
      return text;
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col space-y-6 bg-slate-950">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>مكتبة القوانين والنصوص المعتمدة للأستاذة حنان</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            البحث في فصول ومواد ظهير الالتزامات والعقود (ق.ل.ع)، قانون 49.16، المسطرة المدنية، واجتهادات محكمة النقض
          </p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ إضافة نص أو فصل قانوني جديد</span>
        </button>
      </div>

      {/* Prominent Search and Filter Section */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3.5 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحثي برقم الفصل أو الكلمات المفتاحية (مثال: 230، المادة 8، الفصل 32، تماطل، نقض، 49.16)..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl pr-10 pl-10 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                title="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Categories Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 hidden lg:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Search Suggestions & Results Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>بحث سريع:</span>
            </span>
            {quickSearchQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSearchTerm(item.query)}
                className="px-2.5 py-0.5 bg-slate-950 hover:bg-slate-800 hover:text-amber-300 text-slate-300 text-[10px] rounded-md border border-slate-800 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400">
            {searchTerm ? (
              <span>
                نتائج البحث: <strong className="text-amber-400">{filteredLaws.length}</strong> من أصل {laws.length} نصاً
              </span>
            ) : (
              <span>إجمالي النصوص بالمكتبة: <strong className="text-amber-400">{laws.length}</strong> نصوص</span>
            )}
          </div>
        </div>
      </div>

      {/* Inline Form to Add New Law Card */}
      {isAddingNew && (
        <form
          onSubmit={handleCreateSubmit}
          className="bg-slate-900 border border-amber-500/40 p-5 rounded-2xl space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-amber-400 text-sm">
              إضافة نص قانوني أو اجتهاد قضائي جديد لمكتبكِ
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              إلغاء
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">عنوان الفصل أو القرار:</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثال: الفصل 488 من قانون المسطرة المدنية"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">التصنيف:</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                {categories.filter((c) => c !== 'الكل').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">الوصف التوضيحي (الوسم):</label>
              <input
                type="text"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                placeholder="مثال: الحجز لدى الغير"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">نص الفصل القانوني أو منطوق القرار القضائي:</label>
            <textarea
              required
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="اكتبي هنا مقتضيات المادة أو ملخص حيثيات قرار محكمة النقض..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">الكلمات المفتاحية للبحث السريع (مفصولة بفاصلة):</label>
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="مثال: حجز، تنفيذ، بنك، ق.م.م"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
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
              حفظ في المكتبة
            </button>
          </div>
        </form>
      )}

      {/* Law Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLaws.map((law) => (
          <div
            key={law.id}
            className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 group hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between border-b border-slate-800/80 pb-2.5 gap-2">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdateLaw(law.id, { title: e.currentTarget.textContent || law.title })
                  }
                  className="font-bold text-amber-400 text-sm cursor-text hover:bg-amber-500/10 px-1 py-0.5 rounded leading-snug"
                  title="اضغطي لتعديل عنوان النص"
                >
                  {renderHighlighted(law.title)}
                </span>

                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdateLaw(law.id, { badge: e.currentTarget.textContent || law.badge })
                  }
                  className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded cursor-text hover:bg-slate-700 whitespace-nowrap shrink-0"
                  title="اضغطي لتعديل الوسم"
                >
                  {law.badge}
                </span>
              </div>

              {/* Editable Body with Highlight matching */}
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdateLaw(law.id, { content: e.currentTarget.innerText || law.content })
                }
                className="text-xs text-slate-300 leading-relaxed cursor-text hover:bg-slate-950 p-2 rounded-xl transition-colors whitespace-pre-line"
                title="اضغطي لتعديل نص الفصل أو إضافة ملاحظاتك الخاصة"
              >
                {renderHighlighted(law.content)}
              </p>

              {/* Tags List */}
              {law.tags && law.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  {law.tags.map((tag, tIdx) => (
                    <button
                      key={tIdx}
                      onClick={() => setSearchTerm(tag)}
                      className="text-[10px] bg-slate-950 hover:bg-amber-500/10 hover:text-amber-300 text-slate-400 px-2 py-0.5 rounded border border-slate-800 transition-colors flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
              <span className="text-[10px] text-slate-500 font-medium">
                {law.category}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(law.id, `${law.title}\n\n${law.content}`)}
                  title="نسخ النص القانوني"
                  className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800"
                >
                  {copiedId === law.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => onDeleteLaw(law.id)}
                  title="حذف هذا النص من المكتبة"
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLaws.length === 0 && (
        <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800 space-y-3">
          <p className="text-sm text-slate-300 font-bold">
            لم يتم العثور على أي فصل أو نص قانوني يطابق: "{searchTerm}"
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            تأكدي من رقم الفصل (مثلاً: 230 أو 8 أو 32) أو جربي البحث بكلمات عامة مثل: كراء، تماطل، نقض، التزام.
          </p>
          <div className="flex justify-center gap-2 pt-1">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('الكل');
              }}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
            >
              عرض كافة النصوص ({laws.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
