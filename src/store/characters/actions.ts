import { Process, RawProcess } from './../processes/types';
import { ADD_CHARACTER, REMOVE_CHARACTER, UPDATE_CHARACTER, ADD_CHARACTER_TO_LIST, UPDATE_CHARACTERS_LIST, UPDATE_FOCUSED_CHARACTER_INDEX, REMOVE_CHARACTER_FROM_LIST } from './mutationsTypes';
import { CharactersState, Character, CharacterStatus } from './types';
import { RootState } from '../types';
import { ActionTree } from 'vuex';
import { windowTitleToCharacterName } from './helpers';
import { setProcessToForeground } from 'native-process';
import log from 'electron-log';

export const actions: ActionTree<CharactersState, RootState> = {
  async focusNextCharacter({ getters, dispatch }) {
    log.debug('focusNextCharacter called');
    let nextCharacterIndex = 0;

    if (getters.focusableCharactersList.length > 1) {
      if (getters.focusedCharacterIndex === getters.focusableCharactersList.length - 1) {
        nextCharacterIndex = 0;
      } else {
        nextCharacterIndex = getters.focusedCharacterIndex + 1;
      }
    } else if (getters.focusableCharactersList.length === 1) {
      nextCharacterIndex = 0;
    } else {
      return;
    }
    dispatch('focusCharacter', nextCharacterIndex);
  },
  async focusPreviousCharacter({ getters, dispatch }) {
    log.debug('focusPreviousCharacter called');
    let previousCharacterIndex = 0;

    if (getters.focusableCharactersList.length > 1) {
      if (getters.focusedCharacterIndex === 0) {
        previousCharacterIndex = getters.focusableCharactersList.length - 1;
      } else {
        previousCharacterIndex = getters.focusedCharacterIndex - 1;
      }
    } else if (getters.focusableCharactersList.length === 1) {
      previousCharacterIndex = 0;
    } else {
      return;
    }
    dispatch('focusCharacter', previousCharacterIndex);
  },
  async focusCharacter({ getters, commit }, index: number) {
    const characterName: string = getters.focusableCharactersList[index];
    const character: Character = getters.characters[characterName];

    if (character && character.pid) {
      try {
        await setProcessToForeground(character.pid);

        commit(UPDATE_FOCUSED_CHARACTER_INDEX, index);
      } catch (error) { 
        log.error('characters/focusCharacter error :', error);
      }
    }
  },
  addCharacter({ dispatch, commit }, character: Character) {
    commit(ADD_CHARACTER, character);
  },
  removeCharacter({ commit }, name: string) {
    commit(REMOVE_CHARACTER, name);
  },
  updateCharacter({ commit }, payload: { name: string, payload: Partial<Character> }) {
    commit(UPDATE_CHARACTER, payload);
  },
  addCharacterToList({ commit }, name: string) {
    commit(ADD_CHARACTER_TO_LIST, name);
  },
  updateCharactersList({ commit }, names: string[]) {
    commit(UPDATE_CHARACTERS_LIST, names);
  },
  removeCharacterFromList({ commit }, name: string) {
    commit(REMOVE_CHARACTER_FROM_LIST, name);
  },
  notifyCharacterDisconnection({ dispatch, getters }, payload: RawProcess) {
    const character: Character | undefined = (Object.values(getters.characters) as Character[]).find((c: Character) => c.pid === payload.pid);

    if (!character) { return; }
    dispatch('updateCharacter', {
      name: character.name,
      payload:
        { status: CharacterStatus.DISCONNECTED, pid: null },
    });
    dispatch('removeCharacterFromList', character.name);
  },
  notifyCharacterConnection({ dispatch, getters }, payload: RawProcess) {
    const characterName = windowTitleToCharacterName(payload.windowTitle);
    const exists = getters.characters[characterName];

    if (exists) {
      dispatch('updateCharacter', {
        name: characterName,
        payload: {
          pid: payload.pid,
          status: CharacterStatus.CONNECTED,
          isFocusable: true,
        },
      });
    } else {
      dispatch('addCharacter', {
        name: characterName,
        pid: payload.pid,
        status: CharacterStatus.CONNECTED,
        order: null,
        className: null,
        isFocusable: true,
      });
    }
    dispatch('addCharacterToList', characterName);
  },
};
