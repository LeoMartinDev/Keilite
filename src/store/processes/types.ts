export type ObjectKey = string | number;

export interface Dictionary<T> {
  [key: string]: T;
}

export enum ProcessState {
  CONNECTED,
  DISCONNECTED,
}

export interface RawProcess {
  pid: number;
  windowTitle: string;
}

export interface Process extends RawProcess {
  state: ProcessState;
}

export interface ConnectedProcess {
  windowTitle: string;
  state: ProcessState.CONNECTED;
}

export interface DisconnectedProcess {
  state: ProcessState.DISCONNECTED;
}

export interface ProcessesState {
  processes: Dictionary<Process>;
}
