<template>
  <form class="bmc-schedule-tab__create" @submit.prevent="save">
    <div class="bmc-schedule-tab__header bmc-schedule-tab__header--with-buttons">
      <span>Add Schedules</span>
      <add-button
        button-type="submit"
        label="Add schedules"
        loading-label="Adding schedules..."
        tabindex="-1"
        :disabled="saveDisabled"
        :isLoading="isSaving"
      />
    </div>
    <div class="bmc-schedule-tab__body">
      <div class="bmc-schedule-field">
        <select-sections
          :sections="sections"
          :disabled="isSaving"
          @change="setSections"
        />
      </div>
      <deployment-dates
        :values="deploymentDates"
        :disabled="isSaving"
        @change="setDeploymentDates"
      />
      <div class="bmc-schedule-field">
       <edit-sequence :value="sequence" :disabled="isSaving" @change="setSequence" />
      </div>
      <operation-error
        :error="error"
        wrapper-class="bmc-operation-error--margin-top"
        @retry="save"
        @cancel="cancel"
      />
    </div>
  </form>
</template>

<script>
import mutation from '../../../graphql/scheduling/mutations/create-email-schedules';
import DeploymentDates from './deployment-dates.vue';
import SelectSections from './select-sections.vue';
import EditSequence from './edit-sequence.vue';
import AddButton from '../buttons/add.vue';
import OperationError from '../../operation-error.vue';

export default {
  /**
   *
   */
  props: {
    contentId: {
      type: Number,
      required: true,
    },
  },

  data: () => ({
    isSaving: false,
    sections: [],
    deploymentDates: [],
    sequence: 0,
    error: null,
  }),

  components: {
    AddButton,
    SelectSections,
    OperationError,
    DeploymentDates,
    EditSequence,
  },

  computed: {
    canSave() {
      return this.sections.length && this.deploymentDates.length;
    },
    saveDisabled() {
      if (!this.canSave) return true;
      return this.isSaving;
    },
  },

  methods: {
    setSections(sections) {
      this.sections = sections;
    },

    setDeploymentDates(dates) {
      this.deploymentDates = dates;
    },

    setSequence(sequence) {
      this.sequence = sequence;
    },

    cancel() {
      this.error = null;
      this.sections = [];
      this.deploymentDates = [];
      this.sequence = 0;
    },

    async save() {
      this.error = null;
      this.isSaving = true;
      const input = {
        contentId: this.contentId,
        sectionIds: this.sections.map(section => section.id),
        deploymentDates: this.deploymentDates.map(date => date.valueOf()),
        sequence: this.sequence,
      };

      try {
        await this.$apollo.mutate({ mutation, variables: { input }, refetchQueries: ['ListEmailSchedules'] });
        this.sections = [];
        this.deploymentDates = [];
        this.sequence = 0;
      } catch (e) {
        this.error = e;
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>
