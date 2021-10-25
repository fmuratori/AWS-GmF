<template lang="pug">
  div()
    Navbar
    b-container(fluid)
      b-row()
        b-col(class="bg-light" md="auto" align-self="stretch")
          Sidebar
        b-col(cols="9")
          b-row(class="justify-content-md-center my-5")
            b-col(cols="8")
              p TUE DONAZIONI

              b-card(class="mb-2" bg-variant="light" text-variant="dark" title="Donazione effettuata il 12/12/2012")
                b-card-text
                  p Alimenti donati: Pane, Carne
                  p Scadenza: 12/12/12
                  p Luogo ritiro: Via a caso, 32, Cesena
                  p Stato: In attesa 
                b-button(href="#" variant="primary" @click="$router.replace({name: 'ManagerDonationsInspect'})") Mostra

</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";

export default Vue.extend({
  name: "ManagerDonationsList",
  components: {
    Navbar,
    Sidebar,
  },
});
</script>

<style lang="sass"></style>
