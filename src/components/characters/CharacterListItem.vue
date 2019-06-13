<template>
  <div>
    <v-list-tile avatar>
      <v-list-tile-avatar>
        <character-avatar :character="character"></character-avatar>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>{{ character.name }}</v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-switch
              color="teal"
              v-on="on"
              icon
              ripple
              v-model="isFocusable"
            >
            </v-switch>
          </template>
          <span>Activer / désactiver</span>
        </v-tooltip>
      </v-list-tile-action>
      <v-list-tile-action>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon
              ripple
              @click.native="$emit('edit', character)"
            >
              <v-icon color="grey">create</v-icon>
            </v-btn>
          </template>
          <span>Editer</span>
        </v-tooltip>
      </v-list-tile-action>
      <v-list-tile-action>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon
              ripple
              @click.native="$emit('setToForeground', character)"
            >
              <v-icon color="grey">open_in_browser</v-icon>
            </v-btn>
          </template>
          <span>Focus</span>
        </v-tooltip>
      </v-list-tile-action>
    </v-list-tile>
    <v-divider
      v-if="line"
      inset
    ></v-divider>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import CharacterAvatar from "./CharacterAvatar.vue";
import { Character } from "@/store/characters/types";

export default Vue.extend({
  components: { CharacterAvatar },
  props: {
    character: {
      type: Object as () => Character,
      required: true
    },
    line: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isFocusable: {
      get(): boolean {
        return this.character.isFocusable;
      },
      set(value: boolean) {
        this.$emit("toggleFocusable", value);
      }
    }
  }
});
</script>
