<template lang="pug">
b-container
  .justify-content-md-center.my-5.no-gutters
    h3 
      b CREATE A PACK
    b-row
      b-col(sm=12, md=6)
        h4 About the family
        b-row
          b-col
            span
              b Name:
            span {{ family.name }}
          b-col
            span 
              b Components:
            span {{ family.components }}

        b-row
          b-col
            span
              b Phone number:
            span {{ family.phoneNumber }}
          b-col
            span
              b Address:
            span {{ family.address.street }} {{ family.address.civicNumber }} - {{ family.address.city }}

    b-form(@submit="createPack")
      b-row
        b-col
          b-card.mb-2(bg-variant="light", text-variant="dark", no-body)
            b-card-text
              b-card-header Available food
              .px-4.pt-4.food-item(
                v-for="(food, index) in foodList",
                :keY="index"
              )
                div
                  b Name:
                  span {{ food.name }}
                  b-button.food-button(@click="select(index)") Add
                div
                  b Units:
                  span {{ food.number }}
                div
                  b Expiration date:
                  span {{ formatDate(food.expirationDate) }}
                  h6 
                    b-badge(v-for="label in food.labels", variant="success") {{ label }}

        b-col
          b-card.mb-2(bg-variant="light", text-variant="dark", no-body)
            b-card-text
              b-card-header Selected food
              .px-4.pt-4.food-item(
                v-for="(food, index) in selectedFood",
                :key="index"
              )
                div
                  b Name:
                  span {{ food.name }}
                  b-button.food-button(@click="unselect(index)") Remove
                div
                  b Units:
                  span {{ food.number }}
                div
                  b Expiration date:
                  span {{ formatDate(food.expirationDate) }}
                  h6 
                    b-badge(v-for="label in food.labels", variant="success") {{ label }}

      b-row
        b-col
          b-button(
            block,
            variant="outline-danger",
            @click="$router.replace({ name: 'ManagerFamilies' })"
          ) Cancel
        b-col
          b-button(block, variant="success", type="submit") Create
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import { Family, Food, PackPayload } from "../types";

import api from "../api";

export default Vue.extend({
  name: "ManagerPackCreate",
  components: {
    Navbar,
    Sidebar,
  },
  data: function () {
    return {
      foodList: new Array<Food>(),
      selectedFood: new Array<Food>(),
      family: {} as Family,
      form: {
        foodIdList: new Array<string>(),
        familyId: "",
        deliveryDate: new Date(),
        deliveryPeriod: "",
      } as PackPayload,
    };
  },
  created() {
    this.$store.dispatch("showSidebar");

    api.foodList(null).then((r: any) => {
      this.foodList = r.data.data.list;
    });

    // check if user is logged in
    if (!this.$store.getters.isUserLogged)
      this.$router.replace({ name: "Login" });

    if ("family" in this.$route.params) {
      this.family = this.$route.params.family;
    }
  },
  methods: {
    createPack(event) {
      event.preventDefault();

      api
        .createPack(this.form)
        .then((r) => {
          console.log(r);
          this.$router.replace({ name: "ManagerPacks" });
          this.$bvToast.toast(`Pack successfully created.`, {
            title: "Pack",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
        })
        .catch((e) => {
          this.$bvToast.toast(
            `Unable to create pack. Retry later or contact us if the problem persist.`,
            {
              title: "Pack",
              autoHideDelay: 5000,
              variant: "danger",
              appendToast: false,
            }
          );
        });
    },
    formatDate(date: Date) {
      return moment(date).locale("en").format("LL");
    },
    select(index) {
      this.selectedFood.push(this.foodList[index]);
      this.foodList.splice(index, 1);
    },
    unselect(index) {
      this.foodList.push(this.selectedFood[index]);
      this.selectedFood.splice(index, 1);
    },
  },
});
</script>

<style scoped lang="scss">
.food-item:hover {
  background-color: yellow;
}
</style>
