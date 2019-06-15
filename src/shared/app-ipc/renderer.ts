import { StoreSettings } from '../defaults';
import { ipcRenderer } from 'electron';
import { appIpcEvents } from './types';
import { EventEmitter } from 'events';

declare interface AppIpcRenderer {
  on(event: 'toggle-shortcuts', listener: (value: boolean) => void): this;
}
class AppIpcRenderer extends EventEmitter {
  private toggleShortcutsHandler: any;

  constructor() {
    super();
    this.toggleShortcutsHandler = this.onToggleShortcuts.bind(this),
    ipcRenderer.on(appIpcEvents.TOGGLE_SHORTCUTS, this.toggleShortcutsHandler);
  }

  private onToggleShortcuts(event: Electron.Event, value: boolean) {
    this.emit('toggle-shortcuts', value);
  }

  public toggleShortcuts(value: boolean) {
    ipcRenderer.send(appIpcEvents.TOGGLE_SHORTCUTS, value);
  }

  public minimizeToTray(value: boolean) {
    ipcRenderer.send(appIpcEvents.MINIMIZE_TO_TRAY, value);    
  }

  public updateSharedSettings(value: Partial<StoreSettings>) {
    ipcRenderer.send(appIpcEvents.UPDATE_SHARED_SETTINGS, value);
  }

  public destroy() {
    ipcRenderer.removeListener(appIpcEvents.TOGGLE_SHORTCUTS, this.toggleShortcutsHandler);
    this.toggleShortcutsHandler = null;
  }
}

export { AppIpcRenderer };