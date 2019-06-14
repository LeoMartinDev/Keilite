import log, { IElectronLog, ITransport, IConsoleTransport } from 'electron-log';
import { VueConstructor } from 'vue';
import _Vue from 'vue';
import Vue from 'vue';

const isDevelopment = process.env.NODE_ENV === 'development';

const format = '[RENDERER] :: [{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';

log.transports.file.format = format;
log.transports.console.format = format;

if (!isDevelopment) {
  log.transports.console = (() => {}) as unknown as IConsoleTransport;
}

class LogPlugin {
  install(Vue: VueConstructor<_Vue>) {
    Vue.$log = log;
    Vue.prototype.$log = Vue.$log;
  }
}

const plugin = new LogPlugin();

Vue.use(plugin);