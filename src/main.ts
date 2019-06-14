import './plugins/logger';
import '@/styles/app.scss';
import Vue from 'vue';
import './plugins/vuetify';
import VeeValidate from 'vee-validate';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.$log.info(`Saving logs at path "${Vue.$log.transports.file.findLogPath()}"!`);

Vue.config.productionTip = false;

Vue.use(VeeValidate);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

