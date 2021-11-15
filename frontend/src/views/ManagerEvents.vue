<template lang="pug">
b-container
  .justify-content-center.my-5
    h3 YOUR EVENTS
    b-row
      div(v-if="events.length == 0") No event found for this user
      b-col(sm=12, md=6, v-for="(event, idx) in events", :key="idx")
        b-card.mb-2(bg-variant="light", text-variant="dark", no-body)
          b-card-text
            .px-4.pt-4
              h5 {{ event.eventTitle }}
              b-row
                b-col(cols="auto")
                  .mb-2
                    p.mb-0 Date:
                      b {{ formatDate(event) }}
                b-col(cols="auto")
                  p.mb-2 {{ event.description }}
            b-button(
              block,
              variant="success",
              @click="$router.push({ name: 'ManagerEventCreate', params: { event: event } })"
            ) Edit
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
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

.b-card-footer-button {
  background-color: $color3;

  border: 0px;

  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}
</style>
