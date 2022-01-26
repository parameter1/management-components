<template>
  <edit-schedule
    v-if="isEditing"
    :schedule-id="id"
    :site="site"
    :section="section"
    :option="option"
    :start-date="start"
    :end-date="end"
    @cancel="exitEditMode"
    @update="exitEditMode"
  />
  <div v-else class="bmc-schedule-list__item bmc-schedule-list__item--view">
    <div>
      <div class="bmc-schedule-list__product-name">
        {{ site.title }}
      </div>
      <div class="bmc-schedule-list__schedule-name">
        {{ section.fullName }} ({{ option.name }})
      </div>
      <display-date :value="start" label="Starts" />
      <display-date :value="end" label="Ends" />
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
          :disabled="isMutating"
          @click="editSchedule"
        />
        <delete-button
          label="Delete schedule"
          loading-label="Deleting schedule..."
          :disabled="isMutating"
          :isLoading="isDeleting"
          @click="deleteSchedule"
        />
      </div>
    </div>
  </div>
</template>

<script>
import mutation from '../../../graphql/scheduling/mutations/delete-website-schedule';
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
      type: Number,
      required: true,
    },
    endDate: {
      type: Number,
      default: null,
    },
  },

  data: () => ({
    isDeleting: false,
    isEditing: false,
    error: null,
  }),

  components: {
    DisplayDate,
    EditButton,
    DeleteButton,
    OperationError,
    EditSchedule,
  },

  /**
   *
   */
  computed: {
    start() {
      if (this.startDate) return new Date(this.startDate);
      return null;
    },
    end() {
      if (this.endDate) return new Date(this.endDate);
      return null;
    },
    isMutating() {
      return this.isDeleting;
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
        await this.$apollo.mutate({ mutation, variables: { input }, refetchQueries: ['ListWebsiteSchedules'] });
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
