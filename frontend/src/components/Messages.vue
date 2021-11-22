<template lang="pug">

</template>

<style scoped lang="scss">

</style>

<script lang="ts">
  import EventBus from "../eventbus"
  
  export default {
    mounted() {
      EventBus.$on("successMessage", (title, message) => {
        this.$root.$bvToast.toast(
          message,
          {
            title: title,
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          }
        );
      }),
      EventBus.$on("warningMessage", (title, message) => {
        this.$root.$bvToast.toast(
          message,
          {
            title: title,
            autoHideDelay: 5000,
            variant: "warning",
            appendToast: false,
          }
        );
      }),
      EventBus.$on("errorMessage", (title, message) => {
        this.$root.$bvToast.toast(
          message,
          {
            title: title,
            autoHideDelay: 5000,
            variant: "danger",
            appendToast: false,
          }
        );
      }),
    },
  }
</script>