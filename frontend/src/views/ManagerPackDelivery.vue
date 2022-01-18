<template lang="pug">
.fullheight
  b-container(v-if='!selectedCity.name').mb-5
    b-row.justify-content-center.my-5
      b-col(lg='6' md='8' cols='11' align-self='center')
        hr.shaded
        h4.text-center
          b DELIVER PACKS
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
  b-row.fullheight.justify-content-center(no-gutters v-else)
    b-col.fullheight(v-if='selectedCity.name' cols='12')
      b-button.filters-button.color3(@click='openMapSidebar = true;') 
        span Options

      div.submit-button
        b-button.color3(@click='showModal' block) Submit
        b-button(variant='light' block @click='deselectCity') Cancel
      
      transition(name='fade')
        div#map-sidebar(v-if='openMapSidebar')  
          b-row(align-v='center')
            b-col
              h4
                Icon.mr-1(fontawesome icon='filter')
                span Filters
            b-col(cols='auto')
              b-button(pill @click='openMapSidebar = false;' variant='light' ) 
                Icon(fontawesome icon='times')
          
          FilterButtons(:filters='filters' :selected='0' @click='updateFilter')
          hr
          h4
            Icon.mr-1(fontawesome icon='truck')
            span Delivery options
          .mt-2
            b-form-group#input-group-2(label='Delivery date:' label-for='input-2')
              b-input-group
                b-form-datepicker(locale='en' placeholder='Click to select a date' required v-model='deliveryDate' @input='updateFilter' reset-button='reset-button' close-button='close-button' size='sm' :min="moment().add(1, 'days').toDate()")
                b-input-group-append
                  b-button(size="sm" :variant="!deliveryDate ? 'outline-danger' : ''" :class="!deliveryDate ? '' : 'color3'" @click='deliveryDate=null' :disabled="deliveryDate == ''")
                    Icon(bootstrap icon='x' aria-hidden='true')
          b-form-group#input-group-3(label='Time of day:' label-for='input-3')
            b-form-select(v-model='deliveryPeriod' :options="['morning', 'afternoon', 'evening']" required size='sm')
          hr
          h4
            Icon.mr-1(fontawesome icon='info')
            span Informations
          .mt-2
            p.mb-1 City:&nbsp;
              span {{ selectedCity.name }}&nbsp;
              a(href="#" @click="deselectCity") Change
            p.mb-1 Found packs:&nbsp;
              span {{ unselectedPacks.length + selectedPacks.length }}
            p Selected packs:&nbsp;
              span {{ selectedPacks.length }}&nbsp;
              a(href="#" @click="showModal") Show
          hr
          b-button.color3(size='sm' block @click='showModal') Submit
          b-button(variant="light" size='sm' block @click='deselectCity') Cancel
      GmapMap.fullheight(:options='mapsOptions' :center='{lat:selectedCity.coordinates.x, lng:selectedCity.coordinates.y}' :zoom='14' map-type-id='terrain')
        div
          gmap-custom-marker(v-for='(pack, idx) in unselectedPacks' :key='idx' :marker="{'lat': pack.family[0].address.coordinates.x , 'lng': pack.family[0].address.coordinates.y}" @click.native='openInfoWindow(pack.family[0].address.coordinates.x, pack.family[0].address.coordinates.y)')
            h1
              b-iconstack()
                b-icon(icon='circle-fill' variant='dark' font-scale='0.4')
                b-icon(icon='exclamation-circle-fill' variant='warning' font-scale='0.4')
                b-icon(stacked icon='circle' variant='dark')
        div
          gmap-custom-marker(v-for='(pack, idx) in selectedPacks' :key='idx' :marker="{'lat': pack.family[0].address.coordinates.x , 'lng': pack.family[0].address.coordinates.y}" @click.native='openInfoWindow(pack.family[0].address.coordinates.x, pack.family[0].address.coordinates.y)')
            h1
              b-iconstack(animation='fade')
                b-icon(icon='circle-fill' variant='dark' font-scale='0.4')
                b-icon(icon='check-circle-fill' variant='success' font-scale='0.4')
                b-icon.color3(stacked icon='circle' variant='dark')
        gmap-info-window(v-if='windowCoordinates.x != 0 && windowCoordinates.y != 0' :options='{maxWidth: 300*windowPacks.length, pixelOffset: { width: 0, height: -55 } }' :position="{'lat': windowCoordinates.x , 'lng': windowCoordinates.y}" :opened='true' @closeclick='closeInfoWindow')
          table()
            tr
              td(v-for='(pack, idx) in windowPacks' :key:='idx')
                p
                  span.mb-2.font-weight-bold Expiration date:
                  br
                  span.mb-0
                    | {{ dates.formatDate(pack.expirationDate) }}
                    br
            tr
              td(v-for='(pack, idx) in windowPacks' :key:='idx')
                p
                  span.mb-2.font-weight-bold Family:
                  br
                  span.mb-0
                    | {{ pack.family[0].name }}
                    br
            tr
              td(v-for='(pack, idx) in windowPacks' :key:='idx')
                p
                  span.mb-2.font-weight-bold Phone:
                  br
                  span.mb-0
                    | {{ pack.family[0].phoneNumber }}
                    br
            tr
              td(v-for='(pack, idx) in windowPacks' :key:='idx')
                p
                  span.mb-2.font-weight-bold Components:
                  br
                  span.mb-0
                    | {{ pack.family[0].components }}
                    br
            tr
              td(v-for='(pack, idx) in windowPacks' :key:='idx')
                b-button.color3(v-if='!selectedPacks.includes(pack)' size='sm' block @click='selectPack(pack)') Select
                b-button.color3(v-else size='sm' block @click='deselectPack(pack)') Cancel
    b-modal#modal-1(title='Selected packs' size='lg' scrollable='scrollable' centered='centered' hide-footer='hide-footer' v-model='isModalOpen')
      b-row(style='height: 100%;' align-h="center")
        b-col(v-if='selectedPacks.length' cols='11' lg='3' style='overflow: hidden;')
          b-list-group
            b-list-group-item(href="#deliveryOptions") Delivery options
            div(v-for='(pack, idx) in selectedPacks' :key='idx')
              b-list-group-item(:href="'#pack' + idx") Pack # {{ idx }}
          b-button.color3.mt-2(block @click="selectPacks").mb-2 Confirm
        b-col.fullheight-lg(v-if='selectedPacks.length' cols='11' lg='9' style='overflow-y: scroll;')

          div(id="deliveryOptions")
            h4 Delivery options
            p.mb-0 Delivery day:
              span {{ dates.formatDate(deliveryDate) }}

            p Period of the day: 
              span {{ deliveryPeriod }}

          div(v-for='(pack, idx) in selectedPacks' :key='idx' :id="'pack' + idx")
            hr.mt-0.pt-0
            h4 Pack # {{idx}}
            p.mb-0
              | Family name:&nbsp;
              span {{ pack.family[0].name }}
            p.mb-0
              | Components:&nbsp;
              span {{ pack.family[0].components }}
            p.mb-0
              label Foods:
              ul
                li(v-for='(food, fidx) in packFoods(pack)' :key='fidx')
                  p.mb-0
                    label
                      | {{ food.name }}&nbsp;
                      b-badge(v-for='(label, lidx) in food.labels' :key='lidx' variant='info') {{ label }}
                    br
                    label Expired by {{ dates.formatDate(food.expirationDate) }}
        b-col(v-else)
          i No selected packs found.
          p
            i If you can&apos;t find any mark in the map, try to select different filtering options on the right menu.
</template>

<style scoped lang="scss"></style>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import dates from "../misc/dates";
import misc from "../misc/misc";
import moment from "moment";

import GmapCustomMarker from "vue2-gmap-custom-marker";
import FilterButtons from "../components/FilterButtons.vue";
import Icon from "../components/Icon.vue";

import packsApi from "../api/pack";
import { AxiosResponse } from "axios";

import { Pack, FindPayload, Food } from "../types/types";
import { ManagerPackDeliveryView } from "../types/viewTypes";

export default Vue.extend({
  name: "ManagerPackDelivery",
  components: {
    GmapCustomMarker,
    FilterButtons,
    Icon,
  },
  data: (): ManagerPackDeliveryView => {
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
      filters: [
        { name: "all", label: "All", icon: null, isVisible: true },
        {
          name: "expiring_today",
          label: "Expiring today",
          icon: null,
          isVisible: true,
        },
        {
          name: "expiring_tomorrow",
          label: "Expiring tomorros",
          icon: null,
          isVisible: true,
        },
      ],
      selectedCity: {
        name: "",
        coordinates: {
          x: 0,
          y: 0,
        },
      },
      daysToExpiration: 0,
      packs: new Array<Pack>(),
      foods: new Array<Food>(),
      selectedPacks: new Array<Pack>(),
      unselectedPacks: new Array<Pack>(),
      windowPacks: new Array<Pack>(),
      windowCoordinates: { x: 0, y: 0 },
      deliveryDate: dates.tomorrow.toDate(),
      deliveryPeriod: "morning",
      isModalOpen: false,
      openMapSidebar: true,
    };
  },
  methods: {
    packFoods(pack: Pack) {
      const packFoodsIds = pack.foodList.map(
        (f: { _id: string; foodId: string; number: number }) => f.foodId
      );
      return this.foods.filter((f: { _id: string }) =>
        packFoodsIds.includes(f._id)
      );
    },
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
      this.getPacks();
    },
    deselectCity() {
      this.selectedCity = {
        name: "",
        coordinates: {
          x: 0,
          y: 0,
        },
      };
      this.selectedPacks = [];
      this.windowPacks = new Array<Pack>();
      this.windowCoordinates = { x: 0, y: 0 };
    },
    openInfoWindow(lat: number, lng: number) {
      this.windowPacks.splice(0, this.windowPacks.length);

      // find coordinates near the clicked marked
      this.windowCoordinates = { x: lat, y: lng };
      for (const pack of this.unselectedPacks.concat(this.selectedPacks)) {
        const nearCheck = misc.areCoordinatesNear(
          lat,
          lng,
          pack.family[0].address.coordinates.x,
          pack.family[0].address.coordinates.y
        );
        if (nearCheck) {
          this.windowPacks.push(pack);
        }
      }
    },
    closeInfoWindow() {
      this.windowCoordinates = { x: 0, y: 0 };
    },
    selectPack(pack: Pack) {
      this.selectedPacks.push(pack);
      this.unselectedPacks.splice(
        this.unselectedPacks.findIndex((p: Pack) => p._id == pack._id),
        1
      );
    },
    deselectPack(pack: Pack) {
      this.selectedPacks.splice(
        this.selectedPacks.findIndex((e: Pack) => e._id == pack._id),
        1
      );
      this.unselectedPacks.push(pack);
    },
    updateFilter(mode: null | string) {
      this.closeInfoWindow();
      this.selectedPacks = [];
      switch (mode) {
        case "expiring_today": {
          this.unselectedPacks = this.packs.filter(
            (p: Pack) => moment(p.expirationDate).toDate() == moment().toDate()
          );
          this.deliveryDate = moment().toDate();
          break;
        }
        case "expiring_tomorrow": {
          this.unselectedPacks = this.packs.filter(
            (p: Pack) =>
              moment(p.expirationDate).toDate() ==
              moment().add(1, "days").toDate()
          );
          this.deliveryDate = moment().add(1, "days").toDate();
          break;
        }
        case "all": {
          this.unselectedPacks = this.packs.filter((p: Pack) =>
            dates.isFutureDate(p.expirationDate)
          );
          break;
        }
        default: {
          break;
        }
      }
    },
    getPacks() {
      this.selectedPacks = [];
      this.unselectedPacks = [];

      const payload = {
        lookup: {
          from: "families",
          localField: "familyId",
          foreignField: "_id",
          as: "family",
        },
        filter: {
          $match: {
            "family.address.city": this.selectedCity.name,
            status: "ready",
          },
        },
      } as FindPayload;

      packsApi
        .filterPackList(payload)
        .then((r: AxiosResponse<{ packs: Pack[]; foods: Food[] }>): void => {
          if (r.status == 200) {
            this.packs = r.data.packs;
            this.foods = r.data.foods;

            this.unselectedPacks = this.packs;
            this.updateFilter("all");
          }
        })
        .catch((): void => {
          eventbus.$emit(
            "errorMessage",
            "Pack",
            "Pack search with filtering options failed. Retry later or contact us if the problem persists."
          );
        });
    },
    showModal() {
      this.isModalOpen = true;
    },
    hideModal() {
      this.isModalOpen = false;
    },
    selectPacks() {
      if (!this.deliveryDate || !this.deliveryPeriod) {
        eventbus.$emit(
          "warningMessage",
          "Packs",
          "Unable to perform the requested operation. Select a valid delivery day and period."
        );
      } else if (!this.selectedPacks.length) {
        eventbus.$emit(
          "warningMessage",
          "Packs",
          "Unable to perform the requested operation. Select at least one pack available for delivery."
        );
      } else {
        eventbus.$emit("startLoading", "Selecting packs for delivery");
        const promises: Promise<AxiosResponse>[] = [];
        this.selectedPacks.forEach((element: Pack) => {
          element.status = "planned delivery";
          element.deliveryDate = new Date(this.deliveryDate);
          element.deliveryPeriod = this.deliveryPeriod;
          element.deliveryVolunteerId = this.$store.state.session.userData._id;
          promises.push(packsApi.editPack(element));
        });

        Promise.all(promises)
          .then((): void => {
            this.$router.push({ name: "ManagerPackList" });
            eventbus.$emit(
              "successMessage",
              "Packs",
              "Pack reservation submitted succesfully."
            );
          })
          .catch((): void => {
            eventbus.$emit(
              "errorMessage",
              "Packs",
              "Pack reservation submission for pick up failed. Retry later or contact us if the problem persists."
            );
          })
          .then(() => {
            eventbus.$emit("stopLoading");
          });
      }
    },
  },
});
</script>
