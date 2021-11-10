<template lang="pug">
b-card.mb-2(bg-variant="light", text-variant="dark")
  b-card-text
    b-card-header {{ title }}
    .px-4.pt-4
      b-row
        b-col
          b-form-group(label="City:")
            b-form-input(
              required,
              type="text",
              :value="city",
              @input="$emit('city', $event)"
            )
      b-row
        b-col(cols=8)
          b-form-group(label="Address:")
            b-form-input(
              required,
              type="text",
              :value="street",
              @input="$emit('street', $event)"
            )
        b-col(cols=4)
          b-form-group(label="Civic number:")
            b-form-input(
              required,
              type="text",
              :value="civic"
              @input="$emit('civic', $event)"
            )
      .text-center
        b-button(variant="outline-secondary") Find on maps
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "InputAddress",
  props: {
    title: String,
    required: Boolean,
    city: String,
    street: String,
    civic: String,
  },
});
</script>

<style scoped lang="scss"></style>
