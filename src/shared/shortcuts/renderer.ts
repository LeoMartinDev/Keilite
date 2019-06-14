import { ipcRenderer } from 'electron';
import { EventEmitter } from 'events';
import { shortcutsEvents } from './types';

declare interface ShortcutsEmitter {
  on(event: 'shortcut', listener: (shortcut: string) => void): this;
  removeListener(event: 'shortcut', listener: () => void): this;
}

class ShortcutsEmitter extends EventEmitter {
  private _shortcuts: string[] = [];
  private _shortcutPressedHandler: any;

  constructor() {
    super();
    this._shortcutPressedHandler = this._onShortcutPressed.bind(this);
    ipcRenderer.on(shortcutsEvents.SHORTCUT_PRESSED, this._shortcutPressedHandler);
  }

  get shortcuts(): string[] {
    return this._shortcuts;
  }

  public registerShortcut(shortcut: string): boolean {
    if (this._shortcuts.indexOf(shortcut) > -1) {
      return false;
    }
    const success = ipcRenderer.sendSync(shortcutsEvents.REGISTER_SHORTCUT, shortcut);

    if (success) {
      this._shortcuts.push(shortcut);
    }
    return success;
  }

  public unregisterShortcut(shortcut: string): boolean {
    const index = this._shortcuts.indexOf(shortcut);

    if (index > -1) {
      const success = ipcRenderer.sendSync(shortcutsEvents.UNREGISTER_SHORTCUT, shortcut);

      if (success) {
        this._shortcuts.splice(index, 1);
      }
      return success;
    }
    return false;
  }

  public unregisterShortcuts() {
    this._shortcuts.forEach((shortcut: string) => {
      const index = this._shortcuts.indexOf(shortcut);

      if (index > -1) {
        const success = ipcRenderer.sendSync(shortcutsEvents.UNREGISTER_SHORTCUT, shortcut);
      }
    });
    this._shortcuts = [];
  }

  public destroy() {
    ipcRenderer.removeListener(shortcutsEvents.SHORTCUT_PRESSED, this._shortcutPressedHandler);
    this._shortcutPressedHandler = null;
    this.unregisterShortcuts();
    this._shortcuts = [];
  }

  private _onShortcutPressed(event: Electron.Event, shortcut: string) {
    console.log('_onShortcutPressed')
    this.emit('shortcut', shortcut);
  }
}

export { ShortcutsEmitter };
