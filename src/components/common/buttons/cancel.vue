<template>
  <action-button
    icon="x"
    type="warning"
    :label="label"
    :show-label="true"
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
      default: 'Cancel',
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
