<template lang="pug">
b-container
  b-row.justify-content-center.my-5
    b-col(lg=6, md=8, cols=11)
      hr.shaded
      h4.text-center
        b FOOD BANK 
      hr.shaded

  b-row.justify-content-center.my-5
    b-col(lg=4, md=8, cols=11).mb-5
      b-form(@submit.stop.prevent="addFood")
        b-card.mb-2(bg-variant="light", text-variant="dark", no-body)
          b-card-text
            b-card-header(v-if="!isEditMode") Add food
            b-card-header(v-else) Edit food
            .px-4.pt-4
              InputText(
                title="Name:",
                placeholder="Set food name",
                :text="form.name",
                required,
                v-on:data="(e) => { form.name = e; }"
              )

              InputText(
                title="Amount: ",
                placeholder="Set amount",
                type="number",
                :text="form.number",
                required,
                v-on:data="(e) => { form.number = e; }"
              )

              InputDate(
                title="Expiration date:",
                placeholder="Set date",
                :date="form.expirationDate",
                required,
                v-on:data="(e) => { form.expirationDate = e; }"
              )

              b-form-group(label="Labels:")
                b-checkbox-group(
                  v-model="form.labels",
                  :options="constants.foodLabels",
                  stacked
                )

            b-button.footerCardButton.color3(
              block,
              type="submit",
              v-if="!isEditMode"
            ) ADD

            b-button-group.d-flex(v-else)
              b-button.footerCardButton(
                variant="secondary"
                @click="cancelEditMode"
              ) CANCEL
              b-button.footerCardButton.color3(
                type="submit",
              ) EDIT

    b-col(cols=11, md=12 lg=8)
      FoodView(
        :key="reloadIndex",
        loadableItems,
        deletableItem,
        v-on:load="load"
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

import { Food } from "../types";

import api from "../api/food";
import { AxiosResponse, AxiosError } from "axios";

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
  data: () => {
    return {
      form: {
        labels: new Array<string>(),
        number: 0,
        name: null,
        expirationDate: null,
      } as Food,
      foodList: new Array<Food>(),
      reloadIndex: 0,
      isEditMode: false,
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
          eventbus.$emit(
            "errorMessage",
            "Foods",
            "Unable to retrieve food list. Retry later or contact us if the problem persists."
          );
        });
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    addFood(): void {
      if (this.foodFormChecks()) {
        var f = !this.isEditMode
          ? api.addFood(this.form)
          : api.editFood(this.form);
        eventbus.$emit("startLoading", "Updating food list.");
        f.then((r: AxiosResponse): void => {
          if (r.status == 200) {
            if (this.isEditMode) this.cancelEditMode();
            this.updateFoodList();
            //aggiorno l'index per ricaricare il component ListFood
            this.reloadIndex += 1;
            eventbus.$emit(
              "successMessage",
              "Foods",
              "Food successfully created/edited."
            );
          } else {
            eventbus.$emit(
              "errorMessage",
              "Foods",
              "Unable to add/edit food. Retry later or contact us if the problem persists."
            );
          }
        })
          .catch((e: AxiosError): void => {
            console.log(e);
            eventbus.$emit(
              "errorMessage",
              "Foods",
              "Unable to add/edit food. Retry later or contact us if the problem persists."
            );
          })
          .then(() => eventbus.$emit("stopLoading"));
      }
    },
    updateFoodList(): void {
      eventbus.$emit("startLoading", "Updating food list.");
      api
        .foodList({})
        .then((r: AxiosResponse): void => {
          if (r.status == 200) {
            this.foodList = r.data as Food[];
          } else {
            eventbus.$emit(
              "errorMessage",
              "Foods",
              "Unable to update the food list. Retry later or contact us if the problem persists."
            );
          }
        })
        .catch((e: AxiosError): void => {
          console.log(e);
          eventbus.$emit(
            "errorMessage",
            "Foods",
            "Unable to update the food list. Retry later or contact us if the problem persists."
          );
        })
        .then(() => eventbus.$emit("stopLoading"));
    },
    load(item: Food) {
      this.isEditMode = true;
      this.form = {
        _id: item._id,
        labels: item.labels,
        number: item.number,
        name: item.name,
        expirationDate: item.expirationDate,
      } as Food;
    },
    cancelEditMode() {
      this.isEditMode = false;
      this.form.name = "";
      this.form.number = null;
      this.form.expirationDate = null;
      this.form.labels = [];
    },
    foodFormChecks() {
      if (!this.form.expirationDate) {
        eventbus.$emit(
          "errorMessage",
          "Foods",
          "Set a not null expiration date for the food you want to add."
        );
        return false;
      } else if (this.form.number <= 0) {
        eventbus.$emit(
          "errorMessage",
          "Foods",
          "Set an amount greater than 0 for the food you want to add."
        );
        return false;
      } else return true;
    },
  },
});
</script>

<style scoped lang="scss"></style>
