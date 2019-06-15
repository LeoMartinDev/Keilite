import { AppIpcMain } from './main';
import { Dictionary } from '../../store/processes/types';
import { StoreSettings } from '../defaults';
import Store from 'electron-store';
import { ipcMain } from 'electron';
import { appIpcEvents } from './types';
import log from 'electron-log';
import { EventEmitter } from 'events';

const store = new Store();

declare interface AppIpcMain {
  on(event: 'minimize-to-tray', listener: (value: boolean) => void): this;
  on(event: 'toggle-shortcuts', listener: (value: boolean) => void): this;
}

class AppIpcMain extends EventEmitter {
  private handlers: Dictionary<any> = {};

  constructor(
    private win: Electron.BrowserWindow,
  ) {
    super();
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
    log.info(`${appIpcEvents.TOGGLE_SHORTCUTS}`, payload);
    this.emit('toggle-shortcuts', payload);
  }

  [appIpcEvents.MINIMIZE_TO_TRAY](event: Electron.Event, payload: boolean) {
    log.info(`${appIpcEvents.MINIMIZE_TO_TRAY}`, payload);
    this.emit('minimize-to-tray', payload);
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

export { AppIpcMain };