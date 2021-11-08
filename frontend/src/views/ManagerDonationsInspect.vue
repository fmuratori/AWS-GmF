<template lang="pug">
  b-container
    b-row(class="justify-content-center my-5")
      b-col(xl=5 lg=5 md=6 sm=8 cols=10 class="ml-2")
        p MESSAGGI
        b-card(bg-variant="light" class="mb-2" no-body)
          b-card-text(class="m-2")
            div(id="messages-area" ref="messagesArea")

              Message(v-for="(message, idx) in chat" :index="idx" :username="message.userFullname" 
              :isOwner="message.userId == $store.state.session.userData._id" :date="message.date" :isVisualized="message.visualized"
              :messages="[message.text]")
              
            //- div(class="")
            //-   label(class="font-italic") Marco stà scrivendo...
            b-form(@submit="sendMessage")
              b-input-group(class="")
                b-form-input(type="text" placeholder="Scrivi qui il tuo messaggio." v-model="chatMessage" required)
                b-input-group-append
                  b-button(variant="success" type="submit") Invia


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
        b-button(block variant="danger" type="submit" @click="modifyDonation") Modifica
        b-button(block variant="danger" type="submit" @click="deleteDonation") Cancella
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import Message from "../components/Message.vue";

import { Donation, Address, ChatMessage } from "../types";

import api from "../api";

export default Vue.extend({
  name: "ManagerDonationsInspect",
  components: {
    Navbar,
    Sidebar,
    Message,
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
          },
        } as Address,
        additionalInformation: "",
        pickUpPeriod: new Array<{ weekDay: string; period: string }>(),
        creationDate: "",
      } as Donation,
      chatMessage: "",
    };
  },
  computed: {
    chat() {
      return this.$store.state.socketio.chat
    }
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      // retrieve the donation data from vue-route
      if ("donation" in this.$route.params) {
        this.donation = JSON.parse(this.$route.params.donation);
      } else {
        this.$router.replace({ name: "ManagerDonationsList" });
      }

      // load donation messages
      this.$store.dispatch("getChat", this.donation._id);
      
    } else {
      this.$router.replace({ name: "Login" });
    }
  },
  methods: {
    weekDayDonations(weekDay: string): { weekDay: string; period: string }[] {
      return this.donation.pickUpPeriod.filter(
        (p: { weekDay: string; period: string }) => p.weekDay == weekDay
      );
    },
    translatePeriod(period: string): string {
      return period == "morning"
        ? "mattino"
        : period == "afternoon"
        ? "pomeriggio"
        : "sera";
    },
    sendMessage(event) {
      event.preventDefault();

      this.$socket.emit("message_to_server", {
        donationId: this.donation._id,
        userId: this.$store.state.session.userData._id,
        message: this.chatMessage,
        fullname: this.$store.getters.userFullName,
      });
    },
    deleteDonation() {
      api
        .deleteDonation(this.donation._id, this.$store.getters.getSessionHeader)
        .then((r: any) => {
          this.$router.replace({ name: "ManagerDonationsList" });
          this.$bvToast.toast(`Donazione eliminata con successo.`, {
            title: "Donazione",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
        })
        .catch((e) => {
          this.$bvToast.toast(
            `Impossibile eliminare la donazione. Riprova tra qualche minuto.`,
            {
              title: "Donazione",
              autoHideDelay: 5000,
              variant: "danger",
              appendToast: false,
            }
          );
          console.log(e);
        });
    },
    modifyDonation() {
      this.$router.replace({
        name: "ManagerDonationsCreate",
        params: { donation: JSON.stringify(this.donation) },
      });
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

#messages-area {
  display: flex;
  flex-direction: column;
  height: 450px;
  overflow: auto;
  flex: 1;
}

.message {
  display: block;
  background-color: $greyscaleF;
  border-radius: 5px;
}
.my-message {
  background-color: $color2;
}
</style>
