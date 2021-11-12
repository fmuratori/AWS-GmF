<template lang="pug">
b-container
  .justify-content-md-center.my-5.no-gutters
    h3
      b ADD FOOD
    b-row
      b-col(sm=12, md=4)
        b-form(@submit="addFood")
          b-card.mb-2(bg-variant="light", text-variant="dark", no-body)
            b-card-text
              b-card-header Add food
              .px-4.pt-4
                InputText(
                  title="Name:",
                  placeholder="Insert food name here",
                  required,
                  v-on:data="(e) => { form.name = e; }"
                )

                InputText(
                  title="Units: ",
                  placeholder="Insert food units here",
                  type="number",
                  required,
                  v-on:data="(e) => { form.number = e; }"
                )

                InputDate(
                  title="Expiration date:",
                  placeholder="Select the expiration date",
                  required,
                  v-on:data="(e) => { form.expirationDate = e; }"
                )

                InputList(
                  title="Labels:",
                  placeholder="Insert label here",
                  v-on:data="(e) => { form.labels = e; }"
                )

              b-button.b-card-footer-button(
                block,
                type="submit",
                variant="success"
              ) Add

      b-col(sm=12, md=8)
        FoodView(:key="reloadIndex")
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import FoodView from "../components/FoodView.vue";
import InputText from "../components/input/InputText.vue";
import InputDate from "../components/input/InputDate.vue";
import InputList from "../components/input/InputList.vue";

import { Food, FoodPayload } from "../types";

import api from "../api";
import { FoodManagerView } from "../viewTypes";
import { AxiosError, AxiosResponse } from "axios";

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
        name: "",
        number: 0,
        labels: new Array<string>(),
      } as FoodPayload,
      foodList: new Array<Food>(),
      tableFields: ["name", "number", "expirationDate", "labels"],
      reloadIndex: 0,
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      //populate the food list
      api
        .foodList({})
        .then((r: AxiosResponse): void => {
          this.foodList = r.data as Food[];
        })
        .catch((e: AxiosError): void => {
          console.log(e);
        });
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    addFood(event) {
      event.preventDefault();

      api
        .addFood(this.form)
        .then((): void => {
          this.$bvToast.toast(`Food successfully created.`, {
            title: "Food",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
          this.updateFoodList();

          //aggiorno l'index per ricaricare il component ListFood
          this.reloadIndex += 1;
        })
        .catch((e: AxiosError): void => {
          console.log(e);
          this.$bvToast.toast(
            `Unable to add food. Retry later or contact us if the problem persist.`,
            {
              title: "food",
              autoHideDelay: 5000,
              variant: "danger",
              appendToast: false,
            }
          );
        });
    },
    updateFoodList() {
      api
        .foodList({})
        .then((r: AxiosResponse): void => {
          this.foodList = r.data as Food[];
        })
        .catch((e: AxiosError): void => {
          console.log(e);
        });
    },
    formatDate(date: Date): string {
      return moment(date).locale("en").format("LL");
    },
  },
});
</script>

<style scoped lang="scss">
.food-item:hover {
  background-color: yellow;
}
</style>
