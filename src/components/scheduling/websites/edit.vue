<template>
  <div class="bmc-schedule-list__item bmc-schedule-list__item--edit">
    <div class="bmc-schedule-list__product-name">
      {{ currentSection.site.title }}
    </div>
    <div class="bmc-schedule-edit">
      <div class="bmc-schedule-field">
        <section-select
          :section="currentSection"
          :disabled="isSaving"
          @change="setSection"
        />
      </div>
      <div class="bmc-schedule-field">
        <option-select
          :site-id="currentSection.site.id"
          :option="currentOption"
          :disabled="isSaving"
          @change="setOption"
        />
      </div>
      <div class="bmc-schedule-field">
        <edit-date
          :value="currentStartDate"
          :max="currentEndDate"
          :disabled="isSaving"
          placeholder="Pick a start date..."
          title="Start Date"
          @input="setStartDate"
        />
      </div>
      <div class="bmc-schedule-field">
        <edit-date
          :value="currentEndDate"
          :min="currentStartDate"
          :disabled="isSaving"
          :can-clear="true"
          placeholder="Pick an end date..."
          title="End Date"
          @input="setEndDate"
        />
      </div>
    </div>
    <div class="bmc-schedule-edit__buttons">
      <cancel-button :disabled="isSaving" @click="cancel" />
      <save-button :disabled="isSaveDisabled" :is-loading="isSaving" @click="update" />
    </div>
    <operation-error
      :error="error"
      wrapper-class="bmc-operation-error--margin-top"
      @retry="update"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import mutation from '../../../graphql/scheduling/mutations/update-website-schedule';
import EditDate from '../../edit-date.vue';
import SectionSelect from './section-select.vue';
import OptionSelect from './option-select.vue';
import CancelButton from '../../common/buttons/cancel.vue';
import SaveButton from '../../common/buttons/save.vue';
import OperationError from '../../operation-error.vue';

const clearSeconds = (date) => {
  if (date) {
    date.setSeconds(0);
    date.setMilliseconds(0);
  }
};

export default {
  props: {
    scheduleId: {
      type: String,
      required: true,
    },
    site: {
      type: Object,
      required: true,
    },
    section: {
      type: Object,
      required: true,
    },
    option: {
      type: Object,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },

  data: () => ({
    selectedSection: null,
    selectedOption: undefined,
    selectedStartDate: null,
    selectedEndDate: undefined,
    isSaving: false,
    error: null,
  }),

  components: {
    EditDate,
    SectionSelect,
    OptionSelect,
    CancelButton,
    SaveButton,
    OperationError,
  },

  computed: {
    currentSection() {
      return this.selectedSection || this.section;
    },
    hasSectionChanged() {
      return this.currentSection.id !== this.section.id;
    },
    currentOption() {
      return this.selectedOption === undefined ? this.option : this.selectedOption;
    },
    hasOptionChanged() {
      if (this.currentOption === null) return true;
      return this.currentOption.id !== this.option.id;
    },
    currentStartDate() {
      return this.selectedStartDate || this.startDate;
    },
    hasStartDateChanged() {
      return this.currentStartDate.valueOf() !== this.startDate.valueOf();
    },
    currentEndDate() {
      return this.selectedEndDate === undefined ? this.endDate : this.selectedEndDate;
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
    hasChanged() {
      return this.hasSectionChanged
        || this.hasOptionChanged
        || this.hasStartDateChanged
        || this.hasEndDateChanged;
    },
    canSave() {
      return Boolean(this.currentSection && this.currentOption && this.currentStartDate);
    },
    isSaveDisabled() {
      return !this.canSave || !this.hasChanged || this.isSaving;
    },
  },

  methods: {
    setSection(section) {
      this.selectedSection = section;
    },
    setOption(option) {
      this.selectedOption = option;
    },
    setStartDate(date) {
      this.selectedStartDate = date;
    },
    setEndDate(date) {
      this.selectedEndDate = date;
    },
    cancel() {
      return this.$emit('cancel');
    },
    async update() {
      this.error = null;
      this.isSaving = true;

      // Set seconds and milliseconds to zero
      const { currentStartDate, currentEndDate } = this;
      clearSeconds(currentStartDate);
      clearSeconds(currentEndDate);

      const payload = {
        sectionId: this.currentSection.id,
        optionId: this.currentOption.id,
        startDate: currentStartDate.valueOf(),
        ...(currentEndDate && { endDate: currentEndDate.valueOf() }),
      };
      const input = { id: this.scheduleId, payload };

      try {
        await this.$apollo.mutate({ mutation, variables: { input } });
        this.$emit('update');
      } catch (e) {
        this.error = e;
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>
