import { useEffect, type ReactNode } from 'react';
import { Form, Modal } from 'antd';
import type { FormInstance, FormProps, ModalProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { modalWidth } from '../theme/tokens';

export type FormModalSize = keyof typeof modalWidth;

export interface FormModalProps<Values> {
  open: boolean;
  title: ReactNode;
  size?: FormModalSize;
  width?: number;
  initialValues?: Partial<Values>;
  confirmLoading?: boolean;
  onSubmit: (values: Values) => void | Promise<void>;
  onCancel: () => void;
  form?: FormInstance<Values>;
  layout?: FormProps['layout'];
  okText?: ReactNode;
  cancelText?: ReactNode;
  modalProps?: Omit<ModalProps, 'open' | 'title' | 'onOk' | 'onCancel' | 'width' | 'confirmLoading'>;
  children: ReactNode;
}

/** 表单弹窗：antd Modal + Form，尺寸走 small/default/large 三档预设 */
export function FormModal<Values extends object = Record<string, unknown>>(props: FormModalProps<Values>) {
  const {
    open,
    title,
    size = 'default',
    width,
    initialValues,
    confirmLoading = false,
    onSubmit,
    onCancel,
    form: externalForm,
    layout = 'vertical',
    okText,
    cancelText,
    modalProps,
    children,
  } = props;

  const { t } = useTranslation('common');
  const [internalForm] = Form.useForm<Values>();
  const form = externalForm ?? internalForm;

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (initialValues) form.setFieldsValue(initialValues as never);
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      open={open}
      title={title}
      width={width ?? modalWidth[size]}
      confirmLoading={confirmLoading}
      okText={okText ?? t('action.confirm')}
      cancelText={cancelText ?? t('action.cancel')}
      onCancel={onCancel}
      onOk={async () => {
        const values = await form.validateFields();
        await onSubmit(values);
      }}
      {...modalProps}
    >
      <Form form={form} layout={layout} preserve={false}>
        {children}
      </Form>
    </Modal>
  );
}

export default FormModal;
