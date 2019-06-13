import { Module } from 'vuex';
import { actions } from './actions';
import { mutations } from './mutations';
import { RootState } from '../types';
import { state } from './state';
import { getters } from './getters';
import { AppState } from './types';

const namespaced: boolean = true;

export const app: Module<AppState, RootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters,
};
