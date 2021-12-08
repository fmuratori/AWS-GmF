<template lang="pug">
b-row.mb-1(no-gutters='no-gutters' align-v='center')
  b-col.mr-1(cols='auto')
    Icon(fontawesome v-if="this.icon == 'users'" icon='users' size='lg')
    Icon(fontawesome v-else-if="this.icon == 'calendar'" icon='calendar' size='lg')
    Icon(fontawesome v-else-if="this.icon == 'map'" icon='map' size='lg')
    Icon(fontawesome v-else-if="this.icon == 'box'" icon='box' size='lg')
    Icon(fontawesome v-else-if="this.icon == 'drumstick-bite'" icon='drumstick-bite' size='lg')
  b-col.ml-1
    h6.mb-0 {{text}}
</template>

<script lang="ts">
import Vue from "vue";
import Icon from "../Icon.vue";

export default Vue.extend({
  name: "SidebarCategory",
  components: {
    Icon,
  },
  props: {
    text: String,
    icon: String,
  },
});
</script>

<style scoped lang="scss"></style>
