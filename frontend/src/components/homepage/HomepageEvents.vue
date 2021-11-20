<template lang="pug">
div
  b-pagination(
    v-model="currentPage",
    :total-rows="rows()",
    :per-page="perPage",
    aria-controls="eventList",
  )
  #eventList
    article(v-for="event in itemsForList") abc
</template>

<script lang="ts">
import { AxiosResponse } from "axios";
import Vue from "vue";
import eventApi from "../../api/event";

export default Vue.extend({
  name: "HomepageEvents",
  data: () => {
    return {
      currentPage: 1,
      perPage: 2,
      eventList: new Array<Event>(),
    };
  },
  created() {
    eventApi
      .eventList({})
      .then((r: AxiosResponse): void => {
        this.eventList = r.data as Event[];
      })
      .catch((): void => {
        console.log("error");
      });
  },
  methods: {
    rows(): number {
      return this.eventList.length;
    },
    itemsForList(): Event[] {
      return this.eventList.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    },
  },
});
</script>

<style scoped lang="scss"></style>
