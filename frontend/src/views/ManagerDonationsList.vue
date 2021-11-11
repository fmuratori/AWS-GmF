<template lang="pug">
  b-container(class="justify-content-center my-5")
    p TUE DONAZIONI

    b-row(no-gutters class="mb-2")
      b-col(cols="auto")
      p Stato donazione:
      b-col
        b-button(pill variant="secondary" size="sm" class="ml-2" @click="filterBy('waiting')" :class="{'my-button-selected': filterByMode == 'waiting'}") In attesa
        b-button(pill variant="secondary" size="sm" class="ml-2" @click="filterBy('selected')" :class="{'my-button-selected': filterByMode == 'selected'}") Prenotata
        b-button(pill variant="secondary" size="sm" class="ml-2" @click="filterBy('all')" :class="{'my-button-selected': filterByMode == 'all'}") Tutte le donazioni
    
    b-row(no-gutters class="mb-2")
      b-col(cols="auto")
      p Ordina per:
      b-col
        b-button(pill variant="secondary" size="sm" class="ml-2" @click="orderBy('creation_date')" :class="{'my-button-selected': orderByMode == 'creation_date'}") Data creazione
        b-button(pill variant="secondary" size="sm" class="ml-2" @click="orderBy('unread_messages')" :class="{'my-button-selected': orderByMode == 'unread_messages'}") Messaggi non letti
        b-button(pill variant="secondary" size="sm" class="ml-2" @click="orderBy('expiration_date')" :class="{'my-button-selected': orderByMode == 'expiration_date'}") Data scadenza
    
    b-row
      b-col(sm=12 md=6 v-if="donations.length == 0") 
        p Nessuna donazione trovata. Assicurati di aver selezionato correttamente i filtri oppure premi #[a( href="#" @click="$router.replace({name: 'ManagerDonationsCreate'})") qui] per inserire una nuova donazione.

      b-col(v-else sm=12 md=6 v-for="(donation, idx) in donations" :index="idx")
        b-card(bg-variant="light" text-variant="dark" no-body class="mb-2")
          b-card-text
            div(class="px-4 pt-4")
              h5 Offerta effettuata il {{ formatDonation(donation.creationDate) }}
              b-row()
                b-col(cols="auto")
                  div(class="")
                    p(class="mb-0") Alimenti donati:
                    p(class="font-weight-bold mb-2" v-for="(food, idx) in donation.foods" :index="idx") {{ food }}
                  div(class="")
                    p(class="mb-0") Scade tra:
                    p(class="font-weight-bold mb-2") {{ getExpirationDays(donation) }} giorni
                  //- div 
                  //-   p(class="mb-0") Orari disponibili per il ritiro:
                  //-   p(class="font-weight-bold") 12/12/2012 
                  //-     span(class="font-weight-normal") Scade tra 12 giorni
                  div(class="")
                    p(class="mb-0") Luogo ritiro:
                    p(class="font-weight-bold") {{ donation.address.street + " " + donation.address.civicNumber + ", " + donation.address.city }}
                b-col(cols="auto")
                  div(class="mb-2")
                    p(class="mb-0") Stato donazione:
                    h5
                      b-badge(v-if="donation.status == 'waiting'" variant="warning") In attesa di valutazione
                      b-badge(v-if="donation.status == 'selected'" variant="success") Prenotato per il ritiro 
                      b-badge(v-if="donation.status == 'withdrawn'" variant="secondary") Ritirato
                  div(class="mb-2" v-if="hasUnreadMessages(donation._id)")
                    a(href="#") Hai {{ unreadMessagesCount(donation._id) }} messaggi non letti
            b-button(block @click="inspectDonation(donation)" class="b-card-footer-button") Mostra

</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/sidebar/Sidebar.vue";

import api from "../api";

import { Donation } from "../types";

export default Vue.extend({
  name: "ManagerDonationsList",
  components: {
    Navbar,
    Sidebar,
  },
  data: () => {
    return {
      donations: new Array<Donation>(),
      donationsBackup: new Array<Donation>(),
      orderByMode: "unread_messages",
      filterByMode: "all",
    };
  },
  created() {
    // check if user is logged in
    if (this.$store.getters.isUserLogged) {
      if (!this.$store.getters.isMediumScreenWidth) {
        this.$store.dispatch("showSidebar");
      }

      // TODO: mostrare uno spinner mentre sono caricati i dati
      api
        .userDonationsList(
          this.$store.state.session.userData._id,
          this.$store.getters.getSessionHeader
        )
        .then((r: any) => {
          this.donations = r.data.data.list;
          this.donationsBackup = r.data.data.list;
          this.orderBy(this.orderByMode);
          this.filterBy(this.filterByMode);
        })
        .catch((e) => console.log(e));

      // api.donationsMessagesCounts(this.$store.state.session.userId,this.$store.getters.getSessionHeader).then((r:any) => {
      // });
    } else {
      this.$router.replace({ name: "Login" });
    }
  },
  methods: {
    creationDateComparer(a, b) {
      return new Date(a.creationDate) < new Date(b.creationDate) ? -1 : 1;
    },
    unreadMessagesComparer(a, b) {
      return this.unreadMessagesCount(a._id) < this.unreadMessagesCount(b._id)
        ? -1
        : 1;
    },
    expirationDateComparer(a, b) {
      return new Date(a.expirationDate) < new Date(b.expirationDate) ? -1 : 1;
    },
    orderBy(mode: string) {
      this.orderByMode = mode;
      switch (mode) {
        case "creation_date":
          this.donations = this.donations.sort(this.creationDateComparer);
          break;
        case "unread_messages":
          this.donations = this.donations.sort(this.unreadMessagesComparer);
          break;
        case "expiration_date":
          this.donations = this.donations.sort(this.expirationDateComparer);
          break;
        default:
          null;
      }
    },
    filterBy(mode: string) {
      this.filterByMode = mode;
      switch (mode) {
        case "waiting":
          this.donations = this.donationsBackup.filter(
            (d) => d.status == "waiting"
          );
          break;
        case "selected":
          this.donations = this.donationsBackup.filter(
            (d) => d.status == "selected"
          );
          break;
        case "all":
          this.donations = this.donationsBackup;
          break;
        default:
          null;
      }
    },
    getExpirationDays(donation: Donation) {
      return moment(donation.expirationDate).diff(moment.now(), "days");
    },
    formatDonation(donation: Donation) {
      return moment(donation.creationDate).locale("it").format("LL");
    },
    inspectDonation(donation: Donation) {
      this.$router.replace({
        name: "ManagerDonationsInspect",
        params: { donation: JSON.stringify(donation) },
      });
    },
    hasUnreadMessages(donationId: string): boolean {
      return (
        this.$store.state.socketio.unreadMessagesCounts.length > 0 &&
        this.$store.state.socketio.unreadMessagesCounts.indexOf(
          (e) => e._id == donationId
        ) != -1
      );
    },
    unreadMessagesCount(donationId: string): number {
      if (this.hasUnreadMessages(donationId))
        return this.$store.state.socketio.unreadMessagesCounts.find(
          (e) => e._id == donationId
        ).count;
      return 0;
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/style.scss";

.b-card-footer-button {
  background-color: $color3;

  border: 0px;

  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.my-button-selected {
  background-color: $color1;
  border-color: $color1;
}
</style>
