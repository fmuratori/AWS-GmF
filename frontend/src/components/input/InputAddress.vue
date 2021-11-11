<template lang="pug">
b-form-group(:label="title")
  b-form-group(label="City", label-cols-sm="3", label-align-sm="right")
    b-form-input(
      placeholder="Insert city here"
      required,
      type="text",
      :value="city",
      @input="$emit('city', $event)"
    )

  b-form-group(label="Street", label-cols-sm="3", label-align-sm="right")
    b-form-input(
      placeholder="Insert street here"
      required,
      type="text",
      :value="street",
      @input="$emit('street', $event)"
    )

  b-form-group(label="Civic", label-cols-sm="3", label-align-sm="right")
    b-form-input(
      placeholder="Insert civic number here"
      required,
      type="text",
      :value="civic",
      @input="$emit('civic', $event)"
    )

  .text-center
    b-button(variant="outline-secondary" @click="find") Find on maps
</template>

<script lang="ts">
import Vue from "vue";

import mapsApi from "../api/maps";

export default Vue.extend({
  name: "InputAddress",
  props: {
    title: String,
    required: Boolean,
    city: String,
    street: String,
    civic: String,
  },
  methods: {
    find() {
      mapsApi.getLocationCoordinates(
          this.city + " " + 
          this.civic + " " +
          this.street).then(r => console.log(r))
    }
  }
});
</script>

<style scoped lang="scss"></style>
