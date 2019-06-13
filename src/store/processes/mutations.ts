import { ADD_PROCESS, REMOVE_PROCESS, UPDATE_PROCESS } from './mutationsTypes';
import { ProcessesState, Process } from './types';
import Vue from 'vue';
import { MutationTree } from 'vuex';

export interface UpdateProcess {
  processId: number;
  data: Partial<Process>;
}

export const mutations: MutationTree<ProcessesState> = {
  [ADD_PROCESS](state: ProcessesState, process: Process) {
    Vue.set(state.processes, process.pid, process);
  },
  [REMOVE_PROCESS](state: ProcessesState, processId: number) {
    Vue.delete(state.processes, processId);
  },
  [UPDATE_PROCESS](state: ProcessesState, { processId, data }: UpdateProcess) {
    Vue.set(state.processes, processId, process);
  },
};
