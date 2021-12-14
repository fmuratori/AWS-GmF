<template lang="pug">
div
  b-form-group(:label='title1' :label-cols-sm='title1 ? 3 : 0' label-align-sm='right')
    b-input-group
      b-input-group-prepend(v-if='icon')
        b-input-group-text
          Icon(bootstrap :icon='icon')
      b-form-input(required='required' type='password' v-model='password' :placeholder='placeholder1' @input="$emit('data', $event)")
  b-form-group(:label='title2' :label-cols-sm='title2 ? 3 : 0' label-align-sm='right')
    b-input-group
      b-input-group-prepend(v-if='icon')
        b-input-group-text
          Icon(bootstrap :icon='icon')
      b-form-input(required='required' type='password' v-model='regRepeatPassword' :placeholder='placeholder2' :state='registrationPasswordCheck()')

</template>

<script lang="ts">
import Vue from "vue";
import Icon from "../Icon.vue";
import { InputPasswordSelectComponent } from "../../types/componentTypes";

export default Vue.extend({
  name: "InputPassword",
  components: {
    Icon,
  },
  props: {
    title1: String,
    title2: String,
    placeholder1: String,
    placeholder2: String,
    icon: String,
  },
  data: (): InputPasswordSelectComponent => {
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
