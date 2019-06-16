<template>
  <v-dialog
    v-model="aboutDialog"
    width="80%"
  >
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="aboutDialog = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout
          column
          align-center
        >
          <v-img :src="logo"></v-img>
          <h1 class="text-capitalize">{{ appName }}</h1>
          <span>Version {{ appVersion }}</span>
          <span v-if="hasLookedForUpdates">
            {{ status }}
          </span>
          <v-btn
            v-if="!foundUpdate"
            small
            class="white--text"
            color="teal lighten-2"
            @click="lookForUpdates()"
            :disabled="isLookingForUpdates"
            :loading="isLookingForUpdates"
          >Rechercher des mises à jour</v-btn>
          <v-btn
            v-else-if="hasLookedForUpdates && foundUpdate && !isReadyToInstall"
            :disabled="true"
            :loading="!!downloadProgress"
            class="white--text"
            small
            color="teal lighten-2"
          >
          Téléchargement ({{ downloadProgress.percent }}%)
          </v-btn>
          <v-btn
            v-else
            small
            class="white--text"
            color="teal lighten-2"
            @click="quitAndInstall"
            :disabled="!foundUpdate"
          >Mettre à jour <v-icon right>update</v-icon></v-btn>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { join } from 'path';
import { updaterEmitter } from '@/services/updater-emitter';
// eslint-disable-next-line
import { remote } from "electron";
import { UpdateInfo } from 'electron-updater';

const { app } = remote;

export default Vue.extend({
  computed: {
    aboutDialog: {
      get(): boolean {
        return this.$store.getters['UI/aboutDialog'];
      },
      set(value: boolean) {
        this.toggleDialog(value);
      },
    },
    logo(): string {
      return join(__static, 'logo.png');
    },
    appVersion(): string {
      return app.getVersion();
    },
    appName(): string {
      return app.getName();
    },
    isLookingForUpdates(): boolean {
      return this.$store.getters['updates/isLookingForUpdates'];
    },
    hasLookedForUpdates(): boolean {
      return this.$store.getters['updates/hasLookedForUpdates'];
    },
    status(): string {
      return this.$store.getters['updates/status'];
    },
    foundUpdate(): UpdateInfo | undefined {
      return this.$store.getters['updates/foundUpdate'];
    },
    isReadyToInstall(): boolean {
      return this.$store.getters['updates/isReadyToInstall'];
    },
  },
  methods: {
    toggleDialog(value?: boolean) {
      this.$store.dispatch('UI/toggleAboutDialog', value);
    },
    lookForUpdates() {
      this.$store.dispatch('updates/lookForUpdates');
    },
    quitAndInstall() {
      updaterEmitter.quitAndInstall();
    },
  },
});
</script>
