<template>
  <edit-schedule
    v-if="isEditing"
    :schedule-id="id"
    :section="section"
    :deployment-date="start"
    :sequence="sequence"
    @cancel="exitEditMode"
    @update="exitEditMode"
  />
  <div v-else class="bmc-schedule-list__item bmc-schedule-list__item--view">
    <div>
      <div class="bmc-schedule-list__product-name">
        {{ newsletter.name }}
      </div>
      <div class="bmc-schedule-list__schedule-name">
        {{ section.name }}
      </div>
      <display-date :value="start" />
      <div class="bmc-schedule-list__sequence">Sequence: {{ sequence }}</div>
      <operation-error
        :error="error"
        wrapper-class="bmc-operation-error--margin-top"
        @retry="deleteSchedule"
        @cancel="cancelDelete"
      />
    </div>

    <div class="ml-2">
      <div class="bmc-button-group" role="group">
        <edit-button
          label="Edit schedule"
          :disabled="isDeleting"
          @click="editSchedule"
        />
        <delete-button
          label="Delete schedule"
          loading-label="Deleting schedule..."
          :disabled="isDeleting"
          :isLoading="isDeleting"
          @click="deleteSchedule"
        />
      </div>
    </div>
  </div>
</template>

<script>
import mutation from '../../../graphql/scheduling/mutations/delete-email-schedule';
import DisplayDate from '../../display-date.vue';
import EditSchedule from './edit.vue';
import EditButton from '../../common/buttons/edit.vue';
import DeleteButton from '../../common/buttons/delete.vue';
import OperationError from '../../operation-error.vue';

export default {
  /**
   *
   */
  props: {
    id: {
      type: String,
      required: true,
    },
    newsletter: {
      type: Object,
      required: true,
    },
    section: {
      type: Object,
      required: true,
    },
    deploymentDate: {
      type: Number,
      required: true,
    },
    sequence: {
      type: Number,
      default: 0,
    },
  },

  data: () => ({
    isDeleting: false,
    isEditing: false,
    error: null,
  }),

  components: {
    EditSchedule,
    DisplayDate,
    EditButton,
    DeleteButton,
    OperationError,
  },

  computed: {
    start() {
      if (this.deploymentDate) return new Date(this.deploymentDate);
      return null;
    },
  },

  /**
   *
   */
  methods: {
    /**
     *
     */
    async editSchedule() {
      this.isEditing = true;
    },

    /**
     *
     */
    async deleteSchedule() {
      this.error = null;
      this.isDeleting = true;
      const input = { id: this.id };
      try {
        await this.$apollo.mutate({ mutation, variables: { input }, refetchQueries: ['ListEmailSchedules'] });
      } catch (e) {
        this.error = e;
      } finally {
        this.isDeleting = false;
      }
    },

    exitEditMode() {
      this.isEditing = false;
    },

    /**
     *
     */
    cancelDelete() {
      this.error = null;
    },
  },
};
</script>
