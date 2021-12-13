<template lang="pug">
b-container.mb-5
  b-row.justify-content-center.my-5
    b-col(lg='6' md='8' cols='10')
      hr.shaded
      h4.text-center
        b FOOD MANAGER 
      hr.shaded
  b-row.justify-content-center.my-5
    b-col.mb-5(lg='4' md='8' cols='10')
      b-form(@submit.stop.prevent='addFood')
        b-card.mb-2(bg-variant='light' text-variant='dark' no-body='no-body')
          b-card-text
            b-card-header(v-if='!isEditMode') Add food
            b-card-header(v-else) Edit food
            .px-4.pt-4
              InputText(title='Name:' placeholder='Set food name' :text='form.name' required @data='(e) => { form.name = e; }')
              InputText(title='Amount: ' placeholder='Set amount' type='number' :text='form.number' required @data='(e) => { form.number = e; }')
              InputDate(title='Expiration date:' placeholder='Set date' :date='dates.formatDate(form.expirationDate)' required @data='(e) => form.expirationDate = e')
              b-form-group(label='Labels:')
                b-checkbox-group(v-model='form.labels' :options='constants.foodLabels' stacked='stacked')
            b-button.footerCardButton.color3(block='block' type='submit' v-if='!isEditMode') ADD
            b-button-group.d-flex(v-else)
              b-button.footerCardButton(variant='secondary' @click='cancelEditMode') CANCEL
              b-button.footerCardButton.color3(type='submit') EDIT
    b-col(cols='12' md='11' lg='8')
      FoodView(:key='reloadIndex' loadableItems deletableItem @load='load')
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import FoodView from "../components/FoodView.vue";
import InputText from "../components/input/InputText.vue";
import InputDate from "../components/input/InputDate.vue";

import { Food } from "../types";

import api from "../api/food";
import { AxiosResponse, AxiosError } from "axios";

export default Vue.extend({
  name: "ManagerFood",
  components: {
    InputText,
    InputDate,
    FoodView,
  },
  data: () => {
    return {
      form: {
        _id: "",
        labels: new Array<string>(),
        number: 0,
        name: "",
        expirationDate: new Date(),
      } as Food,
      foodList: new Array<Food>(),
      reloadIndex: 0,
      isEditMode: false,
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
          ? api.addFood({
              labels: this.form.labels,
              number: this.form.number,
              name: this.form.name,
              expirationDate: this.form.expirationDate,
            } as Food)
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
      this.form.number = 0;
      this.form.expirationDate = new Date();
      this.form.labels = new Array<string>();
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
