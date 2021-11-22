<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col
      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b ADD FOOD
      hr.sidebar-hr.my-3

      b-row
        b-col(sm=12, md=4)
          b-form(@submit.stop.prevent="addFood")
            b-card.mb-2(bg-variant="light", text-variant="dark", no-body)
              b-card-text
                b-card-header Add food
                .px-4.pt-4
                  InputText(
                    title="Name:",
                    placeholder="Insert food name here",
                    :text="form.name",
                    required,
                    v-on:data="(e) => { form.name = e; }"
                  )

                  InputText(
                    title="Units: ",
                    placeholder="Insert food units here",
                    type="number",
                    :text="form.number",
                    required,
                    v-on:data="(e) => { form.number = e; }"
                  )

                  InputDate(
                    title="Expiration date:",
                    placeholder="Select the expiration date",
                    :date="form.expirationDate",
                    required,
                    v-on:data="(e) => { form.expirationDate = e; }"
                  )

                  b-form-group(label="Labels:")
                    b-checkbox-group(
                      v-model="form.labels",
                      :options="availableLables",
                      stacked
                    )

                b-button.b-card-footer-button(
                  block,
                  type="submit",
                  variant="success"
                ) Add

        b-col(sm=12, md=8)
          FoodView(
            :key="reloadIndex",
            loadableItems,
            deletableItem,
            v-on:load="(e) => load(e)"
          )
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import moment from "moment";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import FoodView from "../components/FoodView.vue";
import InputText from "../components/input/InputText.vue";
import InputDate from "../components/input/InputDate.vue";
import InputList from "../components/input/InputList.vue";

import { Food, FoodPayload, SelectableFood } from "../types";

import api from "../api/food";
import { FoodManagerView } from "../viewTypes";
import { AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerFood",
  components: {
    Navbar,
    Sidebar,
    InputText,
    InputDate,
    InputList,
    FoodView,
  },
  data: (): FoodManagerView => {
    return {
      form: {
        labels: new Array<string>(),
      } as FoodPayload,
      foodList: new Array<Food>(),
      tableFields: ["name", "number", "expirationDate", "labels"],
      availableLables: [
        { text: "Meat", value: "meat" },
        { text: "Fish", value: "fish" },
        { text: "Pasta", value: "pasta" },
        { text: "Vegetable", value: "vegetable" },
        { text: "Fruit", value: "fruit" },
        { text: "Fresh", value: "fresh" },
        { text: "Long life", value: "long-life" },
      ],
      reloadIndex: 0,
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      //populate the food list
      api
        .foodList({})
        .then((r: AxiosResponse): void => {
          this.foodList = r.data as Food[];
        })
        .catch((): void => {
          eventbus.$emit("errorMessage", "Foods", "Unable to retrieve food list. Retry later or contact us if the problem persists.");
        });
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    addFood(): void {
      api
        .addFood(this.form)
        .then((): void => {
          eventbus.$emit("successMessage", "Foods", "Food successfully created. Retry later or contact us if the problem persists.");

          this.updateFoodList();

          //aggiorno l'index per ricaricare il component ListFood
          this.reloadIndex += 1;
        })
        .catch((): void => {
          eventbus.$emit("errorMessage", "Foods", "Unable to add food. Retry later or contact us if the problem persists.");
        });
    },
    updateFoodList(): void {
      api
        .foodList({})
        .then((r: AxiosResponse): void => {
          this.foodList = r.data as Food[];
        })
        .catch((): void => {
          eventbus.$emit("errorMessage", "Foods", "Unable to retrieve food list. Retry later or contact us if the problem persists.");
        });
    },
    formatDate(date: Date): string {
      return moment(date).locale("en").format("LL");
    },
    load(item: SelectableFood) {
      this.form.name = item.name;
      this.form.number = item.number;
      this.form.expirationDate = item.expirationDate;
      this.form.labels = item.labels;
    },
  },
});
</script>

<style scoped lang="scss"></style>
