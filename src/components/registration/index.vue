<template>
  <div class="bmc-registration-component">
    <div>
      <div class="bmc-registration-field bmc-registration-field--bypass-gating">
        <input
          id="bypass-gating"
          :checked="bypassGating"
          :disabled="disabled"
          type="checkbox"
          class="custom-control-input"
          @change="handleBypassChange"
        />
        <label for="bypass-gating" class="bmc-registration-field-label">
          Should this item bypass all gating rules?
        </label>
      </div>
      <div class="bmc-registration-field bmc-registration-field--requires-registration">
        <input
          id="requires-registration"
          :checked="isRequired"
          :disabled="regDisabled"
          type="checkbox"
          class="custom-control-input"
          @change="handleRequiredChange"
        >
        <label for="requires-registration" class="bmc-registration-field-label">
          {{ description }}
        </label>
      </div>
      <div class="bmc-registration-field">
        <edit-date
          :value="startDate"
          :max="endDate"
          :disabled="(regDisabled || !isRequired)"
          :can-clear="true"
          placeholder="Pick a start date..."
          title="Start Date"
          @input="$emit('change', { field: 'startDate', value: $event })"
        />
      </div>
      <div class="bmc-schedule-field">
        <edit-date
          :value="endDate"
          :min="startDate"
          :disabled="(regDisabled || !isRequired)"
          :can-clear="true"
          placeholder="Pick an end date..."
          title="End Date"
          @input="$emit('change', { field: 'endDate', value: $event })"
        />
      </div>
    </div>
  </div>
</template>
<script>

import EditDate from '../edit-date.vue';

export default {
  props: {
    description: {
      type: String,
      default: 'Does the user need to be logged in to access this content?',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    bypassGating: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    EditDate,
  },

  computed: {
    regDisabled() {
      return this.disabled || this.bypassGating;
    },
  },

  methods: {
    handleRequiredChange(event) {
      const { checked } = event.target;
      this.$emit('change', { field: 'isRequired', value: checked });
      if (!checked) {
        this.$emit('change', { field: 'startDate', value: null });
        this.$emit('change', { field: 'endDate', value: null });
      }
    },
    handleBypassChange(event) {
      const { checked } = event.target;
      if (checked) {
        this.$emit('change', { field: 'isRequired', value: false });
        this.$emit('change', { field: 'startDate', value: null });
        this.$emit('change', { field: 'endDate', value: null });
      }
      this.$emit('change', { field: 'bypassGating', value: checked });
    },
  },
};
</script>
<style lang="scss">
@import "../../scss/variables";
@import "../../scss/mixins";
@import "../../scss/components/registration";
</style>
