<template lang="pug">
#sidebar.p-3(v-if="isSidebarOpen()")
  #sidebar-user 
    b-row.p-4(no-gutters, align-h="center") 
      b-col.mr-1(cols="auto")
        b-icon-person-circle(font-scale="3")
      b-col.ml-1(cols="auto")
        p {{ userFullname }}
        p {{ this.$store.state.session.userData.type }}
        p.clickable(@click="changePage('ManagerEditUserInfo')") edit

    hr.sidebar-hr.my-3

  #sidebar-actions 
    div(v-if="$store.state.session.userData.type == 'user'")
      SidebarCategory(text="Donations", icon="map")
      SidebarItem(text="Make a donation", route="ManagerDonationsCreate")
      SidebarItem(text="Donation list", route="ManagerDonationsUserList")

      hr.sidebar-hr.my-3

    div(v-if="this.$store.state.session.userData.type == 'volunteer'")
      SidebarCategory(text="Donations", icon="map")
      SidebarItem(
        text="Create retrieve assignment",
        route="ManagerDonationsRetrieve"
      )
      SidebarItem(text="Donation list", route="ManagerDonationsVolunteerList")

      hr.sidebar-hr.my-3

    div(
      v-if="['user', 'volunteer'].includes($store.state.session.userData.type)"
    )
      SidebarCategory(text="Families", icon="users")
      SidebarItem(text="Report a family", route="ManagerFamilySubscribe")
      SidebarItem(text="Report list", route="ManagerFamilyList")

      hr.sidebar-hr.my-3

    div(v-if="this.$store.state.session.userData.type == 'volunteer'")
      SidebarCategory(text="Events", icon="calendar")
      SidebarItem(text="Create an event", route="ManagerEventCreate")
      SidebarItem(text="Your events", route="ManagerEvents")

      hr.sidebar-hr.my-3

    div(v-if="this.$store.state.session.userData.type != 'user'")
      SidebarItem(text="Food manager", route="ManagerFood")
      //- SidebarItem(text= 'Pack manager', route='ManagerPacks')
</template>

<script lang="ts">
import Vue from "vue";
import SidebarCategory from "./SidebarCategory.vue";
import SidebarItem from "./SidebarItem.vue";

export default Vue.extend({
  name: "Sidebar",
  components: {
    SidebarCategory,
    SidebarItem,
  },
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
      if (fullname.length > 16) {
        return fullname.substring(0, 16) + "...";
      }
      return fullname;
    },
  },
  methods: {
    isRouteSelected(routeName: string) {
      return this.currentRouteName == routeName;
    },
    changePage(pageName: string) {
      if (this.$router.currentRoute.name != pageName) {
        this.$router.push({ name: pageName });

        if (this.$store.getters.isMediumScreenWidth) {
          this.$store.dispatch("hideSidebar");
        }
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

.clickable {
  cursor: pointer;
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
