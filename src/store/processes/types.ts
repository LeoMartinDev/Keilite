import { RawProcess } from '@/shared/native-process';

export type ObjectKey = string | number;

export interface Dictionary<T> {
  [key: string]: T;
}

export enum ProcessState {
  CONNECTED,
  DISCONNECTED,
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
