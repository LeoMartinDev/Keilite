import log, { IElectronLog, ITransport, IConsoleTransport } from 'electron-log';

const isDevelopment = process.env.NODE_ENV === 'development';

if (!isDevelopment) {
  log.transports.console = (() => {}) as unknown as IConsoleTransport;
}