import type { ReactNode } from 'react';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/tokens';

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface LoginPageProps {
  title: ReactNode;
  subtitle?: ReactNode;
  logo?: ReactNode;
  loading?: boolean;
  errorMessage?: ReactNode;
  footer?: ReactNode;
  extra?: ReactNode;
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
}

/** 独立登录页：渐变背景 + 居中卡片（风格指南 §3.4） */
export function LoginPage(props: LoginPageProps) {
  const { title, subtitle, logo, loading = false, errorMessage, footer, extra, onSubmit } = props;
  const { t } = useTranslation('common');
  const [form] = Form.useForm<LoginFormValues>();

  return (
    <div
      data-testid="login-page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: `linear-gradient(135deg, ${colors.bgLayout} 0%, #e8f4d4 100%)`,
      }}
    >
      <Card style={{ width: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          {logo}
          <Typography.Title level={4} style={{ marginBottom: 4, marginTop: logo ? 12 : 0 }}>
            {title}
          </Typography.Title>
          {subtitle && <Typography.Text type="secondary">{subtitle}</Typography.Text>}
        </div>

        {errorMessage && (
          <Alert type="error" showIcon message={errorMessage} style={{ marginBottom: 16 }} />
        )}

        <Form form={form} layout="vertical" onFinish={onSubmit} requiredMark={false}>
          <Form.Item
            name="username"
            label={t('auth.username')}
            rules={[{ required: true, message: t('error.fillAllFields') }]}
          >
            <Input autoComplete="username" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label={t('auth.password')}
            rules={[{ required: true, message: t('error.fillAllFields') }]}
          >
            <Input.Password autoComplete="current-password" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            {loading ? t('auth.loggingIn') : t('auth.login')}
          </Button>
        </Form>

        {extra && <div style={{ marginTop: 16 }}>{extra}</div>}
        {footer && (
          <div style={{ marginTop: 16, textAlign: 'center', color: colors.textTertiary, fontSize: 12 }}>
            {footer}
          </div>
        )}
      </Card>
    </div>
  );
}

export default LoginPage;
