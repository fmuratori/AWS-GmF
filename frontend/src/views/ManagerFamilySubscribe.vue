<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col(lg=8, md=10, sm=12)
      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b REPORT A FAMILY
      hr.sidebar-hr.my-3

      b-form(@submit.stop.prevent="submit")
        .mb4
          InputText(
            title="Family name:",
            placeholder="Insert family name here",
            :text="form.name",
            required,
            v-on:data="(e) => { form.name = e; }"
          )

        .mb4
          InputText(
            title="Phone number:",
            placeholder="Insert a phone number for the verification",
            :text="form.phoneNumber",
            required,
            v-on:data="(e) => { form.phoneNumber = e; }"
          )

        .mb4
          InputText(
            title="Components:",
            placeholder="Insert number of family components",
            type="number",
            :text="form.components",
            required,
            v-on:data="(e) => { form.components = e; }"
          )

        .mb-4
          InputAddress(
            title="Location",
            :city="form.address.city",
            :civic="form.address.civicNumber",
            :street="form.address.street",
            v-on:data="(e) => { form.address = e; }"
          )

        b-row
          b-col
            b-button(
              block,
              variant="outline-danger",
              @click="$router.push({ name: 'ManagerFamilyList' })"
            ) Cancel
          b-col
            b-button(block, variant="outline-success", type="submit") {{ submitLabel }}
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import InputText from "../components/input/InputText.vue";
import InputAddress from "../components/input/InputAddress.vue";

import { Address, FamilyPayload } from "../types";

import api from "../api/family";
import { ReportFamilyView } from "../viewTypes";

export default Vue.extend({
  name: "ManagerFamilySubscribe",
  components: {
    Navbar,
    Sidebar,
    InputText,
    InputAddress,
  },
  data: (): ReportFamilyView => {
    return {
      form: {
        reporterId: "",
        name: "",
        phoneNumber: "",
        // components: new Number(),
        address: {
          city: "",
          street: "",
          civicNumber: "",
          coordinates: {
            x: 0,
            y: 0,
          },
        } as Address,
      } as FamilyPayload,
      submitLabel: "Report",
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      if ("family" in this.$route.params) {
        this.form = this.$route.params.family as unknown as FamilyPayload;
        this.submitLabel = "Edit";
      }
      this.form.reporterId = this.$store.state.session.userData._id;
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    onAddressUpdate(address: Address): void {
      this.form.address = address;
    },
    submit(): void {
      var fun;
      if ("family" in this.$route.params) fun = api.editFamily;
      else fun = api.addFamily;

      fun(this.form)
        .then((): void => {
          this.$router.push({ name: "ManagerFamilyList" });
          eventbus.$emit("successMessage", "Events", "Family registration request received succesfully. In a later date we will validate your request.");
        })
        .catch((): void => {
          eventbus.$emit("errorMessage", "Events", "Unable to submit the family registration request. Retry later or contact us if the problem persists.");
        });
    },
  },
});
</script>

<style scoped lang="scss"></style>
