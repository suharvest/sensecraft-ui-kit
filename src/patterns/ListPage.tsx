import type { ReactNode } from 'react';
import { Alert, Button, Card, Empty, Space, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { FilterBar } from './FilterBar';

export interface ListPageProps<RecordType extends object> {
  title?: ReactNode;
  description?: ReactNode;
  /** 顶部统计卡片等自定义区域 */
  summary?: ReactNode;
  /** 筛选控件；不传则不渲染筛选栏 */
  filters?: ReactNode;
  onSearch?: () => void;
  onReset?: () => void;
  toolbar?: ReactNode;
  columns: TableProps<RecordType>['columns'];
  dataSource: RecordType[];
  rowKey?: TableProps<RecordType>['rowKey'];
  loading?: boolean;
  /** 非空时表格区域替换为错误态 */
  error?: ReactNode;
  onRetry?: () => void;
  emptyText?: ReactNode;
  pagination?: TableProps<RecordType>['pagination'];
  tableProps?: Omit<TableProps<RecordType>, 'columns' | 'dataSource' | 'rowKey' | 'loading' | 'pagination'>;
}

/** 列表页模式：筛选栏 + 表格 + 空态/加载态/错误态 */
export function ListPage<RecordType extends object>(props: ListPageProps<RecordType>) {
  const {
    title,
    description,
    summary,
    filters,
    onSearch,
    onReset,
    toolbar,
    columns,
    dataSource,
    rowKey = 'id',
    loading = false,
    error,
    onRetry,
    emptyText,
    pagination,
    tableProps,
  } = props;
  const { t } = useTranslation('common');

  return (
    <div data-testid="list-page">
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && (
            <Typography.Title level={4} style={{ margin: 0 }}>
              {title}
            </Typography.Title>
          )}
          {description && <Typography.Text type="secondary">{description}</Typography.Text>}
        </div>
      )}

      {summary && <div style={{ marginBottom: 20 }}>{summary}</div>}

      {(filters || onSearch || onReset || toolbar) && (
        <FilterBar onSearch={onSearch} onReset={onReset} actions={toolbar} loading={loading}>
          {filters}
        </FilterBar>
      )}

      <Card styles={{ body: { padding: 0 } }}>
        {error ? (
          <div style={{ padding: 24 }}>
            <Alert
              type="error"
              showIcon
              message={t('error.loadError')}
              description={error}
              action={
                onRetry ? (
                  <Button size="small" onClick={onRetry}>
                    {t('error.retry')}
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <Table<RecordType>
            columns={columns}
            dataSource={dataSource}
            rowKey={rowKey}
            loading={loading}
            pagination={
              pagination === undefined
                ? { showSizeChanger: true, showTotal: (total) => `${t('pagination.total')} ${total} ${t('pagination.recordsUnit')}` }
                : pagination
            }
            locale={{ emptyText: <Empty description={emptyText ?? t('error.noData')} /> }}
            {...tableProps}
          />
        )}
      </Card>
    </div>
  );
}

/** 操作列常用的图标按钮组 */
export function RowActions({ children }: { children: ReactNode }) {
  return <Space size={4}>{children}</Space>;
}

export default ListPage;
