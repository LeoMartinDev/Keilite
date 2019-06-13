import '@/styles/app.scss';
import Vue from 'vue';
import './plugins/vuetify';
import './plugins/log';
import VeeValidate from 'vee-validate';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VeeValidate);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

