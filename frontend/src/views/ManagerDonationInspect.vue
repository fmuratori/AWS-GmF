<template lang="pug">
b-container
  b-row.justify-content-center.my-5
    b-col(lg=6, md=8, cols=11)
      hr.shaded
      h4.text-center
        b YOUR DONATION
      hr.shaded
  
  b-row.justify-content-center
    b-col(lg=4, md=8, cols=10)
      b-card(bg-variant="light", no-body)
        b-card-text.m-2
          #messages-area.mb-1(ref="messagesArea")
            Message(
              v-for="(message, idx) in processedChat",
              :key="idx",
              :username="message.userFullname",
              :isOwner="message.userId == $store.state.session.userData._id",
              :date="dates.formatDatetime(message.date)",
              :isVisualized="message.visualized",
              :isEvent="message.isEventMessage"
              :messages="message.messages",
            )

          b-form(@submit.stop.prevent="sendMessage")
            b-input-group(class="")
              b-form-input(
                type="text",
                placeholder="Insert here your message",
                v-model="chatMessage",
                required
              )
              b-input-group-append
                b-button(variant="success", type="submit") Send
          
    b-col(lg=6, md=8, cols=10).mb-5
      b-card(bg-variant="light", no-body).mb-2
        b-card-text.p-3 
          b-row.mb-3
            b-col(md=3)
              label Status:
            b-col
              h5
                b-badge(
                  v-if="donation.status == 'waiting'",
                  variant="warning"
                ) {{donation.status}}
                b-badge(
                  v-if="donation.status == 'selected'",
                  variant="success"
                ) {{donation.status}}
                b-badge(
                  v-if="donation.status == 'withdrawn'",
                  variant="secondary"
                ) {{donation.status}}

          
          b-row.mb-3(v-if="donation.status == 'selected'")
            b-col(md=3)
              label Pick up date: 
            b-col
              label.font-weight-bold {{ dates.formatDate(donation.pickUp.date) }}, {{ donation.pickUp.period }}

          b-row.mb-3
            b-col(md=3)
              label Creation date:
            b-col
              label.font-weight-bold {{ dates.formatDate(donation.creationDate) }}

          b-row.mb-3
            b-col(md=3)
              label Expiration date:
            b-col
              label 
                span.font-weight-bold {{ dates.formatDatetime(donation.expirationDate) }}
                span &nbsp;(expires in&nbsp;
                span.font-weight-bold {{ dates.daysTillDate(donation.expirationDate) }} days
                span )

          b-row.mb-3
            b-col(md=3)
              label Food list:
            b-col
              p.mb-0.font-weight-bold(v-for="(value, idx) in donation.foods", :key="idx") {{ value }}

          b-row.mb-3
            b-col(md=3)
              label Address:
            b-col
              label.font-weight-bold {{ donation.address.city }}, {{ donation.address.street }}, {{ donation.address.civicNumber }}

          b-row.mb-3(v-if="donation.additionalInformations != null")
            b-col(md=3)
              label Additiona info:
            b-col
              label.font-weight-bold {{ donation.additionalInformations }}

          b-row.mb-3
            b-col(md=3)
              label Pickup week days:
            b-col
              p.mb-0.font-weight-bold(
                v-for="(weekDayName, weekDay, idx) in constants.weekDays",
                :key="idx",
                v-if="weekDayDonations(weekDay).length > 0"
              ) {{ weekDayName + ':&nbsp;' + weekDayDonations(weekDay).map((d) => d.period).join(', ') }}

      div(v-if="$store.getters.isUser") 
        b-button.color3(
          block,
          type="submit",
          @click="modifyDonation"
        ) Edit
        b-button.color3(
          block,
          v-b-modal.modal,
        ) Delete
        b-button.color4(
          block,
          variant="secondary",
          @click="$router.push({ name: 'ManagerDonationList' })",
          type="reset"
        ) Cancel

      div(v-if="$store.getters.isVolunteer")
        b-button.color3(
          block,
          type="submit",
          @click="cancelReservation"
        ) Delete reservation
        b-button(
          block,
          variant="secondary",
          @click="$router.push({ name: 'ManagerDonationList' })",
          type="reset"
        ) Cancel

  b-modal#modal(title="Delete your donation?", @ok="deleteDonation()")
    div This donation offer will be deleted permanently.
    
    template(#modal-footer="{ ok, cancel }")
      b-button(variant='secondary' @click='cancel()') Cancel
      b-button.color3(@click='ok()') Confirm
</template>

<script lang="ts">
import Vue from "vue";
import eventbus from "../eventbus";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import Message from "../components/ChatMessage.vue";
import moment from "moment";

import { Donation, Address, ChatMessage } from "../types";

import donationApi from "../api/donation";
import { AxiosError, AxiosResponse } from "axios";

export default Vue.extend({
  name: "ManagerDonationInspect",
  components: {
    Navbar,
    Sidebar,
    Message,
  },
  data: function () {
    return {
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
        additionalInformations: "",
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
        this.$router.push({ name: "ManagerDonationList" });
      }

      // load donation messages
      this.$store.dispatch("getChat", this.donation._id);
    } else this.$router.push({ name: "Login" });
  },
  methods: {
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
    sendMessage() {
      this.$store.dispatch("sendMessage", {
        donationId: this.donation._id,
        message: this.chatMessage,
        isEventMessage: false,
      });
      this.chatMessage = "";
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
            });

            this.$router.push({ name: "ManagerDonationList" });
            eventbus.$emit(
              "successMessage",
              "Donation",
              "Donation deleted successfully."
            );
          }
        })
        .catch((e: AxiosError): void => {
          eventbus.$emit(
            "dangerMessage",
            "Donation",
            "Donation deletion failed. Retry later or contact us if the problem persists."
          );
          console.log(e);
        });
    },
    modifyDonation() {
      this.$router.push({
        name: "ManagerDonationCreate",
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
            });

            eventbus.$emit(
              "successMessage",
              "Donation",
              "Donation reservation for pickup deleted succesfully."
            );
            this.$router.push({ name: "ManagerDonationList" });
          }
        })
        .catch((e: AxiosError): void => {
          eventbus.$emit(
            "errorMessage",
            "Donation",
            "Donation reservation cancellation failed. Retry later or contact us if the problem persists."
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
