/**
 * Converts various video platform URLs (YouTube, Vimeo, Google Drive) 
 * into their respective embeddable formats.
 */

interface EmbedOptions {
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  controls?: boolean;
  modestbranding?: number;
  showinfo?: number;
  rel?: number;
}

export function getEmbedUrl(url: string, options: EmbedOptions = {}): string | null {
  if (!url) return null;

  const { autoplay, mute, loop, controls = true, modestbranding, showinfo, rel } = options;

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('v=') 
      ? url.split('v=')[1]?.split('&')[0] 
      : url.split('/').pop()?.split('?')[0];
    
    let embedUrl = `https://www.youtube.com/embed/${videoId}?`;
    if (autoplay) embedUrl += 'autoplay=1&';
    if (mute) embedUrl += 'mute=1&';
    if (loop) embedUrl += `loop=1&playlist=${videoId}&`;
    if (!controls) embedUrl += 'controls=0&';
    if (modestbranding !== undefined) embedUrl += `modestbranding=${modestbranding}&`;
    if (showinfo !== undefined) embedUrl += `showinfo=${showinfo}&`;
    if (rel !== undefined) embedUrl += `rel=${rel}&`;
    
    // إخفاء عنوان الفيديو والشعار
    embedUrl += 'iv_load_policy=3&'; // إخفاء الشروحات
    embedUrl += 'fs=1&'; // السماح بملء الشاشة
    
    return embedUrl;
  }

  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0]?.split('/')[0];
    
    let embedUrl = `https://player.vimeo.com/video/${videoId}?`;
    if (autoplay) embedUrl += 'autoplay=1&';
    if (mute) embedUrl += 'muted=1&';
    if (loop) embedUrl += 'loop=1&';
    if (autoplay || mute) embedUrl += 'background=1&'; // background=1 hides controls and enables autoplay
    if (!controls) {
      embedUrl += 'controls=0&';
      embedUrl += 'title=0&byline=0&portrait=0&';
    }
    
    return embedUrl;
  }

  // Google Drive
  if (url.includes('drive.google.com')) {
    let videoId = '';
    if (url.includes('/d/')) {
      videoId = url.split('/d/')[1]?.split('/')[0];
    } else if (url.includes('id=')) {
      videoId = url.split('id=')[1]?.split('&')[0];
    }
    return videoId ? `https://drive.google.com/file/d/${videoId}/preview?authuser=0` : url;
  }

  return url;
}

export function getDriveVideoId(url: string): string | null {
  if (!url.includes('drive.google.com')) return null;

  if (url.includes('/d/')) {
    return url.split('/d/')[1]?.split('/')[0] || null;
  }

  if (url.includes('id=')) {
    return url.split('id=')[1]?.split('&')[0] || null;
  }

  return null;
}

export function getDriveVideoDirectUrl(url: string): string | null {
  const id = getDriveVideoId(url);
  return id ? `https://docs.google.com/uc?export=download&id=${id}` : null;
}

/**
 * Checks if a URL is from a platform that requires an iframe embed.
 */
export function isEmbeddable(url: string): boolean {
  if (!url) return false;
  return (
    url.includes('youtube.com') || 
    url.includes('youtu.be') || 
    url.includes('vimeo.com') || 
    url.includes('drive.google.com')
  );
}
