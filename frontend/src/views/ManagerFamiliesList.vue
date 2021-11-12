<template lang="pug">
b-container.justify-content-center.my-5
  p TUE SEGNALAZIONI

  b-row.mb-2(no-gutters)
    b-col(cols="auto")
      p Stato segnalazioni:
    b-col
      b-button.ml-2(
        pill,
        variant="secondary",
        size="sm",
        @click="filterBy('verified')",
        :class="{ 'my-button-selected': filterByMode == 'verified' }"
      ) Segnalazioni accettate
      b-button.ml-2(
        pill,
        variant="secondary",
        size="sm",
        @click="filterBy('pending')",
        :class="{ 'my-button-selected': filterByMode == 'pending' }"
      ) In attesa di accettazione
      b-button.ml-2(
        pill,
        variant="secondary",
        size="sm",
        @click="filterBy('all')",
        :class="{ 'my-button-selected': filterByMode == 'all' }"
      ) Tutte le segnalazioni

  b-row.mb-2(no-gutters)
    b-col(cols="auto")
    p Ordina per:
    b-col
      b-button.ml-2(
        pill,
        variant="secondary",
        size="sm",
        @click="orderBy('creation_date')",
        :class="{ 'my-button-selected': orderByMode == 'creation_date' }"
      ) Data creazione

  b-row
    b-col(v-if="familyList.length == 0", sm=12, md=6)
      p Non hai mai effettuato segnalazioni. Premi #[a(href="#", @click="$router.replace({ name: 'ManagerFamiliesSubscribe' })") qui] per segnalare una famiglia bisognosa.

    b-col(
      v-else,
      sm=12,
      md=6,
      v-for="(family, idx) in familyList",
      :key="idx"
    )
      b-card.mb-2(bg-variant="light", text-variant="dark", no-body)
        b-card-text
          .px-4.pt-4
            h5 {{ family.name }}
            b-row
              b-col(cols="auto")
                div(class="")
                  p.mb-0 Numero di cellulare:
                  p.font-weight-bold.mb-2 {{ family.phoneNumber }}

                div(class="")
                  p.mb-0 Numero elementi della famiglia:
                  p.font-weight-bold.mb-2 {{ family.components }}

                div(class="")
                  p.mb-0 Indirizzo:
                  p.font-weight-bold {{ family.address.street }} {{ family.address.civicNumber }} {{ family.address.city }}
              b-col(cols="auto")
                p.mb-0 Address:
                  b {{ family.address.street }} {{ family.address.civicNumber }} - {{ family.address.city }}

          h5 status:
            b-badge(v-if="family.status == 'pending'", variant="warning") {{ family.status }}
            b-badge(v-if="family.status == 'verified'", variant="success") {{ family.status }}

          b-button.b-card-footer-button(
            block,
            :disabled="family.status == 'verified'",
            variant="success",
            @click="$router.replace({ name: 'ManagerFamiliesSubscribe', params: { family: family } })"
          ) EDIT

          b-button.b-card-footer-button(
            block,
            v-if="userRole == 'trusted'",
            :disabled="family.status == 'verified'",
            variant="warning",
            @click="verifyFamily(family._id)"
          ) VERIFY

          b-button.b-card-footer-button(
            block,
            v-if="userRole != 'user'",
            variant="primary",
            :disabled="family.status != 'verified'",
            @click="$router.replace({ name: 'ManagerPackCreate', params: { family: family } })"
          ) PACK
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import familyApi from "../api/family";

import { Family } from "../types";

export default Vue.extend({
  name: "ManagerFamiliesList",
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
    creationDateComparer(a, b) {
      return new Date(a.creationDate) < new Date(b.creationDate) ? -1 : 1;
    },
    verifyFamily(familyId: string) {
      familyApi
        .verifyFamily({ id: familyId })
        .then((r) => {
          this.changeView(this.view);
          this.$root.$bvToast.toast(`Family verified with success.`, {
            title: "Verify",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
        })
        .catch((e) => {
          this.$root.$bvToast.toast(
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
    filterBy(filterByMode: "verified" | "pending" | "all") {
      if (this.filterByMode == filterByMode) return;

      var payload = { filter: {} };

      switch (filterByMode) {
        case "verified":
        case "pending":
          payload.filter["filterByMode"] = filterByMode;
          break;
        default:
      }

      this.filterByMode = filterByMode;

      familyApi
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
