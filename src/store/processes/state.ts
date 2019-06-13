import { ProcessesState } from './types';

const getInitialState = (): ProcessesState => ({
  processes: {},
});

export const state: ProcessesState = getInitialState();
