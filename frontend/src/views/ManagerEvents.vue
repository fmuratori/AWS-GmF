<template lang="pug">
  b-container
    div(class="justify-content-center my-5")
      p YOUR EVENTS
      b-row
        div(v-if="events.length==0") No event found for this user
        b-col(sm=12 md=6 v-for="(event, idx) in events" :index="idx")
          b-card(bg-variant="light" text-variant="dark" no-body class="mb-2")
            b-card-text
              div(class="px-4 pt-4")
                h5 {{ event.eventTitle }}
                b-row()
                  b-col(cols="auto")
                    div(class="mb-2")
                      p(class="mb-0") Date: 
                        b {{ formatDate(event) }}
                  b-col(cols="auto")
                    p(class="mb-2") {{ event.description }}
              b-button(block @click="$router.replace({name: 'ManagerEventInspect', params: {'event': event}})" class="b-card-footer-button") Edit

</template>

<script lang="ts">
import Vue from "vue";
import moment from 'moment';
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import api from "../api";

import { Event } from "../types";

export default Vue.extend({
  name: "ManagerDonationsList",
  components: {
    Navbar,
    Sidebar,
  },
  data: () => {
    return {
      events: new Array<Event>(),
    }
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      this.$store.dispatch("showSidebar");
      
      // TODO: mostrare uno spinner mentre sono caricati i dati
      api.eventList({filter: {ownerVolunteerId: this.$store.state.session.userData._id}})
      .then((r:any) => {
        this.events = r.data.data.list;
      }).catch(e => console.log(e));

      // api.donationsMessagesCounts(this.$store.state.session.userId,this.$store.getters.getSessionHeader).then((r:any) => {
      // });

    } else {
      this.$router.replace({name: "Login"});
    }
  },
  methods: {
    // getExpirationDays(donation: Event) {
    //   return moment(donation.expirationDate).diff(moment.now(), "days");
    // },
    formatDate(event: Event) {
      return moment(event.date).locale("en").format("LL");
    }
  }
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
