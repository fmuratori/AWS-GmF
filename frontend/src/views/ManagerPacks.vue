<template lang="pug">
b-container
  .justify-content-center.my-5
    h3 
      b REPORTED FAMILIES

    b-row(v-if="this.$store.state.session.userData.type != 'user'")
      b-button-group(size="lg")
        b-button.btn-my(@click="changeView('my')") Only my
        b-button.btn-all(@click="changeView('all')") All

    b-row
      div(v-if="familyList.length == 0") No family segnalation found for this user
      b-col(sm=12, md=6, v-for="(family, idx) in familyList", :key="idx")
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

          b-card-footer
            h4 status:
              b-badge(v-if="family.status == 'pending'", variant="warning") {{ family.status }}
              b-badge(v-if="family.status == 'verified'", variant="success") {{ family.status }}
          span.card-footer-btn(
            v-if="family.status == 'verified'",
            variant="success"
          )
            b-button.b-card-footer-button(
              block,
              @click="$router.replace({ name: 'ManagerPackCreate', params: { event: event } })"
            ) Create pack
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import familyApi from "../api/family";

import { Family } from "../types";

export default Vue.extend({
  name: "ManagerPacks",
  components: {
    Navbar,
    Sidebar,
  },
  data: () => {
    return {
      view: "all",
      familyList: new Array<Family>(),
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      this.$store.dispatch("showSidebar");

      // TODO: mostrare uno spinner mentre sono caricati i dati
      familyApi
        .familyList({
          filter: { reporterId: this.$store.state.session.userData._id },
        })
        .then((r: any) => {
          this.familyList = r.data.data.list;
        })
        .catch((e) => console.log(e));
    } else {
      this.$router.replace({ name: "Login" });
    }
  },
  methods: {
    changeView(view: "my" | "all") {
      var payload = null;

      // if (view == "my") {
      //   payload = {
      //     filter: { reporterId: this.$store.state.session.userData._id },
      //   };
      // }
      this.view = view;

      familyApi
        .familyList(payload)
        .then((r: any) => {
          this.familyList = r.data.data.list;
        })
        .catch((e) => console.log(e));
    },
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
</style>
