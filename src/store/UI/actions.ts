import { TOGGLE_NAVIGATION_DRAWER, TOGGLE_ABOUT_DIALOG } from './mutationsTypes';
import { ActionTree } from 'vuex';
import { RootState } from '../types';
import { UIState } from './types';

export const actions: ActionTree<UIState, RootState> = {
  toggleNavigationDrawer({ commit }, value?: boolean) {
    commit(TOGGLE_NAVIGATION_DRAWER, value);
  },
  toggleAboutDialog({ commit }, value?: boolean) {
    commit(TOGGLE_ABOUT_DIALOG, value);
  },
};
