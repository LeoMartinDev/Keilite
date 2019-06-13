import { merge } from 'lodash';
import { CHARACTERS_STORAGE_NAME } from './constants';
import { CharactersState, CharactersStorage } from './types';
import Vue from 'vue';

const getInitialState = (): CharactersState => {
  let initialState: CharactersState = {
    characters: {},
    charactersList: [],
    focusedCharacterIndex: 0,
  };
  let initialStorage: CharactersStorage = {
    characters: {},
  };

  try {
    const currentStorageValue: string = localStorage.getItem(CHARACTERS_STORAGE_NAME) as string;

    if (!currentStorageValue) {
      localStorage.setItem(CHARACTERS_STORAGE_NAME, JSON.stringify(initialStorage));
      Vue.$log.info(`Initialized ${CHARACTERS_STORAGE_NAME} storage succesfully!`);
    } else {
      const value: CharactersState = merge(initialState, JSON.parse(currentStorageValue));

      initialState = value;
    }
  } catch (error) {
    Vue.$log.error(`Failed to initialize ${CHARACTERS_STORAGE_NAME}!`, error);
  }
  return initialState;
};

export const state: CharactersState = getInitialState();
