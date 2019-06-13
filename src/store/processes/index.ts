import { Module } from 'vuex';
import { actions } from './actions';
import { mutations } from './mutations';
import { RootState } from '../types';
import { ProcessesState } from './types';
import { state } from './state';
import { getters } from './getters';

const namespaced: boolean = true;

export const processes: Module<ProcessesState, RootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters,
};
