<template lang="pug">
div homeee
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
