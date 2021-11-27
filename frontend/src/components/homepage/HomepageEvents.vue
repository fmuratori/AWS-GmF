<template lang="pug">
div
  b-pagination.mb-4(
    align="center"
    v-model="currentPage",
    :total-rows="rows()",
    :per-page="perPage",
    aria-controls="eventList"
  )
  #eventList
    b-card(v-for="event in itemsForList()")
      b-row(no-gutters)
        b-col
          b-icon(icon="calendar3" font-scale="10")
        b-col
          b-card-body
            h4 
              p {{ event.eventTitle }}
            div {{ formatAddress(event.address) }}
            div {{formatDate(event.date)}}
</template>

<script lang="ts">
import Vue from "vue";
import { AxiosResponse } from "axios";
import { Address, Event } from "../../types";
import moment from "moment";

import api from "../../api/data";

export default Vue.extend({
  name: "HomepageEvents",
  data: () => {
    return {
      currentPage: 1,
      perPage: 3,
      eventList: new Array<Event>(),
    };
  },
  created() {
    api
      .getNextEvents()
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
    formatAddress(addr: Address): string {
      return addr.street + " " + addr.civicNumber + ", " + addr.city;
    },
    formatDate(date) {
      return moment(date).locale("it").format("DD-MM-YYYY");
    },
  },
});
</script>

<style scoped lang="scss"></style>
