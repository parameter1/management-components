<template>
  <action-button
    icon="trashcan"
    type="danger"
    :must-confirm="true"
    :label="label"
    :confirm-label="confirmLabel"
    :loading-label="loadingLabel"
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
    label: {
      type: String,
      default: 'Delete',
    },
    confirmLabel: {
      type: String,
      default: undefined,
    },
    loadingLabel: {
      type: String,
      default: 'Deleting...',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  /**
   *
   */
  components: { ActionButton },
};
</script>
