<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col
      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b(v-if="this.$store.state.session.userData.type == 'user'") YOUR FAMILY REPORTS
        b(v-else) FAMILY REPORTS
      hr.sidebar-hr.my-3

      b-row.mb-2(no-gutters)
        b-col(cols="2")
          b Report status:
        b-col
          b-button.ml-2(
            pill,
            variant="secondary",
            size="sm",
            @click="filterBy('verified', reporterFilter)",
            :class="{ 'my-button-selected': statusFilter == 'verified' }"
          ) Verified reports
          b-button.ml-2(
            pill,
            variant="secondary",
            size="sm",
            @click="filterBy('pending', reporterFilter)",
            :class="{ 'my-button-selected': statusFilter == 'pending' }"
          ) Pending reports
          b-button.ml-2(
            pill,
            variant="secondary",
            size="sm",
            @click="filterBy('all', reporterFilter)",
            :class="{ 'my-button-selected': statusFilter == 'all' }"
          ) All reports

      b-row.mb-2(
        no-gutters,
        v-if="this.$store.state.session.userData.type != 'user'"
      )
        b-col(cols="2")
          b Reporter:
        b-col
          b-button.ml-2(
            pill,
            variant="secondary",
            size="sm",
            @click="filterBy(statusFilter, 'me')",
            :class="{ 'my-button-selected': reporterFilter == 'me' }"
          ) Me
          b-button.ml-2(
            pill,
            variant="secondary",
            size="sm",
            @click="filterBy(statusFilter, 'all')",
            :class="{ 'my-button-selected': reporterFilter == 'all' }"
          ) All

      b-row
        b-col(v-if="familyList.length == 0", sm=12, md=6)
          p Non hai mai effettuato segnalazioni. Premi #[a(href="#", @click="$router.push({ name: 'ManagerFamilySubscribe' })") qui] per segnalare una famiglia bisognosa.

        b-col(v-else, sm=12, md=6, v-for="(family, idx) in familyList")
          b-card.mb-2(bg-variant="light", text-variant="dark", no-body)
            template(#header)
              h5
                b {{ family.name }}
                span.float-right
                  b-badge(v-if="family.status == 'pending'", variant="warning") {{ family.status }}
                  b-badge(
                    v-if="family.status == 'verified'",
                    variant="success"
                  ) {{ family.status }}
            b-card-text
              .px-4.pt-4.pb-4
                b-row
                  b-col(cols="auto")
                    div
                      span.mb-0 Phone number:
                      span.font-weight-bold.mb-2 {{ family.phoneNumber }}

                    div
                      span.mb-0 Components:
                      span.font-weight-bold.mb-2 {{ family.components }}

                    div
                      span.mb-0 Address:
                      span.font-weight-bold {{ family.address.street }} {{ family.address.civicNumber }} {{ family.address.city }}
                  b-col(cols="auto")

              b-button-group.d-flex(v-if="family.status == 'pending'")
                b-button(
                  variant="success",
                  @click="$router.push({ name: 'ManagerFamilySubscribe', params: { family: family } })"
                ) EDIT

                b-button(
                  variant="danger",
                  v-b-modal.modal,
                  @click="deleteFamilyId = family._id"
                ) DELETE

              b-button.b-card-footer-button(
                block,
                v-if="userRole == 'trusted' && family.status != 'verified'",
                variant="warning",
                @click="verifyFamily(family._id)"
              ) VERIFY

              b-button.b-card-footer-button(
                block,
                v-if="userRole != 'user' && family.status == 'verified'",
                variant="primary",
                @click="$router.push({ name: 'ManagerPackCreate', params: { family: family } })"
              ) PACK

        b-modal#modal(title="Confirm?", @ok="deleteFamily(deleteFamilyId)")
          div Confirm to delete the family
          template(#modal-cancel) Cancel
          template(#modal-ok) Confirm
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import api from "../api/family";

import { Family } from "../types";
import { AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerFamilyList",
  components: {
    Navbar,
    Sidebar,
  },
  data: () => {
    return {
      userRole: "",
      statusFilter: "all",
      reporterFilter: "me",
      orderByMode: "creation_date",
      familyList: new Array<Family>(),
      deleteFamilyId: "",
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      this.userRole = this.$store.state.session.userData.type;

      // TODO: mostrare uno spinner mentre sono caricati i dati
      api
        .familyList({
          filter: { reporterId: this.$store.state.session.userData._id },
        })
        .then((r: AxiosResponse): void => {
          this.familyList = r.data as Family[];
        })
        .catch((): void => {
          eventbus.$emit(
            "errorMessage",
            "Family",
            "Unable to verify the selected family. Retry later or contact us if the problem persists."
          );
        });
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    creationDateComparer(a, b): number {
      return new Date(a.creationDate) < new Date(b.creationDate) ? -1 : 1;
    },
    verifyFamily(familyId: string): void {
      api
        .verifyFamily({ id: familyId })
        .then(() => {
          if (this.statusFilter == "pending") {
            this.familyList = this.familyList.filter((e) => e._id != familyId);
          } else {
            this.familyList.forEach((elem) => {
              if (elem._id == familyId) elem.status = "verified";
            });
          }

          eventbus.$emit(
            "successMessage",
            "Family",
            "Family verified succesfully. Retry later or contact us if the problem persists."
          );
        })
        .catch((): void => {
          eventbus.$emit(
            "successMessage",
            "Family",
            "Unable to verify the selected family. Retry later or contact us if the problem persists."
          );
        });
    },
    filterBy(
      statusFilter: "verified" | "pending" | "all",
      reporterFilter: "me" | "all"
    ): void {
      if (
        this.statusFilter == statusFilter &&
        this.reporterFilter == reporterFilter
      )
        return;
      else if (this.statusFilter != statusFilter)
        this.statusFilter = statusFilter;
      else if (this.reporterFilter != reporterFilter)
        this.reporterFilter = reporterFilter;
      else return;

      var payload = { filter: {} };

      switch (statusFilter) {
        case "verified":
        case "pending":
          payload.filter["status"] = statusFilter;
          break;
        default:
      }
      switch (reporterFilter) {
        case "me":
          payload.filter["reporterId"] = this.$store.state.session.userData._id;
          break;
        default:
      }

      api
        .familyList(payload)
        .then((r: AxiosResponse): void => {
          this.familyList = r.data as Family[];
        })
        .catch((): void => {
          eventbus.$emit(
            "errorMessage",
            "Family",
            "Unable to retrieve food list. Retry later or contact us if the problem persists."
          );
        });
    },
    deleteFamily(id: string): void {
      api
        .deleteFamily({ id: id })
        .then((): void => {
          eventbus.$emit(
            "successMessage",
            "Family",
            "Family successfully deleted."
          );
          this.familyList = this.familyList.filter((e) => e._id != id);
        })
        .catch((): void => {
          eventbus.$emit(
            "errorMessage",
            "Family",
            "`Unable to delete the selected family. Retry later or contact us if the problem persists."
          );
        });
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
