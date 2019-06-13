import { Module } from 'vuex';
import { actions } from './actions';
import { mutations } from './mutations';
import { RootState } from '../types';
import { CharactersState } from './types';
import { state } from './state';
import { getters } from './getters';

const namespaced: boolean = true;

export const characters: Module<CharactersState, RootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters,
};
