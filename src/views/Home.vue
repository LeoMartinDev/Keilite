<template>
  <v-flex>
    <v-card
      class="elevation-1"
      v-if="list.length > 0"
    >
      <v-list two-line>
        <v-subheader>
          Personnages connectés <v-chip
            color="teal"
            text-color="white"
            class="font-weight-bold"
          >{{ list.length }}</v-chip>
        </v-subheader>
        <draggable
          v-model="list"
          name="list-complete"
          :options="options"
        >
          <transition-group
            type="transition"
            :name="'flip-list'"
          >
            <character-list-item
              v-for="(character, index) of list"
              :key="character.name"
              :character="character"
              @setToForeground="focusCharacter(index)"
              @toggleFocusable="value => toggleFocusable(character, value)"
              :line="index < list.length - 1"
              @edit="editCharacter(character)"
            >
            </character-list-item>
          </transition-group>
        </draggable>
      </v-list>
    </v-card>
    <v-img
      v-else
      :src="chachaImage"
    ></v-img>
    <v-dialog v-model="editCharacterDialog">
      <v-card v-if="toEditCharacter">
        <v-card-title>
          <h2>{{ toEditCharacter.name }}</h2>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="closeEditCharacter()"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <character-class-select-field v-model="toEditCharacter"></character-class-select-field>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import CharacterAvatar from '@/components/characters/CharacterAvatar.vue';
import CharacterListItem from '@/components/characters/CharacterListItem.vue';
import CharacterClassSelectField from '@/components/characters/CharacterClassSelectField.vue';
import { Character } from '@/store/characters/types';
import { Process } from '@/store/processes/types';
// @ts-ignore
import draggable from 'vuedraggable';
import { ShortcutsEmitterSingleton } from '@/services/shortcuts-emitter-singleton';
import { ShortcutsEmitter } from '@/background/shortcuts/renderer';
import { Dictionary } from 'vue-router/types/router';
import { join } from 'path';
import { clone } from 'lodash';

interface Data {
  options: {
    animation: number;
    group: string;
    ghostClass: string;
  };
  focusedProcessIndex: number;
  editCharacterDialog: boolean;
  toEditCharacter: Character | null;
}

export default Vue.extend({
  name: 'Home',
  components: {
    draggable,
    CharacterAvatar,
    CharacterListItem,
    CharacterClassSelectField,
  },
  data: (): Data => ({
    options: {
      animation: 0,
      group: 'connectedCharacters',
      ghostClass: 'ghost',
    },
    focusedProcessIndex: 0,
    editCharacterDialog: false,
    toEditCharacter: null,
  }),
  methods: {
    ...mapActions('characters', ['focusCharacter']),
    updateCharactersList(list: string[]) {
      this.$store.dispatch('characters/updateCharactersList', list);
    },
    editCharacter(character: Character) {
      this.toEditCharacter = character;
      this.editCharacterDialog = true;
    },
    toggleFocusable(character: Character, value: boolean) {
      this.$store.dispatch('characters/updateCharacter', {
        name: character.name,
        payload: {
          isFocusable: value,
        },
      });
    },
    closeEditCharacter() {
      this.editCharacterDialog = false;
      const payload = clone(this.toEditCharacter);

      if (payload) {
        this.$store.dispatch('characters/updateCharacter', {
          name: payload.name,
          payload,
        });
      }
      this.toEditCharacter = null;
    },
  },
  computed: {
    characters(): Dictionary<Character> {
      return this.$store.getters['characters/characters'];
    },
    mappedCharactersList(): Character[] {
      return this.$store.getters['characters/mappedCharactersList'];
    },
    list: {
      get(): Character[] {
        return this.mappedCharactersList;
      },
      set(value: Character[]) {
        this.updateCharactersList(
          value.filter((c: Character) => !!c).map((c: Character) => c.name),
        );
      },
    },
    chachaImage() {
      return join(__static, 'images/chacha.png');
    },
  },
});
</script>

<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
