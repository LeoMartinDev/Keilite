import { StoreSettings } from '../defaults';
import { AppIpcEvents } from './main';
import { EventEmitter, ipcRenderer } from 'electron';

export class AppIpcRenderer extends EventEmitter {
  private toggleShortcutsHandler: any;

  constructor() {
    super();
    this.toggleShortcutsHandler = this.onToggleShortcuts.bind(this),
    ipcRenderer.on(AppIpcEvents.TOGGLE_SHORTCUTS, this.toggleShortcutsHandler);
  }

  private onToggleShortcuts(event: Electron.Event, value: boolean) {
    this.emit('toggle-shortcuts', value);
  }

  public toggleShortcuts(value: boolean) {
    ipcRenderer.send(AppIpcEvents.TOGGLE_SHORTCUTS, value);
  }

  public updateSharedSettings(value: Partial<StoreSettings>) {
    ipcRenderer.send(AppIpcEvents.UPDATE_SHARED_SETTINGS, value);
  }

  public destroy() {
    ipcRenderer.removeListener(AppIpcEvents.TOGGLE_SHORTCUTS, this.toggleShortcutsHandler);
    this.toggleShortcutsHandler = null;
  }
}