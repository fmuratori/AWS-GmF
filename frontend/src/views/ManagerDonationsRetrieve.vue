<template lang="pug">
  div(class="gmapContainer")
    b-row(class="gmapContainer justify-content-center" no-gutters)
      b-col(class="gmapContainer" order=2 order-sm=2 order-md=2 order-lg=1
      v-if="canShowMap")
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
                span.mb-0 {{ moment(selectedDonation.expirationDate).format("DD-MM-YYYY") }}
              b-button(v-if="this.selectedDonations.includes(this.selectedDonation)" size="sm" variant="danger" block 
              @click="deselectDonation()") Cancel
              b-button(v-else variant="success" size="sm" block @click="selectDonation()") Select

      b-col(v-else class="text-center gmapContainer align-middle" align-self="center" id="mapPlaceholder")
        h1.mt-5 
          b-icon.mr-2(icon="map")
          span Donations map
        b-row
          b-col
            b-icon(icon="one")
        p Select a valid city to show all available donations
        
        b-form-group#input-group-1(
          label="City:",
          label-for="input-1",
          @change="findCity"
        )
          b-form-input(
            type="text"
            required, 
            size="sm"
          )

      b-col(cols=10 sm=10 md=10 lg=3 order=1 order-sm=1 order-md=1 order-lg=2 class="border-left" id="filters")
        b-form(@submit="submit" style="height: 100%")
          div.py-3.px-2(class="d-flex flex-column" style="height: 100%")
            div()
              h5.mb-3
                font-awesome-icon.mr-1(icon="filter")
                span Filters
            div()
              b-form-group#input-group-2(label="Pick up date:", label-for="input-2")
                b-input-group
                  b-form-datepicker#input-2.border-right-0(
                    required,
                    v-model="pickUpDate",
                    reset-button,
                    close-button,
                    size="sm"
                  )
                  b-input-group-append
                    b-button(
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
              b-row.no-gutters
                b-col
                  hr
                b-col(cols="auto")
                  p or
                b-col
                  hr
              p.text-center
                a(href="#") Select another city
            div.mt-auto()
              b-alert(show)
                p.m-0.p-0.text-center Selected donations: {{ selectedDonations.length }}
                p.m-0.p-0.text-center
                  a(href="#" @click="showModal") &nbsp;(Inspect)
              b-button(variant="success" type="submit" size="sm" block) Submit

    b-modal(id="modal-1" title="Selected donations" scrollable centered hide-footer v-model="isModalOpen")
      div(v-if="selectedDonations.length")
        p(class="my-4" v-for="(donation, idx) in selectedDonations" :key="idx") {{ donation }}
      div(v-else)
        i No selected donation found. 
        p Select a donation by clicking on a yellow exclamation mark found in the map.
        p If you can't find any mark in the map, try to select different filtering options on the right menu.
        
</template>


<style scoped lang="scss">
@import "@/assets/style.scss";

#mapPlaceholder {
  background-color: $greyscaleE;
}

.gmapContainer {
  height: 100%;
}

#gmap {
  height: 100%;
}

#filters {
  height: 100%;

  overflow-y: scroll;
}

.hidden-md {
  display :hidden;

  display: visible;
}

</style>


<script lang="ts">
import Vue from "vue";
import { AxiosResponse } from "axios";
import GmapCustomMarker from 'vue2-gmap-custom-marker';

import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import api from "../api/donation";
import { Donation } from "../types";

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
      isModalOpen: false,
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
  computed: {
    canShowMap() {
      return this.pickUpDate && this.pickUpPeriod
    }
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
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
    showModal() {
      this.isModalOpen = true;
    },
    hideModal() {
      this.isModalOpen = false;
    },
    submit(e: any) {
      e.preventDefault();
      if (!this.pickUpDate) {
        this.$root.$bvToast.toast(
          `Select a valid pick up day.`,
          {
            title: "Donations pickup",
            autoHideDelay: 5000,
            variant: "warning",
            appendToast: false,
          }
        );
      } else if (!this.selectedDonations.length) {
        this.$root.$bvToast.toast(
          `Select at least one donation.`,
          {
            title: "Donations pickup",
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

            this.selectedDonations.forEach((element: Donation) => {
              this.$store.dispatch("sendMessage", {
                donationId: element._id,
                message: 
                "Donation selected by " + this.$store.getters.userFullName + 
                " for pickup on " + element.pickUp.date + ", " + element.pickUp.period ,
                isEventMessage: true,
              })
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
