<template lang="pug">
b-row.pl-3.pr-1.sidebar-item(
  no-gutters,
  align-v="center",
  @click="changePage('ManagerFamilies')",
  :class="{ 'sidebar-item-selected': isRouteSelected('ManagerFamilies') }"
)
  b-col
    label.py-1 {{name}}
  b-col(cols="auto")
    b-icon(icon="chevron-right")
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "SidebarItem",
  data: function () {
    return {
      title: "",
    };
  },
});
</script>

<style scoped lang="scss"></style>
