import { StoreSettings } from '../../shared/defaults';
import { UPDATE_SETTINGS, UPDATE_SETTINGS_STORAGE, TOGGLE_SHORTCUTS, UPDATE_SHARED_SETTINGS } from './mutationsTypes';
import { RootState } from '../types';
import { ActionTree } from 'vuex';
import { AppState, AppSettings, SHORTCUTS_SEPARATOR } from './types';
import { ShortcutsEmitterSingleton } from '@/services/shortcuts-emitter-singleton';

export const actions: ActionTree<AppState, RootState> = {
  updateSettings({ commit }, payload: Partial<AppSettings>) {
    commit(UPDATE_SETTINGS, payload);
  },
  updateSharedSettings({ commit }, payload: Partial<StoreSettings>) {
    // TODO notify main process
    commit(UPDATE_SHARED_SETTINGS, payload);
  },
  updateShortcut({ dispatch, getters }, { name, value }: { name: string, value: string[] }) {
    if (!Object.keys(getters.settings.shortcuts).includes(name)) { return; }
    const success = ShortcutsEmitterSingleton.instance.unregisterShortcut(getters.settings.shortcuts[name].join(SHORTCUTS_SEPARATOR));
    
    if (success) {
      dispatch('updateSettings', { shortcuts: { [name]: value } });
    }
    return success;
  },
  toggleShortcuts({ commit, getters }, value: boolean) {
    if (value) {
      try {
        (Object.values(getters.settings.shortcuts) as string[][]).forEach((shortcut: string[]) =>
          ShortcutsEmitterSingleton.instance.registerShortcut(shortcut.join(SHORTCUTS_SEPARATOR)));
      } catch (error) { }
    } else {
      try {
        (Object.values(getters.settings.shortcuts) as string[][]).forEach((shortcut: string[]) =>
          ShortcutsEmitterSingleton.instance.unregisterShortcut(shortcut.join(SHORTCUTS_SEPARATOR)));
      } catch (error) { }
    }
    commit(TOGGLE_SHORTCUTS, value);
  },
};
