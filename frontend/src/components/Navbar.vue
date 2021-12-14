<template lang="pug">
b-navbar#navbar(toggleable='lg' type='dark' sticky='sticky')
  b-navbar-brand(href='#' @click="$router.push({name: 'Home'})")
    h3(v-if="$store.getters.isExtraSmallScreenWidth") BMF
    h3(v-else) Bring me Food
  b-navbar-nav.ml-auto.mr-2(v-if='$store.getters.isMediumScreenWidth && $store.getters.isUserLogged')
    b-nav-item.my-auto.text-center(href='#')
      b-button.my-2.my-sm-0.color3(pill v-if='$store.getters.unreadMessagesTotalCount > 0' v-b-modal.messagesmodal)
        Icon.mr-1(bootstrap icon='envelope')
        b-badge(variant='light') {{ $store.getters.unreadMessagesTotalCount }}
  b-navbar-nav.mr-2(v-if='$store.getters.isMediumScreenWidth && $store.getters.isUserLogged')
    b-nav-item.my-auto.text-center(href='#')
      b-button.my-2.my-sm-0(variant='light' @click='toggleSidebar()')
        Icon(fontawesome icon='cogs')
  b-navbar-nav(v-if='$store.getters.isMediumScreenWidth')
    b-nav-item.my-auto.text-center(href='#')
      b-button.my-2.my-sm-0(variant='light' @click='isOpen = !isOpen')
        Icon(fontawesome v-if='isOpen' icon='times')
        Icon(fontawesome v-else icon='bars')
  b-collapse#nav-collapse(is-nav='' v-model='isOpen')
    b-navbar-nav.ml-auto
      b-nav-item.my-auto.navbar-link.text-center(href='#' @click="changePage('Home')") Home
      b-nav-item.my-auto.navbar-link.text-center(href='#' v-if="this.$store.state.session.userData.type == 'trusted'")
        UserUpgradeModal
      b-nav-item.my-auto.navbar-link.text-center(href='#footer' @click="$router.push({name: 'Home'})") Contact us
      b-nav-item.my-auto.navbar-link.text-center(href='#events' @click="$router.push({name: 'Home'})") Events
      //- b-nav-item.my-auto.navbar-link.text-center(@click="") 
      //-   b-button(variant="light" v-b-modal.calendarModal)
      //-     span.mr-1 Calendar
      //-     Icon(bootstrap icon="calendar")
      b-nav-item.my-auto.text-center(href='#' v-if='!$store.getters.isMediumScreenWidth && $store.getters.isUserLogged && $store.getters.unreadMessagesTotalCount > 0')
        b-button.my-2.my-sm-0.color3(pill v-b-modal.messagesModal)
          span.mr-1 Messages
          b-badge(variant='light') {{ $store.getters.unreadMessagesTotalCount }}
      b-nav-item.my-auto.navbar-link.text-center(:key='' href='#' v-if='$store.getters.isUserLogged' @click='logout()')
        b-button.my-2.my-sm-0(variant='light')
          span.mr-1 Log-out
          Icon(fontawesome icon='sign-out-alt')
      b-nav-item.my-auto.navbar-link.text-center(href='#' @click="changePage('Login')" v-if='!$store.getters.isUserLogged')
        b-button.my-2.my-sm-0(variant='light')
          span.mr-1 Login
          Icon(fontawesome icon='sign-in-alt')

  //- b-modal#calendarModal(hide-footer='hide-footer' hide-header='hide-header' centered='centered' ref='calendarModal')
  //-   vc-calendar

  b-modal#messagesModal(hide-footer='hide-footer' hide-header='hide-header' centered='centered' ref='messagesModal')
    h4 Your Messages
    b-row.no-gutters.my-4.p-2.border(align-v='center' v-for='(message, idx) in $store.getters.unreadMessages' :key='idx')
      b-col(cols='auto')
        span Donated on 
        br
        span {{ dates.formatDate(message.creationDate) }}
      b-col.text-center
        span {{ message.chat.length }} unread messages
        br
        span {{ dates.formatDatetime(message.chat[0].date) }}
      b-col(cols='auto')
        b-button.color3(size='sm' @click='routeToDonation(message._id)')
          span.mr-1 Open
          Icon(bootstrap icon='envelope-open')
    b-row.no-gutters(align-h='end')
      b-button.mr-2(size='sm' variant='secondary' @click='() => { this.$refs.messagesModal.hide(); }') Close
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";

import UserUpgradeModal from "./sidebar/UserUpgradeModal.vue";
import Icon from "./Icon.vue";
import VCalendar from 'v-calendar';

import donationApi from "../api/donation";
import { AxiosError, AxiosResponse } from "axios";

import { Donation } from "../types/types";

export default Vue.extend({
  name: "Navbar",
  components: {
    UserUpgradeModal,
    Icon,
    VCalendar,
  },
  data: () => {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch("toggleSidebar");
    },
    logout() {
      eventbus.$emit("startLoading");

      this.$cookies.remove("jwt");
      this.$cookies.remove("user-id");

      this.$socket.emit("logout", this.$store.state.session.userData._id);
      this.$store.dispatch("logout");
      this.$router.go(0);

      this.$store.dispatch("hideSidebar");

      this.$forceUpdate();
    },
    routeToDonation(donationId: string) {
      eventbus.$emit("startLoading", "Loading selected donation.");
      donationApi
        .findDonation(donationId)
        .then((r: AxiosResponse<Donation[]>): void => {
          if (r.status == 200) {
            this.$refs.messagesModal!.hide();
            this.$router.push({
              name: "ManagerDonationInspect",
              params: { donation: JSON.stringify((r.data as Donation[])[0]) },
            });
          } else {
            eventbus.$emit(
              "errorMessage",
              "Donation",
              "Unable to retrieve the donation. Retry later or contact us if the problem persists."
            );
          }
        })
        .catch((e: AxiosError) => {
          console.log(e);
          eventbus.$emit(
            "errorMessage",
            "Donation",
            "Unable to retrieve the donation. Retry later or contact us if the problem persists."
          );
        })
        .then(() => {
          eventbus.$emit("stopLoading");
        });
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

.navbar-link > * {
  color: $greyscaleE !important;
}
</style>
