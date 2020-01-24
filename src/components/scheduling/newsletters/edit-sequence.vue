<template>
  <div class="bmc-input-group">
    <div class="bmc-input-group__prepend" tabindex="-1">
      <div class="bmc-input-group__text">Sequence</div>
    </div>
    <input
      type="number"
      class="bmc-form-control"
      :disabled="disabled"
      :value="sequence"
      @change="emitChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    sequence: {
      get() {
        return this.value;
      },
      set() {
      },
    },
  },

  methods: {
    emitChange(event) {
      const { value } = event.target;
      const sequence = value ? parseInt(value, 10) : 0;
      this.$emit('change', sequence);
    },
  },
};
</script>
