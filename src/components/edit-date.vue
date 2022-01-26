<template>
  <datetime
    v-model="currentValue"
    type="datetime"
    :placeholder="placeholder"
    :disabled="disabled"
    :title="title"
    input-class="bmc-form-control"
    :hour-step="1"
    :week-start="7"
    :min-datetime="minISO"
    :max-datetime="maxISO"
    use12-hour
    auto
    @input="emitChange"
  >
    <template slot="button-cancel">
      <x-icon /> Cancel
    </template>
    <template slot="button-confirm" slot-scope="scope">
      <span v-if='scope.step === "time"'>
        <check-icon /> Done
      </span>
      <span v-else>
        Next <chevron-right-icon />
      </span>
    </template>
    <template slot="after">
      <div v-if="canClear" class="bmc-input-group__append">
        <action-button
          type="secondary"
          icon="x"
          label="Clear date"
          :outline="true"
          :disabled="clearDisabled"
          @click="clear"
        />
      </div>
    </template>
  </datetime>
</template>

<script>
import { Datetime } from '../datetime';
import ActionButton from './action-button.vue';
import CheckIcon from './icons/check.vue';
import XIcon from './icons/x.vue';
import ChevronRightIcon from './icons/chevron-right.vue';

const convertToISO = (value) => {
  if (!value) return '';
  return value.toISOString();
};

export default {
  props: {
    value: {
      type: Date,
      default: null,
    },
    min: {
      type: Date,
      default: null,
    },
    max: {
      type: Date,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    canClear: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    selectedValue: undefined,
  }),

  mounted() {
    this.$el.classList.add('bmc-input-group');
  },

  components: {
    ActionButton,
    CheckIcon,
    ChevronRightIcon,
    Datetime,
    XIcon,
  },

  computed: {
    currentValue: {
      get() {
        return this.selectedValue === undefined ? this.valueISO : this.selectedValue;
      },
      set(v) {
        this.selectedValue = v;
      },
    },
    valueISO() {
      return convertToISO(this.value);
    },
    minISO() {
      return convertToISO(this.min);
    },
    maxISO() {
      return convertToISO(this.max);
    },
    clearDisabled() {
      return !this.currentValue;
    },
  },

  methods: {
    clear() {
      this.selectedValue = '';
      this.emitChange(this.selectedValue);
    },
    reset(date) {
      this.selectedValue = date;
    },
    emitChange(value) {
      this.$emit('change', value ? new Date(value) : null);
    },
  },
};
</script>
