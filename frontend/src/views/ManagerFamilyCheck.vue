<template lang="pug">
b-container
  b-row.justify-content-center.my-5
    b-col(lg='6' md='8' sm='10')
      div
        hr.shaded
        h4.text-center
          b FAMILIES
        hr.shaded
  b-row(align-h='between').mb-0
    b-col(lg='6' md='8' sm='10')
      b-form-group(label='' label-for='filter-input' label-size='sm')
        b-input-group(size='sm')
          b-form-input#filter-input(v-model='filterQuery' type='text' placeholder='Type to Search')
          b-input-group-append
            b-button.color3(:disabled='!filterQuery' @click="filterQuery = ''") Clear    
    b-col(cols='auto')
      b-pagination(size='sm' v-model='currentPage' :total-rows='totalRows' :per-page='perPage' align='fill')


  b-row.justify-content-center
    b-col(lg='12' md='12' sm='10')
      b-table(striped='striped' hover='hover' :items='familyList' :fields='tableFields' :current-page='currentPage' :filter='filterQuery' :filter-included-fields='filterOn' :per-page='perPage')
        template(#cell(creationdate)='data')
          span {{ dates.formatDate(data.item.creationDate)  }}
        template(#cell(address)='data')
          span
            | {{ data.item.address.street + &quot; - &quot; + data.item.address.civicNumber + &quot;, &quot; + data.item.address.city  }}
        template(#cell(status)='data')
          h5(v-if="data.item.status=='verified'")
            b-badge(variant='success') Verified 
          h5(v-if="data.item.status=='pending'")
            b-badge(variant='warning') Pending check 
        template(#cell(actions)='data')
          b-button.color3(block='block' size='sm' @click='verifyFamily(data.item._id)' v-if="data.item.status == 'pending'")
            span Verify
            Icon(bootstrap icon='check')
          b-button.color3(v-b-modal.modal block='block' size='sm' @click='deletedFamilyId = data.item._id')
            span Delete
            Icon(bootstrap icon='trash')
  b-modal#modal(title='Delete the selected family?' @ok='deleteFamily()')
    div This family will be deleted permanently.
    template(#modal-footer='{ ok, cancel }')
      b-button(variant='secondary' @click='cancel()') Cancel
      b-button.color3(@click='ok()') Confirm

</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";

import { Family } from "../types";

import Icon from "../components/Icon.vue";

import familyApi from "../api/family";
import { AxiosResponse, AxiosError } from "axios";

export default Vue.extend({
  name: "ManagerFamilyCheck",
  components: {
    Icon,
  },
  data: () => {
    return {
      familyList: new Array<Family>(),
      tableFields: [
        { key: "status", sortable: true, label: "Status" },
        { key: "name", sortable: true, label: "Family name" },
        { key: "components", sortable: true, label: "Family size" },
        { key: "phoneNumber", label: "Phone number" },
        { key: "address", sortable: true, label: "Address" },
        { key: "creationDate", sortable: true, label: "Submission date" },
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
      selectedFamily: {} as Family,
      currentPage: 1,
      perPage: 10,
      totalRows: 1,
      deletedFamilyId: "",
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
          console.log(e);
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
