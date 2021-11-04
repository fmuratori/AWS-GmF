<template lang="pug">
  b-row(class="justify-content-md-center my-5" no-gutters)
    b-col(cols="6")

      b-card(class="mb-2" bg-variant="light" text-variant="dark" )
        b-card-text
          b-row
            b-col
              h5 Offerta effettuata il 12/12/2012
            b-col(md="auto")
              b-badge(class="ml-1") Prenotato per il ritiro 
              //- b-badge(class="ml-1") Valutazione
              //- b-badge(class="ml-1") Prenotato per il ritiro 
              //- b-badge(class="ml-1") Ritirato
              //- b-badge(class="ml-1") Scaduto
          b-row
            b-col
              div()
                p(class="mb-0") Alimenti donati:
                p(class="font-weight-bold mb-2") Pane, Carne
              div 
                p(class="mb-0") Scade tra:
                p(class="font-weight-bold mb-2") 12 giorni
              //- div 
              //-   p(class="mb-0") Orari disponibili per il ritiro:
              //-   p(class="font-weight-bold") 12/12/2012 
              //-     span(class="font-weight-normal") Scade tra 12 giorni
              div 
                p(class="mb-0") Luogo ritiro:
                p(class="font-weight-bold mb-2") Via a caso, 32, Cesena
              div                        
                a(href="#") Hai (2) messaggi non letti

              b-button(variant="secondary" @click="$router.replace({name: 'ManagerDonationsInspect'})") Espandi

            b-col()
              b-img(thumbnail="" fluid-grow src="https://picsum.photos/125/125/?image=58" alt="Image 1")

</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import api from "../api";

export default Vue.extend({
  name: "ManagerDonationsList",
  components: {
    Navbar,
    Sidebar,
  },
  data: () => {
    return {

    }
  },
  created() {
    this.$store.dispatch("showSidebar");

    // api.donationsList().then(r => console.log(r));

  },
  methods: {

  }
});
</script>

<style lang="scss"></style>
