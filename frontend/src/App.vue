<template lang="pug">
  div(id="app")
    Messages

    Navbar
    div(id="body")
      Sidebar(id="sidebar")
      div(id="content")
        router-view
</template>

<script lang="ts">
import Vue from "vue";

import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/sidebar/Sidebar.vue";
import Messages from "./components/Messages.vue";

export default Vue.extend({
  name: "Home",
  components: {
    Navbar,
    Sidebar,
    Messages,
  },
  created() {
    this.$store.dispatch("updateScreenWidth", window.innerWidth);
    window.addEventListener("resize", this.resizeEventHandler);
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
