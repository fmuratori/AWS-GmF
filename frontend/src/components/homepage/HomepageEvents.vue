<template lang="pug">
div
  b-row(align-v="center" align-h="center" v-if="eventList.length").no-gutters
    b-col(cols=11 md=8 lg=6)  
      div.bg-white.p-4.py-5()
        b-row(no-gutters align-v="center")
          b-col(cols=6 lg="auto" order=0 order-md=0 order-lg=0).mb-3
            b-button(variant="light" @click="selectPrevious" :block="$store.getters.isMediumScreenWidth" :disabled="eventList.length == 1")
              Icon(bootstrap icon="chevron-left")
          b-col.mx-4(order=2 order-md=2 order-lg=1 )
            h3 {{ this.eventList[this.selected].eventTitle }}
            div.my-4
              b-row.no-gutters
                b-col(cols="auto")
                  Icon.mr-2(fontawesome icon="map-marker")
                b-col()
                  p {{ formatAddress(this.eventList[this.selected].address) }}
              b-row.no-gutters
                b-col(cols="auto")
                  Icon.mr-2(bootstrap icon="calendar")
                b-col
                  p.m-0 {{ dates.formatDate(this.eventList[this.selected].date) }}
              
            p.m-0 {{ this.eventList[this.selected].description.slice(0, !showFullText ? 100 : -1) }} 
              span(v-if="!showFullText") ... 
              a(href="#" v-if="!showFullText" @click="showFullText = true") Read more
              a(href="#" v-if="showFullText" @click="showFullText = false") Hide

          b-col(cols=6 lg="auto" order=1 order-md=1 order-lg=2).mb-3
            b-button(variant="light" @click="selectNext" :block="$store.getters.isMediumScreenWidth" :disabled="eventList.length == 1")
              Icon(bootstrap icon="chevron-right")
  
  b-row(align-v="center" align-h="center" v-else).no-gutters
    b-col(cols=11 md=8 lg=6)  
      b-card(bg-variant="light").p-5.m-5
        h3.text-center() No events found
</template>

<script lang="ts">
import Vue from "vue";

import Icon from "../Icon.vue";

import { Address, Event } from "../../types/types";

import { AxiosResponse } from "axios";
import api from "../../api/data";

export default Vue.extend({
  name: "HomepageEvents",
  components: {
    Icon,
  },
  data: () => {
    return {
      selected: 0,
      eventList: new Array<Event>(),
      showFullText: false,
      loadedData: false,
    };
  },
  created() {
    api
      .getNextEvents()
      .then((r: AxiosResponse): void => {
        this.loadedData = true;
        this.eventList = r.data as Event[];
      })
      .catch((): void => {
        this.loadedData = false;
      });
  },
  methods: {
    rows(): number {
      return this.eventList.length;
    },
    formatAddress(addr: Address): string {
      return addr.street + " " + addr.civicNumber + ", " + addr.city;
    },
    selectNext() {
      if (this.selected == this.eventList.length - 1) this.selected = 0;
      else this.selected++;
    },
    selectPrevious() {
      if (this.selected == 0) this.selected = this.eventList.length - 1;
      else this.selected--;
    },
  },
});
</script>

<style scoped lang="scss"></style>
