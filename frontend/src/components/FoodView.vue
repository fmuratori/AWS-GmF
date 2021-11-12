<template lang="pug">
div
  b-row
    b-col
      b-form-group
        b-input-group
          b-form-input(
            v-model="filter",
            type="search",
            placeholder="Type to search"
          )
          b-input-group-append
            b-button(:disabled="!filter", @click="filter = ''") Clear

    b-col
      b-pagination(
        v-model="currentPage",
        :total-rows="totalRows",
        :per-page="perPage"
      )

  b-table(
    striped,
    hover,
    :fields="tableFields",
    :items="foodList",
    :current-page="currentPage",
    :per-page="perPage",
    :filter="filter",
    :filter-included-fields="filterOn",
    :sort-by.sync="sortBy",
    :sort-desc.sync="sortDesc",
    :sort-direction="sortDirection",
    @filtered="onFiltered"
  )
    template(#cell(labels)="data")
      b-badge(v-for="label in data.value", variant="success") {{ label }}

    template(#cell(selected)="{ item }")
      div(:key="index", ref="reload")
        b-button(
          @click="removeClick(item)",
          :disabled="!item.selected || item.selected == 0"
        ) -
        b {{ item.selected ? item.selected : 0 }}
        b-button(
          @click="addClick(item)",
          :disabled="item.selected == item.number"
        ) +
</template>

<script lang="ts">
import Vue from "vue";
import { SelectableFood } from "../types";
import { FoodView } from "../viewTypes";
import moment from "moment";

import api from "../api";

export default Vue.extend({
  name: "FoodView",
  props: {
    selectable: Boolean,
  },
  data: (): FoodView => {
    return {
      foodList: new Array<SelectableFood>(),
      tableFields: [
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
          key: "selected",
          label: "Selected",
          sortable: false,
        },
        {
          key: "expirationDate",
          label: "Expiration Date",
          sortable: true,
          formatter: (value) => {
            return moment(value).locale("en").format("LL");
          },
        },
        {
          key: "labels",
          label: "Labels",
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
    };
  },
  created() {
    if (!this.selectable) {
      this.tableFields.forEach((elem, index) => {
        if (elem.key == "selected") this.tableFields.splice(index, 1);
      });
    }

    api.foodList({ filter: { number: { $gt: 0 } } }).then((r: any) => {
      this.foodList = r.data;
      this.totalRows = r.data.length;
    });
  },
  methods: {
    formatDate(date: Date) {
      return moment(date).locale("en").format("LL");
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    addClick(item: any) {
      if (!item.selected) item.selected = 1;
      else if (item.selected < item.number) item.selected += 1;
      this.index += 1;
      this.$emit("data", this.foodList);
    },
    removeClick(item: any) {
      if (item.selected > 0) item.selected -= 1;
      this.index += 1;
      this.$emit("data", this.foodList);
    },
  },
});
</script>

<style scoped lang="scss"></style>
