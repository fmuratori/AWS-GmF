<template lang="pug">
  b-container(class="justify-content-center my-5")
    p RACCOLTA DONAZIONI

    b-row
      b-col(sm=12 md=6)
        GmapMap(
        :center="{lat:10, lng:10}"
        :zoom="7"
        map-type-id="terrain"
        style="width: 500px; height: 300px")
          GmapMarker(
          :position="{lat:10, lng:10}"
          :clickable="true"
          :draggable="true"
          @click="")
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import api from "../api";

import { Donation } from "../types";

export default Vue.extend({
  name: "ManagerDonationsRetrieve",
  components: {
    Navbar,
    Sidebar,
  },
  data: () => {
    return {
      donations: new Array<Donation>(),
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      // TODO: mostrare uno spinner mentre sono caricati i dati
      
      // scaricare donazioni
      
      
      // api
      //   .userDonationsList(
      //     this.$store.state.session.userData._id,
      //     this.$store.getters.getSessionHeader
      //   )
      //   .then((r: any) => {
      //     this.donations = r.data.data.list;
      //     this.donationsBackup = r.data.data.list;
      //     this.orderBy(this.orderByMode);
      //     this.filterBy(this.filterByMode);
      //   })
      //   .catch((e) => console.log(e));

      // api.donationsMessagesCounts(this.$store.state.session.userId,this.$store.getters.getSessionHeader).then((r:any) => {
      // });
    } else {
      this.$router.replace({ name: "Login" });
    }
  },
  methods: {
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

</style>
