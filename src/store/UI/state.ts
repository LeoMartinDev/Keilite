import { UIState } from './types';

const getInitialState = (): UIState => ({
  navigationDrawer: false,
  aboutDialog: false,
});

export const state: UIState = getInitialState();
