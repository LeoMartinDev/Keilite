import { GET_PROCESSES_BY_NAME, GET_PROCESS_WINDOW_TITLE, SET_PROCESS_TO_FOREGROUND, GET_PROCESSES_BY_NAME_DATA, GET_PROCESS_WINDOW_TITLE_DATA, GET_PROCESSES_WINDOW_TITLE, GET_PROCESSES_WINDOW_TITLE_DATA } from './events';
import { getProcessesByName, setProcessToForeground, getProcessWindowTitle } from 'native-process';
import { ipcMain } from 'electron';
import { map } from 'async';
import log from 'electron-log';

const eventsNameMap = [
  GET_PROCESSES_BY_NAME,
  GET_PROCESS_WINDOW_TITLE,
  GET_PROCESSES_WINDOW_TITLE,
  SET_PROCESS_TO_FOREGROUND,
];

export interface RawProcess {
  pid: number;
  windowTitle: string;
}

const listeners = {
  async [GET_PROCESSES_BY_NAME](event: Electron.Event, name: string) {
    try {
      const sender: Electron.WebContents = event.sender;
      const pids = await getProcessesByName(name);

      sender.send(GET_PROCESSES_BY_NAME_DATA, pids);
    } catch (error) {
      console.error(error);
    }
  },
  async [GET_PROCESS_WINDOW_TITLE](event: Electron.Event, pid: number) {
    try {
      const sender: Electron.WebContents = event.sender;
      const windowTitle = await getProcessWindowTitle(pid);

      sender.send(GET_PROCESS_WINDOW_TITLE_DATA, { pid, windowTitle });
    } catch (error) {
      console.error(error);
    }
  },
  async [GET_PROCESSES_WINDOW_TITLE](event: Electron.Event, pids: number[]) {
    const sender: Electron.WebContents = event.sender;
    try {
      map<any, any>(pids, (pid: number, next) => {
        getProcessWindowTitle(pid)
          .then((windowTitle: string) => next(null, { pid, windowTitle }))
          .catch((error) => {
            next();
          });
      }, (error, result) => {
        sender.send(GET_PROCESSES_WINDOW_TITLE_DATA, result);
      });
    } catch (error) {
      console.error(error);
    }
  },
  async [SET_PROCESS_TO_FOREGROUND](event: Electron.Event, pid: number) {
    try {
      const sender: Electron.WebContents = event.sender;

      await setProcessToForeground(pid);
    } catch (error) {
      console.error(error);
    }
  },
};

export function load() {
  eventsNameMap.forEach((event: string) => {
    ipcMain.on(event, listeners[event]);
  });
}

export function unload() {
  eventsNameMap.forEach((event: string) => ipcMain.removeListener(event, listeners[event]));
}
