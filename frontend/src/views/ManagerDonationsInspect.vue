<template lang="pug">
  b-container
    b-row(class="justify-content-center my-5")
      b-col(lg=4 md=8 cols=11 class="ml-2")
        p CHAT
        b-card(bg-variant="light" class="mb-2" no-body)
          b-card-text(class="m-2")
            div(id="messages-area" class="mb-1" ref="messagesArea")

              Message(v-for="(message, idx) in processedChat" :key="idx" :username="message.userFullname" 
              :isOwner="message.userId == $store.state.session.userData._id" :date="formatDatetime(message.date)" :isVisualized="message.visualized"
              :messages="message.messages" :ref="'scrollTo' + idx")
              
            //- div(class="")
            //-   label(class="font-italic") Marco stà scrivendo...
            b-form(@submit="sendMessage")
              b-input-group(class="")
                b-form-input(type="text" placeholder="Scrivi qui il tuo messaggio." v-model="chatMessage" required)
                b-input-group-append
                  b-button(variant="success" type="submit") Invia

      b-col(lg=6 md=8 cols=11)

        p INFORMAZIONI SUL RITIRO
        
        b-card(bg-variant="light" class="mb-2")
          b-card-text
            div(class="mb-2")
              label(class="mb-0") Stato donazione:
              p(class="font-weight-bold") {{ status }}
            div(class="mb-2")
              label(class="mb-0") Data ritiro: 
              p(class="font-weight-bold") {{ formatDate(donation.pickUp.date) }} - {{ donation.pickUp.period }}

        p INFORMAZIONI DONAZIONE
        
        b-card(bg-variant="light" class="mb-2")
          b-card-text
            div(class="mb-2")
              label(class="mb-0") Alimenti: 
              p(v-for="(value, idx) in donation.foods" :key="idx" class="mb-0")
                label(class="font-weight-bold") {{ value }}
            
            div(class="mb-2")
              label(class="mb-0") La donazione scade tra:
              p(class="font-weight-bold") {{ expirationDays }} giorni

            div(class="mb-2")
              label(class="mb-0") Data creazione donazione:
              p(class="font-weight-bold") {{ formatDatetime(donation.creationDate) }} 
            
            div(class="mb-2")
              label(class="mb-0") Data scadenza donazione:
              p(class="font-weight-bold") {{ formatDatetime(donation.expirationDate) }} 

            div(class="mb-2")
              label(class="mb-0") Luogo ritiro:
              p(class="font-weight-bold") {{ donation.address.city }}, {{ donation.address.street }}, {{ donation.address.civicNumber }}

            div(class="mb-2" v-if="donation.additionalInformation != null")
              label(class="mb-0") Informazioni aggiuntive:
              p(class="font-weight-bold") {{ donation.additionalInformation }}
              
            div(class="")
              label(class="mb-0") Periodi di ritiro:
              p(v-for="(weekDayName, weekDay, idx) in weekDays" :key="idx" class="mb-1" v-if="weekDayDonations(weekDay).length > 0")
                label(class="font-weight-bold") {{ weekDayName + ":&nbsp;" + weekDayDonations(weekDay).map(d => translatePeriod(d.period)).join(", ") }}    

        div(v-if="$store.getters.isUser" ) 
          b-button(block variant="outline-danger" type="submit" @click="modifyDonation") Modifica
          b-button(block variant="outline-danger" type="submit" @click="deleteDonation") Cancella
          b-button(block variant="outline-secondary" @click="$router.replace({name: 'ManagerDonationsUserList'})" type="reset") Indietro
        
        div(v-if="$store.getters.isVolunteer" )
          b-button(block variant="outline-danger" type="submit" @click="cancelReservation") Annulla prenotazione
          b-button(block variant="outline-secondary" @click="$router.replace({name: 'ManagerDonationsVolunteerList'})" type="reset") Indietro
        

        
        

</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import Message from "../components/Message.vue";
import moment from "moment";

import { Donation, Address, ChatMessage } from "../types";

import donationApi from "../api/donation";

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
        pickUp: {
          period: "",
          date: "",
          volunteerId: "",
        },
      } as Donation,
      chatMessage: "",
    };
  },
  computed: {
    chat(): ChatMessage[] {
      return this.$store.state.socketio.chat;
    },

    processedChat() {
      const newChat = new Array<ChatMessage>();

      for (const message of this.chat) {
        message.messages = [message.text];
        if (newChat.length == 0) {
          newChat.push(message);
        } else if (newChat[newChat.length - 1].userId == message.userId) {
          const firstMessageTime = moment(newChat[newChat.length - 1].date);
          const secondMessageTime = moment(message.date);
          if (secondMessageTime.diff(firstMessageTime, "minutes") < 10) {
            newChat[newChat.length - 1].messages.push(message.text);
            newChat[newChat.length - 1].date = message.date;
          } else newChat.push(message);
        } else {
          newChat.push(message);
        }
      }
      return newChat;
    },

    expirationDays(): number {
      return moment(this.donation.expirationDate).diff(moment.now(), "days");
    },

    status() {
      switch (this.donation.status) {
        case "waiting":
          return "In attesa";
        case "selected":
          return "Ritiro prenotato";
        case "withdrawn":
          return "Ritirato";
        default:
          return "";
      }
    },
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
    formatDatetime(date) {
      return moment(new Date(date)).locale("it").calendar();
    },

    formatDate(date) {
      return moment(date).locale("it").format("DD-MM-YYYY");
    },

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
      donationApi
        .deleteDonation(this.donation._id)
        .then(() => {
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
    cancelReservation() {
      this.donation.pickUp = {
        volunteerId: "",
        date: "",
        period: "",
      };
      this.donation.status = "waiting";
      donationApi
        .editDonation(this.donation)
        .then((r: any) => {
          this.$bvToast.toast(`Ritiro della donazione annulato con successo.`, {
            title: "Donazione",
            autoHideDelay: 5000,
            variant: "success",
            appendToast: false,
          });
          this.$router.replace({ name: "ManagerDonationsVolunteerList" });
        })
        .catch((e: any) => {
          this.$bvToast.toast(
            `Impossibile cancellare la prenotazione della donazione. Riprova tra qualche minuto.`,
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
  },
  destroyed() {
    this.$store.dispatch("resetChat");
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

.button-color {
  background-color: $color3;
  border-color: $color3;
}
</style>
