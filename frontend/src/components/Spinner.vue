<template lang="pug">
  div
    p Spinner
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Message",
  props: {
    isActive: Boolean,
  },
  data: function () {
    return {};
  },
  methods: {},
});
</script>

<style scoped lang="scss">
// @import "@/assets/style.scss";

</style>
