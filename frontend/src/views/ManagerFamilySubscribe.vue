<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col(lg=6, md=8, sm=10)
      div.mb-5
        hr.shaded
        h4.text-center
          b REPORT A FAMILY
        hr.shaded
      b-alert(show).mb-5
        b-row(align-v="center")
          b-col(cols="auto")
            h1 
              b-icon(icon="info")
          b-col 
            p.m-0 Help us find families in need. We will verify your report and convert donors donations into food packs to deliver.    

      hr

      b-form(@submit.stop.prevent="submit")

        b-alert(show)
          b-row(align-v="center")
            b-col(cols="auto")
              h1 
                b-badge(variant="light") 1
            b-col 
              p.m-0 Tell us as much as possible about a family you think may be in need of help. Your informations will be validated by trusted volunteers. 

        InputText(
            title="Family name:",
            placeholder="Insert family name here",
            :text="form.name",
            required,
            v-on:data="(e) => { form.name = e; }"
          )

        InputText(
            title="Phone number:",
            placeholder="Insert a phone number for the verification",
            :text="form.phoneNumber",
            required,
            v-on:data="(e) => { form.phoneNumber = e; }"
          )

        InputText(
            title="Components:",
            placeholder="Insert number of family components",
            type="number",
            :text="form.components",
            required,
            v-on:data="(e) => { form.components = e; }"
          )

        hr 

        b-alert(show)
          b-row(align-v="center")
            b-col(cols="auto")
              h1 
                b-badge(variant="light") 2
            b-col 
              p.m-0 
                b [Optional] 
                span Tell us where we can find the family. All the food packs we make with your and other people donations will be delivered here. Do not worry if the position is not correct, we will verifiy it directly.

        
        InputAddress(
          :city="form.address.city",
          :civic="form.address.civicNumber",
          :street="form.address.street",
          v-on:data="(e) => { form.address = e; }"
        )

        hr 
        
        b-row
          b-col
            b-button(
              block,
              variant="outline-danger",
              @click="$router.push({ name: 'ManagerFamilyList' })"
            ) Cancel
          b-col
            b-button(block, variant="outline-success", type="submit") {{ submitLabel }}
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import InputText from "../components/input/InputText.vue";
import InputAddress from "../components/input/InputAddress.vue";

import { Address, FamilyPayload } from "../types";

import api from "../api/family";
import { ReportFamilyView } from "../viewTypes";

export default Vue.extend({
  name: "ManagerFamilySubscribe",
  components: {
    Navbar,
    Sidebar,
    InputText,
    InputAddress,
  },
  data: (): ReportFamilyView => {
    return {
      form: {
        reporterId: "",
        name: "",
        phoneNumber: "",
        // components: new Number(),
        address: {
          city: "",
          street: "",
          civicNumber: "",
          coordinates: {
            x: 0,
            y: 0,
          },
        } as Address,
      } as FamilyPayload,
      submitLabel: "Report",
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      if ("family" in this.$route.params) {
        this.form = this.$route.params.family as unknown as FamilyPayload;
        this.submitLabel = "Edit";
      }
      this.form.reporterId = this.$store.state.session.userData._id;
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    onAddressUpdate(address: Address): void {
      this.form.address = address;
    },
    submit(): void {
      var fun;
      if ("family" in this.$route.params) fun = api.editFamily;
      else fun = api.addFamily;

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
        });
    },
  },
});
</script>

<style scoped lang="scss"></style>
