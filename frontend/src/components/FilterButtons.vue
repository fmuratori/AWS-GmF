<template lang="pug">
div
  b-button.ml-2.mb-2(
    v-for="(filter, idx) in filters",
    :key="idx"
    v-if="filter[3]"
    pill,
    variant="secondary",
    size="sm",
    @click="onClick(filter[0])",
    :class="{ 'selectedFilter': selectedFilter == filter[0] }"
  ) 
    span.mr-1 {{ filter[1] }}
    b-icon(:icon="filter[2]" v-if="filter[2]")
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "FilterButtons",
  props: {
    label: String,
    filters: Array,
    selected: Number,
  },
  data: () => {
    return {
      selectedFilter: "",
    };
  },
  created() {
    this.selectedFilter = this.filters[this.selected][0];
    this.$emit("click", this.selectedFilter);
  },
  methods: {
    onClick(filter: string): void {
      this.selectedFilter = filter;
      this.$emit("click", filter);
    },
    formatLabel(label: string) {
      return label[0].toUpperCase() + label.slice(1);
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

.selectedFilter {
  @extend .color1;
}
</style>
