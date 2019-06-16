import { UpdateInfo } from 'electron-updater';
import { APP_PREFIX } from '../../constants';

export interface ProgressInfo {
  total: number;
  delta: number;
  transferred: number;
  percent: number;
  bytesPerSecond: number;
}

export const UPDATER_PREFIX = `${APP_PREFIX}-updater`;

export const updaterEvents = {
  LOOK_FOR_UPDATES: `${UPDATER_PREFIX}-look-for-updates`,
  DOWNLOAD_UPDATE: `${UPDATER_PREFIX}-download-update`,
  PROGRESS_INFO: `${UPDATER_PREFIX}-progress-info`,
  QUIT_AND_INSTALL: `${UPDATER_PREFIX}-quit-and-install`,
};

export const updaterMainEvents = {
  LOOK_FOR_UPDATES: `${UPDATER_PREFIX}-look-for-updates`,
  DOWNLOAD_UPDATE: `${UPDATER_PREFIX}-download-update`,
  QUIT_AND_INSTALL: `${UPDATER_PREFIX}-quit-and-install`,
};

export interface AppIpcEventPayload {
  success: boolean;
  error?: any;
}

export interface LookForUpdatesPayload extends AppIpcEventPayload {
  data?: UpdateInfo;
}