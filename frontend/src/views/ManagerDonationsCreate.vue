<template lang="pug">
b-container
  b-row.justify-content-center.my-5.no-gutters
    b-col(lg=8, md=10, sm=12)
      .mb-4
        h4
          p CREATE DONATION
      b-form(@submit="submit")
        .mb-4
          InputList(
            title="Foods:",
            placeholder="Insert foods here",
            v-on:data="(e) => { form.foods = e; }"
          )

        .mb-4
          InputDate(
            title="Donation expiration date:",
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

        .mb-4
          p.font-weight-bold.text-center Periodo ritiro
          b-row.mb-1(
            v-for="(weekDayName, weekDay, idx) in weekDays",
            :index="idx"
          )
            b-col(cols="2")
              label {{ weekDayName }}
            b-col(cols="10")
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
import InputTextarea from "../components/input/InputTextarea.vue";

import { Address, DonationCreationPayload } from "../types";

import api from "../api/donation";
import { CreatedonationView } from "../viewTypes";
import { AxiosError } from "axios";

export default Vue.extend({
  name: "ManagerDonationsCreate",
  components: {
    Navbar,
    Sidebar,
    InputDate,
    InputList,
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
      this.form.userId = this.$store.state.session.userData._id;
      this.form.address = this.$store.state.session.userData.address;

      if ("donation" in this.$route.params) {
        this.form = this.$route.params
          .donation as unknown as DonationCreationPayload;
        this.form.foods.push("");
        this.submitLabel = "Edit";
      }
    } else this.$router.push({ name: "Login" });
  },
  methods: {
    computeButtonVariant(weekDay: string, period: string) {
      const idx: number = this.form.pickUpPeriod.findIndex(
        (wd: { weekDay: string; period: string }) =>
          wd.weekDay == weekDay && wd.period == period
      );
      return idx != -1 ? "dark" : "outline-secondary";
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
          .then(() => {
            this.$router.push({ name: "ManagerDonationsList" });
            this.$bvToast.toast(`Donazione effettuata con successo.`, {
              title: "Donazione",
              autoHideDelay: 5000,
              variant: "success",
              appendToast: false,
            });
          })
          .catch((e: AxiosError): void => {
            console.log(e);
            this.$bvToast.toast(
              `Impossibile inviare la donazione. Riprova più tardi oppure contattaci se il problema persiste.`,
              {
                title: "Donazione",
                autoHideDelay: 5000,
                variant: "danger",
                appendToast: false,
              }
            );
          });
      }
    },
    formChecks() {
      if (!this.form.pickUpPeriod.length) {
        this.$bvToast.toast(
          `Selezionare almeno un periodo della settimana in cui sei disponibile per il ritiro degli alimenti donati.`,
          {
            title: "Donazione",
            autoHideDelay: 5000,
            variant: "warning",
            appendToast: false,
          }
        );
        return false;
      }
      if (!(this.form.foods.length - 1)) {
        this.$bvToast.toast(`Inserire almeno un alimento che vuoi donare.`, {
          title: "Donazione",
          autoHideDelay: 5000,
          variant: "warning",
          appendToast: false,
        });
        return false;
      }
      return true;
    },
  },
});
</script>

<style scoped lang="scss"></style>
