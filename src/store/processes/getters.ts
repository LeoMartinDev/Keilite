import { ProcessesState, Process, ProcessState, ConnectedProcess, DisconnectedProcess } from './types';
import { RootState } from '../types';
import { Dictionary } from 'vue-router/types/router';
import { GetterTree } from 'vuex';

export const getters: GetterTree<ProcessesState, RootState> = {
  processes: (state: ProcessesState): Dictionary<Process> => state.processes,
  processesArray: (state: ProcessesState, getters): Process[] => Object.values(getters.processes),
};
