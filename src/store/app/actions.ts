import { shortcutsEmitter } from '../../services/shortcuts-emitter';
import { StoreSettings } from '../../shared/defaults';
import {
  UPDATE_SETTINGS,
  TOGGLE_SHORTCUTS,
  UPDATE_SHARED_SETTINGS
} from './mutationsTypes';
import { RootState } from '../types';
import { ActionTree } from 'vuex';
import { AppState, AppSettings, SHORTCUTS_SEPARATOR } from './types';
import { appIpcEmitter } from '@/services/app-ipc-emitter';
import log from 'electron-log';

export const actions: ActionTree<AppState, RootState> = {
  updateSettings({ commit }, payload: Partial<AppSettings>) {
    commit(UPDATE_SETTINGS, payload);
  },
  updateSharedSettings({ commit }, payload: Partial<StoreSettings>) {
    appIpcEmitter.updateSharedSettings(payload);
    commit(UPDATE_SHARED_SETTINGS, payload);
  },
  updateShortcut({ dispatch, getters }, { name, value }: { name: string, value: string[] }): boolean {
    if (!Object.keys(getters.settings.shortcuts).includes(name)) { return false; }
    const success = shortcutsEmitter.unregisterShortcut(getters.settings.shortcuts[name]
      .join(SHORTCUTS_SEPARATOR));

    if (success) {
      dispatch('updateSettings', { shortcuts: { [name]: value } });
    }
    return success;
  },
  toggleShortcuts({ commit, getters }, value: boolean) {
    if (value) {
      try {
        (Object.values(getters.settings.shortcuts) as string[][]).forEach((shortcut: string[]) =>
          shortcutsEmitter.registerShortcut(shortcut.join(SHORTCUTS_SEPARATOR)));
      } catch (error) {
        log.error('app/toggleShortcuts error :', error);
      }
    } else {
      try {
        (Object.values(getters.settings.shortcuts) as string[][]).forEach((shortcut: string[]) =>
          shortcutsEmitter.unregisterShortcut(shortcut.join(SHORTCUTS_SEPARATOR)));
      } catch (error) {
        log.error('app/toggleShortcuts error :', error);
      }
    }
    appIpcEmitter.toggleShortcuts(value);
    commit(TOGGLE_SHORTCUTS, value);
  },
};
