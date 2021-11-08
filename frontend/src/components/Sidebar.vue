<template lang="pug">
#sidebar.p-3(v-if="isSidebarOpen()")
  #sidebar-user 
    b-row.p-4(no-gutters, align-h="center") 
      b-col.mr-1(cols="auto")
        b-icon-person-circle(font-scale="3")
      b-col.ml-1(cols="auto")
        p {{ userFullname }}
        p {{ userType }}

    hr.sidebar-hr.my-3

  #sidebar-actions 
    div
      b-row.pb-2(no-gutters, align-v="center")
        b-col.mr-1(cols="auto")
          font-awesome-icon(icon="utensils", size="lg")
        b-col.ml-1
          h6 Dona cibo
      b-row.pl-3.pr-1.sidebar-item(
        no-gutters,
        align-v="center",
        @click="changePage('ManagerDonationsCreate')",
        :class="{ 'sidebar-item-selected': isRouteSelected('ManagerDonationsCreate') }"
      )
        b-col
          label.py-1 Crea una donazione
        b-col(cols="auto")
          b-icon(icon="chevron-right")
      b-row.pl-3.pr-1.sidebar-item(
        no-gutters,
        align-v="center",
        @click="changePage('ManagerDonationsList')",
        :class="{ 'sidebar-item-selected': isRouteSelected('ManagerDonationsList') }"
      )
        b-col
          label.py-1 Tue donazioni
        b-col(cols="auto")
          b-icon(icon="chevron-right")

    hr.sidebar-hr.my-3

    div
      b-row.pb-2(no-gutters, align-v="center")
        b-col.mr-1(cols="auto")
          font-awesome-icon(icon="users", size="lg")
        b-col.ml-1
          h6 Famiglie bisognose
      b-row.pl-3.pr-1.sidebar-item(
        no-gutters,
        align-v="center",
        @click="changePage('ManagerFamiliesSubscribe')",
        :class="{ 'sidebar-item-selected': isRouteSelected('ManagerFamiliesSubscribe') }"
      )
        b-col
          label.py-1 Segnala famiglia
        b-col(cols="auto")
          b-icon(icon="chevron-right")
      b-row.pl-3.pr-1.sidebar-item(
        no-gutters,
        align-v="center",
        @click="changePage('ManagerFamilies')",
        :class="{ 'sidebar-item-selected': isRouteSelected('ManagerFamilies') }"
      )
        b-col
          label.py-1 Stato segnalazioni
        b-col(cols="auto")
          b-icon(icon="chevron-right")

    hr.sidebar-hr.my-3

    div(v-if="this.$store.state.session.userData.type == 'volunteer'")
      b-row.pb-2(no-gutters, align-v="center")
        b-col.mr-1(cols="auto")
          font-awesome-icon(icon="utensils", size="lg")
        b-col.ml-1
          h6 Eventi
      b-row.pl-3.pr-1.sidebar-item(
        no-gutters,
        align-v="center",
        @click="changePage('ManagerEventCreate')",
        :class="{ 'sidebar-item-selected': isRouteSelected('ManagerEventCreate') }"
      )
        b-col
          label.py-1 Crea una evento
        b-col(cols="auto")
          b-icon(icon="chevron-right")
      b-row.pl-3.pr-1.sidebar-item(
        no-gutters,
        align-v="center",
        @click="changePage('ManagerEvents')",
        :class="{ 'sidebar-item-selected': isRouteSelected('ManagerEvents') }"
      )
        b-col
          label.py-1 Tuoi eventi
        b-col(cols="auto")
          b-icon(icon="chevron-right")
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Sidebar",
  components: {},
  data: function () {
    return {};
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    userFullname() {
      const fullname =
        this.$store.state.session.userData.name +
        " " +
        this.$store.state.session.userData.surname;
      if (fullname.length > 10) {
        return fullname.substring(0, 10) + "...";
      }
      return fullname;
    },
    userType() {
      switch (this.$store.state.session.userData.type) {
        case "user":
          return "Utente";
        case "volunteer":
          return "Volontario";
        case "trusted":
          return "Collaboratore";
        default:
          return "UNKNOWN";
      }
    },
  },
  methods: {
    isRouteSelected(routeName: string) {
      return this.currentRouteName == routeName;
    },
    changePage(pageName: string) {
      this.$router.replace({ name: pageName });

      if (this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("hideSidebar");
      }
    },
    isSidebarOpen() {
      return this.$store.state.navigation.isSidebarOpen;
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#sidebar {
  background-color: $greyscale2;
  color: $greyscaleE;
  // overflow: hidden !important;

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
