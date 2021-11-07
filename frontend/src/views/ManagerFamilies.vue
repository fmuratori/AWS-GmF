<template lang="pug">
b-container
  .justify-content-center.my-5
    h3 
      b REPORTED FAMILIES

    b-row
      b-col
        b-button-group(v-if="this.$store.state.session.userData.type != 'user'")
          b-button(@click="changeView('my', status)") Only my
          b-button(@click="changeView('all', status)") All

        b-button-group
          b-button(@click="changeView(view, 'verified')") Verified
          b-button(@click="changeView(view, 'pending')") Pending
          b-button(@click="changeView(view, 'all')") All

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

            h5 status:
              b-badge(v-if="family.status == 'pending'", variant="warning") {{ family.status }}
              b-badge(v-if="family.status == 'verified'", variant="success") {{ family.status }}

            b-button.b-card-footer-button(
              block,
              v-if="userRole == 'trusted' && family.status == 'pending'",
              variant="success",
              @click="verifyFamily(family._id)"
            ) VERIFY
            b-button.b-card-footer-button(
              block,
              v-else,
              variant="success",
              disabled
            ) VERIFY

            b-button.b-card-footer-button(
              block,
              v-if="userRole != 'user' && family.status == 'verified'",
              variant="primary",
              @click="$router.replace({ name: 'ManagerPackCreate', params: { family: family } })"
            ) PACK
            b-button.b-card-footer-button(
              block,
              v-else,
              variant="primary",
              disabled
            ) PACK
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import api from "../api";

import { Family } from "../types";

export default Vue.extend({
  name: "ManagerFamilies",
  components: {
    Navbar,
    Sidebar,
  },
  data: () => {
    return {
      userRole: "",
      view: "all",
      status: "all",
      familyList: new Array<Family>(),
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      this.$store.dispatch("showSidebar");

      this.userRole = this.$store.state.session.userData.type;

      // TODO: mostrare uno spinner mentre sono caricati i dati
      api
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
    changeView(view: "my" | "all", status: "verified" | "pending" | "all") {
      console.log("view: " + view)
      console.log("status: " + status)

      var payload = {filter: {}}

      if (view == "my") {
        payload.filter['reporterId'] = this.$store.state.session.userData._id 
      }

      switch(status){
        case "verified":
        case "pending":
          payload.filter['status'] = status
          break;
        default:
      }

      this.view = view;
      this.status = status;

      api
        .familyList(payload)
        .then((r: any) => {
          this.familyList = r.data.data.list;
        })
        .catch((e) => console.log(e));
    },
    verifyFamily(familyId: string) {
      api
        .verifyFamily({ id: familyId })
        .then((r) => {
          this.changeView(this.view);
          this.$bvToast.toast(`Family verified with success.`, {
            title: "Verify",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
        })
        .catch((e) => {
          this.$bvToast.toast(
            `Unable to verify the family. Retry later or contact us.`,
            {
              title: "Verify",
              autoHideDelay: 5000,
              variant: "danger",
              appendToast: false,
            }
          );
        });
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

.status {
  float: right;
}
</style>
