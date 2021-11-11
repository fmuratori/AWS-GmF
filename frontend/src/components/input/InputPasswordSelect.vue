<template lang="pug">
div
  b-form-group(:label="title1")
    b-input-group
      b-input-group-prepend(v-if="icon")
        b-input-group-text
          b-icon(:icon="icon")
      b-form-input(
        required,
        type="password",
        v-model="password",
        :placeholder="placeholder1",
        @input="$emit('data', $event)"
      )

  b-form-group(:label="title2")
    b-input-group
      b-input-group-prepend(v-if="icon")
        b-input-group-text
          b-icon(:icon="icon")
      b-form-input(
        required,
        type="password",
        v-model="regRepeatPassword",
        :placeholder="placeholder2",
        :state="registrationPasswordCheck()"
      )
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "InputText",
  props: {
    title1: String,
    title2: String,
    placeholder1: String,
    placeholder2: String,
    icon: String,
  },
  data: () => {
    return {
      password: "",
      regRepeatPassword: "",
    };
  },
  methods: {
    registrationPasswordCheck() {
      return this.password == this.regRepeatPassword && this.password != "";
    },
  },
});
</script>

<style scoped lang="scss"></style>
