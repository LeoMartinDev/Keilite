import log, { IElectronLog, ITransport } from 'electron-log';
import { VueConstructor } from 'vue';
import _Vue from 'vue';
import Vue from 'vue';

class LogPlugin {
  install(Vue: VueConstructor<_Vue>) {
    Vue.$log = log;
    Vue.prototype.$log = log;
  }
}

const plugin = new LogPlugin();

Vue.use(plugin);