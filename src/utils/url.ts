import { getLangFromUrl, supportedLangs, type Lang } from '../i18n/utils';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const u = (path: string, lang?: Lang): string => {
  const langPrefix = lang ? `/${lang}` : '';
  return `${base}${langPrefix}${path}`;
};

export function getLangPrefix(url: URL): string {
  const lang = getLangFromUrl(url);
  return `/${lang}`;
}

export function switchLangUrl(url: URL, newLang: Lang): string {
  const segments = url.pathname.split('/').filter(Boolean);
  const first = segments[0] as Lang;
  if (supportedLangs.includes(first)) {
    segments[0] = newLang;
  } else {
    segments.unshift(newLang);
  }
  return '/' + segments.join('/') + url.search;
}