<template>
  <div class="bmc-registration-component">
    <loading-spinner v-if="isLoading" color="primary" size="small" />
    <div v-if="content">
      <div class="bmc-registration-field bmc-registration-field--requires-registration">
        <input
          id="requires-registration"
          :checked="currentRequired"
          type="checkbox"
          class="custom-control-input"
          @change="handleIsRequiredChange()"
        >
        <label for="requires-registration" class="bmc-registration-field-label">
          {{ description }}
        </label>
      </div>
      <div class="bmc-registration-field">
        <edit-date
          :value="currentStartDate"
          :max="currentEndDate"
          :disabled="(isSaving || !currentRequired)"
          :can-clear="true"
          placeholder="Pick a start date..."
          title="Start Date"
          @change="setStartDate"
          ref="currentStartDate"
        />
      </div>
      <div class="bmc-schedule-field">
        <edit-date
          :value="currentEndDate"
          :min="currentStartDate"
          :disabled="(isSaving || !currentRequired)"
          :can-clear="true"
          placeholder="Pick an end date..."
          title="End Date"
          @change="setEndDate"
          ref="currentEndDate"
        />
      </div>
    </div>
    <div class="bmc-registration-buttons">
      <cancel-button :disabled="isSaveDisabled" @click="cancel" />
      <save-button :disabled="isSaveDisabled" :is-loading="isSaving" @click="update" />
    </div>
    <operation-error
      :error="error"
      :can-cancel="false"
      @retry="load"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag';
import mutation from '../../graphql/common/mutations/update-user-registration';
import fragment from '../../graphql/common/fragments/user-registration';
import EditDate from '../edit-date.vue';
import CancelButton from '../common/buttons/cancel.vue';
import SaveButton from '../common/buttons/save.vue';
import LoadingSpinner from '../loading-spinner.vue';
import OperationError from '../operation-error.vue';

const query = gql`
  query LoadContentRegistration($input: ContentQueryInput!) {
    content(input: $input) {
      ...ContentUserRegistrationFragment
    }
  }

  ${fragment}

`;
const clearSeconds = (date) => {
  if (date) {
    date.setSeconds(0);
    date.setMilliseconds(0);
  }
};
export default {
  props: {
    contentId: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: 'Does the user need to be logged in to access this content?',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    content: null,
    required: false,
    startDate: null,
    endDate: null,
    currentRequired: false,
    selectedStartDate: undefined,
    selectedEndDate: undefined,
    isSaving: false,
    isLoading: false,
    error: null,
  }),

  components: {
    EditDate,
    CancelButton,
    SaveButton,
    OperationError,
    LoadingSpinner,
  },

  computed: {
    currentStartDate() {
      return this.selectedStartDate;
    },
    hasStartDateChanged() {
      // return this.currentStartDate.valueOf() !== this.startDate.valueOf();
      // Current end date is set but initial was empty.
      if (this.currentStartDate && !this.startDate) return true;
      // Current end date is empty but initial was set.
      if (!this.currentStartDate && this.startDate) return true;
      // Both current and initial are empty.
      if (!this.currentStartDate && !this.startDate) return false;
      // Compare date values.
      return this.currentStartDate.valueOf() !== this.startDate.valueOf();
    },
    currentEndDate() {
      return this.selectedEndDate;
    },
    hasEndDateChanged() {
      // Current end date is set but initial was empty.
      if (this.currentEndDate && !this.endDate) return true;
      // Current end date is empty but initial was set.
      if (!this.currentEndDate && this.endDate) return true;
      // Both current and initial are empty.
      if (!this.currentEndDate && !this.endDate) return false;
      // Compare date values.
      return this.currentEndDate.valueOf() !== this.endDate.valueOf();
    },
    hasRequiredChange() {
      return this.currentRequired !== this.required;
    },
    hasChanged() {
      return this.hasStartDateChanged || this.hasEndDateChanged || this.hasRequiredChange;
    },
    isSaveDisabled() {
      return !this.hasChanged || this.isSaving;
    },
  },

  mounted() {
    this.load();
  },

  methods: {
    setStartDate(date) {
      this.selectedStartDate = date || undefined;
    },
    setEndDate(date) {
      this.selectedEndDate = date || undefined;
    },
    cancel() {
      const { startDate, endDate } = this;
      // reset selected items
      this.selectedStartDate = startDate;
      this.selectedEndDate = endDate;
      this.currentRequired = this.required;

      // Handle updating the child components for start/end
      const start = startDate ? startDate.toISOString() : '';
      const end = endDate ? endDate.toISOString() : '';
      this.$refs.currentEndDate.reset(end);
      this.$refs.currentStartDate.reset(start);

      return this.$emit('cancel');
    },
    handleIsRequiredChange() {
      const { currentRequired } = this;
      // if unchecking the current this.required = true
      if (currentRequired) {
        // clear start end on uncheck
        this.$refs.currentStartDate.clear();
        this.$refs.currentEndDate.clear();
      }
      this.currentRequired = !currentRequired;
    },
    async load() {
      const { contentId } = this;
      if (contentId && !this.isLoading) {
        this.isLoading = true;
        this.error = null;
        const input = { id: contentId };
        try {
          const { data } = await this.$apollo.query({ query, variables: { input } });
          const { content } = data;

          if (content) {
            this.content = data.content;
            const { startDate, endDate, isRequired } = this.content.userRegistration || {};
            this.startDate = startDate ? new Date(startDate) : null;
            this.selectedStartDate = this.startDate;
            this.endDate = endDate ? new Date(endDate) : null;
            this.selectedEndDate = this.endDate;
            this.required = isRequired || false;
            this.currentRequired = this.required;
          }
        } catch (e) {
          this.error = e;
        } finally {
          this.isLoading = false;
        }
      }
    },
    async update() {
      this.error = null;
      this.isSaving = true;

      // Set seconds and milliseconds to zero
      const {
        currentStartDate,
        currentEndDate,
        currentRequired,
      } = this;
      clearSeconds(currentStartDate);
      clearSeconds(currentEndDate);

      const input = {
        id: this.contentId,
        isRequired: Boolean(currentRequired),
        ...(currentStartDate && { startDate: currentStartDate.valueOf() }),
        ...(currentEndDate && { endDate: currentEndDate.valueOf() }),
      };

      try {
        const { data } = await this.$apollo.mutate({ mutation, variables: { input } });
        this.$emit('update', data.contentUserRegistration);
        this.selectedStartDate = currentStartDate;
        this.startDate = currentStartDate;
        this.selectedEndDate = currentEndDate;
        this.endDate = currentEndDate;
        this.required = currentRequired;
      } catch (e) {
        this.error = e;
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>

<style lang="scss">
@import "../../scss/variables";
@import "../../scss/mixins";
@import "../../scss/components/registration";
</style>
