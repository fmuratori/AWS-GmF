<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    h2
      b What is BringMeFood?

  b-row.justify-content-md-center.my-5.no-gutters
    div bla bla bla

  b-row.justify-content-md-center.my-5.no-gutters
    h2.text-center
      b Food donated by category

  b-row.justify-content-md-center.my-5.no-gutters
    DoughnutChart

  b-row.justify-content-md-center.my-5.no-gutters
    h2.text-center
      b Some data

  b-row.justify-content-md-center.my-5.no-gutters
    CountBoxes

  b-row.justify-content-md-center.my-5.no-gutters
    h2.text-center
      b Next events

  b-row.justify-content-md-center.my-5.no-gutters
    HomepageEvents
</template>

<script lang="ts">
import Vue from "vue";
import DoughnutChart from "../components/homepage/DoughnutChart.vue";
import HomepageEvents from "../components/homepage/HomepageEvents.vue";
import CountBoxes from "../components/homepage/CountBoxes.vue";

export default Vue.extend({
  name: "Home",
  components: {
    DoughnutChart,
    HomepageEvents,
    CountBoxes
  },
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
