import { TOGGLE_SHORTCUTS } from '../../store/app/mutationsTypes';
import { APP_PREFIX } from '../../constants';
import { Dictionary } from '../../store/processes/types';
import { StoreSettings } from '../defaults';
import Store from 'electron-store';
import { ipcMain, EventEmitter } from 'electron';

const store = new Store();

// TODO tout refactor en classe

export const AppIpcEvents = {
  UPDATE_SHARED_SETTINGS: `${APP_PREFIX}-update-shared-settings`,
  TOGGLE_SHORTCUTS: '${APP_PREFIX}-toggle-shortcuts',
};

const getControllers = (win: Electron.BrowserWindow, tray: Electron.Tray, menu: Electron.Menu): Dictionary<any> => ({
  [AppIpcEvents.UPDATE_SHARED_SETTINGS](event: Electron.Event, payload: Partial<StoreSettings>) {
    const storedSettings: StoreSettings = store.get('settings') as StoreSettings;

    store.set('settings', {
      ...storedSettings,
      ...payload,
    });
  },
  [AppIpcEvents.TOGGLE_SHORTCUTS](event: Electron.Event, payload: boolean) {
    const item = menu.items.find((item: any) => item.id === 'enableShortcutsOnStart');

    if (item) {
      item.checked = payload;
      tray.setContextMenu(menu);
    }
  }
});

const handlesMap: Dictionary<any> = {};

export function load(win: Electron.BrowserWindow, tray: Electron.Tray, menu: Electron.Menu) {
  const controllers = getControllers(win, tray, menu);

  Object.keys(controllers).forEach((event: string) => {
    handlesMap[event] = controllers[event];
    ipcMain.on(event, handlesMap[event]);
  })
}

export function unload() {
  Object.values(AppIpcEvents).forEach((event: string) => ipcMain.removeListener(event, handlesMap[event]));
}

export function toggleShortcuts(win: Electron.BrowserWindow, value: boolean) {
    win.webContents.send(AppIpcEvents.UPDATE_SHARED_SETTINGS, value);
}