<template>
  <v-autocomplete
    clearable
    :items="classes"
    v-model="selectedClass"
    item-value="slug"
    label="Classe / sexe"
    autocomplete
    hide-selected
    :filter="filter"
  >
    <template v-slot:no-data>
      <div style="text-align: center">Aucune classe de ce nom!</div>
    </template>
    <template v-slot:selection="data">
      <v-chip>
        <v-avatar>
          <img :src="getAvatar(data.item.gender, data.item.className)">
        </v-avatar>
        <div class="text-capitalize">{{ data.item.className }}</div>
      </v-chip>
    </template>
    <template v-slot:item="data">
      <v-list-tile-avatar>
        <img :src="getAvatar(data.item.gender, data.item.className)">
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title class="text-capitalize">{{ data.item.className }}</v-list-tile-title>
      </v-list-tile-content>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue";
import { Character } from "../../store/characters/types";
import { getAvatar } from "./lib";
import { classNames } from "./constants";
import { clone, merge, isNull } from "lodash";

export default Vue.extend({
  props: {
    value: {
      type: Object as () => Character,
      required: true
    }
  },
  methods: {
    getAvatar,
    filter(item: any, queryText: string) {
      const text = item.className;
      const query = isNull(queryText) ? '' : queryText;
      return (
        text
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      );
    }
  },
  computed: {
    classes() {
      return classNames.reduce(
        (accumulator: any[], className: string) => {
          accumulator.push(
            { className, gender: "male", slug: `${className}-male` },
            { className, gender: "female", slug: `${className}-female` }
          );
          return accumulator;
        },
        [] as Array<any>
      );
    },
    selectedClass: {
      get(): string {
        return `${this.value.className}-${this.value.gender}`;
      },
      set(value: string) {
        if (!value) return;
        const character = clone(this.value);
        const [className, gender] = value.split("-");
        
        this.$emit(
          "input",
          merge(character, {
            className,
            gender
          })
        );
      }
    }
  }
});
</script>

