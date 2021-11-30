<template lang="pug">
b-container
  b-row.justify-content-center.my-5
    b-col(lg=6, md=8, sm=10)
      div
        hr.shaded
        h4.text-center
          b FAMILIES
        hr.shaded

  b-row.mb-0
    b-col(lg=6, md=8, sm=10)
      b-form-group(label="" label-for="filter-input" label-size="sm")
        b-input-group(size="sm")
          b-form-input#filter-input(v-model="filterQuery" type="text" placeholder="Type to Search")
          b-input-group-append
            b-button.color3(:disabled="!filterQuery" @click="filterQuery = ''") Clear
      
  b-row.justify-content-center
    b-col(lg=12, md=12, sm=10)
      b-table(striped hover 
      :items="familyList" 
      :fields="tableFields"
      :current-page="currentPage"
      :filter="filterQuery"
      :filter-included-fields="filterOn" 
      :per-page="perPage")
        template(#cell(creationDate)="data")
          span {{ dates.formatDate(data.item.creationDate)  }}
        template(#cell(address)="data")
          span {{ data.item.address.street + " - " + data.item.address.civicNumber + ", " + data.item.address.city  }}
        template(#cell(status)="data")
          h5(v-if="data.item.status=='verified'")
            b-badge(variant="success") Verified 
          h5(v-if="data.item.status=='pending'")
            b-badge(variant="warning") Pending check 
          //- h5(v-if="data.item.status=='deleted'")
          //-   b-badge(variant="deleted") Deleted 
        template(#cell(actions)="data")
          b-button.color3(block size="sm" @click="verifyFamily(data.item._id)" v-if="data.item.status == 'pending'")
            span Add
            b-icon(icon="check")
          b-button.color3(v-b-modal.modal, block size="sm" @click="deletedFamilyId = data.item._id")
            span Delete
            b-icon(icon="trash")
          //- b-button.color3(v-if="data.item.status == 'deleted'")

  b-row(align-h="end")
    b-col(lg=3 md=6 cols=12)
      b-pagination(
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="fill"
        size="sm")

  b-modal#modal(title="Delete the selected family?", @ok="deleteFamily()")
    div This family will be deleted permanently.
    
    template(#modal-footer="{ ok, cancel }")
      b-button(variant='secondary' @click='cancel()') Cancel
      b-button.color3(@click='ok()') Confirm

</template>

<script lang="ts">
import Vue from "vue";

import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import InputDate from "../components/input/InputDate.vue";
import eventbus from "../eventbus";

import { Family, Address } from "../types";

import familyApi from "../api/family";

import { AxiosResponse, AxiosError, Axios } from "axios";

export default Vue.extend({
  name: "ManagerFamilyCheck",
  components: {
    Navbar,
    Sidebar,
    InputDate,
  },
  data: () => {
    return {
      familyList: new Array<Family>(),
      tableFields: [
        { key: "name", sortable: true, label: "Family name" },
        { key: "components", sortable: true, label: "Family size" },
        { key: "phoneNumber", label: "Phone number" },
        { key: "address", sortable: true, label: "Address" },
        { key: "creationDate", sortable: true, label: "Submission date" },
        { key: "status", sortable: true, label: "Status" },
        { key: "actions", label: "" },
      ],
      filterOn: [
        "name",
        "phoneNumber",
        "components",
        "address",
        "creationDate",
        "status",
      ],
      filterQuery: "",
      filterDate: null,
      selectedFamily: null,
      currentPage: 1,
      perPage: 10,
      totalRows: 1,
      deletedFamilyId: 0,
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      this.loadFamiliesData();
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    selectFamily(family: Family): void {
      this.selectedFamily = family;
    },
    loadFamiliesData() {
      eventbus.$emit("startLoading", "Loading registered families");
      familyApi
        .familyList({})
        .then((r: AxiosResponse) => {
          if (r.status == 200) {
            this.familyList = r.data as Family[];
            this.totalRows = this.familyList.length;
          } else {
            eventbus.$emit(
              "errorMessage",
              "Family check",
              "Unable to load families list. Retry later or contact us if the problem persists."
            );
          }
        })
        .catch((e: AxiosError) => {
          eventbus.$emit(
            "errorMessage",
            "Family check",
            "Unable to load families list. Retry later or contact us if the problem persists."
          );
        })
        .then(() => {
          eventbus.$emit("stopLoading");
        });
    },
    verifyFamily(id: string) {
      eventbus.$emit("startLoading", "Verifying the selected family status.");
      familyApi
        .verifyFamily({ id: id })
        .then((r: AxiosResponse) => {
          if (r.status == 200) {
            eventbus.$emit(
              "successMessage",
              "Family",
              "Family status setted succesfully."
            );
            this.loadFamiliesData();
          } else {
            eventbus.$emit(
              "errorMessage",
              "Family",
              "Family status setting failed. Retry later or contact us if the problem persists."
            );
          }
        })
        .catch((e: AxiosError) => {
          console.log(e);
          eventbus.$emit(
            "errorMessage",
            "Family",
            "Family status setting failed. Retry later or contact us if the problem persists."
          );
        })
        .then(() => eventbus.$emit("stopLoading"));
    },
    deleteFamily() {
      eventbus.$emit("startLoading", "Deleting the selected family.");
      familyApi
        .deleteFamily({ id: this.deletedFamilyId })
        .then((r: AxiosResponse) => {
          if (r.status == 200) {
            eventbus.$emit(
              "successMessage",
              "Family",
              "Family deleted succesfully."
            );
            this.loadFamiliesData();
          } else {
            eventbus.$emit(
              "errorMessage",
              "Family",
              "Family deletion failed. Retry later or contact us if the problem persists."
            );
          }
        })
        .catch((e: AxiosError) => {
          console.log(e);
          eventbus.$emit(
            "errorMessage",
            "Family",
            "Family deletion failed. Retry later or contact us if the problem persists."
          );
        })
        .then(() => eventbus.$emit("stopLoading"));
    },
  },
});
</script>

<style scoped lang="scss"></style>
