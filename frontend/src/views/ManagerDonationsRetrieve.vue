<template lang="pug">
  b-container(class="justify-content-center my-5")
    p RACCOLTA DONAZIONI

    b-row
      b-col(sm=12 md=6)
        div(v-for="(donation, idx) in donations" :index="idx")
          p {{ donation }}
          b-button(v-if="selectedDonations.indexOf(donation) == -1" @click="selectedDonations.push(donation)") seleziona
          b-button(v-else @click="selectedDonations.splice(selectedDonations.indexOf(donation), 1)") rimuovi
          hr
        b-button(block variant="outline-success" @click="submit") Procedi

        //- GmapMap(
        //- :center="{lat:10, lng:10}"
        //- :zoom="7"
        //- map-type-id="terrain"
        //- style="width: 500px; height: 300px")
        //-   GmapMarker(
        //-   :position="{lat:10, lng:10}"
        //-   :clickable="true"
        //-   :draggable="true"
        //-   @click="")
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import donationApi from "../api/donation";

import { Donation } from "../types";
import { AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerDonationsRetrieve",
  components: {
    Navbar,
    Sidebar,
  },
  data: () => {
    return {
      donations: new Array<Donation>(),
      selectedDonations: new Array<Donation>(),
      expirationDate: null, // moment().add(1, "days"),
      pickUpDate: "",
      pickUpPeriod: "",
    };
  },
  computed: {
    pickUpDay() { 
      return this.pickUpDate ? moment(this.pickUpDate).locale("it").format("dddd").substring(0, 3) : null;
    }
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      // TODO: mostrare uno spinner mentre sono caricati i dati
      
      this.filterDonations()
    } else {
      this.$router.replace({ name: "Login" });
    }
  },
  methods: {
    filterDonations() {
      donationApi
        .volunteerOpenDonations( this.expirationDate, this.pickUpDay, this.pickUpPeriod)
        .then((r: any) => {
          console.log(r)
          this.donations = r.data.data.list;
        })
        .catch((e) => console.log(e));
    },
    submit() {
      const promises:Promise<AxiosResponse>[] = []
      this.selectedDonations.forEach((element: Donation) => {
        const pickUpData = {
          volunteerId: this.$store.state.session.userData._id,
          period: this.pickUpPeriod,
          date: this.pickUpDate,
        }
        element.status = "selected"
        element.pickUp = pickUpData

        promises.push(donationApi.volunteerUpdateDonations(element))

      });
      
      Promise.all(promises).then((r: any) => {
          console.log(r)
          this.$bvToast.toast(
            `Donazioni prenotate per l'incarico.`,
            {
              title: "Donazioni",
              autoHideDelay: 5000,
              variant: "success",
              appendToast: false,
            }
          );
        }).catch((e:any) => console.log(e));
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

</style>
