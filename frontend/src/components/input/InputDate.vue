<template lang="pug">
b-form-group(:label="title")
  b-input-group
    b-form-datepicker.my-no-right-border(
      :placeholder="placeholder",
      :required="required",
      v-model="dateModel",
      @input="$emit('data', $event)",
      reset-button,
      close-button
    )
    b-input-group-append
      b-button.my-no-left-border(
        variant="danger",
        @click="onCancel",
        :disabled="dateModel == ''"
      ) 
        span Cancel
        b-icon(icon="x", aria-hidden="true")
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "InputDate",
  props: {
    title: String,
    placeholder: String,
    date: String,
    required: Boolean,
  },
  data: () => {
    return {
      dateModel: "",
    };
  },
  watch: {
    date: function (val: string) {
      this.dateModel = val;
    },
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
