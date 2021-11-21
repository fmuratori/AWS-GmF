<template lang="pug">
b-row.mb-1(no-gutters align-v="center")
  b-col.mr-1(cols="auto")
    font-awesome-icon(v-if="this.icon == 'users'" icon="users" size="lg")
    font-awesome-icon(v-else-if="this.icon == 'calendar'" icon="calendar" size="lg")
    font-awesome-icon(v-else-if="this.icon == 'map'" icon="map" size="lg")
    font-awesome-icon(v-else-if="this.icon == 'box'" icon="box" size="lg")
    font-awesome-icon(v-else-if="this.icon == 'drumstick-bite'" icon="drumstick-bite" size="lg")
  b-col.ml-1
    h6.mb-0 {{text}}
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "SidebarCategory",
  props: {
    text: String,
    icon: String,
  },
});
</script>

<style scoped lang="scss"></style>
