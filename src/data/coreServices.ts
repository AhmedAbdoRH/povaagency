import type { LucideIcon } from 'lucide-react';
import {
  Camera,
  Film,
  Globe,
  Image,
  Megaphone,
  Palette,
  Sparkles,
  Target,
} from 'lucide-react';
import type { Page } from '../types/database';

export interface CoreServiceDefinition {
  slug: string;
  title: string;
  description: string;
  aliases?: string[];
  icon: LucideIcon;
  bgGradient: string;
  iconColor: string;
  borderColor: string;
}

export interface CoreServiceWithPage extends CoreServiceDefinition {
  page: Page | null;
}

export const coreServices: CoreServiceDefinition[] = [
  {
    slug: 'marketing-strategy',
    title: 'استراتيجية التسويق',
    description: 'صياغة استراتيجيات تسويقية متكاملة توجه قرارات النمو وتمنح مشروعك مسارًا واضحًا وقابلًا للتنفيذ.',
    aliases: ['استراتيجيات التسويق', 'التسويق الاستراتيجي'],
    icon: Target,
    bgGradient: 'from-blue-100 via-blue-50 to-white',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
  },
  {
    slug: 'content-creation',
    title: 'صناعة المحتوى',
    description: 'إنتاج محتوى يعبّر عن هويتك ويخاطب جمهورك بالشكل المناسب لكل منصة ومرحلة من رحلة العميل.',
    aliases: ['المحتوى', 'كتابة المحتوى', 'إنتاج المحتوى'],
    icon: Sparkles,
    bgGradient: 'from-purple-100 via-purple-50 to-white',
    iconColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
  },
  {
    slug: 'video-productions',
    title: 'إنتاج الفيديوهات',
    description: 'خدمات إنتاج متكاملة تشمل التخطيط والتنفيذ وما بعد الإنتاج لتقديم مخرجات جاهزة للنشر والتوزيع.',
    aliases: ['الإنتاج', 'الإنتاج المرئي', 'الإنتاج الرقمي', 'الإنتاج الإعلامي', 'إنتاج الفيديو'],
    icon: Film,
    bgGradient: 'from-indigo-100 via-indigo-50 to-white',
    iconColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
  },
  {
    slug: 'brand-identity',
    title: 'بناء الهوية التجارية',
    description: 'تصميم هوية بصرية متماسكة تمنح علامتك شخصية واضحة وتترك انطباعًا احترافيًا ومستدامًا.',
    aliases: ['الهوية التجارية', 'الهوية البصرية', 'بناء الهوية'],
    icon: Palette,
    bgGradient: 'from-emerald-100 via-emerald-50 to-white',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
  {
    slug: 'website-design',
    title: 'تصميم المواقع',
    description: 'تصميم وتطوير مواقع حديثة وسريعة ومقنعة تساعد على تحويل الزيارات إلى فرص وعملاء محتملين.',
    aliases: ['المواقع', 'تطوير المواقع', 'تصميم وتطوير المواقع'],
    icon: Globe,
    bgGradient: 'from-sky-100 via-sky-50 to-white',
    iconColor: 'text-sky-400',
    borderColor: 'border-sky-500/30',
  },
  {
    slug: 'social-media-campaigns',
    title: 'حملات السوشيال ميديا',
    description: 'إدارة الحملات والمحتوى والإعلانات على منصات التواصل لبناء حضور فعّال وتحقيق نتائج قابلة للقياس.',
    aliases: ['السوشيال ميديا', 'إدارة السوشيال ميديا', 'حملات التواصل الاجتماعي'],
    icon: Megaphone,
    bgGradient: 'from-rose-100 via-rose-50 to-white',
    iconColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
  },
  {
    slug: 'post-design',
    title: 'تصميم المنشورات',
    description: 'ابتكار تصاميم منشورات احترافية ومتسقة مع الهوية لتدعم المحتوى وتزيد من قوة الحضور البصري.',
    aliases: [
      'المنشورات',
      'تصميم السوشيال ميديا',
      'تصميم البوستات',
      'التصميم الجرافيكي',
      'الجرافيك',
      'تصميم جرافيكي',
      'Graphic Design',
      'Graphic',
      'Visual Design',
      'Social Media Design',
    ],
    icon: Image,
    bgGradient: 'from-fuchsia-100 via-fuchsia-50 to-white',
    iconColor: 'text-fuchsia-400',
    borderColor: 'border-fuchsia-500/30',
  },
  {
    slug: 'photography',
    title: 'التصوير الفوتوغرافي',
    description: 'تصوير احترافي للمنتجات والفرق والأحداث والمواد التسويقية بما يرفع جودة الانطباع البصري للمشروع.',
    aliases: ['التصوير', 'التصوير التجاري', 'التصوير الاحترافي'],
    icon: Camera,
    bgGradient: 'from-amber-100 via-amber-50 to-white',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
  },
];

const normalizeText = (value: string | null | undefined) =>
  (value || '')
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .toLowerCase();

const sortPages = (pages: Page[]) =>
  [...pages].sort((a, b) => {
    const orderDiff = (a.display_order ?? 0) - (b.display_order ?? 0);
    if (orderDiff !== 0) return orderDiff;
    return (a.created_at || '').localeCompare(b.created_at || '');
  });

const matchesCoreService = (page: Page, coreService: CoreServiceDefinition) => {
  const normalizedPageName = normalizeText(page.name);
  const candidates = [coreService.title, coreService.slug, ...(coreService.aliases || [])]
    .map(normalizeText)
    .filter(Boolean);

  return candidates.some(
    candidate =>
      normalizedPageName === candidate ||
      normalizedPageName.includes(candidate) ||
      candidate.includes(normalizedPageName)
  );
};

export const resolveCoreServicesWithPages = (pages: Page[]): CoreServiceWithPage[] => {
  const activePages = sortPages(pages).filter(page => page.is_active !== false);
  const pageByCoreService = new Map<string, Page>();
  const usedPageIds = new Set<string>();

  coreServices.forEach(coreService => {
    const matchedPage = activePages.find(
      page => !usedPageIds.has(page.id) && matchesCoreService(page, coreService)
    );

    if (matchedPage) {
      pageByCoreService.set(coreService.slug, matchedPage);
      usedPageIds.add(matchedPage.id);
    }
  });

  const unassignedPages = activePages.filter(page => !usedPageIds.has(page.id));

  coreServices.forEach(coreService => {
    if (!pageByCoreService.has(coreService.slug) && unassignedPages.length > 0) {
      const page = unassignedPages.shift();
      if (page) {
        pageByCoreService.set(coreService.slug, page);
      }
    }
  });

  return coreServices.map(coreService => ({
    ...coreService,
    page: pageByCoreService.get(coreService.slug) || null,
  }));
};

export const findCoreServiceBySlug = (slug: string) =>
  coreServices.find(coreService => coreService.slug === slug) || null;

export const findCoreServiceByPageId = (pages: Page[], pageId: string) =>
  resolveCoreServicesWithPages(pages).find(coreService => coreService.page?.id === pageId) || null;

/**
 * Returns true when a client's specialization belongs to the Graphic Design
 * core service (slug: 'post-design'). Accepts the specialization record that
 * ClientDetails attaches to the client (service_id + name) so callers don't
 * need an extra round-trip.
 */
export const isGraphicDesignContext = (specialization?: {
  service_id?: string | null;
  name?: string | null;
} | null) => {
  if (!specialization) return false;

  const service = findCoreServiceBySlug('post-design');
  if (service && specialization.service_id && specialization.service_id === service) {
    // We don't store id on definition directly; fall through to name check below.
  }

  // Match by Arabic title (definitive) or any alias.
  if (service) {
    const candidates = [service.title, service.slug, ...(service.aliases || [])]
      .map(value => normalizeText(value))
      .filter(Boolean);
    const normalizedSpec = normalizeText(specialization.name);
    if (normalizedSpec && candidates.some(c => normalizedSpec.includes(c) || c.includes(normalizedSpec))) {
      return true;
    }
  }
  return false;
};