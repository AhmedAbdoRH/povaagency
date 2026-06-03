import { useState, useEffect } from 'react';

interface AspectRatio {
  width: number;
  height: number;
  ratio: number;
}

function toAspectRatio(width: number, height: number): AspectRatio {
  return {
    width,
    height,
    ratio: width / height,
  };
}

function isDirectVideoFile(url: string): boolean {
  if (!url) return false;
  // Direct video file (mp4, webm, ogg, mov, m4v, etc.) or blob URL
  if (url.startsWith('blob:')) return true;
  return /\.(mp4|webm|ogg|mov|m4v|avi|mkv)(\?.*)?$/i.test(url);
}

/**
 * Detects the aspect ratio of a video URL.
 * - For YouTube/Vimeo, uses oEmbed API.
 * - For direct video files (mp4, webm, etc.), loads the video metadata to read its natural dimensions.
 * - For embeds that don't expose metadata (for example Google Drive), can fall back
 *   to a poster/image that matches the video's original dimensions.
 */
export function useVideoAspectRatio(
  url: string | null | undefined,
  fallbackImageUrl?: string | null
): AspectRatio | null {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio | null>(null);

  useEffect(() => {
    if (!url && !fallbackImageUrl) {
      setAspectRatio(null);
      return;
    }

    let cancelled = false;

    const loadImageAspectRatio = (imageUrl: string) => {
      const image = new Image();

      image.onload = () => {
        if (cancelled) return;
        if (image.naturalWidth > 0 && image.naturalHeight > 0) {
          setAspectRatio(toAspectRatio(image.naturalWidth, image.naturalHeight));
        } else {
          setAspectRatio(null);
        }
      };

      image.onerror = () => {
        if (!cancelled) setAspectRatio(null);
      };

      image.src = imageUrl;
    };

    const fallbackToImage = () => {
      if (fallbackImageUrl) {
        loadImageAspectRatio(fallbackImageUrl);
      } else {
        setAspectRatio(null);
      }
    };

    // YouTube
    if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      fetch(oembedUrl)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch YouTube oEmbed');
          return res.json();
        })
        .then(data => {
          if (cancelled) return;
          if (data.width && data.height) {
            setAspectRatio(toAspectRatio(data.width, data.height));
          } else {
            fallbackToImage();
          }
        })
        .catch(() => {
          if (!cancelled) fallbackToImage();
        });
      return;
    }

    // Vimeo
    if (url && url.includes('vimeo.com')) {
      const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
      fetch(oembedUrl)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch Vimeo oEmbed');
          return res.json();
        })
        .then(data => {
          if (cancelled) return;
          if (data.width && data.height) {
            setAspectRatio(toAspectRatio(data.width, data.height));
          } else {
            fallbackToImage();
          }
        })
        .catch(() => {
          if (!cancelled) fallbackToImage();
        });
      return;
    }

    // Direct video file — load metadata to get natural dimensions
    if (url && isDirectVideoFile(url)) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.src = url;

      const cleanup = () => {
        video.onloadedmetadata = null;
        video.onerror = null;
        // Don't remove the src immediately to avoid breaking the browser's metadata cache
        video.removeAttribute('src');
        try { video.load(); } catch { /* noop */ }
      };

      video.onloadedmetadata = () => {
        if (cancelled) {
          cleanup();
          return;
        }
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (w > 0 && h > 0) {
          setAspectRatio(toAspectRatio(w, h));
        } else {
          fallbackToImage();
        }
        cleanup();
      };

      video.onerror = () => {
        if (!cancelled) fallbackToImage();
        cleanup();
      };

      return () => {
        cancelled = true;
        cleanup();
      };
    }

    fallbackToImage();
    return;
  }, [url, fallbackImageUrl]);

  return aspectRatio;
}
