import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { ChatTab } from './components/ChatTab';
import { LawsTab } from './components/LawsTab';
import { ContractTab } from './components/ContractTab';
import { DraftTab } from './components/DraftTab';
import { AgendaTab } from './components/AgendaTab';
import { Toast, ToastMessage } from './components/Toast';
import { PublishModal } from './components/PublishModal';

import {
  initialProfile,
  initialActiveCases,
  initialActiveCaseTitle,
  initialChatMessages,
  initialLawCards,
  initialContractTitle,
  initialRiskScore,
  initialContractClauses,
  initialLegalDraft,
  initialAgendaItems,
} from './data/initialData';
import { LawyerProfile, ChatMessage, LawCard, ContractClause, AgendaItem, ActiveCaseFile } from './types/legal';
import { generateMoroccanLegalAnswer } from './services/geminiService';
import { downloadStandaloneHTML, downloadWordDocument } from './utils/exportUtils';

const STORAGE_KEY = 'hanan_assistant_data_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Core App State
  const [profile, setProfile] = useState<LawyerProfile>(initialProfile);
  const [activeCases, setActiveCases] = useState<ActiveCaseFile[]>(initialActiveCases);
  const [currentCaseId, setCurrentCaseId] = useState<string>(initialActiveCases[0].id);
  const [activeCaseTitle, setActiveCaseTitle] = useState(initialActiveCaseTitle);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [lawCards, setLawCards] = useState<LawCard[]>(initialLawCards);
  const [contractTitle, setContractTitle] = useState(initialContractTitle);
  const [riskScore, setRiskScore] = useState(initialRiskScore);
  const [contractClauses, setContractClauses] = useState<ContractClause[]>(initialContractClauses);
  const [legalDraft, setLegalDraft] = useState(initialLegalDraft);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(initialAgendaItems);

  const isInitialMount = useRef(true);
  const appContainerRef = useRef<HTMLDivElement>(null);

  const currentCase = activeCases.find((c) => c.id === currentCaseId) || activeCases[0];

  // Load saved state from LocalStorage on first load
  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('hanan_assistant_data');
      if (savedRaw) {
        const parsed = JSON.parse(savedRaw);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.activeCases) setActiveCases(parsed.activeCases);
        if (parsed.currentCaseId) setCurrentCaseId(parsed.currentCaseId);
        if (parsed.activeCaseTitle) setActiveCaseTitle(parsed.activeCaseTitle);
        if (parsed.chatMessages) setChatMessages(parsed.chatMessages);
        if (parsed.lawCards) setLawCards(parsed.lawCards);
        if (parsed.contractTitle) setContractTitle(parsed.contractTitle);
        if (parsed.riskScore) setRiskScore(parsed.riskScore);
        if (parsed.contractClauses) setContractClauses(parsed.contractClauses);
        if (parsed.legalDraft) setLegalDraft(parsed.legalDraft);
        if (parsed.agendaItems) setAgendaItems(parsed.agendaItems);
      }
    } catch {
      // ignore parse issues on legacy data
    }
  }, []);

  // Track unsaved changes after initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setHasUnsavedChanges(true);
  }, [
    profile,
    activeCases,
    currentCaseId,
    activeCaseTitle,
    chatMessages,
    lawCards,
    contractTitle,
    riskScore,
    contractClauses,
    legalDraft,
    agendaItems,
  ]);

  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({
      id: Date.now().toString(),
      type,
      title,
      description,
    });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Manual save handler
  const handleSaveAll = () => {
    setIsSaving(true);
    try {
      const payload = {
        profile,
        activeCases,
        currentCaseId,
        activeCaseTitle,
        chatMessages,
        lawCards,
        contractTitle,
        riskScore,
        contractClauses,
        legalDraft,
        agendaItems,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem('hanan_assistant_data', JSON.stringify(payload));
      setHasUnsavedChanges(false);
      showToast(
        '✅ تم حفظ جميع النصوص والتعديلات بنجاح!',
        'ستبقى كل كتاباتك وقوانينك وجلساتك محفوظة دائماً في هذا المتصفح',
        'success'
      );
    } catch {
      showToast('خطأ في الحفظ', 'يرجى التأكد من مساحة تخزين المتصفح', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Download standalone customized HTML file
  const handleDownloadCustomHtml = () => {
    try {
      const payload = {
        profile,
        activeCases,
        currentCaseId,
        activeCaseTitle,
        chatMessages,
        lawCards,
        contractTitle,
        riskScore,
        contractClauses,
        legalDraft,
        agendaItems,
      };
      const renderedHtml = appContainerRef.current ? appContainerRef.current.innerHTML : '';
      downloadStandaloneHTML(renderedHtml, JSON.stringify(payload));
      showToast(
        '📥 تم تنزيل الملف كاملاً بنصوصكِ!',
        'يمكنكِ الآن فتح هذا الملف في أي حاسوب أو إرساله دون الحاجة لأي إنترنت',
        'success'
      );
    } catch {
      showToast('تعذر تنزيل الملف', 'يرجى المحاولة مرة أخرى', 'error');
    }
  };

  // Export Word document (.doc)
  const handleExportWord = () => {
    try {
      downloadWordDocument(`مقال_${currentCase.dossierNumber.replace(/\//g, '_')}_الأستاذة_حنان_العطاوي`, legalDraft);
      showToast('📄 تم تصدير المقال كملف Word بنجاح!', 'جاهز للطباعة أو التقديم لكتابة الضبط');
    } catch {
      showToast('فشل تصدير Word', 'يرجى نسخ النص يدوياً', 'error');
    }
  };

  // Reset to initial Moroccan legal templates
  const handleReset = () => {
    if (confirm('هل ترغبين في استعادة جميع النصوص الأصلية الافتراضية لمنظومة الأستاذة حنان العطاوي؟')) {
      setProfile(initialProfile);
      setActiveCases(initialActiveCases);
      setCurrentCaseId(initialActiveCases[0].id);
      setActiveCaseTitle(initialActiveCaseTitle);
      setChatMessages(initialChatMessages);
      setLawCards(initialLawCards);
      setContractTitle(initialContractTitle);
      setRiskScore(initialRiskScore);
      setContractClauses(initialContractClauses);
      setLegalDraft(initialLegalDraft);
      setAgendaItems(initialAgendaItems);
      localStorage.removeItem(STORAGE_KEY);
      setHasUnsavedChanges(false);
      showToast('تمت استعادة النموذج الافتراضي', 'تمت إعادة تعيين كافة الحقول الأصلية', 'info');
    }
  };

  // Chat message send handler
  const handleSendMessage = async (userText: string) => {
    const timeStr = new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'lawyer',
      authorName: 'أ.ح',
      avatarText: 'أ.ح',
      content: userText,
      timestamp: timeStr,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsAiLoading(true);

    try {
      const aiResponse = await generateMoroccanLegalAnswer(userText);
      setChatMessages((prev) => [...prev, aiResponse]);
    } catch {
      showToast('تنبيه', 'تعذر جلب الاستشارة، يرجى المحاولة ثانية', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSelectCase = (caseId: string) => {
    setCurrentCaseId(caseId);
    const selected = activeCases.find((c) => c.id === caseId);
    if (selected) {
      setActiveCaseTitle(`ملف رقم ${selected.dossierNumber} - ${selected.title}`);
      showToast(`تم تنشيط الملف: ${selected.dossierNumber}`, `${selected.clientName} ضد ${selected.opponentName}`, 'info');
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 h-screen flex flex-col overflow-hidden font-sans">
      {/* 1. Header with brand, live edit state, save & export controls */}
      <Header
        profile={profile}
        onUpdateProfile={(updated) => setProfile((p) => ({ ...p, ...updated }))}
        onSave={handleSaveAll}
        onDownloadHtml={handleDownloadCustomHtml}
        onExportWord={handleExportWord}
        onReset={handleReset}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden" id="main-app-container" ref={appContainerRef}>
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          lawsCount={lawCards.length}
          agendaCount={agendaItems.length}
        />

        {/* Central Work Tab */}
        <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
          {activeTab === 'chat' && (
            <ChatTab
              messages={chatMessages}
              activeCaseTitle={activeCaseTitle}
              onUpdateActiveCaseTitle={setActiveCaseTitle}
              onUpdateMessage={(id, updated) =>
                setChatMessages((prev) =>
                  prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
                )
              }
              onSendMessage={handleSendMessage}
              onDeleteMessage={(id) =>
                setChatMessages((prev) => prev.filter((m) => m.id !== id))
              }
              onNavigateToDraft={() => setActiveTab('draft')}
              isLoading={isAiLoading}
            />
          )}

          {activeTab === 'laws' && (
            <LawsTab
              laws={lawCards}
              onAddLaw={(newLaw) =>
                setLawCards((prev) => [{ ...newLaw, id: 'law-' + Date.now() }, ...prev])
              }
              onUpdateLaw={(id, updated) =>
                setLawCards((prev) =>
                  prev.map((l) => (l.id === id ? { ...l, ...updated } : l))
                )
              }
              onDeleteLaw={(id) =>
                setLawCards((prev) => prev.filter((l) => l.id !== id))
              }
            />
          )}

          {activeTab === 'contract' && (
            <ContractTab
              contractTitle={contractTitle}
              riskScore={riskScore}
              clauses={contractClauses}
              onUpdateContractTitle={setContractTitle}
              onUpdateRiskScore={setRiskScore}
              onUpdateClause={(id, updated) =>
                setContractClauses((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
                )
              }
              onAddClause={(newClause) =>
                setContractClauses((prev) => [
                  ...prev,
                  { ...newClause, id: 'clause-' + Date.now() },
                ])
              }
              onDeleteClause={(id) =>
                setContractClauses((prev) => prev.filter((c) => c.id !== id))
              }
            />
          )}

          {activeTab === 'draft' && (
            <DraftTab
              draftContent={legalDraft}
              onUpdateDraftContent={setLegalDraft}
              onExportWord={handleExportWord}
              onShowToast={showToast}
              profile={profile}
              activeCases={activeCases}
              currentCase={currentCase}
              onSelectCase={handleSelectCase}
              onUpdateCurrentCase={(updated) => {
                setActiveCases((prev) =>
                  prev.map((c) => (c.id === currentCase.id ? { ...c, ...updated } : c))
                );
              }}
            />
          )}

          {activeTab === 'agenda' && (
            <AgendaTab
              agendaItems={agendaItems}
              onAddAgendaItem={(newItem) =>
                setAgendaItems((prev) => [
                  { ...newItem, id: 'agenda-' + Date.now() },
                  ...prev,
                ])
              }
              onUpdateAgendaItem={(id, updated) =>
                setAgendaItems((prev) =>
                  prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
                )
              }
              onDeleteAgendaItem={(id) =>
                setAgendaItems((prev) => prev.filter((item) => item.id !== id))
              }
            />
          )}
        </main>
      </div>

      {/* Floating feedback toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Publish & Web Hosting Guide Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onDownloadHtml={handleDownloadCustomHtml}
        sharedUrl="https://ais-pre-ejmf7wlgnste5pdn3lmp7m-575701206149.europe-west2.run.app"
      />
    </div>
  );
}
