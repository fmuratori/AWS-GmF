<template lang="pug">
b-container
  .justify-content-center.my-5
    h3 YOUR EVENTS
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
            @click="deleteEvent(item._id)"
          ) Delete
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import api from "../api";

import { Event } from "../types";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerDonationsList",
  components: {
    Navbar,
    Sidebar,
  },
  data: () => {
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
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
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
          this.events = this.events.filter((e) => e._id != id)
          this.$root.$bvToast.toast(`Event successfully deleted.`, {
            title: "Event",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
        })
        .catch((): void => {
          this.$root.$bvToast.toast(
            `Unable to delete the event. Retry later or contact us if the problem persist.`,
            {
              title: "Event",
              autoHideDelay: 5000,
              variant: "danger",
              appendToast: false,
            }
          );
        });
    },
  },
});
</script>

<style scoped lang="scss">
</style>
