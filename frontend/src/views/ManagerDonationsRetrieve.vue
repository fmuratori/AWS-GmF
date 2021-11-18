<template lang="pug">
  div(class="gmapContainer")
    b-row(class="gmapContainer" no-gutters)
      b-col(class="gmapContainer" cols=10)
        GmapMap(:options="mapsOptions" 
        :center="{lat:44.1396, lng:12.2464}"
        :zoom="14"
        map-type-id="terrain"
        id="gmap" ref="map")
          div
            gmap-custom-marker(v-for="(donation, idx) in selectedDonations" :key="idx" 
              :marker="{'lat': donation.address.coordinates.x , 'lng': donation.address.coordinates.y}"
              @click.native="toggleInfoWindow(donation)")
              h1
                //truck
                b-icon(icon="check-circle-fill" variant="success")
          div 
            gmap-custom-marker(v-for="(donation, idx) in donations" :key="idx" 
              :marker="{'lat': donation.address.coordinates.x , 'lng': donation.address.coordinates.y}"
              @click.native="toggleInfoWindow(donation)")
              h1
                b-icon(icon="exclamation-circle-fill" variant="warning")
          gmap-info-window(
          v-if="selectedDonation"
          :options="{maxWidth: 300, pixelOffset: { width: 0, height: -55 } }"
          :position="{'lat': selectedDonation.address.coordinates.x , 'lng': selectedDonation.address.coordinates.y}", 
          :opened="true"
          @closeclick="selectedDonation={}")
            div()
              p
                span.mb-2.font-weight-bold Foods:
                br
                span.mb-0(v-for="food, idx in selectedDonation.foods") {{food}}
                  br
              hr
              p
                span.mb-2.font-weight-bold Additional info:
                br
                span.mb-0 {{ selectedDonation.additionalInformation ? selectedDonation.additionalInformation : "#" }}
              hr
              p
                span.mb-2.font-weight-bold Expiration date:
                br
                span.mb-0 {{ selectedDonation.expirationDate }}
              b-button(v-if="this.selectedDonations.includes(this.selectedDonation)" variant="danger" block 
              @click="deselectDonation()") deselect
              b-button(v-else variant="success" block @click="selectDonation()") Submit
    
            
      b-col
        div.py-3.px-2(id="filters")

          div(class="b-flex flex-column")

            div
              p FILTRI

            div()
              b-form(@submit="submit")
                b-form-group#input-group-2(label="Pick up date:", label-for="input-2")
                  b-input-group
                    b-form-datepicker#input-2.my-no-right-border(
                      required,
                      v-model="pickUpDate",
                      reset-button,
                      close-button,
                      size="sm"
                    )
                    b-input-group-append
                      b-button.my-no-left-border(
                        variant="outline-danger",
                        @click="pickUpDate = null",
                        :disabled="pickUpDate == null",
                        size="sm"
                      )
                        b-icon(icon="x", aria-hidden="true")
                
                b-form-group#input-group-3(
                  label="Time of day:",
                  label-for="input-3"
                )
                  b-form-select(
                    v-model="pickUpPeriod",
                    :options="['morning', 'afternoon', 'evening']",
                    required, 
                    size="sm"
                  )

            div.mt-auto
              p.m-0.p-0.text-center Selected donations: {{ selectedDonations.length }}
              p.text-center
                a(href="#" @click="showSelectedDonations") &nbsp;(Inspect)
              b-button(variant="success" size="sm" block) Select

</template>


<style scoped lang="scss">
@import "@/assets/style.scss";

.gmapContainer {
  height: 100%;
}

#gmap {
  height: 100%;
}

#filters {
  height: 100%;
}

</style>


<script lang="ts">
import Vue from "vue";

import GmapCustomMarker from 'vue2-gmap-custom-marker';

import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import api from "../api/donation";

import { Donation } from "../types";
import { AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerDonationsRetrieve",
  components: {
    Navbar,
    Sidebar,
    GmapCustomMarker,
  },
  data: () => {
    return {
      mapsOptions: {
        "zoomControl": true,
        "mapTypeControl": false,
        "scaleControl": false,
        "streetViewControl": false,
        "rotateControl": true,
        "fullscreenControl": true, 
        "disableDefaultUi": false,
        "clickableIcons": false },
      donations: new Array<Donation>(),
      selectedDonations: new Array<Donation>(),
      selectedDonation: null,
      pickUpDate: "",
      pickUpPeriod: "",
      isModalOpen: false
    };
  },
  watch: {
    pickUpDate: function (): void {
      this.filterDonations();
    },
    pickUpPeriod: function (): void {
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
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    toggleInfoWindow(donation: Donation) {
      this.selectedDonation = this.selectedDonation ? null : donation;
    },
    selectDonation() {
      this.selectedDonations.push(this.selectedDonation);
      this.donations.splice(this.donations.findIndex((e: Donation) => e._id == this.selectedDonation._id), 1)
      this.selectedDonation = null;
    },
    deselectDonation() {
      this.selectedDonations.splice(this.selectedDonations.findIndex((e: Donation) => e._id == this.selectedDonation._id), 1)
      this.donations.push(this.selectedDonation)
      this.selectedDonation = null;
    },
    filterDonations() {
      this.selectedDonations = [];

      // TODO: mostrare uno spinner mentre sono caricati i dati
      api
        .filterUnpickedDonations(this.pickUpDate, this.pickUpPeriod)
        .then((r: AxiosResponse<{data: Donation[]}>): void => {
          this.donations = r.data;
        })
        .catch((): void => {
          this.$root.$bvToast.toast(`Error.`, {
            title: "Donazioni",
            autoHideDelay: 5000,
            variant: "danger",
            appendToast: false,
          });
        });
    },
    showSelectedDonations() {
      this.isModalOpen = true;
    },
    submit(e: any) {
      e.preventDefault();
      if (!this.pickUpDate) {
        this.$root.$bvToast.toast(
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
          promises.push(api.editDonation(element));
        });

        Promise.all(promises)
          .then((): void => {
            this.$router.push({ name: "ManagerDonationsVolunteerList" });
            this.$root.$bvToast.toast(`Donazioni prenotate con successo.`, {
              title: "Donazioni",
              autoHideDelay: 5000,
              variant: "success",
              appendToast: false,
            });
          })
          .catch((): void => {
            this.$root.$bvToast.toast(
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
