<template lang="pug">
  div(id="sidebar" class="p-3" v-if="isSidebarOpen()")
    div(id="sidebar-user") 
      b-row(no-gutters align-h="center" class="p-4") 
        b-col(cols="auto" class="mr-1")
          b-icon-person-circle(font-scale="3")
        b-col(cols="auto" class="ml-1")
          p Fabio Muratori
          p VOLONTARIO

      hr.sidebar-hr.my-3

    div(id="sidebar-actions") 
      div()
        b-row(no-gutters align-v="center" class="pb-2")
          b-col(cols="auto" class="mr-1")
            font-awesome-icon(icon="utensils" size="lg")
          b-col(class="ml-1")
            h6() Dona cibo
        b-row(no-gutters align-v="center" class="pl-3 pr-1 sidebar-item" @click="changePage('ManagerDonationsCreate')")
          b-col()
            label(class="py-1") Crea una donazione
          b-col(cols="auto")
            b-icon(icon="chevron-right")
        b-row(no-gutters align-v="center" class="pl-3 pr-1 sidebar-item" @click="changePage('ManagerDonationsList')")
          b-col()
            label(class="py-1") Tue donazioni
          b-col(cols="auto")
            b-icon(icon="chevron-right")

      hr.sidebar-hr.my-3

      div()
        b-row(no-gutters align-v="center" class="pb-2")
          b-col(cols="auto" class="mr-1")
            font-awesome-icon(icon="users" size="lg")
          b-col(class="ml-1")
            h6() Famiglie bisognose
        b-row(no-gutters align-v="center" class="pl-3 pr-1 sidebar-item sidebar-item-selected" @click="changePage('ManagerFamiliesSubscribe')")
          b-col()
            label(class="py-1") Segnala famiglia
          b-col(cols="auto")
            b-icon(icon="chevron-right")
        b-row(no-gutters align-v="center" class="pl-3 pr-1 sidebar-item" @click="changePage('ManagerFamilies')")
          b-col()
            label(class="py-1") Stato segnalazioni
          b-col(cols="auto")
            b-icon(icon="chevron-right")

      hr.sidebar-hr.my-3

    div(id="sidebar-footer" class="text-center")
      b-button(variant="light" size="sm") 
        b-icon(icon="gear-fill" class="mr-1")
        span Account

</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Sidebar",
  components: {},
  data: function(){
    return {}
  },
  methods: {
    changePage(pageName: string) {
      this.$router.replace({ name: pageName })
    },
    isSidebarOpen() {
      return this.$store.state.navigation.isSidebarOpen;
    }
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

#sidebar {
  background-color: $greyscale2;
  color: $greyscaleE;
  
  display: flex;
  flex-direction: column;

  width: 100%;
  position: absolute;
  z-index: 5;

  @include lg {
    width: auto;
    position: relative;
    z-index: 0;
  }
}

#sidebar-actions {
  flex-grow: 1;
}

.sidebar-hr {
  background-color: $greyscale5;
}

.sidebar-item {
  border-radius: 0.25em;
}

.sidebar-item:hover {
  background-color: $greyscale1;
}

.sidebar-item-selected {
  background-color: $color1;
}


</style>
