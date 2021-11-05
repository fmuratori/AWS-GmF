<template lang="pug">
  b-container
    b-row(class="justify-content-center my-5")
      b-col(xl=5 lg=5 md=6 sm=8 cols=10 class="ml-2")
        p MESSAGGI
        b-card(bg-variant="light" class="mb-2" no-body)
          b-card-text(class="m-2")
            div(class="chat-message")
              p(class="font-weight-bolder m-0 p-0") Carlo
              p(class="m-0 p-0") asd loll xd

            div(class="chat-message")
              p(class="font-weight-bolder m-0 p-0 text-right") Tu
              p(class="text-right m-0 p-0") asd loll xd

            div(class="")
              label(class="font-italic") Marco stà scrivendo...

            div(class="")
              input(block type="text")
              button() invia

      b-col(xl=5 lg=5 md=6 sm=8 cols=10)
        p INFORMAZIONI DONAZIONE
        
        b-card(bg-variant="light" class="mb-2")
          b-card-text
            div(class="mb-2")
              label(class="mb-0") Alimenti: 
              p(v-for="(value, idx) in donation.foods" :key="idx" v-if="value != ''")
                label(class="font-weight-bold") {{ value }}
            
            div(class="mb-2")
              label(class="mb-0") Stato donazione:
              p(class="font-weight-bold") {{ donation.status }}

            div(class="mb-2")
              label(class="mb-0") La donazione scade tra:
              p(class="font-weight-bold") ## giorni

            div(class="mb-2")
              label(class="mb-0") Data creazione donazione:
              p(class="font-weight-bold") {{ donation.creationDate }} 
            
            div(class="mb-2")
              label(class="mb-0") Data scadenza donazione:
              p(class="font-weight-bold") {{ donation.expirationDate }} 

            div(class="mb-2")
              label(class="mb-0") Luogo ritiro:
              p(class="font-weight-bold") {{ donation.address.city }}, {{ donation.address.street }}, {{ donation.address.civicNumber }}

            div(class="mb-2" v-if="donation.additionalInformation != null")
              label(class="mb-0") Informazioni aggiuntive:
              p(class="font-weight-bold") {{ donation.additionalInformation }}
              
            div(class="")
              label(class="mb-0") Periodi di ritiro:
              p(v-for="(weekDayName, weekDay, idx) in weekDays" :index="idx" class="mb-1" v-if="weekDayDonations(weekDay).length > 0")
                label(class="font-weight-bold") {{ weekDayName + ": "}}  
                label(class="font-weight-bold") {{ " " + weekDayDonations(weekDay).map(d => translatePeriod(d.period)).join(", ") }}
                
        b-button(block variant="outline-secondary" @click="$router.replace({name: 'ManagerHome'})" type="reset") Indietro
        b-button(block variant="danger" type="submit") Modifica
        b-button(block variant="danger" type="submit") Cancella
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import {
  Donation, Address, ChatMessage
} from "../types";

import api from "../api";

export default Vue.extend({
  name: "ManagerDonationsInspect",
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
      donation: {
        _id: "",
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
          }
        } as Address,
        additionalInformation: "",
        pickUpPeriod: new Array<{weekDay: string, period: string}>(),
        chat: new Array<ChatMessage>(),
        creationDate: "",
      } as Donation,
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      this.$store.dispatch("showSidebar");

      // retrieve the donation data from vue-route
      if ("donation" in this.$route.params) { 
        console.log()
        this.donation = this.$route.params.donation
      } else {
        this.$router.replace({name: "ManagerDonationsList"});
      }
    } else {
      this.$router.replace({name: "Login"});
    }
  },
  methods: {
    weekDayDonations(weekDay: string): [{ weekDay:string, period:string }] {
      return this.donation.pickUpPeriod.filter((p: { weekDay:string, period:string }) => p.weekDay == weekDay)
    },
    translatePeriod(period: string): string {
      return period == "morning" ? "mattino" : period == "afternoon" ? "pomeriggio" : "sera";
    },
    computeButtonVariant(weekDay: string, period: string) {
      const idx: number = this.donation.pickUpPeriod.findIndex(
        (wd: { weekDay: string, period: string }) => wd.weekDay == weekDay && wd.period == period
      );
      return idx != -1 ? "dark" : "outline-secondary";
    },
    foodInputValueChange(inputIdx: number) {
      if (inputIdx == this.donation.foods.length - 1) {
        this.donation.foods.push("");
      } else if (this.donation.foods[inputIdx] == "") {
        this.foodDeleteClicked(inputIdx);
      }
    },
    foodDeleteClicked(inputIdx: number) {
      this.donation.foods.splice(inputIdx, 1);
    },
    weekDayButtonClick(weekDay: string, period: string) {
      const idx: number = this.donation.pickUpPeriod.findIndex(
        (wd: { weekDay: string, period: string }) => wd.weekDay == weekDay && wd.period == period
      );

      if (idx != -1) {
        this.donation.pickUpPeriod.splice(idx, 1);
      } else {
        this.donation.pickUpPeriod.push({ weekDay, period });
      }
    },
    addDonation(event) {
      event.preventDefault();

      if (this.donation.pickUpPeriod.length == 0) {
        this.$bvToast.toast(
            `Selezionare almeno un periodo della settimana in cui sei disponibile per il ritiro degli alimenti donati.`,
            {
              title: "Donazione",
              autoHideDelay: 5000,
              variant: "warning",
              appendToast: false,
            }
          );

      } else if (this.donation.foods.length == 0) {
        this.$bvToast.toast(
            `Inserire almeno un alimento che vuoi donare.`,
            {
              title: "Donazione",
              autoHideDelay: 5000,
              variant: "warning",
              appendToast: false,
            }
          );

      } else {
        api.addDonation(this.form, this.$store.getters.getSessionHeader).then(r => {
          console.log(r)
          this.$router.replace({name: "ManagerDonationsList"});
          this.$bvToast.toast(
              `Donazione effettuata con successo.`,
              {
                title: "Donazione",
                autoHideDelay: 5000,
                variant: "success",
                appendToast: false,
              }
            );
        }).catch(e => {
          this.$bvToast.toast(
              `Impossibile inviare la donazione. Riprova più tardi oppure contattaci se il problema persiste.`,
              {
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

<style scoped lang="scss">

@import "@/assets/style.scss";

.chat-message {
  background-color: $greyscaleF;
  border-radius: 5px;
  margin: 1em;
  padding: 1em;
}
</style>
