<template lang="pug">
  div()
    Navbar
    b-container(fluid)
      b-row()
        b-col(class="bg-light" md="auto" align-self="stretch")
          Sidebar
        b-col(cols="9")
          p spiegazione donazioni
    
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";

export default Vue.extend({
  name: "ManagerFamilies",
  components: {
    Navbar,
    Sidebar,
  },
});
</script>

<style lang="sass"></style>
