<template lang="pug">
div
  b-form-group(label="City", label-cols-sm="3", label-align-sm="right")
    b-form-input(
      placeholder="Insert city here",
      required,
      type="text",
      v-model="address.city"
      @input="$emit('data', address)"
    )

  b-form-group(label="Street", label-cols-sm="3", label-align-sm="right")
    b-form-input(
      placeholder="Insert street here",
      required,
      type="text",
      v-model="address.street"
      @input="$emit('data', address)"
    )

  b-form-group(label="Civic", label-cols-sm="3", label-align-sm="right")
    b-form-input(
      placeholder="Insert civic number here",
      type="text",
      v-model="address.civicNumber"
      @input="$emit('data', address)"
    )

  b-row(align-h="center")
    b-col(cols=10 md=8 lg=8)
      b-button.color3(block, size="sm" @click="resetMap" v-if="isLocationLoaded")
        span.mr-2 Reset location

      div.mapContainer(v-if="!isLocationLoaded").text-center.mb-4
        h1.pt-4
          b-icon(icon="map").mr
        h3
          span  Google Maps 
          br 
          span Navigator
       
        b-button.mt-5(variant="outline-dark", size="sm" @click="find" v-if="!isLocationLoaded") Find in the map

      MapLocation(v-else :x="address.coordinates.x" :y="address.coordinates.y" @locationChange="onLocationChange")
      
</template>

<script lang="ts">
import Vue from "vue";
import { AxiosError } from "axios";

import mapsApi from "../../api/maps";
import { Address } from "../../types";
import MapLocation from "../MapLocation.vue";

export default Vue.extend({
  name: "InputAddress",
  components: {
    MapLocation,
  },
  props: {
    required: Boolean,
    city: String,
    street: String,
    civic: String,
    x: Number,
    y: Number,
  },
  data: () => {
    return {
      address: {
        city: "",
        street: "",
        civicNumber: "",
        coordinates: {
          y: 0,
          x: 0,
        },
      } as Address,
      isLocationLoaded: false,
    };
  },
  created() {
    this.address.city = this.city;
    this.address.street = this.street;
    this.address.civicNumber = this.civic;

    if (this.x && this.y) {
      this.isLocationLoaded = true;
      this.address.coordinates.x = this.x;
      this.address.coordinates.y = this.y;
    }
  },
  methods: {
    resetMap() {
      this.address.coordinates = { x: 0, y: 0 };
      this.isLocationLoaded = false;
    },
    reset() {
      this.isLocationLoaded = false;
      this.address.city = "";
      this.address.street = "";
      this.address.civicNumber = "";
      this.address.coordinates.x = 0;
      this.address.coordinates.y = 0;
    },
    onLocationChange(x: number, y: number) {
      this.address.coordinates.x = x;
      this.address.coordinates.y = y;
      this.$emit("data", this.address);
    },
    find() {
      mapsApi
        .getLocationCoordinates(
          this.address.city +
            " " +
            this.address.civicNumber +
            " " +
            this.address.street
        )
        .then((r: any) => {
          if (r.status == 200) {
            this.isLocationLoaded = true;
            this.address.city = r.data.results[0].address_components.find((c) =>
              c.types.includes("administrative_area_level_3")
            )?.long_name;
            this.address.street = r.data.results[0].address_components.find(
              (c) => c.types.includes("route")
            )?.long_name;
            this.address.civicNumber =
              r.data.results[0].address_components.find((c) =>
                c.types.includes("street_number")
              )?.long_name;
            this.address.coordinates.x =
              r.data.results[0].geometry.location.lat;
            this.address.coordinates.y =
              r.data.results[0].geometry.location.lng;

            this.$emit("data", this.address);
          } else {
            this.isLocationLoaded = false;
          }
        })
        .catch((e: AxiosError) => {
          console.log(e);
        });
    },
  },
});
</script>

<style scoped lang="scss">
#gmap {
  height: 300px;
  width: 300px;
}
</style>
