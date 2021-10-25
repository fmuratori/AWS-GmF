<template lang="pug">
  div(class="my-sidebar")
    b-row(class="my-4 justify-content-md-center") 
      b-col(md="auto")
        b-icon-person-circle(font-scale="3")
      b-col(md="auto")
        b-row Fabio Muratori
        b-row ADMIN
    b-row(class="my-4 text-center")
      b-col()
        b-button(variant="danger")
          span(class="mr-2") Messaggi
          b-badge(variant="light") 4
    b-row()
      // TODO: rendere "area utente" un componente 
      b-col
        b-row(class="text-center")
          b-col
            label() Area Utente

        div 
          b-row(@click="changePage('ManagerDonations')")
            b-col(cols=1)
              b-icon(icon="circle")
            b-col(cols=8)
              label Dona cibo
            b-col(cols=1)
              // "dash"
              b-icon(icon="plus") 
          b-row(@click="changePage('ManagerDonationsCreate')")
            b-col(cols=1)
            b-col(cols=8)
              label Crea donazione
            b-col(cols=1)
              b-icon(icon="chevron-right")
          b-row(@click="changePage('ManagerDonationsList')")
            b-col(cols=1)
            b-col(cols=8)
              label Tue donazioni
            b-col(cols=1)
              b-icon(icon="chevron-right")

        div 
          b-row(@click="changePage('ManagerFamilies')")
            b-col(cols=1)
              b-icon(icon="circle")
            b-col(cols=8)
              label Famiglie bisognose
            b-col(cols=1)
              // "dash"
              b-icon(icon="plus") 
          b-row(@click="changePage('ManagerFamiliesSubscribe')")
            b-col(cols=1)
            b-col(cols=8)
              label Segnala famiglia
            b-col(cols=1)
              b-icon(icon="chevron-right")
          b-row(@click="changePage('ManagerFamilies')")
            b-col(cols=1)
            b-col(cols=8)
              label Tue segnalazioni
            b-col(cols=1)
              b-icon(icon="chevron-right")

</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Sidebar",
  components: {},
  methods: {
    changePage(pageName: string) {
      this.$router.replace({ name: pageName })
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
