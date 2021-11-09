<template lang="pug">
#sidebar.p-3(v-if="isSidebarOpen()")
  #sidebar-user 
    b-row.p-4(no-gutters align-h="center") 
      b-col(class="mr-1" cols="auto")
        b-icon-person-circle(font-scale="3")
      b-col.ml-1(cols="auto")
        p {{ userFullname }}
        p {{ userType }}
        p(@click="changePage('ManagerEditUserInfo')" class="clickable") edit

    hr.sidebar-hr.my-3

  div#sidebar-actions 
  
    div
      SidebarCategory(text='Donate food', icon='drumstick-bite')
      SidebarItem(text= 'Create a donation', route='ManagerDonationsCreate')
      SidebarItem(text= 'Your donations', route='ManagerDonationsList')

    hr.sidebar-hr.my-3

    div
      SidebarCategory(text='Families', icon='users')
      SidebarItem(text= 'Report a family', route='ManagerFamiliesSubscribe')
      SidebarItem(text= 'Your reports', route='ManagerFamilies')

    hr(class="sidebar-hr my-3")

    div(v-if="this.$store.state.session.userData.type != 'user'")
      SidebarCategory(text='Events', icon='calendar')
      SidebarItem(text= 'Create an event', route='ManagerEventCreate')
      SidebarItem(text= 'Your events', route='ManagerEvents')

    hr.sidebar-hr.my-3

    div(v-if="this.$store.state.session.userData.type != 'user'")
      SidebarItem(text= 'Food manager', route='ManagerFood')


</template>

<script lang="ts">
import Vue from "vue";
import SidebarItem from "./SidebarItem.vue";
import SidebarCategory from "./SidebarCategory.vue"

export default Vue.extend({
  name: "Sidebar",
  components: {
    SidebarItem,
    SidebarCategory
  },
  data: function () {
    return {};
  },
  computed: {
    userFullname() {
      const fullname =
        this.$store.state.session.userData.name +
        " " +
        this.$store.state.session.userData.surname;
      if (fullname.length > 10) {
        return fullname.substring(0, 10) + "...";
      }
      return fullname;
    }
  },
  methods: {
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

.clickable {
  cursor: pointer;
}

.sidebar-hr {
  background-color: $greyscale5;
}

</style>
