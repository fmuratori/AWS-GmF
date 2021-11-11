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
                b-form-group#input-group-1(label="Name:", label-for="input-1")
                  b-form-input#input-1(
                    required,
                    type="text",
                    placeholder="Insert name here",
                    v-model="form.name"
                  )

                b-form-group#input-group-2(label="Units:", label-for="input-2")
                  b-form-input#input-2(
                    required,
                    type="number",
                    v-model="form.number"
                  )

                b-form-group#input-group-3(
                  label="Expiration date:",
                  label-for="input-3",
                  required
                )
                  b-input-group
                    b-form-datepicker#input-3.my-no-right-border(
                      required,
                      v-model="form.expirationDate",
                      reset-button,
                      close-button
                    )
                    b-input-group-append
                      b-button.my-no-left-border(
                        variant="danger",
                        @click="form.expirationDate = null",
                        :disabled="form.expirationDate == null"
                      ) 
                        span Cancel
                        b-icon(icon="x", aria-hidden="true")

                b-form-group#input-group-4(
                  label="Labels:",
                  label-for="input-4"
                ) 
                  b-input-group.mb-1(
                    v-for="(labeò, idx) in form.labels",
                    :key="idx"
                  )
                    b-form-input#input-4.my-no-right-border(
                      type="text",
                      placeholder="Insert label here",
                      @input="labelValueChange(idx)",
                      v-model="form.labels[idx]"
                    )
                    b-input-group-append
                      b-button.my-no-left-border(
                        variant="danger",
                        @click="labelDeleteClicked(idx)",
                        :disabled="form.labels[idx] == ''"
                      ) 
                        span Cancel
                        b-icon(icon="x", aria-hidden="true")

              b-button.b-card-footer-button(block, type="submit", variant="success") Add

      b-col(sm=12, md=8)
        b-table(striped hover :fields="tableFields" :items="foodList")
          template(#cell(name)="data") {{data.value}}

          template(#cell(number)="data") {{data.value}}

          template(#cell(expirationDate)="data") {{formatDate(data.value)}}

          template(#cell(labels)="data")
            b-badge(v-for="label in data.value", variant="success") {{label}}
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import { Food, FoodPayload } from "../types";

import api from "../api";

export default Vue.extend({
  name: "ManagerFood",
  components: {
    Navbar,
    Sidebar,
  },
  data: function () {
    return {
      form: {
        name: "",
        number: 0,
        expirationDate: null,
        labels: [""],
      } as FoodPayload,
      foodList: new Array<Food>(),
      tableFields: ["name", "number", "expirationDate", "labels"],
    };
  },
  created() {
    this.$store.dispatch("showSidebar");

    //populate the food list
    api.foodList(null).then((r: any) => {
      this.foodList = r.data.data.list;
      console.log(this.foodList);
    });

    // check if user is logged in
    if (!this.$store.getters.isUserLogged)
      this.$router.replace({ name: "Login" });
  },
  methods: {
    addFood(event) {
      event.preventDefault();

      api
        .addFood(this.form)
        .then((r) => {
          console.log(r);
          this.$bvToast.toast(`Food successfully created.`, {
            title: "Food",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
          this.updateFoodList();
        })
        .catch((e) => {
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
      api.foodList(null).then((r: any) => {
        this.foodList = r.data.data.list;
      });
    },
    labelValueChange(inputIdx: number) {
      if (inputIdx == this.form.labels.length - 1) {
        this.form.labels.push("");
      } else if (this.form.labels[inputIdx] == "") {
        this.foodDeleteClicked(inputIdx);
      }
    },
    labelDeleteClicked(inputIdx: number) {
      this.form.labels.splice(inputIdx, 1);
    },
    formatDate(date: Date) {
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
