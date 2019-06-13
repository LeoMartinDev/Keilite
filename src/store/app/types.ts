import { TOGGLE_SHORTCUTS } from './mutationsTypes';
import { Dictionary } from 'vue-router/types/router';
import { StoreSettings } from '@/shared/defaults';

export enum EAppShortcuts {
  FOCUS_NEXT_CHARACTER = 'focusNextCharacter',
  FOCUS_PREVIOUS_CHARACTER = 'focusPreviousCharacter',
};

export interface AppShortcuts {
  [EAppShortcuts.FOCUS_NEXT_CHARACTER]: string[];
  [EAppShortcuts.FOCUS_PREVIOUS_CHARACTER]: string[];
}

export interface AppSettings {
  shortcuts: AppShortcuts;
}

export interface AppState {
  settings: AppSettings;
  sharedSettings: StoreSettings;
  shortcutsEnabled: boolean;
}

export interface AppSettingsStorage {
  shortcuts: AppShortcuts;
}

export interface AppStorage {
  settings: AppSettingsStorage;
}

export const CAN_BE_DISABLED_SHORTCUTS = [
  EAppShortcuts.FOCUS_NEXT_CHARACTER,
  EAppShortcuts.FOCUS_PREVIOUS_CHARACTER,
];

export const SHORTCUTS_SEPARATOR = '+';