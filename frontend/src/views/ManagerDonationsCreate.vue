<template lang="pug">

b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col(lg=6, md=8, sm=10)
      div.mb-5
        hr.shaded
        h4.text-center
          b CREATE A DONATION
        hr.shaded
      b-alert(show).mb-5
        b-row(align-v="center")
          b-col(cols="auto")
            h1 
              b-icon(icon="info")
          b-col 
            p.m-0 Donate food to needing families. Follow 3 simple steps to gift a meal. Bring Me Food will retrieve your offer, handle the foods donated and provide food packs to registered families. 

      hr

      b-form(@submit.stop.prevent="submit")
        b-alert(show)
          b-row(align-v="center")
            b-col(cols="auto")
                h1 
                  b-badge(variant="light") 1
            b-col 
              p.m-0 Insert in the following forms the foods that you want to donate. We will pick it up and make good use of it. 

      
        InputList(
          title="Food list:",
          placeholder="Fusilli DeCecco, 4 packs, 250gg per pack",
          description="Do not worry too much about the format of the text you insert."
          :labelList="form.foods",
          v-on:data="(e) => { form.foods = e; }"
        )

      
        InputDate(
          title="Expiration date:",
          placeholder="Select a date",
          description="If you are donationg many goods, select a date matching the most deperishable food expiration date. Our volunteers will be sure to pick your donation in time."
          :date="form.expirationDate",
          required,
          v-on:data="(e) => { form.expirationDate = e; }"
        )

      
        InputTextarea(
          title="Additional information:",
          placeholder="Insert additional information here",
          :text="form.additionalInformation",
          v-on:data="(e) => { form.additionalInformation = e; }"
        )
        hr

        .mb-4

          b-alert(show)
            b-row(align-v="center")
              b-col(cols="auto")
                h1 
                  b-badge(variant="light") 2
              b-col 
                p.m-0 Select periods of the week when we can reach you to retrieve your donation. Our volunteers will be sure to pick your donation as soon as possible.

          div(
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
        
        b-alert(show)
          b-row(align-v="center")
            b-col(cols="auto")
              h1 
                b-badge(variant="light") 3
            b-col 
              p.m-0 Tell us where we can pick up your donation. Then, click on the button "Find in the map" found below to set a more precise location given the inserted address, this action will help us find you faster.

        InputAddress(
          :city="form.address.city",
          :street="form.address.street",
          :civic="form.address.civicNumber",
          @onAddressUpdate="onAddressUpdate")

        hr

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
import eventbus from "../eventbus";
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
      isLocationLoaded: false,
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
              });
            } else {
              eventbus.$emit(
                "successMessage",
                "Donation",
                "Donation created successfully."
              );
            }
            this.$router.push({ name: "ManagerDonationsList" });
          })
          .catch((e: AxiosError): void => {
            console.log(e);
            eventbus.$emit(
              "errorMessage",
              "Donation",
              "Unable to send the donation. Retry later or contact us if the problem persists."
            );
          });
      }
    },
    formChecks(): boolean {
      if (!this.form.pickUpPeriod.length || !this.form.expirationDate) {
        eventbus.$emit(
          "warningMessage",
          "Donation",
          "Select al least one day and period of the day when we can retrive your donation."
        );
        return false;
      }
      if (!this.form.foods.length) {
        eventbus.$emit(
          "warningMessage",
          "Donation",
          "Add at least one valid food to the donation."
        );
        return false;
      }
      return true;
    },
  },
});
</script>

<style scoped lang="scss"></style>
