import { TOGGLE_NAVIGATION_DRAWER, TOGGLE_ABOUT_DIALOG } from './mutationsTypes';
import { MutationTree } from 'vuex';
import { UIState } from './types';

export const mutations: MutationTree<UIState> = {
  [TOGGLE_NAVIGATION_DRAWER](state: UIState, value?: boolean) {
    state.navigationDrawer = value || !state.navigationDrawer;
  },
  [TOGGLE_ABOUT_DIALOG](state: UIState, value?: boolean) {
    state.aboutDialog = value || !state.aboutDialog;
  },
};
