<template lang="pug">
b-form-group(:label='title' label-cols-sm='3' label-align-sm='right' :description='description')
  b-input-group
    b-form-datepicker(locale='en' :placeholder='placeholder' required v-model='dateModel' @input="$emit('data', dateModel)" reset-button='reset-button' close-button='close-button' :min="moment().add(1, 'days').toDate()")
    b-input-group-append
      b-button(:variant="!dateModel ? 'outline-danger' : ''" :class="!dateModel ? '' : 'color3'" @click='onCancel' :disabled="dateModel == ''")
        Icon(bootstrap icon='x' aria-hidden='true')
</template>

<script lang="ts">
import Vue from "vue";

import Icon from "../Icon.vue";

export default Vue.extend({
  name: "InputDate",
  components: {
    Icon,
  },
  props: {
    title: String,
    placeholder: String,
    date: String,
    required: Boolean,
    description: String,
  },
  data: () => {
    return {
      dateModel: "",
    };
  },
  created() {
    this.dateModel = this.date;
  },
  methods: {
    onCancel() {
      this.dateModel = "";
      this.$emit("data", "");
    },
  },
});
</script>

<style scoped lang="scss"></style>
