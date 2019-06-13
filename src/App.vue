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
import { ShortcutsEmitterSingleton } from '@/services/shortcuts-emitter-singleton';
import { DofusWindowEmitterSingleton } from '@/services/dofus-window-emitter-singleton';
import { mapGetters, mapActions, Dictionary } from 'vuex';
import { RawProcess } from '@/background/native-process';
import { throttle } from 'lodash';
import { AppSettings, SHORTCUTS_SEPARATOR, EAppShortcuts } from './store/app/types';

interface Data {
  onShortcutHandler: any;
}

export default Vue.extend({
  name: 'app',
  components: { KeiliteNavBar, KeiliteMainNavigationDrawer },
  beforeMount() {
    ShortcutsEmitterSingleton.getInstance();
    DofusWindowEmitterSingleton.getInstance();
  },
  mounted() {
    DofusWindowEmitterSingleton.instance.on('connected', this.onDofusConnected);
    DofusWindowEmitterSingleton.instance.on(
      'disconnected',
      this.onDofusDisconnected,
    );
    this.toggleShortcuts(this.shortcutsEnabled);
  },
  beforeDestroy() {
    ShortcutsEmitterSingleton.destroy();
    DofusWindowEmitterSingleton.destroy();
  },
  data: (): Data => ({
    onShortcutHandler: null,
  }),
  methods: {
    focusNextCharacter(): Promise<void> {
      return this.$store.dispatch('characters/focusNextCharacter');
    },
    focusPreviousCharacter(): Promise<void> {
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
      const shortcutName = this.shortcutsMap[shortcut];

      if (shortcutName === EAppShortcuts.FOCUS_NEXT_CHARACTER) {
        await this.focusNextCharacter();
      } else if (shortcutName === EAppShortcuts.FOCUS_NEXT_CHARACTER) {
        await this.focusPreviousCharacter();
      } else {
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
          this.onShortcutHandler = throttle(this.onShortcut.bind(this), 100);
          ShortcutsEmitterSingleton.instance.on(
            'shortcut',
            this.onShortcutHandler,
          );
        } else if (this.onShortcutHandler) {
          ShortcutsEmitterSingleton.instance.removeListener(
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
          (accumulator: Dictionary<string>, value: any[]) => {
            console.log('value :: ', value);
            accumulator[value[1].join(SHORTCUTS_SEPARATOR)] = value[0];

            return accumulator;
          },
          {},
        );
      },
    },
  },
});
</script>
