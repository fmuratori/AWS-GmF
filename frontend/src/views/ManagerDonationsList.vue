<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col
      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b(v-if="this.$store.state.session.userData.type == 'user'") YOUR DONATIONS
        b(v-else) DONATIONS
      hr.sidebar-hr.my-3

      b-row.mb-2(no-gutters)
        FilterButtons(
          label="Donation status"
          :filters="['waiting','selected','withdrawn','all']"
          v-on:click="(filter) => filterBy(filter)"
        )
      b-row.mb-2(no-gutters)
        FilterButtons(
          label="Sort by"
          :filters="['creationDate','unreadMessages','expirationDate']"
          v-on:click="(filter) => orderBy(filter)"
        )

      b-row.mb-2(no-gutters)
        b-col(cols="2")
          p Sort by:
        b-col
          b-button.ml-2(
            pill,
            variant="secondary",
            size="sm",
            @click="orderBy('creationDate')",
            :class="{ 'my-button-selected': orderByMode == 'creationDate' }"
          ) Creation date
          b-button.ml-2(
            pill,
            variant="secondary",
            size="sm",
            @click="orderBy('unreadMessages')",
            :class="{ 'my-button-selected': orderByMode == 'unreadMessages' }"
          ) Unread messages
          b-button.ml-2(
            pill,
            variant="secondary",
            size="sm",
            @click="orderBy('expirationDate')",
            :class="{ 'my-button-selected': orderByMode == 'expirationDate' }"
          ) Expiration date

      b-row
        b-col(sm=12, md=6, v-if="donations.length == 0") 
          p No donations found. Change filters or click #[a(href="#", @click="$router.push({ name: 'ManagerDonationsCreate' })") here] for insert a donation.

        b-col(
          v-else,
          sm=12,
          md=6,
          v-for="(donation, idx) in donations",
          :key="idx"
        )
          b-card.mb-2(bg-variant="light", text-variant="dark", no-body)
            b-card-text
              .px-4.pt-4
                h5 Creation date: {{ formatDonation(donation) }}
                b-row
                  b-col(cols="auto")
                    div(class="")
                      p.mb-0 Food:
                      p.font-weight-bold.mb-2(
                        v-for="(food, idx) in donation.foods",
                        :key="idx"
                      ) {{ food }}
                    div(class="")
                      p.mb-0 Expires in:
                      p.font-weight-bold.mb-2 {{ getExpirationDays(donation) }} giorni
                    //- div 
                    //-   p(class="mb-0") Orari disponibili per il ritiro:
                    //-   p(class="font-weight-bold") 12/12/2012 
                    //-     span(class="font-weight-normal") Scade tra 12 giorni
                    div(class="")
                      p.mb-0 Location:
                      p.font-weight-bold {{ donation.address.street + ' ' + donation.address.civicNumber + ', ' + donation.address.city }}
                  b-col(cols="auto")
                    .mb-2
                      p.mb-0 Status:
                      h5
                        b-badge(
                          v-if="donation.status == 'waiting'",
                          variant="warning"
                        ) {{donation.status}}
                        b-badge(
                          v-if="donation.status == 'selected'",
                          variant="success"
                        ) {{donation.status}}
                        b-badge(
                          v-if="donation.status == 'withdrawn'",
                          variant="secondary"
                        ) {{donation.status}}
                    .mb-2(v-if="hasUnreadMessages(donation._id)")
                      a(href="#") {{ unreadMessagesCount(donation._id) }} unread messages
              b-button(
                block,
                variant="primary"
                @click="inspectDonation(donation)"
              ) Show
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import FilterButtons from "../components/FilterButtons.vue"

import api from "../api/donation";

import { Donation } from "../types";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerDonationsList",
  components: {
    Navbar,
    Sidebar,
    FilterButtons
  },
  data: () => {
    return {
      donations: new Array<Donation>(),
      donationsBackup: new Array<Donation>(),
      orderByMode: "unreadMessages",
      filterByMode: "all",
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      var filter = {};
      if (this.$store.state.session.userData.type == "user")
        filter = { userId: this.$store.state.session.userData._id };
      
      api
        .filterDonations(filter)
        .then((r: AxiosResponse): void => {
          this.donations = r.data as Donation[];
          this.donationsBackup = r.data as Donation[];
          this.orderBy(this.orderByMode);
          this.filterBy(this.filterByMode);
        })
        .catch((e: AxiosError): void => console.log(e));
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    creationDateComparer(a: Donation, b: Donation) {
      return new Date(a.creationDate) < new Date(b.creationDate) ? -1 : 1;
    },
    unreadMessagesComparer(a: Donation, b: Donation) {
      return this.unreadMessagesCount(a._id) < this.unreadMessagesCount(b._id)
        ? 1
        : -1;
    },
    expirationDateComparer(a: Donation, b: Donation) {
      return new Date(a.expirationDate) < new Date(b.expirationDate) ? -1 : 1;
    },
    orderBy(sortBy: "creationDate" | "unreadMessages" | "expirationDate") {
      this.orderByMode = sortBy;
      switch (sortBy) {
        case "creationDate":
          this.donations = this.donations.sort(this.creationDateComparer);
          break;
        case "unreadMessages":
          this.donations = this.donations.sort(this.unreadMessagesComparer);
          break;
        case "expirationDate":
          this.donations = this.donations.sort(this.expirationDateComparer);
          break;
        default:
          null;
      }
    },
    filterBy(statusFilter: "waiting" | "selected" | "withdrawn" | "all") {
      this.filterByMode = statusFilter;
      switch (statusFilter) {
        case "waiting":
        case "selected":
        case "withdrawn":
          this.donations = this.donationsBackup.filter(
            (d) => d.status == statusFilter
          );
          break;
        default:
          this.donations = this.donationsBackup;
      }
    },
    getExpirationDays(donation: Donation) {
      return moment(donation.expirationDate).diff(moment.now(), "days");
    },
    formatDonation(donation: Donation) {
      return moment(donation.creationDate).locale("it").format("LL");
    },
    inspectDonation(donation: Donation) {
      this.$router.push({
        name: "ManagerDonationsInspect",
        params: { donation: JSON.stringify(donation) },
      });
    },
    hasUnreadMessages(donationId: string): boolean {
      return (
        this.$store.state.socketio.unreadMessages.findIndex(
          (e) => e._id == donationId
        ) != -1
      );
    },
    unreadMessagesCount(donationId: string): number {
      if (this.hasUnreadMessages(donationId))
        return this.$store.state.socketio.unreadMessages.find(
          (e) => e._id == donationId
        ).chat.length;
      return 0;
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

.my-button-selected {
  background-color: $color1;
  border-color: $color1;
}
</style>
