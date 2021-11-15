<template lang="pug">
b-form-group(label="Labels:") 
  b-input-group.mb-1(v-for="(label, idx) in labels", :key="idx")
    b-form-input.my-no-right-border(
      type="text",
      :placeholder="placeholder",
      @input="labelValueChange(idx)",
      v-model="labels[idx]"
    )
    b-input-group-append
      b-button.my-no-left-border(
        variant="danger",
        @click="labelDeleteClicked(idx)",
        :disabled="labels[idx] == ''"
      ) 
        span Cancel
        b-icon(icon="x", aria-hidden="true")
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "InputList",
  props: {
    title: String,
    placeholder: String,
    labelList: Array,
  },
  data: () => {
    return {
      labels: [""],
    };
  },
  watch: {
    labelList: function (val: Array<string>) {
      if (val[0] == "") this.labels = val;
      else this.labels = val.concat("");
    },
  },
  created() {
    this.labels = this.labelList as Array<string>;
    this.labels.push("");
  },
  methods: {
    labelValueChange(inputIdx: number) {
      if (inputIdx == this.labels.length - 1) {
        this.labels.push("");
      } else if (this.labels[inputIdx] == "") {
        this.labelDeleteClicked(inputIdx);
      }

      //evito di emettere [""], su db conta come label vuota
      this.$emit(
        "data",
        this.labels.filter((l) => l != "")
      );
    },
    labelDeleteClicked(inputIdx: number) {
      this.labels.splice(inputIdx, 1);
    },
  },
});
</script>

<style scoped lang="scss"></style>
