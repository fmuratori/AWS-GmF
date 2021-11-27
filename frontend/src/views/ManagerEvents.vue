<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col
      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b YOUR EVENTS
      hr.sidebar-hr.my-3

      b-row
        div(v-if="events.length == 0") No event found for this user
        b-table(v-else, hover, striped, :fields="tableFields", :items="events")
          template(#cell(show_description)="row")
            b-button(@click="row.toggleDetails", size="sm") {{ row.detailsShowing ? 'Hide' : 'Show' }} description

          template(#row-details="row")
            b-card 
              b-row
                b-col {{ row.item.description }}

          template(#cell(edit)="{ item }") 
            b-button(
              block,
              variant="success",
              size="sm",
              @click="$router.push({ name: 'ManagerEventCreate', params: { event: item } })"
            ) Edit

          template(#cell(delete)="{ item }") 
            b-button(
              block,
              variant="danger",
              size="sm",
              v-b-modal.modal,
              @click="deleteEventId = item._id"
            ) Delete

        b-modal#modal(title="Confirm?", @ok="deleteEvent(deleteEventId)")
          div Confirm to delete the event
          template(#modal-cancel) Cancel
          template(#modal-ok) Confirm
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import moment from "moment";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import api from "../api/event";

import { Event } from "../types";
import { AxiosError, AxiosResponse } from "axios";
import { EventListView } from "../viewTypes";

export default Vue.extend({
  name: "ManagerDonationsList",
  components: {
    Navbar,
    Sidebar,
  },
  data: (): EventListView => {
    return {
      events: new Array<Event>(),
      tableFields: [
        {
          key: "eventTitle",
          label: "Title",
          sortable: true,
        },
        {
          key: "address",
          label: "Address",
          sortable: false,
          formatter: (addr) => {
            return addr.street + " " + addr.civicNumber + ", " + addr.city;
          },
        },
        {
          key: "date",
          label: "Date",
          sortable: true,
          formatter: (value) => {
            return moment(value).locale("en").format("LL");
          },
        },
        {
          key: "show_description",
          label: "",
          sortable: false,
        },
        {
          key: "edit",
          label: "",
          sortable: false,
        },
        {
          key: "delete",
          label: "",
          sortable: false,
        },
      ],
      deleteEventId: "",
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }
      // TODO: mostrare uno spinner mentre sono caricati i dati
      api
        .eventList({
          filter: { ownerVolunteerId: this.$store.state.session.userData._id },
        })
        .then((r: AxiosResponse): void => {
          this.events = r.data as Event[];
        })
        .catch((e: AxiosError): void => console.log(e));
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    // getExpirationDays(donation: Event) {
    //   return moment(donation.expirationDate).diff(moment.now(), "days");
    // },
    formatDate(event: Event) {
      return moment(event.date).locale("en").format("LL");
    },
    deleteEvent(id: string): void {
      api
        .deleteEvent({ id: id })
        .then((): void => {
          this.events = this.events.filter((e) => e._id != id);
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
