import type { ReactNode } from 'react';
import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { statusTagColor, type StatusKey } from '../theme/status';

export interface StatusTagProps {
  status: StatusKey;
  /** 覆盖默认文案；不传则取 common:status.<status> */
  label?: ReactNode;
  bordered?: boolean;
}

/** 四态语义标签：normal / warning / danger / disabled */
export function StatusTag({ status, label, bordered = true }: StatusTagProps) {
  const { t } = useTranslation('common');
  return (
    <Tag color={statusTagColor[status]} bordered={bordered} data-status={status}>
      {label ?? t(`status.${status}`)}
    </Tag>
  );
}

export default StatusTag;
