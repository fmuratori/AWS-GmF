<template lang="pug">
  div(id="app")
    ToastsManager
    Loading
    Navbar
    div(id="body")
      Sidebar(id="sidebar")
      div(id="content")
        router-view
</template>

<script lang="ts">
import Vue from "vue";
import { AxiosResponse } from "axios";
import api from "./api/user";
import { UserData } from "./types";

import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/sidebar/Sidebar.vue";
import ToastsManager from "./components/ToastsManager.vue";
import Loading from "./components/Loading.vue";

export default Vue.extend({
  name: "Home",
  components: {
    Navbar,
    Sidebar,
    ToastsManager,
    Loading,
  },
  created() {
    this.$store.dispatch("updateScreenWidth", window.innerWidth);
    window.addEventListener("resize", this.resizeEventHandler);

    //
    if (this.$cookies.get("jwt")) {
      api.loadData().then((r: AxiosResponse) => {
        this.$store.dispatch("showSidebar");
        this.$store.dispatch("login", {
          token: this.$cookies.get("jwt"),
          userData: r.data as UserData,
        });
      });
      return true;
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeEventHandler);
  },
  methods: {
    resizeEventHandler() {
      this.$store.dispatch("updateScreenWidth", window.innerWidth);
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

#app {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;

  overflow: hidden;
}

#body {
  // relative to #app container
  flex-grow: 1;

  display: flex;
  flex-direction: row;

  overflow: hidden;
}

#body > * {
  overflow: auto;
}

#content {
  flex-grow: 1;
}
</style>
