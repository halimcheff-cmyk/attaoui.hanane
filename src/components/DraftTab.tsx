import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Copy,
  Printer,
  FileDown,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  Sparkles,
  X,
  FileText,
  Sliders,
  ChevronDown,
  SearchCheck,
  FolderOpen,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { moroccanLegalTemplates, LegalTemplate } from '../data/legalTemplates';
import { LawyerProfile, ActiveCaseFile } from '../types/legal';
import {
  moroccanLegalAuditRules,
  auditLegalDraft,
  LegalAuditRule
} from '../data/legalAuditTerms';

interface DraftTabProps {
  draftContent: string;
  onUpdateDraftContent: (content: string) => void;
  onExportWord: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
  profile: LawyerProfile;
  activeCases: ActiveCaseFile[];
  currentCase: ActiveCaseFile;
  onSelectCase: (caseId: string) => void;
  onUpdateCurrentCase?: (updated: Partial<ActiveCaseFile>) => void;
}

export const DraftTab: React.FC<DraftTabProps> = ({
  draftContent,
  onUpdateDraftContent,
  onExportWord,
  onShowToast,
  profile,
  activeCases,
  currentCase,
  onSelectCase,
  onUpdateCurrentCase,
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<number>(15);
  const draftRef = useRef<HTMLDivElement>(null);

  // Template Library & Autofill state
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LegalTemplate>(moroccanLegalTemplates[0]);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Autofill form fields initialized with current active case
  const [clientName, setClientName] = useState(currentCase.clientName);
  const [clientDetails, setClientDetails] = useState(currentCase.clientDetails);
  const [opponentName, setOpponentName] = useState(currentCase.opponentName);
  const [opponentDetails, setOpponentDetails] = useState(currentCase.opponentDetails);
  const [claimAmount, setClaimAmount] = useState(currentCase.claimAmount);
  const [incidentDate, setIncidentDate] = useState(currentCase.incidentDate);
  const [referenceDocs, setReferenceDocs] = useState(currentCase.referenceDocs);

  // Sync form inputs when current active case changes
  useEffect(() => {
    setClientName(currentCase.clientName);
    setClientDetails(currentCase.clientDetails);
    setOpponentName(currentCase.opponentName);
    setOpponentDetails(currentCase.opponentDetails);
    setClaimAmount(currentCase.claimAmount);
    setIncidentDate(currentCase.incidentDate);
    setReferenceDocs(currentCase.referenceDocs);
  }, [currentCase]);

  // Match corresponding template for current active case
  const matchingTemplateForCase = useMemo(() => {
    if (currentCase.category === 'eviction') {
      return moroccanLegalTemplates.find((t) => t.id === 'eviction-commercial') || moroccanLegalTemplates[0];
    }
    if (currentCase.category === 'divorce') {
      return moroccanLegalTemplates.find((t) => t.id === 'divorce-chiqaq') || moroccanLegalTemplates[1];
    }
    if (currentCase.category === 'traffic') {
      return moroccanLegalTemplates.find((t) => t.id === 'traffic-accident') || moroccanLegalTemplates[2];
    }
    if (currentCase.category === 'labor') {
      return moroccanLegalTemplates.find((t) => t.id === 'labor-dismissal') || moroccanLegalTemplates[3];
    }
    return moroccanLegalTemplates[0];
  }, [currentCase]);

  // Legal Terms Audit & Scrutiny State
  const [isAuditModeActive, setIsAuditModeActive] = useState(true);
  const [showAuditDrawer, setShowAuditDrawer] = useState(false);
  const [selectedAuditRule, setSelectedAuditRule] = useState<LegalAuditRule | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Detect legal terms in current brief
  const detectedTerms = useMemo(() => {
    return auditLegalDraft(draftContent);
  }, [draftContent]);

  const totalDetectedCount = useMemo(() => {
    return detectedTerms.reduce((sum, item) => sum + item.count, 0);
  }, [detectedTerms]);

  const handleSelectTemplate = (tpl: LegalTemplate) => {
    setSelectedTemplate(tpl);
  };

  /**
   * Apply template with automated data injection from the Active Case File
   */
  const handleApplyFromActiveCase = (targetTemplate?: LegalTemplate) => {
    const tpl = targetTemplate || selectedTemplate;
    const generated = tpl.generateContent({
      lawyerName: profile.name,
      lawyerBar: profile.bar,
      firmAddress: profile.firmAddress,
      clientName: currentCase.clientName,
      clientDetails: currentCase.clientDetails,
      opponentName: currentCase.opponentName,
      opponentDetails: currentCase.opponentDetails,
      claimAmount: currentCase.claimAmount,
      incidentDate: currentCase.incidentDate,
      referenceDocs: currentCase.referenceDocs,
    });

    onUpdateDraftContent(generated);
    setShowTemplateModal(false);
    setIsCustomizing(false);
    onShowToast(
      `تمت تعبئة المقال تلقائياً ببيانات الملف النشط (${currentCase.dossierNumber})`,
      `الموكل: ${currentCase.clientName} ضد ${currentCase.opponentName}`,
      'success'
    );
  };

  const handleApplyTemplate = (withCustomData = false) => {
    const generated = selectedTemplate.generateContent({
      lawyerName: profile.name,
      lawyerBar: profile.bar,
      firmAddress: profile.firmAddress,
      clientName: withCustomData ? clientName : currentCase.clientName,
      clientDetails: withCustomData ? clientDetails : currentCase.clientDetails,
      opponentName: withCustomData ? opponentName : currentCase.opponentName,
      opponentDetails: withCustomData ? opponentDetails : currentCase.opponentDetails,
      claimAmount: withCustomData ? claimAmount : currentCase.claimAmount,
      incidentDate: withCustomData ? incidentDate : currentCase.incidentDate,
      referenceDocs: withCustomData ? referenceDocs : currentCase.referenceDocs,
    });

    onUpdateDraftContent(generated);
    setShowTemplateModal(false);
    setIsCustomizing(false);
    onShowToast(
      `تم تطبيق قالب: ${selectedTemplate.name}`,
      'المقال جاهز في المحرر، ويمكنكِ تعديل أي فقرة أو كلمة بحرية',
      'success'
    );
  };

  const handleCopy = () => {
    if (draftRef.current) {
      const text = draftRef.current.innerText;
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        onShowToast('تم نسخ المقال كاملاً', 'يمكنكِ لصقه الآن في أي ملف خارجي');
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetToTemplate = () => {
    if (confirm('هل ترغبين في استرجاع المقال الافتتاحي النموذجي الأول؟')) {
      handleSelectTemplate(moroccanLegalTemplates[0]);
      handleApplyFromActiveCase(moroccanLegalTemplates[0]);
    }
  };

  // Render text with interactive highlighted legal terms
  const renderAnnotatedText = () => {
    if (!isAuditModeActive || detectedTerms.length === 0) {
      return draftContent;
    }

    const allRegexes = moroccanLegalAuditRules.map((r) => `(${r.regex.source})`).join('|');
    const combinedRegex = new RegExp(allRegexes, 'gi');

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = combinedRegex.exec(draftContent)) !== null) {
      const matchedText = match[0];
      const matchIndex = match.index;

      if (matchIndex > lastIndex) {
        parts.push(draftContent.substring(lastIndex, matchIndex));
      }

      const rule = moroccanLegalAuditRules.find((r) => r.regex.test(matchedText));

      if (rule) {
        parts.push(
          <mark
            key={`match-${matchIndex}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAuditRule(rule);
              setShowAuditDrawer(true);
            }}
            className={`cursor-pointer rounded px-1 py-0.5 font-bold transition-all inline-block mx-0.5 group relative ${rule.colorClass.bg} ${rule.colorClass.text} ${rule.colorClass.border} hover:ring-2 hover:ring-amber-400`}
            title={`تدقيق مسطري: ${rule.tipTitle} (انقري للمراجعة)`}
          >
            {matchedText}
            <span className="text-[10px] opacity-75 mr-1 font-mono inline-block">
              ℹ️
            </span>
          </mark>
        );
      } else {
        parts.push(matchedText);
      }

      lastIndex = matchIndex + matchedText.length;
    }

    if (lastIndex < draftContent.length) {
      parts.push(draftContent.substring(lastIndex));
    }

    return parts;
  };

  const filteredDetectedTerms = detectedTerms.filter((term) => {
    if (selectedCategoryFilter === 'all') return true;
    return term.rule.category === selectedCategoryFilter;
  });

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col space-y-4 bg-slate-950">
      {/* 1. Header & Primary Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">
              محرر المقالات والمذكرات القضائية الرسمي (طنجة)
            </h2>
            {isAuditModeActive && (
              <span className="text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <SearchCheck className="w-3.5 h-3.5" />
                <span>تدقيق المصطلحات ({totalDetectedCount})</span>
              </span>
            )}
          </div>
          <p className="text-xs text-amber-400 font-medium mt-0.5">
            نظام صياغة ذكي متصل بالملفات النشطة للأستاذة حنان العطاوي مع تعبئة آلية للبيانات.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Audit Toggle Button */}
          <button
            onClick={() => {
              const nextState = !isAuditModeActive;
              setIsAuditModeActive(nextState);
              if (nextState) {
                onShowToast('تم تفعيل تدقيق المصطلحات القانونية', 'تم تظليل الآجال والملتمسات والشكليات للمراجعة الدقيقة', 'info');
              } else {
                onShowToast('تم إيقاف وضع التدقيق', 'المحرر الآن في وضع العرض العادي النظيف', 'info');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isAuditModeActive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 ring-1 ring-amber-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
            title="تفعيل/تعطيل تظليل المصطلحات والآجال القانونية الحساسة"
          >
            <SearchCheck className="w-3.5 h-3.5" />
            <span>تدقيق المصطلحات {isAuditModeActive ? '✓' : ''}</span>
          </button>

          {/* Open Audit Drawer */}
          {isAuditModeActive && (
            <button
              onClick={() => setShowAuditDrawer(!showAuditDrawer)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                showAuditDrawer
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
              }`}
              title="عرض قائمة التدقيق والملاحظات الإجرائية"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>قائمة التدقيق ({detectedTerms.length})</span>
            </button>
          )}

          {/* Quick Templates Library Trigger Button */}
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 ring-1 ring-amber-400/50"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📚 قوالب المقالات الجاهزة</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Font resize */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-1.5 py-1">
            <button
              onClick={() => setFontSize((s) => Math.max(12, s - 1))}
              className="p-1 text-slate-400 hover:text-slate-200"
              title="تصغير الخط"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-slate-300 tabular-nums">
              {fontSize}px
            </span>
            <button
              onClick={() => setFontSize((s) => Math.min(22, s + 1))}
              className="p-1 text-slate-400 hover:text-slate-200"
              title="تكبير الخط"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleResetToTemplate}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 text-xs rounded-xl border border-slate-800 transition-colors"
            title="استرجاع النموذج الأصلي"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>نسخ المقال</span>
          </button>

          <button
            onClick={onExportWord}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>تصدير Word</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>🖨️ طباعة المقال</span>
          </button>
        </div>
      </div>

      {/* 2. SMART ACTIVE CASE BAR: اختيار الملف النشط والتعبئة التلقائية بنقرة واحدة */}
      <div className="bg-slate-900/90 border border-amber-500/30 p-3 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
            <FolderOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">الملف القضائي النشط:</span>
              <select
                value={currentCase.id}
                onChange={(e) => onSelectCase(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-amber-400 font-bold rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {activeCases.map((c) => (
                  <option key={c.id} value={c.id}>
                    ملف {c.dossierNumber} - {c.clientName} ضد {c.opponentName}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 truncate max-w-xl">
              <strong>الموضوع:</strong> {currentCase.title} ({currentCase.court} - {currentCase.chamber})
            </p>
          </div>
        </div>

        {/* 1-Click Smart Autofill Action */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => handleApplyFromActiveCase(matchingTemplateForCase)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md hover:shadow-amber-500/20 active:scale-95"
            title="تعبئة بيانات الموكل تلقائياً من هذا الملف النشط في القالب المناسب"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>تعبئة تلقائية من الملف النشط ⚡</span>
          </button>
        </div>
      </div>

      {/* 3. Quick Template Strip Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs shrink-0 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
        <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>القوالب السريعة:</span>
        </span>
        {moroccanLegalTemplates.map((tpl) => {
          const isCurrent = selectedTemplate.id === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => {
                handleSelectTemplate(tpl);
                handleApplyFromActiveCase(tpl);
              }}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isCurrent
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              <span>{tpl.name}</span>
            </button>
          );
        })}
        <button
          onClick={() => {
            setShowTemplateModal(true);
            setIsCustomizing(true);
          }}
          className="px-2.5 py-1 text-[11px] text-amber-400 hover:text-amber-300 font-bold whitespace-nowrap flex items-center gap-1 underline underline-offset-4"
        >
          <Sliders className="w-3 h-3" />
          <span>تخصيص بيانات إضافية يدوياً...</span>
        </button>
      </div>

      {/* 4. Main Workspace Area: Editor + Collapsible Audit Drawer */}
      <div className="flex-1 flex gap-4 overflow-hidden relative">
        {/* Legal Pleading Document Body (Word-like live editable container) */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 overflow-y-auto shadow-inner flex flex-col">
          {/* Subtle Audit Legend Header when Audit is ON */}
          {isAuditModeActive && (
            <div className="mb-4 p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex items-center gap-2 text-slate-300 text-[11px]">
                <SearchCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>المصطلحات المظللة للمراجعة:</strong> انقري على أي عبارة مظللة باللون للاطلاع على تنبيهات محكمة النقض وقانون المسطرة المدنية.
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="text-slate-400">آجال مسطرية</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                  <span className="text-slate-400">ملتمسات جوهرية</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="text-slate-400">شكليات واختصاص</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span className="text-slate-400">مبالغ مالية</span>
                </span>
              </div>
            </div>
          )}

          {/* Active Document Canvas */}
          {isAuditModeActive ? (
            /* Annotated Audit View with Clickable Highlights & Full Word Editing on Focus */
            <div
              ref={draftRef}
              id="legal-draft-content"
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              onBlur={(e) => onUpdateDraftContent(e.currentTarget.innerText || draftContent)}
              style={{ fontSize: `${fontSize}px` }}
              className="font-legal max-w-4xl mx-auto leading-relaxed text-slate-200 whitespace-pre-line outline-none focus:ring-1 focus:ring-amber-500/40 rounded-xl p-4 transition-all w-full flex-1"
              title="اضغطي في أي مكان لتعديل المقال أو انقري على المصطلحات المظللة للمراجعة"
            >
              {renderAnnotatedText()}
            </div>
          ) : (
            /* Clean Plain Word Editor */
            <div
              ref={draftRef}
              id="legal-draft-content"
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              onBlur={(e) => onUpdateDraftContent(e.currentTarget.innerText || draftContent)}
              style={{ fontSize: `${fontSize}px` }}
              className="font-legal max-w-4xl mx-auto leading-relaxed text-slate-200 whitespace-pre-line outline-none focus:ring-1 focus:ring-amber-500/40 rounded-xl p-4 transition-all w-full flex-1"
              title="اضغطي في أي مكان في هذا المقال لتعديله، إضافة فصولك، أو تغيير أسماء الأطراف بحرية"
            >
              {draftContent}
            </div>
          )}
        </div>

        {/* ================= DRAWER: لوحة التدقيق والمراجعة القانونية ================= */}
        {isAuditModeActive && showAuditDrawer && (
          <aside className="w-80 md:w-96 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col shadow-2xl shrink-0 overflow-hidden animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <SearchCheck className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-white text-xs">لوحة التدقيق والمراجعة القانونية</h3>
                  <p className="text-[10px] text-slate-400">فحص الآجال، الشكليات، والملتمسات الجوهرية</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuditDrawer(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="py-2.5 flex items-center gap-1 overflow-x-auto text-[11px] shrink-0 border-b border-slate-800/80">
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                الكل ({detectedTerms.length})
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('deadlines')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategoryFilter === 'deadlines'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                الآجال
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('petitions')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategoryFilter === 'petitions'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                الملتمسات
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('formalities')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategoryFilter === 'formalities'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                الشكليات
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('finance')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategoryFilter === 'finance'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                المالية
              </button>
            </div>

            {/* List of Detected Terms */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {filteredDetectedTerms.map(({ rule, matchText, count }) => {
                const isSelected = selectedAuditRule?.id === rule.id;

                return (
                  <div
                    key={rule.id}
                    onClick={() => setSelectedAuditRule(rule)}
                    className={`p-3.5 rounded-xl border text-right cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/40 shadow'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rule.colorClass.badge}`}>
                        {rule.categoryLabel}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                        ورد {count} {count === 1 ? 'مرة' : 'مرات'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                        <span className="text-amber-400">📍</span>
                        <span>{rule.term}</span>
                      </h4>
                      <p className="text-[11px] text-amber-300 font-semibold mt-1">
                        {rule.tipTitle}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {rule.tipDescription}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px]">
                      <p className="text-slate-400">
                        <strong className="text-slate-300">السند القانوني:</strong> {rule.legalBasis}
                      </p>
                      <p className="text-emerald-400">
                        <strong>الإجراء المطلوب:</strong> {rule.checkAction}
                      </p>
                    </div>
                  </div>
                );
              })}

              {filteredDetectedTerms.length === 0 && (
                <div className="text-center py-10 text-slate-500 text-xs">
                  لا توجد مصطلحات في هذا التصنيف حالياً.
                </div>
              )}
            </div>

            {/* Bottom summary info */}
            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between shrink-0">
              <span>هيئة المحامين بطنجة</span>
              <span className="text-emerald-400 font-semibold">✓ فحص مسطري دقيق</span>
            </div>
          </aside>
        )}
      </div>

      {/* ================= MODAL: مكتبة القوالب وتعبئة بيانات الموكل تلقائياً ================= */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-lg">
                  ⚖️
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    مكتبة القوالب القضائية وتعبئة بيانات الموكل تلقائياً
                  </h3>
                  <p className="text-xs text-slate-400">
                    الملف النشط حالياً: <strong>{currentCase.dossierNumber} ({currentCase.clientName} ضد {currentCase.opponentName})</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Two Tabs (Select Template vs Autofill Client Data) */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              {/* Step / Mode Switcher */}
              <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCustomizing(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    !isCustomizing
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>1. اختيار نوع القالب القضائي</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomizing(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    isCustomizing
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>2. مراجعة بيانات الموكل المسحوبة من الملف</span>
                </button>
              </div>

              {!isCustomizing ? (
                /* Template Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {moroccanLegalTemplates.map((tpl) => {
                    const isSelected = selectedTemplate.id === tpl.id;
                    const isSuggestedForCase = matchingTemplateForCase.id === tpl.id;

                    return (
                      <div
                        key={tpl.id}
                        onClick={() => handleSelectTemplate(tpl)}
                        className={`p-4 rounded-2xl border text-right cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/60 shadow-lg ring-1 ring-amber-500/40'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                              {tpl.category}
                            </span>
                            {isSuggestedForCase && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                                ⭐ مطابق للملف النشط
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-white text-sm">
                            {tpl.name}
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {tpl.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-mono text-[10px]">
                            {tpl.applicableLaws[0]}
                          </span>
                          <span
                            className={`font-bold flex items-center gap-1 ${
                              isSelected ? 'text-amber-400' : 'text-slate-400'
                            }`}
                          >
                            {isSelected ? '✓ تم التحديد' : 'تحديد'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Autofill Form */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleApplyTemplate(true);
                  }}
                  className="space-y-4"
                >
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>
                        القالب المحدد: <strong>{selectedTemplate.name}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setClientName(currentCase.clientName);
                        setClientDetails(currentCase.clientDetails);
                        setOpponentName(currentCase.opponentName);
                        setOpponentDetails(currentCase.opponentDetails);
                        setClaimAmount(currentCase.claimAmount);
                        setIncidentDate(currentCase.incidentDate);
                        setReferenceDocs(currentCase.referenceDocs);
                        onShowToast('تمت إعادة سحب بيانات الملف النشط', currentCase.dossierNumber, 'info');
                      }}
                      className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-[10px] hover:bg-amber-400"
                    >
                      إعادة استيراد بيانات الملف النشط ↺
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Client Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-200">
                        اسم الموكل (المدعي / العارض):
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>

                    {/* Opponent Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-200">
                        اسم الخصم (المدعى عليه):
                      </label>
                      <input
                        type="text"
                        required
                        value={opponentName}
                        onChange={(e) => setOpponentName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Client Details */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-200">
                        صفة وموطن الموكل (ب.ت.و / السجل التجاري / العنوان):
                      </label>
                      <textarea
                        rows={2}
                        value={clientDetails}
                        onChange={(e) => setClientDetails(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
                      />
                    </div>

                    {/* Opponent Details */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-200">
                        صفة وموطن الخصم (العنوان ومحل التبليغ بطنجة):
                      </label>
                      <textarea
                        rows={2}
                        value={opponentDetails}
                        onChange={(e) => setOpponentDetails(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Claim Amount */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-200">
                        المبلغ المطالب به أو النفقة:
                      </label>
                      <input
                        type="text"
                        value={claimAmount}
                        onChange={(e) => setClaimAmount(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Incident / Notice Date */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-200">
                        تاريخ الواقعة / الإنذار / العقد:
                      </label>
                      <input
                        type="text"
                        value={incidentDate}
                        onChange={(e) => setIncidentDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Reference Docs */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-200">
                        المستندات المؤيدة المرفقة:
                      </label>
                      <input
                        type="text"
                        value={referenceDocs}
                        onChange={(e) => setReferenceDocs(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
              <div className="text-[11px] text-slate-400">
                نائبة العارض: <strong className="text-amber-400">{profile.name}</strong> ({profile.bar})
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  إلغاء
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyFromActiveCase(selectedTemplate)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>توليد المقال ببيانات الملف النشط ⚡</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
