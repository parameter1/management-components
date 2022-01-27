<template>
  <action-button
    icon="check"
    type="success"
    :label="label"
    :loading-label="loadingLabel"
    :outline="false"
    :show-label="true"
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
      default: 'Save',
    },
    loadingLabel: {
      type: String,
      default: 'Saving...',
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
