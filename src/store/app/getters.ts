import { StoreSettings } from '../../shared/defaults';
import { GetterTree } from 'vuex';
import { RootState } from '../types';
import { AppSettings, AppState } from './types';

export const getters: GetterTree<AppState, RootState> = {
  settings: (state: AppState): AppSettings => state.settings,
  shortcutsEnabled: (state: AppState): boolean => state.shortcutsEnabled,
  sharedSettings: (state: AppState): StoreSettings => state.sharedSettings,
};
