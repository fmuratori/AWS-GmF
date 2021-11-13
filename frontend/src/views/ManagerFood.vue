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

                InputList(
                  title="Labels:",
                  placeholder="Insert label here",
                  :labelList="form.labels",
                  v-on:data="(e) => { form.labels = e; }"
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
import moment from "moment";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import FoodView from "../components/FoodView.vue";
import InputText from "../components/input/InputText.vue";
import InputDate from "../components/input/InputDate.vue";
import InputList from "../components/input/InputList.vue";

import { Food, FoodPayload, SelectableFood } from "../types";

import api from "../api";
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
        .catch((): void => {
          this.$root.$bvToast.toast(
            `Unable to retrieve food list. Retry later or contact us if the problem persist.`,
            {
              title: "Food",
              autoHideDelay: 5000,
              variant: "danger",
              appendToast: false,
            }
          );
        });
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    addFood(event): void {
      event.preventDefault();

      api
        .addFood(this.form)
        .then((): void => {
          this.$root.$bvToast.toast(`Food successfully created.`, {
            title: "Food",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });

          this.updateFoodList();

          //aggiorno l'index per ricaricare il component ListFood
          this.reloadIndex += 1;
        })
        .catch((): void => {
          this.$root.$bvToast.toast(
            `Unable to add food. Retry later or contact us if the problem persist.`,
            {
              title: "Food",
              autoHideDelay: 5000,
              variant: "danger",
              appendToast: false,
            }
          );
        });
    },
    updateFoodList(): void {
      api
        .foodList({})
        .then((r: AxiosResponse): void => {
          this.foodList = r.data as Food[];
        })
        .catch((): void => {
          this.$root.$bvToast.toast(
            `Unable to retrieve food list. Retry later or contact us if the problem persist.`,
            {
              title: "Food",
              autoHideDelay: 5000,
              variant: "danger",
              appendToast: false,
            }
          );
        });
    },
    formatDate(date: Date): string {
      return moment(date).locale("en").format("LL");
    },
    load(item: SelectableFood) {
      console.log(item);
      this.form.name = item.name;
      this.form.number = item.number;
      this.form.expirationDate = item.expirationDate;
      this.form.labels = item.labels;
      console.log(this.form);
    },
  },
});
</script>

<style scoped lang="scss"></style>
