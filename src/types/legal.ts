export interface ChatMessage {
  id: string;
  sender: 'lawyer' | 'ai';
  authorName: string;
  avatarText: string;
  title?: string;
  content: string;
  timestamp: string;
  statusBadge?: string;
  articles?: Array<{
    title: string;
    text: string;
  }>;
}

export interface LawCard {
  id: string;
  title: string;
  category: string;
  badge: string;
  content: string;
  jurisprudenceNumber?: string;
  tags?: string[];
}

export interface ContractClause {
  id: string;
  clauseNumber: string;
  originalText: string;
  severity: 'high' | 'medium' | 'low';
  severityLabel: string;
  legalAnalysis: string;
  recommendation: string;
}

export interface AgendaItem {
  id: string;
  dossierNumber: string;
  court: string;
  chamber: string;
  parties: string;
  hearingDate: string;
  hearingTime: string;
  actionRequired: string;
  status: 'pending' | 'ready' | 'deliberation' | 'postponed';
  statusLabel: string;
}

export interface LawyerProfile {
  name: string;
  bar: string;
  firmAddress: string;
  appealCourtQualified: boolean;
  phone?: string;
}

export interface ActiveCaseFile {
  id: string;
  dossierNumber: string;
  title: string;
  category: 'eviction' | 'divorce' | 'traffic' | 'labor' | 'urgent' | 'custom';
  categoryLabel: string;
  court: string;
  chamber: string;
  clientName: string;
  clientDetails: string;
  opponentName: string;
  opponentDetails: string;
  claimAmount: string;
  incidentDate: string;
  referenceDocs: string;
}
