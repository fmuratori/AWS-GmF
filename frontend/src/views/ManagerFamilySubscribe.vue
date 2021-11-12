<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col(lg=8, md=10, sm=12)
      .mb-4
        h4
          p REPORT A FAMILY
      b-form(@submit="addFamily")
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
            title="Location:",
            :city="form.address.city",
            :street="form.address.street",
            :civic="form.address.civicNumber",
            v-on:city="(e) => { form.address.city = e; }",
            v-on:street="(e) => { form.address.street = e; }",
            v-on:civic="(e) => { form.address.civicNumber = e; }"
          )

        b-row
          b-col
            b-button(
              block,
              variant="outline-danger",
              @click="$router.replace({ name: 'ManagerFamilyList' })"
            ) Cancel
          b-col
            b-button(block, variant="outline-success", type="submit") Report
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import InputText from "../components/input/InputText.vue";
import InputAddress from "../components/input/InputAddress.vue";

import { Address, FamilyPayload } from "../types";

import familyApi from "../api/family";

export default Vue.extend({
  name: "ManagerFamilySubscribe",
  components: {
    Navbar,
    Sidebar,
    InputText,
    InputAddress,
  },
  data: function () {
    return {
      form: {
        reporterId: "",
        name: "",
        phoneNumber: "",
        components: null,
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
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if ("family" in this.$route.params) this.form = this.$route.params.family;
      this.form.reporterId = this.$store.state.session.userData._id;
    } else this.$router.replace({ name: "Login" });
  },
  methods: {
    addFamily(event) {
      event.preventDefault();
      familyApi
        .addFamily(this.form)
        .then((r) => {
          console.log(r);
          this.$router.replace({ name: "ManagerFamilyList" });
          this.$bvToast.toast(`Familgia segnalata con successo.`, {
            title: "Famiglia",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
        })
        .catch((e) => {
          console.log(e);
          this.$bvToast.toast(
            `Impossibile segnalare la famiglia. Riprova più tardi oppure contattaci se il problema persiste.`,
            {
              title: "Famiglia",
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
