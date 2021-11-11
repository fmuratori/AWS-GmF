<template lang="pug">
div Sort by:
  b-button.ml-2(
    pill,
    variant="secondary",
    size="sm",
    @click="updateView(null, 'name', null)",
    :class="{ 'my-button-selected': true }"
  ) Name
  b-button.ml-2(
    pill,
    variant="secondary",
    size="sm",
    @click="updateView(null, 'expirationDate', null)",
    :class="{ 'my-button-selected': false }"
  ) Expiration date
  b-button.ml-2(
    pill,
    variant="secondary",
    size="sm",
    @click="updateView(null, 'number', null)",
    :class="{ 'my-button-selected': false }"
  ) Number

  b-table(striped, hover, :fields="tableFields", :items="foodList")
    template(#cell(name)="data") {{ data.value }}
    template(#cell(expirationDate)="data") {{ formatDate(data.value) }}
    template(#cell(labels)="data")
      b-badge(v-for="label in data.value", variant="success") {{ label }}
    template(#cell(number)="data") {{ data.value }}
    template(#cell(selected)="{ item }")
      div
        b-button(
          @click="removeFood(item._id)",
          :disabled="isNoneSelected(item._id)"
        ) -
        b {{ getSelectedQuantity(item._id) }}
        b-button(
          @click="addFood(item._id, item)",
          :disabled="isAllSelected(item._id, item.number)"
        ) +
</template>

<script lang="ts">
import Vue from "vue";
import { Food } from "../types";
import moment from "moment";

import api from "../api";

export default Vue.extend({
  name: "FoodView",
  data: () => {
    return {
      foodList: new Array<Food>(),
      selectedFoodMap: new Map<string, number>(),
      tableFields: ["name", "number", "selected", "expirationDate", "labels"],

      actualPage: 0,
      actualFilter: "",
      actualSortBy: "",
    };
  },
  created() {
    this.updateView();
  },
  methods: {
    updateView(
      filter,
      sortBy: "name" | "expirationDate" | "number",
      page: number
    ) {
      var payload = {};

      // switch (filter) {
      // }

      if (sortBy) {
        payload["sortBy"] = {}
        payload["sortBy"][sortBy] = 1;
      }

      if (page) payload["page"] = page;

      payload["pageSize"] = 10;

      api.foodList( payload ).then((r: any) => {
        this.foodList = r.data.data.list;
      });
    },
    getSelectedQuantity(id: string) {
      var count = this.selectedFoodMap[id];

      if (count) return count;
      else return 0;
    },
    addFood(id: string) {
      var count = this.selectedFoodMap[id];

      if (count) this.selectedFoodMap[id] = count + 1;
      else this.selectedFoodMap[id] = 1;

      this.updateView();
    },
    removeFood(id: string) {
      var count = this.selectedFoodMap[id];

      if (count) this.selectedFoodMap[id] = count - 1;
      else this.selectedFoodMap.delete(id);

      this.updateView();
    },
    isNoneSelected(id: string) {
      return !this.selectedFoodMap[id];
    },
    isAllSelected(id: string, max: number) {
      return this.selectedFoodMap[id] == max;
    },
    formatDate(date: Date) {
      return moment(date).locale("en").format("LL");
    },
  },
});
</script>

<style scoped lang="scss"></style>
