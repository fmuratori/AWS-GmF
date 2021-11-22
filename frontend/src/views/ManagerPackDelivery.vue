<template lang="pug">
span wip...
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import packApi from "../api/pack"
import { FindPayload } from "../types"
export default Vue.extend({
  name: "ManagerPackDelivery",
  components: {
    Navbar,
    Sidebar,
  },
  created() {
    /* testing code */
    const payload = {} as FindPayload
    packApi.packList(payload).then(r => {
      console.log(r)
    })

    /* real code */
  }
});
</script>

<style scoped lang="scss"></style>
