import { UpdaterMain } from './shared/updater/main';
import { AppIpcMain } from './shared/app-ipc/main';
import { app, protocol, BrowserWindow, Tray, Menu, MenuItem } from 'electron';
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';
import { ShortcutsMain } from './shared/shortcuts/main';
import './background/logger';
import log from 'electron-log';
import windowStateKeeper from 'electron-window-state';
import { join } from 'path';
import Store from 'electron-store';
import { DEFAULT_STORE_SETTINGS, StoreSettings } from './shared/defaults';

const isDevelopment = process.env.NODE_ENV !== 'production';
const store = new Store();
let isQuiting = false;

const WINDOW_HEIGHT = 550;
const WINDOW_WIDTH = 400;

let win: Electron.BrowserWindow | null;
let tray: Electron.Tray | null;
let trayContextMenu: Electron.Menu | null;
let settings: StoreSettings;
let shortcutsMain: ShortcutsMain;
let appIpcMain: AppIpcMain;
let updaterMain: UpdaterMain;
let windowState: any;

if (!isDevelopment) {
  // lock the app to one instance only
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (win) {
        win.show();
      }
    });
  }
}

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { standard: true, supportFetchAPI: true, secure: true } }]);

function createTray() {
  tray = new Tray(join(__static, 'favicon.ico'));
  trayContextMenu = Menu.buildFromTemplate([
    {
      label: 'Activer les raccourcis',
      type: 'checkbox',
      id: 'shortcutsEnabled',
      click: (item: MenuItem, window: BrowserWindow, event: Electron.Event) => {
        const isActivated = item.checked;

        appIpcMain.toggleShortcuts(isActivated);
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
}

function createWindow() {
  updaterMain = new UpdaterMain();
  windowState = windowStateKeeper({
    fullScreen: false,
    maximize: false,
    defaultWidth: WINDOW_WIDTH,
    defaultHeight: WINDOW_HEIGHT,
  });
  win = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    frame: true,
    resizable: false,
    fullscreenable: false,
    useContentSize: false,
    show: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
    },
    icon: join(__static, 'favicon.ico'),
  });
  windowState.manage(win);
  if (settings.minimizeToTray) {
    createTray();
  }
  appIpcMain = new AppIpcMain(win as BrowserWindow);
  appIpcMain.on('toggle-shortcuts', value => {
    if (!tray || !trayContextMenu) return;
    const item = trayContextMenu.items.find((item: any) => item.id === 'shortcutsEnabled');

    if (item) {
      item.checked = value;
      tray.setContextMenu(trayContextMenu);
    }
  });
  appIpcMain.on('minimize-to-tray', value => {
    settings.minimizeToTray = value;
    if (!value) {
      if (tray) {
        tray.destroy();
        tray = null;
      }
    } else {
      if (!tray) {
        createTray();
      }
    }
  });
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
    if (settings.minimizeToTray) {
      if (!isQuiting) {
        event.preventDefault();
        if (win) {
          win.hide();
        }
      }
    }
    return false;
  });
}

function quit() {
  log.info('App is quiting...');
  isQuiting = true;
  windowState.unmanage();
  shortcutsMain.destroy();
  appIpcMain.destroy();
  if (win) {
    win = null;
  }
  if (tray) {
    tray.destroy();
    tray = null;
  }
  app.quit();
}

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools(true);
  }
  settings = store.get('settings') as StoreSettings;
  // TODO fix enable shortcuts on start not working
  if (!settings) {
    store.set('settings', DEFAULT_STORE_SETTINGS);
    settings = DEFAULT_STORE_SETTINGS;
    log.info('Shared settings not found, using defaults.');
  }
  log.info('Shared settings :', settings);
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
