<template>
  <img :src="imageSrc">
</template>


<script lang="ts">
import Vue from 'vue';
import { Character } from '@/store/characters/types';
import { getCharacterAvatarPath } from './lib';

export default Vue.extend({
  props: {
    character: {
      type: Object as () => Character,
      required: true,
    },
  },
  computed: {
    imageSrc(): string {
      return getCharacterAvatarPath(this.character);
    },
  },
});
</script>
