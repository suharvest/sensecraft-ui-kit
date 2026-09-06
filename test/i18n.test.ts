import { beforeEach, describe, expect, it } from 'vitest';
import { createInstance } from 'i18next';
import {
  changeLanguage,
  commonResources,
  initI18n,
  LANGUAGE_STORAGE_KEY,
  readStoredLanguage,
} from '../src/i18n';

describe('i18n', () => {
  beforeEach(() => localStorage.clear());

  it('zh/en 词典键集合一致', () => {
    const flatten = (o: Record<string, unknown>, p = ''): string[] =>
      Object.entries(o).flatMap(([k, v]) =>
        typeof v === 'object' && v ? flatten(v as Record<string, unknown>, `${p}${k}.`) : [`${p}${k}`],
      );
    expect(flatten(commonResources.en).sort()).toEqual(flatten(commonResources.zh).sort());
  });

  it('初始化后可读取公共词条，切换语言后取到英文', async () => {
    const i18n = initI18n({ instance: createInstance(), defaultLanguage: 'zh' });
    expect(i18n.t('action.confirm')).toBe('确定');
    expect(i18n.t('status.normal')).toBe('正常');
    await changeLanguage('en', i18n);
    expect(i18n.t('action.confirm')).toBe('OK');
    expect(i18n.t('error.noData')).toBe('No data');
  });

  it('语言切换持久化到 localStorage 并可回读', async () => {
    const i18n = initI18n({ instance: createInstance() });
    await changeLanguage('en', i18n);
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
    expect(readStoredLanguage()).toBe('en');
    const restored = initI18n({ instance: createInstance() });
    expect(restored.language).toBe('en');
  });

  it('应用业务词条与公共词条合并在不同 namespace', () => {
    const i18n = initI18n({
      instance: createInstance(),
      resources: { zh: { demo: { hello: '你好' } }, en: { demo: { hello: 'Hello' } } },
    });
    expect(i18n.t('demo:hello')).toBe('你好');
    expect(i18n.t('common:action.cancel')).toBe('取消');
  });
});
