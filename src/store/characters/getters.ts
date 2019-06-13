import { Dictionary } from './../processes/types';
import { CharactersState, Character, CharacterStatus } from './types';
import { GetterTree } from 'vuex';
import { RootState } from '../types';
import { get } from 'lodash';

export const getters: GetterTree<CharactersState, RootState> = {
  focusedCharacterIndex: (state: CharactersState): number => state.focusedCharacterIndex,
  characters: (state: CharactersState): Dictionary<Character> => state.characters,
  charactersList: (state: CharactersState): string[] => state.charactersList,
  focusableCharactersList: (state: CharactersState, getters): Character[] =>
    getters.charactersList.filter((characterName: string) => get(getters.characters[characterName], 'isFocusable', false)),
  mappedCharactersList(state: CharactersState, getters): Character[] {
    return getters.charactersList.map(
      (name: string) => state.characters[name]
    );
  },
  connectedCharacters: (state: CharactersState, getters): Character[] =>
    (Object.values(getters.characters) as Character[]).filter((character: Character) => character.status === CharacterStatus.CONNECTED),
  disconnectedCharacters: (state: CharactersState, getters): Character[] =>
    (Object.values(getters.characters) as Character[]).filter((character: Character) => character.status === CharacterStatus.DISCONNECTED),
};
