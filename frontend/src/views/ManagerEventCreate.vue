<template lang="pug">
b-row.justify-content-md-center.my-5.no-gutters
  b-col(cols="6")
    p CREATE AN EVENT
    b-form(@submit="createEvent")
      b-form-group#input-group-1(label="Title:", label-for="input-1")
        b-form-input#input-1(
          required,
          type="text",
          placeholder="Insert title here",
          v-model="form.eventTitle"
        )

      .mb-4
        b-form-group#input-group-2(label="Description:", label-for="input-2")
          b-form-textarea#input-2(
            rows="3",
            max-rows="6",
            v-model="form.description",
            placeholder="Insert description here"
          )

      .mb-4
      b-form-group#input-group-3(label="Date:", label-for="input-3", required)
        b-input-group
          b-form-datepicker#input-3.my-no-right-border(
            required,
            v-model="form.date",
            reset-button,
            close-button
          )
          b-input-group-append
            b-button.my-no-left-border(
              variant="danger",
              @click="form.date = null",
              :disabled="form.date == null"
            ) 
              span Cancel
              b-icon(icon="x", aria-hidden="true")

      .mb-3
        label Location:
        b-card
          b-row
            b-col
              b-form-group#input-group-3(label="City:", label-for="input-4")
                b-form-input#input-4(
                  required,
                  type="text",
                  v-model="form.address.city"
                )
          b-row
            b-col(cols=8)
              b-form-group#input-group-5(label="Address:", label-for="input-5")
                b-form-input#input-5(
                  required,
                  type="text",
                  v-model="form.address.street"
                )
            b-col(cols=4)
              b-form-group#input-group-6(
                label="Civic number:",
                label-for="input-6"
              )
                b-form-input#input-6(
                  required,
                  type="text",
                  v-model="form.address.civicNumber"
                )
          .text-center
            b-button(variant="outline-secondary") Find on maps

      b-row
        b-col
          b-button(
            block,
            variant="outline-danger",
            @click="cancel"
          ) Cancel
        b-col
          b-button(
            block,
            variant="success",
            type="submit"
          ) {{this.submitLabel}}
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import { Address, EventPayload } from "../types";

import api from "../api";

export default Vue.extend({
  name: "ManagerEventCreate",
  components: {
    Navbar,
    Sidebar,
  },
  data: function () {
    return {
      form: {
        id: null,
        ownerVolunteerId: "",
        eventTitle: "",
        description: "",
        date: new Date(),
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
      submitLabel: "Create"
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
      this.form.id = this.$route.params.event._id
      this.cancelRoute = "ManagerEvents"
      this.submitLabel = "Edit"
      //TODO carico i dati
    }
  },
  methods: {
    createEvent(event) {
      event.preventDefault();

      var fun
      if ("event" in this.$route.params) fun = api.editEvent 
      else fun = api.createEvent

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
    cancel(){
      this.$router.replace({ name: this.cancelRoute })
    }
  },
});
</script>

<style scoped lang="scss"></style>
