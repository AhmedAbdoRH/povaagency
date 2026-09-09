import type { Page, Specialization } from '../types/database';

export interface DriveVideoItem {
  id?: string;
  title?: string;
  url: string;
  thumbnail_url?: string | null;
}

export interface ExtractedDriveVideos {
  primary_url: string;
  videos: {
    id: string;
    title: string;
    url: string;
    embedUrl: string;
    thumbnail_url?: string | null;
  }[];
}

const META_TAG_REGEX = /<!--(?:PAGE_LINKS|DRIVE_VIDEOS):(.*?)-->/;

/**
 * Strips hidden metadata tags from a description string
 */
export function cleanPageDescription(description: string | null | undefined): string {
  if (!description) return '';
  return description.replace(/<!--(?:PAGE_LINKS|DRIVE_VIDEOS):(.*?)-->/g, '').trim();
}

/**
 * Encodes Drive videos into a description string for fallback persistence
 */
export function encodeDescriptionWithDriveVideos(
  description: string | null | undefined,
  driveUrl: string | null | undefined,
  additionalVideos?: DriveVideoItem[] | null,
  primaryThumbnailUrl?: string | null
): string {
  const baseDescription = cleanPageDescription(description);
  const cleanDriveUrl = driveUrl?.trim() || '';
  const cleanAdditional = (additionalVideos || []).filter(v => v.url && v.url.trim());
  const cleanPrimaryThumbnail = primaryThumbnailUrl?.trim() || '';

  if (!cleanDriveUrl && cleanAdditional.length === 0 && !cleanPrimaryThumbnail) {
    return baseDescription;
  }

  const dataToSave = {
    drive_url: cleanDriveUrl,
    additional_videos: cleanAdditional,
    primary_thumbnail_url: cleanPrimaryThumbnail,
  };

  const tag = `<!--DRIVE_VIDEOS:${JSON.stringify(dataToSave)}-->`;
  return baseDescription ? `${baseDescription}\n\n${tag}` : tag;
}

/**
 * Extracts Google Drive File ID from various Drive URL formats
 */
export function getGoogleDriveFileId(url: string | null | undefined): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // /file/d/FILE_ID
  const fileDMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // ?id=FILE_ID or &id=FILE_ID
  const idParamMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  // /d/FILE_ID
  const dMatch = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) {
    return dMatch[1];
  }

  return null;
}

/**
 * Generates an embedded preview URL for a Google Drive video
 */
export function getGoogleDriveEmbedUrl(url: string | null | undefined): string {
  if (!url) return '';
  const fileId = getGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  // If already preview or raw url from drive
  if (url.includes('drive.google.com') && url.includes('/preview')) {
    return url;
  }
  return url;
}

/**
 * Checks if a URL belongs to Google Drive
 */
export function isGoogleDriveUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}

function getPrimaryThumbnailUrl(page: Page | Specialization): string | null {
  // أولوية للـ video_thumbnail من الجدول
  if ('video_thumbnail' in page && page.video_thumbnail) {
    return page.video_thumbnail;
  }

  // Fallback للـ metadata في الوصف
  const description = page.description || page.description_en || '';
  const match = description.match(META_TAG_REGEX);
  if (!match?.[1]) return null;

  try {
    const parsed = JSON.parse(match[1]);
    return typeof parsed.primary_thumbnail_url === 'string' ? parsed.primary_thumbnail_url : null;
  } catch {
    return null;
  }
}

/**
 * Extracts all Google Drive videos from a Page or Specialization
 */
export function extractDriveVideos(page: Page | Specialization | null | undefined): ExtractedDriveVideos {
  const result: ExtractedDriveVideos = {
    primary_url: '',
    videos: [],
  };

  if (!page) return result;

  const seenUrls = new Set<string>();

  // Helper to add a video
  const addVideo = (rawUrl: string, title?: string, id?: string, thumbnailUrl?: string | null) => {
    const trimmed = rawUrl.trim();
    if (!trimmed || seenUrls.has(trimmed)) return;
    seenUrls.add(trimmed);
    const embed = getGoogleDriveEmbedUrl(trimmed);
    result.videos.push({
      id: id || `drive_vid_${result.videos.length + 1}`,
      title: title || `فيديو ${result.videos.length + 1}`,
      url: trimmed,
      embedUrl: embed,
      thumbnail_url: thumbnailUrl || null,
    });
  };

  // 1. Direct column: drive_url or google_drive_url
  if (page.drive_url && typeof page.drive_url === 'string' && page.drive_url.trim()) {
    result.primary_url = page.drive_url.trim();
    addVideo(page.drive_url.trim(), undefined, undefined, getPrimaryThumbnailUrl(page));
  } else if (page.google_drive_url && typeof page.google_drive_url === 'string' && page.google_drive_url.trim()) {
    result.primary_url = page.google_drive_url.trim();
    addVideo(page.google_drive_url.trim(), undefined, undefined, getPrimaryThumbnailUrl(page));
  }

  // 2. Custom links column
  if (Array.isArray(page.custom_links)) {
    page.custom_links.forEach((item, idx) => {
      if (item && item.url) {
        addVideo(item.url, item.title || `فيديو ${idx + 2}`, item.id, item.thumbnail_url || null);
      }
    });
  } else if (typeof page.custom_links === 'string') {
    try {
      const parsed = JSON.parse(page.custom_links);
      if (Array.isArray(parsed)) {
        parsed.forEach((item, idx) => {
          if (item && item.url) {
            addVideo(item.url, item.title || `فيديو ${idx + 2}`, item.id, item.thumbnail_url || null);
          }
        });
      }
    } catch {
      // ignore JSON parse error
    }
  }

  // 3. Metadata tags in description
  const descToCheck = page.description || page.description_en || '';
  const match = descToCheck.match(META_TAG_REGEX);
  if (match && match[1]) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed.drive_url && typeof parsed.drive_url === 'string') {
        if (!result.primary_url) {
          result.primary_url = parsed.drive_url.trim();
        }
        addVideo(parsed.drive_url.trim(), undefined, undefined, parsed.primary_thumbnail_url || null);
      }
      if (Array.isArray(parsed.additional_videos)) {
        parsed.additional_videos.forEach((item: { url?: string; title?: string; id?: string; thumbnail_url?: string | null }, idx: number) => {
          if (item && item.url) {
            addVideo(item.url, item.title, item.id, item.thumbnail_url || null);
          }
        });
      }
      if (Array.isArray(parsed.custom_links)) {
        parsed.custom_links.forEach((item: { url?: string; title?: string; id?: string; thumbnail_url?: string | null }, idx: number) => {
          if (item && item.url) {
            addVideo(item.url, item.title, item.id, item.thumbnail_url || null);
          }
        });
      }
    } catch (e) {
      console.warn('Failed to parse drive videos metadata', e);
    }
  }

  return result;
}

// Backward-compatibility exports
export function extractPageLinks(page: Page | Specialization | null | undefined) {
  const driveInfo = extractDriveVideos(page);
  return {
    drive_url: driveInfo.primary_url,
    youtube_url: '',
    custom_links: driveInfo.videos.slice(1).map(v => ({ id: v.id, title: v.title, url: v.url, type: 'drive' as const })),
  };
}

export function encodeDescriptionWithLinks(
  description: string | null | undefined,
  links: {
    drive_url?: string | null;
    youtube_url?: string | null;
    custom_links?: { id?: string; title?: string; url: string }[] | null;
  }
): string {
  return encodeDescriptionWithDriveVideos(description, links.drive_url, links.custom_links);
}
