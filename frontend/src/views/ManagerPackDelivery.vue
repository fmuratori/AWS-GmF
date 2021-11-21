<template lang="pug">
.gmapContainer
  b-row.gmapContainer.justify-content-center(no-gutters)
    b-col.px-5.text-center.gmapContainer.align-middle(
      v-if="!selectedCity",
      cols=10,
      sm=8,
      md=7,
      lg=6,
      align-self="center"
    )
      h1.mt-5 
        b-icon.mr-2(icon="map")
        span packList map
      b-row
        b-col
          b-icon(icon="one")
      p Select a valid city to show all available packList

      vue-google-autocomplete#map(
        classname="form-control",
        placeholder="Insert a city name",
        v-on:placechanged="selectCity",
        country="it",
        types="(cities)"
      )

    b-col.gmapContainer(
      v-if="selectedCity",
      cols=10,
      sm=10,
      md=10,
      lg=9,
      order=2,
      order-sm=2,
      order-md=2,
      order-lg=1
    ) 
      GmapMap#gmap(
        :options="mapsOptions",
        :center="{ lat: selectedCity.coordinates.x, lng: selectedCity.coordinates.y }",
        :zoom="14",
        map-type-id="terrain",
        ref="map"
      )
        div 
          gmap-custom-marker(
            v-for="(pack, idx) in packList",
            :key="idx",
            :marker="getPackCoordinates(pack.familyId)",
            @click.native="toggleInfoWindow(getPackCoordinates(pack.familyId))"
          )
            h1
              b-icon(icon="exclamation-circle-fill", variant="warning")
        div
          gmap-custom-marker(
            v-for="(pack, idx) in selectedPackList",
            :key="idx",
            :marker="getPackCoordinates(pack.familyId)",
            @click.native="toggleInfoWindow(getPackCoordinates(pack.familyId))"
          )
            h1
              //truck
              b-icon(icon="check-circle-fill", variant="success")
        gmap-info-window(
          v-if="windowCoordinates",
          :options="{ maxWidth: 300 * windowPackList.length, pixelOffset: { width: 0, height: -55 } }",
          :position="getPackCoordinates(pack.familyId)",
          :opened="true",
          @closeclick="windowPackList = []"
        )
          table
            tr
              td(v-for="(pack, idx) in windowPackList", :key:="idx") 
                p
                  span.mb-2.font-weight-bold Foods:
                  br
                  span.mb-0(v-for="(food, idx) in pack.foods") {{ food }}
                    br
            tr
              td(v-for="(pack, idx) in windowPackList", :key:="idx") 
                p
                  span.mb-2.font-weight-bold Additional info:
                  br
                  span.mb-0 {{ pack.additionalInformation ? pack.additionalInformation : '#' }}
            tr
              td(v-for="(pack, idx) in windowPackList", :key:="idx")
                p
                  span.mb-2.font-weight-bold Expiration date:
                  br
                  span.mb-0 {{ moment(pack.expirationDate).format('DD-MM-YYYY') }}
            tr
              td(v-for="(pack, idx) in windowPackList", :key:="idx")
                b-button(
                  v-if="selectedPackList.includes(pack)",
                  size="sm",
                  variant="danger",
                  block,
                  @click="deselectPack(donation)"
                ) Cancel
                b-button(
                  v-else,
                  variant="success",
                  size="sm",
                  block,
                  @click="selectPack(pack)"
                ) Select

    b-col#filters.border-left(
      v-if="selectedCity",
      cols=10,
      sm=10,
      md=10,
      lg=3,
      order=1,
      order-sm=1,
      order-md=1,
      order-lg=2
    )
      b-form(@submit.stop.prevent="submit", style="height: 100%")
        .py-3.px-2.d-flex.flex-column(style="height: 100%")
          div
            h5.mb-3
              font-awesome-icon.mr-1(icon="filter")
              span Filters
          div
            b-form-group#input-group-2(
              label="Pick up date:",
              label-for="input-2"
            )
              b-input-group
                b-form-datepicker#input-2.border-right-0(
                  required,
                  v-model="form.pickUpDate",
                  reset-button,
                  close-button,
                  size="sm"
                )
                b-input-group-append
                  b-button(
                    variant="outline-danger",
                    @click="form.pickUpDate = null",
                    :disabled="form.pickUpDate == null",
                    size="sm"
                  )
                    b-icon(icon="x", aria-hidden="true")

            b-form-group#input-group-3(
              label="Time of day:",
              label-for="input-3"
            )
              b-form-select(
                v-model="form.pickUpPeriod",
                :options="['morning', 'afternoon', 'evening']",
                required,
                size="sm"
              )

          .mt-auto
            b-alert(show)
              p.m-0.p-0.text-center 
                span Selected packList: {{ selectedPackList.length }}
                br
                span &nbsp;
                a(href="#", @click="showModal") (Inspect)
            b-button(variant="success", type="submit", size="sm", block) Submit

            b-row.no-gutters(align-v="center")
              b-col.mr-2
                hr
              b-col(cols="auto")
                label or
              b-col.ml-2
                hr
            p.text-center
              a(href="#", @click="deselectCity") Select another city

  b-modal#modal-1(
    title="Selected packList",
    size="lg",
    scrollable,
    centered,
    hide-footer,
    v-model="isModalOpen"
  )
    b-row(style="height: 100%")
      b-col(cols=10, md=10, lg=3, style="overflow: hidden")
        b-list-group
          div(
            v-if="selectedPackList.length",
            v-for="(pack, idx) in selectedPackList",
            :key="idx"
          )
            b-list-group-item(:href="'#donation' + idx") Donation # {{ idx }}
      b-col(cols=10, md=10, lg=9, style="overflow-y: scroll; height: 100%")
        div(
          v-if="selectedPackList.length",
          v-for="(pack, idx) in selectedPackList",
          :key="idx",
          :id="'donation' + idx"
        )
          hr(v-if="idx != 0")
          p
            label Foods:
            ul
              li(v-for="(food, fidx) in pack.foods", :key="fidx") {{ food }}

          p Expiration date:
            label {{ pack.expirationDate }}

          p
            label Pickup periods:
              p(
                v-for="(weekDayName, weekDay, widx) in weekDays",
                :key="widx",
                v-if="pack.pickUpPeriod.filter((p) => p.weekDay == weekDay)"
              )
                label {{ weekDayName + ':&nbsp;' + pack.pickUpPeriod.filter((p) => p.weekDay == weekDay).map((d) => d.period).join(', ') }}

        div(v-else)
          i No selected donation found.
          p Select a donation by clicking on a yellow exclamation mark found in the map.
          p If you can't find any mark in the map, try to select different filtering options on the right menu.
</template>

<script lang="ts">
import Vue from "vue";
import { AxiosResponse } from "axios";
import GmapCustomMarker from "vue2-gmap-custom-marker";

import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import packApi from "../api/pack";
import familyApi from "../api/family";
import { Family, Pack, PackDeliveryPayload } from "../types";

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(
  coords1: { lat: number; lng: number },
  coords2: { lat: number; lng: number }
) {
  var R = 6371; // km
  var dLat = toRad(coords2.lat - coords1.lat);
  var dLon = toRad(coords2.lng - coords1.lng);
  var lat1Rad = toRad(coords1.lat);
  var lat2Rad = toRad(coords2.lat);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1Rad) *
      Math.cos(lat2Rad);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180;
}

export default Vue.extend({
  name: "ManagerPackDelivery",
  components: {
    Navbar,
    Sidebar,
    GmapCustomMarker,
  },
  data: () => {
    return {
      weekDays: {
        //TODO: move to constants file (also in ManagerpackListInpect and Create??)
        lun: "Lunedì",
        mar: "Martedì",
        mer: "Mercoledì",
        gio: "Giovedì",
        ven: "Venerdì",
        sab: "Sabato",
        dom: "Domenica",
      },
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
      form: {
        idList: new Array<string>(),
        deliveryVolunteerId: "",
        deliveryDate: new Date(),
        deliveryPeriod: "morning",
      } as PackDeliveryPayload,
      selectedCity: null,
      packList: new Array<Pack>(),
      familyList: new Array<Family>(),
      selectedPackList: new Array<Pack>(),
      windowPackList: new Array<Pack>(),
      windowCoordinates: null,
      pickUpDate: "",
      pickUpPeriod: "",
      isModalOpen: false,
    };
  },
  watch: {
    pickUpDate: function (): void {
      this.filterPack();
    },
    pickUpPeriod: function (): void {
      this.filterPack();
    },
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      this.form.volunteerId = this.$store.state.session.userData._id;

      this.filterPack();
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    filterPack() {
      this.selectedPack = [];

      packApi
        .packList({ filter: { status: "ready" } })
        .then((r: AxiosResponse): void => {
          this.packList = r.data as Pack[];

          const familyIdList = new Array<string>();
          this.packList.forEach((elem: Pack) => {
            familyIdList.push(elem.familyId);
          });

          familyApi
            .familyList({ filter: { _id: familyIdList } })
            .then((r: AxiosResponse<Family[]>) => {
              this.familyList = r.data;
            })
            .catch((): void => {
              this.$root.$bvToast.toast(`Error.`, {
                title: "Pack",
                autoHideDelay: 5000,
                variant: "danger",
                appendToast: false,
              });
            });
        })
        .catch((): void => {
          this.$root.$bvToast.toast(`Error.`, {
            title: "Pack",
            autoHideDelay: 5000,
            variant: "danger",
            appendToast: false,
          });
        });
    },
    getPackCoordinates(familyId: string): { lat: number; lng: number } {
      console.log("searching: " + familyId)
      const family = this.familyList.filter((e: Family) => e._id == familyId)[0];
      console.log(family)
      return {
        lat: family.address.coordinates.x,
        lng: family.address.coordinates.y,
      };
    },
    selectCity(addressData) {
      this.selectedCity = {
        name: addressData.location,
        coordinates: {
          x: addressData.latitude,
          y: addressData.longitude,
        },
      };
    },
    deselectCity() {
      this.selectedCity = null;
      this.selectedPackList = new Array<Pack>();
      this.windowPackList = new Array<Pack>();
      this.windowCoordinates = null;
    },
    toggleInfoWindow(coords: { lat: number; lng: number }) {
      this.windowPackList.splice(0, this.windowPackList.length);
      this.windowCoordinates = { x: coords.lat, y: coords.lng };
      this.packList.forEach((elem: Pack) => {
        const distance = calcCrow(
          { lat: coords.lat, lng: coords.lng },
          this.getPackCoordinates(elem.familyId)
        );
        if (distance < 1) {
          this.windowPackList.push(elem);
        }
      });
    },
    selectPack(pack: Pack) {
      this.selectedPackList.push(pack);
      this.form.idList.push(pack._id);

      this.packList.splice(
        this.packList.findIndex((e: Pack) => e._id == pack._id),
        1
      );
    },
    deselectPack(pack: Pack) {
      this.selectedPackList.splice(
        this.selectedPackList.findIndex((e: Pack) => e._id == pack._id),
        1
      );
      this.packList.push(pack);
    },
    showModal() {
      this.isModalOpen = true;
    },
    hideModal() {
      this.isModalOpen = false;
    },
    submit() {
      if (!this.pickUpDate) {
        this.$root.$bvToast.toast(`Select a valid pick up day.`, {
          title: "packList pickup",
          autoHideDelay: 5000,
          variant: "warning",
          appendToast: false,
        });
        return;
      }

      if (!this.selectedPackList.length) {
        this.$root.$bvToast.toast(`Select at least one donation.`, {
          title: "packList pickup",
          autoHideDelay: 5000,
          variant: "warning",
          appendToast: false,
        });
      }

      packApi
        .setPlannedDelivery(this.form)
        .then(() => {
          this.$router.push({ name: "ManagerPackList" });

          this.$root.$bvToast.toast(`Select at least one donation.`, {
            title: "packList pickup",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
        })
        .catch(() => {
          this.$root.$bvToast.toast(`Select at least one donation.`, {
            title: "packList pickup",
            autoHideDelay: 5000,
            variant: "warning",
            appendToast: false,
          });
        });
    },
  },
});
</script>

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
  display: hidden;
  display: visible;
}
</style>
