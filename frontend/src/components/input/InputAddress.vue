<template lang="pug">

b-form-group(:label="title"  label-class="font-weight-bold pt-0 text-center")
  b-form-group(label="City", label-cols-sm="3", label-align-sm="right")
    b-form-input(
      placeholder="Insert city here",
      required,
      type="text",
      v-model="address.city"
    )

  b-form-group(label="Street", label-cols-sm="3", label-align-sm="right")
    b-form-input(
      placeholder="Insert street here",
      required,
      type="text",
      v-model="address.street"
    )

  b-form-group(label="Civic", label-cols-sm="3", label-align-sm="right")
    b-form-input(
      placeholder="Insert civic number here",
      type="text",
      v-model="address.civicNumber"
    )

  .text-center
    b-button(variant="outline-dark", size="sm" @click="find") Find in google maps
    label &nbsp;or&nbsp;
    b-button(variant="outline-dark", size="sm" @click="reset") Reset

    
  MapLocation.mx-auto.mt-3(:x="address.coordinates.x" :y="address.coordinates.y" v-if="isLocationLoaded" @locationChange="onLocationChange")
  
</template>

<script lang="ts">
import Vue from "vue";
import { AxiosError, AxiosResponse } from "axios";

import mapsApi from "../../api/maps";
import { Address } from "../../types";
import MapLocation from "../MapLocation.vue";

export default Vue.extend({
  name: "InputAddress",
  components: { 
    MapLocation 
  },
  props: {
    title: String,
    required: Boolean,
    city: String,
    street: String,
    civic: String,
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
  },
  methods: {
    reset() {
      this.isLocationLoaded = false;
      this.address.city = null;
      this.address.street = null;
      this.address.civicNumber = null;
      this.address.coordinates.x = null;
      this.address.coordinates.y = null;
    },
    onLocationChange(x: number, y: number) {
      this.address.coordinates.x = x;
      this.address.coordinates.y = y;
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
        .then((r:any) => {
          if (r.status == 200) {
            this.isLocationLoaded = true;
            this.address.city = r.data.results[0].address_components.find((c) =>
              c.types.includes("administrative_area_level_3")
            )?.long_name;
            this.address.street = r.data.results[0].address_components.find((c) =>
              c.types.includes("route")
            )?.long_name;
            this.address.civicNumber = r.data.results[0].address_components.find(
              (c) => c.types.includes("street_number")
            )?.long_name;
            this.address.coordinates.x = r.data.results[0].geometry.location.lat;
            this.address.coordinates.y = r.data.results[0].geometry.location.lng;

            this.$emit("onAddressUpdate", this.address);
          } else {
            this.isLocationLoaded = false;
          }
        }).catch((e: AxiosError) => {
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
