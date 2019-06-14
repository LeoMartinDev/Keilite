import { Dictionary } from 'vue-router/types/router';
import { globalShortcut, ipcMain } from 'electron';
import log from 'electron-log';
import { shortcutsEvents, mainShortcutsEvents } from './types';

export class ShortcutsMain {
  private handlers: Dictionary<any> = {};

  constructor() {
    this.registerShortcuts();
  }

  private registerShortcuts() {
    Object.values(mainShortcutsEvents).forEach((eventName: string) => {
      // @ts-ignore
      this.handlers[eventName] = this[eventName].bind(this);
      ipcMain.on(eventName, this.handlers[eventName]);
    });
  }

  [shortcutsEvents.REGISTER_SHORTCUT](event: Electron.Event, shortcut: string) {
    try {
      log.info(`${shortcutsEvents.REGISTER_SHORTCUT} "${shortcut}" called`);
      const sender = event.sender;

      if (!globalShortcut.isRegistered(shortcut)) {
        const success = globalShortcut.register(shortcut, () => {
          log.info(`Shortcut "${shortcut}" pressed`);
          sender.send(shortcutsEvents.SHORTCUT_PRESSED, shortcut);
        });
        log.info(`${shortcutsEvents.REGISTER_SHORTCUT} "${shortcut}" ${success ? 'success' : 'fail'} !`);
        return event.returnValue = success;
      }
    } catch (error) {
      log.error(`${shortcutsEvents.REGISTER_SHORTCUT} error !`, error);
    }
    return event.returnValue = false;
  }

  [shortcutsEvents.UNREGISTER_SHORTCUT](event: Electron.Event, shortcut: string) {
    try {
      log.info(`${shortcutsEvents.UNREGISTER_SHORTCUT} "${shortcut}" called`);
      globalShortcut.unregister(shortcut);

      return event.returnValue = true;
    } catch (error) {
      log.error(`${shortcutsEvents.UNREGISTER_SHORTCUT} error !`, error);
    }
    return event.returnValue = false;
  }

  public destroy() {
    Object.values(mainShortcutsEvents).forEach((eventName: string) => {
      ipcMain.removeListener(eventName, this.handlers[eventName]);
      this.handlers[eventName] = null;
    });
    globalShortcut.unregisterAll();
  }
}