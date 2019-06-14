import { Dictionary } from '../../store/processes/types';
import { StoreSettings } from '../defaults';
import Store from 'electron-store';
import { ipcMain } from 'electron';
import { appIpcEvents } from './types';
import log from 'electron-log';

const store = new Store();

export class AppIpcMain {
  private handlers: Dictionary<any> = {};

  constructor(
    private win: Electron.BrowserWindow,
    private tray: Electron.Tray,
    private menu: Electron.Menu,
  ) {
    Object.values(appIpcEvents).forEach((eventName: string) => {
      // @ts-ignore
      this.handlers[eventName] = this[eventName].bind(this);
      ipcMain.on(eventName, this.handlers[eventName]);
    })
  }

  [appIpcEvents.UPDATE_SHARED_SETTINGS](event: Electron.Event, payload: Partial<StoreSettings>) {
    log.info(`${appIpcEvents.UPDATE_SHARED_SETTINGS}`, payload);
    const storedSettings: StoreSettings = store.get('settings') as StoreSettings;

    store.set('settings', {
      ...storedSettings,
      ...payload,
    });
  }

  [appIpcEvents.TOGGLE_SHORTCUTS](event: Electron.Event, payload: boolean) {
    log.info(`${appIpcEvents.UPDATE_SHARED_SETTINGS}`, payload);
    const item = this.menu.items.find((item: any) => item.id === 'shortcutsEnabled');

    if (item) {
      item.checked = payload;
      this.tray.setContextMenu(this.menu);
    }
  }

  toggleShortcuts(value: boolean) {
    this.win.webContents.send(appIpcEvents.TOGGLE_SHORTCUTS, value);
  }

  destroy() {
    Object.values(appIpcEvents).forEach((eventName: string) => {
      ipcMain.removeListener(eventName, this.handlers[eventName]);
      this.handlers[eventName] = null;
    });
  }
}