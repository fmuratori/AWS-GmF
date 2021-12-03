<template lang="pug">
div(class="fullheight")
  b-container(v-if="!selectedCity.name")
    b-row.justify-content-center.my-5
      b-col(lg=6, md=8, cols=11 align-self="center")
        div.mb-5
          hr.shaded
          h4.text-center
            b(v-if="this.$store.state.session.userData.type == 'user'") YOUR DONATIONS
            b(v-else) PACKS DELIVERY MAP
          hr.shaded

        b-alert(show variant="info").mb-5
          b-row(align-v="center")
            b-col(cols="auto")
              h1 
                b-icon(icon="map")
            b-col 
              p.m-0 Select a valid city to show all available packs ready for shipping.

        vue-google-autocomplete(
        id="map"
        classname="form-control"
        placeholder="Insert a city name"
        v-on:placechanged="selectCity"
        country="it"
        types="(cities)")
  
  b-row(class="fullheight justify-content-center" no-gutters v-else)

    b-col(v-if="selectedCity.name" class="fullheight" cols=10 sm=10 md=10 lg=9 order=2 order-sm=2 order-md=2 order-lg=1) 
      GmapMap(:options="mapsOptions" 
      :center="{lat:selectedCity.coordinates.x, lng:selectedCity.coordinates.y}"
      :zoom="14"
      map-type-id="terrain"
      class="fullheight")
        div 
          gmap-custom-marker(v-for="(pack, idx) in unselectedPacks" :key="idx" 
            :marker="{'lat': pack.family[0].address.coordinates.x , 'lng': pack.family[0].address.coordinates.y}"
            @click.native="openInfoWindow(pack.family[0].address.coordinates.x, pack.family[0].address.coordinates.y)")
            h1
              b-icon(icon="exclamation-circle-fill" variant="warning")
        div
          gmap-custom-marker(v-for="(pack, idx) in selectedPacks" :key="idx" 
            :marker="{'lat': pack.family[0].address.coordinates.x , 'lng': pack.family[0].address.coordinates.y}"
            @click.native="openInfoWindow(pack.family[0].address.coordinates.x, pack.family[0].address.coordinates.y)")
            h1
              //truck
              b-icon(icon="check-circle-fill" animation="fade" variant="success")
        gmap-info-window(
        v-if="windowCoordinates.x != 0 && windowCoordinates.y != 0"
        :options="{maxWidth: 300*windowPacks.length, pixelOffset: { width: 0, height: -55 } }"
        :position="{'lat': windowCoordinates.x , 'lng': windowCoordinates.y}", 
        :opened="true"
        @closeclick="closeInfoWindow")

          table
            tr
              td(v-for="(pack, idx) in windowPacks" :key:="idx") 
                p
                  span.mb-2.font-weight-bold Family:
                  br
                  span.mb-0() {{ pack.family[0].name }}
                    br
            tr
              td(v-for="(pack, idx) in windowPacks" :key:="idx") 
                p
                  span.mb-2.font-weight-bold Phone:
                  br
                  span.mb-0() {{ pack.family[0].phoneNumber }}
                    br
            tr
              td(v-for="(pack, idx) in windowPacks" :key:="idx") 
                p
                  span.mb-2.font-weight-bold Components:
                  br
                  span.mb-0() {{ pack.family[0].components }}
                    br
            tr
              td(v-for="(pack, idx) in windowPacks" :key:="idx")
                b-button.color3(v-if="!selectedPacks.includes(pack)" size="sm" block @click="selectPack(pack)") Select
                b-button.color3(v-else size="sm" block 
                @click="deselectPack(pack)") Cancel

    b-col(v-if="selectedCity.name" cols=10 sm=10 md=10 lg=3 order=1 order-sm=1 order-md=1 order-lg=2 class="fullheight-lg scrollable-lg")
      div.py-3.px-lg-2(class="d-flex flex-column" class="fullheight")
        div()
          h5
            font-awesome-icon.mr-1(icon="filter")
            span Filters
        div().mb-2
          FilterButtons(:filters="filters" :selected=0 @click="updateFilter" )

        div().mt-3
          h5
            font-awesome-icon.mr-1(icon="truck")
            span Delivery options
          b-form-group#input-group-2(label="Delivery date:", label-for="input-2")
            b-input-group
              b-form-datepicker#input-2.border-right-0(
                required,
                v-model="deliveryDate",
                reset-button,
                close-button,
                size="sm",
                :min="new Date()"
                @input="updateFilter"
              )
                b-icon(icon="x", aria-hidden="true")
        b-form-group#input-group-3(
          label="Time of day:",
          label-for="input-3"
        )
          b-form-select(
            v-model="deliveryPeriod",
            :options="['morning', 'afternoon', 'evening']",
            required,
            size="sm"
          )
        div.mt-auto.d-none.d-lg-block.d-xl-block()
          b-alert(show)
            p.m-0.p-0.text-center 
              span Selected packs: {{ selectedPacks.length }}
              br
              span &nbsp;
              a(href="#" @click="showModal") (Inspect)
          b-button.color3(variant="success" size="sm" block @click="selectPacks") Submit
          b-button(variant="secondary" size="sm" block @click="deselectCity") Select another city

    b-col(v-if="selectedCity.name" cols=10 sm=10 md=10 order=3 class="d-block d-lg-none d-xl-none")
      b-alert.mt-3(show)
        p.m-0.p-0.text-center 
          span Selected packs: {{ selectedPacks.length }}
          br
          span &nbsp;
          a(href="#" @click="showModal") (Inspect)
      b-button.color3(variant="success" size="sm" block @click="selectPacks") Submit
      b-button(variant="secondary" size="sm" block @click="deselectCity") Select another city

    b-modal(id="modal-1" title="Selected packs" size="lg" scrollable centered hide-footer v-model="isModalOpen")
      b-row(style="height: 100%;")
        b-col(v-if="selectedPacks.length" cols=10 md=10 lg=3 style="overflow: hidden;")
          b-list-group
            div(v-for="(pack, idx) in selectedPacks" :key="idx")
              b-list-group-item(:href="'#pack' + idx") Pack # {{ idx }}
        b-col(v-if="selectedPacks.length" cols=10 md=10 lg=9 style="overflow-y: scroll; height: 100%;")
          div(v-for="(pack, idx) in selectedPacks" :key="idx" :id="'pack' + idx")
            
            hr.mt-0.pt-0
            h4 Pack # {{idx}}
            
            p.mb-0 Family name:&nbsp;
              label {{ pack.family[0].name }}
            
            p.mb-0 Components:&nbsp;
              label {{ pack.family[0].components }}
            
            p.mb-0
              label Foods:
              ul
                li(v-for="(food, fidx) in packFoods(pack)" :key="fidx")
                  p.mb-0 
                    label {{ food.name }}&nbsp;
                      b-badge(v-for="(label, lidx) in food.labels" :key="lidx" variant="info") {{ label }}
                    br
                    label {{ dates.formatDatetime(food.expirationDate) }}


            //- p
            //-   label Pickup periods:
            //-     p(
            //-       v-for="(weekDayName, weekDay, widx) in weekDays",
            //-       :key="widx",
            //-       v-if="pack.deliveryPeriod.filter(p => p.weekDay == weekDay)"
            //-     )
            //-       label {{ weekDayName + ':&nbsp;' + pack.deliveryPeriod.filter(p => p.weekDay == weekDay).map((d) => d.period).join(', ') }}

        b-col(v-else)
          i No selected pack found.
          p Select a pack by clicking on a yellow exclamation mark found in the map.
          p If you can't find any mark in the map, try to select different filtering options on the right menu.
</template>

<style scoped lang="scss"></style>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import { AxiosResponse } from "axios";
import GmapCustomMarker from "vue2-gmap-custom-marker";

import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import FilterButtons from "../components/FilterButtons.vue";

import dates from "../misc/dates";
import misc from "../misc/misc";
import moment from "moment";

import packsApi from "../api/pack";
import { Pack, FindPayload, Food } from "../types";

export default Vue.extend({
  name: "ManagerPackDelivery",
  components: {
    Navbar,
    Sidebar,
    GmapCustomMarker,
    FilterButtons,
  },
  data: () => {
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
        ["all", "All", null, true],
        ["expiring_today", "Expiring today", null, true],
        ["expiring_tomorrow", "Expiring tomorros", null, true],
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
      deliveryDate: dates.formatDate(moment().toDate()),
      deliveryPeriod: "",
      isModalOpen: false,
    };
  },
  created() {
    if (!this.$store.getters.isUserLogged) this.$router.push({ name: "Login" });
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
    selectCity(addressData: { locality: any; latitude: any; longitude: any }) {
      //, placeResultData, id
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
      this.selectedPacks = [];
      console.log(mode);
      switch (mode) {
        case "expiring_today": {
          this.unselectedPacks = this.packs.filter(
            (p: Pack) => moment(p.expirationDate).toDate() == moment().toDate()
          );
          this.deliveryDate = dates.formatDate(moment().toDate());
          break;
        }
        case "expiring_tomorrow": {
          this.unselectedPacks = this.packs.filter(
            (p: Pack) =>
              moment(p.expirationDate).toDate() ==
              moment().add(1, "days").toDate()
          );
          this.deliveryDate = dates.formatDate(
            moment().add(1, "days").toDate()
          );
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
      if (!this.deliveryDate) {
        eventbus.$emit(
          "warningMessage",
          "Packs",
          "Unable to perform the requested operation. Select a valid delivery day."
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
