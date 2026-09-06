import type { ReactNode } from 'react';
import { Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { borderRadius, colors } from '../theme/tokens';

export interface FilterBarProps {
  /** 左侧筛选控件（Input / Select / RangePicker 等） */
  children?: ReactNode;
  onSearch?: () => void;
  onReset?: () => void;
  /** 右侧自定义操作（如「新增」按钮） */
  actions?: ReactNode;
  loading?: boolean;
}

/** 筛选栏：左侧控件 + 右侧操作（视觉取自 warehouse 的 .filter-bar） */
export function FilterBar({ children, onSearch, onReset, actions, loading }: FilterBarProps) {
  const { t } = useTranslation('common');
  return (
    <div
      data-testid="filter-bar"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20,
        alignItems: 'flex-end',
        marginBottom: 20,
        background: colors.bgContainer,
        borderRadius: parseInt(borderRadius.lg, 10),
        padding: 20,
        boxShadow: '0 1px 3px 0 rgba(140,192,32,0.1)',
      }}
    >
      <Space wrap size={12}>
        {children}
      </Space>
      <div style={{ marginInlineStart: 'auto', display: 'flex', gap: 12 }}>
        {onReset && <Button onClick={onReset}>{t('action.reset')}</Button>}
        {onSearch && (
          <Button type="primary" onClick={onSearch} loading={loading}>
            {t('action.search')}
          </Button>
        )}
        {actions}
      </div>
    </div>
  );
}

export default FilterBar;
