<template lang="pug">
b-form-group(:label='title' label-cols-sm='3' label-align-sm='right')
  b-form-textarea(required :value='text' rows='3' max-rows='6' @input="$emit('data', $event)" :placeholder='placeholder')
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "InputTextarea",
  props: {
    title: String,
    placeholder: String,
    text: String,
    required: Boolean,
  },
});
</script>

<style scoped lang="scss"></style>
