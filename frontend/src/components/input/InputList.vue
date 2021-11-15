<template lang="pug">

b-form-group(:label="title" label-cols-sm="3", label-align-sm="right") 
  b-input-group.mb-1(v-for="(label, idx) in labels", :key="idx")
    b-form-input.my-no-right-border(
      type="text",
      :placeholder="placeholder",
      @input="labelValueChange(idx)",
      v-model="labels[idx]"
    )
    b-input-group-append
      b-button.my-no-left-border(
        :variant="!labels[idx] ? 'outline-danger' : 'danger'",
        @click="labelDeleteClicked(idx)",
        :disabled="labels[idx] == ''"
      ) 
        b-icon(icon="x", aria-hidden="true")
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "InputList",
  props: {
    title: String,
    placeholder: String,
  },
  data: () => {
    return {
      labels: [""],
    };
  },
  methods: {
    labelValueChange(inputIdx: number) {
      if (inputIdx == this.labels.length - 1) {
        this.labels.push("");
      } else if (this.labels[inputIdx] == "") {
        this.labelDeleteClicked(inputIdx);
      }

      //evito di emettere [""], su db conta come label vuota
      this.$emit("data", this.labels.slice(0, this.labels.length - 1));
    },
    labelDeleteClicked(inputIdx: number) {
      this.labels.splice(inputIdx, 1);
    },
  },
});
</script>

<style scoped lang="scss"></style>
