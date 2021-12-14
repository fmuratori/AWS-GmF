<template lang="pug">
b-form-group(:label="title" label-cols-sm="3", label-align-sm="right" :description="description") 
  b-input-group.mb-1(v-for="(label, idx) in labels", :key="idx")
    b-form-input(
      type="text",
      :placeholder="placeholder",
      @input="labelValueChange(idx)",
      v-model="labels[idx]"
    )
    b-input-group-append
      b-button.color3(
        :variant="!labels[idx] ? 'outline-danger' : ''",
        @click="labelDeleteClicked(idx)",
        :disabled="labels[idx] == ''"
      ) 
        Icon(bootstrap icon="x", aria-hidden="true")
</template>

<script lang="ts">
import Vue from "vue";
import Icon from "../Icon.vue";
import { InputListComponent } from "../../types/componentTypes";

export default Vue.extend({
  name: "InputList",
  components: {
    Icon,
  },
  props: {
    title: String,
    description: String,
    placeholder: String,
    labelList: Array,
  },
  data: (): InputListComponent => {
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
