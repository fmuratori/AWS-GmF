<template lang="pug">
  div()
      
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  created() {
    this.$store.dispatch("hideSidebar");
  }
});
</script>

<style lang="scss"></style>
