import { APP_PREFIX } from '../../constants';

export const appIpcEvents = {
  UPDATE_SHARED_SETTINGS: `${APP_PREFIX}-update-shared-settings`,
  TOGGLE_SHORTCUTS: `${APP_PREFIX}-toggle-shortcuts`,
  MINIMIZE_TO_TRAY: `${APP_PREFIX}-minimize-to-tray`,
};
