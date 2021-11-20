<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    h4 What is BringMeFood?

  b-row.justify-content-md-center.my-5.no-gutters
    HomepageEvents

  b-row.justify-content-md-center.my-5.no-gutters
    PieChart
  
  b-form
    b-form-file
</template>

<script lang="ts">
import Vue from "vue";
import PieChart from "../components/homepage/PieChart.vue";
import HomepageEvents from "../components/homepage/HomepageEvents.vue";

export default Vue.extend({
  name: "Home",
  components: {
    PieChart,
    HomepageEvents
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
