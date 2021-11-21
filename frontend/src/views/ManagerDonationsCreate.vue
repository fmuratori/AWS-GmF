<template lang="pug">
b-container
  b-row.justify-content-center.my-5.no-gutters
    b-col(lg=8, md=10, sm=12)
      .mb-4
        h4
          p CREATE DONATION
      b-form(@submit.stop.prevent="submit")
        .mb-4
          InputList(
            title="Foods:",
            placeholder="Insert foods here",
            :labelList="form.foods",
            v-on:data="(e) => { form.foods = e; }"
          )

        .mb-4
          InputDate(
            title="Expiration date:",
            placeholder="Select a date",
            :date="form.expirationDate",
            required,
            v-on:data="(e) => { form.expirationDate = e; }"
          )

        .mb-4
          InputTextarea(
            title="Additional information:",
            placeholder="Insert additional information here",
            :text="form.additionalInformation",
            v-on:data="(e) => { form.additionalInformation = e; }"
          )
        hr

        .mb-4
          p.font-weight-bold.text-center Pick Up periods
          div.mb-1(
            v-for="(weekDayName, weekDay, idx) in weekDays",
            :index="idx"
          )
            b-form-group(:label="weekDayName", label-cols-sm="3", label-align-sm="right")
              b-button-group.d-flex
                b-button(
                  @click="weekDayButtonClick(weekDay, 'morning')",
                  :variant="computeButtonVariant(weekDay, 'morning')"
                ) Morning
                b-button(
                  @click="weekDayButtonClick(weekDay, 'afternoon')",
                  :variant="computeButtonVariant(weekDay, 'afternoon')"
                ) Afternoon
                b-button(
                  @click="weekDayButtonClick(weekDay, 'evening')",
                  :variant="computeButtonVariant(weekDay, 'evening')"
                ) Evening
        hr
        .mb-4
          InputAddress(
            title="Location",
            :city="form.address.city",
            :street="form.address.street",
            :civic="form.address.civicNumber",
            @onAddressUpdate="onAddressUpdate")
        hr
        
        //- .mb-4
        //-   InputAddress(
        //-     title="Location",
        //-     v-on:data="(e) => { form.address = e; }"
        //-   )

        b-row
          b-col
            b-button(
              block,
              variant="outline-danger",
              @click="$router.push({ name: 'Home' })",
              type="reset"
            ) Cancel
          b-col
            b-button(block, variant="outline-success", type="submit") {{ this.submitLabel }}
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import InputDate from "../components/input/InputDate.vue";
import InputList from "../components/input/InputList.vue";
import InputAddress from "../components/input/InputAddress.vue";
import InputTextarea from "../components/input/InputTextarea.vue";

import { Address, Donation } from "../types";

import api from "../api/donation";
import { CreateDonationView } from "../viewTypes";
import { AxiosResponse, AxiosError } from "axios";

export default Vue.extend({
  name: "ManagerDonationsCreate",
  components: {
    Navbar,
    Sidebar,
    InputDate,
    InputList,
    InputAddress,
    InputTextarea,
  },
  data: (): CreateDonationView => {
    return {
      weekDays: {
        lun: "Monday",
        mar: "Tuesday",
        mer: "Wednesday",
        gio: "Thursday",
        ven: "Friday",
        sab: "Saturday",
        dom: "Sunday",
      },
      form: {
        userId: "",
        foods: new Array<string>(),
        expirationDate: "",
        address: {
          city: "",
          street: "",
          civicNumber: "",
          coordinates: {
            x: 0,
            y: 0,
          },
        } as Address,
        additionalInformation: "",
        pickUpPeriod: new Array<{ weekDay: string; period: string }>(),
      } as Donation,
      submitLabel: "Create",
      isLocationLoaded: false
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      this.form.userId = this.$store.state.session.userData._id;
      this.form.address = this.$store.state.session.userData.address;

      if ("donation" in this.$route.params) {
        this.form = JSON.parse(this.$route.params.donation) as Donation;
        //ccreate an empty textbox
        this.submitLabel = "Edit";
      }
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    onAddressUpdate(address: Address) {
      this.form.address = address;
    },
    onReset() {
      this.isLocationLoaded = false;
      this.form.address = null;
    },
    computeButtonVariant(weekDay: string, period: string) {
      const idx: number = this.form.pickUpPeriod.findIndex(
        (wd: { weekDay: string; period: string }) =>
          wd.weekDay == weekDay && wd.period == period
      );
      return idx != -1 ? "dark" : "outline-dark";
    },
    weekDayButtonClick(weekDay: string, period: string) {
      const idx: number = this.form.pickUpPeriod.findIndex(
        (wd: { weekDay: string; period: string }) =>
          wd.weekDay == weekDay && wd.period == period
      );

      if (idx != -1) {
        this.form.pickUpPeriod.splice(idx, 1);
      } else {
        this.form.pickUpPeriod.push({ weekDay, period });
      }
    },
    submit() {
      var fun;
      if ("donation" in this.$route.params) fun = api.editDonation;
      else fun = api.addDonation;

      if (this.formChecks()) {
        fun(this.form)
          .then((r: AxiosResponse) => {
            if (r.status == 200 && "donation" in this.$route.params) {
              this.$store.dispatch("sendMessage", {
                donationId: this.form._id,
                message: "Donation modified by the owner.",
                isEventMessage: true,
              })
            } else {
              this.$root.$bvToast.toast(`Donation created successfully.`, {
                title: "Donation",
                autoHideDelay: 5000,
                variant: "success",
                appendToast: false,
              });
            }
            this.$router.push({ name: "ManagerDonationsList" });
          })
          .catch((e: AxiosError): void => {
            console.log(e);
            this.$root.$bvToast.toast(
              `Unable to send the donation. Retry later or contact us if the problem persists.`,
              {
                title: "Donation",
                autoHideDelay: 5000,
                variant: "danger",
                appendToast: false,
              }
            );
          });
      }
    },
    formChecks(): boolean {
      if (!this.form.pickUpPeriod.length || !this.form.expirationDate) {
        this.$root.$bvToast.toast(
          `Select al least one day and period of the day when we can retrive your donation.`,
          {
            title: "Donation",
            autoHideDelay: 5000,
            variant: "warning",
            appendToast: false,
          }
        );
        return false;
      }
      if (!this.form.foods.length) {
        this.$root.$bvToast.toast(
          `Add at least one valid food to the donation.`,
          {
            title: "Donation",
            autoHideDelay: 5000,
            variant: "warning",
            appendToast: false,
          }
        );
        return false;
      }
      return true;
    },
  },
});
</script>

<style scoped lang="scss"></style>
