<template lang="pug">
div
  b-row.justify-content-center(:align-h='$store.getters.isMediumScreenWidth ? null : "between"')
    b-col(lg='6' md='8' cols='10')
      b-form-group
        b-input-group
          b-form-input(v-model='filter' type='search' placeholder='Type to search' size='sm')
          b-input-group-append
            b-button(:disabled='!filter' @click="filter = ''" size='sm') Clear
    b-col(md='auto' cols='10')
      b-pagination(v-model='currentPage' :total-rows='totalRows' :per-page='perPage' align='fill' size='sm')
  
    b-col(md='12' cols='10')
      b-table(show-empty striped='striped' hover='hover' :fields='tableFields' :items='foodList' :current-page='currentPage' :per-page='perPage' :filter='filter' :filter-included-fields='filterOn' :sort-by.sync='sortBy' :sort-desc.sync='sortDesc' :sort-direction='sortDirection' @filtered='onFiltered')
        template(#cell(load)='{ item }')
          b-button(@click='load(item)' size='sm') Edit
        template(#cell(labels)='data')
          b-badge.mr-1(v-for='(label, idx) in data.value' variant='success' :key="idx") {{ label }}
        template(#cell(selected)='{ item }')
          b-form-spinbutton(inline min="0" :max="item.number" value=0 v-model="item.selected" @change='updateFoods(item)')
        template(#cell(delete)='{ item }')
          b-button.color3(block='block' size='sm' v-b-modal.modal @click='deleteFoodId = item._id') Delete
        template(#empty='scope')
          h4.text-center There are no records to show
        template(#emptyfiltered='scope')
          h4.text-center There are no records matching your request
      b-modal#modal(title='Delete the selected food?' @ok='deleteFood(deleteFoodId)')
        div The selected food will be deleted permanently.
        template(#modal-footer='{ ok, cancel }')
          b-button(variant='secondary' @click='cancel()') Cancel
          b-button.color3(@click='ok()') Confirm
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import dates from "../misc/dates";

import { SelectableFood } from "../types/types";
import { FoodView } from "../types/viewTypes";

import api from "../api/food";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "FoodView",
  props: {
    selectableItems: Boolean,
    loadableItems: Boolean,
    deletableItem: Boolean,
  },
  data: (): FoodView => {
    return {
      foodList: new Array<SelectableFood>(),
      tableFields: [
        {
          key: "load",
          label: "",
          sortable: false,
        },

        {
          key: "name",
          label: "Name",
          sortable: true,
        },
        {
          key: "number",
          label: "Number",
          sortable: true,
        },
        {
          key: "expirationDate",
          label: "Expiration Date",
          sortable: true,
          formatter: (value) => {
            return dates.formatDate(value);
          },
        },
        {
          key: "labels",
          label: "Labels",
          sortable: false,
        },
        {
          key: "selected",
          label: "Selected",
          sortable: false,
        },
        {
          key: "delete",
          label: "",
          sortable: false,
        },
      ],
      totalRows: 0,
      currentPage: 1,
      perPage: 10,
      filter: "",
      filterOn: ["name", "labels"],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      index: 0,
      deleteFoodId: "",
    };
  },
  created() {
    if (!this.selectableItems)
      this.tableFields = this.tableFields.filter(
        (elem) => elem.key != "selected"
      );
    if (!this.loadableItems)
      this.tableFields = this.tableFields.filter((elem) => elem.key != "load");
    if (!this.deletableItem)
      this.tableFields = this.tableFields.filter(
        (elem) => elem.key != "delete"
      );

    api
      .foodList({ filter: { number: { $gt: 0 } } })
      .then((r: AxiosResponse): void => {
        this.foodList = r.data as SelectableFood[];
        this.totalRows = (r.data as SelectableFood[]).length;
      })
      .catch((e: AxiosError): void => {
        console.log(e);
      });
  },
  methods: {
    onFiltered(filteredItems: SelectableFood[]) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    updateFoods() {
      this.$emit(
        "data",
        this.foodList.filter((f: SelectableFood) => f.selected)
      );
    },
    load(item: SelectableFood) {
      this.$emit("load", item);
    },
    deleteFood(id: string) {
      api
        .deleteFood({ id: id })
        .then((): void => {
          this.foodList = this.foodList.filter((e) => e._id != id);
          eventbus.$emit(
            "successMessage",
            "Foods",
            "Food deleted successfully.",
            this
          );
        })
        .catch((): void => {
          eventbus.$emit(
            "errorMessage",
            "Foods",
            "Unable to delete selected foods. Retry later or contact us if the problem persists."
          );
        });
    },
  },
});
</script>

<style scoped lang="scss"></style>
