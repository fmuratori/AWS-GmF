<template lang="pug">
b-container
  .justify-content-center.my-5
    h3 
      b REPORTED FAMILIES

    b-row
      b-col
        b-button-group(
          v-if="this.$store.state.session.userData.type != 'user'"
        )
          b-button(@click="changeView('my', status)") Only my
          b-button(@click="changeView('all', status)") All

        b-button-group
          b-button(@click="changeView(view, 'verified')") Accettati
          b-button(@click="changeView(view, 'pending')") In attesa
          b-button(@click="changeView(view, 'all')") Tutte

    b-row.mb-2(no-gutters)
      b-col(cols="auto")
      p Stato segnalazioni:
      b-col
        b-button.ml-2(
          pill,
          variant="secondary",
          size="sm",
          @click="changeView(view, 'verified')",
          :class="{ 'my-button-selected': orderByMode == 'creation_date' }"
        ) Segnalazioni accettate
        b-button.ml-2(
          pill,
          variant="secondary",
          size="sm",
          @click="changeView(view, 'pending')",
          :class="{ 'my-button-selected': orderByMode == 'unread_messages' }"
        ) In attesa di accettazione
        b-button.ml-2(
          pill,
          variant="secondary",
          size="sm",
          @click="changeView(view, 'all')",
          :class="{ 'my-button-selected': orderByMode == 'expiration_date' }"
        ) Tutte le segnalazioni

    b-row
      div(v-if="familyList.length == 0") No family segnalation found for this user
      b-col(sm=12, md=6, v-for="(family, idx) in familyList", :key="idx")
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
                    p.font-weight-bold.mb-2 {{ family.address.street }} {{ family.address.civicNumber }}, {{ family.address.city }}
                b-col(cols="auto")
                  .mb-2
                    p.mb-0 Stato segnalazione:
                    h5
                      b-badge(
                        v-if="family.status == 'pending'",
                        variant="warning"
                      ) {{ family.status }}
                      b-badge(
                        v-if="family.status == 'verified'",
                        variant="success"
                      ) {{ family.status }}

          //- b-button.b-card-footer-button(
          //-   block,
          //-   v-if="userRole == 'trusted' && family.status == 'pending'",
          //-   variant="success",
          //-   @click="verifyFamily(family._id)"
          //- ) VERIFY
          //- b-button.b-card-footer-button(
          //-   block,
          //-   v-else,
          //-   variant="success",
          //-   disabled
          //- ) VERIFY

          //- b-button.b-card-footer-button(
          //-   block,
          //-   v-if="userRole != 'user' && family.status == 'verified'",
          //-   variant="primary",
          //-   @click="$router.push({ name: 'ManagerPackCreate', params: { family: family } })"
          //- ) PACK
          //- b-button.b-card-footer-button(
          //-   block,
          //-   v-else,
          //-   variant="primary",
          //-   disabled
          //- ) PACK
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import familyApi from "../api/family";

import { Family } from "../types";
import { AxiosError, AxiosResponse } from "axios";

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
      this.userRole = this.$store.state.session.userData.type;

      // TODO: mostrare uno spinner mentre sono caricati i dati
      familyApi
        .familyList({
          filter: { reporterId: this.$store.state.session.userData._id },
        })
        .then((r: AxiosResponse): void => {
          this.familyList = r.data as Family[];
        })
        .catch((e: AxiosError): void => console.log(e));
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    changeView(view: "my" | "all", status: "verified" | "pending" | "all") {
      var payload = { filter: {} };

      if (view == "my") {
        payload.filter["reporterId"] = this.$store.state.session.userData._id;
      }

      switch (status) {
        case "verified":
        case "pending":
          payload.filter["status"] = status;
          break;
        default:
      }

      this.view = view;
      this.status = status;

      familyApi
        .familyList(payload)
        .then((r: AxiosResponse): void => {
          this.familyList = r.data as Family[];
        })
        .catch((e: AxiosError): void => console.log(e));
    },
    // verifyFamily(familyId: string) {
    //   api
    //     .verifyFamily({ id: familyId })
    //     .then((r) => {
    //       this.changeView(this.view);
    //       this.$bvToast.toast(`Family verified with success.`, {
    //         title: "Verify",
    //         autoHideDelay: 5000,
    //         variant: "success",
    //         appendToast: false,
    //       });
    //     })
    //     .catch((e) => {
    //       this.$bvToast.toast(
    //         `Unable to verify the family. Retry later or contact us.`,
    //         {
    //           title: "Verify",
    //           autoHideDelay: 5000,
    //           variant: "danger",
    //           appendToast: false,
    //         }
    //       );
    //     });
    // },
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
