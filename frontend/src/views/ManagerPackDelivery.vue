<template lang="pug">
  div(class="fullheight")
    b-row(class="fullheight justify-content-center" no-gutters)

      b-col(v-if="!selectedCity" cols=10 sm=8 md=7 lg=6 class="px-5 text-center fullheight align-middle" align-self="center")
        h1.mt-5 
          b-icon.mr-2(icon="map")
          span Packs map
        b-row
          b-col
            b-icon(icon="one")
        p Select a valid city to show all available packs

        vue-google-autocomplete(
        id="map"
        classname="form-control"
        placeholder="Insert a city name"
        v-on:placechanged="selectCity"
        country="it"
        types="(cities)")

      b-col(v-if="selectedCity" class="fullheight" cols=10 sm=10 md=10 lg=9 order=2 order-sm=2 order-md=2 order-lg=1) 
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
                b-icon(icon="check-circle-fill" variant="success")
          gmap-info-window(
          v-if="windowCoordinates"
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
                  b-button(v-if="!selectedPacks.includes(pack)"  variant="success" size="sm" block @click="selectPack(pack)") Select
                  b-button(v-else size="sm" variant="danger" block 
                  @click="deselectPack(pack)") Cancel

      b-col(v-if="selectedCity" cols=10 sm=10 md=10 lg=3 order=1 order-sm=1 order-md=1 order-lg=2 class="fullheight-lg scrollable-lg")
        b-form(@submit="submit" class="fullheight")
          div.py-3.px-lg-2(class="d-flex flex-column" class="fullheight")
            div()
              h5.mb-3
                font-awesome-icon.mr-1(icon="filter")
                span Filters
            div()
              b-form-group#input-group-2(label="Pick up date:", label-for="input-2")
                b-input-group
                  b-form-datepicker#input-2.border-right-0(
                    required,
                    v-model="deliveryDate",
                    reset-button,
                    close-button,
                    size="sm",
                    :min="new Date()"
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
              b-button(variant="success" type="submit" size="sm" block) Submit
              b-button(variant="danger" type="submit" size="sm" block @click="deselectCity") Select another city

      b-col(v-if="selectedCity" cols=10 sm=10 md=10 order=3 class="d-block d-lg-none d-xl-none")
        b-alert.mt-3(show)
          p.m-0.p-0.text-center 
            span Selected packs: {{ selectedPacks.length }}
            br
            span &nbsp;
            a(href="#" @click="showModal") (Inspect)
        b-button(variant="success" type="submit" size="sm" block) Submit
        b-button(variant="danger" type="submit" size="sm" block @click="deselectCity") Select another city

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
            
            p Family name:
              label {{ pack.family[0].name }}
            
            p Components:
              label {{ pack.family[0].components }}
            
            p
              label Foods:
              ul
                li(v-for="(food, fidx) in packFoods(pack)" :key="fidx")
                  p 
                    label {{ food.name }}
                    br
                    label {{ food.labels }}
                    br
                    label {{ moment(food.expirationDate).calendar() }}


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


<style scoped lang="scss">
@import "@/assets/style.scss";


#filters {
  height: 100%;

  overflow-y: scroll;
}

.fullheight {
  height: 100%;
}

.fullheight-lg {
  
  @include md {
    height: auto;
  }

  @include lg {
    height: 100%;
  }
}

.scrollable-lg {  
  
  @include md {
    width: auto;
    overflow-y: auto;
  }

  @include lg {
    width: 100%;
    overflow-y: scroll;
  }
}
</style>


<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import { AxiosResponse } from "axios";
import GmapCustomMarker from "vue2-gmap-custom-marker";
import moment from "moment";

import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import packsApi from "../api/pack";
import { Pack, FindPayload, Food } from "../types";

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1Rad = toRad(lat1);
  var lat2Rad = toRad(lat2);

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
        //TODO: move to constants file (also in ManagerPacksInpect and Create??)
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
      selectedCity: null,
      packs: new Array<Pack>(),
      foods: new Array<Food>(),
      selectedPacks: new Array<Pack>(),
      windowPacks: new Array<Pack>(),
      windowCoordinates: null,
      deliveryDate: moment().format("YYYY-MM-DD"),
      deliveryPeriod: "morning",
      isModalOpen: false,
    };
  },
  computed: {
    unselectedPacks() {
      const selectedPacksIds = this.selectedPacks.map(d => d._id);
      return this.packs.filter(d => !selectedPacksIds.includes(d._id))
    }
  },
  watch: {
    deliveryDate: function (): void {
      this.filterPacks();
    },
    deliveryPeriod: function (): void {
      this.filterPacks();
    },
  },
  created() {
    // check if user is logged in
    if (!this.$store.getters.isUserLogged) 
      this.$router.push({ name: "Login" });
  },
  methods: {
    packFoods(pack: Pack) {
      const packFoodsIds = pack.foodList.map(f => f.foodId);
      return this.foods.filter(f => packFoodsIds.includes(f._id))
    },
    selectCity(addressData) { //, placeResultData, id
      this.selectedCity = {
        name: addressData.locality,
        coordinates: {
          x: addressData.latitude,
          y: addressData.longitude,
        }
      }
      this.filterPacks();
    },
    deselectCity() {
      this.selectedCity = null;
      this.selectedPacks = [];
      this.windowPacks = null;
      this.windowCoordinates = null;
    },
    openInfoWindow(lat: number , lng: number) {
      this.windowPacks.splice(0, this.windowPacks.length);

      // find coordinates near to the clicked marked
      this.windowCoordinates = {x: lat, y: lng};
      for (const pack of this.packs) {
        const distance = calcCrow(
          lat,
          lng,
          pack.family[0].address.coordinates.x,
          pack.family[0].address.coordinates.y
        );
        if (distance < 0.05) {
          this.windowPacks.push(pack);
        }
      }
    },
    closeInfoWindow() {
      this.windowPacks.splice(0, this.windowPacks.length);
      this.windowCoordinates = null;
    },
    selectPack(pack: Pack) {
      this.selectedPacks.push(pack);
    },
    deselectPack(pack: Pack) {
      this.selectedPacks.splice(
        this.selectedPacks.findIndex(
          (e: Pack) => e._id == pack._id
        ),
        1
      );
      // this.packs.push(pack);
    },
    filterPacks() {
      this.selectedPacks = [];

      const payload = {
        lookup: {
          from: "families",
          localField: "familyId",
          foreignField: "_id",
          as: "family",
        },
        filter: {
          "$match": {
				    "family.address.city": this.selectedCity.name,
			    }
        }
      } as FindPayload;
      packsApi
        .filterPackList(payload)
        .then((r: AxiosResponse<{packs: Pack, foods: Food}>): void => {
          if (r.status == 200) {
            this.packs = r.data.packs;
            this.foods = r.data.foods;
          }
        })
        .catch((): void => {
          eventbus.$emit("errorMessage", "Pack", "Pack search with filtering options failed. Retry later or contact us if the problem persists.");
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
      if (!this.deliveryDate) {
        eventbus.$emit("warningMessage", "Packs", "Unable to perform the requested operation. Select a valid pickup day.");
      } else if (!this.selectedPacks.length) {
        eventbus.$emit("warningMessage", "Packs", "Unable to perform the requested operation. Select at least one pack available for delivery.");
      } else {
        const promises: Promise<AxiosResponse>[] = [];
        this.selectedPacks.forEach((element: Pack) => {
          element.status = "selected";
          // element.delivery = {
          //   volunteerId: this.$store.state.session.userData._id,
          //   period: this.deliveryPeriod,
          //   date: this.deliveryDate,
          // };
          // promises.push(packsApi.editPack(element));
        });

        Promise.all(promises)
          .then((): void => {
            this.$router.push({ name: "ManagerPacksList" });
            eventbus.$emit("successMessage", "Packs", "Pack reservation submitted succesfully.");
            // this.selectedPacks.forEach((element: Pack) => {
            // });
          })
          .catch((): void => {
            eventbus.$emit("errorMessage", "Packs", "Pack reservation submission for pick up failed. Retry later or contact us if the problem persists.");
          });
      }
    },
  },
});
</script>
