import i18next, { type i18n as I18nInstance, type Resource, type ResourceKey } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { COMMON_NAMESPACE, commonResources, en, zh } from './resources';

export { commonResources, COMMON_NAMESPACE, zh as commonZh, en as commonEn };

export type SupportedLanguage = 'zh' | 'en';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['zh', 'en'];
export const LANGUAGE_STORAGE_KEY = 'sensecraft.lang';

export function readStoredLanguage(fallback: SupportedLanguage = 'zh'): SupportedLanguage {
  try {
    const stored = globalThis.localStorage?.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'zh' || stored === 'en') return stored;
  } catch {
    /* localStorage 不可用（SSR / 隐私模式）时回落默认语言 */
  }
  return fallback;
}

export function persistLanguage(lang: SupportedLanguage): void {
  try {
    globalThis.localStorage?.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    /* 忽略写入失败 */
  }
}

export interface InitI18nOptions {
  /** 各应用自己的业务词条，形如 { zh: { app: {...} }, en: { app: {...} } } */
  resources?: Partial<Record<SupportedLanguage, Record<string, unknown>>>;
  defaultLanguage?: SupportedLanguage;
  defaultNS?: string;
  instance?: I18nInstance;
}

/** 初始化 i18next：内置 common namespace + 应用扩展词条，语言选择持久化到 localStorage */
export function initI18n(options: InitI18nOptions = {}): I18nInstance {
  const { resources = {}, defaultLanguage = 'zh', defaultNS = COMMON_NAMESPACE } = options;
  const instance = options.instance ?? i18next;

  const merged = SUPPORTED_LANGUAGES.reduce<Resource>((acc, lang) => {
    acc[lang] = {
      [COMMON_NAMESPACE]: commonResources[lang] as unknown as ResourceKey,
      ...((resources[lang] ?? {}) as Record<string, ResourceKey>),
    };
    return acc;
  }, {});

  const lng = readStoredLanguage(defaultLanguage);

  if (!instance.isInitialized) {
    instance.use(initReactI18next).init({
      resources: merged,
      lng,
      fallbackLng: 'zh',
      defaultNS,
      ns: Object.keys(merged.zh ?? {}),
      interpolation: { escapeValue: false },
    });
  } else {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      Object.entries(merged[lang] ?? {}).forEach(([ns, bundle]) => {
        instance.addResourceBundle(lang, ns, bundle, true, false);
      });
    });
    instance.changeLanguage(lng);
  }

  instance.on('languageChanged', (next) => {
    if (next === 'zh' || next === 'en') persistLanguage(next);
  });

  return instance;
}

export function changeLanguage(lang: SupportedLanguage, instance: I18nInstance = i18next) {
  persistLanguage(lang);
  return instance.changeLanguage(lang);
}
