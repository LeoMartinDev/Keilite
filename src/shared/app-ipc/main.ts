import { Dictionary } from '../../store/processes/types';
import { StoreSettings } from '../defaults';
import Store from 'electron-store';
import { ipcMain } from 'electron';
import { appIpcEvents } from './types';

const store = new Store();

export class AppIpcMain {
  private handlers: Dictionary<any> = {};

  constructor(
    private win: Electron.BrowserWindow,
    private tray: Electron.Tray,
    private menu: Electron.Menu,
  ) {
    Object.values(appIpcEvents).forEach((eventName: string) => {
      this.handlers[eventName] = this[eventName].bind(this);
      ipcMain.on(eventName, this.handlers[eventName]);
    })
  }

  [appIpcEvents.UPDATE_SHARED_SETTINGS](event: Electron.Event, payload: Partial<StoreSettings>) {
    const storedSettings: StoreSettings = store.get('settings') as StoreSettings;

    store.set('settings', {
      ...storedSettings,
      ...payload,
    });
  }

  [appIpcEvents.TOGGLE_SHORTCUTS](event: Electron.Event, payload: boolean) {
    const item = this.menu.items.find((item: any) => item.id === 'enableShortcutsOnStart');

    if (item) {
      item.checked = payload;
      this.tray.setContextMenu(this.menu);
    }
  }

  toggleShortcuts(win: Electron.BrowserWindow, value: boolean) {
    win.webContents.send(appIpcEvents.UPDATE_SHARED_SETTINGS, value);
  }

  destroy() {
    Object.values(appIpcEvents).forEach((eventName: string) => {
      ipcMain.removeListener(eventName, this.handlers[eventName]);
      this.handlers[eventName] = null;
    });
  }
}