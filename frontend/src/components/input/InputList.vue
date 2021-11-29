<template lang="pug">
b-form-group(:label="title" label-cols-sm="3", label-align-sm="right" :description="description") 
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
    description: String,
    placeholder: String,
    labelList: Array,
  },
  data: () => {
    return {
      labels: new Array<string>(),
    };
  },
  created() {
    this.labels = this.labelList as Array<string>;
    this.labels.push("");

    this.emitNewValues();
  },
  methods: {
    emitNewValues() {
      this.$emit(
        "data",
        this.labels.filter((l) => l != "")
      );
    },
    labelValueChange(inputIdx: number) {
      if (inputIdx == this.labels.length - 1) {
        this.labels.push("");
      } else if (this.labels[inputIdx] == "") {
        this.labelDeleteClicked(inputIdx);
      }

      this.emitNewValues();
    },
    labelDeleteClicked(inputIdx: number) {
      this.labels.splice(inputIdx, 1);

      this.emitNewValues();
    },
  },
});
</script>

<style scoped lang="scss"></style>
