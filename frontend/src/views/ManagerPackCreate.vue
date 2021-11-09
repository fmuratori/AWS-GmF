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
          b-table(striped, hover, :fields="tableFields", :items="foodList")
            template(#cell(name)="data") {{ data.value }}

            template(#cell(number)="data") {{ data.value }}

            template(#cell(expirationDate)="data") {{ formatDate(data.value) }}

            template(#cell(labels)="data")
              b-badge(v-for="label in data.value", variant="success") {{ label }}

            template(#cell(_id)="data")
              b-button(@click="select(data.value)") Add

        b-col
          b-table(striped, hover, :fields="tableFields", :items="selectedFood")
            template(#cell(name)="data") {{ data.value }}

            template(#cell(number)="data") {{ data.value }}

            template(#cell(expirationDate)="data") {{ formatDate(data.value) }}

            template(#cell(labels)="data")
              b-badge(v-for="label in data.value", variant="success") {{ label }}

            template(#cell(_id)="data")
              b-button(@click="unselect(data.value)") Remove

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
      tableFields: ["name", "number", "expirationDate", "labels", "_id"],
      family: {} as Family,
      form: {
        foodList: new Array<Food>(),
        familyId: "",
      } as PackPayload,
      days: ["lun", "mar", "mer", "gio", "ven", "sab", "dom"],
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
      this.form.familyId = this.family._id;
    }

    this.form.deliveryVolunteerId = this.$store.state.session.userData._id;
  },
  methods: {
    createPack(event) {
      this.selectedFood.forEach((elem) => {
        for (var index = 0; index < elem.number; index++)
          this.form.foodIdList.push(elem._id);
      });

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
    select(_id) {
      var srcIndex;
      this.foodList.forEach((elem, index) => {
        if (elem._id == _id) srcIndex = index;
      });

      var destIndex = -1;
      this.selectedFood.forEach((elem, index) => {
        if (elem._id == _id) destIndex = index;
      });

      //verifico se nell'array destinazione c'è già un nodo con quell'id
      if (destIndex != -1) this.selectedFood[destIndex].number += 1;
      else {
        const newFood = {
          _id: this.foodList[srcIndex]._id,
          name: this.foodList[srcIndex].name,
          number: 1,
          expirationDate: this.foodList[srcIndex].expirationDate,
          labels: this.foodList[srcIndex].labels,
        };
        this.selectedFood.push(newFood);
      }

      //modifico il nodo nell'array sorgente
      if (this.foodList[srcIndex].number > 1) {
        this.foodList[srcIndex].number -= 1;
      } else this.foodList.splice(srcIndex, 1);
    },
    unselect(_id) {
      var srcIndex;
      this.selectedFood.forEach((elem, index) => {
        if (elem._id == _id) srcIndex = index;
      });

      var destIndex = -1;
      this.foodList.forEach((elem, index) => {
        if (elem._id == _id) destIndex = index;
      });

      //verifico se nell'array destinazione c'è già un nodo con quell'id
      if (destIndex != -1) this.foodList[destIndex].number += 1;
      else {
        const newFood = {
          _id: this.selectedFood[srcIndex]._id,
          name: this.selectedFood[srcIndex].name,
          number: 1,
          expirationDate: this.selectedFood[srcIndex].expirationDate,
          labels: this.selectedFood[srcIndex].labels,
        };
        this.foodList.push(newFood);
      }

      //modifico il nodo nell'array sorgente
      if (this.selectedFood[srcIndex].number > 1)
        this.selectedFood[srcIndex].number -= 1;
      else this.selectedFood.splice(srcIndex, 1);
    },
  },
});
</script>

<style scoped lang="scss">
.food-item:hover {
  background-color: yellow;
}
</style>
