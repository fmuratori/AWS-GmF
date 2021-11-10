<template lang="pug">
b-form-group(:label="title")
  b-form-input(
    :required="required",
    type="text",
    :value="text"
    :placeholder="placeholder",
    @input="$emit('data', $event)"
  )
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "InputText",
  props: {
    title: String,
    placeholder: String,
    text: String,
    required: Boolean
  },
});
</script>

<style scoped lang="scss"></style>
