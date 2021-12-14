<template lang="pug">
b-container.mb-5
  b-row.justify-content-center.my-5
    b-col(lg='6' md='8' cols='11')
      hr.shaded
      h4.text-center
        b REPORT A FAMILY
      hr.shaded
  b-row.justify-content-center
    b-col(lg='6' md='8' cols='11')
      b-alert(show='show')
        b-row(align-v='center')
          b-col(cols='auto')
            h1
              Icon(bootstrap icon='info')
          b-col
            p.m-0
              | Help us find families in need. We will verify your report and convert donors donations into food packs to deliver.
      hr
      b-form(@submit.stop.prevent='submit')
        b-alert(show='show')
          b-row(align-v='center')
            b-col(cols='auto')
              h1
                b-badge(variant='light') 1
            b-col
              p.m-0
                | Tell us as much as possible about a family you think may be in need of help. Your informations will be validated by trusted volunteers.
        InputText(title='Family name:' placeholder='Insert family name here' :text='form.name' required @data='(e) => { form.name = e; }')
        InputText(title='Phone number:' placeholder='Insert a phone number for the verification' :text='form.phoneNumber' required @data='(e) => { form.phoneNumber = e; }')
        InputText(title='Components:' placeholder='Insert number of family components' type='number' :text='form.components' required @data='(e) => { form.components = e; }')
        hr
        b-alert(show='show')
          b-row(align-v='center')
            b-col(cols='auto')
              h1
                b-badge(variant='light') 2
            b-col
              p.m-0
                span
                  | Tell us where we can find the family. All the food packs we make with your and other people donations will be delivered here. Do not worry if the position is not correct, we will verifiy it directly.
        InputAddress(:city='form.address.city' :civic='form.address.civicNumber' :street='form.address.street' :x='form.address.coordinates.x' :y='form.address.coordinates.y' @data='(e) => { form.address = e; }')
        hr
        b-row
          b-col
            b-button(block='block' variant='secondary' @click="$router.push({ name: 'ManagerFamilyList' })") Cancel
          b-col
            b-button.color3(block='block' type='submit') {{ submitLabel }}
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";

import InputText from "../components/input/InputText.vue";
import InputAddress from "../components/input/InputAddress.vue";
import Icon from "../components/Icon.vue";

import { Address, Family } from "../types/types";
import { ManagerFamilySubscribeView } from "../types/viewTypes";

import api from "../api/family";

export default Vue.extend({
  name: "ManagerFamilySubscribe",
  components: {
    InputText,
    InputAddress,
    Icon,
  },
  data: (): ManagerFamilySubscribeView => {
    return {
      form: {
        reporterId: "",
        name: "",
        phoneNumber: "",
        components: 0,
        address: {
          city: "",
          street: "",
          civicNumber: "",
          coordinates: {
            x: 0,
            y: 0,
          },
        } as Address,
      } as Family,
      submitLabel: "Report",
    };
  },
  created() {
    if ("family" in this.$route.params) {
      this.form = this.$route.params.family as Family; //as unknown 
      this.submitLabel = "Edit";
    }
    this.form.reporterId = this.$store.state.session.userData._id;
  },
  methods: {
    onAddressUpdate(address: Address): void {
      this.form.address = address;
    },
    submit(): void {
      var fun = "family" in this.$route.params ? api.editFamily : api.addFamily;

      eventbus.$emit(
        "startLoading",
        "family" in this.$route.params
          ? "Updating family data"
          : "Adding new family to our database"
      );

      fun(this.form)
        .then((): void => {
          this.$router.push({ name: "ManagerFamilyList" });
          eventbus.$emit(
            "successMessage",
            "Events",
            "Family registration request received succesfully. In a later date we will validate your request."
          );
        })
        .catch((): void => {
          eventbus.$emit(
            "errorMessage",
            "Events",
            "Unable to submit the family registration request. Retry later or contact us if the problem persists."
          );
        })
        .then(() => {
          eventbus.$emit("stopLoading");
        });
    },
  },
});
</script>

<style scoped lang="scss"></style>
