<template lang="pug">
b-row.justify-content-md-center.my-5.no-gutters
  b-col(cols="6")
    p SEGNALA UNA FAMIGLIA
    b-form
      b-form-group#input-group-1(
        label="Numero di telefono:",
        label-for="input-4"
      )
        b-form-input#input-1(required, type="text", v-model="form.phoneNumber")

      b-form-group#input-group-2(
        label="Numero di componenti:",
        label-for="input-4"
      )
        b-form-input#input-2(
          required,
          type="number",
          v-model="form.components"
        )

      .mb-3
        label Indirizzo:
        b-card
          b-row
            b-col
              b-form-group#input-group-3(label="Città:", label-for="input-3")
                b-form-input#input-3(
                  required,
                  type="text",
                  v-model="form.address.city"
                )
          b-row
            b-col(cols=8)
              b-form-group#input-group-4(
                label="Indirizzo:",
                label-for="input-4"
              )
                b-form-input#input-4(
                  required,
                  type="text",
                  v-model="form.address.street"
                )
            b-col(cols=4)
              b-form-group#input-group-5(
                label="Numero civico:",
                label-for="input-5"
              )
                b-form-input#input-5(
                  required,
                  type="text",
                  v-model="form.address.civicNumber"
                )
          .text-center
            b-button(variant="outline-secondary") Cerca su maps

      b-row
        b-col
          b-button(
            block,
            variant="outline-danger",
            @click="$router.replace({ name: 'ManagerHome' })"
          ) Annulla
        b-col
          b-button(block, variant="success", type="submit", @click="addFamily") Procedi
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import { Address, FamilyPayload } from "../types";

import api from "../api";

export default Vue.extend({
  name: "ManagerFamiliesSubscribe",
  components: {
    Navbar,
    Sidebar,
  },
  data: function () {
    return {
      form: {
        userId: "",
        phoneNumber: "",
        components: 0,
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
    this.$store.dispatch("showSidebar");

    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      this.form.userId = this.$store.state.session.userData._id;
      this.form.address = this.$store.state.session.userData.address;
    } else {
      this.$router.replace({ name: "Login" });
    }
  },
  methods: {
    addFamily(event) {
      event.preventDefault()
      api
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

<style scoped lang="scss">
</style>
