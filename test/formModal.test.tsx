import { beforeAll, describe, expect, it, vi } from 'vitest';
import { createInstance } from 'i18next';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Form, Input } from 'antd';
import { FormModal } from '../src/patterns/FormModal';
import { initI18n } from '../src/i18n';

// antd Modal 内部用到 Grid 的 responsive 观察器，jsdom 默认不提供 matchMedia。
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

function renderModal(props: { initialValues?: Record<string, unknown>; onSubmit?: (v: any) => void }) {
  const i18n = initI18n({ instance: createInstance(), defaultLanguage: 'zh' });
  const ui = (initialValues?: Record<string, unknown>) => (
    <I18nextProvider i18n={i18n}>
      <FormModal
        open
        title="t"
        initialValues={initialValues}
        onCancel={() => undefined}
        onSubmit={props.onSubmit ?? (() => undefined)}
      >
        <Form.Item name="name" rules={[{ required: true, message: '必填' }]}>
          <Input aria-label="name" />
        </Form.Item>
      </FormModal>
    </I18nextProvider>
  );
  const view = render(ui(props.initialValues));
  return { ...view, rerenderWith: (v?: Record<string, unknown>) => view.rerender(ui(v)) };
}

describe('FormModal', () => {
  it('宿主重渲染换了 initialValues 引用时不清空用户已输入内容', () => {
    const { rerenderWith } = renderModal({ initialValues: { name: 'a' } });
    const input = screen.getByLabelText('name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'typed' } });
    rerenderWith({ name: 'a' });
    expect((screen.getByLabelText('name') as HTMLInputElement).value).toBe('typed');
  });

});
