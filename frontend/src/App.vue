<template lang="pug">
#app
  ToastsManager
  Loading
  Navbar
  #body
    Sidebar#sidebar
    #content
      router-view

</template>

<script lang="ts">
import Vue from "vue";

import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/sidebar/Sidebar.vue";
import ToastsManager from "./components/ToastsManager.vue";
import Loading from "./components/Loading.vue";

import { UserData } from "./types/types";

import api from "./api/user";
import { AxiosResponse } from "axios";

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

    if (this.$cookies.get("jwt")) {
      api.loadData().then((r: AxiosResponse) => {
        this.$store.dispatch("login", {
          token: this.$cookies.get("jwt"),
          userData: r.data as UserData,
        });
        this.$socket.emit("login", this.$store.state.session.userData._id);
      });
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
  overflow-y: scroll;
}
</style>
