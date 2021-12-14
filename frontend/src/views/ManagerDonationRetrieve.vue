<template lang="pug">
.fullheight
  b-container(v-if='!selectedCity.name').mb-5
    b-row.justify-content-center.my-5
      b-col(lg='6' md='8' cols='11' align-self='center')
        hr.shaded
        h4.text-center
          b RETRIEVE DONATIONS
        hr.shaded
    b-row.justify-content-center
      b-col(lg='6' md='8' cols='11')
        b-alert(show='show' variant='info')
          b-row(align-v='center')
            b-col(cols='auto')
              h1
                Icon(bootstrap icon='map')
            b-col
              p.m-0 Select a valid city to show all available donations ready for pickup.
        vue-google-autocomplete#map(classname='form-control' placeholder='Insert a city name' @placechanged='selectCity' country='it' types='(cities)')
  b-row.fullheight.justify-content-center(v-else).no-gutters
    b-col.fullheight(v-if='selectedCity.name' cols='10' md='10' lg='9' order='2' order-sm='2' order-md='2' order-lg='1')
      GmapMap.fullheight(:options='mapsOptions' :center='{lat:selectedCity.coordinates.x, lng:selectedCity.coordinates.y}' :zoom='14' map-type-id='terrain')
        div
          gmap-custom-marker(v-for='(donation, idx) in unselectedDonations' :key='idx' :marker="{'lat': donation.address.coordinates.x , 'lng': donation.address.coordinates.y}" @click.native='openInfoWindow(donation.address.coordinates.x, donation.address.coordinates.y)')
            h1
              b-iconstack()
                b-icon(icon='circle-fill' variant='dark' font-scale='0.4')
                b-icon(icon='exclamation-circle-fill' variant='warning' font-scale='0.4')
                b-icon(stacked icon='circle' variant='dark')
        div
          gmap-custom-marker(v-for='(donation, idx) in selectedDonations' :key='idx' :marker="{'lat': donation.address.coordinates.x , 'lng': donation.address.coordinates.y}" @click.native='openInfoWindow(donation.address.coordinates.x, donation.address.coordinates.y)')
            h1 
              b-iconstack(animation='fade')
                b-icon(icon='circle-fill' variant='dark' font-scale='0.4')
                b-icon(icon='check-circle-fill' variant='success' font-scale='0.4')
                b-icon.color3(stacked icon='circle' variant='dark')
        gmap-info-window(v-if='windowCoordinates.x != 0 && windowCoordinates.y != 0' :options='{maxWidth: 300*windowDonations.length, pixelOffset: { width: 0, height: -55 } }' :position="{'lat': windowCoordinates.x , 'lng': windowCoordinates.y}" :opened='true' @closeclick='closeInfoWindow')
          table
            tr
              td(v-for='(donation, idx) in windowDonations' :key:='idx')
                p
                  span.mb-2.font-weight-bold Foods:
                  br
                  span.mb-0(v-for='food, idx in donation.foods')
                    | {{food}}
                    br
            tr
              td(v-for='(donation, idx) in windowDonations' :key:='idx')
                p
                  span.mb-2.font-weight-bold Additional info:
                  br
                  span(v-if="donation.additionalInformations") {{donation.additionalInformations}}
                  span(v-else) #
            
            tr
              td(v-for='(donation, idx) in windowDonations' :key:='idx')
                p
                  span.mb-2.font-weight-bold Expiration date:
                  br
                  span.mb-0 {{ dates.formatDate(donation.expirationDate) }}
            tr
              td(v-for='(donation, idx) in windowDonations' :key:='idx')
                b-button.color3(v-if='!selectedDonations.includes(donation)' size='sm' block='block' @click='selectDonation(donation)') Select
                b-button.color3(v-else size='sm' block='block' @click='deselectDonation(donation)') Cancel
    b-col.fullheight-lg.scrollable-lg(v-if='selectedCity.name' cols='10' md='10' lg='3' order='1' order-sm='1' order-md='1' order-lg='2')
      b-form.fullheight(@submit.stop.prevent='submit').mb-1
        .py-3.px-lg-2.d-flex.flex-column.fullheight
          div
            h5.mb-3
              font-awesome-icon.mr-1(icon='filter')
              span Filters
          b-form-group#input-group-2(label='Pick up date:' label-for='input-2')
            b-input-group
              b-form-datepicker(locale='en' placeholder='Click to select a date' required v-model='pickUpDate' @input='filterDonations' reset-button='reset-button' close-button='close-button' size='sm' :min="moment().add(1, 'days').toDate()")
              b-input-group-append
                b-button(size="sm" :variant="!pickUpDate ? 'outline-danger' : ''" :class="!pickUpDate ? '' : 'color3'" @click='pickUpDate=null' :disabled="pickUpDate == ''")
                  Icon(bootstrap icon='x' aria-hidden='true')
          b-form-group#input-group-3(label='Time of day:' label-for='input-3')
            b-form-select(v-model='pickUpPeriod' :options="['morning', 'afternoon', 'evening']"  @input='filterDonations' required size='sm')
          .mt-auto.d-none.d-lg-block.d-xl-block
            b-alert(show='show')
              p.m-0.p-0.text-center
                span Selected donations: {{ selectedDonations.length }}
                br
                span &nbsp;
                a(href='#' @click='showModal') (Inspect)
            b-button.color3(type='submit' size='sm' block='block') Submit
            b-button(variant='secondary' type='submit' size='sm' block='block' @click='deselectCity') Select another city
    b-col.d-block.d-lg-none.d-xl-none(v-if='selectedCity.name' cols='10' md='10' order='3')
      b-alert.mt-3(show='show')
        p.m-0.p-0.text-center
          span Selected donations: {{ selectedDonations.length }}
          br
          span &nbsp;
          a(href='#' @click='showModal') (Inspect)
      b-button.color3(type='submit' size='sm' block='block') Submit
      b-button(variant='secondary' type='submit' size='sm' block='block' @click='deselectCity').mb-5 Select another city
  b-modal#modal-1(title='Selected donations' size='lg' scrollable='scrollable' centered='centered' hide-footer='hide-footer' v-model='isModalOpen')
    b-row(style='height: 100%;')
      b-col(v-if='selectedDonations.length' cols='10' md='10' lg='3' style='overflow: hidden;')
        b-list-group
          div(v-for='(donation, idx) in selectedDonations' :key='idx')
            b-list-group-item(:href="'#donation' + idx") Donation # {{ idx }}
      b-col(v-if='selectedDonations.length' cols='10' md='10' lg='9' style='overflow-y: scroll; height: 100%;')
        div(v-for='(donation, idx) in selectedDonations' :key='idx' :id="'donation' + idx")
          hr.mt-0.pt-0
          h4 Donation # {{ idx }}
          b-row.mb-2
            b-col(lg=3 cols=12)
              b Foods:
            b-col
              ul
                li(v-for='(food, fidx) in donation.foods' :key='fidx') 
                  label.mb-1 {{ food }}
          b-row.mb-2
            b-col(lg=3 cols=12)
              b Additiona informations:
            b-col
              p {{ donation.additionalInformations }}          
          b-row.mb-2
            b-col(lg=3 cols=12)
              b Expiration date:&nbsp;
            b-col
              label {{ dates.formatDate(donation.expirationDate) }}
          
          b-row.mb-2
            b-col(lg=3 cols=12)
              b Pickup periods:
            b-col  
              p(v-for='(weekDayName, weekDay, widx) in constants.weekDays' :key='widx' v-if='donation.pickUpPeriod.filter(p => p.weekDay == weekDay)')
                label
                  | {{ weekDayName + &apos;:&nbsp;&apos; + donation.pickUpPeriod.filter(p =&gt; p.weekDay == weekDay).map((d) =&gt; d.period).join(&apos;, &apos;) }}
      b-col(v-else)
        i No selected donation found.
        p Select a donation by clicking on a yellow exclamation mark found in the map.
        p
          | If you can&apos;t find any mark in the map, try to select different filtering options on the right menu.

</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import misc from "../misc/misc";

import GmapCustomMarker from "vue2-gmap-custom-marker";
import Icon from "../components/Icon.vue";

import donationsApi from "../api/donation";
import { AxiosResponse } from "axios";

import { Donation } from "../types/types";
import { ManagerDonationsRetrieveView } from "../types/viewTypes";

export default Vue.extend({
  name: "ManagerDonationRetrieve",
  components: {
    GmapCustomMarker,
    Icon,
  },
  data: (): ManagerDonationsRetrieveView => {
    return {
      mapsOptions: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: true,
        disableDefaultUi: false,
        clickableIcons: false,
      },
      selectedCity: {
        name: "",
        coordinates: {
          x: 0,
          y: 0,
        },
      },
      donations: new Array<Donation>(),
      selectedDonations: new Array<Donation>(),
      windowDonations: new Array<Donation>(),
      windowCoordinates: { x: 0, y: 0 },
      pickUpDate: new Date(),
      pickUpPeriod: "morning",
      isModalOpen: false,
    };
  },
  computed: {
    unselectedDonations() {
      const selectedDonationsIds = this.selectedDonations.map((d) => d._id);
      return this.donations.filter(
        (d: Donation) => !selectedDonationsIds.includes(d._id)
      );
    },
  },
  methods: {
    selectCity(addressData: {
      locality: string;
      latitude: number;
      longitude: number;
    }) {
      this.selectedCity = {
        name: addressData.locality,
        coordinates: {
          x: addressData.latitude,
          y: addressData.longitude,
        },
      };
      this.filterDonations();
    },
    deselectCity() {
      this.selectedCity = {
        name: "",
        coordinates: {
          x: 0,
          y: 0,
        },
      };
      this.selectedDonations = [];
      this.windowDonations = new Array<Donation>();
      this.windowCoordinates = { x: 0, y: 0 };
    },
    openInfoWindow(lat: number, lng: number) {
      this.windowDonations.splice(0, this.windowDonations.length);

      this.windowCoordinates = { x: lat, y: lng };
      for (const donation of this.donations) {
        const nearCheck = misc.areCoordinatesNear(
          lat,
          lng,
          donation.address.coordinates.x,
          donation.address.coordinates.y
        );
        if (nearCheck) {
          this.windowDonations.push(donation);
        }
      }
    },
    closeInfoWindow() {
      this.windowDonations.splice(0, this.windowDonations.length);
      this.windowCoordinates = { x: 0, y: 0 };
    },
    selectDonation(donation: Donation) {
      this.selectedDonations.push(donation);
    },
    deselectDonation(donation: Donation) {
      this.selectedDonations.splice(
        this.selectedDonations.findIndex(
          (e: Donation) => e._id == donation._id
        ),
        1
      );
    },
    filterDonations() {
      this.selectedDonations = [];
      this.windowDonations.splice(0, this.windowDonations.length);
      this.windowCoordinates = { x: 0, y: 0 };

      eventbus.$emit(
        "startLoading",
        "Retrieving avaliable donations in your city."
      );
      donationsApi
        .filterUnpickedDonations(
          this.selectedCity.name,
          this.pickUpDate.toString(),
          this.pickUpPeriod
        )
        .then((r: AxiosResponse<Donation[]>): void => {
          this.donations = r.data;
        })
        .catch((): void => {
          eventbus.$emit(
            "errorMessage",
            "Donation",
            "Donation search with filtering options failed. Retry later or contact us if the problem persists."
          );
        })
        .then(() => eventbus.$emit("stopLoading"));
    },
    showModal() {
      this.isModalOpen = true;
    },
    hideModal() {
      this.isModalOpen = false;
    },
    submit() {
      if (!this.pickUpDate) {
        eventbus.$emit(
          "warningMessage",
          "Donations",
          "Unable to perform the requested operation. Select a valid pickup day."
        );
      } else if (!this.selectedDonations.length) {
        eventbus.$emit(
          "warningMessage",
          "Donations",
          "Unable to perform the requested operation. Select at least one donation available for pick up."
        );
      } else {
        const promises: Promise<AxiosResponse>[] = [];
        this.selectedDonations.forEach((element: Donation) => {
          element.status = "selected";
          element.pickUp = {
            volunteerId: this.$store.state.session.userData._id,
            period: this.pickUpPeriod,
            date: this.pickUpDate.toString(),
          };
          promises.push(donationsApi.editDonation(element));
        });

        Promise.all(promises)
          .then((): void => {
            this.$router.push({ name: "ManagerDonationList" });
            eventbus.$emit(
              "successMessage",
              "Donations",
              "Donation reservation submitted succesfully."
            );
            this.selectedDonations.forEach((element: Donation) => {
              this.$store.dispatch("sendMessage", {
                donationId: element._id,
                message:
                  "Donation selected by " +
                  this.$store.getters.userFullName +
                  " for pickup on " +
                  element.pickUp.date +
                  ", " +
                  element.pickUp.period,
                isEventMessage: true,
              });
            });
          })
          .catch((): void => {
            eventbus.$emit(
              "errorMessage",
              "Donations",
              "Donation reservation submission for pick up failed. Retry later or contact us if the problem persists."
            );
          });
      }
    },
  },
});
</script>

<style scoped lang="scss">
.map-marker {
  text-shadow: 0 0 50px red;
}
</style>
