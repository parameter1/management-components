<template>
  <div class="bmc-schedule-tab__list">
    <div class="bmc-schedule-tab__header bmc-schedule-tab__header--with-buttons">
      <span>Magazine Schedules ({{ totalCount }})</span>
      <refresh-button
        label="Refresh schedules"
        :isLoading="isLoading"
        :disabled="isLoading"
        @click="refresh"
      />
    </div>
    <div class="bmc-schedule-list">
      <div
        v-if="!isLoading && !schedules.length && !error"
        class="bmc-schedule-list__item bmc-schedule-list__item--muted"
      >
        None found
      </div>
      <operation-error
        :error="error"
        :can-cancel="false"
        wrapper-class="bmc-schedule-list__item"
        @retry="refresh"
      />
      <list-item
        v-for="(schedule) in schedules"
        :key="schedule.id"
        :id="schedule.id"
        :publication="schedule.publication"
        :issue="schedule.issue"
        :section="schedule.section"
      />
    </div>
  </div>
</template>

<script>
import query from '../../../graphql/scheduling/queries/list-magazine-schedules';
import ListItem from './list-item.vue';
import OperationError from '../../operation-error.vue';
import RefreshButton from '../../common/buttons/refresh.vue';
import mapNodes from '../../utils/map-nodes';

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

  /**
   *
   */
  data: () => ({
    schedules: [],
    totalCount: 0,
    error: null,
  }),

  components: { OperationError, RefreshButton, ListItem },

  /**
   *
   */
  computed: {
    isLoading() {
      return this.$apollo.loading;
    },
  },

  /**
   *
   */
  methods: {
    refresh() {
      this.error = null;
      this.$apollo.queries.schedules.refresh();
    },
  },

  /**
   *
   */
  apollo: {
    schedules: {
      query,
      fetchPolicy: 'cache-and-network',
      variables() {
        const input = {
          contentId: this.contentId,
          pagination: { limit: 0 },
        };
        return { input };
      },
      update({ contentMagazineSchedules }) {
        if (contentMagazineSchedules) this.totalCount = contentMagazineSchedules.totalCount;
        return mapNodes(contentMagazineSchedules);
      },
      error(e) {
        this.error = e;
      },
    },
  },
};
</script>
