<template>
  <v-app class="keilite__app">
    <keilite-nav-bar></keilite-nav-bar>
    <keilite-main-navigation-drawer></keilite-main-navigation-drawer>
    <v-content style="flex: 1 1 auto;">
      <v-container
        fluid
        fill-height
        class="keilite__scroll-container"
      >
        <v-layout
          fill-height
          align-start
        >
          <router-view />
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import KeiliteNavBar from '@/components/app/NavBar.vue';
import KeiliteMainNavigationDrawer from '@/components/app/MainNavigationDrawer.vue';
import { mapGetters, mapActions, Dictionary } from 'vuex';
import { throttle } from 'lodash';
import log from 'electron-log';
import {
  AppSettings,
  SHORTCUTS_SEPARATOR,
  EAppShortcuts,
} from './store/app/types';
import {
  dofusWindowEmitter,
  DofusWindowEmitter,
} from '@/services/dofus-window-emitter';
import { shortcutsEmitter } from '@/services/shortcuts-emitter';
import { appIpcEmitter } from '@/services/app-ipc-emitter';
import { ShortcutsEmitter } from './shared/shortcuts/renderer';
import { RawProcess } from './store/processes/types';
import { AppIpcRenderer } from './shared/app-ipc/renderer';

interface Data {
  dofusWindowEmitter: DofusWindowEmitter;
  shortcutsEmitter: ShortcutsEmitter;
  appIpcEmitter: AppIpcRenderer;
  onShortcutHandler: any;
}

export default Vue.extend({
  name: 'app',
  components: { KeiliteNavBar, KeiliteMainNavigationDrawer },
  data: (): Data => ({
    dofusWindowEmitter,
    shortcutsEmitter,
    appIpcEmitter,
    onShortcutHandler: null,
  }),
  mounted() {
    this.dofusWindowEmitter.on('connected', this.onDofusConnected);
    this.appIpcEmitter.on('toggle-shortcuts', this.toggleShortcuts);
    this.dofusWindowEmitter.on('disconnected', this.onDofusDisconnected);
    this.toggleShortcuts(this.shortcutsEnabled);
  },
  beforeDestroy() {
    this.dofusWindowEmitter.destroy();
    this.shortcutsEmitter.destroy();
    this.appIpcEmitter.destroy();
  },
  methods: {
    focusNextCharacter(): Promise<void> {
      log.debug('focusNextCharacter called');
      return this.$store.dispatch('characters/focusNextCharacter');
    },
    focusPreviousCharacter(): Promise<void> {
      log.debug('focusNextCharacter called');
      return this.$store.dispatch('characters/focusPreviousCharacter');
    },
    addProcess(process: RawProcess): Promise<void> {
      return this.$store.dispatch('processes/addProcess', process);
    },
    removeProcess(process: RawProcess): Promise<void> {
      return this.$store.dispatch('processes/removeProcess', process);
    },
    toggleShortcuts(value: boolean): Promise<void> {
      return this.$store.dispatch('app/toggleShortcuts', value);
    },
    async onShortcut(shortcut: string) {
      console.log('onshortcut :: ', shortcut);
      const shortcutName = this.shortcutsMap[shortcut];

      if (shortcutName === (EAppShortcuts.FOCUS_NEXT_CHARACTER as string)) {
        await this.focusNextCharacter();
      }
      if (shortcutName === (EAppShortcuts.FOCUS_NEXT_CHARACTER as string)) {
        await this.focusPreviousCharacter();
      }
    },
    onDofusConnected(rawProcess: RawProcess) {
      this.addProcess(rawProcess);
    },
    onDofusDisconnected(rawProcess: RawProcess) {
      this.removeProcess(rawProcess);
    },
  },
  watch: {
    shortcutsEnabled: {
      handler(value: boolean) {
        if (value) {
          console.log('short cut handler true');
          this.onShortcutHandler = throttle(this.onShortcut.bind(this), 100);
          this.shortcutsEmitter.on('shortcut', this.onShortcutHandler);
        } else if (this.onShortcutHandler) {
          this.shortcutsEmitter.removeListener(
            'shortcut',
            this.onShortcutHandler,
          );
          this.onShortcutHandler = null;
        }
      },
      immediate: true,
    },
  },
  computed: {
    shortcutsEnabled(): boolean {
      return this.$store.getters['app/shortcutsEnabled'];
    },
    settings(): AppSettings {
      return this.$store.getters['app/settings'];
    },
    shortcutsMap: {
      get(): Dictionary<EAppShortcuts> {
        return Object.entries(this.settings.shortcuts).reduce(
          (accumulator: Dictionary<string>, [key, value]: any[]) => {
            accumulator[value.join(SHORTCUTS_SEPARATOR)] = key;

            return accumulator;
          },
          {},
        );
      },
    },
  },
});
</script>
