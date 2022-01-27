<template>
  <form class="bmc-schedule-tab__create" @submit.prevent="save">
    <div class="bmc-schedule-tab__header bmc-schedule-tab__header--with-buttons">
      <span>Add Schedule</span>
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
      <div class="bmc-schedule-field">
        <select-issue
          :issue="issue"
          :disabled="isSaving"
          @change="setIssue"
          @close="setSectionSelectFocus"
        />
      </div>
      <div class="bmc-schedule-field">
        <select-section
          ref="sectionSelect"
          :issue-id="issueId"
          :section="section"
          :disabled="isSectionDisabled"
          @change="setSection"
          @close="setButtonFocus"
        />
      </div>
      <!-- Hidden tab stop for proper button focus -->
      <span v-if="canSave" tabindex="0" />
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
import Vue from 'vue';
import mutation from '../../../graphql/scheduling/mutations/create-magazine-schedule';
import SelectIssue from './select-issue.vue';
import SelectSection from './select-section.vue';
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
    issue: null,
    section: null,
    isSaving: false,
    error: null,
  }),

  components: {
    SelectIssue,
    SelectSection,
    OperationError,
    AddButton,
  },

  computed: {
    issueId() {
      if (!this.issue) return null;
      return this.issue.id;
    },
    canSave() {
      return Boolean(this.issue) && Boolean(this.section);
    },
    saveDisabled() {
      if (!this.canSave) return true;
      return this.isSaving;
    },
    isSectionDisabled() {
      if (this.isSaving) return true;
      return !this.issue;
    },
  },

  methods: {
    setIssue(issue) {
      this.issue = issue;
      this.section = null;
    },

    setSection(section) {
      this.section = section;
    },

    setButtonFocus() {
      Vue.nextTick(() => this.$refs.button.$el.focus());
    },

    setSectionSelectFocus() {
      Vue.nextTick(() => this.$refs.sectionSelect.focus());
    },

    cancel() {
      this.error = null;
      this.issue = null;
      this.section = null;
    },
    async save() {
      this.error = null;
      this.isSaving = true;
      const input = {
        contentId: this.contentId,
        issueId: this.issue.id,
        sectionId: this.section.id,
      };
      try {
        await this.$apollo.mutate({ mutation, variables: { input }, refetchQueries: ['ListMagazineSchedules'] });
        this.issue = null;
        this.section = null;
      } catch (e) {
        this.error = e;
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>
