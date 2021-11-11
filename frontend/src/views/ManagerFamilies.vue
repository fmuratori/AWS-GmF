<template lang="pug">
  b-container(class="justify-content-center my-5")
    p TUE SEGNALAZIONI

    b-row(no-gutters class="mb-2")
      b-col(cols="auto")
        p Stato segnalazioni:
      b-col
        b-button(pill variant="secondary" size="sm" class="ml-2" @click="filterBy('verified')" :class="{'my-button-selected': filterByMode == 'verified'}") Segnalazioni accettate
        b-button(pill variant="secondary" size="sm" class="ml-2" @click="filterBy('pending')" :class="{'my-button-selected': filterByMode == 'pending'}") In attesa di accettazione
        b-button(pill variant="secondary" size="sm" class="ml-2" @click="filterBy('all')" :class="{'my-button-selected': filterByMode == 'all'}") Tutte le segnalazioni
    
    b-row(no-gutters class="mb-2")
      b-col(cols="auto")
      p Ordina per:
      b-col
        b-button(pill variant="secondary" size="sm" class="ml-2" @click="orderBy('creation_date')" :class="{'my-button-selected': orderByMode == 'creation_date'}") Data creazione
      
    b-row
      b-col(v-if="familyList.length == 0" sm=12 md=6)
        p() Non hai mai effettuato segnalazioni. Premi #[a( href="#" @click="$router.replace({name: 'ManagerFamiliesSubscribe'})") qui] per segnalare una famiglia bisognosa.

      b-col(v-else sm=12 md=6 v-for="(family, idx) in familyList" :index="idx")
        b-card(bg-variant="light" text-variant="dark" no-body class="mb-2")
          b-card-text
            div(class="px-4 pt-4")
              h5 {{ family.name }}
              b-row
                b-col(cols="auto")
                  div(class="")
                    p(class="mb-0") Numero di cellulare:
                    p(class="font-weight-bold mb-2") {{ family.phoneNumber }}

                  div(class="")
                    p(class="mb-0") Numero elementi della famiglia:
                    p(class="font-weight-bold mb-2") {{ family.components }}

                  div(class="")
                    p(class="mb-0") Indirizzo:
                    p(class="font-weight-bold") {{ family.address.street }} {{ family.address.civicNumber }} {{ family.address.city }}
                b-col(cols="auto")
                  p.mb-0 Address:
                    b {{ family.address.street }} {{ family.address.civicNumber }} - {{ family.address.city }}

            h5 status:
              b-badge(v-if="family.status == 'pending'", variant="warning") {{ family.status }}
              b-badge(v-if="family.status == 'verified'", variant="success") {{ family.status }}

            b-button.b-card-footer-button(
              block,
              v-if="userRole == 'trusted'",
              :disabled="family.status == 'verified'"
              variant="success",
              @click="verifyFamily(family._id)"
            ) VERIFY

            b-button.b-card-footer-button(
              block,
              v-if="userRole != 'user'",
              variant="primary",
              :disabled="family.status != 'verified'"
              @click="$router.replace({ name: 'ManagerPackCreate', params: {family: family} })"
            ) PACK
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

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
      filterByMode: "all",
      orderByMode: "creation_date",
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
    creationDateComparer(a, b) {
      return new Date(a.creationDate) < new Date(b.creationDate) ? -1 : 1;
    },

    filterBy(filterByMode: "verified" | "pending" | "all") {
      if(this.filterByMode == filterByMode) return

      var payload = { filter: {} };

      switch (filterByMode) {
        case "verified":
        case "pending":
          payload.filter["filterByMode"] = filterByMode;
          break;
        default:
      }

      this.filterByMode = filterByMode;

      api
        .familyList(payload)
        .then((r: any) => {
          this.familyList = r.data.data.list;
        })
        .catch((e) => console.log(e));
    },

    orderBy(mode: string) {
      this.orderByMode = mode;
      switch (mode) {
        case "creation_date":
          this.familyList.sort(this.creationDateComparer);
          break;
        default:
          null;
      }
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

.my-button-selected {
  background-color: $color1;
  border-color: $color1;
}
</style>
