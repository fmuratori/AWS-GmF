<template lang="pug">
div
  b-table(
    striped,
    hover,
    :fields="tableFields",
    :items="familyList",
    :current-page="currentPage",
    :per-page="perPage",
    :sort-by.sync="sortBy",
    :sort-desc.sync="sortDesc",
    :sort-direction="sortDirection"
  )
    template(#cell(select)="{ item }")
      b-button.color3(@click="select(item)", size="sm") Select

  
  b-row(align-h="end")
    b-col(cols="auto")
      b-pagination(
        v-model="currentPage",
        :total-rows="totalRows",
        :per-page="perPage"
      )
</template>

<script lang="ts">
import Vue from "vue";
import { Address, Family } from "../types";
import moment from "moment";

import api from "../api/family";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "FamilyView",
  data: () => {
    return {
      familyList: new Array<Family>(),
      tableFields: [
        {
          key: "name",
          label: "Name",
          sortable: true,
        },
        {
          key: "phoneNumber",
          label: "Phone Number",
          sortable: false,
        },
        {
          key: "components",
          label: "Components",
          sortable: true,
        },
        {
          key: "creationDate",
          label: "Creation Date",
          sortable: true,
          formatter: (date: Date) => {
            return moment(date).locale("en").format("LL");
          },
        },
        {
          key: "address",
          label: "Address",
          sortable: false,
          formatter: (addr: Address) => {
            return addr.street + " " + addr.civicNumber + ", " + addr.city;
          },
        },
        {
          key: "lastPackDate",
          label: "Last received pack",
          sortable: true,
        },
        {
          key: "select",
          label: "",
          sortable: false,
        },
      ],
      totalRows: 0,
      currentPage: 1,
      perPage: 10,
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
    };
  },
  created() {
    api
      .familyList({ filter: { status: "verified" } })
      .then((r: AxiosResponse): void => {
        this.familyList = r.data as Family[];
        this.totalRows = (r.data as Family[]).length;
      })
      .catch((e: AxiosError): void => {
        console.log(e);
      });
  },
  methods: {
    select(family: Family): void {
      this.$emit("select", family);
    },
  },
});
</script>

<style scoped lang="scss"></style>
