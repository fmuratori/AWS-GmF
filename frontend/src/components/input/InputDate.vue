<template lang="pug">
b-form-group(label="Date:")
  b-input-group
    b-form-datepicker.my-no-right-border(
      :placeholder="placeholder",
      :required="required",
      :value="date"
      v-model="selectedDate",
      @input="$emit('data', $event)",
      reset-button,
      close-button
    )
    b-input-group-append
      b-button.my-no-left-border(
        variant="danger",
        @click="onCancel",
        :disabled="selectedDate == null"
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
    date: Date,
    required: Boolean,
  },
  data: function () {
    return {
      selectedDate: null,
    };
  },
  created() {
    this.selectedDate = this.date;
  },
  methods: {
    onCancel() {
      this.selectedDate = null;
      this.$emit("data", this.$event);
    },
  },
});
</script>

<style scoped lang="scss"></style>
