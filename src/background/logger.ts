import log, { IElectronLog, ITransport, IConsoleTransport } from 'electron-log';

const isDevelopment = process.env.NODE_ENV === 'development';

const format = '[MAIN]     :: [{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';

log.transports.file.format = format;
log.transports.console.format = format;

if (!isDevelopment) {
  log.transports.console = (() => {}) as unknown as IConsoleTransport;
}