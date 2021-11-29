<template lang="pug">
b-container
  b-row.justify-content-center.my-5
    b-col(lg=6, md=8, cols=11)
    
      div.mb-5
        hr.shaded
        h4.text-center
          b(v-if="this.$store.state.session.userData.type == 'user'") YOUR DONATIONS
          b(v-else) DONATIONS
        hr.shaded

      b-row.mb-2(no-gutters)
        b-col(cols="3")
          p Donation status:
        b-col
          b-button.ml-2(
            pill,
            variant="secondary",
            size="sm",
            @click="filterBy('waiting')",
            :class="{ 'color1': filterByMode == 'waiting' }"
          ) Waiting

          b-button.ml-2(
            pill,
            variant="secondary",
            size="sm",
            @click="filterBy('selected')",
            :class="{ 'color1': filterByMode == 'selected' }"
          ) Selected
          //- b-button.ml-2(
          //-   pill,
          //-   variant="secondary",
          //-   size="sm",
          //-   @click="filterBy('withdrawn')",
          //-   :class="{ 'color1': filterByMode == 'withdrawn' }"
          //- ) Withdrawn
          b-button.ml-2(
            pill,
            variant="secondary",
            size="sm",
            @click="filterBy('all')",
            :class="{ 'color1': filterByMode == 'all' }"
          ) All

      b-row.mb-2(no-gutters)
        b-col(cols="3")
          p Sort by:
        b-col

          b-button.ml-2.mb-2(
            pill,
            variant="secondary",
            size="sm",
            @click="sortBy('unreadMessages')",
            :class="{ 'color1': sortByMode == 'unreadMessages' }"
          ) 
            span Unread messages

          b-button.ml-2.mb-2(
            pill,
            variant="secondary",
            size="sm",
            @click="sortBy('creationDateDescending')",
            :class="{ 'color1': sortByMode == 'creationDateDescending' }"
          ) 
            span.mr-1 Creation date
            b-icon(icon="sort-down")

          b-button.ml-2.mb-2(
            pill,
            variant="secondary",
            size="sm",
            @click="sortBy('creationDateAscending')",
            :class="{ 'color1': sortByMode == 'creationDateAscending' }"
          ) 
            span.mr-1 Creation date
            b-icon(icon="sort-down-alt" )

          b-button.ml-2.mb-2(
            pill,
            variant="secondary",
            size="sm",
            @click="sortBy('expirationDateDescending')",
            :class="{ 'color1': sortByMode == 'expirationDateDescending' }"
          ) 
            span Expiration date
            b-icon(icon="sort-down")

          b-button.ml-2.mb-2(
            pill,
            variant="secondary",
            size="sm",
            @click="sortBy('expirationDateAscending')",
            :class="{ 'color1': sortByMode == 'expirationDateAscending' }"
          ) 
            span Expiration date
            b-icon(icon="sort-down")

      p(v-if="donations.length == 0") No donations found. Change filters or click #[a(href="#", @click="$router.push({ name: 'ManagerDonationsCreate' })") here] for insert a donation.

      b-card.mb-4(bg-variant="light", text-variant="dark", no-body v-for="(donation, idx) in donations", :key="idx")
        template(#header)
          h5.mb-0 
            b Donated in {{ formatDonation(donation) }}

        b-card-text
          .px-4.pt-3
            b-row
              b-col(cols="auto")
                div.mb-2
                  p.mb-0 Food:
                  p.font-weight-bold.mb-0(
                    v-for="(food, idx) in donation.foods",
                    :key="idx"
                  ) {{ food }}
                div.mb-2
                  p.mb-0 Expires in:
                  p.font-weight-bold.mb-0 {{ getExpirationDays(donation) }} days
                div
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
          b-button.footerCardButton.color3(
            block,
            variant="primary"
            @click="inspectDonation(donation)"
          ) SHOW

</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import eventbus from "../eventbus";
import api from "../api/donation";

import { Donation } from "../types";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerDonationsList",
  components: {
    Navbar,
    Sidebar,
  },
  data: () => {
    return {
      donations: new Array<Donation>(),
      donationsBackup: new Array<Donation>(),
      sortByMode: "unreadMessages",
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

      eventbus.$emit("startLoading", "Filtering all your active donations.");
      api
        .filterDonations(filter)
        .then((r: AxiosResponse): void => {
          this.donations = r.data as Donation[];
          this.donationsBackup = r.data as Donation[];
          this.sortBy(this.sortByMode);
          this.filterBy(this.filterByMode);
        })
        .catch((e: AxiosError): void => console.log(e))
        .then(() => {
          eventbus.$emit("stopLoading");
        });
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
    sortBy(mode: string) {
      this.sortByMode = mode;
      switch (mode) {
        case "unreadMessages":
          this.donations = this.donations.sort(this.unreadMessagesComparer);
          break;
        case "creationDateAscending":
          this.donations = this.donations.sort(this.creationDateComparer);
          break;
        case "creationDateDescending":
          this.donations = this.donations
            .sort(this.creationDateComparer)
            .reverse();
          break;
        case "expirationDateAscending":
          this.donations = this.donations.sort(this.expirationDateComparer);
          break;
        case "expirationDateDescending":
          this.donations = this.donations
            .sort(this.expirationDateComparer)
            .reverse();
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
      return moment(donation.expirationDate)
        .locale("en")
        .diff(moment.now(), "days");
    },
    formatDonation(donation: Donation) {
      return moment(donation.creationDate).format("LL");
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

.button-selected {
  background-color: $color1;
}
</style>
