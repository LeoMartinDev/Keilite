<template>
  <v-toolbar
    color="teal"
    dark
    app
    fixed
  >
    <v-toolbar-side-icon @click="toggleNavigationDrawer" />
    <v-toolbar-title class="text-capitalize">{{ appName }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-switch
      v-model="shortcutsEnabled"
      label="Activer les raccourcis"
      hide-details
      color="teal lighten-5"
    ></v-switch>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { AppSettings } from '../../store/app/types';
// eslint-disable-next-line
import { remote } from "electron";
const { app } = remote;

export default Vue.extend({
  name: 'navbar',
  methods: {
    ...mapActions('UI', ['toggleNavigationDrawer']),
    ...mapActions('app', ['toggleShortcuts']),
  },
  computed: {
    shortcutsEnabled: {
      get(): boolean {
        return this.$store.getters['app/shortcutsEnabled'];
      },
      set(value: boolean) {
        this.toggleShortcuts(value);
      },
    },
    appName(): string {
      return app.getName();
    },
  },
});
</script>
