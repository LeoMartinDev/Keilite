import { APP_STORAGE_NAME } from './constants';
import { Dictionary } from './../processes/types';
import { AppState, AppSettings, AppStorage } from './types';
import { MutationTree } from 'vuex';
import { APP_PREFIX } from '@/constants';
import Vue from 'vue';
import { UPDATE_SETTINGS, UPDATE_SETTINGS_STORAGE, TOGGLE_SHORTCUTS, UPDATE_SHARED_SETTINGS } from './mutationsTypes';
import { merge } from 'lodash';
import { StoreSettings } from '@/shared/defaults';

export const mutations: MutationTree<AppState> = {
  [UPDATE_SETTINGS](state: AppState, payload: Partial<AppSettings>) {
    try {
      const storage: AppStorage = JSON.parse(localStorage.getItem(APP_STORAGE_NAME) as string);

      merge(state.settings, payload);
      storage.settings = state.settings;
      localStorage.setItem(APP_STORAGE_NAME, JSON.stringify(storage));
    } catch (error) {

    }
  },
  [TOGGLE_SHORTCUTS](state: AppState, payload: boolean) {
    Vue.set(state, 'shortcutsEnabled', payload);
  },
  [UPDATE_SETTINGS_STORAGE](state: AppState, payload: Partial<AppSettings>) {
    try {
      const storage: AppStorage = JSON.parse(localStorage.getItem(APP_STORAGE_NAME) as string);

      merge(storage.settings, payload);
      localStorage.setItem(APP_STORAGE_NAME, JSON.stringify(storage));
    } catch (error) {

    }
  },
  [UPDATE_SHARED_SETTINGS](state: AppState, payload: Partial<StoreSettings>) {
    state.sharedSettings = {
      ...state.sharedSettings,
      ...payload,
    };
  }
};
