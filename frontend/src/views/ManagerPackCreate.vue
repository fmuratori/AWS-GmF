<template lang="pug">
b-row.justify-content-md-center.my-5.no-gutters
  b-col(cols="6")
    h3 
      b CREATE A PACK
    b-card.mb-2(bg-variant="light") 
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
          h4 Available food

          .mb-1(v-for="food in foodList")
            b-card
              div 
                b Name:
                span {{ food.name }}
              div
                b Expiration date:
                span {{ formatDate(food.expirationDate) }}
                div(v-for="label in food.labels")
                  b-label {{ label }}

        b-col
          h4 Selected food

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
      foodList: [null] as [Food],
      selectedFood: [null] as [Food],
      family: {} as Family,
      form: {
        foodIdList: [""],
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
  },
});
</script>

<style scoped lang="scss">
</style>
