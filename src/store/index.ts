import { processes } from './processes';
import Vue from 'vue';
import Vuex from 'vuex';
import { UI } from './UI';
import { characters } from './characters';
import { app } from './app';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    UI,
    processes,
    characters,
  },
});
