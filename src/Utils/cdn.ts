// Hosts whose /media/<path> (or /cfit/<path>) is a Wayke media image, and the CDN that
// serves it through cfit/v3. Blob storage goes to its environment's CDN; a CDN host keeps
// its own host (each one has cfit/v3).
const CDN_FOR_MEDIA_HOST: Record<string, string> = {
  'cdn.wayke.se': 'https://cdn.wayke.se',
  'cdn.drive.no': 'https://cdn.drive.no',
  'test-cdn.wayke.se': 'https://test-cdn.wayke.se',
  'test-cdn.drive.no': 'https://test-cdn.drive.no',
  'test-cdn.wayketech.se': 'https://test-cdn.wayketech.se',
  'waykeprodsharedstorages.blob.core.windows.net': 'https://cdn.wayke.se',
  'wayketestsharedstorages.blob.core.windows.net': 'https://test-cdn.wayketech.se',
};

const MEDIA_PATH = /^\/(?:media|cfit(?:\/v3)?)\/([^?#]+)$/;

interface WaykeImageOptions {
  /** Width in px; must be one of cfit/v3's widths (48, 64, 225, 800, …). */
  width?: number;
  /**
   * Leave unset for photos (cfit/v3 negotiates webp/jpeg from Accept). `png` for logos:
   * it keeps a transparent logo transparent and a JPEG stays JPEG.
   */
  format?: 'png' | 'webp';
}

/**
 * A Wayke media image (blob storage, a CDN's /media or /cfit) as cfit/v3 on the CDN.
 * `/media/<id>?w=` went to the legacy resizer and blob storage served the original
 * straight from storage; both are being retired. Any other URL is returned as is.
 */
export function waykeImage(url: string, options?: WaykeImageOptions): string;
export function waykeImage(
  url: string | null | undefined,
  options?: WaykeImageOptions
): string | null | undefined;
export function waykeImage(
  url: string | null | undefined,
  { width, format }: WaykeImageOptions = {}
) {
  if (!url) return url;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  const cdn = CDN_FOR_MEDIA_HOST[parsed.host];
  const path = parsed.pathname.match(MEDIA_PATH)?.[1];
  if (!cdn || !path) return url;

  const params = new URLSearchParams();
  if (width) params.set('w', String(width));
  if (format) params.set('format', format);
  const query = params.toString();
  return `${cdn}/cfit/v3/${path}${query ? `?${query}` : ''}`;
}
