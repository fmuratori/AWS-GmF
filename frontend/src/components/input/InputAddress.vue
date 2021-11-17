<template lang="pug">
b-form-group(:label="title")
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
      required,
      type="text",
      v-model="address.civicNumber"
      @input="$emit('data', address)"
    )

  .text-center
    b-button(variant="outline-secondary", @click="find") Trova in maps
</template>

<script lang="ts">
import Vue from "vue";

import mapsApi from "../../api/maps";
import { Address } from "../../types";

export default Vue.extend({
  name: "InputAddress",
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
    };
  },
  created() {
    this.address.city = this.city;
    this.address.street = this.street;
    this.address.civicNumber = this.civic;
  },
  methods: {
    find() {
      mapsApi
        .getLocationCoordinates(
          this.address.city +
            " " +
            this.address.civicNumber +
            " " +
            this.address.street
        )
        .then((r: any): void => {
          console.log(r);
          this.address.city = r.data.results[0].address_components.find((c) =>
            c.types.includes("administrative_area_level_3")
          ).long_name;
          this.address.street = r.data.results[0].address_components.find((c) =>
            c.types.includes("route")
          ).long_name;
          this.address.civicNumber = r.data.results[0].address_components.find(
            (c) => c.types.includes("street_number")
          ).long_name;
          this.address.coordinates.x = r.data.results[0].geometry.location.lat;
          this.address.coordinates.y = r.data.results[0].geometry.location.lng;

          this.$emit("data", this.address);
        });
    },
  },
});
</script>

<style scoped lang="scss"></style>
