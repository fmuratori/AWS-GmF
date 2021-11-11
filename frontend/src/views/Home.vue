<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    h4 What is BringMeFood?

  b-row.justify-content-md-center.my-5.no-gutters
    p bla bla bla
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }
    }
  },
});
</script>

<style lang="scss"></style>
