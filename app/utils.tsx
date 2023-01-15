export function getUrlSafeString(value: string): string {
  return encodeURIComponent(value.toLowerCase().replace(/[^a-z0-9 _-]+/gi, "-"));
}
