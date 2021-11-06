<template lang="pug">
b-container
  .justify-content-center.my-5
    h3 
      b YOUR SEGNALATIONS
    b-row
      div(v-if="familyList.length == 0") No family segnalation found for this user
      b-col(sm=12, md=6, v-for="(family, idx) in familyList", :index="idx")
        b-card.mb-2(bg-variant="light", text-variant="dark", no-body)
          b-card-text
            .px-4.pt-4
              h4 
                b {{ family.name }}
              b-row
                b-col(cols="auto")
                  p.mb-0 Phone number:
                    b {{ family.phoneNumber }}
              b-row
                b-col(cols="auto")
                  p.mb-0 Components:
                    b {{ family.components }}
              b-row
                b-col(cols="auto")
                  p.mb-0 Address:
                    b {{ family.address.street }} {{ family.address.civicNumber }} - {{ family.address.city }}

          b-card-footer status: 
            b-badge(v-if="family.status == 'pending'" variant="warning") {{ family.status }} 
            b-badge(v-if="family.status == 'verified'" variant="success") {{ family.status }}
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import api from "../api";

import { Family } from "../types";

export default Vue.extend({
  name: "ManagerFamilyList",
  components: {
    Navbar,
    Sidebar,
  },
  data: () => {
    return {
      familyList: new Array<Family>(),
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      this.$store.dispatch("showSidebar");

      // TODO: mostrare uno spinner mentre sono caricati i dati
      api
        .familyList({
          filter: { reporterId: this.$store.state.session.userData._id },
        })
        .then((r: any) => {
          this.familyList = r.data.data.list;
        })
        .catch((e) => console.log(e));

      // api.donationsMessagesCounts(this.$store.state.session.userId,this.$store.getters.getSessionHeader).then((r:any) => {
      // });
    } else {
      this.$router.replace({ name: "Login" });
    }
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

.b-card-footer-button {
  background-color: $color3;

  border: 0px;

  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.status {
  float: right;
}
</style>
