<template>
  <action-button
    icon="checklist"
    type="success"
    :button-type="buttonType"
    :label="label"
    :loading-label="loadingLabel"
    :outline="false"
    :disabled="disabled"
    :is-loading="isLoading"
    @click="$emit('click')"
  />
</template>

<script>
import ActionButton from '../../action-button.vue';

export default {
  /**
   *
   */
  props: {
    buttonType: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: 'Add',
    },
    loadingLabel: {
      type: String,
      default: 'Adding...',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    tabindex: {
      type: String,
      default: null,
    },
  },

  /**
   *
   */
  components: { ActionButton },
};
</script>
