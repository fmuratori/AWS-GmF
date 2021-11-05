<template lang="pug">
  b-row(class="justify-content-center my-5" no-gutters)
    b-col(xl=5 lg=5 md=6 sm=8 cols=10)
      p CREA UNA DONAZIONE
      b-card(bg-variant="light" class="mb-2")
        b-form(@submit="addDonation")
          div(class="mb-4")
            b-form-group(id="input-group-1" label="Alimenti:" label-for="input-1") 
              b-input-group(v-for="(value, idx) in form.foods" :key="idx" class="mb-1")
                b-form-input(id="input-1" type="text" placeholder="pacco di pasta da 250gg" class="my-no-right-border" 
                @input="foodInputValueChange(idx)" v-model="form.foods[idx]")
                b-input-group-append
                  b-button(variant="danger" class="my-no-left-border" @click="foodDeleteClicked(idx)"
                  :disabled="form.foods[idx] == ''") 
                    span Cancella
                    b-icon(icon="x" aria-hidden="true")

          div(class="mb-4")
            b-form-group(id="input-group-2" label="Data scadenza donazione:" label-for="input-2")
              b-input-group
                b-form-datepicker(id="input-2" required v-model="form.expirationDate" reset-button close-button 
                class="my-no-right-border")
                b-input-group-append
                  b-button(variant="danger" class="my-no-left-border" @click="form.expirationDate = null"
                  :disabled="form.expirationDate == null") 
                    span Cancella
                    b-icon(icon="x" aria-hidden="true")
          
          div(class="mb-4")
            b-form-group(id="input-group-6" label="Informazioni aggiuntive:" label-for="input-6")
              b-form-textarea(id="input-6" rows="3" max-rows="6" v-model="form.additionalInformation")

          div(class="mb-4")
            p(class="font-weight-bold text-center") Luogo ritiro
            b-form-group(id="input-group-3" label="Città:" label-for="input-3")
              b-form-input(id="input-3" type="text" v-model="form.address.city" required)
            b-row
              b-col(cols=8)
                b-form-group(id="input-group-4" label="Indirizzo:" label-for="input-4")
                  b-form-input(id="input-4" type="text" v-model="form.address.street" required)
              b-col(cols=4)
                b-form-group(id="input-group-5" label="Numero civico:" label-for="input-5")
                  b-form-input(id="input-5" type="text" v-model="form.address.civicNumber" required)
            div(class="text-center")
              b-button(variant="outline-secondary") Cerca su maps
          

          div()
            p(class="font-weight-bold text-center") Periodo ritiro
            b-row(v-for="(weekDayName, weekDay, idx) in weekDays" :index="idx" class="mb-1")
              b-col(cols="2")
                label {{ weekDayName }}
              b-col(cols="10")
                b-button-group(class="d-flex")
                  b-button(@click="weekDayButtonClick(weekDay, 'morning')" :variant="computeButtonVariant(weekDay, 'morning')") Mattino
                  b-button(@click="weekDayButtonClick(weekDay, 'afternoon')" :variant="computeButtonVariant(weekDay, 'afternoon')") Pomeriggio
                  b-button(@click="weekDayButtonClick(weekDay, 'evening')" :variant="computeButtonVariant(weekDay, 'evening')") Sera
      
      b-button(block variant="outline-danger" @click="$router.replace({name: 'ManagerHome'})" type="reset") Annulla
      
      b-button(block variant="outline-success" type="submit") Procedi
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import {
  DonationCreationPayload, Address
} from "../types";

import api from "../api";

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
        foods: [
          ""
        ],
        expirationDate: "",
        address: {
          city: "",
          street: "",
          civicNumber: "",
          coordinates: {
            x: 0,
            y: 0,
          }
        } as Address,
        additionalInformation: "",
        pickUpPeriod: new Array<{weekDay: string, period: string}>(),
      } as DonationCreationPayload,
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {

      this.$store.dispatch("showSidebar");
      this.form.userId = this.$store.state.session.userData._id;
      this.form.address = this.$store.state.session.userData.address;
    } else {
      this.$router.replace({name: "Login"});
    }
  },
  methods: {
    computeButtonVariant(weekDay: string, period: string) {
      const idx: number = this.form.pickUpPeriod.findIndex(
        (wd: { weekDay: string, period: string }) => wd.weekDay == weekDay && wd.period == period
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
        (wd: { weekDay: string, period: string }) => wd.weekDay == weekDay && wd.period == period
      );

      if (idx != -1) {
        this.form.pickUpPeriod.splice(idx, 1);
      } else {
        this.form.pickUpPeriod.push({ weekDay, period });
      }
    },
    addDonation(event) {
      event.preventDefault();

      if (this.form.pickUpPeriod.length == 0) {
        this.$bvToast.toast(
            `Selezionare almeno un periodo della settimana in cui sei disponibile per il ritiro degli alimenti donati.`, {
              title: "Donazione",
              autoHideDelay: 5000,
              variant: "warning",
              appendToast: false,
            }
          );

      } else if (this.form.foods.length == 0) {
        this.$bvToast.toast(
            `Inserire almeno un alimento che vuoi donare.`, {
              title: "Donazione",
              autoHideDelay: 5000,
              variant: "warning",
              appendToast: false,
            }
          );

      } else {
        api.addDonation(this.form, this.$store.getters.getSessionHeader).then(r => {
          
          // removes empty string element
          this.form.foods.pop()

          this.$router.replace({name: "ManagerDonationsList"});
          this.$bvToast.toast(
              `Donazione effettuata con successo.`, {
                title: "Donazione",
                autoHideDelay: 5000,
                variant: "success",
                appendToast: false,
              }
            );
        }).catch(e => {
          this.$bvToast.toast(
              `Impossibile inviare la donazione. Riprova più tardi oppure contattaci se il problema persiste.`, {
                title: "Donazione",
                autoHideDelay: 5000,
                variant: "danger",
                appendToast: false,
              }
            );
        })
      }
    }
  },
});
</script>

<style scoped lang="scss"> </style>
