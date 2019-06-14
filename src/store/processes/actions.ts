import { ADD_PROCESS, UPDATE_PROCESS, REMOVE_PROCESS } from './mutationsTypes';
import { ProcessesState, Process, RawProcess } from './types';
import { RootState } from '../types';
import { ActionTree } from 'vuex';
import { UpdateProcess } from './mutations';

export const actions: ActionTree<ProcessesState, RootState> = {
  addProcess({ getters, dispatch, commit }, payload: RawProcess) {
    const exists = getters.processes[payload.pid];

    if (!exists) {
      commit(ADD_PROCESS, payload);
      dispatch('characters/notifyCharacterConnection', payload, { root: true });
    }
  },
  updateProcess({ commit }, payload: UpdateProcess) {
    commit(UPDATE_PROCESS, payload);
  },
  removeProcess({ getters, dispatch, commit }, payload: RawProcess) {
    const exists = getters.processes[payload.pid];

    if (exists) {
      dispatch('characters/notifyCharacterDisconnection', payload, { root: true });
      commit(REMOVE_PROCESS, payload.pid);
    }
  },
};
