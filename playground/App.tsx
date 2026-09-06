import { useMemo, useState } from 'react';
import { Button, Card, Col, Input, List, Row, Select, Statistic } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  AppShell,
  FormModal,
  InboxIcon,
  ListPage,
  LoginPage,
  StatusTag,
  type MenuItemDef,
  type StatusKey,
} from '@sensecraft/ui-kit';

interface DeviceRow {
  id: string;
  name: string;
  site: string;
  status: StatusKey;
  updatedAt: string;
}

const rows: DeviceRow[] = [
  { id: 'D-001', name: 'Gateway-A1', site: 'Shenzhen / 深圳', status: 'normal', updatedAt: '2026-09-06 10:12' },
  { id: 'D-002', name: 'Camera-B2', site: 'Shanghai / 上海', status: 'warning', updatedAt: '2026-09-06 09:48' },
  { id: 'D-003', name: 'Sensor-C3', site: 'Beijing / 北京', status: 'danger', updatedAt: '2026-09-05 22:31' },
  { id: 'D-004', name: 'Relay-D4', site: 'Chengdu / 成都', status: 'disabled', updatedAt: '2026-09-01 14:05' },
];

export default function App() {
  const { t } = useTranslation(['common', 'demo']);
  const [view, setView] = useState<'shell' | 'login'>('shell');
  const [modalOpen, setModalOpen] = useState(false);

  const menuItems: MenuItemDef[] = useMemo(
    () => [
      { key: 'dashboard', label: t('common:nav.dashboard'), icon: <InboxIcon /> },
      { key: 'devices', label: t('demo:devices'), icon: <InboxIcon /> },
      { key: 'users', label: t('common:nav.users'), icon: <InboxIcon />, minRole: 'admin' },
      { key: 'settings', label: t('common:nav.settings'), icon: <InboxIcon />, minRole: 'admin' },
    ],
    [t],
  );

  if (view === 'login') {
    return (
      <LoginPage
        title={t('demo:appTitle')}
        subtitle={t('common:auth.login')}
        onSubmit={() => setView('shell')}
        footer="@sensecraft/ui-kit v0.1.0"
        extra={
          <Button block onClick={() => setView('shell')}>
            {t('common:action.back')}
          </Button>
        }
      />
    );
  }

  return (
    <AppShell
      logo={{ icon: <InboxIcon width={22} height={22} />, title: t('demo:appTitle') }}
      menuItems={menuItems}
      selectedKey="devices"
      currentUserRole="admin"
      userName="admin"
      userMenuItems={[{ key: 'profile', label: t('common:auth.profile') }, { key: 'logout', label: t('common:auth.logout') }]}
      onUserMenuClick={({ key }) => key === 'logout' && setView('login')}
      breadcrumb={[{ title: t('common:nav.dashboard') }, { title: t('demo:devices') }]}
      pageTitle={t('demo:devices')}
      versionText="v0.1.0"
      extra={<Button onClick={() => setView('login')}>{t('common:auth.login')}</Button>}
    >
      <ListPage<DeviceRow>
        title={t('demo:devices')}
        description={t('common:time.updatedAt') + ' 2026-09-06'}
        summary={
          <Row gutter={16}>
            <Col span={6}><Card><Statistic title={t('common:status.online')} value={128} /></Card></Col>
            <Col span={6}><Card><Statistic title={t('common:status.warning')} value={6} /></Card></Col>
            <Col span={6}><Card><Statistic title={t('common:status.danger')} value={2} /></Card></Col>
            <Col span={6}><Card><Statistic title={t('common:status.disabled')} value={11} /></Card></Col>
          </Row>
        }
        filters={
          <>
            <Input placeholder={t('common:filter.searchPlaceholder')} style={{ width: 220 }} />
            <Select
              placeholder={t('common:filter.status')}
              style={{ width: 180 }}
              options={(['normal', 'warning', 'danger', 'disabled'] as StatusKey[]).map((s) => ({
                value: s,
                label: t(`common:status.${s}`),
              }))}
            />
          </>
        }
        onSearch={() => undefined}
        onReset={() => undefined}
        toolbar={<Button type="primary" onClick={() => setModalOpen(true)}>{t('demo:addDevice')}</Button>}
        columns={[
          { title: 'ID', dataIndex: 'id', width: 120 },
          { title: t('demo:deviceName'), dataIndex: 'name' },
          { title: t('demo:site'), dataIndex: 'site' },
          { title: t('common:filter.status'), dataIndex: 'status', render: (s: StatusKey) => <StatusTag status={s} /> },
          { title: t('common:time.updatedAt'), dataIndex: 'updatedAt', width: 180 },
          {
            title: t('common:action.actions'),
            width: 160,
            render: () => (
              <>
                <Button type="link" size="small">{t('common:action.edit')}</Button>
                <Button type="link" size="small" danger>{t('common:action.delete')}</Button>
              </>
            ),
          },
        ]}
        dataSource={rows}
        pagination={false}
      />

      {/* 验证 AppConfigProvider 的 renderEmpty：裸 <List>（不经 ListPage 的 emptyText）
          空态跟着 changeLanguage 切换，而不是固定显示 antd 默认的英文 "No data"。 */}
      <Card title="AppConfigProvider renderEmpty demo" style={{ marginTop: 16 }}>
        <List dataSource={[]} renderItem={(item) => <List.Item>{String(item)}</List.Item>} />
      </Card>

      <FormModal
        open={modalOpen}
        title={t('demo:addDevice')}
        size="small"
        onCancel={() => setModalOpen(false)}
        onSubmit={() => setModalOpen(false)}
      >
        <></>
      </FormModal>
    </AppShell>
  );
}
