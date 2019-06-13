import { Module } from 'vuex';
import { actions } from './actions';
import { mutations } from './mutations';
import { RootState } from '../types';
import { UIState } from './types';
import { state } from './state';
import { getters } from './getters';

const namespaced: boolean = true;

export const UI: Module<UIState, RootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters,
};
