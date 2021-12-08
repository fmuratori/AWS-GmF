<template lang="pug">
span
  b-icon(v-if="bootstrap" :icon="icon")

  font-awesome-icon(v-if="fontawesome" :icon="icon")
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Icon",
  props: {
    bootstrap: Boolean,
    fontawesome: Boolean,
    icon: String,
  },
});
</script>

<style scoped lang="scss"></style>
