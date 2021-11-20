<template lang="pug">
  div(class="gmapContainer")
    b-row(class="gmapContainer justify-content-center" no-gutters)

      b-col(v-if="!selectedCity" cols=10 sm=8 md=7 lg=6 class="px-5 text-center gmapContainer align-middle" align-self="center")
        h1.mt-5 
          b-icon.mr-2(icon="map")
          span Donations map
        b-row
          b-col
            b-icon(icon="one")
        p Select a valid city to show all available donations

        vue-google-autocomplete(
        id="map"
        classname="form-control"
        placeholder="Insert a city name"
        v-on:placechanged="selectCity"
        country="it"
        types="(cities)")

      b-col(v-if="selectedCity" class="gmapContainer" cols=10 sm=10 md=10 lg=9 order=2 order-sm=2 order-md=2 order-lg=1) 
        GmapMap(:options="mapsOptions" 
        :center="{lat:selectedCity.coordinates.x, lng:selectedCity.coordinates.y}"
        :zoom="14"
        map-type-id="terrain"
        id="gmap" ref="map")
          div 
            gmap-custom-marker(v-for="(donation, idx) in donations" :key="idx" 
              :marker="{'lat': donation.address.coordinates.x , 'lng': donation.address.coordinates.y}"
              @click.native="toggleInfoWindow(donation.address.coordinates.x, donation.address.coordinates.y)")
              h1
                b-icon(icon="exclamation-circle-fill" variant="warning")
          div
            gmap-custom-marker(v-for="(donation, idx) in selectedDonations" :key="idx" 
              :marker="{'lat': donation.address.coordinates.x , 'lng': donation.address.coordinates.y}"
              @click.native="toggleInfoWindow(donation.address.coordinates.x, donation.address.coordinates.y)")
              h1
                //truck
                b-icon(icon="check-circle-fill" variant="success")
          gmap-info-window(
          v-if="windowCoordinates"
          :options="{maxWidth: 300*windowDonations.length, pixelOffset: { width: 0, height: -55 } }"
          :position="{'lat': windowCoordinates.x , 'lng': windowCoordinates.y}", 
          :opened="true"
          @closeclick="windowDonations=[]")

            table
              tr
                td(v-for="(donation, idx) in windowDonations" :key:="idx") 
                  p
                    span.mb-2.font-weight-bold Foods:
                    br
                    span.mb-0(v-for="food, idx in donation.foods") {{food}}
                      br
              tr
                td(v-for="(donation, idx) in windowDonations" :key:="idx") 
                  p
                    span.mb-2.font-weight-bold Additional info:
                    br
                    span.mb-0 {{ donation.additionalInformation ? donation.additionalInformation : "#" }}
              tr
                td(v-for="(donation, idx) in windowDonations" :key:="idx")
                  p
                    span.mb-2.font-weight-bold Expiration date:
                    br
                    span.mb-0 {{ moment(donation.expirationDate).format("DD-MM-YYYY") }}
              tr
                td(v-for="(donation, idx) in windowDonations" :key:="idx")
                  b-button(v-if="selectedDonations.includes(donation)" size="sm" variant="danger" block 
                  @click="deselectDonation(donation)") Cancel
                  b-button(v-else variant="success" size="sm" block @click="selectDonation(donation)") Select



      b-col(v-if="selectedCity" cols=10 sm=10 md=10 lg=3 order=1 order-sm=1 order-md=1 order-lg=2 class="border-left" id="filters")
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
            div.mt-auto()
              b-alert(show)
                p.m-0.p-0.text-center 
                  span Selected donations: {{ selectedDonations.length }}
                  br
                  span &nbsp;
                  a(href="#" @click="showModal") (Inspect)
              b-button(variant="success" type="submit" size="sm" block) Submit

              b-row.no-gutters(align-v="center")
                b-col.mr-2
                  hr
                b-col(cols="auto")
                  label or
                b-col.ml-2
                  hr
              p.text-center
                a(href="#" @click="deselectCity") Select another city

    b-modal(id="modal-1" title="Selected donations" size="lg" scrollable centered hide-footer v-model="isModalOpen")
      b-row(style="height: 100%;")
        b-col(cols=10 md=10 lg=3 style="overflow: hidden;")
          b-list-group
            div(v-if="selectedDonations.length" v-for="(donation, idx) in selectedDonations" :key="idx")
              b-list-group-item(:href="'#donation' + idx") Donation # {{ idx }}
        b-col(cols=10 md=10 lg=9 style="overflow-y: scroll; height: 100%;")
          div(v-if="selectedDonations.length" v-for="(donation, idx) in selectedDonations" :key="idx" :id="'donation' + idx")
            hr(v-if="idx != 0")
            p
              label Foods:
              ul
                li(v-for="(food, fidx) in donation.foods" :key="fidx") {{ food }}

            p Expiration date:
              label {{ donation.expirationDate }}

            p
              label Pickup periods:
                p(
                  v-for="(weekDayName, weekDay, widx) in weekDays",
                  :key="widx",
                  v-if="donation.pickUpPeriod.filter(p => p.weekDay == weekDay)"
                )
                  label {{ weekDayName + ':&nbsp;' + donation.pickUpPeriod.filter(p => p.weekDay == weekDay).map((d) => d.period).join(', ') }}

          div(v-else)
            i No selected donation found. 
            p Select a donation by clicking on a yellow exclamation mark found in the map.
            p If you can't find any mark in the map, try to select different filtering options on the right menu.
        
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
import GmapCustomMarker from "vue2-gmap-custom-marker";

import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import donationsApi from "../api/donation";
import { Donation } from "../types";

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1Rad = toRad(lat1);
  var lat2Rad = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1Rad) * Math.cos(lat2Rad); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}

export default Vue.extend({
  name: "ManagerDonationsRetrieve",
  components: {
    Navbar,
    Sidebar,
    GmapCustomMarker,
  },
  data: () => {
    return {
      weekDays: { //TODO: move to constants file (also in ManagerDonationsInpect and Create??)
        lun: "Lunedì",
        mar: "Martedì",
        mer: "Mercoledì",
        gio: "Giovedì",
        ven: "Venerdì",
        sab: "Sabato",
        dom: "Domenica",
      },
      mapsOptions: {
        "zoomControl": true,
        "mapTypeControl": false,
        "scaleControl": false,
        "streetViewControl": false,
        "rotateControl": true,
        "fullscreenControl": true, 
        "disableDefaultUi": false,
        "clickableIcons": false },
      selectedCity: null,
      donations: new Array<Donation>(),
      selectedDonations: new Array<Donation>(),
      windowDonations: [],
      windowCoordinates: null,
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
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      this.filterDonations();
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    selectCity(addressData, placeResultData, id) {
      this.selectedCity = {
        name: addressData.location,
        coordinates: {
          x: addressData.latitude,
          y: addressData.longitude,
        }
      }
    },
    deselectCity() {
      this.selectedCity = null;
      this.selectedDonations = null;
      this.windowDonations = null;
      this.windowCoordinates = null;
    },
    toggleInfoWindow(lat: number , lng: number) {
      this.windowDonations.splice(0, this.windowDonations.length);
      this.windowCoordinates = {x: lat, y: lng};
      for (const donation of this.donations) {
        const distance = calcCrow(lat, lng, donation.address.coordinates.x, donation.address.coordinates.y)
        if (distance < 1) {
          this.windowDonations.push(donation);
        }
      }
    },
    selectDonation(donation: Donation) {
      this.selectedDonations.push(donation);
      this.donations.splice(this.donations.findIndex((e: Donation) => e._id == donation._id), 1)
    },
    deselectDonation(donation: Donation) {
      this.selectedDonations.splice(this.selectedDonations.findIndex((e: Donation) => e._id == donation._id), 1)
      this.donations.push(donation)
    },
    filterDonations() {
      this.selectedDonations = [];

      // TODO: mostrare uno spinner mentre sono caricati i dati
      donationsApi
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
          promises.push(donationsApi.editDonation(element));
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
