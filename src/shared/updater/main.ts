import { autoUpdater } from 'electron-updater';
import { EventEmitter } from 'events';
import log from 'electron-log';
import { updaterEvents, ProgressInfo, updaterMainEvents } from './types';
import { ipcMain } from 'electron';
import { Dictionary } from 'lodash';

export class UpdaterMain extends EventEmitter {
  private handlers: Dictionary<any> = {};
  private hasFoundUpdate = false;

  constructor() {
    super();
    autoUpdater.logger = log;
    Object.values(updaterMainEvents).forEach((eventName: string) => {
      // @ts-ignore
      this.handlers[eventName] = this[eventName].bind(this);
      ipcMain.on(eventName, this.handlers[eventName]);
    });
  }

  async [updaterEvents.LOOK_FOR_UPDATES](event: Electron.Event) {
    log.info(`${updaterEvents.LOOK_FOR_UPDATES}`);
    try {
      const { updateInfo } = await autoUpdater.checkForUpdates();

      if (updateInfo) {
        this.hasFoundUpdate = true;
      }
      event.sender.send(updaterEvents.LOOK_FOR_UPDATES, {
        success: true,
        data: updateInfo,
      });
    } catch (error) {
      log.error(`${updaterEvents.LOOK_FOR_UPDATES} error:`, error);
      event.sender.send(updaterEvents.LOOK_FOR_UPDATES, {
        success: false,
        error,
      });
    }
  }

  async [updaterEvents.DOWNLOAD_UPDATE](event: Electron.Event) {
    log.info(`${updaterEvents.DOWNLOAD_UPDATE}`);
    try {
      if (!this.hasFoundUpdate) {
        return;
      }
      autoUpdater.on('download-progress', (progressInfo: ProgressInfo) => {
        event.sender.send(updaterEvents.PROGRESS_INFO, progressInfo);
      });
      await autoUpdater.downloadUpdate();
      event.sender.send(updaterEvents.DOWNLOAD_UPDATE, {
        success: true,
      });
    } catch (error) {
      log.error(`${updaterEvents.DOWNLOAD_UPDATE} error:`, error);
      event.sender.send(updaterEvents.DOWNLOAD_UPDATE, {
        success: false,
        error,
      });
    }
  }

  async [updaterEvents.QUIT_AND_INSTALL](event: Electron.Event) {
    log.info(`${updaterEvents.QUIT_AND_INSTALL}`);
    autoUpdater.quitAndInstall(true, true);
  }
}