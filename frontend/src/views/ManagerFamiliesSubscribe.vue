<template lang="pug">
  b-row(class="justify-content-center my-5" no-gutters)
    b-col(md=6 sm=8 cols=10)
      p SEGNALA UNA FAMIGLIA BISOGNOSA
      b-form(@submit="addFamily")
        b-card(bg-variant="light" class="mb-2")
          b-row
            b-col
              b-form-group(id="input-group-1" label="Nome famiglia:", label-for="input-1")
                b-form-input#input-1(required type="text" v-model="form.name")

              b-form-group(id="input-group-2" label="Numero di cellulare:", label-for="input-2")
                b-form-input#input-2(required type="text" v-model="form.phoneNumber")

              b-form-group(id="input-group-3" label="Numero elementi della famiglia:" label-for="input-3")
                b-form-input#input-3(required type="number" v-model="form.components")

          div(class="mb-4")
            p(class="font-weight-bold text-center") Luogo di abitazione
            b-form-group(id="input-group-4" label="Città:" label-for="input-4")
              b-form-input(id="input-4" type="text" v-model="form.address.city" required)
            b-row
              b-col(cols=8)
                b-form-group(id="input-group-5" label="Indirizzo:" label-for="input-5")
                  b-form-input(id="input-5" type="text" v-model="form.address.street" required)
              b-col(cols=4)
                b-form-group(id="input-group-6" label="Numero civico:" label-for="input-6")
                  b-form-input(id="input-6" type="text" v-model="form.address.civicNumber" required)
            div(class="text-center")
              b-button(variant="outline-secondary") Cerca su maps

        b-button(block variant="outline-success" type="submit") Procedi
        b-button(block variant="outline-danger" @click="$router.replace({ name: 'ManagerFamilies' })") Annulla

</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import { Address, FamilyPayload } from "../types";

import familyApi from "../api/family";

export default Vue.extend({
  name: "ManagerFamiliesSubscribe",
  components: {
    Navbar,
    Sidebar,
  },
  data: function () {
    return {
      form: {
        reporterId: "",
        name: "Famiglia a caso",
        phoneNumber: "123456789",
        components: 3,
        address: {
          city: "Rimini",
          street: "via a caso",
          civicNumber: "34",
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
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }
      this.form.reporterId = this.$store.state.session.userData._id;
    } else {
      this.$router.replace({ name: "Login" });
    }
  },
  methods: {
    addFamily(event) {
      event.preventDefault();
      familyApi
        .addFamily(this.format)
        .then((r) => {
          console.log(r);
          this.$router.replace({ name: "ManagerFamilies" });
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
