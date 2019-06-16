import { ProgressInfo } from '@/shared/updater/types';
import { EventEmitter } from 'events';
import { ipcRenderer } from 'electron';
import { updaterEvents, LookForUpdatesPayload, AppIpcEventPayload } from './types';
import { timeoutPromise } from '../helpers';
import { UpdateInfo } from 'electron-updater';

declare interface UpdaterRenderer {
  on(event: 'download-progress', listener: (progressInfo: ProgressInfo) => void): this;
}

class UpdaterRenderer extends EventEmitter {

  constructor() {
    super();
  }

  lookForUpdates(): Promise<UpdateInfo> {
    const onLookForUpdatePromise = new Promise((resolve, reject) => {
      ipcRenderer.on(updaterEvents.LOOK_FOR_UPDATES, (event: Electron.Event, payload: LookForUpdatesPayload) => {
        if (!payload.success) {
          return reject(payload.error);
        } else {
          return resolve(payload.data);
        }
      });
      ipcRenderer.send(updaterEvents.LOOK_FOR_UPDATES);
    });
    return timeoutPromise(onLookForUpdatePromise, 30 * 1000);
  }

  downloadUpdate(): Promise<void> {
    const onProgressInfoHandler = (event: Electron.Event, progressInfo: ProgressInfo) => {
      this.emit('download-progress', progressInfo);
    };
    const onDownloadUpdatePromise: Promise<void> = new Promise((resolve, reject) => {
      ipcRenderer.on(updaterEvents.DOWNLOAD_UPDATE, (event: Electron.Event, payload: AppIpcEventPayload) => {
        ipcRenderer.removeListener(updaterEvents.PROGRESS_INFO, onProgressInfoHandler);
        if (!payload.success) {
          return reject(payload.error);
        } else {
          return resolve();
        }
      });
      ipcRenderer.send(updaterEvents.DOWNLOAD_UPDATE);
    });

    ipcRenderer.on(updaterEvents.PROGRESS_INFO, onProgressInfoHandler);
    return onDownloadUpdatePromise;
  }

  quitAndInstall() {
    ipcRenderer.send(updaterEvents.QUIT_AND_INSTALL);
  }
}

export { UpdaterRenderer };