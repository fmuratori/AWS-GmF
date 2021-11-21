<template lang="pug">
b-navbar#navbar(toggleable="lg", type="dark", sticky)
  b-navbar-brand(href="#")
    h3 Bring me Food

  b-navbar-nav.ml-auto.mr-2(
    v-if="$store.getters.isMediumScreenWidth && $store.getters.isUserLogged"
  )
    b-nav-item.my-auto.text-center(href="#")
      b-button.my-2.my-sm-0.navbar-messages-button(
        v-if="$store.getters.unreadMessagesTotalCount > 0",
        type="submit",
        variant="danger",
        @click="$router.push({ name: 'ManagerDonationsList' })"
      )
        b-icon.mr-1(icon="envelope")
        b-badge(variant="light") {{ $store.getters.unreadMessagesTotalCount }}
  b-navbar-nav.mr-2(
    v-if="$store.getters.isMediumScreenWidth && $store.getters.isUserLogged"
  )
    b-nav-item.my-auto.text-center(href="#")
      b-button.my-2.my-sm-0(
        type="submit",
        variant="light",
        @click="toggleSidebar()"
      )
        font-awesome-icon(icon="cogs")
  b-navbar-nav(v-if="$store.getters.isMediumScreenWidth")
    b-nav-item.my-auto.text-center(href="#")
      b-button.my-2.my-sm-0(
        type="submit",
        variant="light",
        @click="isOpen = !isOpen"
      )
        font-awesome-icon(v-if="isOpen", icon="times")
        font-awesome-icon(v-else, icon="bars")

  b-collapse#nav-collapse(is-nav="", v-model="isOpen")
    b-navbar-nav.ml-auto
      b-nav-item.my-auto.navbar-link.text-center(
        href="#",
        @click="changePage('Home')"
      ) Home

      b-nav-item.my-auto.navbar-link.text-center(
        href="#",
        v-if="this.$store.state.session.userData.type == 'trusted'"
      )
        UserUpgradeModal

      b-nav-item.my-auto.navbar-link.text-center(href="#") Contact us

      b-nav-item.my-auto.text-center(
        href="#",
        v-if="!$store.getters.isMediumScreenWidth && $store.getters.isUserLogged"
      )
        b-button.my-2.my-sm-0.navbar-messages-button(
          v-if="$store.getters.unreadMessagesTotalCount > 0",
          @click="routeToDonations()",
          type="submit",
          variant="danger"
        )
          span.mr-1 Messages
          b-badge(variant="light") {{ $store.getters.unreadMessagesTotalCount }}

      b-nav-item.my-auto.navbar-link.text-center(
        href="#",
        v-if="$store.getters.isUserLogged",
        @click="logout()"
      ) 
        span.mr-1 Logout
        font-awesome-icon(icon="sign-out-alt")

      b-nav-item.my-auto.navbar-link.text-center(
        href="#",
        @click="changePage('Login')",
        v-if="!$store.getters.isUserLogged"
      ) 
        b-button.my-2.my-sm-0(type="submit", variant="light")
          span.mr-1 Login
          font-awesome-icon(icon="sign-in-alt")
</template>

<script lang="ts">
import Vue from "vue";
import UserUpgradeModal from "./sidebar/UserUpgradeModal.vue";

export default Vue.extend({
  name: "Navbar",
  components: {
    UserUpgradeModal,
  },
  data: function () {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch("toggleSidebar");
    },
    logout() {
      this.$cookies.remove("jwt");
      this.$cookies.remove("user-id");

      this.$socket.emit("logout", this.$store.state.session.userData._id);
      this.$store.dispatch("logout");
      this.$router.go(0);

      this.$store.dispatch("hideSidebar");
    },
    routeToDonations() {
      if (this.$store.getters.isUser)
        this.$router.push({ name: "ManagerDonationsUserList" });
      else if (this.$store.getters.isVolunteer)
        this.$router.push({ name: "ManagerDonationsVolunteerList" });
    },
    changePage(pageName: string) {
      if (this.$router.currentRoute.name != pageName) {
        this.$router.push({ name: pageName });
      }
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

#navbar {
  background-color: $color1;
}

.navbar-messages-button {
  background-color: $color3;
}

.navbar-link > * {
  color: $greyscaleE !important;
}
</style>
