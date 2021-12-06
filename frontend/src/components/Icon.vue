<template lang="pug">
div
  b-icon(v-if="source == 'bt'" :icon="icon")

  font-awesome-icon(v-if="source == 'fa'" :icon="icon")

</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Icon",
  props:{
    source: String,
    icon: String,
  },
});
</script>

<style scoped lang="scss">
</style>
