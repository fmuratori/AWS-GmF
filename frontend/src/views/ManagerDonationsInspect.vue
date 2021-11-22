<template lang="pug">
b-container
  b-row.justify-content-center.my-5
    b-col.ml-2(lg=4, md=8, cols=11)
      p CHAT
      b-card.mb-2(bg-variant="light", no-body)
        b-card-text.m-2
          #messages-area.mb-1(ref="messagesArea")
            Message(
              v-for="(message, idx) in processedChat",
              :key="idx",
              :username="message.userFullname",
              :isOwner="message.userId == $store.state.session.userData._id",
              :date="formatDatetime(message.date)",
              :isVisualized="message.visualized",
              :isEvent="message.isEventMessage"
              :messages="message.messages",
              :ref="'scrollTo' + idx"
            )

          //- div(class="")
          //-   label(class="font-italic") Marco stà scrivendo...
          b-form(@submit.stop.prevent="sendMessage")
            b-input-group(class="")
              b-form-input(
                type="text",
                placeholder="Scrivi qui il tuo messaggio.",
                v-model="chatMessage",
                required
              )
              b-input-group-append
                b-button(variant="success", type="submit") Invia
          
    b-col(lg=6, md=8, cols=11)
      p INFORMAZIONI SUL RITIRO

      b-card.mb-2(bg-variant="light")
        b-card-text
          .mb-2
            label.mb-0 Stato donazione:
            p.font-weight-bold {{ donation.status }}
          .mb-2
            label.mb-0 Data ritiro:
            p.font-weight-bold {{ formatDate(donation.pickUp.date) }} - {{ donation.pickUp.period }}

      p INFORMAZIONI DONAZIONE

      b-card.mb-2(bg-variant="light")
        b-card-text
          .mb-2
            label.mb-0 Alimenti:
            p.mb-0(v-for="(value, idx) in donation.foods", :key="idx")
              label.font-weight-bold {{ value }}

          .mb-2
            label.mb-0 La donazione scade tra:
            p.font-weight-bold {{ expirationDays }} giorni

          .mb-2
            label.mb-0 Data creazione donazione:
            p.font-weight-bold {{ formatDatetime(donation.creationDate) }}

          .mb-2
            label.mb-0 Data scadenza donazione:
            p.font-weight-bold {{ formatDatetime(donation.expirationDate) }}

          .mb-2
            label.mb-0 Luogo ritiro:
            p.font-weight-bold {{ donation.address.city }}, {{ donation.address.street }}, {{ donation.address.civicNumber }}

          .mb-2(v-if="donation.additionalInformation != null")
            label.mb-0 Informazioni aggiuntive:
            p.font-weight-bold {{ donation.additionalInformation }}

          div(class="")
            label.mb-0 Periodi di ritiro:
            p.mb-1(
              v-for="(weekDayName, weekDay, idx) in weekDays",
              :key="idx",
              v-if="weekDayDonations(weekDay).length > 0"
            )
              label.font-weight-bold {{ weekDayName + ':&nbsp;' + weekDayDonations(weekDay).map((d) => d.period).join(', ') }}

      div(v-if="$store.getters.isUser") 
        b-button(
          block,
          variant="outline-danger",
          type="submit",
          @click="modifyDonation"
        ) Modifica
        b-button(
          block,
          variant="outline-danger",
          type="submit",
          @click="deleteDonation"
        ) Cancella
        b-button(
          block,
          variant="outline-secondary",
          @click="$router.push({ name: 'ManagerDonationsUserList' })",
          type="reset"
        ) Indietro

      div(v-if="$store.getters.isVolunteer")
        b-button(
          block,
          variant="outline-danger",
          type="submit",
          @click="cancelReservation"
        ) Annulla prenotazione
        b-button(
          block,
          variant="outline-secondary",
          @click="$router.push({ name: 'ManagerDonationsVolunteerList' })",
          type="reset"
        ) Indietro
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import Message from "../components/Message.vue";
import moment from "moment";

import { Donation, Address, ChatMessage } from "../types";

import donationApi from "../api/donation";
import { AxiosError, AxiosResponse } from "axios";

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
        if (newChat.length == 0 || message.isEventMessage) {
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
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      // retrieve the donation data from vue-route
      if ("donation" in this.$route.params) {
        this.donation = JSON.parse(this.$route.params.donation) as Donation;
      } else {
        this.$router.push({ name: "ManagerDonationsList" });
      }

      // load donation messages
      this.$store.dispatch("getChat", this.donation._id);
    } else this.$router.push({ name: "Login" });
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
        ? "Morning"
        : period == "afternoon"
        ? "Afternoon"
        : "Evening";
    },
    sendMessage(event) {
      event.preventDefault();
      this.$store.dispatch("sendMessage", {
        donationId: this.donation._id,
        message: this.chatMessage,
        isEventMessage: false,
      })
    },
    deleteDonation() {
      donationApi
        .deleteDonation(this.donation._id)
        .then((r: AxiosResponse) => {
          if (r.status == 200) {
            this.$store.dispatch("sendMessage", {
              donationId: this.donation._id,
              message: "Donation cancelled succesfully.",
              isEventMessage: true,
            })

            this.$router.push({ name: "ManagerDonationsList" });
            eventbus.$emit("successMessage", "Donation", "Donation deleted successfully.");
          }
        })
        .catch((e: AxiosError): void => {
          eventbus.$emit("dangerMessage", "Donation", "Donation deletion failed. Retry later or contact us if the problem persists.");
          console.log(e);
        });
    },
    modifyDonation() {
      this.$router.push({
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
        .then((r: AxiosResponse) => {
          if (r.status == 200) {
            this.$store.dispatch("sendMessage", {
              donationId: this.donation._id,
              message: "The volunteer in charge cancelled the reservation.",
              isEventMessage: true,
            })
            
            eventbus.$emit("successMessage", "Donation", "Donation reservation for pickup deleted succesfully.");
            this.$router.push({ name: "ManagerDonationsVolunteerList" });
          }
        })
        .catch((e: AxiosError): void => {
          eventbus.$emit("errorMessage", "Donation", "Donation reservation cancellation failed. Retry later or contact us if the problem persists.");
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
