<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col
      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b CREATE A PACK
      hr.sidebar-hr.my-3

      b-row
        b-col
          h4 About the family
          div
            b Name:
            span {{ family.name }}
          div 
            b Components:
            span {{ family.components }}
          div
            b Phone number:
            span {{ family.phoneNumber }}
          div
            b Address:
            span {{ family.address.street }} {{ family.address.civicNumber }} - {{ family.address.city }}

      hr.sidebar-hr.my-3

      b-form(@submit.stop.prevent="createPack")
        FoodView(selectableItems, v-on:data="(e) => { this.foodList = e; }")

        b-row
          b-col
            b-button(
              block,
              variant="outline-danger",
              @click="$router.push({ name: 'ManagerFamilies' })"
            ) Cancel
          b-col
            b-button(block, variant="success", type="submit") Create
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import { AxiosError } from "axios";

import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import FoodView from "../components/FoodView.vue";

import { Family, PackPayload, SelectableFood } from "../types";

import api from "../api/pack";
import { PackCreateView } from "../viewTypes";

export default Vue.extend({
  name: "ManagerPackCreate",
  components: {
    Navbar,
    Sidebar,
    FoodView,
  },
  data: (): PackCreateView => {
    return {
      foodList: new Array<SelectableFood>(),
      family: {} as Family,
      form: {
        foodList: new Array<{ foodId: string; number: number }>(),
        familyId: "",
      } as PackPayload,
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      if ("family" in this.$route.params) {
        this.family = this.$route.params.family as unknown as Family;
        this.form.familyId = this.family._id;
      }
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    createPack(): void {
      console.log(this.foodList);

      this.foodList.forEach((elem) => {
        if (elem.selected) {
          this.form.foodList.push({ foodId: elem._id, number: elem.selected });
        }
      });

      api
        .createPack(this.form)
        .then((): void => {
          this.$router.push({ name: "ManagerPackList" });
          eventbus.$emit("successMessage", "Food packs", "Pack successfully created.");
        })
        .catch((e: AxiosError): void => {
          console.log(e);
          eventbus.$emit("errorMessage", "Food packs", "Unable to create a food pack. Retry later or contact us if the problem persists.");
        });
    },
  },
});
</script>

<style scoped lang="scss"></style>
