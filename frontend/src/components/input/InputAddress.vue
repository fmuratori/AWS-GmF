<template lang="pug">
div
  b-form-group(label='Address' label-cols-sm='3' label-align-sm='right')
    b-form-input(placeholder='Insert address here'  type='text' v-model='query' @input='emitValueChange')
  
  b-row(align-h='center')
    b-col(cols='10' md='8' lg='8')
      b-button.color3(block='block' size='sm' @click='resetMap' v-if='isLocationLoaded') Reset location
      .mapContainer.text-center(v-if='!isLocationLoaded')
        h1.pt-4
          Icon.mr(bootstrap icon='map')
        h3
          span  Google Maps 
          br
          span Navigator
        b-button.mt-5(variant='outline-dark' size='sm' @click='find' v-if='!isLocationLoaded') Find in the map
      MapLocation(v-else :x='address.coordinates.x' :y='address.coordinates.y' @locationChange='onLocationChange')
</template>

<script lang="ts">
import Vue from "vue";

import { AxiosError, AxiosResponse } from "axios";
import mapsApi from "../../api/maps";

import { Address, GMapAutoCompleteResponse } from "../../types/types";

import MapLocation from "../MapLocation.vue";
import InputText from "../input/InputText.vue";
import Icon from "../Icon.vue";
import { InputAddressComponent } from "../../types/componentTypes";

export default Vue.extend({
  name: "InputAddress",
  components: {
    MapLocation,
    Icon,
    InputText,
  },
  props: {
    required: Boolean,
    city: String,
    street: String,
    civic: String,
    x: Number,
    y: Number,
  },
  data: (): InputAddressComponent => {
    return {
      query: "",
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

      this.query =
        this.address.street +
        " " +
        this.address.civicNumber +
        ", " +
        this.address.city;
    }
  },
  methods: {
    emitValueChange(value: string) {
      this.resetMap();
      this.$emit("data", this.address);
      this.query = value;
    },
    resetMap() {
      this.query = "";
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
        .getLocationCoordinates(this.query)
        .then((r: AxiosResponse<GMapAutoCompleteResponse>) => {
          if (r.status == 200) {
            this.query = r.data.results[0].formatted_address;
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
            
            this.query =
              this.address.street + " " +
              (!this.address.civicNumber? this.address.civicNumber : "") + 
              ", " + this.address.city;

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
@import "@/assets/style.scss";

#gmap {
  height: 300px;
  width: 300px;
}

.mapContainer {
  border-radius: 5px;
  -moz-box-shadow: inset 0 0 10px #000000;
  -webkit-box-shadow: inset 0 0 10px #000000;
  box-shadow: inset 0 0 10px #000000;
}
</style>
