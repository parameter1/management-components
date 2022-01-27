<template>
  <form class="bmc-schedule-tab__create" @submit.prevent="save">
    <div class="bmc-schedule-tab__header bmc-schedule-tab__header--with-buttons">
      <span>Add Schedules</span>
      <add-button
        ref="button"
        button-type="submit"
        label="Add schedules"
        loading-label="Adding schedules..."
        tabindex="-1"
        :disabled="saveDisabled"
        :isLoading="isSaving"
      />
    </div>
    <div class="bmc-schedule-tab__body">
      <select-sections
        :disabled="isSaving"
        :section-ids="sectionIds"
        @change="setSelected"
        @close="setButtonFocus"
      />
      <!-- Hidden tab stop for proper button focus -->
      <span v-if="sectionIds.length" tabindex="0" />
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
import mutation from '../../../graphql/scheduling/mutations/create-website-schedules';
import SelectSections from './select-sections.vue';
import AddButton from '../../common/buttons/add.vue';
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
    sectionIds: [],
    error: null,
  }),

  /**
   *
   */
  components: { SelectSections, OperationError, AddButton },

  computed: {
    canSave() {
      return this.sectionIds.length;
    },
    saveDisabled() {
      if (!this.canSave) return true;
      return this.isSaving;
    },
  },

  methods: {
    setSelected(ids) {
      this.sectionIds = ids;
    },

    setButtonFocus() {
      setTimeout(() => this.$refs.button.$el.focus(), 1);
    },

    cancel() {
      this.error = null;
      this.sectionIds = [];
    },

    async save() {
      this.error = null;
      this.isSaving = true;
      const input = { contentId: this.contentId, sectionIds: this.sectionIds };
      try {
        await this.$apollo.mutate({ mutation, variables: { input }, refetchQueries: ['ListWebsiteSchedules'] });
        this.sectionIds = [];
      } catch (e) {
        this.error = e;
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>
