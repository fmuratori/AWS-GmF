<template lang="pug">
b-container
  b-row.justify-content-center.my-5
    b-col(lg=6, md=8, cols=11)
      hr.shaded
      h4.text-center
        b(v-if="this.$store.state.session.userData.type == 'user'") YOUR DONATIONS
        b(v-else) DONATIONS
      hr.shaded

  b-row.justify-content-center
    b-col(lg=4, md=8, cols=11 order-md=1 order-lg=2)
      b-alert(show)
        b-row(align-v="center")
          b-col(cols="auto")
            h1 
              b-icon(icon="info")
          b-col 
            p.m-0 Here are listed all your active donations. You can inspect, modify, delete them in any moment or directly chat with a volunteer. 
      
      b-alert(show).mb-5
        b-row(align-v="center")
          b-col(cols="auto")
            h1 
              b-icon(icon="info")
          b-col 
            p.m-0 To make things easier, filter your donations by status or sort them.

    b-col(lg=6, md=8, cols=11 order-md=2 order-lg=1)
      b-row.mb-2(no-gutters v-if="$store.getters.isUser")
        b-col(cols="3")
          p Donation status:
        b-col
          FilterButtons(:filters="filters" :selected=2 @click="filterBy")

      b-row.mb-2(no-gutters)
        b-col(cols="3")
          p Sort by:
        b-col
          FilterButtons(:filters="sorters" :selected=1 @click="sortBy")

      p(v-if="donations.length == 0") 
        span No donations found. Be sure to select valid filters 
        span(v-if="$store.getters.isUser") or click #[a(href="#", @click="$router.push({ name: 'ManagerDonationCreate' })") here] to insert a donation
        span .

      b-card.mb-4(bg-variant="light", text-variant="dark", no-body v-for="(donation, idx) in donations", :key="idx")
        template(#header)
          h5.mb-0
            b Donated in {{ dates.formatDate(donation.creationDate) }}
            span.float-right
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
          //- h5.mb-0 
          //-   b Donated in {{ dates.formatDate(donation) }}

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
                  p.font-weight-bold.mb-0 {{ dates.daysTillDate(donation.expirationDate) }} days
                div
                  p.mb-0 Location:
                  p.font-weight-bold {{ donation.address.street + ' ' + donation.address.civicNumber + ', ' + donation.address.city }}
              b-col(cols="auto")
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
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import eventbus from "../eventbus";
import FilterButtons from "../components/FilterButtons.vue";
import api from "../api/donation";

import { Donation, FindPayload } from "../types";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerDonationList",
  components: {
    Navbar,
    Sidebar,
    FilterButtons,
  },
  data: () => {
    return {
      donations: new Array<Donation>(),
      donationsBackup: new Array<Donation>(),
      sortByMode: "expirationDateAscending",
      filterByMode: "all",
      filters: [],
      sorters: [],
    };
  },
  created() {
    this.filters = [
      ["waiting", "Waiting", null, true],
      ["selected", "Selected", null, true],
      ["all", "All", null, true],
    ];

    this.sorters = [
      ["unreadMessages", "Unread Messages", null, true],
      ["creationDateDescending", "Creation Date", "sort-down", true],
      ["creationDateAscending", "Creation Date", "sort-down-alt", true],
      ["expirationDateDescending", "Expiration Date", "sort-down", true],
      ["expirationDateAscending", "Expiration Date", "sort-down-alt", true],
      [
        "pickUpDateDescending",
        "Pick Up Date",
        "sort-down",
        this.$store.getters.isVolunteer ||
          this.$store.getters.isTrustedVolunteer,
      ],
      [
        "pickUpDateAscending",
        "Pick Up Date",
        "sort-down-alt",
        this.$store.getters.isVolunteer ||
          this.$store.getters.isTrustedVolunteer,
      ],
    ];

    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      var filter = {};
      if (this.$store.getters.isUser)
        filter = { userId: this.$store.state.session.userData._id };
      else if (
        this.$store.getters.isVolunteer ||
        this.$store.getters.isTrustedVolunteer
      )
        filter = {
          "pickUp.volunteerId": this.$store.state.session.userData._id,
        };

      eventbus.$emit("startLoading", "Filtering all your active donations.");

      api
        .filterDonations({ filter: filter } as FindPayload)
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
    pickUpDateComparer(a: Donation, b: Donation) {
      return new Date(a.pickUp.date) < new Date(a.pickUp.date) ? -1 : 1;
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
        case "pickUpDateAscending":
          this.donations = this.donations.sort(this.pickUpDateComparer);
          break;
        case "pickUpDateDescending":
          this.donations = this.donations
            .sort(this.pickUpDateComparer)
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
      this.sortBy(this.sortByMode);
    },
    inspectDonation(donation: Donation) {
      this.$router.push({
        name: "ManagerDonationInspect",
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

<style scoped lang="scss"></style>
