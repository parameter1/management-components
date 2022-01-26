<template>
  <action-button
    icon="sync"
    type="primary"
    :label="label"
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
    label: {
      type: String,
      default: 'Edit',
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
