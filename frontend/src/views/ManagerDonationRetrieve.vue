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
    b-col.fullheight(v-if='selectedCity.name' cols='12')
      b-button.filters-button.color3(@click='openMapSidebar = true;') 
        Icon(fontawesome icon='filter').mr-1
        span Options

      div.submit-button
        b-button.color3(@click='showModal' block='block') Submit
        b-button(variant='light' type='submit' block='block' @click='deselectCity') Cancel
      
      transition(name='fade')
        div#map-sidebar(v-if='openMapSidebar')  
          b-row(align-v='center')
            b-col
              h4
                Icon.mr-1(fontawesome icon='truck')
                span Pick up options
            b-col(cols='auto')
              b-button(pill @click='openMapSidebar = false;' variant='light' ) 
                Icon(fontawesome icon='times')
          
          b-alert(show='show' variant="warning").p-0.mt-2
            b-row(align-v='center').no-gutters
              b-col(cols='auto')
                h1.ml-2
                  Icon(bootstrap icon='exclamation')
              b-col
                p.p-2.m-0
                  | Changing your filters will automatically deselect all the selected donations.
          .mt-2
            b-form-group#input-group-2(label='Pick up date:' label-for='input-2')
              b-input-group
                b-form-datepicker(locale='en' placeholder='Click to select a date' required v-model='pickUpDate' @input='filterDonations' reset-button='reset-button' close-button='close-button' size='sm' :min="new Date()")
                b-input-group-append
                  b-button(size='sm' :variant="!pickUpDate ? 'outline-danger' : ''" :class="!pickUpDate ? '' : 'color3'" @click='pickUpDate=null' :disabled="pickUpDate == ''")
                    Icon(bootstrap icon='x' aria-hidden='true')
            b-form-group#input-group-3(label='Time of day:' label-for='input-3')
              b-form-select(v-model='pickUpPeriod' :options="['morning', 'afternoon', 'evening']"  @input='filterDonations' required size='sm')

          hr
          h4
            Icon.mr-1(fontawesome icon='info')
            span Informations
          .mt-2
            p.mb-1 City:&nbsp;
              span {{ selectedCity.name }}&nbsp;
              a(href="#" @click="deselectCity") Change
            p.mb-1 Found donations:&nbsp;
              span {{ unselectedDonations.length + selectedDonations.length }}
            p Selected donations:&nbsp;
              span {{ selectedDonations.length }}&nbsp;
              a(href="#" @click="showModal") Show
        
          b-button.color3(size='sm' block='block' @click='selectDonation(donation)') Submit
          b-button(variant="light" size='sm' block='block' @click='deselectDonation(donation)') Cancel
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
                b-button.color3(v-else variant="light" size='sm' block='block' @click='deselectDonation(donation)') Cancel
  b-modal#modal-1(title='Selected donations' size='lg' scrollable='scrollable' centered='centered' hide-footer='hide-footer' v-model='isModalOpen')
    b-row(style='height: 100%;' align-h="center")
      b-col(v-if='selectedDonations.length' cols='11' lg='3' style='overflow: hidden;')
        b-list-group
          div(v-for='(donation, idx) in selectedDonations' :key='idx')
            b-list-group-item(:href="'#donation' + idx") Donation # {{ idx }}
        b-button.color3.mt-2(block @click="submit").mb-2 Confirm
      b-col.fullheight-lg(v-if='selectedDonations.length' cols='11' lg='9' style='overflow-y: scroll;')
        div(v-for='(donation, idx) in selectedDonations' :key='idx' :id="'donation' + idx")
          hr.mt-0.pt-0
          div
            h4 Donation # {{ idx }}
            b-row.no-gutters.mb-2
              b-col(lg=3 cols=12)
                b Foods:
              b-col
                ul
                  li(v-for='(food, fidx) in donation.foods' :key='fidx') 
                    label.mb-1 {{ food }}
            b-row.no-gutters.mb-2(v-if="donation.additionalInformations")
              b-col(lg=3 cols=12)
                b Additiona informations:
              b-col
                p {{ donation.additionalInformations }}          
            b-row.no-gutters.mb-2
              b-col(lg=3 cols=12)
                b Expiration date:&nbsp;
              b-col
                label {{ dates.formatDate(donation.expirationDate) }}
            
            b-row.no-gutters.mb-2
              b-col(lg=3 cols=12)
                b Pickup periods:
              b-col  
                p(v-for='(weekDayName, weekDay, widx) in constants.weekDays' :key='widx' v-if='donation.pickUpPeriod.filter(p => p.weekDay == weekDay)')
                  label
                    | {{ weekDayName + &apos;:&nbsp;&apos; + donation.pickUpPeriod.filter(p =&gt; p.weekDay == weekDay).map((d) =&gt; d.period).join(&apos;, &apos;) }}
        
      b-col.text-center(v-else)
        p
          i No selected donation found.
        p
          i If you can&apos;t find any mark in the map, try to select different filtering options.

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
      openMapSidebar: true,
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

<style scoped lang="scss"></style>
