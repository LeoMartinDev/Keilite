import { Dictionary } from 'vue-router/types/router';

export enum CharacterStatus {
  DISCONNECTED,
  CONNECTED,
}

export enum CharacterGender {
  MALE = 'male',
  FEMALE = 'female',
}

export interface Character {
  name: string;
  status: CharacterStatus;
  pid?: number;
  className?: string;
  gender?: CharacterGender;
  initiative?: number;
  isFocusable: boolean;
}

export type CharacterStorageEntry = Pick<Character, Exclude<keyof Character, 'pid' | 'status'>>

export interface CharactersState {
  characters: Dictionary<Character>;
  charactersList: string[];
  focusedCharacterIndex: number;
}

export interface CharactersStorage {
  characters: Dictionary<CharacterStorageEntry>;
}
