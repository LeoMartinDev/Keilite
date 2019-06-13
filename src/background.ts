import { AppIpcMain } from './shared/app-ipc/main';
import { app, protocol, BrowserWindow, Tray, Menu, MenuItem } from 'electron';
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';
import {ShortcutsMain} from './shared/shortcuts/main';
import './shared/logger';
import log from 'electron-log';
import windowStateKeeper from 'electron-window-state';
import { join } from 'path';
import Store from 'electron-store';
import { DEFAULT_STORE_SETTINGS, StoreSettings } from './shared/defaults';

const store = new Store();
const isDevelopment = process.env.NODE_ENV !== 'production';

const WINDOW_HEIGHT = 550;
const WINDOW_WIDTH = 400;

let win: Electron.BrowserWindow | null;
let tray: Electron.Tray | null;
let settings: StoreSettings;
let shortcutsMain: ShortcutsMain;
let appIpcMain: AppIpcMain;

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true } }]);

function createTray() {
  tray = new Tray(join(__static, 'favicon.ico'));
  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: 'Activer les raccourcis',
      type: 'checkbox',
      id: 'enableShortcutsOnStart',
      click: (item: MenuItem, window: BrowserWindow, event: Electron.Event) => {
        const isActivated = item.checked;

        store.set('settings.enableShortcutsOnStart', isActivated);
        // TODO notify renderer
      },
      checked: settings.enableShortcutsOnStart,
    },
    {
      type: 'separator',
    },
    {
      type: 'normal',
      label: 'Quitter',
      click: () => {
        quit();
      }
    }
  ]);
  tray.on('double-click', (event: Electron.Event, bounds: Electron.Rectangle) => {
    if (win) {
      win.show();
    }
  });
  tray.setContextMenu(trayContextMenu);
  appIpcMain = new AppIpcMain(win as BrowserWindow, tray, trayContextMenu);
}

function createWindow() {
  const windowState = windowStateKeeper({
    defaultWidth: WINDOW_WIDTH,
    defaultHeight: WINDOW_HEIGHT,
    fullScreen: false,
    maximize: false,
  });

  win = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    frame: true,
    resizable: false,
    fullscreenable: false,
    show: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
    },
  });
  windowState.manage(win);
  createTray();
  if (!isDevelopment) {
    win.setMenu(null);
  }
  shortcutsMain = new ShortcutsMain();
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) { win.webContents.openDevTools(); }
  } else {
    createProtocol('app');
    win.loadURL('app://./index.html');
  }
  win.once('ready-to-show', () => {
    if (win) {
      win.show()
    }
  });
  win.on('close', (event: Electron.Event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      if (win) {
        win.hide();
      }
    }
    return false;
  });
}

function quit() {
  log.info('App is quiting...');
  app.isQuiting = true;
  shortcutsMain.destroy();
  appIpcMain.destroy();
  if (win) {
    win = null;
  }
  if (tray) {
    tray = null;
  }
  app.quit();
}

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools(true);
  }
  settings = store.get('settings');
  if (!settings) {
    store.set('settings', DEFAULT_STORE_SETTINGS);
    settings = DEFAULT_STORE_SETTINGS;
  }
  createWindow();
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      quit();
    });
  }
}

process.on('uncaughtException', (error) => {
  log.error(error);
  quit();
});
