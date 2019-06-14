import { AppState, AppStorage } from './types';
import { APP_STORAGE_NAME } from './constants';
import Vue from 'vue';
import { omit } from 'lodash';
import ElectronStore from 'electron-store';
import { StoreSettings } from '@/shared/defaults';

const electronStore = new ElectronStore();

function stateToStorage(state: AppState): AppStorage {
  return {
    settings: state.settings
  };
}

function stateFromStorage(storage: AppStorage): Partial<AppState> {
  return {
    settings: storage.settings,
  };
}

function handleSettings(state: AppState): AppState {
  if (state.sharedSettings.enableShortcutsOnStart) {
    state.shortcutsEnabled = state.sharedSettings.enableShortcutsOnStart;
  }
  return state;
}

const getInitialState = (): AppState => {
  let initialState: AppState = {
    settings: {
      shortcuts: {
        focusNextCharacter: ['Control', 's'],
        focusPreviousCharacter: ['Control', 'q'],
      },
    },
    sharedSettings: {
      enableShortcutsOnStart: false,
    },
    shortcutsEnabled: false,
  };
  try {
    const currentStorageValue = localStorage.getItem(APP_STORAGE_NAME);

    if (!currentStorageValue) {
      localStorage.setItem(APP_STORAGE_NAME, JSON.stringify(stateToStorage(initialState)));
      Vue.$log.info(`Initialized ${APP_STORAGE_NAME} storage succesfully!`);
    } else {
      const value: AppStorage = JSON.parse(currentStorageValue);

      initialState = {
        ...initialState,
        ...stateFromStorage(value)
      };
    }
    const electronStoreSettings: StoreSettings = electronStore.get('settings') as StoreSettings;
    console.log('electronStoresettings :: ', electronStoreSettings);
    if (electronStoreSettings) {
      initialState = {
        ...initialState,
        ...electronStoreSettings,
      };
    }
    initialState = handleSettings(initialState);
  } catch (error) {
    Vue.$log.error(`Failed to initialize ${APP_STORAGE_NAME}!`, error);
  }
  return initialState;
};

export const state: AppState = getInitialState();
