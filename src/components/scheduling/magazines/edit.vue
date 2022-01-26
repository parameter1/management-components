<template>
  <div class="bmc-schedule-list__item bmc-schedule-list__item--edit">
    <div class="bmc-schedule-edit">
      <div class="bmc-schedule-field">
        <select-issue
          :issue="currentIssue"
          :disabled="isSaving"
          :clearable="false"
          @change="setIssue"
        />
      </div>
      <div class="bmc-schedule-field">
        <select-section
          ref="selectSection"
          :issue-id="issueId"
          :section="currentSection"
          :disabled="isSaving"
          :clearable="false"
          @change="setSection"
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
import Vue from 'vue';
import mutation from '../../../graphql/scheduling/mutations/update-magazine-schedule';
import SelectIssue from './select-issue.vue';
import SelectSection from './select-section.vue';
import CancelButton from '../../common/buttons/cancel.vue';
import SaveButton from '../../common/buttons/save.vue';
import OperationError from '../../operation-error.vue';

export default {
  props: {
    scheduleId: {
      type: String,
      required: true,
    },
    issue: {
      type: Object,
      required: true,
    },
    section: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    selectedIssue: undefined,
    selectedSection: undefined,
    isSaving: false,
    error: null,
  }),

  components: {
    SelectIssue,
    SelectSection,
    CancelButton,
    SaveButton,
    OperationError,
  },

  computed: {
    issueId() {
      if (!this.currentIssue) return null;
      return this.currentIssue.id;
    },
    currentIssue() {
      return this.selectedIssue === undefined ? this.issue : this.selectedIssue;
    },
    currentSection() {
      return this.selectedSection === undefined ? this.section : this.selectedSection;
    },
    hasIssueChanged() {
      const { currentIssue, issue } = this;
      if (currentIssue === null) return true;
      if (!issue) return false;
      return currentIssue.id !== issue.id;
    },
    hasSectionChanged() {
      const { currentSection, section } = this;
      if (currentSection === null) return true;
      if (!section) return false;
      return currentSection.id !== section.id;
    },
    hasChanged() {
      return this.hasIssueChanged || this.hasSectionChanged;
    },
    canSave() {
      return Boolean(this.currentIssue && this.currentSection);
    },
    isSaveDisabled() {
      return !this.canSave || !this.hasChanged || this.isSaving;
    },
  },

  methods: {
    setIssue(issue) {
      this.selectedIssue = issue;
      this.selectedSection = null;
      this.setSectionSelectFocus();
    },
    setSection(section) {
      this.selectedSection = section;
    },
    setSectionSelectFocus() {
      Vue.nextTick(() => this.$refs.selectSection.focus());
    },
    cancel() {
      return this.$emit('cancel');
    },
    async update() {
      this.error = null;
      this.isSaving = true;

      const payload = {
        issueId: this.currentIssue.id,
        sectionId: this.currentSection.id,
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
