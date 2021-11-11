<template lang="pug">
b-row.justify-content-center.my-5(no-gutters)
  b-col(md=6, sm=8, cols=10)
    p CREA UNA DONAZIONE
    b-form(@submit="submit")
      b-card.mb-2(bg-variant="light")
        .mb-4
          b-form-group#input-group-1(label="Alimenti:", label-for="input-1") 
            b-input-group.mb-1(v-for="(value, idx) in form.foods", :key="idx")
              b-form-input#input-1.my-no-right-border(
                type="text",
                placeholder="pacco di pasta da 250gg",
                @input="foodInputValueChange(idx)",
                v-model="form.foods[idx]"
              )
              b-input-group-append
                b-button.my-no-left-border(
                  variant="danger",
                  @click="foodDeleteClicked(idx)",
                  :disabled="form.foods[idx] == ''"
                ) 
                  span Cancella
                  b-icon(icon="x", aria-hidden="true")

        .mb-4
          b-form-group#input-group-2(
            label="Data scadenza donazione:",
            label-for="input-2"
          )
            b-input-group
              b-form-datepicker#input-2.my-no-right-border(
                required,
                v-model="form.expirationDate",
                reset-button,
                close-button
              )
              b-input-group-append
                b-button.my-no-left-border(
                  variant="danger",
                  @click="form.expirationDate = null",
                  :disabled="form.expirationDate == null"
                ) 
                  span Cancella
                  b-icon(icon="x", aria-hidden="true")

        .mb-4
          b-form-group#input-group-6(
            label="Informazioni aggiuntive:",
            label-for="input-6"
          )
            b-form-textarea#input-6(
              rows="3",
              max-rows="6",
              v-model="form.additionalInformation"
            )
        div
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
                ) Mattino
                b-button(
                  @click="weekDayButtonClick(weekDay, 'afternoon')",
                  :variant="computeButtonVariant(weekDay, 'afternoon')"
                ) Pomeriggio
                b-button(
                  @click="weekDayButtonClick(weekDay, 'evening')",
                  :variant="computeButtonVariant(weekDay, 'evening')"
                ) Sera

      b-button(block, variant="outline-success", type="submit") Procedi
      b-button(
        block,
        variant="outline-danger",
        @click="$router.replace({ name: 'ManagerHome' })",
        type="reset"
      ) Annulla
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import { Donation, Address } from "../types";

import donationApi from "../api/donation";

export default Vue.extend({
  name: "ManagerDonationsCreate",
  components: {
    Navbar,
    Sidebar,
  },
  data: function () {
    return {
      weekDays: {
        lun: "Lunedì",
        mar: "Martedì",
        mer: "Mercoledì",
        gio: "Giovedì",
        ven: "Venerdì",
        sab: "Sabato",
        dom: "Domenica",
      },
      form: {
        userId: "",
        foods: [""],
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
      mode: "",
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
        this.form = JSON.parse(this.$route.params.donation);
        this.form.foods.push("");
        this.mode = "edit";
      } else {
        this.mode = "create";
      }
    } else {
      this.$router.replace({ name: "Login" });
    }
  },
  methods: {
    computeButtonVariant(weekDay: string, period: string) {
      const idx: number = this.form.pickUpPeriod.findIndex(
        (wd: { weekDay: string; period: string }) =>
          wd.weekDay == weekDay && wd.period == period
      );
      return idx != -1 ? "dark" : "outline-secondary";
    },
    foodInputValueChange(inputIdx: number) {
      if (inputIdx == this.form.foods.length - 1) {
        this.form.foods.push("");
      } else if (this.form.foods[inputIdx] == "") {
        this.foodDeleteClicked(inputIdx);
      }
    },
    foodDeleteClicked(inputIdx: number) {
      this.form.foods.splice(inputIdx, 1);
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
      this.mode == "edit" ? this.editDonation(event) : this.addDonation(event);
    },
    editDonation(event) {
      event.preventDefault();
      if (this.formChecks()) {
        this.form.foods.pop();
        donationApi
          .editDonation(this.form)
          .then(() => {
            this.$router.replace({ name: "ManagerDonationsList" });
            this.$bvToast.toast(
              `Modifica della donazione effettuata con successo.`,
              {
                title: "Donazione",
                autoHideDelay: 5000,
                variant: "success",
                appendToast: false,
              }
            );
          })
          .catch(() => {
            this.$bvToast.toast(
              `Impossibile modificare la donazione. Riprova più tardi oppure contattaci se il problema persiste.`,
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
    addDonation(event) {
      event.preventDefault();
      if (this.formChecks()) {
        // removes empty string element
        this.form.foods.pop();

        donationApi
          .addDonation(this.form)
          .then(() => {
            this.$router.replace({ name: "ManagerDonationsList" });
            this.$bvToast.toast(`Donazione effettuata con successo.`, {
              title: "Donazione",
              autoHideDelay: 5000,
              variant: "success",
              appendToast: false,
            });
          })
          .catch(() => {
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
