import { TOGGLE_NAVIGATION_DRAWER } from './mutationsTypes';
import { ActionTree } from 'vuex';
import { RootState } from '../types';
import { UIState } from './types';

export const actions: ActionTree<UIState, RootState> = {
  toggleNavigationDrawer({ commit }, value?: boolean) {
    commit(TOGGLE_NAVIGATION_DRAWER, value);
  },
};
