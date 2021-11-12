<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col(lg=8, md=8, sm=12)

    h3 
      b CREATE A PACK
    b-row
      b-col
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
      FoodView(selectable, v-on:data="(e) => { this.foodList = e; }")

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
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import FoodView from "../components/FoodView.vue";

import { Family, PackPayload, SelectableFood } from "../types";

import api from "../api";
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
      if ("family" in this.$route.params) {
        this.family = JSON.parse(this.$route.params.family);
        this.form.familyId = this.family._id;
      }
    } else this.$router.replace({ name: "Login" });
  },
  methods: {
    log(e) {
      console.log(e);
    },
    createPack(event) {
      event.preventDefault();
      console.log(this.foodList);

      this.foodList.forEach((elem) => {
        if (elem.selected) {
          this.form.foodList.push({ foodId: elem._id, number: elem.selected });
        }
      });

      api
        .createPack(this.form)
        .then((r) => {
          console.log(r);
          this.$router.replace({ name: "ManagerPacks" });
          this.$root.$bvToast.toast(`Pack successfully created.`, {
            title: "Pack",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
        })
        .catch((e) => {
          this.$root.$bvToast.toast(
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
  },
});
</script>

<style scoped lang="scss"></style>
