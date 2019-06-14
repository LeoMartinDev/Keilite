import { getProcessesByName, getProcessWindowTitle } from 'native-process';
import { DOFUS_PROCESS_NAME } from '@/constants';
import { EventEmitter } from 'events';
import log from 'electron-log';
import { RawProcess } from '@/store/processes/types';

export function isConnected(windowTitle: string): boolean {
  return windowTitle !== '' && windowTitle.includes(' - ');
}

export function isNewWindowOrLoggedOut(windowTitle: string): boolean {
  return windowTitle.startsWith('Dofus') || windowTitle === '' || windowTitle === 'Dummy' || windowTitle === 'Msg';
}

declare interface DofusWindowEmitter {
  on(event: 'connected', listener: (rawProcess: RawProcess) => void): this;
  on(event: 'disconnected', listener: (rawProcess: RawProcess) => void): this;
  removeListener(event: 'connected', listener: () => void): this;
  removeListener(event: 'disconnected', listener: () => void): this;
}

class DofusWindowEmitter extends EventEmitter {
  private _timeoutId: any;
  private _isRunning = false;
  private _previousPids: number[] = [];

  constructor() {
    super();
    this._start();
    this._loop();
  }

  public destroy(): void {
    if (this._isRunning) {
      clearInterval(this._timeoutId);
      this._timeoutId = null;
      this._isRunning = false;
    }
  }

  private _start(): void {
    if (!this._isRunning) {
      this._isRunning = true;
      this._loop();
    }
  }

  private _restart(): void {
    this.destroy();
    this._start();
  }

  private _loop(): void {
    this._timeoutId = setTimeout(async () => {
      try {
        const pids = await getProcessesByName(DOFUS_PROCESS_NAME);

        if (this._previousPids.length > 0) {
          this._previousPids.forEach((previousPid) => {
            if (!pids.includes(previousPid)) {
              this.emit('disconnected', { pid: previousPid });
            }
          });
        }
        this._previousPids = pids;
        for (const pid of pids) {
          const windowTitle = await getProcessWindowTitle(pid);
          const rawProcess: RawProcess = { windowTitle, pid };

          if (isConnected(rawProcess.windowTitle)) {
            this.emit('connected', rawProcess);
          }
          if (isNewWindowOrLoggedOut(rawProcess.windowTitle)) {
            this.emit('disconnected', rawProcess);
          }
        }
        this._restart();
      } catch (error) {
        log.warn('DofusWindowHandler :: loop :: error: ', error);
        this._restart();
      }
    }, 500);
  }
}

const dofusWindowEmitter = new DofusWindowEmitter();

export { dofusWindowEmitter, DofusWindowEmitter };