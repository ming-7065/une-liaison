import { zh } from './zh';
import { ja } from './ja';
import { en } from './en';

export type Lang = 'zh' | 'ja' | 'en';

export const supportedLangs: Lang[] = ['zh', 'ja', 'en'];
export const defaultLang: Lang = 'zh';

export const langNames: Record<Lang, string> = {
  zh: '繁體中文',
  ja: '日本語',
  en: 'English',
};

export function getLangFromUrl(url: URL): Lang {
  const segments = url.pathname.split('/').filter(Boolean);
  const first = segments[0] as Lang;
  if (supportedLangs.includes(first)) return first;
  return defaultLang;
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

export function getTranslations(lang: Lang) {
  if (lang === 'ja') return ja;
  if (lang === 'en') return en;
  return zh;
}