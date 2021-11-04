<template lang="pug">
  div(id="app")
    Navbar
    div(id="body")
      Sidebar(id="sidebar")
      div(id="content")
        router-view
</template>

<script lang="ts">
import Vue from "vue";

import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";

export default Vue.extend({
  name: "Home",
  components: {
    Navbar,
    Sidebar,
  },
  created() {
    this.$store.dispatch("updateScreenWidth", window.innerWidth);
    window.addEventListener("resize", this.resizeEventHandler);

    //socket initialization

    this.$socket.emit("message_to_server", {
      donationId: "61752da118f0f36305767ec8",
      userId: "6172e6a4df4d0325895749e2",
      message: "mess da client",
    });
    this.$socket.on("message_to_client", (message: string) => {
      console.log("message: " + message);
    });
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

#sidebar {
  overflow: auto;

  @include lg {
  }
}

#content {
  flex-grow: 1;
  overflow: auto;
}
</style>
