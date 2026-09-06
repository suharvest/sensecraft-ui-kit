import type { StatusKey } from './tokens';
import { statusColors } from './tokens';

export type { StatusKey };

/** 四态 → antd Tag color */
export const statusTagColor: Record<StatusKey, string> = {
  normal: 'success',
  warning: 'warning',
  danger: 'error',
  disabled: 'default',
};

/** 四态 → antd Badge status */
export const statusBadgeStatus: Record<StatusKey, 'success' | 'warning' | 'error' | 'default'> = {
  normal: 'success',
  warning: 'warning',
  danger: 'error',
  disabled: 'default',
};

/** 四态 → { bg, fg } 色值（自绘徽标/非 antd 场景用） */
export const statusPalette = statusColors;

export function getStatusColor(status: StatusKey) {
  return statusColors[status];
}

/** i18n key 约定：common:status.<key> */
export function statusI18nKey(status: StatusKey): string {
  return `status.${status}`;
}
