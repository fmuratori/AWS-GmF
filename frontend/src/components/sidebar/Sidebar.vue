<template lang="pug">
#sidebar.p-3(v-if='isSidebarOpen()')
  #sidebar-user
    b-row.mt-3.mb-2(no-gutters='no-gutters' align-h='center')
      b-col.mr-1(cols='auto')
        b-icon-person-circle(font-scale='3')
    b-row(no-gutters='no-gutters' align-h='center')
      b-col.ml-1.text-center(cols='auto')
        p {{ userFullname }}
        h5
          b-badge.color1 {{ this.$store.state.session.userData.type }}
  #sidebar-actions.mb-3
    div
      hr.sidebar-hr.my-3
      SidebarCategory(text='Donations' icon='map')
      SidebarItem(v-if='!$store.getters.isUser' text='Retrieve donations' route='ManagerDonationRetrieve')
      SidebarItem(v-if='$store.getters.isUser' text='Make a donation' route='ManagerDonationCreate')
      SidebarItem(text='Your donations' route='ManagerDonationList' v-if='$store.getters.isUser')
      SidebarItem(text='Donations list' route='ManagerDonationList' v-if='!$store.getters.isUser')
    div
      hr.sidebar-hr.my-3
      SidebarCategory(text='Families' icon='users')
      SidebarItem(text='Report a family' route='ManagerFamilySubscribe')
      SidebarItem(text='Your reports' route='ManagerFamilyList')
      SidebarItem(text='Check reports' route='ManagerFamilyCheck' v-if='$store.getters.isTrustedVolunteer')
    div(v-if='!$store.getters.isUser')
      hr.sidebar-hr.my-3
      SidebarCategory(text='Events' icon='calendar')
      SidebarItem(text='Create an event' route='ManagerEventCreate')
      SidebarItem(text='Your events' route='ManagerEventList')
    div(v-if='!$store.getters.isUser')
      hr.sidebar-hr.my-3
      SidebarCategory(text='Packs' icon='box')
      SidebarItem(text='Food manager' route='ManagerFood')
      SidebarItem(text='Create Pack' route='ManagerPackCreate')
      SidebarItem(text='Pack list' route='ManagerPackList')
      SidebarItem(text='Create a delivery' route='ManagerPackDelivery')
      SidebarItem(text='Scan a pack' route='ManagerPackScan')
      hr.sidebar-hr.my-3
  b-dropdown(text='Your profile' variant='light' dropup='dropup' menu-class='w-100')
    b-dropdown-item(href='#' @click="changePage('ManagerEditUserInfo', 'password')") Change password
    b-dropdown-item(href='#' @click="changePage('ManagerEditUserInfo', 'address')") Change address
    b-dropdown-item(href='#' @click="changePage('ManagerEditUserInfo', 'user_info')") Change profile info

</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../../eventbus";

import SidebarCategory from "./SidebarCategory.vue";
import SidebarItem from "./SidebarItem.vue";

export default Vue.extend({
  name: "Sidebar",
  components: {
    SidebarCategory,
    SidebarItem,
  },
  computed: {
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
    changePage(pageName: string, mode: string) {
      if (this.$router.currentRoute.name != pageName) {
        this.$router.push({ name: pageName, params: { mode: mode } });

        if (this.$store.getters.isMediumScreenWidth) {
          this.$store.dispatch("hideSidebar");
        }
      } else {
        eventbus.$emit("userInfoModeChange", mode);
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

* > * {
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
  height: 100%;
  position: absolute;
  z-index: 5;

  @include lg {
    width: 17em;
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
</style>
