<template lang="pug">
  b-container
    div(class="justify-content-center my-5")
      p TUE DONAZIONI
      b-row
        b-col(sm=12 md=6 v-for="(donation, idx) in donations" :index="idx")
          b-card(bg-variant="light" text-variant="dark" no-body class="mb-2")
            b-card-text
              div(class="px-4 pt-4")
                h5 Offerta effettuata il {{ formatDonation(donation.creationDate) }}
                b-row()
                  b-col(cols="auto")
                    div(class="")
                      p(class="mb-0") Alimenti donati:
                      p(class="font-weight-bold mb-2" v-for="(food, idx) in donation.foods" :index="idx") {{ food }}
                    div(class="")
                      p(class="mb-0") Scade tra:
                      p(class="font-weight-bold mb-2") {{ getExpirationDays(donation) }} giorni
                    //- div 
                    //-   p(class="mb-0") Orari disponibili per il ritiro:
                    //-   p(class="font-weight-bold") 12/12/2012 
                    //-     span(class="font-weight-normal") Scade tra 12 giorni
                    div(class="")
                      p(class="mb-0") Luogo ritiro:
                      p(class="font-weight-bold") {{ donation.address.street + " " + donation.address.civicNumber + ", " + donation.address.city }}
                  b-col(cols="auto")
                    div(class="mb-2")
                      p(class="mb-0") Stato donazione:
                      h5
                        b-badge(v-if="donation.status == 'waiting'" variant="secondary") In attesa
                        b-badge(v-if="donation.status == 'selected'" variant="warning") Prenotato per il ritiro 
                        b-badge(v-if="donation.status == 'withdrawn'" variant="green") Ritirato
                    div(class="mb-2")
                      a(href="#") Hai # messaggi non letti
              b-button(block @click="inspectDonation(donation)" class="b-card-footer-button") Mostra

</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import api from "../api";

import { Donation } from "../types";

export default Vue.extend({
  name: "ManagerDonationsList",
  components: {
    Navbar,
    Sidebar,
  },
  data: () => {
    return {
      donations: new Array<Donation>(),
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
        .userDonationsList(
          this.$store.state.session.userData._id,
          this.$store.getters.getSessionHeader
        )
        .then((r: any) => {
          this.donations = r.data.data.list;
        })
        .catch((e) => console.log(e));

      // api.donationsMessagesCounts(this.$store.state.session.userId,this.$store.getters.getSessionHeader).then((r:any) => {
      // });
    } else {
      this.$router.replace({ name: "Login" });
    }
  },
  methods: {
    getExpirationDays(donation: Donation) {
      return moment(donation.expirationDate).diff(moment.now(), "days");
    },
    formatDonation(donation: Donation) {
      return moment(donation.creationDate).locale("it").format("LL");
    },
    inspectDonation(donation: Donation) {
      this.$router.replace({
        name: "ManagerDonationsInspect",
        params: { donation: JSON.stringify(donation) },
      });
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
