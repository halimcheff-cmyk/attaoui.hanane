export interface LegalAuditRule {
  id: string;
  term: string;
  regex: RegExp;
  category: 'deadlines' | 'petitions' | 'formalities' | 'forfeiture' | 'finance';
  categoryLabel: string;
  colorClass: {
    bg: string;
    text: string;
    border: string;
    badge: string;
  };
  tipTitle: string;
  tipDescription: string;
  legalBasis: string;
  checkAction: string;
}

export const moroccanLegalAuditRules: LegalAuditRule[] = [
  // 1. المواعيد والآجال المسطرية
  {
    id: 'term-15-days',
    term: '15 يوماً / خمسة عشر يوماً',
    regex: /(15\s*يوماً|خمسة\s*عشر\s*يوماً|15\s*يوم)/gi,
    category: 'deadlines',
    categoryLabel: 'أجل مسطري حاسم',
    colorClass: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-200',
      border: 'border-b-2 border-amber-400',
      badge: 'bg-amber-500/30 text-amber-300',
    },
    tipTitle: 'مراجعة أجل الإنذار التطهيري (المادة 8 قانون 49.16)',
    tipDescription: 'تأكدي من احتساب أجل الـ 15 يوماً ابتداءً من تاريخ التوصل الفعلي للمكتري بالإنذار وليس تاريخ توجيهه، وأن المقال رُفع بعد انصرام الأجل كاملاً.',
    legalBasis: 'المادة 8 من القانون رقم 49.16 وقرار محكمة النقض رقم 114/2',
    checkAction: 'مراجعة تاريخ محضر المفوض القضائي وتاريخ إيداع المقال',
  },
  {
    id: 'term-30-days',
    term: '30 يوماً / ثلاثين يوماً',
    regex: /(30\s*يوماً|ثلاثين\s*يوماً|30\s*يوم)/gi,
    category: 'deadlines',
    categoryLabel: 'أجل طعن أو إشعار',
    colorClass: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-200',
      border: 'border-b-2 border-amber-400',
      badge: 'bg-amber-500/30 text-amber-300',
    },
    tipTitle: 'مراجعة أجل الطعن بالنقض أو إنذار الكراء السكني',
    tipDescription: 'أجل الطعن بالنقض يحدد في 30 يوماً كاملة من تاريخ التبليغ الرسمي للقرار. وفي الكراء السكني (قانون 67.12) يعطى أجل 30 يوماً لأداء الكراء المتأخر.',
    legalBasis: 'الفصل 358 من قانون المسطرة المدنية / المادة 26 من القانون 67.12',
    checkAction: 'التأكد من التبليغ القانوني الصحيح واحتساب العطل الرسمية',
  },
  {
    id: 'term-8-days',
    term: '8 أيام / ثمانية أيام',
    regex: /(8\s*أيام|ثمانية\s*أيام)/gi,
    category: 'deadlines',
    categoryLabel: 'مسطرة شغلية آمرة',
    colorClass: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-200',
      border: 'border-b-2 border-amber-400',
      badge: 'bg-amber-500/30 text-amber-300',
    },
    tipTitle: 'أجل مسطرة الاستماع التأديبي للأجير',
    tipDescription: 'في قضايا الفصل التأديبي، يجب إجراء الاستماع داخل أجل 8 أيام من تاريخ تبين الخطأ الجسيم، وإلا اعتبر الفصل تعسفياً.',
    legalBasis: 'المادة 62 من القانون 65.99 المتعلق بمدونة الشغل',
    checkAction: 'إرفاق محضر الاستماع الموقع من المشغل ومندوب الأجراء',
  },

  // 2. الملتمسات القضائية الحساسة
  {
    id: 'term-provisional-enforcement',
    term: 'النفاذ المعجل',
    regex: /(النفاذ\s*المعجل|مشمولاً\s*بالنفاذ\s*المعجل|مشمول\s*بالنفاذ\s*المعجل)/gi,
    category: 'petitions',
    categoryLabel: 'ملتمس تنفيذي جوهري',
    colorClass: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-200',
      border: 'border-b-2 border-blue-400',
      badge: 'bg-blue-500/30 text-blue-300',
    },
    tipTitle: 'تحديد سند النفاذ المعجل (بقوة القانون أم بكفالة)',
    tipDescription: 'بيّني في الحيثيات والملتمسات هل النفاذ المعجل ملتمس بقوة القانون (كالكراء التجاري، النفقات، الشغل) أو بأمر مع كفالة أو إعفاء منها طبقاً للفصل 147 ق.م.م.',
    legalBasis: 'الفصل 147 من قانون المسطرة المدنية والمادة 285 ق.م.م',
    checkAction: 'إضافة عبارة: "بقوة القانون ودون كفالة" إن كان السند نصاً صريحاً',
  },
  {
    id: 'term-astreinte',
    term: 'غرامة تهديدية',
    regex: /(غرامة\s*تهديدية|الغرامة\s*التهديدية)/gi,
    category: 'petitions',
    categoryLabel: 'إكراه مالي للتنفيذ',
    colorClass: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-200',
      border: 'border-b-2 border-blue-400',
      badge: 'bg-blue-500/30 text-blue-300',
    },
    tipTitle: 'تحديد سقف وتاريخ سريان الغرامة التهديدية',
    tipDescription: 'يُفضل تحديد مبلغ دقيق للغرامة التهديدية عن كل يوم تأخير في الامتثال (مثلاً: 500 أو 1,000 درهم عن كل يوم تأخير ابتداءً من تاريخ التبليغ أو الامتناع).',
    legalBasis: 'الفصل 448 من قانون المسطرة المدنية',
    checkAction: 'التأكد من قابلية الالتزام للتنفيذ العيني بواسطة المحكوم عليه',
  },
  {
    id: 'term-reservations',
    term: 'تحت سائر التحفظات',
    regex: /(تحت\s*سائر\s*التحفظات|سائر\s*التحفظات)/gi,
    category: 'petitions',
    categoryLabel: 'صيغة مهنية أصيلة',
    colorClass: {
      bg: 'bg-purple-500/20',
      text: 'text-purple-200',
      border: 'border-b-2 border-purple-400',
      badge: 'bg-purple-500/30 text-purple-300',
    },
    tipTitle: 'صيغة التحفظ المهني لهيئة المحامين',
    tipDescription: 'عبارة أساسية لحفظ حق الموكل في تقديم أي طلبات إضافية أو مذكرات تعقيبية لاحقة أو استئناف فرعي.',
    legalBasis: 'تقاليد وأعراف هيئة المحامين بالمغرب',
    checkAction: 'موضعها المثالي قبل التوقيع في ذيل المذكرة',
  },

  // 3. شكليات المسطرة والاختصاص
  {
    id: 'term-article-32',
    term: 'الفصل 32 من قانون المسطرة المدنية',
    regex: /(الفصل\s*32|الفصلين\s*31\s*و32|الفصل\s*31)/gi,
    category: 'formalities',
    categoryLabel: 'شكليات قبول الدعوى',
    colorClass: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-200',
      border: 'border-b-2 border-emerald-400',
      badge: 'bg-emerald-500/30 text-emerald-300',
    },
    tipTitle: 'مراجعة بيانات المقال الافتتاحي الجوهرية',
    tipDescription: 'تأكدي من توافر كافة البيانات: الأسماء العائلية والشخصية، الصفة والمهنة، والموطن الحقيقي أو المختار بدقة، وإرفاق المستندات المؤيدة تحت طائلة عدم القبول شكلاً.',
    legalBasis: 'الفصل 32 من قانون المسطرة المدنية المغربي',
    checkAction: 'مراجعة صحة اسم ولقب المدعي والمدعى عليه وعنوان التبليغ',
  },
  {
    id: 'term-huissier',
    term: 'المفوض القضائي / محضر التبليغ',
    regex: /(المفوض\s*القضائي|محضر\s*التبليغ|شهادة\s*التسليم|محضر\s*معاينة)/gi,
    category: 'formalities',
    categoryLabel: 'حجية الإثبات والتبليغ',
    colorClass: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-200',
      border: 'border-b-2 border-emerald-400',
      badge: 'bg-emerald-500/30 text-emerald-300',
    },
    tipTitle: 'نوع التوصل في محضر التبليغ (شخصي أم بالموطن)',
    tipDescription: 'في دعاوى التماطل والإفراغ، اشترط قضاء محكمة النقض التوصل الشخصي للمكتري بالإنذار لسقوط حقه في التعويض، ولا يعتد بالتبليغ للغير إذا أمكن التوصل الشخصي.',
    legalBasis: 'القانون رقم 81.03 المنظم لمهنة المفوضين القضائيين',
    checkAction: 'التأكد من توقيع المفوض القضائي وتضمين رقم ملف التبليغ وتاريخه',
  },

  // 4. السقوط والبطلان والتماطل
  {
    id: 'term-tamattol',
    term: 'التماطل / المطل',
    regex: /(التماطل|تماطل|حالة\s*المطل|المطل)/gi,
    category: 'forfeiture',
    categoryLabel: 'الركن المسقط للتعويض',
    colorClass: {
      bg: 'bg-rose-500/20',
      text: 'text-rose-200',
      border: 'border-b-2 border-rose-400',
      badge: 'bg-rose-500/30 text-rose-300',
    },
    tipTitle: 'تحقق شروط التماطل القانونية',
    tipDescription: 'التماطل لا يعتبر محققاً إلا بعد: 1. حلول أجل الكراء 2. توجيه إنذار صحيح 3. انصرام أجل 15 يوماً دون أداء مبرئ للذمة.',
    legalBasis: 'المادة 8 من القانون 49.16 والفصول 254 و255 من ق.ل.ع',
    checkAction: 'التأكد من عدم وجود منازعة جدية في السومة الكرائية معروضة على القضاء',
  },
  {
    id: 'term-nullity-order',
    term: 'باطل بقوة القانون / النظام العام',
    regex: /(باطل\s*بقوة\s*القانون|باطلة\s*بقوة\s*القانون|النظام\s*العام)/gi,
    category: 'forfeiture',
    categoryLabel: 'بطلان مطلق',
    colorClass: {
      bg: 'bg-rose-500/20',
      text: 'text-rose-200',
      border: 'border-b-2 border-rose-400',
      badge: 'bg-rose-500/30 text-rose-300',
    },
    tipTitle: 'الدفع بالبطلان المتصل بالنظام العام',
    tipDescription: 'البنود المخالفة للمقتضيات الحمائية (مثل التنازل المسبق عن التعويض في الكراء التجاري أو تجاوز سقف الزيادة 10%) تقع باطلة حكماً ويمكن للمحكمة إثارتها تلقائياً.',
    legalBasis: 'المادتان 7 و36 من القانون 49.16 / الفصل 306 من ق.ل.ع',
    checkAction: 'طلب التصريح ببطلان البند المخالف مع بقاء العقد سارياً',
  },

  // 5. المبالغ والمستحقات المالية
  {
    id: 'term-currency-sums',
    term: 'المبالغ المالية والتعويضات (درهم)',
    regex: /(\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*درهم|\b\d+\s*درهم)/gi,
    category: 'finance',
    categoryLabel: 'مبالغ مالية ومستحقات',
    colorClass: {
      bg: 'bg-cyan-500/20',
      text: 'text-cyan-200',
      border: 'border-b-2 border-cyan-400',
      badge: 'bg-cyan-500/30 text-cyan-300',
    },
    tipTitle: 'مطابقة المبالغ المالية بالأرقام والحروف',
    tipDescription: 'تأكدي من تطابق المبلغ المكتوب بالأرقام مع تفقيطه كتابةً بالحروف (مثال: 32,000 درهم = اثنان وثلاثون ألف درهم)، لمنع أي نزاع أو غموض عند التنفيذ الجبري لدى مأمور التنفيذ.',
    legalBasis: 'قواعد التنفيذ الجبري في قانون المسطرة المدنية',
    checkAction: 'مراجعة المبالغ في الحيثيات وفي الملتمسات النهائية لضمان التطابق التام',
  },
];

export interface DetectedAuditTerm {
  rule: LegalAuditRule;
  matchText: string;
  count: number;
}

/**
 * Scan draft text and return all detected legal terms with count
 */
export function auditLegalDraft(content: string): DetectedAuditTerm[] {
  const results: DetectedAuditTerm[] = [];

  for (const rule of moroccanLegalAuditRules) {
    const matches = content.match(rule.regex);
    if (matches && matches.length > 0) {
      results.push({
        rule,
        matchText: matches[0],
        count: matches.length,
      });
    }
  }

  return results;
}
