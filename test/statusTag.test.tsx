import { describe, expect, it } from 'vitest';
import { createInstance } from 'i18next';
import { act, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { StatusTag } from '../src/components/StatusTag';
import { initI18n } from '../src/i18n';

describe('StatusTag', () => {
  it('按语言渲染四态文案', async () => {
    const i18n = initI18n({ instance: createInstance(), defaultLanguage: 'zh' });
    const { rerender } = render(
      <I18nextProvider i18n={i18n}>
        <StatusTag status="warning" />
      </I18nextProvider>,
    );
    expect(screen.getByText('偏低')).toBeTruthy();

    await act(async () => {
      await i18n.changeLanguage('en');
    });
    rerender(
      <I18nextProvider i18n={i18n}>
        <StatusTag status="warning" />
      </I18nextProvider>,
    );
    expect(screen.getByText('Low')).toBeTruthy();
  });
});
