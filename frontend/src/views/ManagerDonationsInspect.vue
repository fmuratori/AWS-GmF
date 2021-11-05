<template lang="pug">
  b-container
    b-row(class="justify-content-center my-5")
      b-col(xl=5 lg=5 md=6 sm=8 cols=10 class="ml-2")
        p MESSAGGI
        b-card(bg-variant="light" class="mb-2" no-body)
          b-card-text(class="m-2")
            div(id="messages-area")

              Message(:messages="['asd loll xd', 'asd loll']" date="10:45pm" username="Carlo" role="volunteer" :isOwner="false")
              
              Message(:messages="['a', 'asd loll xd asjd hkahqwehqkweh qkwjehqkw jehqwkjehqkwjeh kqwjehkq whqewk']" 
              date="10:45pm" username="Fabio (tu)" role="volunteer" :isOwner="true" :isVisualized="true")                

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
        b-button(block variant="danger" type="submit") Modifica
        b-button(block variant="danger" type="submit") Cancella
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import Message from "../components/Message.vue";

import {
  Donation, Address, ChatMessage, ChatRequestPayload
} from "../types";

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
          }
        } as Address,
        additionalInformation: "",
        pickUpPeriod: new Array<{weekDay: string, period: string}>(),
        chat: new Array<ChatMessage>(),
        creationDate: "",
      } as Donation,
      chat: new Array<ChatMessage>(),
      chatMessage: "",
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      // retrieve the donation data from vue-route
      if ("donation" in this.$route.params) { 
        this.donation = this.$route.params.donation
      } else {
        this.$router.replace({name: "ManagerDonationsList"});
      }

      // load donation messages
      this.getChat();

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
    getChat() {

      const payload: ChatRequestPayload = {
        donationId: this.donation._id,
      } as ChatRequestPayload;
      console.log(payload)
      api.getDonationChat(payload, this.$store.getters.getSessionHeader).then((r:any) => {
        console.log(r)
        this.chat = r.data.data.chat;
      }).catch(e => console.log(e));

    },
    sendMessage(event) {
      event.preventDefault();
      console.log({
        donationId: this.donation._id,
        userId: this.$store.state.session.userData._id,
        message: this.chatMessage,
        fullname: this.$store.getters.userFullName,
      })
      this.$socket.emit("message_to_server", {
        donationId: this.donation._id,
        userId: this.$store.state.session.userData._id,
        message: this.chatMessage,
        fullname: this.$store.getters.userFullName,
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
  display:block;
  background-color: $greyscaleF;
  border-radius: 5px;
}
.my-message {
  background-color: $color2;
}
</style>
