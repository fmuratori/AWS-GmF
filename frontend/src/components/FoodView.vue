<template lang="pug">
div
  b-row
    b-col(cols=12 md=6 lg=6)
      b-form-group
        b-input-group
          b-form-input(
            v-model="filter",
            type="search",
            placeholder="Type to search"
          )
          b-input-group-append
            b-button(:disabled="!filter", @click="filter = ''") Clear

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
    template(#cell(load)="{ item }")
      b-button(@click="load(item)", size="sm") Edit

    template(#cell(labels)="data")
      b-badge.mr-1(v-for="label in data.value", variant="success") {{ label }}

    template(#cell(selected)="{ item }")
      div(:key="index", ref="reload")
        b-button(
          pill,
          @click="removeClick(item)",
          :disabled="!item.selected || item.selected == 0"
        ) -
        b.ml-4.mr-4 {{ item.selected ? item.selected : 0 }}
        b-button(
          pill,
          @click="addClick(item)",
          :disabled="item.selected == item.number"
        ) +

    template(#cell(delete)="{ item }")
      b-button.color3(
        block,
        size="sm",
        v-b-modal.modal,
        @click="deleteFoodId = item._id"
      ) Delete

  b-row(align-h="end")
    b-col(cols="auto")
      b-pagination(
        v-model="currentPage",
        :total-rows="totalRows",
        :per-page="perPage"
      )

  b-modal#modal(title="Delete the selected food?", @ok="deleteFood(deleteFoodId)")
    div The selected food will be deleted permanently.
    
    template(#modal-footer="{ ok, cancel }")
      b-button(variant='secondary' @click='cancel()') Cancel
      b-button.color3(@click='ok()') Confirm
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import { SelectableFood } from "../types";
import { FoodView } from "../viewTypes";
import dates from "../misc/dates";

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
          key: "selected",
          label: "Selected",
          sortable: false,
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
    addClick(item: SelectableFood) {
      if (!item.selected) item.selected = 1;
      else if (item.selected < item.number) item.selected += 1;
      this.index += 1;
      this.$emit(
        "data",
        this.foodList.filter((f: SelectableFood) => f.selected != 0)
      );
    },
    removeClick(item: SelectableFood) {
      if (item.selected > 0) item.selected -= 1;
      this.index += 1;
      this.$emit(
        "data",
        this.foodList.filter((f: SelectableFood) => f.selected != 0)
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
            "Food deleted successfully."
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
