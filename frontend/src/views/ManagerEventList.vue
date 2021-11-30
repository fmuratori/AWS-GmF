<template lang="pug">
b-container
  b-row.justify-content-center.my-5
    b-col(lg=6, md=8, cols=11)
      hr.shaded
      h4.text-center
        b YOUR EVENTS
      hr.shaded

  b-row.justify-content-center
    b-col(lg=4, md=8, cols=11 order-md=1 order-lg=2)
      b-alert(show)
        b-row(align-v="center")
          b-col(cols="auto")
            h1 
              b-icon(icon="info")
          b-col 
            p.m-0 Here are listed all your events, both past, present and future ones. 
      
      b-alert(show)
        b-row(align-v="center")
          b-col(cols="auto")
            h1 
              b-icon(icon="info")
          b-col 
            p.m-0 To make things easier, filter your events by status or sort them
      
      b-alert(show variant="warning").mb-5
        b-row(align-v="center")
          b-col(cols="auto")
            h1 
              b-icon(icon="exclamation")
          b-col 
            p.m-0 Past or present events cannot be modified anymore. Only future events can be deleted or edited.
    
    b-col(lg=6, md=8, cols=11 order-md=2 order-lg=1)
      b-row.mb-2(no-gutters)
        b-col(cols="3")
          p Event status:
        b-col
          FilterButtons(:filters="filters" :selected=2 
            @click="(filter) => filterBy(filter)" )

      b-row.mb-2(no-gutters)
        b-col(cols="3")
          p Sort by:
        b-col
          FilterButtons(:filters="sorters" :selected=1 @click="sortBy" )

      p(v-if="eventList.length == 0") 
        span We found no event. Be sure to select your filters selectors correctly. Click #[a(href="#", @click="$router.push({ name: 'ManagerEventCreate' })") here] to add a new event.
        
      b-card.mb-4(bg-variant="light", text-variant="dark", no-body v-for="(event, idx) in eventList" :key="idx")
        template(#header)
          h5.mb-0
            b {{ event.eventTitle }}
            span.float-right
              b-badge(v-if="dates.isPastDate(event.date)", variant="secondary") Past event
              b-badge(v-if="dates.isPresentDate(event.date)", variant="success") Today
              b-badge(v-if="dates.isFutureDate(event.date)", variant="warning") Future event
        b-card-text
          .px-4.py-3
            div
              span.mb-0 Date:&nbsp;
              span.font-weight-bold.mb-2 {{ event.date }}
            div
              span.mb-0 Address:&nbsp;
              span.font-weight-bold {{ event.address.street }} {{ event.address.civicNumber }} {{ event.address.city }}
            div
                span.mb-0 Description:&nbsp;
                span.font-weight-bold {{ event.description }}

          b-button-group.d-flex(v-if="dates.isFutureDate(event.date)")
            b-button.footerCardButton.color3(
              @click="$router.push({ name: 'ManagerEventCreate', params: { event: event } })"
            ) EDIT

            b-button.footerCardButton.color3(
              v-b-modal.modal,
              @click="deleteEventId = event._id"
            ) DELETE

  b-modal#modal(title="Delete this event?", @ok="deleteFamily(deleteEventId)")
    div This event will be deleted permanently.
    
    template(#modal-footer="{ ok, cancel }")
      b-button(variant='secondary' @click='cancel()') Cancel
      b-button.color3(@click='ok()') Confirm
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import dates from "../misc/dates";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import FilterButtons from "../components/FilterButtons.vue";

import api from "../api/event";

import { Event } from "../types";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerEventList",
  components: {
    Navbar,
    Sidebar,
    FilterButtons,
  },
  data: () => {
    return {
      statusFilter: "past", //"past", "present", "future"
      sortByMode: "eventDateAscending", // "eventDateAscending". "eventDateDescending"
      eventList: new Array<Event>(),
      eventListBackup: new Array<Event>(),
      deleteEventId: "",
      filters: [],
      sorters: [],
    };
  },
  created() {
    this.filters = [
      ["past", "Past", null, true],
      ["present", "Today", null, true],
      ["future", "Future", null, true],
    ];

    this.sorters = [
      ["eventDateAscending", "Event date", "sort-down", true],
      ["eventDateDescending", "Event date", "sort-down-alt", true],
    ];

    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      eventbus.$emit("startLoading", "Loading your events.");
      api
        .eventList({
          filter: { ownerVolunteerId: this.$store.state.session.userData._id },
        })
        .then((r: AxiosResponse): void => {
          this.eventList = r.data as Event[];
          this.eventListBackup = r.data as Event[];
        })
        .catch((e: AxiosError): void => console.log(e))
        .then(() => eventbus.$emit("stopLoading"));
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    eventDateComparer(a: Event, b: Event) {
      return new Date(a.date) < new Date(b.date) ? -1 : 1;
    },
    sortBy(mode: string) {
      this.sortByMode = mode;
      switch (mode) {
        case "eventDateAscending":
          this.eventList = this.eventList.sort(this.eventDateComparer);
          break;
        case "eventDateDescending":
          this.eventList = this.eventList
            .sort(this.eventDateComparer)
            .reverse();
          break;
        default:
          null;
      }
    },
    filterBy(statusFilter: "past" | "present" | "future" | "all") {
      this.filterByMode = statusFilter;
      switch (statusFilter) {
        case "past":
          this.eventList = this.eventListBackup.filter((d) =>
            dates.isPastDate(d.date)
          );
          break;
        case "present":
          this.eventList = this.eventListBackup.filter((d) =>
            dates.isPresentDate(d.date)
          );
          break;
        case "future":
          this.eventList = this.eventListBackup.filter((d) =>
            dates.isFutureDate(d.date)
          );
          break;
        default:
          this.eventList = this.eventListBackup;
      }
      this.sortBy(this.sortByMode);
    },
    deleteEvent(id: string): void {
      api
        .deleteEvent({ id: id })
        .then((): void => {
          this.eventList = this.eventList.filter((e) => e._id != id);
          eventbus.$emit(
            "successMessage",
            "Events",
            "Event successfully deleted."
          );
        })
        .catch((): void => {
          eventbus.$emit(
            "errorMessage",
            "Events",
            "Unable to delete the event. Retry later or contact us if the problem persists."
          );
        });
    },
  },
});
</script>

<style scoped lang="scss"></style>
