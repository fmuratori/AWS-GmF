<template lang="pug">
b-col
  b {{ label }}:
  b-button-group
    b-button.ml-2(
      v-for="filter in filters",
      pill,
      variant="secondary",
      size="sm",
      @click="onClick(filter)",
      :class="{ 'my-button-selected': selectedFilter == filter }"
    ) {{ formatLabel(filter) }}
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "FilterButtons",
  props: {
    label: String,
    filters: Array,
  },
  data: () => {
    return {
      selectedFilter: "",
    };
  },
  created() {
    this.selectedFilter = this.filters[0];
  },
  methods: {
    onClick(filter: String): void {
      this.selectedFilter = filter;
      this.$emit("click", filter);
    },
    formatLabel(label: String) {
      return label[0].toUpperCase() + label.slice(1);
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

.my-button-selected {
  background-color: $color1;
  border-color: $color1;
}
</style>
