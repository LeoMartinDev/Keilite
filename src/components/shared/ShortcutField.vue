<template>
  <v-text-field
    ref="field"
    @keydown.native="keydown"
    :label="label"
    :value="display"
    :error-messages="internalErrorMessages"
    box
    readonly
    @focus="focus"
    @blur="blur"
  ></v-text-field>
</template>

<script lang="ts">
import Vue from 'vue';
import { clone } from 'lodash';
import { mapActions } from 'vuex';

export const modifiers: { [Key: number]: string } = {
  16: 'Shift',
  17: 'Control',
  18: 'Alt',
  91: 'Command',
  93: 'Command',
};

export function isModifierKey(keyCode: number) {
  return !!modifiers[keyCode];
}

interface Data {
  internalValue: Array<any>;
  oldValue: Array<any>;
  keyEvents: Array<any>;
  isComplete: boolean;
  internalErrorMessages: string[];
}

export default Vue.extend({
  data: (): Data => ({
    internalValue: [],
    oldValue: [],
    keyEvents: [],
    isComplete: false,
    internalErrorMessages: [],
  }),
  props: {
    value: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    errorMessages: {
      type: Array,
    },
    separator: {
      default: '+',
    },
  },
  methods: {
    keydown(event: any) {
      event.preventDefault();
      if (!this.isComplete && this.keyEvents.length < 2 && !event.repeat) {
        if (this.keyEvents.length === 0 && !isModifierKey(event.keyCode)) {
          this.internalErrorMessages = [
            'La première entrée doit être un accélerateur!',
          ];
          return;
        }
        this.internalErrorMessages = [];

        if (this.keyEvents.length === 1 && isModifierKey(event.keyCode)) {
          this.internalErrorMessages = [
            'La deuxième entrée ne peut être un accélérateur!',
          ];
          return;
        }
        this.internalErrorMessages = [];

        this.keyEvents.push(event);
        this.internalValue.push(event.key);
      }
      if (this.keyEvents.length === 2) {
        this.isComplete = true;
      }
    },
    focus(event: MouseEvent) {
      this.$emit('focus', event);
      this.isComplete = false;
      this.keyEvents = [];
      this.internalValue = [];
    },
    blur(event: MouseEvent) {
      if (!this.isComplete) {
        this.internalValue = this.oldValue;
      } else {
        this.oldValue = this.internalValue;
      }
      this.isComplete = false;
      this.$emit('blur', event);
    },
  },
  watch: {
    value: {
      handler(v: string[]) {
        const value = clone(v);

        if (value && Array.isArray(value)) {
          this.oldValue = value;
          this.internalValue = clone(value);
          this.isComplete = false;
        }
      },
      immediate: true,
    },
    isComplete(value: boolean) {
      if (value === true) {
        this.internalErrorMessages = [];
        (this.$refs.field as HTMLElement).blur();
        this.$emit('input', this.internalValue);
      }
    },
    internalErrorMessages(newValue, oldValue) {
      if (newValue && newValue.length > 0) {
        this.keyEvents = [];
        this.internalValue = [];
        this.isComplete = false;
      }
    },
    errorMessages: {
      handler(value: string[]) {
        this.internalErrorMessages = value;
      },
      immediate: true,
    },
  },
  computed: {
    display(): string {
      return this.internalValue.join(this.separator);
    },
  },
});
</script>
