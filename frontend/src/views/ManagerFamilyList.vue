<template lang="pug">
b-container
  b-row.justify-content-center.my-5
    b-col(lg='6' md='8' cols='11')
      hr.shaded
      h4.text-center
        b YOUR FAMILY REPORTS
      hr.shaded
  b-row.justify-content-center
    b-col(lg='4' md='8' cols='11' order-md='1' order-lg='2')
      b-alert(show='show')
        b-row(align-v='center')
          b-col(cols='auto')
            h1
              Icon(bootstrap icon='info')
          b-col
            p.m-0
              | Here are listed all your submissions for needing families. Our trusted volunteers will validate your requests and add those families to our food packs distribution system.
    b-col(lg='6' md='8' cols='11' order-md='2' order-lg='1')
      b-row.mb-2(no-gutters)
        b-col(cols='3')
          p Report status:
        b-col
          FilterButtons(:filters='filters' :selected='2' @click='(filter) => filterBy(filter)')
      b-row.mb-2(no-gutters)
        b-col(cols='3')
          p Sort by:
        b-col
          FilterButtons(:filters='sorters' :selected='1' @click='sortBy')
      p(v-if='familyList.length == 0')
        span
          | We found no reports. Be sure to select your filters and status selectors correctly. Click 
          a(href='#' @click="$router.push({ name: 'ManagerFamilySubscribe' })") here
          |  to add a new family.
      b-card.mb-4(bg-variant='light' text-variant='dark' no-body='no-body' v-for='(family, idx) in familyList' :key='idx')
        template(#header)
          h5.mb-0
            b {{ family.name }}
            span.float-right
              b-badge(v-if="family.status == 'pending'" variant='warning') {{ family.status }}
              b-badge(v-if="family.status == 'verified'" variant='success') {{ family.status }}
        b-card-text
          .px-4.py-3
            div
              span.mb-0 Phone number:&nbsp;
              span.font-weight-bold.mb-2 {{ family.phoneNumber }}
            div
              span.mb-0 Address:&nbsp;
              span.font-weight-bold
                | {{ family.address.street }} {{ family.address.civicNumber }} {{ family.address.city }}
            div
              span.mb-0 Submission date:&nbsp;
              span.font-weight-bold {{ dates.formatDate(family.creationDate) }}
            div
              span.mb-0 Family size:&nbsp;
              span.font-weight-bold.mb-2 {{ family.components }}
          b-button-group.d-flex(v-if="family.status == 'pending'")
            b-button.footerCardButton.color3(@click="$router.push({ name: 'ManagerFamilySubscribe', params: { family: family } })") EDIT
            b-button.footerCardButton.color3(v-b-modal.modal @click='deleteFamilyId = family._id') DELETE
  b-modal#modal(title='Delete the family report?' @ok='deleteFamily(deleteFamilyId)')
    div This family subscription request will be deleted permanently.
    template(#modal-footer='{ ok, cancel }')
      b-button(variant='secondary' @click='cancel()') Cancel
      b-button.color3(@click='ok()') Confirm

</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";

import FilterButtons from "../components/FilterButtons.vue";
import Icon from "../components/Icon.vue";

import { Family } from "../types";

import api from "../api/family";
import { AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerFamilyList",
  components: {
    FilterButtons,
    Icon,
  },
  data: () => {
    return {
      statusFilter: "pending",
      sortByMode: "creationDateAscending",
      familyList: new Array<Family>(),
      familyListBackup: new Array<Family>(),
      deleteFamilyId: "",
      filters: new Array<{
        name: string;
        label: string;
        icon: string | null;
        isVisible: boolean;
      }>(),
      sorters: new Array<{
        name: string;
        label: string;
        icon: string | null;
        isVisible: boolean;
      }>(),
    };
  },
  created() {
    this.filters = [
      { name: "verified", label: "Verified", icon: null, isVisible: true },
      { name: "pending", label: "Pending", icon: null, isVisible: true },
      { name: "all", label: "All", icon: null, isVisible: true },
    ];

    this.sorters = [
      {
        name: "creationDateAscending",
        label: "Submission date",
        icon: "sort-down",
        isVisible: true,
      },
      {
        name: "creationDateDescending",
        label: "Submission date",
        icon: "sort-down-alt",
        isVisible: true,
      },
    ];

    if (this.$store.getters.isUserLogged) {
      eventbus.$emit("startLoading", "Filtering all your active requests.");
      api
        .familyList({
          filter: { reporterId: this.$store.state.session.userData._id },
        })
        .then((r: AxiosResponse): void => {
          this.familyList = r.data as Family[];
          this.familyListBackup = r.data as Family[];

          this.filterBy(this.statusFilter);
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
    filterBy(statusFilter: string): void {
      this.statusFilter = statusFilter;
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
      this.sortBy(this.sortByMode);
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
