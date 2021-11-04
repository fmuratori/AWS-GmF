<template lang="pug">
  p home page del manager
    
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

export default Vue.extend({
  name: "ManagerHome",
  components: {
    Navbar,
    Sidebar,
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      this.$store.dispatch("showSidebar");
    } else {
      this.$router.replace({name: "Login"});
    }
  },
});
</script>

<style lang="scss"></style>
