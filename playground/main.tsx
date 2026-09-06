import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { AppConfigProvider, initI18n } from '@suharvest/ui-kit';
import App from './App';

initI18n({
  defaultLanguage: 'zh',
  resources: {
    zh: { demo: { appTitle: 'SenseCraft 控制台', devices: '设备列表', deviceName: '设备名称', site: '站点', addDevice: '新增设备' } },
    en: { demo: { appTitle: 'SenseCraft Console', devices: 'Devices', deviceName: 'Device Name', site: 'Site', addDevice: 'Add Device' } },
  },
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppConfigProvider>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </AppConfigProvider>
  </React.StrictMode>,
);
