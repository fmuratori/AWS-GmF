<template lang="pug">

//- b-pagination.mb-4(
//-   align="center"
//-   v-model="currentPage",
//-   :total-rows="rows()",
//-   :per-page="perPage",
//-   aria-controls="eventList"
//- )
//- #eventList
//-   b-card(v-for="event in itemsForList()")
//-     b-row(no-gutters)
//-       b-col
//-         b-icon(icon="calendar3" font-scale="10")
//-       b-col
//-         b-card-body
//-           h4 
//-             p {{ event.eventTitle }}
//-           div {{ formatAddress(event.address) }}
//-           div {{formatDate(event.date)}}
b-row(align-v="center" align-h="center").no-gutters
  b-col(cols=11 md=8 lg=6)  
    div.bg-white.p-4.py-5()
      b-row(no-gutters align-v="center")
        b-col(cols=6 lg="auto" order=0 order-md=0 order-lg=0).mb-3
          b-button(variant="light" @click="selectPrevious" :block="$store.getters.isMediumScreenWidth")
            Icon(source="bt" icon="chevron-left")
        b-col.mx-4(order=2 order-md=2 order-lg=1 )
          h3 {{ this.eventList[this.selected].eventTitle }}
          div.my-4
            b-row.no-gutters
              b-col(cols="auto")
                Icon.mr-2(source="fa" icon="map-marker")
              b-col()
                p {{ formatAddress(this.eventList[this.selected].address) }}
            b-row.no-gutters
              b-col(cols="auto")
                Icon.mr-2(source="bt" icon="calendar")
              b-col
                p.m-0 {{ dates.formatDate(this.eventList[this.selected].date) }}
            
          p.m-0 {{ this.eventList[this.selected].description.slice(0, !showFullText ? 100 : -1) }} 
            span(v-if="!showFullText") ... 
            a(href="#" v-if="!showFullText" @click="showFullText = true") Read more
            a(href="#" v-if="showFullText" @click="showFullText = false") Hide

        b-col(cols=6 lg="auto" order=1 order-md=1 order-lg=2).mb-3
          b-button(variant="light" @click="selectNext" :block="$store.getters.isMediumScreenWidth")
            Icon(source="bt" icon="chevron-right")
</template>

<script lang="ts">
import Vue from "vue";

import Icon from "../Icon.vue";

import { Address, Event } from "../../types";

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
    selectNext() {
      if(this.selected == this.eventList.length - 1 ) 
        this.selected = 0;
      else 
        this.selected++;
    },
    selectPrevious() {
      if(this.selected == 0) 
        this.selected = this.eventList.length - 1;
      else 
        this.selected--;
    }
  },
});
</script>

<style scoped lang="scss"></style>
