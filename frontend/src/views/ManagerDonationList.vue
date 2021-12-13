<template lang="pug">
b-container
  b-row.justify-content-center.my-5
    b-col(lg='6' md='8' cols='11')
      hr.shaded
      h4.text-center
        b(v-if="this.$store.state.session.userData.type == 'user'") YOUR DONATIONS
        b(v-else) DONATIONS
      hr.shaded
  b-row.justify-content-center
    b-col(lg='4' md='8' cols='11' order-md='1' order-lg='2' v-if='$store.getters.isUser')
      b-alert(show='show' v-if='$store.getters.isUser')
        b-row(align-v='center')
          b-col(cols='auto')
            h1
              Icon(bootstrap icon='info')
          b-col
            p.m-0
              | Here are listed all your active donations. You can inspect, modify, delete them in any moment or directly chat with a volunteer.
    b-col(lg='6' md='8' cols='11' order-md='2' order-lg='1')
      div.border.rounded.bg-light.p-2.mb-3
        b-row.m-1(no-gutters align-v="center")
          b-col()
            h5.m-0.p-0
              Icon.mr-1(fontawesome icon='filter') 
              span Filters
          b-col(cols="auto")
            b-button(variant='light' v-b-toggle.filters-collapse)
              Icon(fontawesome icon='cogs')
        
        b-collapse#filters-collapse
          b-row.ml-2.mb-2(no-gutters)
            b-col(cols='3')
              p Donation status:
            b-col
              FilterButtons(:filters='filters' :selected='3' @click='filterBy')
          b-row.ml-2(no-gutters)
            b-col(cols='3')
              p Sort by:
            b-col
              FilterButtons(:filters='sorters' :selected='$store.getters.isUser ? 1 : 6' @click='sortBy')
      
      p(v-if='donations.length == 0')
        span No donations found. Be sure to select valid filters 
        span(v-if='$store.getters.isUser')
          | or click 
          a(href='#' @click="$router.push({ name: 'ManagerDonationCreate' })") here
          |  to insert a donation
        span .
      b-card.mb-2(bg-variant='light' text-variant='dark' no-body='no-body' v-for='(donation, idx) in donations' :key='idx')
        template(#header)
          h5.mb-0
            b(v-if='$store.getters.isUser') Donated on {{ dates.formatDate(donation.creationDate) }}
            b(v-if='$store.getters.isVolunteer || $store.getters.isTrustedVolunteer') To be collected on {{ dates.formatDate(donation.pickUp.date) }}
            span.float-right
              b-badge(v-if="donation.status == 'waiting'" variant='warning') {{donation.status}}
              b-badge(v-if="donation.status == 'selected'" variant='success') {{donation.status}}
              b-badge(v-if="donation.status == 'retrieved'" variant='secondary') {{donation.status}}
        b-card-text
          .px-4.pt-3
            b-row
              b-col(cols='12' md='6' lg='6')
                .mb-2
                  p.mb-0 Food:
                  p.font-weight-bold.mb-0(v-for='(food, idx) in donation.foods' :key='idx') {{ food }}
                .mb-2
                  p.mb-0 Expires in:
                  p.font-weight-bold.mb-0 {{ dates.daysTillDate(donation.expirationDate) }} days
                div
                  p.mb-0 Location:
                  p.font-weight-bold
                    | {{ donation.address.street + &apos; &apos; + donation.address.civicNumber + &apos;, &apos; + donation.address.city }}
              b-col(cols='12' md='6' lg='6')
                .mb-2(v-if='hasUnreadMessages(donation._id)')
                  a(href='#') {{ unreadMessagesCount(donation._id) }} unread messages
                div(v-if="donation.status=='selected'")
                  .mb-2
                    p.mb-0 Pick up:
                    p.font-weight-bold {{ dates.formatDate(donation.pickUp.date) }}, {{ donation.pickUp.period }}
          b-button.footerCardButton.color3(block='block' variant='primary' @click='inspectDonation(donation)') SHOW
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";

import FilterButtons from "../components/FilterButtons.vue";
import Icon from "../components/Icon.vue";

import api from "../api/donation";
import { AxiosError, AxiosResponse } from "axios";

import { Donation, FindPayload } from "../types";

export default Vue.extend({
  name: "ManagerDonationList",
  components: {
    FilterButtons,
    Icon,
  },
  data: () => {
    return {
      donations: new Array<Donation>(),
      donationsBackup: new Array<Donation>(),
      sortByMode: "expirationDateAscending",
      filterByMode: "all",
      sorters: new Array<{
        name: string;
        label: string;
        icon: null | string;
        isVisible: boolean;
      }>(),
      filters: new Array<{
        name: string;
        label: string;
        icon: null | string;
        isVisible: boolean;
      }>(),
    };
  },
  created() {
    this.filters = [
      { name: "waiting", label: "Waiting", icon: null, isVisible: true },
      { name: "selected", label: "Selected", icon: null, isVisible: true },
      { name: "retrieved", label: "Retrieved", icon: null, isVisible: true },
      { name: "all", label: "All", icon: null, isVisible: true },
    ];

    this.sorters = [
      {
        name: "unreadMessages",
        label: "Unread Messages",
        icon: null,
        isVisible: true,
      },
      {
        name: "creationDateDescending",
        label: "Creation Date",
        icon: "sort-down",
        isVisible: true,
      },
      {
        name: "creationDateAscending",
        label: "Creation Date",
        icon: "sort-down-alt",
        isVisible: true,
      },
      {
        name: "expirationDateDescending",
        label: "Expiration Date",
        icon: "sort-down",
        isVisible: true,
      },
      {
        name: "expirationDateAscending",
        label: "Expiration Date",
        icon: "sort-down-alt",
        isVisible: true,
      },
      {
        name: "pickUpDateDescending",
        label: "Pick Up Date",
        icon: "sort-down",
        isVisible:
          this.$store.getters.isVolunteer ||
          this.$store.getters.isTrustedVolunteer,
      },
      {
        name: "pickUpDateAscending",
        label: "Pick Up Date",
        icon: "sort-down-alt",
        isVisible:
          this.$store.getters.isVolunteer ||
          this.$store.getters.isTrustedVolunteer,
      },
    ];

    if (this.$store.getters.isUserLogged) {
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
      return new Date(a.pickUp.date) < new Date(b.pickUp.date) ? -1 : 1;
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
    filterBy(statusFilter: string) {
      this.filterByMode = statusFilter;
      switch (statusFilter) {
        case "waiting":
        case "selected":
        case "retrieved":
          this.donations = this.donationsBackup.filter(
            (d: Donation) => d.status == statusFilter
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
