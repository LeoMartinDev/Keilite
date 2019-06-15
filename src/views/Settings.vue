<template>
  <v-card class="elevation-1">
    <v-container>
      <v-subheader>Démarrage</v-subheader>
      <v-switch
        label="Activer les raccourcis au démarrage de l'application"
        v-model="toggleShortcutsOnStart"
      ></v-switch>
      <v-switch
        label="Réduire dans le tray à la fermeture"
        v-model="minimizeToTray"
      ></v-switch>
      <v-subheader>Raccourcis clavier</v-subheader>
      <shortcut-field
        label="Personnage précédent"
        v-model="focusPreviousCharacter"
        @focus="disableShortcuts()"
        name="focusPreviousCharacter"
        v-validate="'required'"
        :error-messages="errors.collect('focusPreviousCharacter')"
        ref="focusPreviousCharacter"
      ></shortcut-field>
      <shortcut-field
        label="Personnage suivant"
        v-model="focusNextCharacter"
        @focus="disableShortcuts()"
        v-validate="'required'"
        name="focusNextCharacter"
        :error-messages="errors.collect('focusNextCharacter')"
        ref="focusNextCharacter"
      ></shortcut-field>
      <v-subheader>Avancé</v-subheader>
      <v-btn @click="openLogsFile()">Ouvrir le fichier de logs</v-btn>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions, Dictionary } from 'vuex';
import ShortcutField from '@/components/shared/ShortcutField.vue';
import {
  clone, without, has, isArray,
} from 'lodash';
// eslint-disable-next-line
import { remote } from 'electron';
import {
  AppSettings,
  EAppShortcuts,
  SHORTCUTS_SEPARATOR,
  AppSettingsStorage,
} from '../store/app/types';
import { StoreSettings } from '@/shared/defaults';
import { appIpcEmitter } from '../services/app-ipc-emitter';

const { shell } = remote;

const shortcutsGetters = (selected: EAppShortcuts[]): Dictionary<any> => selected.reduce(
  (
    accumulator: any,
    name: string,
    index: number,
    shortcutsNames: string[],
  ) => {
    accumulator[name] = {
      get(): string[] {
        return this.$store.getters['app/settings'].shortcuts[name] || [];
      },
      set(value: string[]) {
        if (!isArray(value)) {
          this.errors.remove(name);
          this.errors.add({
            field: name,
            msg: 'Le raccourcis est nécéssaire !',
          });
          return;
        }
        const otherShortcutsNames = without(shortcutsNames, name);
        const flatOtherShortcuts = otherShortcutsNames.reduce(
          (shortcutsAccumulator: string[], otherShortcutName: string) => {
            if (
              !this[otherShortcutName]
                || !isArray(this[otherShortcutName])
            ) {
              return shortcutsAccumulator;
            }
            shortcutsAccumulator.push(
              this[otherShortcutName].join(SHORTCUTS_SEPARATOR),
            );
            return shortcutsAccumulator;
          },
            [] as string[],
        );
        const flatValue = value.join(SHORTCUTS_SEPARATOR);

        if (flatOtherShortcuts.includes(flatValue)) {
          this.errors.remove(name);
          this.errors.add({
            field: name,
            msg: `Le raccourcis "${flatValue}" est déjà utilisé !`,
          });
        } else {
          this.errors.remove(name);
          const success = this.$store.dispatch('app/updateShortcut', {
            name,
            value,
          });
          if (!success) {
            this.errors.remove(name);
            this.errors.add({
              field: name,
              msg: `Le raccourcis "${flatValue}" est un raccourcis système !`,
            });
          } else if (this.shortcutsWereEnabled) {
            this.$store.dispatch('app/toggleShortcuts', true);
          }
        }
      },
    };

    return accumulator;
  },
  {},
);

export default Vue.extend({
  components: { ShortcutField },
  data() {
    return {
      shortcutsWereEnabled: clone(this.$store.getters['app/shortcutsEnabled']),
    };
  },
  computed: {
    ...shortcutsGetters([
      EAppShortcuts.FOCUS_NEXT_CHARACTER,
      EAppShortcuts.FOCUS_PREVIOUS_CHARACTER,
    ]),
    settings(): AppSettings {
      return this.$store.getters['app/settings'];
    },
    sharedSettings(): StoreSettings {
      return this.$store.getters['app/sharedSettings'];
    },
    toggleShortcutsOnStart: {
      get(): boolean {
        return this.sharedSettings.enableShortcutsOnStart;
      },
      set(value: boolean) {
        this.updateSharedSettings({ enableShortcutsOnStart: value });
      },
    },
    minimizeToTray: {
      get(): boolean {
        return this.sharedSettings.minimizeToTray;
      },
      set(value: boolean) {
        this.updateSharedSettings({ minimizeToTray: value });
        appIpcEmitter.minimizeToTray(value);
      },
    },
  },
  methods: {
    ...mapActions('app', ['updateShortcut']),
    updateSharedSettings(settings: Partial<StoreSettings>) {
      this.$store.dispatch('app/updateSharedSettings', settings);
    },
    disableShortcuts() {
      this.shortcutsWereEnabled = clone(
        this.$store.getters['app/shortcutsEnabled'],
      );
      this.$store.dispatch('app/toggleShortcuts', false);
    },
    openLogsFile() {
      try {
        const logsPath = this.$log.transports.file.findLogPath();

        shell.openExternal(logsPath);
      } catch (error) {
        this.$log.error('Open logs file failed:', error);
      }
    },
  },
});
</script>
