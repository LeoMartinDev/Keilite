export interface StoreSettings {
  enableShortcutsOnStart: boolean;
  minimizeToTray: boolean;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  enableShortcutsOnStart: true,
  minimizeToTray: true,
};