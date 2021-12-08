<template lang="pug">
b-form-group(:label='title' :label-cols-sm='title ? 3 : 0' label-align-sm='right' :description='description')
  b-input-group
    b-input-group-prepend(v-if='icon')
      b-input-group-text
        Icon(bootstrap :icon='icon')
    b-form-input(:required='required' :type='type' :value='text' :placeholder='placeholder' @input="$emit('data', $event)")

</template>

<script lang="ts">
import Vue from "vue";
import Icon from "../Icon.vue";

export default Vue.extend({
  name: "InputText",
  components: {
    Icon,
  },
  props: {
    title: String,
    placeholder: String,
    text: [String, Number],
    description: String,
    icon: String,
    type: {
      type: String,
      validator: (val) => ["text", "number", "email", "password"].includes(val),
      default: "text",
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style scoped lang="scss"></style>
