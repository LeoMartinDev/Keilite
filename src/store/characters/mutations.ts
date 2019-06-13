import { Dictionary } from './../processes/types';
import { ADD_CHARACTER, UPDATE_CHARACTER, REMOVE_CHARACTER, UPDATE_CHARACTERS_LIST, ADD_CHARACTER_TO_LIST, INSERT_CHARACTER_IN_LIST, UPDATE_FOCUSED_CHARACTER_INDEX, REMOVE_CHARACTER_FROM_LIST } from './mutationsTypes';
import { CharactersState, Character, CharactersStorage, CharacterStorageEntry } from './types';
import { MutationTree } from 'vuex';
import Vue from 'vue';
import { CHARACTERS_STORAGE_NAME } from './constants';
import { omit } from 'lodash';

function getCharacterStorageEntry(character: any) {
  return omit(character, ['status', 'pid']);
}

export const mutations: MutationTree<CharactersState> = {
  [ADD_CHARACTER](state, character: Character) {
    try {
      const storage: CharactersStorage = JSON.parse(localStorage.getItem(CHARACTERS_STORAGE_NAME) as string) || [];

      storage.characters[character.name] = getCharacterStorageEntry(character);
      localStorage.setItem(CHARACTERS_STORAGE_NAME, JSON.stringify(storage));
      Vue.set(state.characters, character.name, character);
    } catch (error) {

    }
  },
  [UPDATE_CHARACTER](state, { name, payload }: { name: string, payload: Partial<Character> }) {
    try {
      const storage: CharactersStorage = JSON.parse(localStorage.getItem(CHARACTERS_STORAGE_NAME) as string);

      storage.characters[name] = {
        ...storage.characters[name],
        ...getCharacterStorageEntry(payload),
      };
      localStorage.setItem(CHARACTERS_STORAGE_NAME, JSON.stringify(storage));
      Vue.set(state.characters, name, {
        ...state.characters[name],
        ...payload,
      });
    } catch (error) {

    }
  },
  [REMOVE_CHARACTER](state, name: string) {
    try {
      const storage: CharactersStorage = JSON.parse(localStorage.getItem(CHARACTERS_STORAGE_NAME) as string);

      delete storage.characters[name];
      localStorage.setItem(CHARACTERS_STORAGE_NAME, JSON.stringify(storage));
      Vue.delete(state.characters, name);
    } catch (error) {

    }
  },
  [UPDATE_CHARACTERS_LIST](state, names: string[]) {
    state.charactersList = names;
  },
  [ADD_CHARACTER_TO_LIST](state, name: string) {
    if (!state.charactersList.find((c: string) => c === name)) {
      state.charactersList.push(name);
    }
  },
  [INSERT_CHARACTER_IN_LIST](state, { index, name }: { index: number, name: string }) {
    if (!state.charactersList.find((c: string) => c === name)) {
      state.charactersList.splice(index, 0, name);
    }
  },
  [REMOVE_CHARACTER_FROM_LIST](state, name: string) {
    const index = state.charactersList.findIndex((c: string) => c === name);
    if (index > -1) {
      state.charactersList.splice(index, 1);
    }
  },
  [UPDATE_FOCUSED_CHARACTER_INDEX](state, index: number) {
    if (index > -1 && index < state.charactersList.length) {
      state.focusedCharacterIndex = index;
    }
  },
};
