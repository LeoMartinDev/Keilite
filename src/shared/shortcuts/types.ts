import { APP_PREFIX } from '../../constants';

export const SHORTCUTS_PREFIX = `${APP_PREFIX}-shortcuts`;

export const shortcutsEvents = {
  REGISTER_SHORTCUT: `${SHORTCUTS_PREFIX}-register`,
  UNREGISTER_SHORTCUT: `${SHORTCUTS_PREFIX}-unregister`,
  SHORTCUT_PRESSED: `${SHORTCUTS_PREFIX}-pressed`,
}

export const mainShortcutsEvents = [
  shortcutsEvents.REGISTER_SHORTCUT,
  shortcutsEvents.UNREGISTER_SHORTCUT,
];