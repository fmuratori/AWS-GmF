<template lang="pug">
b-container.mb-5
  b-row.justify-content-center.my-5
    b-col(lg='6' md='8' cols='11')
      hr.shaded
      h4.text-center
        b CREATE A DONATION
      hr.shaded
  
  b-row.justify-content-center
    b-col(lg='6' md='8' sm='10')
      b-alert(show='show')
        b-row(align-v='center')
          b-col(cols='auto')
            h1
              Icon(bootstrap icon='info')
          b-col
            p.m-0
              | Donate food to needing families. Follow 3 simple steps to gift a meal. Bring Me Food will retrieve your offer, handle the foods donated and provide food packs to registered families.
      hr
      b-form(@submit.stop.prevent='submit')
        b-alert(show='show')
          b-row(align-v='center')
            b-col(cols='auto')
              h1
                b-badge(variant='light') 1
            b-col
              p.m-0
                | Insert in the following forms the foods that you want to donate. We will pick it up and make good use of it.
        InputList(title='Food list:' placeholder='Fusilli DeCecco, 4 packs, 250gg per pack' description='Do not worry too much about the format of the text you insert.' :labelList='form.foods' @data='(e) => { form.foods = e; }')
        InputDate(title='Expiration date:' placeholder='Select a date' description='If you are donationg many goods, select a date matching the most deperishable food expiration date. Our volunteers will be sure to pick your donation in time.' :date='form.expirationDate' required @data='(e) => { form.expirationDate = e; }')
        InputTextarea(title='Additional information:' placeholder='Insert additional information here' :text='form.additionalInformations' @data='(e) => { form.additionalInformations = e; }')
        hr
        .mb-4
          b-alert(show='show')
            b-row(align-v='center')
              b-col(cols='auto')
                h1
                  b-badge(variant='light') 2
              b-col
                p.m-0
                  | Select periods of the week when we can reach you to retrieve your donation. Our volunteers will be sure to pick your donation as soon as possible.
          div(v-for='(weekDayName, weekDay, idx) in constants.weekDays' :index='idx')
            b-form-group(:label='weekDayName' label-cols-sm='3' label-align-sm='right')
              b-button-group.d-flex
                b-button(@click="weekDayButtonClick(weekDay, 'morning')" :variant="computeButtonVariant(weekDay, 'morning')") Morning
                b-button(@click="weekDayButtonClick(weekDay, 'afternoon')" :variant="computeButtonVariant(weekDay, 'afternoon')") Afternoon
                b-button(@click="weekDayButtonClick(weekDay, 'evening')" :variant="computeButtonVariant(weekDay, 'evening')") Evening
        hr
        b-alert(show='show')
          b-row(align-v='center')
            b-col(cols='auto')
              h1
                b-badge(variant='light') 3
            b-col
              p.m-0
                | Tell us where we can pick up your donation. Then, click on the button &quot;Find in the map&quot; found below to set a more precise location given the inserted address, this action will help us find you faster.
        InputAddress(:city='form.address.city' :street='form.address.street' :civic='form.address.civicNumber' :x='form.address.coordinates.x' :y='form.address.coordinates.y' @data='onAddressUpdate')
        hr
        b-row
          b-col
            b-button(block='block' variant='secondary' @click="$router.push({ name: 'Home' })" type='reset') Cancel
          b-col
            b-button.color3(block='block' type='submit') {{ this.submitLabel }}

</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";

import InputDate from "../components/input/InputDate.vue";
import InputList from "../components/input/InputList.vue";
import InputAddress from "../components/input/InputAddress.vue";
import InputTextarea from "../components/input/InputTextarea.vue";
import Loading from "../components/Loading.vue";
import Icon from "../components/Icon.vue";

import { Address, Donation } from "../types";
import { CreateDonationView } from "../viewTypes";

import api from "../api/donation";
import { AxiosResponse, AxiosError } from "axios";

export default Vue.extend({
  name: "ManagerDonationCreate",
  components: {
    InputDate,
    InputList,
    InputAddress,
    InputTextarea,
    Loading,
    Icon,
  },
  data: (): CreateDonationView => {
    return {
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
        additionalInformations: "",
        pickUpPeriod: new Array<{ weekDay: string; period: string }>(),
      } as Donation,
      submitLabel: "Create",
      isLocationLoaded: false,
    };
  },
  created() {
    if (this.$store.getters.isUserLogged && this.$store.getters.isUser) {
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
      this.form.address = {} as Address;
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
      var fun =
        "donation" in this.$route.params ? api.editDonation : api.addDonation;

      if (this.formChecks()) {
        eventbus.$emit(
          "startLoading",
          "donation" in this.$route.params
            ? "Creating a new donation"
            : "Updating your donation"
        );

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
            this.$router.push({ name: "ManagerDonationList" });
          })
          .catch((e: AxiosError): void => {
            console.log(e);
            eventbus.$emit(
              "errorMessage",
              "Donation",
              "Unable to send the donation. Retry later or contact us if the problem persists."
            );
          })
          .then(() => {
            eventbus.$emit("stopLoading");
          });
      }
    },
    formChecks(): boolean {
      if (!this.form.foods.length) {
        eventbus.$emit(
          "warningMessage",
          "Donation",
          "Add at least one valid food to the donation."
        );
        return false;
      }
      if (!this.form.expirationDate) {
        eventbus.$emit(
          "warningMessage",
          "Donation",
          "Select a valid expiration date. Our volunteers will surely pick your donation in time."
        );
        return false;
      }
      if (!this.form.pickUpPeriod.length) {
        eventbus.$emit(
          "warningMessage",
          "Donation",
          "Select al least one period of the day when we can retrive your donation."
        );
        return false;
      }
      return true;
    },
  },
});
</script>

<style scoped lang="scss"></style>
