<template lang="pug">
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";

export default Vue.extend({
  name: "ToastsManager",
  created() {
    eventbus.$on("successMessage", (title: string, message: string) => {
      this.$root.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 5000,
        variant: "success",
        appendToast: false,
      });
    });
    eventbus.$on("warningMessage", (title: string, message: string) => {
      this.$root.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 5000,
        variant: "warning",
        appendToast: false,
      });
    });
    eventbus.$on("errorMessage", (title: string, message: string) => {
      this.$root.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 5000,
        variant: "danger",
        appendToast: false,
      });
    });
  },
});
</script>
