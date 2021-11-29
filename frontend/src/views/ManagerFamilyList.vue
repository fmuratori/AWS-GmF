<template lang="pug">
b-container
  b-row.justify-content-center.my-5
    b-col(lg=6, md=8, cols=11)
      hr.shaded
      h4.text-center
        b(v-if="this.$store.state.session.userData.type == 'user'") YOUR FAMILY REPORTS
        b(v-else) FAMILY REPORTS
      hr.shaded

  b-row.justify-content-center
    b-col(lg=4, md=8, cols=11 order-md=1 order-lg=2)
      b-alert(show)
        b-row(align-v="center")
          b-col(cols="auto")
            h1 
              b-icon(icon="info")
          b-col 
            p.m-0 Here are listed all your submissions for needing families. Our trusted volunteers will validate your requests and add those families to our food packs distribution system. 
      
      b-alert(show).mb-5
        b-row(align-v="center")
          b-col(cols="auto")
            h1 
              b-icon(icon="info")
          b-col 
            p.m-0 To make things easier, filter your submissions by status or sort them.

    b-col(lg=6, md=8, cols=11 order-md=2 order-lg=1)
      b-row.mb-2(no-gutters)
        b-col(cols="3")
          p Report status:
        b-col
          b-button.ml-2(
            pill,
            variant="secondary",
            size="sm",
            @click="filterBy('verified', reporterFilter)",
            :class="{ 'my-button-selected': statusFilter == 'verified' }"
          ) Verified
          b-button.ml-2(
            pill,
            variant="secondary",
            size="sm",
            @click="filterBy('pending', reporterFilter)",
            :class="{ 'my-button-selected': statusFilter == 'pending' }"
          ) Pending
          b-button.ml-2(
            pill,
            variant="secondary",
            size="sm",
            @click="filterBy('all', reporterFilter)",
            :class="{ 'my-button-selected': statusFilter == 'all' }"
          ) All

      b-row.mb-2(no-gutters)
        b-col(cols="3")
          p Sort by:
        b-col

          b-button.ml-2.mb-2(
            pill,
            variant="secondary",
            size="sm",
            @click="sortBy('creationDateDescending')",
            :class="{ 'color1': sortByMode == 'creationDateDescending' }"
          ) 
            span.mr-1 Submission date
            b-icon(icon="sort-down" )

          b-button.ml-2.mb-2(
            pill,
            variant="secondary",
            size="sm",
            @click="sortBy('creationDateAscending')",
            :class="{ 'color1': sortByMode == 'creationDateAscending' }"
          ) 
            span.mr-1 Submission date
            b-icon(icon="sort-down-alt" )

      b-row.mb-2(
        no-gutters,
        v-if="this.$store.state.session.userData.type != 'user'"
      )
        FilterButtons(
          label="Reporter",
          :filters="['me', 'all']",
          v-on:click="(filter) => filterBy(statusFilter, filter)"
        )

      p(v-if="familyList.length == 0") 
        span We found no reports. Be sure to select your filters and status selectors correctly. Click #[a(href="#", @click="$router.push({ name: 'ManagerFamilySubscribe' })") here] to add a new family.
        
      b-card.mb-4(bg-variant="light", text-variant="dark", no-body v-for="(family, idx) in familyList" :key="idx")
        template(#header)
          h5.mb-0
            b {{ family.name }}
            span.float-right
              b-badge(v-if="family.status == 'pending'", variant="warning") {{ family.status }}
              b-badge(
                v-if="family.status == 'verified'",
                variant="success"
              ) {{ family.status }}
        b-card-text
          .px-4.py-3
            div
              span.mb-0 Phone number:&nbsp;
              span.font-weight-bold.mb-2 {{ family.phoneNumber }}
            div
              span.mb-0 Address:&nbsp;
              span.font-weight-bold {{ family.address.street }} {{ family.address.civicNumber }} {{ family.address.city }}
            div
                span.mb-0 Submission date:&nbsp;
                span.font-weight-bold {{ dates.formatDate(family.creationDate) }}
            div
              span.mb-0 Family size:&nbsp;
              span.font-weight-bold.mb-2 {{ family.components }}

          b-button-group.d-flex(v-if="family.status == 'pending'")
            b-button.footerCardButton.color3(
              @click="$router.push({ name: 'ManagerFamilySubscribe', params: { family: family } })"
            ) EDIT

            b-button.footerCardButton.color3(
              v-b-modal.modal,
              @click="deleteFamilyId = family._id"
            ) DELETE

          b-button(
            block,
            v-if="userRole == 'trusted' && family.status != 'verified'",
            variant="warning",
            @click="verifyFamily(family._id)"
          ) VERIFY

          b-button(
            block,
            v-if="userRole != 'user' && family.status == 'verified'",
            variant="primary",
            @click="$router.push({ name: 'ManagerPackCreate', params: { family: family } })"
          ) PACK

  b-modal#modal(title="Delete the family report?", @ok="deleteFamily(deleteFamilyId)")
    div This family subscription request will be deleted permanently.
    
    template(#modal-footer="{ ok, cancel }")
      b-button(variant='secondary' @click='cancel()') Cancel
      b-button.color3(@click='ok()') Confirm

</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import FilterButtons from "../components/FilterButtons.vue";

import api from "../api/family";

import { Family } from "../types";
import { AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerFamilyList",
  components: {
    Navbar,
    Sidebar,
    FilterButtons,
  },
  data: () => {
    return {
      userRole: "",
      statusFilter: "pending",
      reporterFilter: "me",
      sortByMode: "creationDateAscending",
      familyList: new Array<Family>(),
      familyListBackup: new Array<Family>(),
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
      eventbus.$emit("startLoading", "Filtering all your active requests.");
      api
        .familyList({
          filter: { reporterId: this.$store.state.session.userData._id },
        })
        .then((r: AxiosResponse): void => {
          this.familyList = r.data as Family[];
          this.familyListBackup = r.data as Family[];
          this.filterBy("pending", this.reporterFilter);
          this.sortBy(this.sortByMode);
        })
        .catch((): void => {
          eventbus.$emit(
            "errorMessage",
            "Family",
            "Unable to verify the selected family. Retry later or contact us if the problem persists."
          );
        })
        .then(() => {
          eventbus.$emit("stopLoading");
        });
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    creationDateComparer(a, b): number {
      return new Date(a.creationDate) < new Date(b.creationDate) ? -1 : 1;
    },
    sortBy(mode: string) {
      this.sortByMode = mode;
      switch (mode) {
        case "creationDateAscending":
          this.familyList = this.familyList.sort(this.creationDateComparer);
          break;
        case "creationDateDescending":
          this.familyList = this.familyList
            .sort(this.creationDateComparer)
            .reverse();
          break;
        default:
          null;
      }
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
      this.statusFilter = statusFilter;
      this.reporterFilter = reporterFilter;

      this.familyList = this.familyListBackup;
      switch (statusFilter) {
        case "verified":
        case "pending":
          this.familyList = this.familyList.filter(
            (f: Family) => f.status == statusFilter
          );
          break;
        default:
      }
      switch (reporterFilter) {
        case "me":
          this.familyList = this.familyList.filter(
            (f: Family) => f._id == this.$store.state.session.userData._id
          );
          break;
        default:
      }
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

<style scoped lang="scss"></style>
