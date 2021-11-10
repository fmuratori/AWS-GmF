<template lang="pug">
b-row.justify-content-md-center.my-5.no-gutters
  b-col(cols="6")
    p CREATE AN EVENT
    b-form(@submit="createEvent")
      .mb4
        InputText(
          title="Title:",
          placeholder="Insert title here",
          :text="form.eventTitle",
          required,
          v-on:data="(e) => { form.eventTitle = e; }"
        )

      .mb-4
        InputTextarea(
          title="Description:",
          placeholder="Insert description here",
          :text="form.description",
          v-on:data="(e) => { form.description = e; }"
        )

      .mb-4
        InputDate(
          title="Date:",
          placeholder="Select a date",
          :date="form.date",
          required,
          v-on:data="(e) => { form.date = e; }"
        )

      .mb-3
        InputAddress(
          title="Location",
          :city="form.address.city",
          :street="form.address.street",
          :civic="form.address.civicNumber",
          v-on:city="(e) => { form.address.city = e; }",
          v-on:street="(e) => { form.address.street = e; }",
          v-on:civic="(e) => { form.address.civicNumber = e; }"
        )

      b-row
        b-col
          b-button(block, variant="outline-danger", @click="cancel") Cancel
        b-col
          b-button(block, variant="success", type="submit") {{ this.submitLabel }}
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import InputText from "../components/InputText.vue";
import InputTextarea from "../components/InputTextarea.vue";
import InputAddress from "../components/InputAddress.vue";
import InputDate from "../components/InputDate.vue";

import { Address, EventPayload } from "../types";

import api from "../api";

export default Vue.extend({
  name: "ManagerEventCreate",
  components: {
    Navbar,
    Sidebar,
    InputText,
    InputTextarea,
    InputAddress,
    InputDate,
  },
  data: function () {
    return {
      form: {
        id: null,
        ownerVolunteerId: "",
        eventTitle: "",
        description: "",
        date: null,
        image: "",
        address: {
          city: "",
          street: "",
          civicNumber: "",
          coordinates: {
            x: 0,
            y: 0,
          },
        } as Address,
      } as EventPayload,
      cancelRoute: "ManagerHome",
      submitLabel: "Create",
    };
  },
  created() {
    this.$store.dispatch("showSidebar");
    this.form.ownerVolunteerId = this.$store.state.session.userData._id;

    // check if user is logged in
    if (!this.$store.getters.isUserLogged)
      this.$router.replace({ name: "Login" });
    if ("event" in this.$route.params) {
      this.form = this.$route.params.event;
      this.form.id = this.$route.params.event._id;
      this.cancelRoute = "ManagerEvents";
      this.submitLabel = "Edit";
      //TODO carico i dati
    }
  },
  methods: {
    createEvent(event) {
      event.preventDefault();

      var fun;
      if ("event" in this.$route.params) fun = api.editEvent;
      else fun = api.createEvent;

      fun(this.form)
        .then((r) => {
          console.log(r);
          this.$router.replace({ name: "ManagerEvents" });
          this.$bvToast.toast(`Event successfully created.`, {
            title: "Event",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
        })
        .catch((e) => {
          this.$bvToast.toast(
            `Unable to create the event. Retry later or contact us if the problem persist.`,
            {
              title: "Event",
              autoHideDelay: 5000,
              variant: "danger",
              appendToast: false,
            }
          );
        });
    },
    cancel() {
      this.$router.replace({ name: this.cancelRoute });
    },
    tmp(e) {
      console.log(e);
      this.date = e;
      console.log("date: " + this.date);
    },
  },
});
</script>

<style scoped lang="scss"></style>
