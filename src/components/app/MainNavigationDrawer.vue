<template>
  <v-navigation-drawer
    class="keilite__no-drag-region"
    :value="navigationDrawer"
    absolute
    app
  >
    <v-layout
      fill-height
      column
    >
      <v-flex>
        <v-list>
          <v-list-tile
            :to="{ name: 'home' }"
            avatar
          >
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                Accueil
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile disabled>
            <v-list-tile-action>
              <v-icon disabled>delete_forever</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Fermer les processus</v-list-tile-title>
          </v-list-tile>
          <v-list-tile disabled>
            <v-list-tile-action>
              <v-icon disabled>build</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Réparer Dofus</v-list-tile-title>
          </v-list-tile>
          <v-list-tile :to="{ name: 'settings' }">
            <v-list-tile-action>
              <v-icon>settings</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Paramètres</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="showAboutDialog()">
            <v-list-tile-action>
              <v-icon>info</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>A propos</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex
        align-self-center
        shrink
      >
        <v-subheader class="body-2">
          Développé par Aukk - Meriana
        </v-subheader>
      </v-flex>
    </v-layout>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapGetters('UI', ['navigationDrawer']),
  },
  methods: {
    toggleNavigationDrawer(value?: boolean) {
      this.$store.dispatch('UI/toggleNavigationDrawer', value);
    },
    showAboutDialog() {
      this.toggleNavigationDrawer(false);
      this.$store.dispatch('UI/toggleAboutDialog', true);
    },
  },
});
</script>
