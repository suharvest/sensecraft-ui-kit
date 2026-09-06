import type { ReactNode } from 'react';
import { Alert, Button, Card, Descriptions, Skeleton, Space, Typography } from 'antd';
import type { DescriptionsProps } from 'antd';
import { useTranslation } from 'react-i18next';

export interface DetailPageProps {
  title: ReactNode;
  subtitle?: ReactNode;
  onBack?: () => void;
  actions?: ReactNode;
  items?: DescriptionsProps['items'];
  column?: DescriptionsProps['column'];
  loading?: boolean;
  error?: ReactNode;
  onRetry?: () => void;
  children?: ReactNode;
}

/** 详情页模式：返回 + 标题 + 描述列表 + 自定义区块 */
export function DetailPage(props: DetailPageProps) {
  const { title, subtitle, onBack, actions, items, column = 2, loading = false, error, onRetry, children } = props;
  const { t } = useTranslation('common');

  return (
    <div data-testid="detail-page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        {onBack && <Button onClick={onBack}>{t('action.back')}</Button>}
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
          {subtitle && <Typography.Text type="secondary">{subtitle}</Typography.Text>}
        </div>
        {actions && <div style={{ marginInlineStart: 'auto' }}><Space>{actions}</Space></div>}
      </div>

      {error ? (
        <Alert
          type="error"
          showIcon
          message={t('error.loadError')}
          description={error}
          action={onRetry ? <Button size="small" onClick={onRetry}>{t('error.retry')}</Button> : undefined}
        />
      ) : (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {items && (
            <Card>
              {loading ? <Skeleton active /> : <Descriptions column={column} items={items} />}
            </Card>
          )}
          {children}
        </Space>
      )}
    </div>
  );
}

export default DetailPage;
