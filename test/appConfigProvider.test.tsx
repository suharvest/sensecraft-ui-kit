import { beforeAll, describe, expect, it } from 'vitest';
import { createInstance } from 'i18next';
import { act, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { List } from 'antd';
import { AppConfigProvider } from '../src/components/AppConfigProvider';
import { initI18n } from '../src/i18n';

// antd Table 在挂载时读 responsive breakpoint，jsdom 默认不提供 matchMedia。
beforeAll(() => {
  window.matchMedia =
    window.matchMedia ??
    ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList);
});

describe('AppConfigProvider', () => {
  it('未传 locale/renderEmpty 时，裸 <List> 空态跟随当前语言用词典文案', async () => {
    const i18n = initI18n({ instance: createInstance(), defaultLanguage: 'zh' });
    const { rerender } = render(
      <I18nextProvider i18n={i18n}>
        <AppConfigProvider>
          <List dataSource={[]} renderItem={(item) => <List.Item>{String(item)}</List.Item>} />
        </AppConfigProvider>
      </I18nextProvider>,
    );
    expect(screen.getByText('暂无数据', { selector: 'div' })).toBeTruthy();

    await act(async () => {
      await i18n.changeLanguage('en');
    });
    rerender(
      <I18nextProvider i18n={i18n}>
        <AppConfigProvider>
          <List dataSource={[]} renderItem={(item) => <List.Item>{String(item)}</List.Item>} />
        </AppConfigProvider>
      </I18nextProvider>,
    );
    expect(screen.getByText('No data', { selector: 'div' })).toBeTruthy();
  });

  it('宿主显式传 renderEmpty 时以宿主为准', () => {
    const i18n = initI18n({ instance: createInstance(), defaultLanguage: 'zh' });
    render(
      <I18nextProvider i18n={i18n}>
        <AppConfigProvider renderEmpty={() => <div>自定义空态</div>}>
          <List dataSource={[]} renderItem={(item) => <List.Item>{String(item)}</List.Item>} />
        </AppConfigProvider>
      </I18nextProvider>,
    );
    expect(screen.getByText('自定义空态')).toBeTruthy();
  });
});
