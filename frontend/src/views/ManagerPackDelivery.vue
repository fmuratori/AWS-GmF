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

import packApi from "../api/pack"
import { FindPayload } from "../types"

export default Vue.extend({
  name: "ManagerPackDelivery",
  components: {
    Navbar,
    Sidebar,
  },
  data: () => {
  },
  watch: {
  },
  created() {
    /* testing code */
    const payload = {} as FindPayload
    packApi.packList(payload).then(r => {
      console.log(r)
    })

    /* real code */
  }
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
