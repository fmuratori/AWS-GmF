<template lang="pug">
b-container
  b-row.justify-content-center.my-5.no-gutters
    b-col(lg=6, md=10, sm=12)
    
          h4.mb-5.text-center CREATE A DONATION
          b-form(@submit="submit")
            .mb-4
              InputList(
                title="Foods:",
                placeholder="Insert foods here",
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
            //- .mb-4
            //-   p.font-weight-bold.text-center Pick Up periods
            //-   b-row.mb-1(
            //-     v-for="(weekDayName, weekDay, idx) in weekDays",
            //-     :index="idx"
            //-   )
            //-     b-col(lg="3" md="3" sm="12")
            //-       label {{ weekDayName }}
            //-     b-col(lg="9" md="9" sm="12")
            //-       b-button-group.d-flex
            //-         b-button(
            //-           @click="weekDayButtonClick(weekDay, 'morning')",
            //-           :variant="computeButtonVariant(weekDay, 'morning')"
            //-         ) Morning
            //-         b-button(
            //-           @click="weekDayButtonClick(weekDay, 'afternoon')",
            //-           :variant="computeButtonVariant(weekDay, 'afternoon')"
            //-         ) Afternoon
            //-         b-button(
            //-           @click="weekDayButtonClick(weekDay, 'evening')",
            //-           :variant="computeButtonVariant(weekDay, 'evening')"
            //-         ) Evening

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
                  @click="$router.replace({ name: 'Home' })",
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

import { Address, DonationCreationPayload } from "../types";

import api from "../api/donation";
import { CreatedonationView } from "../viewTypes";
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
  data: (): CreatedonationView => {
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
      } as DonationCreationPayload,
      submitLabel: "Create",
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
        this.form = this.$route.params
          .donation as unknown as DonationCreationPayload;
        //ccreate an empty textbox
        this.form.foods.push("");
        this.submitLabel = "Edit";
      }
    } else this.$router.replace({ name: "Login" });
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
    submit(event) {
      event.preventDefault();

      var fun;
      if ("donation" in this.$route.params) fun = api.editDonation;
      else fun = api.addDonation;

      if (this.formChecks()) {
        fun(this.form)
          .then((r: AxiosResponse) => {
            if (r.status == 200) {
              this.$store.dispatch("sendMessage", {
                donationId: this.donation._id,
                message: "Donation modified by the owner.",
                isEventMessage: true,
              })
              this.$router.replace({ name: "ManagerDonationsUserList" });
              this.$root.$bvToast.toast(`Donation successfully elaborated.`, {
                title: "Donation",
                autoHideDelay: 5000,
                variant: "success",
                appendToast: false,
              });
            }
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
      if (!this.form.pickUpPeriod.length) {
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
