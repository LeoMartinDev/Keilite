import { UIState } from './types';

const getInitialState = (): UIState => ({
  navigationDrawer: false,
});

export const state: UIState = getInitialState();
