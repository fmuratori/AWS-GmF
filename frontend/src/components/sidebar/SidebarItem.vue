<template lang="pug">
b-row.p-1.justify-content-md-center.sidebar-item(no-gutters='no-gutters' align-v='center' @click='changePage(route)' :class="{ 'sidebar-item-selected': isRouteSelected(route) }")
  b-col
    label.p-0.m-0 {{ text }}
  b-col(cols='auto')
    b-icon(icon='chevron-right')

</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "SidebarItem",
  props: {
    text: String,
    route: String,
  },
  methods: {
    isRouteSelected(routeName: string) {
      return this.$route.name == routeName;
    },
    changePage(pageName: string): void {
      if (this.$router.currentRoute.name != pageName) {
        this.$router.push({ name: pageName });

        if (this.$store.getters.isMediumScreenWidth) {
          this.$store.dispatch("hideSidebar");
        }
      }
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

.sidebar-item {
  border-radius: 0.25em;
  margin: 0px;
  padding: 0xp;
}

.sidebar-item:hover {
  background-color: $greyscale1;
}

.sidebar-item-selected {
  background-color: $color1;
}
</style>
