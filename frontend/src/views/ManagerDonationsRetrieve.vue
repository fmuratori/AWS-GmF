<template lang="pug">
  b-container(class="justify-content-center my-5")
    p RACCOLTA DONAZIONI

    b-row
      b-col(sm=12 md=6)
        b-form(@submit="submit")
          b-form-group(id="input-group-2" label="Data ritiro:" label-for="input-2")
            b-input-group
              b-form-datepicker(id="input-2" required v-model="pickUpDate" reset-button close-button 
              class="my-no-right-border")
              b-input-group-append
                b-button(variant="danger" class="my-no-left-border" @click="pickUpDate = null"
                :disabled="pickUpDate == null") 
                  span Cancella
                  b-icon(icon="x" aria-hidden="true")
          b-form-group(id="input-group-3" label="Periodo della giornata:" label-for="input-3")
            b-form-select(v-model="pickUpPeriod" :options="['morning', 'afternoon', 'evening']" required)

          div(v-for="(donation, idx) in donations" :key="idx")
            p {{ donation }}
            b-button(v-if="selectedDonations.indexOf(donation) == -1" @click="selectedDonations.push(donation)") seleziona
            b-button(v-else @click="selectedDonations.splice(selectedDonations.indexOf(donation), 1)") rimuovi
            hr

          b-button(block variant="outline-success" type="submit") Procedi

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
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

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
      pickUpDate: "",
      pickUpPeriod: "",
    };
  },
  watch: {
    pickUpDate: function (val, oldVal) {
      this.filterDonations();
    },
    pickUpPeriod: function (val, oldVal) {
      this.filterDonations();
    },
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      this.filterDonations();
    } else {
      this.$router.replace({ name: "Login" });
    }
  },
  methods: {
    filterDonations() {
      this.selectedDonations = [];

      // TODO: mostrare uno spinner mentre sono caricati i dati
      donationApi
        .filterUnpickedDonations(this.pickUpDate, this.pickUpPeriod)
        .then((r: any) => {
          this.donations = r.data.data.list;
        })
        .catch((e) => console.log(e));
    },
    submit(e: any) {
      e.preventDefault();
      if (!this.pickUpDate) {
        this.$bvToast.toast(
          `Selezionare il giorno in cui verrà effettuato il ritiro della donazione.`,
          {
            title: "Donazione",
            autoHideDelay: 5000,
            variant: "warning",
            appendToast: false,
          }
        );
      } else {
        const promises: Promise<AxiosResponse>[] = [];
        this.selectedDonations.forEach((element: Donation) => {
          element.status = "selected";
          element.pickUp = {
            volunteerId: this.$store.state.session.userData._id,
            period: this.pickUpPeriod,
            date: this.pickUpDate,
          };
          promises.push(donationApi.editDonation(element));
        });

        Promise.all(promises)
          .then((r: any) => {
            this.$router.replace({ name: "ManagerDonationsVolunteerList" });
            this.$bvToast.toast(`Donazioni prenotate con successo.`, {
              title: "Donazioni",
              autoHideDelay: 5000,
              variant: "success",
              appendToast: false,
            });
          })
          .catch((e: any) => {
            console.log(e);
            this.$bvToast.toast(
              `Impossibile prenotare le donazioni selezionate.`,
              {
                title: "Donazioni",
                autoHideDelay: 5000,
                variant: "danger",
                appendToast: false,
              }
            );
          });
      }
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";
</style>
