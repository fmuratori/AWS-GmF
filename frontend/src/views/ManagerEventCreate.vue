<template lang="pug">
b-container
  b-row.justify-content-md-center.my-5.no-gutters
    b-col(lg=8, md=10, sm=12)
      hr.sidebar-hr.my-3
      h4.text-center.mb-4
        b CREATE AN EVENT
      hr.sidebar-hr.my-3

      b-form(@submit.stop.prevent="createEvent")
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

        .mb-4
          InputAddress(
            title="Location:",
            :city="form.address.city",
            :street="form.address.street",
            :civic="form.address.civicNumber",
            v-on:data="(e) => { form.address = e; }"
          )

        b-row
          b-col
            b-button(
              block,
              variant="outline-danger",
              @click="$router.push({ name: 'ManagerEvents' })"
            ) Cancel
          b-col
            b-button(block, variant="success", type="submit") {{ this.submitLabel }}
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import InputText from "../components/input/InputText.vue";
import InputTextarea from "../components/input/InputTextarea.vue";
import InputAddress from "../components/input/InputAddress.vue";
import InputDate from "../components/input/InputDate.vue";

import { Address, EventPayload } from "../types";
import { CreateEventView } from "../viewTypes";

import api from "../api/event";

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
  data: (): CreateEventView => {
    return {
      form: {
        _id: null,
        ownerVolunteerId: "",
        eventTitle: "",
        description: "",
        image: null,
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
      submitLabel: "Create",
    };
  },
  created() {
    this.form.ownerVolunteerId = this.$store.state.session.userData._id;

    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      if ("event" in this.$route.params) {
        this.form = this.$route.params.event as unknown as EventPayload;
        this.submitLabel = "Edit";
      }
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    createEvent(): void {
      var fun;
      if ("event" in this.$route.params) fun = api.editEvent;
      else fun = api.createEvent;

      fun(this.form)
        .then((): void => {
          this.$router.push({ name: "ManagerEvents" });
          eventbus.$emit(
            "successMessage",
            "Events",
            "Event created succesfully."
          );
        })
        .catch((): void => {
          eventbus.$emit(
            "errorMessage",
            "Events",
            "Unable to create the event. Retry later or contact us if the problem persists."
          );
        });
    },
  },
});
</script>

<style scoped lang="scss"></style>
